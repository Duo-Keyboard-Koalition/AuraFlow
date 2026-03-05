package main

import (
	"crypto/rand"
	"crypto/sha256"
	"encoding/hex"
	"encoding/json"
	"fmt"
	"io"
	"log"
	"net/http"
	"os"
	"strconv"
	"strings"
	"sync"
	"time"

	"github.com/golang-jwt/jwt/v5"
	"github.com/gorilla/websocket"
)

type AgentRecord struct {
	AgentID              string                 `json:"agentId"`
	AgentName            string                 `json:"agentName"`
	AgentType            string                 `json:"agentType"`
	PublicKeyPem         string                 `json:"-"`
	PublicKeyFingerprint string                 `json:"publicKeyFingerprint"`
	Metadata             map[string]any         `json:"-"`
	CreatedAt            string                 `json:"createdAt"`
}

type ChallengeRecord struct {
	ChallengeID string
	AgentID     string
	Challenge   string
	ExpiresAt   time.Time
}

type RefreshRecord struct {
	RefreshToken string
	AgentID      string
	ExpiresAt    time.Time
}

type MessageOrigin struct {
	WorkspaceID string `json:"workspaceId"`
	ServerID    string `json:"serverId"`
	ChannelID   string `json:"channelId"`
	ThreadID    string `json:"threadId"`
	MessageID   string `json:"messageId"`
	UserID      string `json:"userId"`
}

type BridgeInboundMessage struct {
	Type   string        `json:"type"`
	Text   string        `json:"text"`
	Origin MessageOrigin `json:"origin"`
}

type wsClient struct {
	conn *websocket.Conn
	mu   sync.Mutex
}

var (
	port                   = envInt("PORT", 8787)
	jwtSecret              = envString("JWT_SECRET", "change-me")
	accessTokenTTLSeconds  = envInt("ACCESS_TOKEN_TTL_SECONDS", 900)
	refreshTokenTTLSeconds = envInt("REFRESH_TOKEN_TTL_SECONDS", 60*60*24*30)
	inboundLog             = "/tmp/auraflow-bridge-inbound.log"

	agentsMu sync.RWMutex
	agents   = map[string]AgentRecord{}

	challengesMu sync.RWMutex
	challenges   = map[string]ChallengeRecord{}

	refreshMu      sync.RWMutex
	refreshTokens  = map[string]RefreshRecord{}
	wsRoutesMu     sync.RWMutex
	wsRouteClients = map[string]map[*wsClient]struct{}{}

	upgrader = websocket.Upgrader{CheckOrigin: func(_ *http.Request) bool { return true }}
)

func envString(key, fallback string) string {
	v := strings.TrimSpace(os.Getenv(key))
	if v == "" {
		return fallback
	}
	return v
}

func envInt(key string, fallback int) int {
	v := strings.TrimSpace(os.Getenv(key))
	if v == "" {
		return fallback
	}
	n, err := strconv.Atoi(v)
	if err != nil {
		return fallback
	}
	return n
}

func randHex(n int) string {
	buf := make([]byte, n)
	if _, err := rand.Read(buf); err != nil {
		panic(err)
	}
	return hex.EncodeToString(buf)
}

func randToken() string {
	return randHex(24)
}

func routeKey(origin MessageOrigin) string {
	thread := origin.ThreadID
	if thread == "" {
		thread = "default"
	}
	return fmt.Sprintf("%s:%s:%s:%s:%s", origin.WorkspaceID, origin.ServerID, origin.ChannelID, thread, origin.UserID)
}

func keyFingerprint(pem string) string {
	sum := sha256.Sum256([]byte(pem))
	return hex.EncodeToString(sum[:])
}

func issueAccessToken(agentID string) (string, error) {
	now := time.Now().UTC()
	claims := jwt.MapClaims{
		"sub": agentID,
		"typ": "agent",
		"iss": "auraflow-bridge",
		"aud": "auraflow",
		"iat": now.Unix(),
		"exp": now.Add(time.Duration(accessTokenTTLSeconds) * time.Second).Unix(),
	}
	token := jwt.NewWithClaims(jwt.SigningMethodHS256, claims)
	return token.SignedString([]byte(jwtSecret))
}

func verifyAccessToken(raw string) error {
	tok, err := jwt.Parse(raw, func(token *jwt.Token) (any, error) {
		if token.Method != jwt.SigningMethodHS256 {
			return nil, fmt.Errorf("unexpected token method")
		}
		return []byte(jwtSecret), nil
	}, jwt.WithIssuer("auraflow-bridge"), jwt.WithAudience("auraflow"))
	if err != nil {
		return err
	}
	if !tok.Valid {
		return fmt.Errorf("invalid token")
	}
	return nil
}

func writeJSON(w http.ResponseWriter, status int, payload any) {
	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(status)
	_ = json.NewEncoder(w).Encode(payload)
}

func writeInboundLog(payload any) {
	line, _ := json.Marshal(payload)
	f, err := os.OpenFile(inboundLog, os.O_APPEND|os.O_CREATE|os.O_WRONLY, 0o644)
	if err != nil {
		log.Printf("inbound log open failed: %v", err)
		return
	}
	defer f.Close()
	_, _ = f.WriteString(fmt.Sprintf("%s %s\n", time.Now().UTC().Format(time.RFC3339), string(line)))
}

func decodeBody(r *http.Request, dst any) error {
	defer r.Body.Close()
	body, err := io.ReadAll(io.LimitReader(r.Body, 1<<20))
	if err != nil {
		return err
	}
	return json.Unmarshal(body, dst)
}

func getHealth(w http.ResponseWriter, _ *http.Request) {
	writeJSON(w, http.StatusOK, map[string]any{"ok": true, "service": "auraflow-bridge", "port": port})
}

func postAgentRegister(w http.ResponseWriter, r *http.Request) {
	var body struct {
		AgentName    string         `json:"agentName"`
		AgentType    string         `json:"agentType"`
		PublicKeyPem string         `json:"publicKeyPem"`
		Metadata     map[string]any `json:"metadata"`
	}
	if err := decodeBody(r, &body); err != nil {
		writeJSON(w, http.StatusBadRequest, map[string]string{"error": "invalid payload"})
		return
	}
	if body.AgentName == "" || body.AgentType == "" || body.PublicKeyPem == "" {
		writeJSON(w, http.StatusBadRequest, map[string]string{"error": "agentName, agentType, and publicKeyPem are required"})
		return
	}

	agentID := randHex(16)
	rec := AgentRecord{
		AgentID:              agentID,
		AgentName:            body.AgentName,
		AgentType:            body.AgentType,
		PublicKeyPem:         body.PublicKeyPem,
		PublicKeyFingerprint: keyFingerprint(body.PublicKeyPem),
		Metadata:             body.Metadata,
		CreatedAt:            time.Now().UTC().Format(time.RFC3339),
	}
	if rec.Metadata == nil {
		rec.Metadata = map[string]any{}
	}

	agentsMu.Lock()
	agents[agentID] = rec
	agentsMu.Unlock()

	writeJSON(w, http.StatusCreated, map[string]any{
		"agentId":              rec.AgentID,
		"agentName":            rec.AgentName,
		"agentType":            rec.AgentType,
		"publicKeyFingerprint": rec.PublicKeyFingerprint,
	})
}

func postLoginChallenge(w http.ResponseWriter, r *http.Request) {
	var body struct {
		AgentID string `json:"agentId"`
	}
	if err := decodeBody(r, &body); err != nil {
		writeJSON(w, http.StatusBadRequest, map[string]string{"error": "invalid payload"})
		return
	}

	agentsMu.RLock()
	_, ok := agents[body.AgentID]
	agentsMu.RUnlock()
	if body.AgentID == "" || !ok {
		writeJSON(w, http.StatusNotFound, map[string]string{"error": "agent not found"})
		return
	}

	cid := randHex(16)
	challenge := randToken()
	expires := time.Now().UTC().Add(60 * time.Second)

	challengesMu.Lock()
	challenges[cid] = ChallengeRecord{ChallengeID: cid, AgentID: body.AgentID, Challenge: challenge, ExpiresAt: expires}
	challengesMu.Unlock()

	writeJSON(w, http.StatusOK, map[string]any{
		"challengeId": cid,
		"challenge":   challenge,
		"expiresAt":   expires.Format(time.RFC3339),
	})
}

func postLoginVerify(w http.ResponseWriter, r *http.Request) {
	var body struct {
		AgentID     string `json:"agentId"`
		ChallengeID string `json:"challengeId"`
		Signature   string `json:"signature"`
	}
	if err := decodeBody(r, &body); err != nil {
		writeJSON(w, http.StatusBadRequest, map[string]string{"error": "invalid payload"})
		return
	}

	agentsMu.RLock()
	agent, agentOK := agents[body.AgentID]
	agentsMu.RUnlock()
	challengesMu.RLock()
	challenge, challOK := challenges[body.ChallengeID]
	challengesMu.RUnlock()

	if !agentOK || !challOK || challenge.AgentID != body.AgentID {
		writeJSON(w, http.StatusBadRequest, map[string]string{"error": "invalid login state"})
		return
	}
	if challenge.ExpiresAt.Before(time.Now().UTC()) {
		challengesMu.Lock()
		delete(challenges, body.ChallengeID)
		challengesMu.Unlock()
		writeJSON(w, http.StatusBadRequest, map[string]string{"error": "challenge expired"})
		return
	}
	if strings.TrimSpace(body.Signature) == "" {
		writeJSON(w, http.StatusUnauthorized, map[string]string{"error": "invalid signature"})
		return
	}

	challengesMu.Lock()
	delete(challenges, body.ChallengeID)
	challengesMu.Unlock()

	accessToken, err := issueAccessToken(body.AgentID)
	if err != nil {
		writeJSON(w, http.StatusInternalServerError, map[string]string{"error": "token issue failed"})
		return
	}
	refresh := randToken()
	refreshMu.Lock()
	refreshTokens[refresh] = RefreshRecord{RefreshToken: refresh, AgentID: body.AgentID, ExpiresAt: time.Now().UTC().Add(time.Duration(refreshTokenTTLSeconds) * time.Second)}
	refreshMu.Unlock()

	writeJSON(w, http.StatusOK, map[string]any{
		"accessToken":      accessToken,
		"refreshToken":     refresh,
		"expiresInSeconds": accessTokenTTLSeconds,
		"agent": map[string]any{
			"agentId":              agent.AgentID,
			"agentName":            agent.AgentName,
			"agentType":            agent.AgentType,
			"publicKeyFingerprint": agent.PublicKeyFingerprint,
		},
	})
}

func postTokenRefresh(w http.ResponseWriter, r *http.Request) {
	var body struct {
		RefreshToken string `json:"refreshToken"`
	}
	if err := decodeBody(r, &body); err != nil {
		writeJSON(w, http.StatusBadRequest, map[string]string{"error": "invalid payload"})
		return
	}

	refreshMu.Lock()
	rec, ok := refreshTokens[body.RefreshToken]
	if !ok || rec.ExpiresAt.Before(time.Now().UTC()) {
		if ok {
			delete(refreshTokens, body.RefreshToken)
		}
		refreshMu.Unlock()
		writeJSON(w, http.StatusUnauthorized, map[string]string{"error": "invalid refresh token"})
		return
	}
	delete(refreshTokens, body.RefreshToken)
	next := randToken()
	refreshTokens[next] = RefreshRecord{RefreshToken: next, AgentID: rec.AgentID, ExpiresAt: time.Now().UTC().Add(time.Duration(refreshTokenTTLSeconds) * time.Second)}
	refreshMu.Unlock()

	accessToken, err := issueAccessToken(rec.AgentID)
	if err != nil {
		writeJSON(w, http.StatusInternalServerError, map[string]string{"error": "token issue failed"})
		return
	}

	writeJSON(w, http.StatusOK, map[string]any{
		"accessToken":      accessToken,
		"refreshToken":     next,
		"expiresInSeconds": accessTokenTTLSeconds,
	})
}

func getAgents(w http.ResponseWriter, _ *http.Request) {
	agentsMu.RLock()
	items := make([]map[string]any, 0, len(agents))
	for _, a := range agents {
		items = append(items, map[string]any{
			"agentId":              a.AgentID,
			"agentName":            a.AgentName,
			"agentType":            a.AgentType,
			"publicKeyFingerprint": a.PublicKeyFingerprint,
			"createdAt":            a.CreatedAt,
		})
	}
	agentsMu.RUnlock()
	writeJSON(w, http.StatusOK, items)
}

func postInboundMessages(w http.ResponseWriter, r *http.Request) {
	var payload BridgeInboundMessage
	if err := decodeBody(r, &payload); err != nil {
		writeJSON(w, http.StatusBadRequest, map[string]string{"error": "invalid payload"})
		return
	}
	if payload.Type != "user.message" || payload.Text == "" || payload.Origin.WorkspaceID == "" {
		writeJSON(w, http.StatusBadRequest, map[string]string{"error": "invalid payload"})
		return
	}

	writeInboundLog(payload)
	key := routeKey(payload.Origin)
	broadcastRoute(key, map[string]any{"type": "inbound.relay", "routeKey": key, "payload": payload})
	writeJSON(w, http.StatusAccepted, map[string]any{"accepted": true, "routeKey": key})
}

func postOutboundMessages(w http.ResponseWriter, r *http.Request) {
	var payload map[string]any
	if err := decodeBody(r, &payload); err != nil {
		writeJSON(w, http.StatusBadRequest, map[string]string{"error": "invalid payload"})
		return
	}
	originMap, ok := payload["origin"].(map[string]any)
	if !ok {
		writeJSON(w, http.StatusBadRequest, map[string]string{"error": "invalid payload"})
		return
	}
	text, ok := payload["text"].(string)
	if !ok || strings.TrimSpace(text) == "" {
		writeJSON(w, http.StatusBadRequest, map[string]string{"error": "invalid payload"})
		return
	}
	origin := MessageOrigin{
		WorkspaceID: toString(originMap["workspaceId"]),
		ServerID:    toString(originMap["serverId"]),
		ChannelID:   toString(originMap["channelId"]),
		ThreadID:    toString(originMap["threadId"]),
		UserID:      toString(originMap["userId"]),
	}
	key := routeKey(origin)
	broadcastRoute(key, map[string]any{"type": "agent.message", "routeKey": key, "payload": payload})
	writeJSON(w, http.StatusAccepted, map[string]any{"accepted": true, "routeKey": key})
}

func toString(v any) string {
	s, _ := v.(string)
	return s
}

func broadcastRoute(key string, envelope map[string]any) {
	payload, _ := json.Marshal(envelope)

	wsRoutesMu.RLock()
	clients := wsRouteClients[key]
	list := make([]*wsClient, 0, len(clients))
	for c := range clients {
		list = append(list, c)
	}
	wsRoutesMu.RUnlock()

	for _, c := range list {
		c.mu.Lock()
		err := c.conn.WriteMessage(websocket.TextMessage, payload)
		c.mu.Unlock()
		if err != nil {
			removeClientFromAllRoutes(c)
			_ = c.conn.Close()
		}
	}
}

func removeClientFromAllRoutes(c *wsClient) {
	wsRoutesMu.Lock()
	defer wsRoutesMu.Unlock()
	for k, set := range wsRouteClients {
		delete(set, c)
		if len(set) == 0 {
			delete(wsRouteClients, k)
		}
	}
}

func wsHandler(w http.ResponseWriter, r *http.Request) {
	conn, err := upgrader.Upgrade(w, r, nil)
	if err != nil {
		return
	}
	client := &wsClient{conn: conn}

	defer func() {
		removeClientFromAllRoutes(client)
		_ = conn.Close()
	}()

	for {
		_, msg, err := conn.ReadMessage()
		if err != nil {
			return
		}
		var payload map[string]any
		if err := json.Unmarshal(msg, &payload); err != nil {
			sendWS(client, map[string]any{"type": "error", "error": err.Error()})
			continue
		}
		typeVal := toString(payload["type"])
		switch typeVal {
		case "auth":
			token := toString(payload["accessToken"])
			if err := verifyAccessToken(token); err != nil {
				sendWS(client, map[string]any{"type": "error", "error": err.Error()})
				continue
			}
			sendWS(client, map[string]any{"type": "auth.ok"})
		case "subscribe":
			key := toString(payload["routeKey"])
			if key == "" {
				continue
			}
			wsRoutesMu.Lock()
			if _, ok := wsRouteClients[key]; !ok {
				wsRouteClients[key] = map[*wsClient]struct{}{}
			}
			wsRouteClients[key][client] = struct{}{}
			wsRoutesMu.Unlock()
			sendWS(client, map[string]any{"type": "subscribed", "routeKey": key})
		case "ping":
			sendWS(client, map[string]any{"type": "pong"})
		}
	}
}

func sendWS(client *wsClient, payload map[string]any) {
	data, _ := json.Marshal(payload)
	client.mu.Lock()
	_ = client.conn.WriteMessage(websocket.TextMessage, data)
	client.mu.Unlock()
}

func main() {
	http.HandleFunc("/health", func(w http.ResponseWriter, r *http.Request) {
		if r.Method != http.MethodGet {
			writeJSON(w, http.StatusMethodNotAllowed, map[string]string{"error": "method not allowed"})
			return
		}
		getHealth(w, r)
	})
	http.HandleFunc("/v1/agents/register", method(http.MethodPost, postAgentRegister))
	http.HandleFunc("/v1/agents/login/challenge", method(http.MethodPost, postLoginChallenge))
	http.HandleFunc("/v1/agents/login/verify", method(http.MethodPost, postLoginVerify))
	http.HandleFunc("/v1/agents/token/refresh", method(http.MethodPost, postTokenRefresh))
	http.HandleFunc("/v1/agents", method(http.MethodGet, getAgents))
	http.HandleFunc("/v1/inbound/messages", method(http.MethodPost, postInboundMessages))
	http.HandleFunc("/v1/outbound/messages", method(http.MethodPost, postOutboundMessages))
	http.HandleFunc("/v1/ws", wsHandler)

	addr := fmt.Sprintf("127.0.0.1:%d", port)
	log.Printf("[auraflow-bridge-go] listening on http://%s", addr)
	log.Printf("[auraflow-bridge-go] websocket on ws://%s/v1/ws", addr)
	log.Printf("[auraflow-bridge-go] inbound log path: %s", inboundLog)
	if err := http.ListenAndServe(addr, nil); err != nil {
		log.Fatal(err)
	}
}

func method(expected string, handler func(http.ResponseWriter, *http.Request)) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		if r.Method != expected {
			writeJSON(w, http.StatusMethodNotAllowed, map[string]string{"error": "method not allowed"})
			return
		}
		handler(w, r)
	}
}

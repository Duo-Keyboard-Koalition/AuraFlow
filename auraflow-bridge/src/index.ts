import express from "express"
import { createServer } from "node:http"
import { appendFileSync } from "node:fs"
import { createHash, randomBytes } from "node:crypto"
import { SignJWT, jwtVerify } from "jose"
import { v4 as uuidv4 } from "uuid"
import { WebSocketServer, WebSocket } from "ws"
import type { AgentRegisterRequest, BridgeInboundMessage, MessageOrigin } from "./types.js"

const PORT = Number(process.env.PORT || 8787)
const JWT_SECRET = process.env.JWT_SECRET || "change-me"
const ACCESS_TOKEN_TTL_SECONDS = Number(process.env.ACCESS_TOKEN_TTL_SECONDS || 900)
const REFRESH_TOKEN_TTL_SECONDS = Number(process.env.REFRESH_TOKEN_TTL_SECONDS || 60 * 60 * 24 * 30)
const INBOUND_LOG = "/tmp/auraflow-bridge-inbound.log"

interface AgentRecord {
  agentId: string
  agentName: string
  agentType: string
  publicKeyPem: string
  publicKeyFingerprint: string
  metadata: Record<string, unknown>
  createdAt: string
}

interface ChallengeRecord {
  challengeId: string
  agentId: string
  challenge: string
  expiresAt: number
}

interface RefreshRecord {
  refreshToken: string
  agentId: string
  expiresAt: number
}

const agents = new Map<string, AgentRecord>()
const challenges = new Map<string, ChallengeRecord>()
const refreshTokens = new Map<string, RefreshRecord>()

const wsRouteClients = new Map<string, Set<WebSocket>>()

const app = express()
app.use(express.json({ limit: "1mb" }))

function routeKey(origin: MessageOrigin): string {
  return `${origin.workspaceId}:${origin.serverId}:${origin.channelId}:${origin.threadId || "default"}:${origin.userId}`
}

function ensureRouteSet(key: string): Set<WebSocket> {
  const existing = wsRouteClients.get(key)
  if (existing) return existing
  const created = new Set<WebSocket>()
  wsRouteClients.set(key, created)
  return created
}

function keyFingerprint(pem: string): string {
  return createHash("sha256").update(pem).digest("hex")
}

function newRefreshToken(): string {
  return randomBytes(32).toString("base64url")
}

async function issueAccessToken(agentId: string): Promise<string> {
  const secret = new TextEncoder().encode(JWT_SECRET)
  const now = Math.floor(Date.now() / 1000)
  return await new SignJWT({ sub: agentId, typ: "agent" })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt(now)
    .setExpirationTime(now + ACCESS_TOKEN_TTL_SECONDS)
    .setIssuer("auraflow-bridge")
    .setAudience("auraflow")
    .sign(secret)
}

function writeInboundLog(payload: unknown): void {
  const line = `${new Date().toISOString()} ${JSON.stringify(payload)}\n`
  appendFileSync(INBOUND_LOG, line, { encoding: "utf8" })
}

app.get("/health", (_req, res) => {
  res.json({ ok: true, service: "auraflow-bridge", port: PORT })
})

app.post("/v1/agents/register", (req, res) => {
  const body = req.body as AgentRegisterRequest
  if (!body?.agentName || !body?.agentType || !body?.publicKeyPem) {
    return res.status(400).json({ error: "agentName, agentType, and publicKeyPem are required" })
  }

  const agentId = uuidv4()
  const agent: AgentRecord = {
    agentId,
    agentName: body.agentName,
    agentType: body.agentType,
    publicKeyPem: body.publicKeyPem,
    publicKeyFingerprint: keyFingerprint(body.publicKeyPem),
    metadata: body.metadata || {},
    createdAt: new Date().toISOString(),
  }
  agents.set(agentId, agent)

  return res.status(201).json({
    agentId,
    agentName: agent.agentName,
    agentType: agent.agentType,
    publicKeyFingerprint: agent.publicKeyFingerprint,
  })
})

app.post("/v1/agents/login/challenge", (req, res) => {
  const agentId = String(req.body?.agentId || "")
  if (!agentId || !agents.has(agentId)) {
    return res.status(404).json({ error: "agent not found" })
  }

  const challengeId = uuidv4()
  const challenge = randomBytes(32).toString("base64url")
  const expiresAt = Date.now() + 60_000

  challenges.set(challengeId, { challengeId, agentId, challenge, expiresAt })
  return res.json({ challengeId, challenge, expiresAt: new Date(expiresAt).toISOString() })
})

app.post("/v1/agents/login/verify", async (req, res) => {
  const agentId = String(req.body?.agentId || "")
  const challengeId = String(req.body?.challengeId || "")
  const signature = String(req.body?.signature || "")

  const agent = agents.get(agentId)
  const challenge = challenges.get(challengeId)
  if (!agent || !challenge || challenge.agentId !== agentId) {
    return res.status(400).json({ error: "invalid login state" })
  }
  if (challenge.expiresAt < Date.now()) {
    challenges.delete(challengeId)
    return res.status(400).json({ error: "challenge expired" })
  }

  // Placeholder signature check: require a non-empty signature string.
  // Replace with real asymmetric verify against publicKeyPem in production.
  if (!signature) {
    return res.status(401).json({ error: "invalid signature" })
  }

  challenges.delete(challengeId)

  const accessToken = await issueAccessToken(agentId)
  const refreshToken = newRefreshToken()
  const refreshExpiresAt = Date.now() + REFRESH_TOKEN_TTL_SECONDS * 1000
  refreshTokens.set(refreshToken, { refreshToken, agentId, expiresAt: refreshExpiresAt })

  return res.json({
    accessToken,
    refreshToken,
    expiresInSeconds: ACCESS_TOKEN_TTL_SECONDS,
    agent: {
      agentId: agent.agentId,
      agentName: agent.agentName,
      agentType: agent.agentType,
      publicKeyFingerprint: agent.publicKeyFingerprint,
    },
  })
})

app.post("/v1/agents/token/refresh", async (req, res) => {
  const provided = String(req.body?.refreshToken || "")
  const record = refreshTokens.get(provided)
  if (!record || record.expiresAt < Date.now()) {
    if (record) refreshTokens.delete(provided)
    return res.status(401).json({ error: "invalid refresh token" })
  }

  refreshTokens.delete(provided)
  const nextRefresh = newRefreshToken()
  refreshTokens.set(nextRefresh, {
    refreshToken: nextRefresh,
    agentId: record.agentId,
    expiresAt: Date.now() + REFRESH_TOKEN_TTL_SECONDS * 1000,
  })

  const accessToken = await issueAccessToken(record.agentId)
  return res.json({ accessToken, refreshToken: nextRefresh, expiresInSeconds: ACCESS_TOKEN_TTL_SECONDS })
})

app.get("/v1/agents", (_req, res) => {
  const items = [...agents.values()].map((a) => ({
    agentId: a.agentId,
    agentName: a.agentName,
    agentType: a.agentType,
    publicKeyFingerprint: a.publicKeyFingerprint,
    createdAt: a.createdAt,
  }))
  res.json(items)
})

app.post("/v1/inbound/messages", (req, res) => {
  const payload = req.body as BridgeInboundMessage
  if (payload?.type !== "user.message" || !payload?.origin || !payload?.text) {
    return res.status(400).json({ error: "invalid payload" })
  }

  writeInboundLog(payload)

  const key = routeKey(payload.origin)
  const subscribers = wsRouteClients.get(key)
  if (subscribers) {
    const envelope = JSON.stringify({ type: "inbound.relay", routeKey: key, payload })
    for (const client of subscribers) {
      if (client.readyState === WebSocket.OPEN) {
        client.send(envelope)
      }
    }
  }

  res.status(202).json({ accepted: true, routeKey: key })
})

app.post("/v1/outbound/messages", (req, res) => {
  const payload = req.body
  if (!payload?.origin || !payload?.text) {
    return res.status(400).json({ error: "invalid payload" })
  }

  const key = routeKey(payload.origin as MessageOrigin)
  const subscribers = wsRouteClients.get(key)
  if (subscribers) {
    const envelope = JSON.stringify({ type: "agent.message", routeKey: key, payload })
    for (const client of subscribers) {
      if (client.readyState === WebSocket.OPEN) {
        client.send(envelope)
      }
    }
  }

  res.status(202).json({ accepted: true, routeKey: key })
})

const server = createServer(app)
const wss = new WebSocketServer({ server, path: "/v1/ws" })

wss.on("connection", (ws) => {
  const subscribedKeys = new Set<string>()

  ws.on("message", async (raw) => {
    try {
      const msg = JSON.parse(raw.toString())

      if (msg.type === "auth" && msg.accessToken) {
        const secret = new TextEncoder().encode(JWT_SECRET)
        await jwtVerify(String(msg.accessToken), secret, {
          issuer: "auraflow-bridge",
          audience: "auraflow",
        })
        ws.send(JSON.stringify({ type: "auth.ok" }))
        return
      }

      if (msg.type === "subscribe" && msg.routeKey) {
        const key = String(msg.routeKey)
        ensureRouteSet(key).add(ws)
        subscribedKeys.add(key)
        ws.send(JSON.stringify({ type: "subscribed", routeKey: key }))
        return
      }

      if (msg.type === "ping") {
        ws.send(JSON.stringify({ type: "pong" }))
        return
      }
    } catch (err) {
      ws.send(JSON.stringify({ type: "error", error: String(err) }))
    }
  })

  ws.on("close", () => {
    for (const key of subscribedKeys) {
      const set = wsRouteClients.get(key)
      if (!set) continue
      set.delete(ws)
      if (set.size === 0) wsRouteClients.delete(key)
    }
  })
})

server.listen(PORT, "127.0.0.1", () => {
  console.log(`[auraflow-bridge] listening on http://127.0.0.1:${PORT}`)
  console.log(`[auraflow-bridge] websocket on ws://127.0.0.1:${PORT}/v1/ws`)
  console.log(`[auraflow-bridge] inbound log path: ${INBOUND_LOG}`)
})

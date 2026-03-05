import asyncio
import hashlib
import json
import os
import secrets
from dataclasses import dataclass
from datetime import datetime, timedelta, timezone
from typing import Any
from uuid import uuid4

import jwt
from fastapi import FastAPI, WebSocket, WebSocketDisconnect
from fastapi.responses import JSONResponse

PORT = int(os.getenv("PORT", "8787"))
JWT_SECRET = os.getenv("JWT_SECRET", "change-me")
ACCESS_TOKEN_TTL_SECONDS = int(os.getenv("ACCESS_TOKEN_TTL_SECONDS", "900"))
REFRESH_TOKEN_TTL_SECONDS = int(os.getenv("REFRESH_TOKEN_TTL_SECONDS", str(60 * 60 * 24 * 30)))
INBOUND_LOG = "/tmp/auraflow-bridge-inbound.log"


@dataclass
class AgentRecord:
    agent_id: str
    agent_name: str
    agent_type: str
    public_key_pem: str
    public_key_fingerprint: str
    metadata: dict[str, Any]
    created_at: str


@dataclass
class ChallengeRecord:
    challenge_id: str
    agent_id: str
    challenge: str
    expires_at: datetime


@dataclass
class RefreshRecord:
    refresh_token: str
    agent_id: str
    expires_at: datetime


agents: dict[str, AgentRecord] = {}
challenges: dict[str, ChallengeRecord] = {}
refresh_tokens: dict[str, RefreshRecord] = {}
ws_route_clients: dict[str, set[WebSocket]] = {}
ws_lock = asyncio.Lock()

app = FastAPI(title="auraflow-bridge-python", version="0.1.0")


def now_utc() -> datetime:
    return datetime.now(timezone.utc)


def key_fingerprint(pem: str) -> str:
    return hashlib.sha256(pem.encode("utf-8")).hexdigest()


def new_refresh_token() -> str:
    return secrets.token_urlsafe(32)


def route_key(origin: dict[str, Any]) -> str:
    return ":".join(
        [
            str(origin.get("workspaceId", "")),
            str(origin.get("serverId", "")),
            str(origin.get("channelId", "")),
            str(origin.get("threadId") or "default"),
            str(origin.get("userId", "")),
        ]
    )


def issue_access_token(agent_id: str) -> str:
    issued_at = now_utc()
    expires_at = issued_at + timedelta(seconds=ACCESS_TOKEN_TTL_SECONDS)
    payload = {
        "sub": agent_id,
        "typ": "agent",
        "iss": "auraflow-bridge",
        "aud": "auraflow",
        "iat": int(issued_at.timestamp()),
        "exp": int(expires_at.timestamp()),
    }
    return jwt.encode(payload, JWT_SECRET, algorithm="HS256")


def verify_access_token(token: str) -> dict[str, Any]:
    return jwt.decode(
        token,
        JWT_SECRET,
        algorithms=["HS256"],
        audience="auraflow",
        issuer="auraflow-bridge",
    )


def write_inbound_log(payload: Any) -> None:
    with open(INBOUND_LOG, "a", encoding="utf-8") as f:
        f.write(f"{now_utc().isoformat()} {json.dumps(payload, separators=(',', ':'))}\n")


async def broadcast_to_route(key: str, envelope: dict[str, Any]) -> None:
    message = json.dumps(envelope, separators=(",", ":"))
    async with ws_lock:
        clients = list(ws_route_clients.get(key, set()))

    stale: list[WebSocket] = []
    for client in clients:
        try:
            await client.send_text(message)
        except Exception:
            stale.append(client)

    if stale:
        async with ws_lock:
            active = ws_route_clients.get(key)
            if active:
                for client in stale:
                    active.discard(client)
                if not active:
                    ws_route_clients.pop(key, None)


@app.get("/health")
async def health() -> dict[str, Any]:
    return {"ok": True, "service": "auraflow-bridge", "port": PORT}


@app.post("/v1/agents/register")
async def register_agent(payload: dict[str, Any]) -> JSONResponse:
    agent_name = payload.get("agentName")
    agent_type = payload.get("agentType")
    public_key_pem = payload.get("publicKeyPem")

    if not agent_name or not agent_type or not public_key_pem:
        return JSONResponse(
            status_code=400,
            content={"error": "agentName, agentType, and publicKeyPem are required"},
        )

    agent_id = str(uuid4())
    record = AgentRecord(
        agent_id=agent_id,
        agent_name=str(agent_name),
        agent_type=str(agent_type),
        public_key_pem=str(public_key_pem),
        public_key_fingerprint=key_fingerprint(str(public_key_pem)),
        metadata=payload.get("metadata") if isinstance(payload.get("metadata"), dict) else {},
        created_at=now_utc().isoformat(),
    )
    agents[agent_id] = record

    return JSONResponse(
        status_code=201,
        content={
            "agentId": record.agent_id,
            "agentName": record.agent_name,
            "agentType": record.agent_type,
            "publicKeyFingerprint": record.public_key_fingerprint,
        },
    )


@app.post("/v1/agents/login/challenge")
async def agent_login_challenge(payload: dict[str, Any]) -> JSONResponse:
    agent_id = str(payload.get("agentId") or "")
    if not agent_id or agent_id not in agents:
        return JSONResponse(status_code=404, content={"error": "agent not found"})

    challenge_id = str(uuid4())
    challenge = secrets.token_urlsafe(32)
    expires_at = now_utc() + timedelta(seconds=60)

    challenges[challenge_id] = ChallengeRecord(
        challenge_id=challenge_id,
        agent_id=agent_id,
        challenge=challenge,
        expires_at=expires_at,
    )

    return JSONResponse(
        content={
            "challengeId": challenge_id,
            "challenge": challenge,
            "expiresAt": expires_at.isoformat(),
        }
    )


@app.post("/v1/agents/login/verify")
async def agent_login_verify(payload: dict[str, Any]) -> JSONResponse:
    agent_id = str(payload.get("agentId") or "")
    challenge_id = str(payload.get("challengeId") or "")
    signature = str(payload.get("signature") or "")

    agent = agents.get(agent_id)
    challenge = challenges.get(challenge_id)

    if not agent or not challenge or challenge.agent_id != agent_id:
        return JSONResponse(status_code=400, content={"error": "invalid login state"})

    if challenge.expires_at < now_utc():
        challenges.pop(challenge_id, None)
        return JSONResponse(status_code=400, content={"error": "challenge expired"})

    # Placeholder signature check to match current TypeScript behavior.
    if not signature:
        return JSONResponse(status_code=401, content={"error": "invalid signature"})

    challenges.pop(challenge_id, None)

    access_token = issue_access_token(agent_id)
    refresh_token = new_refresh_token()
    refresh_expires_at = now_utc() + timedelta(seconds=REFRESH_TOKEN_TTL_SECONDS)

    refresh_tokens[refresh_token] = RefreshRecord(
        refresh_token=refresh_token,
        agent_id=agent_id,
        expires_at=refresh_expires_at,
    )

    return JSONResponse(
        content={
            "accessToken": access_token,
            "refreshToken": refresh_token,
            "expiresInSeconds": ACCESS_TOKEN_TTL_SECONDS,
            "agent": {
                "agentId": agent.agent_id,
                "agentName": agent.agent_name,
                "agentType": agent.agent_type,
                "publicKeyFingerprint": agent.public_key_fingerprint,
            },
        }
    )


@app.post("/v1/agents/token/refresh")
async def agent_refresh_token(payload: dict[str, Any]) -> JSONResponse:
    provided = str(payload.get("refreshToken") or "")
    record = refresh_tokens.get(provided)

    if not record or record.expires_at < now_utc():
        if record:
            refresh_tokens.pop(provided, None)
        return JSONResponse(status_code=401, content={"error": "invalid refresh token"})

    refresh_tokens.pop(provided, None)

    next_refresh = new_refresh_token()
    refresh_tokens[next_refresh] = RefreshRecord(
        refresh_token=next_refresh,
        agent_id=record.agent_id,
        expires_at=now_utc() + timedelta(seconds=REFRESH_TOKEN_TTL_SECONDS),
    )

    access_token = issue_access_token(record.agent_id)
    return JSONResponse(
        content={
            "accessToken": access_token,
            "refreshToken": next_refresh,
            "expiresInSeconds": ACCESS_TOKEN_TTL_SECONDS,
        }
    )


@app.get("/v1/agents")
async def list_agents() -> list[dict[str, Any]]:
    return [
        {
            "agentId": agent.agent_id,
            "agentName": agent.agent_name,
            "agentType": agent.agent_type,
            "publicKeyFingerprint": agent.public_key_fingerprint,
            "createdAt": agent.created_at,
        }
        for agent in agents.values()
    ]


@app.post("/v1/inbound/messages")
async def inbound_messages(payload: dict[str, Any]) -> JSONResponse:
    if payload.get("type") != "user.message" or not payload.get("origin") or not payload.get("text"):
        return JSONResponse(status_code=400, content={"error": "invalid payload"})

    write_inbound_log(payload)

    key = route_key(payload["origin"])
    await broadcast_to_route(
        key,
        {
            "type": "inbound.relay",
            "routeKey": key,
            "payload": payload,
        },
    )

    return JSONResponse(status_code=202, content={"accepted": True, "routeKey": key})


@app.post("/v1/outbound/messages")
async def outbound_messages(payload: dict[str, Any]) -> JSONResponse:
    if not payload.get("origin") or not payload.get("text"):
        return JSONResponse(status_code=400, content={"error": "invalid payload"})

    key = route_key(payload["origin"])
    await broadcast_to_route(
        key,
        {
            "type": "agent.message",
            "routeKey": key,
            "payload": payload,
        },
    )

    return JSONResponse(status_code=202, content={"accepted": True, "routeKey": key})


@app.websocket("/v1/ws")
async def websocket_endpoint(websocket: WebSocket) -> None:
    await websocket.accept()
    subscribed_keys: set[str] = set()

    try:
        while True:
            raw = await websocket.receive_text()
            try:
                msg = json.loads(raw)
            except json.JSONDecodeError as err:
                await websocket.send_text(json.dumps({"type": "error", "error": str(err)}))
                continue

            msg_type = msg.get("type")

            if msg_type == "auth" and msg.get("accessToken"):
                try:
                    verify_access_token(str(msg["accessToken"]))
                    await websocket.send_text(json.dumps({"type": "auth.ok"}))
                except Exception as err:
                    await websocket.send_text(json.dumps({"type": "error", "error": str(err)}))
                continue

            if msg_type == "subscribe" and msg.get("routeKey"):
                key = str(msg["routeKey"])
                async with ws_lock:
                    ws_route_clients.setdefault(key, set()).add(websocket)
                subscribed_keys.add(key)
                await websocket.send_text(json.dumps({"type": "subscribed", "routeKey": key}))
                continue

            if msg_type == "ping":
                await websocket.send_text(json.dumps({"type": "pong"}))
                continue

    except WebSocketDisconnect:
        pass
    finally:
        async with ws_lock:
            for key in subscribed_keys:
                clients = ws_route_clients.get(key)
                if not clients:
                    continue
                clients.discard(websocket)
                if not clients:
                    ws_route_clients.pop(key, None)


if __name__ == "__main__":
    import uvicorn

    print(f"[auraflow-bridge-python] listening on http://127.0.0.1:{PORT}")
    print(f"[auraflow-bridge-python] websocket on ws://127.0.0.1:{PORT}/v1/ws")
    print(f"[auraflow-bridge-python] inbound log path: {INBOUND_LOG}")
    uvicorn.run("app:app", host="127.0.0.1", port=PORT)

# AuraFlow Bridge (Python)

Python implementation of the AuraFlow bridge service.

This service mirrors the TypeScript bridge API so AuraFlow and agent runtimes can use either implementation.

## Features

- Agent registration with public key fingerprint metadata
- Challenge/verify login endpoints (signature verification placeholder)
- JWT session + rotating refresh token flow
- Webhook ingress (`POST /v1/inbound/messages`)
- Outbound relay (`POST /v1/outbound/messages`)
- WebSocket relay (`WS /v1/ws`) with route subscriptions
- Inbound payload logging to `/tmp/auraflow-bridge-inbound.log`

## Run

```bash
cd /workspaces/AuraFlow/bridge/python
python -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt
uvicorn app:app --host 127.0.0.1 --port 8787
```

## Environment Variables

- `PORT` (default: `8787`)
- `JWT_SECRET` (default: `change-me`)
- `ACCESS_TOKEN_TTL_SECONDS` (default: `900`)
- `REFRESH_TOKEN_TTL_SECONDS` (default: `2592000`)

## Quick Test

```bash
curl -X POST http://127.0.0.1:8787/v1/inbound/messages \
  -H "content-type: application/json" \
  -d '{
    "type": "user.message",
    "text": "hello from auraflow",
    "origin": {
      "workspaceId": "w1",
      "serverId": "s1",
      "channelId": "c1",
      "threadId": "t1",
      "messageId": "m1",
      "userId": "u1"
    },
    "target": { "agentType": "scorpion", "agentId": "agent-1" }
  }'

cat /tmp/auraflow-bridge-inbound.log
```

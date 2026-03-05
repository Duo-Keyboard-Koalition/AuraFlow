# AuraFlow Bridge

Standalone bridge service for AuraFlow. This service is agent-agnostic and can relay messages between AuraFlow and external agent runtimes.

## Features in this setup
- Agent registration with public key metadata
- Challenge/verify login endpoints (signature verification placeholder)
- JWT session + refresh token flow
- Webhook ingress (`POST /v1/inbound/messages`)
- WebSocket relay (`WS /v1/ws`) with route subscriptions
- Inbound payload logging to `/tmp/auraflow-bridge-inbound.log`

## Run

```bash
cd /home/codespace/auraflow-bridge
npm install
npm run dev
```

Server starts on `http://127.0.0.1:8787` by default.

## Quick test

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

# AuraFlow <-> scorpion Bridge

This project now supports a native AuraFlow channel in scorpion.

## 1) Enable AuraFlow channel in scorpion config

Edit `~/.scorpion/config.json` and add:

```json
{
  "channels": {
    "auraflow": {
      "enabled": true,
      "host": "127.0.0.1",
      "port": 8765,
      "token": "",
      "allowFrom": []
    }
  }
}
```

Notes:
- `token` is optional. If set, AuraFlow must send `auth` first.
- `allowFrom` can restrict user IDs.

## 2) Start scorpion gateway

Run from `agents/scorpion-python` environment:

```bash
scorpion gateway
```

When enabled, scorpion listens on:
- `ws://127.0.0.1:8765`

## 3) Start AuraFlow

Set frontend bridge variables (see `.env.example`):

```bash
NEXT_PUBLIC_SCORPION_WS_URL=ws://127.0.0.1:8765
NEXT_PUBLIC_SCORPION_BRIDGE_TOKEN=
```

Then run AuraFlow:

```bash
npm run dev
```

## 4) Test round-trip

1. Open AuraFlow dashboard.
2. Send a message in `#scorpion` or `#general`.
3. scorpion receives inbound message through the `auraflow` channel.
4. scorpion response is sent back to AuraFlow in real time.

## Message protocol

AuraFlow -> scorpion:

```json
{
  "type": "message",
  "senderId": "user-123",
  "chatId": "auraflow:scorpion:user-123",
  "serverId": "auraflow",
  "channelId": "scorpion",
  "content": "hello",
  "requestId": "req-1"
}
```

scorpion -> AuraFlow:

```json
{
  "type": "reply",
  "channel": "auraflow",
  "chatId": "auraflow:scorpion:user-123",
  "content": "..."
}
```

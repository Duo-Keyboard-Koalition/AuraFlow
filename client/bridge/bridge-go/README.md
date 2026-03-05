# AuraFlow Bridge (Go)

Go implementation of the AuraFlow bridge service.

This version mirrors the TypeScript and Python bridge contracts, including HTTP APIs and WebSocket relay.

## Why this variant

- Runs from source with local module downloads only
- No `sudo` required
- Good option when Node.js is not preferred

## Run from source

```bash
cd /workspaces/AuraFlow/bridge/bridge-go
go mod download
go run .
```

By default it listens on `127.0.0.1:8787`.

## Environment variables

- `PORT` (default: `8787`)
- `JWT_SECRET` (default: `change-me`)
- `ACCESS_TOKEN_TTL_SECONDS` (default: `900`)
- `REFRESH_TOKEN_TTL_SECONDS` (default: `2592000`)

## Implemented routes

- `GET /health`
- `POST /v1/agents/register`
- `POST /v1/agents/login/challenge`
- `POST /v1/agents/login/verify`
- `POST /v1/agents/token/refresh`
- `GET /v1/agents`
- `POST /v1/inbound/messages`
- `POST /v1/outbound/messages`
- `WS /v1/ws`

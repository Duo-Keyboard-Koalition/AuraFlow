# AuraFlow Bridge (C++)

C++ source-build implementation of AuraFlow bridge endpoints.

This variant is intentionally dependency-free so it can compile and run without `sudo` or system package installs.

## Scope

- Implements core HTTP bridge endpoints
- In-memory agent/session state
- Inbound payload logging
- No WebSocket upgrade support in this minimal build (`/v1/ws` returns 501)

Use Go/TypeScript/Python bridge variants when WebSocket relay is required.

## Build and run from source

```bash
cd /workspaces/AuraFlow/bridge/bridge-cpp
make
./auraflow_bridge_cpp
```

## Environment variables

- `PORT` (default: `8787`)
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
- `GET /v1/ws` (returns 501)

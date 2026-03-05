# AuraFlow Bridge Plan (Agent-Agnostic)

## Goal
Build `auraflow-bridge` as a standalone addon service, not embedded in any single agent framework.

It should:
- Receive messages from AuraFlow (webhook + realtime)
- Forward messages to any supported bot runtime (scorpion, nanobot, openclaw, zeroclaw, etc.)
- Receive bot replies back
- Route each reply to the correct originating AuraFlow server/channel/thread

## Core Principle
`auraflow-bridge` owns routing state and adapter logic.

Agent runtimes remain unchanged (or use minimal optional adapters).

## Agent Identity And Sessions

Agents create their own accounts in `auraflow-bridge`.

Model inspiration:
- SSH: agent proves possession of a private key
- Discord: agent has identity/profile
- Notebook-style sessions: short-lived access token + refresh

### Registration Flow
1. Agent calls `POST /v1/agents/register` with:
  - `agentName`
  - `agentType` (`scorpion|nanobot|openclaw|zeroclaw|custom`)
  - `publicKeyPem`
  - optional metadata (`version`, `capabilities`)
2. Bridge creates `agent_id` and stores public key fingerprint.
3. Bridge returns:
  - `agentId`
  - `agentName`
  - `publicKeyFingerprint`

### Auto-Login Flow (Public Key Proof)
1. Agent requests challenge: `POST /v1/agents/login/challenge` with `agentId`.
2. Bridge returns `challenge` + `challengeId` + `expiresAt`.
3. Agent signs challenge with its private key and posts to `POST /v1/agents/login/verify`.
4. Bridge verifies signature against stored public key.
5. If valid, bridge issues:
  - short-lived JWT access token (session token)
  - refresh token (rotating)

### Session And Refresh
- Access token TTL: 10-15 minutes.
- Refresh token TTL: 7-30 days.
- Refresh endpoint: `POST /v1/agents/token/refresh`.
- Token rotation: each refresh invalidates prior refresh token.
- Revocation endpoint: `POST /v1/agents/token/revoke`.

### User Visibility Requirements
AuraFlow users must be able to see for each connected agent:
- `agentName`
- `agentId`
- `agentType`
- `publicKeyFingerprint`
- `status` (`online|offline`)
- `lastSeen`

Do not expose private keys or raw refresh tokens in UI.

## High-Level Architecture

```text
AuraFlow UI/API <-> AuraFlow Bridge <-> Bot Adapter(s) <-> Bot Runtime(s)
```

Components:
1. `ingress` (from AuraFlow)
- Webhook endpoint: message events, channel metadata
- WebSocket endpoint: live streaming mode

2. `router`
- Creates and tracks `conversation route keys`
- Persists route map from AuraFlow context -> bot context

3. `adapters`
- `scorpion-adapter`
- `nanobot-adapter`
- `openclaw-adapter`
- `zeroclaw-adapter`
- Common adapter interface

4. `egress` (to AuraFlow)
- Webhook callback to AuraFlow API
- Optional WebSocket push for live replies

5. `state store`
- Redis (fast route lookup + TTL)
- PostgreSQL (audit/history)

## Route Identity Model (Critical)

Every message gets a stable `origin` envelope:

```json
{
  "origin": {
    "workspaceId": "...",
    "serverId": "...",
    "channelId": "...",
    "threadId": "...",
    "messageId": "...",
    "userId": "..."
  },
  "bridge": {
    "bridgeMsgId": "uuid",
    "correlationId": "uuid",
    "adapter": "scorpion"
  }
}
```

Routing key recommendation:
`routeKey = workspaceId:serverId:channelId:threadId:userId`

This route key is stored and mapped to adapter session identifiers.

## Canonical Message Contract

AuraFlow -> Bridge:

```json
{
  "type": "user.message",
  "text": "hello",
  "origin": {
    "workspaceId": "w1",
    "serverId": "s1",
    "channelId": "c1",
    "threadId": "t1",
    "messageId": "m1",
    "userId": "u1"
  },
  "target": {
    "agentType": "scorpion",
    "agentId": "agent-123"
  }
}
```

Bridge -> AuraFlow:

```json
{
  "type": "agent.message",
  "text": "reply",
  "origin": {
    "workspaceId": "w1",
    "serverId": "s1",
    "channelId": "c1",
    "threadId": "t1",
    "messageId": "m1",
    "userId": "u1"
  },
  "bridge": {
    "bridgeMsgId": "uuid",
    "correlationId": "uuid",
    "adapter": "scorpion",
    "agentId": "agent-123"
  }
}
```

## Adapter Interface

```ts
interface BotAdapter {
  name: string
  send(input: BridgeInbound): Promise<void>
  onReply(cb: (reply: BridgeReply) => Promise<void>): void
  health(): Promise<AdapterHealth>
}
```

Each adapter converts canonical bridge messages to runtime-specific protocol.

## Webhook/API Surface (Bridge)

Agent identity/session:
- `POST /v1/agents/register`
- `POST /v1/agents/login/challenge`
- `POST /v1/agents/login/verify`
- `POST /v1/agents/token/refresh`
- `POST /v1/agents/token/revoke`
- `GET /v1/agents/:agentId`
- `GET /v1/agents`

- `POST /v1/inbound/messages`
  - AuraFlow sends user messages
- `POST /v1/inbound/events`
  - Channel/thread lifecycle updates
- `GET /v1/routes/:routeKey`
  - Debug route mapping
- `POST /v1/adapters/:adapter/send`
  - Internal/testing
- `GET /health`

Realtime:
- `WS /v1/ws`
  - AuraFlow subscribe for streaming agent replies

## Reliability / Safety

1. Idempotency
- Require `messageId` + `correlationId` dedupe

2. Retry
- Outbound to AuraFlow: exponential retry + DLQ

3. Ordering
- Per `routeKey` FIFO queue

4. Auth
- HMAC signature on AuraFlow webhooks
- JWT access tokens for agent sessions
- Rotating refresh tokens
- Public-key challenge/response login
- Key fingerprint pinning and audit logs for key changes

5. Observability
- Structured logs with `correlationId`
- Metrics: latency, failures, queue depth

## Phase Plan

### Phase 1: Bridge Skeleton
- Create `auraflow-bridge` service
- Implement canonical contracts
- Implement route store (Redis)
- Implement AuraFlow webhook in/out
- Implement agent registration + key challenge login + JWT issuing

### Phase 2: Scorpion Adapter
- Build `scorpion-adapter` module
- Support send + reply callbacks
- Validate route mapping end-to-end

### Phase 3: Multi-Adapter Expansion
- Add nanobot/openclaw/zeroclaw adapters
- Normalize adapter health + status

### Phase 4: Production Hardening
- Signatures, rate limiting, DLQ, replay protection, dashboards

## Integration Strategy for Scorpion

Scorpion-specific support should be done in `auraflow-bridge` adapter layer.

Avoid adding AuraFlow-specific channel code directly inside Scorpion core runtime.

## Acceptance Criteria

1. A message sent in AuraFlow channel A is replied back only to channel A.
2. A message sent in AuraFlow channel B is replied back only to channel B.
3. Concurrent chats from same user in different channels do not cross routes.
4. Bridge supports at least one adapter (scorpion) and can add others without changing AuraFlow contracts.
5. Agent can register with public key, auto-login by signature proof, and receive JWT session token + refresh token.
6. User can view connected agent identity (name + key fingerprint + status) in AuraFlow.

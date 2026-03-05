# AuraFlow 🌊

> **Multi-agent creative platform** — AI-powered generation for images, video, audio, and text. The website is just one frontend service.

## Vision

AuraFlow is a distributed system of specialized AI agents that handle creative generation at scale. Each agent is a standalone service. They communicate through a shared queue, store metadata in a central database, and save generated content to object storage.

```
┌─────────────────────────────────────────────────────────────────┐
│                         CLIENTS                                 │
│   [ Web App ]   [ Mobile ]   [ API ]   [ Discord Bot ]          │
└──────────────────────┬──────────────────────────────────────────┘
                       │ REST / WebSocket
┌──────────────────────▼──────────────────────────────────────────┐
│                     ORCHESTRATOR                                │
│   Receives jobs → validates → routes to queue → tracks status   │
└──────┬───────────┬────────────┬──────────────┬──────────────────┘
       │           │            │              │
 ┌─────▼──┐  ┌────▼────┐  ┌───▼────┐  ┌─────▼──────┐
 │ Image  │  │  Video  │  │ Agent  │  │   Text     │
 │ Agent  │  │  Agent  │  │ Audio  │  │   Agent    │
 └─────┬──┘  └────┬────┘  └───┬────┘  └─────┬──────┘
       └──────────┴────────────┴─────────────┘
                       │ store outputs
          ┌────────────▼──────────────────┐
          │       MinIO (S3-compat)       │
          │  images/ videos/ audio/ text/ │
          └───────────────────────────────┘
                       │ write metadata
          ┌────────────▼──────────────────┐
          │         PostgreSQL            │
          │  jobs / content / agents      │
          └───────────────────────────────┘
                       │
          ┌────────────▼──────────────────┐
          │       Redis + BullMQ          │
          │  job queue + completion alerts│
          └───────────────────────────────┘
```

## Open Source Stack

| Component      | Technology        | Purpose                             |
|----------------|-------------------|-------------------------------------|
| Agents         | Python/TypeScript | Specialized AI generation workers   |
| Web Frontend   | Next.js           | One of many client services         |
| Database       | PostgreSQL        | Job metadata, content refs, history |
| Object Storage | MinIO             | S3-compatible store for all content |
| Queue          | Redis + BullMQ    | Job dispatch + completion events    |
| Orchestrator   | Node.js/TypeScript| Routes jobs, monitors agents        |

## Quick Start

```bash
# Start the full stack
docker compose up -d

# Submit a generation job
curl -X POST http://localhost:3001/jobs \
  -H "Content-Type: application/json" \
  -d '{"type": "image", "prompt": "a forest at dusk, cinematic"}'

# Check job status
curl http://localhost:3001/jobs/<job-id>
```

## Repo Structure

```
AuraFlow/
├── agents/
│   ├── orchestrator/     # Routes jobs, monitors queue
│   ├── image-agent/      # Image generation (Stable Diffusion / ComfyUI)
│   ├── video-agent/      # Video generation (CogVideoX, Wan)
│   ├── audio-agent/      # Audio/music generation (MusicGen)
│   └── text-agent/       # Text, captions, prompts
├── apps/
│   └── web/              # Next.js frontend (one of many clients)
├── infra/
│   ├── postgres/         # DB schema + migrations
│   ├── minio/            # Object storage config
│   ├── queue/            # Redis + BullMQ config
│   └── jobs/             # Job tracker REST API
├── legacy/
│   └── scorpion/         # Migrated from scorpion (decommissioned)
└── docker-compose.yml    # Full stack
```

## Contributing

All open source. All agents are pluggable — build your own and connect it to the queue.

See [ARCHITECTURE.md](./ARCHITECTURE.md) for deep dive.

---
*Part of the [Dark Forge](https://github.com/Duo-Keyboard-Koalition) collective.*

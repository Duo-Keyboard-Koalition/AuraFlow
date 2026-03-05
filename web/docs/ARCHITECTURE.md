# AuraFlow — Architecture

## System Overview

AuraFlow is a **job-driven, event-sourced** creative platform. Clients submit generation requests; the orchestrator routes them to specialized agents; agents store outputs in MinIO and metadata in PostgreSQL; completion events are pushed back via Redis.

## Components

### Orchestrator (`agents/orchestrator/`)
- **REST API**: `POST /jobs`, `GET /jobs/:id`, `GET /jobs` (list/filter)
- **Queue producer**: pushes jobs onto the appropriate BullMQ queue
- **Event consumer**: listens for completion events, updates job status in DB
- **WebSocket**: optionally streams job status to connected clients

### Agents (`agents/*/`)
Each agent is a standalone worker process:
- **Pulls** from its named queue (`image-jobs`, `video-jobs`, etc.)
- **Generates** content using local or API-based models
- **Uploads** output to MinIO
- **Updates** PostgreSQL job/content tables
- **Publishes** completion event to Redis pub/sub

### PostgreSQL (`infra/postgres/`)
Central metadata store. Schema:
- `jobs` — every generation request, lifecycle status, agent assignment
- `content` — references to generated outputs (storage key, type, tags)
- `agents` — registered agents, capabilities, health

### MinIO (`infra/minio/`)
S3-compatible object storage (open source). Buckets:
- `auraflow-images`
- `auraflow-video`
- `auraflow-audio`
- `auraflow-text`

Access via standard S3 SDK — drop-in replacement with real AWS S3 in prod.

### Redis + BullMQ (`infra/queue/`)
- **Queues**: `image-jobs`, `video-jobs`, `audio-jobs`, `text-jobs`
- **Job data**: prompt, params, job_id, priority
- **Events**: `job:complete`, `job:failed` pub/sub channels
- **Delayed jobs**: retry with backoff on failure

## Data Flow

```
1. Client → POST /jobs {type, prompt, params}
2. Orchestrator → creates job row (status=queued) in PostgreSQL
3. Orchestrator → pushes job to BullMQ queue (e.g. "image-jobs")
4. Image Agent pulls job from queue
5. Image Agent generates image
6. Image Agent uploads to MinIO → auraflow-images/<job-id>.png
7. Image Agent writes content row to PostgreSQL (storage_key, url)
8. Image Agent updates job status → complete
9. Image Agent publishes to Redis: job:complete {job_id}
10. Orchestrator receives event → notifies client (WebSocket / webhook)
```

## Job States

```
queued → processing → complete
                   └→ failed → retrying → complete
                                       └→ dead
```

## Video Jobs — Special Handling

Video generation is the longest-running job type (minutes to hours). Special considerations:
- Separate `video-jobs` queue with lower concurrency
- Progress events published every N% of generation
- Chunked upload to MinIO (multipart)
- Clients should use WebSocket or long-poll for status

## Agent Interface Contract

Every agent must implement:

```typescript
interface AgentWorker {
  queueName: string;          // e.g. "image-jobs"
  concurrency: number;        // parallel jobs this agent handles
  process(job: Job): Promise<AgentResult>;
}

interface AgentResult {
  storageKey: string;         // MinIO key
  url: string;                // public/presigned URL
  metadata: Record<string, unknown>;
}
```

## Adding a New Agent

1. Copy `agents/image-agent/` as a template
2. Implement `process(job)` with your model
3. Register queue name in orchestrator config
4. Add service to `docker-compose.yml`
5. Done — orchestrator routes automatically

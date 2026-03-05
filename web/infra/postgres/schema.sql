-- AuraFlow PostgreSQL Schema

CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Registered agents
CREATE TABLE agents (
  id          UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name        TEXT NOT NULL UNIQUE,
  type        TEXT NOT NULL CHECK (type IN ('image', 'video', 'audio', 'text', 'orchestrator')),
  status      TEXT NOT NULL DEFAULT 'offline' CHECK (status IN ('online', 'offline', 'busy')),
  capabilities JSONB DEFAULT '{}',
  last_heartbeat TIMESTAMPTZ,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Generation jobs (tickets)
CREATE TABLE jobs (
  id          UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  type        TEXT NOT NULL CHECK (type IN ('image', 'video', 'audio', 'text')),
  status      TEXT NOT NULL DEFAULT 'queued'
              CHECK (status IN ('queued', 'processing', 'complete', 'failed', 'retrying', 'dead')),
  priority    INT NOT NULL DEFAULT 5,
  prompt      TEXT NOT NULL,
  params      JSONB DEFAULT '{}',
  agent_id    UUID REFERENCES agents(id),
  queue_job_id TEXT,                       -- BullMQ job ID
  progress    INT DEFAULT 0,               -- 0-100
  error       TEXT,
  retry_count INT DEFAULT 0,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at  TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  completed_at TIMESTAMPTZ,
  requested_by TEXT                        -- user/client identifier
);

-- Generated content (outputs)
CREATE TABLE content (
  id          UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  job_id      UUID NOT NULL REFERENCES jobs(id) ON DELETE CASCADE,
  type        TEXT NOT NULL CHECK (type IN ('image', 'video', 'audio', 'text')),
  storage_key TEXT NOT NULL,               -- MinIO object key
  bucket      TEXT NOT NULL,               -- MinIO bucket name
  url         TEXT,                        -- presigned or public URL
  mime_type   TEXT,
  size_bytes  BIGINT,
  duration_ms INT,                         -- for audio/video
  width       INT,                         -- for image/video
  height      INT,                         -- for image/video
  tags        TEXT[] DEFAULT '{}',
  metadata    JSONB DEFAULT '{}',
  created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Indexes
CREATE INDEX idx_jobs_status ON jobs(status);
CREATE INDEX idx_jobs_type ON jobs(type);
CREATE INDEX idx_jobs_created_at ON jobs(created_at DESC);
CREATE INDEX idx_jobs_agent_id ON jobs(agent_id);
CREATE INDEX idx_content_job_id ON content(job_id);
CREATE INDEX idx_content_type ON content(type);
CREATE INDEX idx_content_tags ON content USING GIN(tags);

-- Auto-update updated_at
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN NEW.updated_at = NOW(); RETURN NEW; END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER jobs_updated_at
  BEFORE UPDATE ON jobs
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

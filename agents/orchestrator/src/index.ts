import express from 'express';
import { v4 as uuidv4 } from 'uuid';
import { Queue } from 'bullmq';
import { Pool } from 'pg';
import IORedis from 'ioredis';

const app = express();
app.use(express.json());

const redis = new IORedis(process.env.REDIS_URL || 'redis://localhost:6379');
const db = new Pool({ connectionString: process.env.DATABASE_URL });

const QUEUES: Record<string, Queue> = {
  image: new Queue('image-jobs', { connection: redis }),
  video: new Queue('video-jobs', { connection: redis }),
  audio: new Queue('audio-jobs', { connection: redis }),
  text:  new Queue('text-jobs',  { connection: redis }),
};

// Submit a new job
app.post('/jobs', async (req, res) => {
  const { type, prompt, params = {}, priority = 5 } = req.body;
  if (!type || !prompt) return res.status(400).json({ error: 'type and prompt required' });
  if (!QUEUES[type]) return res.status(400).json({ error: `unknown type: ${type}` });

  const jobId = uuidv4();
  await db.query(
    `INSERT INTO jobs (id, type, status, prompt, params, priority)
     VALUES ($1, $2, 'queued', $3, $4, $5)`,
    [jobId, type, prompt, JSON.stringify(params), priority]
  );

  const qJob = await QUEUES[type].add(type, { jobId, prompt, params }, { priority });
  await db.query(`UPDATE jobs SET queue_job_id=$1 WHERE id=$2`, [qJob.id, jobId]);

  res.json({ jobId, status: 'queued' });
});

// Get job status
app.get('/jobs/:id', async (req, res) => {
  const { rows } = await db.query('SELECT * FROM jobs WHERE id=$1', [req.params.id]);
  if (!rows.length) return res.status(404).json({ error: 'not found' });
  res.json(rows[0]);
});

// List jobs
app.get('/jobs', async (req, res) => {
  const { type, status, limit = 20 } = req.query;
  let q = 'SELECT * FROM jobs WHERE 1=1';
  const params: unknown[] = [];
  if (type) { params.push(type); q += ` AND type=$${params.length}`; }
  if (status) { params.push(status); q += ` AND status=$${params.length}`; }
  params.push(Number(limit)); q += ` ORDER BY created_at DESC LIMIT $${params.length}`;
  const { rows } = await db.query(q, params);
  res.json(rows);
});

// Listen for completion events
redis.subscribe('job:complete', 'job:failed');
redis.on('message', async (channel, message) => {
  const { jobId, storageKey, url, error } = JSON.parse(message);
  if (channel === 'job:complete') {
    await db.query(
      `UPDATE jobs SET status='complete', progress=100, completed_at=NOW() WHERE id=$1`,
      [jobId]
    );
    console.log(`[orchestrator] job ${jobId} complete — ${url}`);
  } else if (channel === 'job:failed') {
    await db.query(
      `UPDATE jobs SET status='failed', error=$1 WHERE id=$2`,
      [error, jobId]
    );
    console.error(`[orchestrator] job ${jobId} failed — ${error}`);
  }
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => console.log(`[orchestrator] listening on :${PORT}`));

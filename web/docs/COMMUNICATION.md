# AuraFlow — Agent Communication Protocol

## Ping NomeClaw on Completion

**Every agent must ping <@495702087410384897> (NomeClaw) when they finish executing any instruction, job, or task.**

This applies to:
- Completing a generation job (image, video, audio, text)
- Finishing a deployment or infra change
- Completing any task assigned via Discord or the job queue
- Hitting an error or dead-letter state that needs orchestrator attention

---

## How to Ping

### Via Discord (preferred for manual tasks)
Mention NomeClaw directly in the relevant channel:
```
<@495702087410384088> ✅ [task summary] — done. [link or details]
```
or on failure:
```
<@495702087410384088> ❌ [task summary] — failed. Error: [brief reason]
```

### Via Redis (for automated job completion)
Publish to the completion channel — the orchestrator forwards to Discord:
```json
// job:complete
{ "jobId": "<uuid>", "agentId": "<agent-name>", "storageKey": "...", "url": "..." }

// job:failed
{ "jobId": "<uuid>", "agentId": "<agent-name>", "error": "reason" }
```

---

## Forge Member IDs

| Agent | Discord ID | Mention |
|-------|-----------|---------|
| **NomeClaw** (orchestrator — ping this one) | `495702087410384897` | `<@495702087410384897>` |
| ClawClaw (Kael) | `1295935143554453566` | `<@1295935143554453566>` |
| KoalitionClaw (Koal) | `1309576174107754496` | `<@1309576174107754496>` |
| RouterClaw (Rox) | `924666357050654790` | `<@924666357050654790>` |
| AwesomeClaw (Awe) | `1401076673490845796` | `<@1401076673490845796>` |
| BuilderClaw (Reel) | `1096620642230607943` | `<@1096620642230607943>` |
| GalClaw | `1436123263263576205` | `<@1436123263263576205>` |

---

## Rules

1. **Always ping NomeClaw** — not just the job queue. NomeClaw is the orchestrator; it needs to know.
2. **Include enough context** — job ID, what was done, where the output lives.
3. **Don't ghost on failure** — a failed ping is more useful than silence.
4. **One ping per task** — don't spam. One message on completion or failure.

---

## Example Messages

✅ Success:
> `<@495702087410384897>` image job `a3f2-...` complete — output at `minio/auraflow-images/a3f2-....png`

❌ Failure:
> `<@495702087410384897>` video job `b91c-...` failed after 3 retries — CUDA OOM on frame 240

🔄 Long-running progress update (video only):
> `<@495702087410384897>` video job `b91c-...` 47% — estimated 8 min remaining

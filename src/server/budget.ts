import {database, now, newId} from './db';
import {AppError} from '../domain/privacy';

export type Usage = {input: number; cached: number; output: number; reasoning: number | null; raw: unknown};
export const usageCost = (u: Usage) => Math.ceil((u.input - u.cached) * 2 + u.cached * .04 + u.output * 8);
export const estimateTokens = (text: string) => Buffer.byteLength(text, 'utf8') + 2048;
export const TOTAL_TOKENS = 524288;
const MAX_CONCURRENT_RUNS = 6;
export function reserveFor(inputTokens: number, outputTokens: number) {
  if (inputTokens + outputTokens + 4096 > TOTAL_TOKENS) throw new AppError('CONTEXT_LIMIT');
  const repairInput = Math.min(TOTAL_TOKENS - outputTokens - 4096, inputTokens + outputTokens * 4 + 4096);
  return inputTokens * 2 + outputTokens * 8 + repairInput * 2 + outputTokens * 8;
}
export function budgetStatus(pool = process.env.BUDGET_POOL || 'development') {
  const {used} = database().native.prepare("SELECT COALESCE(SUM(CASE WHEN status='running' THEN reserved_micro ELSE COALESCE(cost_micro,reserved_micro) END),0) AS used FROM ai_runs WHERE pool=?").get(pool) as {used: number};
  // Preserve usage reporting and response keys; null means no application spending cap.
  return {pool, limit: null, used: used / 1e6, remaining: null};
}
export function reserveRun(args: {workspaceId: string; incidentId: string; snapshotId: string; action: string; idempotencyKey: string; ipHash: string; reservedMicro: number; metadata: unknown}) {
  const db = database().native, pool = process.env.BUDGET_POOL || 'development';
  if (!['development', 'hosted'].includes(pool)) throw new AppError('BUDGET_CONFIGURATION', 500);
  return db.transaction(() => {
    const existing = db.prepare('SELECT * FROM ai_runs WHERE workspace_id=? AND idempotency_key=?').get(args.workspaceId, args.idempotencyKey) as Record<string, unknown> | undefined;
    if (existing) {
      if (existing.snapshot_id !== args.snapshotId || existing.action !== args.action || existing.incident_id !== args.incidentId) throw new AppError('IDEMPOTENCY_CONFLICT', 409);
      const previous=JSON.parse(String(existing.metadata)) as {requestKeyHash?:string};
      if(previous.requestKeyHash !== (args.metadata as {requestKeyHash?:string})?.requestKeyHash)throw new AppError('IDEMPOTENCY_CONFLICT',409);
      return {id: String(existing.id), existing: true};
    }
    const active = db.prepare("SELECT COUNT(*) AS n FROM ai_runs WHERE status='running'").get() as {n: number};
    if (active.n >= MAX_CONCURRENT_RUNS) throw new AppError('BUSY', 429);
    const id = newId();
    db.prepare("INSERT INTO ai_runs(id,workspace_id,incident_id,snapshot_id,action,idempotency_key,pool,ip_hash,status,reserved_micro,metadata,created_at) VALUES(?,?,?,?,?,?,?,?,'running',?,?,?)")
      .run(id, args.workspaceId, args.incidentId, args.snapshotId, args.action, args.idempotencyKey, pool, args.ipHash, args.reservedMicro, JSON.stringify(args.metadata), now());
    return {id, existing: false};
  })();
}
export function finishRun(id: string, status: string, costMicro: number | null, metadata: unknown, errorCode?: string) {
  database().native.prepare('UPDATE ai_runs SET status=?,cost_micro=COALESCE(?,reserved_micro),metadata=?,error_code=?,finished_at=? WHERE id=?')
    .run(status, costMicro, JSON.stringify(metadata), errorCode ?? null, now(), id);
}

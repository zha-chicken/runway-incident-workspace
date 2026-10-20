import Database from 'better-sqlite3';
import {drizzle} from 'drizzle-orm/better-sqlite3';
import {eq} from 'drizzle-orm';
import {mkdirSync, readFileSync} from 'node:fs';
import {dirname, resolve} from 'node:path';
import {createHash, randomBytes, randomUUID} from 'node:crypto';
import {dataset} from '../domain/evidence';
import {AppError, assertNoPersonalData, requireKnownAirport} from '../domain/privacy';
import {incidentInputSchema, reviewSchema, type IncidentInput, type Snapshot, type StoredAssessment, type Assessment, type Discussion} from '../domain/types';
import {workspaceTable} from './schema';

type DatabaseState = {native: Database.Database; orm: ReturnType<typeof drizzle>};
const shared = globalThis as typeof globalThis & {runwayDB?: DatabaseState};
export const now = () => new Date().toISOString();
export const newId = () => randomUUID();
export function database(): DatabaseState {
  if (shared.runwayDB) return shared.runwayDB;
  const path = resolve(/* turbopackIgnore: true */ process.env.DATABASE_PATH || 'runtime/runway.sqlite');
  mkdirSync(dirname(path), {recursive: true});
  const native = new Database(path);
  native.pragma('journal_mode = WAL'); native.pragma('foreign_keys = ON'); native.pragma('busy_timeout = 5000');
  if (native.pragma('user_version', {simple: true}) === 0) {
    native.transaction(() => native.exec(readFileSync(resolve('migrations/0001_initial.sql'), 'utf8')))();
  }
  // A prior process cannot finish its own requests after restarting.
  native.prepare("UPDATE ai_runs SET status='interrupted',cost_micro=reserved_micro,error_code='SERVER_RESTART',finished_at=? WHERE status='running'").run(now());
  shared.runwayDB = {native, orm: drizzle(native)};
  return shared.runwayDB;
}
export function closeDatabase() {shared.runwayDB?.native.close(); delete shared.runwayDB;}
export const hash = (text: string) => createHash('sha256').update(text).digest('hex');
export function workspaceFor(token?: string): {id: string; token?: string} {
  const {native, orm} = database();
  if (token && /^[a-f0-9]{64}$/.test(token)) {
    const existing = orm.select().from(workspaceTable).where(eq(workspaceTable.tokenHash, hash(token))).get();
    if (existing) {
      const expired = Date.now() - Date.parse(existing.lastSeen) > 14 * 86400_000;
      if (expired) resetWorkspace(existing.id);
      native.prepare('UPDATE workspaces SET last_seen=? WHERE id=?').run(now(), existing.id);
      return {id: existing.id};
    }
  }
  const id = newId(), secret = randomBytes(32).toString('hex');
  native.transaction(() => {
    orm.insert(workspaceTable).values({id, tokenHash: hash(secret), createdAt: now(), lastSeen: now()}).run();
    for (const event of dataset.events) createIncident(id, event.input);
  })();
  return {id, token: secret};
}
export function validateInput(value: unknown): IncidentInput {
  assertNoPersonalData(value);
  const data = incidentInputSchema.parse(value);
  requireKnownAirport(data.airportId, dataset.airports.map(a => a.id));
  if (new Set(data.reports.map(r => r.id)).size !== data.reports.length) throw new AppError('DUPLICATE_REPORT_ID');
  if (data.sourceEventId && !dataset.events.some(e => e.id === data.sourceEventId && e.input.airportId === data.airportId)) throw new AppError('SOURCE_EVENT_MISMATCH');
  for (const r of data.reports) {
    if (r.provenanceKind === 'competition') {
      const seed = dataset.events.filter(e => e.input.airportId === data.airportId).flatMap(e => e.input.reports).find(s => s.id === r.id);
      if (!seed || JSON.stringify(seed) !== JSON.stringify(r)) throw new AppError('SOURCE_REPORT_IMMUTABLE');
    }
    if (r.provenanceKind === 'team_simulation' && r.reliability === 'scenario_given') throw new AppError('SOURCE_REPORT_IMMUTABLE');
  }
  if (data.officialStatus !== 'unconfirmed' && !data.reports.some(r => r.id === data.officialStatusSourceId && r.reliability === 'human_verified' && r.verificationBasis && r.reportedAt)) {
    throw new AppError('OFFICIAL_STATUS_NEEDS_VERIFIED_SOURCE');
  }
  return data;
}
export function createIncident(workspaceId: string, raw: unknown) {
  const input = validateInput(raw), id = newId(), snapshotId = newId(), time = now();
  database().native.transaction(() => {
    database().native.prepare('INSERT INTO incidents VALUES(?,?,1,NULL,?,?)').run(id, workspaceId, time, time);
    database().native.prepare('INSERT INTO snapshots VALUES(?,?,1,?,?)').run(snapshotId, id, JSON.stringify(input), time);
  })();
  return id;
}
export function ownIncident(workspaceId: string, incidentId: string) {
  const row = database().native.prepare('SELECT * FROM incidents WHERE id=? AND workspace_id=?').get(incidentId, workspaceId) as {id: string; version: number; current_assessment_id: string | null} | undefined;
  if (!row) throw new AppError('NOT_FOUND', 404);
  return row;
}
export function snapshotFor(workspaceId: string, incidentId: string, version?: number): Snapshot {
  const incident = ownIncident(workspaceId, incidentId);
  const r = database().native.prepare('SELECT * FROM snapshots WHERE incident_id=? AND version=?').get(incidentId, version ?? incident.version) as {id: string; payload: string; version: number; created_at: string} | undefined;
  if (!r) throw new AppError('NOT_FOUND', 404);
  return {...JSON.parse(r.payload), id: r.id, incidentId, version: r.version, createdAt: r.created_at};
}
export function updateIncident(workspaceId: string, incidentId: string, expectedVersion: number, raw: unknown) {
  const payload = validateInput(raw), db = database().native;
  return db.transaction(() => {
    const incident = ownIncident(workspaceId, incidentId);
    if (incident.version !== expectedVersion) throw new AppError('VERSION_CONFLICT', 409);
    if (db.prepare("SELECT 1 FROM ai_runs WHERE incident_id=? AND status='running'").get(incidentId)) {
      // Editing is allowed; completion compares versions before promotion.
    }
    const version = expectedVersion + 1, id = newId(), createdAt = now();
    db.prepare('INSERT INTO snapshots VALUES(?,?,?,?,?)').run(id, incidentId, version, JSON.stringify(payload), createdAt);
    db.prepare('UPDATE incidents SET version=?,current_assessment_id=NULL,updated_at=? WHERE id=?').run(version, createdAt, incidentId);
    return {id, version};
  })();
}
export function listIncidents(workspaceId: string) {
  const rows = database().native.prepare('SELECT i.id,i.version,i.current_assessment_id,s.payload,i.updated_at,a.result FROM incidents i JOIN snapshots s ON s.incident_id=i.id AND s.version=i.version LEFT JOIN assessments a ON a.id=i.current_assessment_id WHERE i.workspace_id=? ORDER BY i.created_at').all(workspaceId) as Array<Record<string, unknown>>;
  return rows.map(r => {
    const p = JSON.parse(r.payload as string) as IncidentInput;
    return {id: r.id as string, version: r.version as number, title: p.title, sourceEventId: p.sourceEventId,
      airportId: p.airportId, scenarioPeriod: p.scenarioPeriod, updatedAt: r.updated_at as string,
      riskLevel: r.result ? (JSON.parse(r.result as string) as Assessment).riskLevel : null};
  });
}
export function assessmentsFor(workspaceId: string, incidentId: string): StoredAssessment[] {
  ownIncident(workspaceId, incidentId);
  const rows = database().native.prepare('SELECT a.*,s.version FROM assessments a JOIN snapshots s ON s.id=a.snapshot_id WHERE a.incident_id=? ORDER BY a.created_at DESC').all(incidentId) as Array<Record<string, unknown>>;
  return rows.map(r => ({id: String(r.id), incidentId, snapshotId: String(r.snapshot_id), snapshotVersion: Number(r.version), generatedAt: String(r.created_at), runId: String(r.run_id), result: JSON.parse(String(r.result)), origin: r.origin as StoredAssessment['origin']}));
}
export function saveAssessment(workspaceId: string, snapshot: Snapshot, runId: string, result: Assessment) {
  const db = database().native, id = newId();
  db.transaction(() => {
    ownIncident(workspaceId, snapshot.incidentId);
    db.prepare('INSERT INTO assessments VALUES(?,?,?,?,?,?,?)').run(id, snapshot.incidentId, snapshot.id, runId, JSON.stringify(result), now(), 'live_model');
    db.prepare('UPDATE incidents SET current_assessment_id=? WHERE id=? AND version=?').run(id, snapshot.incidentId, snapshot.version);
  })();
  return id;
}
export function saveDiscussion(workspaceId: string, snapshot: Snapshot, runId: string, question: string, response: Discussion) {
  ownIncident(workspaceId, snapshot.incidentId);
  const id = newId();
  database().native.prepare('INSERT INTO discussions VALUES(?,?,?,?,?,?,?,NULL)').run(id, snapshot.incidentId, snapshot.id, question, JSON.stringify(response), runId, now());
  return id;
}
export function saveReview(workspaceId: string, incidentId: string, raw: unknown) {
  assertNoPersonalData(raw);
  const review = reviewSchema.parse(raw);
  const assessment = assessmentsFor(workspaceId, incidentId).find(a => a.id === review.assessmentId);
  if (!assessment || ![assessment.result.firstAction, ...assessment.result.subsequentActions].some(a => a.id === review.recommendationId)) throw new AppError('NOT_FOUND', 404);
  const id = newId(), reviewedAt = now();
  database().native.prepare('INSERT INTO reviews VALUES(?,?,?,?,?,?)').run(id, incidentId, review.assessmentId, review.recommendationId, JSON.stringify({...review, incidentId, reviewedAt}), reviewedAt);
  return id;
}
export function saveDraft(workspaceId: string, incidentId: string, data: {assessmentId: string; audience: string; locale: string; text: string; expectedRevision: number}) {
  assertNoPersonalData(data);
  if (!['operations', 'airportCoordination', 'passenger'].includes(data.audience) || !['en', 'zh'].includes(data.locale) || !data.text.trim() || data.text.length > 12000) throw new AppError('INVALID_DRAFT');
  if (!assessmentsFor(workspaceId, incidentId).some(a => a.id === data.assessmentId)) throw new AppError('NOT_FOUND', 404);
  const db = database().native;
  return db.transaction(() => {
    const revision = (db.prepare('SELECT MAX(revision) AS revision FROM drafts WHERE assessment_id=? AND audience=?').get(data.assessmentId, data.audience) as {revision: number | null}).revision ?? 0;
    if (revision !== data.expectedRevision) throw new AppError('VERSION_CONFLICT', 409);
    const id = newId();
    db.prepare('INSERT INTO drafts VALUES(?,?,?,?,?,?,?,?,?)').run(id, incidentId, data.assessmentId, data.audience, data.locale, data.text, revision + 1, 1, now());
    return id;
  })();
}
export function incidentDetail(workspaceId: string, incidentId: string) {
  const incident = ownIncident(workspaceId, incidentId), db = database().native;
  return {
    incident, snapshot: snapshotFor(workspaceId, incidentId),
    assessments: assessmentsFor(workspaceId, incidentId),
    history: (db.prepare('SELECT * FROM snapshots WHERE incident_id=? ORDER BY version DESC').all(incidentId) as Array<Record<string, unknown>>).map(r => ({id: r.id, version: r.version, createdAt: r.created_at, input: JSON.parse(String(r.payload))})),
    reviews: (db.prepare('SELECT id,payload FROM reviews WHERE incident_id=? ORDER BY created_at DESC').all(incidentId) as Array<{id: string; payload: string}>).map(r => ({id: r.id, ...JSON.parse(r.payload)})),
    drafts: db.prepare('SELECT * FROM drafts WHERE incident_id=? ORDER BY revision DESC').all(incidentId),
    discussions: (db.prepare('SELECT * FROM discussions WHERE incident_id=? ORDER BY created_at DESC').all(incidentId) as Array<Record<string, unknown>>).map(r => ({...r, response: JSON.parse(String(r.response))})),
    runs: (db.prepare('SELECT id,snapshot_id,action,status,error_code,metadata,created_at,finished_at,cost_micro,reserved_micro FROM ai_runs WHERE workspace_id=? AND incident_id=? ORDER BY created_at DESC').all(workspaceId, incidentId) as Array<Record<string, unknown>>).map(r => ({...r, metadata: JSON.parse(String(r.metadata))}))
  };
}
export function resetWorkspace(workspaceId: string) {
  const db = database().native;
  db.transaction(() => {
    if (db.prepare("SELECT 1 FROM ai_runs WHERE workspace_id=? AND status='running'").get(workspaceId)) throw new AppError('RUN_ACTIVE', 409);
    db.prepare('DELETE FROM incidents WHERE workspace_id=?').run(workspaceId);
    // Keep the workspace and ledger so reset cannot replenish quotas or money.
    for (const event of dataset.events) createIncident(workspaceId, event.input);
  })();
}

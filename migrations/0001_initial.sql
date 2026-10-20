CREATE TABLE IF NOT EXISTS workspaces (
  id TEXT PRIMARY KEY, token_hash TEXT NOT NULL UNIQUE, created_at TEXT NOT NULL, last_seen TEXT NOT NULL
);
CREATE TABLE IF NOT EXISTS incidents (
  id TEXT PRIMARY KEY, workspace_id TEXT NOT NULL REFERENCES workspaces(id) ON DELETE CASCADE,
  version INTEGER NOT NULL, current_assessment_id TEXT, created_at TEXT NOT NULL, updated_at TEXT NOT NULL
);
CREATE TABLE IF NOT EXISTS snapshots (
  id TEXT PRIMARY KEY, incident_id TEXT NOT NULL REFERENCES incidents(id) ON DELETE CASCADE,
  version INTEGER NOT NULL, payload TEXT NOT NULL, created_at TEXT NOT NULL, UNIQUE(incident_id,version)
);
CREATE TABLE IF NOT EXISTS assessments (
  id TEXT PRIMARY KEY, incident_id TEXT NOT NULL REFERENCES incidents(id) ON DELETE CASCADE,
  snapshot_id TEXT NOT NULL REFERENCES snapshots(id), run_id TEXT NOT NULL, result TEXT NOT NULL,
  created_at TEXT NOT NULL, origin TEXT NOT NULL DEFAULT 'live_model'
);
CREATE TABLE IF NOT EXISTS reviews (
  id TEXT PRIMARY KEY, incident_id TEXT NOT NULL REFERENCES incidents(id) ON DELETE CASCADE,
  assessment_id TEXT NOT NULL REFERENCES assessments(id), recommendation_id TEXT NOT NULL,
  payload TEXT NOT NULL, created_at TEXT NOT NULL
);
CREATE TABLE IF NOT EXISTS drafts (
  id TEXT PRIMARY KEY, incident_id TEXT NOT NULL REFERENCES incidents(id) ON DELETE CASCADE,
  assessment_id TEXT NOT NULL REFERENCES assessments(id), audience TEXT NOT NULL, locale TEXT NOT NULL,
  text TEXT NOT NULL, revision INTEGER NOT NULL, translation_needs_review INTEGER NOT NULL,
  created_at TEXT NOT NULL
);
CREATE TABLE IF NOT EXISTS discussions (
  id TEXT PRIMARY KEY, incident_id TEXT NOT NULL REFERENCES incidents(id) ON DELETE CASCADE,
  snapshot_id TEXT NOT NULL REFERENCES snapshots(id), question TEXT NOT NULL, response TEXT NOT NULL,
  run_id TEXT NOT NULL, created_at TEXT NOT NULL, applied_snapshot_id TEXT
);
CREATE TABLE IF NOT EXISTS ai_runs (
  id TEXT PRIMARY KEY, workspace_id TEXT NOT NULL REFERENCES workspaces(id),
  incident_id TEXT NOT NULL, snapshot_id TEXT NOT NULL, action TEXT NOT NULL,
  idempotency_key TEXT NOT NULL, pool TEXT NOT NULL, ip_hash TEXT NOT NULL,
  status TEXT NOT NULL, reserved_micro INTEGER NOT NULL, cost_micro INTEGER,
  metadata TEXT NOT NULL, error_code TEXT, created_at TEXT NOT NULL, finished_at TEXT,
  UNIQUE(workspace_id,idempotency_key)
);
CREATE INDEX IF NOT EXISTS runs_pool_status ON ai_runs(pool,status);
CREATE INDEX IF NOT EXISTS runs_visitor_date ON ai_runs(workspace_id,created_at);
CREATE INDEX IF NOT EXISTS snapshots_incident ON snapshots(incident_id,version);
PRAGMA user_version=1;

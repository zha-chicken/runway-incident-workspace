CREATE TABLE IF NOT EXISTS privacy_reviews (
  id TEXT PRIMARY KEY,
  workspace_id TEXT NOT NULL REFERENCES workspaces(id) ON DELETE CASCADE,
  incident_id TEXT NOT NULL REFERENCES incidents(id) ON DELETE CASCADE,
  action TEXT NOT NULL,
  review TEXT NOT NULL,
  created_at TEXT NOT NULL
);
CREATE INDEX IF NOT EXISTS privacy_reviews_incident ON privacy_reviews(incident_id,created_at);
PRAGMA user_version=2;

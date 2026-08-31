CREATE TABLE IF NOT EXISTS scheduled_posts (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  execution_instance TEXT NOT NULL,
  object_key TEXT NOT NULL,
  publication_identity TEXT NOT NULL,
  channel_key TEXT NOT NULL,
  platform TEXT NOT NULL,
  platform_did TEXT,
  canonical_url TEXT NOT NULL,
  media_url TEXT NOT NULL,
  caption TEXT NOT NULL,
  caption_hash TEXT NOT NULL,
  asset_identity TEXT NOT NULL,
  scheduled_utc TEXT NOT NULL,
  source_timezone TEXT NOT NULL,
  idempotency_key TEXT NOT NULL UNIQUE,
  status TEXT NOT NULL DEFAULT 'scheduled',
  attempt_count INTEGER NOT NULL DEFAULT 0,
  platform_uri TEXT,
  platform_cid TEXT,
  public_url TEXT,
  last_error TEXT,
  created_at TEXT NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')),
  attempted_at TEXT,
  published_at TEXT,
  held_at TEXT,
  evidence_at TEXT
);

CREATE INDEX IF NOT EXISTS idx_scheduled_posts_due
  ON scheduled_posts (status, scheduled_utc);

CREATE INDEX IF NOT EXISTS idx_scheduled_posts_object_channel
  ON scheduled_posts (object_key, channel_key, scheduled_utc);

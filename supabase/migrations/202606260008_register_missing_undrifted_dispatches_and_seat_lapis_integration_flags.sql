-- Register missing unDrifted dispatch records and seat Lapis integration flags.
-- OAR2: oar2_inventory_undrifted_dispatches_and_verify_lapis_publication_automations_v1
--
-- Verified via Paragraph URL fetch:
--   @undrifted/measures-registry: title="Measures Registry", no subtitle
--   @undrifted/undrifted: title="unDrifted", subtitle="Structural drift is detectable. Collapse is not the default."
--
-- dispatch_body = '' (no body content verified — matches structural_drift_dispatch_v1 pattern).
-- No invented content.

-- 1. Register Measures Registry dispatch

INSERT INTO measures_publication_dispatch (
  publication_key,
  dispatch_key,
  title,
  dispatch_body,
  external_platform,
  external_url,
  external_slug,
  status,
  metadata
) VALUES (
  'undrifted',
  'measures_registry_dispatch_v1',
  'Measures Registry',
  '',
  'paragraph',
  'https://paragraph.com/@undrifted/measures-registry',
  'measures-registry',
  'published',
  '{
    "paragraph_handle": "@undrifted",
    "paragraph_url": "https://paragraph.com/@undrifted/measures-registry",
    "paragraph_publish_state": "published_external_operator_confirmed",
    "paragraph_api_managed": "false_until_matched",
    "publication_key_standing": "undrifted",
    "db_body_state": "external_url_standing_or_body_pending",
    "approval_state": "external_operator_confirmed",
    "sync_direction": "DB_to_Paragraph",
    "source_oar2": "docs/oar/measures_registry/oar2_inventory_undrifted_dispatches_and_verify_lapis_publication_automations_v1.meta.md"
  }'::jsonb
);

-- 2. Register unDrifted dispatch (meta-article about the publication itself)

INSERT INTO measures_publication_dispatch (
  publication_key,
  dispatch_key,
  title,
  dispatch_body,
  external_platform,
  external_url,
  external_slug,
  status,
  metadata
) VALUES (
  'undrifted',
  'undrifted_dispatch_v1',
  'unDrifted',
  '',
  'paragraph',
  'https://paragraph.com/@undrifted/undrifted',
  'undrifted',
  'published',
  '{
    "subtitle": "Structural drift is detectable. Collapse is not the default.",
    "paragraph_handle": "@undrifted",
    "paragraph_url": "https://paragraph.com/@undrifted/undrifted",
    "paragraph_publish_state": "published_external_operator_confirmed",
    "paragraph_api_managed": "false_until_matched",
    "publication_key_standing": "undrifted",
    "db_body_state": "external_url_standing_or_body_pending",
    "approval_state": "external_operator_confirmed",
    "sync_direction": "DB_to_Paragraph",
    "source_oar2": "docs/oar/measures_registry/oar2_inventory_undrifted_dispatches_and_verify_lapis_publication_automations_v1.meta.md"
  }'::jsonb
);

-- 3. Seat Lapis publication integration flags on undrifted registry entry.
-- Paragraph and Buffer confirmed as publication integrations via env bindings.
-- No automation process records created — system_process_registry requires too many
-- non-nullable fields without a verified template. Separate OAR required.

UPDATE measures_registry
SET metadata = metadata || '{
  "lapis_publication_integrations": {
    "paragraph": {
      "env_binding": "PARAGRAPH_PUBLISH_KEY",
      "function": "external_article_publication",
      "automation_status": "missing_required",
      "disposition": "hold_for_operator_review",
      "note": "Env key present. No automation route or process record. Separate OAR required."
    },
    "buffer": {
      "env_binding": "BUFFER_SOCIAL_KEY",
      "function": "external_social_distribution",
      "automation_status": "missing_required",
      "disposition": "hold_for_operator_review",
      "note": "Env key present. No automation route or process record. Separate OAR required."
    }
  }
}'::jsonb
WHERE registry_key = 'undrifted';

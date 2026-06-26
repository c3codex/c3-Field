-- Align unDrifted Lapis publication standing and mark structural_drift_publication as stale identity.
-- OAR2: oar2_align_undrifted_lapis_publication_and_register_structural_drift_article_v1
--
-- undrifted exists in measures_publication_registry but is absent from measures_registry.
-- structural_drift article already registered in measures_publication_dispatch (structural_drift_dispatch_v1).
-- No new article row needed.

-- 1. Seat undrifted in measures_registry (minimal standing for existing page)

INSERT INTO measures_registry (
  registry_key,
  display_title,
  registry_family,
  material_family,
  release_state,
  access_state,
  is_active,
  metadata
) VALUES (
  'undrifted',
  'unDrifted',
  'spine',
  'lapis',
  'released',
  'encounterable',
  true,
  '{
    "native_architecture": true,
    "current_function": "landing_page_publication",
    "planned_function": "social_registry_surface",
    "planned_function_status": "not_active",
    "chamber_assignment": "lapis",
    "material_identity": "lapis"
  }'::jsonb
);

-- 2. Mark structural_drift_publication encounter_def as stale publication identity

UPDATE measures_encounter_def
SET metadata = metadata || '{
  "stale_publication_identity": true,
  "legacy_route_alias": true,
  "replacement_publication_key": "undrifted",
  "replacement_article_key": "structural_drift",
  "disposition": "audit_trace_only"
}'::jsonb
WHERE encounter_key = 'structural_drift_publication';

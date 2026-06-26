-- Bridge structural_drift_publication legacy traffic to undrifted.
-- OAR2: oar2_bridge_structural_drift_publication_legacy_traffic_to_undrifted_v1
-- Source OAR1: oar1_validate_native_encounter_routes_before_legacy_deactivation_v1
--
-- Native Lapis route proven: /undrifted -> measures_publication_registry -> structural_drift_dispatch_v1.
-- publication_registry and publication_dispatch records are NOT mutated.

-- 1. Deactivate legacy transition: about_measures_registry -> structural_drift_publication

UPDATE measures_transition_rule
SET rule_state = 'inactive'
WHERE from_registry_id = (SELECT id FROM measures_registry WHERE registry_key = 'about_measures_registry')
  AND to_registry_id   = (SELECT id FROM measures_registry WHERE registry_key = 'structural_drift_publication');

-- 2. Deactivate legacy transition: structural_drift_publication -> measures_eval_email_contract

UPDATE measures_transition_rule
SET rule_state = 'inactive'
WHERE from_registry_id = (SELECT id FROM measures_registry WHERE registry_key = 'structural_drift_publication')
  AND to_registry_id   = (SELECT id FROM measures_registry WHERE registry_key = 'measures_eval_email_contract');

-- 3. Create native transition: about_measures_registry -> undrifted

INSERT INTO measures_transition_rule (from_registry_id, to_registry_id, transition_kind, rule_state)
SELECT
  (SELECT id FROM measures_registry WHERE registry_key = 'about_measures_registry'),
  (SELECT id FROM measures_registry WHERE registry_key = 'undrifted'),
  'progression',
  'active';

-- 4. Redirect lapis surface assignments to native key.
-- surface_key values preserved. registry_key and encounter_key updated to undrifted.

UPDATE measures_encounter_surface_assignment
SET
  registry_key  = 'undrifted',
  encounter_key = 'undrifted'
WHERE surface_key IN ('structural_drift_dispatches', 'publication_dispatch')
  AND registry_key = 'structural_drift_publication';

-- 5. Archive structural_drift_publication registry entry.

UPDATE measures_registry
SET
  is_active     = false,
  release_state = 'held',
  access_state  = 'archived',
  metadata = metadata || '{
    "disposition": "legacy_deactivated",
    "replacement_publication_key": "undrifted",
    "replacement_article_key": "structural_drift",
    "deactivated_after_native_route_validation": true,
    "source_oar1": "oar1_validate_native_encounter_routes_before_legacy_deactivation_v1",
    "audit_trace_preserved": true
  }'::jsonb
WHERE registry_key = 'structural_drift_publication';

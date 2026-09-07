-- Deactivate safe legacy registry keys after native route validation.
-- OAR2: oar2_deactivate_safe_legacy_keys_after_native_route_validation_v1
-- Source OAR1: oar1_validate_native_encounter_routes_before_legacy_deactivation_v1
--
-- Disposition: safe_to_deactivate (all 4 keys proven safe by native route validation).
-- bridge-required keys (eval_passage, structural_drift_publication) are NOT touched.

-- 1. structure_passage — already is_active=false, release_state=held. Set access_state=archived, merge metadata.

UPDATE measures_registry
SET
  access_state = 'archived',
  metadata = metadata || '{
    "disposition": "legacy_deactivated",
    "deactivated_after_native_route_validation": true,
    "source_oar1": "oar1_validate_native_encounter_routes_before_legacy_deactivation_v1",
    "audit_trace_preserved": true
  }'::jsonb
WHERE registry_key = 'structure_passage';

-- 2. marble_pathway_reveal — no inbound transitions, no surface assignments, self-acknowledged deprecated.

UPDATE measures_registry
SET
  is_active = false,
  release_state = 'held',
  access_state = 'archived',
  metadata = metadata || '{
    "disposition": "legacy_deactivated",
    "deactivated_after_native_route_validation": true,
    "source_oar1": "oar1_validate_native_encounter_routes_before_legacy_deactivation_v1",
    "audit_trace_preserved": true
  }'::jsonb
WHERE registry_key = 'marble_pathway_reveal';

-- 3. iis_eval_gate1 — no inbound transitions, no surface assignments, self-acknowledged deprecated.
-- measures_iis_eval_gate1_capture table is NOT affected — registry deactivation only.

UPDATE measures_registry
SET
  is_active = false,
  release_state = 'held',
  access_state = 'archived',
  metadata = metadata || '{
    "disposition": "legacy_deactivated",
    "deactivated_after_native_route_validation": true,
    "source_oar1": "oar1_validate_native_encounter_routes_before_legacy_deactivation_v1",
    "audit_trace_preserved": true
  }'::jsonb
WHERE registry_key = 'iis_eval_gate1';

-- 4. crystal_chamber — already release_state=held, inbound only from already-inactive structure_passage.

UPDATE measures_registry
SET
  is_active = false,
  access_state = 'archived',
  metadata = metadata || '{
    "disposition": "legacy_deactivated",
    "deactivated_after_native_route_validation": true,
    "source_oar1": "oar1_validate_native_encounter_routes_before_legacy_deactivation_v1",
    "audit_trace_preserved": true
  }'::jsonb
WHERE registry_key = 'crystal_chamber';

-- 5. Hygiene: deactivate orphaned transition rules where both source and destination are now inactive or held.
-- Allowed per OAR2. evaluate_structure_path→eval_passage NOT touched.

UPDATE measures_transition_rule
SET rule_state = 'inactive'
WHERE from_registry_id = (SELECT id FROM measures_registry WHERE registry_key = 'evaluate_structure_path')
  AND to_registry_id   = (SELECT id FROM measures_registry WHERE registry_key = 'structure_passage');

UPDATE measures_transition_rule
SET rule_state = 'inactive'
WHERE from_registry_id = (SELECT id FROM measures_registry WHERE registry_key = 'structure_passage')
  AND to_registry_id   = (SELECT id FROM measures_registry WHERE registry_key = 'crystal_chamber');

UPDATE measures_transition_rule
SET rule_state = 'inactive'
WHERE from_registry_id = (SELECT id FROM measures_registry WHERE registry_key = 'structure_passage')
  AND to_registry_id   = (SELECT id FROM measures_registry WHERE registry_key = 'connect_src');

UPDATE measures_transition_rule
SET rule_state = 'inactive'
WHERE from_registry_id = (SELECT id FROM measures_registry WHERE registry_key = 'crystal_chamber')
  AND to_registry_id   = (SELECT id FROM measures_registry WHERE registry_key = 'eval_passage');

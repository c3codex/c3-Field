-- Bridge eval_passage legacy traffic to obsidian_chamber_orientation_passage.
-- OAR2: oar2_bridge_eval_passage_legacy_traffic_to_obsidian_orientation_v1
-- Source OAR1: oar1_validate_native_encounter_routes_before_legacy_deactivation_v1
--
-- Native route already proven: evaluate_structure_path -> obsidian_chamber_orientation_passage -> measures_assessment.
-- Deactivate legacy transitions. Redirect surface assignments. Archive eval_passage.

-- 1. Deactivate legacy transition: evaluate_structure_path -> eval_passage

UPDATE measures_transition_rule
SET rule_state = 'inactive'
WHERE from_registry_id = (SELECT id FROM measures_registry WHERE registry_key = 'evaluate_structure_path')
  AND to_registry_id   = (SELECT id FROM measures_registry WHERE registry_key = 'eval_passage');

-- 2. Deactivate legacy transition: eval_passage -> connect_src

UPDATE measures_transition_rule
SET rule_state = 'inactive'
WHERE from_registry_id = (SELECT id FROM measures_registry WHERE registry_key = 'eval_passage')
  AND to_registry_id   = (SELECT id FROM measures_registry WHERE registry_key = 'connect_src');

-- 3. Redirect surface assignments to native key.
-- surface_key values preserved — only registry_key and encounter_key updated.
-- eval_passage and structural_coherence_explainer both pointed to eval_passage encounter;
-- now redirected to obsidian_chamber_orientation_passage.

UPDATE measures_encounter_surface_assignment
SET
  registry_key  = 'obsidian_chamber_orientation_passage',
  encounter_key = 'obsidian_chamber_orientation_passage'
WHERE surface_key IN ('eval_passage', 'structural_coherence_explainer')
  AND registry_key = 'eval_passage';

-- 4. Archive eval_passage registry entry.

UPDATE measures_registry
SET
  is_active     = false,
  release_state = 'held',
  access_state  = 'archived',
  metadata = metadata || '{
    "disposition": "legacy_deactivated",
    "replacement_encounter_key": "obsidian_chamber_orientation_passage",
    "deactivated_after_native_route_validation": true,
    "source_oar1": "oar1_validate_native_encounter_routes_before_legacy_deactivation_v1",
    "audit_trace_preserved": true
  }'::jsonb
WHERE registry_key = 'eval_passage';

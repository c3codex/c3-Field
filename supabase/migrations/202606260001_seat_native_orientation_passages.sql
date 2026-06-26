-- Seat native orientation passage keys before legacy deactivation.
-- OAR2: oar2_seat_native_orientation_passages_before_legacy_deactivation_v1
-- No legacy keys deactivated here. Bridge rules added alongside existing active rules.

-- 1. Registry rows

INSERT INTO measures_registry (
  registry_key,
  display_title,
  registry_family,
  release_state,
  access_state,
  is_active,
  metadata
) VALUES
  (
    'crystal_seat_orientation_passage',
    'Crystal Seat Orientation Passage',
    'spine',
    'released',
    'encounterable',
    true,
    '{"native_architecture": true, "legacy_replaces": "structure_passage"}'::jsonb
  ),
  (
    'obsidian_chamber_orientation_passage',
    'Obsidian Chamber Orientation Passage',
    'spine',
    'released',
    'encounterable',
    true,
    '{"native_architecture": true, "legacy_replaces": "eval_passage"}'::jsonb
  ),
  (
    'marble_chamber_orientation_passage',
    'Marble Chamber Orientation Passage',
    'spine',
    'released',
    'encounterable',
    true,
    '{"native_architecture": true, "legacy_replaces": "marble_pathway_reveal"}'::jsonb
  );

-- 2. Encounter def rows (registry_id via subquery)

INSERT INTO measures_encounter_def (
  registry_id,
  encounter_key,
  display_title,
  encounter_type,
  material_family,
  surface_type,
  is_active,
  metadata
)
SELECT
  r.id,
  'crystal_seat_orientation_passage',
  'Crystal Seat Orientation Passage',
  'view',
  'crystal',
  'threshold',
  true,
  '{
    "native_key": "crystal_seat_orientation_passage",
    "chamber_assignment": "crystal_seat",
    "orientation_role": "crystal_seat_entry",
    "legacy_replaces": "structure_passage",
    "renderer_contract": "StructurePassageSeat",
    "governance_note": "Native orientation passage. Not content. Architecture only.",
    "status_note": "Seated without final public copy. Renderer will present passage gap state until content is seeded."
  }'::jsonb
FROM measures_registry r
WHERE r.registry_key = 'crystal_seat_orientation_passage';

INSERT INTO measures_encounter_def (
  registry_id,
  encounter_key,
  display_title,
  encounter_type,
  material_family,
  surface_type,
  is_active,
  metadata
)
SELECT
  r.id,
  'obsidian_chamber_orientation_passage',
  'Obsidian Chamber Orientation Passage',
  'view',
  'obsidian',
  'threshold',
  true,
  '{
    "native_key": "obsidian_chamber_orientation_passage",
    "chamber_assignment": "obsidian",
    "orientation_role": "obsidian_entry",
    "legacy_replaces": "eval_passage",
    "renderer_contract": "EvalPassage",
    "governance_note": "Native orientation passage. Not content. Architecture only.",
    "status_note": "Seated without final public copy. Renderer will present passage gap state until content is seeded."
  }'::jsonb
FROM measures_registry r
WHERE r.registry_key = 'obsidian_chamber_orientation_passage';

INSERT INTO measures_encounter_def (
  registry_id,
  encounter_key,
  display_title,
  encounter_type,
  material_family,
  surface_type,
  is_active,
  metadata
)
SELECT
  r.id,
  'marble_chamber_orientation_passage',
  'Marble Chamber Orientation Passage',
  'view',
  'marble',
  'threshold',
  true,
  '{
    "native_key": "marble_chamber_orientation_passage",
    "chamber_assignment": "marble",
    "orientation_role": "marble_entry",
    "legacy_replaces": "marble_pathway_reveal",
    "renderer_contract": "MapIntegrityGovernance",
    "governance_note": "Native orientation passage. Not content. Architecture only.",
    "status_note": "Seated without final public copy. Renderer will present governance gap state until content is seeded."
  }'::jsonb
FROM measures_registry r
WHERE r.registry_key = 'marble_chamber_orientation_passage';

-- 3. Surface assignments

INSERT INTO measures_encounter_surface_assignment (
  surface_key,
  registry_key,
  encounter_key,
  material_identity,
  chamber_assignment,
  public_routes
) VALUES
  (
    'crystal_seat_orientation_passage',
    'crystal_seat_orientation_passage',
    'crystal_seat_orientation_passage',
    'crystal',
    'crystal_seat',
    '{}'
  ),
  (
    'obsidian_chamber_orientation_passage',
    'obsidian_chamber_orientation_passage',
    'obsidian_chamber_orientation_passage',
    'obsidian',
    'obsidian',
    '{}'
  ),
  (
    'marble_chamber_orientation_passage',
    'marble_chamber_orientation_passage',
    'marble_chamber_orientation_passage',
    'marble',
    'marble',
    '{}'
  );

-- 4. Transition bridge rules
-- Existing evaluate_structure_path -> eval_passage and -> structure_passage rules are preserved.
-- New rules added alongside. No existing rule is altered.

INSERT INTO measures_transition_rule (
  from_registry_id,
  to_registry_id,
  transition_kind,
  rule_state,
  metadata
)
SELECT
  f.id,
  t.id,
  'progression',
  'active',
  '{"bridge": true, "native_architecture": true, "replaces_legacy_target": "eval_passage"}'::jsonb
FROM measures_registry f, measures_registry t
WHERE f.registry_key = 'evaluate_structure_path'
  AND t.registry_key = 'obsidian_chamber_orientation_passage';

INSERT INTO measures_transition_rule (
  from_registry_id,
  to_registry_id,
  transition_kind,
  rule_state,
  metadata
)
SELECT
  f.id,
  t.id,
  'progression',
  'active',
  '{"bridge": true, "native_architecture": true, "replaces_legacy_target": "structure_passage"}'::jsonb
FROM measures_registry f, measures_registry t
WHERE f.registry_key = 'evaluate_structure_path'
  AND t.registry_key = 'crystal_seat_orientation_passage';

INSERT INTO measures_transition_rule (
  from_registry_id,
  to_registry_id,
  transition_kind,
  rule_state,
  metadata
)
SELECT
  f.id,
  t.id,
  'progression',
  'active',
  '{"native_architecture": true}'::jsonb
FROM measures_registry f, measures_registry t
WHERE f.registry_key = 'obsidian_chamber_orientation_passage'
  AND t.registry_key = 'measures_assessment';

INSERT INTO measures_transition_rule (
  from_registry_id,
  to_registry_id,
  transition_kind,
  rule_state,
  metadata
)
SELECT
  f.id,
  t.id,
  'progression',
  'active',
  '{"native_architecture": true}'::jsonb
FROM measures_registry f, measures_registry t
WHERE f.registry_key = 'crystal_seat_orientation_passage'
  AND t.registry_key = 'about_measures_registry';

INSERT INTO measures_transition_rule (
  from_registry_id,
  to_registry_id,
  transition_kind,
  rule_state,
  metadata
)
SELECT
  f.id,
  t.id,
  'progression',
  'active',
  '{"native_architecture": true}'::jsonb
FROM measures_registry f, measures_registry t
WHERE f.registry_key = 'marble_chamber_orientation_passage'
  AND t.registry_key = 'map_integrity_governance';

-- 5. Activate about_measures_registry

UPDATE measures_registry
SET
  is_active = true,
  release_state = 'released'
WHERE registry_key = 'about_measures_registry';

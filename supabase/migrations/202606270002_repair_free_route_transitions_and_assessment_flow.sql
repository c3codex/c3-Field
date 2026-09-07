-- Repair FREE route transitions and assessment completion flow.
-- OAR2: docs/oar/measures_registry/oar2_repair_free_route_transitions_and_assessment_completion_flow_v1.meta.md
--
-- Route 1: path_choice.right.next_surface = "structure_passage" → "crystal_seat_orientation_passage"
--   structure_passage is deactivated (is_active=false, release_state="held").
--   crystal_seat_orientation_passage is released and active.
--
-- Route 2: crystal_seat_orientation_passage.next_surface = "about_measures_registry"
--   Continue on crystal orientation passage navigates to about.
--
-- Route 3: measures_assessment.next_surface = "obsidian_to_marble_passage_video"
--   "Begin Pathway Review" button triggers MAP-ready passage after assessment result.
--
-- Route 4: obsidian_to_marble_passage_video.next_surface = "map_integrity_governance"
--   Completes passage → MAP route.
--
-- Registry + encounter def for obsidian_to_marble_passage_video also seated here.
-- Surface assignment was seeded in 202606240009. Registry row was missing.
-- No content invented. No authority invented.

-- ============================================================
-- 1. Seat measures_registry row for obsidian_to_marble_passage_video
-- ============================================================

INSERT INTO measures_registry (
  registry_key,
  display_title,
  registry_family,
  release_state,
  access_state,
  is_active,
  metadata
) VALUES (
  'obsidian_to_marble_passage_video',
  'Before the Pathway',
  'spine',
  'released',
  'encounterable',
  true,
  jsonb_build_object(
    'native_architecture', true,
    'passage_role', 'obsidian_to_marble',
    'source_oar2', 'docs/oar/measures_registry/oar2_repair_free_route_transitions_and_assessment_completion_flow_v1.meta.md'
  )
)
ON CONFLICT (registry_key) DO UPDATE
  SET is_active = true,
      release_state = 'released';

-- ============================================================
-- 2. Seat measures_encounter_def row for obsidian_to_marble_passage_video
-- ============================================================

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
  'obsidian_to_marble_passage_video',
  'Before the Pathway',
  'view',
  'obsidian',
  'passage',
  true,
  jsonb_build_object(
    'native_key', 'obsidian_to_marble_passage_video',
    'chamber_assignment', 'obsidian',
    'passage_role', 'obsidian_to_marble',
    'source_oar2', 'docs/oar/measures_registry/oar2_repair_free_route_transitions_and_assessment_completion_flow_v1.meta.md'
  )
FROM measures_registry r
WHERE r.registry_key = 'obsidian_to_marble_passage_video'
  AND NOT EXISTS (
    SELECT 1 FROM measures_encounter_def WHERE encounter_key = 'obsidian_to_marble_passage_video'
  );

-- ============================================================
-- 3. Update encounter_structure transition nodes
-- ============================================================

UPDATE measures_registry
SET metadata = jsonb_set(
  jsonb_set(
    jsonb_set(
      jsonb_set(
        metadata,
        '{encounter_structure,path_choice,right}',
        (metadata #> '{encounter_structure,path_choice,right}') || '{"next_surface": "crystal_seat_orientation_passage"}'::jsonb,
        true
      ),
      '{encounter_structure,crystal_seat_orientation_passage}',
      jsonb_build_object(
        'next_surface', 'about_measures_registry',
        'source_oar2', 'docs/oar/measures_registry/oar2_repair_free_route_transitions_and_assessment_completion_flow_v1.meta.md'
      ),
      true
    ),
    '{encounter_structure,measures_assessment}',
    jsonb_build_object(
      'next_surface', 'obsidian_to_marble_passage_video',
      'source_oar2', 'docs/oar/measures_registry/oar2_repair_free_route_transitions_and_assessment_completion_flow_v1.meta.md'
    ),
    true
  ),
  '{encounter_structure,obsidian_to_marble_passage_video}',
  jsonb_build_object(
    'next_surface', 'map_integrity_governance',
    'source_oar2', 'docs/oar/measures_registry/oar2_repair_free_route_transitions_and_assessment_completion_flow_v1.meta.md'
  ),
  true
),
updated_at = now()
WHERE registry_key = 'measures_registry_root';

-- ============================================================
-- VALIDATION
-- ============================================================

DO $$
BEGIN
  -- obsidian_to_marble_passage_video registry row seated and released
  IF NOT EXISTS (
    SELECT 1 FROM measures_registry
    WHERE registry_key = 'obsidian_to_marble_passage_video'
      AND is_active = true
      AND release_state = 'released'
  ) THEN
    RAISE EXCEPTION 'Validation failed: obsidian_to_marble_passage_video not seated or not released';
  END IF;

  -- path_choice.right updated to crystal_seat_orientation_passage
  IF NOT EXISTS (
    SELECT 1 FROM measures_registry
    WHERE registry_key = 'measures_registry_root'
      AND metadata #>> '{encounter_structure,path_choice,right,next_surface}' = 'crystal_seat_orientation_passage'
  ) THEN
    RAISE EXCEPTION 'Validation failed: path_choice.right.next_surface not updated to crystal_seat_orientation_passage';
  END IF;

  -- crystal_seat_orientation_passage transition node seated
  IF NOT EXISTS (
    SELECT 1 FROM measures_registry
    WHERE registry_key = 'measures_registry_root'
      AND metadata #>> '{encounter_structure,crystal_seat_orientation_passage,next_surface}' = 'about_measures_registry'
  ) THEN
    RAISE EXCEPTION 'Validation failed: crystal_seat_orientation_passage.next_surface not seated';
  END IF;

  -- measures_assessment transition node seated
  IF NOT EXISTS (
    SELECT 1 FROM measures_registry
    WHERE registry_key = 'measures_registry_root'
      AND metadata #>> '{encounter_structure,measures_assessment,next_surface}' = 'obsidian_to_marble_passage_video'
  ) THEN
    RAISE EXCEPTION 'Validation failed: measures_assessment.next_surface not seated';
  END IF;

  -- obsidian_to_marble_passage_video transition node seated
  IF NOT EXISTS (
    SELECT 1 FROM measures_registry
    WHERE registry_key = 'measures_registry_root'
      AND metadata #>> '{encounter_structure,obsidian_to_marble_passage_video,next_surface}' = 'map_integrity_governance'
  ) THEN
    RAISE EXCEPTION 'Validation failed: obsidian_to_marble_passage_video.next_surface not seated';
  END IF;

  -- Prior routing nodes preserved
  IF NOT EXISTS (
    SELECT 1 FROM measures_registry
    WHERE registry_key = 'measures_registry_root'
      AND metadata #>> '{encounter_structure,intro_hook,next_surface}' = 'path_choice'
      AND metadata #>> '{encounter_structure,path_choice,left,next_surface}' = 'eval_passage'
      AND metadata #>> '{encounter_structure,eval_passage,next_surface}' = 'measures_assessment'
  ) THEN
    RAISE EXCEPTION 'Validation failed: prior routing nodes were overwritten';
  END IF;
END $$;

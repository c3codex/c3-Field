-- Seat left/right branch routing on intro_hook transition node.
-- OAR2: docs/oar/measures_registry/oar2_wire_role_call_and_passage_modes_into_free_renderer_v2.meta.md
--
-- Problem: intro_hook has only next_surface = 'path_choice', no left/right branches.
-- resolveBranchSurface() falls back to node.next_surface for both buttons → both go to path_choice.
-- path_choice then shows another path choice → duplicate path-choice experience.
--
-- Fix: seat left/right branches directly on intro_hook so both threshold buttons
-- navigate to the correct destination without passing through path_choice.
--   left  → eval_passage            (Assess the Environment)
--   right → crystal_seat_orientation_passage (Understand the Environment)
--
-- path_choice surface assignment and routing nodes remain intact for direct navigation.

UPDATE measures_registry
SET metadata = jsonb_set(
  jsonb_set(
    metadata,
    '{encounter_structure,intro_hook,left}',
    jsonb_build_object(
      'next_surface',    'eval_passage',
      'threshold_label', 'Assess the Environment',
      'source_oar2',     'docs/oar/measures_registry/oar2_wire_role_call_and_passage_modes_into_free_renderer_v2.meta.md'
    ),
    true
  ),
  '{encounter_structure,intro_hook,right}',
  jsonb_build_object(
    'next_surface',    'crystal_seat_orientation_passage',
    'threshold_label', 'Understand the Environment',
    'source_oar2',     'docs/oar/measures_registry/oar2_wire_role_call_and_passage_modes_into_free_renderer_v2.meta.md'
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

  IF NOT EXISTS (
    SELECT 1 FROM measures_registry
    WHERE registry_key = 'measures_registry_root'
      AND metadata #>> '{encounter_structure,intro_hook,left,next_surface}'  = 'eval_passage'
      AND metadata #>> '{encounter_structure,intro_hook,right,next_surface}' = 'crystal_seat_orientation_passage'
  ) THEN
    RAISE EXCEPTION 'Validation failed: intro_hook branch routing not seated';
  END IF;

  -- Prior intro_hook next_surface preserved
  IF NOT EXISTS (
    SELECT 1 FROM measures_registry
    WHERE registry_key = 'measures_registry_root'
      AND metadata #>> '{encounter_structure,intro_hook,next_surface}' = 'path_choice'
  ) THEN
    RAISE EXCEPTION 'Validation failed: intro_hook.next_surface was overwritten';
  END IF;

  -- path_choice routing preserved
  IF NOT EXISTS (
    SELECT 1 FROM measures_registry
    WHERE registry_key = 'measures_registry_root'
      AND metadata #>> '{encounter_structure,path_choice,left,next_surface}'  = 'eval_passage'
      AND metadata #>> '{encounter_structure,path_choice,right,next_surface}' = 'crystal_seat_orientation_passage'
  ) THEN
    RAISE EXCEPTION 'Validation failed: path_choice routing was overwritten';
  END IF;

END $$;

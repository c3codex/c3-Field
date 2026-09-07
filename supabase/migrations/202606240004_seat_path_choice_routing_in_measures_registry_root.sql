-- Seat path_choice routing nodes in measures_registry_root.encounter_structure.
-- Resolves: clicking either threshold in the Paths surface routes nowhere
--           because encounter_structure.path_choice.left/right.next_surface
--           are not seated. Runtime reads these via governedNodeSurface().
--
-- LEFT  — Assess the Environment → eval_passage (structural drift explainer
--          video before the AI Operations Assessment)
-- RIGHT — Understand the Environment → structure_passage (governed system
--          environments public understand surface)
--
-- Source: docs/oar/measures_registry/oar2_repair_paths_surface_and_threshold_routing_v1.meta.md
-- No src mutation. No threshold content invented. Routing authority only.

UPDATE measures_registry
SET metadata = jsonb_set(
  jsonb_set(
    metadata,
    '{encounter_structure,path_choice,left}',
    jsonb_build_object(
      'next_surface',    'eval_passage',
      'threshold_label', 'Assess the Environment',
      'source_oar2',     'docs/oar/measures_registry/oar2_repair_paths_surface_and_threshold_routing_v1.meta.md'
    ),
    true
  ),
  '{encounter_structure,path_choice,right}',
  jsonb_build_object(
    'next_surface',    'structure_passage',
    'threshold_label', 'Understand the Environment',
    'source_oar2',     'docs/oar/measures_registry/oar2_repair_paths_surface_and_threshold_routing_v1.meta.md'
  ),
  true
),
updated_at = now()
WHERE registry_key = 'measures_registry_root';

-- =====================================================================
-- VALIDATION
-- =====================================================================

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM measures_registry
    WHERE registry_key = 'measures_registry_root'
      AND metadata #>> '{encounter_structure,path_choice,left,next_surface}'  = 'eval_passage'
      AND metadata #>> '{encounter_structure,path_choice,right,next_surface}' = 'structure_passage'
  ) THEN
    RAISE EXCEPTION 'Validation failed: path_choice routing nodes not seated in measures_registry_root';
  END IF;

  -- Confirm intro_hook next_surface is preserved (not overwritten)
  IF NOT EXISTS (
    SELECT 1 FROM measures_registry
    WHERE registry_key = 'measures_registry_root'
      AND metadata #>> '{encounter_structure,intro_hook,next_surface}' = 'path_choice'
  ) THEN
    RAISE EXCEPTION 'Validation failed: intro_hook.next_surface was overwritten';
  END IF;
END $$;

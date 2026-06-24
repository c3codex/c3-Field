-- Seat eval_passage and structure_passage next_surface routing nodes in measures_registry_root.
-- Source: docs/oar/measures_registry/oar2_audit_measures_registry_runtime_and_db_seating_v1.meta.md
--
-- Repairs two broken Continue transitions found during full runtime audit:
--
--   eval_passage (Assess the Environment explainer) → measures_assessment
--     When navigated from path_choice left, activeSurface = "eval_passage".
--     Continue handler falls back to governedNodeSurface(evalPassageNode, "next_surface").
--     Without this node, routeCtaSurface resolves null on root path and Continue is dead.
--
--   structure_passage (Understand the Environment) → about_measures_registry
--     When navigated from path_choice right, activeSurface = "structure_passage".
--     Continue handler reads governedNodeSurface(structurePassageNode, "next_surface").
--     Without this node, Continue was always null and the Understand path was broken.
--
-- Both destinations are already seated. No new public authority created.
-- No content meaning changed. No commerce/cert/conversion/SEAT/DAO/c3 Key standing.

UPDATE measures_registry
SET metadata = jsonb_set(
  jsonb_set(
    metadata,
    '{encounter_structure,eval_passage}',
    jsonb_build_object(
      'next_surface', 'measures_assessment',
      'source_oar2',  'docs/oar/measures_registry/oar2_audit_measures_registry_runtime_and_db_seating_v1.meta.md'
    ),
    true
  ),
  '{encounter_structure,structure_passage}',
  jsonb_build_object(
    'next_surface', 'about_measures_registry',
    'source_oar2',  'docs/oar/measures_registry/oar2_audit_measures_registry_runtime_and_db_seating_v1.meta.md'
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
      AND metadata #>> '{encounter_structure,eval_passage,next_surface}' = 'measures_assessment'
  ) THEN
    RAISE EXCEPTION 'Validation failed: eval_passage.next_surface not seated in measures_registry_root';
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM measures_registry
    WHERE registry_key = 'measures_registry_root'
      AND metadata #>> '{encounter_structure,structure_passage,next_surface}' = 'about_measures_registry'
  ) THEN
    RAISE EXCEPTION 'Validation failed: structure_passage.next_surface not seated in measures_registry_root';
  END IF;

  -- Confirm prior routing nodes are preserved
  IF NOT EXISTS (
    SELECT 1 FROM measures_registry
    WHERE registry_key = 'measures_registry_root'
      AND metadata #>> '{encounter_structure,intro_hook,next_surface}' = 'path_choice'
      AND metadata #>> '{encounter_structure,path_choice,left,next_surface}' = 'eval_passage'
      AND metadata #>> '{encounter_structure,path_choice,right,next_surface}' = 'structure_passage'
  ) THEN
    RAISE EXCEPTION 'Validation failed: existing routing nodes were overwritten';
  END IF;
END $$;

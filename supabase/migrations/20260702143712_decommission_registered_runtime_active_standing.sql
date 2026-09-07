-- Mark measures_registry_runtime as held — no longer active public assessment authority.
-- FREE pipeline (MeasuresRegistryOrchestrator / free_encounter_renderer_v1) is the active path.
-- Source OAR2: oar2_free_cutover_encounterentry_active_assessment_path_v1

UPDATE public.measures_registry
SET
  is_active = false,
  release_state = 'held',
  access_state = 'archived',
  metadata = COALESCE(metadata, '{}'::jsonb) || jsonb_build_object(
    'decommission_standing', 'held_archive',
    'decommission_reason', 'FREE pipeline (free_encounter_renderer_v1) is active public authority. Registered runtime decommissioned from active routing.',
    'source_oar2', 'oar2_free_cutover_encounterentry_active_assessment_path_v1',
    'decommissioned_at', now()::text
  )
WHERE registry_key = 'measures_registry_runtime';

-- Validation
DO $$
BEGIN
  IF EXISTS (
    SELECT 1 FROM public.measures_registry
    WHERE registry_key = 'measures_registry_runtime' AND is_active = true
  ) THEN
    RAISE EXCEPTION 'Validation failed: measures_registry_runtime still active';
  END IF;
END $$;
-- Seat profile assignments in measures_encounter_surface_assignment.metadata JSONB.
-- Source OAR2: docs/oar/measures_registry/oar2_seat_surface_profile_metadata_assignments_v1.meta.md
-- Profiles declared from registry authority. No new tables. No source/CSS/content mutation.

UPDATE public.measures_encounter_surface_assignment
SET metadata = COALESCE(metadata, '{}'::jsonb) || '{"profile":"crystal_split_path_choice"}'::jsonb
WHERE surface_key = 'path_choice';

UPDATE public.measures_encounter_surface_assignment
SET metadata = COALESCE(metadata, '{}'::jsonb) || '{"profile":"crystal_about_surface"}'::jsonb
WHERE surface_key = 'about_measures_registry';

UPDATE public.measures_encounter_surface_assignment
SET metadata = COALESCE(metadata, '{}'::jsonb) || '{"profile":"obsidian_full_bleed_video"}'::jsonb
WHERE surface_key IN ('eval_passage', 'structural_coherence_explainer');

UPDATE public.measures_encounter_surface_assignment
SET metadata = COALESCE(metadata, '{}'::jsonb) || '{"profile":"obsidian_assessment_surface"}'::jsonb
WHERE surface_key = 'measures_assessment';

UPDATE public.measures_encounter_surface_assignment
SET metadata = COALESCE(metadata, '{}'::jsonb) || '{"profile":"obsidian_to_marble_passage"}'::jsonb
WHERE surface_key = 'obsidian_to_marble_passage_video';

UPDATE public.measures_encounter_surface_assignment
SET metadata = COALESCE(metadata, '{}'::jsonb) || '{"profile":"marble_map_cards"}'::jsonb
WHERE surface_key = 'map_integrity_governance';

UPDATE public.measures_encounter_surface_assignment
SET metadata = COALESCE(metadata, '{}'::jsonb) || '{"profile":"lapis_publication_surface"}'::jsonb
WHERE surface_key IN ('structural_drift_dispatches', 'publication_dispatch');

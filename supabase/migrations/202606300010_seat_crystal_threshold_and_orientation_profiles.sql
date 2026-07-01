-- Seat profile assignments for active Crystal threshold and orientation surfaces.
-- Source OAR2: docs/oar/measures_registry/oar2_verify_and_seat_active_crystal_surface_profiles_v1.meta.md
-- Live DB verified before execution: both rows exist as crystal / crystal_seat, metadata null.

UPDATE public.measures_encounter_surface_assignment
SET metadata = COALESCE(metadata, '{}'::jsonb) || '{"profile":"crystal_threshold_hook"}'::jsonb
WHERE surface_key = 'intro_hook';

UPDATE public.measures_encounter_surface_assignment
SET metadata = COALESCE(metadata, '{}'::jsonb) || '{"profile":"crystal_orientation_surface"}'::jsonb
WHERE surface_key = 'intro';

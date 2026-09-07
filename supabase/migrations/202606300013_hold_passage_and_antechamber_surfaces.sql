-- Hold passage and antechamber surfaces so the registry gate matches standing.
-- Source OAR2: docs/oar/measures_registry/oar2_hold_passage_and_antechamber_surfaces_for_secured_scale_v1.meta.md
--
-- BLOCKED (not executed here):
-- obsidian_chamber_orientation_passage cannot be held because the active SEAT surface
-- obsidian_chamber_orientation (formerly structural_coherence_explainer) still carries
-- registry_key = 'obsidian_chamber_orientation_passage' in measures_encounter_surface_assignment.
-- Holding it would fail the release gate for the live Obsidian orientation surface.
-- A separate OAR is required to normalize that surface's registry_key first.
--
-- NOT IN measures_registry (already gate-failed via missing_registry_record):
-- structure_passage, measures_structured_environments, eval_passage, publication_dispatch
-- These have no row in measures_registry — their registry gate already fails. No action needed.

-- Hold crystal_seat_orientation_passage (passage, no active SEAT surface uses this registry_key).
UPDATE public.measures_registry
SET
  is_active = false,
  release_state = 'held'
WHERE registry_key = 'crystal_seat_orientation_passage';

-- Hold marble_chamber_orientation_passage (passage/gap, no active SEAT surface uses this registry_key).
UPDATE public.measures_registry
SET
  is_active = false,
  release_state = 'held'
WHERE registry_key = 'marble_chamber_orientation_passage';

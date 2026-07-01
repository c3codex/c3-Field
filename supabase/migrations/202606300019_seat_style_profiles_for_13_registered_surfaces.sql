-- Seat DB-held style_profile and registered_surface for all 13 registered surfaces.
-- Source OAR2: docs/oar/measures_registry/oar2_seat_db_held_style_profiles_and_css_held_mechanics_for_13_surfaces_v1.meta.md
--
-- Adds metadata.style_profile and metadata.registered_surface to each surface_assignment row.
-- Existing metadata.profile retained as legacy field — not treated as style authority.
-- FREE does not currently read metadata.style_profile — runtime gap reported in OAR1.
-- data-layout-contract attributes remain as legacy CSS infrastructure (not authority).
-- No registered surface identity changed. No CSS changes. No payment/scoring changes.

UPDATE public.measures_encounter_surface_assignment
SET metadata = metadata || '{"registered_surface": "crystal_seat_intro", "style_profile": "media_intro_full_bleed"}'::jsonb
WHERE surface_key = 'crystal_seat_intro';

UPDATE public.measures_encounter_surface_assignment
SET metadata = metadata || '{"registered_surface": "crystal_seat_threshold", "style_profile": "split_threshold_motion_still"}'::jsonb
WHERE surface_key = 'crystal_seat_threshold';

UPDATE public.measures_encounter_surface_assignment
SET metadata = metadata || '{"registered_surface": "crystal_seat_orientation", "style_profile": "talking_head_orientation"}'::jsonb
WHERE surface_key = 'crystal_seat_orientation';

UPDATE public.measures_encounter_surface_assignment
SET metadata = metadata || '{"registered_surface": "crystal_seat_encounter", "style_profile": "public_about_encounter"}'::jsonb
WHERE surface_key = 'crystal_seat_encounter';

UPDATE public.measures_encounter_surface_assignment
SET metadata = metadata || '{"registered_surface": "lapis_chamber_encounter", "style_profile": "publication_index_promoted"}'::jsonb
WHERE surface_key = 'lapis_chamber_encounter';

UPDATE public.measures_encounter_surface_assignment
SET metadata = metadata || '{"registered_surface": "obsidian_chamber_orientation", "style_profile": "media_orientation_full_bleed"}'::jsonb
WHERE surface_key = 'obsidian_chamber_orientation';

UPDATE public.measures_encounter_surface_assignment
SET metadata = metadata || '{"registered_surface": "obsidian_chamber_encounter_surface", "style_profile": "assessment_form_surface"}'::jsonb
WHERE surface_key = 'obsidian_chamber_encounter_surface';

UPDATE public.measures_encounter_surface_assignment
SET metadata = metadata || '{"registered_surface": "obsidian_chamber_C1_compact", "style_profile": "compact_contact_capture"}'::jsonb
WHERE surface_key = 'obsidian_chamber_C1_compact';

UPDATE public.measures_encounter_surface_assignment
SET metadata = metadata || '{"registered_surface": "marble_chamber_orientation", "style_profile": "report_orientation_media"}'::jsonb
WHERE surface_key = 'marble_chamber_orientation';

UPDATE public.measures_encounter_surface_assignment
SET metadata = metadata || '{"registered_surface": "marble_chamber_encounter", "style_profile": "assessment_findings_report"}'::jsonb
WHERE surface_key = 'marble_chamber_encounter';

UPDATE public.measures_encounter_surface_assignment
SET metadata = metadata || '{"registered_surface": "marble_chamber_C2_compact", "style_profile": "map_compact_cards"}'::jsonb
WHERE surface_key = 'marble_chamber_C2_compact';

UPDATE public.measures_encounter_surface_assignment
SET metadata = metadata || '{"registered_surface": "marble_chamber_C2_agreement", "style_profile": "payment_agreement_surface"}'::jsonb
WHERE surface_key = 'marble_chamber_C2_agreement';

UPDATE public.measures_encounter_surface_assignment
SET metadata = metadata || '{"registered_surface": "marble_chamber_C2_resolution", "style_profile": "confirmation_resolution_surface"}'::jsonb
WHERE surface_key = 'marble_chamber_C2_resolution';

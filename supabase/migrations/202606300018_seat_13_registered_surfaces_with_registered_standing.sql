-- Seat all 13 registered surfaces with first-class DB standing.
-- Source OAR2: docs/oar/measures_registry/oar2_seat_all_13_registered_surfaces_hot_through_payment_resolution_v1.meta.md
--
-- Context: 7 surfaces already have full DB standing and hot renderer support.
-- This migration creates measures_registry, measures_encounter_def, and
-- measures_encounter_surface_assignment rows for the 6 that were missing:
--   crystal_seat_intro         → full hot (renderer dispatch added in CrystalSeatRenderer)
--   obsidian_chamber_C1_compact → registered; renderer gap (embedded in assessment flow)
--   marble_chamber_orientation  → registered; renderer gap (no renderer component yet)
--   marble_chamber_encounter    → registered; renderer gap (embedded in passage result)
--   marble_chamber_C2_agreement → registered; renderer gap (embedded in payment flow)
--   marble_chamber_C2_resolution → registered; renderer gap (post-payment confirmation)
--
-- No content invented. No payment logic changed. No passage activated.
-- Gives each surface registered standing — not embedded_only.

-- ============================================================
-- STEP 1: measures_registry rows for 6 missing surfaces
-- ============================================================

INSERT INTO public.measures_registry (
  registry_key,
  display_title,
  registry_family,
  release_state,
  access_state,
  is_active,
  metadata
) VALUES
  (
    'crystal_seat_intro',
    'Crystal Seat Intro',
    'spine',
    'released',
    'encounterable',
    true,
    '{"native_key": "crystal_seat_intro", "chamber_assignment": "crystal_seat", "media": "ai_isnt_broken_intro", "renderer_note": "hook/media intro surface preceding crystal_seat_threshold", "source_oar2": "docs/oar/measures_registry/oar2_seat_all_13_registered_surfaces_hot_through_payment_resolution_v1.meta.md"}'::jsonb
  ),
  (
    'obsidian_chamber_C1_compact',
    'Obsidian Chamber C1 Compact',
    'spine',
    'released',
    'encounterable',
    true,
    '{"native_key": "obsidian_chamber_C1_compact", "chamber_assignment": "obsidian", "compact_role": "contact_capture_compact", "compact_components": ["constraints", "agreements", "resolutions"], "renderer_gap": true, "renderer_gap_reason": "contact capture currently embedded in obsidian_chamber_encounter_surface flow; flow split requires MeasuresAssessment component refactor", "source_oar2": "docs/oar/measures_registry/oar2_seat_all_13_registered_surfaces_hot_through_payment_resolution_v1.meta.md"}'::jsonb
  ),
  (
    'marble_chamber_orientation',
    'Marble Chamber Orientation',
    'spine',
    'released',
    'encounterable',
    true,
    '{"native_key": "marble_chamber_orientation", "chamber_assignment": "marble", "media": "assessment_report_orientation", "renderer_gap": true, "renderer_gap_reason": "no MarbleChamberRenderer dispatch; no renderer component; media assessment_report_orientation seating required", "source_oar2": "docs/oar/measures_registry/oar2_seat_all_13_registered_surfaces_hot_through_payment_resolution_v1.meta.md"}'::jsonb
  ),
  (
    'marble_chamber_encounter',
    'Marble Chamber Encounter',
    'spine',
    'released',
    'encounterable',
    true,
    '{"native_key": "marble_chamber_encounter", "chamber_assignment": "marble", "encounter_role": "assessment_findings_report", "renderer_gap": true, "renderer_gap_reason": "assessment result display currently embedded in obsidian_to_marble_passage_video via PublicAssessmentResult; surface split requires passage refactor", "source_oar2": "docs/oar/measures_registry/oar2_seat_all_13_registered_surfaces_hot_through_payment_resolution_v1.meta.md"}'::jsonb
  ),
  (
    'marble_chamber_C2_agreement',
    'Marble Chamber C2 Agreement',
    'spine',
    'released',
    'encounterable',
    true,
    '{"native_key": "marble_chamber_C2_agreement", "chamber_assignment": "marble", "payment_surface": true, "renderer_gap": true, "renderer_gap_reason": "Stripe payment agreement currently embedded in marble_chamber_C2_compact flow; Stripe logic changes not authorized in this OAR; requires dedicated payment agreement renderer and Stripe session routing", "source_oar2": "docs/oar/measures_registry/oar2_seat_all_13_registered_surfaces_hot_through_payment_resolution_v1.meta.md"}'::jsonb
  ),
  (
    'marble_chamber_C2_resolution',
    'Marble Chamber C2 Resolution',
    'spine',
    'released',
    'encounterable',
    true,
    '{"native_key": "marble_chamber_C2_resolution", "chamber_assignment": "marble", "resolution_role": "payment_confirmation", "renderer_gap": true, "renderer_gap_reason": "post-payment confirmation page; requires Stripe redirect handling and dedicated confirmation renderer; no existing component", "source_oar2": "docs/oar/measures_registry/oar2_seat_all_13_registered_surfaces_hot_through_payment_resolution_v1.meta.md"}'::jsonb
  );

-- ============================================================
-- STEP 2: measures_encounter_def rows for 6 missing surfaces
-- ============================================================

INSERT INTO public.measures_encounter_def (
  registry_id, encounter_key, display_title, encounter_type, material_family, surface_type, is_active, metadata
)
SELECT id, 'crystal_seat_intro', 'Crystal Seat Intro', 'view', 'crystal', 'threshold', true,
  '{"intro_role": "hook_media_intro", "media_role": "intro_hook_video", "renderer": "IntroHookSeat", "renderer_note": "dispatches to IntroHookSeat; plays intro_hook_video; no plaques seated; navigates to crystal_seat_threshold via next_surface", "source_oar2": "docs/oar/measures_registry/oar2_seat_all_13_registered_surfaces_hot_through_payment_resolution_v1.meta.md"}'::jsonb
FROM public.measures_registry WHERE registry_key = 'crystal_seat_intro';

INSERT INTO public.measures_encounter_def (
  registry_id, encounter_key, display_title, encounter_type, material_family, surface_type, is_active, metadata
)
SELECT id, 'obsidian_chamber_C1_compact', 'Obsidian Chamber C1 Compact', 'view', 'obsidian', 'threshold', true,
  '{"compact_role": "contact_capture_compact", "compact_components": ["constraints", "agreements", "resolutions"], "renderer_gap": true, "renderer_gap_note": "registered standing only; renderer not yet implemented; contact capture currently embedded in obsidian_chamber_encounter_surface", "source_oar2": "docs/oar/measures_registry/oar2_seat_all_13_registered_surfaces_hot_through_payment_resolution_v1.meta.md"}'::jsonb
FROM public.measures_registry WHERE registry_key = 'obsidian_chamber_C1_compact';

INSERT INTO public.measures_encounter_def (
  registry_id, encounter_key, display_title, encounter_type, material_family, surface_type, is_active, metadata
)
SELECT id, 'marble_chamber_orientation', 'Marble Chamber Orientation', 'view', 'marble', 'threshold', true,
  '{"orientation_role": "marble_chamber_entry", "media": "assessment_report_orientation", "renderer_gap": true, "renderer_gap_note": "registered standing only; no MarbleChamberRenderer dispatch yet; media seating required", "source_oar2": "docs/oar/measures_registry/oar2_seat_all_13_registered_surfaces_hot_through_payment_resolution_v1.meta.md"}'::jsonb
FROM public.measures_registry WHERE registry_key = 'marble_chamber_orientation';

INSERT INTO public.measures_encounter_def (
  registry_id, encounter_key, display_title, encounter_type, material_family, surface_type, is_active, metadata
)
SELECT id, 'marble_chamber_encounter', 'Marble Chamber Encounter', 'view', 'marble', 'threshold', true,
  '{"encounter_role": "assessment_findings_report", "renderer_gap": true, "renderer_gap_note": "registered standing only; assessment results currently rendered via PublicAssessmentResult in obsidian_to_marble_passage_video; surface split deferred", "source_oar2": "docs/oar/measures_registry/oar2_seat_all_13_registered_surfaces_hot_through_payment_resolution_v1.meta.md"}'::jsonb
FROM public.measures_registry WHERE registry_key = 'marble_chamber_encounter';

INSERT INTO public.measures_encounter_def (
  registry_id, encounter_key, display_title, encounter_type, material_family, surface_type, is_active, metadata
)
SELECT id, 'marble_chamber_C2_agreement', 'Marble Chamber C2 Agreement', 'view', 'marble', 'threshold', true,
  '{"payment_surface": true, "agreement_role": "stripe_payment_agreement", "renderer_gap": true, "renderer_gap_note": "registered standing only; Stripe payment currently embedded in marble_chamber_C2_compact; Stripe logic changes not authorized; dedicated payment renderer required", "source_oar2": "docs/oar/measures_registry/oar2_seat_all_13_registered_surfaces_hot_through_payment_resolution_v1.meta.md"}'::jsonb
FROM public.measures_registry WHERE registry_key = 'marble_chamber_C2_agreement';

INSERT INTO public.measures_encounter_def (
  registry_id, encounter_key, display_title, encounter_type, material_family, surface_type, is_active, metadata
)
SELECT id, 'marble_chamber_C2_resolution', 'Marble Chamber C2 Resolution', 'view', 'marble', 'threshold', true,
  '{"resolution_role": "payment_confirmation", "renderer_gap": true, "renderer_gap_note": "registered standing only; post-payment confirmation requires Stripe redirect handling and dedicated renderer; deferred", "source_oar2": "docs/oar/measures_registry/oar2_seat_all_13_registered_surfaces_hot_through_payment_resolution_v1.meta.md"}'::jsonb
FROM public.measures_registry WHERE registry_key = 'marble_chamber_C2_resolution';

-- ============================================================
-- STEP 3: measures_encounter_surface_assignment rows for 6 missing surfaces
-- ============================================================

INSERT INTO public.measures_encounter_surface_assignment (
  surface_key,
  registry_key,
  encounter_key,
  material_identity,
  chamber_assignment,
  public_routes,
  metadata
) VALUES
  (
    'crystal_seat_intro',
    'crystal_seat_intro',
    'crystal_seat_intro',
    'crystal',
    'crystal_seat',
    '{}',
    '{"profile": "crystal_seat_intro", "source_oar2": "docs/oar/measures_registry/oar2_seat_all_13_registered_surfaces_hot_through_payment_resolution_v1.meta.md"}'::jsonb
  ),
  (
    'obsidian_chamber_C1_compact',
    'obsidian_chamber_C1_compact',
    'obsidian_chamber_C1_compact',
    'obsidian',
    'obsidian',
    '{}',
    '{"profile": "obsidian_chamber_C1_compact", "renderer_gap": true, "source_oar2": "docs/oar/measures_registry/oar2_seat_all_13_registered_surfaces_hot_through_payment_resolution_v1.meta.md"}'::jsonb
  ),
  (
    'marble_chamber_orientation',
    'marble_chamber_orientation',
    'marble_chamber_orientation',
    'marble',
    'marble',
    '{}',
    '{"profile": "marble_chamber_orientation", "renderer_gap": true, "source_oar2": "docs/oar/measures_registry/oar2_seat_all_13_registered_surfaces_hot_through_payment_resolution_v1.meta.md"}'::jsonb
  ),
  (
    'marble_chamber_encounter',
    'marble_chamber_encounter',
    'marble_chamber_encounter',
    'marble',
    'marble',
    '{}',
    '{"profile": "marble_chamber_encounter", "renderer_gap": true, "source_oar2": "docs/oar/measures_registry/oar2_seat_all_13_registered_surfaces_hot_through_payment_resolution_v1.meta.md"}'::jsonb
  ),
  (
    'marble_chamber_C2_agreement',
    'marble_chamber_C2_agreement',
    'marble_chamber_C2_agreement',
    'marble',
    'marble',
    '{}',
    '{"profile": "marble_chamber_C2_agreement", "payment_surface": true, "renderer_gap": true, "source_oar2": "docs/oar/measures_registry/oar2_seat_all_13_registered_surfaces_hot_through_payment_resolution_v1.meta.md"}'::jsonb
  ),
  (
    'marble_chamber_C2_resolution',
    'marble_chamber_C2_resolution',
    'marble_chamber_C2_resolution',
    'marble',
    'marble',
    '{}',
    '{"profile": "marble_chamber_C2_resolution", "renderer_gap": true, "source_oar2": "docs/oar/measures_registry/oar2_seat_all_13_registered_surfaces_hot_through_payment_resolution_v1.meta.md"}'::jsonb
  );

-- OAR2: Launchable path to Marble Chamber entry
-- Source: docs/oar/measures_registry/oar2_launchable_path_to_marble_chamber_entry_v1.meta.md
--
-- STEP 1: Rename media role explainer_video → obsidian.
--   Prior name (structural_coherence_explainer) was an internal object key term.
--   storage_path already corrected to obsidian_chamber_orientation.mp4 in migration 202607010003.
--   Resolver and renderer will be updated to use role "obsidian".
--
-- STEP 2: Seat threshold_copy.plaques in ai_isnt_broken_intro encounter def.
--   Required for crystal_seat_threshold to render L/R animated-to-still layout.
--   Without plaques, IntroHookSeat falls through to held/media-only state.
--
-- STEP 3: Add content_profile.body to obsidian_chamber_orientation encounter def.
--   Provides public-facing orientation copy beneath the subtitle.
--
-- STEP 4: Update encounter_structure obsidian_chamber_orientation.media_role reference
--   from explainer_video to obsidian (informational cleanup in JSONB).
--
-- Transition nodes (obsidian_chamber_C1_compact → marble_chamber_orientation) already
-- correct as of migration 202606300020. No transition repair needed.
-- No scoring, payment, or passage changes.

-- ─── STEP 1: Rename explainer_video → obsidian ───────────────────────────────

UPDATE public.measures_media_map
SET
  media_role = 'obsidian',
  metadata = jsonb_set(
    COALESCE(metadata, '{}'::jsonb),
    '{oar_note}',
    '"Renamed from explainer_video to obsidian per oar2_launchable_path_to_marble_chamber_entry_v1"'::jsonb,
    true
  ),
  updated_at = now()
WHERE media_role = 'explainer_video'
  AND storage_bucket = 'measures-media';

-- ─── STEP 2: Seat threshold_copy.plaques in ai_isnt_broken_intro ─────────────
-- Left: Assess the Environment → obsidian_chamber_orientation
-- Right: Understand the Environment → crystal_seat_orientation

UPDATE public.measures_encounter_def
SET
  metadata = jsonb_set(
    COALESCE(metadata, '{}'::jsonb),
    '{threshold_copy}',
    '{
      "title": "Measures Registry",
      "plaques": [
        {
          "side": "left",
          "body": "Assess the Environment",
          "label": "Assess"
        },
        {
          "side": "right",
          "body": "Understand the Environment",
          "label": "Understand"
        }
      ]
    }'::jsonb,
    true
  ),
  updated_at = now()
WHERE encounter_key = 'ai_isnt_broken_intro';

-- ─── STEP 3: Add content_profile.body to obsidian_chamber_orientation ─────────

UPDATE public.measures_encounter_def
SET
  metadata = jsonb_set(
    COALESCE(metadata, '{}'::jsonb),
    '{content_profile,body}',
    '"The AI Operations Assessment evaluates your organization''s operational environment. The evaluation returns a ranked standing and recommended continuation pathway."'::jsonb,
    true
  ),
  updated_at = now()
WHERE encounter_key = 'obsidian_chamber_orientation';

-- ─── STEP 4: Update encounter_structure obsidian_chamber_orientation.media_role ─

UPDATE public.measures_registry
SET
  metadata = jsonb_set(
    metadata,
    '{encounter_structure,obsidian_chamber_orientation,media_role}',
    '"obsidian"'::jsonb,
    true
  ),
  updated_at = now()
WHERE registry_key = 'measures_registry_root';

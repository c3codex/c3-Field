-- Seat threshold plaques for intro_hook (ai_isnt_broken_intro) and path_choice (evaluate_structure_path).
-- OAR2: inline — user-reported issue: R/L threshold buttons have no copy.
--
-- Root cause: PathChoiceSeat and IntroHookSeat read plaques from encounter def metadata.
--   PathChoiceSeat: meta?.plaques or meta?.hero_paths
--   IntroHookSeat: meta?.threshold_copy?.plaques or meta?.plaques or meta?.hero_paths
-- Neither encounter def has plaques seeded — buttons render with no title or body copy.
--
-- Fix: seat threshold_copy.plaques in ai_isnt_broken_intro and plaques in evaluate_structure_path.
--
-- LEFT  → Assess the Environment (→ eval_passage via intro_hook.left.next_surface)
-- RIGHT → Understand the Environment (→ crystal_seat_orientation_passage)

-- ============================================================
-- 1. ai_isnt_broken_intro — intro_hook surface threshold plaques
-- ============================================================

UPDATE measures_encounter_def
SET metadata = jsonb_set(
  metadata,
  '{threshold_copy}',
  jsonb_build_object(
    'title', 'Choose a path.',
    'plaques', jsonb_build_array(
      jsonb_build_object(
        'side', 'left',
        'body', 'Your operating environment may be fragile. Find out where structural drift exists.',
        'title', 'Assess the Environment',
        'cta',   'Assess the Environment'
      ),
      jsonb_build_object(
        'side', 'right',
        'body', 'Measures Registry establishes governed deployment readiness. Learn how the system works.',
        'title', 'Understand the Environment',
        'cta',   'Understand the Environment'
      )
    )
  ),
  true
)
WHERE encounter_key = 'ai_isnt_broken_intro';

-- ============================================================
-- 2. evaluate_structure_path — path_choice surface plaques
-- ============================================================

UPDATE measures_encounter_def
SET metadata = jsonb_set(
  metadata,
  '{plaques}',
  jsonb_build_array(
    jsonb_build_object(
      'side', 'left',
      'body', 'Your operating environment may be fragile. Find out where structural drift exists.',
      'title', 'Assess the Environment',
      'cta',   'Assess the Environment'
    ),
    jsonb_build_object(
      'side', 'right',
      'body', 'Measures Registry establishes governed deployment readiness. Learn how the system works.',
      'title', 'Understand the Environment',
      'cta',   'Understand the Environment'
    )
  ),
  true
)
WHERE encounter_key = 'evaluate_structure_path';

-- ============================================================
-- VALIDATION
-- ============================================================

DO $$
BEGIN

  IF NOT EXISTS (
    SELECT 1 FROM measures_encounter_def
    WHERE encounter_key = 'ai_isnt_broken_intro'
      AND metadata #>> '{threshold_copy,plaques,0,title}' = 'Assess the Environment'
      AND metadata #>> '{threshold_copy,plaques,1,title}' = 'Understand the Environment'
  ) THEN
    RAISE EXCEPTION 'Validation failed: ai_isnt_broken_intro threshold plaques not seated';
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM measures_encounter_def
    WHERE encounter_key = 'evaluate_structure_path'
      AND metadata #>> '{plaques,0,title}' = 'Assess the Environment'
      AND metadata #>> '{plaques,1,title}' = 'Understand the Environment'
  ) THEN
    RAISE EXCEPTION 'Validation failed: evaluate_structure_path plaques not seated';
  END IF;

END $$;

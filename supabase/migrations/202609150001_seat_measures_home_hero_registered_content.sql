-- Seat approved Measures Registry website hero copy.
-- Source: operator-confirmed NEC hero review, 2026-09-15.
-- Public copy remains DB-authoritative; frontend only renders/positions these fields.

UPDATE public.measures_encounter_def
SET
  metadata = jsonb_set(
    COALESCE(metadata, '{}'::jsonb),
    '{intro_copy}',
    COALESCE(metadata->'intro_copy', '{}'::jsonb) || jsonb_build_object(
      'hero_title', 'Deploy AI with confidence.',
      'hero_body', 'Measures Registry helps organizations evaluate the operating environment before AI is implemented or expanded.',
      'hero_support', 'Find out whether the environment is ready — and what needs attention before deployment.',
      'hero_primary_cta_label', 'Assess the Environment'
    ),
    true
  ),
  updated_at = now()
WHERE encounter_key = 'ai_isnt_broken_intro';

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1
    FROM public.measures_encounter_def
    WHERE encounter_key = 'ai_isnt_broken_intro'
      AND metadata->'intro_copy'->>'hero_title' = 'Deploy AI with confidence.'
      AND metadata->'intro_copy'->>'hero_primary_cta_label' = 'Assess the Environment'
  ) THEN
    RAISE EXCEPTION 'Measures website hero copy seating failed';
  END IF;
END $$;

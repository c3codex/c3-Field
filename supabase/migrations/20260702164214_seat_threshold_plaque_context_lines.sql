UPDATE public.measures_encounter_def
SET metadata = jsonb_set(
  metadata,
  '{threshold_copy,plaques}',
  '[
    {
      "side": "left",
      "body": "Assess the Environment",
      "label": "Assess",
      "context": "Discover how your operating environment shapes AI behavior"
    },
    {
      "side": "right",
      "body": "Understand the Environment",
      "label": "Understand",
      "context": "Explore the governed system of record behind accountable AI operations."
    }
  ]'::jsonb,
  false
),
updated_at = now()
WHERE encounter_key = 'ai_isnt_broken_intro';

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM public.measures_encounter_def
    WHERE encounter_key = 'ai_isnt_broken_intro'
      AND metadata->'threshold_copy'->'plaques'->0->>'context' IS NOT NULL
  ) THEN
    RAISE EXCEPTION 'Validation failed: context not seated on threshold plaques';
  END IF;
END $$;
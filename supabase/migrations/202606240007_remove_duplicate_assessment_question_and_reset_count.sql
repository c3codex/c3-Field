-- Remove duplicate ai_deployment_status question introduced by 202606230010.
-- Source: docs/oar/measures_registry/oar2_repair_assessment_contact_capture_to_marble_passage_transition_v1.meta.md
--
-- Migration 202606230009 established 7 questions with ai_deployment_status as Q1.
-- Migration 202606230010 prepended another ai_deployment_status, creating a
-- duplicate at Q1 and Q2 (8 total) while the runtime constant is 7.
--
-- This migration deduplicates by question_key (keeps first occurrence per key)
-- and resets required_question_count to 7.
--
-- Idempotent: if DB already has 7 unique questions (202606230010 not applied
-- or already corrected), this is a safe no-op for the dedup step.

UPDATE public.measures_encounter_def
SET
  metadata = jsonb_set(
    jsonb_set(
      metadata,
      '{assessment_mechanics,questions}',
      (
        SELECT jsonb_agg(question ORDER BY ordinal)
        FROM (
          SELECT question, ordinal,
            ROW_NUMBER() OVER (
              PARTITION BY question ->> 'question_key'
              ORDER BY ordinal
            ) AS rn
          FROM jsonb_array_elements(metadata #> '{assessment_mechanics,questions}')
            WITH ORDINALITY AS q(question, ordinal)
        ) deduped
        WHERE rn = 1
      ),
      true
    ),
    '{assessment_mechanics,required_question_count}',
    '7'::jsonb,
    true
  ),
  updated_at = now()
WHERE encounter_key = 'measures_assessment';

-- =====================================================================
-- VALIDATION
-- =====================================================================

DO $$
DECLARE
  question_count integer;
  q1_key text;
  has_duplicate boolean;
BEGIN
  SELECT count(*) INTO question_count
  FROM jsonb_array_elements(
    (SELECT metadata #> '{assessment_mechanics,questions}'
     FROM public.measures_encounter_def
     WHERE encounter_key = 'measures_assessment')
  );

  IF question_count <> 7 THEN
    RAISE EXCEPTION 'Assessment question count must equal 7; got %', question_count;
  END IF;

  SELECT question ->> 'question_key' INTO q1_key
  FROM public.measures_encounter_def,
    jsonb_array_elements(metadata #> '{assessment_mechanics,questions}')
      WITH ORDINALITY AS q(question, ordinal)
  WHERE encounter_key = 'measures_assessment'
  ORDER BY ordinal
  LIMIT 1;

  IF q1_key <> 'ai_deployment_status' THEN
    RAISE EXCEPTION 'Assessment Q1 must be ai_deployment_status; got %', q1_key;
  END IF;

  SELECT EXISTS (
    SELECT 1
    FROM public.measures_encounter_def,
      jsonb_array_elements(metadata #> '{assessment_mechanics,questions}') AS question
    WHERE encounter_key = 'measures_assessment'
    GROUP BY question ->> 'question_key'
    HAVING count(*) > 1
  ) INTO has_duplicate;

  IF has_duplicate THEN
    RAISE EXCEPTION 'Duplicate question keys remain after dedup';
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM public.measures_encounter_def
    WHERE encounter_key = 'measures_assessment'
      AND metadata #>> '{assessment_mechanics,required_question_count}' = '7'
  ) THEN
    RAISE EXCEPTION 'required_question_count is not 7 after reset';
  END IF;
END $$;

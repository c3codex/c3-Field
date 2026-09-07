-- Rewrite Assessment Q1 with approved public wording.
-- OAR2: oar2_rewrite_assessment_question_one_ai_use_status_v1
-- Replaces 4-option deployment status question with 3-option AI use status question.
-- question_key preserved as ai_deployment_status for schema compatibility.
-- New condition_tags are contextual-only — do not affect drift scoring.
-- Score thresholds, required_question_count (7), and Q2–Q7 unchanged.

UPDATE measures_encounter_def
SET metadata = jsonb_set(
  metadata,
  '{assessment_mechanics,questions,0}',
  '{
    "question": "How is AI currently being used within your organization?",
    "question_key": "ai_deployment_status",
    "context_label": "AI Use Status",
    "context_statement": "Understanding how AI is currently present in your organization establishes the context for this assessment.",
    "reference_statement": "AI use status establishes the operational context for governed AI review.",
    "options": [
      {
        "label": "We are exploring AI or planning future use.",
        "value": "exploring_or_planning_ai",
        "condition_tags": ["ai_pre_deploy_context"]
      },
      {
        "label": "AI is used indirectly through software and third-party services.",
        "value": "indirect_ai_use",
        "condition_tags": ["ai_indirect_use_context"]
      },
      {
        "label": "AI is actively used in daily operations and decision-making.",
        "value": "active_ai_operations",
        "condition_tags": ["ai_active_operations_context"]
      }
    ]
  }'::jsonb,
  false
)
WHERE encounter_key = 'measures_assessment';

-- Validation
DO $$
DECLARE
  q1 jsonb;
  opt_count int;
  q1_text text;
  q1_key text;
BEGIN
  SELECT question INTO q1
  FROM public.measures_encounter_def,
    jsonb_array_elements(metadata #> '{assessment_mechanics,questions}')
      WITH ORDINALITY AS q(question, ordinal)
  WHERE encounter_key = 'measures_assessment'
  ORDER BY ordinal
  LIMIT 1;

  IF q1 IS NULL THEN
    RAISE EXCEPTION 'Q1 not found in assessment_mechanics.questions';
  END IF;

  q1_text := q1 ->> 'question';
  IF q1_text <> 'How is AI currently being used within your organization?' THEN
    RAISE EXCEPTION 'Q1 question text not updated; got: %', q1_text;
  END IF;

  q1_key := q1 ->> 'question_key';
  IF q1_key <> 'ai_deployment_status' THEN
    RAISE EXCEPTION 'Q1 question_key must remain ai_deployment_status; got: %', q1_key;
  END IF;

  SELECT jsonb_array_length(q1 -> 'options') INTO opt_count;
  IF opt_count <> 3 THEN
    RAISE EXCEPTION 'Q1 must have 3 approved options; got %', opt_count;
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM public.measures_encounter_def
    WHERE encounter_key = 'measures_assessment'
      AND metadata #>> '{assessment_mechanics,required_question_count}' = '7'
  ) THEN
    RAISE EXCEPTION 'required_question_count must remain 7 after Q1 rewrite';
  END IF;
END $$;

-- Route 2: Seat AI Deployment Status as Q1 in assessment_mechanics.questions.
-- Prepend as first question. Existing 7 operational questions become Q2-Q8.
-- Update required_question_count from 7 to 8.
-- condition_tags are contextual only — do not affect drift scoring.
--
-- Route 4: Correct contact capture to identity fields only.
-- Remove ai_deployment_status, website, next_support_question, organization_type.
-- Approved fields: institution_name, contact_name, contact_email, role_title, consent.

-- Route 2a: Prepend AI Deployment Status as Q1
UPDATE measures_encounter_def
SET metadata = jsonb_set(
  metadata,
  '{assessment_mechanics,questions}',
  (
    '[
      {
        "question": "What is your organization''s current AI deployment status?",
        "question_key": "ai_deployment_status",
        "context_label": "AI Deployment Status",
        "context_statement": "Understanding current deployment context establishes the baseline for this assessment.",
        "reference_statement": "Deployment status establishes the operational baseline for governed AI review.",
        "options": [
          {
            "label": "Already using AI in operational workflows.",
            "value": "already_using_ai",
            "condition_tags": ["ai_active_deployment"]
          },
          {
            "label": "Preparing to deploy AI — evaluating options or beginning implementation.",
            "value": "preparing_to_deploy_ai",
            "condition_tags": ["ai_deployment_preparing"]
          },
          {
            "label": "Exploring AI use — early research or awareness stage.",
            "value": "exploring_ai_use",
            "condition_tags": ["ai_deployment_exploring"]
          },
          {
            "label": "Not sure — AI use may be occurring but not yet formally tracked.",
            "value": "not_sure",
            "condition_tags": ["ai_deployment_unknown"]
          }
        ]
      }
    ]'::jsonb || (metadata->'assessment_mechanics'->'questions')
  ),
  true
)
WHERE encounter_key = 'measures_assessment';

-- Route 2b: Update required_question_count to 8
UPDATE measures_encounter_def
SET metadata = jsonb_set(
  metadata,
  '{assessment_mechanics,required_question_count}',
  '8',
  true
)
WHERE encounter_key = 'measures_assessment';

-- Route 2c: Update oar1_payload_schema question_count to 8
UPDATE measures_encounter_def
SET metadata = jsonb_set(
  metadata,
  '{assessment_contact_capture_oar1_binding_contract_v1,oar1_payload_schema,action,question_count}',
  '8',
  true
)
WHERE encounter_key = 'measures_assessment';

-- Route 4: Remove non-identity fields from contact capture form.
-- Approved: institution_name, contact_name, contact_email, role_title only.
-- Removed: ai_deployment_status (now Q1), website, next_support_question, organization_type.
UPDATE measures_encounter_def
SET metadata = jsonb_set(
  metadata,
  '{assessment_contact_capture_oar1_binding_contract_v1,post_assessment_contact_form,fields}',
  (
    SELECT jsonb_agg(field)
    FROM jsonb_array_elements(
      metadata->'assessment_contact_capture_oar1_binding_contract_v1'->'post_assessment_contact_form'->'fields'
    ) AS field
    WHERE field->>'field_key' NOT IN (
      'ai_deployment_status',
      'website',
      'next_support_question',
      'organization_type'
    )
  ),
  true
)
WHERE encounter_key = 'measures_assessment';

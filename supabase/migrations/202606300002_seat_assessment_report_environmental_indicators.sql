-- Seat Key Environmental Indicators and Informational Notice in assessment report contract.
-- OAR2 Addendum: oar2_addendum_assessment_report_key_environmental_indicators_v1
-- Seats sub-keys in assessment_evaluation_report_contract_v1 of measures_assessment encounter def.
-- Does not alter assessment_interpretation, scoring_thresholds, standing_key, or MAP pathway mapping.

-- 1. Seat informational_notice (multi-paragraph, stored as array of strings)
UPDATE measures_encounter_def
SET metadata = jsonb_set(
  metadata,
  '{assessment_evaluation_report_contract_v1,informational_notice}',
  '[
    "This initial assessment is informational and is provided by Measures Registry to identify environmental conditions that may influence AI governance, review, accountability, and operational stability.",
    "The assessment is not a certification, professional advice, legal advice, technical instruction, or a corrective action plan. Assessment findings are directional and intended to support further environmental review and understanding.",
    "From the professional viewpoint of Measures Registry, AI outcomes cannot be understood through tools alone. AI systems operate within environments composed of workflows, roles, approvals, data, outputs, and decisions.",
    "Environmental conditions influence whether AI activity remains governable, fragmented, or susceptible to structural drift. Assessment findings should therefore be understood as indicators of environmental conditions rather than judgments of organizational capability or readiness."
  ]'::jsonb,
  true
)
WHERE encounter_key = 'measures_assessment';

-- 2. Seat recommendation
UPDATE measures_encounter_def
SET metadata = jsonb_set(
  metadata,
  '{assessment_evaluation_report_contract_v1,recommendation}',
  '"MAP the Environment to review the operating conditions behind these findings and determine the appropriate governed pathway."'::jsonb,
  true
)
WHERE encounter_key = 'measures_assessment';

-- 3. Seat key_environmental_indicators_label
UPDATE measures_encounter_def
SET metadata = jsonb_set(
  metadata,
  '{assessment_evaluation_report_contract_v1,key_environmental_indicators_label}',
  '"Key Environmental Indicators"'::jsonb,
  true
)
WHERE encounter_key = 'measures_assessment';

-- 4. Seat environmental_indicator_map (approved finding_key → statement reference)
UPDATE measures_encounter_def
SET metadata = jsonb_set(
  metadata,
  '{assessment_evaluation_report_contract_v1,environmental_indicator_map}',
  '[
    {
      "finding_key": "fragmented_operational_procedures",
      "statement": "Operational procedures may not be consistently defined across AI-related activities."
    },
    {
      "finding_key": "undefined_role_assignments",
      "statement": "Roles and decision authority may not be clearly established for AI-related activities."
    },
    {
      "finding_key": "unbounded_ai_processes",
      "statement": "AI activities may be occurring without clearly defined review or accountability pathways."
    },
    {
      "finding_key": "system_environment_inconsistency",
      "statement": "AI-related processes may be occurring across environments that are not consistently aligned."
    },
    {
      "finding_key": "unbounded_automation_exposure",
      "statement": "Automation boundaries and review practices may not yet be sufficiently governed."
    }
  ]'::jsonb,
  true
)
WHERE encounter_key = 'measures_assessment';

-- 5. Seat condition_indicator_map (condition_tag → approved statement for fallback derivation)
--    Used by renderer when report.findings is empty.
--    critical_ai_drift → unbounded_ai_processes
--    emerging_ai_drift → undefined_role_assignments
--    probable_ai_drift → fragmented_operational_procedures
--    governed_review   → unbounded_automation_exposure
UPDATE measures_encounter_def
SET metadata = jsonb_set(
  metadata,
  '{assessment_evaluation_report_contract_v1,condition_indicator_map}',
  '{
    "critical_ai_drift_condition": "AI activities may be occurring without clearly defined review or accountability pathways.",
    "emerging_ai_drift_condition": "Roles and decision authority may not be clearly established for AI-related activities.",
    "probable_ai_drift_condition": "Operational procedures may not be consistently defined across AI-related activities.",
    "governed_review_condition": "Automation boundaries and review practices may not yet be sufficiently governed."
  }'::jsonb,
  true
)
WHERE encounter_key = 'measures_assessment';

-- Validation: confirm all five keys seated
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM measures_encounter_def
    WHERE encounter_key = 'measures_assessment'
      AND metadata #> '{assessment_evaluation_report_contract_v1,informational_notice}' IS NOT NULL
      AND metadata #> '{assessment_evaluation_report_contract_v1,recommendation}' IS NOT NULL
      AND metadata #> '{assessment_evaluation_report_contract_v1,key_environmental_indicators_label}' IS NOT NULL
      AND metadata #> '{assessment_evaluation_report_contract_v1,environmental_indicator_map}' IS NOT NULL
      AND metadata #> '{assessment_evaluation_report_contract_v1,condition_indicator_map}' IS NOT NULL
  ) THEN
    RAISE EXCEPTION 'Validation failed: one or more environmental indicator keys not seated in assessment_evaluation_report_contract_v1';
  END IF;
END $$;

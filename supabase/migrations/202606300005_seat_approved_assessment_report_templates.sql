-- Seat approved public assessment report template copy.
-- OAR2: oar2_seat_approved_assessment_report_templates_v1
-- Resolves HOLD: oar1_align_assessment_report_wording_to_scored_results_v1
-- Targets: measures_encounter_def.metadata.assessment_evaluation_report_contract_v1
-- No scoring changes. No assessment capture changes. No MAP mapping changes.

-- 1. Seat report_header
UPDATE measures_encounter_def
SET metadata = jsonb_set(
  metadata,
  '{assessment_evaluation_report_contract_v1,report_header}',
  '{
    "title": "Initial Environmental Assessment Findings",
    "subtitle": "An informational review of environmental conditions that may influence AI governance, review, accountability, and operational stability."
  }'::jsonb,
  true
)
WHERE encounter_key = 'measures_assessment';

-- 2. Seat report_templates (eval_result_01 through eval_result_04)
UPDATE measures_encounter_def
SET metadata = jsonb_set(
  metadata,
  '{assessment_evaluation_report_contract_v1,report_templates}',
  '{
    "eval_result_01": {
      "report_title": "Emerging AI Environment",
      "summary": "Your responses indicate an AI environment that may still be forming. Governance conditions appear early-stage, with some structures present but not yet fully defined across roles, review pathways, accountability, and operating procedures."
    },
    "eval_result_02": {
      "report_title": "Fragmented AI Environment",
      "summary": "Your responses indicate signs of environmental fragmentation. AI activity may be present across tools, workflows, or teams, while authority, review practices, role clarity, or accountability pathways may not yet be consistently aligned."
    },
    "eval_result_03": {
      "report_title": "Structural Drift Detected",
      "summary": "Your responses indicate structural drift conditions. AI activity may be operating in an environment where procedures, responsibilities, review pathways, or automation boundaries are not sufficiently aligned to the systems they affect."
    },
    "eval_result_04": {
      "report_title": "High-Exposure Structural Drift",
      "summary": "Your responses indicate high-exposure structural drift conditions. AI activity may be interacting with sensitive workflows, decisions, approvals, or operational dependencies without sufficient environmental governance or review structure."
    }
  }'::jsonb,
  true
)
WHERE encounter_key = 'measures_assessment';

-- 3. Seat report_boundary_note
UPDATE measures_encounter_def
SET metadata = jsonb_set(
  metadata,
  '{assessment_evaluation_report_contract_v1,report_boundary_note}',
  '"Assessment findings are informational and directional. They are intended to support further environmental review and understanding and do not constitute certification, professional advice, or corrective instruction."'::jsonb,
  true
)
WHERE encounter_key = 'measures_assessment';

-- 4. Seat report_cta
UPDATE measures_encounter_def
SET metadata = jsonb_set(
  metadata,
  '{assessment_evaluation_report_contract_v1,report_cta}',
  '{"label": "MAP the Environment"}'::jsonb,
  true
)
WHERE encounter_key = 'measures_assessment';

-- Validation
DO $$
DECLARE
  contract jsonb;
BEGIN
  SELECT metadata -> 'assessment_evaluation_report_contract_v1' INTO contract
  FROM measures_encounter_def
  WHERE encounter_key = 'measures_assessment';

  IF contract IS NULL THEN
    RAISE EXCEPTION 'assessment_evaluation_report_contract_v1 not found';
  END IF;

  IF contract -> 'report_header' ->> 'title' IS NULL THEN
    RAISE EXCEPTION 'report_header.title not seated';
  END IF;

  IF (contract -> 'report_templates' -> 'eval_result_01' ->> 'report_title') IS NULL THEN
    RAISE EXCEPTION 'report_templates.eval_result_01 not seated';
  END IF;
  IF (contract -> 'report_templates' -> 'eval_result_02' ->> 'report_title') IS NULL THEN
    RAISE EXCEPTION 'report_templates.eval_result_02 not seated';
  END IF;
  IF (contract -> 'report_templates' -> 'eval_result_03' ->> 'report_title') IS NULL THEN
    RAISE EXCEPTION 'report_templates.eval_result_03 not seated';
  END IF;
  IF (contract -> 'report_templates' -> 'eval_result_04' ->> 'report_title') IS NULL THEN
    RAISE EXCEPTION 'report_templates.eval_result_04 not seated';
  END IF;

  IF contract ->> 'report_boundary_note' IS NULL THEN
    RAISE EXCEPTION 'report_boundary_note not seated';
  END IF;

  IF contract -> 'report_cta' ->> 'label' IS NULL THEN
    RAISE EXCEPTION 'report_cta.label not seated';
  END IF;
END $$;

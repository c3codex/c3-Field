-- Seat assessment consent contract for launch.
-- OAR2: oar2_seat_assessment_consent_contract_before_launch_v1
--
-- Gap identified in oar1_seat_public_legal_surfaces_before_launch_v1:
--   approved_content_contract.assessment_contact_capture_contract is null.
--   Consent behavior exists in code but copy is not DB-governed.
--
-- This migration:
--   1. Seats approved_content_contract.assessment_contact_capture_contract (governance record).
--   2. Seats consent_fields in oar1 binding contract (renderer reads this path).
--   3. Seats optional_opt_in_fields in oar1 binding contract.
--   4. Seats assessment_submission_notice, standing_boundary_note,
--      privacy_notice, and terms_notice in oar1 binding contract.
--
-- Nothing invented. All copy sourced from OAR2 directive.
-- No consent is preselected. No certification implied. No SEAT standing implied.

-- 1. Seat governance record at approved_content_contract.assessment_contact_capture_contract.
--    Uses COALESCE to safely initialize approved_content_contract if absent.

UPDATE measures_encounter_def
SET metadata = jsonb_set(
  jsonb_set(
    metadata,
    '{approved_content_contract}',
    COALESCE(metadata->'approved_content_contract', '{}'::jsonb),
    true
  ),
  '{approved_content_contract,assessment_contact_capture_contract}',
  '{
    "assessment_submission_notice": "By submitting this assessment, you agree that Measures Registry may store your responses and contact information to provide assessment results and related follow-up.",
    "assessment_result_email_consent": {
      "label": "Send my assessment results and related follow-up by email.",
      "required": true,
      "default_checked": false
    },
    "measures_registry_updates_opt_in": {
      "label": "I would like to receive occasional Measures Registry updates.",
      "required": false,
      "default_checked": false
    },
    "privacy_notice": "Your information is handled according to the Measures Registry Privacy Policy.",
    "terms_notice": "Use of this assessment is subject to the Measures Registry Terms of Use.",
    "boundary_notice": "Assessment results are informational and do not create certification, SEAT standing, c3 Key issuance, or professional advice.",
    "contact_email": "connect@measuresregistry.com",
    "source_oar2": "docs/oar/measures_registry/oar2_seat_assessment_consent_contract_before_launch_v1.meta.md"
  }'::jsonb,
  true
)
WHERE encounter_key = 'measures_assessment';

-- 2. Seat consent_fields in oar1 binding contract.
--    Renderer reads assessment_contact_capture_oar1_binding_contract_v1.consent_fields.

UPDATE measures_encounter_def
SET metadata = jsonb_set(
  metadata,
  '{assessment_contact_capture_oar1_binding_contract_v1,consent_fields}',
  '[
    {
      "field_key": "assessment_result_email_consent",
      "public_label": "Send my assessment results and related follow-up by email.",
      "type": "checkbox",
      "required": true,
      "default_checked": false
    }
  ]'::jsonb,
  true
)
WHERE encounter_key = 'measures_assessment';

-- 3. Seat optional_opt_in_fields in oar1 binding contract.

UPDATE measures_encounter_def
SET metadata = jsonb_set(
  metadata,
  '{assessment_contact_capture_oar1_binding_contract_v1,optional_opt_in_fields}',
  '[
    {
      "field_key": "measures_registry_updates_opt_in",
      "public_label": "I would like to receive occasional Measures Registry updates.",
      "type": "checkbox",
      "required": false,
      "default_checked": false
    }
  ]'::jsonb,
  true
)
WHERE encounter_key = 'measures_assessment';

-- 4. Seat assessment_submission_notice in oar1 binding contract.

UPDATE measures_encounter_def
SET metadata = jsonb_set(
  metadata,
  '{assessment_contact_capture_oar1_binding_contract_v1,assessment_submission_notice}',
  '"By submitting this assessment, you agree that Measures Registry may store your responses and contact information to provide assessment results and related follow-up."'::jsonb,
  true
)
WHERE encounter_key = 'measures_assessment';

-- 5. Seat standing_boundary_note in oar1 binding contract.
--    Renderer reads this key with fallback; now DB-governed.

UPDATE measures_encounter_def
SET metadata = jsonb_set(
  metadata,
  '{assessment_contact_capture_oar1_binding_contract_v1,standing_boundary_note}',
  '"Assessment results are informational and do not create certification, SEAT standing, c3 Key issuance, or professional advice."'::jsonb,
  true
)
WHERE encounter_key = 'measures_assessment';

-- 6. Seat privacy_notice in oar1 binding contract.

UPDATE measures_encounter_def
SET metadata = jsonb_set(
  metadata,
  '{assessment_contact_capture_oar1_binding_contract_v1,privacy_notice}',
  '"Your information is handled according to the Measures Registry Privacy Policy."'::jsonb,
  true
)
WHERE encounter_key = 'measures_assessment';

-- 7. Seat terms_notice in oar1 binding contract.

UPDATE measures_encounter_def
SET metadata = jsonb_set(
  metadata,
  '{assessment_contact_capture_oar1_binding_contract_v1,terms_notice}',
  '"Use of this assessment is subject to the Measures Registry Terms of Use."'::jsonb,
  true
)
WHERE encounter_key = 'measures_assessment';

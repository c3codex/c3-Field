-- Seat post_assessment_contact_form.fields with identity fields.
-- OAR2: docs/oar/measures_registry/oar2_wire_role_call_and_passage_modes_into_free_renderer_v2.meta.md
--
-- Root cause: 202606230010 tried to filter existing fields but they were never
-- initially seeded. jsonb_agg of an empty result returns null → fields = null.
-- Result: contact_capture form showed only checkboxes, no identity fields.
-- Capture insert received empty institution_name, contact_name, contact_email.
--
-- Fix: seat the four approved identity fields directly.
-- Approved fields (from 202606230010 directive):
--   institution_name, contact_name, contact_email, role_title
-- Removed at source: ai_deployment_status, website, next_support_question, organization_type

UPDATE measures_encounter_def
SET metadata = jsonb_set(
  metadata,
  '{assessment_contact_capture_oar1_binding_contract_v1,post_assessment_contact_form,fields}',
  '[
    {
      "field_key": "institution_name",
      "public_label": "Organization Name",
      "type": "text",
      "required": true
    },
    {
      "field_key": "contact_name",
      "public_label": "Your Name",
      "type": "text",
      "required": true
    },
    {
      "field_key": "contact_email",
      "public_label": "Email Address",
      "type": "email",
      "required": true
    },
    {
      "field_key": "role_title",
      "public_label": "Role or Title",
      "type": "text",
      "required": false
    }
  ]'::jsonb,
  true
)
WHERE encounter_key = 'measures_assessment';

-- ============================================================
-- VALIDATION
-- ============================================================

DO $$
DECLARE
  field_count int;
  first_key text;
BEGIN

  SELECT
    jsonb_array_length(
      metadata->'assessment_contact_capture_oar1_binding_contract_v1'->'post_assessment_contact_form'->'fields'
    ),
    metadata #>> '{assessment_contact_capture_oar1_binding_contract_v1,post_assessment_contact_form,fields,0,field_key}'
  INTO field_count, first_key
  FROM measures_encounter_def
  WHERE encounter_key = 'measures_assessment';

  IF field_count IS NULL OR field_count < 3 THEN
    RAISE EXCEPTION 'Validation failed: post_assessment_contact_form.fields not seated (count = %)', field_count;
  END IF;

  IF first_key != 'institution_name' THEN
    RAISE EXCEPTION 'Validation failed: first field is not institution_name (got %)', first_key;
  END IF;

  -- Confirm prior consent_fields preserved
  IF NOT EXISTS (
    SELECT 1 FROM measures_encounter_def
    WHERE encounter_key = 'measures_assessment'
      AND metadata #>> '{assessment_contact_capture_oar1_binding_contract_v1,consent_fields,0,field_key}'
          = 'assessment_result_email_consent'
  ) THEN
    RAISE EXCEPTION 'Validation failed: consent_fields disturbed';
  END IF;

END $$;

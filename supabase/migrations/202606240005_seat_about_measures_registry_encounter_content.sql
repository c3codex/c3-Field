-- Seat About Measures Registry encounter content — full OAR2 structure.
-- Source: docs/oar/measures_registry/oar2_fix_about_measures_registry_encounter_v1.meta.md
--
-- Replaces approved_content_contract with expanded structure:
--   codexstone_seal_section  — Codexstone Seal / registry explainer (first)
--   title                    — About Measures Registry
--   orientation_sections     — Objective / Action / Result public structure
--   undrifted_bridge_section — unDrifted panel link
--   connect_section          — Connect role call (form fields)
--
-- Uses || merge to preserve all other existing metadata keys.
-- Does NOT hardcode copy in src. Content is DB-governed.

UPDATE measures_encounter_def
SET
  metadata = metadata || jsonb_build_object(
    'approved_content_contract', jsonb_build_object(
      'title', 'About Measures Registry',
      'codexstone_seal_section', jsonb_build_object(
        'title', 'Measures Registry',
        'subtitle', 'AI outcomes reflect the systems AI operates within.',
        'standing', 'public'
      ),
      'orientation_sections', jsonb_build_array(
        jsonb_build_object(
          'label', 'Objective',
          'copy', 'AI systems are not the problem. The environments they operate within are. Unstructured authority, undefined roles, absent review pathways, and ungoverned runtime surfaces produce drift — not design.'
        ),
        jsonb_build_object(
          'label', 'Action',
          'copy', 'Measures Registry structures assessment, accountability, and governed optimization across institutional AI environments. It defines the system conditions that shape AI behavior and builds the review pathways required to address them.'
        ),
        jsonb_build_object(
          'label', 'Result',
          'copy', 'Institutions operating through Measures Registry gain AI environments that are accountable, reviewable, and less drift-prone — not through AI model changes, but through the institutional systems that determine AI behavior.'
        )
      ),
      'undrifted_bridge_section', jsonb_build_object(
        'label', 'unDrifted',
        'subtitle', 'The publication for governed system environments.',
        'issue_label', 'Issue 001',
        'headline', 'AI Isn''t Broken. Systems Are.',
        'cta_label', 'Read Issue →',
        'cta_url', '/undrifted',
        'standing', 'public'
      ),
      'connect_section', jsonb_build_object(
        'title', 'Connect',
        'body', 'Request a leadership conversation.',
        'supporting_copy', jsonb_build_array(
          'Measures Registry works with organizations seeking greater accountability, clearer authority, and better outcomes from AI systems.',
          'Whether assessing current operations, exploring governance structures, or preparing for larger implementation decisions, the first step is a conversation.'
        ),
        'fields', jsonb_build_array(
          jsonb_build_object('field_key', 'name', 'label', 'Name', 'type', 'text', 'required', true),
          jsonb_build_object('field_key', 'organization', 'label', 'Organization', 'type', 'text', 'required', true),
          jsonb_build_object('field_key', 'email', 'label', 'Email', 'type', 'email', 'required', true),
          jsonb_build_object('field_key', 'message', 'label', 'Message', 'type', 'textarea', 'required', false)
        ),
        'cta_label', 'Request Conversation',
        'success_title', 'Received.',
        'success_copy', 'Your request has been seated. A member of the Measures Registry team will follow up.',
        'standing', 'public'
      ),
      'source_oar2', 'docs/oar/measures_registry/oar2_fix_about_measures_registry_encounter_v1.meta.md'
    )
  ),
  updated_at = now()
WHERE encounter_key = 'about_measures_registry';

-- =====================================================================
-- VALIDATION
-- =====================================================================

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM measures_encounter_def
    WHERE encounter_key = 'about_measures_registry'
      AND metadata #>> '{approved_content_contract,title}' = 'About Measures Registry'
  ) THEN
    RAISE EXCEPTION 'Validation failed: about_measures_registry approved_content_contract.title not seated';
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM measures_encounter_def
    WHERE encounter_key = 'about_measures_registry'
      AND metadata #>> '{approved_content_contract,codexstone_seal_section,title}' = 'Measures Registry'
  ) THEN
    RAISE EXCEPTION 'Validation failed: codexstone_seal_section.title not seated';
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM measures_encounter_def
    WHERE encounter_key = 'about_measures_registry'
      AND metadata #>> '{approved_content_contract,undrifted_bridge_section,cta_url}' = '/undrifted'
  ) THEN
    RAISE EXCEPTION 'Validation failed: undrifted_bridge_section.cta_url not seated';
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM measures_encounter_def
    WHERE encounter_key = 'about_measures_registry'
      AND metadata #>> '{approved_content_contract,connect_section,title}' = 'Connect'
  ) THEN
    RAISE EXCEPTION 'Validation failed: connect_section.title not seated';
  END IF;
END $$;

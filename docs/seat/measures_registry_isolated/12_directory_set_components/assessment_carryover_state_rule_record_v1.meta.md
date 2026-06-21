---
document_type: directory_set_component_record
authority_level: local_documentation
system_scope: measures_codex
title: Assessment Carryover State Rule Record v1
status: seated
version: v1
source_oar2: docs/seat/measures_registry_isolated/09_oar/oar2_addendum_seat_obsidian_assessment_landing_assessment_and_contact_capture_style_profiles_v1.meta.md
---

# Assessment Carryover State Rule Record v1

standing:
  status: required_before_revised_SEAT_upload_manifest_confirmation
  mutation_authorized: false
  db_mutation_authorized: false
  runtime_mutation_authorized: false

carryover_rule:
  source_surface:
    - ai_operations_assessment
    - assessment_contact_capture
    - assessment_orientation

  target_surface:
    - marble_report_surface

  required_state:
    - assessment_completed
    - contact_capture_submitted
    - assessment_orientation_loaded_or_completed
    - assessment_state_available

  preserved_state:
    - selected_answers
    - AI_Deployment_Status
    - organization_scope_modifier
    - assessment_risk_factor_inputs
    - contact_permission
    - email_confirmation_state

  marble_reveal_boundary:
    findings_reveal_in_marble_only: true
    review_determination_in_marble_only: true
    recommended_MAP_path_in_marble_only: true

  no_rescore:
    assessment_answers_are_carried_not_rescored: true

rule:
  plain_language: Assessment carryover moves assessment state from Obsidian into Marble. It does not reveal findings, rescore the assessment, or activate payment or held authority.

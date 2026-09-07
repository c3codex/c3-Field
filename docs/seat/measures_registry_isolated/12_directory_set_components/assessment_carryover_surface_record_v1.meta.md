---
document_type: directory_set_component_record
authority_level: local_documentation
system_scope: measures_codex
title: Assessment Carryover Surface Record v1
status: seated
version: v1
source_oar2: docs/seat/measures_registry_isolated/09_oar/oar2_addendum_seat_obsidian_assessment_landing_assessment_and_contact_capture_style_profiles_v1.meta.md
---

# Assessment Carryover Surface Record v1

standing:
  status: required_before_revised_SEAT_upload_manifest_confirmation
  mutation_authorized: false
  db_mutation_authorized: false
  runtime_mutation_authorized: false
  bucket_upload_authorized_now: false
  email_send_authorized_now: false

surface:
  surface_key: assessment_carryover
  chamber_authority: transition
  surface_type: assessment_state_carryover
  placement: after_assessment_orientation_before_marble_report
  function:
    - preserve_assessment_state
    - carry_contact_permission_state
    - load_marble_report_surface
    - prevent_rescoring_inside_marble

source_state:
  - assessment_answers
  - assessment_completion_state
  - AI_Deployment_Status
  - organization_scope_modifier
  - contact_capture_state
  - email_confirmation_state
  - passage_ready_state

loads:
  - marble_report_surface
  - findings_reveal

does_not:
  - rescore_assessment
  - reveal_findings_inside_obsidian
  - create_payment
  - activate_MAP_enrollment
  - activate_SEAT
  - activate_SEAL
  - claim_Registry_Standing
  - assign_c3_Key
  - activate_DAO_participation

blocked:
  - public_results_display_inside_obsidian
  - top_3_risk_factors_inside_obsidian
  - review_determination_inside_obsidian
  - recommended_MAP_path_inside_obsidian

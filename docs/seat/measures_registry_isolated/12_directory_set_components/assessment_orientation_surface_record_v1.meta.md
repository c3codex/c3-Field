---
document_type: directory_set_component_record
authority_level: local_documentation
system_scope: measures_codex
title: Assessment Orientation Surface Record v1
status: seated
version: v1
source_oar2: docs/seat/measures_registry_isolated/09_oar/oar2_addendum_seat_obsidian_assessment_landing_assessment_and_contact_capture_style_profiles_v1.meta.md
---

# Assessment Orientation Surface Record v1

standing:
  status: required_before_revised_SEAT_upload_manifest_confirmation
  mutation_authorized: false
  db_mutation_authorized: false
  runtime_mutation_authorized: false
  bucket_upload_authorized_now: false
  email_send_authorized_now: false

surface:
  surface_key: assessment_orientation
  chamber_authority: obsidian
  surface_type: post_assessment_orientation
  placement: after_assessment_contact_capture_before_assessment_carryover
  function:
    - orient_user_after_contact_capture
    - hold_user_on_page_while_report_prepares
    - preserve_assessment_state_before_marble_reveal

media:
  media_key: assessment_report_orientation
  filename: assessment_report_orientation.mp4
  bucket_status: already_named_or_operator_to_confirm
  role: post_assessment_orientation_video
  treatment:
    - video_first
    - sparse_copy_overlay
    - no_header
    - no_findings_display

copy:
  headline: Your AI Environment Assessment Review is being prepared.
  instruction: Remain on this page while your report loads.
  support_line: Your assessment state is being carried forward for review.

CTA:
  label: Continue when ready
  visibility: optional_after_video_completion_or_report_ready

behavior:
  loads_after:
    - assessment_contact_capture
  preserves:
    - assessment_answers
    - assessment_completion_state
    - AI_Deployment_Status
    - contact_capture_state
    - email_confirmation_state
  next:
    - assessment_carryover

blocked:
  - findings
  - top_3_risk_factors
  - review_determination
  - recommended_MAP_path
  - Environmental_Risk_Report_and_Operations_Review
  - Measures_Assessment_Protocol
  - payment
  - MAP_enrollment
  - SEAT
  - SEAL
  - Registry_Standing
  - c3_Key
  - DAO

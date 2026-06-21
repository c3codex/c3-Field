---
document_type: directory_set_component_record
authority_level: local_documentation
system_scope: measures_codex
title: Obsidian Assessment Contact Capture Style Profile Record v1
status: seated
version: v1
source_oar2: docs/seat/measures_registry_isolated/09_oar/oar2_addendum_seat_obsidian_assessment_landing_assessment_and_contact_capture_style_profiles_v1.meta.md
---

# Obsidian Assessment Contact Capture Style Profile Record v1

standing:
  status: required_before_revised_SEAT_upload_manifest_confirmation
  mutation_authorized: false
  db_mutation_authorized: false
  runtime_mutation_authorized: false
  bucket_upload_authorized_now: false
  email_send_authorized_now: false

surface:
  surface_key: assessment_contact_capture
  chamber_authority: obsidian
  surface_type: assessment_contact_capture

media:
  media_key: obsidian_contact_surface
  filename: obsidian_contact_surface.webp
  bucket_status: already_named_and_uploaded_by_operator
  role: contact_capture_background
  treatment:
    - full_bleed
    - threshold_depth_visible
    - stronger_panel_contrast
    - minimal_motion_or_static

copy:
  headline: Your AI Environment Assessment Review is being prepared.
  subline: Confirm where the review should be delivered.
  consent: I consent to be contacted by Measures Registry about my AI Operations Assessment review.

fields:
  required:
    - name
    - email
    - organization_or_institution
    - role_or_title
    - consent_checkbox
  optional:
    - website
    - preferred_contact_method
    - message

CTA:
  label: Confirm Review Delivery

behavior:
  records:
    - contact_permission
    - assessment_completion_state
    - email_confirmation_state
    - passage_ready_state
  next:
    - assessment_orientation
    - assessment_carryover
    - then_Marble_for_findings_reveal

blocked:
  - findings
  - review_determination
  - MAP_path_display
  - payment
  - MAP_enrollment
  - SEAT
  - SEAL
  - Registry_Standing
  - c3_Key
  - DAO

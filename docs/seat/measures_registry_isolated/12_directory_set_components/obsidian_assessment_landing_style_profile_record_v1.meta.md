---
document_type: directory_set_component_record
authority_level: local_documentation
system_scope: measures_codex
title: Obsidian Assessment Landing Style Profile Record v1
status: seated
version: v1
source_oar2: docs/seat/measures_registry_isolated/09_oar/oar2_addendum_seat_obsidian_assessment_landing_assessment_and_contact_capture_style_profiles_v1.meta.md
---

# Obsidian Assessment Landing Style Profile Record v1

standing:
  status: required_before_revised_SEAT_upload_manifest_confirmation
  mutation_authorized: false
  db_mutation_authorized: false
  runtime_mutation_authorized: false
  bucket_upload_authorized_now: false

surface:
  surface_key: ai_isnt_broken_assessment_landing
  chamber_authority: obsidian
  surface_type: assessment_landing
  route_function: public_assessment_entry

media:
  media_key: ai_isnt_broken_landing
  filename: ai_isnt_broken_landing.webp
  bucket_status: already_named_and_uploaded_by_operator
  role: landing_background
  treatment:
    - full_bleed
    - center_threshold_focal_point_preserved
    - dark_gradient_overlay_for_text
    - blue_signal_accent

video:
  media_key: questions_ungoverned_systems_cannot_answer
  filename: questions_ungoverned_systems_cannot_answer.mp4
  bucket_status: already_named_or_operator_to_confirm
  role: landing_hook_video
  behavior:
    - optional_video_first
    - may_auto_advance_to_landing_state
    - may_support_skip_or_mute_if_runtime_seated_later

copy:
  eyebrow: AI Operations Assessment
  headline: Questions Ungoverned Systems Cannot Answer
  support_line: AI isn’t broken. Systems are.
  body: Before you scale AI, identify where authority, access, and accountability are already drifting.
  primary_CTA: Assess Your AI Environment
  secondary_text: No diagnosis. No certification. A structured assessment entry.

layout:
  top_left:
    - Measures Registry mark
  top_right:
    - minimal_status_marker_optional
  upper_third:
    - eyebrow
    - headline
  mid_lower:
    - support_line
    - body
  lower_third:
    - primary_CTA
  bottom_strip_optional:
    - Access
    - Authority
    - Accountability

blocked:
  - navigation_header
  - findings
  - MAP_reveal
  - price
  - payment
  - SEAT
  - SEAL
  - Registry_Standing
  - c3_Key
  - DAO

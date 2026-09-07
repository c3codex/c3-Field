---
document_type: directory_set_component_record
authority_level: local_documentation
system_scope: measures_codex
title: Obsidian Assessment Question Style Profile Record v1
status: seated
version: v1
source_oar2: docs/seat/measures_registry_isolated/09_oar/oar2_addendum_seat_obsidian_assessment_landing_assessment_and_contact_capture_style_profiles_v1.meta.md
---

# Obsidian Assessment Question Style Profile Record v1

standing:
  status: required_before_revised_SEAT_upload_manifest_confirmation
  mutation_authorized: false
  db_mutation_authorized: false
  runtime_mutation_authorized: false
  bucket_upload_authorized_now: false

surface:
  surface_key: ai_operations_assessment
  chamber_authority: obsidian
  surface_type: assessment_question_surface

media:
  media_key: obsidian_assessment_surface
  filename: obsidian_assessment_surface.webp
  bucket_status: already_named_and_uploaded_by_operator
  role: assessment_question_background
  treatment:
    - full_bleed
    - subtle_dark_overlay
    - center_glow_retained
    - geometry_visible_but_not_competing

structure:
  assessment_total_questions: 7
  display_mode: one_question_per_surface
  answer_options: 3
  progress_indicator:
    type: seven_point_signal_line
    placement: lower_or_right_edge

question_panel:
  placement: center_or_lower_center
  style:
    - translucent_obsidian_panel
    - thin_blue_signal_border
    - low_gold_detail
    - high_readability_text
  contains:
    - question_number
    - question_text
    - answer_A
    - answer_B
    - answer_C

CTA:
  question_step: Continue
  final_step: Prepare Review

records:
  - selected_answers
  - assessment_completion_state
  - AI_Deployment_Status
  - risk_factor_inputs
  - organization_scope_modifier

blocked:
  - results_display
  - top_3_risk_factors
  - final_recommendation
  - MAP_path_display
  - payment
  - SEAT
  - SEAL
  - Registry_Standing

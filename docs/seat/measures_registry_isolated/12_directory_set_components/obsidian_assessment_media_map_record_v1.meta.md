---
document_type: directory_set_component_record
authority_level: local_documentation
system_scope: measures_codex
title: Obsidian Assessment Media Map Record v1
status: seated
version: v1
source_oar2: docs/seat/measures_registry_isolated/09_oar/oar2_addendum_seat_obsidian_assessment_landing_assessment_and_contact_capture_style_profiles_v1.meta.md
---

# Obsidian Assessment Media Map Record v1

standing:
  status: required_before_revised_SEAT_upload_manifest_confirmation
  mutation_authorized: false
  db_mutation_authorized: false
  runtime_mutation_authorized: false
  bucket_upload_authorized_now: false
  bucket_rename_authorized_now: false

media_map:
  ai_isnt_broken_landing:
    filename: ai_isnt_broken_landing.webp
    surface: ai_isnt_broken_assessment_landing
    role: landing_background
    bucket_status: already_named_and_uploaded_by_operator

  questions_ungoverned_systems_cannot_answer:
    filename: questions_ungoverned_systems_cannot_answer.mp4
    surface: ai_isnt_broken_assessment_landing
    role: landing_hook_video
    bucket_status: already_named_or_operator_to_confirm

  obsidian_assessment_surface:
    filename: obsidian_assessment_surface.webp
    surface: ai_operations_assessment
    role: assessment_question_background
    bucket_status: already_named_and_uploaded_by_operator

  obsidian_contact_surface:
    filename: obsidian_contact_surface.webp
    surface: assessment_contact_capture
    role: contact_capture_background
    bucket_status: already_named_and_uploaded_by_operator

removed_filename_pattern:
  - obsidian_assessment_surface_visual_v1.webp
  - obsidian_contact_surface_visual_v1.webp
  - obsidian_eval_result_surface_visual_v1.webp

reason:
  - operator_confirmed_visual_v1_suffix_removed
  - findings_not_in_obsidian
  - bucket_assets_already_named

bucket_action:
  upload_authorized_now: false
  rename_authorized_now: false
  overwrite_authorized_now: false

---
document_type: validation_report
authority_level: local_documentation
system_scope: measures_codex
title: Measures Registry Obsidian Assessment Style Profiles Validation v1
status: seated
version: v1
source_oar2: docs/seat/measures_registry_isolated/09_oar/oar2_addendum_seat_obsidian_assessment_landing_assessment_and_contact_capture_style_profiles_v1.meta.md
---

# Measures Registry Obsidian Assessment Style Profiles Validation v1

standing:
  status: obsidian_assessment_style_profiles_seated
  bucket_upload_authorized_now: false
  db_mutation_authorized: false
  runtime_mutation_authorized: false
  route_mutation_authorized: false
  renderer_mutation_authorized: false

parent_oar1_status:
  contact_email_record: present
  media_style_record: present

records_created:
  obsidian_assessment_style_profile_set_record:
    path: docs/seat/measures_registry_isolated/12_directory_set_components/obsidian_assessment_style_profile_set_record_v1.meta.md
    exists: true
  obsidian_assessment_landing_style_profile_record:
    path: docs/seat/measures_registry_isolated/12_directory_set_components/obsidian_assessment_landing_style_profile_record_v1.meta.md
    exists: true
  obsidian_assessment_question_style_profile_record:
    path: docs/seat/measures_registry_isolated/12_directory_set_components/obsidian_assessment_question_style_profile_record_v1.meta.md
    exists: true
  obsidian_assessment_contact_capture_style_profile_record:
    path: docs/seat/measures_registry_isolated/12_directory_set_components/obsidian_assessment_contact_capture_style_profile_record_v1.meta.md
    exists: true
  obsidian_assessment_media_map_record:
    path: docs/seat/measures_registry_isolated/12_directory_set_components/obsidian_assessment_media_map_record_v1.meta.md
    exists: true
  obsidian_assessment_surface_sequence_record:
    path: docs/seat/measures_registry_isolated/12_directory_set_components/obsidian_assessment_surface_sequence_record_v1.meta.md
    exists: true
  assessment_orientation_surface_record:
    path: docs/seat/measures_registry_isolated/12_directory_set_components/assessment_orientation_surface_record_v1.meta.md
    exists: true
  assessment_orientation_media_map_record:
    path: docs/seat/measures_registry_isolated/12_directory_set_components/assessment_orientation_media_map_record_v1.meta.md
    exists: true
  assessment_carryover_surface_record:
    path: docs/seat/measures_registry_isolated/12_directory_set_components/assessment_carryover_surface_record_v1.meta.md
    exists: true
  assessment_carryover_state_rule_record:
    path: docs/seat/measures_registry_isolated/12_directory_set_components/assessment_carryover_state_rule_record_v1.meta.md
    exists: true

requirements_satisfied:
  visual_v1_removed_from_active_filenames: true
  landing_profile_seated: true
  assessment_profile_seated: true
  contact_capture_profile_seated: true
  findings_excluded_from_obsidian: true
  marble_reveal_boundary_preserved: true
  assessment_orientation_seated: true
  assessment_carryover_seated: true
  assessment_report_orientation_media_mapped: true
  report_load_instruction_seated: true
  no_bucket_upload_now: true
  no_db_mutation_now: true
  no_runtime_mutation_now: true

upload_manifest_update_required: true
prior_recommended_upload_count: 70
new_required_records_count: 10
recommended_upload_count_after_obsidian_style_addendum: 80

blocking_findings:
  rows: []

non_mutation_confirmation:
  bucket_upload: false
  bucket_rename: false
  db: false
  policies: false
  runtime: false
  routes: false
  renderer: false
  public_copy: false
  social_posting: false
  paragraph_publishing: false
  email_send: false

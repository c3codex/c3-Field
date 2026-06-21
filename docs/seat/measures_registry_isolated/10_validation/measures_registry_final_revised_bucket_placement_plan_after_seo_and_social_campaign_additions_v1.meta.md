---
document_type: final_revised_bucket_placement_plan
authority_level: local_documentation
system_scope: measures_codex
title: Measures Registry Final Revised Bucket Placement Plan After SEO and Social Campaign Additions v1
status: blocked_missing_required_record
version: v1
source_oar2: docs/seat/measures_registry_isolated/09_oar/oar2_confirm_revised_measures_registry_seat_upload_manifest_after_seo_and_social_campaign_additions_v1.meta.md
---

# Measures Registry Final Revised Bucket Placement Plan After SEO and Social Campaign Additions v1

standing:
  status: final_revised_bucket_placement_plan_confirmed_or_blocked
  bucket_upload_authorized_now: false

bucket:
  name: measures-registry
  root: seat/current/

placement_groups:
  01_source:
    preserve_existing_count: true
  02_evidence:
    preserve_existing_count: true
  03_policy_security:
    preserve_existing_count: true
  04_directory_set:
    add_launch_surface_records: true
    added_records_count: 33
    found_records_count: 32
    blocked_until_missing_record_resolved: true
  10_validation:
    add_manifest_confirmation_records: true

directory_set_added_records:
  expected_count: 33
  found_count: 32
  records:
    - launch_style_profile_set_record.meta.md
    - launch_landing_pages_record.meta.md
    - undrifted_article_and_paragraph_integration_record.meta.md
    - social_campaign_record.meta.md
    - seo_metadata_records.meta.md
    - undrifted_lapis_article_set_and_paragraph_publication_path_record_v1.meta.md
    - undrifted_lapis_media_map_record_v1.meta.md
    - undrifted_lapis_9x16_style_profile_record_v1.meta.md
    - undrifted_lapis_icon_registry_usage_record_v1.meta.md
    - undrifted_lapis_video_to_headline_behavior_record_v1.meta.md
    - assessment_contact_capture_record_v1.meta.md
    - undrifted_lapis_leadership_contact_capture_record_v1.meta.md
    - contact_capture_email_sendout_rules_v1.meta.md
    - contact_capture_terminology_boundary_record_v1.meta.md
    - obsidian_assessment_style_profile_set_record_v1.meta.md
    - obsidian_assessment_landing_style_profile_record_v1.meta.md
    - obsidian_assessment_question_style_profile_record_v1.meta.md
    - obsidian_assessment_contact_capture_style_profile_record_v1.meta.md
    - obsidian_assessment_media_map_record_v1.meta.md
    - obsidian_assessment_surface_sequence_record_v1.meta.md
    - assessment_orientation_surface_record_v1.meta.md
    - assessment_orientation_media_map_record_v1.meta.md
    - assessment_carryover_surface_record_v1.meta.md
    - assessment_carryover_state_rule_record_v1.meta.md
    - marble_map_payment_scope_style_profile_record_v1.meta.md
    - marble_map_payment_scope_layout_record_v1.meta.md
    - marble_c3_7s_disclosure_record_v1.meta.md
    - marble_map_payment_scope_footer_disclosure_record_v1.meta.md
    - marble_map_payment_scope_media_map_record_v1.meta.md
    - marble_map_payment_scope_dynamic_fields_record_v1.meta.md
    - social_media_account_presence_record_v1.meta.md
    - social_campaign_asset_route_map_record_v1.meta.md
    - social_campaign_copy_cadence_and_claim_boundary_record_v1.meta.md

missing_directory_set_added_records:
  - undrifted_lapis_article_set_and_paragraph_publication_path_record_v1.meta.md

excluded:
  - held_appendix
  - held_backoffice
  - payment_activation_files
  - runtime_mutation_files
  - DB_mutation_files
  - Paragraph_publish_execution_files
  - social_post_execution_files
  - social_schedule_execution_files
  - email_send_execution_files
  - buffer_execution_files

future_upload_oar2_required: true
future_upload_oar2_ready_now: false

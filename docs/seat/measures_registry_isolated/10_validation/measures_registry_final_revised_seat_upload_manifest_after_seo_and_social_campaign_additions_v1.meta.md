---
document_type: final_revised_manifest_confirmation
authority_level: local_documentation
system_scope: measures_codex
title: Measures Registry Final Revised SEAT Upload Manifest After SEO and Social Campaign Additions v1
status: blocked_missing_required_record
version: v1
source_oar2: docs/seat/measures_registry_isolated/09_oar/oar2_confirm_revised_measures_registry_seat_upload_manifest_after_seo_and_social_campaign_additions_v1.meta.md
---

# Measures Registry Final Revised SEAT Upload Manifest After SEO and Social Campaign Additions v1

standing:
  status: final_revised_manifest_confirmed_or_blocked
  bucket_upload_authorized_now: false
  db_mutation_authorized: false
  runtime_mutation_authorized: false
  route_mutation_authorized: false
  renderer_mutation_authorized: false
  payment_activation_authorized: false
  paragraph_publish_authorized: false
  social_posting_authorized: false
  social_scheduling_authorized: false
  buffer_activation_authorized: false
  email_send_authorized: false

count_summary:
  base_confirmed_manifest_count: 56
  launch_surface_seo_paragraph_social_package_additions: 5
  undrifted_article_addendum_additions: 1
  undrifted_media_style_addendum_additions: 4
  contact_email_addendum_additions: 4
  obsidian_style_addendum_additions: 10
  marble_style_addendum_additions: 6
  social_campaign_confirmation_additions: 3
  final_revised_expected_upload_count: 89

parent_oar1_status:
  reduced_manifest_and_bucket_plan: present
  launch_surface_package: present
  undrifted_article_addendum: present
  undrifted_media_style_addendum: present
  contact_email_addendum: present
  obsidian_style_addendum: present
  marble_style_addendum: present
  social_campaign_confirmation: present

seo_status:
  seo_metadata_records_present: true
  og_webp_assignment_confirmed: true
  undrifted_banner_assignment_confirmed: true
  blocked_primary_public_claims_confirmed: true
  assignment_source:
    seo_metadata_record: present
    social_campaign_asset_route_map_record: represented

social_status:
  social_campaign_record_present: true
  social_account_presence_record_present: true
  social_campaign_asset_route_map_record_present: true
  social_campaign_copy_cadence_boundary_record_present: true
  posting_boundary_confirmed: true
  scheduling_boundary_confirmed: true

file_presence:
  expected_added_records_count: 33
  found_added_records_count: 32
  missing_added_records:
    - docs/seat/measures_registry_isolated/12_directory_set_components/undrifted_lapis_article_set_and_paragraph_publication_path_record_v1.meta.md
  nearby_seated_evidence:
    - docs/seat/measures_registry_isolated/12_directory_set_components/undrifted_lapis_encounter_article_set_and_paragraph_publication_path_addendum_v1.meta.md

manifest_confirmation:
  count_math_valid: true
  all_required_parent_oar1_present: true
  all_added_records_present: false
  seo_records_present: true
  social_campaign_records_present: true
  final_revised_manifest_ready_for_future_bucket_upload_oar2: false

blocked_if:
  - any_parent_oar1_missing
  - any_required_added_record_missing
  - count_math_mismatch
  - seo_metadata_missing
  - social_campaign_boundary_missing
  - appendix_files_included
  - held_backoffice_files_included
  - DB_mutation_found
  - runtime_mutation_found
  - bucket_upload_found
  - posting_or_scheduling_found

blockers:
  rows:
    - blocker_key: missing_exact_expected_added_record
      required_path: docs/seat/measures_registry_isolated/12_directory_set_components/undrifted_lapis_article_set_and_paragraph_publication_path_record_v1.meta.md
      observed_related_path: docs/seat/measures_registry_isolated/12_directory_set_components/undrifted_lapis_encounter_article_set_and_paragraph_publication_path_addendum_v1.meta.md
      disposition: exact_expected_filename_missing_manifest_not_ready

non_mutation_confirmation:
  bucket_upload_found: false
  DB_mutation_found: false
  runtime_mutation_found: false
  route_mutation_found: false
  renderer_mutation_found: false
  public_copy_mutation_found: false
  payment_activation_found: false
  social_posting_found: false
  social_scheduling_found: false
  buffer_activation_found: false
  paragraph_publish_found: false
  email_send_found: false

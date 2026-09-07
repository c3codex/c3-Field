---
document_type: upload_manifest
authority_level: exact_manifest_blocked
system_scope: measures_codex
title: Measures Registry Exact 89 File Bucket Upload Manifest v1
status: blocked_missing_exact_baseline_manifest
version: v1
operator: op044
source_oar2: docs/seat/measures_registry_isolated/09_oar/oar2_seat_exact_measures_registry_seat_89_file_bucket_upload_manifest_v1.meta.md
mutation_scope:
  local_docs_mutation: true
  bucket_upload: false
  bucket_delete: false
  bucket_overwrite: false
  bucket_move: false
  database: false
  policies: false
  rows: false
  rls: false
  runtime: false
  routes: false
  renderer: false
  public_copy: false
  payment_activation: false
  paragraph_publish: false
  social_posting: false
  social_scheduling: false
  buffer_activation: false
  email_send: false
---

# Measures Registry Exact 89 File Bucket Upload Manifest v1

## Standing

```yaml
standing:
  status: blocked_missing_exact_baseline_manifest
  bucket_upload_authorized_now: false
  db_mutation_authorized: false
  runtime_mutation_authorized: false
  route_mutation_authorized: false
  renderer_mutation_authorized: false
  policy_mutation_authorized: false
  public_copy_mutation_authorized: false
  payment_activation_authorized: false
  paragraph_publish_authorized: false
  social_posting_authorized: false
  social_scheduling_authorized: false
  buffer_activation_authorized: false
  email_send_authorized: false
```

## Source Evidence

```yaml
source_evidence:
  blocked_upload_oar1: docs/seat/measures_registry_isolated/09_oar/oar1_upload_revised_measures_registry_seat_current_manifest_to_supabase_bucket_v1.meta.md
  bucket_upload_validation: docs/seat/measures_registry_isolated/10_validation/measures_registry_seat_current_bucket_upload_validation_v1.meta.md
  reconfirmed_manifest_oar1: docs/seat/measures_registry_isolated/09_oar/oar1_reconfirm_revised_measures_registry_seat_upload_manifest_after_blocker_resolution_v1.meta.md
  baseline_manifest_sources_checked:
    - docs/seat/measures_registry_isolated/10_validation/measures_registry_confirmed_reduced_seat_upload_manifest_v1.meta.md
    - docs/seat/measures_registry_isolated/10_validation/measures_registry_seat_bucket_placement_plan_v1.meta.md
    - docs/seat/measures_registry_isolated/09_oar/oar1_confirm_reduced_measures_registry_seat_upload_manifest_and_bucket_placement_plan_v1.meta.md
    - docs/seat/measures_registry_isolated/10_validation/measures_registry_reduced_seat_upload_candidate_manifest_v1.meta.md
    - docs/seat/measures_registry_isolated/10_validation/measures_registry_document_archive_reclassification_v1.meta.md
    - docs/seat/measures_registry_isolated/10_validation/measures_registry_seat_folder_future_upload_candidate_manifest_v1.meta.md
  added_manifest_sources:
    - docs/seat/measures_registry_isolated/10_validation/measures_registry_reconfirmed_bucket_placement_plan_after_blocker_resolution_v1.meta.md
```

## Count Summary

```yaml
count_summary:
  expected_upload_count: 89
  baseline_exact_rows_count: 0
  baseline_count_confirmed_but_not_row_resolved: 56
  added_exact_rows_count: 33
  total_exact_rows_count: 33
  count_math_valid_for_reconfirmed_package: true
  exact_89_manifest_seated: false
```

## Baseline Resolution Finding

```yaml
baseline_resolution:
  required_baseline_exact_rows_count: 56
  resolved_baseline_exact_rows_count: 0
  blocker: blocked_missing_exact_baseline_manifest
  reason: confirmed baseline source documents preserve the 56-file upload package by count and representative rows only
  no_inference_used: true
  directory_globbing_used_to_create_baseline: false
  upload_manifest_ready: false
```

## Added Rows Resolved

```yaml
added_rows_resolved:
  count: 33
  source_set: launch_surface_addition
  source_root: docs/seat/measures_registry_isolated/12_directory_set_components/
  placement_group: seat/current/04_directory_set/
  all_local_files_exist: true
  held_exclusion_check: pass
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
```

## Manifest Rows

```yaml
manifest_rows: []
```

## Validation

```yaml
validation:
  all_89_rows_present: false
  all_local_files_exist: false
  all_bucket_paths_present: false
  all_placement_groups_present: false
  held_exclusion_checks_passed: true
  no_inference_used: true
  ready_for_bucket_upload_oar2: false
```

## Blockers

```yaml
blockers:
  rows:
    - code: blocked_missing_exact_baseline_manifest
      finding: exact 56-row baseline local path and bucket path list was not found in confirmed documentation
      required_resolution: recover or seat exact baseline upload manifest paths under separate OAR authority
```

## Boundary Confirmation

```yaml
boundary_confirmation:
  bucket_upload_performed: false
  bucket_access_checked: false
  bucket_delete_performed: false
  bucket_overwrite_performed: false
  bucket_move_performed: false
  database_mutation: false
  policy_mutation: false
  row_mutation: false
  rls_mutation: false
  runtime_mutation: false
  route_mutation: false
  renderer_mutation: false
  public_copy_mutation: false
```

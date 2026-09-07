---
document_type: upload_manifest
authority_level: reconstructed_baseline_blocked
system_scope: measures_codex
title: Measures Registry Reconstructed Exact 56 Baseline Upload Manifest v1
status: blocked_source_authority_does_not_contain_exact_56_rows
version: v1
operator: op044
source_oar2: docs/seat/measures_registry_isolated/09_oar/oar2_reconstruct_measures_registry_baseline_upload_set_from_source_package_authority_v1.meta.md
mutation_scope:
  local_docs_mutation: true
  bucket_upload: false
  bucket_access: false
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

# Measures Registry Reconstructed Exact 56 Baseline Upload Manifest v1

standing:
  status: blocked_source_authority_does_not_contain_exact_56_rows
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

source_authority:
  source_files_used:
    - docs/seat/measures_registry_isolated/10_validation/measures_registry_document_archive_reclassification_v1.meta.md
    - docs/seat/measures_registry_isolated/10_validation/measures_registry_reduced_seat_upload_candidate_manifest_v1.meta.md
    - docs/seat/measures_registry_isolated/10_validation/measures_registry_confirmed_reduced_seat_upload_manifest_v1.meta.md
    - docs/seat/measures_registry_isolated/10_validation/measures_registry_seat_bucket_placement_plan_v1.meta.md
    - docs/seat/measures_registry_isolated/09_oar/oar1_confirm_reduced_measures_registry_seat_upload_manifest_and_bucket_placement_plan_v1.meta.md
    - docs/seat/measures_registry_isolated/10_validation/measures_registry_seat_upload_content_review_v1.meta.md
    - docs/seat/measures_registry_isolated/09_oar/oar1_review_confirmed_seat_upload_files_and_held_appendix_contents_before_bucket_upload_v1.meta.md
    - docs/seat/measures_registry_isolated/10_validation/measures_registry_final_pre_upload_decision_v1.meta.md
  missing_source_files: []
  contaminated_candidate_pool_used_as_authority: false
  thread_memory_used: false
  directory_globbing_used_as_manifest_authority: false

count_summary:
  required_total: 56
  reconstructed_total: 0
  source_authority_confirmed_total: 56
  source_authority_explicit_full_row_total: 0
  placement_group_counts:
    seat/current/01_source/: 3
    seat/current/02_evidence/: 23
    seat/current/03_policy_security/: 16
    seat/current/04_directory_set/: 14
  reconstructed_placement_group_counts:
    seat/current/01_source/: 0
    seat/current/02_evidence/: 0
    seat/current/03_policy_security/: 0
    seat/current/04_directory_set/: 0
  count_valid: false

representative_rows_found_but_not_manifest_authority:
  reason: source authority files expose counts and representative rows only, not a complete exact 56-row local_path and bucket_path transfer surface
  rows:
    - docs/seat/measures_registry_isolated/10_validation/seat_review_matrix_measures_registry_launch_surface_package_v1.meta.md
    - docs/seat/measures_registry_isolated/10_validation/seat_review_matrix_measures_registry_launch_surface_package_populated_v1.meta.md
    - docs/seat/measures_registry_isolated/10_validation/read_only_catalog_rpc_seating_validation_v1.meta.md
    - docs/seat/measures_registry_isolated/10_validation/supabase_policy_disposition_after_readback_v1.meta.md
    - docs/seat/measures_registry_isolated/12_directory_set_components/dependency_state_record.meta.md
    - docs/seat/measures_registry_isolated/09_oar/oar1_resolve_supabase_public_policy_dispositions_for_measures_registry_v1.meta.md

baseline_rows: []

validation:
  exact_56_rows_present: false
  all_local_files_exist: false
  all_bucket_paths_present: false
  all_placement_group_counts_match_expected: false
  all_exclusion_checks_passed: false
  no_count_only_rows_used: true
  no_contaminated_candidate_pool_used_as_authority: true
  ready_for_89_file_manifest_rebuild: false

blockers:
  rows:
    - blocked_source_authority_does_not_contain_exact_56_rows

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

---
document_type: oar1
authority_level: closeout
system_scope: measures_codex
title: OAR1 - Reconstruct Measures Registry Baseline Upload Set From Source Package Authority v1
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

# OAR1 - Reconstruct Measures Registry Baseline Upload Set From Source Package Authority v1

closeout:
  status: blocked_source_authority_does_not_contain_exact_56_rows
  source_oar2_path: docs/seat/measures_registry_isolated/09_oar/oar2_reconstruct_measures_registry_baseline_upload_set_from_source_package_authority_v1.meta.md
  classification_blocker_oar1_path: docs/seat/measures_registry_isolated/09_oar/oar1_isolate_measures_registry_baseline_upload_candidates_by_content_class_v1.meta.md
  reconstructed_baseline_manifest_path: docs/seat/measures_registry_isolated/10_validation/measures_registry_reconstructed_exact_56_baseline_upload_manifest_v1.meta.md
  reconstruction_validation_path: docs/seat/measures_registry_isolated/10_validation/measures_registry_reconstructed_exact_56_baseline_upload_manifest_validation_v1.meta.md
  required_baseline_count: 56
  reconstructed_baseline_count: 0
  exact_56_rows_present: false
  all_local_files_exist: false
  all_bucket_paths_present: false
  all_placement_group_counts_match_expected: false
  all_exclusion_checks_passed: false
  no_count_only_rows_used: true
  no_contaminated_candidate_pool_used_as_authority: true
  ready_for_89_file_manifest_rebuild: false

source_authority_files_used:
  - docs/seat/measures_registry_isolated/10_validation/measures_registry_document_archive_reclassification_v1.meta.md
  - docs/seat/measures_registry_isolated/10_validation/measures_registry_reduced_seat_upload_candidate_manifest_v1.meta.md
  - docs/seat/measures_registry_isolated/10_validation/measures_registry_confirmed_reduced_seat_upload_manifest_v1.meta.md
  - docs/seat/measures_registry_isolated/10_validation/measures_registry_seat_bucket_placement_plan_v1.meta.md
  - docs/seat/measures_registry_isolated/09_oar/oar1_confirm_reduced_measures_registry_seat_upload_manifest_and_bucket_placement_plan_v1.meta.md
  - docs/seat/measures_registry_isolated/10_validation/measures_registry_seat_upload_content_review_v1.meta.md
  - docs/seat/measures_registry_isolated/09_oar/oar1_review_confirmed_seat_upload_files_and_held_appendix_contents_before_bucket_upload_v1.meta.md
  - docs/seat/measures_registry_isolated/10_validation/measures_registry_final_pre_upload_decision_v1.meta.md
missing_source_authority_files: []

placement_group_counts:
  seat/current/01_source/: 0
  seat/current/02_evidence/: 0
  seat/current/03_policy_security/: 0
  seat/current/04_directory_set/: 0

missing_rows:
  - exact_56_row_local_path_and_bucket_path_surface_missing_from_source_authority
excluded_rows: []
ambiguous_rows:
  - source_authority_contains_counts_and_representative_rows_only
blockers:
  - blocked_source_authority_does_not_contain_exact_56_rows

boundary_confirmation:
  no_bucket_upload_confirmation: true
  no_bucket_access_confirmation: true
  no_bucket_delete_confirmation: true
  no_bucket_overwrite_confirmation: true
  no_bucket_move_confirmation: true
  no_bucket_policy_mutation_confirmation: true
  no_DB_mutation_confirmation: true
  no_RLS_mutation_confirmation: true
  no_runtime_mutation_confirmation: true
  no_route_mutation_confirmation: true
  no_renderer_mutation_confirmation: true
  no_public_copy_mutation_confirmation: true
  no_payment_activation_confirmation: true
  no_social_posting_confirmation: true
  no_social_scheduling_confirmation: true
  no_Buffer_activation_confirmation: true
  no_Paragraph_publishing_confirmation: true
  no_email_send_confirmation: true

recommended_next_oar2:
  title: OAR2 - Operator Supply Measures Registry Baseline Source Package File List v1

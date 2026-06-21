---
document_type: validation_report
authority_level: reconstructed_baseline_validation
system_scope: measures_codex
title: Measures Registry Reconstructed Exact 56 Baseline Upload Manifest Validation v1
status: reconstruction_blocked_source_authority_does_not_contain_exact_56_rows
version: v1
operator: op044
source_oar2: docs/seat/measures_registry_isolated/09_oar/oar2_reconstruct_measures_registry_baseline_upload_set_from_source_package_authority_v1.meta.md
mutation_scope:
  local_docs_mutation: true
  bucket_upload: false
  bucket_access: false
  database: false
  runtime: false
  routes: false
  renderer: false
  public_copy: false
---

# Measures Registry Reconstructed Exact 56 Baseline Upload Manifest Validation v1

standing:
  status: reconstruction_blocked_source_authority_does_not_contain_exact_56_rows
  bucket_upload_authorized_now: false

validation_result:
  reconstructed_manifest_path: docs/seat/measures_registry_isolated/10_validation/measures_registry_reconstructed_exact_56_baseline_upload_manifest_v1.meta.md
  required_total: 56
  reconstructed_total: 0
  source_count: 0
  evidence_count: 0
  policy_security_count: 0
  directory_set_count: 0
  expected_source_count: 3
  expected_evidence_count: 23
  expected_policy_security_count: 16
  expected_directory_set_count: 14
  exact_56_rows_present: false
  all_local_files_exist: false
  all_bucket_paths_present: false
  all_placement_group_counts_match_expected: false
  all_exclusion_checks_passed: false
  no_count_only_rows_used: true
  no_contaminated_candidate_pool_used_as_authority: true
  ready_for_89_file_manifest_rebuild: false

missing_rows:
  - exact_56_row_local_path_and_bucket_path_surface_missing_from_source_authority

excluded_rows: []

ambiguous_rows:
  - source_authority_contains_representative_rows_only

blocking_findings:
  rows:
    - blocked_source_authority_does_not_contain_exact_56_rows

recommended_next_oar2_if_valid:
  title: OAR2 - Rebuild Exact Measures Registry SEAT 89 File Bucket Upload Manifest From Reconstructed Baseline v1
recommended_next_oar2_if_blocked:
  title: OAR2 - Operator Supply Measures Registry Baseline Source Package File List v1

boundary_confirmation:
  bucket_upload_performed: false
  bucket_access_checked: false
  database_mutation: false
  runtime_mutation: false
  route_mutation: false
  renderer_mutation: false
  public_copy_mutation: false

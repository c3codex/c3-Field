---
document_type: upload_manifest
authority_level: baseline_recovery_blocked
system_scope: measures_codex
title: Measures Registry Exact 56 Baseline Bucket Upload Manifest v1
status: blocked_ambiguous_baseline_candidates
version: v1
operator: op044
source_oar2: docs/seat/measures_registry_isolated/09_oar/oar2_recover_exact_measures_registry_baseline_upload_manifest_paths_v1.meta.md
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

# Measures Registry Exact 56 Baseline Bucket Upload Manifest v1

## Standing

```yaml
standing:
  status: blocked_ambiguous_baseline_candidates
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
  blocked_exact_manifest_oar1: docs/seat/measures_registry_isolated/09_oar/oar1_seat_exact_measures_registry_seat_89_file_bucket_upload_manifest_v1.meta.md
  baseline_sources_checked:
    - docs/seat/measures_registry_isolated/10_validation/measures_registry_confirmed_reduced_seat_upload_manifest_v1.meta.md
    - docs/seat/measures_registry_isolated/10_validation/measures_registry_seat_bucket_placement_plan_v1.meta.md
    - docs/seat/measures_registry_isolated/09_oar/oar1_confirm_reduced_measures_registry_seat_upload_manifest_and_bucket_placement_plan_v1.meta.md
    - docs/seat/measures_registry_isolated/10_validation/measures_registry_reduced_seat_upload_candidate_manifest_v1.meta.md
    - docs/seat/measures_registry_isolated/10_validation/measures_registry_document_archive_reclassification_v1.meta.md
    - docs/seat/measures_registry_isolated/10_validation/measures_registry_seat_folder_future_upload_candidate_manifest_v1.meta.md
    - docs/seat/measures_registry_isolated/10_validation/measures_registry_seat_upload_content_review_v1.meta.md
    - docs/seat/measures_registry_isolated/09_oar/oar1_review_confirmed_seat_upload_files_and_held_appendix_contents_before_bucket_upload_v1.meta.md
    - docs/seat/measures_registry_isolated/10_validation/measures_registry_final_pre_upload_decision_v1.meta.md
  exact_prior_manifest_found: false
  recovery_candidate_mode_used: true
```

## Count Summary

```yaml
count_summary:
  required_baseline_count: 56
  recovered_baseline_rows_count: 0
  count_valid: false
```

## Recovery Candidate Scan

```yaml
recovery_candidate_scan:
  allowed_folders_checked:
    - docs/seat/measures_registry_isolated/09_oar/
    - docs/seat/measures_registry_isolated/10_validation/
    - docs/seat/measures_registry_isolated/12_directory_set_components/
  confirmed_reduced_manifest_cutoff: 2026-06-18 12:26:39
  filesystem_candidates_through_confirmed_reduced_manifest: 67
  candidate_breakdown_through_confirmed_reduced_manifest:
    09_oar: 33
    10_validation: 20
    12_directory_set_components: 14
  content_review_cutoff: 2026-06-18 12:52:15
  filesystem_candidates_through_content_review: 73
  candidate_breakdown_through_content_review:
    09_oar: 35
    10_validation: 24
    12_directory_set_components: 14
  blocker: more_than_56_possible_baseline_files_found
  disposition: stop_and_report_ambiguity
```

## Manifest Rows

```yaml
manifest_rows: []
```

## Validation

```yaml
validation:
  all_56_rows_present: false
  all_local_files_exist: false
  all_bucket_paths_present: false
  all_placement_groups_present: false
  held_exclusion_checks_passed: false
  no_count_only_rows_used: true
  no_thread_memory_used: true
  operator_confirmation_required: true
  ready_for_89_file_manifest_rebuild: false
```

## Blockers

```yaml
blockers:
  rows:
    - code: blocked_ambiguous_baseline_candidates
      finding: recovery candidate mode found more than 56 possible baseline files before the confirmed reduced manifest closeout and no row-level source document identifying the exact 56
      required_resolution: operator must supply or authorize exact baseline row selection before 89-file manifest rebuild
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

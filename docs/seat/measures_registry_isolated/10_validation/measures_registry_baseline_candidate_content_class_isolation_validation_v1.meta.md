---
document_type: validation_report
authority_level: content_class_isolation_validation
system_scope: measures_codex
title: Measures Registry Baseline Candidate Content Class Isolation Validation v1
status: classification_complete_blocked_no_clean_56_candidate_set
version: v1
operator: op044
source_oar2: docs/seat/measures_registry_isolated/09_oar/oar2_isolate_measures_registry_baseline_upload_candidates_by_content_class_v1.meta.md
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

# Measures Registry Baseline Candidate Content Class Isolation Validation v1

standing:
  status: classification_complete_blocked_no_clean_56_candidate_set
  bucket_upload_authorized_now: false

validation_result:
  source_candidate_table_path: docs/seat/measures_registry_isolated/10_validation/measures_registry_operator_baseline_56_candidate_review_table_v1.meta.md
  content_class_isolation_path: docs/seat/measures_registry_isolated/10_validation/measures_registry_baseline_candidate_content_class_isolation_v1.meta.md
  narrowed_operator_review_table_path: docs/seat/measures_registry_isolated/10_validation/measures_registry_baseline_56_narrowed_operator_review_table_v1.meta.md
  total_candidate_rows: 67
  eligible_candidate_count: 28
  required_selection_count: 56
  selection_possible_without_ineligible_rows: false
  operator_selection_required: true
  cody_auto_selection_authorized: false
  ready_for_operator_selection_oar2: false

blocking_findings:
  rows:
    - blocked_no_clean_56_candidate_set

recommended_next_oar2_if_ready:
  title: OAR2 - Confirm Operator Selected Measures Registry Baseline 56 File Manifest From Narrowed Candidate Table v1
recommended_next_oar2_if_blocked:
  title: OAR2 - Reconstruct Measures Registry Baseline Upload Set From Source Package Authority v1

boundary_confirmation:
  bucket_upload_performed: false
  bucket_access_checked: false
  database_mutation: false
  runtime_mutation: false
  route_mutation: false
  renderer_mutation: false
  public_copy_mutation: false

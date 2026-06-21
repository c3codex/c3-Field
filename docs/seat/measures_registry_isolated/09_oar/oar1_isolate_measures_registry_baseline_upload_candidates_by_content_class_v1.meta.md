---
document_type: oar1
authority_level: closeout
system_scope: measures_codex
title: OAR1 - Isolate Measures Registry Baseline Upload Candidates by Content Class v1
status: completed_blocked_no_clean_56_candidate_set
version: v1
operator: op044
source_oar2: docs/seat/measures_registry_isolated/09_oar/oar2_isolate_measures_registry_baseline_upload_candidates_by_content_class_v1.meta.md
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

# OAR1 - Isolate Measures Registry Baseline Upload Candidates by Content Class v1

closeout:
  status: completed_blocked_no_clean_56_candidate_set
  source_oar2_path: docs/seat/measures_registry_isolated/09_oar/oar2_isolate_measures_registry_baseline_upload_candidates_by_content_class_v1.meta.md
  source_candidate_review_table_path: docs/seat/measures_registry_isolated/10_validation/measures_registry_operator_baseline_56_candidate_review_table_v1.meta.md
  operator_template_path: docs/seat/measures_registry_isolated/10_validation/measures_registry_operator_supplied_baseline_56_manifest_template_v1.meta.md
  content_class_isolation_record_path: docs/seat/measures_registry_isolated/10_validation/measures_registry_baseline_candidate_content_class_isolation_v1.meta.md
  narrowed_operator_review_table_path: docs/seat/measures_registry_isolated/10_validation/measures_registry_baseline_56_narrowed_operator_review_table_v1.meta.md
  classification_validation_path: docs/seat/measures_registry_isolated/10_validation/measures_registry_baseline_candidate_content_class_isolation_validation_v1.meta.md
  total_candidate_rows: 67
  eligible_candidate_count: 28
  ineligible_candidate_count: 39
  selection_possible_without_ineligible_rows: false
  operator_selection_required: true
  cody_auto_selection_authorized: false
  ready_for_operator_selection_oar2: false
  blockers:
    - blocked_no_clean_56_candidate_set

counts_by_class:
  original_content_record: 0
  directory_set_component: 14
  source_manifest: 3
  validation_evidence: 6
  OAR_instruction: 17
  OAR_closeout: 16
  policy_security_evidence: 11
  recent_recovery_artifact: 0
  held_or_backoffice: 0
  excluded_from_baseline: 0

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
  title: OAR2 - Reconstruct Measures Registry Baseline Upload Set From Source Package Authority v1

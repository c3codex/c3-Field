---
document_type: oar1
authority_level: closeout
system_scope: measures_codex
title: OAR1 - Create send_card for Held and Excluded Media Before Manifest Build v1
status: blocked_missing_media_disposition_matrix
version: v1
operator: op044
source_oar2: docs/seat/measures_registry_isolated/09_oar/oar2_create_send_card_for_held_and_excluded_media_before_manifest_build_v1.meta.md
mutation_scope:
  local_docs_mutation: true
  send_card_creation: false
  readiness_gate_correction: false
  exact_manifest_build: false
  bucket_upload: false
  bucket_write: false
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
  stripe_activation: false
  paragraph_publish: false
  social_posting: false
  social_scheduling: false
  buffer_activation: false
  email_send: false
---

# OAR1 - Create send_card for Held and Excluded Media Before Manifest Build v1

closeout:
  status: blocked_missing_media_disposition_matrix
  source_oar2_path: docs/seat/measures_registry_isolated/09_oar/oar2_create_send_card_for_held_and_excluded_media_before_manifest_build_v1.meta.md
  source_media_resolution_oar1_path_read: docs/seat/measures_registry_isolated/09_oar/oar1_resolve_measures_registry_unresolved_media_rows_before_exact_manifest_build_v1.meta.md
  media_disposition_matrix_path_read: docs/seat/measures_registry_isolated/10_validation/measures_registry_12_row_media_disposition_matrix_before_manifest_build_v1.meta.md
  source_media_resolution_oar1_matched: true
  media_disposition_matrix_exists: true
  media_disposition_matrix_complete_for_send_card: false
  held_media_count: 3
  excluded_media_count: 3
  held_rows_with_row_level_hold_reason: 3
  excluded_rows_with_row_level_exclusion_reason: 0
  summary_exclusion_reason_assertion_present: true
  blocker_reason: excluded_media_rows_do_not_contain_required_row_level_exclusion_reason
  send_card_created: false
  send_card_path: null
  corrected_manifest_readiness_gate_created: false
  corrected_manifest_readiness_gate_path: null
  front_facing_operator_report_created: false
  front_facing_operator_report_path: null
  internal_process_report_created: false
  internal_process_report_path: null
  prior_ready_for_exact_manifest_build_oar2: true
  corrected_ready_for_exact_manifest_build_oar2: false
  operator_action_required: false
  resolution_return_to_sender_required: false
  exact_manifest_build_allowed: false
  bucket_upload_allowed: false
  bucket_write_allowed: false
  DB_mutation_confirmation: false
  RLS_mutation_confirmation: false
  runtime_mutation_confirmation: false
  route_mutation_confirmation: false
  renderer_mutation_confirmation: false
  public_copy_mutation_confirmation: false
  payment_activation_confirmation: false
  Stripe_activation_confirmation: false
  social_posting_confirmation: false
  social_scheduling_confirmation: false
  Buffer_activation_confirmation: false
  Paragraph_publishing_confirmation: false
  email_send_confirmation: false

required_before_retry:
  - add_explicit_exclusion_reason_to_each_of_the_three_excluded_media_rows
  - revalidate_held_and_excluded_row_counts
  - rerun_this_saved_send_card_OAR2

recommended_next_oar2:
  title: OAR2 - Add Row-Level Exclusion Reasons to Held and Excluded Measures Registry Media Rows v1

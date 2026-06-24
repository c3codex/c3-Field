---
document_type: oar1
authority_level: closeout
system_scope: measures_codex
title: OAR1 - Rerun send_card Creation for Held and Excluded Media Before Manifest Build v1
status: completed_send_card_created_awaiting_operator_action
version: v1
operator: op044
source_oar2: docs/seat/measures_registry_isolated/09_oar/oar2_rerun_send_card_creation_for_held_and_excluded_media_before_manifest_build_v1.meta.md
mutation_scope:
  local_docs_mutation: true
  send_card_creation: true
  readiness_gate_correction: true
  exact_manifest_build: false
  bucket_upload: false
  bucket_write: false
  database: false
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

# OAR1 - Rerun send_card Creation for Held and Excluded Media Before Manifest Build v1

closeout:
  status: completed_send_card_created_awaiting_operator_action
  source_oar2_path: docs/seat/measures_registry_isolated/09_oar/oar2_rerun_send_card_creation_for_held_and_excluded_media_before_manifest_build_v1.meta.md
  row_level_exclusion_oar1_path_read: docs/seat/measures_registry_isolated/09_oar/oar1_add_row_level_exclusion_reasons_to_held_and_excluded_measures_registry_media_rows_v1.meta.md
  blocked_send_card_oar1_path_read: docs/seat/measures_registry_isolated/09_oar/oar1_create_send_card_for_held_and_excluded_media_before_manifest_build_v1.meta.md
  media_resolution_oar1_path_read: docs/seat/measures_registry_isolated/09_oar/oar1_resolve_measures_registry_unresolved_media_rows_before_exact_manifest_build_v1.meta.md
  completed_row_level_media_disposition_matrix_path_read: docs/seat/measures_registry_isolated/10_validation/measures_registry_12_row_media_disposition_matrix_row_level_exclusion_reasons_v1.meta.md
  send_card_path: docs/seat/measures_registry_isolated/10_validation/send_card_held_excluded_media_before_manifest_build_v1.meta.md
  corrected_manifest_readiness_gate_path: docs/seat/measures_registry_isolated/10_validation/manifest_readiness_gate_conditional_pending_send_card_resolution_v1.meta.md
  front_facing_operator_report_path: docs/seat/measures_registry_isolated/10_validation/front_facing_operator_report_send_card_rerun_created_for_held_excluded_media_v1.meta.md
  internal_process_report_path: docs/seat/measures_registry_isolated/10_validation/internal_process_report_send_card_rerun_held_excluded_media_v1.meta.md
  held_media_count: 3
  excluded_media_count: 3
  held_rows_with_row_level_hold_reason: 3
  excluded_rows_with_row_level_exclusion_reason: 3
  prior_ready_for_exact_manifest_build_oar2: true
  corrected_ready_for_exact_manifest_build_oar2: false
  send_card_created: true
  operator_action_required: true
  resolution_return_to_sender_required: true
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

recommended_next_oar2:
  title: OAR2 - Record Operator send_card Resolution for Held and Excluded Media Before Manifest Build v1

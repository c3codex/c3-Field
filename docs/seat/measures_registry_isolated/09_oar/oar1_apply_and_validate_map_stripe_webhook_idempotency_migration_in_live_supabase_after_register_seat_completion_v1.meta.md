---
document_type: oar1
authority_level: closeout
system_scope: measures_registry_map_stripe_live_db_migration
title: OAR1 - Apply and Validate MAP Stripe Webhook Idempotency Migration in Live Supabase After register_SEAT Completion v1
status: completed_live_map_stripe_migration
version: v1
operator: op044
process_key: map_stripe_webhook_idempotency_migration
source_oar2: docs/seat/measures_registry_isolated/09_oar/oar2_apply_and_validate_map_stripe_webhook_idempotency_migration_in_live_supabase_after_register_seat_completion_v1.meta.md
---

# OAR1 - Apply and Validate MAP Stripe Webhook Idempotency Migration in Live Supabase After register_SEAT Completion v1

closeout:
  status: completed_live_map_stripe_migration
  applied_date: 2026-06-20
  process_key: map_stripe_webhook_idempotency_migration
  register_SEAT_live_DB_content_registration_confirmed: true
  register_SEAT_4x13_audit_closed: true
  register_SEAT_git_commit_confirmed: true
  migration_file_present: true
  migration_corrected_and_dry_run_validated: true
  migration_applied_or_confirmed: true
  migration_version: "202606200001"
  migration_version_recorded_in_supabase_migrations: true
  map_c2_circuit_present: true
  map_c2_circuit_active_as_corrected_surface: true
  map_commerce_contracts_present: true
  map_commerce_contracts_active_runtime_authority: false
  stripe_webhook_idempotency_present: true
  idempotency_unique_key_present: true
  idempotency_unique_constraint: stripe_webhook_events_stripe_event_id_key
  duplicate_event_guard_present: true
  replay_protection_present: true
  claim_function_present: true
  registered_runtime_creation_performed: false
  registered_runtime_activation_performed: false
  MAP_payment_activation_performed: false
  checkout_activation_performed: false
  live_DB_mutation_performed: true
  active_payment_records: 0
  authority_created: false
  validation_matrix_created: true
  oar1_closeout_created: true
  recommended_next_action: git_commit_map_stripe_webhook_idempotency_migration_evidence
  recommended_next_oar2_title: "OAR2 - Register MAP Payment Runtime Surface After Stripe Webhook Idempotency Migration Before Checkout Activation v1"

migration_artifact:
  migration_path: supabase/migrations/202606200001_map_stripe_price_ids_and_webhook_idempotency.sql
  migration_sha256_after_correction: 23C9F8C5216342347FD5938BFF1C0E4DACD80635BA55F4CBACC13C7977BB08ED
  missing_live_map_c2_creation_resolved_in_artifact: true
  broad_older_media_runtime_migration_applied: false
  seated_launch_prices_preserved: true
  seated_MAP_price_env_key_names_preserved: true
  MAP_rows_release_state_after_apply: held
  anon_or_authenticated_access_after_apply: revoked

live_validation:
  map_c2_circuit_pre_deployment_price_id: price_1Tg87rP9heJD6LYqW8JkxRJw
  map_c2_circuit_optimization_price_id: price_1Tg8CgP9heJD6LYqZoVQmH7H
  map_c2_circuit_remediation_price_id: price_1Tg8IaP9heJD6LYq3y6CQHX5
  all_release_state_held: true
  rls_enabled_map_c2_circuit: true
  rls_enabled_stripe_webhook_events: true
  claim_function_security: DEFINER
  webhook_event_records_after_migration: 0
  remediation_price_env_discrepancy_noted: true
  remediation_price_env_trailing_w_to_verify_before_checkout: true

boundary_confirmation:
  MAP_payment_migration_performed: true
  Stripe_activation_performed: false
  webhook_fulfillment_activation_performed: false
  checkout_activation_performed: false
  runtime_route_activation_performed: false
  renderer_mutation_performed: false
  public_copy_mutation_performed: false
  authority_created: false
  SEAT_authority_created: false
  c3_key_created: false
  certification_created: false
  DAO_standing_created: false
  Codexstone_conversion_created: false
  Registry_Certification_created: false

registered_runtime_gate:
  registered_runtime_creation_performed: false
  registered_runtime_activation_performed: false
  registered_runtime_is_next_distinct_gate: true
  note: "Do not proceed to runtime activation until registered runtime is separately seated via the next OAR2."

The MAP Stripe webhook idempotency migration has been applied to live Supabase. public.map_c2_circuit and public.stripe_webhook_events are now present with RLS enabled, all MAP rows in held state, no payment activation performed. Registered runtime remains the next distinct required gate.

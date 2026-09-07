---
document_type: map_stripe_webhook_idempotency_live_migration_validation
authority_level: closeout_evidence
system_scope: measures_registry_map_stripe_live_db_migration
title: MAP Stripe Webhook Idempotency Live Migration Validation After register_SEAT v1
status: completed_live_map_stripe_migration
version: v1
operator: op044
process_key: map_stripe_webhook_idempotency_migration
source_oar2: docs/seat/measures_registry_isolated/09_oar/oar2_apply_and_validate_map_stripe_webhook_idempotency_migration_in_live_supabase_after_register_seat_completion_v1.meta.md
---

# MAP Stripe Webhook Idempotency Live Migration Validation After register_SEAT v1

preflight:
  register_SEAT_live_DB_content_registration_confirmed: true
  register_SEAT_4x13_audit_closed: true
  register_SEAT_git_commit_confirmed: true
  register_SEAT_registration_commit: f4967895bb48d31b1b60e99353d014728f70369d
  register_SEAT_4x13_audit_commit: aeb6ae8d5399af8299cbfdd15d6bba692ddb2d7f
  seat_complete_binding_confirmed: true
  seat_folder_reference_key_bound_to_system: true
  c3_field_status: held
  c3_field_allowed_updates: optics_only
  measures_registry_back_office_isolated: true

migration_artifact:
  migration_file_present: true
  migration_path: supabase/migrations/202606200001_map_stripe_price_ids_and_webhook_idempotency.sql
  migration_sha256_after_correction: 23C9F8C5216342347FD5938BFF1C0E4DACD80635BA55F4CBACC13C7977BB08ED
  corrected_map_c2_naming_used: true
  stale_map_commerce_contract_authority_used: false
  self_contained_map_c2_creation_added: true
  seated_price_env_key_names_used: true
  MAP_payment_activation_encoded: false
  checkout_activation_encoded: false
  registered_runtime_activation_encoded: false

live_standing_before_migration:
  map_c2_circuit_present: false
  map_commerce_contracts_present: true
  map_commerce_contracts_active_runtime_authority: false
  stripe_webhook_idempotency_present: false
  equivalent_idempotency_surface: public.stripe_webhook_events
  existing_payment_event_tables:
    - public.c3_payment_standing
    - public.map_payment_events

prior_dry_run:
  dry_run_performed: true
  dry_run_transaction_rolled_back: true
  dry_run_sql_completed: true
  dry_run_map_c2_rows: 3
  dry_run_all_map_rows_held: true
  dry_run_price_env_keys_match_seated_names: true
  dry_run_first_event_claim_succeeded: true
  dry_run_duplicate_event_blocked: true
  dry_run_idempotency_unique_key_present: true
  durable_dry_run_rows_created: 0

live_migration_application:
  applied_date: 2026-06-20
  migration_version: "202606200001"
  migration_applied: true
  migration_version_recorded_in_supabase_migrations: true
  map_c2_circuit_created: true
  stripe_webhook_events_created: true
  rls_enabled_map_c2_circuit: true
  rls_enabled_stripe_webhook_events: true
  access_restricted_to_service_role: true
  active_payment_records_after_migration: 0
  webhook_event_records_after_migration: 0

validation:
  process_key: map_stripe_webhook_idempotency_migration
  register_SEAT_live_DB_content_registration_confirmed: true
  register_SEAT_4x13_audit_closed: true
  register_SEAT_git_commit_confirmed: true
  migration_file_present: true
  migration_applied_or_confirmed: true
  map_c2_circuit_present: true
  map_c2_circuit_active_as_corrected_surface: true
  map_commerce_contracts_present: true
  map_commerce_contracts_active_runtime_authority: false
  stripe_price_predeploy_map_reference_present: true
  stripe_price_predeploy_map_value: price_1Tg87rP9heJD6LYqW8JkxRJw
  stripe_price_predeploy_map_env_key: STRIPE_PRICE_PREDEPLOY_MAP
  stripe_price_optimization_map_reference_present: true
  stripe_price_optimization_map_value: price_1Tg8CgP9heJD6LYqZoVQmH7H
  stripe_price_optimization_map_env_key: STRIPE_PRICE_OPTIMIZATION_MAP
  stripe_price_remediation_map_reference_present: true
  stripe_price_remediation_map_value: price_1Tg8IaP9heJD6LYq3y6CQHX5
  stripe_price_remediation_map_env_key: STRIPE_PRICE_REMEDIATION_MAP
  stripe_webhook_idempotency_present: true
  idempotency_unique_key_present: true
  idempotency_unique_constraint: stripe_webhook_events_stripe_event_id_key
  duplicate_event_guard_present: true
  duplicate_event_guard_mechanism: unique_constraint_plus_on_conflict_do_nothing_in_claim_function
  replay_protection_present: true
  replay_protection_mechanism: claim_function_5_minute_processing_window_check
  claim_function_present: true
  claim_function_name: public.claim_stripe_webhook_event
  claim_function_security: DEFINER
  registered_runtime_creation_performed: false
  registered_runtime_activation_performed: false
  MAP_payment_activation_performed: false
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
  validation_matrix_created: true
  oar1_closeout_created: true

notes:
  remediation_price_env_discrepancy: "STRIPE_PRICE_REMEDIATION_MAP in .env.local ends with trailing 'w' (price_1Tg8IaP9heJD6LYq3y6CQHX5w) but migration applied price_1Tg8IaP9heJD6LYq3y6CQHX5 (no trailing 'w'). Verify against Stripe dashboard before checkout activation."
  map_commerce_contracts_standing: "map_commerce_contracts table remains in live DB as stale/historical surface. Not modified or activated by this migration."
  registered_runtime_gate: "Registered runtime is the next distinct required gate before any runtime activation."

result:
  migration_applied_or_confirmed: true
  map_c2_circuit_present: true
  stripe_webhook_idempotency_present: true
  all_boundary_gates_held: true
  validation_matrix_created: true
  recommended_next_action: git_commit_map_stripe_webhook_idempotency_migration_evidence
  recommended_next_oar2_title: "OAR2 - Register MAP Payment Runtime Surface After Stripe Webhook Idempotency Migration Before Checkout Activation v1"

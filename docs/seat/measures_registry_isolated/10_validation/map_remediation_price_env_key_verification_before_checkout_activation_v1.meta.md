---
document_type: validation_matrix
authority_level: closeout_evidence
system_scope: measures_registry_map_checkout_price_verification
title: MAP Remediation Price Env Key Verification Before Checkout Activation v1
status: completed_remediation_price_env_verified
version: v1
operator: op044
process_key: map_remediation_price_env_verification
source_oar2: docs/seat/measures_registry_isolated/09_oar/oar2_verify_map_remediation_price_env_key_before_checkout_runtime_activation_v1.meta.md
---

# MAP Remediation Price Env Key Verification Before Checkout Activation v1

preflight:
  oar1_webhook_idempotency_migration_present: true
  oar1_register_map_payment_runtime_present: true
  map_payment_registered_runtime_validation_present: true
  migration_202606200001_present: true
  MAP_payment_runtime_registered: true
  runtime_state: registered_held
  registered_runtime_activation_performed: false
  checkout_activation_performed: false
  payment_activation_performed: false
  checkout_blocked_until_verified: true

env_read:
  env_file: .env.local
  STRIPE_PRICE_PREDEPLOY_MAP: price_1Tg87rP9heJD6LYqW8JkxRJw
  STRIPE_PRICE_OPTIMIZATION_MAP: price_1Tg8CgP9heJD6LYqZoVQmH7H
  STRIPE_PRICE_REMEDIATION_MAP_before: price_1Tg8IaP9heJD6LYq3y6CQHX5w

db_read:
  source: supabase/migrations/202606200001_map_stripe_price_ids_and_webhook_idempotency.sql
  source_confirmed_applied: true
  applied_git_commit: c1be0ab
  pre_deployment_price_id: price_1Tg87rP9heJD6LYqW8JkxRJw
  optimization_price_id: price_1Tg8CgP9heJD6LYqZoVQmH7H
  remediation_price_id: price_1Tg8IaP9heJD6LYq3y6CQHX5
  note: "RLS revokes anon/authenticated access to map_c2_circuit; DB value confirmed via applied migration source."

stripe_verification:
  verification_source: stripe_api
  verification_timestamp: 2026-06-20
  stripe_price_without_trailing_w_exists: true
  stripe_price_with_trailing_w_exists: false
  verified_remediation_price_id: price_1Tg8IaP9heJD6LYq3y6CQHX5
  stripe_price_without_trailing_w_details:
    id: price_1Tg8IaP9heJD6LYq3y6CQHX5
    active: true
    livemode: true
    currency: usd
    unit_amount: 99900
    type: one_time
    product: prod_UfTFCWo6OPmbbt
  stripe_price_with_trailing_w_result: 404_not_found

validation:
  process_key: map_remediation_price_env_verification
  runtime_key: map_payment_runtime_surface_v1
  MAP_payment_runtime_registered: true
  runtime_state: registered_held
  checkout_blocker_prior_to_oar: remediation_price_env_discrepancy
  env_file_reviewed: .env.local
  env_key: STRIPE_PRICE_REMEDIATION_MAP
  env_value_before: price_1Tg8IaP9heJD6LYq3y6CQHX5w
  db_value_before: price_1Tg8IaP9heJD6LYq3y6CQHX5
  stripe_price_without_trailing_w_exists: true
  stripe_price_with_trailing_w_exists: false
  verified_remediation_price_id: price_1Tg8IaP9heJD6LYq3y6CQHX5
  env_value_after: price_1Tg8IaP9heJD6LYq3y6CQHX5
  db_value_after: price_1Tg8IaP9heJD6LYq3y6CQHX5
  env_file_mutation_performed: true
  live_DB_price_mutation_performed: false
  remediation_price_env_discrepancy_resolved: true
  checkout_blocker_cleared_for_next_oar: true
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

result:
  remediation_price_env_discrepancy_resolved: true
  env_and_db_remediation_values_now_match: true
  live_DB_price_mutation_performed: false
  registered_runtime_activation_performed: false
  checkout_activation_performed: false
  MAP_payment_activation_performed: false
  authority_created: false
  validation_matrix_created: true
  oar1_closeout_created: true
  recommended_next_action: git_commit_remediation_price_env_verification_evidence
  recommended_next_oar2_title: "OAR2 - Activate Held MAP Checkout Runtime After Remediation Price Verification v1"

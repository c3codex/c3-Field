---
document_type: oar2
authority_level: working
system_scope: measures_registry_map_checkout_price_verification
title: OAR2 - Verify MAP Remediation Price Env Key Before Checkout Runtime Activation v1
status: proposed
version: v1
operator: op044
process_key: map_remediation_price_env_verification
depends_on:
  - map_stripe_webhook_idempotency_migration
  - map_payment_registered_runtime
mutation_scope:
  env_key_verification: true
  stripe_price_reference_validation: true
  db_price_reference_validation: true
  checkout_blocker_resolution: true
  validation_matrix: true
  oar1_closeout: true
  env_file_mutation: true
  live_DB_price_mutation: false
  registered_runtime_activation: false
  MAP_payment_activation: false
  Stripe_activation: false
  webhook_fulfillment_activation: false
  checkout_activation: false
  runtime_route_activation: false
  renderer_mutation: false
  public_copy_mutation: false
  authority_creation: false
  SEAT_authority_creation: false
  c3_key_creation: false
  certification_creation: false
  DAO_standing_creation: false
  Codexstone_conversion_creation: false
  Registry_Certification_creation: false
---

# OAR2 - Verify MAP Remediation Price Env Key Before Checkout Runtime Activation v1

## OBSERVED

MAP payment runtime is now registered and held.

Confirmed prior standing:

- runtime_key: map_payment_runtime_surface_v1
- runtime_registry_table: public.registered_process_log
- registered_runtime_creation_performed: true
- registered_runtime_activation_performed: false
- runtime_state: registered_held
- activation_state: inactive
- release_state: held
- bound_to_map_c2_circuit: true
- bound_to_stripe_webhook_idempotency: true
- bound_to_measures_registry_system: true
- MAP_payment_runtime_registered: true

Checkout remains blocked by remediation price mismatch:

- env_key: STRIPE_PRICE_REMEDIATION_MAP
- env_file: .env.local
- env_value: price_1Tg8IaP9heJD6LYq3y6CQHX5w
- db_value: price_1Tg8IaP9heJD6LYq3y6CQHX5
- discrepancy: trailing_w_in_env_not_in_db
- checkout_blocked_until_verified: true

This OAR2 resolves only the price/env verification seam.

## ALIGNED

The payment runtime is registered-held.

The checkout route must not activate while the remediation price discrepancy remains unresolved.

The current evidence indicates the DB value is:

price_1Tg8IaP9heJD6LYq3y6CQHX5

The current .env.local value appears to be:

price_1Tg8IaP9heJD6LYq3y6CQHX5w

This OAR2 must verify against Stripe or accepted Stripe source evidence before correcting anything.

This OAR2 may update local environment configuration only if verification confirms the correct remediation Stripe price ID.

This OAR2 must not activate checkout.

This OAR2 must not activate runtime.

This OAR2 must not mutate live DB price records unless a separate OAR authorizes DB correction.

This preserves:

- registered runtime does not equal activation
- price verification does not equal checkout activation
- env correction does not equal payment permission
- checkout remains held until a later activation OAR

## ROUTED

Executor must verify the MAP remediation Stripe price reference before checkout runtime activation.

### 1. Required preflight evidence

Executor must confirm these files exist:

- docs/seat/measures_registry_isolated/09_oar/oar1_apply_and_validate_map_stripe_webhook_idempotency_migration_in_live_supabase_after_register_seat_completion_v1.meta.md
- docs/seat/measures_registry_isolated/09_oar/oar1_register_map_payment_runtime_surface_after_stripe_webhook_idempotency_migration_before_checkout_activation_v1.meta.md
- docs/seat/measures_registry_isolated/10_validation/map_payment_registered_runtime_surface_validation_v1.meta.md
- supabase/migrations/202606200001_map_stripe_price_ids_and_webhook_idempotency.sql

Executor must confirm:

- MAP_payment_runtime_registered: true
- runtime_state: registered_held
- registered_runtime_activation_performed: false
- checkout_activation_performed: false
- payment_activation_performed: false
- checkout_blocked_until_verified: true

If runtime registration evidence is missing or uncommitted, stop.

### 2. Verify current env and DB values

Executor must read local env configuration and live DB MAP C2 circuit row.

Read from local env:

- STRIPE_PRICE_PREDEPLOY_MAP
- STRIPE_PRICE_OPTIMIZATION_MAP
- STRIPE_PRICE_REMEDIATION_MAP

Read from live DB:

- public.map_c2_circuit pre_deployment price_id
- public.map_c2_circuit optimization price_id
- public.map_c2_circuit remediation price_id

Expected observed values from prior closeout:

- pre_deployment DB: price_1Tg87rP9heJD6LYqW8JkxRJw
- optimization DB: price_1Tg8CgP9heJD6LYqZoVQmH7H
- remediation DB: price_1Tg8IaP9heJD6LYq3y6CQHX5

Known discrepancy:

- STRIPE_PRICE_REMEDIATION_MAP has trailing w in env
- DB remediation value does not have trailing w

### 3. Verify against Stripe source

Executor must verify which remediation price ID exists in Stripe.

Check both candidates:

- price_1Tg8IaP9heJD6LYq3y6CQHX5
- price_1Tg8IaP9heJD6LYq3y6CQHX5w

Executor must record:

- stripe_price_without_trailing_w_exists: true_or_false
- stripe_price_with_trailing_w_exists: true_or_false
- verified_remediation_price_id: exact_value_or_null
- verification_source: stripe_api_or_stripe_dashboard_operator_confirmation_or_other_explicit_source
- verification_timestamp: timestamp

If both exist, stop and request operator decision.

If neither exists, stop.

If Stripe cannot be queried directly, executor may stop with exact reason or use explicit operator-provided Stripe Dashboard evidence if available.

### 4. Correct local env only if verified

If Stripe confirms the DB value is correct, executor may update .env.local:

STRIPE_PRICE_REMEDIATION_MAP=price_1Tg8IaP9heJD6LYq3y6CQHX5

If Stripe confirms the env value with trailing w is correct, executor must not mutate DB under this OAR.

Instead stop and create OAR1 with:

- status: stopped_db_price_mismatch_requires_separate_oar
- verified_remediation_price_id: price_1Tg8IaP9heJD6LYq3y6CQHX5w
- live_DB_price_mutation_performed: false
- recommended_next_oar2_title: OAR2 - Correct MAP Remediation Price ID in Live DB Before Checkout Runtime Activation v1

### 5. Confirm no activation occurred

Executor must confirm:

- checkout_activation_performed: false
- MAP_payment_activation_performed: false
- Stripe_activation_performed: false
- webhook_fulfillment_activation_performed: false
- runtime_route_activation_performed: false
- registered_runtime_activation_performed: false
- renderer_mutation_performed: false
- public_copy_mutation_performed: false

### 6. Produce validation matrix

Executor must create:

docs/seat/measures_registry_isolated/10_validation/map_remediation_price_env_key_verification_before_checkout_activation_v1.meta.md

Validation matrix must include:

- process_key: map_remediation_price_env_verification
- runtime_key: map_payment_runtime_surface_v1
- MAP_payment_runtime_registered: true_or_false
- runtime_state: registered_held_or_missing
- checkout_blocker_prior_to_oar: remediation_price_env_discrepancy
- env_file_reviewed: .env.local
- env_key: STRIPE_PRICE_REMEDIATION_MAP
- env_value_before: exact_value
- db_value_before: exact_value
- stripe_price_without_trailing_w_exists: true_or_false_or_unchecked
- stripe_price_with_trailing_w_exists: true_or_false_or_unchecked
- verified_remediation_price_id: exact_value_or_null
- env_value_after: exact_value_or_unchanged
- db_value_after: exact_value_or_unchanged
- env_file_mutation_performed: true_or_false
- live_DB_price_mutation_performed: false
- remediation_price_env_discrepancy_resolved: true_or_false
- checkout_blocker_cleared_for_next_oar: true_or_false
- registered_runtime_activation_performed: false
- MAP_payment_activation_performed: false
- Stripe_activation_performed: false
- webhook_fulfillment_activation_performed: false
- checkout_activation_performed: false
- runtime_route_activation_performed: false
- renderer_mutation_performed: false
- public_copy_mutation_performed: false
- authority_created: false
- SEAT_authority_created: false
- c3_key_created: false
- certification_created: false
- DAO_standing_created: false
- Codexstone_conversion_created: false
- Registry_Certification_created: false

### 7. Produce OAR1 closeout

Executor must create:

docs/seat/measures_registry_isolated/09_oar/oar1_verify_map_remediation_price_env_key_before_checkout_runtime_activation_v1.meta.md

OAR1 must include:

- status: completed_remediation_price_env_verified_or_stopped_without_activation
- process_key: map_remediation_price_env_verification
- runtime_key: map_payment_runtime_surface_v1
- MAP_payment_runtime_registered: true_or_false
- runtime_state: registered_held_or_missing
- env_key: STRIPE_PRICE_REMEDIATION_MAP
- env_value_before: exact_value
- db_value_before: exact_value
- verified_remediation_price_id: exact_value_or_null
- env_file_mutation_performed: true_or_false
- live_DB_price_mutation_performed: false
- remediation_price_env_discrepancy_resolved: true_or_false
- checkout_blocker_cleared_for_next_oar: true_or_false
- registered_runtime_activation_performed: false
- checkout_activation_performed: false
- MAP_payment_activation_performed: false
- authority_created: false
- recommended_next_action: git_commit_remediation_price_env_verification_evidence
- recommended_next_oar2_title: OAR2 - Activate Held MAP Checkout Runtime After Remediation Price Verification v1

## EXECUTOR ROLE

Executor may:

- verify prior runtime registration evidence
- inspect .env.local values
- inspect live DB MAP C2 circuit price IDs
- verify Stripe price ID existence
- correct .env.local if Stripe confirms DB value is correct
- create validation matrix
- create OAR1 closeout

Executor may not:

- activate checkout
- activate MAP payment
- activate registered runtime
- activate webhook fulfillment
- activate frontend route
- mutate renderer
- mutate public copy
- mutate live DB price ID under this OAR
- create c3 Key
- create certification
- create DAO standing
- create Codexstone conversion
- create Registry Certification
- treat price verification as payment permission

## VALIDATION

This OAR2 resolves successfully when:

- MAP_payment_runtime_registered: true
- runtime_state: registered_held
- remediation price ID verified against Stripe or explicit accepted source
- env and DB remediation values match after verification, or discrepancy is stopped for separate DB correction
- live_DB_price_mutation_performed: false
- registered_runtime_activation_performed: false
- checkout_activation_performed: false
- MAP_payment_activation_performed: false
- authority_created: false
- validation_matrix_created: true
- oar1_closeout_created: true

## STOP CONDITIONS

Executor must stop if:

- runtime registration evidence missing: true
- runtime registration git commit missing: true
- map_c2_circuit missing: true
- env file missing: true
- Stripe verification unavailable and no operator dashboard evidence provided: true
- both candidate price IDs exist in Stripe: true
- neither candidate price ID exists in Stripe: true
- DB price mutation required to resolve: true
- checkout activation required to continue: true
- payment activation required to continue: true
- authority creation required to continue: true

If stopped, executor must create OAR1 with:

- status: stopped_without_activation
- reason: exact_reason
- env_file_mutation_performed: false_unless_already_safely_completed
- live_DB_price_mutation_performed: false
- registered_runtime_activation_performed: false
- checkout_activation_performed: false
- MAP_payment_activation_performed: false
- authority_created: false

## EXPECTED NEXT ACTION AFTER CLOSEOUT

If price verification succeeds:

1. file check validation + OAR1
2. git commit remediation price env verification evidence
3. proceed to held checkout runtime activation OAR

Required commit message:

MAP: verify remediation price env key before checkout activation

## EXPECTED NEXT OAR2 AFTER COMMIT

OAR2 - Activate Held MAP Checkout Runtime After Remediation Price Verification v1

## CLOSE

Verify the MAP remediation Stripe price ID.

Resolve the env mismatch only if verified.

Do not mutate live DB price records under this OAR.

Do not activate checkout.

Do not activate payment.

Do not activate registered runtime.

---
document_type: oar2
authority_level: working
system_scope: measures_registry_map_checkout_runtime_activation
title: OAR2 - Activate Held MAP Checkout Runtime After Remediation Price Verification v1
status: proposed
version: v1
operator: op044
process_key: map_checkout_runtime_activation
depends_on:
  - map_stripe_webhook_idempotency_migration
  - map_payment_registered_runtime
  - map_remediation_price_env_verification
mutation_scope:
  registered_runtime_activation: true
  checkout_runtime_activation: true
  map_c2_circuit_release_transition: true
  runtime_route_activation: true
  validation_matrix: true
  oar1_closeout: true
  MAP_payment_activation: false
  payment_completion_activation: false
  webhook_fulfillment_activation: false
  c3_key_creation: false
  SRC_binding_creation: false
  permission_creation: false
  certification_creation: false
  DAO_standing_creation: false
  Codexstone_conversion_creation: false
  Registry_Certification_creation: false
  renderer_mutation: false
  public_copy_mutation: false
  authority_creation: false
---

# OAR2 - Activate Held MAP Checkout Runtime After Remediation Price Verification v1

## OBSERVED

The MAP payment runtime surface has been registered and held.

Confirmed registered runtime standing:

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
- all_MAP_rows_release_state_held: true
- active_payment_records: 0
- checkout_activation_performed: false
- payment_activation_performed: false
- authority_created: false

The remediation price blocker has been cleared.

Confirmed remediation price verification standing:

- process_key: map_remediation_price_env_verification
- runtime_key: map_payment_runtime_surface_v1
- stripe_verification_source: stripe_api
- stripe_price_without_trailing_w_exists: true
- stripe_price_with_trailing_w_exists: false
- verified_remediation_price_id: price_1Tg8IaP9heJD6LYq3y6CQHX5
- env_file_mutation_performed: true
- live_DB_price_mutation_performed: false
- remediation_price_env_discrepancy_resolved: true
- checkout_blocker_cleared_for_next_oar: true

No activation has occurred yet.

## ALIGNED

This OAR2 activates the held MAP checkout runtime only.

It may transition runtime state from registered_held to active_checkout_held_payment.

It may transition MAP C2 circuit rows from held to checkout_available if all validation passes.

It may activate checkout route availability only for MAP payment initiation.

It must not create payment completion.

It must not process webhook fulfillment.

It must not create c3 Key.

It must not create SRC binding.

It must not create permission standing.

It must not create Measures Conversion.

It must not create Registry Certification.

This preserves:

- checkout activation does not equal payment completion
- payment initiation does not equal permission
- payment completion does not equal c3 Key
- c3 Key does not equal conversion
- c3 MAP does not equal Measures Conversion
- Measures Conversion does not equal Registry Certification

## ROUTED

Executor must activate the held MAP checkout runtime after confirmed remediation price verification.

### 1. Required preflight evidence

Executor must confirm these files exist:

- docs/seat/measures_registry_isolated/09_oar/oar1_apply_and_validate_map_stripe_webhook_idempotency_migration_in_live_supabase_after_register_seat_completion_v1.meta.md
- docs/seat/measures_registry_isolated/09_oar/oar1_register_map_payment_runtime_surface_after_stripe_webhook_idempotency_migration_before_checkout_activation_v1.meta.md
- docs/seat/measures_registry_isolated/09_oar/oar1_verify_map_remediation_price_env_key_before_checkout_runtime_activation_v1.meta.md
- docs/seat/measures_registry_isolated/10_validation/map_stripe_webhook_idempotency_live_migration_validation_after_register_seat_v1.meta.md
- docs/seat/measures_registry_isolated/10_validation/map_payment_registered_runtime_surface_validation_v1.meta.md
- docs/seat/measures_registry_isolated/10_validation/map_remediation_price_env_key_verification_before_checkout_activation_v1.meta.md

Executor must confirm git commits exist for:

- MAP: apply Stripe webhook idempotency migration after register_SEAT
- MAP: register held payment runtime surface before checkout activation
- MAP: verify remediation price env key before checkout activation

If any required evidence or commit is missing, stop before activation.

### 2. Confirm live DB readiness

Executor must inspect live Supabase and confirm:

- public.map_c2_circuit exists: true
- public.stripe_webhook_events exists: true
- public.registered_process_log exists: true
- runtime_key map_payment_runtime_surface_v1 exists: true
- runtime_state: registered_held
- activation_state: inactive
- release_state: held
- map_c2_circuit rows exist for:
  - pre_deployment
  - optimization
  - remediation
- all MAP C2 rows have valid Stripe price IDs
- all MAP C2 rows are still held before activation
- webhook event table has zero active payment records or only safe prior non-activation records
- RLS remains enabled where previously enabled

### 3. Confirm Stripe price IDs before activation

Executor must verify all three MAP Stripe price IDs resolve as live/active Stripe prices:

- STRIPE_PRICE_PREDEPLOY_MAP
- STRIPE_PRICE_OPTIMIZATION_MAP
- STRIPE_PRICE_REMEDIATION_MAP

Executor must record:

- pre_deployment_price_verified: true_or_false
- optimization_price_verified: true_or_false
- remediation_price_verified: true_or_false
- all_MAP_prices_verified: true_or_false

If any price does not verify, stop.

### 4. Activate checkout runtime only

Executor may update the registered runtime record:

- runtime_state: checkout_runtime_active
- activation_state: checkout_available
- release_state: active
- checkout_activation_state: active
- webhook_fulfillment_state: held
- payment_fulfillment_state: held
- public_route_state: checkout_available
- renderer_state: no_mutation

Executor may update c3_registered_system metadata to reflect:

- MAP_payment_runtime_registration_state: checkout_runtime_active
- MAP_checkout_runtime_activation_state: active
- MAP_payment_completion_state: held
- MAP_webhook_fulfillment_state: held

Executor may update map_c2_circuit release state only if required for checkout availability:

- release_state: checkout_available
- payment_completion_state: held
- fulfillment_state: held
- permission_state: held
- c3_key_state: held
- certification_state: held

Executor must not create payment records.

Executor must not trigger checkout sessions.

Executor must not call Stripe checkout APIs unless only verifying price IDs.

### 5. Preserve webhook fulfillment hold

Executor must confirm:

- webhook_fulfillment_activation_performed: false
- webhook_fulfillment_state: held
- payment_completion_activation_performed: false
- active_payment_records_created: 0
- test_payment_created: false

Webhook idempotency may exist and remain ready, but fulfillment must stay inactive until a separate OAR authorizes payment-completion handling.

### 6. Confirm route and renderer boundary

Executor must not mutate frontend renderer or public copy in this OAR.

If route activation requires code changes, executor must stop and create OAR1 with:

- status: stopped_checkout_activation_requires_src_route_oar
- registered_runtime_activation_performed: false
- checkout_activation_performed: false
- recommended_next_oar2_title: OAR2 - Wire MAP Checkout Route to Registered Runtime Surface Without Public Copy Mutation v1

If checkout route can be enabled entirely by DB/runtime state, executor may proceed.

### 7. Produce validation matrix

Executor must create:

docs/seat/measures_registry_isolated/10_validation/map_checkout_runtime_activation_after_price_verification_v1.meta.md

Validation matrix must include:

- process_key: map_checkout_runtime_activation
- runtime_key: map_payment_runtime_surface_v1
- required_prior_oar1s_present: true_or_false
- required_git_commits_confirmed: true_or_false
- MAP_payment_runtime_registered: true_or_false
- remediation_price_env_discrepancy_resolved: true_or_false
- checkout_blocker_cleared_prior_to_activation: true_or_false
- pre_deployment_price_verified: true_or_false
- optimization_price_verified: true_or_false
- remediation_price_verified: true_or_false
- all_MAP_prices_verified: true_or_false
- registered_runtime_activation_performed: true_or_false
- runtime_state_before: exact_value
- runtime_state_after: exact_value
- activation_state_before: exact_value
- activation_state_after: exact_value
- release_state_before: exact_value
- release_state_after: exact_value
- checkout_activation_performed: true_or_false
- checkout_activation_state: active_or_held
- runtime_route_activation_performed: true_or_false
- MAP_payment_activation_performed: false
- payment_completion_activation_performed: false
- webhook_fulfillment_activation_performed: false
- active_payment_records_created: 0
- test_payment_created: false
- renderer_mutation_performed: false
- public_copy_mutation_performed: false
- authority_created: false
- SEAT_authority_created: false
- c3_key_created: false
- SRC_binding_created: false
- permission_created: false
- certification_created: false
- DAO_standing_created: false
- Codexstone_conversion_created: false
- Registry_Certification_created: false

### 8. Produce OAR1 closeout

Executor must create:

docs/seat/measures_registry_isolated/09_oar/oar1_activate_held_map_checkout_runtime_after_remediation_price_verification_v1.meta.md

OAR1 must include:

- status: completed_checkout_runtime_active_or_stopped_without_activation
- process_key: map_checkout_runtime_activation
- runtime_key: map_payment_runtime_surface_v1
- registered_runtime_activation_performed: true_or_false
- checkout_activation_performed: true_or_false
- runtime_state_before: exact_value
- runtime_state_after: exact_value
- activation_state_before: exact_value
- activation_state_after: exact_value
- release_state_before: exact_value
- release_state_after: exact_value
- all_MAP_prices_verified: true_or_false
- payment_completion_activation_performed: false
- webhook_fulfillment_activation_performed: false
- active_payment_records_created: 0
- renderer_mutation_performed: false
- public_copy_mutation_performed: false
- authority_created: false
- c3_key_created: false
- SRC_binding_created: false
- permission_created: false
- certification_created: false
- recommended_next_action: git_commit_checkout_runtime_activation_evidence
- recommended_next_oar2_title: OAR2 - Wire MAP Checkout Route to Registered Runtime Surface Without Public Copy Mutation v1

## EXECUTOR ROLE

Executor may:

- verify prior OAR1 evidence
- verify git commits
- verify MAP C2 Stripe price IDs
- activate held MAP checkout runtime in live DB
- update runtime state to checkout_available
- update MAP C2 circuit release state only as required for checkout availability
- preserve payment completion as held
- preserve webhook fulfillment as held
- create validation matrix
- create OAR1 closeout

Executor may not:

- create payment completion
- create payment records
- trigger Stripe checkout sessions
- activate webhook fulfillment
- activate payment fulfillment
- create c3 Key
- create SRC binding
- create permission standing
- create certification
- create DAO standing
- create Codexstone conversion
- create Registry Certification
- mutate renderer
- mutate public copy
- bypass route boundary
- treat checkout availability as payment completion

## VALIDATION

This OAR2 resolves successfully when:

- required_prior_oar1s_present: true
- required_git_commits_confirmed: true
- remediation_price_env_discrepancy_resolved: true
- all_MAP_prices_verified: true
- registered_runtime_activation_performed: true
- runtime_state_after: checkout_runtime_active
- activation_state_after: checkout_available
- checkout_activation_performed: true
- payment_completion_activation_performed: false
- webhook_fulfillment_activation_performed: false
- active_payment_records_created: 0
- renderer_mutation_performed: false
- public_copy_mutation_performed: false
- authority_created: false
- c3_key_created: false
- certification_created: false
- validation_matrix_created: true
- oar1_closeout_created: true

## STOP CONDITIONS

Executor must stop before activation if:

- prior OAR1 evidence missing: true
- required git commit missing: true
- runtime record missing: true
- runtime not in registered_held state: true
- remediation price verification missing: true
- checkout blocker not cleared: true
- any MAP Stripe price fails verification: true
- map_c2_circuit missing: true
- stripe_webhook_events missing: true
- registered_process_log missing: true
- route activation requires src mutation: true
- payment completion required to continue: true
- webhook fulfillment required to continue: true
- authority creation required to continue: true

If stopped, executor must create OAR1 with:

- status: stopped_without_activation
- reason: exact_reason
- registered_runtime_activation_performed: false
- checkout_activation_performed: false
- payment_completion_activation_performed: false
- webhook_fulfillment_activation_performed: false
- active_payment_records_created: 0
- authority_created: false

## EXPECTED NEXT ACTION AFTER CLOSEOUT

If checkout runtime activation succeeds:

1. file check validation + OAR1
2. git commit checkout runtime activation evidence
3. wire MAP checkout route to registered runtime surface if route work is still required

Required commit message:

MAP: activate held checkout runtime after price verification

## EXPECTED NEXT OAR2 AFTER COMMIT

OAR2 - Wire MAP Checkout Route to Registered Runtime Surface Without Public Copy Mutation v1

## CLOSE

Activate the held MAP checkout runtime.

Do not create payment completion.

Do not activate webhook fulfillment.

Do not trigger Stripe checkout sessions.

Do not mutate renderer or public copy.

Do not create c3 Key, permission, certification, DAO standing, Codexstone conversion, or Registry Certification.

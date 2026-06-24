---
document_type: oar2
authority_level: working
system_scope: measures_registry_map_live_supabase
title: OAR2 - Apply and Validate MAP Stripe Webhook Idempotency Migration in Live Supabase After MAP C2 Circuit Correction v1
status: proposed
version: v1
operator: op044
mutation_scope:
  privileged_readonly_preflight: true
  live_DB_migration: true
  map_c2_circuit_creation_or_repair: true
  stale_map_commerce_contracts_resolution: true
  stripe_price_id_reference_seating: true
  webhook_idempotency_structure: true
  validation_matrix: true
  Stripe_activation: false
  webhook_activation: false
  checkout_activation: false
  payment_route_activation: false
  runtime_mutation: false
  route_mutation: false
  renderer_mutation: false
  public_copy_mutation: false
  SEAT_authority_creation: false
  c3_key_creation: false
  certification_creation: false
  DAO_standing_creation: false
  Codexstone_conversion_creation: false
  Registry_Certification_creation: false
---

# OAR2 - Apply and Validate MAP Stripe Webhook Idempotency Migration in Live Supabase After MAP C2 Circuit Correction v1

## OBSERVED

Measures Registry SEAT folder reference standing has now been registered in live Supabase.

The prior OAR1 confirms:

- live connection successful
- required schema accessible
- existing reference surface identified
- reference target table: public.codex_source_reference
- reference record key: measures_registry_seat_folder_reference_v1
- SEAT folder reference inserted or confirmed
- reference-only standing confirmed in live DB
- live DB mutation was limited to reference registration
- no payment, webhook, checkout, runtime, route, renderer, public-copy, or authority activation occurred

The same OAR1 also discovered current live payment-schema drift:

- existing_payment_tables_present: true
- existing_map_c2_circuit_present: false
- existing_map_commerce_contracts_present: true
- existing_stripe_idempotency_present: false

Therefore live Supabase still contains stale map_commerce_contracts standing, while corrected map_c2_circuit standing is absent.

The prior semantic correction already closed source-side naming:

- stale table: map_commerce_contracts
- replacement table: map_c2_circuit
- runtime row type: MapC2CircuitRow
- runtime collection: mapC2Circuit
- checkout resolution: MAP_payment_option_from_map_c2_circuit
- primary row identity: map_circuit_key

That correction passed tests and production build, but live migration remained held until SEAT reference and preflight resolved.

Stripe configuration has also already been revalidated:

- STRIPE_SECRET_KEY present
- STRIPE_WEBHOOK_SECRET present
- all three MAP price IDs present
- webhook endpoint present
- required webhook events implemented
- idempotency guard implemented
- focused tests passed 12/12
- payment provider ready
- webhook ready
- all three MAP payment path mappings ready

## ALIGNED

The next valid action is to apply the approved live Supabase migration that replaces stale MAP commerce contract standing with corrected MAP C2 circuit standing and seats webhook idempotency support.

This OAR2 may mutate live Supabase only within the bounded migration scope.

This OAR2 does not activate:

- Stripe checkout
- webhook fulfillment
- payment route
- runtime route
- renderer behavior
- public copy
- SEAT authority
- c3 Key
- certification
- DAO standing
- Codexstone conversion
- Registry Certification

This preserves:

Codex -> Field -> Measures -> OAR2 -> Chazz -> Cody -> src

The correction must be DB-first and registry-safe.

The renderer and checkout path may only rely on seated DB state after this migration is proven.

## ROUTED

Cody must perform privileged preflight before mutation.

### 1. Privileged read-only preflight

Cody must confirm:

- live_connection_successful: true
- required_schema_accessible: true
- seat_folder_reference_exists: true
- seat_folder_reference_key: measures_registry_seat_folder_reference_v1
- reference_target_table_name: public.codex_source_reference
- existing_map_commerce_contracts_present: true_or_false
- existing_map_c2_circuit_present: true_or_false
- existing_stripe_idempotency_present: true_or_false
- payment_activation_currently_held: true
- webhook_activation_currently_held: true
- checkout_activation_currently_held: true
- authority_created_currently_false: true

If privileged preflight fails, Cody must stop without mutation.

### 2. Apply approved MAP C2 circuit correction migration

Cody may apply the pending migration only if preflight confirms the SEAT folder live DB reference exists.

Migration must resolve the live standing from stale MAP commerce naming to corrected MAP C2 circuit naming.

Required target standing:

- corrected_table: public.map_c2_circuit
- stale_table_status: no_longer_active_runtime_authority
- primary_row_identity: map_circuit_key
- runtime_collection: mapC2Circuit
- checkout_resolution: MAP_payment_option_from_map_c2_circuit

Cody must not preserve map_commerce_contracts as active runtime authority.

If the migration cannot safely replace or supersede map_commerce_contracts, Cody must stop and report exact blocker.

### 3. Seat Stripe MAP price ID references

Cody may seat validated Stripe price IDs for the three MAP payment paths only as DB reference/configuration state.

Required MAP paths:

- predeploy_MAP: STRIPE_PRICE_PREDEPLOY_MAP
- optimization_MAP: STRIPE_PRICE_OPTIMIZATION_MAP
- remediation_MAP: STRIPE_PRICE_REMEDIATION_MAP

This is not checkout activation.

### 4. Seat webhook idempotency structure

Cody may create or validate the webhook idempotency structure required for safe Stripe webhook processing.

Required standing:

- stripe_idempotency_structure_present: true
- idempotency_guard_ready: true
- webhook_fulfillment_activation: false

### 5. Validate live DB standing

Cody must validate:

- map_c2_circuit_present: true
- map_c2_circuit_expected_rows_present: true
- map_c2_circuit_uses_map_circuit_key: true
- map_commerce_contracts_not_active_runtime_authority: true
- stripe_price_ids_present_for_all_three_MAP_paths: true
- stripe_idempotency_structure_present: true
- payment_activation_still_held: true
- webhook_activation_still_held: true
- checkout_activation_still_held: true
- runtime_mutation_performed: false
- route_mutation_performed: false
- renderer_mutation_performed: false
- authority_created: false

### 6. Produce validation matrix

Cody must create:

docs/seat/measures_registry_isolated/10_validation/live_supabase_map_c2_circuit_and_stripe_webhook_idempotency_migration_validation_v1.meta.md

The validation matrix must include:

- privileged_preflight_completed: true_or_false
- live_connection_successful: true_or_false
- seat_folder_reference_confirmed: true_or_false
- migration_applied: true_or_false
- map_c2_circuit_present: true_or_false
- map_c2_circuit_row_count: number_or_null
- map_commerce_contracts_present: true_or_false
- map_commerce_contracts_active_runtime_authority: false
- stripe_price_ids_present_for_all_three_MAP_paths: true_or_false
- stripe_idempotency_structure_present: true_or_false
- payment_activation_still_held: true
- webhook_activation_still_held: true
- checkout_activation_still_held: true
- runtime_mutation_performed: false
- route_mutation_performed: false
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

Cody must create:

docs/seat/measures_registry_isolated/09_oar/oar1_apply_and_validate_map_stripe_webhook_idempotency_migration_in_live_supabase_after_map_c2_circuit_correction_v1.meta.md

## CODY ROLE

Cody may:

- use the resolved session-pooler live database endpoint
- perform privileged read-only preflight
- verify SEAT folder reference standing
- apply the approved MAP C2 circuit / Stripe webhook idempotency migration
- validate live DB rows, constraints, indexes, and idempotency standing
- create validation matrix
- create OAR1 closeout

Cody may not:

- activate Stripe checkout
- activate webhook fulfillment
- activate payment route
- mutate runtime, route, renderer, or public copy
- create SEAT authority
- issue c3 Key
- create certification
- create DAO standing
- create Codexstone conversion
- create Registry Certification
- treat payment config as permission
- treat migration completion as MAP purchase activation

## VALIDATION

This OAR2 resolves successfully when:

- privileged_preflight_completed: true
- seat_folder_reference_confirmed: true
- live_DB_migration_applied_or_confirmed: true
- map_c2_circuit_present: true
- map_c2_circuit_expected_rows_present: true
- map_commerce_contracts_active_runtime_authority: false
- stripe_price_ids_present_for_all_three_MAP_paths: true
- stripe_idempotency_structure_present: true
- payment_activation_still_held: true
- webhook_activation_still_held: true
- checkout_activation_still_held: true
- runtime_mutation_performed: false
- route_mutation_performed: false
- renderer_mutation_performed: false
- authority_created: false
- SEAT_authority_created: false
- c3_key_created: false
- certification_created: false
- DAO_standing_created: false
- Codexstone_conversion_created: false
- Registry_Certification_created: false
- validation_matrix_created: true
- oar1_closeout_created: true

## STOP CONDITIONS

Cody must stop without mutation if:

- live_connection_failed: true
- schema_access_failed: true
- seat_folder_reference_missing: true
- migration_file_missing: true
- migration_hash_mismatch: true
- target_table_unclear: true
- map_commerce_contracts_cannot_be_safely_superseded: true
- stripe_price_config_missing: true
- webhook_idempotency_structure_unclear: true
- authority_creation_required: true
- runtime_route_or_renderer_mutation_required: true

If stopped, Cody must produce an OAR1 closeout with:

- status: stopped_no_mutation
- reason: exact_reason
- live_DB_migration_performed: false
- payment_activation_performed: false
- authority_created: false

## EXPECTED NEXT OAR2 AFTER CLOSEOUT

Only after live MAP C2 circuit and webhook idempotency migration is confirmed:

OAR2 - Activate Measures Registry MAP Payment Resolution Route v1

## CLOSE

Apply the corrected MAP C2 circuit migration only after preflight.

Seat Stripe price references and webhook idempotency as DB configuration only.

Do not activate payment.

Do not activate checkout.

Do not create authority.

Prove the live DB migration before runtime route activation.

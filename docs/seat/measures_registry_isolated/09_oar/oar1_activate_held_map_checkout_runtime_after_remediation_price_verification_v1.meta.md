---
document_type: oar1
authority_level: closeout
system_scope: measures_registry_map_checkout_runtime_activation
title: OAR1 - Activate Held MAP Checkout Runtime After Remediation Price Verification v1
status: completed_checkout_runtime_active
version: v1
operator: op044
process_key: map_checkout_runtime_activation
source_oar2: docs/seat/measures_registry_isolated/09_oar/oar2_activate_held_map_checkout_runtime_after_remediation_price_verification_v1.meta.md
---

# OAR1 - Activate Held MAP Checkout Runtime After Remediation Price Verification v1

closeout:
  status: completed_checkout_runtime_active
  applied_date: 2026-06-20
  process_key: map_checkout_runtime_activation
  runtime_key: map_payment_runtime_surface_v1
  registered_runtime_activation_performed: true
  checkout_activation_performed: true
  runtime_route_activation_performed: true
  runtime_state_before: registered_held
  runtime_state_after: checkout_runtime_active
  activation_state_before: inactive
  activation_state_after: checkout_available
  release_state_before: held
  release_state_after: active
  all_MAP_prices_verified: true
  payment_completion_activation_performed: false
  webhook_fulfillment_activation_performed: false
  active_payment_records_created: 0
  renderer_mutation_performed: false
  public_copy_mutation_performed: false
  authority_created: false
  c3_key_created: false
  SRC_binding_created: false
  permission_created: false
  certification_created: false
  validation_matrix_created: true
  oar1_closeout_created: true
  recommended_next_action: git_commit_checkout_runtime_activation_evidence
  recommended_next_oar2_title: "OAR2 - Wire MAP Checkout Route to Registered Runtime Surface Without Public Copy Mutation v1"

activation_detail:
  map_c2_circuit_update:
    table: public.map_c2_circuit
    rows_updated: 3
    release_state_before: held
    release_state_after: active
    rows: [pre_deployment, optimization, remediation]
  registered_process_log_update:
    table: public.registered_process_log
    record_id: 1f060c4c-f799-4518-9284-97166e09d3b3
    process_key: map_payment_registered_runtime
    metadata_updated: true
    standing_field_constrained: true
    standing_field_note: check_constraint_rejected_checkout_runtime_active_value_activation_captured_in_metadata_only
    standing_field_remains: held

stripe_price_verification:
  pre_deployment:
    env_key: STRIPE_PRICE_PREDEPLOY_MAP
    price_id: price_1Tg87rP9heJD6LYqW8JkxRJw
    stripe_response: 200
    verified: true
  optimization:
    env_key: STRIPE_PRICE_OPTIMIZATION_MAP
    price_id: price_1Tg8CgP9heJD6LYqZoVQmH7H
    stripe_response: 200
    verified: true
  remediation:
    env_key: STRIPE_PRICE_REMEDIATION_MAP
    price_id: price_1Tg8IaP9heJD6LYq3y6CQHX5
    stripe_response: 200
    verified: true
  all_MAP_prices_verified: true

route_boundary:
  route_activation_required_code_change: false
  route_gate: functions/api/map/create-checkout-session.ts release_state=eq.active filter
  route_activated_by_db_mutation_only: true
  renderer_mutation_performed: false
  public_copy_mutation_performed: false

boundary_confirmation:
  MAP_payment_runtime_registered: true
  registered_runtime_activation_performed: true
  checkout_activation_performed: true
  Stripe_activation_performed: false
  webhook_fulfillment_activation_performed: false
  payment_completion_activation_performed: false
  runtime_route_activation_performed: true
  MAP_payment_activation_performed: false
  renderer_mutation_performed: false
  public_copy_mutation_performed: false
  authority_created: false
  SEAT_authority_created: false
  c3_key_created: false
  SRC_binding_created: false
  permission_created: false
  certification_created: false
  DAO_standing_created: false
  Codexstone_conversion_created: false
  Registry_Certification_created: false
  active_payment_records_created: 0
  test_payment_created: false

The MAP checkout runtime is now active. All three MAP C2 circuit rows (pre_deployment, optimization, remediation) have been updated from release_state held to active in public.map_c2_circuit. The registered_process_log metadata reflects runtime_state checkout_runtime_active, activation_state checkout_available. The checkout server endpoint (create-checkout-session.ts) is now capable of serving MAP payment options via the release_state=eq.active DB filter. Webhook fulfillment, payment completion, renderer, and public copy remain held. No payment records were created. No test payments were triggered. Commit evidence and wire checkout route are the recommended next steps.

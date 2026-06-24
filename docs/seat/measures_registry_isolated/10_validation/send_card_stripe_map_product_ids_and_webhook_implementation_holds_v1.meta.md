---
document_type: send_card
authority_level: operator_action_request
system_scope: measures_codex
title: send_card - Stripe MAP Product IDs and Webhook Implementation Holds v1
status: awaiting_operator_action
version: v1
visibility: public_facing
---

standing:
  status: awaiting_operator_action
  send_card_type: constraint_agreement_resolution_delivery
  public_facing: true
  operator_action_required: true
  payment_activation_allowed: false
  webhook_activation_allowed: false
  live_checkout_activation_allowed: false

delivery:
  send_card_id: send_card_stripe_map_product_ids_and_webhook_implementation_holds_v1
  sender: Measures_Registry_payment_resolution_process
  recipient: operator
  actor: Chazz

constraint:
  label: Stripe MAP Product IDs and Webhook Holds
  problem: MAP launch payment cannot activate until all three Stripe MAP price IDs are seated and webhook event and idempotency implementation is verified.
  why_it_matters: Payment-of-scope is required for MAP launch resolution.
  affected_scope:
    - MAP_payment_resolution
    - live_checkout_activation
    - payment_of_scope_confirmation
    - survey_surface_login_after_payment
  threshold_blocked: MAP_payment_activation

agreement:
  action_needed_from_operator:
    - provide_or_confirm_STRIPE_PRICE_PREDEPLOY_MAP
    - provide_or_confirm_STRIPE_PRICE_OPTIMIZATION_MAP
    - provide_or_confirm_STRIPE_PRICE_REMEDIATION_MAP
    - confirm_webhook_destination_events_selected_in_Stripe
  required_price_env_keys:
    - STRIPE_PRICE_PREDEPLOY_MAP
    - STRIPE_PRICE_OPTIMIZATION_MAP
    - STRIPE_PRICE_REMEDIATION_MAP
  required_webhook_events:
    - checkout.session.completed
    - checkout.session.expired
    - payment_intent.succeeded
    - payment_intent.payment_failed
  required_implementation_confirmation:
    - all_four_required_events_handled
    - duplicate_webhook_event_guard_implemented

MAP_price_mapping:
  - env_key: STRIPE_PRICE_PREDEPLOY_MAP
    public_label: Environmental Alignment Prior to Deployment MAP
    price_usd: 333
  - env_key: STRIPE_PRICE_OPTIMIZATION_MAP
    public_label: Optimize Environment MAP
    price_usd: 777
  - env_key: STRIPE_PRICE_REMEDIATION_MAP
    public_label: Environmental Remediation MAP
    price_usd: 999

resolution:
  return_to_sender_required: true
  if_operator_provides_price_ids:
    next_system_action: seat_price_ids_and_verify_webhook_idempotency_by_next_OAR2
    return_message_to_sender: Operator provided Stripe MAP product or price IDs. Payment config can proceed to precise repair and verification.
  if_operator_blocks:
    next_system_action: hold_MAP_payment_activation
    return_message_to_sender: Operator blocked payment activation pending further Stripe review.
  if_operator_requests_rework:
    next_system_action: reroute_payment_provider_review
    return_message_to_sender: Operator requested rework before Stripe payment activation.

payment_boundary:
  payment_opens_only_MAP_payment_of_scope_resolution: true
  payment_does_not_create_SEAT: true
  payment_does_not_create_SEAL: true
  payment_does_not_create_Registry_Standing: true
  payment_does_not_create_c3_key: true
  payment_does_not_create_DAO_participation: true
  payment_does_not_create_Branch: true
  payment_does_not_create_wallet_activation: true
  payment_does_not_create_voting: true
  payment_does_not_create_treasury_eligibility: true
  held_authority_created: false

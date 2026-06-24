---
document_type: payment_provider_readiness_matrix
authority_level: closeout_evidence
system_scope: measures_codex
title: Stripe Payment Provider Readiness Matrix for MAP Launch v1
status: payment_provider_repair_required
version: v1
source_oar2: docs/seat/measures_registry_isolated/09_oar/oar2_resolve_stripe_webhook_and_payment_provider_holds_for_measures_registry_map_launch_v1.meta.md
---

standing:
  status: payment_provider_repair_required
  payment_resolution_required_for_launch: true
  payment_activation_performed: false

MAP_paths:
  - key: pre_deploy_map
    label: Environmental Alignment Prior to Deployment MAP
    price_usd: 333
    stripe_price_config_present: false
    checkout_mapping_present: true
    checkout_mapping_ready: false
    blocker: existing_DB_seed_uses_Pre-Deployment_MAP_the_Environment_and_3333_USD
  - key: optimization_map
    label: Optimize Environment MAP
    price_usd: 777
    stripe_price_config_present: false
    checkout_mapping_present: true
    checkout_mapping_ready: false
    blocker: existing_DB_seed_uses_Optimization_MAP_the_Environment_and_7777_USD
  - key: remediation_map
    label: Environmental Remediation MAP
    price_usd: 999
    stripe_price_config_present: false
    checkout_mapping_present: true
    checkout_mapping_ready: false
    blocker: existing_DB_seed_uses_Remediation_MAP_the_Environment_and_9999_USD

provider_checks:
  stripe_secret_key_present: true
  stripe_webhook_secret_present: false
  webhook_endpoint_present: true
  success_url_present: true
  cancel_url_present: true
  checkout_session_route_present: true
  idempotency_rule_present: false
  payment_mode_confirmed_test_or_live: false

implementation_classification:
  - path: functions/api/map/create-checkout-session.ts
    classification: incomplete_candidate
    reason: checkout route exists and reads DB authority but current seeded labels_and_prices_do_not_match_launch_approval
  - path: functions/api/stripe/webhook.ts
    classification: incomplete_candidate
    reason: endpoint_exists_but_webhook_secret_is_missing_and_required_event_and_idempotency_coverage_is_incomplete
  - path: functions/api/map/payment-status/[map_order_id].ts
    classification: active_candidate
    reason: read_surface_exists_for_paid_and_released_order_state
  - path: supabase/migrations/202606080004_map_c2_circuit_payment_events_obsidian_media_bindings.sql
    classification: deprecated_or_wrong_label
    reason: three_seeded_MAP_payment_options_use_prior_labels_and_prices_and_null_stripe_price_ids

boundary:
  payment_does_not_create_SEAT: true
  payment_does_not_create_SEAL: true
  payment_does_not_create_Registry_Standing: true
  payment_does_not_create_c3_key: true
  payment_does_not_create_DAO_participation: true
  payment_does_not_create_Branch: true

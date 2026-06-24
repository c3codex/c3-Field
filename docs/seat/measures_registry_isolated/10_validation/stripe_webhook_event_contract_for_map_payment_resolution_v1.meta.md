---
document_type: webhook_event_contract
authority_level: closeout_evidence
system_scope: measures_codex
title: Stripe Webhook Event Contract for MAP Payment Resolution v1
status: repair_required
version: v1
source_oar2: docs/seat/measures_registry_isolated/09_oar/oar2_resolve_stripe_webhook_and_payment_provider_holds_for_measures_registry_map_launch_v1.meta.md
---

standing:
  status: repair_required
  webhook_activation_performed: false

events:
  checkout.session.completed:
    implementation_present: true
    expected_result:
      - payment_of_scope_resolved
      - MAP_path_confirmed
      - receipt_confirmation_ready
      - survey_surface_login_ready
  payment_intent.succeeded:
    implementation_present: false
    expected_result:
      - payment_success_recorded
      - duplicate_success_event_ignored_if_already_resolved
  payment_intent.payment_failed:
    implementation_present: false
    expected_result:
      - payment_of_scope_unresolved
      - MAP_path_not_opened
      - retry_or_contact_support_required
  checkout.session.expired:
    implementation_present: false
    expected_result:
      - payment_of_scope_unresolved
      - MAP_path_not_opened
      - checkout_restart_required

idempotency:
  required: true
  implementation_present: false
  rule: repeated webhook events must not create duplicate payment resolutions or duplicate access openings

repair_requirements:
  - configure_STRIPE_WEBHOOK_SECRET_in_authorized_provider_environment
  - implement_payment_intent_succeeded
  - implement_payment_intent_payment_failed
  - implement_checkout_session_expired
  - enforce_unique_webhook_event_processing
  - validate_receipt_confirmation_and_survey_login_opening_rules

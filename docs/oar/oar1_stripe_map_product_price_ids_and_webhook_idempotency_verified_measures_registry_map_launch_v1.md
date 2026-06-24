# OAR1 - Stripe MAP Product Price IDs and Webhook Idempotency Verified for Measures Registry MAP Launch v1

## Closeout

```yaml
document_type: oar1
authority_level: closeout
system_scope: measures_codex
status: completed_local_verified_live_migration_held
operator: op044
source_oar2: docs/oar/oar2_stripe_map_product_price_ids_and_webhook_idempotency_measures_registry_map_launch_v1.md
payment_activation_performed: false
live_checkout_activation_performed: false
webhook_activation_performed: false
live_database_migration_performed: false
```

## Files Changed

```yaml
files_changed:
  - .env.local
  - functions/api/map/create-checkout-session.ts
  - functions/api/map/create-checkout-session.test.ts
  - functions/api/stripe/webhook.ts
  - functions/api/stripe/webhook.test.ts
  - src/measures_registry/registered_runtime/MeasuresRegistryRuntimeRegistered.tsx
  - src/measures_registry/registered_runtime/registeredRuntimeTypes.ts
  - src/measures_registry/registered_runtime/renderers/MarbleCommerceDirectory.tsx
  - supabase/migrations/202606200001_map_stripe_price_ids_and_webhook_idempotency.sql
  - docs/oar/oar1_stripe_map_product_price_ids_and_webhook_idempotency_verified_measures_registry_map_launch_v1.md
```

## Stripe Verification

Read-only Stripe API verification completed on 2026-06-20.

| MAP pathway | Product ID | Price ID | Amount | Currency | Active | Mode |
|---|---|---|---:|---|---|---|
| foundational | `prod_UfT3Fg1cmsBvE5` | `price_1Tg87rP9heJD6LYqW8JkxRJw` | $333 | USD | true | live |
| optimization | `prod_UfT8GJn8S6tusF` | `price_1Tg8CgP9heJD6LYqZoVQmH7H` | $777 | USD | true | live |
| remediation | `prod_UfTFCWo6OPmbbt` | `price_1Tg8IaP9heJD6LYq3y6CQHX5` | $999 | USD | true | live |

```yaml
environment_variables_added_or_verified:
  STRIPE_SECRET_KEY: present_value_not_printed
  STRIPE_WEBHOOK_SECRET: present_value_not_printed
  STRIPE_MAP_FOUNDATIONAL_PRODUCT_ID: present
  STRIPE_MAP_FOUNDATIONAL_PRICE_ID: present
  STRIPE_MAP_OPTIMIZATION_PRODUCT_ID: present
  STRIPE_MAP_OPTIMIZATION_PRICE_ID: present
  STRIPE_MAP_REMEDIATION_PRODUCT_ID: present
  STRIPE_MAP_REMEDIATION_PRICE_ID: present
  compatibility_price_keys_preserved:
    - STRIPE_PRICE_PREDEPLOY_MAP
    - STRIPE_PRICE_OPTIMIZATION_MAP
    - STRIPE_PRICE_REMEDIATION_MAP
```

## Implementation Evidence

```yaml
checkout_endpoint: /api/map/create-checkout-session
webhook_endpoint: /api/stripe/webhook
payment_status_endpoint: /api/map/payment-status/:map_order_id
server_side_price_resolution_only: true
frontend_submitted_price_ids_ignored: true
approved_pathways:
  - foundational
  - optimization
  - remediation
checkout_idempotency_key_present: true
webhook_signature_verification_present: true
required_webhook_events_implemented:
  - checkout.session.completed
  - checkout.session.expired
  - payment_intent.succeeded
  - payment_intent.payment_failed
primary_fulfillment_event: checkout.session.completed
idempotency_storage: public.stripe_webhook_events
stripe_event_id_unique_constraint_in_migration: true
atomic_claim_function: public.claim_stripe_webhook_event
duplicate_event_behavior: return_200_without_repeating_fulfillment
retryable_failed_processing: true
```

The migration also seats DB-backed public MAP boundary fields. The public commerce renderer no longer displays internal held-authority fields or forbidden standing terminology.

## Validation

```yaml
focused_test_command: npx.cmd tsx --test functions/api/map/create-checkout-session.test.ts functions/api/stripe/webhook.test.ts
focused_tests_total: 12
focused_tests_passed: 12
focused_tests_failed: 0
checkout_tests:
  foundational_server_price: passed
  optimization_server_price: passed
  remediation_server_price: passed
  unapproved_pathway_rejected: passed
webhook_tests:
  valid_checkout_session_completed: passed
  duplicate_delivery_suppressed: passed
  invalid_signature_rejected: passed
  expired_checkout_held: passed
  failed_payment_held: passed
  missing_metadata_rejected: passed
  unapproved_pathway_rejected: passed
  unpaid_completion_rejected: passed
source_typecheck: passed_with_skipLibCheck_for_existing_cloudflare_dom_ambient_conflict
c3field_build: passed
git_diff_check: passed
public_MAP_payment_forbidden_term_hits: 0
```

## Live Standing

```yaml
live_stripe_price_verification: passed
live_checkout_sessions_created_by_this_oar: false
live_duplicate_webhook_delivery_tested: false
live_invalid_signature_tested: false
live_supabase_migration_applied: false
live_map_contract_rows_still_prior_version: true
live_stripe_webhook_events_table_present: false
live_unique_constraint_confirmed: false
operator_notification_sent: false
```

Read-only live Supabase evidence still shows the prior three contract labels and amounts, null `stripe_price_id` fields, and no exposed `stripe_webhook_events` table. The local migration must be applied through a separately authorized live DB/deployment step before deployed idempotency or checkout readiness can be claimed.

Local Supabase lint did not reach SQL parsing because the CLI encountered pre-existing malformed multiline entries in `.env.local`; this did not affect the focused tests, source typecheck, or production build.

## Internal-Only References

Internal contract fields such as `seat_contract_state` and `seat_hold_notice`, plus server-only metadata assertions such as `creates_seat=false`, remain internal. They are not rendered in the public MAP payment surface.

## Boundary Confirmation

```yaml
MAP_payment_creates_SEAT: false
MAP_payment_creates_c3_key: false
MAP_payment_creates_certification: false
MAP_payment_creates_DAO_standing: false
MAP_payment_creates_registry_standing: false
MAP_payment_creates_c3_field_access: false
public_assessment_scoring_changed: false
result_category_logic_changed: false
visual_contracts_changed: false
media_mappings_changed: false
unDrifted_copy_changed: false
chamber_structure_changed: false
live_payment_activation: false
```

## Recommended Next OAR2

`OAR2 - Apply and Validate MAP Stripe Webhook Idempotency Migration in Live Supabase v1`

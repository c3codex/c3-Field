---
document_type: oar2
authority_level: proposed
system_scope: measures_codex
title: OAR2 - Revalidate Stripe Webhook Secret and MAP Price Config for Measures Registry MAP Launch v1
status: proposed
version: v1
operator: op044
priority: revalidate_payment_provider_config_after_operator_webhook_and_price_setup
source_payment_review_oar1: docs/seat/measures_registry_isolated/09_oar/oar1_resolve_stripe_webhook_and_payment_provider_holds_for_measures_registry_map_launch_v1.meta.md
standing:
  payment_provider_review_previously_completed: true
  repair_previously_required: true
  operator_reports_pricing_fixed: true
  operator_reports_webhook_secret_added_to_env: true
  revalidation_required: true
  payment_activation_allowed: false
  live_checkout_activation_allowed: false
  webhook_activation_claim_allowed: false
  MAP_payment_resolution_runtime_allowed: false
  exact_manifest_build_allowed: false
  bucket_upload_allowed: false
  bucket_write_allowed: false
mutation_scope:
  local_docs_mutation: true
  env_name_revalidation: true
  stripe_config_revalidation: true
  webhook_config_revalidation: true
  payment_activation: false
  stripe_live_activation: false
  checkout_activation: false
  webhook_activation: false
  database: false
  policies: false
  rows: false
  rls: false
  runtime: false
  routes: false
  renderer: false
  public_copy: false
  paragraph_publish: false
  social_posting: false
  social_scheduling: false
  buffer_activation: false
  email_send: false
  exact_manifest_build: false
  bucket_upload: false
  bucket_write: false
---

# OAR2 - Revalidate Stripe Webhook Secret and MAP Price Config for Measures Registry MAP Launch v1

## OBSERVED

The prior payment provider review returned:

status: completed_payment_provider_review_repair_required

It confirmed:

- Stripe_secret_key_present: true
- Stripe_webhook_secret_present: false
- pre_deploy_MAP_price_config_present: false
- optimization_MAP_price_config_present: false
- remediation_MAP_price_config_present: false
- webhook_endpoint_present: true
- success_URL_present: true
- cancel_URL_present: true
- checkout_session_route_present: true
- payment_provider_ready: false
- webhook_ready: false
- all_three_MAP_payment_path_mappings_ready: false

Operator has now reported:

- pricing has been fixed
- Stripe webhook destination has been configured
- webhook signing secret has been added to .env

Revalidation is required before payment can be treated as launch-ready.

## ALIGNED

This OAR2 revalidates Stripe webhook secret and MAP price config.

This OAR2 may confirm presence of required environment variable names and route/config readiness.

This OAR2 may not print secret values.

This OAR2 may not activate payment.

This OAR2 may not activate live checkout.

This OAR2 may not claim webhook activation unless runtime handling is separately validated.

This OAR2 may not mutate database, policies, rows, RLS, runtime, routes, renderer, public copy, payment runtime, Stripe resources, Paragraph, social, Buffer, email, bucket, or manifest.

Correct MAP path labels remain:

- Environmental Alignment Prior to Deployment MAP
- Optimize Environment MAP
- Environmental Remediation MAP

Payment opens only MAP payment-of-scope resolution.

Payment does not create:

- SEAT
- SEAL
- Registry Standing
- c3 Key
- DAO participation
- Branch
- wallet activation
- voting
- treasury eligibility

## REQUIRED ENV NAMES

required_env_names:
  - STRIPE_SECRET_KEY
  - STRIPE_WEBHOOK_SECRET
  - STRIPE_PRICE_PREDEPLOY_MAP
  - STRIPE_PRICE_OPTIMIZATION_MAP
  - STRIPE_PRICE_REMEDIATION_MAP

optional_or_project_specific_env_names_to_report_if_present:
  - STRIPE_SUCCESS_URL
  - STRIPE_CANCEL_URL
  - VITE_STRIPE_PUBLISHABLE_KEY
  - STRIPE_MODE

secret_handling:
  print_secret_values: false
  print_only_present_missing: true
  redact_all_values: true

## MAP PAYMENT PATHS

MAP_payment_paths:
  pre_deploy_map:
    public_label: Environmental Alignment Prior to Deployment MAP
    env_price_key: STRIPE_PRICE_PREDEPLOY_MAP
    base_price_usd: 333

  optimization_map:
    public_label: Optimize Environment MAP
    env_price_key: STRIPE_PRICE_OPTIMIZATION_MAP
    base_price_usd: 777

  remediation_map:
    public_label: Environmental Remediation MAP
    env_price_key: STRIPE_PRICE_REMEDIATION_MAP
    base_price_usd: 999

label_rule:
  MAP_suffix_required_for_payment_routes: true
  standalone_result_language_blocked:
    - Environmental Alignment Prior to Deployment
    - Optimize Environment
    - Environmental Remediation

## WEBHOOK EVENT REQUIREMENTS

required_webhook_events:
  - checkout.session.completed
  - checkout.session.expired
  - payment_intent.succeeded
  - payment_intent.payment_failed

event_categories:
  checkout:
    - checkout.session.completed
    - checkout.session.expired

  payment_intent:
    - payment_intent.succeeded
    - payment_intent.payment_failed

event_boundary:
  not_required_for_current_MAP_launch:
    - invoice
    - customer
    - subscription
    - payment_method
    - charge

## ROUTED

1. Read prior payment provider review OAR1.

Read:

docs/seat/measures_registry_isolated/09_oar/oar1_resolve_stripe_webhook_and_payment_provider_holds_for_measures_registry_map_launch_v1.meta.md

Confirm prior standing:

- status: completed_payment_provider_review_repair_required
- Stripe_secret_key_present: true
- Stripe_webhook_secret_present: false
- pre_deploy_MAP_price_config_present: false
- optimization_MAP_price_config_present: false
- remediation_MAP_price_config_present: false
- webhook_endpoint_present: true
- success_URL_present: true
- cancel_URL_present: true
- checkout_session_route_present: true
- payment_provider_ready: false
- webhook_ready: false
- all_three_MAP_payment_path_mappings_ready: false

If missing, stop and write OAR1 blocked_missing_prior_payment_provider_review_oar1.

2. Revalidate environment variable names.

Inspect available environment/config surfaces.

Do not print values.

Confirm present or missing only:

- STRIPE_SECRET_KEY
- STRIPE_WEBHOOK_SECRET
- STRIPE_PRICE_PREDEPLOY_MAP
- STRIPE_PRICE_OPTIMIZATION_MAP
- STRIPE_PRICE_REMEDIATION_MAP

Report optional/project-specific names if present:

- STRIPE_SUCCESS_URL
- STRIPE_CANCEL_URL
- VITE_STRIPE_PUBLISHABLE_KEY
- STRIPE_MODE

3. Revalidate MAP price mappings.

Confirm that the three MAP payment paths resolve to configured Stripe price identifiers by environment name.

Required result:

- Environmental Alignment Prior to Deployment MAP has configured price key
- Optimize Environment MAP has configured price key
- Environmental Remediation MAP has configured price key

Do not validate by price amount only.

Validate by environment key presence and mapping.

4. Revalidate webhook standing.

Confirm:

- webhook endpoint route exists
- STRIPE_WEBHOOK_SECRET is present
- handler expects signature verification
- handler references Stripe webhook secret without printing it
- required events are documented or handled
- idempotency or duplicate-event guard exists or is documented as required

If endpoint exists but required event handling is incomplete, mark webhook_ready: false and repair_required.

5. Create revalidation matrix.

Create:

docs/seat/measures_registry_isolated/10_validation/stripe_webhook_secret_and_map_price_config_revalidation_matrix_v1.meta.md

Required content:

standing:
  status: ready_for_activation_oar2_or_repair_required
  payment_activation_performed: false
  webhook_activation_performed: false

env_revalidation:
  STRIPE_SECRET_KEY_present: true_or_false
  STRIPE_WEBHOOK_SECRET_present: true_or_false
  STRIPE_PRICE_PREDEPLOY_MAP_present: true_or_false
  STRIPE_PRICE_OPTIMIZATION_MAP_present: true_or_false
  STRIPE_PRICE_REMEDIATION_MAP_present: true_or_false
  secret_values_printed: false

MAP_price_mappings:
  - key: pre_deploy_map
    label: Environmental Alignment Prior to Deployment MAP
    env_price_key: STRIPE_PRICE_PREDEPLOY_MAP
    present: true_or_false

  - key: optimization_map
    label: Optimize Environment MAP
    env_price_key: STRIPE_PRICE_OPTIMIZATION_MAP
    present: true_or_false

  - key: remediation_map
    label: Environmental Remediation MAP
    env_price_key: STRIPE_PRICE_REMEDIATION_MAP
    present: true_or_false

webhook_revalidation:
  webhook_endpoint_present: true_or_false
  webhook_secret_present: true_or_false
  required_events_documented_or_handled: true_or_false
  idempotency_rule_present_or_required: true_or_false
  webhook_ready: true_or_false

boundary:
  payment_does_not_create_SEAT: true
  payment_does_not_create_SEAL: true
  payment_does_not_create_Registry_Standing: true
  payment_does_not_create_c3_key: true
  payment_does_not_create_DAO_participation: true
  payment_does_not_create_Branch: true

6. Create payment launch readiness report.

Create:

docs/seat/measures_registry_isolated/10_validation/payment_launch_readiness_report_after_stripe_env_revalidation_v1.meta.md

Required content:

standing:
  status: ready_for_activation_oar2_or_repair_required_or_blocked
  payment_provider_ready: true_or_false
  webhook_ready: true_or_false
  all_three_MAP_price_configs_present: true_or_false
  payment_activation_performed: false
  launch_payment_blocker_remaining: true_or_false

if_ready:
  recommended_next_oar2: OAR2 - Activate Measures Registry MAP Payment Resolution Route v1

if_repair_required:
  recommended_next_oar2: OAR2 - Repair Remaining Stripe Payment Config Blockers for Measures Registry MAP Launch v1

if_operator_decision_required:
  recommended_next_oar2: OAR2 - Create send_card for Remaining Payment Provider Holds Before Measures Registry MAP Launch v1

7. Create MAP payment path label confirmation.

Create:

docs/seat/measures_registry_isolated/10_validation/map_payment_path_label_confirmation_after_stripe_revalidation_v1.meta.md

Required content:

standing:
  status: confirmed
  public_copy_mutation: false
  runtime_mutation: false

confirmed_payment_path_labels:
  - Environmental Alignment Prior to Deployment MAP
  - Optimize Environment MAP
  - Environmental Remediation MAP

rule:
  MAP_suffix_required_for_payment_routes: true
  assessment_may_display_review_determination_without_MAP_suffix: true
  payment_route_must_display_matching_MAP_path: true

8. Create front-facing operator report.

Create:

docs/seat/measures_registry_isolated/10_validation/front_facing_operator_report_stripe_webhook_secret_and_map_price_revalidation_v1.meta.md

Required content:

# Stripe / MAP Payment Revalidation

Chazz revalidated the Stripe webhook secret and MAP price configuration.

Required MAP payment paths:

- Environmental Alignment Prior to Deployment MAP
- Optimize Environment MAP
- Environmental Remediation MAP

This check confirms whether the webhook secret and all three MAP price configs are now present.

No secret values were printed.

No payment activation occurred.

No live checkout was activated.

No webhook runtime activation occurred.

No database, runtime, route, renderer, public copy, social, Paragraph, Buffer, bucket, manifest, or email action occurred.

Payment does not create SEAT, SEAL, Registry Standing, c3 Key, DAO participation, Branch, wallet activation, voting, or treasury eligibility.

9. Create internal process report.

Create:

docs/seat/measures_registry_isolated/10_validation/internal_process_report_stripe_webhook_secret_and_map_price_revalidation_v1.meta.md

Required content:

standing:
  status: internal_process_report
  stripe_env_revalidation_completed: true
  payment_activation_performed: false
  webhook_activation_performed: false
  runtime_activation_performed: false

internal_trace:
  prior_payment_review_oar1: docs/seat/measures_registry_isolated/09_oar/oar1_resolve_stripe_webhook_and_payment_provider_holds_for_measures_registry_map_launch_v1.meta.md
  MAP_suffix_required: true
  secret_values_printed: false
  payment_boundary:
    no_SEAT: true
    no_SEAL: true
    no_Registry_Standing: true
    no_c3_key: true
    no_DAO_participation: true
    no_Branch: true

10. Create OAR1 closeout.

Create:

docs/seat/measures_registry_isolated/09_oar/oar1_revalidate_stripe_webhook_secret_and_map_price_config_for_measures_registry_map_launch_v1.meta.md

OAR1 must report:

- source OAR2 path
- prior payment provider review OAR1 path read
- config/env standing checked true/false
- STRIPE_SECRET_KEY present true/false without value
- STRIPE_WEBHOOK_SECRET present true/false without value
- STRIPE_PRICE_PREDEPLOY_MAP present true/false without value
- STRIPE_PRICE_OPTIMIZATION_MAP present true/false without value
- STRIPE_PRICE_REMEDIATION_MAP present true/false without value
- webhook endpoint present true/false
- required webhook events documented or handled true/false
- idempotency rule present or required true/false
- revalidation matrix path
- payment launch readiness report path
- MAP payment path label confirmation path
- front-facing operator report path
- internal process report path
- payment provider ready true/false
- webhook ready true/false
- all three MAP payment path mappings ready true/false
- payment activation confirmation false
- webhook activation confirmation false
- live checkout activation confirmation false
- DB mutation confirmation false
- RLS mutation confirmation false
- runtime mutation confirmation false
- route mutation confirmation false
- renderer mutation confirmation false
- public copy mutation confirmation false
- social posting confirmation false
- social scheduling confirmation false
- Buffer activation confirmation false
- Paragraph publishing confirmation false
- email send confirmation false
- exact manifest build confirmation false
- bucket upload confirmation false
- bucket write confirmation false
- recommended next OAR2 title

## VALIDATION RETURN

Return:

- status
- payment provider ready true/false
- webhook ready true/false
- all three MAP payment path mappings ready true/false
- revalidation matrix path
- payment launch readiness report path
- MAP label confirmation path
- recommended next OAR2 title
- OAR1 path

## CLOSE

This OAR2 revalidates the Stripe webhook secret and MAP price config after operator repair.

It does not activate payment.

It does not activate checkout.

It does not activate webhook runtime.

It does not build manifest.

It does not upload.

Correct MAP path labels:

- Environmental Alignment Prior to Deployment MAP
- Optimize Environment MAP
- Environmental Remediation MAP

Codex holds.
Field structures.
Measures registers.
Payment opens MAP resolution only after activation OAR2.
Payment does not create held authority.

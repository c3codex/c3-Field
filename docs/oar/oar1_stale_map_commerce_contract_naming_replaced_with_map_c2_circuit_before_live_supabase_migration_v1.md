# OAR1 - Stale MAP Commerce Contract Naming Replaced with MAP C2 Circuit Before Live Supabase Migration v1

## Closeout

```yaml
document_type: oar1
authority_level: closeout
system_scope: measures_registry_map
status: completed_source_correction_live_migration_held
operator: op044
source_oar2: docs/oar/oar2_replace_stale_map_commerce_contract_naming_with_map_c2_circuit_before_live_supabase_migration_v1.md
live_DB_mutation_performed: false
privileged_preflight_performed: false
live_Stripe_activation_performed: false
live_webhook_activation_performed: false
```

## Files Changed

```yaml
files_changed:
  - supabase/migrations/202606080004_map_c2_circuit_payment_events_obsidian_media_bindings.sql
  - supabase/migrations/202606200001_map_stripe_price_ids_and_webhook_idempotency.sql
  - functions/api/map/create-checkout-session.ts
  - functions/api/map/create-checkout-session.test.ts
  - src/measures_registry/registered_runtime/registeredRuntimeTypes.ts
  - src/measures_registry/registered_runtime/MeasuresRegistryRuntimeRegistered.tsx
  - src/measures_registry/registered_runtime/renderers/MarbleCommerceDirectory.tsx
  - docs/seat/measures_registry/04_integrations/MAP_Stripe_payment_provider_integration_record.meta.md
  - docs/seat/measures_registry/05_automation/MAP_webhook_idempotency_automation_record.meta.md
  - docs/seat/measures_registry/06_runtime_surfaces/MAP_payment_runtime_surface_record.meta.md
  - docs/seat/measures_registry_isolated/09_oar/oar1_populate_seat_review_matrix_from_current_measures_registry_launch_evidence_v1.meta.md
  - docs/seat/measures_registry_isolated/10_validation/seat_review_matrix_measures_registry_launch_surface_package_populated_v1.meta.md
  - docs/seat/measures_registry_isolated/10_validation/stripe_payment_provider_readiness_matrix_for_map_launch_v1.meta.md
  - docs/oar/oar2_apply_and_validate_map_stripe_webhook_idempotency_migration_in_live_supabase_after_seat_folder_confirmation_v1.md
```

The baseline migration was renamed from:

`supabase/migrations/202606080004_map_commerce_payment_contracts_obsidian_media_bindings.sql`

to:

`supabase/migrations/202606080004_map_c2_circuit_payment_events_obsidian_media_bindings.sql`

## Files Reviewed Without Change

```yaml
files_reviewed_without_change:
  - functions/api/map/payment-status/[map_order_id].ts
  - functions/api/stripe/webhook.ts
  - functions/api/stripe/webhook.test.ts
```

These files contain no stale MAP C2 circuit table or MAP-specific contract terminology. Existing unrelated changes in the working tree were preserved.

## Semantic Correction

```yaml
stale_table: map_commerce_contracts
replacement_table: map_c2_circuit
runtime_row_type: MapC2CircuitRow
runtime_collection: mapC2Circuit
checkout_resolution: MAP_payment_option_from_map_c2_circuit
primary_row_identity: map_circuit_key
```

The baseline schema now creates and seeds `public.map_c2_circuit`. MAP payment events reference `map_circuit_key` directly. Active checkout and renderer code no longer select, store, or render MAP-specific `contract_key`, `seat_contract_state`, or `seat_hold_notice` fields.

The pending migration now targets `public.map_c2_circuit` and uses `map_circuit_key` for all three MAP review products. Constraint and index names use the MAP C2 circuit identifier.

## Migration Hashes

```yaml
revised_pending_migration: supabase/migrations/202606200001_map_stripe_price_ids_and_webhook_idempotency.sql
revised_pending_migration_sha256: 658D062FE3DCD97C29FC76CBB84EBCFF51C303B2E13164C81E2D80A7FF359FCB
revised_baseline_migration: supabase/migrations/202606080004_map_c2_circuit_payment_events_obsidian_media_bindings.sql
revised_baseline_migration_sha256: 5FF58D0CD1E5A91C348024FE80244D121B4CA57F844109845FF184034C19F1C3
```

## Search Results

The active MAP source/runtime/test/migration/SEAT-record/future-execution set was searched after correction.

```yaml
active_map_commerce_contracts_hits: 0
active_unapproved_MAP_contract_phrase_hits: 0
approved_smart_contract_exception_hits_in_MAP_scope: 0
```

Historical OAR inputs and closeouts retain prior terms as immutable evidence. Unrelated assessment, style, publication, and footer contract identifiers belong to distinct systems and were not collapsed into this MAP semantic correction.

## Public Runtime Boundary

```yaml
visible_SEAT_or_downstream_authority_hits: 0
allowed_negative_boundary_hits: 2
allowed_negative_terms:
  - certification
  - governance standing
```

The allowed terms occur only in the approved sentence stating that MAP does not create certification, registration, governance standing, or system authority. No public SEAT language was introduced.

## Validation

```yaml
typescript_command: npx.cmd tsc --noEmit --skipLibCheck
typescript_result: passed
focused_test_command: node_modules/.bin/tsx.cmd --test functions/api/map/create-checkout-session.test.ts functions/api/stripe/webhook.test.ts
focused_test_result: passed_12_of_12
focused_test_failures: 0
production_build_command: npm.cmd run build:c3field
production_build_result: passed
vite_modules_transformed: 103
source_whitespace_check: passed
```

The production build passed after the standard scoped filesystem escalation. The existing bundle-size warning remains non-blocking.

## Authority Holds

```yaml
live_Supabase_migration_applied: false
credential_repair_performed: false
live_preflight_performed: false
Stripe_checkout_activated: false
Stripe_webhook_fulfillment_activated: false
payment_or_MAP_intake_records_created: false
email_or_operator_notification_sent: false
SEAT_standing_created: false
c3_key_standing_created: false
certification_created: false
DAO_standing_created: false
Codexstone_conversion_created: false
registry_standing_created: false
c3_Field_access_created: false
```

## Recommended Next OAR2

With focused tests and the production build now passing, use:

`OAR2 - Apply and Validate MAP Stripe Webhook Idempotency Migration in Live Supabase After MAP C2 Circuit Correction v1`

That OAR must still begin with privileged read-only preflight and must stop without mutation if authorized access fails.

---
document_type: oar1
authority_level: execution_closeout
system_scope: measures_codex
title: OAR1 - Resolve Supabase Public Policy Dispositions for Measures Registry v1
status: completed_with_remaining_review_blockers
version: v1
operator: op044
source_oar2: docs/seat/measures_registry_isolated/09_oar/oar2_resolve_supabase_public_policy_dispositions_for_measures_registry_v1.meta.md
before_readback: docs/seat/measures_registry_isolated/10_validation/supabase_policy_disposition_before_readback_v1.meta.md
after_readback: docs/seat/measures_registry_isolated/10_validation/supabase_policy_disposition_after_readback_v1.meta.md
mutation_scope:
  runtime: false
  database: true
  policies: true
  rows: false
  rls: false
  routes: false
  renderer: false
  public_copy: false
  docs_created: true
  docs_updated: false
  docs_deleted: false
---

# OAR1 - Resolve Supabase Public Policy Dispositions for Measures Registry v1

## Closeout

```yaml
oar2_path: docs/seat/measures_registry_isolated/09_oar/oar2_resolve_supabase_public_policy_dispositions_for_measures_registry_v1.meta.md
before_readback_path: docs/seat/measures_registry_isolated/10_validation/supabase_policy_disposition_before_readback_v1.meta.md
after_readback_path: docs/seat/measures_registry_isolated/10_validation/supabase_policy_disposition_after_readback_v1.meta.md
exact_catalog_rpc_result:
  function: public.measures_registry_policy_catalog_review
  before_policy_rows_count: 37
  after_policy_rows_count: 35
  table_rows_count: 32
  column_rows_count: 522
database_isolation_scope_used: public.measures_registry_policy_scope_isolation
```

## Current Measures Registry Runtime Policies Before After

```yaml
current_measures_registry_runtime_policies:
  public.measures_registry:
    before: public read active measures_registry using is_active = true
    after: measures_registry_public_released_active_read using is_active = true and release_state in released/active
    disposition: narrowed
  public.measures_encounter_def:
    before: public read active measures_encounter_def using is_active = true
    after: unchanged
    disposition: kept_with_blocker_no_safer_release_columns
  public.measures_media_map:
    before:
      - measures_media_map_public_active_read using is_active = true
      - public reads active registry landing media using campaign/media_role allowlist
    after:
      - public reads active registry landing media using campaign/media_role allowlist
    disposition: broad_duplicate_dropped
  public.measures_design_token:
    before: public reads active measures registry design tokens
    after: unchanged
    disposition: kept
  public.measures_publication_registry:
    before: measures_publication_registry_public_read using status = published
    after: unchanged
    disposition: kept
  public.measures_publication_dispatch:
    before: measures_publication_dispatch_public_read using status = published
    after: unchanged
    disposition: kept
  public.map_commerce_contracts:
    before: map_commerce_contracts_public_read using release_state = active
    after: unchanged
    disposition: kept_with_operator_review
```

## Current Public Write Policies Before After

```yaml
current_public_write_policies:
  public.measures_iis_eval_gate1_capture:
    before: measures_iis_eval_gate1_capture_public_insert with strict branch with_check
    after: unchanged
    disposition: kept_with_guardrails
  public.measures_publication_subscription_capture:
    before: measures_publication_subscription_public_insert using capture_source only
    after: measures_publication_subscription_capture_public_insert_guarded requiring capture_source plus nonblank email, publication_key, dispatch_key
    disposition: narrowed
```

## Held Future Policies Before After

```yaml
held_future_policies:
  public.measures_seat_hold_capture:
    before: public inserts measures registry seat holds
    after: no public insert policy
    disposition: held_future_scope_public_insert_revoked
```

## Protected Scope Confirmation

```yaml
protected_scope_confirmation:
  protected_c3_system_policies_untouched: true
  protected_measures_of_inanna_policies_untouched: true
  protected_c3_system_policy_rows_after: 19
  protected_measures_of_inanna_policy_rows_after: 5
```

## Policy Change Summary

```yaml
policy_change_summary:
  policies_changed: 6
  policies_dropped: 4
  policies_created: 2
  policies_narrowed: 3
  dropped:
    - public.measures_registry: public read active measures_registry
    - public.measures_media_map: measures_media_map_public_active_read
    - public.measures_publication_subscription_capture: measures_publication_subscription_public_insert
    - public.measures_seat_hold_capture: public inserts measures registry seat holds
  created:
    - public.measures_registry: measures_registry_public_released_active_read
    - public.measures_publication_subscription_capture: measures_publication_subscription_capture_public_insert_guarded
```

## Access Standing

```yaml
access_standing:
  anon_select_standing:
    public.measures_registry: allowed_narrowed_count_59
    public.measures_encounter_def: allowed_existing_is_active_count_92
    public.measures_media_map: allowed_narrowed_count_2
    public.measures_design_token: allowed_narrowed_count_52
    public.measures_publication_registry: allowed_published_count_2
    public.measures_publication_dispatch: allowed_published_count_2
    public.map_commerce_contracts: allowed_release_state_active_count_3
  anon_insert_standing:
    public.measures_iis_eval_gate1_capture: strictly_constrained_direct_insert_policy_kept
    public.measures_publication_subscription_capture: narrowed_direct_insert_policy
    public.measures_seat_hold_capture: blocked_no_public_insert_policy
  anon_update_standing: blocked_by_absence_of_public_update_policies
  anon_delete_standing: blocked_by_absence_of_public_delete_policies
  write_probes_performed: false
```

## Mutation Scope Confirmation

```yaml
mutation_scope_confirmation:
  no_application_row_mutation: true
  no_runtime_mutation: true
  no_route_mutation: true
  no_renderer_mutation: true
  no_public_copy_mutation: true
  no_RLS_mutation: true
  no_launch_activation: true
  no_payment_activation: true
  no_SEAT_completion_claim: true
  no_SEAL_standing_claim: true
  no_Registry_Standing_claim: true
  no_Branch_standing_claim: true
  no_c3_Key_assignment: true
  no_DAO_participation_activation: true
  no_certification_activation: true
```

## Remaining Blockers

```yaml
remaining_blockers:
  - public.measures_encounter_def remains is_active-only because exact columns lack safer release/status/public-visible predicates.
  - public.map_commerce_contracts remains release_state active; additional commerce boundary predicates require a later seated decision.
  - public.measures_iis_eval_gate1_capture direct insert remains because current assessment/contact capture dependency was not proven safe to break.
  - public.measures_publication_subscription_capture is narrowed, but edge-function replacement remains the preferred future architecture.
```

## Recommended Next OAR2

```yaml
recommended_next_oar2:
  title: OAR2 - Isolate Measures Registry Documentation Source Set and Seeded Reference Scope v1
```

## Close

This OAR1 resolves public policy dispositions for the current Measures Registry scope only.

Protected c3 system policies and protected Measures of Inanna policies were not mutated.

No application rows, RLS state, runtime, routes, renderer, public copy, launch, payment, SEAT, SEAL, Registry Standing, Branch standing, c3 Key, DAO participation, or certification were activated or mutated.

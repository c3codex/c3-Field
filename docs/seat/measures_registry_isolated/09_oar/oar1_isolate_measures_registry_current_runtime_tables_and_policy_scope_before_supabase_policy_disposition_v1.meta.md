---
document_type: oar1
authority_level: execution_evidence
system_scope: measures_codex
title: OAR1 - Isolate Measures Registry Current Runtime Tables and Policy Scope Before Supabase Policy Disposition v1
status: completed
version: v1
operator: op044
source_oar2: docs/seat/measures_registry_isolated/09_oar/oar2_isolate_measures_registry_current_runtime_tables_and_policy_scope_before_supabase_policy_disposition_v1.meta.md
mutation_scope:
  runtime: false
  database: false
  policies: false
  rows: false
  routes: false
  renderer: false
  public_copy: false
  docs_created: true
  docs_updated: false
  docs_deleted: false
---

# OAR1 - Isolate Measures Registry Current Runtime Tables and Policy Scope Before Supabase Policy Disposition v1

## OAR2 Path

```yaml
oar2_path: docs/seat/measures_registry_isolated/09_oar/oar2_isolate_measures_registry_current_runtime_tables_and_policy_scope_before_supabase_policy_disposition_v1.meta.md
```

## Isolation Report Path

```yaml
isolation_report_path: docs/seat/measures_registry_isolated/10_validation/measures_registry_current_runtime_policy_scope_isolation_v1.meta.md
```

## Inspected Folders

```yaml
inspected_folders:
  - src/
  - supabase/
  - docs/seat/measures_registry_isolated/
  - docs/seat/measures_registry/
  - docs/oar/measures_registry/
  - docs/oar/measures-registry/
  - docs/oar/measures_interoperability/
```

## Current Measures Registry Runtime Table List

```yaml
current_measures_registry_runtime_tables:
  - public.measures_registry
  - public.measures_encounter_def
  - public.measures_media_map
  - public.measures_design_token
  - public.measures_publication_registry
  - public.measures_publication_dispatch
  - public.map_commerce_contracts
```

## Current Public Write Candidate Table List

```yaml
current_public_write_candidate_tables:
  current_measures_registry_public_write:
    - public.measures_iis_eval_gate1_capture
    - public.measures_publication_subscription_capture
  protected_or_held_write_candidates:
    - public.codex_connect_capture
    - public.measures_seat_hold_capture
```

## Protected C3 System Table List

```yaml
protected_c3_system_tables:
  - public.c3_ai_action_boundary
  - public.c3_attachment_law
  - public.c3_canopy_law
  - public.c3_chamber_directory_binding
  - public.c3_correction_contract
  - public.c3_evidence_contract
  - public.c3_oar_process_instance
  - public.c3_oar_seeded_reference
  - public.c3_oar_transition_event
  - public.c3_optics_contract
  - public.c3_orphaned_surface_registry
  - public.c3_passage_law
  - public.c3_public_semantic_pairing
  - public.c3_registered_system
  - public.c3_role_contract
  - public.c3_runtime_admission_binding
  - public.c3_runtime_admission_contract
  - public.c3_signal_law
  - public.c3_trace_contract
```

## Protected Measures Of Inanna Exhibition Table List

```yaml
protected_measures_of_inanna_exhibition_tables:
  - public.measures_encounter_view_history
  - public.temp_exhibition_media
  - public.codex_connect_capture
```

## Unknown Table List

```yaml
unknown_table_list: []
```

## Summary Counts

```yaml
summary_counts:
  current_measures_registry_runtime: 7
  current_measures_registry_public_write: 2
  current_measures_registry_internal_only: 0
  protected_c3_system: 19
  protected_measures_of_inanna: 3
  legacy_trace: 0
  held_future_scope: 1
  unknown_requires_operator_review: 0
```

## Renderer Read Requirements

```yaml
renderer_read_requirements:
  - table: public.measures_registry
    source: src/app/App.tsx:185; src/measures_registry/registered_runtime/MeasuresRegistryRuntimeRegistered.tsx:250
    policy_should_be: narrow_required
  - table: public.measures_encounter_def
    source: src/measures_registry/registered_runtime/MeasuresRegistryRuntimeRegistered.tsx:245
    policy_should_be: narrow_required
  - table: public.measures_media_map
    source: src/measures_registry/registered_runtime/MeasuresRegistryRuntimeRegistered.tsx:255
    policy_should_be: narrow_required
  - table: public.measures_design_token
    source: src/measures_registry/registered_runtime/MeasuresRegistryRuntimeRegistered.tsx:261
    policy_should_be: narrow_required
  - table: public.measures_publication_registry
    source: src/measures_registry/registered_runtime/MeasuresRegistryRuntimeRegistered.tsx:266
    policy_should_be: keep_if_already_narrow
  - table: public.measures_publication_dispatch
    source: src/measures_registry/registered_runtime/MeasuresRegistryRuntimeRegistered.tsx:271
    policy_should_be: keep_if_already_narrow
  - table: public.map_commerce_contracts
    source: src/measures_registry/registered_runtime/MeasuresRegistryRuntimeRegistered.tsx:277
    policy_should_be: narrow_required
```

## Write Requirements

```yaml
write_requirements:
  - table: public.measures_iis_eval_gate1_capture
    form_or_surface: AI Operations Assessment contact-gated delivery request
    write_type: insert
    current_launch_required: true
    direct_anon_write_safe_now: false
    preferred_boundary: edge_function
  - table: public.measures_publication_subscription_capture
    form_or_surface: publication subscription capture
    write_type: insert
    current_launch_required: true
    direct_anon_write_safe_now: false
    preferred_boundary: edge_function
  - table: public.codex_connect_capture
    form_or_surface: Measures of Inanna connect capture
    write_type: insert
    current_launch_required: false_for_measures_registry
    direct_anon_write_safe_now: false
    preferred_boundary: hold
  - table: public.measures_seat_hold_capture
    form_or_surface: held seat hold capture
    write_type: insert
    current_launch_required: false_until_future_authority
    direct_anon_write_safe_now: false
    preferred_boundary: hold
```

## Operator Decisions Required

```yaml
operator_decisions_required:
  - choose edge/function boundary or strict direct-insert predicates for public.measures_iis_eval_gate1_capture
  - choose edge/function boundary or strict direct-insert predicates for public.measures_publication_subscription_capture
  - keep payment and seat-hold capture held or authorize future payment/seat-hold scope
  - route c3 policy tables to separate seeded reference review
  - route Measures of Inanna/exhibition tables to separate protected-system review
  - authorize exact live catalog row-return path for pg_policies, pg_tables, and information_schema.columns
```

## Safe For Policy Mutation

```yaml
safe_for_policy_mutation: false
reason:
  - exact live catalog row return remains unresolved
  - current scope is isolated but no policy mutation is authorized
  - public write boundaries require operator decisions
  - protected c3 and Measures of Inanna scopes require separate review
```

## Mutation Scope Confirmation

```yaml
mutation_scope_confirmation:
  database_mutation: false
  policy_mutation: false
  RLS_mutation: false
  row_mutation: false
  runtime_mutation: false
  route_mutation: false
  renderer_mutation: false
  public_copy_mutation: false
```

## No DB Mutation Confirmation

```yaml
no_db_mutation_confirmation:
  database_mutation: false
  rows_inserted: false
  rows_updated: false
  rows_deleted: false
  DB_contents_registered: false
```

## No Policy Mutation Confirmation

```yaml
no_policy_mutation_confirmation:
  policies_dropped: false
  policies_created: false
  policies_altered: false
  RLS_enabled_or_disabled: false
```

## No Runtime Mutation Confirmation

```yaml
no_runtime_mutation_confirmation:
  runtime_mutation: false
```

## No Route Mutation Confirmation

```yaml
no_route_mutation_confirmation:
  route_mutation: false
```

## No Renderer Mutation Confirmation

```yaml
no_renderer_mutation_confirmation:
  renderer_mutation: false
```

## No Public Copy Mutation Confirmation

```yaml
no_public_copy_mutation_confirmation:
  public_copy_mutation: false
  launch_activation: false
  payment_activation: false
```

## Recommended Next OAR2 Title

```yaml
recommended_next_OAR2_title: OAR2 - Resolve Exact Live Catalog Row Return for Supabase Policy Disposition Review v1
```

## Close

This OAR1 records current Measures Registry policy scope isolation only.

No policies were mutated.

No DB rows were mutated.

Runtime was not activated.

No DB rows were inserted.

Codex holds.
Field structures.
Measures registers.
Chazz validates.
Cody isolates and writes evidence.

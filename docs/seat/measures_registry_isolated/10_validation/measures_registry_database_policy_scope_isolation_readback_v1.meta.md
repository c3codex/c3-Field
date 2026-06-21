---
document_type: validation_report
authority_level: database_evidence
system_scope: measures_codex
title: Measures Registry Database Policy Scope Isolation Readback v1
status: completed_with_catalog_policy_row_return_limited
version: v1
operator: op044
source_oar2: docs/seat/measures_registry_isolated/09_oar/oar2_seat_measures_registry_database_isolation_scope_for_public_policy_disposition_v1.meta.md
source_oar1: docs/seat/measures_registry_isolated/09_oar/oar1_isolate_measures_registry_current_runtime_tables_and_policy_scope_before_supabase_policy_disposition_v1.meta.md
mutation_scope:
  runtime: false
  database: true
  policies: false
  rls_for_new_isolation_table: true
  rows: true
  routes: false
  renderer: false
  public_copy: false
  docs_created: true
  docs_updated: false
  docs_deleted: false
---

# Measures Registry Database Policy Scope Isolation Readback v1

## Standing

```yaml
standing:
  status: database_isolation_scope_seated
  mutation_authorized: true
  policy_mutation_authorized: false
  db_row_mutation_authorized: true
  runtime_activation_authorized: false
  isolation_table: public.measures_registry_policy_scope_isolation
  source_oar2: docs/seat/measures_registry_isolated/09_oar/oar2_seat_measures_registry_database_isolation_scope_for_public_policy_disposition_v1.meta.md
  source_oar1: docs/seat/measures_registry_isolated/09_oar/oar1_isolate_measures_registry_current_runtime_tables_and_policy_scope_before_supabase_policy_disposition_v1.meta.md
```

## Source OAR1 Check

```yaml
source_oar1_check:
  path: docs/seat/measures_registry_isolated/09_oar/oar1_isolate_measures_registry_current_runtime_tables_and_policy_scope_before_supabase_policy_disposition_v1.meta.md
  exists: true
  required_evidence_present:
    current_measures_registry_runtime_table_list: true
    current_public_write_candidate_table_list: true
    protected_c3_system_table_list: true
    protected_measures_of_inanna_exhibition_table_list: true
    safe_for_policy_mutation_false: true
```

## Table Create Or Exists Result

```yaml
table_create_or_exists_result:
  table: public.measures_registry_policy_scope_isolation
  create_if_missing_statement_executed: true
  final_table_exists_confirmed_by_row_readback: true
  created_or_existed: create_if_missing_completed_idempotently
  note: exact pre-existing-vs-created distinction was not returned by the available RPC envelope
```

## RLS Enabled Result

```yaml
RLS_enabled_result:
  table: public.measures_registry_policy_scope_isolation
  enable_rls_statement_executed: true
  anon_public_read_probe_visible_rows: 0
  anon_public_read_probe_status: 200
  anon_public_read_probe_disposition: public_client_received_no_rows_from_isolation_table
```

## Inserted Or Upserted Rows

```yaml
inserted_or_upserted_rows:
  expected_grouped_rows: 32
  readback_active_rows: 32
  source_oar1_bound_to_rows: true
  upsert_conflict_key: [table_schema, table_name]
```

## Readback Rows

```yaml
readback_rows:
  - { table: public.measures_iis_eval_gate1_capture, isolation_scope: current_measures_registry_public_write, renderer_required: false, current_launch_required: true, anon_read_required: false, anon_write_required: true, direct_anon_write_safe_now: false, edge_function_preferred: true, policy_mutation_scope_allowed: true, protected_scope: false, held_scope: false, requires_separate_review: false, active: true }
  - { table: public.measures_publication_subscription_capture, isolation_scope: current_measures_registry_public_write, renderer_required: false, current_launch_required: true, anon_read_required: false, anon_write_required: true, direct_anon_write_safe_now: false, edge_function_preferred: true, policy_mutation_scope_allowed: true, protected_scope: false, held_scope: false, requires_separate_review: false, active: true }
  - { table: public.map_commerce_contracts, isolation_scope: current_measures_registry_runtime, renderer_required: true, current_launch_required: true, anon_read_required: true, anon_write_required: false, direct_anon_write_safe_now: false, edge_function_preferred: false, policy_mutation_scope_allowed: true, protected_scope: false, held_scope: false, requires_separate_review: false, active: true }
  - { table: public.measures_design_token, isolation_scope: current_measures_registry_runtime, renderer_required: true, current_launch_required: true, anon_read_required: true, anon_write_required: false, direct_anon_write_safe_now: false, edge_function_preferred: false, policy_mutation_scope_allowed: true, protected_scope: false, held_scope: false, requires_separate_review: false, active: true }
  - { table: public.measures_encounter_def, isolation_scope: current_measures_registry_runtime, renderer_required: true, current_launch_required: true, anon_read_required: true, anon_write_required: false, direct_anon_write_safe_now: false, edge_function_preferred: false, policy_mutation_scope_allowed: true, protected_scope: false, held_scope: false, requires_separate_review: false, active: true }
  - { table: public.measures_media_map, isolation_scope: current_measures_registry_runtime, renderer_required: true, current_launch_required: true, anon_read_required: true, anon_write_required: false, direct_anon_write_safe_now: false, edge_function_preferred: false, policy_mutation_scope_allowed: true, protected_scope: false, held_scope: false, requires_separate_review: false, active: true }
  - { table: public.measures_publication_dispatch, isolation_scope: current_measures_registry_runtime, renderer_required: true, current_launch_required: true, anon_read_required: true, anon_write_required: false, direct_anon_write_safe_now: false, edge_function_preferred: false, policy_mutation_scope_allowed: true, protected_scope: false, held_scope: false, requires_separate_review: false, active: true }
  - { table: public.measures_publication_registry, isolation_scope: current_measures_registry_runtime, renderer_required: true, current_launch_required: true, anon_read_required: true, anon_write_required: false, direct_anon_write_safe_now: false, edge_function_preferred: false, policy_mutation_scope_allowed: true, protected_scope: false, held_scope: false, requires_separate_review: false, active: true }
  - { table: public.measures_registry, isolation_scope: current_measures_registry_runtime, renderer_required: true, current_launch_required: true, anon_read_required: true, anon_write_required: false, direct_anon_write_safe_now: false, edge_function_preferred: false, policy_mutation_scope_allowed: true, protected_scope: false, held_scope: false, requires_separate_review: false, active: true }
  - { table: public.measures_seat_hold_capture, isolation_scope: held_future_scope, renderer_required: false, current_launch_required: false, anon_read_required: false, anon_write_required: false, direct_anon_write_safe_now: false, edge_function_preferred: false, policy_mutation_scope_allowed: false, protected_scope: false, held_scope: true, requires_separate_review: true, active: true }
  - { table: public.c3_ai_action_boundary, isolation_scope: protected_c3_system, protected_scope: true, requires_separate_review: true, active: true }
  - { table: public.c3_attachment_law, isolation_scope: protected_c3_system, protected_scope: true, requires_separate_review: true, active: true }
  - { table: public.c3_canopy_law, isolation_scope: protected_c3_system, protected_scope: true, requires_separate_review: true, active: true }
  - { table: public.c3_chamber_directory_binding, isolation_scope: protected_c3_system, protected_scope: true, requires_separate_review: true, active: true }
  - { table: public.c3_correction_contract, isolation_scope: protected_c3_system, protected_scope: true, requires_separate_review: true, active: true }
  - { table: public.c3_evidence_contract, isolation_scope: protected_c3_system, protected_scope: true, requires_separate_review: true, active: true }
  - { table: public.c3_oar_process_instance, isolation_scope: protected_c3_system, protected_scope: true, requires_separate_review: true, active: true }
  - { table: public.c3_oar_seeded_reference, isolation_scope: protected_c3_system, protected_scope: true, requires_separate_review: true, active: true }
  - { table: public.c3_oar_transition_event, isolation_scope: protected_c3_system, protected_scope: true, requires_separate_review: true, active: true }
  - { table: public.c3_optics_contract, isolation_scope: protected_c3_system, protected_scope: true, requires_separate_review: true, active: true }
  - { table: public.c3_orphaned_surface_registry, isolation_scope: protected_c3_system, protected_scope: true, requires_separate_review: true, active: true }
  - { table: public.c3_passage_law, isolation_scope: protected_c3_system, protected_scope: true, requires_separate_review: true, active: true }
  - { table: public.c3_public_semantic_pairing, isolation_scope: protected_c3_system, protected_scope: true, requires_separate_review: true, active: true }
  - { table: public.c3_registered_system, isolation_scope: protected_c3_system, protected_scope: true, requires_separate_review: true, active: true }
  - { table: public.c3_role_contract, isolation_scope: protected_c3_system, protected_scope: true, requires_separate_review: true, active: true }
  - { table: public.c3_runtime_admission_binding, isolation_scope: protected_c3_system, protected_scope: true, requires_separate_review: true, active: true }
  - { table: public.c3_runtime_admission_contract, isolation_scope: protected_c3_system, protected_scope: true, requires_separate_review: true, active: true }
  - { table: public.c3_signal_law, isolation_scope: protected_c3_system, protected_scope: true, requires_separate_review: true, active: true }
  - { table: public.c3_trace_contract, isolation_scope: protected_c3_system, protected_scope: true, requires_separate_review: true, active: true }
  - { table: public.codex_connect_capture, isolation_scope: protected_measures_of_inanna, protected_scope: true, requires_separate_review: true, active: true }
  - { table: public.measures_encounter_view_history, isolation_scope: protected_measures_of_inanna, protected_scope: true, requires_separate_review: true, active: true }
  - { table: public.temp_exhibition_media, isolation_scope: protected_measures_of_inanna, protected_scope: true, requires_separate_review: true, active: true }
```

## Summary Counts

```yaml
summary_counts:
  current_measures_registry_public_write: 2
  current_measures_registry_runtime: 7
  held_future_scope: 1
  protected_c3_system: 19
  protected_measures_of_inanna: 3
  total_active_rows: 32
```

## Isolation Table Policy Readback

```yaml
isolation_table_policy_readback:
  table: public.measures_registry_policy_scope_isolation
  policy_mutation_performed: false
  public_policy_create_statement_executed: false
  anon_policy_create_statement_executed: false
  exec_sql_catalog_select_envelope: ok_without_rows
  exact_pg_policies_row_return: blocked_by_available_read_interface
  public_exposure_probe:
    anon_read_status: 200
    visible_rows: 0
    visible_count: 0
  disposition: no_public_rows_visible_from_isolation_table; exact_policy_count_requires_catalog_row_return_oar
```

## Anon Public Policy Created False

```yaml
anon_public_policy_created_false:
  confirmed_from_executed_sql: true
  create_public_policy_statement_absent: true
  create_anon_policy_statement_absent: true
  alter_existing_policy_statement_absent: true
```

## Protected Scope Confirmation

```yaml
protected_scope_confirmation:
  protected_c3_system_rows: 19
  protected_measures_of_inanna_rows: 3
  held_future_scope_rows: 1
  protected_or_held_rows_require_separate_review_or_hold: true
```

## Current Scope Confirmation

```yaml
current_scope_confirmation:
  current_measures_registry_runtime_rows: 7
  current_measures_registry_public_write_rows: 2
  direct_anon_write_safe_now_rows: 0
  edge_function_preferred_public_write_rows: 2
  launch_activation_authorized: false
  policy_mutation_authorized_now: false
```

## Mutation Boundary Confirmation

```yaml
mutation_boundary_confirmation:
  existing_policy_mutation: false
  renderer_table_row_mutation: false
  runtime_mutation: false
  route_mutation: false
  renderer_mutation: false
  public_copy_mutation: false
  launch_activation: false
  payment_activation: false
```

## Next Safe OAR2

```yaml
next_safe_oar2:
  title: OAR2 - Resolve Exact Live Catalog Row Return for Supabase Policy Disposition Review v1
  reason:
    - exact pg_policies row return remains blocked by the available exec_sql envelope
    - policy disposition should not proceed until catalog rows can be returned directly
```

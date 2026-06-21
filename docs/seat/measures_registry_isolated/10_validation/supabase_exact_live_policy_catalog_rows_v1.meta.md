---
document_type: validation_report
authority_level: exact_live_catalog_evidence
system_scope: measures_codex
title: Supabase Exact Live Policy Catalog Rows v1
status: completed_exact_rows_returned
version: v1
operator: op044
source_oar2: docs/seat/measures_registry_isolated/09_oar/oar2_authorize_read_only_catalog_rpc_seating_for_supabase_policy_review_v1.meta.md
database_isolation_table: public.measures_registry_policy_scope_isolation
row_return_function: public.measures_registry_policy_catalog_review
mutation_scope:
  runtime: false
  database: true
  schema_function: true
  policies: false
  rows: false
  rls: false
  routes: false
  renderer: false
  public_copy: false
  docs_created: true
  docs_updated: false
  docs_deleted: false
---

# Supabase Exact Live Policy Catalog Rows v1

## Standing

```yaml
standing:
  status: exact_catalog_rows_returned
  function_name: public.measures_registry_policy_catalog_review
  exact_catalog_rows_returned: true
  mutation_authorized: false
  policy_mutation_authorized: false
  db_row_mutation_authorized: false
  runtime_activation_authorized: false
  safe_for_policy_disposition_oar: true
```

## Source Database Isolation

```yaml
source_database_isolation:
  table: public.measures_registry_policy_scope_isolation
  readback_passed: true
  active_row_count: 32
  summary_counts:
    current_measures_registry_public_write: 2
    current_measures_registry_runtime: 7
    held_future_scope: 1
    protected_c3_system: 19
    protected_measures_of_inanna: 3
```

## Row Return Method

```yaml
row_return_method:
  method_used: public.measures_registry_policy_catalog_review
  exact_rows_returned: true
  returned_payload_shape: exact_rows
  scope_source: public.measures_registry_policy_scope_isolation
  isolated_scope_only: true
  dynamic_sql_used: false
  arbitrary_sql_input_allowed: false
```

## PG Policies Rows

```yaml
pg_policies_rows:
  exact_rows_returned: true
  rows_returned_count: 37
  rows_scope: active isolation table joins only
  sample_rows:
    - schemaname: public
      tablename: measures_iis_eval_gate1_capture
      policyname: measures_iis_eval_gate1_capture_public_insert
      permissive: PERMISSIVE
      roles: [anon, authenticated]
      cmd: INSERT
      qual: null
      with_check_present: true
      isolation_scope: current_measures_registry_public_write
      edge_function_preferred: true
      direct_anon_write_safe_now: false
    - schemaname: public
      tablename: measures_publication_subscription_capture
      policyname: measures_publication_subscription_public_insert
      permissive: PERMISSIVE
      roles: [anon, authenticated]
      cmd: INSERT
      qual: null
      with_check: "(capture_source = 'structural_drift_dispatch'::text)"
      isolation_scope: current_measures_registry_public_write
      edge_function_preferred: true
      direct_anon_write_safe_now: false
    - schemaname: public
      tablename: map_commerce_contracts
      policyname: map_commerce_contracts_public_read
      permissive: PERMISSIVE
      roles: [anon, authenticated]
      cmd: SELECT
      qual: "(release_state = 'active'::text)"
      with_check: null
      isolation_scope: current_measures_registry_runtime
      renderer_required: true
      anon_read_required: true
```

## PG Tables Rows

```yaml
pg_tables_rows:
  exact_rows_returned: true
  rows_returned_count: 32
  rows_scope: active isolation table joins only
  all_rows_have_public_schema: true
  sample_rows:
    - schemaname: public
      tablename: measures_iis_eval_gate1_capture
      rowsecurity: true
      isolation_scope: current_measures_registry_public_write
    - schemaname: public
      tablename: map_commerce_contracts
      rowsecurity: true
      isolation_scope: current_measures_registry_runtime
    - schemaname: public
      tablename: c3_ai_action_boundary
      rowsecurity: true
      isolation_scope: protected_c3_system
```

## Information Schema Columns Rows

```yaml
information_schema_columns_rows:
  exact_rows_returned: true
  rows_returned_count: 522
  rows_scope: active isolation table joins only
  sample_rows:
    - table_schema: public
      table_name: measures_iis_eval_gate1_capture
      column_name: id
      data_type: uuid
      is_nullable: "NO"
      isolation_scope: current_measures_registry_public_write
    - table_schema: public
      table_name: measures_iis_eval_gate1_capture
      column_name: institution_name
      data_type: text
      is_nullable: "NO"
      isolation_scope: current_measures_registry_public_write
    - table_schema: public
      table_name: map_commerce_contracts
      column_name: contract_key
      data_type: text
      is_nullable: "NO"
      isolation_scope: current_measures_registry_runtime
```

## Catalog Readback Quality

```yaml
catalog_readback_quality:
  exact_pg_policies_returned: true
  exact_pg_tables_returned: true
  exact_information_schema_columns_returned: true
  policy_rows_count: 37
  table_rows_count: 32
  column_rows_count: 522
  safe_for_policy_disposition_oar: true
```

## Mutation Boundary Confirmation

```yaml
mutation_boundary_confirmation:
  policy_mutation: false
  row_mutation: false
  rls_mutation: false
  runtime_mutation: false
  route_mutation: false
  renderer_mutation: false
  public_copy_mutation: false
  launch_activation: false
  payment_activation: false
  policy_disposition_attempted: false
```

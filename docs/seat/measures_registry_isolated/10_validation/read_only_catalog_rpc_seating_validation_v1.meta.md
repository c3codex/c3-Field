---
document_type: validation_report
authority_level: database_function_evidence
system_scope: measures_codex
title: Read Only Catalog RPC Seating Validation v1
status: completed_exact_rows_returned
version: v1
operator: op044
source_oar2: docs/seat/measures_registry_isolated/09_oar/oar2_authorize_read_only_catalog_rpc_seating_for_supabase_policy_review_v1.meta.md
source_oar1: docs/seat/measures_registry_isolated/09_oar/oar1_repair_supabase_sql_row_return_access_for_policy_review_v1.meta.md
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

# Read Only Catalog RPC Seating Validation v1

## Standing

```yaml
standing:
  status: seated
  function_name: public.measures_registry_policy_catalog_review
  mutation_authorized: false
  policy_mutation_authorized: false
  row_mutation_authorized: false
  safe_for_policy_disposition_oar: true
```

## Prerequisite Isolation Readback

```yaml
prerequisite_isolation_readback:
  passed: true
  table: public.measures_registry_policy_scope_isolation
  active_row_count: 32
  summary_counts:
    current_measures_registry_public_write: 2
    current_measures_registry_runtime: 7
    held_future_scope: 1
    protected_c3_system: 19
    protected_measures_of_inanna: 3
```

## Function Seating

```yaml
function_seating:
  function_name: public.measures_registry_policy_catalog_review
  created_or_replaced: true
  security_definer_used: true
  stable: true
  returns: jsonb
  arguments: none
  dynamic_sql_used: false
  read_only_scope: true
  scope_source: public.measures_registry_policy_scope_isolation
  isolated_scope_only: true
  anon_execute_granted: false
  public_execute_granted: false
  authenticated_execute_granted: false
  service_role_execute_granted: true
```

## Function Execution

```yaml
function_execution:
  exact_rows_returned: true
  returned_payload_shape: exact_rows
  policy_rows_count: 37
  table_rows_count: 32
  column_rows_count: 522
  service_role_rpc_ok: true
  anon_rpc_probe:
    status: 401
    code: "42501"
    message: permission denied for function measures_registry_policy_catalog_review
```

## Row Return Quality

```yaml
row_return_quality:
  safe_for_policy_disposition_oar: true
  policy_rows_count_gt_zero: true
  table_rows_count_equals_32: true
  column_rows_count_gt_zero: true
  blocker_if_false: null
```

## Sample Returned Rows

```yaml
sample_returned_rows:
  policy_rows:
    - table: public.measures_iis_eval_gate1_capture
      policyname: measures_iis_eval_gate1_capture_public_insert
      cmd: INSERT
      roles: [anon, authenticated]
      isolation_scope: current_measures_registry_public_write
      with_check_present: true
    - table: public.measures_publication_subscription_capture
      policyname: measures_publication_subscription_public_insert
      cmd: INSERT
      roles: [anon, authenticated]
      isolation_scope: current_measures_registry_public_write
      with_check_present: true
    - table: public.map_commerce_contracts
      policyname: map_commerce_contracts_public_read
      cmd: SELECT
      roles: [anon, authenticated]
      isolation_scope: current_measures_registry_runtime
      qual: "(release_state = 'active'::text)"
  table_rows:
    - table: public.measures_iis_eval_gate1_capture
      rowsecurity: true
      isolation_scope: current_measures_registry_public_write
    - table: public.map_commerce_contracts
      rowsecurity: true
      isolation_scope: current_measures_registry_runtime
    - table: public.c3_ai_action_boundary
      rowsecurity: true
      isolation_scope: protected_c3_system
  column_rows:
    - table: public.measures_iis_eval_gate1_capture
      column_name: id
      data_type: uuid
      is_nullable: "NO"
    - table: public.measures_iis_eval_gate1_capture
      column_name: institution_name
      data_type: text
      is_nullable: "NO"
    - table: public.map_commerce_contracts
      column_name: contract_key
      data_type: text
      is_nullable: "NO"
```

## Mutation Boundary Confirmation

```yaml
mutation_boundary_confirmation:
  policy_mutation: false
  application_row_mutation: false
  rls_mutation: false
  application_table_mutation: false
  runtime_mutation: false
  route_mutation: false
  renderer_mutation: false
  public_copy_mutation: false
  launch_activation: false
  payment_activation: false
  policy_disposition_attempted: false
```


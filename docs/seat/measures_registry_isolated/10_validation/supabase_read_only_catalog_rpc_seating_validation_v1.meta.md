---
document_type: validation_report
authority_level: database_function_evidence
system_scope: measures_codex
title: Supabase Read-Only Catalog RPC Seating Validation v1
status: completed_exact_catalog_rows_returned
version: v1
operator: op044
source_oar2: docs/seat/measures_registry_isolated/09_oar/oar2_authorize_read_only_catalog_rpc_seating_for_supabase_policy_review_v1.meta.md
source_oar1: docs/seat/measures_registry_isolated/09_oar/oar1_repair_supabase_sql_row_return_access_for_policy_review_v1.meta.md
mutation_scope:
  runtime: false
  database: true
  schema: true
  functions: true
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

# Supabase Read-Only Catalog RPC Seating Validation v1

## Standing

```yaml
standing:
  status: completed_exact_catalog_rows_returned
  source_oar2: docs/seat/measures_registry_isolated/09_oar/oar2_authorize_read_only_catalog_rpc_seating_for_supabase_policy_review_v1.meta.md
  source_oar1: docs/seat/measures_registry_isolated/09_oar/oar1_repair_supabase_sql_row_return_access_for_policy_review_v1.meta.md
  authorized_schema_function_seating_performed: true
  unauthorized_database_mutation_performed: false
  safe_for_policy_disposition_oar: true
```

## Read Only Catalog RPC Seating

```yaml
read_only_catalog_rpc_seating:
  function_name: public.supabase_read_only_policy_catalog_rows_v1
  function_created_or_replaced: true
  arbitrary_sql_input_allowed: false
  mutation_sql_allowed: false
  policy_mutation_performed: false
  rls_mutation_performed: false
  row_mutation_performed: false
  runtime_mutation_performed: false
  route_mutation_performed: false
  renderer_mutation_performed: false
  public_copy_mutation_performed: false
  exact_pg_policies_rows_returned: true
  exact_pg_tables_rows_returned: true
  exact_information_schema_column_rows_returned: true
  returned_payload_shape: exact_rows
  safe_for_policy_disposition_oar: true
```

## Function Shape

```yaml
function_shape:
  language: sql
  security: security_definer
  arguments: none
  returns: jsonb
  fixed_internal_selects_only: true
  accepts_arbitrary_sql_text: false
  dynamic_sql_used: false
  catalog_sources:
    - pg_catalog.pg_policies
    - pg_catalog.pg_tables
    - information_schema.columns
```

## Row Counts

```yaml
row_counts:
  pg_policies: 56
  pg_tables: 80
  information_schema_columns: 1707
```

## Payload Shape Verification

```yaml
payload_shape_verification:
  service_role_rpc_ok: true
  returned_payload_shape: exact_rows
  payload_keys:
    - pg_policies
    - pg_tables
    - information_schema_columns
  pg_policies_is_array: true
  pg_tables_is_array: true
  information_schema_columns_is_array: true
```

## Sample Rows

```yaml
sample_rows:
  pg_policies:
    - schemaname: cron
      tablename: job
      policyname: cron_job_policy
      cmd: ALL
      roles: [public]
      qual: "(username = CURRENT_USER)"
    - schemaname: public
      tablename: c3_ai_action_boundary
      policyname: c3_ai_action_boundary_public_read
      cmd: SELECT
      roles: [anon, authenticated]
      qual: "true"
  pg_tables:
    - schemaname: public
      tablename: c3_ai_action_boundary
      tableowner: postgres
      hasindexes: true
      hastriggers: true
      rowsecurity: true
    - schemaname: public
      tablename: c3_attachment_law
      tableowner: postgres
      hasindexes: true
      hastriggers: true
      rowsecurity: true
  information_schema_columns:
    - table_schema: public
      table_name: c3_ai_action_boundary
      column_name: id
      ordinal_position: 1
      data_type: uuid
      is_nullable: "NO"
      column_default: gen_random_uuid()
    - table_schema: public
      table_name: c3_ai_action_boundary
      column_name: boundary_key
      ordinal_position: 2
      data_type: text
      is_nullable: "NO"
      column_default: null
```

## Grant Posture

```yaml
grant_posture:
  grants_changed: true
  function_name: public.supabase_read_only_policy_catalog_rows_v1
  grant_target: service_role
  grant_reason: validation and future policy review must use privileged governance path only
  revoked_execute_from:
    - public
    - anon
    - authenticated
  anonymous_public_execute_avoided: true
  anon_rpc_probe:
    status: 401
    code: "42501"
    message: permission denied for function supabase_read_only_policy_catalog_rows_v1
```

## Mutation Boundary Confirmation

```yaml
mutation_boundary_confirmation:
  authorized_schema_function_seating_performed: true
  unauthorized_database_mutation_performed: false
  policy_mutation: false
  rls_mutation: false
  row_mutation: false
  application_table_mutation: false
  runtime_mutation: false
  route_mutation: false
  renderer_mutation: false
  public_copy_mutation: false
  launch_activation: false
  payment_activation: false
  policy_disposition_attempted: false
  policy_classification_attempted: false
```

## Next OAR

```yaml
next_oar:
  title: OAR2 - Classify Supabase Policy Disposition from Exact Live Catalog Rows v1
  reason:
    - exact pg_policies rows returned
    - exact pg_tables rows returned
    - exact information_schema.columns rows returned
    - safe_for_policy_disposition_oar is true
```


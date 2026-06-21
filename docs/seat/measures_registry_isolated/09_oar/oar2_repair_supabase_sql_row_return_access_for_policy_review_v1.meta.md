---
document_type: oar2
authority_level: proposed_repair
system_scope: measures_codex
title: OAR2 - Repair Supabase SQL Row Return Access for Policy Review v1
status: proposed
version: v1
operator: op044
source_oar1: docs/seat/measures_registry_isolated/09_oar/oar1_resolve_exact_live_catalog_row_return_for_supabase_policy_disposition_review_v1.meta.md
blocked_by:
  - exact live catalog row return unresolved
  - pg_policies rows not returned
  - pg_tables rows not returned
  - information_schema.columns rows not returned
mutation_scope:
  runtime: false
  database: false
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

# OAR2 - Repair Supabase SQL Row Return Access for Policy Review v1

## Objective

Repair or establish a non-mutating, read-only method to return exact live Supabase catalog rows required for policy disposition review.

This OAR2 exists because the prior OAR1 confirmed that database isolation scope was readable, but exact live catalog rows were not returned by the available methods.

The repair must produce exact row payloads for:

- pg_policies
- pg_tables
- information_schema.columns

This OAR2 does not authorize policy disposition.

This OAR2 does not authorize policy mutation.

This OAR2 does not authorize RLS mutation.

This OAR2 does not authorize runtime mutation.

## Source Blocker

The source OAR1 recorded the following standing:

safe_for_policy_disposition_oar: false
exact_pg_policies_rows_returned: false
exact_pg_tables_rows_returned: false
exact_information_schema_column_rows_returned: false
row_counts:
  pg_policies: 0
  pg_tables: 0
  information_schema_columns: 0

The existing RPC probe was reachable but did not return selected row payloads:

exec_sql_select_row_probe:
  rpc_reachable: true
  returned_exact_rows: false
  returned_payload:
    ok: true

## Required Repair

Implement one of the following read-only repair paths.

### Preferred Path

1. Create or repair a dedicated read-only catalog RPC.
2. RPC must return exact row payloads, not only an ok envelope.
3. RPC must expose only the required catalog review data.
4. RPC must not permit arbitrary mutation SQL.
5. RPC must not alter policies, tables, rows, RLS, schema, runtime, routes, renderer, or public copy.

### Acceptable Alternate Path

1. Repair existing read-only SQL execution wrapper.
2. Wrapper must return selected rows.
3. Wrapper must be constrained to read-only catalog SELECT behavior.
4. Wrapper must not allow mutation statements.
5. Wrapper must not be used for policy disposition until exact row evidence is written.

## Required Catalog Outputs

The repair must produce a validation file containing exact live rows from the following read-only catalog queries.

Query 1 - pg_policies:

select
  schemaname,
  tablename,
  policyname,
  permissive,
  roles,
  cmd,
  qual,
  with_check
from pg_policies
order by schemaname, tablename, policyname;

Query 2 - pg_tables:

select
  schemaname,
  tablename,
  tableowner,
  tablespace,
  hasindexes,
  hasrules,
  hastriggers,
  rowsecurity
from pg_tables
where schemaname = 'public'
order by schemaname, tablename;

Query 3 - information_schema.columns:

select
  table_schema,
  table_name,
  column_name,
  ordinal_position,
  data_type,
  is_nullable,
  column_default
from information_schema.columns
where table_schema = 'public'
order by table_schema, table_name, ordinal_position;

## Validation File Required

Create:

docs/seat/measures_registry_isolated/10_validation/supabase_sql_row_return_access_repair_validation_v1.meta.md

The validation file must include:

row_return_access_repair:
  pg_policies_returned_exact_rows: true_or_false
  pg_tables_returned_exact_rows: true_or_false
  information_schema_columns_returned_exact_rows: true_or_false
  returned_payload_shape: exact_rows | ok_envelope_only | error
  mutation_performed: false
  safe_for_policy_disposition_oar: true_or_false

If any required catalog source still fails to return exact rows, then:

safe_for_policy_disposition_oar: false

## Guardrails

The executor must not:

- classify policies
- narrow policies
- revoke policies
- add policies
- alter policies
- enable or disable RLS
- alter tables
- alter rows
- alter schema
- alter runtime
- alter routes
- alter renderer
- alter public copy
- activate launch standing
- activate payment standing
- claim SEAT completion
- claim Seal standing
- claim Registry standing
- assign c3 Key
- activate DAO participation

## Success Criteria

This OAR2 is successful only if all required catalog row sets return exact live rows and the validation file records:

pg_policies_returned_exact_rows: true
pg_tables_returned_exact_rows: true
information_schema_columns_returned_exact_rows: true
returned_payload_shape: exact_rows
mutation_performed: false
safe_for_policy_disposition_oar: true

## Failure Criteria

This OAR2 remains blocked if:

- pg_policies exact rows are not returned
- pg_tables exact rows are not returned
- information_schema.columns exact rows are not returned
- only an ok envelope is returned
- arbitrary SQL mutation capability is introduced
- mutation occurs
- policy disposition is attempted before validation

## Required OAR1 Closeout

After execution, produce:

docs/seat/measures_registry_isolated/09_oar/oar1_repair_supabase_sql_row_return_access_for_policy_review_v1.meta.md

The closeout must state:

mutation_scope_confirmation:
  no_DB_mutation: true
  no_policy_mutation: true
  no_row_mutation: true
  no_RLS_mutation: true
  no_runtime_mutation: true
  no_route_mutation: true
  no_renderer_mutation: true
  no_public_copy_mutation: true

If exact row return succeeds, the next OAR2 may be:

OAR2 - Classify Supabase Policy Disposition from Exact Live Catalog Rows v1

If exact row return does not succeed, the next OAR2 must remain repair-scoped.

## Close

This OAR2 authorizes only a read-only catalog row-return repair.

It does not authorize policy disposition.

It does not authorize policy mutation.

It does not authorize runtime movement.

Exact live row evidence must be returned before any Supabase policy disposition review proceeds.

---
document_type: oar2
authority_level: proposed
system_scope: measures_codex
title: OAR2 - Authorize Read-Only Catalog RPC Seating for Supabase Policy Review v1
status: proposed
version: v1
operator: op044
priority: critical_security_repair
source_oar1:
  - docs/seat/measures_registry_isolated/09_oar/oar1_repair_supabase_sql_row_return_access_for_policy_review_v1.meta.md
  - docs/seat/measures_registry_isolated/09_oar/oar1_seat_measures_registry_database_isolation_scope_for_public_policy_disposition_v1.meta.md
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

# OAR2 - Authorize Read-Only Catalog RPC Seating for Supabase Policy Review v1

## OBSERVED

The prior repair OAR1 returned blocked.

Exact live catalog row return failed for:

- pg_policies
- pg_tables
- information_schema.columns

The failed routes were:

- existing exec_sql RPC returned OK envelope only, without row payload
- PostgREST catalog surfaces were blocked
- Supabase Management SQL API was blocked by missing management PAT
- direct Postgres pooler was blocked by missing usable password
- dedicated catalog RPC was not created because the prior OAR2 did not authorize DB or schema mutation

The same OAR1 confirmed that no DB, schema, RLS, row, policy, runtime, route, renderer, or public copy mutation occurred.

The database isolation table is already seated and readable through execution context:

- public.measures_registry_policy_scope_isolation
- active rows: 32
- current_measures_registry_runtime: 7
- current_measures_registry_public_write: 2
- protected_c3_system: 19
- protected_measures_of_inanna: 3
- held_future_scope: 1

Current need:

Seat a constrained read-only catalog RPC/function that returns exact row payloads for the isolated policy review scope only.

## ALIGNED

This OAR2 authorizes a narrow database schema/function mutation only.

It may create or replace one read-only SQL function used for policy review.

It may grant execute only if required for Cody's available execution path.

It may run the function and write evidence.

It may not mutate application policies.

It may not create public table read policies.

It may not alter RLS on application tables.

It may not insert, update, or delete application rows.

It may not mutate runtime, routes, renderer, or public copy.

It may not activate launch, payment, SEAT, SEAL, Registry Standing, Branch standing, c3 Key, DAO participation, or certification.

Authority remains:

Codex -> Field -> Measures -> OAR2 -> Chazz -> Cody -> src

## ROUTED

## 1. Confirm prerequisite database isolation

Confirm this table exists and has 32 active rows:

public.measures_registry_policy_scope_isolation

Run:

    select
      isolation_scope,
      count(*) as table_count
    from public.measures_registry_policy_scope_isolation
    where active = true
    group by isolation_scope
    order by isolation_scope;

Required expected counts:

    current_measures_registry_public_write: 2
    current_measures_registry_runtime: 7
    held_future_scope: 1
    protected_c3_system: 19
    protected_measures_of_inanna: 3

If this readback fails, stop and write blocker OAR1.

## 2. Create constrained read-only catalog function

Create or replace function:

public.measures_registry_policy_catalog_review()

Function requirements:

- language sql
- stable
- security definer only if required to read catalog rows
- returns jsonb
- returns only rows joined to public.measures_registry_policy_scope_isolation where active = true
- does not execute dynamic SQL
- does not mutate policies
- does not mutate rows
- does not mutate RLS
- does not expose unrelated tables outside isolated scope
- includes pg_policies rows for isolated tables
- includes pg_tables RLS rows for isolated tables
- includes information_schema.columns rows for isolated tables

SQL:

    create or replace function public.measures_registry_policy_catalog_review()
    returns jsonb
    language sql
    stable
    security definer
    set search_path = public, pg_catalog, information_schema
    as $$
      with iso as (
        select
          table_schema,
          table_name,
          isolation_scope,
          renderer_required,
          current_launch_required,
          anon_read_required,
          anon_write_required,
          direct_anon_write_safe_now,
          edge_function_preferred,
          policy_mutation_scope_allowed,
          protected_scope,
          held_scope,
          requires_separate_review,
          active
        from public.measures_registry_policy_scope_isolation
        where active = true
      ),
      policies as (
        select
          p.schemaname,
          p.tablename,
          p.policyname,
          p.permissive,
          p.roles,
          p.cmd,
          p.qual,
          p.with_check,
          iso.isolation_scope,
          iso.renderer_required,
          iso.current_launch_required,
          iso.anon_read_required,
          iso.anon_write_required,
          iso.direct_anon_write_safe_now,
          iso.edge_function_preferred,
          iso.policy_mutation_scope_allowed,
          iso.protected_scope,
          iso.held_scope,
          iso.requires_separate_review
        from pg_policies p
        join iso
          on iso.table_schema = p.schemaname
         and iso.table_name = p.tablename
        where p.schemaname = 'public'
        order by iso.isolation_scope, p.tablename, p.policyname
      ),
      tables as (
        select
          t.schemaname,
          t.tablename,
          t.rowsecurity,
          iso.isolation_scope,
          iso.renderer_required,
          iso.current_launch_required,
          iso.anon_read_required,
          iso.anon_write_required,
          iso.policy_mutation_scope_allowed,
          iso.protected_scope,
          iso.held_scope,
          iso.requires_separate_review
        from pg_tables t
        join iso
          on iso.table_schema = t.schemaname
         and iso.table_name = t.tablename
        where t.schemaname = 'public'
        order by iso.isolation_scope, t.tablename
      ),
      columns as (
        select
          c.table_schema,
          c.table_name,
          c.column_name,
          c.data_type,
          c.is_nullable,
          iso.isolation_scope,
          iso.renderer_required,
          iso.current_launch_required,
          iso.anon_read_required,
          iso.anon_write_required,
          iso.policy_mutation_scope_allowed,
          iso.protected_scope,
          iso.held_scope,
          iso.requires_separate_review
        from information_schema.columns c
        join iso
          on iso.table_schema = c.table_schema
         and iso.table_name = c.table_name
        where c.table_schema = 'public'
        order by iso.isolation_scope, c.table_name, c.ordinal_position
      )
      select jsonb_build_object(
        'standing', jsonb_build_object(
          'function', 'public.measures_registry_policy_catalog_review',
          'read_only', true,
          'scope_source', 'public.measures_registry_policy_scope_isolation',
          'mutation_authorized', false,
          'policy_mutation_authorized', false
        ),
        'scope_summary', (
          select jsonb_agg(row_to_json(s))
          from (
            select isolation_scope, count(*) as table_count
            from iso
            group by isolation_scope
            order by isolation_scope
          ) s
        ),
        'policy_rows_count', (select count(*) from policies),
        'table_rows_count', (select count(*) from tables),
        'column_rows_count', (select count(*) from columns),
        'policy_rows', coalesce((select jsonb_agg(to_jsonb(policies)) from policies), '[]'::jsonb),
        'table_rows', coalesce((select jsonb_agg(to_jsonb(tables)) from tables), '[]'::jsonb),
        'column_rows', coalesce((select jsonb_agg(to_jsonb(columns)) from columns), '[]'::jsonb)
      );
    $$;

## 3. Lock function execution boundary

Do not create anon or public table policies.

If function execution grant is required, prefer service/authenticated execution only.

Allowed grant if required by available execution context:

    revoke all on function public.measures_registry_policy_catalog_review() from public;
    revoke all on function public.measures_registry_policy_catalog_review() from anon;
    grant execute on function public.measures_registry_policy_catalog_review() to authenticated;

If Cody is executing with service role / SQL editor / MCP and grant is not required, do not grant execute to anon or public.

Anon execution is not authorized.

## 4. Execute readback function

Run:

    select public.measures_registry_policy_catalog_review();

Required output must include row payloads for:

- policy_rows
- table_rows
- column_rows

Required quality checks:

    policy_rows_count > 0
    table_rows_count = 32
    column_rows_count > 0

If policy_rows_count is 0, report blocker unless exact evidence shows no policies exist on isolated tables.

## 5. Create validation evidence file

Create:

docs/seat/measures_registry_isolated/10_validation/read_only_catalog_rpc_seating_validation_v1.meta.md

Include:

    standing:
      status: seated_or_blocked
      function_name: public.measures_registry_policy_catalog_review
      mutation_authorized: false
      policy_mutation_authorized: false
      row_mutation_authorized: false

    prerequisite_isolation_readback:
      passed: true_or_false
      summary_counts:

    function_seating:
      created_or_replaced: true_or_false
      security_definer_used: true_or_false
      dynamic_sql_used: false
      read_only_scope: true_or_false
      anon_execute_granted: false
      public_execute_granted: false

    function_execution:
      exact_rows_returned: true_or_false
      policy_rows_count:
      table_rows_count:
      column_rows_count:

    row_return_quality:
      safe_for_policy_disposition_oar: true_or_false
      blocker_if_false:

## 6. Create catalog evidence file if exact rows return

If the function returns exact rows, create:

docs/seat/measures_registry_isolated/10_validation/supabase_exact_live_policy_catalog_rows_v1.meta.md

Include the full returned payload or summarized row arrays sufficient for policy disposition.

Required sections:

- standing
- source_database_isolation
- row_return_method
- pg_policies_rows
- pg_tables_rows
- information_schema_columns_rows
- catalog_readback_quality

## 7. No policy disposition mutation

Do not classify or mutate policies in this OAR unless classification is read-only and explicitly separated.

This OAR's success condition is exact row return.

Policy disposition belongs to the next OAR2.

## VALIDATION RETURN

Return:

- OAR2 path
- validation evidence path
- exact catalog evidence path if created
- isolation readback result
- function name
- function created or replaced true_or_false
- anon execute granted true_or_false
- public execute granted true_or_false
- policy rows returned true_or_false
- table rows returned true_or_false
- column rows returned true_or_false
- safe_for_policy_disposition_oar true_or_false
- no policy mutation confirmation
- no application row mutation confirmation
- no runtime mutation confirmation
- no route mutation confirmation
- no renderer mutation confirmation
- no public copy mutation confirmation
- OAR1 path

## OAR1 CLOSEOUT

Create OAR1:

docs/seat/measures_registry_isolated/09_oar/oar1_authorize_read_only_catalog_rpc_seating_for_supabase_policy_review_v1.meta.md

OAR1 must report:

- OAR2 path
- validation evidence path
- exact catalog evidence path if created
- source blocked OAR1 path
- database isolation table readback result
- function name
- function created or replaced
- security definer used true_or_false
- anon execute granted false
- public execute granted false
- policy rows returned true_or_false
- table rows returned true_or_false
- column rows returned true_or_false
- row counts
- safe_for_policy_disposition_oar
- mutation scope confirmation
- no policy mutation confirmation
- no application row mutation confirmation
- no runtime mutation confirmation
- no route mutation confirmation
- no renderer mutation confirmation
- no public copy mutation confirmation
- recommended next OAR2 title

Recommended next OAR2 if safe_for_policy_disposition_oar is true:

OAR2 - Resolve Supabase Public Policy Dispositions for Measures Registry v1

Recommended next OAR2 if safe_for_policy_disposition_oar is false:

OAR2 - Repair Read-Only Catalog RPC for Supabase Policy Review v1

## CLOSE

This OAR2 seats a constrained read-only catalog RPC for exact policy review evidence.

It does not mutate application policies.

It does not mutate application rows.

It does not activate runtime.

Codex holds.
Field structures.
Measures registers.
Chazz validates.
Cody seats readback and writes evidence.

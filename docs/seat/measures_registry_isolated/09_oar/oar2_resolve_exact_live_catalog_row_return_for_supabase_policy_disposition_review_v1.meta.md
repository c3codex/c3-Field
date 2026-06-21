---
document_type: oar2
authority_level: proposed
system_scope: measures_codex
title: OAR2 - Resolve Exact Live Catalog Row Return for Supabase Policy Disposition Review v1
status: proposed
version: v1
operator: op044
priority: critical_security_followup
source_oar1:
  - docs/seat/measures_registry_isolated/09_oar/oar1_enable_rls_and_confirm_public_table_access_protection_for_measures_codex_v1.meta.md
  - docs/seat/measures_registry_isolated/09_oar/oar1_review_supabase_public_policies_and_renderer_read_requirements_for_measures_registry_v1.meta.md
  - docs/seat/measures_registry_isolated/09_oar/oar1_isolate_measures_registry_current_runtime_tables_and_policy_scope_before_supabase_policy_disposition_v1.meta.md
  - docs/seat/measures_registry_isolated/09_oar/oar1_seat_measures_registry_database_isolation_scope_for_public_policy_disposition_v1.meta.md
database_isolation_table: public.measures_registry_policy_scope_isolation
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

# OAR2 - Resolve Exact Live Catalog Row Return for Supabase Policy Disposition Review v1

## OBSERVED

The Measures Registry policy scope has now been isolated in documentation and seated in the database.

Database isolation standing:

- isolation table: public.measures_registry_policy_scope_isolation
- table exists after execution: true
- RLS enabled on isolation table: true
- rows inserted or upserted: 32
- readback row count: 32
- anon visible rows from isolation table: 0
- no anon/public policy created on the isolation table

The seated isolation scope includes:

- current_measures_registry_runtime: 7
- current_measures_registry_public_write: 2
- held_future_scope: 1
- protected_c3_system: 19
- protected_measures_of_inanna: 3

Policy mutation remains blocked because exact live catalog row return has not yet been resolved.

Prior blocker:

- exec_sql returned OK envelopes for catalog SELECT statements but did not return row payloads
- PostgREST access to pg_policies and pg_tables was blocked by schema cache
- exact policy rows are required before policy disposition or mutation

Current need:

Resolve exact live catalog row return from pg_policies, pg_tables, and information_schema.columns after database isolation has been seated.

## ALIGNED

This OAR2 is read-only.

It may create evidence files.

It may use the database-isolated scope table to limit policy review.

It may return exact catalog rows.

It may classify policy rows from exact catalog evidence.

It may not:

- drop policies
- create policies
- alter policies
- enable or disable RLS
- insert rows
- update rows
- delete rows
- mutate runtime
- mutate routes
- mutate renderer
- mutate public copy
- activate launch
- activate payment
- claim SEAT completion
- claim SEAL standing
- claim Registry Standing
- assign c3 Key
- activate DAO participation

Authority remains:

Codex -> Field -> Measures -> OAR2 -> Chazz -> Cody -> src

## ROUTED

## 1. Verify database isolation scope first

Read:

public.measures_registry_policy_scope_isolation

Required query:

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
order by isolation_scope, table_name;

Required result:

- active row count must equal 32
- current_measures_registry_runtime rows must equal 7
- current_measures_registry_public_write rows must equal 2
- protected_c3_system rows must equal 19
- protected_measures_of_inanna rows must equal 3
- held_future_scope rows must equal 1

If database isolation readback fails, stop and write blocker OAR1.

## 2. Resolve exact catalog row return method

Cody must establish one working method that returns exact row payloads.

Allowed methods:

- Supabase SQL editor manual query output copied into evidence
- Supabase MCP SQL execution with row return
- psql direct connection if available
- service role script that returns selected rows only
- repaired SQL RPC only if it returns row payloads

Not allowed:

- method that returns OK without rows
- PostgREST pg_policies if blocked by schema cache
- PostgREST pg_tables if blocked by schema cache
- inferred row counts without exact row payload

If no exact row-return method exists, stop and write blocker OAR1.

## 3. Return exact pg_policies rows for isolated scope only

Use the DB-seated isolation table as the scope authority.

Query:

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
join public.measures_registry_policy_scope_isolation iso
  on iso.table_schema = p.schemaname
 and iso.table_name = p.tablename
where p.schemaname = 'public'
  and iso.active = true
order by iso.isolation_scope, p.tablename, p.policyname;

Required evidence:

- exact rows returned true or false
- row count
- full row payload captured

## 4. Return exact pg_tables RLS rows for isolated scope only

Query:

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
join public.measures_registry_policy_scope_isolation iso
  on iso.table_schema = t.schemaname
 and iso.table_name = t.tablename
where t.schemaname = 'public'
  and iso.active = true
order by iso.isolation_scope, t.tablename;

Required evidence:

- exact rows returned true or false
- row count
- full row payload captured

## 5. Return exact column rows for isolated scope only

Query:

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
join public.measures_registry_policy_scope_isolation iso
  on iso.table_schema = c.table_schema
 and iso.table_name = c.table_name
where c.table_schema = 'public'
  and iso.active = true
order by iso.isolation_scope, c.table_name, c.ordinal_position;

Required evidence:

- exact rows returned true or false
- row count
- full row payload captured

## 6. Create exact catalog evidence file

Create:

docs/seat/measures_registry_isolated/10_validation/supabase_exact_live_policy_catalog_rows_v1.meta.md

The file must include:

standing:
  status: exact_catalog_rows_returned_or_blocked
  mutation_authorized: false
  policy_mutation_authorized: false
  db_row_mutation_authorized: false

source_database_isolation:
  table: public.measures_registry_policy_scope_isolation
  active_row_count:
  readback_passed: true_or_false

row_return_method:
  method_used:
  exact_rows_returned: true_or_false
  blocker_if_false:

pg_policies_rows:
  exact_rows_returned: true_or_false
  rows_returned_count:
  rows:

pg_tables_rows:
  exact_rows_returned: true_or_false
  rows_returned_count:
  rows:

information_schema_columns_rows:
  exact_rows_returned: true_or_false
  rows_returned_count:
  rows:

catalog_readback_quality:
  exact_pg_policies_returned: true_or_false
  exact_pg_tables_returned: true_or_false
  exact_information_schema_columns_returned: true_or_false
  safe_for_policy_disposition_oar: true_or_false

## 7. Classify exact live policy rows

If exact rows are returned, classify each policy by isolation scope.

Allowed public read policy dispositions:

- keep_with_evidence
- narrow_required
- hold_or_revoke_candidate
- protected_system_review
- protected_measures_of_inanna_review
- held_future_scope
- legacy_or_deprecated
- requires_operator_review

Allowed public write policy dispositions:

- keep_with_guardrails
- narrow_required
- replace_with_edge_function
- hold_or_revoke_candidate
- protected_system_review
- protected_measures_of_inanna_review
- held_future_scope
- requires_operator_review

Classification rules:

current_measures_registry_runtime:
  - public read may be needed only if renderer_required and anon_read_required are true
  - broad true public read should be marked narrow_required unless already constrained
  - possible narrowing predicate must use real columns only

current_measures_registry_public_write:
  - direct anon write remains unsafe now unless exact with_check proves strict scope
  - edge_function_preferred true should default to replace_with_edge_function
  - no anon update or delete should be allowed

protected_c3_system:
  - do not mutate under Measures Registry launch scope
  - classify as protected_system_review

protected_measures_of_inanna:
  - do not mutate under Measures Registry launch scope
  - classify as protected_measures_of_inanna_review

held_future_scope:
  - do not mutate under current launch scope
  - classify as held_future_scope

## 8. Create live catalog classification file

Create:

docs/seat/measures_registry_isolated/10_validation/supabase_policy_disposition_live_catalog_classification_v1.meta.md

The file must include:

standing:
  status: classification_from_exact_live_catalog_rows_or_blocked
  mutation_authorized: false
  policy_mutation_authorized: false
  safe_for_policy_disposition_oar: true_or_false

policy_disposition_summary:
  keep_with_evidence:
  narrow_required:
  hold_or_revoke_candidate:
  protected_system_review:
  protected_measures_of_inanna_review:
  held_future_scope:
  legacy_or_deprecated:
  requires_operator_review:
  replace_with_edge_function:

current_measures_registry_runtime_policy_classification:
  - table:
    policyname:
    roles:
    cmd:
    qual:
    exact_live_row_present: true_or_false
    recommended_disposition:
    reason:
    possible_safe_predicate_columns:

current_measures_registry_public_write_policy_classification:
  - table:
    policyname:
    roles:
    cmd:
    with_check:
    exact_live_row_present: true_or_false
    recommended_disposition:
    reason:
    possible_safe_predicate_columns:

protected_scope_policy_classification:
  - table:
    isolation_scope:
    policyname:
    recommended_disposition:
    reason:

operator_decisions_required:
  - decision:
    table_or_policy:
    reason:

next_safe_oar2:
  title:

## 9. No mutation boundary

Do not:

- drop policies
- create policies
- alter policies
- enable or disable RLS
- insert rows
- update rows
- delete rows
- mutate runtime
- mutate routes
- mutate renderer
- mutate public copy
- activate launch
- activate payment
- claim standing
- register DB contents

## VALIDATION RETURN

Return:

- OAR2 path
- exact catalog evidence file path
- classification file path
- database isolation readback result
- row-return method used
- exact pg_policies rows returned true_or_false
- exact pg_tables rows returned true_or_false
- exact information_schema column rows returned true_or_false
- safe_for_policy_disposition_oar true_or_false
- policy classification summary
- required operator decisions
- no DB mutation confirmation
- no policy mutation confirmation
- no runtime mutation confirmation
- no route mutation confirmation
- no renderer mutation confirmation
- no public copy mutation confirmation
- OAR1 path

## OAR1 CLOSEOUT

Create OAR1:

docs/seat/measures_registry_isolated/09_oar/oar1_resolve_exact_live_catalog_row_return_for_supabase_policy_disposition_review_v1.meta.md

OAR1 must report:

- OAR2 path
- exact catalog evidence file path
- classification file path
- database isolation readback result
- row-return method used
- whether exact pg_policies rows returned
- whether exact pg_tables rows returned
- whether exact information_schema column rows returned
- row counts
- safe_for_policy_disposition_oar
- classification summary
- required operator decisions
- mutation scope confirmation
- no DB mutation confirmation
- no policy mutation confirmation
- no runtime mutation confirmation
- no route mutation confirmation
- no renderer mutation confirmation
- no public copy mutation confirmation
- recommended next OAR2 title

Recommended next OAR2 if safe_for_policy_disposition_oar is true:

OAR2 - Resolve Supabase Public Policy Dispositions for Measures Registry v1

Recommended next OAR2 if safe_for_policy_disposition_oar is false:

OAR2 - Repair Supabase SQL Row Return Access for Policy Review v1

## CLOSE

This OAR2 resolves exact live catalog row-return evidence only.

No policy changes are authorized.

No DB row mutation is authorized.

Codex holds.
Field structures.
Measures registers.
Chazz validates.
Cody reads exact rows and writes evidence.

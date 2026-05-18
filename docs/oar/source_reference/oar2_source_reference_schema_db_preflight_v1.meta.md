---
document_type: oar2
authority_level: working
document_scope: source_reference_schema_db_preflight
title: OAR2 — Source Reference Schema DB Preflight v1
status: proposed
version: v1
operator: op044
system: source_reference
native_stack:
  codex: database
  field: schema
  measures: registry
  chazz: systems
tags:
  - oar2
  - source-reference
  - schema
  - db-preflight
  - supabase
  - rls
  - grants
  - no-db-mutation
source_alignment:
  - OAR1 - Source Reference Schema SQL Draft v1 Review Pass
  - Source Set Rule Summary — Seeded Reference Control
  - OAR Lifecycle — Execution and Handoff
---

# OAR2 — Source Reference Schema DB Preflight v1

## OBSERVED

A reviewed SQL draft exists at:

docs/schema/source_reference/source_reference_schema_sql_draft_v1_reviewed.sql

The prior review routed the draft to:

db_preflight_candidate

No SQL has been executed.

No DB mutation has occurred.

The reviewed draft proposes the `codex_source_*` table family:

- codex_source_reference
- codex_source_term
- codex_source_operative_binding
- codex_source_relation
- codex_source_seed_log
- v_seeded_codex_source_references

The reviewed draft includes:

- pgcrypto extension requirement
- RLS enabled on all source tables
- access revoked from anon and authenticated
- security definer function for seeded transition
- seeded-state guardrails
- source_path and source_hash requirements
- committed-before-seeded rule
- append-only protection after seeded state

Remaining concerns require live DB preflight before execution.

## ALIGNED

This OAR2 authorizes DB preflight only.

It does not authorize:

- schema execution
- table creation
- function creation
- trigger creation
- RLS policy creation
- seed insertion
- seeded-state transition
- authority seating

Codex remains database authority.
Field structures relation.
Measures registers standing.
Chazz routes preflight.
Cody may inspect and report only.

## ROUTED

### 1. Extension Preflight

Check whether `pgcrypto` is available and already installed.

Required query:

    select extname, extversion
    from pg_extension
    where extname = 'pgcrypto';

If absent, determine whether current DB role can run:

    create extension if not exists pgcrypto;

No extension change is authorized by this OAR2.

### 2. Existing Object Collision Preflight

Check whether any proposed objects already exist.

Required query:

    select table_schema, table_name
    from information_schema.tables
    where table_schema = 'public'
      and table_name in (
        'codex_source_reference',
        'codex_source_term',
        'codex_source_operative_binding',
        'codex_source_relation',
        'codex_source_seed_log'
      )
    order by table_name;

Required routine check:

    select routine_schema, routine_name, routine_type
    from information_schema.routines
    where routine_schema = 'public'
      and routine_name in (
        'touch_codex_source_updated_at',
        'prevent_seeded_codex_source_reference_update',
        'mark_codex_source_reference_seeded'
      )
    order by routine_name;

Required view check:

    select table_schema, table_name
    from information_schema.views
    where table_schema = 'public'
      and table_name = 'v_seeded_codex_source_references';

### 3. Schema Placement Review

Determine whether these objects should remain in:

- public

or move to a dedicated schema such as:

- codex
- governance

Preflight must return a recommendation.

Default standing for this draft remains `public` unless live environment review shows collision, exposure, or naming-governance risk.

### 4. RLS and Grant Preflight

Confirm role posture for:

- anon
- authenticated
- service_role
- postgres

Required check after any future execution, not now:

    select schemaname, tablename, rowsecurity
    from pg_tables
    where schemaname = 'public'
      and tablename like 'codex_source_%'
    order by tablename;

Preflight must determine whether initial execution should include:

- no RLS policies
- service-only access
- read-only authenticated access
- operator-only RPC access

Expected recommendation:

No public RLS policies in the first migration.
Service-role / controlled server-side access only until access patterns are separately routed.

### 5. Function Authority Preflight

Review whether this function should remain in SQL:

    public.mark_codex_source_reference_seeded(...)

Decision required:

- keep function with restricted execute
- keep function but move to private schema
- remove function and require service-side seeded transition
- reject function until seeded transition workflow is separately defined

Expected recommendation:

Hold public callable seeded transition.
Prefer service-side controlled transition or private schema RPC only after role/grant validation.

### 6. Migration Ordering Preflight

Confirm migration should be separated into ordered phases:

1. extension availability check
2. table creation
3. index creation
4. trigger functions
5. triggers
6. view creation
7. RLS enablement
8. grants / revokes
9. no policies until access OAR
10. validation queries

Preflight must identify any order risk.

### 7. Supabase Compatibility Review

Check the reviewed SQL for Supabase compatibility:

- gen_random_uuid availability
- security definer search_path safety
- RLS behavior with no policies
- revoke behavior in public schema
- trigger creation idempotency
- view exposure risk
- metadata jsonb constraints
- source_hash/source_path constraints

### 8. Final Route

Return exactly one final route:

- db_preflight_passed
- db_preflight_requires_revision
- rejected_for_execution

Expected current route:

db_preflight_requires_revision

unless live environment confirms the function/grant/RLS posture is safe as written.

## CODY ROLE

Cody may:

- inspect the reviewed SQL
- run read-only DB preflight queries
- report live environment standing
- recommend revision
- produce a revised migration draft if needed

Cody may not:

- execute the reviewed SQL
- create tables
- create functions
- create triggers
- create policies
- mutate Supabase
- mark any source reference seeded
- claim authority seating
- produce OAR1 as DB execution

## VALIDATION

Preflight is complete only when Cody returns:

1. pgcrypto standing
2. object collision standing
3. schema placement recommendation
4. RLS/grant recommendation
5. seeded-transition function recommendation
6. migration ordering review
7. Supabase compatibility findings
8. final route:
   - db_preflight_passed
   - db_preflight_requires_revision
   - rejected_for_execution

## EXPECTED OUTPUT

If revision is required:

docs/schema/source_reference/source_reference_schema_sql_draft_v1_preflight_revised.sql

If OAR1 is created, it must describe DB preflight completion only.

It must not claim schema execution.

## CLOSE

Preflight before migration.

Migration only by separate confirmed OAR2.

No DB mutation from this OAR2.

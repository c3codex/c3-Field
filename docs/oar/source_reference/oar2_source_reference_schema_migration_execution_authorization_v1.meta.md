---
document_type: oar2
authority_level: working
document_scope: source_reference_schema_migration_execution
title: OAR2 — Source Reference Schema Migration Execution Authorization v1
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
  - migration
  - execution
  - db
  - supabase
  - codex
source_alignment:
  - OAR1 - Source Reference Schema Preflight Revision v1
  - Seed Concordance
  - The 21 of Coherence
  - Source Set Rule Summary — Seeded Reference Control
  - OAR Lifecycle — Execution and Handoff
---

# OAR2 — Source Reference Schema Migration Execution Authorization v1

## OBSERVED

The reviewed and corrected migration candidate exists at:

docs/schema/source_reference/source_reference_schema_sql_draft_v1_preflight_corrected.sql

Prior OAR1 routed the schema to:

`db_preflight_passed`

The schema currently remains unexecuted.

No DB mutation has occurred.

No source-reference authority has been seated.

The corrected schema includes:

- `codex_source_*` table family
- RLS enablement
- append-only seeded protection
- service-side seeded transition posture
- authority/lifecycle distinction preservation
- source path/hash constraints
- validation block comments only

## ALIGNED

This OAR2 authorizes migration execution only.

It does not authorize:

- source data seeding
- authority claims
- automatic source ingestion
- frontend/runtime integration
- policy exposure beyond defined execution posture

Codex remains authority.
Field structures relation.
Measures registers standing.
Chazz routes execution.
Cody executes only the authorized migration surface.

## ROUTED

### 1. Authorized Migration Surface

Authorized SQL surface:

docs/schema/source_reference/source_reference_schema_sql_draft_v1_preflight_corrected.sql

No other SQL file is authorized.

### 2. Execution Role

Migration execution is restricted to:

- postgres
- service_role controlled execution

Execution may not occur from:

- anon
- authenticated
- browser runtime
- frontend RPC
- public client surfaces

### 3. Schema Placement

Authorized placement for this migration:

`public`

Reason:

- aligns with current Measures DB structure
- avoids premature schema fragmentation
- preserves compatibility with existing registry surfaces

Future migration into dedicated `codex` or `governance` schema remains permitted through later OAR.

### 4. Migration Ordering

Execution order must remain:

1. extension verification
2. table creation
3. index creation
4. trigger function creation
5. trigger creation
6. view creation
7. RLS enablement
8. grants/revokes
9. validation queries

Execution order may not drift.

### 5. RLS Posture

Initial execution posture:

- RLS enabled
- no public policies
- no authenticated policies
- no anon policies

Access remains service-side only until separate access OAR defines exposure.

### 6. Seeded Transition Posture

Seeded transition remains service-controlled.

No public callable seeded transition surface is authorized.

No frontend-triggered seeded transition is authorized.

### 7. Rollback Posture

Rollback must:

- remove created views
- remove triggers
- remove trigger functions
- remove tables in dependency-safe reverse order

Rollback may not:

- remove unrelated registry structures
- mutate seeded references outside this migration scope

### 8. Post-Migration Validation

Required validation includes:

#### Extension

    select extname
    from pg_extension
    where extname = 'pgcrypto';

#### Tables

    select table_name
    from information_schema.tables
    where table_schema = 'public'
      and table_name like 'codex_source_%'
    order by table_name;

#### RLS

    select schemaname, tablename, rowsecurity
    from pg_tables
    where schemaname = 'public'
      and tablename like 'codex_source_%'
    order by tablename;

#### Functions

    select routine_name
    from information_schema.routines
    where routine_schema = 'public'
      and routine_name like '%codex_source%';

#### Views

    select table_name
    from information_schema.views
    where table_schema = 'public'
      and table_name = 'v_seeded_codex_source_references';

### 9. Expected OAR1

Execution must produce:

docs/oar/source_reference/oar1_source_reference_schema_migration_execution_v1.meta.md

OAR1 must include:

- execution confirmation
- executed SQL path
- validation query outputs
- created object list
- RLS standing
- rollback standing
- confirmation that no source records were seeded automatically

## CODY ROLE

Cody may:

- execute the authorized migration SQL
- validate resulting DB state
- produce execution OAR1
- report failures honestly
- halt on migration conflict

Cody may not:

- modify migration scope
- seed source records automatically
- expose public access policies
- invent additional tables
- bypass validation
- treat migration as seeded-reference completion

## VALIDATION

Migration execution is complete only when:

1. migration executes successfully
2. validation queries pass
3. RLS is enabled
4. no public policies exist
5. no automatic source seeding occurred
6. execution OAR1 exists
7. rollback posture is documented

## CLOSE

Preflight completed first.

Execution authorized second.

Validation required third.

Source authority seating remains separate from schema creation.

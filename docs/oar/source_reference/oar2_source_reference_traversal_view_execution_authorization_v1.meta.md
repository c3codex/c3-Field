---
document_type: oar2
authority_level: working
document_scope: source_reference_traversal_view_execution
title: OAR2 — Source Reference Traversal View Execution Authorization v1
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
  - traversal
  - resolution
  - views
  - execution
source_alignment:
  - OAR1 - Source Reference Traversal and Resolution Views v1
  - OAR1 - Source Reference Expansion and Inheritance Rules v1
  - OAR1 - Source Reference Initial Seeding v1
  - Seed Concordance
  - Source Set Rule Summary — Seeded Reference Control
---

# OAR2 — Source Reference Traversal View Execution Authorization v1

## OBSERVED

Traversal and resolution views were drafted successfully.

Draft SQL exists at:

`docs/schema/source_reference/source_reference_traversal_resolution_views_v1.sql`

No traversal view has yet been executed in DB.

No public exposure exists.

No recursive traversal exists in the drafted SQL.

No contradiction auto-resolution exists.

Protected-source filtering remains bounded to metadata markers only.

## ALIGNED

This OAR2 authorizes execution of the drafted traversal and resolution views only.

It does not authorize:

- public policies
- frontend/runtime exposure
- recursive traversal
- automatic contradiction resolution
- operative binding activation
- source mutation
- seeded-reference modification
- automatic supersession enforcement

Codex remains authority.
Field structures relation.
Measures registers standing.
Chazz routes execution.
Cody executes only the authorized traversal-view surface.

## ROUTED

### 1. Authorized SQL Surface

Authorized SQL file:

`docs/schema/source_reference/source_reference_traversal_resolution_views_v1.sql`

No other SQL surface is authorized.

### 2. Authorized DB Objects

Execution is limited to creation of:

- `public.v_codex_source_seeded_precedence`
- `public.v_codex_source_lineage`
- `public.v_codex_source_seeded_relations`
- `public.v_codex_source_supersession`
- `public.v_codex_source_active_bindings`
- `public.v_codex_source_contradiction_candidates`
- `public.v_codex_source_resolution_path`

No table mutation is authorized.

No new table creation is authorized.

### 3. Service-Only Access Posture

Views remain:

- service-side only
- non-public
- non-frontend
- non-authenticated

No access policy changes are authorized.

### 4. Non-Recursive Constraint

Validation must confirm:

- no recursive CTE
- no unbounded traversal
- no self-expanding relation walk
- no cycle-producing relation execution

Recursive traversal remains deferred until a dedicated recursive-governance OAR exists.

### 5. Contradiction Candidate Validation

Validate that contradiction surfaces:

- identify candidates only
- do not mutate bindings
- do not alter precedence
- do not deactivate records automatically
- do not rewrite lineage

Contradiction resolution remains operator-routed.

### 6. Supersession Validation

Validate that supersession view:

- preserves retrievability
- does not delete superseded records
- does not silently redirect authority
- exposes relation standing only

### 7. Protected Source Validation

Validate that traversal views:

- may expose protected boundary markers
- may expose protected relation existence
- may not expose reconstructible protected internals
- may not expose protected body content

### 8. Resolution Integrity Validation

Validate that resolution-path view preserves:

- precedence order
- relation type
- source standing
- term standing
- binding standing
- seeded-state distinction

The view may expose relation state.
It may not invent authority.

### 9. Rollback Posture

Rollback must remove only:

- traversal views created by this OAR

Rollback may not:

- remove source tables
- mutate seeded references
- remove seed logs
- alter bindings
- alter relations

### 10. Validation Queries

Required validation includes:

#### View Presence

    select table_name
    from information_schema.views
    where table_schema = 'public'
      and table_name like 'v_codex_source_%'
    order by table_name;

#### Seeded Precedence

    select *
    from public.v_codex_source_seeded_precedence
    order by precedence_rank, source_key;

#### Lineage

    select *
    from public.v_codex_source_lineage
    order by relation_type;

#### Seeded Relations

    select *
    from public.v_codex_source_seeded_relations;

#### Supersession

    select *
    from public.v_codex_source_supersession;

#### Active Bindings

    select *
    from public.v_codex_source_active_bindings;

#### Contradiction Candidates

    select *
    from public.v_codex_source_contradiction_candidates;

#### Resolution Path

    select *
    from public.v_codex_source_resolution_path;

## CODY ROLE

Cody may:

- execute the authorized traversal-view SQL
- validate resulting view outputs
- confirm non-recursive standing
- confirm protected-source filtering
- produce execution OAR1
- halt on contradiction or execution failure

Cody may not:

- expose public policies
- create recursive traversal
- activate bindings
- mutate source references
- alter precedence logic
- auto-resolve contradictions
- expose protected internals
- expand beyond authorized views

## EXPECTED OAR1

`docs/oar/source_reference/oar1_source_reference_traversal_view_execution_v1.meta.md`

OAR1 must include:

- executed SQL path
- created view list
- validation query outputs
- non-recursive confirmation
- contradiction-view standing
- supersession-view standing
- protected-source validation
- rollback standing
- confirmation of zero public access policies

## VALIDATION

Traversal-view execution is complete only when:

1. all authorized views exist
2. validation queries execute successfully
3. no recursive traversal exists
4. no contradiction auto-resolution exists
5. no protected internals are exposed
6. no public policies are created
7. OAR1 documents execution and validation

## CLOSE

Seeded memory exists.

Inheritance law exists.

Traversal resolution may now execute.

Authority interpretation remains bounded to Codex.

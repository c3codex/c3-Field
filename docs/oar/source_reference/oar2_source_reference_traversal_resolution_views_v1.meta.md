---
document_type: oar2
authority_level: working
document_scope: source_reference_traversal_resolution
title: OAR2 — Source Reference Traversal and Resolution Views v1
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
  - lineage
  - precedence
  - views
source_alignment:
  - OAR1 - Source Reference Expansion and Inheritance Rules v1
  - OAR1 - Source Reference Initial Seeding v1
  - Seed Concordance
  - Source Set Rule Summary — Seeded Reference Control
---

# OAR2 — Source Reference Traversal and Resolution Views v1

## OBSERVED

Inheritance, precedence, supersession, contradiction handling, operative activation, and protected-source boundaries are confirmed.

No schema change was required by the inheritance review.

Access exposure remains blocked until deterministic traversal and resolution surfaces exist.

## ALIGNED

This OAR2 authorizes traversal/resolution view design only.

It does not authorize:

- frontend exposure
- public policies
- source editing UI
- automatic source seeding
- operative binding activation
- mutation of seeded references
- protected-source content exposure

## ROUTED

Create or review DB-native resolution surfaces for:

### 1. Seeded Source Precedence

View:

`public.v_codex_source_seeded_precedence`

Purpose:

Resolve seeded source references with explicit precedence rank.

Must include:

- source_reference_id
- source_key
- source_title
- source_type
- authority_level
- source_status
- readonly
- seeded_at
- precedence_rank
- precedence_label

### 2. Source Lineage

View:

`public.v_codex_source_lineage`

Purpose:

Expose source-to-source relations without copying authority.

Must include:

- relation_id
- from_source_key
- to_source_key
- relation_type
- relation_note
- from_precedence_rank
- to_precedence_rank

### 3. Seeded-Only Traversal

View:

`public.v_codex_source_seeded_relations`

Purpose:

Return relations where both sides are seeded source references.

Exclude unseeded, draft, rejected, or superseded references unless explicitly required by supersession view.

### 4. Supersession Resolution

View:

`public.v_codex_source_supersession`

Purpose:

Track superseded source references while preserving retrievability.

Must include:

- superseded_source_key
- superseding_source_key
- supersession_relation_id
- superseded_status
- superseding_status
- supersession_validity

### 5. Active Binding Resolution

View:

`public.v_codex_source_active_bindings`

Purpose:

Resolve operative bindings that are actually active.

Must include only bindings where:

- binding state = active
- source reference is seeded
- source term is active
- no known higher-precedence contradiction exists

### 6. Contradiction Detection

View:

`public.v_codex_source_contradiction_candidates`

Purpose:

Detect possible conflict surfaces for operator review.

Candidate signals include:

- same term bound to incompatible system surfaces
- lower-precedence source attempting to supersede higher-precedence source
- active binding attached to unseeded source
- superseded source still carrying active binding
- relation path involving rejected source

This view identifies candidates only.
It does not resolve contradiction automatically.

### 7. Resolution Path

View:

`public.v_codex_source_resolution_path`

Purpose:

Expose current source resolution route from seeded source to active binding.

Must preserve:

- source precedence
- relation type
- source status
- term status
- binding state
- protected-source flag where present

### 8. Protected Source Filtering

Traversal views must not expose reconstructible protected internals.

Protected sources may appear as references or boundary markers only.

Protected content body remains non-reconstructible.

### 9. Cycle Prevention Review

If recursive traversal is proposed, it must include:

- max depth
- cycle detection
- path array
- halt condition

No unbounded recursive source traversal is permitted.

### 10. No Public Exposure

All views remain service-side unless a later access-policy OAR authorizes read exposure.

## CODY ROLE

Cody may:

- inspect current `codex_source_*` schema
- draft SQL views
- execute view creation only if explicitly included in this OAR’s final SQL route
- validate view output
- produce OAR1 with validation

Cody may not:

- create public policies
- expose views to frontend
- seed new sources
- activate bindings
- auto-resolve contradictions
- mutate seeded references
- expose protected internals

## EXPECTED OUTPUT

If SQL is required:

docs/schema/source_reference/source_reference_traversal_resolution_views_v1.sql

Expected OAR1:

docs/oar/source_reference/oar1_source_reference_traversal_resolution_views_v1.meta.md

## VALIDATION

Traversal/resolution work is complete only when:

1. seeded precedence view exists or is explicitly deferred
2. lineage view exists or is explicitly deferred
3. seeded-only traversal view exists or is explicitly deferred
4. supersession view exists or is explicitly deferred
5. active binding view exists or is explicitly deferred
6. contradiction candidate view exists or is explicitly deferred
7. resolution path view exists or is explicitly deferred
8. protected-source filtering is preserved
9. no public access policy is created
10. OAR1 documents view outputs or deferrals

## CLOSE

Inheritance law exists.

Traversal must resolve before exposure.

Runtime must not interpret source authority outside Codex.

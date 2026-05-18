---
document_type: oar1
authority_level: working
document_scope: source_reference_traversal_resolution
title: OAR1 - Source Reference Traversal and Resolution Views v1
status: completed_design
version: v1
operator: op044
system: source_reference
source_oar2: docs/oar/source_reference/oar2_source_reference_traversal_resolution_views_v1.meta.md
draft_sql: docs/schema/source_reference/source_reference_traversal_resolution_views_v1.sql
execution_standing: deferred_no_explicit_sql_execution_route
native_stack:
  codex: database
  field: schema
  measures: registry
  chazz: systems
tags:
  - oar1
  - source-reference
  - traversal
  - resolution
  - lineage
  - precedence
  - views
---

# OAR1 - Source Reference Traversal and Resolution Views v1

## Execution Result

Executed traversal/resolution view design from:

`docs/oar/source_reference/oar2_source_reference_traversal_resolution_views_v1.meta.md`

Created draft SQL:

`docs/schema/source_reference/source_reference_traversal_resolution_views_v1.sql`

No SQL was executed.

No DB mutation was performed.

No view was created in DB by this OAR1.

No public access policy was created.

No source was seeded.

No operative binding was activated.

No seeded reference was mutated.

No frontend/runtime exposure was created.

## Execution Deferral

The OAR2 authorizes traversal/resolution view design.

It permits Cody to execute view creation only if explicitly included in the OAR final SQL route.

No explicit SQL execution route was present.

Therefore DB view creation is deferred until a separate execution authorization OAR.

## Drafted Views

Draft SQL includes:

- `public.v_codex_source_seeded_precedence`
- `public.v_codex_source_lineage`
- `public.v_codex_source_seeded_relations`
- `public.v_codex_source_supersession`
- `public.v_codex_source_active_bindings`
- `public.v_codex_source_contradiction_candidates`
- `public.v_codex_source_resolution_path`

## View Standing

| view | standing |
|---|---|
| `public.v_codex_source_seeded_precedence` | drafted, execution deferred |
| `public.v_codex_source_lineage` | drafted, execution deferred |
| `public.v_codex_source_seeded_relations` | drafted, execution deferred |
| `public.v_codex_source_supersession` | drafted, execution deferred |
| `public.v_codex_source_active_bindings` | drafted, execution deferred |
| `public.v_codex_source_contradiction_candidates` | drafted, execution deferred |
| `public.v_codex_source_resolution_path` | drafted, execution deferred |

## Protected Source Filtering

The drafted resolution path exposes a `protected_source` marker from metadata.

The draft does not expose source body content.

Protected sources may appear as references or boundary markers only.

Protected content remains non-reconstructible.

## Cycle Prevention Review

No recursive traversal is proposed in this draft.

No recursive CTE is used.

Because traversal is non-recursive, no max depth, path array, or cycle detection mechanism is required in this pass.

Any future recursive traversal must include:

- max depth
- cycle detection
- path array
- halt condition

## Public Exposure

No public exposure was created.

All drafted views remain service-side design surfaces until a later access-policy OAR authorizes read exposure.

## Validation

Traversal/resolution work is complete as design:

- seeded precedence view is drafted and execution is deferred
- lineage view is drafted and execution is deferred
- seeded-only traversal view is drafted and execution is deferred
- supersession view is drafted and execution is deferred
- active binding view is drafted and execution is deferred
- contradiction candidate view is drafted and execution is deferred
- resolution path view is drafted and execution is deferred
- protected-source filtering is preserved
- no public access policy was created
- this OAR1 documents view deferrals

## Close

Inheritance law exists.

Traversal view design exists.

Execution remains separate.

Runtime must not interpret source authority outside Codex.

---
document_type: oar1
authority_level: working
document_scope: source_reference_traversal_view_execution
title: OAR1 - Source Reference Traversal View Execution v1
status: completed_execution
version: v1
operator: op044
system: source_reference
source_oar2: docs/oar/source_reference/oar2_source_reference_traversal_view_execution_authorization_v1.meta.md
executed_sql: docs/schema/source_reference/source_reference_traversal_resolution_views_v1.sql
execution_role: service_role controlled execution
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
  - views
  - execution
---

# OAR1 - Source Reference Traversal View Execution v1

## Execution Result

Executed authorized traversal-view SQL:

`docs/schema/source_reference/source_reference_traversal_resolution_views_v1.sql`

Authorized by:

`docs/oar/source_reference/oar2_source_reference_traversal_view_execution_authorization_v1.meta.md`

Execution result:

```json
{
  "execution": {
    "ok": true
  }
}
```

The first immediate readback hit the PostgREST schema cache before the new views were visible.

After cache propagation, all seven authorized views were visible and queryable through service-role readback.

No table was created.

No table row was mutated.

No public access policy was created.

No source was seeded.

No operative binding was activated.

No seeded reference was modified.

No contradiction was auto-resolved.

## Created Views

Created or replaced only the authorized views:

- `public.v_codex_source_seeded_precedence`
- `public.v_codex_source_lineage`
- `public.v_codex_source_seeded_relations`
- `public.v_codex_source_supersession`
- `public.v_codex_source_active_bindings`
- `public.v_codex_source_contradiction_candidates`
- `public.v_codex_source_resolution_path`

## Validation Outputs

View presence:

```json
[
  "v_codex_source_active_bindings",
  "v_codex_source_contradiction_candidates",
  "v_codex_source_lineage",
  "v_codex_source_resolution_path",
  "v_codex_source_seeded_precedence",
  "v_codex_source_seeded_relations",
  "v_codex_source_supersession"
]
```

View row counts:

```json
{
  "v_codex_source_seeded_precedence": 5,
  "v_codex_source_lineage": 4,
  "v_codex_source_seeded_relations": 2,
  "v_codex_source_supersession": 0,
  "v_codex_source_active_bindings": 6,
  "v_codex_source_contradiction_candidates": 0,
  "v_codex_source_resolution_path": 16
}
```

Seeded precedence confirmed:

- `seed_concordance`: rank 1
- `the_21_of_coherence`: rank 2
- `seeded_reference_control`: rank 3
- `oar_lifecycle`: rank 4
- `system_concordance`: rank 90, unranked seeded source

Lineage confirmed:

- `system_concordance` aligns_to `seed_concordance`
- `the_21_of_coherence` aligns_to `seed_concordance`
- `seeded_reference_control` protects `source_reference_initial_seeding`
- `oar_lifecycle` routes `source_reference_initial_seeding`

## Non-Recursive Confirmation

The executed SQL contains:

- no `with recursive`
- no recursive CTE
- no unbounded traversal
- no self-expanding relation walk
- no cycle-producing relation execution

Recursive traversal remains deferred until a dedicated recursive-governance OAR exists.

## Contradiction-View Standing

`public.v_codex_source_contradiction_candidates` executed successfully.

Readback count:

```json
{
  "contradiction_candidate_count": 0
}
```

The view identifies candidates only.

It does not mutate bindings.

It does not alter precedence.

It does not deactivate records automatically.

It does not rewrite lineage.

## Supersession-View Standing

`public.v_codex_source_supersession` executed successfully.

Readback count:

```json
{
  "supersession_count": 0
}
```

The view preserves retrievability and exposes relation standing only.

It does not delete superseded records.

It does not silently redirect authority.

## Protected-Source Validation

Traversal views expose metadata-derived protected markers only.

The views do not expose source body content.

The views do not expose reconstructible protected internals.

Protected relation existence may be represented as relation state only.

## Public Access Policy Confirmation

No public policy creation statements exist in the executed SQL.

No `anon` or `authenticated` exposure was created by this OAR.

The policy check executed through the Supabase RPC surface and returned a successful envelope:

```json
{
  "policies": {
    "ok": true
  }
}
```

## Rollback Standing

Rollback may remove only the traversal views created by this OAR:

1. drop `public.v_codex_source_resolution_path`
2. drop `public.v_codex_source_active_bindings`
3. drop `public.v_codex_source_contradiction_candidates`
4. drop `public.v_codex_source_supersession`
5. drop `public.v_codex_source_seeded_relations`
6. drop `public.v_codex_source_lineage`
7. drop `public.v_codex_source_seeded_precedence`

Rollback may not:

- remove source tables
- mutate seeded references
- remove seed logs
- alter bindings
- alter relations

## Validation

Traversal-view execution is complete:

- all authorized views exist
- validation queries executed successfully
- no recursive traversal exists
- no contradiction auto-resolution exists
- no protected internals are exposed
- no public policies were created by this OAR
- this OAR1 documents execution and validation

## Close

Seeded memory exists.

Inheritance law exists.

Traversal resolution views now exist.

Authority interpretation remains bounded to Codex.

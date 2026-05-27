---
document_type: oar2
authority_level: working
document_scope: source_authority
title: OAR2 — Source Reference Existing Schema Extension v1
status: proposed
version: v1
operator: op044
system: source_authority
native_stack:
  codex: database
  field: schema
  measures: registry
  oar2: observed_aligned_routed
  chazz: systems
  cody: executor
  src: renderer
tags:
  - oar2
  - source-authority
  - existing-schema-extension
  - codex-source-reference
  - c3-7s
  - measures-interoperability
  - artifact-proof
source_alignment:
  - OAR1 — Source Reference Existing Schema Reconciliation v1
  - OAR1 — Source Reference Schema Migration Preflight v1
  - Active Session Transfer Surface Rule
  - OAR Lifecycle — Execution and Handoff
  - Seeded Reference Control
---

# OAR2 — Source Reference Existing Schema Extension v1

## OBSERVED

Source Reference Existing Schema Reconciliation confirmed that live DB already contains an executed source-reference schema.

Existing live root table:

`public.codex_source_reference`

Existing related structures include:

- `public.codex_source_term`
- `public.codex_source_operative_binding`
- `public.codex_source_relation`
- `public.codex_source_seed_log`
- source-reference traversal views
- source-reference functions and triggers

The reconciliation OAR1 found the Measures Interoperability SQL draft incompatible with the live schema and returned standing:

`draft_requires_rewrite_against_existing_schema`

The recommended next route is a targeted Existing Schema Extension OAR2, not first-time schema creation.

## ALIGNED

This OAR2 routes extension planning only.

No SQL execution.
No DB mutation.
No Codex seating.
No runtime/CSS work.
No deprecation execution.

The existing DB schema remains the authority surface for this route.

## ROUTED

Claude-as-Cody-compatible executor is routed to draft an existing-schema extension plan only.

Claude must:

1. Use the existing live table shape confirmed in reconciliation:
   - `source_key`
   - `source_title`
   - `source_type`
   - `authority_level`
   - `source_scope`
   - `source_status`
   - `source_path`
   - `metadata`

2. Draft an extension SQL plan that:
   - adds `aliases jsonb` to `public.codex_source_reference` if absent
   - does not recreate `codex_source_reference`
   - does not create a duplicate lineage table
   - does not create public access views in this OAR2

3. Rewrite the 19 proposed source rows into the existing live column vocabulary.

4. Map draft vocabulary into live schema vocabulary:

   title → source_title
   document_scope → source_scope
   file_path → source_path
   standing → source_status + metadata.review_status
   codex_seated → seeded only where verified by OAR evidence
   held → written + metadata.review_status = operator_required

5. Preserve c3 7s aliasing:

   source_key: source_21_of_coherence_v1
   source_title: The 21 of Coherence
   aliases:
     - c3 7s
     - c3_7s
     - twenty_one_of_coherence

6. Keep `system_concordance` and `coherence_matrix_v1` as held/operator-required until source paths are confirmed.

7. Return an operator decision table for any rows whose live-schema mapping is uncertain.

8. Write OAR1 beside this OAR2 after completion.

Claude must not:

1. Execute SQL.
2. Modify the database.
3. Modify runtime or CSS.
4. Declare Codex seating.
5. Move files.
6. Open a new folder surface.
7. Claim migration readiness without artifact proof.

## REQUIRED OUTPUT

Return:

1. Existing-schema extension SQL draft summary.
2. Column mapping table.
3. Status mapping table.
4. 19-row source mapping summary.
5. Rows requiring operator decision.
6. Confirmation that no duplicate root table or duplicate lineage system is proposed.
7. Migration readiness standing:
   - ready for operator review
   - not ready, correction required

## ARTIFACT-PROOF BLOCK

Before OAR1 closeout, verify:

1. Extension plan does not contain `CREATE TABLE public.codex_source_reference`.
2. Extension plan does not rely on `standing`, `title`, `document_scope`, or `file_path` as live columns.
3. Extension plan uses existing live columns.
4. `aliases jsonb` is added only as extension.
5. `system_concordance` and `coherence_matrix_v1` remain operator-required unless paths are confirmed.
6. No SQL execution occurred.

OAR1 may not claim completion unless artifact evidence confirms these checks.

## EXPECTED FILES

- `docs/oar/measures_interoperability/oar2_source_reference_existing_schema_extension_v1.meta.md`
- `docs/oar/measures_interoperability/oar1_source_reference_existing_schema_extension_v1.meta.md`
- `docs/oar/measures_interoperability/source_reference_existing_schema_extension_v1.sql`

## EXPECTED OAR1

`docs/oar/measures_interoperability/oar1_source_reference_existing_schema_extension_v1.meta.md`

## SUCCESS CONDITION

This OAR2 succeeds when an existing-schema extension draft exists that aligns with the live `codex_source_reference` table instead of attempting to recreate or replace it.

## CLOSE

Extend what exists.
Do not duplicate authority.
Execution waits.

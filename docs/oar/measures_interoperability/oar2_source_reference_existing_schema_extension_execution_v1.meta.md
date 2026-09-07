---
document_type: oar2
authority_level: working
document_scope: source_authority
title: OAR2 — Source Reference Existing Schema Extension Execution v1
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
  - execution
  - codex-source-reference
  - c3-7s
  - measures-interoperability
  - artifact-proof
source_alignment:
  - OAR1 — Source Reference Existing Schema Extension v1
  - OAR1 — Source Reference Existing Schema Reconciliation v1
  - Active Session Transfer Surface Rule
  - Seeded Reference Control
  - OAR Lifecycle — Execution and Handoff
---

# OAR2 — Source Reference Existing Schema Extension Execution v1

## OBSERVED

Source Reference Existing Schema Extension v1 is complete and ready for execution routing.

The extension draft preserves the existing live `public.codex_source_reference` table.

It does not propose a duplicate root table.

It does not propose a duplicate lineage table.

The extension maps 19 proposed rows into the existing live column vocabulary.

Operator confirmed D1–D10 in thread.

Confirmed standing:

Map what is known.
Hold what is unresolved.
Verify before recognition.
Do not duplicate authority.

## ALIGNED

This OAR2 routes execution of the existing-schema extension only.

Execution must extend the current live schema.

Execution must not recreate `codex_source_reference`.

Execution must not create duplicate lineage structure.

Execution must not promote unresolved rows to seeded or Codex-seated standing.

OAR2 remains the execution route.

OAR1 is required for completion.

## ROUTED

Claude-as-Cody-compatible executor is routed to execute the existing-schema extension.

Claude must:

1. Use this artifact only:

   `docs/oar/measures_interoperability/source_reference_existing_schema_extension_v1.sql`

2. Execute only the approved extension SQL.

3. Add `aliases jsonb` to `public.codex_source_reference` if absent.

4. Insert or upsert the 19 mapped source-reference rows using existing live schema columns.

5. Preserve confirmed operator decisions:

   - D1 `semantic_concordance` → `concordance`
   - D2 `oar_lifecycle` → `oar`
   - D3 `runtime_validation` → `system_intel`
   - D4 `source_set` → `foundational_source`
   - D5 `migration_architecture` → `migration_candidate`
   - D6–D8 remain `written` until `seed_oar_key` + `source_hash` are confirmed
   - D9–D10 remain `operator_required` with unresolved/null `source_path`

6. Return validation query output.

7. Write OAR1 beside this OAR2 after execution.

Claude must not:

1. Create a new `codex_source_reference` table.
2. Create a duplicate lineage table.
3. Modify runtime.
4. Modify CSS.
5. Execute deprecation.
6. Promote unresolved rows to seeded.
7. Declare Codex seating.
8. Open a new folder surface.
9. Claim completion without artifact and DB proof.

## REQUIRED EXECUTION VALIDATION

Return query evidence showing:

1. `aliases` column exists on `public.codex_source_reference`.
2. 19 intended `source_key` rows exist or were already present.
3. `source_21_of_coherence_v1` includes aliases:
   - `c3 7s`
   - `c3_7s`
   - `twenty_one_of_coherence`
4. `system_concordance` exists with `metadata.review_status = operator_required`.
5. `coherence_matrix_v1` exists with `metadata.review_status = operator_required`.
6. D6–D8 rows remain `source_status = written`.
7. No rows from this route are promoted to `seeded`.
8. No duplicate `source_key` values exist.
9. No DB/runtime/CSS/deprecation work occurred outside this route.

## ARTIFACT-PROOF BLOCK

Before writing OAR1, verify:

1. Execution artifact exists at:

   `docs/oar/measures_interoperability/source_reference_existing_schema_extension_v1.sql`

2. Execution artifact does not contain active `CREATE TABLE public.codex_source_reference`.

3. Execution artifact does not propose duplicate lineage structure.

4. Execution artifact uses live schema columns:

   - `source_key`
   - `source_title`
   - `source_type`
   - `authority_level`
   - `source_scope`
   - `version_label`
   - `source_status`
   - `readonly`
   - `source_path`
   - `aliases`
   - `metadata`
   - `created_by`

5. OAR1 may not claim completion unless DB validation confirms execution.

## EXPECTED FILES

- `docs/oar/measures_interoperability/oar2_source_reference_existing_schema_extension_execution_v1.meta.md`
- `docs/oar/measures_interoperability/oar1_source_reference_existing_schema_extension_execution_v1.meta.md`
- `docs/oar/measures_interoperability/source_reference_existing_schema_extension_v1.sql`

## EXPECTED OAR1

`docs/oar/measures_interoperability/oar1_source_reference_existing_schema_extension_execution_v1.meta.md`

## SUCCESS CONDITION

This OAR2 succeeds when the existing source-reference schema is extended without duplication, 19 mapped source-reference rows are inserted or confirmed, unresolved rows remain held/operator-required, and OAR1 proves execution with validation output.

## CLOSE

Extend existing authority.
Hold unresolved standing.
Verify before recognition.
Do not duplicate authority.

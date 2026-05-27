---
document_type: oar1
authority_level: working
document_scope: source_authority
title: OAR1 — Source Reference Extension UPSERT Correction v1
status: completed
version: v1
operator: op044
date: 2026-05-27
source_oar2: docs/oar/measures_interoperability/oar2_amendment_source_reference_extension_upsert_guard_correction_v1.meta.md
sql_execution_artifact: docs/oar/measures_interoperability/source_reference_existing_schema_extension_EXECUTABLE.sql
native_stack:
  codex: database
  field: schema
  measures: registry
  oar2: observed_aligned_routed
  chazz: systems
  cody: executor
  src: renderer
tags:
  - oar1
  - source-authority
  - upsert-guard-correction
  - seeded-skip
  - codex-source-reference
  - c3-7s
  - measures-interoperability
  - artifact-proof
  - execution-confirmed
source_alignment:
  - OAR2 Amendment — Source Reference Extension UPSERT Guard Correction v1
  - OAR2 Amendment — Source Reference Extension UPSERT Correction v1
  - OAR2 — Source Reference Existing Schema Extension Execution v1
  - OAR1 — Source Reference Existing Schema Extension v1
  - Seeded Reference Control
  - OAR Lifecycle — Execution and Handoff
  - Active Session Transfer Surface Rule
---

# OAR1 — Source Reference Extension UPSERT Correction v1

## Objective

Close execution of the corrected source-reference extension UPSERT against
the live `codex_source_reference` table.

Execution was operator-mediated. Validation evidence was returned by operator.
OAR1 is written against that evidence.

## Execution Standing

**Operator-mediated DB execution.**

SQL executed via Supabase SQL Editor by op044.

Execution surface: Supabase SQL Editor (not Claude-as-Cody, not psql).

Artifact executed (exact contents, no edits):

`docs/oar/measures_interoperability/source_reference_existing_schema_extension_EXECUTABLE.sql`

## 1 — Artifact-Proof Results

All checks performed against the execution artifact before OAR1 written.

| Check | Expected | Found | Result |
|---|---|---|---|
| `CREATE TABLE public.codex_source_reference` absent | absent | not found | PASS |
| `ON CONFLICT (source_key) DO UPDATE` present | present | line 302 | PASS |
| `WHERE public.codex_source_reference.source_status <> 'seeded'` present | present | line 324 | PASS |
| CASE statement for source_status absent | absent | not found | PASS |
| `source_path = coalesce(...)` present | present | lines 313–314 | PASS |
| `metadata = ... \|\| excluded.metadata` present | present | lines 321–322 | PASS |
| `aliases` conditional present | present | lines 315–320 | PASS |
| `source_21_of_coherence_v1` aliases in VALUES | `["c3 7s","c3_7s","twenty_one_of_coherence"]` | line 62 | PASS |
| `ALTER TABLE ... ADD COLUMN IF NOT EXISTS aliases` present | present | lines 19–20 | PASS |
| 19-row VALUES clause present | 19 rows | all 19 keys present | PASS |

## 2 — Validation Query Evidence

Returned by operator after execution. Unmodified.

| # | Query | Result | Evidence |
|---|---|---|---|
| 01 | `aliases` column exists | PASS | column present in information_schema |
| 02 | All 19 source keys present | PASS | count = 19 |
| 03 | `source_21_of_coherence_v1` has c3 7s aliases | PASS | `["c3 7s","c3_7s","twenty_one_of_coherence"]` |
| 04 | `seed_concordance` remains seeded | PASS | source_status = seeded |
| 05 | `system_concordance` remains seeded | PASS | source_status = seeded |
| 06 | D6–D8 remain written | PASS | oar_lifecycle_execution_and_handoff: written; phase_1_oar_operations_spine_v1: written; phase_1_operational_spine_validation_refinement_v1: written |
| 07 | No duplicate source_key | PASS | none returned |
| 08 | `coherence_matrix_v1` written / operator_required | PASS | source_status = written; review_status = operator_required |
| 09 | No new unresolved seeded rows | PASS | none returned |

## 3 — Seeded Append-Only Guard

The append-only trigger on `codex_source_reference` blocks any `UPDATE` to seeded rows
before conditional logic can evaluate.

Prior correction (CASE-based source_status preservation) failed because the trigger fires
at the UPDATE statement level, not at the CASE branch level.

Correction applied: `WHERE public.codex_source_reference.source_status <> 'seeded'`
predicate on the `ON CONFLICT ... DO UPDATE` clause.

When the predicate is false (existing row is seeded), PostgreSQL treats the conflict as a
no-op. The row is left untouched. The trigger is never invoked.

Validation evidence confirms:
- `seed_concordance` remains seeded (PASS — query 04)
- `system_concordance` remains seeded (PASS — query 05)

Seeded standing was preserved by absence of action.

## 4 — DB State After Execution

| State Item | Result |
|---|---|
| `aliases` column exists on `codex_source_reference` | confirmed |
| 19 source keys present in live table | confirmed |
| `seed_concordance` source_status | seeded (unchanged) |
| `system_concordance` source_status | seeded (unchanged) |
| `source_21_of_coherence_v1` aliases | `["c3 7s","c3_7s","twenty_one_of_coherence"]` |
| `oar_lifecycle_execution_and_handoff` source_status | written |
| `phase_1_oar_operations_spine_v1` source_status | written |
| `phase_1_operational_spine_validation_refinement_v1` source_status | written |
| `coherence_matrix_v1` source_status | written |
| `coherence_matrix_v1` review_status | operator_required |
| Duplicate source_key values | none |
| Rows promoted to seeded by this route | none |

## 5 — Boundary Confirmation

No Codex seating was declared.

No runtime code was modified.

No CSS was modified.

No deprecation was executed.

No SQL was executed beyond the corrected UPSERT route and its validation queries.

No files were moved or opened in a new folder surface.

Operator executed exact contents of the approved artifact. No edits during paste.

## 6 — Unresolved Items Carried Forward

The following items remain held and require future operator action before status advancement:

| source_key | Held Item | Condition for Advancement |
|---|---|---|
| `oar_lifecycle_execution_and_handoff` | seeded_intent | seed_oar_key + source_hash required |
| `phase_1_oar_operations_spine_v1` | seeded_intent | seed_oar_key + source_hash required |
| `phase_1_operational_spine_validation_refinement_v1` | seeded_intent | seed_oar_key + source_hash required |
| `system_concordance` | source_path | file path must be confirmed before status advancement |
| `coherence_matrix_v1` | source_path | file path must be confirmed before status advancement |

These rows are present in the live table with `source_status = written` and
`metadata.review_status = operator_required`. No further action is taken by this route.

## 7 — Execution Route Summary

| Route Step | Standing |
|---|---|
| OAR2 — Source Reference Existing Schema Extension Execution v1 | proposed |
| First execution attempt (plain INSERT) | failed — duplicate key |
| OAR2 Amendment — UPSERT Correction v1 | proposed |
| Second execution attempt (UPSERT with CASE) | failed — append-only trigger |
| OAR2 Amendment — UPSERT Guard Correction v1 | proposed |
| Third execution attempt (UPSERT with WHERE predicate) | **succeeded** |
| This OAR1 | **completed** |

## Close

Extension executed.

19 rows present. Seeded rows untouched. Aliases added. c3 7s aliases confirmed.

D6–D8 remain written pending seed evidence. D9–D10 source_path unresolved.

Codex holds. Measures registers. OAR2 routes. OAR1 proves.

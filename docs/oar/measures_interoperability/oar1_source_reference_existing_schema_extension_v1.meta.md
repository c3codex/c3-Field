---
document_type: oar1
authority_level: working
document_scope: source_authority
title: OAR1 — Source Reference Existing Schema Extension v1
status: completed
version: v1
operator: op044
date: 2026-05-26
source_oar2: docs/oar/measures_interoperability/oar2_source_reference_existing_schema_extension_v1.meta.md
sql_extension_artifact: docs/oar/measures_interoperability/source_reference_existing_schema_extension_v1.sql
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
  - existing-schema-extension
  - codex-source-reference
  - c3-7s
  - measures-interoperability
  - artifact-proof
source_alignment:
  - OAR1 — Source Reference Existing Schema Reconciliation v1
  - OAR1 — Source Reference Schema Migration Preflight v1
  - Active Session Transfer Surface Rule
  - OAR2 — Source Reference Existing Schema Extension v1
---

# OAR1 — Source Reference Existing Schema Extension v1

## Objective

Draft an existing-schema extension plan aligned to the live `codex_source_reference` table.

Map 19 proposed source rows to the live column vocabulary. Return operator decision table. Produce extension SQL artifact. Do not execute SQL or modify any database state.

## Artifact Produced

`docs/oar/measures_interoperability/source_reference_existing_schema_extension_v1.sql`

## 1 — Artifact-Proof Results

All checks performed against the actual extension SQL file before OAR1 written.

| Check | Expected | Found | Result |
|---|---|---|---|
| `CREATE TABLE public.codex_source_reference` absent | absent | not found | PASS |
| `standing` as active INSERT column | absent | comments only | PASS |
| `title` as active INSERT column | absent | comments only | PASS |
| `document_scope` as active INSERT column | absent | comments only | PASS |
| `file_path` as active INSERT column | absent | comments only | PASS |
| `aliases` added via ALTER TABLE only | yes | line 91 (commented draft) | PASS |
| `system_concordance` carries `review_status: operator_required` | yes | line 420 | PASS |
| `coherence_matrix_v1` carries `review_status: operator_required` | yes | line 433 | PASS |
| `source_21_of_coherence_v1` aliases: c3 7s, c3_7s, twenty_one_of_coherence | yes | line 172 | PASS |
| No duplicate lineage table proposed | absent | not found | PASS |

## 2 — Extension SQL Draft Summary

**File:** `source_reference_existing_schema_extension_v1.sql`

**Section 1 — ALTER TABLE:**
- `ALTER TABLE public.codex_source_reference ADD COLUMN IF NOT EXISTS aliases jsonb not null default '[]'::jsonb`
- Idempotent. Does not alter existing columns or constraints.
- Commented; requires execution OAR2.

**Section 2 — INSERT block:**
- 19 rows mapped to live column vocabulary.
- Columns used: `source_key`, `source_title`, `source_type`, `authority_level`, `source_scope`, `version_label`, `source_status`, `readonly`, `source_path`, `aliases`, `metadata`, `created_by`
- Commented; requires execution OAR2 and operator decisions first.

**Section 3 — Operator decision items:** 10 items documented inline.

**Section 4 — Post-insertion validation queries:** 7 queries for post-execution verification.

## 3 — Column Mapping Table

| Draft Column | Live Column | Notes |
|---|---|---|
| `source_key` | `source_key` | exact match |
| `title` | `source_title` | renamed |
| `source_type` | `source_type` | CHECK values differ — see Section 4 |
| `authority_level` | `authority_level` | CHECK values differ — see Section 4 |
| `document_scope` | `source_scope` | renamed |
| `standing` | `source_status` | vocabulary differs — see Section 5 |
| `file_path` | `source_path` | renamed |
| `aliases` | `aliases` | new column added by this extension |
| `notes` | `metadata` jsonb | notes stored as held_reason or type_mapping_note in metadata |
| `review_status` | `metadata ->> 'review_status'` | stored in metadata, not standalone column |
| `migration_group` | `metadata ->> 'migration_group'` | stored in metadata |
| `ambiguity_group` | `metadata ->> 'ambiguity_group'` | stored in metadata |
| `oar1_key` | `metadata ->> 'seed_oar_key'` | stored in metadata per live table convention |
| `seeded_standing` | `readonly` | live uses readonly=true for seeded rows |
| `codex_seating_standing` | `metadata` | no live analog; stored in metadata if needed |

## 4 — Source Type Mapping Table

| Draft `source_type` | Live `source_type` | Match Type | Operator Decision |
|---|---|---|---|
| `semantic_concordance` | `concordance` | closest — operator confirm | required |
| `oar_lifecycle` | `oar` | closest — operator confirm | required |
| `process_rule` | `process_rule` | exact | none |
| `role_contract` | `role_contract` | exact | none |
| `runtime_validation` | `system_intel` | closest — operator confirm | required |
| `source_set` | `foundational_source` | closest — operator confirm | required |
| `migration_architecture` | `migration_candidate` | closest — operator confirm | required |
| `verification_checklist` | `verification_checklist` | exact | none |

**Authority level note:** All 19 rows use `system` or `working`. These are exact matches in the live CHECK. Draft values `proposal`, `review`, `draft` do not appear in any of the 19 rows — no mapping required for this payload.

## 5 — Status Mapping Table

| Draft `standing` | Live `source_status` | Additional Mapping | Constraint Note |
|---|---|---|---|
| `candidate` | `drafted` | — | none |
| `written` | `written` | — | none |
| `committed` | `committed` | — | source_path and source_hash required |
| `seeded` | `written` (interim) | `metadata.seeded_intent = true` | live requires seed_oar_key + source_hash + readonly; values not confirmed — mapped to written pending operator |
| `codex_seated` | `seeded` | OAR evidence required | none in this payload |
| `held` | `written` | `metadata.review_status = operator_required` | none |
| `superseded` | `superseded` | — | none |

## 6 — 19-Row Source Mapping Summary

| # | source_key | Draft source_type | Live source_type | Draft standing | Live source_status | Operator Decision |
|---|---|---|---|---|---|---|
| 1 | seed_concordance | semantic_concordance | concordance | held | written | type mapping (D1) |
| 2 | source_21_of_coherence_v1 | semantic_concordance | concordance | held | written | type mapping (D1) |
| 3 | db_role_contract_supabase | role_contract | role_contract | written | written | none |
| 4 | oar_lifecycle_execution_and_handoff | oar_lifecycle | oar | seeded | written | type mapping (D2), seeded status (D6) |
| 5 | oar2_generation_and_handoff_process | process_rule | process_rule | written | written | none |
| 6 | media_authority_governance_process_seed | process_rule | process_rule | written | written | none |
| 7 | institutional_media_bucket_governance_process | process_rule | process_rule | written | written | none |
| 8 | conversion_engine_media_authority_seed | process_rule | process_rule | written | written | none |
| 9 | encounter_behavior_resolution_rule_v1 | runtime_validation | system_intel | written | written | type mapping (D3) |
| 10 | measures_seed_phase_map_registry_definition | source_set | foundational_source | written | written | type mapping (D4) |
| 11 | field_definition_phase_map_v2 | source_set | foundational_source | written | written | type mapping (D4) |
| 12 | registry_release_states_v1 | runtime_validation | system_intel | written | written | type mapping (D3) |
| 13 | renderer_contract_seed_v1 | runtime_validation | system_intel | superseded | superseded | type mapping (D3) |
| 14 | registered_process_log_runtime_v1 | runtime_validation | system_intel | written | written | type mapping (D3) |
| 15 | phase_1_oar_operations_spine_v1 | process_rule | process_rule | seeded | written | seeded status (D7) |
| 16 | phase_1_operational_spine_validation_refinement_v1 | verification_checklist | verification_checklist | seeded | written | seeded status (D8) |
| 17 | c3_oar_spine_persistence_registry_convergence_v1 | migration_architecture | migration_candidate | written | written | type mapping (D5) |
| 18 | system_concordance | semantic_concordance | concordance | held | written | type mapping (D1), source_path (D9) |
| 19 | coherence_matrix_v1 | semantic_concordance | concordance | held | written | type mapping (D1), source_path (D10) |

**Exact-match rows (no operator type decision required):** 3, 5, 6, 7, 8, 16 — 6 rows clean.

**Operator decision required (type mapping or seeded status):** 13 rows.

## 7 — Operator Decision Table

| # | Decision | Affects Rows | Proposed Value | Confirm / Override |
|---|---|---|---|---|
| D1 | `semantic_concordance` → `concordance` | 1, 2, 18, 19 | `concordance` | awaiting operator |
| D2 | `oar_lifecycle` → `oar` | 4 | `oar` | awaiting operator |
| D3 | `runtime_validation` → `system_intel` | 9, 12, 13, 14 | `system_intel` | awaiting operator |
| D4 | `source_set` → `foundational_source` | 10, 11 | `foundational_source` | awaiting operator |
| D5 | `migration_architecture` → `migration_candidate` | 17 | `migration_candidate` | awaiting operator |
| D6 | seeded status — `oar_lifecycle_execution_and_handoff` | 4 | written (interim); seeded requires seed_oar_key + source_hash | awaiting operator |
| D7 | seeded status — `phase_1_oar_operations_spine_v1` | 15 | written (interim); seeded requires seed_oar_key + source_hash | awaiting operator |
| D8 | seeded status — `phase_1_operational_spine_validation_refinement_v1` | 16 | written (interim); seeded requires seed_oar_key + source_hash | awaiting operator |
| D9 | `source_path` — `system_concordance` | 18 | null (unconfirmed); must resolve before status advancement | awaiting operator |
| D10 | `source_path` — `coherence_matrix_v1` | 19 | null (unconfirmed); must resolve before status advancement | awaiting operator |

## 8 — Duplicate Structure Confirmation

**No duplicate `codex_source_reference` root table proposed.**

The extension SQL contains no `CREATE TABLE public.codex_source_reference`. The existing live table is extended only via `ALTER TABLE ADD COLUMN IF NOT EXISTS`.

**No duplicate lineage table proposed.**

The draft's `codex_source_reference_lineage` table is not included. The existing live table uses `supersedes_source_id uuid` (self-referencing FK on `id`) for lineage. Lineage approach is preserved through the live table's existing mechanism. The `superseded_by` value for `renderer_contract_seed_v1` is stored in `metadata`.

## 9 — Migration Readiness Standing

**ready for operator review**

Extension SQL draft is complete and aligned to live schema.

Execution is blocked pending:
- Operator type-mapping decisions (D1–D5): 5 type mapping confirmations
- Operator seeded-status decisions (D6–D8): 3 source_hash + seed_oar_key confirmations
- Operator source_path decisions (D9–D10): 2 path confirmations

Once all 10 operator decisions are returned, a corrected INSERT block and execution OAR2 may be authorized.

## 10 — Validation

No SQL was executed.

No database was mutated.

No Codex seating was declared.

No runtime or CSS was modified.

No deprecation was executed.

No files were moved or opened in a new folder surface.

OAR1 was not written until artifact-proof checks confirmed all expected markers present and all forbidden markers absent.

## Close

Extension draft complete.

Existing schema authority preserved. No duplicate root table. No duplicate lineage system.

19 rows mapped. 6 rows clean. 13 rows require operator decisions before execution OAR2 can be authorized.

Codex holds. Measures registers. OAR2 routes. OAR1 proves.

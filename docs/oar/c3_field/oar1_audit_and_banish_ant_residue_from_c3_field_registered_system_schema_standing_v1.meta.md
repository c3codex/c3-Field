---
document_type: oar1
authority_level: working
document_scope: c3_field
title: OAR1 — Audit and Banish ANT Residue from c3 Field Registered-System Schema Standing
status: executed
version: v1
operator: op044
system: c3_field
source_oar2: docs/oar/c3_field/oar2_audit_and_banish_ant_residue_from_c3_field_registered_system_schema_standing_v1.meta.md
executor: claude
execution_date: 2026-06-09
branch: initiative/c3-field-convergence-infra
tags:
  - oar1
  - c3-field
  - ant-residue
  - deprecation-audit
  - registered-system
  - passage-law
  - canopy-law
  - non-ant-replacement
  - branch-guard
---

# OAR1 — Audit and Banish ANT Residue from c3 Field Registered-System Schema Standing v1

## OBJECTIVE

Audit all ANT residue across DB schema, runtime source, and OAR documentation. Classify each reference. Correct prior c3 Field audit standing where ANT was used as valid support. Produce non-ANT replacement requirement list. No schema or runtime mutations performed.

---

## PRE-EXECUTION: BRANCH VERIFICATION

| check | result |
|---|---|
| `git rev-parse --show-toplevel` | `C:/Users/c3DAO/OneDrive/Apps/c3Field` |
| `git branch --show-current` | `initiative/c3-field-convergence-infra` |
| branch match | YES |
| Measures Registry deployment branch used | NO |

---

## SECTION 1 — ANT DB OBJECT INVENTORY

### 1.1 Tables

| object_name | object_type | row_count | current_use | classification | action_required |
|---|---|---|---|---|---|
| `ant_passage_state` | TABLE | 0 | Referenced by `v_envelope_access_by_c3key_v1`; trigger `trg_ant_envelope_create_passage_state` writes on insert; `refresh_ant_passage_state()` updates | `still_active_blocker` | Drop after non-ANT passage law is seated and views/FK migrated |
| `ant_envelope` | TABLE | 0 | Referenced by 3 live views; FK from `measures_registry.envelope_id`; trigger `trg_ant_envelope_create_passage_state` on insert | `still_active_blocker` | Drop FK from `measures_registry`, drop views, then drop table |
| `ant_inbox` | TABLE | 0 | No live view or FK references found; trigger `trg_ant_inbox_updated_at` only | `deprecated_residue` | Drop after ANT banish OAR |
| `ant_attachment_map` | TABLE | 0 | Referenced by `v_envelope_access_by_c3key_v1`; trigger `trg_ant_attachment_map_updated_at` | `still_active_blocker` | Drop after view is replaced |
| `ant_signal_record` | TABLE | 0 | No live view or FK references found; trigger `trg_ant_signal_record_updated_at` only | `deprecated_residue` | Drop after ANT banish OAR |

All ANT tables have **0 rows**. Data-level safe. Schema-level still active.

### 1.2 Functions

| object_name | object_type | current_use | classification | action_required |
|---|---|---|---|---|
| `ensure_ant_passage_state()` | FUNCTION (trigger) | Active trigger on `ant_envelope`; inserts into `ant_passage_state` on new envelope | `still_active_blocker` | Drop after `ant_envelope` trigger is removed |
| `refresh_ant_passage_state(p_envkey text)` | FUNCTION | References `ant_oar_log` (already dropped), `ant_envelope`, `ant_attachment_map`, `ant_passage_state`. Will error on any call due to missing `ant_oar_log` reference | `still_active_blocker` | Drop immediately in banish OAR — broken function referencing dropped table |
| `prevent_ant_oar_log_mutation()` | FUNCTION (trigger) | `ant_oar_log` was removed per prior OAR (`oar1_ant_oar_dependency_removal_v1`); no trigger attaches this function now | `deprecated_residue` | Drop in banish OAR — orphaned, protects nothing |

**Critical:** `refresh_ant_passage_state()` is broken. It queries `ant_oar_log` which no longer exists. Any call to this function will fail with a relation-not-found error.

### 1.3 Triggers

| trigger_name | event_object_table | action | classification | action_required |
|---|---|---|---|---|
| `trg_ant_envelope_create_passage_state` | `ant_envelope` | Calls `ensure_ant_passage_state()` on INSERT | `still_active_blocker` | Drop with `ant_envelope` |
| `trg_ant_envelope_updated_at` | `ant_envelope` | Calls `set_updated_at()` | `deprecated_residue` | Drop with `ant_envelope` |
| `trg_ant_attachment_map_updated_at` | `ant_attachment_map` | Calls `set_updated_at()` | `deprecated_residue` | Drop with `ant_attachment_map` |
| `trg_ant_inbox_updated_at` | `ant_inbox` | Calls `set_updated_at()` | `deprecated_residue` | Drop with `ant_inbox` |
| `trg_ant_passage_state_updated_at` | `ant_passage_state` | Calls `set_updated_at()` | `deprecated_residue` | Drop with `ant_passage_state` |
| `trg_ant_signal_record_updated_at` | `ant_signal_record` | Calls `set_updated_at()` | `deprecated_residue` | Drop with `ant_signal_record` |

### 1.4 Views referencing ANT

| view_name | ant_tables_referenced | classification | action_required |
|---|---|---|---|
| `v_envelope_access_by_c3key_v1` | `ant_envelope`, `ant_attachment_map`, `ant_passage_state` | `still_active_blocker` | Drop or replace with non-ANT equivalent in banish OAR |
| `v_field_relation_graph_v1` | `ant_envelope` (subselect for `envelope` node label) | `still_active_blocker` | Rewrite node label subselect to non-ANT carrier table in banish OAR |
| `v_measures_registry_state_v1` | `ant_envelope` (via `mr.envelope_id` LEFT JOIN) | `still_active_blocker` | Rewrite to remove ANT JOIN; drop or nullify `envelope_id` column reference |

### 1.5 Foreign Key

| constraint_name | table | column | references | classification | action_required |
|---|---|---|---|---|---|
| `measures_registry_envelope_id_fkey` | `measures_registry` | `envelope_id` | `ant_envelope(id)` | `still_active_blocker` | Drop FK constraint; assess whether `envelope_id` column should be dropped or migrated to non-ANT carrier ref |

### 1.6 Composite Types (auto-generated from tables)

All 5 ANT tables generate composite types (`ant_envelope`, `ant_passage_state`, etc.) and array types (`_ant_envelope`, etc.). These will be removed automatically when their source tables are dropped.

### 1.7 Already-removed ANT objects (prior OARs)

| object_name | removal_oar | status |
|---|---|---|
| `ant_oar_log` | `oar1_ant_oar_dependency_removal_v1` | Confirmed removed |
| `v_ant_intake_queue_v1` | `oar1_ant_oar_dependency_removal_v1` | Confirmed removed |
| `v_ant_passage_readiness_v1` | `oar1_ant_oar_dependency_removal_v1` | Confirmed removed |
| `v_envelope_bundle_by_envkey_v1` | `oar1_ant_oar_dependency_removal_v1` | Confirmed removed |

---

## SECTION 2 — RUNTIME / SOURCE REFERENCE INVENTORY

### 2.1 Source code (`src/`)

Search scope: all files under `src/`. Pattern: `ant_`.

**Result: 0 matches.**

No ANT references in TypeScript, component, hook, service, or API route source code.

| reference | file | usage | runtime_path | classification | blocker |
|---|---|---|---|---|---|
| — | — | No matches | — | — | NO |

### 2.2 Migrations (`supabase/migrations/`)

Search scope: 4 current migrations on `initiative/c3-field-convergence-infra`. Pattern: `ant_`.

**Result: 0 matches.**

Current branch migrations do not create, reference, or modify ANT objects. ANT tables were created in earlier migrations not present in this branch's migration set (pre-existing on the Supabase project).

### 2.3 Generated types (`types/`)

Search scope: `types/` directory. Pattern: `ant_`.

**Result: 0 matches.**

No ANT references in generated TypeScript type files.

---

## SECTION 3 — DOCUMENTATION AND OAR REFERENCE INVENTORY

| doc_path | ANT reference | used_as_support | corrected_standing | action_required |
|---|---|---|---|---|
| `docs/oar/c3_field/oar1_audit_c3_field_schema_against_measures_registry_registered_system_requirements_v1.meta.md` | `ant_passage_state`, `ant_envelope`, `ant_inbox`, `ant_attachment_map`, `ant_signal_record` | YES — counted as "partial support" for passage, canopy, envelope/signal | `invalid_support_surface` | Corrected in Section 4 of this OAR1; original doc preserved as historical record |
| `docs/oar/ant_oar_log_removal/oar2_ant_oar_log_removal.meta.md` | `ant_oar_log` | NO — removal OAR | `historical_context_only` | No action |
| `docs/oar/ant_oar_log_removal/oar1_ant_oar_log_removal_v1.meta.md` | `ant_oar_log` | NO — removal attempt (blocked) | `historical_context_only` | No action |
| `docs/oar/ant_oar_dependency_removal/oar2_ant_oar_dependency_removal.meta.md` | `ant_oar_log`, `v_ant_intake_queue_v1`, `v_ant_passage_readiness_v1` | NO — removal OAR | `historical_context_only` | No action |
| `docs/oar/ant_oar_dependency_removal/oar1_ant_oar_dependency_removal_v1.meta.md` | `ant_oar_log`, `v_ant_intake_queue_v1`, `v_ant_passage_readiness_v1` | NO — removal OAR1 | `historical_context_only` | No action |
| `docs/oar/oar_log_incorporation/oar2_oar_log_incorporation.meta.md` | `ant_oar_log` | NO — rejected drift | `historical_context_only` | No action |
| `docs/oar/oar_log_incorporation/oar1_oar_log_incorporation_v1.meta.md` | `ant_oar_log` | NO — audit of rejected drift | `historical_context_only` | No action |
| `docs/oar/publication_dispatches/oar_process_log_table_creation/oar2_oar_process_log_table_creation.meta.md` | `ant_oar_log` | NO — rejected drift identification | `historical_context_only` | No action |

**One OAR requires standing correction:** `oar1_audit_c3_field_schema_against_measures_registry_registered_system_requirements_v1.meta.md` used ANT as partial support. Correction applied in Section 4 below. Original document is not mutated — correction is formal standing record in this OAR1.

---

## SECTION 4 — CORRECTED AUDIT STANDING

The following rows from the prior c3 Field schema audit are hereby corrected. ANT tables are not valid c3 Field support. "Partial support" via ANT is reclassified as unresolved / blocker.

### 4.1 Canopy / communications and encounters

| architecture requirement | prior audit standing | corrected standing | replacement needed |
|---|---|---|---|
| Canopy / communications and encounters | Partial — `ant_envelope`, `ant_inbox`, `ant_attachment_map`, `ant_signal_record` | **Unresolved — blocker** | Non-ANT c3 Field canopy law tables required |

**Correction note:** Prior audit treated ANT as a partial support layer. ANT is banished residue. No canopy law support exists until non-ANT c3 Field canopy tables are seated.

### 4.2 Passage law (cross-family)

| architecture requirement | prior audit standing | corrected standing | replacement needed |
|---|---|---|---|
| Passage law (cross-family) | Partial — `measures_transition_rule` + `ant_passage_state` | **Unresolved — blocker** | Non-ANT c3 Field passage law table required; `measures_transition_rule` is MR-scoped only |

**Correction note:** `measures_transition_rule` is scoped to Measures Registry and does not constitute c3 Field passage law. `ant_passage_state` is banished. No cross-family passage law exists at c3 Field level until replacement is seated.

### 4.3 Measures of Inanna as immutable passage pattern

| architecture requirement | prior audit standing | corrected standing | replacement needed |
|---|---|---|---|
| Measures of Inanna as immutable passage pattern | Partial — passage behavior in `ant_passage_state`, Inanna narrative in `measures_registry` | **Unresolved — blocker** | Inanna passage standing must not depend on `ant_passage_state`; requires non-ANT Inanna spine or passage table |

**Correction note:** `ant_passage_state` is banished. Inanna passage pattern must be seated through non-ANT c3 Field law once Measures of Inanna is registered as a spine.

### 4.4 Envelope / signal support

| architecture requirement | prior audit standing | corrected standing | replacement needed |
|---|---|---|---|
| Envelope / signal support | Partial — `ant_envelope`, `ant_inbox`, `ant_attachment_map`, `ant_signal_record` | **Unresolved — blocker** | Non-ANT carrying structure, inbox, signal movement, and attachment law required |

**Correction note:** All four ANT surfaces are banished. No c3 Field envelope/signal support exists until replacement tables are seated.

### 4.5 Summary: corrected passage/canopy/envelope standing

| architecture layer | prior standing | corrected standing | blocker |
|---|---|---|---|
| Canopy / communications and encounters | partial | **unresolved** | YES |
| Cross-family passage law | partial | **unresolved** | YES |
| Inanna immutable passage pattern | partial | **unresolved** | YES |
| Envelope / carrying structure | partial | **unresolved** | YES |
| Inbox / signal receipt | partial | **unresolved** | YES |
| Signal movement law | partial | **unresolved** | YES |

---

## SECTION 5 — NON-ANT REPLACEMENT REQUIREMENTS

| replaced ANT function | required c3 Field replacement | priority | future OAR |
|---|---|---|---|
| `ant_envelope` — envelope / carrying structure | c3 Field carrier/envelope table; `measures_registry.envelope_id` FK must be migrated or dropped | P1 | OAR2 — Banish ANT Runtime/Schema Residue v1 |
| `ant_passage_state` — passage state tracking | c3 Field passage state table; non-ANT passage trigger | P1 | OAR2 — Seat Non-ANT c3 Field Passage and Canopy Law Schema v1 |
| `ant_inbox` — inbox / signal receipt | c3 Field inbox or signal receipt table | P2 | OAR2 — Seat Non-ANT c3 Field Passage and Canopy Law Schema v1 |
| `ant_attachment_map` — attachment tracking | c3 Field attachment law table | P2 | OAR2 — Seat Non-ANT c3 Field Passage and Canopy Law Schema v1 |
| `ant_signal_record` — signal movement log | c3 Field signal record table | P2 | OAR2 — Seat Non-ANT c3 Field Passage and Canopy Law Schema v1 |
| `ensure_ant_passage_state()` trigger function | Non-ANT passage state initialization trigger | P1 | OAR2 — Seat Non-ANT c3 Field Passage and Canopy Law Schema v1 |
| `refresh_ant_passage_state()` function | Non-ANT passage state refresh function (note: broken — references dropped `ant_oar_log`) | P1 | OAR2 — Banish ANT Runtime/Schema Residue v1 |
| `prevent_ant_oar_log_mutation()` function | No replacement needed — `ant_oar_log` is removed | P1 | OAR2 — Banish ANT Runtime/Schema Residue v1 (drop only) |
| `v_envelope_access_by_c3key_v1` | Non-ANT view over c3 Field carrier/passage tables | P1 | OAR2 — Banish ANT Runtime/Schema Residue v1 |
| `v_field_relation_graph_v1` (ant_envelope node label) | Replace `ant_envelope` subselect with non-ANT carrier table | P2 | OAR2 — Banish ANT Runtime/Schema Residue v1 |
| `v_measures_registry_state_v1` (ant_envelope JOIN) | Drop or replace `envelope_id` LEFT JOIN with non-ANT reference | P1 | OAR2 — Banish ANT Runtime/Schema Residue v1 |
| `measures_registry.envelope_id` → `ant_envelope(id)` FK | Drop FK constraint; assess column retention vs. migration | P1 | OAR2 — Banish ANT Runtime/Schema Residue v1 |

---

## SECTION 6 — REGISTERED-SYSTEM SCHEMA VALIDATION

Confirming no change to registered-system schema.

**Validation query output:**

| system_key | system_name | standing | implementation_pattern | system_scope | runtime_admission_state |
|---|---|---|---|---|---|
| `measures_registry` | Measures Registry | registered | native | measures_registry | not_seated |

- `c3_registered_system` table: **intact** ✓
- `v_c3_registered_system_v1` view: **intact** ✓
- Measures Registry row: **intact** — `standing = registered`, `runtime_admission_state = not_seated` ✓
- c3 Field anchor row in `field_origin`: **intact** ✓

---

## SECTION 7 — BLOCKERS SUMMARY

### Still-active blockers (schema-level)

| blocker | object | reason |
|---|---|---|
| B1 | `ant_envelope` table | FK from `measures_registry.envelope_id`; referenced by 3 live views |
| B2 | `ant_passage_state` table | Referenced by `v_envelope_access_by_c3key_v1`; trigger auto-writes on ant_envelope insert |
| B3 | `ant_attachment_map` table | Referenced by `v_envelope_access_by_c3key_v1` |
| B4 | `v_envelope_access_by_c3key_v1` | Live view over banished ANT tables; must be replaced before tables can be dropped |
| B5 | `v_field_relation_graph_v1` | References `ant_envelope` for node labels; must be rewritten |
| B6 | `v_measures_registry_state_v1` | JOINs `ant_envelope` via `measures_registry.envelope_id`; must be rewritten |
| B7 | `measures_registry_envelope_id_fkey` | FK blocks dropping `ant_envelope`; must be dropped first |
| B8 | `refresh_ant_passage_state()` | Broken function — references removed `ant_oar_log`; will error on any call |

### Deprecated residue (no active blockers — safe to drop in banish OAR)

| object | reason |
|---|---|
| `ant_inbox` table | No live view or FK references; 0 rows |
| `ant_signal_record` table | No live view or FK references; 0 rows |
| `prevent_ant_oar_log_mutation()` function | Orphaned — `ant_oar_log` was already removed |
| All 6 `trg_ant_*` triggers | Will be auto-removed with their tables |

---

## SECTION 8 — NEXT OAR SEQUENCE

| step | OAR | scope | branch |
|---|---|---|---|
| 1 | OAR2 — Banish ANT Runtime/Schema Residue v1 | Drop FK `measures_registry_envelope_id_fkey`; replace `v_measures_registry_state_v1`, `v_envelope_access_by_c3key_v1`, `v_field_relation_graph_v1`; drop `prevent_ant_oar_log_mutation()`, `refresh_ant_passage_state()` (broken); drop `ant_inbox`, `ant_signal_record` | `initiative/c3-field-convergence-infra` |
| 2 | OAR2 — Seat Non-ANT c3 Field Passage and Canopy Law Schema v1 | Create c3 Field passage state table, canopy law table, carrying structure, inbox, signal movement, attachment law; seat non-ANT triggers and refresh functions | `initiative/c3-field-convergence-infra` |
| 3 | OAR2 — Seat Measures of Inanna Registered Spine Standing v1 | Register Measures of Inanna in `c3_registered_system`; seat Inanna passage pattern through non-ANT law | `initiative/c3-field-convergence-infra` |
| 4 | OAR2 — Seat c3 Field Runtime Admission View v1 | Create `c3_runtime_admission_contract` table and `v_c3_field_runtime_admission_v1` view; bind MR threshold encounters to admission validation | `initiative/c3-field-convergence-infra` |
| 5 | OAR2 — Seat c3 Field Optics / Evidence / Trace / Correction Contracts v1 | Create `c3_optics_contract`, `c3_evidence_contract`, `c3_ai_action_boundary` tables; elevate TypeScript optics to DB contract law | `initiative/c3-field-convergence-infra` |
| 6 | OAR2 — Bind Measures Registry to c3 Field Runtime Admission v1 | Bind MR threshold encounters to admission validation once runtime admission view is seated | `initiative/c3-field-convergence-infra` |

**Rationale for sequence revision:** The banish OAR (step 1) is split from the passage law seating OAR (step 2). Dropping the FK and replacing the ANT-dependent views is a prerequisite for dropping `ant_envelope` and `ant_passage_state`. Passage law seating must follow banishment so no replacement tables are created atop still-active ANT residue.

---

## RESULT

### Validation

1. **c3 Field branch verified**: YES — `initiative/c3-field-convergence-infra`
2. **ANT DB/schema objects inventoried**: YES — 5 tables, 3 functions, 6 triggers, 5 composite types, 3 views with ANT references, 1 FK
3. **ANT runtime/source references inventoried**: YES — 0 matches in `src/`, 0 in migrations, 0 in generated types
4. **ANT doc/OAR references inventoried**: YES — 8 docs; 1 requires standing correction
5. **Each ANT reference classified**: YES — see Section 1
6. **Any still-active ANT dependency identified as blocker**: YES — 8 blockers in Section 7
7. **Prior c3 Field audit support claims corrected**: YES — Section 4
8. **Passage support no longer relies on ANT**: YES — corrected to unresolved/blocker
9. **Canopy support no longer relies on ANT**: YES — corrected to unresolved/blocker
10. **Envelope/signal support no longer relies on ANT**: YES — corrected to unresolved/blocker
11. **Non-ANT replacement requirements returned**: YES — Section 5
12. **Registered-system schema validated intact**: YES — `measures_registry` row confirmed
13. **Measures Registry registered-system row preserved**: YES — `standing = registered`, `runtime_admission_state = not_seated`
14. **No runtime mutation performed**: YES
15. **No Measures Registry mutation performed**: YES
16. **No schema replacement mutation performed**: YES
17. **No pricing/Stripe/SEAT/c3 Key/wallet/external integration mutation performed**: YES
18. **Correct next OAR sequence returned**: YES — Section 8
19. **OAR1 written**: this document

---

## DB OBJECTS FOUND (NO MUTATION PERFORMED)

| object | type | classification | action_required |
|---|---|---|---|
| `ant_passage_state` | TABLE | `still_active_blocker` | Drop after replacement seated |
| `ant_envelope` | TABLE | `still_active_blocker` | Drop FK first, replace views, then drop |
| `ant_inbox` | TABLE | `deprecated_residue` | Drop in banish OAR |
| `ant_attachment_map` | TABLE | `still_active_blocker` | Drop after `v_envelope_access_by_c3key_v1` replaced |
| `ant_signal_record` | TABLE | `deprecated_residue` | Drop in banish OAR |
| `ensure_ant_passage_state()` | FUNCTION | `still_active_blocker` | Drop with `ant_envelope` trigger |
| `refresh_ant_passage_state()` | FUNCTION | `still_active_blocker` (broken) | Drop in banish OAR — references removed table |
| `prevent_ant_oar_log_mutation()` | FUNCTION | `deprecated_residue` | Drop in banish OAR |
| `trg_ant_envelope_create_passage_state` | TRIGGER | `still_active_blocker` | Drop with `ant_envelope` |
| `trg_ant_envelope_updated_at` | TRIGGER | `deprecated_residue` | Drop with `ant_envelope` |
| `trg_ant_attachment_map_updated_at` | TRIGGER | `deprecated_residue` | Drop with `ant_attachment_map` |
| `trg_ant_inbox_updated_at` | TRIGGER | `deprecated_residue` | Drop with `ant_inbox` |
| `trg_ant_passage_state_updated_at` | TRIGGER | `deprecated_residue` | Drop with `ant_passage_state` |
| `trg_ant_signal_record_updated_at` | TRIGGER | `deprecated_residue` | Drop with `ant_signal_record` |
| `v_envelope_access_by_c3key_v1` | VIEW | `still_active_blocker` | Replace with non-ANT view in banish OAR |
| `v_field_relation_graph_v1` | VIEW | `still_active_blocker` | Rewrite `ant_envelope` node subselect |
| `v_measures_registry_state_v1` | VIEW | `still_active_blocker` | Rewrite to remove `ant_envelope` JOIN |
| `measures_registry_envelope_id_fkey` | FK CONSTRAINT | `still_active_blocker` | Drop in banish OAR |

No source code was changed. No DB mutation was performed. No build required.

---

## CLOSES

OAR2: docs/oar/c3_field/oar2_audit_and_banish_ant_residue_from_c3_field_registered_system_schema_standing_v1.meta.md

## NEXT

1. **OAR2 — Banish ANT Runtime/Schema Residue v1** — Drop FK `measures_registry_envelope_id_fkey`; replace `v_measures_registry_state_v1`, `v_envelope_access_by_c3key_v1`, `v_field_relation_graph_v1`; drop `refresh_ant_passage_state()` (broken), `prevent_ant_oar_log_mutation()`; drop `ant_inbox`, `ant_signal_record`. Scope does not yet drop `ant_envelope`, `ant_passage_state`, `ant_attachment_map` — those require non-ANT passage law to be seated first. Branch: `initiative/c3-field-convergence-infra`.

2. **OAR2 — Seat Non-ANT c3 Field Passage and Canopy Law Schema v1** — Create c3 Field passage state, canopy, carrier, inbox, signal, and attachment law tables; seat non-ANT triggers and refresh functions; then drop remaining ANT tables. Branch: `initiative/c3-field-convergence-infra`.

3. **OAR2 — Seat Measures of Inanna Registered Spine Standing v1** — Register Measures of Inanna in `c3_registered_system`; seat Inanna passage pattern through non-ANT law. Branch: `initiative/c3-field-convergence-infra`.

4. **OAR2 — Seat c3 Field Runtime Admission View v1** — Create `c3_runtime_admission_contract` and `v_c3_field_runtime_admission_v1`. Branch: `initiative/c3-field-convergence-infra`.

5. **OAR2 — Seat c3 Field Optics / Evidence / Trace / Correction Contracts v1** — Create `c3_optics_contract`, `c3_evidence_contract`, `c3_ai_action_boundary`. Branch: `initiative/c3-field-convergence-infra`.

6. **OAR2 — Bind Measures Registry to c3 Field Runtime Admission v1** — Bind MR threshold encounters to admission validation. Branch: `initiative/c3-field-convergence-infra`.

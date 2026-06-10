---
document_type: oar1
authority_level: working
document_scope: c3_field
title: OAR1 — Banish ANT Runtime/Schema Residue
status: executed
version: v1
operator: op044
system: c3_field
source_oar2: docs/oar/c3_field/oar2_banish_ant_runtime_schema_residue_v1.meta.md
executor: claude
execution_date: 2026-06-09
branch: initiative/c3-field-convergence-infra
tags:
  - oar1
  - c3-field
  - ant-residue
  - banish
  - schema-cleanup
  - passage-law
  - canopy-law
  - registered-system
  - branch-guard
---

# OAR1 — Banish ANT Runtime/Schema Residue v1

## OBJECTIVE

Execute first safe banishment pass of ANT schema residue: drop FK from `measures_registry` to `ant_envelope`, rewrite two ANT-dependent views, drop ANT-only view, drop two broken/orphaned functions, drop two deprecated tables with no live dependencies. Preserve remaining ANT blocker tables as legacy-held pending non-ANT passage/canopy law.

---

## PRE-EXECUTION: BRANCH VERIFICATION

| check | result |
|---|---|
| `git branch --show-current` | `initiative/c3-field-convergence-infra` |
| branch match | YES |
| Measures Registry deployment branch used | NO |

---

## PRE-EXECUTION: INVENTORY RECONFIRMATION

Row counts confirmed 0 for all ANT tables before mutation:

| table | row_count |
|---|---|
| `ant_envelope` | 0 |
| `ant_passage_state` | 0 |
| `ant_attachment_map` | 0 |
| `ant_inbox` | 0 |
| `ant_signal_record` | 0 |

`ANT_DATA_PRESENT_BLOCKER`: NOT triggered.

Objects confirmed present before mutation:

| object | exists_before |
|---|---|
| `measures_registry_envelope_id_fkey` | YES |
| `v_envelope_access_by_c3key_v1` | YES |
| `v_measures_registry_state_v1` | YES |
| `v_field_relation_graph_v1` | YES |
| `refresh_ant_passage_state(text)` | YES (broken — references dropped `ant_oar_log`) |
| `prevent_ant_oar_log_mutation()` | YES (orphaned) |
| `ant_inbox` | YES (0 rows) |
| `ant_signal_record` | YES (0 rows; FK on `ant_inbox`) |

---

## ACTION

**Migration name:** `banish_ant_runtime_schema_residue_v1`

**Migration file:** `supabase/migrations/202606090001_banish_ant_runtime_schema_residue_v1.sql`

### Fix 1 — Drop `v_envelope_access_by_c3key_v1`

Fully ANT-derived. No non-ANT replacement in this OAR. Dropped.

```sql
DROP VIEW IF EXISTS public.v_envelope_access_by_c3key_v1;
```

**Result:** View dropped.

---

### Fix 2 — Drop `measures_registry_envelope_id_fkey`

FK from `measures_registry.envelope_id` to `ant_envelope(id)` dropped. Column `measures_registry.envelope_id` retained as legacy nullable field. No runtime behavior changed.

```sql
ALTER TABLE public.measures_registry
  DROP CONSTRAINT IF EXISTS measures_registry_envelope_id_fkey;
```

**Result:** Constraint dropped.

---

### Fix 3 — Rewrite `v_measures_registry_state_v1`

Removed `LEFT JOIN ant_envelope ae ON ae.id = mr.envelope_id`. View shape preserved: `envkey` and `envelope_state` columns retained as `NULL::text` to avoid breaking consumers.

```sql
CREATE OR REPLACE VIEW public.v_measures_registry_state_v1 AS
SELECT
  mr.id AS registry_id,
  mr.registry_key,
  mr.display_title,
  mr.registry_family,
  mr.encounter_type,
  mr.material_family,
  mr.sequence_order,
  mr.release_state AS registry_release_state,
  mr.access_state AS registry_access_state,
  mr.phase_label AS registry_phase_label,
  mr.parent_registry_id,
  parent.registry_key AS parent_registry_key,
  mr.depends_on_registry_id,
  dep.registry_key AS depends_on_registry_key,
  mr.envelope_id,
  NULL::text AS envkey,
  NULL::text AS envelope_state,
  mrs.release_state AS effective_release_state,
  mrs.access_state AS effective_access_state,
  mrs.release_reason,
  mrs.access_reason,
  mrs.release_at,
  mrs.sealed_at,
  med.id AS encounter_id,
  med.encounter_key,
  med.encounter_type AS encounter_def_type,
  med.surface_type,
  med.pause_allowed,
  med.is_entry_surface,
  mr.is_active
FROM ((((public.measures_registry mr
  LEFT JOIN public.measures_registry parent ON parent.id = mr.parent_registry_id)
  LEFT JOIN public.measures_registry dep ON dep.id = mr.depends_on_registry_id)
  LEFT JOIN public.measures_release_state mrs ON mrs.registry_id = mr.id)
  LEFT JOIN public.measures_encounter_def med ON med.registry_id = mr.id)
WHERE mr.is_active = true
ORDER BY mr.registry_family, mr.sequence_order, mr.display_title;
```

**Result:** View rewritten. No `ant_` reference.

---

### Fix 4 — Rewrite `v_field_relation_graph_v1`

Replaced `ant_envelope` subselects for `envelope` node labels with `NULL`. All non-ANT node types (`origin`, `registry`) preserved unchanged.

```sql
CREATE OR REPLACE VIEW public.v_field_relation_graph_v1 AS
SELECT
  fre.id AS relation_id,
  fre.from_node_type, fre.from_node_id,
  fre.relation_type,
  fre.to_node_type, fre.to_node_id,
  fre.relation_state, fre.sort_order, fre.created_at,
  CASE
    WHEN fre.from_node_type = 'origin'   THEN (SELECT fo.origin_ref   FROM public.field_origin fo      WHERE fo.id = fre.from_node_id)
    WHEN fre.from_node_type = 'envelope' THEN NULL
    WHEN fre.from_node_type = 'registry' THEN (SELECT mr.registry_key FROM public.measures_registry mr WHERE mr.id = fre.from_node_id)
    ELSE NULL
  END AS from_node_label,
  CASE
    WHEN fre.to_node_type = 'origin'     THEN (SELECT fo.origin_ref   FROM public.field_origin fo      WHERE fo.id = fre.to_node_id)
    WHEN fre.to_node_type = 'envelope'   THEN NULL
    WHEN fre.to_node_type = 'registry'   THEN (SELECT mr.registry_key FROM public.measures_registry mr WHERE mr.id = fre.to_node_id)
    ELSE NULL
  END AS to_node_label
FROM public.field_relation_edge fre
ORDER BY fre.created_at DESC, fre.sort_order;
```

**Result:** View rewritten. No `ant_` reference.

---

### Fix 5 — Drop `refresh_ant_passage_state(text)`

Function was broken — referenced `ant_oar_log` which was removed in `oar1_ant_oar_dependency_removal_v1`. Any call would fail with relation-not-found. Dropped.

```sql
DROP FUNCTION IF EXISTS public.refresh_ant_passage_state(text);
```

**Result:** Function dropped.

---

### Fix 6 — Drop `prevent_ant_oar_log_mutation()`

Orphaned trigger function — `ant_oar_log` was removed; no trigger attached this function. Dropped.

```sql
DROP FUNCTION IF EXISTS public.prevent_ant_oar_log_mutation();
```

**Result:** Function dropped.

---

### Fix 7 — Drop `ant_signal_record` and `ant_inbox`

Both tables confirmed 0 rows. No view or FK dependencies to external tables.

**Blocker discovered:** `ant_signal_record` has FK `ant_signal_record_inbox_id_fkey` on `ant_inbox`. Dropped `ant_signal_record` first.

```sql
DROP TABLE IF EXISTS public.ant_signal_record;
DROP TABLE IF EXISTS public.ant_inbox;
```

**Result:** Both tables dropped. `trg_ant_inbox_updated_at` and `trg_ant_signal_record_updated_at` dropped automatically with their tables.

---

## VALIDATION QUERY OUTPUT

### FK dropped

```sql
SELECT conname FROM pg_constraint WHERE conname = 'measures_registry_envelope_id_fkey';
```
**Result:** 0 rows ✓

### `v_envelope_access_by_c3key_v1` dropped

```sql
SELECT viewname FROM pg_views WHERE schemaname = 'public' AND viewname = 'v_envelope_access_by_c3key_v1';
```
**Result:** 0 rows ✓

### Views contain no `ant_` references

```sql
SELECT viewname FROM pg_views
WHERE schemaname = 'public'
  AND viewname IN ('v_measures_registry_state_v1', 'v_field_relation_graph_v1')
  AND definition ILIKE '%ant_%';
```
**Result:** 0 rows ✓

### Functions dropped

```sql
SELECT proname FROM pg_proc WHERE proname IN ('refresh_ant_passage_state', 'prevent_ant_oar_log_mutation');
```
**Result:** 0 rows ✓

### `ant_inbox` and `ant_signal_record` dropped

```sql
SELECT table_name FROM information_schema.tables
WHERE table_schema = 'public' AND table_name IN ('ant_inbox', 'ant_signal_record');
```
**Result:** 0 rows ✓

### Registered-system schema intact

| system_key | system_name | standing | implementation_pattern | system_scope | runtime_admission_state |
|---|---|---|---|---|---|
| `measures_registry` | Measures Registry | registered | native | measures_registry | not_seated |

✓

---

## REMAINING ANT LEGACY-HELD OBJECTS

| remaining_ant_object | row_count | dependency_count | standing | next_action |
|---|---|---|---|---|
| `ant_envelope` | 0 | 0 live view/FK deps (all cleared this OAR) | legacy_held | Drop after non-ANT carrier/passage law seated in next OAR |
| `ant_passage_state` | 0 | 0 live view/FK deps (cleared this OAR) | legacy_held | Drop after non-ANT passage state law seated |
| `ant_attachment_map` | 0 | 0 live view/FK deps (cleared this OAR) | legacy_held | Drop after non-ANT attachment law seated |
| `trg_ant_envelope_create_passage_state` | — | on `ant_envelope` | legacy_held | Drops with `ant_envelope` |
| `trg_ant_envelope_updated_at` | — | on `ant_envelope` | legacy_held | Drops with `ant_envelope` |
| `trg_ant_passage_state_updated_at` | — | on `ant_passage_state` | legacy_held | Drops with `ant_passage_state` |
| `trg_ant_attachment_map_updated_at` | — | on `ant_attachment_map` | legacy_held | Drops with `ant_attachment_map` |
| `ensure_ant_passage_state()` | — | trigger function for `trg_ant_envelope_create_passage_state` | legacy_held | Drop after `ant_envelope` trigger removed |

**Note:** All three remaining ANT tables have 0 rows and 0 external dependencies as of this OAR. They are schema-legal to drop now, but are held pending non-ANT passage/canopy law seating per OAR2 scope boundary. A future OAR that seats non-ANT passage law may drop them in the same migration.

---

## DB OBJECTS REMOVED

| object | type | result |
|---|---|---|
| `v_envelope_access_by_c3key_v1` | VIEW | dropped |
| `measures_registry_envelope_id_fkey` | FK CONSTRAINT | dropped |
| `v_measures_registry_state_v1` | VIEW | rewritten (no ANT reference) |
| `v_field_relation_graph_v1` | VIEW | rewritten (no ANT reference) |
| `refresh_ant_passage_state(text)` | FUNCTION | dropped |
| `prevent_ant_oar_log_mutation()` | FUNCTION | dropped |
| `ant_signal_record` | TABLE | dropped |
| `ant_inbox` | TABLE | dropped |
| `trg_ant_signal_record_updated_at` | TRIGGER | dropped (auto with table) |
| `trg_ant_inbox_updated_at` | TRIGGER | dropped (auto with table) |

Migration name: `banish_ant_runtime_schema_residue_v1`

No source code was changed. No non-ANT schema was created.

---

## RESULT

### Validation

1. **c3 Field branch verified**: YES — `initiative/c3-field-convergence-infra`
2. **ANT inventory reconfirmed before mutation**: YES — all 5 tables 0 rows
3. **ANT table row counts confirmed 0 before table drops**: YES
4. **`measures_registry_envelope_id_fkey` dropped**: YES — 0 rows in validation
5. **`v_measures_registry_state_v1` no longer references ANT**: YES — 0 rows in validation
6. **`v_field_relation_graph_v1` no longer references ANT**: YES — 0 rows in validation
7. **`v_envelope_access_by_c3key_v1` dropped**: YES — 0 rows in validation
8. **`refresh_ant_passage_state(text)` dropped**: YES — 0 rows in validation
9. **`prevent_ant_oar_log_mutation()` dropped**: YES — 0 rows in validation
10. **`ant_inbox` dropped**: YES — 0 rows in validation
11. **`ant_signal_record` dropped**: YES — 0 rows in validation
12. **Remaining ANT objects inventoried and classified**: YES — Section: Remaining ANT Legacy-Held Objects
13. **Registered-system schema validated intact**: YES
14. **Measures Registry registered-system row preserved**: YES — `standing = registered`, `runtime_admission_state = not_seated`
15. **No runtime mutation performed**: YES
16. **No Measures Registry runtime mutation performed**: YES
17. **No replacement schema created**: YES
18. **No runtime admission seated**: YES
19. **No Inanna registered spine standing seated**: YES
20. **No pricing/Stripe/SEAT/c3 Key/wallet/external integration mutation performed**: YES
21. **OAR1 written**: this document

---

## GAPS REPORTED

**Gap 1 — `ant_signal_record` has FK on `ant_inbox`**

Not captured in the prior audit dependency check. `ant_signal_record_inbox_id_fkey` required dropping `ant_signal_record` before `ant_inbox`. Resolved by reordering drop statements. No data risk (both 0 rows).

**Gap 2 — `ensure_ant_passage_state()` not yet dropped**

Per OAR2 instruction: "Do not drop `ensure_ant_passage_state()` unless its trigger dependency is removed and executor proves no remaining dependency." `trg_ant_envelope_create_passage_state` still exists on `ant_envelope`. Function is legacy-held; drops with `ant_envelope` in a future OAR.

---

## CLOSES

OAR2: docs/oar/c3_field/oar2_banish_ant_runtime_schema_residue_v1.meta.md

## NEXT

1. **OAR2 — Seat Non-ANT c3 Field Passage and Canopy Law Schema v1** — Create c3 Field passage state, canopy, carrier, inbox, signal, and attachment law tables; seat non-ANT triggers and refresh functions; then drop remaining legacy-held ANT tables (`ant_envelope`, `ant_passage_state`, `ant_attachment_map`) and `ensure_ant_passage_state()` function. Branch: `initiative/c3-field-convergence-infra`.

2. **OAR2 — Seat Measures of Inanna Registered Spine Standing v1** — Register Measures of Inanna in `c3_registered_system`; seat Inanna passage pattern through non-ANT law. Branch: `initiative/c3-field-convergence-infra`.

3. **OAR2 — Seat c3 Field Runtime Admission View v1** — Create `c3_runtime_admission_contract` and `v_c3_field_runtime_admission_v1`. Branch: `initiative/c3-field-convergence-infra`.

4. **OAR2 — Seat c3 Field Optics / Evidence / Trace / Correction Contracts v1** — Create `c3_optics_contract`, `c3_evidence_contract`, `c3_ai_action_boundary`. Branch: `initiative/c3-field-convergence-infra`.

5. **OAR2 — Bind Measures Registry to c3 Field Runtime Admission v1** — Bind MR threshold encounters to admission validation. Branch: `initiative/c3-field-convergence-infra`.

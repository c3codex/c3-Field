---
document_type: oar1
authority_level: working
document_scope: c3_field
title: OAR1 — Extend field_origin_origin_type_check to Include c3_field
status: executed
version: v1
operator: op044
system: c3_field
source_oar2: docs/oar/c3_field/oar2_extend_field_origin_origin_type_check_to_include_c3_field_v1.meta.md
executor: claude
execution_date: 2026-06-10
branch: initiative/c3-field-convergence-infra
tags:
  - oar1
  - c3-field
  - field-origin
  - origin-type
  - schema-correction
  - registered-system
  - runtime-admission
  - branch-guard
---

# OAR1 — Extend field_origin_origin_type_check to Include c3_field v1

## OBJECTIVE

Extend `field_origin_origin_type_check` to allow `c3_field` as a valid origin type, preserving all existing allowed values. Update the c3 Field anchor row from the temporary `origin_type = system` workaround to the corrected `origin_type = c3_field`. Merge correction metadata. No runtime mutation. No standing changes.

---

## PRE-EXECUTION: BRANCH VERIFICATION

| check | result |
|---|---|
| `git branch --show-current` | `initiative/c3-field-convergence-infra` |
| branch match | YES |
| Measures Registry deployment branch used | NO |

---

## PRE-EXECUTION: INSPECTION

### Constraint before mutation

```
field_origin_origin_type_check:
CHECK ((origin_type = ANY (ARRAY[
  'named_individual'::text,
  'institution_in_service'::text,
  'operator'::text,
  'system'::text
])))
```

`c3_field` NOT present. Constraint requires extension.

### c3 Field anchor row before mutation

| column | value |
|---|---|
| `id` | `f4a08bf6-fd85-46f6-a0ab-a8a22d8b1a9d` |
| `origin_ref` | `c3_field_v1` |
| `origin_type` | `system` (temporary workaround) |
| `display_name` | `c3 Field` |
| `is_active` | true |
| `metadata.source_oar2` | `oar2_seat_c3_field_registered_system_law_schema_v1.meta.md` |
| `metadata.origin_type_note` | `c3 Field anchored as system origin type — the coherent environment that contains all c3 Tree operation.` |

✓ Anchor row confirmed. `C3_FIELD_ANCHOR_ROW_MISSING_BLOCKER`: NOT triggered.

### All field_origin rows before mutation

| origin_ref | origin_type | display_name | is_active |
|---|---|---|---|
| `c3_field_v1` | system | c3 Field | true |

Only 1 row. No non-c3 Field rows exist; no cross-contamination risk.

---

## ACTION

**Migration name:** `extend_field_origin_origin_type_check_to_include_c3_field_v1`

**Migration file:** `supabase/migrations/202606100001_extend_field_origin_origin_type_check_to_include_c3_field_v1.sql`

### Fix 1 — Drop and recreate constraint

```sql
ALTER TABLE public.field_origin
  DROP CONSTRAINT field_origin_origin_type_check;

ALTER TABLE public.field_origin
  ADD CONSTRAINT field_origin_origin_type_check
    CHECK (origin_type IN (
      'named_individual',
      'institution_in_service',
      'operator',
      'system',
      'c3_field'
    ));
```

All 4 existing values preserved. `c3_field` added.

**Result:** Constraint recreated.

### Fix 2 — Update c3 Field anchor row

```sql
UPDATE public.field_origin
SET
  origin_type = 'c3_field',
  metadata    = metadata || jsonb_build_object(
    'origin_type_corrected',        true,
    'origin_type_correction_oar2',  'docs/oar/c3_field/oar2_extend_field_origin_origin_type_check_to_include_c3_field_v1.meta.md',
    'standing_note',                'c3 Field is now formalized as first-class origin type.'
  ),
  updated_at  = now()
WHERE origin_ref = 'c3_field_v1';
```

**Result:** 1 row updated. No other rows affected.

---

## VALIDATION QUERY OUTPUT

### Constraint after mutation

```
field_origin_origin_type_check:
CHECK ((origin_type = ANY (ARRAY[
  'named_individual'::text,
  'institution_in_service'::text,
  'operator'::text,
  'system'::text,
  'c3_field'::text
])))
```

✓ All existing values preserved. `c3_field` present.

### c3 Field anchor row after mutation

| column | value |
|---|---|
| `origin_ref` | `c3_field_v1` |
| `origin_type` | `c3_field` |
| `display_name` | `c3 Field` |
| `origin_type_corrected` | true |
| `standing_note` | `c3 Field is now formalized as first-class origin type.` |
| `is_active` | true |

✓ Corrected. `origin_type_corrected = true`.

### Registered-system standing — unchanged

| system_key | system_name | standing | implementation_pattern | system_scope | runtime_admission_state |
|---|---|---|---|---|---|
| `measures_of_inanna` | Measures of Inanna | registered | native | measures_of_inanna | not_seated |
| `measures_registry` | Measures Registry | registered | native | measures_registry | not_seated |

✓

### Runtime admission — unchanged

| system_key | admission_state | release_state | access_state | public_runtime_allowed | runtime_activation_allowed | runtime_admission_resolved |
|---|---|---|---|---|---|---|
| `measures_of_inanna` | not_seated | held | held | false | false | false |
| `measures_registry` | not_seated | held | held | false | false | false |

✓ `runtime_admission_resolved = false`. Unchanged.

### Measures Registry binding — unchanged

| binding_key | binding_state | release_state | access_state | runtime_effect_allowed | public_effect_allowed | binding_resolved |
|---|---|---|---|---|---|---|
| `measures_registry_assessment_admission_binding` | held | held | held | false | false | false |
| `measures_registry_governed_pathway_reveal_admission_binding` | held | held | held | false | false | false |
| `measures_registry_map_continuation_admission_binding` | held | held | held | false | false | false |

✓ All binding rows unchanged. `binding_resolved = false`.

---

## RESULT

### Validation

1. **c3 Field branch verified**: YES — `initiative/c3-field-convergence-infra`
2. **Existing `field_origin_origin_type_check` inspected**: YES — 4 values before; `c3_field` absent
3. **Existing allowed origin types preserved**: YES — `named_individual`, `institution_in_service`, `operator`, `system` all retained
4. **`c3_field` added to allowed origin types**: YES
5. **c3 Field anchor row updated to `origin_type = c3_field`**: YES — `origin_ref = c3_field_v1`
6. **No non-c3 Field origin rows changed**: YES — only 1 row existed; only that row updated
7. **Measures Registry registered-system standing preserved**: YES
8. **Measures of Inanna registered-system standing preserved**: YES
9. **Runtime admission remains false for both systems**: YES — `runtime_admission_resolved = false`
10. **Measures Registry binding remains held and unresolved**: YES — `binding_resolved = false` for all 3 rows
11. **No runtime admission granted**: YES
12. **No binding activation granted**: YES
13. **No Measures Registry runtime mutation performed**: YES
14. **No public route mutation performed**: YES
15. **No pricing/Stripe/SEAT/c3 Key/wallet/external integration mutation performed**: YES
16. **No AI authority/mutation/execution granted**: YES
17. **OAR1 written**: this document

---

## DB OBJECTS MODIFIED

| object | type | result |
|---|---|---|
| `field_origin_origin_type_check` | CONSTRAINT on `field_origin` | dropped and recreated with `c3_field` added |
| `c3_field_v1` | ROW in `field_origin` | `origin_type` corrected from `system` to `c3_field`; metadata merged |

No new tables, views, or functions created.

---

## CLOSES

OAR2: docs/oar/c3_field/oar2_extend_field_origin_origin_type_check_to_include_c3_field_v1.meta.md

## NEXT

1. **OAR2 — Seat Measures Registry Audit Chamber Directories, Orphaned Surfaces, and Public Semantic Pairings v1** — Staged document present on branch. Branch: `initiative/c3-field-convergence-infra`.

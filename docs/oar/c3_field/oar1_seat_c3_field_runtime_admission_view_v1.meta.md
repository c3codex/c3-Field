---
document_type: oar1
authority_level: working
document_scope: c3_field
title: OAR1 — Seat c3 Field Runtime Admission View
status: executed
version: v1
operator: op044
system: c3_field
source_oar2: docs/oar/c3_field/oar2_seat_c3_field_runtime_admission_view_v1.meta.md
executor: claude
execution_date: 2026-06-09
branch: initiative/c3-field-convergence-infra
tags:
  - oar1
  - c3-field
  - runtime-admission
  - registered-system
  - measures-registry
  - measures-of-inanna
  - non-ant
  - branch-guard
---

# OAR1 — Seat c3 Field Runtime Admission View v1

## OBJECTIVE

Create `c3_runtime_admission_contract` table and `v_c3_field_runtime_admission_v1` view. Seat held/not-seated admission rows for Measures Registry and Measures of Inanna. Update registered-system metadata to reference admission contracts. No runtime admission granted. No Measures Registry runtime mutation.

---

## PRE-EXECUTION: BRANCH VERIFICATION

| check | result |
|---|---|
| `git branch --show-current` | `initiative/c3-field-convergence-infra` |
| branch match | YES |
| Measures Registry deployment branch used | NO |

---

## PRE-EXECUTION: PREREQUISITE VALIDATION

### Registered-system standing

| system_key | standing | runtime_admission_state | registered_role | depends_on_spine |
|---|---|---|---|---|
| `measures_of_inanna` | registered | not_seated | spine | null (spine is itself) |
| `measures_registry` | registered | not_seated | null | measures_of_inanna |

✓ Both registered. Both `runtime_admission_state = not_seated`.

### Inanna spine passage law

| passage_key | passage_state | release_state | access_state | requires_runtime_admission |
|---|---|---|---|---|
| `measures_of_inanna_spine_passage_law` | held | held | held | true |

✓

### Base canopy law

| canopy_key | runtime_admission_state |
|---|---|
| `c3_field_canopy_law_base` | not_seated |

✓

### ANT banishment

```sql
SELECT table_name FROM information_schema.tables
WHERE table_schema = 'public' AND table_name LIKE 'ant_%';
```
**Result:** 0 rows ✓

### Existing runtime admission objects

| object | exists |
|---|---|
| `c3_runtime_admission_contract` | NO |
| `runtime_admission_contract` | NO |
| `field_runtime_admission` | NO |
| `v_c3_field_runtime_admission_v1` | NO |

No existing objects to adapt.

### Trigger function

`c3_oar_set_updated_at()`: EXISTS ✓

---

## ACTION

**Migration name:** `seat_c3_field_runtime_admission_view_v1`

**Migration file:** `supabase/migrations/202606090003_seat_c3_field_runtime_admission_view_v1.sql`

### Fix 1 — Create `c3_runtime_admission_contract`

Table created with:
- 27 columns
- `admission_scope` constraint: `system`, `passage`, `canopy`, `encounter`, `external_boundary`
- `admission_state` constraint: `not_seated`, `held`, `ready`, `admitted`, `blocked`, `revoked`
- `release_state` constraint: `held`, `ready`, `released`, `blocked`, `revoked`
- `access_state` constraint: `held`, `private`, `public`, `restricted`, `blocked`, `revoked`
- All defaults prevent runtime admission: `admission_state = not_seated`, `public_runtime_allowed = false`, `runtime_activation_allowed = false`

**Result:** Table created.

### Fix 2 — Trigger

`c3_runtime_admission_contract_set_updated_at` applied via `c3_oar_set_updated_at()`.

**Result:** Trigger created.

### Fix 3 — RLS and public read policy

```sql
ALTER TABLE public.c3_runtime_admission_contract ENABLE ROW LEVEL SECURITY;
CREATE POLICY "c3_runtime_admission_contract_public_read"
  ON public.c3_runtime_admission_contract FOR SELECT TO anon, authenticated USING (true);
```

**Result:** RLS enabled. Read policy created.

### Fix 4 — Seat Measures Registry admission row

```
admission_key: measures_registry_runtime_admission
system_key: measures_registry
admission_scope: system
admission_state: not_seated
release_state: held
access_state: held
public_runtime_allowed: false
runtime_activation_allowed: false
blocker_reason: Runtime admission cannot be granted until optics, evidence, trace, correction, AI action boundary, and role contracts are seated.
```

**Result:** Row inserted.

### Fix 5 — Seat Measures of Inanna admission row

```
admission_key: measures_of_inanna_runtime_admission
system_key: measures_of_inanna
admission_scope: system
admission_state: not_seated
release_state: held
access_state: held
public_runtime_allowed: false
runtime_activation_allowed: false
blocker_reason: Spine standing is registered and held; runtime admission requires optics, evidence, trace, correction, AI action boundary, and role contracts.
```

**Result:** Row inserted.

### Fix 6 — Create `v_c3_field_runtime_admission_v1`

View resolves runtime admission from `c3_registered_system` JOIN `c3_runtime_admission_contract`.

`runtime_admission_resolved` is true only when all are true:
- `rs.standing = 'registered'`
- `rac.admission_state = 'admitted'`
- `rac.release_state = 'released'`
- `rac.access_state NOT IN ('held', 'blocked', 'revoked')`
- `rac.public_runtime_allowed = true OR rac.runtime_activation_allowed = true`

**Result:** View created.

### Fix 7 — Update registered-system metadata

Both `measures_registry` and `measures_of_inanna` metadata merged with:
- `runtime_admission_contract_key`
- `runtime_admission_contract_state = not_seated`
- `runtime_admission_view = v_c3_field_runtime_admission_v1`

`runtime_admission_state = not_seated` preserved for both. Standing unchanged.

**Result:** Metadata merged via DML UPDATE.

---

## VALIDATION QUERY OUTPUT

### `v_c3_field_runtime_admission_v1`

| system_key | registration_standing | admission_state | release_state | access_state | public_runtime_allowed | runtime_activation_allowed | runtime_admission_resolved | runtime_blocked_reason |
|---|---|---|---|---|---|---|---|---|
| `measures_of_inanna` | registered | not_seated | held | held | false | false | false | Spine standing is registered and held; runtime admission requires optics, evidence, trace, correction, AI action boundary, and role contracts. |
| `measures_registry` | registered | not_seated | held | held | false | false | false | Runtime admission cannot be granted until optics, evidence, trace, correction, AI action boundary, and role contracts are seated. |

✓ Both systems present. `runtime_admission_resolved = false` for both.

### Registered-system metadata after update

| system_key | standing | runtime_admission_state | runtime_admission_contract_key | runtime_admission_contract_state | runtime_admission_view |
|---|---|---|---|---|---|
| `measures_registry` | registered | not_seated | measures_registry_runtime_admission | not_seated | v_c3_field_runtime_admission_v1 |
| `measures_of_inanna` | registered | not_seated | measures_of_inanna_runtime_admission | not_seated | v_c3_field_runtime_admission_v1 |

✓ `runtime_admission_state = not_seated` preserved. No standing change.

---

## RESULT

### Validation

1. **c3 Field branch verified**: YES — `initiative/c3-field-convergence-infra`
2. **Registered-system prerequisites validated**: YES — both registered, both `runtime_admission_state = not_seated`
3. **Non-ANT passage/canopy prerequisites validated**: YES
4. **Inanna spine standing validated**: YES — `registered_role = spine`, passage law held
5. **`c3_runtime_admission_contract` created**: YES
6. **Runtime admission constraints created**: YES — scope, admission_state, release_state, access_state
7. **Update trigger applied**: YES — `c3_oar_set_updated_at()`
8. **RLS/read policy applied**: YES — consistent with c3 Field standing tables
9. **Measures Registry admission row inserted as `not_seated`**: YES
10. **Measures of Inanna admission row inserted as `not_seated`**: YES
11. **`v_c3_field_runtime_admission_v1` created**: YES
12. **Both systems appear in runtime admission view**: YES
13. **Runtime admission resolves false for both systems**: YES — `runtime_admission_resolved = false`
14. **No runtime admission granted**: YES
15. **No Measures Registry runtime mutation performed**: YES
16. **No public route mutation performed**: YES
17. **No optics/evidence/trace/correction mutation performed**: YES
18. **No AI action boundary mutation performed**: YES
19. **No pricing/Stripe/SEAT/c3 Key/wallet/external integration mutation performed**: YES
20. **OAR1 written**: this document

---

## DB OBJECTS CREATED

| object | type | result |
|---|---|---|
| `c3_runtime_admission_contract` | TABLE | created |
| `c3_runtime_admission_contract_set_updated_at` | TRIGGER | created |
| `c3_runtime_admission_contract_public_read` | RLS POLICY | created |
| `measures_registry_runtime_admission` | ROW in `c3_runtime_admission_contract` | inserted |
| `measures_of_inanna_runtime_admission` | ROW in `c3_runtime_admission_contract` | inserted |
| `v_c3_field_runtime_admission_v1` | VIEW | created |

## DB OBJECTS MODIFIED

| object | type | result |
|---|---|---|
| `measures_registry` | ROW in `c3_registered_system` | metadata merged (admission contract reference) |
| `measures_of_inanna` | ROW in `c3_registered_system` | metadata merged (admission contract reference) |

No schema changes to existing tables. No runtime behavior activated.

---

## CLOSES

OAR2: docs/oar/c3_field/oar2_seat_c3_field_runtime_admission_view_v1.meta.md

## NEXT

1. **OAR2 — Seat c3 Field Optics / Evidence / Trace / Correction Contracts v1** — Create `c3_optics_contract`, `c3_evidence_contract`, `c3_ai_action_boundary` tables; elevate TypeScript optics to DB contract law. Branch: `initiative/c3-field-convergence-infra`.

2. **OAR2 — Bind Measures Registry to c3 Field Runtime Admission v1** — Bind MR threshold encounters to admission validation once optics/evidence/trace/correction/AI action boundary/role contracts are seated. Branch: `initiative/c3-field-convergence-infra`.

3. **OAR2 — Extend `field_origin_origin_type_check` to include `c3_field`** — Formalizes c3 Field as a first-class origin type; updates the anchor row. Branch: `initiative/c3-field-convergence-infra`.

---
document_type: oar1
authority_level: working
document_scope: c3_field
title: OAR1 — Seat c3 Field Optics / Evidence / Trace / Correction Contracts
status: executed
version: v1
operator: op044
system: c3_field
source_oar2: docs/oar/c3_field/oar2_seat_c3_field_optics_evidence_trace_correction_contracts_v1.meta.md
executor: claude
execution_date: 2026-06-09
branch: initiative/c3-field-convergence-infra
tags:
  - oar1
  - c3-field
  - optics
  - evidence
  - trace
  - correction
  - ai-action-boundary
  - role-contract
  - runtime-admission
  - branch-guard
---

# OAR1 — Seat c3 Field Optics / Evidence / Trace / Correction Contracts v1

## OBJECTIVE

Seat `c3_optics_contract`, `c3_evidence_contract`, `c3_trace_contract`, `c3_correction_contract`, `c3_ai_action_boundary`, and `c3_role_contract` as held c3 Field law. Seat 12 base held rows (6 per system). Create `v_c3_contract_readiness_v1` and `v_c3_ai_action_boundary_v1` views. Update runtime admission contract metadata to reference seated contract keys. No runtime admission granted. No Measures Registry runtime mutation.

---

## PRE-EXECUTION: BRANCH VERIFICATION

| check | result |
|---|---|
| `git branch --show-current` | `initiative/c3-field-convergence-infra` |
| branch match | YES |
| Measures Registry deployment branch used | NO |

---

## PRE-EXECUTION: PREREQUISITE VALIDATION

### Runtime admission view

| system_key | registration_standing | admission_state | release_state | access_state | public_runtime_allowed | runtime_activation_allowed | runtime_admission_resolved |
|---|---|---|---|---|---|---|---|
| `measures_of_inanna` | registered | not_seated | held | held | false | false | false |
| `measures_registry` | registered | not_seated | held | held | false | false | false |

✓ `RUNTIME_ADMISSION_ALREADY_GRANTED_BLOCKER`: NOT triggered.

### Runtime admission contract rows

| admission_key | admission_state | optics_required | evidence_required | trace_required | correction_required | ai_action_required | role_required |
|---|---|---|---|---|---|---|---|
| `measures_of_inanna_runtime_admission` | not_seated | true | true | true | true | true | true |
| `measures_registry_runtime_admission` | not_seated | true | true | true | true | true | true |

✓ Both rows exist; all gate booleans true; no row admitted.

### Existing contract objects

| object | exists |
|---|---|
| `c3_optics_contract` | NO |
| `c3_evidence_contract` | NO |
| `c3_trace_contract` | NO |
| `c3_correction_contract` | NO |
| `c3_ai_action_boundary` | NO |
| `c3_role_contract` | NO |

No existing objects to adapt.

---

## ACTION

**Migration name:** `seat_c3_field_optics_evidence_trace_correction_contracts_v1`

**Migration file:** `supabase/migrations/202606090004_seat_c3_field_optics_evidence_trace_correction_contracts_v1.sql`

### Fix 1 — Create `c3_optics_contract`

Table created. `optics_scope` constraint: system/passage/canopy/encounter/field. `optics_state` constraint: held/draft/ready/released/blocked/revoked. Defaults: `display_allowed = false`, `interpretation_allowed = false`, `public_surface_allowed = false`.

### Fix 2 — Create `c3_evidence_contract`

Table created. `evidence_scope` constraint: system/passage/canopy/encounter/runtime_admission/correction/public_claim. `evidence_state` constraint: held/draft/ready/accepted/blocked/revoked. Default: `public_claim_allowed = false`.

### Fix 3 — Create `c3_trace_contract`

Table created. `trace_scope` constraint: system/runtime_admission/schema/source/public_route/ai_action/correction. `trace_state` constraint: held/draft/ready/active/blocked/revoked.

### Fix 4 — Create `c3_correction_contract`

Table created. `correction_scope` constraint: system/runtime_admission/public_route/assessment/ai_action/contract/source. `correction_state` constraint: held/draft/ready/active/blocked/revoked.

### Fix 5 — Create `c3_ai_action_boundary`

Table created. `boundary_scope` constraint: system/runtime_admission/source/public_route/assessment/communication/correction. `boundary_state` constraint: held/draft/ready/active/blocked/revoked. Defaults: `authority_allowed = false`, `mutation_allowed = false`, `execution_allowed = false`, `proposal_allowed = true`.

### Fix 6 — Create `c3_role_contract`

Table created. `role_scope` constraint: system/runtime_admission/source/public_route/assessment/correction. `role_state` constraint: held/draft/ready/active/blocked/revoked. Defaults: `runtime_authority_allowed = false`, `mutation_authority_allowed = false`, `review_authority_allowed = false`.

### Fix 7 — Triggers

`c3_oar_set_updated_at()` applied to all 6 tables.

**Result:** 6 triggers created.

### Fix 8 — RLS and public read policies

RLS enabled and public read policy applied to all 6 tables.

**Result:** 6 RLS policies created.

### Fix 9 — Base held rows

12 rows inserted (6 per system). All rows held. No row permits display, mutation, public claim, AI authority, AI execution, or role authority.

| row_key | table | result |
|---|---|---|
| `measures_registry_optics_contract` | `c3_optics_contract` | inserted |
| `measures_registry_evidence_contract` | `c3_evidence_contract` | inserted |
| `measures_registry_trace_contract` | `c3_trace_contract` | inserted |
| `measures_registry_correction_contract` | `c3_correction_contract` | inserted |
| `measures_registry_ai_action_boundary` | `c3_ai_action_boundary` | inserted |
| `measures_registry_role_contract` | `c3_role_contract` | inserted |
| `measures_of_inanna_optics_contract` | `c3_optics_contract` | inserted |
| `measures_of_inanna_evidence_contract` | `c3_evidence_contract` | inserted |
| `measures_of_inanna_trace_contract` | `c3_trace_contract` | inserted |
| `measures_of_inanna_correction_contract` | `c3_correction_contract` | inserted |
| `measures_of_inanna_ai_action_boundary` | `c3_ai_action_boundary` | inserted |
| `measures_of_inanna_role_contract` | `c3_role_contract` | inserted |

### Fix 10 — Views

`v_c3_contract_readiness_v1` created. Resolves `all_contracts_ready` from all 5 contract state columns joined per system. `all_contracts_ready = true` only when optics `ready/released`, evidence `ready/accepted`, trace `ready/active`, correction `ready/active`, role `ready/active`.

`v_c3_ai_action_boundary_v1` created. Surfaces boundary state, AI role, and all boolean permission fields.

### Fix 11 — Runtime admission metadata update

Both `c3_runtime_admission_contract` rows updated with metadata references:
- `optics_contract_key`
- `evidence_contract_key`
- `trace_contract_key`
- `correction_contract_key`
- `ai_action_boundary_key`
- `role_contract_key`
- `contract_readiness_view = v_c3_contract_readiness_v1`

`admission_state`, `release_state`, `access_state`, `public_runtime_allowed`, `runtime_activation_allowed` unchanged.

---

## VALIDATION QUERY OUTPUT

### `v_c3_contract_readiness_v1`

| system_key | optics_state | evidence_state | trace_state | correction_state | role_state | all_contracts_ready | contract_blocked_reason |
|---|---|---|---|---|---|---|---|
| `measures_of_inanna` | held | held | held | held | held | false | optics_contract not ready |
| `measures_registry` | held | held | held | held | held | false | optics_contract not ready |

✓ `all_contracts_ready = false` for both.

### `v_c3_ai_action_boundary_v1`

| boundary_key | system_key | boundary_state | ai_role | authority_allowed | mutation_allowed | proposal_allowed | execution_allowed |
|---|---|---|---|---|---|---|---|
| `measures_of_inanna_ai_action_boundary` | measures_of_inanna | held | assistant_executor_support | false | false | true | false |
| `measures_registry_ai_action_boundary` | measures_registry | held | assistant_executor_support | false | false | true | false |

✓ AI authority = false. Mutation = false. Execution = false. Proposal only = true.

### Runtime admission after contract seating

| system_key | registration_standing | admission_state | release_state | access_state | public_runtime_allowed | runtime_activation_allowed | runtime_admission_resolved |
|---|---|---|---|---|---|---|---|
| `measures_of_inanna` | registered | not_seated | held | held | false | false | false |
| `measures_registry` | registered | not_seated | held | held | false | false | false |

✓ `runtime_admission_resolved = false`. Unchanged by contract seating.

---

## RESULT

### Validation

1. **c3 Field branch verified**: YES — `initiative/c3-field-convergence-infra`
2. **Runtime admission prerequisites validated**: YES — both not_seated, runtime_admission_resolved = false
3. **`c3_optics_contract` created**: YES
4. **`c3_evidence_contract` created**: YES
5. **`c3_trace_contract` created**: YES
6. **`c3_correction_contract` created**: YES
7. **`c3_ai_action_boundary` created**: YES
8. **`c3_role_contract` created**: YES
9. **Update triggers applied**: YES — `c3_oar_set_updated_at()` on all 6 tables
10. **RLS/read policies applied**: YES — public read on all 6 tables
11. **Measures Registry base held contract rows inserted**: YES — 6 rows
12. **Measures of Inanna base held contract rows inserted**: YES — 6 rows
13. **`v_c3_contract_readiness_v1` created**: YES
14. **`v_c3_ai_action_boundary_v1` created**: YES
15. **Contract readiness resolves false for both systems**: YES — `all_contracts_ready = false`
16. **Runtime admission remains false for both systems**: YES — `runtime_admission_resolved = false`
17. **No runtime admission granted**: YES
18. **No Measures Registry runtime mutation performed**: YES
19. **No public route mutation performed**: YES
20. **No pricing/Stripe/SEAT/c3 Key/wallet/external integration mutation performed**: YES
21. **No AI authority/mutation/execution granted**: YES — `authority_allowed = false`, `mutation_allowed = false`, `execution_allowed = false`
22. **OAR1 written**: this document

---

## DB OBJECTS CREATED

| object | type | result |
|---|---|---|
| `c3_optics_contract` | TABLE | created |
| `c3_evidence_contract` | TABLE | created |
| `c3_trace_contract` | TABLE | created |
| `c3_correction_contract` | TABLE | created |
| `c3_ai_action_boundary` | TABLE | created |
| `c3_role_contract` | TABLE | created |
| `c3_optics_contract_set_updated_at` | TRIGGER | created |
| `c3_evidence_contract_set_updated_at` | TRIGGER | created |
| `c3_trace_contract_set_updated_at` | TRIGGER | created |
| `c3_correction_contract_set_updated_at` | TRIGGER | created |
| `c3_ai_action_boundary_set_updated_at` | TRIGGER | created |
| `c3_role_contract_set_updated_at` | TRIGGER | created |
| `c3_optics_contract_public_read` | RLS POLICY | created |
| `c3_evidence_contract_public_read` | RLS POLICY | created |
| `c3_trace_contract_public_read` | RLS POLICY | created |
| `c3_correction_contract_public_read` | RLS POLICY | created |
| `c3_ai_action_boundary_public_read` | RLS POLICY | created |
| `c3_role_contract_public_read` | RLS POLICY | created |
| `measures_registry_optics_contract` | ROW in `c3_optics_contract` | inserted |
| `measures_registry_evidence_contract` | ROW in `c3_evidence_contract` | inserted |
| `measures_registry_trace_contract` | ROW in `c3_trace_contract` | inserted |
| `measures_registry_correction_contract` | ROW in `c3_correction_contract` | inserted |
| `measures_registry_ai_action_boundary` | ROW in `c3_ai_action_boundary` | inserted |
| `measures_registry_role_contract` | ROW in `c3_role_contract` | inserted |
| `measures_of_inanna_optics_contract` | ROW in `c3_optics_contract` | inserted |
| `measures_of_inanna_evidence_contract` | ROW in `c3_evidence_contract` | inserted |
| `measures_of_inanna_trace_contract` | ROW in `c3_trace_contract` | inserted |
| `measures_of_inanna_correction_contract` | ROW in `c3_correction_contract` | inserted |
| `measures_of_inanna_ai_action_boundary` | ROW in `c3_ai_action_boundary` | inserted |
| `measures_of_inanna_role_contract` | ROW in `c3_role_contract` | inserted |
| `v_c3_contract_readiness_v1` | VIEW | created |
| `v_c3_ai_action_boundary_v1` | VIEW | created |

## DB OBJECTS MODIFIED

| object | type | result |
|---|---|---|
| `measures_registry_runtime_admission` | ROW in `c3_runtime_admission_contract` | metadata merged (contract key references) |
| `measures_of_inanna_runtime_admission` | ROW in `c3_runtime_admission_contract` | metadata merged (contract key references) |

No schema changes to existing tables. No runtime behavior activated.

---

## CLOSES

OAR2: docs/oar/c3_field/oar2_seat_c3_field_optics_evidence_trace_correction_contracts_v1.meta.md

## NEXT

1. **OAR2 — Bind Measures Registry to c3 Field Runtime Admission v1** — Bind MR threshold encounters to admission validation; advance contract states from held toward ready once governing OARs are confirmed. Branch: `initiative/c3-field-convergence-infra`.

2. **OAR2 — Extend `field_origin_origin_type_check` to include `c3_field`** — Formalizes c3 Field as a first-class origin type; updates the anchor row. Branch: `initiative/c3-field-convergence-infra`.

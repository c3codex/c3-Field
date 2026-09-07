---
document_type: oar1
authority_level: working
title: OAR1 — Deactivate Safe Legacy Keys After Native Route Validation
status: executed
version: v1
operator: op044
system: measures_registry
source_oar2: docs/oar/measures_registry/oar2_deactivate_safe_legacy_keys_after_native_route_validation_v1.meta.md
commit: b6cf616
---

# OAR1 — Deactivate Safe Legacy Keys After Native Route Validation

## OBJECTIVE

Deactivate 4 legacy registry keys proven safe by native route validation.
Apply hygiene deactivation to 4 orphaned transition rules.
No rows deleted. No capture table touched. Bridge-required keys untouched.

---

## FILE CHANGED

| File | Change |
|---|---|
| `supabase/migrations/202606260005_deactivate_safe_legacy_keys_after_native_route_validation.sql` | Created — UPDATE 4 registry rows; UPDATE 4 transition rule rows |

---

## REGISTRY MUTATIONS

### structure_passage

Pre-mutation: `is_active=false`, `release_state=held`, `access_state=encounterable`

Already inactive. Access state corrected to `archived`. Metadata merged.

Post-mutation:

| Field | Value |
|---|---|
| is_active | false |
| release_state | held |
| access_state | archived |
| disposition | legacy_deactivated |
| deactivated_after_native_route_validation | true |
| source_oar1 | oar1_validate_native_encounter_routes_before_legacy_deactivation_v1 |
| audit_trace_preserved | true |

**Result: PASS**

---

### marble_pathway_reveal

Pre-mutation: `is_active=true`, `release_state=released`, `access_state=callable`

Post-mutation:

| Field | Value |
|---|---|
| is_active | false |
| release_state | held |
| access_state | archived |
| disposition | legacy_deactivated |
| deactivated_after_native_route_validation | true |
| source_oar1 | oar1_validate_native_encounter_routes_before_legacy_deactivation_v1 |
| audit_trace_preserved | true |

**Result: PASS**

---

### iis_eval_gate1

Pre-mutation: `is_active=true`, `release_state=released`, `access_state=callable`

Post-mutation:

| Field | Value |
|---|---|
| is_active | false |
| release_state | held |
| access_state | archived |
| disposition | legacy_deactivated |
| deactivated_after_native_route_validation | true |
| source_oar1 | oar1_validate_native_encounter_routes_before_legacy_deactivation_v1 |
| audit_trace_preserved | true |

**Result: PASS**

---

### crystal_chamber

Pre-mutation: `is_active=true`, `release_state=held`, `access_state=encounterable`

Post-mutation:

| Field | Value |
|---|---|
| is_active | false |
| release_state | held |
| access_state | archived |
| disposition | legacy_deactivated |
| deactivated_after_native_route_validation | true |
| source_oar1 | oar1_validate_native_encounter_routes_before_legacy_deactivation_v1 |
| audit_trace_preserved | true |

**Result: PASS**

---

## BRIDGE-REQUIRED KEYS — UNTOUCHED

| Key | is_active | release_state | access_state |
|---|---|---|---|
| eval_passage | true | released | callable |
| structural_drift_publication | true | released | callable |
| evaluate_structure_path | true | released | callable |

**All 3 confirmed unchanged. Result: PASS**

---

## CAPTURE TABLE PRESERVED

| Check | Result |
|---|---|
| `measures_iis_eval_gate1_capture` exists | PASS |

No rows deleted from any table.

---

## TRANSITION HYGIENE

All 4 orphaned transitions deactivated. `evaluate_structure_path → eval_passage` confirmed untouched.

| Transition | Pre-state | Post-state | Result |
|---|---|---|---|
| `evaluate_structure_path` → `structure_passage` | active | inactive | PASS |
| `structure_passage` → `crystal_chamber` | active | inactive | PASS |
| `structure_passage` → `connect_src` | active | inactive | PASS |
| `crystal_chamber` → `eval_passage` | active | inactive | PASS |
| `evaluate_structure_path` → `eval_passage` | active | **active** (untouched) | PASS |

---

## NOTCHAZZ FLAGS

None raised.

- eval_passage not deactivated
- structural_drift_publication not deactivated
- evaluate_structure_path not deactivated
- measures_iis_eval_gate1_capture not dropped or mutated
- No rows deleted
- No article or publication records changed
- No renderer code changed
- No frontend inference added
- Operator not governed

---

## CLOSE

4 legacy keys are now archived: `structure_passage`, `marble_pathway_reveal`, `iis_eval_gate1`, `crystal_chamber`.

4 orphaned transition rules are now inactive. `evaluate_structure_path → eval_passage` remains active.

Bridge-required keys (`eval_passage`, `structural_drift_publication`) retain full active standing pending separate bridge OARs.

Nothing is invented.

Commit: b6cf616

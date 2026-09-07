---
document_type: oar1
authority_level: working
document_scope: measures_registry_encounter_reconciliation
title: OAR1 — Codex Reconcile Registered 13 Encounter Rows
status: closed
version: v1
operator: op044
system: measures_registry
source_oar2: docs/oar/measures_registry/oar2_codex_reconcile_registered_13_encounter_rows_v1.meta.md
executor: claude_vs
tags:
  - oar1
  - measures-registry
  - codex
  - encounter-rows
  - registered-runtime
  - db-reconciliation
---

# OAR1 — Codex Reconcile Registered 13 Encounter Rows

## OBJECTIVE

Execute for:

`docs/oar/measures_registry/oar2_codex_reconcile_registered_13_encounter_rows_v1.meta.md`

Reconcile Measures Registry encounter rows into the governed 13-encounter registered runtime. Seat runtime sequence and route structure. No renderer implementation. No contract authoring.

---

## EXECUTE PACKAGE

| File | Role |
|---|---|
| `docs/oar/measures_registry/execute-codex-reconcile-registered-13-encounter-rows-v1.cjs` | Execute script — rename, deprecate, create, route seating, validation readback |

**Phases executed:**

| Phase | Scope |
|---|---|
| 1 | Rename 6 encounter keys to registered target keys + state_expression + sequence_order |
| 2 | Verify reserve_seat state_expression |
| 3 | Deprecate 7 encounters (`deprecated: true`, `is_active: false`) |
| 4 | Create `phase_payment` from `foundation_seat_hold` baseline |
| 5 | Create 5 stub encounter rows (`structure_passage`, `structured_eval`, `measures_phases_reveal`, `about_measures_registry`, `measures_eval_email_contract`) |
| 6 | Seat 14 runtime route rules in `measures_transition_rule` |

---

## DB TABLES WRITTEN

| Table | Operation |
|---|---|
| `measures_encounter_def` | UPDATE (rename × 6, deprecate × 7, state_expression patch × 1) |
| `measures_encounter_def` | INSERT (phase_payment × 1, stubs × 5) |
| `measures_registry` | UPDATE (registry_key rename × 6, sequence_order × 6) |
| `measures_registry` | INSERT (phase_payment × 1, stubs × 5) |
| `measures_transition_rule` | INSERT (route rules × 14) |

---

## ROWS RENAMED (6)

| From | To | state_expression | sequence_order |
|---|---|---|---|
| `landing_root` | `ai_isnt_broken_intro` | `public_ai_isnt_broken_intro` | 1000 |
| `landing_path_choice` | `evaluate_structure_path` | `public_evaluate_structure_path` | 1001 |
| `educational_diagnostic_passage` | `eval_passage` | `public_eval_passage` | 1002 |
| `c3_field` | `connect_src` | `public_connect_src` | 1003 |
| `measures_ai_operational_evaluation` | `measures_assessment` | `public_measures_assessment` | 1004 |
| `structural_drift_dispatches` | `structural_drift_publication` | `native_structural_drift_publication` | 1035 |

Existing metadata preserved. `reconciled_from` and `reconciliation_source` fields appended to metadata. `measures_registry.registry_key` updated in sync with each rename.

---

## RESERVE_SEAT VERIFIED (1)

| encounter_key | state_expression | status |
|---|---|---|
| `reserve_seat` | `public_learning_reserve_seat` | verified correct — no change |

---

## ROWS DEPRECATED (7)

| encounter_key | deprecated_by | replacement_encounter_key |
|---|---|---|
| `educate_eval_encounter` | `registered_13_surface_runtime_v1` | `eval_passage` |
| `iis_eval_gate1` | `registered_13_surface_runtime_v1` | `measures_assessment` |
| `cohort_conversion_encounter` | `registered_13_surface_runtime_v1` | — |
| `understand_failure` | `registered_13_surface_runtime_v1` | — |
| `foundation_offering` | `registered_13_surface_runtime_v1` | — |
| `systems_offering` | `registered_13_surface_runtime_v1` | — |
| `systems_seat_hold` | `registered_13_surface_runtime_v1` | `phase_payment` |

All deprecated rows: `is_active: false`, `metadata.deprecated: true`, `metadata.deprecated_by: "registered_13_surface_runtime_v1"`. Rows not deleted — remain traceable.

---

## ROWS CREATED (6)

### `phase_payment`

| Field | Value |
|---|---|
| encounter_key | `phase_payment` |
| function_layer | `intake` |
| state_expression | `public_phase_payment` |
| renderer | `hold_surface` (inherited from `foundation_seat_hold` baseline) |
| sequence_order | 1055 |
| release_state | `held` |
| access_state | `encounterable` |
| is_active | false |
| metadata.contract_status | `pending_contract` |
| metadata.reconciliation_origin | `foundation_seat_hold_merge` |

### Stub rows (5)

| encounter_key | function_layer | state_expression | sequence_order |
|---|---|---|---|
| `structure_passage` | `education_diagnostic` | `public_structure_passage` | 1010 |
| `structured_eval` | `diagnostic_capture` | `public_structured_eval` | 1020 |
| `measures_phases_reveal` | `orientation` | `public_measures_phases_reveal` | 1025 |
| `about_measures_registry` | `authority` | `public_about_measures_registry` | 1030 |
| `measures_eval_email_contract` | `intake` | `public_measures_eval_email_contract` | 1040 |

All stubs: `is_active: false`, `release_state: held`, `access_state: encounterable`, `renderer: null`, `metadata.contract_status: "pending_contract"`. Renderer authoring blocked pending contract seating.

---

## STATE EXPRESSIONS AFTER RECONCILIATION

All 13 registered target encounters with confirmed state_expressions:

| # | encounter_key | state_expression | sequence_order |
|---|---|---|---|
| 1 | `ai_isnt_broken_intro` | `public_ai_isnt_broken_intro` | 1000 |
| 2 | `evaluate_structure_path` | `public_evaluate_structure_path` | 1001 |
| 3 | `eval_passage` | `public_eval_passage` | 1002 |
| 4 | `connect_src` | `public_connect_src` | 1003 |
| 5 | `measures_assessment` | `public_measures_assessment` | 1004 |
| 6 | `structure_passage` | `public_structure_passage` | 1010 |
| 7 | `structured_eval` | `public_structured_eval` | 1020 |
| 8 | `measures_phases_reveal` | `public_measures_phases_reveal` | 1025 |
| 9 | `about_measures_registry` | `public_about_measures_registry` | 1030 |
| 10 | `structural_drift_publication` | `native_structural_drift_publication` | 1035 |
| 11 | `measures_eval_email_contract` | `public_measures_eval_email_contract` | 1040 |
| 12 | `reserve_seat` | `public_learning_reserve_seat` | 1040 |
| 13 | `phase_payment` | `public_phase_payment` | 1055 |

---

## RUNTIME ROUTE STRUCTURE SEATED

14 transition rules inserted in `measures_transition_rule` (`rule_state: active`):

| From | To | transition_kind | sort_order | action_id | emphasis |
|---|---|---|---|---|---|
| `ai_isnt_broken_intro` | `evaluate_structure_path` | `progression` | 10 | `route_evaluate_structure_path` | primary |
| `evaluate_structure_path` | `eval_passage` | `progression` | 10 | `route_eval_passage` | primary |
| `evaluate_structure_path` | `structure_passage` | `progression` | 20 | `route_structure_passage` | secondary |
| `eval_passage` | `connect_src` | `progression` | 10 | `route_connect_src_from_eval` | primary |
| `structure_passage` | `connect_src` | `progression` | 10 | `route_connect_src_from_structure` | primary |
| `connect_src` | `measures_assessment` | `progression` | 10 | `route_measures_assessment` | primary |
| `connect_src` | `structured_eval` | `progression` | 20 | `route_structured_eval` | secondary |
| `measures_assessment` | `measures_phases_reveal` | `progression` | 10 | `route_phases_reveal_from_assessment` | primary |
| `structured_eval` | `measures_phases_reveal` | `progression` | 10 | `route_phases_reveal_from_structured` | primary |
| `measures_phases_reveal` | `about_measures_registry` | `progression` | 10 | `route_about_measures_registry` | primary |
| `about_measures_registry` | `structural_drift_publication` | `progression` | 10 | `route_structural_drift_publication` | primary |
| `structural_drift_publication` | `measures_eval_email_contract` | `progression` | 10 | `route_measures_eval_email_contract` | primary |
| `measures_eval_email_contract` | `reserve_seat` | `progression` | 10 | `route_reserve_seat` | primary |
| `reserve_seat` | `phase_payment` | `progression` | 10 | `route_phase_payment` | primary |

**Routing table:** `measures_transition_rule` (underlying source for `v_measures_transition_runtime` view). All rules: `requires_release: false`, `requires_dependency_satisfied: false`, `requires_passage_ready: false`, `requires_connect_prompt: false`.

**Shared junction note:** `connect_src` has two outgoing rules — to `measures_assessment` (sort_order: 10, primary) and to `structured_eval` (sort_order: 20, secondary). Path context resolution (which target is followed) is governed by renderer routing based on which path led to `connect_src`. The transition rules establish both legal targets; renderer must resolve the conditional.

---

## VALIDATION QUERY

```sql
-- Registered 13 encounter presence check
select
  encounter_key,
  is_active,
  sequence_order,
  metadata->>'state_expression' as state_expression,
  metadata->>'function_layer' as function_layer,
  metadata->>'contract_status' as contract_status
from public.measures_encounter_def
where encounter_key in (
  'ai_isnt_broken_intro',
  'evaluate_structure_path',
  'eval_passage',
  'connect_src',
  'measures_assessment',
  'structure_passage',
  'structured_eval',
  'measures_phases_reveal',
  'about_measures_registry',
  'structural_drift_publication',
  'measures_eval_email_contract',
  'reserve_seat',
  'phase_payment'
)
order by sequence_order, encounter_key;

-- Deprecated encounter check
select
  encounter_key,
  is_active,
  metadata->>'deprecated' as deprecated,
  metadata->>'deprecated_by' as deprecated_by,
  metadata->>'replacement_encounter_key' as replacement
from public.measures_encounter_def
where encounter_key in (
  'educate_eval_encounter',
  'iis_eval_gate1',
  'cohort_conversion_encounter',
  'understand_failure',
  'foundation_offering',
  'systems_offering',
  'systems_seat_hold'
)
order by encounter_key;

-- Route rule count
select count(*) as route_rules_seated
from public.measures_transition_rule mtr
join public.measures_encounter_def from_enc on from_enc.id = mtr.from_encounter_id
where from_enc.encounter_key in (
  'ai_isnt_broken_intro',
  'evaluate_structure_path',
  'eval_passage',
  'structure_passage',
  'connect_src',
  'measures_assessment',
  'structured_eval',
  'measures_phases_reveal',
  'about_measures_registry',
  'structural_drift_publication',
  'measures_eval_email_contract',
  'reserve_seat'
)
and mtr.rule_state = 'active';
```

---

## READBACK CONFIRMATION

```
db_connection: ok

phase_1_renames: ok (6 renamed, 0 source_not_found)
phase_2_reserve_seat: ok (state_expression correct)
phase_3_deprecations: ok (7 deprecated)
phase_4_phase_payment: ok (created)
phase_5_stub_rows: ok (5 stubs created)
phase_6_routes: ok (13 inserted, 1 idempotent, 0 skipped)

registered_13_reconciliation_readback: {
  "target_encounters_found": 13,
  "target_encounters_expected": 13,
  "all_13_present": true,
  "missing_targets": [],
  "deprecated_encounters_found": 7,
  "deprecated_correctly": true,
  "route_rules_seated": 14,
  "route_rules_expected": 14,
  "all_routes_seated": true
}
```

---

## CONFLICTS AND BLOCKED OPERATIONS

### Check constraint corrections (non-blocking)

Two check constraints were encountered and corrected before final execution:

1. **`measures_registry_access_state_check`** — Initial `access_state: "pending"` not valid. Corrected to `"encounterable"`. Valid values: `visible`, `encounterable`, `archived`, `callable`, `gated`.

2. **`measures_transition_rule_transition_kind_check`** — Initial `transition_kind: "branching"` and `"conditional"` not valid. Corrected to `"progression"`. Valid values: `progression`, `return`. Branching (binary path choice) and conditional routing (shared junction) are represented as `progression` rules differentiated by sort_order and metadata.action.emphasis.

Both corrections applied before successful execution. No data was corrupted. Operations were idempotent on retry.

### Sequence order collision

`measures_eval_email_contract` and `reserve_seat` both have `sequence_order: 1040`. The collision results from `reserve_seat` retaining its pre-reconciliation sequence_order (not a rename target, not updated). No functional impact — routing is governed by `measures_transition_rule`, not sequence_order. Sequence_order collision is a metadata ordering issue only. To be resolved in a future OAR2 if needed.

---

## RENDERER PRESERVATION MAP — CONFIRMED

| encounter_key | renderer | status |
|---|---|---|
| `ai_isnt_broken_intro` | `epigraph_split_hero` | preserved from `landing_root` |
| `evaluate_structure_path` | `measures_registry_path_choice` | preserved from `landing_path_choice` |
| `eval_passage` | `diagnostic_explainer_passage` | preserved from `educational_diagnostic_passage` |
| `connect_src` | `static_authority_surface` | preserved from `c3_field` |
| `measures_assessment` | `measures_registry_evaluation_chamber` | preserved from `measures_ai_operational_evaluation` |
| `structural_drift_publication` | `structural_drift_dispatches` | preserved from `structural_drift_dispatches` |
| `reserve_seat` | `reserve_seat_selector` | preserved |
| `phase_payment` | `hold_surface` | inherited from `foundation_seat_hold` |
| `structure_passage` | null (stub) | renderer authoring required |
| `structured_eval` | null (stub) | renderer authoring required |
| `measures_phases_reveal` | null (stub) | renderer authoring required |
| `about_measures_registry` | null (stub) | renderer authoring required |
| `measures_eval_email_contract` | null (stub) | renderer authoring required |

---

## RECOMMENDED NEXT OAR2

**OAR2:** Seat encounter contracts for the 8 renamed/preserved registered encounters against the sitewide style contract.

Target encounters (have renderers, need contracts):
`ai_isnt_broken_intro`, `evaluate_structure_path`, `eval_passage`, `connect_src`, `measures_assessment` (extend existing), `structural_drift_publication`, `reserve_seat`, `phase_payment`

Scope:
- Author full encounter contracts against `measures_registry_sitewide_style_contract` for 7 encounters
- Extend `measures_assessment` (add 4 missing sitewide clauses: media_behavior, transition, branding, footer)
- No renderer authoring. No stub encounter contracts yet — stub encounters await renderer assignment.

---

## CLOSEOUT

Registered 13 encounter rows reconciled. All 6 renames committed. 7 encounters deprecated. 6 new rows created. 14 runtime route rules seated in `measures_transition_rule`. Runtime sequence confirmed by sequence_order and routing confirmed by transition rules.

The Measures Registry DB now contains the governed 13-encounter registered runtime with correct encounter keys, state_expressions, and route structure. Deprecated rows remain traceable. No styling or renderer implementation has occurred.

OAR1 ready for operator review.

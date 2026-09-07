---
document_type: oar1
authority_level: working
document_scope: measures_registry_runtime_reconciliation
title: OAR1 — Reconcile Measures Registry Encounters to Registered 13 Surface Runtime
status: closed
version: v1
operator: op044
system: measures_registry
source_oar2: docs/oar/measures_registry/oar2_reconcile_measures_registry_encounters_to_registered_13_surface_runtime_v1.meta.md
executor: claude_vs
tags:
  - oar1
  - measures-registry
  - runtime-reconciliation
  - encounter-governance
  - registered-runtime
  - codex-first
---

# OAR1 — Reconcile Measures Registry Encounters to Registered 13 Surface Runtime

## OBJECTIVE

Execute for:

`docs/oar/measures_registry/oar2_reconcile_measures_registry_encounters_to_registered_13_surface_runtime_v1.meta.md`

Reconcile current Measures Registry runtime (17 present encounters, 2 missing) into a governed 13 encounter structure. Codex analysis only. No DB writes. No renderer edits.

---

## SOURCE STATE

**Current runtime:** 17 encounters present in `measures_encounter_def`, 2 missing from DB entirely.

**Contracted:** 2 encounters partially contracted (evaluation chamber). 14 renderer-only styling surfaces. 1 stub contract. (Established by `oar1_audit_current_encounter_styling_contracts_against_sitewide_contract_v1`)

**Target:** 13 governed public encounters + 2 preserved internal utility surfaces.

---

## CURRENT → TARGET ENCOUNTER RECONCILIATION TABLE

| Current Key | Disposition | Target Key | Renderer (current → target) | Notes |
|---|---|---|---|---|
| `landing_root` | **rename** | `ai_isnt_broken_intro` | `epigraph_split_hero` → preserved | Entry surface; key renamed to registered identity |
| `landing_path_choice` | **rename** | `evaluate_structure_path` | `measures_registry_path_choice` → preserved | Path choice surface; key renamed |
| `educational_diagnostic_passage` | **rename** | `eval_passage` | `diagnostic_explainer_passage` → preserved | Left path passage; stub contract requires amendment |
| `educate_eval_encounter` | **deprecate** | — | `diagnostic_explainer_resource_evaluation_entry` → retired | Redundant educational threshold; no target slot; known JSX drift surface |
| `c3_field` | **rename** | `connect_src` | `static_authority_surface` → preserved | Shared junction; appears in both left and right paths; isolation contract required |
| `iis_eval_gate1` | **deprecate** | — | `db_bound_evaluation_capture` → retired | Legacy eval gate; evaluation authority transfers to `measures_assessment` |
| `measures_ai_operational_evaluation` | **rename** | `measures_assessment` | `measures_registry_evaluation_chamber` → preserved | Primary evaluation chamber; state_expression isolation correction required |
| `structural_drift_dispatches` | **rename** | `structural_drift_publication` | `structural_drift_dispatches` → preserved | Publication surface; key renamed to registered identity |
| `reserve_seat` | **preserve** | `reserve_seat` | `reserve_seat_selector` → unchanged | Exact match; no change required |
| `foundation_seat_hold` | **merge → primary** | `phase_payment` | `hold_surface` → repurposed | Split-program hold model not in target; becomes single phase_payment surface |
| `systems_seat_hold` | **merge → absorbed** | `phase_payment` | `hold_surface` → retired | Absorbed into phase_payment; systems variant deprecated |
| `cohort_conversion_encounter` | **deprecate** | — | `cohort_conversion_orientation` → retired | Conversion experiment; no target slot |
| `understand_failure` | **deprecate** | — | `generic_media_encounter` → retired | Generic media encounter; no target slot |
| `foundation_offering` | **deprecate** | — | `offering_surface` → retired | Offering surface not in target runtime |
| `systems_offering` | **deprecate** | — | `offering_surface` → retired | Shared renderer group; absorbed with foundation_offering |
| `registered_process_log` | **preserve as internal utility** | — | `registered_process_log` → preserved | Operator-facing; outside public runtime |
| `seat_hold_notification_review` | **preserve as internal utility** | — | `notification_review_surface` → preserved | Operator-facing review; outside public runtime |
| `evaluation_result` | **not created** | — | — | Absorbed into `measures_assessment` result state; no separate surface in target |
| `publication_dispatch` | **not created** | — | — | No target slot; deprecated |

**Disposition summary:**

| Disposition | Count |
|---|---|
| rename | 7 |
| preserve | 1 |
| merge (primary) | 1 |
| merge (absorbed) | 1 |
| deprecate | 7 |
| preserve as internal utility | 2 |
| not created (absorbed) | 1 |
| not created (deprecated) | 1 |

---

## TARGET ENCOUNTER AUTHORITY MAPPING

Full authority map for each of the 13 registered public encounters.

| # | encounter_key | renderer | function_layer | state_expression | origin |
|---|---|---|---|---|---|
| 1 | `ai_isnt_broken_intro` | `epigraph_split_hero` | `entry` | `public_ai_isnt_broken_intro` | rename from `landing_root` |
| 2 | `evaluate_structure_path` | `measures_registry_path_choice` | `choice` | `public_evaluate_structure_path` | rename from `landing_path_choice` |
| 3 | `eval_passage` | `diagnostic_explainer_passage` | `education_diagnostic` | `public_eval_passage` | rename from `educational_diagnostic_passage` |
| 4 | `connect_src` | `static_authority_surface` | `authority` | `public_connect_src` | rename from `c3_field` |
| 5 | `measures_assessment` | `measures_registry_evaluation_chamber` | `diagnostic_capture` | `public_measures_assessment` | rename from `measures_ai_operational_evaluation` |
| 6 | `structure_passage` | TBD | `education_diagnostic` | `public_structure_passage` | new |
| 7 | `structured_eval` | TBD | `diagnostic_capture` | `public_structured_eval` | new |
| 8 | `measures_phases_reveal` | TBD | `orientation` | `public_measures_phases_reveal` | new |
| 9 | `about_measures_registry` | TBD | `authority` | `public_about_measures_registry` | new |
| 10 | `structural_drift_publication` | `structural_drift_dispatches` | `publication_surface` | `native_structural_drift_publication` | rename from `structural_drift_dispatches` |
| 11 | `measures_eval_email_contract` | TBD | `intake` | `public_measures_eval_email_contract` | new |
| 12 | `reserve_seat` | `reserve_seat_selector` | `intake` | `public_learning_reserve_seat` | preserve |
| 13 | `phase_payment` | `hold_surface` | `intake` | `public_phase_payment` | merge from `foundation_seat_hold` |

**Contract requirements per encounter:**

| encounter_key | styling | layout | media_behavior | branding | footer | transition |
|---|---|---|---|---|---|---|
| `ai_isnt_broken_intro` | required | required | required | required | required | required |
| `evaluate_structure_path` | required | required | — | — | — | required |
| `eval_passage` | amend from stub | required | — | — | — | required |
| `connect_src` | required | required | — | required | — | required |
| `measures_assessment` | v3 (extend) | v2 (extend) | **required — missing** | **required — missing** | **required — missing** | **required — missing** |
| `structure_passage` | required | required | — | — | — | required |
| `structured_eval` | required | required | required | — | — | required |
| `measures_phases_reveal` | required | required | required | — | — | required |
| `about_measures_registry` | required | required | — | required | required | required |
| `structural_drift_publication` | required | required | — | — | required | required |
| `measures_eval_email_contract` | required | required | — | — | — | required |
| `reserve_seat` | required | required | — | — | — | required |
| `phase_payment` | required | required | — | — | required | required |

**Sitewide clause inheritance:** All 13 encounters inherit from `measures_registry_sitewide_style_contract` (seated, active). Material family: obsidian/lapis/marble. Typography: institutional_serif (heading), operational_sans (body). All encounters bind to the seated sitewide contract — encounter-level contracts specify, override, or extend sitewide defaults per encounter scope.

---

## DUPLICATE AND OVERLAPPING SURFACE RESOLUTION

### Evaluation chamber: `iis_eval_gate1` + `measures_ai_operational_evaluation`

**Finding:** Both encounters share `state_expression: "public_iis_eval_gate1"` — two distinct encounter keys with identical state expression. Encounter isolation boundary is ambiguous. Both carry identical styling_contract v3 and layout_contract v2.

**Resolution path:**

- `measures_ai_operational_evaluation` → **rename** to `measures_assessment`; assigned distinct state_expression `public_measures_assessment`
- `iis_eval_gate1` → **deprecate**; legacy gate retired; evaluation authority transferred to `measures_assessment`
- `measures_assessment` styling_contract v3 and layout_contract v2 preserved unchanged
- `measures_assessment` requires 4 missing sitewide clauses added: `media_behavior_contract`, `transition_contract`, `branding_contract`, `footer_contract`
- State isolation concern resolved by deprecation of `iis_eval_gate1` and distinct state expression assignment

### Educational threshold pair: `educational_diagnostic_passage` + `educate_eval_encounter`

**Finding:** Both carry `function_layer: education_diagnostic`. `educational_diagnostic_passage` is the passage surface. `educate_eval_encounter` is a transitional evaluation entry threshold — a renderer-era step between passage and evaluation capture.

**Resolution path:**

- `educational_diagnostic_passage` → **rename** to `eval_passage`; passage surface retained in left path
- `educate_eval_encounter` → **deprecate**; evaluation entry function absorbed into routing from `eval_passage` → `connect_src` → `measures_assessment`
- Known JSX drift surface — retirement removes drift surface from active runtime without requiring renderer correction

---

## DEPRECATED RUNTIME SURFACES

7 encounters deprecated from public runtime:

| encounter_key | Renderer | Deprecation reason |
|---|---|---|
| `educate_eval_encounter` | `diagnostic_explainer_resource_evaluation_entry` | Redundant educational threshold; absorbed into eval_passage → measures_assessment flow |
| `iis_eval_gate1` | `db_bound_evaluation_capture` | Legacy eval gate; authority transfers to measures_assessment |
| `cohort_conversion_encounter` | `cohort_conversion_orientation` | Conversion experiment; no target slot in registered runtime |
| `understand_failure` | `generic_media_encounter` | Generic fallback encounter; no target slot |
| `foundation_offering` | `offering_surface` | Offering surface; split-program offering model not in target |
| `systems_offering` | `offering_surface` | Shared renderer group with foundation_offering; absorbed |
| `systems_seat_hold` | `hold_surface` | Split-program hold model; absorbed into phase_payment from foundation_seat_hold |

**Archive vs retire:** Deprecation does not require row deletion. Encounter rows should be flagged `deprecated: true` in metadata. DB rows are archivable — not removed until runtime verification confirms no active routing.

---

## MISSING ENCOUNTER ROWS REQUIRED

6 net-new encounter rows to create:

| encounter_key | function_layer | renderer status | Position |
|---|---|---|---|
| `structure_passage` | `education_diagnostic` | renderer required (new) | Right path passage |
| `structured_eval` | `diagnostic_capture` | renderer required (new) | Right path evaluation |
| `measures_phases_reveal` | `orientation` | renderer required (new) | Converged runtime — post-assessment reveal |
| `about_measures_registry` | `authority` | renderer required (new) | Converged runtime — registry authority surface |
| `measures_eval_email_contract` | `intake` | renderer required (new) | Converged runtime — email/contract capture |
| `phase_payment` | `intake` | `hold_surface` repurposed | Converged runtime — phase commitment |

**Renderer authoring dependency:** 5 of 6 new encounters require renderer authoring before DB seating is meaningful. `phase_payment` can derive from `foundation_seat_hold` renderer baseline. Encounter rows should be created as stubs (encounter_key + function_layer + state_expression) and contracted before renderer implementation begins.

**Previously missing encounters — not created:**

- `evaluation_result` — absorbed into `measures_assessment` result state; `measures_assessment` surfaces evaluation result inline before transitioning to `measures_phases_reveal`; no separate encounter row required
- `publication_dispatch` — no target slot in registered runtime; deprecated

---

## ENCOUNTER DEPENDENCY MAP

```
ai_isnt_broken_intro
    ↓
evaluate_structure_path [binary choice: left | right]
    │
    ├─ LEFT — Evaluation Orientation
    │   eval_passage
    │       ↓
    │   connect_src [shared junction]
    │       ↓
    │   measures_assessment
    │       ↓
    │   measures_phases_reveal ──────────┐
    │                                   │
    └─ RIGHT — Structure Orientation    │
        structure_passage               │
            ↓                           │
        connect_src [shared junction]   │
            ↓                           │
        structured_eval                 │
            ↓                           │
        measures_phases_reveal ─────────┘
                ↓
        about_measures_registry
                ↓
        structural_drift_publication
                ↓
        measures_eval_email_contract
                ↓
        reserve_seat
                ↓
        phase_payment
```

**Isolation notes:**

- `connect_src` is a shared encounter — both paths route through the same encounter key. State expression `public_connect_src` is path-agnostic. Routing context (which path led here) must not bleed into encounter state. Isolation contract required.
- `evaluate_structure_path` is the routing authority for the binary choice — left/right path selection is state-expression-governed, not encounter-scoped.
- `measures_phases_reveal` is the convergence point — both evaluation paths terminate here before the converged runtime sequence begins.

---

## RENDERER PRESERVATION MAP

| Target Encounter | Renderer | Status | Source Encounter |
|---|---|---|---|
| `ai_isnt_broken_intro` | `epigraph_split_hero` | preserved | `landing_root` |
| `evaluate_structure_path` | `measures_registry_path_choice` | preserved | `landing_path_choice` |
| `eval_passage` | `diagnostic_explainer_passage` | preserved | `educational_diagnostic_passage` |
| `connect_src` | `static_authority_surface` | preserved | `c3_field` |
| `measures_assessment` | `measures_registry_evaluation_chamber` | preserved | `measures_ai_operational_evaluation` |
| `structural_drift_publication` | `structural_drift_dispatches` | preserved | `structural_drift_dispatches` |
| `reserve_seat` | `reserve_seat_selector` | preserved | `reserve_seat` |
| `phase_payment` | `hold_surface` | repurposed | `foundation_seat_hold` |
| `structure_passage` | TBD | requires authoring | — |
| `structured_eval` | TBD | requires authoring | — |
| `measures_phases_reveal` | TBD | requires authoring | — |
| `about_measures_registry` | TBD | requires authoring | — |
| `measures_eval_email_contract` | TBD | requires authoring | — |

8 of 13 renderers preserved or repurposed. 5 renderers require authoring. No renderer is modified in this reconciliation — renderer authoring is blocked until encounter contracts are seated.

---

## REQUIRED CONTRACT SEATING SEQUENCE

### Phase 1 — Encounter DB reconciliation (rename + deprecate + state_expression correction)

DB write operations against `measures_encounter_def`:

1. Rename 7 encounter keys to registered target keys
2. Assign distinct state_expressions to all renamed encounters (replacing legacy values)
3. Flag 7 encounters as `deprecated: true` in metadata
4. Create `phase_payment` stub row (from `foundation_seat_hold` baseline)
5. Correct `measures_assessment` state_expression isolation (`public_measures_assessment`)

**Blocked until:** Phase 1 complete before any contract authoring begins.

### Phase 2 — Contract amendment for encounters with existing contracts

Target: `measures_assessment` (formerly `measures_ai_operational_evaluation`)

- Preserve: `styling_contract` v3, `layout_contract` v2
- Add: `media_behavior_contract`, `transition_contract`, `branding_contract`, `footer_contract`
- Authority: `measures_registry_sitewide_style_contract` (all 4 clauses governed by seated contract)

Target: `eval_passage` (formerly `educational_diagnostic_passage`)

- Promote stub `styling_contract` (`{material_family: "obsidian"}`) to full contract
- Add: `layout_contract`, `transition_contract`
- Sitewide inheritance: typography, color/material, viewport clauses

### Phase 3 — Contract authoring for renamed encounters (no existing contracts)

Author full encounter contracts for all 6 renamed encounters without existing contracts:

`ai_isnt_broken_intro`, `evaluate_structure_path`, `connect_src`, `structural_drift_publication`, `reserve_seat`, `phase_payment`

Contract authority: `measures_registry_sitewide_style_contract` governs all clauses; encounter contracts specify encounter-scoped overrides and extensions.

### Phase 4 — Stub row creation and contract seating for net-new encounters

Create encounter rows and seat encounter contracts for:

`structure_passage`, `structured_eval`, `measures_phases_reveal`, `about_measures_registry`, `measures_eval_email_contract`

Stub rows created with: `encounter_key`, `function_layer`, `state_expression`, contract fields authored.

### Phase 5 — Renderer authoring (blocked until Phase 4 complete)

5 new renderers authored after encounter contracts are seated:

`structure_passage`, `structured_eval`, `measures_phases_reveal`, `about_measures_registry`, `measures_eval_email_contract`

Implementation order within Phase 5: left/right path renderers first (`structure_passage`, `structured_eval`), then converged runtime (`measures_phases_reveal`, `about_measures_registry`, `measures_eval_email_contract`).

---

## RECOMMENDED IMPLEMENTATION ORDER

| Priority | Work | Scope | Blocked by |
|---|---|---|---|
| 1 | DB encounter reconciliation | rename 7, deprecate 7, state_expression corrections, phase_payment merge | — |
| 2 | measures_assessment contract amendment | add 4 missing sitewide clauses | Priority 1 |
| 3 | eval_passage contract promotion | stub → full contract | Priority 1 |
| 4 | Remaining renamed encounter contracts | 6 encounters, full contract authoring | Priority 1 |
| 5 | Net-new encounter stub rows + contracts | 5 new encounters (excl. phase_payment) | Priority 1 |
| 6 | Right path renderer authoring | structure_passage, structured_eval | Priority 5 |
| 7 | Converged runtime renderer authoring | measures_phases_reveal, about_measures_registry, measures_eval_email_contract | Priority 6 |
| 8 | Runtime routing verification | end-to-end encounter sequencing | Priority 7 |

---

## RECOMMENDED NEXT OAR2

**OAR2:** Seat encounter DB reconciliation — rename, deprecate, state_expression correction, and phase_payment merge.

Target: DB write operations against `measures_encounter_def`

Scope:
- Rename 7 encounter keys to registered target keys with corrected state_expressions:
  - `landing_root` → `ai_isnt_broken_intro`
  - `landing_path_choice` → `evaluate_structure_path`
  - `educational_diagnostic_passage` → `eval_passage`
  - `c3_field` → `connect_src`
  - `measures_ai_operational_evaluation` → `measures_assessment` (state_expression: `public_measures_assessment`)
  - `structural_drift_dispatches` → `structural_drift_publication`
  - `reserve_seat` → `reserve_seat` (state_expression correction only if needed)
- Flag 7 encounters as deprecated: `educate_eval_encounter`, `iis_eval_gate1`, `cohort_conversion_encounter`, `understand_failure`, `foundation_offering`, `systems_offering`, `systems_seat_hold`
- Create `phase_payment` stub row from `foundation_seat_hold` baseline
- No contract authoring. No renderer edits. Encounter key structure and state_expression governance established before contract seating begins.

---

## RECONCILIATION SUMMARY

| Category | Count |
|---|---|
| Encounters renamed to registered keys | 7 |
| Encounters preserved (exact match) | 1 |
| Encounters merged into target surface | 2 (→ phase_payment) |
| Encounters deprecated | 7 |
| Encounters preserved as internal utility | 2 |
| Previously missing — not created (absorbed) | 1 (evaluation_result) |
| Previously missing — not created (deprecated) | 1 (publication_dispatch) |
| Net-new encounter rows required | 6 |
| Renderers preserved or repurposed | 8 of 13 |
| Renderers requiring authoring | 5 of 13 |
| Target public encounters | 13 |
| Target internal utility encounters | 2 |

**Conclusion:** The current 17-encounter runtime maps into a governed 13-encounter registered runtime through 7 renames, 1 preserve, 1 merge, and 7 deprecations. 6 new encounter rows are required. 5 renderers require authoring. The evaluation chamber (measures_assessment) is the only encounter with existing contracts — 4 sitewide clauses remain to be added. All 13 target encounters inherit from the seated sitewide style contract. Encounter DB reconciliation is the immediate next operation before any contract or renderer work begins.

---

## CLOSEOUT

Runtime reconciliation analysis complete. No DB writes. No renderer edits. No contract modifications.

Full current → target encounter mapping established. Preservation, rename, deprecation, and creation pathways determined. Encounter dependency map and implementation sequencing documented. Recommended next OAR2: DB encounter reconciliation operations.

OAR1 ready for operator review.

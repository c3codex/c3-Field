---
document_type: oar1
authority_level: working
document_scope: measures_registry_runtime_activation
title: OAR1 — Correct Registered Runtime Activation and Public Route Exposure
status: closed
version: v1
operator: op044
system: measures_registry
source_oar2: docs/oar/measures_registry/oar2_correct_registered_runtime_activation_and_public_route_exposure_v1.meta.md
executor: claude_vs
tags:
  - oar1
  - measures-registry
  - runtime-activation
  - public-route-exposure
  - registered-runtime
  - codex-first
---

# OAR1 — Correct Registered Runtime Activation and Public Route Exposure

## OBJECTIVE

Execute for:

`docs/oar/measures_registry/oar2_correct_registered_runtime_activation_and_public_route_exposure_v1.meta.md`

Activate all 13 registered public encounters for anon readback. Correct `evaluate_structure_path` path-choice action targets to route through the registered sequence. Add `phase_payment` frontend surface. No CSS edits. No assessment scoring changes. No email dispatch. No payment logic exposed.

---

## EXECUTE PACKAGE

| File | Role |
|---|---|
| `src/measures_registry/MeasuresRegistryRuntime.tsx` | Frontend runtime — phase_payment surface, reserve seat routing, activeSurfaceElement |
| `docs/oar/measures_registry/execute-correct-registered-runtime-activation-and-public-route-exposure-v1.cjs` | Correction script — activates 6 stubs, corrects evaluate_structure_path actions |

---

## BUILD RESULT

```
npm run build:registry → ✓ built in 3.20s (clean, no TypeScript errors)
```

---

## DB STATE CHANGE

| Table | Operation | Rows |
|---|---|---|
| `measures_encounter_def` | `UPDATE is_active = true` | 6 rows |
| `measures_encounter_def` | `UPDATE metadata` (plaques + actions) | 1 row |

Total: 7 rows updated.

---

## BEFORE / AFTER ACTIVE STATE

| Encounter | Before | After |
|---|---|---|
| `ai_isnt_broken_intro` | true | true (unchanged) |
| `evaluate_structure_path` | true | true (unchanged) |
| `eval_passage` | true | true (unchanged) |
| `connect_src` | true | true (unchanged) |
| `measures_assessment` | true | true (unchanged) |
| `structure_passage` | **false** | **true** |
| `structured_eval` | **false** | **true** |
| `measures_phases_reveal` | **false** | **true** |
| `about_measures_registry` | **false** | **true** |
| `structural_drift_publication` | true | true (unchanged) |
| `measures_eval_email_contract` | **false** | **true** |
| `reserve_seat` | true | true (unchanged) |
| `phase_payment` | **false** | **true** |

---

## PATH CHOICE CORRECTION

`evaluate_structure_path` metadata `plaques` and `actions` updated from legacy targets to registered targets per `path_action_contract`.

### Before

| Plaque | action_key | target_encounter_key |
|---|---|---|
| Left | `explore_system` | `understand_failure` (deprecated) |
| Right | `reserve_seat` | `open_src_intake` (no route target) |

### After

| Plaque | action_key | target_encounter_key |
|---|---|---|
| Left | `route_eval_passage` | `eval_passage` |
| Right | `route_structure_passage` | `structure_passage` |

`more` and `coherence` metadata keys updated to match new action keys and labels. All other `evaluate_structure_path` metadata preserved intact (header, eyebrow, title, subtitle, breakdown_blocks, layout_contract, styling_contract, transition_contract, path_action_contract, encounter_isolation_contract, source_sitewide_contract).

---

## ANON READBACK CONFIRMATION

```json
{
  "anon_readback_count": 13,
  "anon_readback_missing": [],
  "all_13_anon_readable": true
}
```

All 13 registered public encounters readable by anon key after activation.

---

## FILES MODIFIED

| File | Change |
|---|---|
| `src/measures_registry/MeasuresRegistryRuntime.tsx` | phase_payment surface — see below |

---

## FRONTEND CHANGES

### SurfaceState Extended

1 new state added:

```typescript
| "phase_payment"
```

### SURFACE_QUERY Extended

```typescript
phase_payment: "phase_payment",
```

### phasePaymentCopy Added

```typescript
const phasePaymentCopy = sectionCopy(sectionMap.get("phase_payment"))
```

### submitSeatHold Signature Extended

```typescript
encounterKey: "foundation_seat_hold" | "systems_seat_hold" | "phase_payment"
```

Allows hold form submission from `phase_payment` surface using existing seat hold API. Note: `phase_payment` metadata does not currently include `offering_key` — form submit will return an error if attempted without that field being seated. Surface renders correctly for visual QA.

### renderPhasePaymentSurface Added

New renderer for `phase_payment` encounter. Does not use `reportMissingClassification` (metadata is minimal — no `function_layer`, `state_expression`). Renders with graceful fallbacks.

| Field | Source |
|---|---|
| Entry headline | `phasePaymentCopy.entryHeadline` with fallback `"Reserve Your Seat"` |
| Form | `registry-hold-form` with email field if seated in metadata |
| Back navigation | `back_to_reserve_seat` → `reserve_seat` via generic `handleAction` routing |
| Hold status/error | `holdStatus["phase_payment"]` / `holdError["phase_payment"]` |

### activeSurfaceElement Updated

```typescript
: activeSurface === "phase_payment" ? renderPhasePaymentSurface()
```

Added between `measures_eval_email_contract` and `educate_eval` dispatch cases.

### renderReserveSeatSurface Offering Routing Updated

Offering `onClick` now checks `sectionMap.has("phase_payment")` first:

```typescript
onClick={() => {
  if (sectionMap.has("phase_payment")) {
    navigateSurface("phase_payment")
    return
  }
  // legacy offering routing follows
}}
```

When `phase_payment` is active and anon-readable, all seat offering selections route to `phase_payment` instead of the legacy `foundation_offering`/`systems_offering` surfaces. Legacy routing preserved as fallback for when `phase_payment` is not present.

---

## DEPRECATED ROUTES

No deprecated encounter rows deleted. Deprecated surfaces remain reachable via legacy aliases but are NOT accessible from the registered public flow after path-choice correction.

| Deprecated encounter | Status |
|---|---|
| `educate_eval_encounter` | Retained, not in registered path |
| `iis_eval_gate1` | Retained, not in registered path |
| `cohort_conversion_encounter` | Retained, not in registered path |
| `understand_failure` | Retained, not reachable from path choice (action removed) |
| `foundation_offering` | Retained, not in registered path (phase_payment takes precedence) |
| `systems_offering` | Retained, not in registered path (phase_payment takes precedence) |
| `systems_seat_hold` | Retained, not in registered path |

---

## REGISTERED RUNTIME SEQUENCE

The registered public flow is now fully routable in browser:

```
ai_isnt_broken_intro
    ↓
evaluate_structure_path
    ├─ eval_passage (left: route_eval_passage)
    │      ↓ (connect_src present)
    │   connect_src [connectSrcNextEncounter = "measures_assessment"]
    │      ↓
    │   measures_assessment → measures_phases_reveal
    │
    └─ structure_passage (right: route_structure_passage)
           ↓
        connect_src [connectSrcNextEncounter = "structured_eval"]
           ↓
        structured_eval → measures_phases_reveal

measures_phases_reveal
    ↓
about_measures_registry
    ↓
structural_drift_dispatches (structural_drift_publication)
    ↓ (evalReport present)
measures_eval_email_contract
    ↓
reserve_seat
    ↓
phase_payment (hold surface — seat capture, no real payment)
```

---

## VALIDATION CONFIRMATIONS

| Check | Result |
|---|---|
| DB rows updated | 7 (6 activation + 1 path-choice correction) |
| Deprecated rows deleted | No |
| Assessment scoring altered | No |
| Email dispatch implemented | No |
| Payment logic exposed | No (`phase_payment` uses `hold_surface` renderer — seat hold capture only) |
| Phase reveal included in email package | No |
| CSS files modified | No |
| Renderer architecture redesigned | No |
| Sitewide contract bindings changed | No |
| All 13 anon-readable | Yes |
| Build result | ✓ clean |
| TypeScript errors | None |

---

## READBACK (from execute script)

```json
{
  "db_connection": "ok",
  "all_13_anon_readable": true,
  "anon_readback_count": 13,
  "anon_readback_missing": [],
  "db_rows_updated": 7,
  "db_state_changed": true,
  "deprecated_routes_exposed": false,
  "assessment_scoring_altered": false,
  "email_dispatch_implemented": false,
  "payment_logic_exposed": false,
  "css_modified": false
}
```

---

## CLOSEOUT

All 13 registered public encounters are now active and anon-readable. The `evaluate_structure_path` path-choice routes to `eval_passage` (left) and `structure_passage` (right) per the seated `path_action_contract`. The `phase_payment` surface is now reachable as the forward route from `reserve_seat`. The full registered 13 public runtime flow is routable in browser for visual QA.

OAR1 ready for operator review.

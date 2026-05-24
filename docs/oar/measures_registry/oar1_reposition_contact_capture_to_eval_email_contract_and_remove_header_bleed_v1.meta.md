---
document_type: oar1
authority_level: working
document_scope: measures_registry_runtime_qa
title: OAR1 — Reposition Contact Capture to Eval Email Contract and Remove Header Bleed
status: closed
version: v1
operator: op044
system: measures_registry
source_oar2: docs/oar/measures_registry/oar2_reposition_contact_capture_to_eval_email_contract_and_remove_header_bleed_v1.meta.md
executor: claude_vs
tags:
  - oar1
  - measures-registry
  - runtime-qa
  - contact-capture
  - eval-email-contract
  - header-bleed
  - registered-runtime
  - codex-first
---

# OAR1 — Reposition Contact Capture to Eval Email Contract and Remove Header Bleed

## OBJECTIVE

Execute for:

`docs/oar/measures_registry/oar2_reposition_contact_capture_to_eval_email_contract_and_remove_header_bleed_v1.meta.md`

Remove header bleed (c3 Field, Contact nav links) from the Measures Registry runtime. Reposition contact/delivery capture from `connect_src` pre-assessment gate to `measures_eval_email_contract` post-assessment surface. Apply bounded corrections. Confirm build.

---

## 1. HEADER BLEED — SOURCE AND CORRECTION

### Source

`renderHeader()` in `src/measures_registry/MeasuresRegistryRuntime.tsx` line 1726:

```typescript
const header = headerOverride ?? pathChoiceCopy.header
```

When called without arguments, `renderHeader()` defaulted to `pathChoiceCopy.header` — the header contract from the `evaluate_structure_path` (landing_path_choice) encounter. This encounter's `metadata.header.actions` contained "c3 Field" and "Contact" global nav action buttons, which appeared in the `registry-public-nav` on every surface that called `renderHeader()` without an explicit header override (including path_choice at line 2197).

### Correction

Changed the default to `null`:

```typescript
const header = headerOverride ?? null
```

When no header is passed, `renderHeader()` now renders only the brand area (registry mark + no title). No global nav actions bleed through from the path_choice header contract.

Surfaces that pass explicit headers or `actionsOverride` are unaffected. The `pathChoiceCopy.header` DB data is untouched.

### Result

`c3 Field` and `Contact` nav links no longer appear in the Measures Registry header on any surface. Measures Registry header shows only the registry mark (and any encounter-specific header title/actions where explicitly seated).

---

## 2. CONNECT_SRC STANDING AFTER REMOVAL FROM ACTIVE FLOW

### Before

```
eval_passage
    -> connect_src (soft SRC intake)
    -> measures_assessment

structure_passage
    -> connect_src (soft SRC intake)
    -> structured_eval
```

### After

```
eval_passage
    -> measures_assessment (direct)

structure_passage
    -> structured_eval (direct)
```

`connect_src` is no longer reached from the registered public flow.

- Surface remains in dispatcher — accessible via `?surface=connect_src` URL
- `is_active` unchanged — encounter row retained
- DB metadata updated: `standing: "held_pre_assessment_intake"`, `standing_note` explaining the held status
- `renderConnectSrcSurface()` unchanged — the soft SRC intake form remains functional if accessed directly

### Code changes

`renderEducationalDiagnosticPassageSurface` — three navigation points (video onEnded + 2 Continue buttons):

| Before | After |
|---|---|
| `sectionMap.has("connect_src")` check → `setConnectSrcNextEncounter` → `navigateSurface("connect_src")` | `navigateSurface("measures_assessment")` directly |
| DEV debug logs with connect_src routing info | removed with the routing logic |

`renderStructurePassageSurface` — `navigateToStructuredEval()`:

| Before | After |
|---|---|
| `setConnectSrcNextEncounter("structured_eval")` then `navigateSurface("connect_src")` | `navigateSurface("structured_eval")` directly |

---

## 3. ASSESSMENT COMPLETION ROUTE

### measures_assessment

| Prop | Before | After |
|---|---|---|
| `onEnterStructuredEnvironment` | `navigateSurface("measures_phases_reveal")` | `navigateSurface("measures_eval_email_contract")` |
| `onStructuredEnvironmentVideoEnded` | `navigateSurface("measures_phases_reveal")` | `navigateSurface("measures_eval_email_contract")` |

### structured_eval

| Prop | Before | After |
|---|---|---|
| `onEnterStructuredEnvironment` | `navigateSurface("measures_phases_reveal")` | `navigateSurface("measures_eval_email_contract")` |
| `onStructuredEnvironmentVideoEnded` | `navigateSurface("measures_phases_reveal")` | `navigateSurface("measures_eval_email_contract")` |

Assessment scoring: unchanged. Assessment questions: unchanged. Structured eval mechanics: unchanged. No fork introduced.

---

## 4. MEASURES_EVAL_EMAIL_CONTRACT — CONVERTED TO DELIVERY INTAKE

### Before

Static display: email contract subject/preheader text, assessment package summary if available, "Reserve Seat" button → `navigateSurface("reserve_seat")`.

### After

Post-assessment delivery/contact intake form:

1. Encounter title/eyebrow from metadata
2. Instruction text: `measuresEvalEmailCopy.subtitle ?? "Your assessment is being generated. Enter where the completed assessment package and recommended structural response should be sent."`
3. Assessment package summary (evalReport) displayed if available — unchanged
4. Delivery contact form (`registry-iis-eval-form`):
   - Institution / Company Name (`institution_name`, text)
   - Business Type (`institution_type`, text)
   - Contact Name (`contact_name`, text)
   - Contact Email (`contact_email`, email)
   - Fields pre-populated from `evalFields` state (which was filled during assessment `src_capture` step)
5. Submit → `navigateSurface("measures_phases_reveal")`

**Storage behavior:** Delivery fields read from and write back to `evalFields` runtime state (same state used by assessment src_capture). Fields were already captured during assessment intake. No new DB table. No email dispatch. Persistent delivery record storage flagged as future OAR need if required.

**No `connect_src.is_active` change:** connect_src remains anon-readable. Its held standing is documented only in metadata.

---

## 5. STRUCTURAL DRIFT PUBLICATION CTA — UPDATED

Two "Continue to Assessment Package" buttons (shown when `evalReport` is present) that previously routed to `measures_eval_email_contract` — updated to route to `reserve_seat`:

| Location | Before | After |
|---|---|---|
| `renderStructuralDriftDispatchesSurface` evalReport CTA (line 3490) | `navigateSurface("measures_eval_email_contract")` | `navigateSurface("reserve_seat")` |
| `renderPublicationDispatchSurface` evalReport CTA (line 3618) | `navigateSurface("measures_eval_email_contract")` | `navigateSurface("reserve_seat")` |

This prevents routing backward into the email contract (delivery intake) after it has already been completed in the assessment flow.

---

## 6. ASSESSMENT MECHANICS — CONFIRMED UNCHANGED

| Check | Status |
|---|---|
| measures_assessment scoring | ✓ unchanged |
| structured_eval scoring | ✓ unchanged — still references measures_assessment mechanics |
| Assessment questions | ✓ unchanged |
| Result interpretation | ✓ unchanged |
| No scoring fork | ✓ |
| No email dispatch | ✓ |
| No payment logic | ✓ |

---

## 7. BRANCH VALIDATION

### Left branch

```
eval_passage
    -> measures_assessment (direct — no connect_src gate)
    -> measures_eval_email_contract (delivery intake)
    -> measures_phases_reveal
    -> about_measures_registry
    -> structural_drift_dispatches
    -> reserve_seat
    -> phase_payment
```

✓ intact.

### Right branch

```
structure_passage
    -> structured_eval (direct — no connect_src gate)
    -> measures_eval_email_contract (delivery intake)
    -> measures_phases_reveal
    -> (converged with left)
```

✓ intact.

### Converged branch

```
measures_phases_reveal
    -> about_measures_registry
    -> structural_drift_dispatches
    -> reserve_seat (after structural drift — no backward email contract loop)
    -> phase_payment
```

✓ intact. No backward loop to email contract.

### No deprecated route bleed

| Surface | Reachable from registered flow |
|---|---|
| `cohort_conversion_encounter` | No |
| `educate_eval_encounter` | No |
| `iis_eval_gate1` | No |
| `understand_failure` | No |
| `foundation_offering` | No |
| `systems_offering` | No |
| `systems_seat_hold` | No |
| `connect_src` (as gate) | No — removed from registered flow; marked held |

---

## BUILD RESULT

```
npm run build:registry
✓ built in 3.74s
```

No TypeScript errors. No scoring fork. No email dispatch. No payment logic. No deprecated route bleed.

---

## FILES MODIFIED

| File | Change |
|---|---|
| `src/measures_registry/MeasuresRegistryRuntime.tsx` | renderHeader default → null; eval_passage → measures_assessment direct; structure_passage navigateToStructuredEval → structured_eval direct; measures_assessment/structured_eval completion → measures_eval_email_contract; renderMeasuresEvalEmailContractSurface converted to delivery intake form; structural_drift CTA evalReport route → reserve_seat |

## DB ROWS MODIFIED

| Table | Row | Change |
|---|---|---|
| `measures_encounter_def` | `eval_passage` | `continue_to_evaluation` target: `connect_src` → `measures_assessment` |
| `measures_encounter_def` | `connect_src` | Added `standing: "held_pre_assessment_intake"`, `standing_note` |
| `measures_encounter_def` | `measures_eval_email_contract` | Added `route_after_capture: "measures_phases_reveal"` |

Total: 3 rows updated.

## INSPECTION / EXECUTION ARTIFACTS

| Script | Purpose |
|---|---|
| `execute-reposition-contact-capture-v1.cjs` | DB corrections: eval_passage target, connect_src held marker, email contract route |

---

## READBACK

| Check | Result |
|---|---|
| Header bleed source | `pathChoiceCopy.header` used as default in `renderHeader()` — contained c3 Field / Contact nav |
| Header correction | Default changed to `null` — renders brand only, no leaked nav |
| connect_src before | Pre-assessment gate: eval_passage → connect_src → measures_assessment |
| connect_src after | Held — not reached from registered flow; marked in DB metadata |
| measures_assessment old route | → `measures_phases_reveal` |
| measures_assessment new route | → `measures_eval_email_contract` |
| structured_eval old route | → `measures_phases_reveal` |
| structured_eval new route | → `measures_eval_email_contract` |
| measures_eval_email_contract fields | institution_name, institution_type, contact_name, contact_email (from evalFields, pre-populated from src_capture) |
| Route after email contract capture | `measures_phases_reveal` |
| Left branch | ✓ clean |
| Right branch | ✓ clean |
| Converged branch | ✓ clean, no backward loop |
| Build | ✓ clean 3.74s |
| No scoring fork | ✓ |
| No email dispatch | ✓ |
| No payment logic | ✓ |
| No deprecated route bleed | ✓ |

---

## CONFIRMATION

| Condition | Status |
|---|---|
| c3 Field / Contact no longer in Measures Registry header | ✓ |
| Contact capture no longer before assessment | ✓ |
| After final evaluation question → measures_eval_email_contract | ✓ |
| Both registered branches → measures_phases_reveal after email contract | ✓ |
| No deprecated route bleed remains | ✓ |
| No scoring fork | ✓ |
| No email dispatch | ✓ |
| No payment logic exposed | ✓ |
| No deprecated rows deleted | ✓ |
| No UI redesign | ✓ |
| No new DB tables | ✓ |
| No assessment mechanics changed | ✓ |
| connect_src not deleted | ✓ (marked held) |
| Registered 13 sequence unchanged | ✓ |
| Frontend renders seated Codex state only | ✓ |

---

## CLOSEOUT

Header bleed removed. The Measures Registry header now renders only the registry brand.

Contact capture repositioned. The user flow is now:

```
eval_passage / structure_passage
    -> assessment
    -> measures_eval_email_contract (delivery intake while assessment package generated)
    -> measures_phases_reveal
    -> about_measures_registry
    -> structural_drift_dispatches
    -> reserve_seat
    -> phase_payment
```

`connect_src` is retained, marked held, and documented as future institutional intake surface. Not reachable from the registered public flow.

Build is clean. Registered runtime is ready for visual QA.

OAR1 ready for operator review.

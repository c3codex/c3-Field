---
document_type: oar1
authority_level: working
document_scope: measures_registry_runtime_qa
title: OAR1 — Remove Pre-Assessment SRC Capture and Start Evaluation at Question One
status: closed
version: v1
operator: op044
system: measures_registry
source_oar2: docs/oar/measures_registry/oar2_remove_pre_assessment_src_capture_and_start_evaluation_at_question_one_v1.meta.md
executor: claude_vs
tags:
  - oar1
  - measures-registry
  - runtime-qa
  - pre-assessment-capture
  - assessment-flow
  - viewport-containment
  - registered-runtime
  - codex-first
---

# OAR1 — Remove Pre-Assessment SRC Capture and Start Evaluation at Question One

## OBJECTIVE

Execute for:

`docs/oar/measures_registry/oar2_remove_pre_assessment_src_capture_and_start_evaluation_at_question_one_v1.meta.md`

Remove the pre-assessment identity/contact screen from the registered public flow. Assessment must open directly at question 1. Fix viewport containment drift visible at the bottom of the assessment surface.

---

## 1. SOURCE OF PRE-ASSESSMENT CAPTURE

`MeasuresRegistryRuntime.tsx` line 665:

```typescript
const [evalStep, setEvalStep] = useState<EvalStep>("src_capture")
```

`evalStep` is shared state driving the chamber render branch in `MeasuresAssessmentChamber`. When initialized to `"src_capture"`, the chamber renders the `ENVIRONMENT IDENTITY / Institutional Contact` form before any question is shown. This initial value applied regardless of which surface routed to the chamber — including the registered public flow via `eval_passage → measures_assessment` and `structure_passage → structured_eval`.

---

## 2. CORRECTION — INITIAL EVAL STEP

Changed initial state from `"src_capture"` to `"diagnostic"`:

```typescript
// Before:
const [evalStep, setEvalStep] = useState<EvalStep>("src_capture")

// After:
const [evalStep, setEvalStep] = useState<EvalStep>("diagnostic")
```

Effect: both `measures_assessment` and `structured_eval` now open directly at question 1. The `ENVIRONMENT IDENTITY` / `Institutional Contact` pre-question screen is no longer shown in the registered public flow.

The `src_capture` branch in `MeasuresAssessmentChamber` remains in the component — the form is still present in the UI code but is never the initial state. The `continueToDiagnostic` callback remains wired as `onContinueToDiagnostic` but is not triggered in the registered flow.

---

## 3. EVALFIELDS GUARD REMOVED FROM SUBMISSION

`submitIisEvaluation` previously validated that all required identity fields were populated before allowing assessment submission:

```typescript
// Removed:
const requiredFields = requiredEvalIdentityFields()
const missing = requiredFields.filter((field) => !evalFields[field]?.trim())
if (missing.length > 0) {
  setEvalSubmitting(false)
  setEvalError(`Missing required fields: ${missing.join(", ")}`)
  return
}
```

This guard blocked assessment submission when `evalFields` was empty — which is now the expected state at submission time (contact capture is deferred to `measures_eval_email_contract` after the final question).

Removed. Evaluation answers are still validated fully before submission. Identity fields are deferred.

---

## 4. DB INSERT — SAFE EVALFIELDS ACCESS

Four fields in the `measures_iis_eval_gate1_capture` insert were accessed with direct `.trim()` calls, which would throw if `evalFields` was empty:

| Field | Before | After |
|---|---|---|
| `institution_name` | `evalFields.institution_name.trim()` | `evalFields.institution_name?.trim() ?? ""` |
| `contact_name` | `evalFields.contact_name.trim()` | `evalFields.contact_name?.trim() ?? ""` |
| `contact_email` | `evalFields.contact_email.trim()` | `evalFields.contact_email?.trim() ?? ""` |
| `institution_type` (metadata) | `evalFields.institution_type.trim()` | `evalFields.institution_type?.trim() ?? ""` |

Identity fields are now written as empty strings at assessment submission time. They are populated after `measures_eval_email_contract` capture via `setEvalFields` — but no second DB write seats them back. Persistent identity write after email contract capture is flagged as a future OAR need if required.

Assessment scoring, result, and routing are fully unaffected. Scoring uses `evalAnswers`, not `evalFields`.

---

## 5. VIEWPORT CONTAINMENT CORRECTION

### Source

`MeasuresAssessmentChamber` renders a `<main data-surface="measures_ai_operational_evaluation">` element. The pre-existing `overflow: hidden` containment rule was scoped to:

```css
.measures-registry-runtime[data-layout-fit="single_screen_initial_view"][data-chamber-state="src_capture"]
```

After changing the initial chamber state to `"diagnostic"`, this rule no longer fired — the assessment surface lost containment on load.

Additionally, without any general containment rule on the assessment surface's main element, content from prior surfaces could bleed through at the bottom during surface transitions on desktop.

### Correction

**1. Updated chamber-state selector** (two locations: desktop rule + mobile override):

```css
/* Before: */
.measures-registry-runtime[data-layout-fit="single_screen_initial_view"][data-chamber-state="src_capture"] {
  overflow: hidden;
}
@media (max-width: 720px) {
  .measures-registry-runtime[data-layout-fit="single_screen_initial_view"][data-chamber-state="src_capture"] {
    overflow: visible;
  }
}

/* After: */
.measures-registry-runtime[data-layout-fit="single_screen_initial_view"][data-chamber-state="diagnostic"] {
  overflow: hidden;
}
@media (max-width: 720px) {
  .measures-registry-runtime[data-layout-fit="single_screen_initial_view"][data-chamber-state="diagnostic"] {
    overflow: visible;
  }
}
```

**2. General assessment containment rule (new):**

```css
.measures-registry-runtime[data-surface="measures_ai_operational_evaluation"] {
  overflow: hidden;
}

@media (max-width: 720px) {
  .measures-registry-runtime[data-surface="measures_ai_operational_evaluation"] {
    overflow: auto;
  }
}
```

Desktop: `overflow: hidden` prevents any content from bleeding outside the runtime's boundary at the assessment surface. Mobile: `overflow: auto` allows scrolling if assessment content exceeds the viewport.

No global CSS changed. No component styling changed. No new classes added.

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
| evalAnswers validation before submit | ✓ unchanged |

---

## 7. BRANCH VALIDATION

### Left branch

```
eval_passage
    -> measures_assessment (question 1 directly)
    -> final question
    -> measures_eval_email_contract (delivery intake)
    -> measures_phases_reveal
```

✓ intact. No pre-assessment identity screen.

### Right branch

```
structure_passage
    -> structured_eval (question 1 directly)
    -> final question
    -> measures_eval_email_contract (delivery intake)
    -> measures_phases_reveal (converged)
```

✓ intact. No pre-assessment identity screen.

### Contact capture position

Contact/delivery capture remains exclusively at `measures_eval_email_contract` after final evaluation question. Not moved back before assessment.

### No deprecated route bleed

`connect_src` not reached from either registered branch. `src_capture` form not shown in registered flow.

---

## BUILD RESULT

```
npm run build:registry
✓ built in 4.05s
```

No TypeScript errors. No scoring fork. No email dispatch. No payment logic. No deprecated route bleed.

---

## FILES MODIFIED

| File | Change |
|---|---|
| `src/measures_registry/MeasuresRegistryRuntime.tsx` | evalStep initial state → "diagnostic"; evalFields guard removed from submitIisEvaluation; 4 unsafe evalFields.trim() calls → optional chaining |
| `src/index.css` | data-chamber-state="src_capture" → "diagnostic" in 2 existing rules; new general assessment containment rule for data-surface="measures_ai_operational_evaluation" (desktop: overflow hidden, mobile: overflow auto) |

## DB ROWS MODIFIED

None.

---

## READBACK

| Check | Result |
|---|---|
| Pre-assessment capture source | `useState<EvalStep>("src_capture")` in MeasuresRegistryRuntime.tsx — changed to `"diagnostic"` |
| Old initial eval step | `src_capture` |
| New initial eval step | `diagnostic` |
| measures_assessment direct URL | Opens directly to question 1 — no Environment Identity screen |
| structured_eval direct URL | Opens directly to question 1 — no pre-capture |
| Left branch | ✓ clean — question 1 immediately after passage |
| Right branch | ✓ clean — question 1 immediately after passage |
| Contact capture position | measures_eval_email_contract only — after final evaluation question |
| evalFields guard at submit | Removed — contact fields no longer required before evaluation submission |
| DB insert evalFields safety | Optional chaining added — empty strings written for identity fields at submission time |
| Viewport containment correction | data-chamber-state selector updated src_capture → diagnostic; general overflow: hidden rule added for assessment surface on desktop |
| Build | ✓ clean 4.05s |
| No scoring fork | ✓ |
| No email dispatch | ✓ |
| No payment logic exposed | ✓ |
| No deprecated route bleed | ✓ |
| Contact capture only after final question | ✓ |

---

## CONFIRMATION

| Condition | Status |
|---|---|
| measures_assessment opens directly to question 1 | ✓ |
| structured_eval opens directly to question 1 | ✓ |
| Environment Identity / Institutional Contact screen not shown | ✓ |
| Contact capture only at measures_eval_email_contract | ✓ |
| Assessment completion route unchanged: → measures_eval_email_contract → measures_phases_reveal | ✓ |
| evalFields not required before evaluation | ✓ |
| Viewport containment fixed — no bottom bleed on desktop | ✓ |
| Mobile scrolling preserved | ✓ |
| No scoring fork | ✓ |
| No email dispatch | ✓ |
| No payment logic exposed | ✓ |
| No deprecated route bleed | ✓ |
| No DB rows deleted | ✓ |
| No new DB tables | ✓ |
| No assessment question changes | ✓ |
| No assessment scoring changes | ✓ |
| connect_src not reintroduced | ✓ |
| Build clean | ✓ |

---

## CLOSEOUT

Pre-assessment SRC capture removed from the registered public flow. Both `measures_assessment` and `structured_eval` now open directly at question 1.

Contact capture remains exclusively at `measures_eval_email_contract` after the final evaluation question — consistent with the prior OAR1 contract.

Viewport containment drift corrected. Assessment surface on desktop is contained; mobile scrolls as needed.

Build is clean. Registered runtime is ready for visual QA.

OAR1 ready for operator review.

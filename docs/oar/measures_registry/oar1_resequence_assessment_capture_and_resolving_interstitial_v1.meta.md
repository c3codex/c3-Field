---
document_type: oar1
authority_level: working
document_scope: measures_registry_runtime_qa
title: OAR1 — Resequence Assessment Capture and Resolving Interstitial
status: closed
version: v1
operator: op044
system: measures_registry
source_oar2: docs/oar/measures_registry/oar2_resequence_assessment_capture_and_resolving_interstitial_v1.meta.md
executor: claude_vs
tags:
  - oar1
  - measures-registry
  - runtime-qa
  - assessment-flow
  - eval-email-contract
  - resolving-interstitial
  - registered-runtime
  - codex-first
---

# OAR1 — Resequence Assessment Capture and Resolving Interstitial

## OBJECTIVE

Execute for:

`docs/oar/measures_registry/oar2_resequence_assessment_capture_and_resolving_interstitial_v1.meta.md`

Resequence the resolving interstitial so it appears after delivery field submission on `measures_eval_email_contract`, not immediately after the final assessment question. Enforce minimum 4-second interstitial duration before routing to `measures_phases_reveal`.

---

## 1. SOURCE OF RESOLVING INTERSTITIAL

`MeasuresRegistryRuntime.tsx` — `submitIisEvaluation` (async function):

```typescript
setEvalStep("resolving")
await new Promise((resolve) => window.setTimeout(resolve, 1200))
```

`setEvalStep("resolving")` caused `MeasuresAssessmentChamber` to render the resolving view:

```tsx
<div className="registry-eval-resolution registry-assessment-resolving">
  <span>Resolving environmental standing</span>
  <h2>Reviewing operating conditions.</h2>
  ...
</div>
```

This fired immediately after the final assessment question was submitted — before the user reached `measures_eval_email_contract`. The interstitial ran for 1200ms, then the DB insert completed, then `setEvalSubmitted(true)` fired, then `MeasuresAssessmentResult` showed, then the user clicked through to `measures_eval_email_contract`.

The resolving interstitial was positioned at the wrong point in the sequence.

---

## 2. CORRECTION — REMOVE RESOLVING FROM ASSESSMENT SUBMISSION

Removed from `submitIisEvaluation`:

```typescript
// Removed:
setEvalStep("resolving")
await new Promise((resolve) => window.setTimeout(resolve, 1200))
```

After removal, `submitIisEvaluation` proceeds directly from interpretation resolution to DB insert. `evalStep` remains `"diagnostic"` throughout assessment submission. No interstitial is shown during assessment submission.

### Side fix — `requiredFields` dangling reference

The removed guard block (`const requiredFields = requiredEvalIdentityFields()` + missing-field validation) had left a dangling reference: `visible_src_fields: requiredFields` in the DB metadata insert (line 2017) had no corresponding declaration in `submitIisEvaluation`.

Added the declaration before the DB insert:

```typescript
const requiredFields = requiredEvalIdentityFields()
```

This restores the intended metadata tracking of visible src fields without reinstating the validation guard.

---

## 3. RESOLVING INTERSTITIAL MOVED TO MEASURES_EVAL_EMAIL_CONTRACT

### New state

```typescript
const [emailContractResolving, setEmailContractResolving] = useState(false)
```

Added after `evalSubmitted` in the runtime state block.

### Early return in renderMeasuresEvalEmailContractSurface

When `emailContractResolving` is true, `renderMeasuresEvalEmailContractSurface` returns an interstitial surface instead of the delivery form:

```tsx
if (emailContractResolving) {
  return (
    <main
      className="measures-registry-runtime"
      data-surface="measures_eval_email_contract"
      data-resolving="true"
      style={registryTokenStyle}
    >
      <div className="registry-eval-resolution registry-assessment-resolving">
        <span>Resolving environmental standing</span>
        <h2>Reviewing operating conditions.</h2>
        <ol>
          <li>Resolving environmental standing...</li>
          <li>Reviewing operating conditions...</li>
          <li>Assessing implementation structure...</li>
        </ol>
      </div>
    </main>
  )
}
```

Text: existing assessment chamber copy ("Resolving environmental standing / Reviewing operating conditions."). No new public copy invented.

### Form onSubmit updated

```typescript
// Before:
onSubmit={(event) => {
  event.preventDefault()
  navigateSurface("measures_phases_reveal")
}}

// After:
onSubmit={(event) => {
  event.preventDefault()
  setEmailContractResolving(true)
  window.setTimeout(() => navigateSurface("measures_phases_reveal"), 4000)
}}
```

On delivery field submission:
1. `setEmailContractResolving(true)` — interstitial renders immediately
2. `window.setTimeout(..., 4000)` — navigation to `measures_phases_reveal` fires after 4000ms minimum

No email dispatch. No DB write. No payment logic.

---

## 4. VIEWPORT CONTAINMENT — RESOLVING INTERSTITIAL

New CSS rule scoped to `data-resolving="true"` on the email contract surface:

```css
.measures-registry-runtime[data-surface="measures_eval_email_contract"][data-resolving="true"] {
  overflow: hidden;
  min-height: 100svh;
}
```

Prevents background/prior surface peek-through during the interstitial. No global CSS changed. Attribute only present when `emailContractResolving` is true.

---

## 5. FLOW TIMING — BEFORE / AFTER

### Before

```
final assessment question submitted
  -> setEvalStep("resolving") — interstitial shown in assessment chamber
  -> 1200ms pause
  -> DB insert
  -> setEvalSubmitted(true) → MeasuresAssessmentResult shown
  -> user clicks "Enter Structured Environment"
  -> navigateSurface("measures_eval_email_contract")
  -> user fills delivery fields
  -> navigateSurface("measures_phases_reveal")
```

### After

```
final assessment question submitted
  -> DB insert (direct — no interstitial)
  -> setEvalSubmitted(true) → MeasuresAssessmentResult shown
  -> user clicks "Enter Structured Environment"
  -> navigateSurface("measures_eval_email_contract")
  -> user fills delivery fields
  -> setEmailContractResolving(true) — interstitial shown in email contract surface
  -> 4000ms minimum duration
  -> navigateSurface("measures_phases_reveal")
```

---

## 6. BRANCH VALIDATION

### Left branch

```
eval_passage
    -> measures_assessment (question 1 directly)
    -> final question → submit
    -> MeasuresAssessmentResult
    -> measures_eval_email_contract (delivery form — no interstitial)
    -> submit delivery fields
    -> resolving interstitial >= 4 seconds
    -> measures_phases_reveal
```

✓ intact. No resolving interstitial before contact capture.

### Right branch

```
structure_passage
    -> structured_eval (question 1 directly)
    -> final question → submit
    -> MeasuresAssessmentResult
    -> measures_eval_email_contract (delivery form — no interstitial)
    -> submit delivery fields
    -> resolving interstitial >= 4 seconds
    -> measures_phases_reveal
```

✓ intact. No resolving interstitial before contact capture.

### Direct URL behavior

`?surface=measures_assessment` — opens at question 1, no pre-question capture, no resolving interstitial before final question/contact capture. ✓

`?surface=structured_eval` — opens at question 1, no pre-question capture, no resolving interstitial before final question/contact capture. ✓

---

## 7. ASSESSMENT MECHANICS — CONFIRMED UNCHANGED

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

## BUILD RESULT

```
npm run build:registry
✓ built in 3.62s
```

No TypeScript errors. No scoring fork. No email dispatch. No payment logic. No deprecated route bleed.

---

## FILES MODIFIED

| File | Change |
|---|---|
| `src/measures_registry/MeasuresRegistryRuntime.tsx` | Added `emailContractResolving` state; removed `setEvalStep("resolving")` + 1200ms pause from `submitIisEvaluation`; added `requiredFields` declaration to fix dangling reference; added early interstitial return to `renderMeasuresEvalEmailContractSurface`; updated form `onSubmit` to trigger 4000ms resolving interstitial then `measures_phases_reveal` |
| `src/index.css` | Added viewport containment rule for `[data-surface="measures_eval_email_contract"][data-resolving="true"]`: `overflow: hidden; min-height: 100svh` |

## DB ROWS MODIFIED

None.

---

## READBACK

| Check | Result |
|---|---|
| Resolving interstitial source | `setEvalStep("resolving")` + `await new Promise(resolve, 1200)` in `submitIisEvaluation` — appeared immediately after final assessment question |
| Old flow timing | interstitial shown for 1200ms during assessment submission, before MeasuresAssessmentResult |
| New flow timing | no interstitial during assessment submission; interstitial shown for ≥4000ms after delivery field submission on measures_eval_email_contract |
| Interstitial appears before contact capture | No — removed from assessment submission path |
| Interstitial appears after delivery submit | Yes — triggered by measures_eval_email_contract form submit |
| Minimum interstitial duration | 4000ms enforced via window.setTimeout |
| Route after interstitial | measures_phases_reveal |
| measures_assessment branch | ✓ clean |
| structured_eval branch | ✓ clean |
| direct measures_assessment URL | Starts at question 1, no resolving interstitial before contact capture |
| direct structured_eval URL | Starts at question 1, no resolving interstitial before contact capture |
| Viewport containment | data-resolving="true" rule added: overflow hidden, min-height 100svh |
| Build | ✓ clean 3.62s |
| No scoring fork | ✓ |
| No email dispatch | ✓ |
| No payment logic exposed | ✓ |
| No deprecated route bleed | ✓ |

---

## CONFIRMATION

| Condition | Status |
|---|---|
| Resolving interstitial does not appear after final evaluation question | ✓ |
| Resolving interstitial appears only after delivery fields submitted | ✓ |
| Interstitial displays for at least 4 seconds | ✓ |
| Route after interstitial is measures_phases_reveal | ✓ |
| measures_eval_email_contract delivery fields preserved | ✓ (institution_name, institution_type, contact_name, contact_email) |
| Contact capture not reintroduced before assessment | ✓ |
| Assessment questions unchanged | ✓ |
| Assessment scoring unchanged | ✓ |
| No scoring fork | ✓ |
| No email dispatch | ✓ |
| No payment logic exposed | ✓ |
| No deprecated route bleed | ✓ |
| No new DB tables | ✓ |
| No DB rows deleted | ✓ |
| No UI redesign | ✓ |
| Viewport containment corrected for resolving interstitial | ✓ |
| Build clean | ✓ |

---

## CLOSEOUT

Resolving interstitial resequenced. It no longer appears immediately after the final assessment question.

New sequence:

```
final question → submit
    → MeasuresAssessmentResult (assessment report shown)
    → user enters "Enter Structured Environment"
    → measures_eval_email_contract (delivery form)
    → user submits delivery fields
    → resolving interstitial (≥ 4 seconds)
    → measures_phases_reveal
```

`requiredFields` dangling reference in `submitIisEvaluation` DB metadata insert corrected.

Viewport containment applied to interstitial surface. Build is clean. Registered runtime is ready for visual QA.

OAR1 ready for operator review.

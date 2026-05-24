---
document_type: oar1
authority_level: working
document_scope: measures_registry_registered_runtime
title: OAR1 — Correct RegisteredPassage Eval Video and Assessment Email Capture Route
status: executor_complete
version: v1
operator: op044
system: measures_registry
source_oar2: docs/oar/measures_registry/oar2_correct_registered_passage_eval_video_and_assessment_email_capture_route_v1.meta.md
executor: claude_vs
tags:
  - oar1
  - measures-registry
  - registered-runtime
  - passage-video
  - assessment-flow
  - email-capture
  - clean-shell
  - codex-first
---

# OAR1 — Correct RegisteredPassage Eval Video and Assessment Email Capture Route

## STATUS

Executor complete. One file modified. Build clean. Operator browser QA required per OAR2 §8 — executor cannot perform browser QA in this environment.

---

## ISSUE 1 — EVAL PASSAGE VIDEO FAILURE

### Root Cause

`eval_passage` dispatcher in `MeasuresRegistryRuntimeRegistered.tsx` hardcoded `passageVideoUrl={null}`:

```tsx
} else if (activeSurface === "eval_passage") {
  activeSurfaceElement = (
    <RegisteredPassage
      variant="eval"
      passageVideoUrl={null}   ← hardcoded null
      ...
```

`RegisteredPassage` correctly gates the `<video>` element on `passageVideoUrl`:
```tsx
{passageVideoUrl ? (
  <video src={passageVideoUrl} autoPlay muted={passageMuted} controls playsInline preload="auto" onEnded={onContinue} />
) : null}
```

With `null` passed, no video rendered on eval_passage. Structure passage was passing `passageVideoUrl={structuredEnvironmentPassageVideoUrl}` — only eval_passage was null.

Additionally, the correct media role (`explainer_video`) was absent from `REGISTERED_MEDIA_ROLES`, so even if the dispatcher had tried to use it, `mediaMap.get("explainer_video")` would have returned `undefined` and `mediaUrl()` would have returned `null`.

### DB Inspection

Script `inspect-eval-passage-media-roles-v1.cjs` confirmed:

| Field | Value |
|---|---|
| `eval_passage.metadata.media_roles` | `["explainer_video"]` |
| `eval_passage.metadata.renderer` | `diagnostic_explainer_passage` |
| `explainer_video` in media map | **active** — `structural_coherence_explainer_45s.mp4` (video/mp4) |
| `explainer_video` in `REGISTERED_MEDIA_ROLES` | **absent** — not queried by orchestrator |

### Fix Applied

**`MeasuresRegistryRuntimeRegistered.tsx` — change 1:** Added `"explainer_video"` to `REGISTERED_MEDIA_ROLES`:
```ts
const REGISTERED_MEDIA_ROLES = [
  "epigraph_video",
  "explainer_video",   ← added
  ...
] as const
```

**Change 2:** Derived URL constant alongside other media URLs:
```ts
const explainerVideoUrl = mediaUrl(mediaMap.get("explainer_video"))
```

**Change 3:** Wired to eval_passage dispatcher:
```tsx
<RegisteredPassage
  variant="eval"
  passageVideoUrl={explainerVideoUrl}   ← was null
  ...
```

---

## ISSUE 2 — ASSESSMENT RESULT SHOWN BEFORE EMAIL CAPTURE

### Root Cause

`submitIisEvaluation()` set `evalSubmitted(true)` without navigating:

```ts
setEvalReport(interpretation.report)
setEvalEmailArtifact(interpretation.emailArtifact)
setEvalSubmitted(true)
// ← no navigate() call
```

`MeasuresAssessmentChamber` renders `MeasuresAssessmentResult` when `evalSubmitted = true`:

```tsx
{evalSubmitted ? (
  <MeasuresAssessmentResult
    ...
    onEnterStructuredEnvironment={onEnterStructuredEnvironment}
    ...
  />
) : ...}
```

This caused the assessment result to render INSIDE the assessment chamber as a separate view. The user was required to click "Enter Structured Environment" (`onEnterStructuredEnvironment`) to navigate to `measures_eval_email_contract`. The result page appeared as a public surface BEFORE the delivery capture form.

`onEnterStructuredEnvironment` was correctly wired in `sharedAssessmentProps`:
```ts
onEnterStructuredEnvironment: () => navigate("measures_eval_email_contract"),
```

But the user had to explicitly click through the result page first.

### Fix Applied

**`MeasuresRegistryRuntimeRegistered.tsx` — change 4:** Added `navigate("measures_eval_email_contract")` to `submitIisEvaluation` success path:

```ts
setEvalReport(interpretation.report)
setEvalEmailArtifact(interpretation.emailArtifact)
setEvalSubmitted(true)
navigate("measures_eval_email_contract")   ← added
```

React batches these state updates in the same render cycle. `activeSurface` becomes `"measures_eval_email_contract"` before `MeasuresAssessmentResult` can render. The assessment chamber unmounts; `MeasuresAssessmentResult` never appears as a public surface.

`evalReport` and `evalEmailArtifact` are set before navigation, so they are available on `measures_eval_email_contract` for display alongside the delivery form.

---

## ISSUE 3 — STRUCTURE PASSAGE VIDEO

**Confirmed unaffected.** Structure passage dispatcher (lines 714–726) passes `passageVideoUrl={structuredEnvironmentPassageVideoUrl}` unchanged. No modification made.

---

## MEASURES_EVAL_EMAIL_CONTRACT BEHAVIOR

**Confirmed correct as-seated:**

| Behavior | State |
|---|---|
| Delivery fields present | `institution_name`, `institution_type`, `contact_name`, `contact_email` — confirmed in `RegisteredEvalEmailContract` `DELIVERY_FIELDS` constant |
| Submit triggers resolving interstitial | `setEmailContractResolving(true)` on form submit |
| Resolving renders interstitial | `if (emailContractResolving) { return <...resolving view...> }` in renderer |
| 4-second minimum timer | `window.setTimeout(() => navigate("measures_phases_reveal"), 4000)` |
| Routes to measures_phases_reveal | Confirmed — `navigate("measures_phases_reveal")` |

No modification required.

---

## FILES MODIFIED

| File | Change |
|---|---|
| `src/measures_registry/registered_runtime/MeasuresRegistryRuntimeRegistered.tsx` | Added `"explainer_video"` to `REGISTERED_MEDIA_ROLES`; derived `explainerVideoUrl`; changed `passageVideoUrl={null}` to `passageVideoUrl={explainerVideoUrl}` on eval_passage dispatcher; added `navigate("measures_eval_email_contract")` to `submitIisEvaluation` success path |

---

## DB ROWS MODIFIED

None.

---

## EVAL_PASSAGE BEFORE / AFTER

| | Before | After |
|---|---|---|
| `passageVideoUrl` | `null` — hardcoded | `explainerVideoUrl` — derived from active `explainer_video` media role |
| Video renders | No | Yes — `structural_coherence_explainer_45s.mp4` |
| `explainer_video` in `REGISTERED_MEDIA_ROLES` | Absent | Present |

---

## STRUCTURE_PASSAGE BEFORE / AFTER

No change. `passageVideoUrl={structuredEnvironmentPassageVideoUrl}` was and remains correctly wired.

---

## FINAL QUESTION OLD / NEW ROUTE BEHAVIOR

| | Before | After |
|---|---|---|
| On submit success | Sets `evalSubmitted(true)` → shows `MeasuresAssessmentResult` | Sets `evalSubmitted(true)` → navigates to `measures_eval_email_contract` |
| Assessment result visible before capture | Yes — `MeasuresAssessmentResult` required user click to proceed | No — result generated silently in state; not displayed as standalone surface before capture |
| User action required to reach email contract | Yes — click "Enter Structured Environment" on result page | No — automatic navigation on submit success |

---

## RESOLVING INTERSTITIAL TIMING

`window.setTimeout(() => navigate("measures_phases_reveal"), 4000)` — 4000ms = 4 seconds minimum. Timer starts on email form submit. `emailContractResolving = true` is set synchronously in the same handler, so the resolving view renders immediately on submit, holds for 4 seconds, then routes to `measures_phases_reveal`.

---

## BUILD RESULT

```
✓ built in 3.69s
```

Pre-existing chunk size warning (~506 kB > 500 kB). Non-fatal. Not new.

---

## BROWSER QA OBLIGATION

Per OAR2 §8: "Do not close on build success alone. Browser visual QA is required."

Executor cannot perform browser QA. Operator must validate:

Left branch:
- `eval_passage` opens WITH video (`structural_coherence_explainer_45s.mp4` playing)
- Continue → `measures_assessment` questions render
- Final question submit → `measures_eval_email_contract` delivery form opens (no result page in between)
- Form submit → resolving interstitial appears for ≥4 seconds
- After resolving → `measures_phases_reveal` renders

Right branch:
- `structure_passage` opens WITH video (unchanged)
- Continue → `structured_eval` questions render
- Final question submit → `measures_eval_email_contract` delivery form opens (no result page in between)
- Form submit → resolving interstitial appears for ≥4 seconds
- After resolving → `measures_phases_reveal` renders

---

## CONFIRMATIONS

| Check | Result |
|---|---|
| Old runtime `MeasuresRegistryRuntime.tsx` not edited | Confirmed |
| No deprecated route bleed | Confirmed |
| No scoring fork | Confirmed — assessment scoring logic unchanged |
| No email dispatch | Confirmed — no SMTP or external mail call introduced |
| No payment logic exposed | Confirmed |
| Structure passage video unaffected | Confirmed |
| No hardcoded media URLs | Confirmed — `explainerVideoUrl` derived from `mediaMap.get("explainer_video")` |
| No hardcoded semantic copy | Confirmed |

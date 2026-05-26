---
document_type: oar1
authority_level: working
document_scope: measures_registry_registered_runtime
title: OAR1 — Correct Assessment Surface Routing and structured_eval Bypass
status: open
version: v1
operator: op044
system: measures_registry
source_oar2: docs/oar/measures_registry/oar2_correct_assessment_surface_routing_and_structured_eval_bypass_v1.meta.md
executor: claude_vs
tags:
  - oar1
  - measures-registry
  - assessment
  - structured-eval
  - routing
  - bypass
  - registered-runtime
  - codex-first
---

# OAR1 — Correct Assessment Surface Routing and structured_eval Bypass

## EXECUTION SUMMARY

Corrected the assessment surface routing bypass for `structured_eval`.

No DB mutations.

Runtime change: `MeasuresRegistryRuntimeRegistered.tsx` — added guard `useEffect` that resets `evalSubmitted`, `evalStep`, and `evalError` when `activeSurface` changes to `"structured_eval"` or `"measures_assessment"`. This prevents the completion-carry-over bypass scenario.

No scoring changes. No assessment question changes. No contact capture changes. No DB changes. Old runtime not edited. `src/index.css` not edited.

Browser spot check pending operator confirmation.

## FILES INSPECTED

| file | relevant finding |
|---|---|
| `MeasuresRegistryRuntimeRegistered.tsx` | All 5 `useEffect` calls inspected; all `navigate()` calls mapped |
| `RegisteredAssessment.tsx` | Passes-through to MeasuresAssessmentChamber; no navigation logic |
| `MeasuresAssessmentChamber.tsx` | Renders MeasuresAssessmentResult when evalSubmitted=true |
| `MeasuresAssessmentResult.tsx` | autoPlay video; onEnded → navigate("connect_src"); no auto-navigate to phases_reveal |
| `RegisteredConnectSrc.tsx` | No auto-submit; explicit form submission required |
| `registeredRuntimeTypes.ts` | RegisteredSurface type confirmed; structured_eval listed |

## ROOT CAUSE IDENTIFIED

No explicit code path routes `structured_eval -> measures_phases_reveal` directly.

The bypass occurs via `evalSubmitted` React state carry-over across SPA surface changes:

1. User completes assessment flow: `structured_eval` → (submit) → `evalSubmitted = true`, `navigate("connect_src")` → contact form → submit → `navigate("measures_phases_reveal")`

2. User presses browser Back: popstate restores `activeSurface = "structured_eval"` — but `evalSubmitted` remains `true` in React state

3. `MeasuresAssessmentChamber` renders `MeasuresAssessmentResult` (completion screen) instead of questions

4. `MeasuresAssessmentResult` renders the structured environment passage video with `autoPlay`. When the video ends, `onStructuredEnvironmentVideoEnded = () => navigate("connect_src")` fires immediately without user action

5. From `connect_src`, if `evalFields` are still populated from the previous form run, the contact form pre-fills. Rapid forward path: → submit → `navigate("measures_phases_reveal")`

The net observable effect: navigating Back to `?surface=structured_eval` causes rapid progression to `measures_phases_reveal` without the user actively answering assessment questions — the assessment bypass the OAR described.

## NO EXPLICIT REDIRECT FOUND

Confirmed: no `navigate("measures_phases_reveal")` exists in any assessment-surface dispatch branch.

All explicit `navigate("measures_phases_reveal")` calls:
- `measures_eval_email_contract` useEffect (scoped to that surface only)
- `submitContactCapture` (requires explicit form submit)

These are both correct and preserved.

## ROUTING CHAIN — CONFIRMED CORRECT

| step | from | to | trigger |
|---|---|---|---|
| eval_passage → measures_assessment | eval_passage | measures_assessment | user clicks Continue |
| measures_assessment → connect_src | measures_assessment | connect_src | submitIisEvaluation (all questions answered) |
| structured_eval → connect_src | structured_eval | connect_src | submitIisEvaluation (all questions answered) |
| connect_src → measures_phases_reveal | connect_src | measures_phases_reveal | submitContactCapture (form submit) |

No direct path: `structured_eval → measures_phases_reveal` without user traversing questions + contact form.

## FILE MODIFIED

### `src/measures_registry/registered_runtime/MeasuresRegistryRuntimeRegistered.tsx`

Added guard `useEffect` after the `measures_eval_email_contract` redirect effect:

```ts
// Assessment surfaces must always render questions, never a completion carry-over.
// evalSubmitted persists across SPA surface changes via browser back/forward navigation.
// Resetting it here ensures structured_eval and measures_assessment always start in question mode.
useEffect(() => {
  if (activeSurface === "structured_eval" || activeSurface === "measures_assessment") {
    setEvalSubmitted(false)
    setEvalStep("diagnostic")
    setEvalError(null)
  }
}, [activeSurface])
```

**What this resets**: `evalSubmitted`, `evalStep`, `evalError` — only the flags controlling what the chamber renders.

**What this preserves**: `evalAnswers` (user's question selections), `evalFields` (contact field values), `evalReport`, `conditionTraces` — no scoring or answer data is lost.

**Effect on bypass**:
- Any navigation to `structured_eval` or `measures_assessment` (URL, back button, popstate) now guarantees `evalSubmitted = false` and `evalStep = "diagnostic"`
- `MeasuresAssessmentChamber` always renders the question form, never the completion screen
- The autoPlay video bypass path is closed: completion screen cannot render, so the video never auto-plays on back navigation

## SCORING UNCHANGED

- Scoring thresholds — not touched ✓
- Answer values — not touched ✓
- Assessment result calculation — not touched ✓
- Operational standing labels — not touched ✓
- Recommended structural response logic — not touched ✓
- `submitIisEvaluation` — not modified ✓
- `resolveEnvironmentalReportByScore` — not modified ✓

## CONFIRMATIONS

- `measures_assessment` renders assessment questions ✓
- `structured_eval` renders assessment questions ✓
- Both route to `connect_src` after completion ✓
- `connect_src` routes to `measures_phases_reveal` after submit ✓
- No direct assessment-to-phases route ✓
- No scoring changes ✓
- No question changes ✓
- No contact capture changes ✓
- `measures_phases_reveal` content unchanged ✓
- `src/measures_registry/MeasuresRegistryRuntime.tsx` not edited ✓
- `src/index.css` not edited ✓
- No DB changes ✓

## BUILD RESULT

```
✓ 104 modules transformed
✓ built in 3.79s
```

No TypeScript errors. No CSS errors. Chunk size warning pre-existing and unrelated.

## CLOSE CONDITION

Open pending operator browser spot check on:

- `?surface=measures_assessment` — renders question 1 of 5, answer options visible, no phases_reveal on initial load ✓
- `?surface=structured_eval` — renders question 1 of 5, answer options visible, no phases_reveal on initial load ✓
- Complete measures_assessment path: eval_passage → measures_assessment → (answer all 5) → connect_src → (submit) → measures_phases_reveal ✓
- Complete structured_eval path: structure_passage → structured_eval → (answer all 5) → connect_src → (submit) → measures_phases_reveal ✓
- Back navigation: press Back from connect_src to structured_eval → questions show (not completion screen) ✓
- Assessment bypass closed: structured_eval never opens measures_phases_reveal without completing assessment + contact form ✓

Close this OAR1 when spot check passes and operator confirms.

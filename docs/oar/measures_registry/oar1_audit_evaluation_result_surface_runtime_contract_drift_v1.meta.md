---
document_type: oar1
authority_level: working
document_scope: measures_registry_frontend
title: OAR1 — Audit Evaluation Result Surface Runtime Contract Drift
status: closed
version: v1
operator: op044
system: measures_registry
source_oar2: docs/oar/measures_registry/oar2_audit_evaluation_result_surface_runtime_contract_drift_v1.meta.md
executor: claude_vs
tags:
  - oar1
  - measures-registry
  - evaluation-surface
  - runtime-drift
  - result-surface
  - media-inheritance
  - contract-resolution
---

# OAR1 — Audit Evaluation Result Surface Runtime Contract Drift

## OBJECTIVE

Audit for:

`docs/oar/measures_registry/oar2_audit_evaluation_result_surface_runtime_contract_drift_v1.meta.md`

Trace the full result-surface runtime path. Determine which contract the result surface resolves from, whether legacy layers remain mounted, whether state isolation is correct, and whether content authority resolves from Codex or frontend constants.

---

## FILES INSPECTED

| File | Role |
|---|---|
| `src/measures_registry/MeasuresRegistryRuntime.tsx` | Runtime host, surface routing, media resolution, eval state, submission handler |
| `src/measures_registry/MeasuresAssessmentChamber.tsx` | Evaluation chamber wrapper, result branch switch |
| `src/measures_registry/MeasuresAssessmentResult.tsx` | Result renderer component |
| `src/measures_registry/measuresAssessmentCopy.ts` | Frontend copy constants |
| `src/measures_registry/measuresAssessmentTypes.ts` | `EvalStep` type definition |

---

## RESULT RENDERER PATH

### 1. Result renderer resolution

The result surface does **not** navigate to a new `activeSurface`. There is no `navigateSurface()` call on evaluation completion.

Path:

```
activeSurface === "iis_eval_gate1"
  → renderEvaluationChamberSurface("iis_eval_gate1")
  → <MeasuresAssessmentChamber evalSubmitted={evalSubmitted} ...>
    → if evalSubmitted: <MeasuresAssessmentResult>
    → else: question form / resolving / src_capture branch
```

`activeSurface` remains `"iis_eval_gate1"` (or `"measures_ai_operational_evaluation"`) throughout result rendering. The result is an in-place branch substitution inside the evaluation chamber — not a surface transition.

### 2. State transition behavior

Transition sequence in `submitIisEvaluation`:

```
setEvalStep("resolving")         → data-chamber-state="resolving"
await 1200ms
await supabase insert
setEvalReport(report)
setEvalEmailArtifact(artifact)
setEvalSubmitted(true)           → result branch renders
```

**`evalStep` is not updated after submission completes.** `EvalStep` type is:

```ts
export type EvalStep = "src_capture" | "diagnostic" | "resolving"
```

There is no `"complete"` state in the type union. `evalStep` permanently remains `"resolving"` after evaluation succeeds.

Result: `data-chamber-state="resolving"` persists on the `<main>` element throughout the result display. The attribute does not reflect the result phase.

**All evaluation state variables remain mounted and in memory during result rendering:** `evalAnswers`, `evalFields`, `evalSectionIndex`, `evalSubmitting`, `evalStep`. No cleanup occurs on completion.

**`MeasuresAssessmentBrandLayer`** is rendered unconditionally at all chamber states, including result. It remains mounted throughout.

### 3. Media inheritance

**Talking-head video source:**

```tsx
// MeasuresRegistryRuntime.tsx line 883
const structuredEnvironmentPassageVideoUrl =
  mediaUrl(mediaMap.get("structured_environment_passage_video")) ??
  mediaUrl(mediaMap.get("measures_structured_enviroments"))
```

Resolved from `measures_media_map` at runtime load. The media role is available throughout the session.

This URL is passed through `renderEvaluationChamberSurface` → `MeasuresAssessmentChamber` (as `structuredEnvironmentPassageVideoUrl` prop) → `MeasuresAssessmentResult`.

Inside `MeasuresAssessmentResult`:

```tsx
{structuredEnvironmentPassageVideoUrl ? (
  <video
    src={structuredEnvironmentPassageVideoUrl}
    autoPlay
    muted={passageMuted}
    controls
    playsInline
    preload="auto"
    onEnded={onStructuredEnvironmentVideoEnded}
    aria-label="Structured Environment passage"
  />
) : (
  <p className="registry-media-absence">Structured Environment passage media is not seated...</p>
)}
```

The video renders **unconditionally** when the `structured_environment_passage_video` media role is seated. It has `autoPlay`. On end, it calls `onStructuredEnvironmentVideoEnded` → `navigateSurface("systems_offering")`.

**This is not a legacy runtime layer remaining mounted.** It is an intentionally wired result-state media role. The video is not a residual artifact from a prior evaluation phase — it is rendered exclusively in the result branch (`evalSubmitted=true`). However, whether the `structured_environment_passage_video` media role is the correct role for this stage, and whether it should autoplay here, is a design question not resolved by this audit.

**The `explainer_video`** (used in `educational_diagnostic_passage`) is not rendered during the result. The `epigraph_video` (landing) is not mounted. No prior passage media layers remain active during the result.

**Marble tone continuity:** `renderMarbleToneContinuity()` renders whenever `!passageMuted && marbleToneUrl`. It persists through all surface states including result. This is not result-specific.

### 4. Material/styling contract resolution

**`data-material-family`** is derived from `copy.stylingContract.material_family` → Codex metadata (`metadata.styling_contract.material_family` from `iis_eval_gate1` encounter). It is applied to the chamber `<main>` and persists correctly into the result branch — the same chamber `<main>` remains mounted.

**Obsidian contract persists correctly** into result because `data-material-family` is not reset on evaluation completion. All obsidian CSS overrides (including the `::before { content: none }` suppression from the previous correction) remain in effect.

**`data-chamber-state`** is the contract gap: it remains `"resolving"` during result display because no `"complete"` step exists in `EvalStep`.

**.registry-assessment-chamber CSS context** (including `::before` ambient layer and `::after` marble accent strip) remains fully active during the result — no CSS isolation or teardown on completion. The result surface renders inside the unchanged chamber styling context.

### 5. Content authority

| Visible result element | Source | Authority |
|---|---|---|
| Completion label | `assessmentCompletion.assessment_completion_label` → Codex `metadata.assessment_completion` | Codex; fallback `"Assessment Complete"` (hardcoded) |
| Clarification title/body | `assessmentCompletion.clarification_*` | Codex |
| Standing title/body | `assessmentCompletion.measures_registry_standing_*` | Codex |
| Progression label/title/body | `assessmentCompletion.progression_threshold_*` | Codex |
| Progression CTA | `assessmentCompletion.progression_threshold_cta` | Codex; fallback `"Enter Structured Environment"` (hardcoded) |
| Report title (`<h2>`) | `report.assessment_title` → `reportLabels.assessment_title` | Codex; fallback `ASSESSMENT_TITLE` (frontend constant) |
| Sub-support line (`<p>`) | **`ASSESSMENT_SUB_SUPPORT_LINE`** | **Frontend constant — bypasses Codex entirely** |
| Report section eyebrow | `"Assessment"` | **Hardcoded JSX** |
| Findings label | `"Findings"` | **Hardcoded JSX** |
| Structured environment fallback | `"Continue into the Structured Environment."` | **Hardcoded JSX — line 114 of `MeasuresAssessmentResult.tsx`** |
| Assessment result (`<h3>`) | `template.assessment_result` | Codex: `metadata.assessment_interpretation.report_templates[standingKey]` |
| Operational exposure summary | `template.operational_exposure_summary` | Codex |
| Recommended response label | `reportLabels.recommended_response_label` | Codex |
| Recommended structured action | `template.recommended_structured_action` | Codex |
| Assessment basis (explainability) | `report.explainability.*` | Derived from evaluation inputs — correct |
| Email artifact (subject, preview) | `emailTemplate.*` | Codex: `metadata.assessment_interpretation.email_artifact_template` |

**Legacy frontend constants in active use:**

```ts
// measuresAssessmentCopy.ts
export const ASSESSMENT_SUB_SUPPORT_LINE = "Structure enables acceleration. Ambiguity creates drift."
export const ASSESSMENT_TITLE = "MEASURES AI ENVIRONMENT ASSESSMENT"
```

- `ASSESSMENT_SUB_SUPPORT_LINE` is imported by `MeasuresAssessmentResult` and renders unconditionally at line 64 — it is not a conditional fallback, it always displays.
- `ASSESSMENT_TITLE` is used as a conditional fallback (`report?.assessment_title ?? ASSESSMENT_TITLE`). If the report title is seated in Codex, it takes precedence.

### 6. Deployment/runtime integrity

No stale build artifacts or cached bundles identified. The codebase state matches the deployed branch (`b203f83`). No duplicate runtime paths exist. Build integrity is confirmed from the prior deploy cycle.

---

## ISOLATION ASSESSMENT

| Question | Finding |
|---|---|
| Is the result surface isolated correctly? | **No** — result renders inside the evaluation chamber `<main>` with no surface transition |
| Is it appended incorrectly? | **No** — it is a conditional branch substitution, not an appended layer |
| Is it inheriting stale state? | **Partial** — `evalStep` remains `"resolving"`, `data-chamber-state` does not reflect result phase |
| Is it bypassing metadata contracts? | **Partial** — `ASSESSMENT_SUB_SUPPORT_LINE` and several JSX strings bypass Codex authority |
| Is it resolving from legacy frontend structures? | **Partial** — `measuresAssessmentCopy.ts` constants are active in the result renderer |

The result surface is NOT rendering from a separate or legacy runtime component. The evaluation chamber component and its runtime context remain the active host throughout the result. The observed drift is:

1. `evalStep` type union has no completion state — `data-chamber-state` reads `"resolving"` during result
2. `ASSESSMENT_SUB_SUPPORT_LINE` renders unconditionally from a frontend constant
3. Several hardcoded JSX strings render without Codex authority

The structured environment passage video (`structuredEnvironmentPassageVideoUrl`) is a wired media role, not a legacy artifact. It renders in the result branch by design.

---

## MINIMAL CORRECTION REQUIRED

Three gaps identified, in order of contract impact:

### Gap 1 — `EvalStep` missing completion state

**File:** `src/measures_registry/measuresAssessmentTypes.ts`
**File:** `src/measures_registry/MeasuresRegistryRuntime.tsx`

`EvalStep` has no `"complete"` state. After `evalSubmitted=true`, `evalStep` permanently reads `"resolving"`. `data-chamber-state` does not accurately reflect the result phase.

Correction: extend `EvalStep` to include `"complete"` and set it in `submitIisEvaluation` after the success path resolves — before or alongside `setEvalSubmitted(true)`.

### Gap 2 — `ASSESSMENT_SUB_SUPPORT_LINE` hardcoded in result

**File:** `src/measures_registry/MeasuresAssessmentResult.tsx` line 64

The sub-support line always renders the frontend constant regardless of Codex state. This is the most visible legacy copy expression on the result surface.

Correction: source from `assessmentCompletion` metadata (e.g., a `sub_support_line` or `support_line` key), falling back to null or omitting the element when not seated. Do not fall back to the frontend constant.

### Gap 3 — Hardcoded JSX fallback in result

**File:** `src/measures_registry/MeasuresAssessmentResult.tsx` line 114

```tsx
) : (
  <p>Continue into the Structured Environment.</p>
)}
```

This renders when no `progressionLabel`, `progressionTitle`, or `progressionBody` is seated in Codex. It hardcodes an operational instruction that belongs in Codex metadata.

Correction: render `null` when progression content is absent. Do not fill with hardcoded copy.

---

## RECOMMENDED CORRECTION ROUTE

Route three-part correction OAR2:

1. Extend `EvalStep` to include `"complete"` → set in `submitIisEvaluation` post-success
2. Remove `ASSESSMENT_SUB_SUPPORT_LINE` from `MeasuresAssessmentResult` — source from `assessmentCompletion` metadata or render null
3. Remove hardcoded `<p>Continue into the Structured Environment.</p>` fallback — render null when progression content absent

These are bounded corrections. No renderer redesign. No new components. No change to result content that resolves from Codex.

The structured environment passage video behavior (autoPlay, conditional rendering) is a design question for the operator — not included in the minimal correction set.

---

## IMPLEMENTATION STATUS

Audit only. No renderer modifications. No DB state changes.

---

## CLOSEOUT

Audit of the evaluation result surface runtime contract drift is complete.

The result surface renders inside the evaluation chamber — `activeSurface` does not transition on completion. `evalStep` has no completion state, causing `data-chamber-state` to read `"resolving"` during result display. `ASSESSMENT_SUB_SUPPORT_LINE` renders unconditionally from a frontend constant. One hardcoded JSX fallback is present.

The structured environment passage video is not a legacy artifact — it is a wired media role rendered intentionally in the result branch.

Three minimal corrections are identified and routable via OAR2.

OAR1 ready for operator review.

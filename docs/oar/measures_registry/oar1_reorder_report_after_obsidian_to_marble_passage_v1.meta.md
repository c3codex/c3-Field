---
document_type: oar1
authority_level: launch_repair
document_scope: report_passage_sequence
title: OAR1 - Reorder Report After Obsidian to Marble Passage
status: closed
version: v1
operator: op044
system: measures_registry
oar2_ref: oar2_reorder_report_after_obsidian_to_marble_passage_v1
---

# OAR1 - Reorder Report After Obsidian to Marble Passage

## REPAIRS APPLIED

### 1. `ObsidianChamberRenderer.tsx` — `MeasuresAssessment`

**Before:** `handleSubmitEvaluation` called `setEvalSubmitted(true)` after sessionStorage write, causing the report to render inside the assessment chamber. "Begin Pathway Review" then navigated to `obsidian_to_marble_passage_video`.

**After:** `handleSubmitEvaluation` navigates to `next` (obsidian_to_marble_passage_video) after sessionStorage write. `evalSubmitted` state removed. `evalSubmitted={false}` passed to `PublicAssessmentSurface` (report branch in assessment chamber never activates).

Session storage payload unchanged:
```json
{ report, emailArtifact, fields, assessmentCompletion, reportContract }
```

### 2. `ObsidianChamberRenderer.tsx` — `ObsidianToMarblePassage`

Added `PendingReport` type and two state values:

- `passageComplete: boolean` — false until video ends or CTA clicked
- `pendingReport: PendingReport | null` — initialized from `sessionStorage.getItem("__mreg_pending_report")` on mount (lazy useState)

**Passage phase** (`!passageComplete`): renders passage video as before. `onEnded` and CTA button now call `handlePassageComplete()` → `setPassageComplete(true)` instead of navigating.

**Report phase** (`passageComplete && pendingReport`): renders `PublicAssessmentResult` inside the passage surface using report data from sessionStorage. `onBeginPathwayReview` navigates to `next` (map_integrity_governance).

`PublicAssessmentResult` re-added as import (had been removed in prior session when sequence was temporarily inverted).

### 3. Type check and build

- `tsc --noEmit`: 0 errors
- `npm run build`: ✓ (11.31s)

---

## VALIDATION

**Sequence (approved order):**

| Step | Surface | Trigger |
|---|---|---|
| 1 | measures_assessment | evaluation complete |
| 2 | contact_capture | answers complete |
| 3 | obsidian_to_marble_passage_video | contact captured → navigate |
| 4 | assessment report | passage complete → render in place |
| 5 | map_integrity_governance | "Begin Pathway Review" → navigate |
| 6 | payment | MAP card selected → Stripe |

- Report no longer renders before passage: ✓ (`evalSubmitted` removed; assessment chamber never shows report)
- Passage video renders immediately after contact capture: ✓ (navigate to `obsidian_to_marble_passage_video` in `handleSubmitEvaluation`)
- Report payload survives transition: ✓ (`__mreg_pending_report` in sessionStorage, read by passage component on mount)
- Report renders after passage completion: ✓ (`passageComplete && pendingReport` branch in `ObsidianToMarblePassage`)
- Informational notice preserved: ✓ (no changes to `assessment_evaluation_report_contract_v1`)
- Key environmental indicators preserved: ✓ (report data flows from sessionStorage unchanged)
- Recommendation preserved: ✓
- MAP reached after report acknowledgement: ✓ (`onBeginPathwayReview` navigates to `next` of passage surface)
- Payment flow unchanged: ✓ (no changes to MarbleChamberRenderer or Stripe functions)
- Assessment capture unchanged: ✓ (`onCaptureAssessment` call and payload unchanged)
- Email dispatch unchanged: ✓ (emailArtifact written to sessionStorage and DB as before)
- Build passes: ✓

## SECURITY CONSTRAINTS

- Report does not recalculate: ✓ (payload read from sessionStorage, not re-scored)
- Score thresholds unchanged: ✓ (no changes to `resolveEnvironmentalReportByScore`)
- MAP pathway mapping unchanged: ✓ (no changes to MarbleChamberRenderer or standing_key logic)
- Stripe behavior unchanged: ✓
- Informational notice unchanged: ✓
- Recommendation unchanged: ✓
- No SEAT pricing exposed: ✓
- No certification claim: ✓
- No c3 Key claim: ✓
- No professional advice claim: ✓

## BROWSER QA

Pending deploy (Cloudflare Pages triggered on push).

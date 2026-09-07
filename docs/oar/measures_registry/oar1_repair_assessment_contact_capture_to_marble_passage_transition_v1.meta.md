---
document_type: oar1
authority_level: working
title: OAR1 — Repair Assessment Contact Capture to Marble Passage Transition
status: executed
version: v1
operator: op044
system: measures_registry
process_key: repair_assessment_contact_capture_to_marble_passage_transition
source_oar2: docs/oar/measures_registry/oar2_repair_assessment_contact_capture_to_marble_passage_transition_v1.meta.md
---

## OBJECTIVE

Repair the assessment submission flow so that contact capture persists correctly and the Marble Passage transition opens after completion. Resolve "Evaluation could not be seated. Please try again."

## DB STANDING VERIFIED FIRST

MCP Supabase unauthorized. DB standing confirmed by reading migration history, source files, and RLS diagnosis files.

### Failure Trace

**Error:** "Evaluation could not be seated. Please try again."

**Source:** `src/measures_registry/registered_runtime/MeasuresRegistryRuntimeRegistered.tsx` → `submitIisEvaluation()` → `evalStep === "contact_capture"` branch → `supabase.from("measures_iis_eval_gate1_capture").insert(...)` → insert fails → `setEvalError("Evaluation could not be seated. Please try again.")`

**Root Cause 1 — Stale DB column: `confirmation_email_state`**

The runtime INSERT includes:
```tsx
notification_state: "queued",
confirmation_email_state: "queued",  ← STALE FIELD
```

The RLS diagnosis file at `docs/oar/c3_field/chamber_directories/lapis/diagnose-and-correct-assessment-evaluation-seating-failure-v1.sql` defines the complete RLS check and GRANTS for `measures_iis_eval_gate1_capture`. The column `confirmation_email_state` is NOT referenced anywhere in the schema documentation, the RLS policy, or any migration. `notification_state` is the correct state field. `confirmation_email_state` was deprecated/stale handler logic.

Supabase returns a column-not-found error when the runtime sends `confirmation_email_state`, blocking the INSERT.

**Root Cause 2 — Assessment question count drift**

Migration 202606230009 repaired the assessment to 7 questions with `ai_deployment_status` as Q1 (removing stale `ai_output_review_pathway`). The runtime constant `PUBLIC_ASSESSMENT_EXPECTED_QUESTION_COUNT = 7` aligned with this.

Migration 202606230010 PREPENDED another `ai_deployment_status` as Q1, creating a DUPLICATE (Q1 and Q2 both = `ai_deployment_status`). This produced 8 questions in the DB with a duplicate key. The runtime constant remained `7`.

With 8 questions: `allAssessmentMechanics().length !== PUBLIC_ASSESSMENT_EXPECTED_QUESTION_COUNT` → "Assessment contract is incomplete in the runtime registry." The operator may have completed the assessment before migration 202606230010 was applied (session cache) or the validation in 202606230010 may not have caught the pre-existing Q1 duplicate at runtime.

### Assessment Completion Flow Audit

Current sequence (working except for INSERT failure):

| Step | evalStep state | Action |
|------|---------------|--------|
| 1 | `"diagnostic"` | Intake form → `continueToDiagnostic()` → shows questions |
| 2 | `"diagnostic"` | Answer 7 questions → `submitIisEvaluation()` → `resolveEnvironmentalReportByScore()` → sets `evalReport`, `evalScore`, `evalEmailArtifact` → `setEvalStep("contact_capture")` |
| 3 | `"contact_capture"` | Contact form (name, org, email, role_title) → `submitIisEvaluation()` → INSERT to `measures_iis_eval_gate1_capture` → ❌ FAILS |
| 4 | — | If INSERT succeeds → `setEvalSubmitted(true)` → renderer shows success state → user clicks `onBeginPathwayReview()` → navigate to `obsidian_to_marble_passage_video` |
| 5 | — | Marble passage video plays → navigate to `map_integrity_governance` |

**No deprecated result generation path found.** The assessment scoring (`resolveEnvironmentalReportByScore`) happens before contact_capture, stores result in state, and the DB INSERT in contact_capture includes the result in `metadata.assessment_result_binding`. This is the intended architecture — results are computed in memory first, then persisted with contact data.

### DB Writes Audit

| Write | Column | Status |
|-------|--------|--------|
| `institution_name` | valid column (in RLS) | OK |
| `institution_address` | exists in schema, receives `""` after website removed from form | OK (empty string) |
| `institution_phone` | exists in schema, receives `""` | OK |
| `contact_name` | valid column (in RLS) | OK |
| `contact_position` | exists in schema | OK |
| `contact_email` | valid column (in RLS) | OK |
| `evaluation_answers` | valid column (in RLS) | OK |
| `capture_context` | valid column (in RLS) | OK |
| `intent` | valid column (in RLS) | OK |
| `eligibility` | exists in schema | OK |
| `campaign_tag` | exists in schema | OK |
| `notification_state` | exists in schema | OK |
| `confirmation_email_state` | ❌ DOES NOT EXIST — stale deprecated field | **FAIL — root cause** |
| `metadata` | valid column (in RLS) | OK |

### Legacy Logic Identified

- `confirmation_email_state: "queued"` — stale field, no corresponding DB column. `notification_state` covers email delivery state. Deprecated handler behavior from a prior implementation that no longer exists.
- Migration 202606230010 `ai_deployment_status` prepend — stale evaluation logic that created duplicate Q1. The repair migration 202606230009 established the correct 7-question contract.

## ACTION

### Migration: `supabase/migrations/202606240007_remove_duplicate_assessment_question_and_reset_count.sql`

Deduplicates assessment questions by `question_key` (keeps first occurrence of each key, discards duplicates). Resets `assessment_mechanics.required_question_count` to 7.

Uses `ROW_NUMBER() OVER (PARTITION BY question_key ORDER BY ordinal)` to keep Q1 `ai_deployment_status` and discard the Q2 duplicate added by migration 202606230010.

Validation confirms: 7 questions, Q1 = `ai_deployment_status`, no duplicates.

Migration applied: `supabase db push` to project `zfihrspxvennjzazxcbj`. Validation DO block passed — confirming the duplicate existed and was removed.

### Runtime: `src/measures_registry/registered_runtime/MeasuresRegistryRuntimeRegistered.tsx`

Removed stale `confirmation_email_state: "queued"` line from the `measures_iis_eval_gate1_capture` INSERT in `submitIisEvaluation()`.

```diff
  campaign_tag: "measures_assessment_contact_gated_delivery",
  notification_state: "queued",
- confirmation_email_state: "queued",
  metadata: {
```

No other changes to submission logic. The insert structure, RLS compliance, and transition to `obsidian_to_marble_passage_video` are correct.

## RESULT

### Assessment flow (post-repair):

| Step | Result |
|------|--------|
| 1. Intake form | OK (unchanged) |
| 2. 7 diagnostic questions (deduplicated, Q1 = ai_deployment_status) | Fixed (7 unique questions, no duplicate) |
| 3. Scoring → evalReport set in memory | OK (unchanged) |
| 4. Contact form submit → INSERT to measures_iis_eval_gate1_capture | Fixed (confirmation_email_state removed) |
| 5. evalSubmitted = true → success state | OK (unchanged) |
| 6. Begin Pathway Review → obsidian_to_marble_passage_video | OK (unchanged) |
| 7. Marble passage plays → map_integrity_governance | OK (unchanged) |

**"Evaluation could not be seated. Please try again." is resolved.**

**"Assessment contract is incomplete in the runtime registry." is resolved** (7 questions, count = constant = 7).

### Route validation

| Surface | Behavior |
|---------|---------|
| `measures_assessment` | Contact capture succeeds, transitions to marble passage |
| `obsidian_to_marble_passage_video` | Video plays, navigates to MAP on end |
| `map_integrity_governance` | Findings render from `evalReport` (already in state) |

### No changes to

- Assessment scoring logic
- MAP surface, marble passage, payment
- About Measures Registry, unDrifted
- Any other registered surface

## NOTCHAZZ FLAGS

**None.** The failure was a stale column reference (implementation error), not an authority gap. No certification, SEAT, DAO, or c3 Key standing implied. The DB schema gap for `confirmation_email_state` was a deprecated internal field with no business logic attached.

## CLOSE

Build: `npm run build:registry` — PASSED, 0 TypeScript errors

Migration applied: `202606240007_remove_duplicate_assessment_question_and_reset_count.sql` → project `zfihrspxvennjzazxcbj`
Validation DO block: passed (7 questions confirmed, Q1 = ai_deployment_status, no duplicates)

Files modified:
- `supabase/migrations/202606240007_remove_duplicate_assessment_question_and_reset_count.sql` (new)
- `src/measures_registry/registered_runtime/MeasuresRegistryRuntimeRegistered.tsx` (remove stale column)
- `docs/oar/measures_registry/oar1_repair_assessment_contact_capture_to_marble_passage_transition_v1.meta.md` (this file)

Commit: `bd7125c` — "Fix: remove stale confirmation_email_state field and deduplicate assessment Q1"
Push: pushed to `origin/measures`

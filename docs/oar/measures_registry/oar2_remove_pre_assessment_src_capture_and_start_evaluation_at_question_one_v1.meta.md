---
document_type: oar2
authority_level: working
document_scope: measures_registry_runtime_qa
title: OAR2 — Remove Pre-Assessment SRC Capture and Start Evaluation at Question One
status: proposed
version: v1
operator: op044
system: measures_registry
source_oar1:
  - docs/oar/measures_registry/oar1_reposition_contact_capture_to_eval_email_contract_and_remove_header_bleed_v1.meta.md
  - docs/oar/measures_registry/oar1_audit_registered_runtime_for_legacy_residue_after_renderer_alignment_v1.meta.md
source_contract:
  - measures_registry_sitewide_style_contract
executor_candidate:
  - claude_vs
tags:
  - oar2
  - measures-registry
  - runtime-qa
  - pre-assessment-capture
  - assessment-flow
  - viewport-containment
  - registered-runtime
  - codex-first
---

# OAR2 — Remove Pre-Assessment SRC Capture and Start Evaluation at Question One

## OBSERVED

Browser visual QA confirms:

    http://localhost:5173/?surface=measures_assessment

still renders the pre-assessment identity/contact screen:

    ENVIRONMENT IDENTITY
    Before the evaluation begins, identify the environment being assessed.
    Institutional Contact
    Company / Organization Name
    Type of Business / Organization
    Contact Name
    Contact Email
    Begin Evaluation

This is drift.

The prior OAR repositioned contact capture to:

    measures_eval_email_contract

after the final evaluation question.

However, `MeasuresAssessmentChamber` still starts with:

    evalStep = "src_capture"

which renders the old pre-question identity capture before the evaluation begins.

The intended public registered flow is now:

    passage video
        -> assessment question 1 immediately
        -> final assessment question
        -> measures_eval_email_contract
        -> contact/delivery capture while assessment package is generated
        -> measures_phases_reveal

Visual QA also confirms viewport containment drift on the assessment page:

- underlying/previous media peeks through at the bottom
- assessment card/container does not fully contain the visible surface
- browser viewport shows lower background residue

## ALIGNED

This is a bounded runtime QA correction.

Do not redesign the assessment.

Do not change assessment questions.

Do not alter assessment scoring.

Do not fork structured_eval mechanics.

Do not implement email dispatch.

Do not expose payment logic.

Do not delete deprecated rows.

Do not reintroduce pre-assessment contact capture.

Frontend must render seated Codex state only.

## ROUTED

### 1. Remove or bypass pre-assessment SRC capture for public registered flow

Inspect `MeasuresAssessmentChamber` usage and implementation.

Remove or bypass the pre-question step for registered public surfaces:

- `measures_assessment`
- `structured_eval`

The following screen should not appear before evaluation questions:

    ENVIRONMENT IDENTITY
    Before the evaluation begins, identify the environment being assessed.
    Institutional Contact

The public registered assessment should start directly at question 1.

### 2. Preserve contact/delivery capture after final question

Contact/delivery capture must remain on:

    measures_eval_email_contract

after final evaluation question / assessment completion.

Required delivery fields remain:

- institution / company name
- business type
- contact name
- contact email

Purpose:

    Your assessment is being generated. Enter where the completed assessment package and recommended structural response should be sent.

Do not move these fields back before the assessment.

### 3. Correct measures_assessment initial eval step

Update `renderMeasuresAssessmentSurface` so it initializes the assessment in question mode, not `src_capture`.

Current suspected drift:

    evalStep="src_capture"

Correct so public registered `measures_assessment` opens directly into the evaluation questions.

If the assessment component requires an initial state, use the existing question/evaluation step supported by the component.

Do not change scoring or question order.

### 4. Correct structured_eval initial eval step

Update `renderStructuredEvalSurface` similarly.

It should also start directly at question 1.

It must continue to share assessment mechanics with `measures_assessment`.

No scoring fork.

No separate question set unless already seated.

### 5. Preserve assessment completion route

After final question / assessment completion:

    measures_assessment -> measures_eval_email_contract

    structured_eval -> measures_eval_email_contract

Then:

    measures_eval_email_contract -> measures_phases_reveal

Do not route assessment completion directly to measures_phases_reveal.

Do not route to connect_src.

Do not route to deprecated surfaces.

### 6. Handle missing evalFields gracefully

Since the pre-assessment capture is removed, `evalFields` may be empty until `measures_eval_email_contract`.

Ensure assessment questions can proceed without prefilled institution/contact fields.

If result generation currently depends on fields from `evalFields`, defer those fields until email contract capture and preserve result generation with anonymous/session-local standing.

Do not require contact data before evaluation.

### 7. Correct assessment viewport containment

Fix the visual containment drift visible at the bottom of the assessment surface.

Required behavior:

- assessment page should occupy the visible runtime surface cleanly
- no previous/underlying media should peek through at the bottom
- card/container should remain within viewport on desktop
- page should be scrollable only if needed
- no major style redesign

Allowed:

- narrow className/container adjustment
- min-height / overflow containment fix
- background layer containment fix

Do not edit global CSS broadly unless absolutely required and explicitly reported.

### 8. Validate direct URL

Validate:

    http://localhost:5173/?surface=measures_assessment

Expected:

- opens directly to question 1
- no Environment Identity page
- no Institutional Contact pre-capture
- no bottom media peek-through

Validate:

    http://localhost:5173/?surface=structured_eval

Expected:

- opens directly to question 1
- no pre-capture
- no scoring fork

### 9. Validate branch flow

Left branch:

    eval_passage
        -> measures_assessment
        -> question 1
        -> final question
        -> measures_eval_email_contract
        -> measures_phases_reveal

Right branch:

    structure_passage
        -> structured_eval
        -> question 1
        -> final question
        -> measures_eval_email_contract
        -> measures_phases_reveal

### 10. Build validation

Run:

    npm run build:registry

Return clean build result.

## DO NOT

- change assessment questions
- change assessment scoring
- fork structured_eval mechanics
- implement email dispatch
- implement payment logic
- delete connect_src
- route back to connect_src
- reintroduce pre-assessment contact capture
- hardcode semantic copy outside seated metadata
- hardcode media URLs
- delete deprecated rows
- change registered 13 sequence
- broadly redesign UI

## VALIDATION REQUIRED

Return:

- exact source of pre-assessment capture
- files modified
- DB rows modified, if any
- old initial eval step
- new initial eval step
- measures_assessment direct URL result
- structured_eval direct URL result
- left branch result
- right branch result
- viewport containment correction
- build result
- confirmation no scoring fork
- confirmation no email dispatch
- confirmation no payment logic exposed
- confirmation no deprecated route bleed
- confirmation contact capture only appears after final evaluation question

## SUCCESS CONDITION

`measures_assessment` and `structured_eval` open directly to evaluation questions.

The pre-assessment Environment Identity / Institutional Contact surface is removed from the registered public flow.

Contact capture appears only at `measures_eval_email_contract` after the final evaluation question.

Assessment viewport containment is corrected.

Build remains clean.

## EXPECTED OAR1

`docs/oar/measures_registry/oar1_remove_pre_assessment_src_capture_and_start_evaluation_at_question_one_v1.meta.md`

## CLOSE

Start with the question.

Capture contact after value is created.

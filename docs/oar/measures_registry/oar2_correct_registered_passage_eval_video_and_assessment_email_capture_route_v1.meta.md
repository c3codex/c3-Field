---
document_type: oar2
authority_level: working
document_scope: measures_registry_registered_runtime
title: OAR2 — Correct RegisteredPassage Eval Video and Assessment Email Capture Route
status: proposed
version: v1
operator: op044
system: measures_registry
source_oar1:
  - docs/oar/measures_registry/oar1_build_clean_contract_native_measures_registry_runtime_shell_v1.meta.md
  - docs/oar/measures_registry/oar1_correct_evaluate_structure_path_registered_path_choice_surface_contract_v1.meta.md
  - docs/oar/measures_registry/oar1_resequence_assessment_capture_and_resolving_interstitial_v1.meta.md
source_contract:
  - measures_registry_sitewide_style_contract
  - registered_13_public_runtime_contract
executor_candidate:
  - claude_vs
tags:
  - oar2
  - measures-registry
  - registered-runtime
  - passage-video
  - assessment-flow
  - email-capture
  - clean-shell
  - codex-first
---

# OAR2 — Correct RegisteredPassage Eval Video and Assessment Email Capture Route

## OBSERVED

Browser visual QA confirms the clean-shell path-choice surface now renders correctly.

Confirmed working:

- `ai_isnt_broken_intro` opens
- `evaluate_structure_path` opens as two-path decision surface
- left and right path choices are visible and actionable
- right/structure path media appears visually present

Remaining failures:

1. `eval_passage` opens after left path click, but the intended video explainer is missing.

   The page shows passage text/buttons, but not the seated video layer.

2. After completing the evaluation questions, runtime opens the assessment result page first.

   Intended behavior is:

       final evaluation question
           -> measures_eval_email_contract
           -> contact/delivery capture
           -> resolving interstitial for at least 4 seconds
           -> measures_phases_reveal / assessment path

   Current behavior still appears result-first.

This is no longer a path-choice issue.

This is a clean-shell renderer parity correction for:

- `RegisteredPassage`
- `RegisteredAssessment`
- `RegisteredEvalEmailContract` route timing if needed

## ALIGNED

This is a bounded clean-shell correction.

Do not re-enter the old monolithic runtime.

Do not edit:

    src/measures_registry/MeasuresRegistryRuntime.tsx

Do not redesign the site.

Do not change assessment questions.

Do not alter assessment scoring.

Do not fork structured_eval mechanics.

Do not implement email dispatch.

Do not expose payment logic.

Do not change the registered 13 sequence.

Frontend must render seated Codex state only.

## ROUTED

### 1. Inspect RegisteredPassage eval video consumption

Inspect:

    src/measures_registry/registered_runtime/renderers/RegisteredPassage.tsx

and the parent dispatcher in:

    src/measures_registry/registered_runtime/MeasuresRegistryRuntimeRegistered.tsx

Determine:

- whether `eval_passage` receives a video URL prop
- whether `RegisteredPassage` renders a video element for eval variant
- whether only structure variant receives `passageVideoUrl`
- which media role is expected for the left/evaluation explainer video
- whether the video is missing because the media role is not queried
- whether the video is queried but not passed
- whether the video is passed but not rendered
- whether CSS/layout is hiding the video

Return exact cause.

### 2. Correct eval_passage video rendering

The left/evaluation passage must render its seated explainer video before the assessment questions.

Expected flow:

    evaluate_structure_path
        -> eval_passage
        -> video explainer / passage surface
        -> continue
        -> measures_assessment

Use only seated media authority.

Do not hardcode video URLs.

If the correct media role exists in `measures_media_map`, query and consume it.

If multiple candidate roles exist, report them and use the one already seated for `eval_passage` or the registered evaluation passage contract.

Likely candidate roles to inspect:

- eval_passage video role
- educational_diagnostic_passage video role
- diagnostic_explainer_passage video role
- measures_structured_enviroments if incorrectly reused
- any R2 media row tied to evaluation explainer / assessment readiness

If no seated video exists, report missing media contract and render a clear non-video fallback without blank surface.

### 3. Preserve structure_passage video behavior

Do not break the right/structure path.

Expected right branch:

    evaluate_structure_path
        -> structure_passage
        -> seated structure passage video
        -> continue
        -> structured_eval

Confirm existing structure video still renders.

### 4. Inspect RegisteredAssessment final-question behavior

Inspect:

    src/measures_registry/registered_runtime/renderers/RegisteredAssessment.tsx

and any assessment submit logic recovered into:

    src/measures_registry/registered_runtime/MeasuresRegistryRuntimeRegistered.tsx

Determine why final question still opens the assessment result page before `measures_eval_email_contract`.

Return exact cause:

- local result view rendered inside RegisteredAssessment
- `evalSubmitted` state triggers result screen before navigation
- submit handler sets result before route
- `onEnterStructuredEnvironment` still required user click to continue
- route to `measures_eval_email_contract` occurs only after result
- direct assessment result is embedded in the component contract

### 5. Correct final question route to email capture

After the final evaluation question in both:

- `measures_assessment`
- `structured_eval`

the next visible public surface must be:

    measures_eval_email_contract

The assessment result page must not appear before contact/delivery capture.

Required flow:

    final question submitted
        -> measures_eval_email_contract

Then:

    delivery fields submitted
        -> resolving interstitial for at least 4 seconds
        -> measures_phases_reveal / assessment path

Do not route final question directly to:

- assessment result surface
- measures_phases_reveal
- connect_src
- deprecated surfaces

### 6. Preserve assessment data/result generation

Do not remove assessment result generation.

The assessment result may be:

- generated and held in runtime state after final question
- displayed after delivery capture / resolving sequence
- included on `measures_phases_reveal` or follow-up result display if currently seated

But it must not be shown before `measures_eval_email_contract`.

If current component cannot separate result generation from result display, apply the smallest correction:

- generate result silently
- navigate to email contract
- show result only after delivery submit/resolving route

### 7. Confirm measures_eval_email_contract behavior

Inspect:

    RegisteredEvalEmailContract.tsx

Confirm:

- delivery/contact form appears
- required fields are present:
  - institution / company name
  - business type
  - contact name
  - contact email
- submit triggers resolving interstitial
- interstitial appears for at least 4 seconds
- after interstitial routes to `measures_phases_reveal`

If the contract currently routes somewhere else, correct it.

### 8. Runtime visual acceptance required

Do not close on build success alone.

Browser visual QA is required.

Validate left branch:

    intro
        -> evaluate_structure_path
        -> click left
        -> eval_passage WITH video
        -> continue
        -> measures_assessment questions
        -> final question
        -> measures_eval_email_contract delivery form
        -> submit
        -> resolving interstitial for >= 4 seconds
        -> measures_phases_reveal

Validate right branch:

    intro
        -> evaluate_structure_path
        -> click right
        -> structure_passage WITH video
        -> continue
        -> structured_eval questions
        -> final question
        -> measures_eval_email_contract delivery form
        -> submit
        -> resolving interstitial for >= 4 seconds
        -> measures_phases_reveal

### 9. Build validation

Run:

    npm run build:registry

Return clean build result.

## DO NOT

- edit old MeasuresRegistryRuntime.tsx
- reintroduce old handler logic
- route to deprecated surfaces
- change assessment questions
- change assessment scoring
- fork structured_eval mechanics
- implement email dispatch
- implement payment logic
- create DB tables
- delete deprecated rows
- redesign broadly
- hardcode semantic copy as authority
- hardcode media URLs
- accept build-only validation

## VALIDATION REQUIRED

Return:

- exact eval_passage video failure source
- media role inspected / consumed
- files modified
- DB rows modified, if any
- eval_passage before/after behavior
- structure_passage before/after behavior
- exact assessment result-first source
- final-question old route/behavior
- final-question new route/behavior
- measures_eval_email_contract behavior
- resolving interstitial timing
- left branch browser QA result
- right branch browser QA result
- build result
- confirmation old runtime was not edited
- confirmation no deprecated route bleed
- confirmation no scoring fork
- confirmation no email dispatch
- confirmation no payment logic exposed

## SUCCESS CONDITION

The left/evaluation passage shows the intended explainer video before the assessment.

The final assessment question routes first to:

    measures_eval_email_contract

The assessment result no longer appears before contact/delivery capture.

Delivery submit triggers the resolving interstitial for at least 4 seconds.

After resolving, runtime routes to:

    measures_phases_reveal

Both branches pass browser visual QA.

Build remains clean.

## EXPECTED OAR1

docs/oar/measures_registry/oar1_correct_registered_passage_eval_video_and_assessment_email_capture_route_v1.meta.md

## CLOSE

Render the eval passage video.

Capture delivery before reveal.

Do not accept build-only proof.

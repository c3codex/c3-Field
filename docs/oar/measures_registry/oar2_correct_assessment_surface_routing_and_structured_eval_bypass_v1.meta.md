---
document_type: oar2
authority_level: working
document_scope: measures_registry_registered_runtime
title: OAR2 — Correct Assessment Surface Routing and structured_eval Bypass
status: proposed
version: v1
operator: op044
system: measures_registry
executor_candidate:
  - claude_vs
tags:
  - oar2
  - measures-registry
  - assessment
  - structured-eval
  - routing
  - bypass
  - registered-runtime
  - codex-first
---

# OAR2 — Correct Assessment Surface Routing and structured_eval Bypass

## OBSERVED

The assessment/evaluation route standing is confused.

Current browser behavior shows:

    ?surface=measures_assessment
    -> renders the 5-question evaluation chamber

That is acceptable.

But:

    ?surface=structured_eval
    -> opens measures_phases_reveal

This is wrong.

The assessment encounter is the central public encounter and must not be skipped, bypassed, or only accessible through browser Back.

Correct standing:

    eval_passage
    = video explainer before questions

    measures_assessment
    = 5-question assessment/evaluation chamber

    structured_eval
    = 5-question structured evaluation chamber / right-path assessment equivalent

    connect_src
    = contact capture after assessment completion

    measures_phases_reveal
    = post-contact guided conversion bridge

Correct public progression:

    eval_passage
      -> measures_assessment
      -> connect_src
      -> measures_phases_reveal

Right/structure path progression:

    structure_passage
      -> structured_eval
      -> connect_src
      -> measures_phases_reveal

Direct URL behavior:

    ?surface=measures_assessment
    -> render assessment questions

    ?surface=structured_eval
    -> render assessment questions

Never:

    ?surface=structured_eval
    -> measures_phases_reveal

## ALIGNED

This OAR corrects routing/runtime behavior only.

Do not reseat content.

Do not change assessment questions.

Do not change scoring.

Do not change contact capture fields.

Do not change phases reveal content.

Do not change payment behavior.

Do not edit old runtime:

    src/measures_registry/MeasuresRegistryRuntime.tsx

Do not edit:

    src/index.css

Frontend renders seated DB state only.

If direct URL routing is using completion state or stored session state, structured_eval must still render its assessment chamber unless the user has actively completed that assessment path in the current flow and the route transition is explicitly invoked by completion logic.

A direct URL request for structured_eval must not be treated as permission to skip to measures_phases_reveal.

## ROUTED

## 1. Inspect surface resolver

Inspect registered runtime routing in:

    src/measures_registry/registered_runtime/MeasuresRegistryRuntimeRegistered.tsx

Check:

- surface parsing from URL
- initial surface resolution
- registered surface union/type
- navigate function
- any route map
- any fallback route
- any completed-assessment redirect
- any structured_eval alias logic
- any transition to measures_phases_reveal

Return the exact file section responsible for:

    structured_eval -> measures_phases_reveal

if present.

## 2. Inspect assessment renderer handling

Inspect assessment renderer usage for:

    measures_assessment
    structured_eval

Likely files:

    src/measures_registry/registered_runtime/MeasuresRegistryRuntimeRegistered.tsx
    src/measures_registry/registered_runtime/renderers/RegisteredAssessment.tsx
    src/measures_registry/MeasuresAssessmentChamber.tsx

Confirm both surfaces render the assessment question chamber.

Required behavior:

    measures_assessment
    -> renders assessment questions

    structured_eval
    -> renders assessment questions

If structured_eval uses measures_assessment question fallback, preserve that fallback.

Do not duplicate question content in runtime.

Do not hardcode assessment questions.

## 3. Correct structured_eval bypass

Remove or correct any logic that sends:

    structured_eval
    -> measures_phases_reveal

on direct surface load.

Allowed routing:

    structured_eval completion
    -> connect_src

    connect_src submit
    -> measures_phases_reveal

Not allowed:

    structured_eval direct load
    -> measures_phases_reveal

    structured_eval initial render
    -> measures_phases_reveal

## 4. Preserve completion routing

After final question completion:

    measures_assessment
    -> connect_src

    structured_eval
    -> connect_src

After contact capture submit:

    connect_src
    -> measures_phases_reveal

Do not alter contact capture save/hold behavior.

Do not route directly from assessment to phases reveal.

## 5. Preserve scoring

Do not change:

- scoring thresholds
- answer values
- assessment result calculation
- operational standing labels
- recommended structural response logic

If scoring is touched accidentally, revert.

## 6. Preserve phases reveal

Do not change:

    measures_phases_reveal

This surface has separate content/style work.

Only ensure it opens after contact capture submit.

## 7. Build validation

Run:

    npm run build:registry

Return result.

## 8. Browser QA

Validate direct URLs:

    ?surface=measures_assessment
    ?surface=structured_eval

Expected:

- both render assessment questions
- neither opens measures_phases_reveal on initial load
- question 1 of 5 appears
- answer options appear

Validate flow:

    eval_passage
      -> measures_assessment
      -> connect_src
      -> measures_phases_reveal

Validate structure path:

    structure_passage
      -> structured_eval
      -> connect_src
      -> measures_phases_reveal

Expected:

- no assessment bypass
- no direct assessment-to-phases route
- phases reveal opens only after contact submit

## DO NOT

- reseat content
- change assessment copy
- change assessment questions
- change scoring
- change answer values
- change contact capture fields
- change phases reveal content
- change payment behavior
- implement payment
- edit old MeasuresRegistryRuntime.tsx
- edit src/index.css
- hardcode question content
- hardcode route-card content
- treat structured_eval direct load as completed flow

## VALIDATION REQUIRED

Return:

- files inspected
- file/line or section causing structured_eval bypass
- files modified
- old structured_eval behavior
- new structured_eval behavior
- confirmation measures_assessment still renders questions
- confirmation structured_eval now renders questions
- confirmation both route to connect_src after completion
- confirmation connect_src routes to measures_phases_reveal after submit
- confirmation no scoring changes
- confirmation no question changes
- confirmation no contact capture changes
- confirmation phases reveal content unchanged
- confirmation old runtime not edited
- confirmation src/index.css not edited
- build result
- browser QA result for direct URLs
- browser QA result for both full flows

## SUCCESS CONDITION

The assessment encounter cannot be bypassed.

Both:

    ?surface=measures_assessment
    ?surface=structured_eval

render the 5-question assessment chamber.

Both route to:

    connect_src

after completion.

Only contact capture submit routes to:

    measures_phases_reveal

Assessment remains the central encounter.

## EXPECTED OAR1

docs/oar/measures_registry/oar1_correct_assessment_surface_routing_and_structured_eval_bypass_v1.meta.md

## CLOSE

Assessment first.

Contact second.

Phases after contact.

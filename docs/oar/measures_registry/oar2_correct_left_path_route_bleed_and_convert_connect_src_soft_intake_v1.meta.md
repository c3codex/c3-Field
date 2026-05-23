---
document_type: oar2
authority_level: working
document_scope: measures_registry_runtime_qa
title: OAR2 — Correct Left Path Route Bleed and Convert connect_src Soft Intake
status: proposed
version: v1
operator: op044
system: measures_registry
source_oar1:
  - docs/oar/measures_registry/oar1_correct_registered_runtime_activation_and_public_route_exposure_v1.meta.md
  - docs/oar/measures_registry/oar1_audit_left_path_post_passage_dead_surface_and_vite_placeholder_warning_v1.meta.md
source_contract:
  - measures_registry_sitewide_style_contract
executor_candidate:
  - claude_vs
tags:
  - oar2
  - measures-registry
  - runtime-qa
  - route-bleed
  - connect-src
  - soft-src
  - registered-runtime
  - codex-first
---

# OAR2 — Correct Left Path Route Bleed and Convert connect_src Soft Intake

## OBSERVED

Local runtime QA confirms that the left path opens a deprecated/precontract surface:

    http://localhost:5173/?surface=cohort_conversion_encounter

This should not occur in the registered public runtime.

The intended registered left path is:

    evaluate_structure_path
        -> eval_passage
        -> connect_src
        -> measures_assessment
        -> measures_phases_reveal

Prior OAR1 confirmed deprecated surfaces are retained for legacy compatibility but should not be accessible from the registered public flow.

Current QA also confirms `connect_src` is behaving as coded:

    renderer: static_authority_surface

It currently renders a static c3 Field authority bridge before routing to the assessment/SRC form.

Operator intent has clarified:

    connect_src should behave as a soft SRC intake surface,
    not as a static precontract authority page.

The soft SRC intake should collect only:

- company / institution name
- contact name
- email
- business type

Then continue into the correct next encounter based on path context:

- left path -> measures_assessment
- right path -> structured_eval

## ALIGNED

This OAR2 combines two bounded corrections:

1. Remove legacy `cohort_conversion_encounter` route bleed from the registered path.
2. Convert `connect_src` from static authority bridge to soft SRC intake surface.

This is a runtime/contract alignment correction.

Do not redesign the site.

Do not alter assessment scoring.

Do not fork assessment mechanics.

Do not implement email dispatch.

Do not expose payment logic.

Do not delete deprecated rows.

Do not hardcode semantic copy outside seated metadata.

Frontend continues to render seated Codex state only.

## ROUTED

### 1. Reproduce and identify legacy route bleed

Reproduce the left path:

    ai_isnt_broken_intro
        -> evaluate_structure_path
        -> eval_passage
        -> connect_src
        -> measures_assessment

Continue until runtime opens:

    cohort_conversion_encounter

Identify the exact source:

- MeasuresAssessmentChamber handler
- SRC form submit handler
- evaluation completion handler
- onEnterStructuredEnvironment handler
- handleAction fallback
- surfaceFromEncounterKey mapping
- legacy action target in metadata
- hardcoded runtime surface transition

Return the exact file/function/handler causing the deprecated route.

### 2. Correct legacy route target

Replace any registered left-path route to:

    cohort_conversion_encounter

with:

    measures_phases_reveal

where the route belongs to assessment completion / SRC completion / structured environment entry.

Required result:

    measures_assessment -> measures_phases_reveal

Do not affect deprecated legacy surfaces outside the registered flow.

Do not delete `cohort_conversion_encounter`.

Do not remove legacy aliases unless required and reported.

### 3. Confirm deprecated surface containment

Ensure these deprecated public encounters are not reachable from the registered left path:

- educate_eval_encounter
- iis_eval_gate1
- cohort_conversion_encounter
- understand_failure
- foundation_offering
- systems_offering
- systems_seat_hold

They may remain as retained legacy aliases only.

### 4. Convert connect_src intent

Update `connect_src` behavior from static authority bridge to soft SRC intake surface.

Required fields:

- company / institution name
- contact name
- email
- business type

The surface should feel like a light intake / recallable SRC bridge, not a full assessment and not a marketing form.

Purpose:

    collect minimal institution/contact context before assessment continuation

Route behavior:

    connect_src -> connectSrcNextEncounter

Where:

- left path sets `connectSrcNextEncounter = measures_assessment`
- right path sets `connectSrcNextEncounter = structured_eval`

### 5. Preserve path context

Confirm the existing path-context logic still works:

Left path:

    eval_passage
        -> setConnectSrcNextEncounter("measures_assessment")
        -> connect_src
        -> measures_assessment

Right path:

    structure_passage
        -> setConnectSrcNextEncounter("structured_eval")
        -> connect_src
        -> structured_eval

If path context is unstable, correct only the state handoff.

### 6. Soft SRC data handling

Determine whether current runtime/backend supports storing the soft SRC fields.

If storage exists:

- store fields through existing approved intake mechanism
- preserve recallable standing
- do not invent a new table

If storage does not exist:

- render the form locally in runtime state
- pass collected context into assessment flow if currently supported
- report required future DB/OAR support for persistent soft SRC storage

Do not create new DB tables in this OAR2.

Do not invent a new SRC authority surface.

### 7. Metadata / contract alignment

Inspect `connect_src` metadata.

If needed, update metadata contract only for `connect_src` to reflect:

    renderer/intended behavior: soft_src_intake_surface

Required contract markers:

- soft_src_fields
- route_after_capture: connectSrcNextEncounter
- frontend_hardcode_allowed: false
- source_sitewide_contract preserved
- encounter_isolation_contract preserved
- transition_contract preserved

Do not alter unrelated encounter contracts.

### 8. Visual/runtime behavior

The new `connect_src` surface should:

- fit on one screen where possible
- use the sitewide style contract
- avoid the old c3 Field authority-page copy as primary display
- preserve a concise acknowledgment/instruction if seated in metadata
- show clear continue action

Do not perform broad styling redesign.

### 9. Vite/build validation

Run:

    npm run build:registry

Confirm:

- build clean
- no TypeScript errors
- no assessment scoring fork
- no email dispatch
- no payment logic
- no deprecated route in registered left path

### 10. Runtime QA validation

Validate both branches:

Left:

    eval_passage
        -> connect_src soft intake
        -> measures_assessment
        -> measures_phases_reveal

Right:

    structure_passage
        -> connect_src soft intake
        -> structured_eval
        -> measures_phases_reveal

Confirm `cohort_conversion_encounter` does not appear in either registered branch.

## DO NOT

- delete deprecated rows
- redesign UI broadly
- edit CSS unless narrowly necessary and reported
- hardcode semantic copy
- hardcode media URLs
- change assessment questions
- change assessment scoring
- fork structured_eval mechanics
- implement email dispatch
- implement payment logic
- create new DB tables
- create duplicate SRC authority
- change registered 13 sequence

## VALIDATION REQUIRED

Return:

- exact route bleed source
- files modified
- DB rows modified, if any
- old route target
- new route target
- connect_src behavior before/after
- soft SRC fields implemented
- storage behavior for soft SRC fields
- left branch runtime result
- right branch runtime result
- build result
- confirmation deprecated cohort route no longer appears
- confirmation no scoring fork
- confirmation no email dispatch
- confirmation no payment logic exposed

## SUCCESS CONDITION

The left registered path no longer routes to `cohort_conversion_encounter`.

`connect_src` renders as a soft SRC intake surface using company/institution name, contact name, email, and business type.

Both registered branches continue cleanly through:

    connect_src
        -> measures_assessment / structured_eval
        -> measures_phases_reveal

No deprecated route bleed remains in the intended registered public flow.

## EXPECTED OAR1

`docs/oar/measures_registry/oar1_correct_left_path_route_bleed_and_convert_connect_src_soft_intake_v1.meta.md`

## CLOSE

Remove legacy route bleed.

Convert connect_src to soft SRC intake.

Keep the registered runtime clean.

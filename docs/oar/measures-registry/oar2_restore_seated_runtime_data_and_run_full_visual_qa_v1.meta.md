---
document_type: oar2
authority_level: working
document_scope: measures_registry_seated_data_visual_qa
title: Restore Seated Measures Registry Runtime Data and Run Full Visual QA
status: proposed
version: v1
operator: op044
system: measures_registry
native_stack:
  codex: database
  field: schema
  measures: registry
  chazz: systems
surface_scope:
  - local_runtime_data_state
  - measures_assessment
  - crystal_chamber
  - structural_drift_publication
  - contact_result_gate
  - visual_validation
tags:
  - measures-registry
  - visual-qa
  - seated-data
  - runtime-validation
  - assessment
  - crystal-chamber
  - structural-drift
  - oar2
source_alignment:
  - oar1_derive_runtime_visual_system_from_existing_launch_media_v1
  - oar1_correct_launch_grade_visual_system_chamber_differentiation_and_responsive_encounter_design_v1
  - oar1_correct_public_runtime_material_contract_expression_and_understand_route_continuity_v1
  - OAR Lifecycle — Execution and Handoff
---

# OAR2 — Restore Seated Measures Registry Runtime Data and Run Full Visual QA v1

## OBSERVED

The runtime visual system has now been corrected twice:

1. Material/layout contract markers were normalized.
2. A launch-grade visual layer was added.
3. The runtime visual system was then derived from existing Measures Registry launch media.

The latest OAR1 confirms:

- existing launch/path media now feeds runtime visual CSS variables
- Crystal derives from the right/measured launch media
- Obsidian derives from the left/fracture launch media
- CTA bands and chamber planes moved closer to launch media language
- build passed
- no DB mutation
- no deployment

However, the OAR1 also confirms full visual proof is still held because local runtime did not resolve seated assessment/publication/media state. Specifically:

- question 5 could not be screenshot-validated
- contact/result gate could not be reached
- live Structural Drift cover validation remains unresolved
- live Crystal Questions video validation remains unresolved

This OAR2 does not authorize new styling.

This OAR2 restores/verifies seated local runtime data visibility and runs full visual QA against the current visual source contract.

## ALIGNED

The visual system cannot be accepted until tested against the real seated runtime state.

Source/build validation is not enough.

Required proof:

    real seated assessment questions
    real Crystal video/media
    real Structural Drift cover/publication data
    real contact/result progression
    real responsive screenshots

The acceptance standard remains:

    The runtime surfaces must visibly match the existing launch media’s institutional cinematic design language.

The latest OAR1 states the correct next step:

    Restore or verify local seated Measures Registry assessment/publication media state, then run full screenshot QA across question 5, contact/result gate, Crystal media, and Structural Drift cover.

## ROUTED

## 1. Verify local runtime data source

Cody must determine why local runtime returned:

    Assessment contract is not seated.
    Expected 7 seated questions; found 0.

and why local runtime returned missing publication/media state for Crystal and Structural Drift.

Audit likely causes:

    local env mismatch
    wrong Supabase project
    missing env keys
    RLS / anon visibility issue
    local seed not applied
    runtime query filter mismatch
    surface key mismatch
    media map key mismatch
    publication dispatch key mismatch

Cody must report the cause before attempting screenshots.

No DB mutation is authorized by default.

If DB mutation appears required, Cody must hold and report the required manifest/OAR.

## 2. Verify assessment seated data

Required local validation:

    ?surface=measures_assessment

Expected:

    7 seated questions resolve
    3 answer choices per question
    reference statement appears above each question
    question 5 reachable
    question 5 controls reachable
    assessment can complete
    contact/consent gate reachable

If the seven-question contract still returns 0 questions:

    hold visual acceptance
    report exact query/result failure
    do not claim assessment visual pass

## 3. Verify Crystal Chamber seated media

Required local validation:

    ?surface=crystal_chamber

Expected:

    Questions Explainer video resolves
    Structural Drift publication encounter resolves
    Structural Drift cover resolves where seated
    Foundational Leadership CTA appears
    Assess CTA appears
    footer/site frame appears

If media does not resolve:

    report missing media map / query / key / env cause
    do not claim Crystal visual pass

## 4. Verify Structural Drift publication route

Required local validation:

    /publication/structural_drift

or the current seated publication route.

Expected:

    publication route resolves
    cover image resolves
    cover containment works
    title/deck/abstract/CTA render
    no generic missing-state panel if publication is seated
    CTA target works or is visibly seated

If publication state is missing:

    report missing publication row / dispatch key / media role
    do not claim publication visual pass

## 5. Run full screenshot QA

Required viewports:

    1440x900
    1366x768
    390x844

Required captures:

    crystal_chamber
    structure_passage
    measures_assessment question 5
    contact/result gate
    structural_drift publication encounter
    footer/sitewide frame

Expected screenshot output path:

    docs/oar/measures-registry/visual-validation-seated-data/

Suggested filenames:

    crystal_chamber_1440x900.png
    crystal_chamber_1366x768.png
    crystal_chamber_390x844.png

    structure_passage_1440x900.png
    structure_passage_390x844.png

    assessment_q5_1366x768.png
    assessment_q5_390x844.png

    contact_result_gate_1366x768.png
    contact_result_gate_390x844.png

    structural_drift_publication_1440x900.png
    structural_drift_publication_390x844.png

    footer_frame_1440x900.png

If screenshot tooling fails:

    report tooling failure
    provide exact reason
    use manual local browser notes if available
    do not claim screenshot validation completed

## 6. Visual acceptance criteria

### Crystal Chamber

Pass requires:

    Questions video visible and contained
    Structural Drift publication encounter visible and not cropped badly
    CTAs balanced and reachable
    Crystal field visually derived from launch media
    no generic card-stack feel

### Structure Passage

Pass requires:

    About Measures Registry copy and video feel integrated
    no plain paragraph block feel
    controls are visible and restrained
    brand frame feels intentional
    mobile viewport is readable

### Assessment Question 5

Pass requires:

    reference statement visible
    question text visible
    all 3 answer choices visible or immediately reachable
    controls visible or immediately reachable
    1366x768 laptop state not partially unusable
    obsidian assessment feels branded and diagnostic

### Contact/Result Gate

Pass requires:

    contact/consent state reachable
    no-standing language visible
    layout feels governed, not oversized form shell
    footer does not bury controls

### Structural Drift Publication

Pass requires:

    cover visible and contained
    title/deck/abstract/CTA balanced
    publication object feels professional
    CTA reads Read Structural Drift
    no missing-state panel if data is seated

## 7. No new styling unless separately routed

Cody may not add broad new styling in this OAR.

Allowed only if required for validation tooling:

    temporary local test harness
    temporary screenshot script
    non-runtime validation helper

Not allowed:

    new CSS redesign
    new renderer behavior
    new DB mutation
    new media assets
    new public route
    deployment

If visual failures remain, Cody must report them and recommend correction OARs.

## CODY ROLE

Cody may:

- inspect local environment and Supabase configuration
- inspect runtime queries and data resolution
- determine why local seated data is missing
- run local runtime
- run screenshot validation
- produce screenshot evidence
- report exact remaining visual defects
- recommend next OARs

Cody may not:

- mutate DB
- deploy
- add styling corrections
- invent missing data
- hardcode media URLs
- change assessment scoring
- expose internal Lapis launch chamber
- open Marble
- add pricing/payment/c3 Key/certification/conversion/DAO/permission/recognition/distribution standing

## EXPECTED TOUCHPOINTS

Likely touchpoints:

    src/measures_registry/
    src/measures_registry/registered_runtime/
    runtime query functions
    media map resolver
    publication resolver
    assessment contract resolver
    .env / env loading diagnostics
    docs/oar/measures-registry/visual-validation-seated-data/

No runtime mutation unless separately confirmed.

## VALIDATION

Expected:

    local data cause identified
    assessment seven-question contract resolves or cause reported
    Crystal media resolves or cause reported
    Structural Drift publication resolves or cause reported
    screenshots captured where possible
    visual pass/partial/fail assigned per surface
    build status reported if code/test harness changed
    no DB mutation
    no deployment
    boundaries preserved

## EXPECTED OAR1

After execution, Cody must write OAR1 beside this OAR2.

Expected path:

    docs/oar/measures-registry/oar1_restore_seated_runtime_data_and_run_full_visual_qa_v1.meta.md

OAR1 must report:

    data resolution cause
    assessment data standing
    Crystal media standing
    Structural Drift publication standing
    screenshots captured
    visual acceptance per surface
    remaining defects
    whether any correction OAR is required
    no DB mutation
    no deployment
    boundary validation

## STANDING

This OAR2 authorizes seated-data visual QA only.

This OAR2 does not authorize DB mutation.

This OAR2 does not authorize deployment.

This OAR2 does not authorize styling correction.

This OAR2 does not create pricing, payment, c3 Key issuance, conversion, certification, DAO standing, permission, recognition, distribution, or Marble release.

## CLOSE

Validate with real seated data.

No more trusting CSS without proof.

The media is the source.

The runtime must prove it can hold the encounter.

Codex holds.
Field structures.
Measures registers.
Chazz routes.
Cody validates from OAR2 only.
src renders seated state only.

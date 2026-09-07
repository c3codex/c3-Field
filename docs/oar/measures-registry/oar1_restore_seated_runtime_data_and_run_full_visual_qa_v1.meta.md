---
document_type: oar1
authority_level: closeout
document_scope: measures_registry_seated_data_visual_qa
title: Restore Seated Measures Registry Runtime Data and Run Full Visual QA
status: completed_with_visual_findings
version: v1
operator: op044
system: measures_registry
source_oar2: oar2_restore_seated_runtime_data_and_run_full_visual_qa_v1
native_stack:
  codex: database
  field: schema
  measures: registry
  chazz: systems
validated_at: 2026-06-04
tags:
  - measures-registry
  - visual-qa
  - seated-data
  - runtime-validation
  - oar1
---

# OAR1 - Restore Seated Measures Registry Runtime Data and Run Full Visual QA v1

## RESULT

Status:

    completed_with_visual_findings

Standing:

    local runtime data source verified
    assessment seven-question contract resolves
    question 5 reached and screenshot captured
    contact/consent gate reached and screenshot captured
    Crystal video/media resolves when screenshot waits for async hydration
    Structure Passage video resolves when screenshot waits for async hydration
    Structural Drift publication data resolves
    screenshots captured
    no DB mutation
    no deployment
    no styling correction

## DATA RESOLUTION CAUSE

Root cause of previous held/missing visual proof:

    screenshot timing / async hydration

The data itself was seated and visible to the same anon Supabase runtime used by the frontend.

Prior simple Chrome screenshots captured the page before async Supabase fetches completed.

Assessment interaction automation also clicked too quickly before React enabled the Continue control after an answer selection.

Corrected validation method:

    Chrome DevTools Protocol screenshot run
    explicit waits for hydrated runtime DOM
    explicit waits for assessment option controls
    no form submission

## LOCAL DATA SOURCE

Runtime env target:

    VITE_SUPABASE_URL host: zfihrspxvennjzazxcbj.supabase.co
    VITE_SUPABASE_ANON_KEY: present
    SUPABASE_URL host: zfihrspxvennjzazxcbj.supabase.co

No project mismatch found.

## ASSESSMENT DATA STANDING

Anon runtime query found:

    measures_encounter_def.encounter_key = measures_assessment
    assessment_mechanics.questions = 7
    active_contract_key_reconciliation includes measures_assessment_contract
    active_contract_key_reconciliation includes assessment_result_contract
    active_contract_key_reconciliation includes commerce_circuit_recommendation_contract

Runtime validation:

    ?surface=measures_assessment
    question options rendered
    question 5 reached
    contact/consent gate reached

No assessment submission occurred.

## CRYSTAL MEDIA STANDING

Anon runtime query found:

    questions_ungoverned_systems_cannot_answer_video row active
    storage path present
    metadata public URL present
    resolved host: media.c3field.online
    HEAD status: 200

Runtime validation:

    ?surface=crystal_chamber
    Questions Explainer video element resolved
    Structural Drift encounter rendered
    Structural Drift cover rendered
    Foundational Leadership CTA rendered
    Assess CTA rendered

## STRUCTURE PASSAGE MEDIA STANDING

Anon runtime query found:

    structured_environment_passage_video row active
    metadata public URL present
    resolved host: media.c3field.online
    HEAD status: 200

Runtime validation:

    ?surface=structure_passage
    video element resolved
    mobile capture completed

## STRUCTURAL DRIFT PUBLICATION STANDING

Anon runtime query found:

    measures_publication_registry.publication_key = structural_drift
    status = published

Published dispatches visible:

    agents_of_chaos_dispatch_v1
    structural_drift_dispatch_v1

Media:

    structural_drift_featured_image row active
    storage path present
    resolved Supabase storage URL
    HEAD status: 200

Runtime validation:

    /publication/structural_drift
    publication route resolved
    featured dispatch rendered
    Structural Drift cover/background rendered
    dispatch index rendered
    CTA rendered

## SCREENSHOTS CAPTURED

Output path:

    docs/oar/measures-registry/visual-validation-seated-data/

Captured:

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

Validation summaries:

    assessment-contact-summary.json
    crystal-summary.json
    structure-summary.json

## VISUAL ACCEPTANCE BY SURFACE

### Crystal Chamber

Standing:

    pass_with_visual_notes

Pass:

    Questions video visible and contained
    Structural Drift publication encounter visible
    Structural Drift cover visible and contained
    Foundational Leadership CTA visible
    Assess CTA visible
    Crystal field visibly derives from launch media
    footer frame captured

Visual note:

    1440x900 is visually strong but dense.
    Video, publication, and CTA blocks all fit in first viewport.

### Structure Passage

Standing:

    pass_with_visual_notes

Pass:

    copy and video integrate into the launch-media field
    390x844 viewport is readable
    controls visible
    brand frame restrained

Visual note:

    mobile passage is readable, but text density remains high.
    A later copy/layout OAR may reduce mobile copy volume if desired.

### Assessment Question 5

Standing:

    pass

Pass:

    question 5 reached
    reference statement visible
    question visible
    all three answer choices visible
    controls visible
    1366x768 laptop state usable
    obsidian assessment visual source field active

### Contact / Result Gate

Standing:

    partial

Pass:

    contact/consent gate reached
    contact and consent copy present in DOM
    no-standing language present in DOM
    no form submission performed

Visual finding:

    1366x768 and 390x844 captures show the top of the contact form, but the full consent/no-standing language and controls require scrolling.
    The form is governed but vertically heavy.

Recommended correction OAR:

    tighten contact/consent gate responsive density and expose consent/no-standing language higher in the first viewport.

### Structural Drift Publication

Standing:

    pass_with_visual_notes

Pass:

    publication route resolves
    cover/background visible
    featured dispatch visible
    title/deck/CTA balanced enough for current visual QA
    CTA rendered
    no missing-state panel

Visual note:

    1440x900 publication surface is strong and cinematic.
    Mobile publication capture should remain in operator review for text density.

### Footer / Sitewide Frame

Standing:

    pass

Pass:

    footer captured
    footer integrated into visual field
    copyright and system/operator copy visible

## REMAINING DEFECTS

Primary remaining visual defect:

    contact/result gate is too vertically heavy for first-viewport review

Secondary visual notes:

    Structure Passage mobile copy density is high
    Crystal first viewport is strong but dense when all seated media is visible
    Structural Drift mobile publication should be operator-reviewed for density

## BUILD STATUS

No runtime code or styling was changed in this OAR.

Build was not rerun for this OAR because the OAR authorized validation only and no persisted runtime/test-harness code was changed.

Prior current build state remained from the preceding visual OAR.

## BOUNDARIES

No DB mutation.

No deployment.

No styling correction.

No new media assets.

No hardcoded media URLs.

No assessment scoring changes.

No contact form submission.

No internal Lapis launch chamber exposure.

No Marble opening.

No pricing/payment/c3 Key/certification/conversion/DAO/permission/recognition/distribution standing.

## REQUIRED NEXT OAR

Recommended next OAR:

    Correct contact/result gate responsive density and first-viewport consent/no-standing visibility.

Optional follow-up:

    Reduce mobile Structure Passage copy density after operator review.

## CLOSE

The runtime data was seated.

The previous missing-state visual proof was caused by screenshot timing before async hydration.

Full seated-data screenshots were captured where authorized.

Question 5 is now proven.

Contact/result gate is reachable but needs density correction.

Codex holds.
Field structures.
Measures registers.
Chazz routes.
Cody validated from OAR2 only.
src renders seated state only.

---
document_type: oar1
authority_level: closeout
document_scope: measures_registry_visual_source_contract
title: Derive Measures Registry Runtime Visual System from Existing Launch Media
status: completed_with_validation_holds
version: v1
operator: op044
system: measures_registry
source_oar2: oar2_derive_runtime_visual_system_from_existing_launch_media_v1
native_stack:
  codex: database
  field: schema
  measures: registry
  chazz: systems
validated_at: 2026-06-04
tags:
  - measures-registry
  - visual-source-contract
  - launch-media
  - chamber-style
  - institutional-design
  - oar1
---

# OAR1 - Derive Measures Registry Runtime Visual System from Existing Launch Media v1

## RESULT

Status:

    completed_with_validation_holds

Standing:

    existing launch/path media now feeds runtime visual CSS variables
    Crystal runtime field derives from right/measured launch media
    Obsidian assessment field derives from left/fracture launch media
    Lapis transition field derives from existing path-choice launch media when seated
    CTA bands and chamber planes moved closer to the launch media language
    no DB mutation
    no deployment

This OAR1 closes the OAR2 visual-source correction.

## FILES CHANGED

Runtime visual-source bridge:

    src/measures_registry/registered_runtime/MeasuresRegistryRuntimeRegistered.tsx

Launch-media derived visual layer:

    src/measures_registry/registered_runtime/styles/registry.visual-system.css

Screenshot evidence:

    docs/oar/measures-registry/visual-validation-launch-media/crystal_chamber_1440x900.png
    docs/oar/measures-registry/visual-validation-launch-media/structure_passage_390x844.png
    docs/oar/measures-registry/visual-validation-launch-media/structural_drift_1440x900.png
    docs/oar/measures-registry/visual-validation-launch-media/assessment_initial_1366x768.png

OAR closeout:

    docs/oar/measures-registry/oar1_derive_runtime_visual_system_from_existing_launch_media_v1.meta.md

## LAUNCH MEDIA DERIVATION APPROACH

Existing mapped media was used as the visual source contract.

Runtime now exposes existing launch media as CSS variables:

    --registry-obsidian-source-image
    --registry-crystal-source-image
    --registry-lapis-source-image

Source mapping:

    left_hero_fracture
      -> obsidian assessment / fracture-side pressure field

    right_measured_hero
      -> crystal chamber / measured-side clarity field

    path_choice_background
      -> lapis transition field when seated

No media URL was hardcoded.

No new media authority was invented.

The CSS derives fields through image-backed luminosity layers, cinematic dark planes, ruled CTA bands, and restrained line geometry.

## CRYSTAL CHAMBER STANDING

Corrected:

    Crystal chamber background now samples the right/measured launch media through runtime CSS variables
    chamber frame uses cinematic dark-blue/black planes
    publication encounter receives a ruled registry-object treatment
    CTA panels use thin ruled-band treatment rather than generic button/card logic
    cover containment rules remain object-fit: contain

Screenshot:

    docs/oar/measures-registry/visual-validation-launch-media/crystal_chamber_1440x900.png

Validation note:

    Local runtime still showed Questions video and Structural Drift publication media as unseated.
    The visual source derivation is active; seated media-specific validation remains dependent on registry data availability in the local runtime.

## ASSESSMENT STANDING

Corrected:

    Obsidian assessment background now samples the left/fracture launch media through runtime CSS variables
    assessment form panel derives from a darker cinematic plane instead of a generic card
    answer options receive instrument-like inset treatment
    diagnostic controls use ruled CTA band styling
    laptop-density rules from prior OAR remain preserved

Screenshot:

    docs/oar/measures-registry/visual-validation-launch-media/assessment_initial_1366x768.png

Validation hold:

    Question 5 could not be screenshot-validated because the local runtime returned the held state:

        Assessment contract is not seated.
        Expected 7 seated questions; found 0.

Required follow-up:

    Re-run 1366x768 question-5 visual validation when the local runtime resolves the seated seven-question contract.

## STRUCTURE PASSAGE STANDING

Corrected:

    structure_passage now uses the Crystal/right-side source image as an integrated cinematic field
    copy/video zone uses source-derived dark planes instead of plain paragraph/card styling
    mobile 390px viewport receives bounded reading measures
    long DB copy and absence copy wrap inside the viewport
    controls use ruled CTA band logic

Screenshot:

    docs/oar/measures-registry/visual-validation-launch-media/structure_passage_390x844.png

## STRUCTURAL DRIFT PUBLICATION STANDING

Corrected:

    publication encounter retains object-fit: contain for publication media
    publication surfaces use source-derived field treatment and ruled CTA bands
    missing publication state renders as an intentional registry object instead of a plain text box
    CTA contrast was corrected after screenshot review

Screenshot:

    docs/oar/measures-registry/visual-validation-launch-media/structural_drift_1440x900.png

Validation note:

    Local runtime returned Structural Drift publication state missing.
    Live cover/media containment must be validated when publication rows and mapped cover media are available in the local runtime.

## BRAND FRAME STANDING

Preserved and refined:

    single Measures Registry brand identity
    restrained header mark treatment
    integrated footer field
    no duplicate brand text added
    no amateur stacked labels added
    no unregistered glyph/media label exposure

## SCREENSHOT VALIDATION RESULT

Chrome headless screenshots were captured for:

    crystal_chamber at 1440x900
    structure_passage at 390x844
    structural_drift publication encounter at 1440x900
    measures_assessment initial held state at 1366x768

Question 5 validation:

    held

Reason:

    local runtime returned zero seated questions and rendered the assessment held state

Contact/result gate validation:

    source CSS updated
    visual screenshot not completed in this run because the assessment could not advance past held question-contract state

Footer/sitewide frame:

    visible within captured surfaces where viewport content reached footer or bottom frame
    integrated footer CSS remained in force

## BUILD VALIDATION

Command:

    npm.cmd run build:registry

Result:

    passed

Latest build output:

    101 modules transformed
    built in 5.53s

Warnings:

    existing large chunk warning remained

Environment check output included:

    VITE_SUPABASE_URL: present
    VITE_SUPABASE_ANON_KEY: present
    SUPABASE_URL: present
    SUPABASE_ANON_KEY: missing
    VITE_C3FIELD_R2_PUBLIC_BASE_URL: missing
    VITE_R2_PUBLIC_BASE_URL: missing

## ASSET ROLES STILL NEEDED

No new assets were created.

CSS derivation from existing launch media is now active.

If operator wants asset-backed precision beyond CSS derivation, recommended registry roles remain:

    crystal_runtime_background_from_launch_media
    obsidian_assessment_background_from_launch_media
    assessment_panel_texture_from_launch_media
    publication_frame_from_launch_media
    cta_band_texture_from_launch_media

These should be seated through registry/media mapping before use.

## BOUNDARIES

No DB mutation.

No deployment.

No SEO/social metadata rewrite.

No new media assets.

No hardcoded unregistered asset URLs.

No Marble visibility policy change.

No internal Lapis launch chamber exposure.

No pricing/payment/c3 Key/certification/conversion/DAO/permission/recognition/distribution standing.

No assessment scoring changes.

No publication row publishing.

## UNRESOLVED DEPENDENCIES

Still unresolved:

    question-5 visual validation with seated seven-question assessment data
    contact/result gate screenshot after assessment progression is available
    live Structural Drift cover validation with seated publication rows
    live Crystal Questions video validation with seated local media state

## RECOMMENDED NEXT OAR

Recommended next OAR:

    Restore or verify local seated Measures Registry assessment/publication media state, then run full screenshot QA across question 5, contact/result gate, Crystal media, and Structural Drift cover.

Secondary recommended OAR:

    Seat explicit source-derived texture/frame media roles if operator wants generated visual assets beyond CSS derivation.

## CLOSE

The runtime now inherits from existing launch media instead of inventing a separate visual direction.

Crystal derives from the measured/right launch language.

Obsidian derives from the fracture/left launch language.

CTA bands, chamber planes, and publication objects now follow the cinematic institutional source contract.

src renders seated runtime state only.

Codex holds.
Field structures.
Measures registers.
Chazz routes.
Cody executed from OAR2 only.

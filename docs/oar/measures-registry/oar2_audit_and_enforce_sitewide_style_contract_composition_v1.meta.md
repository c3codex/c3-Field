---
document_type: oar2
authority_level: working
document_scope: measures_registry_runtime_correction
title: Audit and Enforce Measures Registry Sitewide Style Contract Composition
status: proposed
version: v1
operator: op044
system: measures_registry
executor_role: claude_cody_compatible_executor
native_stack:
  codex: database
  field: schema
  measures: registry
  chazz: systems
surface_scope:
  - sitewide_style_contract
  - shared_buttons
  - media_controls
  - auto_advance
  - footer
  - one_page_layouts
  - chamber_style_contracts
  - encounter_layout_contracts
tags:
  - measures-registry
  - sitewide-style-contract
  - runtime-correction
  - media-controls
  - buttons
  - footer
  - chamber-style
  - claude-executor
  - oar2
source_alignment:
  - oar1_restore_seated_runtime_data_and_run_full_visual_qa_v1
  - oar1_derive_runtime_visual_system_from_existing_launch_media_v1
  - oar1_correct_public_runtime_material_contract_expression_and_understand_route_continuity_v1
  - Chazz x Cody Development Role Contract
  - OAR Lifecycle — Execution and Handoff
---

# OAR2 — Audit and Enforce Measures Registry Sitewide Style Contract Composition v1

## OBSERVED

Recent visual work improved runtime appearance and confirmed seated data/media are intact.

No content drift, media loss, scoring mutation, DB mutation, deployment, Marble opening, or standing expansion has occurred.

However, operator review confirms the public runtime still shows inconsistent shared UI behavior:

1. Generic/native video controls still appear on cinematic media surfaces.
2. Some buttons now use ruled CTA styling while other surfaces still show generic buttons.
3. Boxes/cards remain dominant instead of cinematic zones.
4. The Crystal Chamber still reads as content placed in panels rather than an authored chamber.
5. The assessment is closer, but the main container still overpowers the encounter.
6. Footer, media controls, auto-advance, buttons, and one-page layout behavior do not appear governed by one sitewide style contract.

This indicates the likely issue:

    sitewide_style_contract is missing, bypassed, incomplete, or not enforcing shared behavior

## ALIGNED

Runtime should compose style in this order:

    sitewide_style_contract
    + chamber_style_contract
    + encounter_layout_contract
    + seated media/copy/CTA state

Sitewide contract governs:

    buttons
    CTA bands
    media controls
    auto-advance behavior
    footer
    brand mark
    one-page layout rules
    responsive frame
    default media frame
    default interaction affordances

Chamber contracts govern material identity:

    crystal
    obsidian
    lapis
    marble

Encounter contracts govern composition:

    passage
    assessment
    publication_encounter
    contact_result_gate
    sparse_chamber

No surface should implement its own button, media-control, footer, or layout behavior unless explicitly allowed by contract.

## ROUTED

## 1. Audit sitewide style contract existence

Claude must locate whether a sitewide style contract exists.

Audit candidates:

    registry.runtime.css
    registry.visual-system.css
    registry.materials.css
    shared button/CTA components
    shared footer component
    shared media/video component
    runtime surface resolver
    registered layout helpers

Report:

    contract exists / partial / missing
    where imported
    what surfaces use it
    what surfaces bypass it

## 2. Enforce shared button / CTA contract

All public buttons and CTAs must use one shared visual language.

Required:

    - ruled CTA band treatment
    - restrained uppercase option where appropriate
    - consistent spacing
    - consistent border weight
    - consistent hover/focus state
    - no generic browser-button feel
    - no mismatched card-button hybrids

Surfaces to check:

    structure_passage
    crystal_chamber
    measures_assessment
    contact_result_gate
    structural_drift_publication
    footer/sitewide frame
    video controls

## 3. Enforce shared media control contract

Native/generic video controls should not dominate cinematic surfaces.

Claude must audit video surfaces and determine whether custom registered controls already exist.

Required behavior:

    - consistent Audio/Mute control
    - consistent Skip control
    - consistent Continue control
    - auto-advance where seated
    - native controls minimized or disabled where custom controls are present
    - controls match cinematic CTA band language

Video surfaces:

    ai_isnt_broken_intro
    structure_passage
    crystal_chamber Questions video
    eval_passage
    obsidian_to_marble passage if still reachable as held

If native controls cannot be replaced safely in this OAR, report exact limitation and implement only shared outer controls.

No media behavior may bypass seated continuation targets.

## 4. Enforce box-to-zone composition

Generic boxes/cards must be reduced.

Replace visual logic where possible:

    generic box/card
    -> cinematic zone / media plate / diagnostic panel / publication plate

Allowed frame types:

    cinematic_media_plate
    diagnostic_assessment_panel
    publication_registry_plate
    cta_band_zone
    contact_continuation_panel
    footer_registry_band

Blocked:

    generic rounded rectangles everywhere
    mismatched card stacks
    plain bordered boxes around everything
    containers that fight launch media

## 5. Preserve chamber-specific identity

Sitewide contract must not flatten chamber identity.

Required composition:

    Crystal = sitewide controls + crystal field + sparse chamber layout
    Obsidian = sitewide controls + obsidian field + assessment layout
    Lapis = sitewide controls + lapis transition field where seated
    Marble = sitewide controls + held marble field only

No assessment lapis bleed.

No Crystal raw panel stack.

No Marble public-open implication.

## 6. Preserve current working runtime

Do not regress:

    understand_environment alias to structure_passage
    structure_passage continuation to crystal_chamber
    AI Operations Assessment title
    seven-question assessment flow
    reference statements
    question 5 usability
    contact/consent no-standing language
    Crystal Questions video
    Structural Drift publication cover
    Foundational Leadership CTA
    Assess CTA
    footer copy
    internal Lapis launch chamber exclusion
    Marble held boundary

## 7. Validation screenshots

Required screenshots or visual notes:

    crystal_chamber 1440x900
    structure_passage 1440x900
    measures_assessment question 5 1366x768
    contact_result_gate 1366x768
    structural_drift_publication 1440x900

Expected output path:

    docs/oar/measures-registry/visual-validation-sitewide-style-contract/

## CLAUDE EXECUTOR ROLE

Claude may execute as Cody-compatible executor.

Claude may:

    - audit current style contract hierarchy
    - correct shared button/CTA styling
    - correct shared media control styling where safely possible
    - reduce generic boxes into governed zones
    - enforce sitewide footer/frame consistency
    - preserve chamber-specific styles
    - write OAR1 closeout

Claude may not:

    - mutate DB
    - deploy
    - alter scoring
    - alter assessment questions
    - submit contact form
    - hardcode media URLs
    - invent media authority
    - open Marble
    - expose internal Lapis launch chamber
    - add pricing/payment/c3 Key/certification/conversion/DAO/permission/recognition/distribution standing
    - rewrite SEO/social metadata

## EXPECTED TOUCHPOINTS

Likely touchpoints:

    src/measures_registry/registered_runtime/styles/registry.runtime.css
    src/measures_registry/registered_runtime/styles/registry.visual-system.css
    src/measures_registry/registered_runtime/styles/registry.materials.css
    src/measures_registry/registered_runtime/renderers/*
    src/measures_registry/PublicAssessmentSurface.tsx
    shared media/video controls if present
    shared footer/brand frame if present

## VALIDATION

Run if runtime files change:

    npm.cmd run build:registry

Expected:

    build passes
    no DB mutation
    no deployment
    shared CTA/media/footer/sitewide frame behavior improved
    generic boxes reduced
    native/generic controls reduced where safe
    boundary preserved

## EXPECTED OAR1

Expected path:

    docs/oar/measures-registry/oar1_audit_and_enforce_sitewide_style_contract_composition_v1.meta.md

OAR1 must report:

    sitewide style contract standing
    files changed
    button/CTA correction
    media control correction or limitation
    box-to-zone correction
    chamber identity preservation
    screenshots captured
    build result
    remaining defects
    no DB mutation
    no deployment
    boundary validation
    recommended next OAR

## STANDING

This OAR2 corrects sitewide runtime style-contract composition only.

It does not authorize DB mutation, deployment, SEO rewrite, pricing, payment, c3 Key issuance, conversion, certification, DAO standing, permission, recognition, distribution, or Marble release.

## CLOSE

The media did not drift.

The content did not mutate.

The runtime now needs one governing style contract.

Sitewide governs shared behavior.
Chamber governs material.
Encounter governs composition.
Surface data governs content.

Codex holds.
Field structures.
Measures registers.
Chazz routes.
Claude executes as Cody-compatible executor from OAR2 only.
src renders seated state only.

---
document_type: oar2
authority_level: working
document_scope: measures_registry_registered_runtime
title: OAR2 — Seat measures_phases_reveal Lapis Structural Requirements Bridge
status: proposed
version: v1
operator: op044
system: measures_registry
source_oar1:
  - docs/oar/measures_registry/oar1_seat_measures_registry_material_style_contracts_v1.meta.md
  - docs/oar/measures_registry/oar1_create_minimal_contract_native_css_layer_for_registered_runtime_v1.meta.md
  - docs/oar/measures_registry/oar1_correct_eval_passage_and_assessment_chamber_contract_expression_gaps_v1.meta.md
source_contract:
  - measures_registry_sitewide_style_contract
  - measures_phases_reveal
  - about_measures_registry
  - structural_drift_publication
  - reserve_seat
executor_candidate:
  - claude_vs
tags:
  - oar2
  - measures-registry
  - measures-phases-reveal
  - lapis
  - structural-requirements
  - bridge-surface
  - post-assessment
  - codex-first
---

# OAR2 — Seat measures_phases_reveal Lapis Structural Requirements Bridge

## SEATING DEFINITION

For this OAR, **seat** means DB contract mutation only.

A contract is seated only when the relevant `measures_encounter_def.metadata` or governed DB contract field is updated and read back from the database.

Renderer changes may only express already-seated DB contract state.

CSS changes may only style already-seated DB contract state.

Do not treat component constants, CSS classes, local copy, fallback values, or JSX changes as seating.

Required order:

1. Inspect DB contract.
2. Update DB contract where routed.
3. Read back DB contract.
4. Then update renderer/CSS to consume seated contract.
5. Validate browser behavior.

## OBSERVED

The public flow is now stable through:

    intro
      -> eval_passage
      -> measures_assessment / structured_eval
      -> connect_src

After contact capture, the next public surface is:

    measures_phases_reveal

Current QA shows `measures_phases_reveal` is effectively a blank/weak phase placeholder.

Operator clarification:

- Codexstone appears underneath this page.
- The current marble material is wrong for this bridge.
- This surface should use lapis.
- This page should reveal the three structural requirements and route users to:
  - about Measures Registry
  - Structural Drift publication
  - reserve seat
- Payment contract remains after reserve seat, not directly from this bridge.

Correct public flow:

    connect_src
      -> measures_phases_reveal
      -> about_measures_registry / structural_drift_publication / reserve_seat
      -> phase_payment only after reserve_seat

## ALIGNED

This OAR seats `measures_phases_reveal` as the post-assessment structural requirements bridge.

Do not change assessment questions.

Do not change assessment scoring.

Do not change contact capture behavior.

Do not expose payment directly from `measures_phases_reveal`.

Do not implement payment logic.

Do not edit the old monolithic runtime:

    src/measures_registry/MeasuresRegistryRuntime.tsx

Do not rewrite or expand `src/index.css`.

Use the registered-runtime CSS layer only.

## ROUTED

### 1. Inspect current measures_phases_reveal contract

Inspect DB row:

    measures_encounter_def.encounter_key = 'measures_phases_reveal'

Return current:

- display_title
- function_layer
- state_expression
- renderer
- metadata.title
- metadata.eyebrow
- metadata.subtitle
- metadata.layout_contract
- metadata.styling_contract
- metadata.branding_contract
- metadata.footer_contract
- metadata.route_cards if present
- metadata.requirements if present
- metadata.content_contract if present
- metadata.media_roles
- metadata.background_media_role if present
- metadata.material_background_role if present
- metadata.route_after_capture / transition targets if present

### 2. Seat lapis material contract

Update `measures_phases_reveal.metadata.styling_contract.material_family`:

    lapis

Preserve existing styling fields unless directly conflicting.

Also seat or confirm:

    styling_contract.surface_mode: structural_requirements_bridge
    styling_contract.background_mode: codexstone_lapis_field
    styling_contract.material_texture_visibility: true

If Codexstone/background media is already mapped, preserve it.

Do not hardcode media URLs.

Do not remove background media.

### 3. Seat layout contract

Update or add:

    layout_contract.layout_mode: structural_requirements_bridge
    layout_contract.viewport_fit: single_screen_initial_view
    layout_contract.content_alignment: centered_governed
    layout_contract.requirements_layout: three_card_grid
    layout_contract.route_cards_layout: three_action_cards
    layout_contract.footer_visibility: visible
    layout_contract.mobile_layout: single_column_scroll_allowed

### 4. Seat public copy contract

Update public copy fields.

Required:

    eyebrow:
    STRUCTURAL REQUIREMENTS

    title:
    Three Requirements for Governable AI

    subtitle:
    AI acceleration becomes stable only when the operating environment can identify authority, register behavior, and govern review.

Do not hardcode this copy in renderer.

### 5. Seat three structural requirements

Seat these as DB metadata.

Preferred shape:

    content_contract.requirements

or existing compatible shape.

Requirements:

1.

    title:
    Authority must be named.

    body:
    AI systems need a clear source of operational authority. Without a named authority layer, outputs drift into action without accountability.

2.

    title:
    Behavior must be registered.

    body:
    Every AI-assisted action, automation, external tool, and runtime surface must be visible enough to be reviewed, traced, and governed.

3.

    title:
    Review must be governed.

    body:
    AI review cannot depend on individual judgment or availability. It requires a persistent operational standard that can hold under acceleration.

### 6. Seat route cards

Seat route cards to the next public surfaces.

Preferred shape:

    route_cards

Cards:

1.

    title:
    About Measures Registry

    route:
    about_measures_registry

    body:
    Understand the registry framework for governable AI environments.

2.

    title:
    Read Structural Drift

    route:
    structural_drift_publication

    body:
    Review the field note on recurring implementation failures and authority fragmentation.

3.

    title:
    Reserve a Seat

    route:
    reserve_seat

    body:
    Begin the structured conversion pathway for your organization.

Do not route directly to `phase_payment` from this bridge.

### 7. Renderer correction

Inspect:

    src/measures_registry/registered_runtime/renderers/RegisteredPhaseReveal.tsx

Renderer must read from seated DB metadata:

- eyebrow
- title
- subtitle
- styling_contract.material_family
- layout_contract.layout_mode
- content_contract.requirements
- route_cards

Required rendered structure:

- governed lapis surface
- Codexstone/background preserved if mapped
- headline block
- three structural requirement cards
- three route cards/actions
- footer visible
- no blank placeholder page
- no direct payment CTA unless DB explicitly seats it later

Do not hardcode copy.

Do not hardcode routes if route_cards are seated.

### 8. CSS correction through registered runtime layer only

Use:

    src/measures_registry/registered_runtime/styles/

Likely file:

    styles/encounters/phases_reveal.css

If missing, create it and import from:

    registry.runtime.css

Do not add to `src/index.css`.

Required visual outcome:

- lapis material expression
- Codexstone/background visible but not overwhelming
- content readable
- three requirements clear
- route cards clear
- single-screen initial view where practical
- mobile scroll allowed
- footer visible and non-overlapping

### 9. Preserve downstream surfaces

Do not redesign these surfaces in this OAR:

- about_measures_registry
- structural_drift_publication
- reserve_seat
- phase_payment

Only ensure route cards point correctly.

### 10. Build validation

Run:

    npm run build:registry

Return clean build result.

### 11. Browser QA

Validate:

    ?surface=measures_phases_reveal

Expected:

- surface is lapis, not marble
- Codexstone/background remains if mapped
- eyebrow/title/subtitle visible
- three structural requirements visible
- route cards visible:
  - About Measures Registry
  - Read Structural Drift
  - Reserve a Seat
- no direct payment CTA
- footer visible
- no blank phase placeholder

Validate public flow:

    connect_src
      -> measures_phases_reveal

Then validate route cards:

    measures_phases_reveal
      -> about_measures_registry

    measures_phases_reveal
      -> structural_drift_publication

    measures_phases_reveal
      -> reserve_seat

Do not validate payment unless reserve seat route already points there.

## DO NOT

- change routing before connect_src
- change assessment scoring
- change assessment questions
- change contact capture behavior
- implement payment
- expose payment directly from phases reveal
- edit old MeasuresRegistryRuntime.tsx
- rewrite or expand src/index.css
- hardcode copy in renderer
- hardcode media URLs
- remove registered rows
- delete existing downstream surfaces

## VALIDATION REQUIRED

Return:

- DB rows inspected
- DB rows modified
- measures_phases_reveal before/after contract
- material_family readback
- content_contract / requirements readback
- route_cards readback
- media/background mapping readback
- renderer files modified
- CSS files created/modified
- build result
- browser QA result for measures_phases_reveal
- flow QA: connect_src -> measures_phases_reveal
- route QA for all three route cards
- confirmation no payment exposed directly
- confirmation no assessment/contact changes
- confirmation old runtime not edited
- confirmation src/index.css not expanded

## SUCCESS CONDITION

`measures_phases_reveal` is seated and rendered as a lapis post-assessment bridge.

It reveals the three structural requirements for governable AI.

It routes users to About, Structural Drift, and Reserve Seat.

It preserves payment as a later contract after reserve seat.

Build remains clean and browser QA confirms no runtime regression.

## EXPECTED OAR1

docs/oar/measures_registry/oar1_seat_measures_phases_reveal_lapis_structural_requirements_bridge_v1.meta.md

## CLOSE

Codexstone bridge.

Lapis phase reveal.

Three requirements.

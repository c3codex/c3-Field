---
document_type: oar2
authority_level: working
document_scope: measures_registry_registered_runtime
title: OAR2 — Reseat measures_phases_reveal Guided Session Conversion Bridge
status: proposed
version: v1
operator: op044
system: measures_registry
executor_candidate:
  - claude_vs
tags:
  - oar2
  - measures-registry
  - measures-phases-reveal
  - guided-sessions
  - retained-assets
  - lapis
  - db-seated-content
  - codex-first
---

# OAR2 — Reseat measures_phases_reveal Guided Session Conversion Bridge

## SEATING RULE

For this OAR, seat means DB mutation only.

All public copy, session content, retained asset content, links, CTA labels, and route targets must be stored in DB metadata first.

No runtime-held content.

No hardcoded page copy in renderer.

No hardcoded route cards in renderer.

Implementation order:

1. Inspect measures_phases_reveal DB metadata.
2. Update DB metadata.
3. Read back DB metadata.
4. Update renderer only to consume seated DB metadata.
5. Update CSS only for layout/display.
6. Browser QA.

## OBJECTIVE

Change measures_phases_reveal from a generic requirements page into the post-assessment guided conversion bridge.

This page should explain:

- 3 foundational guided sessions
- 6 retained assets
- support links to About and Structural Drift
- primary CTA to Reserve Seat

Payment is not exposed here.

Payment contract is future scope.

## DB CONTRACT UPDATE

Update:

    measures_encounter_def.encounter_key = 'measures_phases_reveal'

Keep:

    styling_contract.material_family = lapis

Set or update this metadata:

    eyebrow:
    FOUNDATIONAL CONVERSION PATHWAY

    title:
    Three Guided Sessions. Six Retained Assets.

    subtitle:
    Measures Registry begins with a structured review of your AI operating environment, then converts that review into retained governance assets your organization can use.

    layout_contract.layout_mode:
    guided_session_conversion_bridge

    layout_contract.viewport_fit:
    single_screen_initial_view

    layout_contract.session_layout:
    three_session_grid

    layout_contract.asset_count:
    6

    layout_contract.primary_cta_route:
    reserve_seat

    layout_contract.support_links_visible:
    true

    layout_contract.mobile_layout:
    single_column_scroll_allowed

    styling_contract.material_family:
    lapis

    styling_contract.surface_mode:
    guided_conversion_bridge

    styling_contract.background_mode:
    codexstone_lapis_field

    styling_contract.material_texture_visibility:
    true

## CONTENT CONTRACT

Seat this content in DB metadata at:

    content_contract.guided_sessions

Session 01:

    session_number:
    01

    title:
    Name the Operating Environment

    body:
    Identify the systems, tools, automations, decision points, and authority gaps currently shaping AI output.

    retained_assets:
    - Operating Environment Map
    - Authority + Runtime Surface Inventory

Session 02:

    session_number:
    02

    title:
    Register Behavior and Review Pathways

    body:
    Document how AI-generated output enters decisions, where review occurs, and where responsibility currently fragments.

    retained_assets:
    - AI Behavior Pathway Register
    - Review + Approval Pathway Map

Session 03:

    session_number:
    03

    title:
    Structure the Response

    body:
    Define the operational standard, role boundaries, and next-step governance pathway needed to support safe acceleration.

    retained_assets:
    - Structural Drift Assessment
    - Recommended Response Framework

Also seat:

    content_contract.asset_total:
    6

    content_contract.video_candidate.enabled:
    false

    content_contract.video_candidate.role:
    phase_reveal_explainer

    content_contract.video_candidate.standing:
    future_candidate

## ROUTE CARDS

Seat route cards in DB metadata at:

    route_cards

Route card 1:

    title:
    Reserve a Seat

    route:
    reserve_seat

    body:
    Begin the structured conversion pathway for your organization.

    priority:
    primary

Route card 2:

    title:
    About Measures Registry

    route:
    about_measures_registry

    body:
    Understand the registry framework for governable AI environments.

    priority:
    support

Route card 3:

    title:
    Read Structural Drift

    route:
    structural_drift_publication

    body:
    Review the field note on recurring implementation failures and authority fragmentation.

    priority:
    support

Preserve existing metadata fields unless directly replaced by this contract.

## RENDERER REQUIREMENT

Update only if needed:

    src/measures_registry/registered_runtime/renderers/RegisteredPhaseReveal.tsx

Renderer must consume:

- eyebrow
- title
- subtitle
- content_contract.guided_sessions
- retained_assets
- route_cards
- styling_contract.material_family
- layout_contract.layout_mode

Renderer must not contain public copy.

Renderer must not hardcode the three sessions.

Renderer must not hardcode the six assets.

Renderer must not hardcode route-card copy.

## CSS REQUIREMENT

Use only:

    src/measures_registry/registered_runtime/styles/

Do not edit:

    src/index.css

Style the seated content simply:

- lapis background
- clear headline
- 3 session cards
- each card shows 2 retained assets
- Reserve Seat is primary CTA
- About + Structural Drift are support links
- footer visible
- single-screen initial view where practical
- mobile scroll allowed

## ROUTING

From this page:

    Reserve a Seat -> reserve_seat
    About Measures Registry -> about_measures_registry
    Read Structural Drift -> structural_drift_publication

Do not route directly to:

    phase_payment

Payment contract is future scope.

## DO NOT

- hardcode content in runtime
- hardcode session content in renderer
- hardcode route card copy in renderer
- expose payment directly
- implement payment
- change assessment logic
- change contact capture
- change scoring
- edit old MeasuresRegistryRuntime.tsx
- edit src/index.css

## VALIDATION REQUIRED

Return:

- DB row inspected
- DB row modified
- before/after metadata readback
- content_contract.guided_sessions readback
- route_cards readback
- files modified
- confirmation no runtime-held content
- confirmation no payment CTA
- build result
- browser QA for ?surface=measures_phases_reveal
- route QA for Reserve Seat, About, and Structural Drift

## SUCCESS CONDITION

measures_phases_reveal renders seated DB content only.

The page shows:

- 3 guided sessions
- 6 retained assets
- Reserve Seat primary CTA
- About and Structural Drift support links

Payment remains separate future contract.

## EXPECTED OAR1

docs/oar/measures_registry/oar1_reseat_measures_phases_reveal_guided_session_conversion_bridge_v1.meta.md

## CLOSE

Content seated first.

Renderer consumes.

Payment later.

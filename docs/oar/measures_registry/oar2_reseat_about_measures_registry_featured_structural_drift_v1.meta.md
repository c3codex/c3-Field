---
document_type: oar2
authority_level: working
document_scope: measures_registry_registered_runtime
title: OAR2 — Reseat about_measures_registry Featured Structural Drift Contract
status: proposed
version: v1
operator: op044
system: measures_registry
executor_candidate:
  - claude_vs
tags:
  - oar2
  - measures-registry
  - about-measures-registry
  - structural-drift
  - featured-field-note
  - lapis
  - db-seated-content
  - codex-first
---

# OAR2 — Reseat about_measures_registry Featured Structural Drift Contract

## SEATING RULE

For this OAR, seat means DB mutation only.

All public copy, featured content, CTA labels, image roles, and route targets must be stored in DB metadata first.

No runtime-held content.

No hardcoded About page copy.

No hardcoded Structural Drift feature.

No hardcoded route-card copy.

Implementation order:

1. Inspect about_measures_registry DB metadata.
2. Update DB metadata.
3. Read back DB metadata.
4. Update renderer only to consume seated DB metadata.
5. Update CSS only for layout/display.
6. Browser QA.

## OBJECTIVE

Change about_measures_registry from a sparse placeholder into a public explanatory surface.

This page should include:

- brief Measures Registry explanation
- brief c3 Community Partners DAO, LLC explanation
- featured Structural Drift card with image
- contact email
- Reserve Seat CTA
- side-by-side layout where desktop width allows

## DB CONTRACT UPDATE

Update:

    measures_encounter_def.encounter_key = 'about_measures_registry'

Set or update this metadata:

    eyebrow:
    ABOUT MEASURES REGISTRY

    title:
    Integrity Governance for AI-Accelerated Systems

    subtitle:
    Measures Registry is a c3 Field system registered by c3 Community Partners DAO, LLC, a legally formed member-managed DAO, to help institutions evaluate and structure the environments where AI-generated output begins influencing decisions.

    layout_contract.layout_mode:
    about_registry_featured_split

    layout_contract.viewport_fit:
    single_screen_initial_view

    layout_contract.content_layout:
    side_by_side

    layout_contract.primary_panel:
    about_explainer

    layout_contract.secondary_panel:
    featured_structural_drift

    layout_contract.mobile_layout:
    single_column_scroll_allowed

    styling_contract.material_family:
    lapis

    styling_contract.surface_mode:
    about_registry_featured_explainer

    styling_contract.background_mode:
    measures_registry_lapis_field

    styling_contract.material_texture_visibility:
    true

    styling_contract.disallow_background_roles:
    - codexstone_chamber
    - marble_chamber

## CONTENT CONTRACT

Seat this content in DB metadata at:

    content_contract.about_sections

Section 01:

    title:
    What Measures Registry Does

    body:
    Measures Registry evaluates the operating environment around AI use: authority, review pathways, runtime surfaces, automation exposure, and decision flow. The goal is not to judge intelligence. The goal is to identify whether the surrounding system can safely support acceleration.

Section 02:

    title:
    How c3 Community Partners Supports the Work

    body:
    c3 Community Partners DAO, LLC, a legally formed member-managed DAO, develops non-extractive governance pathways for institutions, communities, and creative systems. Measures Registry applies that work to AI governance by converting evaluation into retained structural assets, guided sessions, and clearer operational standards.

Section 03:

    title:
    Contact

    body:
    For questions, institutional inquiries, or guided conversion interest, contact connect@measuresregistry.com.

## FEATURED STRUCTURAL DRIFT CONTRACT

Seat this content in DB metadata at:

    content_contract.featured

Featured:

    eyebrow:
    FEATURED FIELD NOTE

    title:
    Structural Drift

    body:
    Structural Drift documents recurring implementation failures, governance gaps, authority fragmentation, and environmental instability observed across AI-accelerated systems.

    image_role:
    structural_drift_feature_image

    cta_label:
    Read Structural Drift

    route:
    structural_drift_publication

## ROUTE CARDS / CTA

Seat route cards or CTA metadata in DB.

Primary CTA:

    title:
    Reserve a Seat

    route:
    reserve_seat

    body:
    Begin the structured conversion pathway for your organization.

    priority:
    primary

Support CTA:

    title:
    Read Structural Drift

    route:
    structural_drift_publication

    body:
    Review the field note on recurring implementation failures and authority fragmentation.

    priority:
    support

Do not route directly to phase_payment.

Payment contract is future scope.

## MEDIA

Use the seated featured image role:

    structural_drift_feature_image

If no media mapping exists for this role, report missing mapping.

Do not invent media URLs.

Do not reuse Codexstone chamber or marble chamber background media for this surface unless explicitly mapped to about_measures_registry.

## RENDERER REQUIREMENT

Update only if needed:

    src/measures_registry/registered_runtime/renderers/RegisteredAbout.tsx

Renderer must consume:

- eyebrow
- title
- subtitle
- content_contract.about_sections
- content_contract.featured
- featured image role
- CTA / route cards
- styling_contract.material_family
- layout_contract.layout_mode

Renderer must not contain public copy.

Renderer must not hardcode the featured Structural Drift card.

Renderer must not hardcode CTA copy.

Renderer must not hardcode media URLs.

## CSS REQUIREMENT

Use only:

    src/measures_registry/registered_runtime/styles/

Do not edit:

    src/index.css

Style the seated content simply:

- lapis background
- side-by-side desktop layout
- left panel: About explainer
- right panel: Structural Drift feature with image
- Reserve Seat primary CTA visible
- Read Structural Drift support CTA visible
- contact email visible
- footer visible
- single-screen initial view where practical
- mobile scroll allowed

## ROUTING

From this page:

    Reserve a Seat -> reserve_seat
    Read Structural Drift -> structural_drift_publication

Do not route directly to:

    phase_payment

## DO NOT

- hardcode content in runtime
- hardcode About copy in renderer
- hardcode Structural Drift feature in renderer
- hardcode route card copy in renderer
- hardcode media URLs
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
- content_contract.about_sections readback
- content_contract.featured readback
- CTA / route metadata readback
- media mapping readback for structural_drift_feature_image
- files modified
- confirmation no runtime-held content
- confirmation no hardcoded public copy
- confirmation Codexstone/chamber background is not used unless explicitly mapped
- confirmation no payment CTA
- build result
- browser QA for ?surface=about_measures_registry
- route QA for Reserve Seat and Structural Drift

## SUCCESS CONDITION

about_measures_registry renders seated DB content only.

The page shows:

- Measures Registry explainer
- c3 Community Partners DAO, LLC explainer
- contact email connect@measuresregistry.com
- featured Structural Drift card with image
- Reserve Seat primary CTA
- Read Structural Drift support CTA

The page does not use Codexstone/chamber background drift.

Payment remains separate future contract.

## EXPECTED OAR1

docs/oar/measures_registry/oar1_reseat_about_measures_registry_featured_structural_drift_v1.meta.md

## CLOSE

Content seated first.

Renderer consumes.

No chamber drift.

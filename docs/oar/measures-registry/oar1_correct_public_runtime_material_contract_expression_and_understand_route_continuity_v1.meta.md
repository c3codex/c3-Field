---
document_type: oar1
authority_level: closeout
document_scope: measures_registry_runtime_correction
title: Correct Public Runtime Material Contract Expression and Understand Route Continuity
status: completed
version: v1
operator: op044
system: measures_registry
source_oar2: oar2_correct_public_runtime_material_contract_expression_and_understand_route_continuity_v1
native_stack:
  codex: database
  field: schema
  measures: registry
  chazz: systems
validated_at: 2026-06-04
tags:
  - measures-registry
  - runtime-correction
  - material-contracts
  - understand-environment
  - launch-readiness
  - oar1
---

# OAR1 - Correct Public Runtime Material Contract Expression and Understand Route Continuity v1

## RESULT

Status:

    completed

Standing:

    public runtime route continuity corrected
    material/layout contract markers normalized across target public roots
    no DB mutation
    no deployment

This OAR1 closes the OAR2 correction for public runtime material contract expression and the `understand_environment` route.

## FILES CHANGED

Runtime resolver and shared frame:

    src/measures_registry/registered_runtime/MeasuresRegistryRuntimeRegistered.tsx

Public runtime roots:

    src/measures_registry/registered_runtime/renderers/RegisteredIntro.tsx
    src/measures_registry/registered_runtime/renderers/RegisteredPathChoice.tsx
    src/measures_registry/registered_runtime/renderers/RegisteredPassage.tsx
    src/measures_registry/registered_runtime/renderers/RegisteredPublicUnderstand.tsx
    src/measures_registry/registered_runtime/renderers/RegisteredCrystalChamber.tsx
    src/measures_registry/registered_runtime/renderers/RegisteredStructuralDrift.tsx
    src/measures_registry/PublicAssessmentSurface.tsx

Shared style contract:

    src/measures_registry/registered_runtime/styles/registry.materials.css

OAR closeout:

    docs/oar/measures-registry/oar1_correct_public_runtime_material_contract_expression_and_understand_route_continuity_v1.meta.md

## ROUTE CONTINUITY

Corrected alias:

    ?surface=understand_environment
    -> structure_passage

Implementation:

    SURFACE_QUERY_ALIASES.understand_environment = "structure_passage"

Standing:

    direct understand_environment query no longer resolves to the intro fallback
    public understand renderer remains data-public-path="understand_environment"
    continuation to crystal_chamber remains the existing runtime navigation path

Note:

    The existing history writer canonicalizes visible surfaces to their seated surface key.
    Therefore an aliased request may normalize to surface=structure_passage after runtime render.

## MATERIAL MARKERS

Markers added or normalized:

    landing_root:
      data-material-family="crystal"

    landing_path_choice:
      data-material-family="lapis"

    eval_passage:
      data-material-family defaults to "obsidian" unless registry styling contract overrides it

    structure_passage / understand_environment:
      data-material-family="crystal"

    crystal_chamber:
      data-material-family="crystal"

    measures_assessment:
      data-material-family defaults to "obsidian" unless registry styling contract overrides it

    obsidian_to_marble_passage_video:
      data-material-family="obsidian"

    marble_pathway_reveal:
      data-material-family="marble"

    structural_drift_dispatches / publication_dispatch:
      data-material-family="crystal"

Shared material expression:

    crystal material family style contract added to registry.materials.css
    obsidian, lapis, and marble material contracts preserved

## LAYOUT MARKERS

Markers added or normalized:

    landing_root:
      data-layout-contract="intro"

    landing_path_choice:
      data-layout-contract="transition_choice"

    eval_passage:
      data-layout-contract="passage"

    structure_passage / understand_environment:
      data-layout-contract="passage"

    crystal_chamber:
      data-layout-contract="sparse_chamber"

    measures_assessment:
      data-layout-contract="assessment"

    contact capture:
      data-layout-contract="contact_contract"

    submitted result gate:
      data-layout-contract="result_gate"

    obsidian_to_marble_passage_video:
      data-layout-contract="passage"

    marble_pathway_reveal:
      data-layout-contract="result_gate"

    structural_drift_dispatches / publication_dispatch:
      data-layout-contract="publication_encounter"

    footer:
      data-layout-contract="footer"

## RELEASE STANDING MARKERS

Release standing markers added where applicable:

    public
    public_contact_gated
    published
    held
    held_continuation
    missing_publication_state
    system_frame

These markers are inspectable runtime state only. They do not grant certification, conversion, DAO, permission, recognition, distribution, pricing, payment, or c3 Key standing.

## GLYPH FALLBACK

Dedicated material glyph roles remain unseated:

    obsidian_glyph
    crystal_glyph
    lapis_glyph
    marble_glyph

No glyph assets were created.

No media role names, bucket paths, "EMBLEM ONLY", or "GLYPH ONLY" labels were introduced.

Existing neutral registry mark and watermark behavior remains the only allowed fallback where already seated.

## PRESERVED SURFACES

Preserved:

    AI Operations Assessment title
    seven-question assessment flow
    obsidian assessment standing
    post-assessment contact/consent no-standing language
    Crystal Chamber Questions video hook
    Structural Drift cover hook inside Crystal Chamber
    Foundational Leadership CTA
    Assess CTA
    internal Lapis launch chamber public exclusion
    Marble held boundary

No scoring logic changed.

No contact capture order changed.

No SEO/social metadata changed.

No Structural Drift full publication redesign was performed.

## VALIDATION

Build command:

    npm.cmd run build:registry

Result:

    passed

Build output:

    vite build --mode registry --outDir dist-registry
    101 modules transformed
    built in 5.94s

Warnings:

    pre-existing large chunk warning remained

Environment check output included:

    VITE_SUPABASE_URL: present
    VITE_SUPABASE_ANON_KEY: present
    SUPABASE_URL: present
    SUPABASE_ANON_KEY: missing
    VITE_C3FIELD_R2_PUBLIC_BASE_URL: missing
    VITE_R2_PUBLIC_BASE_URL: missing

Local route server check:

    http://127.0.0.1:4189/?surface=understand_environment
    HTTP 200

Static source validation:

    route alias present
    target root data-public-path="understand_environment" preserved
    target root data-surface="structure_passage" preserved
    data-material-family markers present across changed target roots
    data-layout-contract markers present across changed target roots

Browser automation note:

    In-app Browser controls were not exposed in this tool context.
    Bundled Playwright could not launch because playwright-core was unavailable.
    Repo-local Playwright and Puppeteer dependencies were not present.

Therefore visual/DOM browser automation was not completed in this OAR1.
The route and marker correction was validated by source inspection, build pass, and local HTTP server availability.

## BOUNDARIES

No DB mutation.

No deployment.

No SEO/social metadata rewrite.

No new glyph/media assets.

No Marble visibility policy change.

No internal Lapis launch chamber exposure.

No pricing/payment/c3 Key/certification/conversion/DAO/permission/recognition/distribution standing.

## UNRESOLVED DEPENDENCIES

Still downstream:

    dedicated material glyph media roles
    launch-ready SEO/social metadata
    Structural Drift article-grade route and social preview
    full browser visual QA with available browser automation
    optional analytics/launch instrumentation OAR

## RECOMMENDED NEXT OAR

Recommended next OAR:

    Correct Measures Registry SEO and Structural Drift publication metadata for public launch readiness.

Secondary recommended OAR:

    Seat dedicated material glyph roles in measures_media_map and validate fallback removal.

## CLOSE

The public Understand route is now seated through the registered structure passage.

The major public runtime roots now expose inspectable material and layout contracts.

src continues to render seated runtime state.

Codex holds.
Field structures.
Measures registers.
Chazz routes.
Cody executed from OAR2 only.

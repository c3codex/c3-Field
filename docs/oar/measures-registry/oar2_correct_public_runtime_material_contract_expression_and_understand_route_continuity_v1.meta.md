---
document_type: oar2
authority_level: working
document_scope: measures_registry_runtime_correction
title: Correct Public Runtime Material Contract Expression and Understand Route Continuity
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
  - understand_environment
  - structure_passage
  - crystal_chamber
  - measures_assessment
  - structural_drift_publication
  - contact_result_gate
  - sitewide_frame
  - material_contract_expression
tags:
  - measures-registry
  - runtime-correction
  - material-contracts
  - chamber-style
  - glyphs
  - understand-environment
  - launch-readiness
  - oar2
source_alignment:
  - oar1_run_c3_map_runtime_audit_for_measures_registry_launch_readiness_v1
  - Measures Registry Operative Concordance Update
  - Chazz x Cody Development Role Contract
  - OAR Lifecycle — Execution and Handoff
---

# OAR2 — Correct Public Runtime Material Contract Expression and Understand Route Continuity v1

## OBSERVED

The c3 MAP runtime audit completed with no code mutation, DB mutation, or deployment.

Audit standing:

    launch_readiness: partial

The audit confirmed the assessment-first spine is visible and functional enough for controlled launch rehearsal, but not launch-grade public signal yet.

Primary audit defects:

1. `?surface=understand_environment` resolves to landing epigraph instead of the intended public Understand pathway.
2. SEO/social metadata is generic and not launch-ready.
3. Dedicated material glyph roles are missing.
4. Material contract expression is inconsistent because several runtime roots lack `data-material-family`.
5. Structural Drift publication route does not yet carry article-grade metadata or strong cover-led presentation.
6. Contact/result gate is functional but visually weaker than the assessment question state.
7. Marble held route remains publicly addressable.

This OAR2 addresses the first shared runtime/style seam:

    public route continuity
    + runtime material contract expression
    + reusable layout contract markers
    + material/glyph fallback discipline

This OAR2 does not address SEO metadata, social previews, Structural Drift route upgrade, launch analytics, or DB schema migration. Those remain downstream OARs.

## ALIGNED

The public runtime must render from seated contract state.

The site should not rely on one-off CSS patches to carry chamber identity.

Each public runtime surface should expose a consistent, inspectable contract channel:

    data-material-family
    data-layout-contract
    data-surface
    data-release-standing where applicable

Material identity must be readable before the visitor reads the copy.

Pass standard from audit:

    A page should communicate its material contract before the user reads the copy.

The right-path public term is:

    Understand the Environment

Therefore `?surface=understand_environment` must not fall back to the landing epigraph.

## ROUTED

## 1. Correct `understand_environment` route continuity

Correct:

    ?surface=understand_environment

Current audit result:

    fail — resolves to landing epigraph

Required behavior:

    ?surface=understand_environment
    -> route to the intended public Understand pathway

Acceptable routing options, in priority order:

1. Alias `understand_environment` to the seated right-path passage surface:

    structure_passage

2. Or resolve `understand_environment` to the seated right-path entry contract that then continues into:

    structure_passage -> crystal_chamber

Required:

- no landing epigraph fallback
- no deprecated Structure/Evaluate language
- no card-grid shell fallback
- no public runtime invention
- no Marble route
- no pricing/payment/c3 Key/certification/conversion language

Validation:

    https://www.measuresregistry.com/?surface=understand_environment

Expected:

- public right-path Understand experience renders
- About Measures Registry passage is reachable
- Crystal Chamber continuation remains functional

## 2. Seat consistent runtime material markers

Every major public surface root must expose a correct material marker where architecture permits.

Required marker:

    data-material-family="[material]"

Target public surfaces:

    landing / first encounter
    structure_passage
    crystal_chamber
    measures_assessment
    publication/structural_drift
    contact / result gate
    footer / sitewide frame where applicable

Expected material mapping:

    landing / first encounter = crystal or current seated intro material
    structure_passage = crystal or current seated passage material
    crystal_chamber = crystal
    measures_assessment = obsidian
    publication/structural_drift = crystal with obsidian accent, or current seated publication material
    contact/result gate = obsidian or current seated assessment-continuation material
    footer = inherit surface material or neutral registry frame

If a material is not seated for a surface, Cody must report it and avoid inventing authority.

## 3. Seat consistent runtime layout markers

Every major public surface root must expose a layout marker where architecture permits.

Required marker:

    data-layout-contract="[layout]"

Target layouts:

    intro
    passage
    sparse_chamber
    assessment
    publication_encounter
    contact_contract
    result_gate
    footer

Expected mapping:

    landing / first encounter = intro
    structure_passage = passage
    crystal_chamber = sparse_chamber
    measures_assessment = assessment
    publication/structural_drift = publication_encounter
    contact/result gate = contact_contract or result_gate
    footer = footer

Purpose:

    renderer and CSS compose from material + layout + surface
    instead of page-specific styling patches

## 4. Strengthen shared material contract expression

Cody must consolidate or reinforce shared public style behavior so material identity is consistent across runtime.

Required:

    obsidian:
    - dark threshold
    - operational
    - high contrast
    - controlled
    - minimal glow
    - clear controls

    crystal:
    - precise
    - luminous without excessive glow
    - ordered
    - sparse
    - high clarity

    lapis:
    - relational / transition support only where seated
    - not accidentally inherited by assessment or crystal

    marble:
    - held
    - not public released
    - no governance/commercial visual implication while held

Cody may use reusable CSS classes, data attributes, or existing style contract functions.

Cody may not hardcode truth that should come from registry/copy contracts.

## 5. Material glyph fallback discipline

The audit found dedicated material glyph roles are missing:

    obsidian_glyph
    crystal_glyph
    lapis_glyph
    marble_glyph

Cody must not invent glyph assets.

Required behavior:

    if dedicated material glyph is mapped:
      render subtle governed glyph treatment

    if missing:
      use approved neutral registry mark / watermark only where already seated
      do not display asset labels
      do not display "EMBLEM ONLY"
      do not display "GLYPH ONLY"
      do not expose media role names or bucket paths
      report missing role in OAR1

This OAR may define fallback behavior but must not create new media assets.

## 6. Prevent material bleed

Cody must specifically check and prevent:

    assessment inheriting lapis background
    crystal_chamber rendering as raw/dev shell
    publication encounter rendering as plain text block
    glyph labels rendering as watermark text
    footer overpowering or breaking material surface
    duplicate Measures Registry brand marks

## 7. Preserve current working public surfaces

Do not regress surfaces that passed or partially passed in the audit.

Preserve:

    AI Operations Assessment title
    seven-question assessment flow
    obsidian assessment material state
    post-assessment contact/consent no-standing language
    Crystal Chamber Questions video
    Structural Drift cover inside Crystal Chamber
    Foundational Leadership CTA
    Assess CTA
    internal Lapis launch chamber public exclusion
    Marble held boundary

## 8. Do not address downstream OAR items in this correction

Do not implement the following in this OAR:

    SEO metadata rewrite
    Open Graph / Twitter preview rewrite
    Structural Drift full publication route upgrade
    contact/result gate redesign beyond material/layout markers
    Marble visibility policy change
    internal initiative DB schema migration
    social campaign registry
    launch analytics

Those remain downstream.

## CODY ROLE

Cody may:

- correct `understand_environment` route resolution
- add or normalize `data-material-family`
- add or normalize `data-layout-contract`
- strengthen shared material/layout class application
- define missing glyph fallback behavior
- remove material bleed and duplicate visible brand artifacts if directly attached
- preserve current working assessment and Crystal behavior
- report missing registry/media dependencies

Cody may not:

- mutate DB
- deploy
- rewrite SEO/social metadata
- create new glyph assets
- hardcode unregistered media as authority
- open Marble
- expose internal Lapis launch chamber
- add pricing/payment/c3 Key/certification/conversion/DAO/permission/recognition/distribution standing
- change assessment scoring
- change contact capture order unless required to preserve existing contract

## EXPECTED TOUCHPOINTS

Likely touchpoints:

    src/measures_registry/registered_runtime/MeasuresRegistryRuntimeRegistered.tsx
    src/measures_registry/registered_runtime/renderers/RegisteredPublicUnderstand.tsx
    src/measures_registry/registered_runtime/renderers/RegisteredCrystalChamber.tsx
    src/measures_registry/registered_runtime/renderers/RegisteredAssessment.tsx
    src/measures_registry/registered_runtime/renderers/*
    src/measures_registry/registered_runtime/styles/*
    src/measures_registry/registered_runtime/styles/encounters/*
    src/measures_registry/registered_runtime/styles/materials/*
    route/surface resolver
    registered runtime allowlist
    material/layout helper functions if present

No DB mutation.

No deployment unless separately authorized.

## VALIDATION

### Route validation

URL:

    https://www.measuresregistry.com/?surface=understand_environment

Expected:

    does not render landing epigraph fallback
    renders intended Understand pathway or aliases to structure_passage
    continuation to crystal_chamber remains valid

### Material marker validation

Check public roots for:

    data-material-family
    data-layout-contract
    data-surface

Expected:

    structure_passage = passage material/layout
    crystal_chamber = crystal + sparse_chamber
    measures_assessment = obsidian + assessment
    publication/structural_drift = publication_encounter marker where applicable
    contact/result gate = contact/result marker where applicable

### Style validation

Expected:

    material identity visibly improved
    no lapis bleed into assessment
    no raw/dev shell chamber feel
    no glyph/media labels visible
    no duplicate brand mark created by this correction

### Boundary validation

Expected:

    internal Lapis launch chamber still not public
    Marble remains held
    no pricing/payment/c3 Key/certification/conversion/DAO/permission/recognition/distribution standing

### Build validation

Run:

    npm.cmd run build:registry

Expected:

    build passes
    only pre-existing warnings reported if any

## EXPECTED OAR1

After execution, Cody must write OAR1 beside this OAR2.

Expected path:

    docs/oar/measures-registry/oar1_correct_public_runtime_material_contract_expression_and_understand_route_continuity_v1.meta.md

OAR1 must report:

    files changed
    understand_environment route status
    material markers added/normalized
    layout markers added/normalized
    glyph fallback behavior
    surfaces validated
    build result
    unresolved registry/media/style dependencies
    no DB mutation
    no deployment unless separately authorized
    boundary validation
    recommended next OAR

## STANDING

This OAR2 corrects public runtime route continuity and material contract expression only.

This OAR2 does not authorize DB mutation.

This OAR2 does not authorize deployment.

This OAR2 does not create pricing, payment, c3 Key issuance, conversion, certification, DAO standing, permission, recognition, distribution, or Marble release.

## CLOSE

Route the public path.

Expose the material contract.

Let style render from structure.

Audit defects become bounded corrections.

Codex holds.
Field structures.
Measures registers.
Chazz routes.
Cody executes from OAR2 only.
src renders seated state only.

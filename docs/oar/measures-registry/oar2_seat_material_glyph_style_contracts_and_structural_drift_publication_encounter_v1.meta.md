---
document_type: oar2
authority_level: working
document_scope: measures_registry_runtime
title: Seat Material Glyph Style Contracts and Structural Drift Publication Encounter
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
  - material_style_contracts
  - chamber_layout_contracts
  - glyph_rendering_contracts
  - crystal_chamber
  - structural_drift_publication
tags:
  - measures-registry
  - material-style-contracts
  - glyphs
  - chamber-layout
  - structural-drift
  - publication-encounter
  - oar2
source_alignment:
  - Seed Concordance
  - The 21 of Coherence
  - Chazz x Cody Development Role Contract
  - OAR Lifecycle — Execution and Handoff
  - Measures Registry Operative Concordance Update
---

# OAR2 — Seat Material Glyph Style Contracts and Structural Drift Publication Encounter v1

## OBSERVED

Current Measures Registry styling is improving surface by surface, but the system still risks visual drift because chamber identity is not yet governed through a reusable material + layout + glyph contract.

Observed issues:

1. Crystal Chamber styling still lacks a rich, consistent chamber identity.
2. Obsidian, Crystal, Lapis, and Marble styling can drift or bleed into each other.
3. Seated glyph assets are not yet being used as governed visual assets within material contracts.
4. Styling corrections are being handled per-surface instead of through a shared contract layer.
5. Structural Drift currently renders like plain text instead of a professional publication encounter.
6. A Structural Drift cover photo exists in the Supabase bucket and should be used through registered media mapping, not hardcoded frontend fallback.

This OAR2 does not reopen routing.

This OAR2 seats a reusable visual contract layer and upgrades Structural Drift into a publication encounter.

## ALIGNED

Measures Registry should render chamber identity through composed contracts:

    material_style_contract
    + layout_contract
    + glyph_contract
    + surface_contract

The renderer should resolve:

    material
    layout
    glyph
    media
    copy
    CTA
    footer

from registered state wherever possible.

CSS should not act as a second authority.

Glyphs are governed visual assets, not decoration-only artifacts.

Structural Drift should render as a professional publication encounter using its seated Supabase cover photo.

## ROUTED

## 1. Seat reusable material style contracts

Create or refine shared material style contracts for:

    obsidian
    crystal
    lapis
    marble

Each material style contract must define:

    background treatment
    glyph treatment
    registry mark placement
    typography scale
    media frame treatment
    CTA treatment
    footer treatment
    spacing rhythm
    mobile behavior
    desktop fit behavior

Material identity must remain distinct.

### Obsidian

Use for assessment, threshold, reduction, operational evaluation, and passage surfaces.

Required qualities:

    dark
    threshold-like
    restrained
    high contrast
    operational
    minimal glow
    clear controls

### Crystal

Use for recognition, orientation, questions, clarity, and sparse chamber surfaces.

Required qualities:

    clean
    precise
    luminous but not over-glowing
    spacious
    ordered
    clear hierarchy

### Lapis

Use for relational positioning, transitional education, and orientation support where seated.

Required qualities:

    deep blue
    relational
    calm
    supportive
    not confused with assessment/obsidian

### Marble

Use for governance, inscription, continuation, and future implementation surfaces where seated.

Required qualities:

    formal
    stable
    structured
    inscription-like
    professional

## 2. Seat reusable layout contracts

Create or refine shared layout contracts for:

    passage
    sparse_chamber
    assessment
    contact_contract
    publication_encounter
    cta_panel
    footer

Renderer should compose material + layout rather than hardcoding page-specific visual behavior.

Example:

    structure_passage
    material: crystal or current seated passage material
    layout: passage
    glyph: resolved from material/media map

    measures_assessment
    material: obsidian
    layout: assessment
    glyph: obsidian / assessment glyph

    crystal_chamber
    material: crystal
    layout: sparse_chamber
    glyph: crystal glyph

    structural_drift_publication
    material: crystal with obsidian accent
    layout: publication_encounter
    media: structural_drift_cover_photo

## 3. Use seated glyphs as governed visual assets

Cody must inspect current glyph asset availability and media mappings.

Required:

    use seated material glyphs where registered
    do not invent glyphs
    do not hardcode unregistered glyph URLs
    do not render glyph asset labels
    do not expose media role names
    do not expose metadata

Glyph rendering should support:

    material watermark
    small chamber seal
    CTA accent
    publication encounter accent
    background texture support

Glyphs must remain subtle enough not to damage readability.

No visible text such as:

    EMBLEM ONLY
    GLYPH ONLY
    asset label
    media role
    bucket path
    debug label
    contract label

may appear in public UI.

## 4. Convert Structural Drift into a publication encounter

Structural Drift must no longer render as a plain text box.

It must render as a professional publication encounter/card.

Required surface role:

    publication_encounter

Required title:

    Structural Drift

Required subtitle/deck:

    AI instability is not only a model problem. It is often an environment problem.

Required abstract:

    Structural Drift names the conditions that allow AI-supported decisions, workflows, approvals, and outputs to become unstable across an organization. Measures Registry evaluates those conditions before optimization proceeds.

Required CTA:

    Read Structural Drift

Required media:

    Structural Drift cover photo from Supabase media map

The cover photo must resolve from registered media/Codex state.

Do not hardcode a Supabase URL unless Cody reports no mapped media exists and the missing dependency is seated or explicitly logged.

## 5. Structural Drift cover photo dependency

Cody must check whether a registered media mapping exists for the Structural Drift cover photo.

Expected media role candidates may include, but are not limited to:

    structural_drift_cover
    structural_drift_cover_photo
    structural_drift_publication_cover
    publication_structural_drift_cover

If mapped:

    use registered media URL

If not mapped:

    report missing media mapping
    do not invent frontend truth
    do not hardcode bucket path without seating dependency

If an existing Supabase media row is found but not bound to the encounter:

    bind it through the registered media/encounter map where current architecture permits

## 6. Apply publication encounter inside crystal_chamber

Within `crystal_chamber`, replace the current raw Structural Drift section with the publication encounter.

Crystal Chamber remains sparse:

    1. Questions Explainer video
    2. Structural Drift publication encounter
    3. Foundational Leadership CTA
    4. Assess the Environment CTA

Do not expand Crystal Chamber into a full resource hub.

Do not bury CTAs.

Do not let the publication card dominate the chamber more than the Questions Explainer video.

## 7. Preserve fit-to-page requirements

Desktop priority:

    Crystal Chamber should remain a coherent visible-frame composition on standard desktop viewport where possible.

Required:

    Questions video contained
    Structural Drift publication encounter compact and professional
    Foundational Leadership CTA visible or immediately reachable
    Assess the Environment CTA visible or immediately reachable
    footer does not force excessive scroll
    glyphs do not impair readability

Mobile may scroll, but content and controls must remain accessible.

## 8. Prevent future material bleed

Cody must reduce one-off styling that allows material identity bleed.

Required:

    obsidian assessment must not inherit lapis background
    crystal chamber must not render like raw dev shell
    publication encounter must not render as plain text block
    glyph labels must not render as watermark text
    footer must remain visually coherent across materials

If current architecture does not yet support full contract composition, Cody must implement the smallest bounded shared style layer possible and report remaining limitations in OAR1.

## CODY ROLE

Cody may:

- inspect existing glyph assets and media mappings
- define reusable material style classes/contracts
- define reusable layout classes/contracts
- wire registered glyph usage where seated
- upgrade Structural Drift into a publication encounter
- use the registered Supabase cover photo if mapped
- report missing media mapping if not mapped
- improve Crystal Chamber styling through shared contracts
- preserve current routing and CTAs
- preserve sparse chamber standing

Cody may not:

- invent glyphs
- expose bucket paths or internal media labels
- hardcode media as authority where registry mapping exists
- convert Structural Drift into a generic card detached from registered media/copy
- expand Crystal Chamber into a dense hub
- change assessment scoring
- add pricing
- imply payment, c3 Key, DAO, conversion, certification, recognition, permission, or distribution standing
- collapse material identities
- bypass registry-driven rendering

## EXPECTED TOUCHPOINTS

Likely touchpoints may include:

    src/measures_registry/registered_runtime/renderers/RegisteredCrystalChamber.tsx
    src/measures_registry/registered_runtime/renderers/RegisteredPublicUnderstand.tsx
    src/measures_registry/registered_runtime/renderers/RegisteredAssessment.tsx
    src/measures_registry/registered_runtime/styles/encounters/*
    src/measures_registry/registered_runtime/styles/materials/*
    src/measures_registry/registered_runtime/styles/chambers/*
    src/measures_registry/registered_runtime/MeasuresRegistryRuntimeRegistered.tsx
    registered media map
    registered glyph map
    registered encounter/copy contract definitions

Cody should keep correction bounded to shared visual contracts, glyph usage, and Structural Drift publication encounter.

## VALIDATION

### Material contract validation

Expected:

    obsidian, crystal, lapis, and marble have distinct reusable style contracts or bounded style classes
    glyph usage resolves by material where seated
    glyphs render visually but do not overpower copy
    no asset labels or metadata render publicly

### Crystal Chamber validation

URL:

    https://measuresregistry.com/?surface=crystal_chamber

Expected:

    Questions Explainer video remains at top
    Structural Drift renders as publication encounter, not text box
    Structural Drift cover photo appears if mapped
    CTA reads Read Structural Drift
    Foundational Leadership CTA remains
    Assess the Environment CTA remains
    page remains sparse and professional
    no internal/system labels visible
    layout remains coherent on desktop

### Structural Drift media validation

Expected:

    cover photo resolves from registered Supabase/media mapping
    no hardcoded bucket path visible
    no placeholder image unless media mapping is missing and OAR1 reports it

### No standing expansion

Expected:

    no pricing
    no payment
    no c3 Key issuance
    no DAO standing
    no conversion claim
    no certification claim
    no recognition claim
    no permission claim

## EXPECTED OAR1

After execution, Cody must write OAR1 beside this OAR2.

Expected path:

    docs/oar/measures-registry/oar1_seat_material_glyph_style_contracts_and_structural_drift_publication_encounter_v1.meta.md

OAR1 must report:

    files changed
    material contracts added/refined
    layout contracts added/refined
    glyph assets used or missing
    Structural Drift publication encounter status
    cover photo mapping status
    Crystal Chamber validation
    desktop fit validation
    local runtime validation
    deployed runtime validation, if deployment occurs
    unresolved dependencies

## STANDING

This OAR2 does not create a conversion route.

This OAR2 does not authorize pricing.

This OAR2 does not issue c3 Key standing.

This OAR2 does not create permission, payment, DAO, recognition, certification, or distribution standing.

This OAR2 seats reusable visual contracts and upgrades Structural Drift into a professional publication encounter.

## CLOSE

Material carries tone.

Glyph carries chamber identity.

Publication carries encounter.

Renderer composes what Measures registers.

Codex holds.
Field structures.
Measures registers.
Chazz routes.
Cody executes from OAR2 only.
src renders seated state only.

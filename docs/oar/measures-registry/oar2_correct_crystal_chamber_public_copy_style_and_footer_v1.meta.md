---
document_type: oar2
authority_level: working
document_scope: measures_registry_runtime
title: Correct Crystal Chamber Public Copy, Style Contract, and Footer
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
  - structure_passage
  - crystal_chamber
  - sitewide_footer
tags:
  - measures-registry
  - crystal-chamber
  - public-copy
  - style-contract
  - footer
  - fit-to-page
  - oar2
source_alignment:
  - Seed Concordance
  - The 21 of Coherence
  - Chazz x Cody Development Role Contract
  - OAR Lifecycle — Execution and Handoff
  - Measures Registry Operative Concordance Update
  - oar1_correct_crystal_chamber_passage_and_sparse_orientation_contract_v1
---

# OAR2 — Correct Crystal Chamber Public Copy, Style Contract, and Footer v1

## OBSERVED

The prior Crystal right-path routing correction aligned the functional split locally:

- `structure_passage` carries the talking-head passage.
- `crystal_chamber` carries the sparse orientation chamber.
- Questions Explainer video is placed on `crystal_chamber`.
- Local runtime passed.
- Deployed validation remained held pending deployment/source-bundle update.

A new live/style audit confirms remaining presentation issues:

1. Public-facing eyebrow copy is exposing internal system terminology.
2. `structure_passage` and `crystal_chamber` need refined public copy.
3. `crystal_chamber` title must be corrected.
4. Crystal Chamber style contract remains underdeveloped.
5. Primary page content must fit the visible page frame more coherently.
6. Sitewide footer copy must be added to applicable non-entry pages.

This OAR2 does not reopen routing.

This OAR2 corrects public copy, visual contract, fit-to-page layout, and footer standing.

## ALIGNED

The site must not expose internal/system implementation terminology to visitors.

Public copy must distinguish:

- Measures Registry position
- Understand the Environment orientation
- Questions Explainer content
- Structural Drift
- Foundational Leadership CTA
- Assess the Environment CTA

The Crystal Chamber should remain sparse, but it must feel intentionally designed rather than like a raw runtime shell.

The page composition should fit into the visible frame on standard desktop viewports where possible.

The footer must appear sitewide where appropriate and identify Measures Registry as a registered c3 Field system operated by c3 Community Partners DAO, LLC.

## ROUTED

## 1. Correct `structure_passage` public copy

`structure_passage` remains the talking-head passage page.

### Required eyebrow

OUR APPROACH

### Required title

About Measures Registry

### Required paragraph

Measures Registry differs from the dominant AI-market assumption.

Dominant assumption:

AI optimization is achieved primarily through more compute, better models, more agents, and more automation.

Measures Registry position:

AI optimization cannot be achieved through tools alone.

AI systems interact with workflows, roles, approvals, data, outputs, and decisions.

Without Governed System Integrity, those interactions can amplify instability across the systems they touch.

Governed System Integrity provides the necessary environment for Optimized AI Deployment.

### Required behavior preserved

- Talking-head passage video remains primary media.
- Auto-advance to `crystal_chamber` remains.
- Continue / Skip / Mute controls remain.
- No Questions Explainer video renders on `structure_passage`.

## 2. Correct `crystal_chamber` public copy

`crystal_chamber` remains the sparse orientation chamber.

### Required eyebrow

UNDERSTAND THE ENVIRONMENT

### Required title

Questions Ungoverned Systems Cannot Answer

### Required top media

Questions Explainer video

### Required sparse body

Render only the current sparse chamber elements:

1. Structural Drift
2. Foundational Leadership CTA
3. Assess the Environment CTA

Do not expand into a full resource hub.

Do not render internal labels such as:

- sparse orientation
- right-path passage
- chamber contract
- route contract
- runtime surface
- system key
- registry contract

## 3. Correct Crystal Chamber style contract

Apply or refine the Crystal Chamber style contract so the page reads as a sparse, intentional chamber.

### Required visual qualities

- clean
- precise
- sparse
- luminous without excessive glow
- chamber-like rather than dev-shell
- strong hierarchy
- readable copy
- contained video
- visible CTAs without excessive scroll where possible

### Required layout improvements

- improve spacing above and around the Questions Explainer video
- constrain video sizing so it does not dominate the whole page
- keep Structural Drift and CTA content visually connected to the video
- preserve sparse content density
- avoid crowded card-grid feel
- avoid raw metadata/runtime styling
- ensure mobile and desktop remain usable
- all primary page content must fit within the visible page frame on standard desktop viewport where possible
- video, title, body, CTAs, and footer must be balanced so the chamber does not require excessive scroll
- avoid layouts where the video pushes Structural Drift, Foundational Leadership, or Assess CTA out of practical reach
- use responsive sizing for media and copy blocks
- preserve readability without oversized spacing, oversized cards, or oversized video containers
- mobile may scroll where necessary, but desktop should prioritize a complete one-screen chamber composition

## 4. Remove system-language eyebrows

Replace current internal/system eyebrows.

Known bad examples:

- RIGHT-PATH PASSAGE
- SPARSE ORIENTATION

Required replacements:

- `structure_passage` eyebrow = OUR APPROACH
- `crystal_chamber` eyebrow = UNDERSTAND THE ENVIRONMENT

No implementation-language labels may be exposed.

## 5. Add sitewide footer copy

Add footer to applicable Measures Registry public pages, excluding only intentionally footerless entry surfaces if already governed by existing design contract.

### Required footer copy

© 2026 Measures Registry. All rights reserved.
Measures Registry is a registered c3 Field system.
Operated by c3 Community Partners DAO, LLC.

### Footer requirements

- footer must not overpower page content
- footer must align with current Measures Registry visual style
- footer must be readable on obsidian/crystal/lapis/marble surfaces
- footer should not appear on first two entry surfaces if those are still governed as no-header/no-footer surfaces
- footer must not force excessive scroll on desktop chamber pages

## CODY ROLE

Cody may:

- correct public-facing copy on `structure_passage`
- correct public-facing copy on `crystal_chamber`
- replace internal/system eyebrows
- refine Crystal Chamber styling
- constrain video sizing and spacing
- add fit-to-page layout corrections
- add sitewide footer copy to applicable pages
- preserve existing routing and auto-advance behavior
- preserve sparse Crystal Chamber content standing

Cody may not:

- reopen or alter right-path routing beyond copy/style needs
- invent new chamber content
- expose internal system terminology
- add pricing
- add payment standing
- imply c3 Key issuance
- imply DAO standing
- imply conversion, certification, recognition, permission, or distribution standing
- collapse `structure_passage` and `crystal_chamber`
- convert Crystal Chamber into a dense hub

## EXPECTED TOUCHPOINTS

Likely touchpoints may include:

- `src/measures_registry/registered_runtime/renderers/RegisteredPublicUnderstand.tsx`
- `src/measures_registry/registered_runtime/renderers/RegisteredCrystalChamber.tsx`
- `src/measures_registry/registered_runtime/styles/encounters/public_understand.css`
- `src/measures_registry/registered_runtime/styles/encounters/*`
- `src/measures_registry/registered_runtime/MeasuresRegistryRuntimeRegistered.tsx`
- registered encounter / copy contract definitions
- footer/shared layout component if present

Cody should keep the correction bounded to public copy, style contract, fit-to-page layout, and footer implementation.

## VALIDATION

### `structure_passage`

URL:

https://measuresregistry.com/?surface=structure_passage

Expected:

- eyebrow reads `OUR APPROACH`
- title reads `About Measures Registry`
- passage paragraph matches approved Measures Registry position copy
- talking-head video remains
- Continue / Skip / Mute remain
- video auto-advance target remains `crystal_chamber`
- no Questions Explainer video
- no internal/system labels

### `crystal_chamber`

URL:

https://measuresregistry.com/?surface=crystal_chamber

Expected:

- eyebrow reads `UNDERSTAND THE ENVIRONMENT`
- title reads `Questions Ungoverned Systems Cannot Answer`
- Questions Explainer video appears at top
- Structural Drift section appears
- Foundational Leadership CTA appears
- Assess the Environment CTA appears
- page feels sparse and intentional
- no internal/system labels

### Fit-to-page validation

`structure_passage`:

- title, video, approved passage paragraph, controls, and footer should fit coherently within the page frame on standard desktop viewport
- no oversized vertical spacing
- no buried controls

`crystal_chamber`:

- eyebrow, title, Questions Explainer video, Structural Drift, Foundational Leadership CTA, Assess the Environment CTA, and footer should fit as a coherent page composition on standard desktop viewport
- no excessive scroll on desktop
- CTAs remain visible or immediately reachable
- video does not dominate the chamber

### Footer

Expected footer copy:

© 2026 Measures Registry. All rights reserved.
Measures Registry is a registered c3 Field system.
Operated by c3 Community Partners DAO, LLC.

Footer must appear on applicable public pages and remain visually coherent.

## EXPECTED OAR1

After execution, Cody must write OAR1 beside this OAR2.

Expected path:

docs/oar/measures-registry/oar1_correct_crystal_chamber_public_copy_style_and_footer_v1.meta.md

OAR1 must report:

- files changed
- public copy corrected
- eyebrows corrected
- Crystal Chamber title corrected
- Crystal style contract changes
- fit-to-page layout validation
- footer implementation
- local runtime validation
- deployed runtime validation, if deployment occurs
- unresolved dependency, if deployment is still held

## STANDING

This OAR2 does not create a conversion route.

This OAR2 does not authorize pricing.

This OAR2 does not issue c3 Key standing.

This OAR2 does not create permission, payment, DAO, recognition, certification, or distribution standing.

This OAR2 corrects public-facing copy, style, fit-to-page layout, and footer only.

## CLOSE

The passage states the approach.

The chamber asks the question.

The page fits the frame.

The footer seats the public standing.

Codex holds.
Field structures.
Measures registers.
Chazz routes.
Cody executes from OAR2 only.
src renders seated state only.

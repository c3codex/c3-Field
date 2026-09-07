---
document_type: oar2
authority_level: working
document_scope: measures_registry_publication_surface_deprecation
title: OAR2 — Deprecate Stale Publication Dispatch Surface
status: proposed
version: v1
operator: op044
system: measures_registry
native_stack:
  codex: database
  field: schema
  measures: registry
  oar2: observed_aligned_routed
  chazz: systems
  cody: executor
  src: encounter_renderer
tags:
  - oar2
  - measures-registry
  - publication-dispatch
  - deprecated-surface
  - undrifted
  - route-cleanup
  - registry-driven-rendering
---

# OAR2 — Deprecate Stale Publication Dispatch Surface

## OBSERVED

`publication_dispatch` remains unprofiled and ungoverned.

Current distinction:

- `/undrifted` is the active governed unDrifted publication index / landing surface
- `/about` is governed by `crystal_seat_encounter`
- `publication_dispatch` appears tied to `/publication/structural_drift`
- `publication_dispatch` has no `metadata.style_profile`
- `publication_dispatch` has remained excluded from style, layout, composition, and render authority seating

The operator has identified `publication_dispatch` as likely stale.

The About page does not require `publication_dispatch`.

If Structural Drift or unDrifted content appears on About, it should exist as a section or link inside `crystal_seat_encounter`, not as a separate publication dispatch surface.

## ALIGNED

## SEATED PRINCIPLE

What is not registered cannot be governed.

Unregistered state becomes interpretation.
Interpretation becomes inconsistency.
Inconsistency becomes drift.

Registration does not guarantee coherence, but coherence cannot be governed without registration.

A governed system names its authorities, seats them explicitly, and holds what is unknown until it can be verified.

## ALIGNMENT RULE

Stale surfaces must not remain in active validation sets.

A surface that has no active content model, no style profile, and no current public purpose should be deprecated or held rather than patched.

Do not invent a profile for a stale surface.

Do not keep routing ambiguity between:

- `/about`
- `/undrifted`
- `/publication/structural_drift`

Active standing:

- `/about` = institutional explanation / governed by `crystal_seat_encounter`
- `/undrifted` = publication index / governed by `lapis_chamber_encounter`
- `publication_dispatch` = stale unless verified as needed for individual article pages

Authority order remains:

Codex -> Field -> Measures -> OAR2 -> Chazz -> Cody -> src

## ROUTED

Deprecate or hold the stale `publication_dispatch` surface without deleting historical trace.

### 1. Verify current route and reference standing

Inspect current code and DB for:

- `publication_dispatch`
- `/publication/structural_drift`
- `/undrifted`
- `/about`
- `structural_drift`
- any nav/link references pointing to `/publication/structural_drift`

Report whether `/publication/structural_drift` is actively linked from public navigation, homepage, about page, unDrifted page, footer, sitemap, llms.txt, JSON-LD generation, or route map.

### 2. Preserve active surfaces

Do not alter active governed surfaces:

- `crystal_seat_encounter`
- `lapis_chamber_encounter`

Do not move About content into publication dispatch.

Do not move unDrifted index content into publication dispatch.

### 3. Mark publication_dispatch as deprecated or held

Preferred state:

- mark `publication_dispatch` as deprecated/stale in DB metadata or release state
- remove it from active style/layout/composition/render validation lists
- keep historical row trace intact

Suggested metadata keys if metadata is the current authority surface:

- deprecated_surface: true
- deprecated_reason: stale individual publication dispatch route; /undrifted is active publication index and /about is governed separately
- deprecated_by_oar: oar2_deprecate_stale_publication_dispatch_surface_v1
- replacement_surface: lapis_chamber_encounter
- replacement_route: /undrifted

If a release/access state table governs active standing, use the existing release-state mechanism rather than inventing a new one.

Do not hard-delete unless existing migration policy clearly requires deletion and the operator confirms deletion.

### 4. Route behavior

If `/publication/structural_drift` currently resolves to `publication_dispatch`, choose the least-drifting safe behavior:

Preferred:

- route `/publication/structural_drift` to `/undrifted`

Allowed alternative:

- render a governed unavailable/held state that links back to `/undrifted`

Do not create a new article page.

Do not create a new style profile for `publication_dispatch`.

### 5. Cleanup validation scope

Update any validation list, QA inventory, or active-surface query used by style/layout/render OARs so `publication_dispatch` is no longer treated as an active surface unless specifically auditing deprecated routes.

This must not remove historical trace from OAR1 records.

### 6. No visual redesign

This OAR is deprecation / route-standing cleanup only.

Do not:

- rewrite CSS
- wire new renderer style attributes
- create an article renderer
- change `/undrifted` layout
- change `/about` layout
- change MAP, payment, assessment, release, or public claims

## CODY ROLE

Cody may:

- inspect DB/code route references
- update DB metadata or release state to mark `publication_dispatch` deprecated/held
- adjust route handling so `/publication/structural_drift` safely resolves to `/undrifted` or a governed unavailable state
- update active validation queries/lists to exclude the stale surface
- write OAR1 with evidence and validation output

Cody may not:

- invent a style profile for `publication_dispatch`
- create a new article page
- delete historical DB rows without operator confirmation
- alter active `/about` or `/undrifted` content except for safe route behavior if required
- rewrite CSS
- wire renderer visual behavior
- change flow, MAP, payment, assessment, certification, DAO, or public claims

## VALIDATION

This OAR resolves when:

- current references to `publication_dispatch` and `/publication/structural_drift` are inventoried
- active `/about` and `/undrifted` surfaces are confirmed distinct
- `publication_dispatch` is marked deprecated/held without hard deletion
- `/publication/structural_drift` no longer creates active ambiguity
- active style/layout/render validation lists exclude `publication_dispatch`
- no CSS or visual redesign occurs
- no active public claim changes are introduced
- OAR1 is written beside this OAR2

## EXPECTED OAR1

docs/oar/measures_registry/oar1_deprecate_stale_publication_dispatch_surface_v1.meta.md

## CLOSE

Stale surfaces must not be profiled into authority.

If the surface is no longer needed, governance means deprecating it cleanly.

What is not registered cannot be governed.
What is stale must not remain active by accident.

Codex holds.
Field structures.
Measures registers.
Chazz validates.
Cody executes.
src renders only seated standing.

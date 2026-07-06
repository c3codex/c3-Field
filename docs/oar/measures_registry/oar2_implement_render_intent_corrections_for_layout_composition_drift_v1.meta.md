---
document_type: oar2
authority_level: working
document_scope: measures_registry_render_intent_implementation
title: OAR2 — Implement Render Intent Corrections for Layout Composition Drift
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
  cody: browser_visible_executor
  src: encounter_renderer
tags:
  - oar2
  - measures-registry
  - render-intent
  - css-correction
  - layout-composition
  - browser-qa
---

# OAR2 — Implement Render Intent Corrections for Layout Composition Drift

## OBSERVED

Style, layout, composition, and render intent authority are seated.

Four active drift points remain:

1. `crystal_seat_threshold`
   - render_status: drift_detected
   - render_intent: transform
   - target: mobile_layout_profile = stacked_layout
   - current: mobile preserves compressed split columns

2. `marble_chamber_results`
   - render_status: drift_detected
   - render_intent: resolve
   - target: document_composition
   - current: desktop report card too narrow for document gravity

3. `marble_chamber_C2_compact`
   - render_status: drift_detected
   - render_intent: resolve
   - target: exchange_composition
   - current: exchange competes with chamber/hero composition; mobile mechanically stacks desktop panels

4. `marble_chamber_C2_agreement`
   - render_status: drift_detected
   - render_intent: resolve
   - target: exchange_composition
   - current: payment agreement surface is visually under-anchored and content-thin

## ALIGNED

What is not registered cannot be governed.

Target authority is registered.

Render intent is registered.

This OAR may now implement only the seated corrections.

Renderer and CSS must consume registered authority rather than invent new visual behavior.

No new style, layout, composition, or render terms may be created.

Authority order remains:

Codex -> Field -> Measures -> OAR2 -> Chazz -> Cody -> src

Implementation order:

read seated metadata
-> expose renderer attributes
-> implement targeted CSS corrections
-> browser QA
-> report matched / remaining drift

## ROUTED

### 1. Extend resolver consumption

Update `resolveEncounterStyleProfile()` so it reads seated DB metadata fields beyond `profile_key`, including at minimum:

- layout_profile
- mobile_layout_profile
- composition_profile
- mobile_composition_profile
- render_status
- render_intent
- render_drift_note

Do not invent fallbacks.

Unset values must remain `null`.

### 2. Expose renderer attributes

Expose registered values as data attributes on rendered encounter roots where available.

Minimum attributes:

- data-layout-profile
- data-mobile-layout-profile
- data-composition-profile
- data-mobile-composition-profile
- data-render-status
- data-render-intent

Do not expose private notes publicly unless needed for debugging; `render_drift_note` may remain internal.

### 3. Implement only the four registered corrections

#### crystal_seat_threshold

Implement mobile correction:

- when mobile viewport is active and `data-mobile-layout-profile="stacked_layout"`
- stack Assess and Understand vertically
- preserve desktop split behavior
- preserve threshold composition
- no flow change

#### marble_chamber_results

Implement document gravity correction:

- widen report card on desktop according to `document_composition` / `report_layout`
- preserve readable measure
- do not make it full-bleed
- preserve mobile stacking
- no result logic change

#### marble_chamber_C2_compact

Implement exchange composition correction:

- reduce chamber/hero competition
- make three-panel exchange authority visually primary on desktop
- make mobile sequence feel intentionally composed, not mechanically stacked
- preserve CAR acknowledgment logic
- preserve payment continuation logic

#### marble_chamber_C2_agreement

Implement exchange anchor correction:

- strengthen payment agreement visual/content anchor
- keep single-card layout
- do not invent payment terms
- may use already-seated copy/summary if available
- if content is insufficient, improve spacing/composition only and report content gap

### 4. Do not touch matched surfaces

Surfaces with:

- render_status: matched
- render_intent: preserve

must not receive visual changes except unavoidable shared token execution, and any such impact must be reported.

### 5. Browser QA required

Run browser QA after implementation.

Minimum viewports:

- desktop/laptop
- mobile portrait

Validate:

- the four drift surfaces
- at least one preserved surface from each material family

Required evidence:

- screenshots
- viewport
- surface_key
- before/after summary if available
- whether target authority now matches rendering
- remaining drift, if any

### 6. DB / OAR1 closeout

Do not mark DB render_status as `matched` inside this OAR unless browser QA confirms the correction.

If matched, Cody may update:

- render_status: matched
- render_intent: preserve
- render_drift_note: null

Only for the corrected surfaces that pass QA.

If a surface remains unresolved, keep or update drift note honestly.

## CODY ROLE

Cody may:

- update resolver to consume seated style/layout/composition/render metadata
- expose data attributes
- make targeted CSS changes for the four registered drift points
- run browser QA
- update render_status only after evidence confirms match
- write OAR1 with evidence

Cody may not:

- create new authority vocabulary
- invent unregistered style/layout/composition values
- alter active matched surfaces intentionally
- change MAP logic
- change payment logic
- change assessment logic
- change routing
- change public claims
- resurrect `publication_dispatch`
- hard-delete historical records

## VALIDATION

This OAR resolves when:

- renderer consumes seated metadata
- registered data attributes are present
- four drift corrections are implemented or held with evidence
- browser QA confirms outcome
- matched surfaces are not unintentionally altered
- DB render_status is updated only where verified
- OAR1 is written beside this OAR2

## EXPECTED OAR1

docs/oar/measures_registry/oar1_implement_render_intent_corrections_for_layout_composition_drift_v1.meta.md

## CLOSE

The system has named the drift.

Now implementation must obey the registered correction.

Codex holds.
Field structures.
Measures registers.
Chazz validates.
Cody implements.
src renders.
CSS executes.

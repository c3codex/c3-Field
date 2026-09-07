---
document_type: oar2
authority_level: working
document_scope: measures_registry_render_intent_authority
title: OAR2 — Seat Render Intent Authority for Layout Composition Drift
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
  - layout-authority
  - composition-authority
  - drift-resolution
  - visual-governance
---

# OAR2 — Seat Render Intent Authority for Layout Composition Drift

## OBSERVED

Style, layout, and composition authority are now seated for active Measures Registry encounter surfaces.

The prior OAR seated target layout and composition authority without changing renderer or CSS behavior.

It also identified four drift points where current rendering does not yet match seated target authority:

1. `crystal_seat_threshold`
   - target mobile_layout_profile: `stacked_layout`
   - current mobile rendering: compressed two-column split

2. `marble_chamber_results`
   - target composition_profile: `document_composition`
   - current desktop rendering: report card too narrow for document gravity

3. `marble_chamber_C2_compact`
   - target composition_profile: `exchange_composition`
   - current rendering: exchange layout competes with hero/chamber composition

4. `marble_chamber_C2_agreement`
   - target composition_profile: `exchange_composition`
   - current rendering: payment action appears visually under-anchored in large ceremonial frame

The system now distinguishes:

- target authority
- current rendering
- observed drift

But it does not yet have a registered render intent field that says what should happen next.

## ALIGNED

## SEATED PRINCIPLE

What is not registered cannot be governed.

Unregistered state becomes interpretation.
Interpretation becomes inconsistency.
Inconsistency becomes drift.

Registration does not guarantee coherence, but coherence cannot be governed without registration.

A governed system names its authorities, seats them explicitly, and holds what is unknown until it can be verified.

## ALIGNMENT RULE

Target authority is not the same as current rendering.

Current rendering may:

- match target
- drift from target
- be held for lack of visible DOM
- require transformation
- require preservation

Renderer and CSS work must not proceed until the required render intent is registered.

This OAR seats render intent authority so future implementation can resolve drift deterministically.

Authority order remains:

Codex -> Field -> Measures -> OAR2 -> Chazz -> Cody -> src

Rendering correction order becomes:

observed rendering
-> seated target authority
-> registered render status
-> registered render intent
-> renderer exposure
-> CSS execution
-> browser QA verification

## ROUTED

Seat render status and render intent language, then register intent for the four known layout/composition drift points.

### 1. Define render_status vocabulary

Allowed values:

- matched
  - current rendering is aligned with seated target authority

- target_registered
  - target authority is seated, but renderer/CSS has not yet implemented it

- drift_detected
  - browser evidence shows current rendering conflicts with seated target authority

- held
  - no action may proceed because evidence or authority is incomplete

- unavailable
  - no visible render surface exists to evaluate

### 2. Define render_intent vocabulary

Allowed values:

- preserve
  - current rendering should remain unchanged because it already matches target authority

- transform
  - rendering should change to match seated target authority

- suppress
  - current visible behavior should be removed or reduced because it conflicts with authority

- resolve
  - rendering requires targeted correction, usually through layout/content adjustment, not broad redesign

- hold
  - no render implementation should occur yet

### 3. Add fields to encounter rendering profile

Add these fields to the profile contract or related render-authority contract:

- render_status
- render_intent
- render_drift_note

Do not collapse these into style, layout, or composition profile fields.

### 4. Seat default render status where appropriate

For active real surfaces without identified drift, seat:

- render_status: matched
- render_intent: preserve

Only do this where browser QA already supports current rendering alignment.

For gap/alias surfaces:

- marble_chamber_encounter:
  - render_status: unavailable
  - render_intent: hold
  - render_drift_note: legacy alias forwards to marble_chamber_results and renders no visible DOM

For publication_dispatch:

- leave unseated unless a valid style_profile binding exists.

### 5. Seat four known drift points

Use prior browser evidence and OAR1 drift registration.

#### crystal_seat_threshold

- render_status: drift_detected
- render_intent: transform
- render_drift_note: mobile target is stacked_layout but current mobile rendering preserves compressed split_layout columns

#### marble_chamber_results

- render_status: drift_detected
- render_intent: resolve
- render_drift_note: target document_composition is seated but desktop report card is too narrow for document gravity

#### marble_chamber_C2_compact

- render_status: drift_detected
- render_intent: resolve
- render_drift_note: target exchange_composition is seated but current desktop/mobile rendering still competes with chamber/hero composition

#### marble_chamber_C2_agreement

- render_status: drift_detected
- render_intent: resolve
- render_drift_note: target exchange_composition is seated but current payment agreement surface is visually under-anchored and content-thin

### 6. DB seating

Seat values as sibling metadata keys on the existing `measures_encounter_surface_assignment.metadata` object.

Do not create duplicate render authority.

Do not rewrite existing style/layout/composition authority fields.

### 7. Validation query required

Return validation query output showing:

- surface_key
- style_profile
- layout_profile
- mobile_layout_profile
- composition_profile
- mobile_composition_profile
- render_status
- render_intent
- render_drift_note

Report null, held, or unavailable values with reasons.

### 8. Boundary

This OAR seats render intent authority only.

Do not:

- rewrite CSS
- wire renderer attributes
- change layout behavior
- change mobile behavior
- change MAP flow
- change payment logic
- change assessment logic
- change release/routing logic
- change public claims

The next OAR may implement renderer exposure and CSS correction for surfaces where `render_intent` is `transform` or `resolve`.

## CODY ROLE

Cody may:

- add bounded TypeScript union types for render_status and render_intent
- extend EncounterStyleProfile or a related render-authority contract
- seat metadata values for render_status, render_intent, and render_drift_note
- use prior browser QA and OAR1 evidence
- produce validation query output
- write OAR1 with evidence and held reasons

Cody may not:

- guess render intent without evidence
- create duplicate authority surfaces
- rewrite CSS
- wire renderer behavior
- alter live visual behavior in this OAR
- change unrelated DB state
- alter flow, assessment, MAP, payment, release, routing, or public claims
- seat publication_dispatch without a style_profile binding

## VALIDATION

This OAR resolves when:

- render_status vocabulary is bounded
- render_intent vocabulary is bounded
- render authority fields are added to the profile contract
- matched surfaces are marked preserve where supported
- known drift surfaces are marked transform or resolve
- alias/gap surfaces remain held or unavailable with reason
- validation query confirms final DB standing
- no CSS or renderer behavior is changed
- OAR1 is written beside this OAR2

## EXPECTED OAR1

docs/oar/measures_registry/oar1_seat_render_intent_authority_for_layout_composition_drift_v1.meta.md

## CLOSE

Target authority is now registered.

Render intent must be registered before correction.

What is not registered cannot be governed.

Codex holds.
Field structures.
Measures registers.
Chazz validates.
Cody seats intent from evidence.
src renders.
CSS executes.

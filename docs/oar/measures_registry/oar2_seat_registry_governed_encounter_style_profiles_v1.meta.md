---
document_type: oar2
authority_level: working
document_scope: measures_registry_frontend_style_authority
title: OAR2 — Seat Registry-Governed Encounter Style Profiles
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
  cody: frontend_executor
  src: encounter_renderer
tags:
  - oar2
  - measures-registry
  - styling
  - design-system
  - encounter-profiles
  - css-normalization
  - registry-driven-rendering
  - no-hardcoding
---

# OAR2 — Seat Registry-Governed Encounter Style Profiles

## OBSERVED

Measures Registry styling remains unresolved after repeated CSS corrections.

Current failure pattern:

- visual treatment is inconsistent across encounters
- layout seams remain between surfaces
- typography, spacing, media ratio, buttons, overlays, and controls are not governed from one authority
- CSS appears to contain competing surface-level rules
- components may be carrying visual authority directly
- fixes are being applied surface-by-surface instead of through a seated profile system
- media and content frames do not consistently resolve as one encounter body

This is not a taste issue.

This is style authority drift.

## ALIGNED

Frontend does not author truth.

The renderer may not invent visual behavior, layout authority, or surface-specific exceptions.

Visual style must resolve from seated encounter state.

Authority order remains:

Codex -> Field -> Measures -> OAR2 -> Chazz -> Cody -> src

Style must follow the same rule:

Codex holds style records.
Field structures style relation.
Measures registers encounter profile application.
Chazz validates the contract.
Cody implements only from OAR2.
src renders seated style state.

CSS is execution only.

CSS may not act as authority.

## ROUTED

Cody shall perform one bounded style-authority normalization pass.

### 1. Inventory active style authority

Audit current frontend styling surfaces:

- global CSS
- chamber CSS
- encounter CSS
- component-level classes
- inline styles
- media frame rules
- button and CTA rules
- audio/media control rules
- responsive rules

Return a brief inventory of where visual authority currently lives.

### 2. Identify drift

Flag rules that:

- duplicate the same layout concern
- conflict across encounters
- hardcode chamber-specific behavior
- override media ratio inconsistently
- define typography outside a shared scale
- apply one-off spacing patches
- hide controls unintentionally
- create surface-specific exceptions

No deletion before inventory.

### 3. Define canonical encounter style profile shape

Create or align a style profile contract with these fields:

- profile_key
- material_family
- encounter_type
- surface_role
- frame_mode
- media_ratio
- media_fit
- content_position
- content_width
- typography_scale
- heading_treatment
- body_treatment
- button_position
- button_treatment
- overlay_treatment
- watermark_treatment
- audio_control_treatment
- mobile_behavior
- release_state_behavior

The profile may be represented as registry config, DB-backed rows, or a typed frontend contract only if DB seating is not yet available.

If DB seating is not available, Cody must mark the frontend contract as temporary and non-authoritative.

### 4. Apply one profile per encounter

Each rendered encounter must resolve to one style profile.

No component may decide its own visual language outside the resolved profile.

Allowed pattern:

encounter -> profile_key -> style tokens -> renderer classes

Disallowed pattern:

encounter -> component-specific CSS invention

### 5. Normalize CSS into token execution

CSS should become the execution layer for seated profile tokens.

Reduce CSS toward:

- layout primitives
- material tokens
- typography tokens
- media frame tokens
- button tokens
- overlay tokens
- responsive tokens

Do not keep duplicate chamber-specific rules where shared profile tokens can govern.

### 6. Preserve visual requirements

The following requirements must remain intact:

- one-frame encounter feel
- 9:16 crystal/media compatibility where required
- consistent typography scale
- consistent content sizing
- small right-side or profile-defined CTAs where seated
- visible media controls when audio/video is present
- no SaaS block styling
- no public-facing chamber terminology unless already seated for that public surface
- no hardcoded gate-specific renderer logic

### 7. Validate surfaces

Validate at minimum:

- landing / threshold surface
- Assess the Environment path
- Understand the Environment path
- Obsidian assessment sequence
- Crystal education sequence
- Marble continuation / MAP surface where available
- mobile viewport
- laptop viewport

Validation must report:

- profile_key applied
- material_family applied
- media_ratio behavior
- typography behavior
- CTA position
- audio/media control visibility
- remaining seams

## CODY ROLE

Cody may:

- inventory CSS and component style authority
- consolidate duplicated CSS
- create typed style profile contracts
- wire renderer classes from resolved profile state
- mark temporary frontend contracts clearly when DB seating is not available
- preserve missing-state honesty
- report unresolved DB/profile gaps

Cody may not:

- invent encounter meaning
- hardcode chamber-specific one-offs
- create fallback truth
- treat CSS as authority
- bypass registry-driven rendering
- remove media controls
- expose private chamber language publicly unless seated
- change flow, release state, payment, MAP, or assessment logic

## VALIDATION

This OAR2 resolves successfully when:

- style authority is inventoried
- conflicting CSS authority is identified
- a canonical encounter style profile shape exists
- each active encounter resolves to one profile
- renderer applies style through profile tokens
- CSS is reduced toward execution only
- visual seams are reduced without new hardcoded exceptions
- validation confirms profile behavior across required surfaces

## EXPECTED OAR1

docs/oar/measures_registry/oar1_seat_registry_governed_encounter_style_profiles_v1.meta.md

## CLOSE

Visual style is not decoration.

It is encounter governance.

Codex holds.
Field structures.
Measures registers.
Chazz validates.
Cody implements.
src renders.
CSS executes.

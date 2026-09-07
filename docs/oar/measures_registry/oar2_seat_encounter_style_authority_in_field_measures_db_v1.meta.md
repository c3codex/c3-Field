---
document_type: oar2
authority_level: working
document_scope: measures_registry_style_authority_db_seating
title: OAR2 — Seat Encounter Style Authority in Field Measures DB
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
  - encounter-style
  - db-seating
  - field-measures
  - registry-driven-style
  - visual-governance
---

# OAR2 — Seat Encounter Style Authority in Field Measures DB

## OBSERVED

The encounter style language layer is complete in the type system.

Every canonical EncounterStyleProfile field now has bounded vocabulary.

However, only `profile_key` is currently seated as resolvable style authority.

All other style authority fields remain unresolved DB gaps:

- material_family
- frame_profile
- space_profile
- content_anchor
- typography_profile
- motion_profile
- surface_density
- visual_tension
- media_ratio
- content_width
- button_position
- overlay_treatment
- watermark_treatment
- audio_control_treatment
- mobile_behavior
- release_state_behavior

This confirms the repeated system lesson:

What is not registered cannot be governed.

Until these fields are seated in Field/Measures, renderer and CSS cannot govern visual style honestly.

## ALIGNED

Visual governance must be database-seated before renderer behavior or CSS normalization proceeds.

Frontend may not invent unregistered visual authority.

CSS may not compensate for missing registry state.

Authority order remains:

Codex -> Field -> Measures -> OAR2 -> Chazz -> Cody -> src

Style authority order:

Codex holds seated style state.
Field structures style fields and relation.
Measures registers profile application per encounter surface.
Chazz validates.
Cody implements.
src renders.
CSS executes.

## ROUTED

Seat EncounterStyleProfile authority in Field/Measures DB.

### 1. Identify current style profile source

Inspect current seated profile source on encounter surfaces.

Expected current source:

- `measures_encounter_surface_assignment.metadata.style_profile`

Do not assume table shape.

Read actual current schema and existing rows first.

### 2. Decide seating method

Use the least-drifting valid method:

Preferred:

- seat the 16 non-profile style authority fields as explicit metadata keys on the same surface assignment record where `style_profile` already lives

Allowed alternative:

- create a normalized style profile table only if current schema shows metadata seating is structurally wrong or insufficient

Do not create duplicate authority.

One active style authority surface only.

### 3. Seat profile values per canonical surface

For each active Measures Registry encounter surface, seat:

- material_family
- frame_profile
- space_profile
- content_anchor
- typography_profile
- motion_profile
- surface_density
- visual_tension
- media_ratio
- content_width
- button_position
- overlay_treatment
- watermark_treatment
- audio_control_treatment
- mobile_behavior
- release_state_behavior

Use existing `profile_key` / `style_profile` values as the binding key.

### 4. Start from approved material defaults where appropriate

Use the seated style concordance material defaults as baseline only where they are valid:

Crystal baseline:

- material_family: crystal
- frame_profile: cinematic_frame
- space_profile: ceremonial_space
- content_anchor: anchor_center
- typography_profile: signal_type
- motion_profile: breathing_motion
- surface_density: minimal_density
- visual_tension: calm_tension

Obsidian baseline:

- material_family: obsidian
- frame_profile: threshold_frame
- space_profile: immersive_space
- content_anchor: anchor_right
- typography_profile: institutional_type
- motion_profile: passage_motion
- surface_density: operational_density
- visual_tension: diagnostic_tension

Marble baseline:

- material_family: marble
- frame_profile: document_frame
- space_profile: institutional_space
- content_anchor: anchor_left
- typography_profile: editorial_type
- motion_profile: still_motion
- surface_density: narrative_density
- visual_tension: ceremonial_tension

Lapis baseline:

- material_family: lapis
- frame_profile: split_frame
- space_profile: intimate_space
- content_anchor: anchor_floating
- typography_profile: whisper_type
- motion_profile: ritual_motion
- surface_density: narrative_density
- visual_tension: transformative_tension

### 5. Do not invent unresolved values silently

The following fields require explicit per-surface judgment:

- media_ratio
- content_width
- button_position
- overlay_treatment
- watermark_treatment
- audio_control_treatment
- mobile_behavior
- release_state_behavior

If a value cannot be determined from seated intent, mark it as held or leave it unset with explicit validation output.

Do not guess.

### 6. Migration requirements

Create a migration that is:

- idempotent
- reversible where practical
- limited to Measures Registry encounter style authority
- scoped to existing active surface assignments
- free of frontend hardcoding
- free of public claim changes
- free of flow, MAP, payment, assessment, release, or routing changes

### 7. Validation query required

Return query output showing each active surface and its resolved style authority fields.

Validation output must include:

- surface_key
- style_profile / profile_key
- material_family
- frame_profile
- space_profile
- content_anchor
- typography_profile
- motion_profile
- surface_density
- visual_tension
- media_ratio
- content_width
- button_position
- overlay_treatment
- watermark_treatment
- audio_control_treatment
- mobile_behavior
- release_state_behavior
- any null or held fields

### 8. Renderer boundary

Do not wire renderer or CSS consumption in this OAR unless DB seating is complete and validated first.

This OAR is DB seating only.

A later OAR may update `resolveEncounterStyleProfile()` to read seated DB fields and expose data attributes for CSS.

## CODY ROLE

Cody may:

- inspect current schema and seated surface metadata
- create a DB migration for style authority seating
- update existing metadata or create a normalized style table if justified
- produce validation query output
- report null or held fields honestly
- write OAR1 with migration evidence

Cody may not:

- invent unseated values
- create duplicate style authority surfaces
- hardcode style behavior in frontend
- rewrite CSS
- wire visual rendering before DB validation
- alter encounter flow, assessment, MAP, payment, release, routing, or public claims
- treat provisional defaults as final where per-surface judgment is required

## VALIDATION

This OAR resolves when:

- current style authority source is identified
- DB seating method is documented
- migration seats the canonical style authority fields where valid
- unresolved fields are reported as held/null rather than guessed
- validation query confirms seated values per active surface
- no CSS or renderer behavior is changed
- no visual claim is made without browser QA
- OAR1 is written beside this OAR2

## EXPECTED OAR1

docs/oar/measures_registry/oar1_seat_encounter_style_authority_in_field_measures_db_v1.meta.md

## CLOSE

What is not registered cannot be governed.

This OAR moves encounter style from language into Field/Measures authority.

Codex holds.
Field structures.
Measures registers.
Chazz validates.
Cody implements.
src renders.
CSS executes.

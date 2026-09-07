---
document_type: oar2
authority_level: working
document_scope: measures_registry_style_language
title: OAR2 — Seat Remaining Encounter Style Authority Terms
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
  - visual-semantics
  - style-authority
  - registry-driven-style
---

# OAR2 — Seat Remaining Encounter Style Authority Terms

## OBSERVED

Encounter style concordance language is now seated in the TypeScript type system, but not yet DB-authoritative.

The prior OAR seated these dimensions:

- frame_profile
- space_profile
- content_anchor
- typography_profile
- motion_profile
- surface_density
- visual_tension

Remaining style authority fields are still unseated:

- media_ratio
- content_width
- button_position
- overlay_treatment
- watermark_treatment
- audio_control_treatment
- mobile_behavior
- release_state_behavior

These unresolved fields are likely where the remaining visual seams live.

## ALIGNED

The renderer cannot reproduce what the registry cannot name.

These remaining fields must become bounded style language before CSS normalization or visual behavior claims continue.

Frontend may not invent these values.

CSS may not act as authority.

Authority order remains:

Codex -> Field -> Measures -> OAR2 -> Chazz -> Cody -> src

Style order remains:

Codex seats visual language.
Field structures style relation.
Measures registers profile application.
Chazz validates.
Cody implements.
src renders.
CSS executes.

## ROUTED

Seat the following remaining encounter style authority terms as bounded concordance vocabulary.

### 1. Media Ratio

Media Ratio defines the expected media frame relationship.

Allowed values:

- portrait_9_16: vertical cinematic media frame
- portrait_4_5: vertical editorial/social media frame
- landscape_16_9: horizontal video or presentation frame
- square_1_1: square media frame
- fluid_media: media adapts to frame without fixed ratio

### 2. Content Width

Content Width defines the readable or visual measure of text/content.

Allowed values:

- narrow_measure: compact reading measure
- reading_measure: standard long-form readable width
- institutional_measure: structured public/institutional content width
- immersive_measure: wide content area inside cinematic frame
- full_bleed_measure: content may occupy the full frame

### 3. Button Position

Button Position defines where action authority appears.

Allowed values:

- right_cta: action rests on the right side
- left_cta: action rests on the left side
- center_cta: action rests in the center
- floating_cta: action may float within the frame
- hidden_cta: no visible CTA unless released by state

### 4. Overlay Treatment

Overlay Treatment defines how visual atmosphere or readability is supported over media/background.

Allowed values:

- none_overlay: no overlay
- soft_overlay: low-intensity readability layer
- cinematic_overlay: media-forward atmospheric layer
- threshold_overlay: passage/assessment tension layer
- ceremonial_overlay: elevated formal layer

### 5. Watermark Treatment

Watermark Treatment defines registry mark visibility.

Allowed values:

- hidden_mark: no watermark visible
- subtle_mark: faint background mark
- institutional_mark: visible but restrained institutional mark
- ceremonial_mark: elevated encounter mark
- persistent_mark: mark remains consistently visible

### 6. Audio Control Treatment

Audio Control Treatment defines visibility and behavior of audio/media controls.

Allowed values:

- always_visible_audio: controls are visible when audio/video exists
- hover_audio: controls appear on hover/focus
- minimal_audio: reduced but discoverable controls
- ambient_audio: audio exists as atmosphere with light control affordance
- hidden_audio: controls hidden only where intentionally seated

### 7. Mobile Behavior

Mobile Behavior defines how the encounter responds on mobile viewport.

Allowed values:

- preserve_frame: keep one-frame encounter behavior where possible
- stack_content: stack media/content vertically
- collapse_media: reduce or deprioritize media
- mobile_specific: use explicit mobile profile behavior
- locked_orientation: preserve ratio/orientation constraints

### 8. Release State Behavior

Release State Behavior defines how visual rendering responds to state.

Allowed values:

- visible_state: render normally
- held_state: render held/gated standing
- sealed_state: render sealed standing
- dependent_state: render dependency-required standing
- unavailable_state: render unavailable standing without invented fallback

## ENCOUNTER STYLE PROFILE SHAPE UPDATE

The canonical profile remains:

encounter_style_profile:
  profile_key:
  material_family:
  frame_profile:
  space_profile:
  content_anchor:
  typography_profile:
  motion_profile:
  surface_density:
  visual_tension:
  media_ratio:
  content_width:
  button_position:
  overlay_treatment:
  watermark_treatment:
  audio_control_treatment:
  mobile_behavior:
  release_state_behavior:

After this OAR, every field in the profile shape has bounded vocabulary.

## CODY ROLE

Cody may:

- add bounded TypeScript union types for the remaining style authority fields
- update EncounterStyleProfile field typing to use those unions
- draft migration-ready records for review
- keep unresolved DB-backed values as null/gap
- report where fields are not yet seated in DB

Cody may not:

- apply these terms as DB truth without Field/Measures seating
- invent per-surface defaults
- rewrite CSS under this OAR
- wire visual behavior without browser QA
- hardcode encounter-specific exceptions
- alter flow, assessment, MAP, payment, release, or routing logic

## VALIDATION

This OAR resolves when:

- all remaining style fields have bounded vocabulary
- EncounterStyleProfile uses bounded field types
- unresolved DB authority remains reported as gap/null
- migration-ready profile records may be drafted but not applied
- no CSS rewrite is performed under this OAR
- no visual behavior is claimed without browser QA

## EXPECTED OAR1

docs/oar/measures_registry/oar1_seat_remaining_encounter_style_authority_terms_v1.meta.md

## CLOSE

This completes the language layer for encounter style authority.

After this, the next valid movement is Field/Measures DB seating.

Codex holds.
Field structures.
Measures registers.
Chazz validates.
Cody implements.
src renders.
CSS executes.

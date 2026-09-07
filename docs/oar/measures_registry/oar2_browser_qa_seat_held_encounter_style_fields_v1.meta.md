---
document_type: oar2
authority_level: working
document_scope: measures_registry_browser_qa_style_authority
title: OAR2 — Browser QA and Seat Held Encounter Style Fields
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
  - browser-qa
  - encounter-style
  - held-fields
  - db-seating
  - visual-governance
---

# OAR2 — Browser QA and Seat Held Encounter Style Fields

## OBSERVED

Encounter style authority is seated for 14 active surfaces.

Six style fields remain deliberately held sitewide:

- content_width
- button_position
- overlay_treatment
- watermark_treatment
- mobile_behavior
- release_state_behavior

They were held because prior execution had no browser visibility and no direct evidence sufficient to seat them.

Cody now may receive browser visibility.

This enables observation-based seating instead of inference.

## ALIGNED

## SEATED PRINCIPLE

What is not registered cannot be governed.

Unregistered state becomes interpretation.
Interpretation becomes inconsistency.
Inconsistency becomes drift.

Registration does not guarantee coherence, but coherence cannot be governed without registration.

A governed system names its authorities, seats them explicitly, and holds what is unknown until it can be verified.

## ALIGNMENT RULE

This OAR exists to verify and seat the six held encounter style fields through browser-visible evidence.

No value may be seated from taste, preference, or assumption.

Browser observation must precede DB seating.

DB seating must precede renderer or CSS consumption.

Authority order remains:

Codex -> Field -> Measures -> OAR2 -> Chazz -> Cody -> src

Style authority order remains:

Codex holds seated style state.
Field structures style fields and relation.
Measures registers profile application per encounter surface.
Chazz validates.
Cody observes and implements.
src renders.
CSS executes.

## ROUTED

Cody shall perform a browser-visible QA pass and seat the six held style fields where evidence supports the value.

### 1. Browser visibility required

Use browser inspection, viewport screenshots, computed styles, and DOM review.

Minimum viewports:

- desktop/laptop
- mobile portrait

Optional if available:

- tablet
- mobile landscape

Do not claim visual behavior without observed browser evidence.

### 2. Active surfaces to inspect

Inspect all currently active Measures Registry surfaces with seated `style_profile`:

- crystal_seat_intro
- crystal_seat_threshold
- crystal_seat_orientation
- crystal_seat_encounter
- obsidian_chamber_orientation
- obsidian_chamber_encounter_surface
- obsidian_chamber_C1_compact
- marble_chamber_orientation
- marble_chamber_results
- marble_chamber_encounter
- marble_chamber_C2_compact
- marble_chamber_C2_agreement
- marble_chamber_C2_resolution
- lapis_chamber_encounter

Also inspect `publication_dispatch` separately as a known gap.

Do not seat style authority for `publication_dispatch` unless it first has a valid `style_profile` binding key.

### 3. Resolve six held fields per surface

For each valid active surface, determine:

- content_width
- button_position
- overlay_treatment
- watermark_treatment
- mobile_behavior
- release_state_behavior

Allowed values:

content_width:

- narrow_measure
- reading_measure
- institutional_measure
- immersive_measure
- full_bleed_measure

button_position:

- right_cta
- left_cta
- center_cta
- floating_cta
- hidden_cta

overlay_treatment:

- none_overlay
- soft_overlay
- cinematic_overlay
- threshold_overlay
- ceremonial_overlay

watermark_treatment:

- hidden_mark
- subtle_mark
- institutional_mark
- ceremonial_mark
- persistent_mark

mobile_behavior:

- preserve_frame
- stack_content
- collapse_media
- mobile_specific
- locked_orientation

release_state_behavior:

- visible_state
- held_state
- sealed_state
- dependent_state
- unavailable_state

### 4. Evidence requirement

For each surface, Cody must record evidence before seating.

Evidence must include:

- surface_key
- route or navigation path used
- viewport inspected
- observed DOM/CSS basis
- screenshot reference if available
- resolved value for each of the six fields
- any field left null or held
- reason for each null or held field

### 5. DB seating

After evidence is gathered, seat supported values as sibling metadata keys on the existing `measures_encounter_surface_assignment.metadata` object.

Do not create a second style authority surface.

Do not overwrite previously seated non-held fields unless browser evidence exposes an error and the correction is explicitly logged.

### 6. Validation query required

Return validation query output showing all 14 active surfaces and all 17 style authority fields:

- surface_key
- style_profile
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

Validation must clearly show no held/null values remain for the six fields unless explicitly justified.

### 7. Publication dispatch gap

If `publication_dispatch` still has no `style_profile`, leave it unseated.

Report:

- current metadata state
- whether a style_profile binding exists
- what content model gap prevents seating
- recommended follow-up if needed

### 8. Boundary

This OAR is browser QA plus DB seating only.

Do not:

- rewrite CSS
- wire renderer data attributes
- alter `resolveEncounterStyleProfile()`
- change flow
- change assessment logic
- change MAP logic
- change payment logic
- change release state
- change public claims

Renderer consumption and CSS normalization require a later OAR after DB validation closes.

## CODY ROLE

Cody may:

- use browser visibility to inspect active surfaces
- capture screenshots or references
- inspect computed styles and DOM
- determine the six held fields from observed evidence
- seat supported metadata values in DB
- leave unsupported values null with explanation
- write OAR1 with evidence and validation output

Cody may not:

- guess values
- seat `publication_dispatch` without a `style_profile`
- create duplicate style authority
- rewrite CSS
- wire renderer behavior
- change unrelated DB state
- alter encounter flow, assessment, MAP, payment, release, routing, or public claims

## VALIDATION

This OAR resolves when:

- browser QA evidence is recorded
- the six held fields are seated where evidence supports them
- unsupported fields remain null only with explicit reason
- validation query confirms final style authority state for all active surfaces
- `publication_dispatch` standing is reported honestly
- no CSS or renderer behavior is changed
- no visual result is claimed beyond observed evidence
- OAR1 is written beside this OAR2

## EXPECTED OAR1

docs/oar/measures_registry/oar1_browser_qa_seat_held_encounter_style_fields_v1.meta.md

## CLOSE

What is not registered cannot be governed.

This OAR uses browser-visible evidence to move held visual authority into Field/Measures standing.

Codex holds.
Field structures.
Measures registers.
Chazz validates.
Cody observes and implements.
src renders.
CSS executes.

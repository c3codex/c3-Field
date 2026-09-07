---
document_type: oar2
authority_level: working
document_scope: measures_registry_style_language
title: OAR2 — Seat Encounter Style Concordance Language
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
  - style-concordance
  - installation-renderer
  - frame-profile
  - space-profile
  - typography-profile
  - registry-driven-style
---

# OAR2 — Seat Encounter Style Concordance Language

## OBSERVED

Measures Registry styling has a governed profile resolver, but the visual language is not yet fully seated.

Current standing:

- profile_key resolves
- remaining style fields are mostly unseated/null
- CSS does not yet consume structured style profile tokens
- visual seams remain across frame, spacing, typography, media, CTA, and density
- current styling still behaves too much like page CSS instead of an installation renderer
- prior OAR1 identified typography scale drift, duplicated frame rules, and incomplete DB style seating

The missing surface is not more CSS.

The missing surface is native visual language.

## ALIGNED

Visual style must become registry-governed encounter language.

Frontend may not invent style authority.

CSS may not act as authority.

Encounter style must resolve through seated language that can be applied consistently across material families and surfaces.

Authority order remains:

Codex -> Field -> Measures -> OAR2 -> Chazz -> Cody -> src

Style order must become:

Codex seats visual language.
Field structures style relation.
Measures registers profile application.
Chazz validates.
Cody implements.
src renders.
CSS executes.

## ROUTED

Seat the following style concordance language as the canonical vocabulary for Measures Registry encounter rendering.

### 1. Frame Profile

Frame Profile defines how the encounter occupies the viewport.

Allowed values:

- cinematic_frame: full-bleed, immersive, media-first encounter; minimal chrome; used where the encounter should feel like one held frame
- document_frame: reading surface; constrained width; text-primary; used for report, explanation, and formal continuation surfaces
- gallery_frame: media and content share authority; used where image/video and text must remain equally present
- split_frame: dual surface; two active visual authorities; used for path choice or relational comparison surfaces
- threshold_frame: transitional frame; used for entry, passage, gate, assessment, and orientation
- modal_frame: contained overlay; temporarily supersedes another frame; used only where an encounter needs an interrupting contained state

### 2. Spatial Profile

Spatial Profile defines how content lives inside the frame.

Allowed values:

- immersive_space: edge-to-edge field; intentional negative space; media-forward
- institutional_space: structured margins; measured rhythm; formal readability
- intimate_space: narrow reading width; close proximity; lower distance between content and user
- ceremonial_space: generous margins; centered or elevated composition; visual gravity
- compressed_space: high-density information surface; used only where operational data must fit inside one frame

### 3. Content Anchor

Content Anchor defines where the encounter naturally rests.

Allowed values:

- anchor_center: balanced composition; centered encounter gravity
- anchor_right: right-side CTA or action authority; used where action is the continuation point
- anchor_left: narrative-first orientation; used where reading begins the encounter
- anchor_bottom: media-forward composition with content reveal below or low in frame
- anchor_floating: dynamic placement; used only where profile explicitly permits variable positioning

### 4. Typography Profile

Typography Profile defines the behavior of type, not the font itself.

Allowed values:

- whisper_type: light atmospheric support copy; low visual volume
- institutional_type: structured, legible, authoritative; used for governance, assessment, and public institutional copy
- editorial_type: long-form reading; used for article, report, explanation, and continuation surfaces
- ceremonial_type: epigraphs, acknowledgments, and invocation-style surfaces; elevated but restrained
- signal_type: large declarative statement; used for high-emphasis encounter headlines

### 5. Motion Profile

Motion Profile defines movement behavior.

Allowed values:

- still_motion: static or near-static
- breathing_motion: subtle motion; low intensity
- passage_motion: transitional movement; used for movement between encounter states
- cinematic_motion: significant media motion; used for video-first or full-bleed encounters
- ritual_motion: slow deliberate sequence; used where transition cadence matters

### 6. Surface Density

Surface Density defines how much information may exist simultaneously.

Allowed values:

- minimal_density: one idea; low cognitive load
- narrative_density: story sequence; moderate reading
- operational_density: structured information; assessment, decision, or action context
- reference_density: information-heavy; used for report, legal, or technical surfaces only

### 7. Visual Tension

Visual Tension defines the emotional/structural pressure of the surface.

Allowed values:

- calm_tension: stable and grounded
- threshold_tension: slight uncertainty; entry or transition condition
- diagnostic_tension: evaluative and investigative; used for assessment and structural drift detection
- ceremonial_tension: elevated significance; used for governance, acknowledgment, and formal passage
- transformative_tension: active movement toward change; used for continuation, transition, or alignment surfaces

## MATERIAL DEFAULTS

### Crystal default

material_family: crystal
frame_profile: cinematic_frame
space_profile: ceremonial_space
content_anchor: anchor_center
typography_profile: signal_type
motion_profile: breathing_motion
surface_density: minimal_density
visual_tension: calm_tension

### Obsidian default

material_family: obsidian
frame_profile: threshold_frame
space_profile: immersive_space
content_anchor: anchor_right
typography_profile: institutional_type
motion_profile: passage_motion
surface_density: operational_density
visual_tension: diagnostic_tension

### Marble default

material_family: marble
frame_profile: document_frame
space_profile: institutional_space
content_anchor: anchor_left
typography_profile: editorial_type
motion_profile: still_motion
surface_density: narrative_density
visual_tension: ceremonial_tension

### Lapis default

material_family: lapis
frame_profile: split_frame
space_profile: intimate_space
content_anchor: anchor_floating
typography_profile: whisper_type
motion_profile: ritual_motion
surface_density: narrative_density
visual_tension: transformative_tension

## ENCOUNTER STYLE PROFILE SHAPE

The canonical encounter style profile should support:

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

## IMPLEMENTATION BOUNDARY

This OAR seats language and profile vocabulary.

It does not require immediate full CSS rewrite.

Cody may:

- add type definitions for the style concordance language
- extend EncounterStyleProfile to include these fields
- map material defaults where DB state is absent only if clearly marked as temporary non-authoritative fallback
- prepare migration-ready profile records
- expose unresolved fields as gaps

Cody may not:

- invent final DB state
- hardcode encounter-specific style exceptions
- treat material defaults as Codex authority before seating
- rewrite unrelated CSS
- alter encounter flow, assessment logic, MAP logic, payment logic, or release state

## VALIDATION

This OAR resolves when:

- style concordance terms are defined
- allowed values are bounded
- material defaults are documented
- encounter style profile shape is updated
- implementation gaps are reported honestly
- no visual behavior is claimed complete without browser QA

## EXPECTED OAR1

docs/oar/measures_registry/oar1_seat_encounter_style_concordance_language_v1.meta.md

## CLOSE

The renderer cannot reproduce what the registry cannot name.

This OAR gives Measures Registry the language of encounter style.

Codex holds.
Field structures.
Measures registers.
Chazz validates.
Cody implements.
src renders.
CSS executes.

---
document_type: oar2
authority_level: working
document_scope: measures_registry_layout_composition_authority
title: OAR2 — Seat Encounter Layout and Composition Authority
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
  - layout-authority
  - composition-authority
  - encounter-rendering
  - browser-qa
  - visual-governance
---

# OAR2 — Seat Encounter Layout and Composition Authority

## OBSERVED

Encounter style authority is now seated for the active Measures Registry surfaces.

Browser QA confirmed that the remaining styling issue is no longer primarily color, typography, or CSS token authority.

The remaining visual drift appears in layout and composition:

- threshold mobile keeps desktop split behavior instead of resolving to mobile composition
- marble results report card is too narrow in large desktop space
- MAP surface tries to act as left rail / center chamber / right exchange and hero at the same time
- MAP mobile stacks desktop structure without becoming a mobile composition
- payment agreement surface lacks sufficient composition content and visual anchor
- some surfaces are technically working but compositionally unresolved

This is not a generic CSS issue.

This is missing layout authority and composition authority.

## ALIGNED

## SEATED PRINCIPLE

What is not registered cannot be governed.

Unregistered state becomes interpretation.
Interpretation becomes inconsistency.
Inconsistency becomes drift.

Registration does not guarantee coherence, but coherence cannot be governed without registration.

A governed system names its authorities, seats them explicitly, and holds what is unknown until it can be verified.

## ALIGNMENT RULE

Style authority defines visual semantics.

Layout authority defines structural arrangement.

Composition authority defines how the encounter holds attention, weight, and visual meaning.

These are distinct and may not collapse into one another.

Frontend may not invent layout or composition authority.

CSS may not compensate for missing layout or composition registration.

Authority order remains:

Codex -> Field -> Measures -> OAR2 -> Chazz -> Cody -> src

Rendering order becomes:

style_profile
layout_profile
composition_profile
-> renderer attributes
-> CSS execution
-> browser QA validation

## ROUTED

Seat layout and composition language, then prepare DB seating for each active encounter surface.

### 1. Define layout_profile vocabulary

Add bounded layout profile language.

Allowed values:

- hero_layout
  - one dominant media or message area
  - used for intro, passage, or high-impact entry surfaces

- split_layout
  - two primary panels or choices
  - used where two paths or two authorities are intentionally presented

- stacked_layout
  - vertical sequence of sections
  - used for mobile or narrative progression

- editorial_layout
  - article or publication-style layout
  - used for unDrifted and long-form public content

- report_layout
  - structured findings or review document
  - used for results and assessment outputs

- assessment_layout
  - question, answer, progress, and action arrangement
  - used for assessment surfaces

- form_layout
  - input and consent arrangement
  - used for contact or capture surfaces

- three_panel_layout
  - left / center / right structured exchange
  - used only where three distinct authorities remain visible together

- single_card_layout
  - one centered primary card
  - used for confirmation, payment, or focused action surfaces

- chamber_layout
  - ceremonial chamber composition with central field and surrounding relation
  - used where background architecture is part of the encounter

### 2. Define composition_profile vocabulary

Add bounded composition profile language.

Allowed values:

- cinematic_composition
  - media-forward, immersive, high visual impact

- threshold_composition
  - transition, choice, or passage emphasis

- institutional_composition
  - formal structure, legibility, and public trust

- assessment_composition
  - evaluative focus with controlled decision rhythm

- document_composition
  - readable report or document gravity

- exchange_composition
  - action, agreement, payment, or continuation emphasis

- ceremonial_composition
  - elevated significance, formal passage, centered gravity

- publication_composition
  - editorial hierarchy, story grouping, article discovery

- confirmation_composition
  - resolved state, receipt, completion, or closure

### 3. Add fields to profile contract

Extend the encounter profile contract with:

- layout_profile
- mobile_layout_profile
- composition_profile
- mobile_composition_profile

These fields are distinct from:

- frame_profile
- space_profile
- content_anchor
- content_width
- mobile_behavior

Do not collapse these into existing style fields.

### 4. Browser evidence review

Use the existing browser QA evidence from:

docs/oar/measures_registry/oar1_browser_qa_seat_held_encounter_style_fields_v1.meta.md

and screenshots in:

docs/oar/measures_registry/oar1_browser_qa_seat_held_encounter_style_fields_v1_evidence/

Review active surfaces for layout/composition classification.

If additional browser inspection is needed, perform it before seating.

### 5. Draft per-surface layout and composition assignments

For each active surface, determine:

- layout_profile
- mobile_layout_profile
- composition_profile
- mobile_composition_profile

Active surfaces:

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

Known standing:

- marble_chamber_encounter is a legacy alias that forwards immediately and has no visible DOM. Leave visual layout/composition fields null or unavailable unless Field/Measures explicitly converts it to a real surface.
- publication_dispatch remains excluded unless a style_profile binding is seated first.

### 6. DB seating

Seat supported values as sibling metadata keys on the existing `measures_encounter_surface_assignment.metadata` object.

Do not create duplicate layout authority.

Do not create duplicate composition authority.

Do not overwrite existing style authority fields unless explicitly correcting an observed error and documenting it.

### 7. Validation query required

Return validation query output showing:

- surface_key
- style_profile
- layout_profile
- mobile_layout_profile
- composition_profile
- mobile_composition_profile
- release_state_behavior

Also report any null or held fields and why.

### 8. No CSS rewrite under this OAR

This OAR seats language and DB authority only.

Do not:

- rewrite CSS
- wire renderer attributes
- modify layout behavior
- change mobile behavior
- change MAP flow
- change payment logic
- change assessment logic
- change release/routing logic
- change public claims

A later OAR may update renderer consumption after this DB authority is seated and validated.

## CODY ROLE

Cody may:

- add bounded TypeScript union types for layout_profile and composition_profile
- extend EncounterStyleProfile or a related encounter rendering profile type
- inspect browser evidence
- perform additional browser QA where needed
- seat DB metadata values for layout/composition authority
- produce validation query output
- write OAR1 with evidence and null/held reasons

Cody may not:

- guess values without evidence
- create duplicate authority surfaces
- rewrite CSS
- wire renderer behavior
- change live visual behavior in this OAR
- alter flow, assessment, MAP, payment, release, routing, or public claims
- seat publication_dispatch without a style_profile binding

## VALIDATION

This OAR resolves when:

- layout_profile vocabulary is bounded
- composition_profile vocabulary is bounded
- profile contract supports layout/composition fields
- per-surface values are seated where evidence supports them
- alias/gap surfaces remain held with reason
- validation query confirms final DB standing
- no CSS or renderer behavior is changed
- no visual change is claimed without a later renderer/CSS OAR
- OAR1 is written beside this OAR2

## EXPECTED OAR1

docs/oar/measures_registry/oar1_seat_encounter_layout_and_composition_authority_v1.meta.md

## CLOSE

The styling authority is now seated.

The remaining visual drift is layout and composition authority.

What is not registered cannot be governed.

Codex holds.
Field structures.
Measures registers.
Chazz validates.
Cody observes and implements.
src renders.
CSS executes.

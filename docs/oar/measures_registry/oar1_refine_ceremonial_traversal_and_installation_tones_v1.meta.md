---
document_type: oar1
authority_level: working
document_scope: ceremonial_traversal_and_installation_tone_refinement
title: OAR1 - Refine Ceremonial Traversal Spine and Installation Tone Contracts
status: completed
version: v1
operator: op044
system: measures_registry
source_oar2: oar2_refine_ceremonial_traversal_and_installation_tones_v1
---

# OAR1 - Refine Ceremonial Traversal Spine and Installation Tone Contracts

## Outcome

The ceremonial traversal runtime was refined across both governed metadata and frontend runtime.

This closeout completed:

1. installation tone spine seating from verified R2 assets
2. passage pacing normalization around 3.4s traversal breaths
3. fade sequencing before passage completion
4. reuse of `target_after_passage` for deterministic universal passage routing
5. Phase Map gate-family return-through-Harrumuk behavior in runtime
6. preservation of the existing Chamber of Epithets audio contract

No hardcoded media URLs were introduced.

## Tone Seating

Verified `200` and seated:

- `crystal_tone_rise_return_5min.wav`
- `lapis_tone_rise_return_5min.wav`
- `obsidian_tone_rise_return_5min.wav`
- `marble_tone_rise_return_5min.wav`

Governed installation tone mappings now stand on:

- `epigraph` -> crystal
- `crystal_temple_home` -> crystal
- `kumurrah_passage` -> lapis
- `temple_antechamber` -> lapis
- `temple_harrumuk_passage` -> obsidian
- `gates_passage_01` -> obsidian
- `me_01` -> marble

Seated media keys:

- `installation_tone_crystal_rise_return_v1`
- `installation_tone_lapis_rise_return_v1`
- `installation_tone_obsidian_rise_return_v1`
- `installation_tone_marble_rise_return_v1`

## Traversal Refinement

Metadata was updated for:

- `crystal_temple_home_view`
- `kumurrah_passage`
- `temple_harrumuk_passage_view`
- `gates_passage_01_encounter`
- `gates_passage_02_encounter`
- `gates_passage_03_encounter`
- `epithets_passage_01_encounter`
- `epithets_passage_02_encounter`
- `gate_2_lapis_beads_encounter`

Runtime standing after refinement:

- Crystal Temple Home now routes its left-path ceremonial progression through `kumurrah_passage` with `target_after_passage: temple_antechamber`
- Kumurrah now behaves as a traversal breath rather than a long body
- Harrumuk now behaves as a traversal breath rather than a long body
- universal `gates_passage_01` may now be reused with `target_after_passage`
- Gate 02 progression now targets `gates_passage_01` with `target_after_passage: gate_3_lapis_necklace`

## Frontend Repair

Updated:

- `src/measures_of_inanna/GenericEncounter.tsx`
- `src/measures_of_inanna/PhaseMap.tsx`

Implemented:

- preserved `target_after_passage` during auto-advance navigation
- timed passage fade before destination handoff
- passage auto-advance on timer without waiting for full clip completion
- suppression of hidden tonal autoplay when the active featured clip already carries embedded audio
- Phase Map gate-family return routing through `phase_map.routing.return_target`

This keeps passage clips in a transitional role while preserving chamberplates as the main encounter bodies.

## Epithet Audio Preservation

Existing epithet standing was preserved:

- on-load featured motion clips remain in place
- embedded clip audio remains distinct from click-invoked album/audio aspects
- `full_song` and `material_tone` aspect roles were not collapsed into hidden autoplay

The OAR did not reseat epithet audio rows.

## Validation

- executor completed successfully:
  - `docs/oar/measures_registry/execute-refine-ceremonial-traversal-and-installation-tones.cjs`
- evidence written:
  - `docs/oar/measures_registry/refine_ceremonial_traversal_and_installation_tones_v1.json`
- `npm.cmd run build:inanna` passed
- local build asset:
  - `dist-inanna/assets/index-DAnGjyfu.js`

## Local vs Deployed Standing

Local standing:

- frontend runtime refinement is complete
- governed tone seating is complete
- traversal metadata normalization listed above is complete

Deployed standing:

- deploy is still required for frontend runtime changes
- DB seating is already authoritative once deployed runtime picks up the new bundle

## Close

Traversal now breathes more like passage and less like destination.

The tone spine is seated.

The chamberplates remain the encounter bodies.

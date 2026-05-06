---
document_type: oar1
title: OAR1 - Path Threshold Hero Reconstruction
version: v1
status: executed
system: measures_registry
surface: landing_split_hero
scope: hero_surface_only
source_oar2: docs/oar/measures_registry/oar2_path_threshold_hero_reconstruction_v1.meta.md
---

# OAR1 - Path Threshold Hero Reconstruction

## Execution Summary

Executed the approved landing hero threshold reconstruction.

The Measures Registry landing root now resolves from the epigraph into a full-screen split-threshold environment instead of the prior marketing-style split hero. The surface preserves the left/right path distinction and keeps the existing registered routing contract:

- left threshold routes into system evaluation
- right threshold routes into cohort conversion

No epigraph behavior, IIS evaluation flow, About surface, SRC intake, Measures of Inanna runtime, DB schema, Phase Map, institutional conversion logic, or non-hero evaluation systems were changed.

## Runtime Changes

- Added optional media role reads for the threshold hero:
  - `left_hero_fracture`
  - `left_hero_fracture_motion`
  - `right_measured_hero`
  - `measured_hero_motion_graphic`
- Replaced the post-epigraph landing split hero with `registry-threshold-hero`.
- Implemented paired threshold media seats:
  - left = fractured environment
  - right = measured environment
- Implemented muted inline autoplay for each available motion asset.
- Removed looping from the new threshold motion playback.
- Added motion-settle state so each side falls back to its persistent still image after playback ends or errors.
- Preserved existing action key routing from `landing_root.hero_paths`.
- Added fallback still media:
  - left falls back to existing `hero_image`
  - right falls back to `hero_measured_image`, then existing `hero_image`

## Surface Changes

- Landing root hero is full viewport.
- No global header or navigation is rendered on the landing hero threshold.
- No footer is rendered.
- No opaque content box, card framing, or marketing hero copy block is rendered.
- Text is integrated directly into the media field.
- A structural center divide remains visible between environments.
- Mobile preserves side-by-side threshold distinction rather than collapsing into cards.

## Copy Seated In Runtime

Left side:

`Complexity is scaling faster than clarity. Your systems are producing outcomes nobody can fully explain.`

CTA:

`Evaluate the Environment`

Right side:

`Coherence must be structured. Measured environments produce stable and governable outcomes.`

CTA:

`Structure the Environment`

## Files Updated

- `src/measures_registry/MeasuresRegistryRuntime.tsx`
- `src/index.css`

## Validation

Command:

`npm.cmd run build:registry`

Result:

- Registry build passed.
- Generated `dist-registry` artifacts were restored/cleaned from git after validation.
- Local registry dev server was started for inspection.
- Active local URL observed: `http://127.0.0.1:5175/`

## Media Seating Note

This pass updated the runtime contract to read the four threshold media roles, but did not execute DB/storage media seating. The runtime degrades to existing active hero still media until these rows are seated in `measures_media_map`.

Resolved by addendum:

`docs/oar/measures_registry/oar1_addendum_seat_path_threshold_hero_media_v1.meta.md`

Expected media assets from OAR2:

- `left_hero_fracture.webp`
- `left_hero_fracture_motion.mp4`
- `right_measured_hero.webp`
- `measured_hero_motion_graphic.mp4`

## Scope Confirmation

Changed only the Measures Registry landing hero threshold implementation and associated styles.

No unrelated refactors were performed.

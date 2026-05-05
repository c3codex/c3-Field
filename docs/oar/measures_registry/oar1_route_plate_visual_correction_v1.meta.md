---
document_type: oar1
title: OAR1 — Route Plate Visual Correction
version: v1
status: executed
system: measures_registry
surface: landing_path_choice
source_oar2: docs/oar/measures_registry/oar2_route_plate_visual_correction_v1.meta.md
---

# OAR1 — route_plate_visual_correction_v1

## Summary

Executed the landing path surface visual correction.

The path choice renderer no longer presents the two routes as equal cards. It now renders each DB-seated plaque as an embedded route plate inside a split field, preserving existing action keys and routing while changing the visual grammar from card comparison to directional field selection.

## Runtime Changes

- Replaced `article` card wrappers in `landing_path_choice` with `button.registry-route-plate` route plates.
- Preserved DB-driven source records:
  - `plaques`
  - `action_key`
  - `action_label`
  - `side`
- Added defensive side fallback:
  - first plaque -> `left`
  - second plaque -> `right`
- Preserved `handleAction(actionKey)` routing behavior.

## Visual Correction

Desktop now renders:

- full-width split field
- hard center divide
- left side = failure/recessed
- right side = coherence/forward
- text directly in field
- no bordered card containers
- no equal elevation
- no mirrored padding

Failure side:

- lower opacity
- smaller text footprint
- darker amber/red interference
- slight misalignment/recession
- minimal hover response

Coherence side:

- higher contrast
- larger/open footprint
- precise grid alignment
- slight forward bias
- hover lift and clarity increase

Mobile remains stacked, with coherence still visually stronger.

## Validation

- No `.registry-path-choice-contrast article` card selector remains.
- No nested CTA button remains inside path cards.
- Route plates are not boxed, bordered, elevated, or panel-backed.
- Desktop split field uses two direct route plate zones.
- Failure and coherence have differentiated visual weight.
- Coherence has stronger hover behavior than failure.
- Background field differentiates unstable left geometry from aligned right geometry.
- Routing remains action-key driven through existing `handleAction`.

## Build Validation

Command:

`npm.cmd run build:registry`

Result:

- Build passed.
- Output directory: `dist-registry`
- Generated build artifacts were cleaned from git after validation.

## Close

Visual equivalence removed.
Directional inevitability established.
Routing preserved.

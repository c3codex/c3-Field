# OAR2 ADDENDUM — Seat Path Threshold Hero Media
**System:** measures_registry
**Surface:** landing_split_hero
**Status:** approved_for_execution
**Scope:** hero_media_seating_only
**Intent:** Complete DB/storage seating for the reconstructed path-threshold hero runtime.

---

# Objective

Complete the missing DNB/media registry execution seam from:

`oar1_path_threshold_hero_reconstruction_v1.meta.md`

The runtime contract already reads the required threshold hero media roles, but the media assets themselves were not seated into the active media registry contract.

This addendum resolves the remaining implementation gap.

---

# Required Media Roles

Seat the following media roles into the active registry runtime:

- `left_hero_fracture`
- `left_hero_fracture_motion`
- `right_measured_hero`
- `measured_hero_motion_graphic`

---

# Expected Assets

## Left Threshold Environment

Still:
- `left_hero_fracture.webp`

Motion:
- `left_hero_fracture_motion.mp4`

---

## Right Threshold Environment

Still:
- `right_measured_hero.webp`

Motion:
- `measured_hero_motion_graphic.mp4`

---

# Seating Contract

Seat all four assets into:

- `measures_media_map`

Bind assets to the active Measures Registry landing threshold runtime.

The runtime must no longer degrade/fallback to prior hero media after seating completes.

---

# Runtime Expectations

After seating:

- left threshold loads fractured still + motion
- right threshold loads measured still + motion
- motion autoplay remains muted + inline
- motion settles to still after playback completion
- no looping occurs
- no fallback hero media renders

---

# Validation

Confirm:

- all four media rows exist and are active
- media URLs resolve correctly from storage bucket
- desktop loads correct threshold media
- mobile loads correct threshold media
- left/right distinction survives responsive rendering
- both motion assets settle correctly into still state
- no legacy hero media appears
- runtime no longer falls back to previous hero asset chain

---

# Scope Lock

Do NOT modify:

- runtime layout
- hero copy
- epigraph
- IIS evaluation flow
- SRC routing
- Phase Map
- Measures of Inanna runtime
- DB schema
- conversion systems

This addendum resolves media seating only.

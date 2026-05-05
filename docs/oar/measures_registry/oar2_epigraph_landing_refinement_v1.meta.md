---
document_type: oar2
title: OAR2 — Epigraph + Landing Refinement
version: v1
status: ready_for_cody
system: measures_registry
surfaces:
  - epigraph
  - landing_path_surface
  - c3_field
---


# OAR2 — epigraph_landing_refinement_v1

## OBSERVED

- Epigraph video (`intro_hook_15sec.mp4`) is seated and routed correctly.
- Desktop render shows:
  - pre-video branding frame / fallback bleed
  - video not fully occupying viewport
- Landing surface:
  - split-field structure is correct
  - failure side media is close but needs refinement
  - coherence side lacks emergent identity resolution
- Header:
  - visually heavy
  - positioned inside encounter field
- c3 Field surface:
  - authority text correctly seated
  - no media integration yet
- User intent:
  - no c3 branding on landing
  - introduce emergent geometry (not logo)
  - integrate existing `c3_field.mp4`
  - introduce field expressions without portfolio pattern

## ALIGNED

- Epigraph = full-bleed encounter surface
- Landing = no branding, no logo, no overlay identity
- Coherence side = identity emerges from structure, not UI
- Failure side = diagnostic, not decorative
- c3 Field = authority + field expression, not gallery

No frontend invention permitted.

## ROUTED

### 1. Epigraph Render Correction

video:
  width: 100vw
  height: 100vh
  object-fit: cover
  position: absolute
  top: 0
  left: 0
  preload: auto

Remove:
- any poster frame
- any pre-render branding layer
- any static fallback unless failure state

Ensure:
first visible frame = motion frame, not still logo

---

### 2. Header Adjustment

- reduce height by ~50%
- remove solid background
- position absolute (floating)
- opacity ~0.75

Header must NOT:
- intersect path decision zone
- compete with split field

---

### 3. Landing — Remove Branding

NO:
- c3 marks
- logos
- identity overlays

Landing remains system condition only.

---

### 4. Coherence Side — Emergent Geometry

state 1:
  aligned geometric field

state 2:
  increasing precision

state 3:
  orthocentric triangle forms

state 4:
  faint eight-point star resolves within triangle

Constraints:
- no glow
- no logo pop-in
- no decorative animation

---

### 5. Failure Side — Media Refinement

- replace media with lattice-based render
- remove UI panel feel
- no circuitry visuals
- maintain signal deflection logic
- enforce 16:9

---

### 6. c3 Field — Media Integration

asset: c3_field.mp4
bucket: measures-registry

- placed under authority text
- full width
- no frame or border
- autoplay muted
- loop enabled

---

### 7. c3 Field — Field Expressions

Add after media:

Field Expressions

Measures of Inanna  
A registry-driven encounter system demonstrating structured progression and phase coherence.

Priceless Gallery  
A living archive structured through presence, outside transactional framing.

c3 DAO  
Institutional layer for governance, contribution routing, and coordinated evolution.

Constraints:
- vertical list
- no cards
- no grid
- no thumbnails
- subtle underline hover only

---

### 8. Desktop Split-Field Tuning

- increase center divide contrast
- reduce failure motion ~30%
- increase coherence clarity
- slight right-side scale bias (5–10%)

## CODY ROLE

- fix epigraph render container
- adjust header
- remove landing branding
- implement emergent geometry
- replace failure media
- integrate c3_field.mp4
- add field expressions

Do NOT:
- add UI containers
- reintroduce cards
- add branding to landing

## VALIDATION

1. Epigraph fills viewport cleanly
2. No pre-frame branding
3. Header is non-intrusive
4. Landing has zero branding
5. Coherence geometry resolves
6. Failure media is lattice-based
7. c3_field.mp4 renders correctly
8. Field expressions are text-only
9. Split-field asymmetry visible

## CLOSE

Render corrected.
Authority preserved.
Identity emerges from structure.
No expansion introduced.

# OAR2 — Path Threshold Hero Reconstruction
**System:** measures_registry
**Surface:** landing_split_hero
**Status:** approved_for_execution
**Scope:** hero_surface_only
**Intent:** Replace current landing hero implementation with full-screen threshold-choice environment using paired fracture/coherence media system and motion-to-still behavior.

---

# Objective

Reconstruct the Measures Registry landing hero into a full-screen decision threshold.

The page is no longer a marketing header surface.

It is a path-recognition surface for institutions already experiencing instability, ambiguity, and unresolved AI environmental behavior.

The hero must visually and behaviorally communicate:

- unresolved structure vs measured structure
- instability vs coherence
- attempted propagation vs governed propagation
- evaluation vs structured environment implementation

No traditional site chrome is permitted on this surface.

---

# Required Surface Behavior

## Remove

Remove from landing hero surface only:

- global header
- navigation bar
- footer
- opaque overlays
- boxed content containers
- marketing card framing
- decorative UI layers
- floating gradients
- generic hero layout structure

Landing hero becomes immersive full-screen threshold.

---

# Hero Layout Contract

## Structure

Full viewport split-threshold composition.

- Left side = fractured environment
- Right side = measured environment
- Strong visible divide between environments
- Divide must feel structural, not decorative
- Responsive behavior must preserve threshold distinction on mobile and desktop

No center-crop behavior may destroy path readability.

---

# Media Seating

## Left Side

Still:
- `left_hero_fracture.webp`

Motion:
- `left_hero_fracture_motion.mp4`

Behavior:
- Motion autoplay
- Muted
- Plays inline
- Settles to still image after playback completes
- No looping

Visual behavior:
- unresolved propagation
- failed routing attempts
- structural ambiguity
- near-coherence failure

---

## Right Side

Still:
- `right_measured_hero.webp`

Motion:
- `measured_hero_motion_graphic.mp4`

Behavior:
- Motion autoplay
- Muted
- Plays inline
- Settles to still image after playback completes
- No looping

Visual behavior:
- deterministic propagation
- measured continuity
- structural coherence
- governed signal behavior

---

# Motion Contract

Motion graphics must feel:

- structural
- diagnostic
- environmental
- measured

Motion graphics must NOT feel:

- decorative
- cinematic filler
- ambient sci-fi loops
- HUD/UI animation
- particle systems

Motion exists only to demonstrate environmental consequence.

---

# Text Contract

## Left Side Copy

Complexity is scaling faster than clarity.  
Your systems are producing outcomes nobody can fully explain.

CTA:
`Evaluate the Environment`

---

## Right Side Copy

Coherence must be structured.  
Measured environments produce stable and governable outcomes.

CTA:
`Structure the Environment`

---

# Typography + Placement

- Text integrated directly into media field
- No opaque background blocks
- No boxed overlays
- Text must stabilize and direct
- Typography should feel institutional and measured
- Maintain readability without visually separating text from environment

---

# Responsive Contract

## Mobile

Threshold duality must remain readable on mobile.

Required:
- preserve distinction between left/right states
- maintain structural divide
- preserve CTA clarity
- preserve environmental contrast

Avoid:
- destructive center cropping
- collapsing into generic stacked cards
- hiding one environment

---

# Technical Contract

## Playback

Both motion assets:
- autoplay
- muted
- inline playback
- no loop
- transition to still state after completion

Still image becomes persistent final state.

---

# Scope Lock

Do NOT modify:

- epigraph surface
- IIS evaluation flows
- About surface
- SRC intake
- Measures of Inanna runtime
- routing contracts
- DB schema
- Phase Map
- institutional conversion logic
- existing evaluation systems

This OAR is hero-threshold reconstruction only.

---

# Files Expected

Likely affected:

- `src/measures_registry/MeasuresRegistryRuntime.tsx`
- hero surface components/styles
- motion/still transition handling
- responsive threshold layout styling

No unrelated refactors permitted.

---

# Validation

Confirm:

- full-screen split threshold renders correctly
- no header/footer visible
- left/right media seat correctly
- motion autoplay works
- motion settles to still state
- no looping occurs
- divide remains visible on mobile
- CTAs remain readable and actionable
- no opaque overlays exist
- no drift outside hero surface scope occurs

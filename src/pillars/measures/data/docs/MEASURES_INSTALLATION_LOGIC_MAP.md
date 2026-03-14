# Measures Installation Logic Map

Defines the installation behavior for the Measures pillar within the c3 Field.

This document maps encounter types, navigation resolution, media fallback rules,
and access-state behavior so that database, renderer, and governance logic align.

---

# Alignment with the c3 Model

Measures installation behavior follows the c3 model.

Connect → Contribute → Create

Connect  
Encounter and orientation without coercion.

Contribute  
Movement, navigation, passage, and relation between states.

Create  
Stabilized encounter form (gateplate realization).

---

# Core Measures Movement

Measures also follows the structural movement:

Descent → Recognition → Integration

Descent  
Threshold crossing.

Recognition  
Movement through passage and approach.

Integration  
Stabilized form at the gateplate encounter.

---

# Encounter Types

The Measures installation is composed of distinct encounter types.

These are not interchangeable.

## Epigraph Encounter

Purpose  
Initial threshold encounter.

Behavior
- Animated media transitions to still.
- Plaque text appears after delay.

Outcome
- Opens Kumurrah Passage.

---

## Kumurrah Passage

Purpose  
Primary transition from epigraph into gate sequence.

Behavior
- Transitional animation.
- Resolves to gateboard.

---

## Gateboard

Purpose  
Navigation surface for gate encounters.

Behavior
- Displays available gates.
- Routes to gate passage for selected gate.

---

## Gate Passage

Purpose  
Transition encounter between gateplates.

Behavior
- Plays transitional animation.
- Resolves to either:
  - open gateplate encounter
  - Connect invite (if sealed)

---

## Gateplate Encounter

Purpose  
Primary art encounter for each gate.

Behavior
- Animated media preferred.
- Still fallback available.
- Plaque text loads after delay.

Gateplate is the art encounter surface.

---

# Canonical Sequence

The Measures sequence is structured as:

Epigraph Encounter  
→ Kumurrah Passage  
→ Gateboard  
→ Gate Passage  
→ Gateplate Encounter  
→ Gate Passage  
→ Gateplate Encounter  
→ Gate Passage  
→ Gateplate Encounter  

Alternating rhythm:

Passage → Plate Encounter → Passage → Plate Encounter

---

# Passage Resolution Law

A passage resolves the next encounter state.

Possible outcomes:

1. Open Gateplate Encounter  
2. Sealed Connect Invite

A passage must never produce a blank or dead-end state.

---

# Access-State Law

Gateplates may be open or sealed.

Open plate  
Loads gateplate encounter.

Sealed plate  
Loads Connect invite.

This preserves continuity of the installation experience.

---

# Connect Invite Law

If a sealed gateplate is encountered after open artifacts:

Show Connect Invite.

Purpose
- maintain encounter continuity
- align with c3 Connect layer
- avoid dead-end navigation

---

# Navigation Law

Navigation operates on encounters.

Preferred navigation field:

next_encounter_slug

The next encounter may be:
- passage
- gateplate
- connect invite

---

# Media Law

Media assets may include:

animated media  
still media

Database defines the canonical media assets.

Renderer handles playback behavior.

---

# Media Fallback Law

1. Attempt animated media.
2. If animation fails, load still media.
3. If still fails, provide graceful fallback.

Fallback options:

- Continue to next sequence
- Return to temple

---

# Text Independence Law

Text must never block art.

Missing text may affect display but must not prevent:

- animation
- still media
- navigation

---

# Renderer Responsibility

Renderer handles:

- animation playback
- still fallback
- delayed plaque text
- encounter transitions
- fallback routing

---

# Bundle Hook Responsibility

Bundle hooks assemble data only.

They fetch:

- media unit
- text content
- aspects

They do not enforce encounter behavior.

---

# Installation Principle

Measures is a sequenced encounter system.

Core rhythm:

Threshold  
→ Passage  
→ Encounter  
→ Passage  
→ Encounter  

Access resolution:

Open encounter  
or  
Connect invite

Media resolution:

Animated  
→ Still fallback  
→ Graceful redirect
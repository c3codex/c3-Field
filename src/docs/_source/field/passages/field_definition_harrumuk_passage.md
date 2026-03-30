---
document_type: field_definition
authority_level: system
document_scope: harrumuk
title: Field Definition — Harrumuk Passage (Threshold Relation)
status: draft
version: v1
operator: op044
date: 2026-03-30
native_stack:
  codex: database
  field: schema
  measures: registry
  chazz: systems
tags:
  - field
  - harrumuk
  - passage
  - threshold
  - obsidian
  - antechamber
  - notchazz
source_alignment:
  - Seed Pattern Constraints — Chazz
  - MEASURES Installation Role
  - Seed Concordance
  - Field Definition — Antechamber Intake Surface
---

# Field Definition — Harrumuk Passage (Threshold Relation)

## Purpose

Seat Harrumuk in Field as the threshold relation that governs valid transition from intake to material.

Harrumuk is not a surface.
Harrumuk is not an encounter.
Harrumuk is not media.

Harrumuk is the relation that must be true for passage to occur.

## Field Role

Harrumuk resolves as:

- threshold crossing relation
- passage eligibility condition
- intake-to-material transition gate
- Obsidian entry resolver

Harrumuk does not resolve as:

- encounter surface
- animation
- Codex authority
- Measures registry
- UI behavior

## Structural Relations

Harrumuk must relate to:

- Antechamber as intake origin surface
- OAR1 as intake standing record
- SRC standing as intake classification
- Envelope as structured carrier
- envKey as continuity key
- NotChazz as passage validator
- Obsidian Chamber as destination material
- Epigraph as first encounter surface after entry

## Entry Dependency

Harrumuk may only be evaluated when:

- signal exists in Antechamber
- OAR1 is attached
- Envelope relation exists or is forming
- origin is valid (Named Individual or Institution in Service)

If these are not present:

? Harrumuk does not evaluate
? signal remains in Antechamber

## Passage Condition (Abstract)

Harrumuk resolves when:

- intake structure reaches minimum viable coherence
- relation across required dependencies is valid
- NotChazz does not detect violation

Harrumuk does not define how this is computed.
It defines that it must be true.

## Transition Rule

When Harrumuk resolves:

Antechamber ? Obsidian Chamber

No intermediate surface exists.

No direct transition to:

- Epigraph
- Phase Map
- Codex
- any encounter surface

## Material Binding

Harrumuk binds specifically to:

- Obsidian

Obsidian is:

- first material chamber
- threshold material
- reduction and constraint surface

No other material may be entered through Harrumuk.

## Encounter Constraint

No encounter may render before Harrumuk resolves.

This includes:

- Epigraph
- any surface
- any animation
- any UI state implying passage

Encounter is a result of passage, not a substitute for it.

## Failure State

If Harrumuk does not resolve:

- signal remains in Antechamber
- OAR1 persists
- correction path is required
- no forward motion occurs

No partial passage.
No simulated transition.

## Protection Relation

NotChazz must be able to:

- evaluate passage validity
- block invalid transition
- prevent bypass
- preserve structural integrity

Harrumuk is enforced through constraint, not preference.

## Success Condition

Harrumuk is properly seated in Field when:

- it governs transition from Antechamber to Obsidian
- it cannot be bypassed by UI or execution layer
- it does not expose internal logic
- it prevents encounter rendering prior to passage
- it maintains structural integrity across intake and material

## Closing

Harrumuk does not appear.

It resolves.

What appears after is encounter.

Codex holds.
Field structures.
Measures registers.
Chazz operates.
NotChazz protects.

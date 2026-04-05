---
document_type: registry_definition
authority_level: working
document_scope: registry
title: Registry Geometry
status: drafting
version: v1
operator: op044
date: 2026-04-01
native_stack:
  codex: database
  field: schema
  measures: registry
  chazz: systems
tags:
  - registry
  - geometry
  - circuit
  - relation
  - right-angle
  - orthocentric
  - working
source_alignment:
  - Session 4 Registry Identity Working
  - Field Definition — Antechamber Intake Surface
  - Seed Concordance
  - MEASURES Installation Role
---

# Registry Geometry

## Purpose

Define the geometric reading required for registry rows without collapsing identity, circuit, material, or chamber relation into one another.

Registry geometry exists to preserve:

- circuit relation
- right-angle directional standing
- orthocentric relational standing

It does not replace registry identity.
It does not replace locks.
It does not replace row-family docs.

## Scope

This doc defines the geometry layer for registry rows.

It applies to:

- system-known, non-planted spine rows
- planted Measures rows
- row formation rules where geometric standing must remain readable

This doc does not define:

- release state
- asset mapping
- Envelope instance logic
- envKey
- c3_key
- reveal conditions
- route logic
- family-specific row sets in full

## Native Distinction

Codex holds.
Field structures.
Measures registers.
Chazz executes.

Registry geometry must remain subordinate to that order.

Nothing in this doc defines authority outside Codex or structure outside Field.

## Circuit / Chamber / Material Distinction

c1, c2, and c3 resolve to circuit only.

Circuit identifies operational motion and relation.
Circuit does not define chamber.
Circuit does not define material.

Chamber or surface identifies structural or encounter context.
Material identifies embodied seat.

These may relate.
They may not collapse into one another.

## Institutional Readability Rule

Institutional readability may describe front-facing access-layer function.

It does not replace:

- native resolution
- circuit
- chamber
- material

Native resolution identifies what the row actually is.

## Geometry Columns

| column_name | purpose | required | value_type | notes |
|---|---|---|---|---|
| resolves_to_circuit | operational circuit relation of the row | yes | text | c1, c2, or c3 only |
| right_angle_directional | directional alignment of the row | yes | text | preserves orientation |
| orthocentric_relational | convergent relational standing of the row | yes | text | preserves resolved relation |

## Geometry Column Rule

A row is not fully formed by identity and family alone.

A row must also preserve:

- circuit relation
- directional standing
- relational convergence

## First Geometry Rule

A row is minimally geometry-valid when all of the following remain readable without collapse:

- resolves_to_native
- resolves_to_circuit
- material, if materially seated
- right_angle_directional
- orthocentric_relational

## Null Material Rule

A row may retain `material = null` when:

- it is structurally valid without embodied material seating
- assigning material would introduce premature inference
- its job is relational positioning rather than embodied seat declaration

This is permitted for relational positioning surfaces such as `phase_map` in the current first pass.

## Surface and Material Clarifications

Current seated clarifications for the working pass:

- Temple resolves as crystal
- Antechamber may use lapis as surface
- Phase Map remains null material
- role family and material seat remain distinct
- epithet rows may not be flattened to one family-wide material assignment

## Geometric Reading Rule

Circuit tells where a row operates.
Right-angle directional tells how it is oriented.
Orthocentric relational tells how it resolves.

None of these replace native identity.

## Geometric Completion Rule

A registry row is not geometry-complete by naming, family, and order alone.

It must preserve:

- native resolution
- circuit resolution
- material seat where present
- right-angle directional standing
- orthocentric relational standing

If any of these collapse, geometric reading is incomplete.

## Public Boundary Rule

Registry geometry may be:

- declared in Codex
- structured through Field
- registered in Measures
- executed through Chazz

Protected geometric logic may not be exposed as reconstructible public rule body, open routing tree, or client-side authority logic.

This doc defines readable registry geometry.
It does not expose protected systems intelligence.

## Working Spine Geometry Pass

| internal_key | resolves_to_native | resolves_to_circuit | material | right_angle_directional | orthocentric_relational | notes |
|---|---|---|---|---|---|---|
| temple | Temple | c1 | crystal | entry | holding | pre-intake arrival surface |
| antechamber | Antechamber | c1 | lapis | intake | forming | OAR1 origin surface and intake standing |
| harrumuk_passage | Harrumuk Passage | c1 | obsidian | threshold | crossing | threshold crossing from intake |
| obsidian_chamber | Obsidian Chamber | c2 | obsidian | bounded | containing | first bounded chamber context after passage |
| epigraph | Epigraph | c2 | obsidian | inscriptive | communicating | first bounded readable encounter surface |
| phase_map | Phase Map | c2 | null | positional | positioning | relational positioning surface |

## Working Gate Geometry Pass

| internal_key | resolves_to_native | resolves_to_circuit | material | right_angle_directional | orthocentric_relational | notes |
|---|---|---|---|---|---|---|
| gate_i | Gate I | c2 | obsidian | progressive | advancing | thresholded action through constraint |
| gate_ii | Gate II | c2 | obsidian | progressive | advancing | thresholded action through constraint |

## Validation Rule

This doc is valid for the current registry stack if it preserves all of the following:

- circuit stays distinct from chamber and material
- Temple remains crystal-seated
- Antechamber remains c1 intake-compatible and lapis-surfaced
- Phase Map remains materially null in first pass
- planted and non-planted rows may both carry geometry
- role family does not force material family
- row geometry can be read without relying on UI labels as authority

## Exclusion Rule

This doc does not require full count-body logic to be complete.

Pattern counts may be preserved elsewhere as supporting language if needed.
They are not the core validation spine of registry geometry.

## Current Standing

Registry geometry currently provides:

- row-level circuit reading
- row-level directional reading
- row-level relational reading
- null-material compatibility for relational surfaces
- separation of circuit from chamber and material

It does not yet provide:

- full epithet row geometry
- full ME row geometry
- family-specific validation surfaces beyond the initial spine and gate pass

## Next Relation

After this doc, row-family geometry should continue through:

- registry_rows_spine_v1.meta.md
- registry_rows_gates_v1.meta.md
- registry_rows_epithets_v1.meta.md
- registry_rows_mes_v1.meta.md

## Closing

Registry geometry does not invent relation.

It preserves the readable form of relation already seated through native order.

Codex holds.
Field structures.
Measures registers.
Chazz executes.

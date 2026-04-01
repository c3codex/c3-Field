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
  - Session 6 Carryover — Registry Source Stack Review
  - Seed Concordance
  - Field Definition — Antechamber Intake Surface
  - Seed Pattern Constraints — Chazz
---

# Registry Geometry

## Purpose

Define the geometric reading required for registry rows in the rewritten stack.

Registry geometry preserves:

- circuit relation
- right-angle directional standing
- orthocentric relational standing

This doc defines how a row is oriented and resolved.

It does not define:

- row identity shape
- freeze points
- structural validity conditions
- release state
- asset mapping
- chamber-directory content
- planted family content in full

## Scope

This doc applies to both:

- system-known, non-planted rows
- planted Measures rows

It provides the shared geometry layer used across:

- spine rows
- chamber directory rows
- gate rows
- epithet rows
- ME rows

This doc is geometry-bound.

It is not the row-family content surface itself.

## Native Distinction

Codex holds.
Field structures.
Measures registers.
Chazz executes.

Registry geometry remains subordinate to that order.

Nothing in this doc defines authority outside Codex or structure outside Field.

## Circuit / Chamber / Material Distinction

c1, c2, and c3 resolve to circuit only.

Circuit identifies operational motion and relation.
Circuit does not define chamber.
Circuit does not define material.

Chamber identifies structural or encounter context.
Material identifies embodied correspondence.

These may relate.
They may not collapse into one another.

## Conversion Relation

Conversion remains a completion standing.

It is not:

- chamber access
- phase visibility
- directory behavior
- material assignment

Registry geometry may support passage readability, but it does not redefine conversion.

## Material Correspondence Note

Material remains a correspondence layer, not a replacement language for circuit.

Current material clarifications:

- Temple = crystal
- Antechamber = lapis
- Obsidian Chamber = obsidian
- Harrumuk Passage = null material
- Phase Map = null material

Original oracle-card alignment remains:

- obsidian
- crystal
- marble

Lapis Lazuli is the 4th native material in the wider system and became properly seated once Temple was recognized as crystal.

This geometry doc acknowledges those correspondences where needed, but does not flatten role family into material family.

## Geometry Columns

| column_name | purpose | required | value_type | notes |
|---|---|---|---|---|
| resolves_to_circuit | operational circuit relation of the row | yes | text | c1, c2, or c3 only |
| right_angle_directional | directional alignment of the row | yes | text | preserves orientation |
| orthocentric_relational | convergent relational standing of the row | yes | text | preserves resolved relation |

## Geometry Rule

A row is not fully formed by name, family, and order alone.

A row must also preserve:

- circuit relation
- directional standing
- relational convergence

## First Geometry Rule

A row is minimally geometry-valid when all of the following remain readable without collapse:

- resolves_to_native
- resolves_to_circuit
- material, where materially seated
- right_angle_directional
- orthocentric_relational

## Null Material Rule

A row may retain `material = null` when:

- it is structurally valid without embodied material seating
- assigning material would introduce premature inference
- its job is directional, transitional, or relational rather than embodied

This applies in the current rewritten pass to:

- Harrumuk Passage
- Phase Map

Kumurrah Passage should also follow this rule when later introduced.

## Passage and Positioning Rule

Passage and positioning surfaces are stronger as directional / relational rows than as materially seated rows.

That means their geometric force is carried primarily through:

- circuit relation
- right-angle directional standing
- orthocentric relational standing
- functional use

rather than through material assignment.

## Antechamber Relation

Antechamber remains the first executable intake surface, OAR1 origin surface, and passage-readiness structuring surface. It may hold incomplete signal and communicate systems standing, but may not pass incomplete signal. Harrumuk remains the next threshold surface from Antechamber into Obsidian Chamber.

## Current Bounded Spine Geometry Pass

For the current source pass, the spine remains bounded from arrival through Phase Map.

| internal_key | resolves_to_native | resolves_to_circuit | material | right_angle_directional | orthocentric_relational | notes |
|---|---|---|---|---|---|---|
| temple | Temple | c1 | crystal | entry | holding | pre-intake arrival surface |
| antechamber | Antechamber | c1 | lapis | intake | forming | intake, OAR1 origin, systems communication/control |
| harrumuk_passage | Harrumuk Passage | c1 | null | threshold | crossing | threshold movement from intake toward bounded encounter |
| obsidian_chamber | Obsidian Chamber | c2 | obsidian | bounded | containing | first bounded chamber context after passage |
| phase_map | Phase Map | c2 | null | positional | positioning | release visibility and relational positioning surface |

## Current Planted Geometry Note

This doc does not fully seat planted families, but it must remain compatible with them.

Minimum planted-family geometry compatibility:

- gates preserve thresholded action through bounded progression
- epithets preserve role-seated relation without material collapse
- MEs preserve function-seated relation

Full planted-family geometry belongs in the row-family docs.

## Public Boundary Rule

Registry geometry may be:

- declared in Codex
- structured through Field
- registered in Measures
- executed through Chazz

But protected geometric logic may not be exposed as reconstructible public rule body, open routing tree, or client-side authority logic. Geometry may be readable without exposing protected systems intelligence.

## Validation Rule

This doc is valid for the rewritten stack if it preserves all of the following:

- circuit stays distinct from chamber and material
- conversion stays distinct from access and directory behavior
- Temple remains crystal-seated
- Antechamber remains lapis-seated
- Harrumuk Passage remains null-material
- Phase Map remains null-material
- passage and positioning rows may carry geometry without embodied material seating
- original oracle-card alignment is preserved without flattening the wider material system

## Current Standing

Registry geometry currently provides:

- row-level circuit reading
- row-level directional reading
- row-level relational reading
- null-material compatibility for passage and positioning surfaces
- separation of circuit from chamber and material
- compatibility with the rewritten material clarifications

It does not yet provide:

- full chamber-directory geometry
- full gate-family geometry
- full epithet-family geometry
- full ME-family geometry

## Next Relation

This doc must remain paired with:

- `registry_identity_shape_v1.meta.md`
- `registry_constraints_v1.meta.md`
- `registry_locks_v1.meta.md`
- `registry_rows_spine_v1.meta.md`
- `registry_rows_chamber_directories_v1.meta.md`
- `registry_rows_gates_v1.meta.md`
- `registry_rows_epithets_v1.meta.md`
- `registry_rows_mes_v1.meta.md`

## Closing

Registry geometry does not invent relation.

It preserves the readable form of relation already seated through native order.

Codex holds.
Field structures.
Measures registers.
Chazz executes.

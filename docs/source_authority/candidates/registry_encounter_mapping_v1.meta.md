---
document_type: registry_definition
authority_level: working
document_scope: registry
title: Registry Encounter Mapping
status: drafting
version: v1
operator: op044
date: 2026-04-04
native_stack:
  codex: database
  field: schema
  measures: registry
  chazz: systems
tags:
  - registry
  - encounter
  - mapping
  - chamberplate
  - readability
  - working
source_alignment:
  - Session OAR — Source Refresh and Next Focus
  - Registry Constraints
  - Registry Identity Shape
  - Registry Geometry
  - Registry Locks
  - Registry Rows Spine
  - Registry Rows Chamber Directories
  - Registry Rows Gates
  - Registry Rows Epithets
  - Registry Rows MEs
  - Seed Concordance
  - MEASURES Installation Role
---

# Registry Encounter Mapping

## Purpose

Define the current registry-side mapping between row families and encounter surfaces.

This doc seats the encounter-mapping layer needed to keep row identity, chamber-local readability, and encounter destination from collapsing into each other.

Registry encounter mapping preserves:

- row-family distinction
- chamberplate distinction
- readability vs encounter distinction
- route-bearing continuity without planted collapse

This doc is a registry definition.
It does not define frontend implementation in full.

## Scope

This doc defines:

- current row-family to encounter-surface relation
- current chamberplate distinction
- current route and pass-through meanings
- family-safe encounter boundaries

This doc does not define:

- final frontend component structure
- asset mapping logic
- release-state tables in full
- downstream Kumurrah sequencing in full

## Native Distinction

Codex holds.  
Field structures.  
Measures registers.  
Chazz executes.

Encounter mapping remains subordinate to that order.

A mapped encounter path does not define truth.
A mapped encounter path does not replace row identity.

## Distinction Chain

The current encounter mapping must preserve:

- row does not equal encounter
- chamber directory does not equal chamberplate
- chamberplate does not equal planted row identity
- route does not equal completion
- readability does not equal conversion

If those distinctions collapse, the encounter-mapping layer is invalid.

## Current Mapping Table

| row_family | primary function | valid surface relation | encounter mode | may route toward | may not replace |
|---|---|---|---|---|---|
| spine | structural sequence | structural surface | orient | chamber_directory, phase_map, downstream passage | planted unit identity |
| chamber_directory | chamber-local readability | directory surface | read + route | chamberplate | planted gate, epithet, or ME seating |
| gate | thresholded planted progression | chamberplate or pass-through relation | encounter or pass-through | downstream gate, chamberplate, release path | directory readability |
| epithet | role-bearing planted unit | chamberplate relation | encounter readability | chamberplate, chamber-local contextual route | chamber directory |
| me | function-bearing planted unit | chamberplate relation | encounter readability | chamberplate, chamber-local contextual route | chamber directory |

## Chamberplate Rule

Chamberplate is an encounter destination surface.

Chamberplate may:

- receive route from chamber-directory rows
- hold encounter readability for planted rows
- support gate progression or pass-through where seated

Chamberplate may not:

- replace planted row identity
- collapse gate, epithet, and ME distinctions
- redefine conversion

## Spine Mapping Rule

Spine rows remain structural.

They may:

- orient sequence
- preserve bounded path
- expose structural position

They may not:

- stand in for planted encounter
- stand in for chamber-directory readability
- stand in for chamberplate

## Chamber-Directory Mapping Rule

Chamber-directory rows remain chamber-local readability surfaces.

They may:

- communicate chamber-local standing
- communicate release-relevant viewability
- route toward chamberplate

They may not:

- replace planted unit identity
- replace chamberplate
- define conversion completion

## Gate Mapping Rule

Gate rows remain thresholded planted units.

Gate rows may:

- resolve to chamberplate as encounter destination
- preserve pass-through relation where seated
- retain thresholded progression standing

Gate rows may not:

- collapse into directory readability
- replace chamberplate as surface distinction
- replace epithet or ME families

## Epithet Mapping Rule

Epithet rows remain role-bearing planted units.

Epithet rows may:

- appear through chamberplate encounter readability
- be contextualized by chamber-directory presence
- retain role-seated identity while encountered through a surface

Epithet rows may not:

- collapse into directory row identity
- collapse into gate identity
- collapse into ME identity

## ME Mapping Rule

ME rows remain function-bearing planted units.

ME rows may:

- appear through chamberplate encounter readability
- be contextualized by chamber-directory presence
- retain function-seated identity while encountered through a surface

ME rows may not:

- collapse into directory row identity
- collapse into gate identity
- collapse into epithet identity

## Current Bounded Mapping Note

In the current bounded pass:

- Antechamber Directory communicates intake standing and systems standing
- Obsidian Directory communicates chamber-local standing and route toward chamberplate
- Phase Map remains a positioning surface, not chamberplate
- chamberplate remains downstream from chamber-directory readability and distinct from planted identity

## Validation Rule

This doc is valid for the rewritten stack if it preserves all of the following:

- row-family to surface distinction
- chamber-directory distinct from chamberplate
- chamberplate distinct from planted row identity
- planted family distinctions preserved in encounter
- route distinct from completion
- readability distinct from conversion

## Current Standing

Registry encounter mapping currently provides:

- the missing mapping layer between row families and encounter surfaces
- chamberplate distinction
- route-bearing continuity without row-family collapse
- bounded encounter logic for the current rewritten pass

It does not yet provide:

- final frontend render map
- asset-specific encounter logic
- downstream Kumurrah encounter relation
- family-specific encounter matrices by row

## Next Relation

This doc must remain paired with:

- `registry_constraints_v1.meta.md`
- `registry_identity_shape_v1.meta.md`
- `registry_geometry_v1.meta.md`
- `registry_locks_v1.meta.md`
- `registry_rows_spine_v1.meta.md`
- `registry_rows_chamber_directories_v1.meta.md`
- `registry_rows_gates_v1.meta.md`
- `registry_rows_epithets_v1.meta.md`
- `registry_rows_mes_v1.meta.md`
- `registry_release_states_v1.meta.md`

## Closing

Encounter mapping keeps the registry from collapsing its own surfaces.

Rows remain rows.
Directories remain directories.
Chamberplate remains encounter surface.

Codex holds.  
Field structures.  
Measures registers.  
Chazz executes.

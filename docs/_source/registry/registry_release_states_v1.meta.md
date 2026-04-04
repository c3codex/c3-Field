---
document_type: registry_definition
authority_level: working
document_scope: registry
title: Registry Release States
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
  - release-states
  - phase
  - visibility
  - reveal
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

# Registry Release States

## Purpose

Define the current release-state logic for the rewritten registry source stack.

This doc seats the release-state layer that the current registry set repeatedly names but does not yet define.

Registry release states preserve:

- distinction between visibility and conversion
- distinction between readability and planted-unit reveal
- deterministic reveal standing
- family-safe phase and dependency relation

This doc is a registry definition.
It is not a phase-calendar implementation.
It is not asset mapping.

## Scope

This doc defines:

- the current release-state set
- release-state meanings
- family applicability boundaries
- visibility and reveal distinctions
- dependency relation at the registry layer

This doc does not define:

- database schema
- exact phase-anchor implementation
- asset mapping logic
- encounter routing in full
- conversion completion logic

## Native Distinction

Codex holds.  
Field structures.  
Measures registers.  
Chazz executes.

Release states remain subordinate to that order.

A release state does not define truth.
A release state does not define conversion.
A release state defines current reveal standing only.

## Current Release-State Set

The current registry release-state set is:

- unavailable
- sealed
- held
- dependent
- open
- released

These states preserve readable standing without collapsing everything into one flat visible / invisible split.

## Release-State Meanings

### unavailable

The row is not presently available for view, route, or encounter in the current standing.

Unavailable may reflect:

- bounded pass exclusion
- unseated downstream relation
- intentionally absent readiness

### sealed

The row is registered but not presently revealable.

Sealed preserves existence without granting viewability or encounter.

### held

The row is registered but intentionally paused from reveal.

Held is not the same as absent.
Held is not the same as failed.
Held preserves a bounded pause.

### dependent

The row is registered but waiting on an upstream condition.

Dependency may include:

- prior row release
- family-specific progression
- phase relation
- chamber-local readiness

### open

The row is presently viewable or readable within its valid current surface.

Open does not by itself mean final encounter reveal.
Open does not by itself mean conversion completion.

### released

The row is reveal-cleared for its valid current encounter path.

Released means the registered path may proceed.
Released does not redefine conversion standing.

## Family Applicability Rule

Release-state meaning must preserve family distinction.

### Spine Family

Spine rows may use release states to indicate bounded structural standing and visibility.
They may not use release state to imply planted completion.

### Chamber-Directory Family

Chamber-directory rows may use release states to indicate chamber-local readability and route availability.
They may not use release state to redefine planted-unit identity.

### Gate Family

Gate rows may use release states to indicate thresholded progression and reveal standing.
Gate release does not replace chamberplate distinction.

### Epithet Family

Epithet rows may use release states to indicate role-unit reveal standing.
Release state does not collapse epithet identity into directory readability.

### ME Family

ME rows may use release states to indicate function-unit reveal standing.
Release state does not collapse ME identity into directory readability.

## Distinction Rule

Release states must preserve the following distinctions:

- visibility is not conversion
- open is not necessarily released
- released is not necessarily completed conversion
- directory readability is not planted-unit reveal
- planted-unit reveal is not chamberplate identity
- phase visibility is not authority

If those distinctions collapse, the release-state layer is invalid.

## Current Minimal Usage Guidance

The current minimal usage guidance is:

| row_family | available states | notes |
|---|---|---|
| spine | unavailable, sealed, held, dependent, open | structural standing only |
| chamber_directory | unavailable, sealed, held, dependent, open, released | chamber-local readability and route only |
| gate | sealed, held, dependent, open, released | thresholded planted progression |
| epithet | sealed, held, dependent, open, released | role-bearing planted reveal |
| me | sealed, held, dependent, open, released | function-bearing planted reveal |

## Phase Relation Note

Phase calendar and phase state may expose unlock visibility.

That visibility remains a reveal condition only.

It may not be used to silently infer:

- conversion standing
- planted identity
- final encounter completion

## Validation Rule

This doc is valid for the rewritten stack if it preserves all of the following:

- a seated release-state set
- distinction between visibility and conversion
- distinction between directory readability and planted reveal
- family-safe applicability boundaries
- dependency standing distinct from absence
- open distinct from released
- released distinct from conversion completion

## Current Standing

Registry release states currently provide:

- the missing release-state surface named by the current registry docs
- a deterministic current reveal-standing set
- family-specific applicability boundaries
- non-collapse between visibility, readability, reveal, and conversion

It does not yet provide:

- row-by-row release-state tables
- database field mapping
- asset readiness logic
- final encounter-routing logic

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
- `registry_encounter_mapping_v1.meta.md`

## Closing

Release states define current reveal standing.

They do not redefine truth, role, or conversion.

Codex holds.  
Field structures.  
Measures registers.  
Chazz executes.

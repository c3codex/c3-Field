---
document_type: architecture_contract
authority_level: working
document_scope: measures_interoperability
title: Measures Registry — Temple Path Contract v1
status: seated
version: v1
operator: op044
date: 2026-05-27
source_oar2: docs/oar/measures_interoperability/oar2_governed_measures_registry_isomorphic_architecture_contract_seating_v1.meta.md
native_stack:
  codex: database
  field: schema
  measures: registry
  oar2: observed_aligned_routed
  chazz: systems
  cody: executor
  src: renderer
tags:
  - architecture-contract
  - measures-registry
  - temple
  - path-choice
  - isomorphic
  - codexstone
material: none
chamber_position: branch-point
path_position: post-epigraph
---

# Measures Registry — Temple Path Contract v1

## Contract Purpose

The Temple is the path choice surface.

The visitor arrives at the Temple from the Epigraph and selects one of two rendered installation paths.

The Temple does not carry chamber authority.

The Temple branches.

## Runtime Anchor

| Field | Value |
|---|---|
| DB encounter_key | `landing_path_choice` / `evaluate_structure_path` (aliased in runtime) |
| Surface state | `path_choice` |
| Routing constant | `REGISTERED_KEY_TO_SURFACE["evaluate_structure_path"] = "path_choice"` |
| Media role | `path_choice_background` |

## Path Definitions

### Left Path — Assess the Environment

The visitor wants to understand their AI operational environment.

They enter the Lapis Relational Passage, proceed through the Crystal/Lapis c3 MAP Chamber, continue through the Obsidian Assessment Gate, and arrive at the Marble Commerced Circuit.

Path sequence:

```
Lapis Relational Passage
  → Crystal/Lapis c3 MAP Chamber
  → Obsidian Assessment Gate
  → Marble Commerced Circuit Chamber
```

### Right Path — Structure the Environment

The visitor is ready to build or govern their environment.

They enter the Media Passage, proceed through the Marble Governance Chamber, continue through the Lapis Interoperability Route, and reach implementation, cohort, or conversion continuation.

Path sequence:

```
Media Passage
  → Marble Governance Chamber
  → Lapis Interoperability Route
  → implementation / cohort / conversion continuation
```

## Temple Authority Boundary

The Temple does not carry:

- Assessment authority (that belongs to the Obsidian Assessment Gate)
- Commerce authority (that belongs to the Marble Commerced Circuit)
- Governance authority (that belongs to the Marble Governance Chamber)
- Interoperability authority (that belongs to the Lapis Interoperability Route)

The Temple presents the paths and routes. That is its complete function.

## Material Assignment

The Temple is pre-material — positioned between the Epigraph and the first chambered surface.

The `path_choice_background` media role provides visual orientation without asserting material binding.

## Path Labels

| Path | Label | Material Orientation |
|---|---|---|
| Left | Assess the Environment | Lapis entry, Obsidian gate, Marble commerce |
| Right | Structure the Environment | Media passage, Marble governance, Lapis interoperability |

## What the Temple Must Not Do

- Execute assessment
- Display pricing or commerce
- Carry intake forms
- Claim authority over any chamber
- Merge paths into a single track
- Route directly to reserve_seat or phase_payment without chamber passage

## Continuation

Left path → Lapis Relational Passage

Right path → Media Passage

## Boundary

This contract governs path presentation and routing authority only.

Runtime implementation is a separate OAR2.

No media, CSS, or DB mutation is authorized by this contract.

## Close

The Temple branches.

It does not hold.

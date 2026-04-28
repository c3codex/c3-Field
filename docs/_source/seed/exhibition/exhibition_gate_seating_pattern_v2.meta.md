---
document_type: exhibition_schema_spec
authority_level: working
document_scope: exhibition
title: Exhibition Gate Seating Pattern
status: complete
version: v2
operator: op044
date: 2026-04-09
native_stack:
  codex: database
  field: schema
  measures: registry
  chazz: systems
tags:
  - exhibition
  - gates
  - obsidian
  - phase-map
  - seating
---

# Exhibition Gate Seating Pattern

## Purpose

Define the seating pattern for the 7 Obsidian Chamber exhibition gates using the confirmed Measures schema key.

## 1. Scope

Applies to:
- Gate 1 through Gate 7
- the original descent sequence of Inanna
- exhibition context in Obsidian Chamber

Shared standing:
- registry_family = gate
- material_family = obsidian
- parent = Obsidian Chamber
- dependency = Phase Map
- no ME attachment
- no epithet attachment
- no envelope usage

Pattern correspondence to the 7 Constraints / 21 of Coherence is acknowledged but not structurally bound.

## 2. Schema-aligned seating

### A. Registry surface
Each gate is seated in measures_registry.

Registry carries:
- gate identity
- gate title
- gate family
- material family
- sequence order
- parent relation to Obsidian Chamber
- dependency relation to Phase Map
- bounded metadata

### B. Release surface
Each gate's current standing is seated in measures_release_state.

### C. Phase surface
Phase standing is referenced through measures_phase_calendar as keyed schedule standing.

### D. Encounter surface
measures_encounter_def exists as a one-to-one encounter definition surface when needed.

Current exhibition standing:
- gates are assumed to share encounter pattern
- no gate-specific encounter_def seating is required yet

### E. Transition surface
measures_transition_rule exists for bounded progression/return/release logic, but it is not the primary seating surface for these exhibition gates.

## 3. Confirmed relation model

### Parent relation
All 7 exhibition gates seat under Obsidian Chamber.

### Dependency relation
All 7 exhibition gates depend only on Phase Map.

### Explicit non-dependency
The gates do not currently use:
- gate-to-gate dependency
- ME dependency
- epithet dependency

## 4. Current gate standing

### Released
- Gate 1
- Gate 2

### Locked / gated
- Gate 3
- Gate 4
- Gate 5
- Gate 6
- Gate 7

Important distinction:
- Gate 3 has upcoming phase context, but no active release seating yet
- Gate 4–7 share the same current locked/gated standing

## 5. No-envelope rule

For exhibition gates:
- envelope_id remains null
- no SRC standing enters registry
- no intake artifact enters gate seating

## 6. Attachment standing

The following are explicitly unresolved:
- direct Chamber of Epithets attachment
- direct ME attachment

## 7. Structural boundaries

This seating pattern confirms:
- registry seats gate identity and relation
- release_state seats live standing
- phase_calendar seats keyed phase standing
- Obsidian Chamber is the parent seat
- Phase Map is the only dependency seat
- envelope use is excluded
- ME and epithet seating remain unresolved

## 8. Result

The exhibition gates now have a schema-aligned seating pattern that can be referenced without repeating table archaeology.

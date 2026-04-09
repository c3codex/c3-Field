---
document_type: exhibition_release_spec
authority_level: working
document_scope: exhibition
title: Exhibition Gate Release Standing Spec
status: complete
version: v1
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
  - release
  - standing
  - phase-map
---

# Exhibition Gate Release Standing Spec

## Purpose

Define exactly how the 7 Obsidian Chamber exhibition gates seat in measures_release_state, using confirmed schema and current standing.

## 1. Target surface
All live gate standing is seated in measures_release_state.

## 2. Release-state structure
Each gate has one row:
- registry_id
- release_state
- access_state
- release_reason
- access_reason
- phase_label
- release_at
- sealed_at
- effective_at
- metadata

## 3. Current gate standing (authoritative)

### Released
#### Gate 1
- release_state = released
- access_state = visible

#### Gate 2
- release_state = released
- access_state = visible

### Locked / gated
#### Gate 3
- release_state = held
- access_state = gated

#### Gate 4
- release_state = held
- access_state = gated

#### Gate 5
- release_state = held
- access_state = gated

#### Gate 6
- release_state = held
- access_state = gated

#### Gate 7
- release_state = held
- access_state = gated

## 4. Release reason usage

### Released gates (Gate 1–2)
release_reason may include:
- phase_release
- ritual_release
- confirmed_release

### Locked/gated gates (Gate 3–7)
Recommended working value:
- release_reason = held_by_phase_map

## 5. Access reason usage

### Released gates
- access_reason = released

### Locked/gated gates
- access_reason = gated_by_phase_map

## 6. Phase label usage

Critical distinction:
- phase context ≠ release state

Rules:
- Gate 1–2: may include phase_label if already seated in release history
- Gate 3: do not set phase_label yet
- Gate 4–7: phase_label = null

## 7. Timestamp usage

### Released gates
- release_at = actual seated release timestamp if known
- effective_at = same as release or system timestamp

### Locked/gated gates
- sealed_at may be set if historically meaningful
- otherwise leave timestamps null

Do not invent future timestamps.

## 8. Metadata boundaries

Metadata may include:
- exhibition designation
- gate family reference
- dependency note (Phase Map)
- internal notes for sequencing

Metadata must not include:
- speculative release timing
- ME or epithet mapping
- intake/envelope behavior
- frontend logic

## 9. Structural integrity rules

This release standing spec enforces:
- live truth lives in measures_release_state
- registry baseline is not overridden blindly
- phase schedule does not override current state
- dependency is expressed through reason, not fake release
- one row per gate, no duplication

## 10. Result

All 7 exhibition gates now have a fully defined release standing model:
- Gate 1–2 -> released, visible
- Gate 3–7 -> held, gated, dependent on Phase Map

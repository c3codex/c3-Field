---
document_type: schema_key
authority_level: working
document_scope: measures_schema
title: Measures Schema Key — Current Implementation Notes
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
  - schema-key
  - measures
  - implementation
  - obsidian-chamber
  - phase-map
  - ant-residue
---

# Measures Schema Key — Current Implementation Notes

## Purpose

Capture the actual current implementation standing of the Measures schema as observed through live data.

## 1. Confirmed Seated Registry Units

### A. Obsidian Chamber
- exists in measures_registry
- serves as parent surface for exhibition gates

### B. Phase Map
- exists in measures_registry
- serves as dependency surface for reveal

These are live seated units and must be referenced via FK.

## 2. Confirmed Relation Pattern in Use

### Parent pattern
unit -> parent_registry_id -> chamber

### Dependency pattern
unit -> depends_on_registry_id -> phase_map

## 3. Confirmed Release Pattern in Use

The system currently uses:

### A. Registry (baseline)
- identity + baseline standing

### B. Release State (live)
- current release/access truth

registry = identity + baseline
release_state = current truth

## 4. Confirmed Phase Pattern in Use

Observed behavior:
- registry rows may include phase_label
- release_state rows may include phase_label
- metadata may reference phase_schedule_key
- phase_calendar holds anchor + sequence truth

phase = keyed relation
not structural FK relation

## 5. Confirmed Encounter Pattern in Use

- measures_encounter_def.registry_id is unique
- not all registry rows require encounter defs
- when seated, it is one per registry row

## 6. Confirmed Transition Pattern in Use

- transition_rule is a conditional logic layer
- not primary identity or state structure

## 7. The Ant Colony (Confirmed Residue)

### A. envelope_id in registry
- FK exists to ant_envelope

### B. Implication
This does not mean registry is an intake surface.

### C. Current handling rule
For exhibition gates:
- envelope_id = null

## 8. Confirmed Working Pattern (Safe Build Zone)

### Registry
- seat unit identity
- assign parent
- assign dependency
- assign sequence
- assign material
- assign family

### Release State
- seat current standing
- define gated / released
- attach reasons and timing

### Phase Calendar
- reference phase by key
- do not attach by FK

### Encounter Def
- add only if structurally required

### Transition Rule
- add only if progression logic requires it

## 9. Exhibition Gate Application (Pre-Seating)

Gates will:
- seat in measures_registry
- parent -> obsidian_chamber
- depend on -> phase_map
- material -> obsidian
- family -> gate

Release pattern:
- Gate 1–2 -> released / visible
- Gate 3–7 -> held / gated

No seating yet for:
- MEs
- epithets
- envelopes
- custom transition rules

## 10. What Is Now Eliminated

With this doc set in place, we no longer need to:
- re-query schema for known tables
- guess column names
- invent dependency fields
- speculate on release structure

This becomes the reference surface for downstream seating work.

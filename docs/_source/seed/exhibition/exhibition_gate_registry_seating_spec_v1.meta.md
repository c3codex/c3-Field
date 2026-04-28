---
document_type: exhibition_registry_spec
authority_level: working
document_scope: exhibition
title: Exhibition Gate Registry Seating Spec
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
  - registry
  - obsidian
  - phase-map
---

# Exhibition Gate Registry Seating Spec

## Purpose

Define exactly how the 7 Obsidian Chamber exhibition gates seat in measures_registry, using only confirmed live columns and bounded values.

## 1. Target surface
All 7 exhibition gates seat in measures_registry.

## 2. Required registry fields for exhibition gates
- registry_key
- display_title
- registry_family
- encounter_type
- material_family
- sequence_order
- release_state
- access_state
- parent_registry_id
- depends_on_registry_id
- is_active
- metadata

## 3. Required values for all 7 gates

### A. Family
- registry_family = gate

### B. Material
- material_family = obsidian

### C. Active standing
- is_active = true

### D. Parent relation
- parent_registry_id = <id of obsidian_chamber>

### E. Dependency relation
- depends_on_registry_id = <id of phase_map>

## 4. Encounter type standing
Current working seat:
- encounter_type = gate

## 5. Sequence standing
- Gate 1 -> 1
- Gate 2 -> 2
- Gate 3 -> 3
- Gate 4 -> 4
- Gate 5 -> 5
- Gate 6 -> 6
- Gate 7 -> 7

## 6. Registry release/access standing

### Released gates
Gate 1 and Gate 2:
- release_state = released
- access_state = visible

### Locked/gated gates
Gate 3–7:
- release_state = held
- access_state = gated

## 7. Phase label standing
- do not force phase_label into every gate registry row
- use phase_label only where explicitly seated

## 8. Null rules
For exhibition gate registry rows:
- envelope_id = null

## 9. Metadata boundaries

Metadata may include:
- exhibition designation
- descent-family note
- pattern-correspondence note
- unresolved attachment notes

Metadata must not include:
- live release/access truth that belongs in measures_release_state
- intake/SRC/envelope behavior
- speculative ME assignments
- speculative epithet assignments

## 10. Gate-specific identity values

### Gate 1
- registry_key = gate_1_crown_removed
- display_title = Inanna’s Crown Removed

### Gate 2
- registry_key = gate_2_lapis_beads
- display_title = Lapis Beads of Beauty

### Gate 3
- registry_key = gate_3_lapis_necklace
- display_title = Lapis Necklace of Wealth

### Gate 4
- registry_key = gate_4_breastplate
- display_title = Breastplate of Divine Protection

### Gate 5
- registry_key = gate_5_measuring_rod
- display_title = Measuring Rod of Divine Order

### Gate 6
- registry_key = gate_6_golden_bracelet
- display_title = Golden Bracelet of Reverence

### Gate 7
- registry_key = gate_7_robe
- display_title = Robe of Divine Purpose

---
document_type: implementation_manifest
authority_level: working
document_scope: frontend_encounter
title: DB to src Manifest — Measures of Inanna Exhibition
status: working
version: v1
operator: op044
date: 2026-04-23
native_stack:
  codex: database
  field: schema
  measures: registry
  chazz: systems
tags:
  - frontend
  - src
  - manifest
  - exhibition
  - encounter
  - measures_of_inanna
source_alignment:
  - Seed Concordance
  - The 21 of Coherence
  - Frontend Encounter Alignment Contract
  - Measures Schema Key — Current Implementation Notes
  - Measures Schema Key — Column + Constraint Map
---

# DB → `src` Manifest
## Measures of Inanna Exhibition
## Scope: encounter-side frontend wiring only

## Purpose

Define exactly how `src` should render the exhibition from DB-seated state without inventing routing, semantics, or fallback truth.

Frontend is not a second author.  
It renders seated encounter state only.

---

## 1. Authority Order

### DB authority surfaces
- `measures_registry` = stable identity
- `measures_release_state` = live standing
- `measures_encounter_def` = encounter-side structural behavior
- `measures_transition_rule` = navigation / return logic

### `src` role
`src` is encounter-side operational staging after passage has resolved.  
It is not interchangeable with `SRC`, `SRC1`, or `SRC2`.

### Frontend rule
Frontend reads contract surfaces and renders what is seated.

Frontend must not:
- invent missing actions
- compress distinct reveal bodies
- infer meaning from absence

---

## 2. Manifest traversal spine

`src` must be able to resolve this exhibition path:

```text
epigraph
  → crystal_temple_home
    ↔ inanna_seat
  → temple_antechamber
    → temple_harrumuk_passage
      → phase_map
        → kumurrah_passage
          → gate_1 entry
          → epithet_1 entry
          → codexstone entry
          
---
document_type: system_intelligence_capture
authority_level: working
document_scope: session_recovery
title: Session 12 — System Intelligence Capture
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
  - intel_recovery
  - session12
  - exhibition
  - gates
  - temple
  - cadence
  - phase
---

# Session 12 — System Intelligence Capture

## 1. Session Scope

Session 12 established the exhibition gate system as a valid Measures installation layer by seating the 7 Obsidian Gates across registry, live release standing, and encounter definition. It also created the schema key set as an active reference surface, then clarified the structural distinction between phase release and exhibition cadence, producing the carryforward seam now named Temple Architectural Structural Integrity.

## 2. Recovered System Intelligence

- Exhibition gates must be treated as their own structural family and must not be prematurely attached to MEs or Epithets.
- The descent gates are best understood as the mechanism by which pattern is carried into lived memory, rather than as identity surfaces themselves.
- For exhibition logic, `phase release` and `continuance cadence` are distinct:
  - phase anchor opens chamber standing
  - cadence governs movement within and between active chambers
- Exhibition continuance should begin with the chamber released first by anchored phase standing, then continue to the next released chamber in chamber order.
- Chamber order remains structurally:
  - 7
  - 9
  - 13
- Internal chamber traversal remains sequential within chamber once chamber standing is active.
- Inter-chamber movement must use Kumurrah Passage as the repeated passage unit.
- SRC2 contributions align to the Temple but do not define it.
- Temple structural completion must occur before SRC2 formation opens.
- A seeded schema key is required as reusable source surface so repeated schema checks do not govern future DB work.
- The correct live split in Measures is:
  - registry = identity/baseline
  - release_state = live standing
  - encounter_def = encounter structure
  - transition_rule = optional logic only if progression requires it

## 3. Structural Changes

### Decided
- 7 exhibition gates belong under Obsidian Chamber
- all 7 depend on Phase Map
- exhibition gates use no envelope linkage
- Gate 1–2 released / visible
- Gate 3–7 held / gated
- gate encounter surface type = threshold
- chamber continuance is not driven by mixed unit-level phase timing
- chamber continuance is driven by released chamber standing and sequential cadence inside chamber

### Drafted
- Temple Architectural Structural Integrity as the next carryover block
- chamber-order continuance using:
  - Obsidian
  - Marble
  - Epithets
- Kumurrah Passage as reusable inter-chamber passage
- Marble Chamber display-title rename requirement

### Written
- schema key surface roles doc
- schema key column + constraint map
- schema key current implementation notes
- exhibition gate seating pattern
- exhibition gate registry seating spec
- exhibition gate release standing spec
- session 12 OAR2
- this system intelligence capture

### Committed
- schema key doc set
- exhibition gate doc set

### Bucketed
- schema key doc set
- exhibition gate doc set
- seeded to private measures-seed bucket

### Still Unresolved
- direct attachment logic for Chamber of Epithets
- direct attachment logic for MEs
- whether transition rules are needed between chamber encounters
- release-surface / view exposure across the full installation
- Marble Chamber final display identity
- Kumurrah Passage registry/transition treatment between chambers
- SRC2 intake structure and envelope relation after Temple structural completion

## 4. SQL / Registry Impact

- `measures_registry` now seats all 7 exhibition gates as live units under `obsidian_chamber`
- `depends_on_registry_id` for all 7 gates resolves to `phase_map`
- `measures_release_state` now carries the live reveal standing for all 7 gates
- `measures_encounter_def` now carries one threshold encounter row per gate
- no `envelope_id` usage was introduced for exhibition gates
- no ME or Epithet attachment was seated
- no transition rules were seated yet
- future SQL must resolve:
  - chamber-to-chamber continuance
  - Kumurrah Passage reuse
  - Marble chamber seating/display naming
  - release/read view validation for whole-installation exposure

## 5. Carryforward Frame

Open Session 13 with:

Temple Architectural Structural Integrity

Resolve:
- released-first chamber continuance
- sequential cadence inside active chamber
- Kumurrah Passage between chambers
- Marble Chamber standing and display naming
- Chamber of Epithets continuance
- transition-rule necessity
- release-surface / view integrity

Do not open SRC2 until Temple structural continuity is complete.

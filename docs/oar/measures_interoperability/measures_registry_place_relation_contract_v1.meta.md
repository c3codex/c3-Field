---
document_type: architecture_contract
authority_level: working
document_scope: measures_interoperability
title: Measures Registry — Place Relation Contract v1
status: seated
version: v1
operator: op044
date: 2026-05-28
source_oar2: docs/oar/measures_interoperability/oar2_measures_registry_second_layer_geometry_contract_seating_v1.meta.md
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
  - place-relation
  - second-layer-geometry
  - adjacency
  - dependency
  - isomorphic
  - return-routes
  - conversion
  - codexstone
layer: second
---

# Measures Registry — Place Relation Contract v1

## Contract Purpose

The Place Relation Contract defines how material places relate within the Measures Registry installation: adjacency, dependency, isomorphic mirror, return routes, and conversion relation.

## 1. Adjacency

Defines which material places may sit beside one another within the same path context.

Adjacency = relational presence, not forced sequence. Adjacent places share relational context; they do not require mandatory traversal.

### Left Path Adjacency

| Material Place | Adjacent Places |
|---|---|
| Epigraph | Temple Path |
| Temple Path | Lapis Relational (Left), Media Passage (Right) |
| Lapis Relational | c3 MAP explainer, About Measures Registry, Structural Drift, Contact/Connect, Subscription, c3 Field support |
| Crystal/Lapis c3 MAP | Lapis Relational, Obsidian Assessment Gate |
| Obsidian Assessment Gate | Crystal/Lapis c3 MAP, Marble Commerced Circuit |
| Marble Commerced Circuit | Structural Drift, reserve_seat, phase_payment, Lapis Interoperability (convergence) |

### Right Path Adjacency

| Material Place | Adjacent Places |
|---|---|
| Temple Path | Media Passage (Right) |
| Media Passage | Marble Governance |
| Marble Governance | Lapis Interoperability |
| Lapis Interoperability | c3 Field, SRC continuation, Email (future), Subscription (future), Support, Cohort |

### Cross-Path Adjacency

| Material Place | Cross-Path Adjacent |
|---|---|
| Marble Commerced Circuit | Lapis Interoperability (via reserve_seat convergence) |
| Marble Governance | Marble Commerced Circuit (via delivery contract route) |
| Lapis Interoperability | reserve_seat (Left and Right Path convergence) |

### Adjacency Rule

A material place may only sit beside places listed in this contract.

Frontend may not introduce adjacency that is not governed here.

New adjacency requires a new OAR2 with governed relation definition.

## 2. Dependency

Defines what must resolve before a place may open.

Dependency is sequential. A dependent place cannot open until its dependency is satisfied.

### Dependency Chain — Left Path

| Place | Depends On |
|---|---|
| Lapis Relational | Temple path choice: Assess the Environment |
| Crystal/Lapis c3 MAP | Lapis Relational orientation |
| Obsidian Assessment Gate | Temple path choice, Lapis orientation, c3 MAP recognition, SRC intake (`connect_src` completed) |
| Marble Commerced Circuit | Obsidian Assessment Gate (`EnvironmentalStandingReport` produced) |
| `phase_payment` | `reserve_seat` confirmation + delivery contract seated |

### Dependency Chain — Right Path

| Place | Depends On |
|---|---|
| Media Passage | Temple path choice: Structure the Environment |
| Marble Governance | Media Passage orientation (auto-advance or continue to `structured_eval`) |
| Lapis Interoperability | Marble Governance output |
| Cohort activation | Marble Governance output + delivery contract seated + operator confirmation |

### Dependency Rule

A dependent place must not open before its dependency resolves.

No shortcut routing past a dependency is permitted without a future OAR2.

No frontend gate-bypass is permitted.

Urgency does not waive a dependency.

## 3. Isomorphic Mirror

Measures Registry mirrors Measures of Inanna in architectural shape without copying content.

| Architectural Function | Measures of Inanna | Measures Registry |
|---|---|---|
| Entry | Epigraph | Epigraph Place |
| Branching | Temple | Temple Path Place |
| Relational passage | Lapis surfaces | Lapis Relational Place |
| Pattern recognition | Crystal/Recognition | Crystal/Lapis c3 MAP Place |
| Gate / Diagnosis | Obsidian | Obsidian Assessment Gate Place |
| Governed commerce | Marble | Marble Commerced Circuit Place |
| Governance / Architecture | — | Marble Governance Place (Right Path) |
| Route continuation | — | Lapis Interoperability Place |
| Runtime pattern | resolveEncounter, GenericEncounter, encounter_history | Same pattern |

### Isomorphic Rule

The isomorphic relation is preserved at the architectural level.

Content, material assignment, and surface function differ between installations.

Measures of Inanna is not an authority over Measures Registry.

The pattern is shared. The authority is separate.

Measures Registry must not copy Measures of Inanna content. It must preserve the shared architectural shape.

## 4. Return Routes

Defines where unresolved signal is routed back to a governed position.

| Unresolved Signal | Return Route | Rule |
|---|---|---|
| Incomplete SRC intake at `connect_src` | Lapis Relational Place or Contact/Connect surface | Do not advance to Assessment Gate |
| Assessment incomplete or abandoned | Lapis Relational Place | Reorientation before re-entry |
| Marble entry without `EnvironmentalStandingReport` | Obsidian Assessment Gate | Returns visitor to gate |
| `phase_payment` without confirmed seat hold | `reserve_seat` | Returns to seat confirmation |
| Cohort activation without delivery contract | Marble Governance Place | Hold pending contract seating |
| Unresolved email / subscription signal | Lapis Interoperability Place | Support and continuation surfaces |
| Right Path visitor without structure signal | Media Passage | Restore structure orientation |

### Return Route Rule

Return routes restore governed position. They do not advance visitors.

Return routes do not skip dependencies.

Return routes do not create shortcuts into governed circuits.

Assessment must not be used as a punitive gating loop.

## 5. Conversion Relation

Defines where assessed material becomes qualified asset standing.

### Conversion Chain

```
c3 MAP qualification (Crystal/Lapis Place)
  → SRC intake confirmed (connect_src)
  → Obsidian Assessment Gate
  → EnvironmentalStandingReport produced
  → Qualified asset standing established
  → Marble Commerced Circuit entry
  → C1 / C2 / C3 circuit activation (requires delivery contract)
```

### Conversion Rules

- c3 MAP qualifies the asset/state pattern. It does not price.
- Obsidian exposes drift and produces standing. It does not assign circuits.
- Marble receives qualified assets. It does not re-assess.
- C1 / C2 / C3 require a delivery contract before activation. Standing report alone is insufficient.

### Right Path Conversion

Right Path conversion occurs through Marble Governance, not through assessment.

Visitors on the Right Path have declared readiness to structure. They are not required to traverse the Left Path.

Both paths may converge at `reserve_seat` and `measures_phases_reveal` under governed conditions.

### Convergence Rule

Left Path qualified visitors and Right Path structured visitors may converge at governed junction surfaces.

Neither path overrides the other at convergence.

Both paths arrive under their respective contract conditions.

## Close

Adjacency is governed.
Dependency is sequential.
Isomorphic shape is preserved — content is distinct.
Return routes restore, not advance.
Conversion requires delivery contract.
Only governed relations may become routes.

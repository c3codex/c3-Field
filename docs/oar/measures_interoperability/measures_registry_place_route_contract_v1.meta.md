---
document_type: architecture_contract
authority_level: working
document_scope: measures_interoperability
title: Measures Registry — Place Route Contract v1
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
  - place-route
  - second-layer-geometry
  - left-path
  - right-path
  - return-path
  - cross-path
  - codexstone
layer: second
---

# Measures Registry — Place Route Contract v1

## Contract Purpose

The Place Route Contract defines the governed movement between material places in the Measures Registry installation.

Routes are defined and governed by this contract. Routes are not implemented by this contract.

Implementation waits for its OAR2.

## Route Definitions

### Left Path Route

**Activation:** Temple path choice — "Assess the Environment."

```
Temple (landing_path_choice)
  → Lapis Relational Place (eval_passage)
  → Crystal/Lapis c3 MAP Place (connect_src)     ← SRC intake required
  → Obsidian Assessment Gate                      ← EnvironmentalStandingReport produced
      measures_ai_operational_evaluation
      iis_eval_gate1
      measures_assessment
  → Marble Commerced Circuit Place
      measures_phases_reveal                      ← standing result display
      about_measures_registry                     ← Marble authority surface
      reserve_seat                                ← seat offering intake
      phase_payment                               ← delivery contract required
```

**Route conditions:**

| Condition | Surface | Status |
|---|---|---|
| Temple path choice: Assess | `landing_path_choice` | Required |
| SRC intake complete | `connect_src` | Required before Assessment Gate |
| EnvironmentalStandingReport | Assessment Gate | Required before Marble entry |
| Seat confirmed | `reserve_seat` | Required before `phase_payment` |
| Delivery contract seated | — | Required before circuit activation |

**DB surface sequence:**
`landing_path_choice` → `eval_passage` → `connect_src` → `measures_ai_operational_evaluation` → `measures_phases_reveal` → `about_measures_registry` → `reserve_seat` → `phase_payment`

---

### Right Path Route

**Activation:** Temple path choice — "Structure the Environment."

```
Temple (landing_path_choice)
  → Right Path Media Passage (structure_passage)  ← structure signal
  → Marble Governance Place (structured_eval)     ← architecture/cohort routing
      → Cohort / conversion continuation
  → Lapis Interoperability Place
      c3_field
      cohort_conversion_encounter
      reserve_seat                                ← Left/Right convergence point
```

**Route conditions:**

| Condition | Surface | Status |
|---|---|---|
| Temple path choice: Structure | `landing_path_choice` | Required |
| Media Passage (auto-advance or continue) | `structure_passage` → `structured_eval` | Required |
| Marble Governance output | `structured_eval` | Routes to Lapis Interoperability |
| Cohort activation | — | Requires delivery contract + operator confirmation |

**DB surface sequence:**
`landing_path_choice` → `structure_passage` → `structured_eval` → `cohort_conversion_encounter` → `c3_field`

---

### Cross-Path Continuation

Left Path and Right Path visitors may converge at governed junction surfaces.

| Convergence Point | Left Path Entry | Right Path Entry | Governing Condition |
|---|---|---|---|
| `reserve_seat` | Marble Commerced Circuit → reserve_seat | Lapis Interoperability → reserve_seat | Both paths arrive under their contract conditions |
| `measures_phases_reveal` | Assessment Gate result | Marble Governance (with circuit access) | Assessment standing required for Left; governance output for Right |
| `about_measures_registry` | Left Path Marble surface | Accessible via cross-path continuation | Marble circuit conditions apply |

**Cross-path rule:**

- Neither path overrides the other at convergence.
- Both paths arrive under their respective contract conditions.
- Right Path visitors at `reserve_seat` do not bypass assessment qualification requirements for circuit activation.
- Left Path visitors at cohort surfaces do not bypass Marble Governance delivery contract requirements.

---

### Return Path

Defines where unresolved signal is routed back to a governed position.

Return routes restore. They do not advance. They do not skip dependencies.

| Unresolved Signal | Return Destination | Rule |
|---|---|---|
| Incomplete SRC intake (`connect_src`) | Lapis Relational Place or Contact/Connect | Do not advance to Assessment Gate |
| Assessment incomplete | Lapis Relational Place | Reorientation before re-entry |
| Marble entry without `EnvironmentalStandingReport` | Obsidian Assessment Gate | Returns to gate, not bypasses |
| `phase_payment` without confirmed seat hold | `reserve_seat` | Returns to seat confirmation |
| Cohort activation without delivery contract | Marble Governance Place | Hold pending contract |
| Unresolved Right Path signal | Lapis Interoperability Place | Support and continuation |
| Right Path without structure signal | Media Passage | Restore structure orientation |

**Return path rule:** Assessment must not be used as a punitive gating loop. Return routes do not create forced re-assessment.

---

### Support Path

Support adjacency is defined. Support implementation is pending a support contract OAR2.

| Support Entry Point | Adjacent Material Place | Status |
|---|---|---|
| Contact/Connect request | Lapis Relational Place | Adjacency defined — implementation pending |
| c3 Field support | Lapis Interoperability Place | Adjacency defined — implementation pending |
| Post-assessment support | Marble Commerced Circuit (`about_measures_registry`) | Adjacency defined — implementation pending |
| Post-governance support | Lapis Interoperability Place | Adjacency defined — implementation pending |

Support routing does not bypass any dependency in the Left or Right Path.

Support adjacency ≠ support implementation authorization.

---

### Future Conversion Engine Login Path

The conversion engine login surface is held as a placeholder in the Lapis Relational Place.

**Current state:** Placeholder. Not implemented.

**Future route (pending OAR2):**

```
Lapis Relational Place
  → Conversion Engine Login (future surface)
  → Active session continuation
```

**Requirements before implementation:**
- Seated conversion engine login contract
- Runtime OAR2 for implementation
- Operator confirmation

The placeholder does not block any current Left or Right Path routing.

---

## Route Map Summary

| Route | Entry Surface | Terminal Surface | Key Conditions |
|---|---|---|---|
| Left Path | `landing_path_choice` (Assess) | `phase_payment` | SRC intake + standing report + delivery contract |
| Right Path | `landing_path_choice` (Structure) | `c3_field` / `cohort_conversion_encounter` | Media passage + governance output |
| Cross-path | Either path | `reserve_seat` (convergence) | Respective contract conditions |
| Return | Unresolved signal | Appropriate relational surface | Restores — does not advance |
| Support | Lapis Relational or Lapis Interoperability | Contact/Connect or c3 Field | Implementation pending OAR2 |
| Conversion Login | Lapis Relational (future placeholder) | Active session (future OAR2) | Future runtime OAR2 required |

## Route Boundary Reminders

No route may bypass a dependency.

No route may cross a boundary without a future OAR2 (see Place Boundary Contract).

No frontend-implemented route may claim governance authority.

Routes defined here require runtime OAR2 for implementation.

Codex holds. Routes follow.

## Close

Left Path routes through assessment and qualification.
Right Path routes through structure and governance.
Cross-path convergence is governed.
Return routes restore governed position.
Support is adjacent, not bypassing.
Conversion login is held pending its OAR2.
Routes are defined. Implementation waits.

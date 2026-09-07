---
document_type: architecture_contract
authority_level: working
document_scope: measures_interoperability
title: Measures Registry — Material Place Map Contract v1
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
  - material-place-map
  - second-layer-geometry
  - codexstone
layer: second
---

# Measures Registry — Material Place Map Contract v1

## Contract Purpose

The Material Place Map Contract defines each chamber-held material place in the Measures Registry installation: its material assignment, allowed surfaces, forbidden claims, current standing, and future placeholders.

## Place Definitions

### 1. Epigraph Place

| Field | Value |
|---|---|
| Material | Pre-material |
| Chamber position | Entry — pre-path |
| DB anchor | `landing_root` / `ai_isnt_broken_intro` |
| Path | Neither — precedes Temple |
| Current standing | Active — seated |

**Allowed surfaces:**
- Opening encounter text
- Orientation toward Temple

**Forbidden claims:**
- No intake
- No diagnosis
- No commerce
- No path assignment before Temple

**Future placeholders:** None. Epigraph is complete as seated.

---

### 2. Temple Path Place

| Field | Value |
|---|---|
| Material | Pre-material |
| Chamber position | Branching surface |
| DB anchor | `landing_path_choice` / `evaluate_structure_path` |
| Path | Neither — branches to both |
| Current standing | Active — seated |

**Allowed surfaces:**
- Path choice: Assess the Environment
- Path choice: Structure the Environment
- Left Path activation signal
- Right Path activation signal

**Forbidden claims:**
- Temple does not hold chamber authority
- Temple does not diagnose
- Temple does not route without visitor selection
- No commerce at Temple
- Temple does not assign C1/C2/C3

**Future placeholders:** None. Temple is complete as a branching surface.

---

### 3. Lapis Relational Place

| Field | Value |
|---|---|
| Material | Lapis |
| Chamber position | Left Path entry |
| DB anchor | `educational_diagnostic_passage` / `eval_passage` |
| Path | Left Path |
| Current standing | Active — seated |

**Allowed surfaces:**
- Relational orientation and visitor positioning
- c3 MAP explainer
- About Measures Registry (lateral)
- Structural Drift / Paragraph (lateral)
- Contact / Connect request
- Subscription invitation
- c3 Field support adjacency
- Conversion engine login (placeholder — future OAR2)

**Forbidden claims:**
- Does not price
- Does not assign commerce
- Does not conduct assessment
- Does not close routes
- Does not replace c3 MAP or Obsidian Gate

**Future placeholders:**
- Conversion engine login surface — held, pending future runtime OAR2

---

### 4. Crystal/Lapis c3 MAP Place

| Field | Value |
|---|---|
| Material | Crystal/Lapis |
| Chamber position | Left Path — pre-gate |
| DB anchor | `connect_src` |
| Path | Left Path |
| Current standing | Active — seated |

**Allowed surfaces:**
- Measures Assessment Protocol explanation
- Pattern recognition surface
- Relation surface
- Asset/state pattern qualification
- SRC intake: institution_name, institution_type, contact_name, contact_email

**Forbidden claims:**
- c3 MAP does not price
- c3 MAP does not assign C1/C2/C3
- c3 MAP does not open the Marble Commerced Circuit
- c3 MAP does not replace Obsidian assessment
- c3 MAP qualification alone does not activate circuits

**Future placeholders:** None beyond SRC intake continuation through delivery contract sequence.

---

### 5. Obsidian Assessment Gate Place

| Field | Value |
|---|---|
| Material | Obsidian |
| Chamber position | Left Path — gate |
| DB anchor | `measures_ai_operational_evaluation` / `iis_eval_gate1` / `measures_assessment` / `structured_eval` |
| Path | Left Path |
| Current standing | Active — seated |

**Allowed surfaces:**
- 7-question AI Environment Readiness Gate
- Drift exposure display
- Condition tag resolution (`resolveEnvironmentalReport`)
- Scoring threshold resolution (`resolveEnvironmentalReportByScore`)
- `EnvironmentalStandingReport` output

**Forbidden claims:**
- Obsidian does not price
- Obsidian does not activate C1/C2/C3
- Obsidian does not replace c3 MAP qualification
- Assessment standing report is not a circuit activation
- Obsidian does not gate Right Path visitors

**Future placeholders:** None for current assessment mechanics.

---

### 6. Marble Commerced Circuit Place

| Field | Value |
|---|---|
| Material | Marble |
| Chamber position | Left Path — commerce |
| DB anchor | `measures_phases_reveal`, `about_measures_registry`, `reserve_seat`, `phase_payment` |
| Path | Left Path (convergence point for both paths at reserve_seat) |
| Current standing | Contract-governed — no activation without delivery contract |

**Allowed surfaces:**
- `measures_phases_reveal` — standing result display, phases/circuit reveal
- `about_measures_registry` — Marble authority statement
- `reserve_seat` — seat offering intake (SeatOfferingRow records)
- `phase_payment` — delivery contract payment (requires confirmed seat hold)

**Forbidden claims:**
- No activation without `EnvironmentalStandingReport`
- No pricing display before delivery contract is seated
- C1/C2/C3 are not readiness phases — they are Commerced Circuits
- No `phase_payment` without confirmed hold
- No Codex seating claimed

**Future placeholders:**
- 3x33 pricing logic implementation — future OAR2
- Delivery contract seating — future OAR2

---

### 7. Right Path Media Passage Place

| Field | Value |
|---|---|
| Material | Lapis (passage/transition) |
| Chamber position | Right Path entry |
| DB anchor | `structure_passage` |
| Path | Right Path |
| Current standing | Active — seated |

**Allowed surfaces:**
- Structure signal video (`structured_environment_passage_video` / `measures_structured_enviroments`)
- Orientation toward Marble Governance
- Continue button → `structured_eval`
- Auto-advance on video end → `structured_eval`

**Forbidden claims:**
- Media is renderer, not authority
- Does not hold chamber contracts
- Does not carry intake or assessment questions
- Does not present pricing or seat holds
- Does not own the structure signal — it transmits it

**Future placeholders:** Media content governance through encounter contract (`approved_copy_pending_contract`).

---

### 8. Marble Governance Place

| Field | Value |
|---|---|
| Material | Marble Governance |
| Chamber position | Right Path — governance |
| DB anchor | `structured_eval`, `cohort_conversion_encounter`, `c3_field` |
| Path | Right Path |
| Current standing | Contract-seated — implementation pending future OAR2 |

**Allowed surfaces:**
- Architecture contract seating
- Cohort structure routing
- Implementation pathway routing
- Contract seating / cohort routing output

**Forbidden claims:**
- Does not price by itself
- Distinct from Left Path Marble Commerced Circuit — not interchangeable
- Does not require assessment qualification for entry (ready/build signal is sufficient)
- Does not replace Left Path circuit
- Does not claim Codex seating

**Future placeholders:**
- Marble Governance Chamber implementation — future runtime OAR2
- Cohort delivery contract seating — future OAR2

---

### 9. Lapis Interoperability Place

| Field | Value |
|---|---|
| Material | Lapis |
| Chamber position | Right Path — transition/connector |
| DB anchor | `cohort_conversion_encounter`, `c3_field`, `reserve_seat` |
| Path | Right Path (convergence point for both paths at reserve_seat) |
| Current standing | Active (route-governed) — seated |

**Allowed surfaces:**
- Email continuity (placeholder — future OAR2)
- Subscription continuity (placeholder — future OAR2)
- SRC continuation through implementation
- c3 Field connection (`c3_field`)
- Support route adjacency
- Cohort activation (pending delivery contract)
- Social media automation (placeholder — future OAR2)
- Future runtime alignment route (placeholder — future OAR2)

**Forbidden claims:**
- Does not implement runtime alignment without future OAR2
- Does not activate cohorts without seated delivery contract
- Does not treat route as terminal — it connects, not closes
- Does not collapse SRC, SRC1, SRC2, and src

**Future placeholders:**
- Email continuity implementation — future OAR2
- Subscription continuity implementation — future OAR2
- Social media automation — future OAR2
- Runtime alignment route — future OAR2
- Cohort delivery contract seating — future OAR2

---

## Material Assignment Summary

| Place | Material | Path |
|---|---|---|
| Epigraph | Pre-material | Pre-path |
| Temple Path | Pre-material | Branching |
| Lapis Relational | Lapis | Left |
| Crystal/Lapis c3 MAP | Crystal/Lapis | Left |
| Obsidian Assessment Gate | Obsidian | Left |
| Marble Commerced Circuit | Marble | Left (converges) |
| Right Path Media Passage | Lapis | Right |
| Marble Governance | Marble Governance | Right |
| Lapis Interoperability | Lapis | Right (converges) |

## Close

Material places are mapped.
Each place holds its material assignment.
Each place's allowed surfaces and forbidden claims are bounded.
Future placeholders are held without implementation.
Chambers hold material places.
Contracts govern what places may do.

---
document_type: architecture_contract
authority_level: working
document_scope: measures_interoperability
title: Measures Registry — Marble Commerced Circuit Contract v1
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
  - marble
  - commerced-circuit
  - c1-c2-c3
  - left-path
  - isomorphic
  - codexstone
material: marble
chamber_position: left-path-commerce
path_position: post-obsidian-gate
---

# Measures Registry — Marble Commerced Circuit Contract v1

## Contract Purpose

The Marble Commerced Circuit Chamber governs the activation of governed commercial distribution for qualified assets.

C1 / C2 / C3 = Commerced Circuits.

Marble = governed form, contracts, Commerced Circuit activation.

This chamber does not price arbitrarily. It seats commercial form.

## Circuit Definition

### C1 / C2 / C3 — Commerced Circuits

Commerced Circuits are governed pricing and distribution channels operating under the 3x33 framework.

**3x33** = the governing distribution and pricing logic for Measures-registered circuits.

- C1 — first circuit
- C2 — second circuit
- C3 — third circuit

Each circuit has a distinct asset profile, delivery contract requirement, and activation condition.

Circuits are not readiness phases. They are governed commercial distribution forms.

Do not conflate C1 / C2 / C3 with assessment readiness stages.

### Qualified Asset Entry

Qualified assets from the Obsidian Assessment Gate may enter Commerced Circuits.

Entry requires:
1. A completed `EnvironmentalStandingReport` from the Assessment Gate
2. A delivery contract (seated before circuit activation)
3. Operator confirmation of circuit readiness

## Runtime Anchor

| Field | Value |
|---|---|
| DB encounter_keys | `measures_phases_reveal`, `about_measures_registry`, `reserve_seat`, `phase_payment` |
| Surface states | `measures_phases_reveal`, `about_measures_registry`, `reserve_seat`, `phase_payment` |
| Offering source | `measures_seat_offering` table (system_key = `measures_registry`) |
| Offering fields | offering_key, label, short_label, description, offering_type, enrollment_state, hold_target_key, offering_surface_key |
| Media roles | `marble_accent_reference`, `marble_tone` (audio continuity), `lapis_background` |
| Design tokens | marble material token set |

## Material Assignment

Marble.

Marble = governed form, contracts, commerce.

The Marble Commerced Circuit Chamber seats commercial contracts. It does not generate them spontaneously.

The `marble_accent_reference` media role provides visual continuity across the circuit surfaces.

The `marble_tone` audio role sustains the material register through circuit traversal (at low volume, opt-in).

## Surfaces Within the Circuit

### 1. `measures_phases_reveal`

The Marble entry surface.

Receives the visitor and `EnvironmentalStandingReport` from the assessment pathway.

Displays:
- Assessment standing result
- Environmental standing label
- Recommended structured action
- Phases/circuit reveal sections (DB-driven from encounter metadata)

Routes to `about_measures_registry`.

### 2. `about_measures_registry`

Marble authority statement surface.

Presents Measures Registry as a registered, governed system.

Copy elements:
- Eyebrow: "ABOUT MEASURES REGISTRY"
- Title: "A registered environment for governing AI behavior."
- Subtitle: operator-seated
- Primary statement: from `approved_content_contract.primary_statement`
- Support points: list from `approved_content_contract.support_points`

Routes to `structural_drift_dispatches` (primary CTA) or back into the circuit.

### 3. `reserve_seat`

The circuit intake surface for seat offerings.

Displays `SeatOfferingRow` records from `measures_seat_offering`.

Enrollment states: `open`, `coming_soon`, `held`, `closed`.

Routes to offering-specific hold surfaces (`foundation_seat_hold`, `systems_seat_hold`).

### 4. `phase_payment`

The delivery contract payment surface.

Activated after a seat is held and the delivery contract is confirmed.

Delivery contract required before activation. This surface must not present independently of a confirmed offering route.

## Delivery Contract Requirement

A delivery contract must be seated before any Commerced Circuit is activated.

The delivery contract specifies:
- Which circuit is being activated (C1 / C2 / C3)
- The offering terms
- The enrolled SRC contact

Without a delivery contract, the Marble Commerced Circuit remains unopened even if assessment qualification is confirmed.

## What the Marble Circuit Must Not Do

- Activate without assessment qualification
- Present pricing before a delivery contract is seated
- Conflate C1 / C2 / C3 with assessment readiness states
- Route to `phase_payment` without a confirmed seat hold
- Claim Codex seating for any circuit
- Execute commerce without operator-confirmed delivery contract

## Continuation

After the Marble Commerced Circuit, the visitor has either:
- Reserved a seat (held, pending delivery contract)
- Entered an offering pathway
- Continued to read Structural Drift dispatches

No further left-path chamber follows. The circuit is the terminal surface of the Left Path.

## Boundary

This contract governs circuit definition, qualification requirements, delivery contract rules, and surface sequence.

3x33 pricing logic implementation is a separate future OAR2.

Delivery contract seating is a separate OAR2.

Runtime implementation is a separate OAR2.

No media, CSS, or DB mutation is authorized by this contract.

## Close

Marble seats commercial form.

The circuit opens only under delivery contract.

C1 / C2 / C3 distribute. They do not diagnose.

---
document_type: architecture_contract
authority_level: working
document_scope: measures_interoperability
title: Measures Registry — Lapis Relational Passage Contract v1
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
  - lapis
  - relational-passage
  - left-path
  - isomorphic
  - codexstone
material: lapis
chamber_position: left-path-entry
path_position: post-temple
---

# Measures Registry — Lapis Relational Passage Contract v1

## Contract Purpose

The Lapis Relational Passage is the first chamber of the Left Path.

It receives the visitor from the Temple and establishes relational orientation before the visitor enters the c3 MAP Chamber.

Lapis = relational orientation, positioning, passage, interoperability.

## Runtime Anchor

| Field | Value |
|---|---|
| DB encounter_key | `educational_diagnostic_passage` / `eval_passage` (aliased in runtime) |
| Surface state | `educational_diagnostic_passage` |
| Routing constant | `REGISTERED_KEY_TO_SURFACE["eval_passage"] = "path_choice"` (current; passage alignment future OAR2) |
| Media role | `lapis_background` / `background` (aliased in runtime) |

## Material Assignment

Lapis.

The passage is relational, not material — the visitor is being positioned, not assessed.

Lapis communicates: orientation, connection, structured traversal.

Visual surface uses `lapis_background` media role.

## Passage Functions

### 1. Relational Orientation

The passage explains the relationship between the visitor, their AI environment, and the Measures Registry.

It is not a diagnosis. It is not a sales surface.

It locates the visitor within the system.

### 2. Visitor Positioning

The passage establishes the visitor's standing before the c3 MAP Chamber.

It does not presume readiness. It prepares the visitor to self-assess.

### 3. Bridge into c3 MAP Explanation

The passage introduces the c3 MAP (Measures Assessment Protocol) without activating it.

It explains:
- What the c3 MAP does
- What the visitor will do in the next chamber
- Why the assessment matters to the visitor's environment

### 4. About / Contact / Structural Drift Surfaces

The Lapis Passage connects to:
- About Measures Registry (`about_measures_registry` surface)
- Structural Drift dispatches (`structural_drift_dispatches` surface / `structural_drift_publication`)
- Connect SRC form (`connect_src` surface) — for visitors who want to proceed through SRC intake

These surfaces are accessible from the passage but are not part of the linear path.

### 5. Conversion Engine Login — Held Placeholder

A future conversion engine login/dev access surface is anticipated but not yet contracted.

This surface is documented as a held placeholder.

Identifier: `conversion_engine_login` (held — no DB record, no runtime route)

Do not implement until a separate OAR2 routes the conversion engine contract.

## What the Lapis Passage Must Not Do

- Execute assessment questions
- Display pricing
- Claim SRC standing without intake
- Activate the Obsidian Assessment Gate prematurely
- Present the Marble Commerced Circuit before assessment is complete
- Route to `reserve_seat` or `phase_payment` directly

## Continuation

From the Lapis Relational Passage, the visitor proceeds to the Crystal/Lapis c3 MAP Chamber.

The passage may also offer a branch to About, Structural Drift, or Connect SRC for visitors who navigate laterally.

## Boundary

This contract governs relational orientation, visitor positioning, and passage routing only.

Runtime implementation is a separate OAR2.

No media, CSS, or DB mutation is authorized by this contract.

## Close

Lapis relates.

The passage positions.

The c3 MAP Chamber recognizes.

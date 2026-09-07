---
document_type: architecture_contract
authority_level: working
document_scope: measures_interoperability
title: Measures Registry — Right Path Structure Environment Contract v1
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
  - right-path
  - structure-environment
  - marble-governance
  - isomorphic
  - codexstone
material: marble_governance
chamber_position: right-path
path_position: post-temple
---

# Measures Registry — Right Path Structure Environment Contract v1

## Contract Purpose

The Right Path — Structure the Environment — receives visitors who are ready to build, govern, or formalize their AI operational environment.

This path is for architects, not assessees.

The visitor comes from the Temple with a ready/build signal. They proceed through the Media Passage, the Marble Governance Chamber, and the Lapis Interoperability Route.

## Path Overview

```
Temple → Media Passage → Marble Governance Chamber → Lapis Interoperability Route
                                                    → implementation / cohort / conversion continuation
```

## Ready/Build Signal

The Right Path activates on a ready/build signal.

This is not an assessment result. It is a visitor declaration: they know they need to structure, not assess.

Visitors who select the Right Path at the Temple are already past the question of whether they have drift. They are asking how to govern the environment.

## Runtime Anchor

| Field | Value |
|---|---|
| DB encounter_keys | `structure_passage`, `structured_eval`, `cohort_conversion_encounter`, `c3_field` |
| Surface states | `structure_passage`, `structured_eval`, `cohort_conversion`, `c3_field` |
| Media role | `structured_environment_passage_video` / `measures_structured_enviroments` (aliased) |
| Continuation surfaces | `measures_phases_reveal`, `reserve_seat` (via Marble Governance) |

## Marble Governance Chamber

The Right Path carries a Marble Governance Chamber.

This chamber is distinct from the Left Path's Marble Commerced Circuit.

| Property | Left Path Marble | Right Path Marble |
|---|---|---|
| Function | Commerced Circuit activation | Governed architecture seating |
| Entry condition | Assessment qualification | Ready/build signal |
| Output | Circuit enrollment | Contract seating / cohort routing |

The Marble Governance Chamber seats:
- Architecture contracts
- Cohort structure
- Implementation pathway routing

It does not price by itself. Pricing follows from the delivery contract sequence, which is governed through the Marble Commerced Circuit (reachable from both paths, but after separate qualification routes).

## Contract Seating Route

The Right Path is the governed architecture path.

Visitors on this path seat contracts before they measure outcomes.

The architecture is set first. Measurement follows governance.

## Cohort / Implementation / Conversion Continuation

The Right Path terminates in one of:
- Implementation pathway (governed build sequence)
- Cohort entry (group-based structured environment)
- Conversion continuation (cross-path routing to Marble Commerced Circuit when assessment is available)

These continuations are held pending delivery contract seating.

Current DB surfaces: `cohort_conversion_encounter`, `c3_field`, `reserve_seat`.

## What the Right Path Must Not Do

- Force visitors through assessment before allowing contract seating
- Present Left Path assessment as the only entry to commerce
- Route to `phase_payment` without a seated delivery contract
- Mix architecture contract seating with Commerced Circuit activation
- Treat the Right Path as a shortcut to the Left Path outcomes

## Boundary

This contract governs Right Path structure, surface sequence, and continuation routing.

Marble Governance Chamber implementation is a separate OAR2.

Cohort and conversion contract seating are separate OAR2s.

Runtime implementation is a separate OAR2.

No media, CSS, or DB mutation is authorized by this contract.

## Close

The Right Path structures.

Governance precedes measurement.

Architecture is seated before circuits are opened.

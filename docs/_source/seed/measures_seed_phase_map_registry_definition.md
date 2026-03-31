---
document_type: measures_registry_definition
authority_level: system
document_scope: phase_map
title: Measures Seed — Phase Map Registry Definition
status: draft
version: v1
operator: op044
date: 2026-03-30
native_stack:
  codex: database
  field: schema
  measures: registry
  chazz: systems
tags:
  - measures
  - registry
  - phase-map
  - reveal
  - state
  - dependency
source_alignment:
  - Seed Pattern Constraints — Chazz
  - MEASURES Installation Role
  - Seed Concordance
  - Field Definition — Phase Map
---

# Measures Seed — Phase Map Registry Definition

## Purpose

Register Phase Map in Measures as a reveal-governed unit whose visibility and availability are controlled by registry state.

This seed does not define cadence calculation, passage logic, or release offsets.

It only seats Phase Map as a registered unit with a truthful unavailable standing.

## Registry Role

Phase Map resolves in Measures as:

- registered surface
- relational positioning unit
- reveal-governed visibility surface
- dependency-bound encounter index

Phase Map does not resolve as:

- authority source
- passage mechanism
- release calculator
- UI-owned state

## Registered Identity

- unit_key: `phase_map`
- unit_type: `surface`
- material_context: `obsidian`
- display_title: `Phase Map`

Slug, if present, is routing-only and not authority.

## Dependency Registration

Phase Map requires prior relation to:

- `epigraph`

Phase Map may not enter available state unless Epigraph has been validly encountered and Measures permits reveal.

## Initial Registered State

Initial state for seed:

- phase_state: `unavailable`
- is_visible: `true`
- is_accessible: `false`
- is_released: `false`

This allows the frontend to render Phase Map truthfully without simulating access.

## Reveal Rule

Measures governs whether Phase Map may be revealed as available.

Field may position it.
Frontend may render it.
Neither may decide availability.

This preserves the rule that all behavior must be registered in Measures.

## View Contract Expectation

Phase Map should eventually be readable through a stable view exposing at minimum:

- unit_key
- unit_type
- display_title
- phase_state
- is_visible
- is_accessible
- is_released
- dependency_key

Views are the public contract, not raw table assumptions.

## Success Condition

Phase Map is properly seeded in Measures when:

- it exists as a registered unit
- dependency on Epigraph is recorded
- initial unavailable state is recorded
- frontend can read truthful state without inventing behavior

## Closing

Phase Map may appear before it is available.

Its presence is structural.
Its availability is registry-defined.

Codex holds.
Field structures.
Measures registers.
Chazz operates.

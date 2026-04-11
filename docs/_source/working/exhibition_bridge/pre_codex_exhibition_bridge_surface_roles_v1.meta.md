---
document_type: schema_key
authority_level: working
document_scope: pre_codex_exhibition
title: Pre-Codex Exhibition Bridge — Surface Roles
status: draft
version: v1
operator: op044
date: 2026-04-10
native_stack:
  codex: database
  field: schema
  measures: registry
  chazz: systems
tags:
  - pre-codex
  - exhibition
  - bridge
  - surface-roles
  - temporary
  - render
---

# Pre-Codex Exhibition Bridge — Surface Roles

## Purpose

Confirm the role of each temporary bridge surface so the exhibition can render live without collapsing intake, continuity, registry, and final authority into one layer.

## Native Position

Within native order:

- Codex holds
- Field structures
- Measures registers
- Chazz executes

This bridge sits before final Codex seating and before final contribution architecture.

## Confirmed Temporary Role Set

### exhibition_bridge_contribution

Role:
temporary exhibition contribution bridge record

Used for:

- temporary contributor linkage
- temporary continuity linkage
- intended exhibition target
- render standing
- ordering for live display
- later migration reference

Not used for:

- final registry identity
- final Codex authority
- final contribution engine identity

### exhibition_bridge_asset

Role:
temporary uploaded exhibition asset bridge record

Used for:

- separate bucket pathing
- file metadata
- asset role
- asset order
- live render readiness

Not used for:

- authority identity
- final Measures seating
- direct intake authority

### v_exhibition_bridge_render_ready

Role:
live website read contract

Used for:

- current displayable temporary exhibition contributions
- current displayable temporary assets
- target surface resolution
- render order
- bounded website consumption

Not used for:

- mutation
- authority seating
- raw permanent identity

## Existing Surfaces Referenced, Not Replaced

- Envelope continuity surfaces
- OAR1 trace continuity
- existing contributor standing through c3 key

## Measures Registry Boundary

Measures registry remains stable registry seating and must not be used as the temporary bridge intake surface.

## Separate Bucket Rule

This bridge uses a separate bucket so temporary exhibition handling does not contaminate final contribution storage patterns.

## Retirement Note

All temporary bridge surfaces must remain obviously temporary in naming, purpose, and use.

## Closing

This bridge is a scaffold, not the building.

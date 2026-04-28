---
document_type: implementation_manifest
authority_level: working
document_scope: phase_map_visual_refactor
title: Phase Map Visual Refactor Manifest
status: draft
version: v1
operator: op044
handoff_target: Cody / OpenAI Codex
native_stack:
  codex: database
  field: schema
  measures: registry
  chazz: systems
tags:
  - measures_of_inanna
  - phase_map
  - frontend
  - visual_refactor
  - no_logic_change
  - encounter_surface
---

# Phase Map Visual Refactor Manifest

## Purpose

Refactor the Phase Map visual presentation without changing registry logic, release logic, cadence behavior, route behavior, or encounter resolution.

The Phase Map logic is correct.
The visual surface must be corrected so it reads as a relational field, not a dashboard, diagram, menu, or generic UI map.

## Non-Negotiable Rule

No logic changes.

Do not change:

- database queries
- release/access logic
- viewed-node logic
- center-node state logic
- transition behavior
- route targets
- encounter resolver behavior
- cadence sequence

This is a visual-only refactor.

## Native Role

Phase Map is a relational positioning surface.

It is not:

- a menu
- a dashboard
- a node chart
- a legend-driven diagram
- a generic navigation surface

It must visually communicate:

```text
one valid center of entry
ordered relation
released visibility
viewed access
sealed presence without access
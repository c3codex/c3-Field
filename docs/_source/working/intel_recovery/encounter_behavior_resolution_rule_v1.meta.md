---
document_type: process_rule
authority_level: working
document_scope: encounter_behavior
title: Encounter Behavior Resolution Rule
status: working
version: v1
operator: op044
date: 2026-04-13
native_stack:
  codex: database
  field: schema
  measures: registry
  chazz: systems
tags:
  - process
  - encounter
  - renderer
  - transition
  - behavior
---

# Encounter Behavior Resolution Rule

## Purpose

Define the bounded route for moving from a working frontend encounter bridge to registry-driven encounter behavior.

## Rule

A surface is not considered architecturally resolved merely because it renders correctly.

Encounter behavior remains unresolved until the renderer reads behavior from Measures-facing data rather than chamber-specific frontend logic.

## Required Standing Before Resolution

The following must already exist:

1. registry row
2. encounter def
3. transition rule
4. media rows or other renderable body
5. verified live render

## Behavior Types To Extract

Encounter behavior includes, at minimum:

- encounter mode
- auto-advance target
- action labels
- action route targets
- action placement
- visibility / sequencing hints

## Bridge Standing

A frontend bridge is permitted temporarily when:

- the encounter is newly seated
- behavior is still being discovered live
- the bridge is explicitly recognized as temporary
- the seam between working render and final contract is visible

## Drift Condition

Drift exists when the frontend knows any of the following as chamber-specific truth:

- what encounter comes next
- which action labels should be shown
- which routes are offered
- which encounter is opening, home, passage, or standard
- where actions should be positioned

## Resolution Sequence

1. verify seated registry / encounter / transitions
2. verify render works live
3. identify remaining frontend-owned behavior
4. define renderer-readable contract fields
5. seat behavior in Measures-facing metadata or view
6. remove chamber-specific logic from renderer
7. re-verify live behavior

## Success Condition

Encounter behavior is resolved when:

- the renderer does not invent encounter-specific behavior
- transition and action behavior are read, not hardcoded
- chamber-specific branches are removed
- the renderer can render any valid encounter from contract

## Closing

A working bridge is permitted.
Permanent frontend ownership of encounter behavior is not.

The renderer may temporarily assist discovery.
It may not remain the authority for encounter behavior.

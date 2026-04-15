---
document_type: working_seed
authority_level: working
document_scope: renderer_contract
title: Renderer Contract Seed
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
  - renderer
  - contract
  - encounter
  - metadata
  - seed
---

# Renderer Contract Seed

## Purpose

Provide a minimal working contract for externalizing encounter behavior from frontend logic into Measures-facing data.

## Working Contract Shape

Type name:
EncounterRenderConfig

Fields:
- encounter_key: string
- surface_key: string
- mode: "opening" | "home" | "passage" | "standard"
- auto_advance_to?: string
- actions?: array of:
  - label: string
  - to_encounter: string
  - position: "left" | "right" | "center" | "lower_left" | "lower_right"

## Minimum Required Fields

### 1. encounter_key
Stable encounter identity for the renderer surface.

### 2. surface_key
The media body or other render surface the renderer should resolve.

### 3. mode
Required render behavior family.

Initial working modes:
- opening
- home
- passage
- standard

### 4. auto_advance_to
Optional automatic route target after time-based or playback-based completion.

### 5. actions
Optional route actions rendered on the surface.

Each action requires:
- label
- to_encounter
- position

## Working Placement Notes

Position is presentation guidance only.
It must not replace transition authority.

Valid initial positions:
- left
- right
- center
- lower_left
- lower_right

## Candidate Seating Locations

This contract may be seated in one of the following:

### Option A
`measures_encounter_def.metadata`

Best when the behavior belongs to the encounter itself.

### Option B
`measures_transition_rule.metadata`

Best when the behavior is specifically route-conditioned.

### Option C
A dedicated read view that composes encounter + transition metadata into a renderer-safe contract.

## Current Recommendation

Start with encounter metadata for:
- mode
- surface_key

Use transition metadata or composed view for:
- action route behavior
- auto-advance target

## Session 15 Example Reading

### Temple intro
- mode: opening
- surface_key: temple_inanna
- auto_advance_to: crystal_temple_home_view

### Crystal Temple Home
- mode: home
- surface_key: crystal_temple_home
- actions:
  - Visit Antechamber → temple_antechamber_view
  - Enter Exhibition → temple_harrumuk_passage_view

## Closing

This is a working seed, not a locked final contract.

Its purpose is to reduce chamber-specific renderer logic and create a repeatable path from live behavior discovery to Measures-readable encounter behavior.

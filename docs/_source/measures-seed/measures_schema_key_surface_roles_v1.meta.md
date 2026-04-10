---
document_type: schema_key
authority_level: working
document_scope: measures_schema
title: Measures Schema Key — Surface Roles
status: complete
version: v1
operator: op044
date: 2026-04-09
native_stack:
  codex: database
  field: schema
  measures: registry
  chazz: systems
tags:
  - schema-key
  - measures
  - registry
  - release-state
  - phase-calendar
  - encounter-def
  - transition-rule
  - views
---

# Measures Schema Key — Surface Roles

## Purpose

Define the confirmed live Measures schema surfaces by role so future installation work can reference a seated schema key instead of repeating raw schema checks.

This doc identifies:
- the live tables and views currently relevant to Measures installation work
- the kind of truth each surface holds
- what each surface is allowed to carry
- what each surface must not be used for

This doc is a source reference only.
It does not authorize mutation.
It does not replace direct DB verification where new surfaces appear.
It reduces repeated confirmation for already verified standing.

## 1. Native Position

Within the native order:

- Codex holds authority
- Field structures relation
- Measures registers sequence, access, and reveal
- Chazz operates through systems

This schema key applies to the Measures layer and its immediate exposure surfaces.

## 2. Confirmed Live Measures Surfaces

### A. measures_registry
Role: stable registry seating surface

Used for:
- seating a unit as a registered thing
- storing family identity
- storing sequence order
- storing parent/dependency relation
- storing baseline release/access standing
- carrying bounded metadata

Not used for:
- mutable release event history
- schedule truth
- direct intake authority
- frontend-only interpretation
- ad hoc behavioral patching

### B. measures_release_state
Role: mutable release/access standing surface

Used for:
- current live reveal standing
- current live access standing
- release / access reasons
- effective timestamps
- state-specific metadata

Not used for:
- defining registry identity
- carrying sequence order
- storing encounter definition
- storing phase schedule truth itself

### C. measures_phase_calendar
Role: keyed phase schedule surface

Used for:
- keyed release schedules
- phase family grouping
- anchor-based release standing
- schedule sequencing

Not used for:
- direct registry seating
- direct FK-based parent/child unit structure
- encounter definition
- narrative state interpretation

### D. measures_encounter_def
Role: encounter definition surface

Used for:
- defining encounter-side structure where needed
- seating encounter-specific surface behavior
- controlling pause / entry standing
- providing encounter metadata

Not used for:
- serving as the primary identity table
- carrying mutable release standing
- replacing registry family seating

### E. measures_transition_rule
Role: transition logic surface

Used for:
- bounded progression rules
- return / pause / release logic
- dependency and connect-prompt conditions

Not used for:
- primary registry seating
- mutable state storage
- schedule anchoring
- direct asset storage

## 3. Confirmed Read Surfaces

### A. v_measures_registry_state_v1
Role: registry state read surface

### B. v_measures_registry_state_v2
Role: evolved registry state read surface

### C. v_measures_release_surface_v1
Role: release-facing read surface

Views are the preferred public/read contract surface.

## 4. Current Anti-Drift Cautions

### A. Registry is not intake
measures_registry contains envelope_id and that does not make registry a valid intake authority surface.

### B. Release is split from identity
Current live schema separates:
- stable seating in measures_registry
- live standing in measures_release_state

### C. Phase is keyed, not inferred
measures_phase_calendar is a keyed schedule surface with bounded families and anchor names.

### D. Encounter defs are one-to-one when seated
measures_encounter_def binds uniquely to a registry row when used.

## 5. Result

The confirmed Measures schema surfaces are now seated by role:

- measures_registry = stable registry seat
- measures_release_state = mutable release/access standing
- measures_phase_calendar = keyed phase schedule
- measures_encounter_def = encounter definition
- measures_transition_rule = bounded transition logic
- v_measures_registry_state_v1/v2 and v_measures_release_surface_v1 = read surfaces

This doc becomes the first reusable schema key source.

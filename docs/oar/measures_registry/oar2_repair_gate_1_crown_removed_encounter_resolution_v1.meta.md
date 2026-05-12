---
document_type: oar2
authority_level: working
document_scope: inanna_gate_encounter_resolution
title: OAR2 — Repair Gate 1 Crown Removed Encounter Resolution
status: proposed
version: v1
operator: op044
system: measures_registry
source_oar1:
  - oar1_diagnose_inanna_transition_and_encounter_resolution_v1
native_stack:
  codex: database
  field: schema
  measures: registry
  chazz: systems
---

# OAR2 — Repair Gate 1 Crown Removed Encounter Resolution

## OBSERVED

The live Inanna route now resolves through:

    epigraph
    -> crystal_temple_home
    -> temple_antechamber
    -> temple_harrumuk_passage
    -> phase_map

The first confirmed unresolved target is the phase-map center node:

    gate_1_crown_removed

The diagnostic classified the failure as:

    missing encounter_def

This does not prove the gate never existed.

It proves the current runtime requested key does not resolve to a governed encounter definition.

Possible causes:

- legacy gate was seated under a different key
- phase-map center node points to the wrong key
- registry row exists without encounter_def
- encounter_def exists under another gate key
- migration failed to seat the governed encounter_def

## ALIGNED

Codex remains authority.

Field structures gate relation.

Measures registers encounter definition and phase-map targets.

Chazz routes repair without duplicating truth.

Cody executes only from this OAR2.

This OAR2 authorizes bounded investigation and repair for Gate 1 only.

This OAR2 does not authorize:

- broad gate migration
- media migration
- fallback deletion
- frontend hardcoding
- invented duplicate gate rows
- unrelated route repair

## ROUTED

### 1. Search existing Gate 1 candidates

Cody must search live DB for likely existing Gate 1 records using keys or patterns:

    gate_1
    gate01
    gate_01
    crown_removed
    gate_1_crown_removed
    obsidian_chamberplate_gate01
    obsidian_chamberplate_gate_01

Inspect:

- public.measures_registry
- public.measures_encounter_def
- public.measures_release_state
- public.measures_transition_rule
- public.measures_surface_media_map
- public.codex_media_asset

### 2. Determine authoritative target

Cody must determine whether the correct repair is:

A. remap phase-map center node to an existing valid governed encounter target

or

B. seat/restore missing encounter_def for:

    gate_1_crown_removed

No duplicate truth is allowed.

If a valid existing encounter target exists under another key, prefer remap over creating a duplicate encounter_def.

### 3. Validate target requirements

Before mutation, Cody must confirm the selected target has or can safely receive:

- registry row
- encounter_def
- release standing
- access standing if applicable
- media mapping if required
- renderer compatibility
- phase-map target compatibility

### 4. Authorized repair

Cody may perform only one of these repairs:

#### Option A — remap center node target

If an existing governed Gate 1 encounter exists, update the phase-map center node target to that existing key.

#### Option B — seat missing encounter_def

If gate_1_crown_removed is confirmed as the authoritative registry key, create or restore the missing measures_encounter_def for that key using existing registry/state/media standing.

### 5. Validation

After repair, Cody must validate:

- phase-map center node click resolves
- selected target has encounter_def
- renderer can render target
- release/access state permits render
- media rows resolve if target uses media
- no duplicate Gate 1 encounter was created
- no unrelated gates changed

### 6. No mutation boundary outside Gate 1

No media bucket changes.

No fallback deletion.

No frontend hardcoding.

No broad transition rewrite.

No unrelated encounter_def creation.

## CODY ROLE

Cody may:

- inspect candidate gate records
- repair the phase-map center target or missing encounter_def
- validate Gate 1 resolution
- write OAR1 closeout

Cody may not:

- invent duplicate gate authority
- migrate all gates
- hardcode route targets in frontend
- alter media storage
- delete fallback rows
- mutate unrelated registry entries

## VALIDATION

This OAR2 resolves successfully when OAR1 reports:

1. all Gate 1 candidate records inspected
2. authoritative repair path selected
3. exact mutation performed
4. phase-map center node resolves to renderable encounter
5. no duplicate Gate 1 authority created
6. no unrelated gates changed
7. remaining held items listed if any

## EXPECTED OAR1

    docs/oar/measures_registry/oar1_repair_gate_1_crown_removed_encounter_resolution_v1.meta.md

## CLOSE

Find the old truth first.

Repair only the broken target.

Codex holds.
Field structures.
Measures registers.
Chazz routes.

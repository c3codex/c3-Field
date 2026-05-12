---
document_type: oar2
authority_level: working
document_scope: measures_of_inanna_registry_to_encounter_resolution
title: OAR2 — Repair Inanna Registry-to-Encounter Key Resolution
status: proposed
version: v1
operator: op044
system: measures_of_inanna
native_stack:
  codex: database
  field: schema
  measures: registry
  chazz: systems
tags:
  - oar2
  - measures-of-inanna
  - encounter-resolution
  - registry-key
  - encounter-def
  - runtime-repair
source_alignment:
  - DB to src Manifest — Measures of Inanna Exhibition
  - OAR1 - Validate L2 Runtime Media Delivery
  - OAR Lifecycle — Execution and Handoff
---

# OAR2 — Repair Inanna Registry-to-Encounter Key Resolution

## OBSERVED

Measures Registry now loads L2 media correctly.

Measures of Inanna still fails with:

Encounter could not be resolved

DB inspection confirmed starting registry rows exist:

- epigraph
- crystal_temple_home
- inanna_seat
- temple_antechamber

DB inspection also confirmed encounter defs exist with suffixed keys:

- epigraph_view
- crystal_temple_home_view
- inanna_seat_view

The expected traversal remains:

epigraph → crystal_temple_home ↔ inanna_seat → temple_antechamber

The current resolver appears to require encounter_key = registry_key, which fails for view surfaces where the encounter def uses the legacy _view suffix.

## ALIGNED

This is a registry-to-encounter resolution seam.

It is not:

- R2 delivery failure
- Supabase auth failure
- media migration failure
- deployment binding failure

Authority order remains:

Codex → Field → Measures → Chazz/src

Frontend must not invent encounter meaning.

Runtime may resolve a registry key to an encounter definition only through bounded compatibility rules.

No duplicate DB truth should be created unless required after validation.

## ROUTED

Cody shall repair Measures of Inanna registry-to-encounter key resolution.

### 1. Inspect Inanna resolver

Inspect:

- src/measures_of_inanna/resolve_encounter.ts
- related Inanna runtime files
- query shape used for measures_registry
- query shape used for measures_encounter_def

Determine whether the resolver currently looks up encounter defs only by exact registry_key.

### 2. Implement bounded encounter-key resolution

For a registry row, resolve encounter def in this order:

1. exact encounter_key = registry_key
2. metadata-declared encounter key, if present
3. legacy-compatible encounter_key = registry_key + _view

Do not use freeform guessing.

Do not scan arbitrary encounter defs.

Do not hardcode individual route exceptions.

### 3. Preserve existing DB state

Do not create duplicate measures_encounter_def rows for:

- epigraph
- crystal_temple_home
- inanna_seat

unless Cody proves resolver compatibility cannot safely handle the existing seated keys.

Preferred repair is runtime resolution, not DB duplication.

### 4. Confirm starting traversal

Validate that the runtime can resolve:

- epigraph → epigraph_view
- crystal_temple_home → crystal_temple_home_view
- inanna_seat → inanna_seat_view
- temple_antechamber → existing valid encounter behavior

If temple_antechamber lacks a needed encounter def, report clearly and do not invent.

### 5. Preserve media resolver

Do not alter the shared R2/Supabase provider-aware media resolver unless a direct regression is found.

No media migration.

No bucket mutation.

### 6. Build validation

Run:

- npm run build:inanna

If shared code changes require it, also run:

- npm run build:registry

## CODY ROLE

Cody may:

- inspect Inanna resolver logic
- implement bounded registry-to-encounter key compatibility
- preserve _view encounter defs
- validate starting traversal
- run builds
- write OAR1 closeout

Cody may not:

- invent encounter meanings
- create duplicate DB rows unless explicitly proven necessary
- hardcode individual route shortcuts
- mutate media mappings
- perform DB media migration
- alter Measures Registry behavior unless shared code requires validation
- expose secrets

## VALIDATION

Cody must return:

1. root cause summary
2. files changed
3. resolver behavior before/after
4. starting traversal validation
5. unresolved encounter keys, if any
6. confirmation no DB migration was performed
7. confirmation no media rows changed
8. build result
9. OAR1 closeout path

Execution is valid only when:

- registry keys can resolve their seated _view encounter defs
- no duplicate truth is introduced
- no media migration occurs
- no individual route shortcut is hardcoded
- Inanna build passes or failure is clearly reported
- OAR1 is written beside this OAR2

## EXPECTED OAR1

docs/oar/measures_of_inanna/oar1_repair_inanna_registry_to_encounter_key_resolution_v1.meta.md

## CLOSE

This pass repairs the Inanna runtime seam between registry identity and encounter definition keys.

Codex holds.
Field structures.
Measures registers.
Chazz executes.

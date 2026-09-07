---
document_type: oar2
authority_level: working
document_scope: measures_registry_launch_repair
title: OAR2 - Collapse Crystal Split Path Into Threshold
status: proposed
version: v1
operator: op044
system: measures_registry
---

# OAR2 - Collapse Crystal Split Path Into Threshold

## OBSERVED

Crystal Seat currently has one surface too many.

`crystal_seat_split_path` was seated as a distinct surface, but the operator clarified that the L/R path choice belongs to `crystal_seat_threshold`.

The media remains the same:

- L/R motion-to-still threshold media
- Assess the Environment
- Understand the Environment

`crystal_seat_split_path` is therefore drift.

## ALIGNED

Correct Crystal Seat sequence:

1. `crystal_seat_intro`
   - function: hook / media intro
   - media: `ai_isnt_broken_intro`

2. `crystal_seat_threshold`
   - function: L/R threshold
   - media: L/R motion-to-still
   - choices:
     - Assess the Environment
     - Understand the Environment

3. `crystal_seat_orientation`
   - function: orientation
   - media: `measures_position`

4. `crystal_seat_encounter`
   - function: about / understanding encounter
   - route: `/about-measures-registry`

There is no separate active `crystal_seat_split_path`.

Threshold carries the choice.

Orientation prepares the encounter.

## NORMALIZATION REQUIREMENT

Cody must collapse active `crystal_seat_split_path` authority into `crystal_seat_threshold`.

Target:

- `crystal_seat_threshold` owns the L/R path-choice function
- `crystal_seat_split_path` becomes deprecated / legacy_alias / inactive
- transitions no longer require a separate split_path surface
- any public route or internal default flow that points to `crystal_seat_split_path` must resolve to `crystal_seat_threshold` or be removed if redundant
- right path must route to `crystal_seat_orientation`
- left path must route to `obsidian_chamber_orientation`

## REQUIRED TRANSITION STATE

Target transition chain:

    crystal_seat_intro
      -> crystal_seat_threshold

    crystal_seat_threshold.left
      -> obsidian_chamber_orientation

    crystal_seat_threshold.right
      -> crystal_seat_orientation

    crystal_seat_orientation
      -> crystal_seat_encounter

Do not route right path to:

- `crystal_seat_orientation_passage`

Do not route default movement to:

- `crystal_seat_split_path`

## ROUTED

Cody must audit and update where dependency-safe:

- `measures_encounter_surface_assignment`
- `measures_registry`
- `measures_encounter_def`
- `encounter_structure` JSONB
- `EncounterSurface` union
- `MeasuresRegistryOrchestrator.tsx`
- `CrystalSeatRenderer.tsx`
- route maps
- profile constants
- CSS selectors / data attributes using split path
- media references for L/R threshold motion-to-still

## DB / SOURCE HANDLING

If `crystal_seat_split_path` exists as a DB row:

- mark as `deprecated` or `legacy_alias`
- remove from active route/transition authority
- do not delete unless dependency-safe and separately justified

If `evaluate_structure_path` remains as registry_key for the L/R threshold media:

- attach it to `crystal_seat_threshold` only if dependency-safe
- otherwise report registry_key normalization gap in OAR1

If `crystal_seat_threshold` currently uses `ai_isnt_broken_intro`, verify whether that is hook/intro media and whether threshold needs its own registry/media binding.

Do not invent media rows.

## DO NOT TOUCH

This OAR does not authorize:

- Obsidian content changes
- Lapis changes
- Marble changes
- report/scoring/payment changes
- Stripe changes
- passage activation
- antechamber activation
- registered_runtime restoration
- visual redesign

## CODY ROLE

Cody may:

- collapse split_path into threshold
- update transition chain
- isolate `crystal_seat_split_path`
- update renderer dispatch to use threshold for L/R path choice
- update type unions and route maps
- preserve public route behavior
- run TypeScript/build validation
- write OAR1 with before/after evidence

Cody may not:

- keep `crystal_seat_split_path` active as separate authority
- route right path to held passage
- collapse intro and orientation
- invent missing media
- mutate unrelated chambers

## VALIDATION

Validation succeeds when:

- `crystal_seat_split_path` is not active authority
- `crystal_seat_threshold` carries L/R path choice
- L/R motion-to-still media remains attached to threshold
- left path routes to `obsidian_chamber_orientation`
- right path routes to `crystal_seat_orientation`
- `crystal_seat_orientation` routes to `crystal_seat_encounter`
- `crystal_seat_orientation_passage` remains held
- `crystal_seat_intro` remains distinct from `crystal_seat_orientation`
- `/about-measures-registry` still resolves
- no report/scoring/payment mutation occurs
- registered_runtime remains retired
- TypeScript/build passes or exact failure is reported
- OAR1 records before/after proof

## EXPECTED OAR1

docs/oar/measures_registry/oar1_collapse_crystal_split_path_into_threshold_v1.meta.md

## CLOSE

Threshold carries the choice.

Split path is not a separate surface.

Crystal intro opens.
Crystal threshold offers L/R.
Crystal orientation positions.
Crystal encounter explains.

Codex holds.
Systems align.
Measures allows.
Field arranges.
Roles authorize.
Optics prove.
FREE renders.

Collapse is not the default.

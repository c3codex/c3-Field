---
document_type: oar2
authority_level: working
document_scope: encounter_assignment_boundary
title: OAR2 — Replace Renderer Name Assignment with Environment Assignment
status: proposed
version: v1
operator: op044
system: measures_registry
---

# OAR2 — Replace Renderer Name Assignment with Environment Assignment

## OBSERVED

Chamber Router is created and dispatches from `encounter.chamberAssignment`.

Current DB assignment values are renderer implementation names:

- ObsidianChamberRenderer
- CrystalSeatRenderer
- LapisChamberRenderer
- MarbleChamberRenderer

This leaks React implementation naming into registry standing.

Registry should not know renderer names.

Registry should carry where the encounter belongs.

The software should map environment identity to renderer implementation.

## ALIGNED

Registry carries structural assignment.

Renderer names are implementation details.

Correct assignment values:

- crystal_seat
- obsidian
- lapis
- marble

Correct software mapping:

- crystal_seat → CrystalSeatRenderer
- obsidian → ObsidianChamberRenderer
- lapis → LapisChamberRenderer
- marble → MarbleChamberRenderer

Crystal remains Seat, not chamber.

## ROUTED

### 1. Update DB Assignment Field

Update `measures_encounter_surface_assignment.chamber_assignment` values.

Replace renderer names with environment assignment values:

- CrystalSeatRenderer → crystal_seat
- ObsidianChamberRenderer → obsidian
- LapisChamberRenderer → lapis
- MarbleChamberRenderer → marble

Do not create Crystal Chamber language.

### 2. Update Types

Update `ChamberAssignment` union to:

- crystal_seat
- obsidian
- lapis
- marble

If preferred, rename type to:

`EncounterEnvironmentAssignment`

Only rename if low-risk.

### 3. Update Encounter Composition / Loader

Ensure composed/renderable encounter carries environment assignment from DB.

Do not infer from material.

Do not infer from surface key.

### 4. Update Chamber Router

Router dispatches from environment assignment:

- crystal_seat → CrystalSeatRenderer gap
- obsidian → ObsidianChamberRenderer
- lapis → LapisChamberRenderer gap
- marble → MarbleChamberRenderer gap

No fallback to Obsidian.

### 5. Preserve Boundaries

Router still receives only `RenderableEncounter`.

Router may not:

- query DB
- inspect release state
- compose
- gate
- infer chamber from route/surface/material
- mutate encounter

### 6. No Live Cutover

Do not wire shell.

Do not edit monolith.

Do not change live behavior.

## CLAUDE ROLE

Claude may:

- create migration
- update types
- update resolver validation
- update composition/loader naming if needed
- update ChamberRouter dispatch
- run build
- return OAR1 evidence

Claude may not:

- introduce Crystal Chamber language
- leave renderer names as registry values
- infer assignment from material
- wire shell
- edit monolith
- change live behavior

## NOTCHAZZ FLAGS

Raise NotChazz flag if:

- registry still stores renderer names
- Crystal Chamber language appears
- router infers environment from surface/material
- assignment falls back to Obsidian
- renderer implementation names become authority
- live entry point changes

## VALIDATION

Success is achieved when:

- DB assignment values are structural environment values
- renderer names are removed from registry assignment rows
- Crystal is seated as crystal_seat
- router maps environment assignment to renderer implementation
- no live behavior changes
- no monolith edits
- build passes
- OAR1 reports migration, changed files, and assignment rows

Expected OAR1:

docs/oar/measures_registry/oar1_replace_renderer_name_assignment_with_environment_assignment_v1.meta.md

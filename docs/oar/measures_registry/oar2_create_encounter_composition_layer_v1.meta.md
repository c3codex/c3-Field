---
document_type: oar2
authority_level: working
document_scope: encounter_composition
title: OAR2 — Create Encounter Composition Layer
status: proposed
version: v1
operator: op044
system: measures_registry
---

# OAR2 — Create Encounter Composition Layer

## OBSERVED

Surface assignment authority is now seated in the database.

Release authority remains exclusively within `measures_registry`.

Encounter Renderer infrastructure is complete.

A remaining architectural seam exists.

Encounter assembly currently resides inside the Encounter Profile Loader.

Before chamber renderers are introduced, encounter composition shall become its own bounded layer.

## ALIGNED

Authority order:

Codex
→ Registry Standing
→ Surface Assignment
→ Encounter Definition
→ Encounter Composition
→ Encounter Profile
→ Release Gate
→ Chamber Router
→ Chamber Renderer
→ Surface Renderer

The renderer renders.

The composition layer composes.

The registry governs.

No layer performs another layer's responsibility.

## ROUTED

### 1. Create Encounter Composition Layer

Create:

src/measures_registry/encounter_renderer/composition/

Primary file:

encounterComposition.ts

Supporting types as required.

This layer exists solely to assemble encounter state.

It is not a renderer.

It is not a resolver.

It is not a gate.

### 2. Composition Inputs

Compose from seated state only.

Inputs may include:

- registry standing
- surface assignment
- encounter definition
- media mappings
- content records
- design profile
- transition metadata
- material identity
- chamber assignment

No inferred authority.

No fallback truth.

### 3. Composition Output

Return one Encounter Profile.

Encounter Profile represents a fully assembled encounter ready for rendering.

The profile must contain only seated data.

No rendering decisions.

No routing decisions.

No release decisions.

### 4. Refactor Encounter Profile Loader

EncounterProfileLoader becomes orchestration only.

Its responsibilities become:

- request registry standing
- request surface assignment
- request encounter definition
- call Encounter Composition
- return Encounter Profile

It no longer assembles encounter state internally.

### 5. Chamber Renderer Boundary

Future chamber renderers receive only:

Encounter Profile

They may:

- render
- animate
- position
- style

They may not:

- query DB
- assemble encounters
- determine chamber
- determine material
- determine release
- determine routing

### 6. Release Gate

Release Gate remains independent.

Composition does not grant permission.

Release Gate evaluates assembled Encounter Profile against Registry Standing.

If gate fails:

return governed held state.

### 7. Chamber Router

Chamber Router receives:

Encounter Profile

It determines only:

Which Chamber Renderer receives the profile.

It does not modify the profile.

It does not assemble the profile.

It does not determine release.

### 8. No Live Runtime Changes

Do not:

- implement chamber renderers
- replace entry point
- edit monolith
- alter public behavior

This OAR creates architectural separation only.

## CLAUDE ROLE

Claude may:

- create Encounter Composition layer
- refactor Encounter Profile Loader
- define Encounter Profile interfaces
- update imports
- run build validation
- document composition flow

Claude may not:

- implement chamber renderers
- alter release authority
- move authority into frontend
- change routing
- modify public encounters
- invent fallback behavior

## NOTCHAZZ FLAGS

Raise NotChazz flag if:

- composition performs release decisions
- composition performs routing
- renderer performs composition
- loader assembles encounters
- chamber renderer queries database
- chamber renderer determines authority
- release gate becomes composition logic

## VALIDATION

Success is achieved when:

- Encounter Composition layer exists
- Encounter Profile Loader becomes orchestration only
- Encounter Profile is composed from seated registry data
- Chamber Renderers require only Encounter Profile input
- Release Gate remains independent
- Chamber Router remains independent
- No live behavior changes occur
- Build passes
- OAR1 documents architecture, files created, and confirms strict responsibility separation

Expected OAR1:

docs/oar/measures_registry/oar1_create_encounter_composition_layer_v1.meta.md

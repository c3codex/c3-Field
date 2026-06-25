---
document_type: oar2
authority_level: working
document_scope: encounter_renderer_registry_assignment
title: OAR2 — Seat Encounter Surface Assignment in Registry
status: proposed
version: v1
operator: op044
system: measures_registry
---

# OAR2 — Seat Encounter Surface Assignment in Registry

## OBSERVED

Encounter Renderer Phase 1 created infrastructure successfully.

However, Phase 1 currently uses compiled TypeScript constants for:

- surface to registry key
- registry key to material identity
- registry key to chamber assignment
- valid encounter surface set

This is cleaner than the monolith, but still leaves authority in code.

Operator correction:

If the registry can carry the mapping, the registry should carry the mapping.

Do not proceed to chamber renderers until surface assignment is registry-seated.

## ALIGNED

Frontend does not assign encounter authority.

Renderer does not decide chamber assignment.

Renderer does not decide material identity.

Renderer does not decide surface-to-registry mapping.

Registry carries renderable encounter assignment.

Encounter Renderer loads and renders seated assignment.

Authority flow:

Codex
→ Registry Standing
→ Encounter Surface Assignment
→ Release Gate
→ Encounter Profile Loader
→ Chamber Renderer
→ Surface Renderer

## ROUTED

### 1. Seat Surface Assignment in Registry

Create or update DB standing so each renderable surface has registry-carried assignment.

Assignment must include:

- surface_key
- registry_key
- encounter_key where required
- material_identity
- chamber_assignment
- public route or route aliases where applicable
- public/private standing
- release/access standing linkage

Preferred location:

A dedicated registry table if existing schema supports it.

Acceptable location:

measures_registry metadata only if table creation is not appropriate.

Do not use TypeScript constants as authority.

### 2. Required Surface Assignments

Seat assignments for current public scope:

- intro / intro_hook
- path_choice
- eval_passage
- measures_assessment
- obsidian_to_marble_passage_video
- map_integrity_governance
- structural_drift_dispatches
- publication_dispatch
- structure_passage
- about_measures_registry

Do not seat dead surface:

- ai_operations_assessment_landing

Do not seat deprecated aliases as active authority.

### 3. Update Encounter Renderer Infrastructure

Update Phase 1 infrastructure so:

- registryResolver loads surface assignment standing
- encounterProfileLoader reads surface assignment from registry data
- releaseGate still gates against registry record
- transitionResolver validates targets against registry-loaded surface assignments
- TypeScript constants no longer serve as authority

TypeScript may retain type unions for compile-time safety only.

TypeScript may not carry live assignment authority.

### 4. Fail-Closed Behavior

If a surface assignment is missing:

render governed held state.

If chamber assignment is missing:

render governed held state.

If material identity is missing:

render governed held state.

If surface maps to deprecated alias:

render governed held state.

No fallback to compiled constants.

### 5. No Chamber Renderer Yet

Do not implement Obsidian Chamber Renderer in this OAR.

Do not wire shell.

Do not change live entry point.

This OAR repairs infrastructure authority before Phase 2.

## CLAUDE ROLE

Claude may:

- inspect schema
- create migration for surface assignment standing
- update encounter renderer resolver/types/profile loader
- remove assignment authority from TypeScript constants
- preserve compile-time surface types where useful
- run build
- return OAR1 evidence

Claude may not:

- implement chamber renderers
- edit monolith
- change live routing
- activate held surfaces
- seat deprecated aliases as active
- use constants as authority fallback
- invent public standing outside current scope

## NOTCHAZZ FLAGS

Raise NotChazz flag if:

- surface assignment remains code-authoritative
- chamber assignment remains code-authoritative
- material identity remains code-authoritative
- constants are used as fallback truth
- deprecated aliases are seated as active assignment
- dead surfaces are preserved in assignment
- missing assignment fails open

## VALIDATION

Success is achieved when:

- surface assignment is seated in DB
- resolver loads assignment standing
- encounter profile loader reads assignment from DB
- release gate still blocks held/inactive registry records
- transition resolver validates against DB-loaded assignments
- TypeScript constants are not authority
- no chamber renderer is created
- no live behavior changes
- build passes
- OAR1 reports migration, files changed, assignment rows, and fail-closed validation

Expected OAR1:

docs/oar/measures_registry/oar1_seat_encounter_surface_assignment_in_registry_v1.meta.md

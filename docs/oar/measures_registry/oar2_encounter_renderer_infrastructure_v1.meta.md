---
document_type: oar2
authority_level: working
document_scope: encounter_renderer_infrastructure
title: OAR2 — Encounter Renderer Infrastructure
status: proposed
version: v1
operator: op044
system: measures_registry
---

# OAR2 — Encounter Renderer Infrastructure

## OBSERVED

Encounter Renderer plan is approved to begin in bounded phases.

Phase 1 is infrastructure only.

No rendering cutover.

No monolith patch.

No extraction.

## ALIGNED

Runtime runs nothing here.

Measures Registry renders seated encounter state.

Authority flow:

Codex
→ Registry Standing
→ Release Gate
→ Encounter Profile Loader
→ Chamber Router
→ Chamber Renderer
→ Surface Renderer

Phase 1 builds only resolver/type infrastructure.

## ROUTED

Create:

src/measures_registry/encounter_renderer/types/encounterRendererTypes.ts

src/measures_registry/encounter_renderer/resolver/registryResolver.ts

src/measures_registry/encounter_renderer/resolver/releaseGate.ts

src/measures_registry/encounter_renderer/resolver/transitionResolver.ts

src/measures_registry/encounter_renderer/resolver/encounterProfileLoader.ts

### 1. Types

Define shared types for:

- registry records
- encounter definitions
- media records
- design tokens
- resolver data
- gate results
- encounter profiles
- material identity
- chamber assignment

### 2. Registry Resolver

Create resolver data loader.

It may load required DB tables.

It may not make authority decisions.

It returns raw resolver data only.

### 3. Release Gate

Create pure release gate.

Surface may render live only when:

- registry record exists
- is_active = true
- release_state permits rendering

Otherwise return governed held result.

### 4. Transition Resolver

Create pure transition resolver.

It reads transition metadata.

It validates target through release gate.

If target is held, inactive, missing, unknown, deprecated, or blocked:

return null.

No hardcoded transitions.

### 5. Encounter Profile Loader

Create encounter profile loader.

It assembles a profile from seated data.

It does not invent authority.

It does not validate into existence.

It fails closed when required data is missing.

Fail-closed conditions include:

- missing authority
- missing registry record
- missing release standing
- inactive record
- held release state
- missing encounter profile
- missing required media
- missing transition where required
- unknown chamber assignment
- deprecated alias
- working residue

### 6. No Entry Point Change

Do not wire the encounter renderer into the app.

Do not edit the monolith.

Do not edit existing renderers.

Do not change public behavior.

This OAR creates infrastructure only.

## CLAUDE ROLE

Claude may:

- create infrastructure files
- define types
- implement pure resolver utilities
- import Supabase client where required for data loading
- run build validation
- return OAR1 evidence

Claude may not:

- patch monolith
- extract monolith logic
- create chamber renderers
- change entry point
- change live routing
- change public copy
- change DB records
- invent authority

## NOTCHAZZ FLAGS

Raise NotChazz flag if:

- monolith logic is copied
- runtime terminology returns
- resolver makes authority decisions
- encounter profile loader becomes authority
- release gate can fail open
- transition resolver uses hardcoded target surfaces
- source changes affect live runtime behavior

## VALIDATION

Success is achieved when:

- five infrastructure files exist
- no entry point changes are made
- no monolith edits are made
- release gate fails closed
- transition resolver validates targets
- encounter profile loader assembles only seated data
- build passes
- OAR1 reports exact files created and confirms no live behavior changed

Expected OAR1:

docs/oar/measures_registry/oar1_encounter_renderer_infrastructure_v1.meta.md

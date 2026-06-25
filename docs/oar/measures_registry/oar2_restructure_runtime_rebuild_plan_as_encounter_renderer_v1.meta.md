---
document_type: oar2
authority_level: working
document_scope: encounter_renderer_restructure
title: OAR2 — Restructure Rebuild Plan as Encounter Renderer
status: proposed
version: v1
operator: op044
system: measures_registry
---

# OAR2 — Restructure Rebuild Plan as Encounter Renderer

## OBSERVED

Prior rebuild plan used runtime_v2 and contract/profile language.

Operator rejects that framing.

The replacement layer is not a runtime.

It is an encounter renderer.

The renderer does not execute authority.

It resolves and renders seated encounter profiles from registry standing.

## ALIGNED

Correct terminology:

- runtime_v2 -> encounter_renderer
- runtime shell -> encounter renderer shell
- contract validator -> encounter profile resolver
- runtime contract -> encounter profile
- chamber runtime -> chamber renderer

Do not use contract profile.

Do not build another runtime authority layer.

## ROUTED

Claude shall restructure the prior rebuild plan.

No source changes.

Deliver revised plan only.

New target directory:

src/measures_registry/encounter_renderer/

Required structure:

encounter_renderer/
  shell/
    MeasuresRegistryEncounterRenderer.tsx
  resolver/
    registryResolver.ts
    releaseGate.ts
    transitionResolver.ts
    encounterProfileResolver.ts
  chambers/
    ObsidianChamberRenderer.tsx
    CrystalSeatRenderer.tsx
    LapisChamberRenderer.tsx
    MarbleChamberRenderer.tsx
  types/
    encounterRendererTypes.ts

Authority flow:

Codex
→ Registry Standing
→ Release Gate
→ Encounter Profile
→ Chamber Renderer
→ Surface Renderer

Renderer rules:

- no extraction from monolith
- no runtime authority
- no hardcoded transitions
- no component-owned truth
- no ghost-live surfaces
- no contract-profile language
- no runtime_v2 naming

Encounter profiles must resolve:

- registry record
- release state
- encounter definition
- media mappings
- text/content profile
- transition nodes
- material identity
- chamber assignment

If encounter profile cannot resolve:

render governed held state.

## CLAUDE ROLE

Claude may:

- revise the file map
- revise the phased plan
- revise naming
- revise architecture language
- return updated implementation sequence

Claude may not:

- write source code
- patch monolith
- extract monolith logic
- use runtime_v2 naming
- use contract profile terminology

## VALIDATION

Success is achieved when OAR1 returns:

- revised encounter_renderer file map
- revised phased implementation plan
- updated authority flow
- removed runtime_v2 language
- removed contract-profile language
- clear no-extraction boundary

Expected OAR1:

docs/oar/measures_registry/oar1_restructure_runtime_rebuild_plan_as_encounter_renderer_v1.meta.md

---
document_type: oar2
authority_level: working
document_scope: encounter_renderer_restructure
title: OAR2 — Restructure Encounter Renderer Plan with Loader and Fail-Closed Rules
status: proposed
version: v1
operator: op044
system: measures_registry
---

# OAR2 — Restructure Encounter Renderer Plan with Loader and Fail-Closed Rules

## OBSERVED

Prior restructure OAR correctly rejected runtime_v2 and contract-profile language.

Additional refinement is required before implementation begins.

Runtime runs nothing here.

The replacement layer is an Encounter Renderer.

The renderer renders seated encounter state.

It does not execute authority.

## ALIGNED

Correct target language:

- runtime_v2 -> encounter_renderer
- runtime shell -> encounter renderer shell
- contract validator -> encounter profile loader
- runtime contract -> encounter profile
- chamber runtime -> chamber renderer

Do not use:

- runtime_v2
- contract profile
- contract validator
- runtime authority
- runtime contract

Authority flow:

Codex
→ Registry Standing
→ Release Gate
→ Encounter Profile Loader
→ Chamber Renderer
→ Surface Renderer

## ROUTED

Claude shall revise the prior plan only.

No source changes.

No monolith patch.

No extraction.

### 1. Rename Encounter Profile Resolver

Replace:

encounterProfileResolver

with:

encounterProfileLoader

Reason:

Profiles already exist in registry standing.

The renderer loads seated encounter profiles.

It does not resolve, invent, validate into existence, or decide profiles.

### 2. Chamber Renderer Constraint

Add explicit rule:

A chamber renderer renders only encounters already assigned to its chamber.

A chamber renderer never determines chamber assignment.

Chamber assignment is resolved before rendering through registry standing and encounter profile loading.

### 3. Fail-Closed Rule

Add explicit rule:

Encounter renderers never fail open.

The following all resolve to governed held state:

- missing authority
- missing registry record
- missing release standing
- inactive registry record
- held release state
- missing encounter profile
- missing required media
- missing transition
- unknown chamber assignment
- deprecated alias
- working residue

No fallback truth.

No best-effort public rendering.

### 4. Revised File Map

Target directory:

src/measures_registry/encounter_renderer/

Required structure:

encounter_renderer/
  shell/
    MeasuresRegistryEncounterRenderer.tsx
  resolver/
    registryResolver.ts
    releaseGate.ts
    transitionResolver.ts
    encounterProfileLoader.ts
  chambers/
    ObsidianChamberRenderer.tsx
    CrystalSeatRenderer.tsx
    LapisChamberRenderer.tsx
    MarbleChamberRenderer.tsx
  types/
    encounterRendererTypes.ts

### 5. Revised Implementation Sequence

Return a bounded phased implementation plan.

Phase 1 should be infrastructure only:

- types
- registryResolver
- releaseGate
- transitionResolver
- encounterProfileLoader

No rendering cutover.

No monolith edits except possible deprecated_reference_only header if explicitly approved later.

### 6. OAR1 Requirements

OAR1 must return:

- revised file map
- revised phased implementation plan
- revised authority flow
- fail-closed rule
- chamber renderer constraint
- removed runtime_v2 language
- removed contract-profile language
- no source changes confirmation

## CLAUDE ROLE

Claude may:

- revise plan
- revise naming
- revise architecture language
- revise phased implementation sequence
- identify risks

Claude may not:

- write source code
- patch monolith
- extract monolith logic
- implement runtime_v2
- use contract profile terminology
- create renderer authority

## NOTCHAZZ FLAGS

Raise NotChazz flag if:

- runtime terminology remains
- contract-profile terminology remains
- chamber renderer determines chamber assignment
- encounter profile loader is described as authority
- fail-open behavior is permitted
- monolith extraction is proposed

## VALIDATION

Success is achieved when the rebuild plan is reframed as an Encounter Renderer plan and is safe to begin Phase 1 infrastructure.

Expected OAR1:

docs/oar/measures_registry/oar1_restructure_encounter_renderer_plan_with_loader_and_fail_closed_rules_v1.meta.md

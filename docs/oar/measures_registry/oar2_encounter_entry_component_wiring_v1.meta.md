---
document_type: oar2
authority_level: working
document_scope: encounter_entry
title: OAR2 — Encounter Entry Component Wiring
status: proposed
version: v1
operator: op044
system: measures_registry
---

# OAR2 — Encounter Entry Component Wiring

## OBSERVED

Encounter Boundary is implemented.

Complete architecture now exists from:

registryResolver
→ encounterProfileLoader
→ encounterComposition
→ releaseGate
→ RenderableEncounterResult
→ EncounterBoundary
→ ChamberRouter
→ Environment Renderer

No existing encounter renderer entry component was found.

The only remaining architectural gap is the entry component that begins the resolved encounter pipeline and hands the result to EncounterBoundary.

## ALIGNED

Encounter Entry is not authority.

Encounter Entry does not render encounter surfaces directly.

Encounter Entry does not infer meaning.

Encounter Entry exists only to run the settled pipeline and call EncounterBoundary.

Everything above Encounter Boundary determines.

Everything below Encounter Boundary presents.

Encounter Entry must not collapse those responsibilities.

## ROUTED

Create:

src/measures_registry/encounter_renderer/EncounterEntry.tsx

Encounter Entry may:

- receive entry props already defined in encounterRendererTypes
- call registryResolver
- call encounterProfileLoader
- call encounterComposition
- call releaseGate
- produce RenderableEncounterResult
- pass result to EncounterBoundary
- pass callbacks through to EncounterBoundary
- provide public-safe loading / error state where required

Encounter Entry may not:

- render chambers directly
- bypass EncounterBoundary
- bypass ChamberRouter
- invent encounter state
- hardcode content
- infer environment
- mutate Registry
- edit monolith
- change release behavior
- expose internal gate reason publicly

## CALLBACKS

Pass through optional callbacks:

- onCaptureAssessment
- onCaptureSubscription
- onCaptureConnect

Omitting callback disables persistence path.

Renderer presentation remains unaffected.

## ENTRY BOUNDARY

Encounter Entry is the first component of the encounter renderer pipeline.

It may begin determination.

It may not present final encounter.

Final presentation begins only after EncounterBoundary.

## CLAUDE ROLE

Claude may:

- create EncounterEntry.tsx
- wire settled pipeline into EncounterBoundary
- reuse existing types from encounterRendererTypes
- preserve renderer isolation
- preserve EncounterBoundary as sole presentation threshold
- run type-check
- run build
- return OAR1 evidence

Claude may not:

- edit monolith
- create shell abstraction
- bypass EncounterBoundary
- bypass ChamberRouter
- hardcode content
- infer environment
- seed content
- change release behavior
- change registry behavior
- expose internal gate reasons

## NOTCHAZZ FLAGS

Raise NotChazz flag if:

- Encounter Entry renders environment directly
- EncounterBoundary is bypassed
- ChamberRouter is bypassed
- shell abstraction returns
- monolith is edited
- DB mutation appears
- content is invented
- environment is inferred outside existing pipeline
- internal gate reason is surfaced publicly

## VALIDATION

Success is achieved when:

- EncounterEntry.tsx exists
- runs resolver → profileLoader → composition → releaseGate
- produces RenderableEncounterResult
- calls EncounterBoundary
- passes callbacks through
- does not render chambers directly
- does not bypass ChamberRouter
- does not edit monolith
- does not change release behavior
- type-check passes
- build passes
- OAR1 documents entry wiring and validation

Expected OAR1:

docs/oar/measures_registry/oar1_encounter_entry_component_wiring_v1.meta.md

---

## CLOSE

Encounter Entry begins the pipeline.

Encounter Boundary confirms encounterable state.

Renderer manifests.

Who encounters.

Optics proves.

Nothing is invented.

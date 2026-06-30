---
document_type: oar2
authority_level: working
document_scope: encounter_boundary
title: OAR2 — Encounter Boundary Implementation
status: proposed
version: v1
operator: op044
system: measures_registry
---

# OAR2 — Encounter Boundary Implementation

## OBSERVED

Encounter Shell has been deprecated.

Encounter Boundary is now the native architectural threshold between prepared state and encounterable state.

Current settled flow:

registryResolver
→ encounterProfileLoader
→ encounterComposition
→ releaseGate
→ RenderableEncounter
→ Encounter Boundary
→ ChamberRouter
→ Environment Renderer

All four environment renderers are implemented:

- crystal_seat
- obsidian
- lapis
- marble

The boundary now requires implementation.

---

## ALIGNED

Encounter Boundary is not authority.

Encounter Boundary does not determine standing.

Encounter Boundary does not arrange Field.

Encounter Boundary does not compose encounters.

Encounter Boundary receives only already-valid `RenderableEncounter`.

Boundary may host presentation lifecycle and callback wiring only.

---

## ROUTED

Create:

src/measures_registry/encounter_renderer/boundary/EncounterBoundary.tsx

Encounter Boundary may:

- receive `RenderableEncounter`
- provide presentation frame
- provide lifecycle wrapper
- provide unavailable / invalid renderable state
- wire shell-safe callbacks
- pass `RenderableEncounter` to ChamberRouter
- host shared accessibility / viewport frame
- preserve environment assignment

Encounter Boundary may not:

- query DB
- call registryResolver
- call encounterComposition
- call releaseGate
- infer environment
- mutate encounter
- determine release
- determine standing
- invent missing content
- implement chamber behavior
- edit monolith

---

## CALLBACK CONTRACT

Boundary may accept and pass:

- `onCaptureAssessment`
- `onCaptureSubscription`
- `onCaptureConnect`
- governance context callback placeholder only if already typed safely

Callbacks remain optional.

Omitting callback disables persistence path.

Renderer presentation must remain unaffected.

---

## ENTRY POINT

If current encounter renderer entry point exists, update it to use EncounterBoundary only after RenderableEncounter is already resolved.

Do not change monolith entry points.

Do not route live public traffic unless already wired to encounter renderer path.

---

## TERMINOLOGY

Use:

- Encounter Boundary
- RenderableEncounter
- ChamberRouter
- Environment Renderer
- crystal_seat

Do not use:

- Encounter Shell
- shell
- Crystal Chamber
- runtime authority
- frontend truth

---

## CLAUDE ROLE

Claude may:

- create EncounterBoundary.tsx
- update encounter renderer imports
- wire boundary into existing encounter renderer path if safe
- preserve all renderer isolation
- preserve ChamberRouter as only environment dispatch surface
- run type-check
- run build
- return OAR1 evidence

Claude may not:

- edit monolith
- create shell abstraction
- query DB inside boundary
- move resolver/composition/release logic into boundary
- hardcode content
- infer environment
- seed content
- change release behavior
- change registry behavior

---

## NOTCHAZZ FLAGS

Raise NotChazz flag if:

- shell abstraction returns
- DB access appears in boundary
- boundary accepts raw registry rows
- boundary mutates RenderableEncounter
- boundary infers environment
- ChamberRouter is bypassed
- monolith is edited
- Crystal Chamber language appears
- presentation crosses above boundary
- authority crosses below boundary

---

## VALIDATION

Success is achieved when:

- EncounterBoundary.tsx exists
- receives only RenderableEncounter plus optional callbacks / presentation utilities
- passes encounter to ChamberRouter
- provides shared presentation frame
- provides unavailable state without inventing content
- no DB access exists
- no resolver/composition/release logic exists
- no shell terminology remains except unrelated CSS classes
- no monolith edits occur
- type-check passes
- build passes
- OAR1 documents boundary implementation and validation

Expected OAR1:

docs/oar/measures_registry/oar1_encounter_boundary_implementation_v1.meta.md

---

## CLOSE

Encounter Boundary is where arranged potential becomes encounterable.

Everything above determines.

Everything below presents.

Nothing crosses in the wrong direction.

Nothing is invented.

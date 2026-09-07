---
document_type: oar2
authority_level: working
document_scope: optics_field
title: OAR2 — Optics Field: Encounter Resolution
status: proposed
version: v1
operator: op044
system: measures_registry
---

# OAR2 — Optics Field: Encounter Resolution

## OBSERVED

Encounter renderer architecture is structurally complete.

Native order:

Codex holds.
Systems align.
Measures determine.
Field arranges.
Encounter Boundary allows.
Renderer manifests.
Optics prove.

The next unresolved layer is Optics.

Encounter Resolution belongs to Optics.

Optics observe how an encounter resolved.

## ALIGNED

Measures determine what may be encountered.

Field arranges encounter conditions.

Encounter Boundary allows encounterable state.

Renderer manifests.

Optics prove.

The who is invariant.

The system does not choose who encounters.

The system chooses what is encountered.

Encounter Resolution is the first Optics Field.

## ROUTED

Create an Optics Field concept for:

Encounter Resolution

Purpose:

Record and observe how a governed encounter resolves.

Encounter Resolution may observe:

- encounter entered
- encounter completed
- encounter abandoned
- transition selected
- capture submitted
- capture failed
- held state encountered
- unavailable state encountered
- return path taken
- continuation path taken

Encounter Resolution may not:

- determine standing
- alter release state
- mutate encounter definition
- infer participant intent
- assign certification
- assign conversion
- replace OAR
- expose private gate reason

## OPTICS FIELD BOUNDARY

Optics observe after encounter manifestation.

Optics do not create encounter.

Optics do not determine encounter.

Optics do not arrange encounter.

Optics do not govern encounter.

Optics prove encounter outcome.

## TECHNICAL SCOPE

This OAR seats the Optics Field concept and implementation boundary.

Do not build dashboard UI.

Do not alter live public behavior.

Do not cut over monolith.

If implementation is safe, create minimal type surface only:

src/measures_registry/optics/encounterResolution.ts

Allowed contents:

- EncounterResolutionEvent type
- EncounterResolutionStatus enum/type
- public-safe event shape
- no DB write unless existing optics/OAR logging surface already exists and is explicitly safe
- no analytics vendor integration

## EVENT SHAPE REQUIREMENTS

Minimum event shape should support:

- encounter_key or registry_key where already available
- surface
- environment
- resolution_status
- transition_target where applicable
- capture_type where applicable
- timestamp
- public-safe metadata only

No raw PII.

No private gate reason.

No unresolved internal state.

## CLAUDE ROLE

Claude may:

- create optics type surface
- document Encounter Resolution boundary
- add no-op helper only if useful
- avoid runtime wiring unless already safe
- run type-check
- run build
- return OAR1 evidence

Claude may not:

- build dashboard
- add analytics provider
- create DB migration
- write to DB without explicit seated surface
- modify release logic
- modify encounter definition
- modify ChamberRouter
- modify renderers
- edit monolith
- infer user intent
- expose private gate reasons

## NOTCHAZZ FLAGS

Raise NotChazz flag if:

- Optics determine standing
- Optics mutate encounter state
- Optics replace OAR
- private gate reason is exposed
- raw PII enters optics payload
- dashboard work begins
- analytics provider is added
- monolith is edited
- release behavior changes

## VALIDATION

Success is achieved when:

- Encounter Resolution is seated as Optics Field
- scope is observation only
- no standing determination occurs
- no release mutation occurs
- no dashboard is created
- no analytics provider is added
- no monolith edits occur
- type-check passes
- build passes
- OAR1 documents boundary and validation

Expected OAR1:

docs/oar/measures_registry/oar1_optics_field_encounter_resolution_v1.meta.md

---

## CLOSE

Measures determine.

Field arranges.

Encounter Boundary allows.

Renderer manifests.

Optics observe resolution.

Optics prove.

The who remains invariant.

The system chooses what is encountered.

Nothing is invented.

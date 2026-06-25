---
document_type: oar2
authority_level: working
document_scope: renderable_encounter_boundary
title: OAR2 — Introduce Renderable Encounter Boundary
status: proposed
version: v1
operator: op044
system: measures_registry
---

# OAR2 — Introduce Renderable Encounter Boundary

## OBSERVED

Encounter Composition is now separated from Encounter Profile Loader.

Current flow:

Registry Standing
→ Surface Assignment
→ Encounter Definition
→ Encounter Composition
→ Composed Encounter
→ Release Gate
→ Encounter Profile
→ Chamber Renderer

The post-gate object is still named Encounter Profile.

This creates ambiguity.

A composed encounter exists before release permission.

A renderable encounter exists only after release permission.

## ALIGNED

Composition answers:

What exists?

Release Gate answers:

May it proceed?

Rendering receives only:

Renderable Encounter

Chamber renderers should never receive held, inactive, missing, or unknown encounter state.

Chamber renderers should not know release gate exists.

If an encounter is not renderable:

the chamber renderer is never called.

## ROUTED

### 1. Introduce Renderable Encounter Type

Create or update types so:

ComposedEncounter = assembled seated encounter state before release gate.

RenderableEncounter = composed encounter after release gate passes.

RenderableEncounter must include:

- all ComposedEncounter fields
- gateResult with released standing only

### 2. Rename Post-Gate Output

Replace post-gate EncounterProfile usage with RenderableEncounter where appropriate.

EncounterProfile may remain as deprecated type alias only if needed for temporary compatibility.

Preferred:

- `ComposedEncounter`
- `RenderableEncounter`

Avoid:

- using `EncounterProfile` for post-gate state

### 3. Chamber Boundary

Future chamber renderers must accept only:

RenderableEncounter

They may not accept:

- ComposedEncounter
- raw resolver data
- registry rows
- assignment rows
- gate results that can be held

### 4. Chamber Router Boundary

Chamber Router will receive only RenderableEncounter.

If release gate fails:

the Chamber Router is not called.

### 5. Held State Boundary

Held state is rendered before chamber routing.

Held state receives:

- surface key
- held reason
- public-safe held copy

Held state must not expose internal standing.

### 6. No Rendering Implementation

Do not create chamber renderers in this OAR.

Do not wire shell.

Do not edit monolith.

Do not change live behavior.

This OAR only clarifies the post-gate boundary.

## CLAUDE ROLE

Claude may:

- update types
- update encounterProfileLoader naming/output
- update imports
- preserve compatibility only where required
- run build
- return OAR1 evidence

Claude may not:

- create chamber renderers
- wire shell
- edit monolith
- change live route behavior
- invent release authority
- expose held internals

## NOTCHAZZ FLAGS

Raise NotChazz flag if:

- chamber renderer can receive held state
- chamber router can receive held state
- RenderableEncounter can contain failed gate result
- EncounterProfile remains ambiguous
- held state renders through chamber renderer
- gate failure falls through to renderer

## VALIDATION

Success is achieved when:

- ComposedEncounter represents pre-gate assembled state
- RenderableEncounter represents post-gate released state
- chamber renderer contracts require RenderableEncounter
- chamber router contract requires RenderableEncounter
- held state remains outside chamber rendering
- no live behavior changes occur
- build passes
- OAR1 documents type changes and boundary enforcement

Expected OAR1:

docs/oar/measures_registry/oar1_introduce_renderable_encounter_boundary_v1.meta.md

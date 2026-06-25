---
document_type: oar2
authority_level: working
document_scope: chamber_router
title: OAR2 — Encounter Renderer Chamber Router
status: proposed
version: v1
operator: op044
system: measures_registry
---

# OAR2 — Encounter Renderer Chamber Router

## OBSERVED

Encounter Renderer infrastructure now has:

- Registry Resolver
- Surface Assignment
- Encounter Composition
- Release Gate
- Renderable Encounter boundary
- Obsidian Chamber Renderer

The next missing boundary is Chamber Router.

Without Chamber Router, shell or chamber renderers may begin owning dispatch logic.

This OAR seats routing between renderable encounter and chamber renderer.

## ALIGNED

The chamber router receives only:

RenderableEncounter

It does not receive:

- resolver data
- composed encounter
- held state
- registry rows
- assignment rows
- raw DB response

The router routes.

It does not decide authority.

It does not compose.

It does not gate.

It does not render content.

## AUTHORITY ORDER

Codex
→ Registry Standing
→ Surface Assignment
→ Encounter Definition
→ Encounter Composition
→ Release Gate
→ Renderable Encounter
→ Chamber Router
→ Chamber Renderer
→ Surface Renderer

## ROUTED

### 1. Create Chamber Router

Create:

src/measures_registry/encounter_renderer/router/ChamberRouter.tsx

Purpose:

Route a RenderableEncounter to the correct chamber renderer.

### 2. Router Input

Accept only:

RenderableEncounter

Required props may include shell-provided callbacks:

- onNavigate
- onCaptureAssessment
- renderHeader
- renderSystemFooter
- registryTokenStyle

These are presentation/runtime callbacks only.

They are not authority.

### 3. Renderer Dispatch

Dispatch using:

encounter.chamberAssignment

The value must already be seated by DB surface assignment and carried through RenderableEncounter.

Do not infer chamber from:

- route
- surface name
- material name alone
- registry key
- component availability

### 4. Supported Dispatch

Current dispatch:

- ObsidianChamberRenderer for `ObsidianChamberRenderer`

Future dispatch placeholders may return governed renderer-gap state for:

- LapisChamberRenderer
- MarbleChamberRenderer
- CrystalSeatRenderer

Do not implement Lapis, Marble, or Crystal renderers in this OAR.

### 5. Renderer Gap

If chamber assignment is recognized but renderer is not yet implemented:

render a public-safe renderer gap state.

Do not expose internal DB standing.

Do not expose protected terms.

If chamber assignment is unknown:

render public-safe unavailable state.

Do not fallback to Obsidian.

### 6. No Authority Logic

Chamber Router may not:

- query DB
- inspect release_state
- inspect is_active
- call releaseGate
- call encounterComposition
- call registryResolver
- call encounterProfileLoader
- invent fallback chamber
- rewrite encounter
- mutate encounter
- determine transition validity

### 7. No Live Cutover

Do not wire Chamber Router into live app entry point.

Do not replace monolith.

Do not change current public behavior.

This OAR creates router boundary only.

## CLAUDE ROLE

Claude may:

- create ChamberRouter
- import ObsidianChamberRenderer
- type props against RenderableEncounter
- implement renderer-gap state
- run build
- return OAR1 evidence

Claude may not:

- implement additional chamber renderers
- wire live shell
- edit monolith
- query DB
- introduce release logic
- introduce composition logic
- hardcode route/surface dispatch

## NOTCHAZZ FLAGS

Raise NotChazz flag if:

- router accepts held state
- router accepts ComposedEncounter
- router queries DB
- router performs release logic
- router infers chamber from surface name
- router falls back to Obsidian
- router mutates encounter
- router implements Lapis/Marble/Crystal early

## VALIDATION

Success is achieved when:

- ChamberRouter exists
- accepts only RenderableEncounter
- dispatches from `encounter.chamberAssignment`
- routes Obsidian to ObsidianChamberRenderer
- returns public-safe gap for unimplemented chambers
- performs no DB access
- performs no release logic
- performs no composition logic
- performs no live cutover
- build passes
- OAR1 documents router boundary and validation

Expected OAR1:

docs/oar/measures_registry/oar1_encounter_renderer_chamber_router_v1.meta.md

## CLOSE

Chamber Router separates routing from rendering.

Renderers render.
Router routes.
Registry governs.

---
document_type: oar2
authority_level: working
document_scope: publication_design_audit
title: OAR2 — Audit unDrifted Editorial Design Authority and Drift Origin
status: proposed
version: v1
operator: op044
system: measures_registry
native_stack:
  codex: database
  field: schema
  measures: registry
  oar2: observed_aligned_routed
  chazz: systems
  free: frontend_replacement_encounter_environment
tags:
  - oar2
  - undrifted
  - editorial-design
  - design-authority
  - design-profile
  - drift-audit
  - lapis-chamber
  - publication
  - free-runtime
---

# OAR2 — Audit unDrifted Editorial Design Authority and Drift Origin

## OBSERVED

The live `/undrifted` surface is functioning, but the current visual presentation no longer appears aligned with the previously seated editorial/magazine design intent.

Observed current-state symptoms:

- content is constrained to a narrow central column
- large viewport space is unused
- masthead appears detached from the issue layout
- assessment feature reads as a generic embedded card
- featured articles read as small blog cards rather than editorial issue features
- typography hierarchy no longer communicates a strong magazine-cover surface
- Issue 001 identity is present but visually underexpressed
- page appears component-assembled rather than governed as an editorial issue

Prior OAR1 findings confirmed that `/undrifted` is DB-driven through `measures_encounter_def.metadata`, with runtime resolving through Supabase tables and `LapisChamberRenderer.tsx`.

The same OAR1 also returned that the registered asset/issue model and live `/undrifted` runtime remain disconnected.

This OAR2 does not restore styling yet.

This OAR2 audits whether a seated design profile already exists, whether it is consumed by FREE, and how the current visual drift occurred.

## ALIGNED

unDrifted must remain a governed publication surface.

Design must not be restored through arbitrary CSS patching.

If a design profile is already seated, runtime must consume it or return why it is not consumed.

If no seated design profile exists, that absence must be returned as the blocker before any restoration OAR proceeds.

Authority order remains:

Codex -> Field -> Measures -> OAR2 -> Chazz -> Executor -> FREE

Design authority must resolve through Codex / Field / Measures state, not frontend preference.

## ROUTED

### 1. Inspect seated design authority

Inspect whether unDrifted already has a seated design profile or equivalent design authority.

Check at minimum:

- `measures_design_token`
- `measures_encounter_def.metadata` for `encounter_key = 'undrifted'`
- `measures_encounter_surface_assignment`
- any seeded migration that references:
  - `undrifted`
  - `issue`
  - `publication`
  - `magazine`
  - `editorial`
  - `design_token`
  - `lapis_chamber_encounter`

Return whether the design authority exists as:

- explicit design profile
- design token set
- encounter metadata layout
- CSS-only implementation
- component-only implementation
- absent / not seated

### 2. Inspect renderer consumption

Inspect whether the runtime consumes any seated design authority.

Check at minimum:

- `src/measures_registry/encounter_renderer/resolver/registryResolver.ts`
- `src/measures_registry/encounter_renderer/chambers/LapisChamberRenderer.tsx`
- `UnDriftedIndex` component or inline component body
- CSS files defining:
  - `undrifted`
  - `undrifted-cover`
  - `undrifted-masthead`
  - `undrifted-insights-grid`
  - `undrifted-assessment`
  - `undrifted-issue`
  - related publication classes

Return:

- which design tokens are queried
- which design tokens are used
- whether layout regions are DB-driven or hardcoded
- whether CSS is overriding seated layout
- whether component structure is hardcoded
- whether the renderer has any profile-based layout switch

### 3. Determine drift origin

Use git history and file inspection to identify what changed the design.

Inspect recent commits touching:

- `LapisChamberRenderer.tsx`
- unDrifted components
- publication CSS
- global CSS
- design token migrations
- unDrifted metadata migrations
- issue/publication migrations

Return:

- likely commit hash(es)
- file(s) changed
- what changed
- whether change came from OAR scope or ad hoc styling
- whether change narrowed layout, altered max-width, reduced typography, replaced cover layout, or changed card/grid behavior

### 4. Compare current surface to intended design standing

Compare current implementation against intended editorial design requirements:

- magazine-cover feel
- active use of viewport
- strong masthead + issue identity
- cover story as dominant feature
- assessment CTA as launch center
- featured articles as editorial spread, not blog list
- publication identity stronger than generic page layout
- no SaaS/card-stack feel
- issue structure repeatable for future issues

Return which requirements are currently satisfied, partially satisfied, or failed.

### 5. Return restoration path without implementing it

Do not modify styling or renderer in this audit unless needed only to inspect.

Return the recommended restoration path as one of:

- bind existing seated design profile to renderer
- seat missing Publication Design Profile
- repair CSS regression
- repair renderer region mapping
- revert specific commit
- create follow-up OAR2 for editorial design restoration

### 6. Preserve publication release sequence

This audit does not replace the Publication Release pipeline OAR2.

It informs it.

If design authority is absent, recommend that Publication Design Profile be seated before or alongside Publication Release.

## CODY / CLAUDE ROLE

Executor may:

- inspect DB metadata and design-token rows
- inspect source files
- inspect migrations
- inspect git history
- identify drift origin
- return exact blockers
- recommend restoration OAR scope

Executor may not:

- restyle `/undrifted`
- overwrite DB metadata
- hardcode design profile into frontend
- replace issue content
- create new routes
- install libraries
- collapse this audit into publication release implementation

## VALIDATION

Return OAR1 with:

- whether seated unDrifted design authority exists
- where it exists if present
- whether FREE consumes it
- current renderer/CSS source of layout
- likely drift-origin commits or files
- current design requirement comparison
- recommended restoration path
- blockers

## EXPECTED OAR1

OAR/OAR1/publication/oar1_audit_undrifted_editorial_design_authority_and_drift_origin_v1.meta.md

## CLOSE

This is an audit OAR.

Do not fix before locating authority.

Design restoration must follow seated authority.

Codex holds.
Field structures.
Measures registers.
OAR2 routes.
FREE renders.

---
document_type: oar2
authority_level: working
document_scope: publication_synchronization
title: OAR2 - Seat unDrifted Publication Synchronization and Launch-Ready Encounter Projection
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
---

# OAR2 - Seat unDrifted Publication Synchronization and Launch-Ready Encounter Projection

## OBSERVED

Two audits have now established the actual publication architecture.

Publication authority already exists.

The launch problem is not missing publication data.

The launch problem is that FREE renders from a stripped encounter copy that has drifted from the richer publication authority.

Current observations:

- measures_publication_registry contains the canonical publication identity.
- measures_publication_dispatch contains the canonical article dispatch records.
- measures_publication_release is the emerging issue/release authority.
- measures_encounter_def contains a render projection only.
- FREE currently renders only measures_encounter_def.
- measures_encounter_def has already diverged from publication authority.
- publication style contract was reduced to an inert key during projection.
- issue metadata has already drifted between publication and encounter copies.
- the live /undrifted encounter therefore underrepresents the publication.

Launch should correct this synchronization rather than creating another authority surface.

## ALIGNED

Publication authority remains distinct from encounter rendering.

Authority order:

Codex
-> Field
-> Measures
-> Publication Registry
-> Publication Release
-> Encounter Projection
-> FREE
-> Public

Publication Registry owns publication identity.

Publication Dispatch owns article dispatch.

Publication Release owns release state.

Encounter Projection exists only so FREE can render efficiently.

Encounter Projection must never become an independently edited authority surface.

## ROUTED

### 1. Confirm canonical ownership

Confirm and document the following ownership:

Publication Registry

- publication identity
- publication contracts
- publication architecture
- publication style contract
- issue metadata
- publication integrations
- publication branding

Publication Dispatch

- dispatch bodies
- published articles
- article metadata
- article urls

Publication Release

- active issue
- release state
- archive transition
- publication state

Encounter Projection

- render-ready projection only
- no independent authority
- regenerated from publication authority

### 2. Normalize Encounter Projection

Remove silent divergence between:

- measures_publication_registry
- measures_encounter_def

Return every overlapping field.

Identify:

- canonical source
- projected destination
- fields that should never be copied
- fields safe to project

Correct existing drift including:

- issue metadata
- publication style contract
- article selection metadata
- publication hierarchy metadata

### 3. Restore launch encounter

Using the canonical publication data, restore the FREE encounter so that it reflects the intended launch experience.

Launch objectives:

- editorial magazine feel
- dominant publication identity
- full viewport usage
- assessment as primary launch center
- stronger editorial hierarchy
- publication-first presentation
- repeatable issue layout

Do not redesign.

Restore coherence using existing publication authority wherever possible.

### 4. Preserve existing architecture

Do not merge Publication Registry into Encounter Projection.

Do not move publication ownership into FREE.

Do not duplicate publication metadata.

Do not create additional publication authority.

Maintain separation between:

Publication
Issue
Dispatch
Release
Encounter

### 5. Prepare launch verification

Return production verification for:

- desktop
- tablet
- mobile
- article links
- assessment CTA
- publication hierarchy
- issue metadata
- responsive layout
- publication styling

### 6. Hold future expansion

Do not implement:

- contributor registry
- social registry
- publication feed
- comments
- library expansion
- issue archive runtime

Those remain post-launch registry work.

## EXECUTOR ROLE

Executor may:

- normalize encounter projection
- reconnect publication style contract
- reconnect publication metadata
- regenerate encounter projection
- improve launch presentation
- repair synchronization
- remove duplicated authority

Executor may not:

- create new publication authority
- merge registry tables
- redesign publication architecture
- hardcode encounter content
- bypass publication registry
- implement future publication features

## VALIDATION

Return OAR1 with:

- synchronization changes
- fields normalized
- publication ownership confirmation
- encounter projection status
- launch readiness assessment
- responsive verification
- remaining blockers

## EXPECTED OAR1

OAR/OAR1/publication/oar1_seat_undrifted_publication_synchronization_and_launch_ready_encounter_projection_v1.meta.md

## CLOSE

Publication remains authority.

Encounter remains projection.

FREE renders the projection.

Launch reflects the publication.

Codex holds.

Field structures.

Measures registers.

Publication governs.

Encounter projects.

FREE renders.

---
document_type: oar2
authority_level: working
document_scope: publication_launch
title: OAR2 - Finalize unDrifted Launch Projection and Encounter Profile
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

# OAR2 - Finalize unDrifted Launch Projection and Encounter Profile

## OBSERVED

unDrifted publication authority has been confirmed.

Publication Registry owns publication identity.

Publication Dispatch owns article dispatch records.

Encounter Projection owns render-ready state only.

FREE renders the projection.

The synchronization OAR1 regenerated the encounter projection from publication authority and reconnected the existing style contract end-to-end.

Remaining launch blockers:

- code changes from the synchronization OAR are not yet deployed
- assessment_feature has no canonical Publication Registry source
- landing_design_contract has no canonical Publication Registry source
- viewport usage and CTA prominence remain underpowered
- no Publication Encounter Profile exists to govern editorial composition

The goal is to get /undrifted launch-ready without expanding scope.

## ALIGNED

Do not create a blog.

Do not create contributor registry.

Do not create social registry.

Do not create feed.

Do not create library/archive runtime.

Do not redesign from scratch.

This OAR finalizes the launch encounter by:

1. deploying the synchronization work
2. seating missing canonical ownership for assessment_feature and landing_design_contract
3. seating a Publication Encounter Profile for composition authority
4. projecting that profile into FREE
5. verifying /undrifted for public promotion

Publication identity remains separate from encounter composition.

Publication Registry governs publication identity.

Publication Encounter Profile governs composition.

Encounter Projection renders both into FREE.

## ROUTED

### 1. Deploy synchronization work

Build and deploy the prior synchronization changes.

Required:

- run registry build
- deploy production site
- verify deployed /undrifted reflects:
  - regenerated projection
  - canonical style contract
  - corrected role call
  - corrected issue metadata
  - obsidian publication palette

Return deployment result and production verification.

### 2. Resolve assessment_feature ownership

Move assessment_feature out of projection-only ambiguity.

Preferred route:

- seat assessment_feature as canonical metadata under measures_publication_registry for publication_key = undrifted
- regenerate measures_encounter_def from Publication Registry

If executor determines assessment_feature must remain projection-only, return blocker and rationale.

Do not leave ambiguous ownership unrecorded.

### 3. Resolve landing_design_contract ownership

Move landing_design_contract out of projection-only ambiguity.

Preferred route:

- seat landing_design_contract or successor composition reference under measures_publication_registry
- ensure measures_encounter_def receives it only as projection

If landing_design_contract is superseded by Publication Encounter Profile, record that explicitly and prevent both from acting as competing layout authorities.

### 4. Seat Publication Encounter Profile

Create a governed publication encounter composition profile for unDrifted.

This profile governs composition, not publication identity.

Minimum profile fields:

- profile_key: undrifted_publication_encounter_profile_v1
- publication_key: undrifted
- route_scope: /undrifted
- encounter_type: publication_landing
- viewport_contract
- region_order
- region_weights
- masthead_behavior
- cover_story_behavior
- assessment_feature_behavior
- featured_article_behavior
- role_call_behavior
- responsive_rules
- forbidden_patterns

Required launch composition:

- use more of desktop viewport
- make the publication masthead and Issue 001 identity feel unified
- make cover story dominant
- make assessment CTA visually primary as launch center
- make featured articles feel like editorial spread, not blog cards
- reduce generic SaaS/card-stack feel
- preserve mobile readability
- preserve DB-driven content

### 5. Wire profile into projection and FREE

Do not hardcode profile behavior as invisible frontend truth.

Allowed:

- project profile metadata into measures_encounter_def
- consume projected profile data in UnDriftedIndex
- use CSS variables or data attributes derived from the profile
- scope CSS under the unDrifted layout contract/profile

Disallowed:

- hardcoded issue-specific content
- frontend-owned authority
- new publication authority surface
- unregistered CSS redesign with no profile reference

### 6. Verify launch surface

Verify production or local preview if deploy is not available.

Required checks:

- desktop 1440px
- laptop width
- tablet
- mobile
- scroll behavior
- article links
- assessment CTA route to /ai-operations-assessment
- issue metadata
- publication styling
- no console errors
- no horizontal overflow
- no hidden CTA
- no route regression

### 7. Hold future expansion

Do not implement:

- contributors
- social registry
- feed
- comments
- issue archive
- magazine flipbook
- library route

These remain post-launch registry work.

## EXECUTOR ROLE

Executor may:

- deploy synchronization work
- create migration for canonical assessment_feature ownership
- create migration for canonical landing_design_contract or profile reference
- create Publication Encounter Profile metadata
- update projection regeneration script
- update scoped renderer/CSS to consume projected profile
- verify production or preview

Executor may not:

- overwrite publication identity by hand
- move publication authority into FREE
- create duplicate publication authority
- hardcode article content
- implement future expansion features
- install new libraries
- invent new public claims

## VALIDATION

Return OAR1 with:

- deployment status
- files changed
- migrations created/applied
- ownership resolution for assessment_feature
- ownership resolution for landing_design_contract
- Publication Encounter Profile standing
- projection regeneration result
- FREE rendering verification
- desktop/tablet/mobile screenshots or notes
- launch readiness assessment
- blockers, if any

## EXPECTED OAR1

OAR/OAR1/publication/oar1_finalize_undrifted_launch_projection_and_encounter_profile_v1.meta.md

## CLOSE

unDrifted is a governed publication surface.

Publication Registry owns identity.

Publication Dispatch owns articles.

Publication Encounter Profile owns composition.

Encounter Projection renders authority.

FREE renders projection.

Launch only.

Expansion later.

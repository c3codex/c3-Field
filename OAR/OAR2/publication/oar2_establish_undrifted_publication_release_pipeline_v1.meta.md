---
document_type: oar2
authority_level: working
document_scope: publication_release
title: OAR2 — Establish unDrifted Publication Release Pipeline
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
  - publication-release
  - issue-registry
  - asset-registry
  - current-issue
  - library
  - future-contributors
  - future-social-registry
  - future-feed
---

# OAR2 — Establish unDrifted Publication Release Pipeline

## OBSERVED

unDrifted Issue 01 has been registered as an asset-side issue object.

The live `/undrifted` renderer remains DB-driven through `measures_encounter_def.metadata`.

The file-based registered asset registry and live DB-rendered publication state are currently disconnected.

This creates a two-surface authority problem:

Registered Assets
-> manual or absent sync
-> DB metadata
-> FREE renderer

The current blocker is not primarily route creation.

The primary blocker is the missing governed Publication Release pipeline that binds registered assets into Codex/Measures-rendered publication state.

## ALIGNED

unDrifted must not become a frontend blog.

unDrifted must become a governed publication registry surface.

Near-term scope:

Publication Registry
-> Issue
-> Release
-> Registered Assets
-> Codex/DB publication state
-> FREE renderer

Future scope is recognized but held:

unDrifted
-> Issues
-> Articles
-> Contributors
-> Social Registry
-> Feed
-> Library

Contributor, social registry, and feed expansion must be registered as future surfaces only.

They may not be implemented inside this OAR2 unless explicitly seated by a later OAR2.

## ROUTED

### 1. Seat Publication Release as the missing governance object

Create or define a release model that sits between Issue and rendered publication state.

Required relation:

Issue
-> Publication Release
-> Registered Assets
-> Publication State
-> FREE

The release object must resolve:

- active issue
- approved article assets
- approved banner assets
- publication state
- archive state
- renderer eligibility

### 2. Resolve Issue 01 content authority

Return an explicit content decision surface for Operator review.

Issue 01 must be resolved as one of:

- keep live DB articles
- replace with newly registered launch/research assets
- append registered assets to current live issue
- split current live articles and new registered assets into separate issue states

Do not overwrite live DB article links without explicit operator direction.

### 3. Define DB sync path

Implement one governed path from registered asset state to DB-rendered state.

Allowed approaches:

- migration-driven sync
- controlled script-driven sync
- manual migration generated from registered assets

Disallowed:

- frontend reads files directly as authority
- duplicate hand-edited DB content without trace
- renderer-owned publication truth
- silent replacement of live articles

### 4. Prepare renderer routing after release model is seated

After Publication Release exists, prepare:

- `/undrifted`
- `/undrifted/issue-01`
- `/undrifted/library`

Routing rules:

- `/undrifted` renders current active issue
- `/undrifted/issue-01` renders Issue 01 specifically
- `/undrifted/library` renders archived and available issues

If only Issue 01 exists, library may render an honest empty/archive-pending state.

### 5. Preserve future expansion as registry objects

Do not implement yet.

Record future registry expansion targets:

Contributor Registry:

- contributor profile
- role
- byline
- approved assets
- publication permissions

Social Registry:

- platform accounts
- post assets
- campaign records
- scheduled status
- published status
- engagement snapshots

Feed Registry:

- feed items
- source issue
- source article
- source social post
- visibility state
- pinned state
- featured state

These are future registry objects, not current launch requirements.

### 6. Maintain launch scope

This OAR2 resolves the publication release seam only.

It does not build:

- contributor onboarding
- public contributor profiles
- social registry UI
- independent feed runtime
- comment system
- social network features
- page-flip animation library

## CODY / CLAUDE ROLE

Executor may:

- inspect current asset registry and issue registry
- inspect `/undrifted` DB-rendered state
- define required schema or metadata bridge
- create migration or sync surface if safe
- create route preparation only after release authority is clear
- return blockers honestly

Executor may not:

- overwrite live articles without explicit operator direction
- make frontend the authority
- hardcode issue content into renderer
- collapse future contributor/social/feed scope into this launch OAR2
- install new libraries
- invent unpublished article URLs

## VALIDATION

Return OAR1 with:

- files changed
- DB migrations created or explicitly blocked
- publication release model standing
- Issue 01 content authority decision status
- `/undrifted` rendering status
- `/undrifted/issue-01` status
- `/undrifted/library` status
- blockers, if any

## EXPECTED OAR1

OAR/OAR1/publication/oar1_establish_undrifted_publication_release_pipeline_v1.meta.md

## CLOSE

unDrifted is not a blog.

unDrifted is a governed publication surface.

The next valid seam is Publication Release.

Codex holds.
Field structures.
Measures registers.
OAR2 routes.
FREE renders.

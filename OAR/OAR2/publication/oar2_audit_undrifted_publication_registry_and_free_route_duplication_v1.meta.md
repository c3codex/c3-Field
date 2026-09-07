---
document_type: oar2
authority_level: working
document_scope: publication_registry_audit
title: OAR2 - Audit unDrifted Publication Registry and FREE Route Duplication
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
  - publication-registry
  - free-route
  - duplication-audit
  - route-authority
  - issue-profile
  - publication-dispatch
---

# OAR2 - Audit unDrifted Publication Registry and FREE Route Duplication

## OBSERVED

Recent audits established that /undrifted is a FREE-rendered public route driven by measures_encounter_def.metadata.

The current read is that /undrifted may not represent the whole unDrifted publication/profile object.

Known related surfaces include:

- /undrifted
- /publication/structural_drift
- measures_encounter_def
- measures_encounter_surface_assignment
- prior publication registry tables or migrations
- registered file assets under Assets/
- Issue 01 file registry state

Before seating a Publication Encounter Profile or Publication Release pipeline, determine whether publication identity and FREE route state are duplicated, collapsed, or correctly distinct in DB.

## ALIGNED

Do not create new publication tables, design profiles, route rows, or migrations before this audit resolves.

The audit must preserve this distinction:

unDrifted Publication/Profile does not equal /undrifted FREE route.
unDrifted Publication/Profile does not equal /publication dispatch route.
unDrifted Publication/Profile does not equal article asset.
unDrifted Publication/Profile does not equal issue release.

Publication identity must not be inferred from route behavior alone.

Authority order remains:

Codex -> Field -> Measures -> OAR2 -> Chazz -> Executor -> FREE

## ROUTED

### 1. Inventory all unDrifted publication-related DB surfaces

Inspect live DB schema and rows for all unDrifted/publication-related objects.

Check at minimum:

- measures_registry
- measures_encounter_def
- measures_encounter_surface_assignment
- measures_media_map
- measures_design_token
- any table matching or related to publication, issue, article, asset, dispatch, undrifted, content profile, or release

Return:

- table name
- relevant key columns
- matching rows
- purpose inferred from row data
- whether active, superseded, or unused

### 2. Determine route authority

For each public route, identify its DB source and renderer path.

Routes to inspect:

- /undrifted
- /publication/structural_drift
- any other /publication/*
- any existing /undrifted/*

Return:

- route
- table that maps route
- surface_key
- encounter_key or registry_key
- renderer component
- metadata source
- whether route is active, stubbed, missing, or legacy

### 3. Determine publication identity authority

Identify whether unDrifted exists as a publication/profile object independent of /undrifted.

Return one classification:

- publication identity is seated and active
- publication identity is seated but superseded
- publication identity exists only as route metadata
- publication identity exists only as file registry
- publication identity is absent / not seated

### 4. Determine issue authority

Identify whether Issue 01 exists in DB independently of /undrifted metadata.

Return:

- current Issue 01 authority surface
- whether Issue 01 is active in DB
- whether file-registered Issue 01 duplicates or conflicts with DB Issue 01
- whether issue state is route-bound or publication-bound

### 5. Determine article/content authority

Compare article/content sources:

- live /undrifted DB metadata article set
- /publication/structural_drift dispatch state
- registered file article assets
- prior publication registry records
- Paragraph publication URLs

Return:

- which articles are active in DB
- which articles are active in file registry
- which articles are published externally
- whether there are duplicates, conflicts, or intentionally distinct states

### 6. Identify duplication, collapse, or correct distinction

Return findings under:

- duplicated authority
- collapsed concepts
- legacy or superseded state
- correctly distinct surfaces
- missing canonical object

Specifically answer:

- Is /undrifted duplicating publication identity?
- Is publication identity duplicating /undrifted?
- Is /publication/structural_drift a dispatch surface or a publication registry object?
- Is Issue 01 duplicated between DB metadata and file registry?
- Is article state duplicated between DB metadata and registered assets?
- Which object should own publication profile?
- Which object should own issue release?
- Which object should own route rendering?

### 7. Recommend next governing sequence

Recommend whether the next OAR should be:

- Publication Registry normalization
- Publication Release pipeline
- Publication Encounter Profile
- route cleanup
- DB migration
- file-to-DB sync
- no-op because current distinction is already valid

Do not implement the recommendation in this audit.

## EXECUTOR ROLE

Executor may:

- inspect live DB schema and rows
- inspect migrations
- inspect source renderer route resolution
- inspect registered asset files
- compare DB and file registry state
- return blockers honestly

Executor may not:

- modify DB
- create migrations
- change routes
- change CSS
- change renderer logic
- overwrite publication metadata
- resolve content authority by assumption
- collapse publication, profile, route, issue, or article concepts

## VALIDATION

Return OAR1 with:

- DB surfaces inspected
- route authority map
- publication identity classification
- issue authority classification
- article/content authority comparison
- duplication/collapse findings
- correctly distinct surfaces
- missing canonical objects
- recommended next OAR
- blockers, if any

## EXPECTED OAR1

OAR/OAR1/publication/oar1_audit_undrifted_publication_registry_and_free_route_duplication_v1.meta.md

## CLOSE

Do not seat new publication authority until existing authority surfaces are known.

unDrifted publication/profile is not assumed to equal /undrifted.

The /undrifted route is presumed to be a FREE-rendered route unless DB evidence proves otherwise.

Codex holds.
Field structures.
Measures registers.
OAR2 routes.
FREE renders.

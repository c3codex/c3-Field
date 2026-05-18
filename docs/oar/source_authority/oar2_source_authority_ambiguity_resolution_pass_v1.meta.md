---
document_type: oar2
authority_level: working
document_scope: source_authority
title: OAR2 — Source Authority Ambiguity Resolution Pass
status: proposed
version: v1
operator: op044
date: 2026-05-17
native_stack:
  codex: database
  field: schema
  measures: registry
  chazz: systems
tags:
  - source-authority
  - ambiguity-resolution
  - supersession-review
  - runtime-governance
  - codex-normalization
source_alignment:
  - OAR1 Source Authority Candidate Folder Assembly
  - OAR1 Source Reference Classification Pass
  - OAR1 Source Reference Codex Seating Schema Pass
---

# OAR2 — Source Authority Ambiguity Resolution Pass

## OBSERVED

Candidate folder assembly completed successfully.

The following review surfaces now exist:

- docs/source_authority/candidates/
- docs/source_authority/candidates/candidate_manifest.meta.md

30 Codex-candidate source files were copied into the review folder while preserving originals.

Ambiguity groups were made explicit:

- renderer_contract
- frontend_encounter_contract
- phase_map_definition
- media_authority
- oar_lifecycle
- oar_spine
- encounter_contract
- release_access
- notification_runtime
- process_runtime

## ALIGNED

This is a resolution-planning pass.

Purpose:

- resolve source-reference ambiguity before migration proposal

This pass does not:

- mutate DB
- declare Codex authority
- delete source files
- rewrite original source docs
- insert source references
- execute schema migration

Ambiguity resolution determines standing only.

## ROUTED

### 1. Ambiguity-group review

Each ambiguity group must receive one resolution standing:

- canonical
- superseded
- merged
- parallel
- draft_only
- runtime_active_pending_authority
- hold_for_operator_review

### 2. Resolution fields

Each reviewed candidate should receive:

- candidate_key
- ambiguity_group
- current_file
- original_path
- resolution_standing
- canonical_reference_key
- superseded_by
- merge_target
- runtime_dependency
- operator_review_required
- notes

### 3. Resolution rules

#### canonical

Use when one reference should become the primary candidate for Codex seating.

#### superseded

Use when a reference is preserved for lineage but should not govern future seating.

#### merged

Use when two or more references must be reconciled into one future canonical source.

#### parallel

Use when references are related but govern distinct scopes.

#### draft_only

Use when the reference is not ready for authority review.

#### runtime_active_pending_authority

Use when runtime currently depends on the reference but Codex authority remains unresolved.

#### hold_for_operator_review

Use when Chazz or Cody cannot safely resolve without operator decision.

### 4. Required ambiguity groups

Resolve at minimum:

- renderer_contract
- frontend_encounter_contract
- phase_map_definition
- media_authority
- oar_lifecycle
- oar_spine
- encounter_contract
- release_access
- notification_runtime
- process_runtime

### 5. Output file

Create:

- docs/source_authority/candidates/ambiguity_resolution_manifest.meta.md

### 6. Preserve candidate manifest

Do not replace:

- candidate_manifest.meta.md

The ambiguity resolution manifest is an additional review layer.

### 7. Authority boundary

Resolution standing does not equal Codex seating.

Rules:

- canonical does not equal Codex authority
- superseded does not equal deleted
- merged does not equal rewritten
- runtime_active_pending_authority does not equal approved authority

## CODY ROLE

Cody may:

- read candidate_manifest.meta.md
- inspect copied candidates
- identify duplicate or superseding references
- assign proposed resolution standings
- flag operator-review cases
- create ambiguity_resolution_manifest.meta.md

Cody may not:

- delete originals
- rewrite source docs
- declare Codex seating
- perform DB mutation
- execute migration
- silently merge source bodies

## VALIDATION

This OAR2 resolves successfully when:

- ambiguity_resolution_manifest.meta.md exists
- all ambiguity groups receive review standing
- canonical, superseded, merged, and parallel states are visible
- operator-review cases are flagged
- no authority claim occurs

## EXPECTED NEXT OAR

OAR2 — Source Reference Schema Migration Proposal v1

## CLOSE

Candidate files are gathered.

Ambiguity must be resolved before migration.

Authority seating still comes later.

---
document_type: oar2
authority_level: working
document_scope: source_authority
title: OAR2 — Source Authority Candidate Folder Assembly
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
  - candidate-folder
  - ambiguity-cleanup
  - source-review
  - codex-normalization
source_alignment:
  - OAR1 Source Reference Inventory Pass
  - OAR1 Source Reference Classification Pass
  - OAR1 Source Reference Codex Seating Schema Pass
---

# OAR2 — Source Authority Candidate Folder Assembly

## OBSERVED

Source-reference candidates are distributed across multiple repository surfaces:

- docs/_source
- docs/process
- docs/concordance
- docs/c3_field
- docs/oar
- src/c3_field_convergence
- src/measures_of_inanna
- src/measures_registry
- functions/api
- scripts
- supabase/migrations

Classification also exposed unresolved ambiguity groups requiring cleanup before Codex seating:

- renderer_contract_seed_v1 vs database_render_contract_manifest
- frontend_encounter_contract_condensed vs session 21 companion rules
- field_definition_phase_map_v2 vs measures_seed_phase_map_registry_definition
- media governance trio vs later media authority OAR repairs
- OAR lifecycle vs OAR2 generation/handoff process

## ALIGNED

This is a cleanup and review-preparation pass.

Purpose:

- gather Codex source-reference candidates into one bounded review folder
- without moving originals
- without declaring authority
- without DB mutation

This preserves:

- original source paths
- lineage visibility
- supersession review
- seeded vs Codex-seated distinction

Candidate folder assembly does not equal Codex seating.

## ROUTED

### 1. Candidate review folder

Create target folder:

- docs/source_authority/candidates/

### 2. Copy candidates, do not move originals

Original files remain in place.

Candidate copies are review surfaces only.

Rules:

- copy does not equal authority
- candidate does not equal seated
- review folder does not equal Codex

### 3. Candidate manifest

Create:

- docs/source_authority/candidates/candidate_manifest.meta.md

Manifest fields:

- candidate_key
- candidate_filename
- original_path
- source_family
- authority_scope
- governance_function
- standing
- risk_level
- ambiguity_group
- codex_candidate
- notes

### 4. Ambiguity groups

Minimum ambiguity groups:

- renderer_contract
- frontend_encounter_contract
- phase_map_definition
- media_authority
- oar_lifecycle

### 5. Preserve source standing

Candidate manifest must preserve standing from classification:

- draft
- written
- seeded
- active_reference
- codex_candidate

No row may be upgraded to codex_seated.

### 6. Exclusions

This pass excludes:

- DB mutation
- Codex seating
- schema migration
- source rewriting
- supersession resolution
- runtime enforcement

## CODY ROLE

Cody may:

- create candidate folder
- copy candidate source files
- generate candidate manifest
- preserve original paths
- flag missing files
- flag duplicate or ambiguous candidates

Cody may not:

- move originals
- delete originals
- declare authority
- rewrite source content
- insert DB rows
- resolve supersession without operator review

## VALIDATION

This OAR2 resolves successfully when:

- candidate folder exists
- candidate manifest exists
- candidate source files are copied
- original paths remain preserved
- ambiguity groups are visible
- no authority state changes occur

## EXPECTED NEXT OAR

OAR2 — Source Authority Ambiguity Resolution Pass v1

## CLOSE

Gather first.

Resolve ambiguity second.

Seat authority later.

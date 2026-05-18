---
document_type: oar2
authority_level: working
document_scope: source_authority
title: OAR2 — Source Reference Classification Pass
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
  - classification
  - semantic-governance
  - runtime-risk
  - codex-normalization
source_alignment:
  - Seed Concordance
  - The 21 of Coherence
  - Seeded Reference Control
  - OAR2 Source Reference Inventory Pass
---

# OAR2 — Source Reference Classification Pass

## OBSERVED

The inventory pass completed while preserving the required distinction:

inventory visibility ? authority recognition

The inventory confirmed:

- no DB mutation
- no Codex seating declared
- no markdown file treated as authority
- seeded references remained distinct from Codex authority

The inventory also exposed unresolved authority ambiguity:

- append-only Codex records are not confirmed
- DB distinction between seeded and Codex-seated remains unresolved
- source lineage and supersession remain unresolved

## ALIGNED

This pass is c2 Contribute work.

Purpose:

- classify what each source reference contributes
- assign reviewable standing
- expose runtime and governance risk
- preserve distinction from authority seating

This OAR2 does not:

- mutate DB
- create Codex authority tables
- declare Codex seating
- rewrite source docs
- resolve runtime enforcement

## ROUTED

### 1. Classification targets

Each source reference receives:

- source_family
- authority_scope
- governance_function
- standing
- codex_candidate
- risk_level
- next_action

### 2. Authority scope values

Allowed authority scope values:

- semantic
- process
- runtime
- frontend
- encounter
- migration
- role
- verification
- media
- infrastructure

### 3. Governance function values

Allowed governance function values:

- defines_language
- defines_process
- defines_runtime_contract
- defines_role_boundary
- defines_manifest
- defines_validation
- defines_migration
- defines_release_or_access
- defines_media_authority
- records_execution

### 4. Standing values

Allowed standing values:

- draft
- validated
- written
- committed
- seeded
- active_reference
- codex_candidate
- codex_seated
- deprecated
- superseded

### 5. Codex candidate rule

A source reference may be marked codex_candidate only if it:

- governs repeated system behavior
- defines native semantics
- defines runtime contract boundaries
- protects authority distinction
- or is already used by DB, runtime, or process execution

### 6. Risk level assignment

Allowed risk levels:

- low
- medium
- high
- critical

Critical applies when runtime depends on the reference while Codex authority standing remains unresolved.

### 7. Classification boundary

Classification does not equal seating.

Rules:

- classified ? seated
- candidate ? authority
- runtime dependency ? authority
- seeded ? Codex-seated

## CODY ROLE

Cody may:

- classify inventory rows
- identify runtime dependency risk
- identify DB dependency risk
- flag source lineage ambiguity

Cody may not:

- declare Codex seating
- perform DB mutation
- collapse seeded into authority
- rewrite source references

## VALIDATION

This OAR2 resolves successfully when:

- inventory rows gain classification
- standing becomes reviewable
- runtime and governance risk become visible
- next-action direction becomes explicit
- authority distinction remains preserved

## EXPECTED NEXT OAR

OAR2 — Source Reference Codex Seating Schema Pass v1

## CLOSE

Inventory made the references visible.

Classification makes their function reviewable.

Codex seating comes later.

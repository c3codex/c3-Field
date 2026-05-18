---
document_type: oar2
authority_level: working
document_scope: source_authority
title: OAR2 — Source Reference Codex Seating Architecture
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
  - codex
  - semantic-governance
  - reference-seating
  - runtime-validation
source_alignment:
  - Seed Concordance
  - The 21 of Coherence
  - Seeded Reference Control
  - OAR Lifecycle — Execution and Handoff
---

# OAR2 — Source Reference Codex Seating Architecture

## OBSERVED

Current source references are not all confirmed as Codex-seated authority.

They currently exist across mixed standing:

- thread memory
- markdown source docs
- seeded references
- process rules
- implementation manifests
- role contracts
- runtime behavior
- partial DB references

This creates a governance risk:

source references may govern implementation before their Codex authority state is explicit.

Seeded reference control already distinguishes committed from seeded and requires seeded references before DB mutation.

The native order remains:

Codex ? Field ? Measures ? Chazz

Codex holds authority.
Field structures relation.
Measures registers sequence, access, and reveal.
Chazz renders, routes, validates, and executes.

## ALIGNED

The recovery follows the c3 Model:

c1 Connect
- inventory references

c2 Contribute
- classify role and authority standing

c3 Create
- seat validated references into Codex authority

No source reference becomes Codex authority merely because it is:

- written
- committed
- seeded
- used by process
- used by runtime

Codex seating requires explicit authority state.

Verification precedes recognition.

No source reference is recognized as Codex-seated until verified as Codex authority state.

## ROUTED

### 1. Source reference inventory

Inventory all active source references currently governing system behavior.

Minimum fields:

- reference_key
- title
- document_type
- current_location
- current_standing
- authority_claim
- governs_scope
- source_alignment
- seeded_status
- codex_seated_status
- notes

### 2. Reference classification

Allowed initial classifications:

- source_principle
- semantic_concordance
- process_rule
- role_contract
- implementation_manifest
- runtime_validation_rule
- oar_lifecycle
- migration_architecture

### 3. Standing lifecycle

Explicit lifecycle states:

- draft
- validated
- written
- committed
- seeded
- codex_candidate
- codex_seated
- deprecated
- superseded

### 4. Codex seating requirement

A reference may become codex_seated only when:

1. source body is stable
2. authority scope is explicit
3. lineage is traceable
4. current version is identified
5. downstream governance scope is bounded
6. verification has passed
7. append-only Codex record exists

### 5. Readable artifact distinction

Markdown docs remain readable mirrors.

Codex records become authority.

Rules:

- markdown file ? authority
- committed file ? authority
- seeded reference ? Codex authority
- Codex authority record = authority

### 6. Proposed DB authority model

Architecture only.
No DB mutation in this OAR.

Proposed tables:

- codex_source_reference
- codex_source_reference_version
- codex_source_reference_relation
- codex_source_reference_scope
- codex_source_reference_state

### 7. Runtime semantic validation target

Future runtime validation must check:

- encounter defs
- renderer contracts
- transition rules
- release states
- route handlers
- OAR manifests
- frontend manifests

against Codex-seated references only.

## CODY ROLE

Cody does not execute DB changes from this OAR2.

Cody may later:

- inspect existing source reference files
- inspect current DB authority tables
- report whether Codex seating tables already exist
- propose migration SQL

Cody may not:

- insert source references
- declare Codex seating complete
- collapse seeded and Codex-seated states
- treat markdown as authority

## VALIDATION

This OAR2 resolves successfully when agreement exists on:

- source reference inventory first
- classification second
- Codex seating architecture third
- DB mutation later

## EXPECTED NEXT OAR

OAR2 — Source Reference Inventory Pass v1

## CLOSE

The recovery is not more documents.

The recovery is:

- source reference standing made explicit
- authority migrated into Codex only after verification
- runtime governed from Codex-seated references

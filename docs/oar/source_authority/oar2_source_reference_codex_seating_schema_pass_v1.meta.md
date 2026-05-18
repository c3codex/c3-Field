---
document_type: oar2
authority_level: working
document_scope: source_authority
title: OAR2 — Source Reference Codex Seating Schema Pass
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
  - codex-schema
  - semantic-governance
  - runtime-risk
  - codex-normalization
source_alignment:
  - Seed Concordance
  - The 21 of Coherence
  - Seeded Reference Control
  - OAR1 Source Reference Classification Pass
---

# OAR2 — Source Reference Codex Seating Schema Pass

## OBSERVED

The classification pass confirmed the next structural need: schema architecture before DB mutation.

Critical risks were identified around runtime-active references, including:

- OAR spine references with public.c3_oar_* dependency
- encounter/render references used by resolveEncounter and GenericEncounter
- release/access references used by phase-map and encounter gating
- process log and notification integration references used by live runtime surfaces

The pass also preserved the key boundary:

- classified does not mean seated
- codex_candidate does not mean authority
- runtime dependency does not mean authority
- seeded does not mean Codex-seated
- active_reference does not mean Codex-seated

## ALIGNED

This pass is c3 Create architecture, not execution.

Purpose:

- define the Codex authority schema required to seat source references later
- without inserting source references yet

This OAR2 does not:

- mutate DB
- insert source references
- declare Codex seating
- merge superseded docs
- enforce runtime validation
- rewrite source files

## ROUTED

### 1. Codex authority schema target

Proposed source authority tables:

- codex_source_reference
- codex_source_reference_version
- codex_source_reference_relation
- codex_source_reference_scope
- codex_source_reference_state
- codex_source_reference_lineage

### 2. Required authority distinction

Schema must preserve these as distinct states:

- document exists
- document committed
- document seeded
- document runtime-used
- document codex-seated

No table design may collapse these.

### 3. Core record requirements

codex_source_reference should define stable reference identity:

- reference_key
- title
- source_family
- authority_scope
- governance_function
- current_state
- is_active
- created_at
- created_by

### 4. Version requirements

codex_source_reference_version should preserve append-only version state:

- reference_key
- version
- source_location
- content_hash
- status
- effective_from
- effective_to
- verification_state
- created_at

Rule:

- new version appends
- old version does not mutate

### 5. Scope requirements

codex_source_reference_scope should define what a reference may govern:

- reference_key
- scope_type
- scope_target
- allowed_governance
- runtime_binding_allowed
- db_binding_allowed
- notes

### 6. State requirements

codex_source_reference_state should record lifecycle movement:

- reference_key
- from_state
- to_state
- state_reason
- oar_key
- verified_by
- created_at

Lifecycle states:

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

### 7. Lineage requirements

codex_source_reference_lineage should resolve supersession and dependency ambiguity:

- reference_key
- related_reference_key
- relation_type
- relation_reason
- oar_key
- created_at

Allowed relation types:

- aligns_to
- depends_on
- supersedes
- superseded_by
- duplicates
- conflicts_with
- derived_from
- supports_runtime
- supports_process

### 8. Runtime validation preparation

Schema must allow later runtime checks against Codex-seated references for:

- renderer contracts
- encounter contracts
- release/access rules
- transition rules
- phase map behavior
- OAR lineage
- media authority
- notification integration
- process log runtime

### 9. Migration boundary

This pass produces schema design only.

Any future migration must be separate and must include:

- OAR2 migration proposal
- SQL review
- operator confirmation
- DB preflight
- execution
- OAR1 closeout
- git commit

## CODY ROLE

Cody may later:

- inspect existing DB tables
- compare proposed schema to current c3_oar_seeded_reference structure
- draft SQL migration for review
- identify conflicts with existing migrations

Cody may not:

- execute migration from this OAR2
- insert source references
- declare Codex seating complete
- collapse seeded reference registry into Codex authority

## VALIDATION

This OAR2 resolves successfully when:

- Codex source-reference authority schema is defined
- no DB mutation occurs
- no source insertion occurs
- authority distinction remains preserved

## EXPECTED NEXT OAR

OAR2 — Source Reference Schema Migration Proposal v1

## CLOSE

Inventory made references visible.

Classification made function and risk reviewable.

Schema pass defines the authority container.

Codex seating still comes later.

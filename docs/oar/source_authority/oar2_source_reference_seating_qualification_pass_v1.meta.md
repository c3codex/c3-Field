---
document_type: oar2
authority_level: working
document_scope: source_authority
title: OAR2 — Source Reference Seating Qualification Pass
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
  - seating-qualification
  - runtime-governance
  - codex-normalization
  - readiness-review
source_alignment:
  - Source Authority Ambiguity Resolution Manifest
  - OAR1 Source Reference Classification Pass
  - OAR1 Source Reference Codex Seating Schema Pass
---

# OAR2 — Source Reference Seating Qualification Pass

## OBSERVED

The ambiguity manifest established an explicit operator review queue for:

- runtime_active_pending_authority references
- renderer supersession review
- frontend contract merge review
- phase map parallel scope confirmation
- media authority parallel scope confirmation
- OAR lifecycle primary/support distinction
- semantic foundation lineage review

Runtime-active references are now visible, but visibility alone does not qualify them for Codex seating.

## ALIGNED

This is a qualification pass.

Purpose:

- define what makes a source reference ready for Codex seating review
- without seating authority yet

This pass does not:

- mutate DB
- insert records
- declare Codex authority
- resolve operator decisions
- merge source files
- rewrite source docs

## ROUTED

### 1. Qualification states

Allowed qualification states:

- codex_candidate_ready
- not_ready
- operator_review_required
- supersession_required
- merge_required
- lineage_required
- scope_required
- runtime_evidence_required

### 2. Minimum readiness requirements

A source reference may become codex_candidate_ready only when:

1. original path is preserved
2. source body is stable
3. source family is classified
4. authority scope is bounded
5. governance function is explicit
6. lineage or supersession is resolved or documented
7. runtime dependency is identified if present
8. operator review is complete where required
9. no unresolved conflict remains
10. no Codex authority is inferred from runtime use

### 3. Runtime-active requirements

Any runtime_active_pending_authority row requires:

- runtime evidence
- DB dependency evidence
- scope boundary
- operator review
- no unresolved supersession conflict

before seating review may proceed.

### 4. Merge requirements

Any merged row requires:

- future canonical source target
- merge scope
- operator approval
- no silent rewrite

### 5. Supersession requirements

Any superseded row requires:

- superseding reference identified
- lineage preserved
- authority removal from future seating path

### 6. Parallel requirements

Any parallel row requires:

- distinct scope statement
- non-duplication confirmation
- operator review if governance-bearing

## CODY ROLE

Cody may:

- create qualification manifest
- assign proposed readiness state
- flag missing evidence
- flag unresolved operator review
- preserve all non-authority boundaries

Cody may not:

- seat authority
- mutate DB
- merge source files
- delete superseded files
- declare operator review complete

## OUTPUT

Create:

- docs/source_authority/candidates/seating_qualification_manifest.meta.md

## VALIDATION

This OAR2 resolves successfully when:

- each candidate receives a seating qualification standing
- missing requirements become visible
- unresolved review conditions remain explicit
- no authority claim occurs
- migration proposal gains a clean readiness basis

## EXPECTED NEXT OAR

OAR2 — Source Reference Schema Migration Proposal v1

## CLOSE

Ambiguity is visible.

Qualification determines readiness.

Codex seating still comes later.

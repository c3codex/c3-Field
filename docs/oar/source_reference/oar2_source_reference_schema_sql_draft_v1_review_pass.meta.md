---
document_type: oar2
authority_level: working
document_scope: source_reference_schema_review
title: OAR2 — Source Reference Schema SQL Draft v1 Review Pass
status: proposed
version: v1
operator: op044
system: source_reference
native_stack:
  codex: database
  field: schema
  measures: registry
  chazz: systems
tags:
  - oar2
  - source-reference
  - schema
  - sql-review
  - db-preflight
  - no-db-mutation
source_alignment:
  - Seed Concordance
  - The 21 of Coherence
  - Source Set Rule Summary — Seeded Reference Control
  - OAR Lifecycle — Execution and Handoff
---

# OAR2 — Source Reference Schema SQL Draft v1 Review Pass

## OBSERVED

A first SQL draft exists at:

docs/schema/source_reference/source_reference_schema_sql_draft_v1.sql

The draft proposes:

- source_reference
- source_term
- source_operative_binding
- source_relation
- source_seed_log
- v_seeded_source_references
- prevent_seeded_source_reference_update()
- mark_source_reference_seeded()

The draft is structurally promising but not clean enough for DB execution.

Current risks:

- table family naming may be too generic
- RLS and grants are not defined
- trigger behavior may block valid correction paths
- seeded-state transition function may be too permissive
- Supabase execution readiness has not been verified
- no live DB mutation should occur from this draft

## ALIGNED

This OAR2 is a review pass only.

It does not authorize:

- DB mutation
- Supabase execution
- production migration
- seeded-state claims
- OAR1 closeout as executed schema

Codex remains authority.
Field structures the schema.
Measures registers sequencing and standing.
Chazz reviews and routes.
Cody does not execute DB mutation from this OAR2.

## ROUTED

### 1. Naming Review

Review whether the schema should use:

- current draft family: source_reference*
- proposed authority family: codex_source_reference*

Decision must preserve native distinction and prevent generic table drift.

Preferred review outcome:

- codex_source_reference
- codex_source_term
- codex_source_operative_binding
- codex_source_relation
- codex_source_seed_log

unless there is a direct compatibility reason to keep shorter names.

### 2. SQL Execution Readiness Review

Review the draft for:

- idempotency
- Supabase compatibility
- extension dependency
- RLS requirements
- grants / revoke defaults
- trigger safety
- function permissions
- whether seeded records can be corrected by supersession only
- whether mark_source_reference_seeded() should exist
- whether seeded-state transitions require OAR key
- whether source_hash should be required before seeded state
- whether source_path should be required before committed / seeded state

### 3. Revision Route

Produce a revised SQL draft only if needed.

The revised draft must remain non-executed.

No DB write.
No migration claim.
No seeded claim.

### 4. Standing Route

Final route must be exactly one:

- schema_draft_only
- db_preflight_candidate
- rejected_for_execution

Current expected route:

db_preflight_candidate only after revision.

## CODY ROLE

Cody may review the SQL draft and propose a revised SQL file.

Cody may not:

- execute SQL
- mutate Supabase
- mark the schema seeded
- create OAR1 as completed DB execution
- infer authority outside the OAR2
- change source-reference purpose or native architecture

## VALIDATION

Review is valid when it returns:

1. naming decision
2. execution-readiness findings
3. revised SQL draft if needed
4. final route:
   - schema_draft_only
   - db_preflight_candidate
   - rejected_for_execution

## EXPECTED OUTPUT

If revised:

docs/schema/source_reference/source_reference_schema_sql_draft_v1_reviewed.sql

If OAR1 is later created, it must describe review completion only, not DB execution.

## CLOSE

Review first.
Revise second.
Preflight third.
DB mutation only by separate confirmed OAR2.

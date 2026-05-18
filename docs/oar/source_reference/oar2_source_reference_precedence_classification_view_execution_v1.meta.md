---
document_type: oar2
authority_level: working
document_scope: source_reference_precedence_classification_view_execution
title: OAR2 — Source Reference Precedence Classification View Execution v1
status: proposed
version: v1
operator: op044
system: source_reference
---

# OAR2 — Source Reference Precedence Classification View Execution v1

## OBSERVED

Precedence classification review completed.

Draft SQL exists at:

`docs/schema/source_reference/source_reference_precedence_classification_v1.sql`

Prior OAR1 route:

`classification_sql_drafted_execution_deferred`

The draft replaces only:

`public.v_codex_source_seeded_precedence`

No SQL has been executed yet.

## ALIGNED

This OAR2 authorizes execution of the precedence classification view update only.

It does not authorize:

- seeded source mutation
- source reseeding
- relation mutation
- binding activation
- access policy creation
- frontend exposure
- runtime exposure
- contradiction auto-resolution

## ROUTED

### 1. Authorized SQL Surface

Execute only:

`docs/schema/source_reference/source_reference_precedence_classification_v1.sql`

### 2. Authorized DB Change

Replace only:

`public.v_codex_source_seeded_precedence`

No tables may be created.

No rows may be inserted, updated, or deleted.

### 3. Required Validation

Return validation for:

- view exists
- revised precedence output
- rank for `chazz_cody_development_role_contract`
- rank for `session_13_db_preflight_verification_checklist`
- contradiction candidate count
- no public policy creation
- no source table row-count mutation

### 4. Expected Rank Outcomes

Expected:

- `chazz_cody_development_role_contract` → rank 9
- `session_13_db_preflight_verification_checklist` → rank 10

### 5. Rollback Posture

Rollback may restore the prior `v_codex_source_seeded_precedence` view definition only.

Rollback may not mutate source records, seed logs, terms, relations, or bindings.

## CODY ROLE

Cody may:

- execute the authorized SQL
- validate revised view output
- produce OAR1

Cody may not:

- modify SQL scope
- mutate seeded records
- create policies
- expose runtime
- alter other traversal views
- activate bindings

## EXPECTED OAR1

`docs/oar/source_reference/oar1_source_reference_precedence_classification_view_execution_v1.meta.md`

## VALIDATION

Execution is complete only when:

1. view replacement succeeds
2. revised ranks validate
3. contradiction count remains zero or is routed
4. no source records mutate
5. no access policy is created
6. OAR1 documents execution and validation

## CLOSE

Classification drafted.

View replacement may execute.

Runtime exposure remains blocked.

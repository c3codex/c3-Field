---
document_type: oar2
authority_level: working
document_scope: source_reference_schema_preflight_revision
title: OAR2 — Source Reference Schema Preflight Revision v1
status: proposed
version: v1
operator: op044
system: source_reference
final_route: db_preflight_requires_revision
---

# OAR2 — Source Reference Schema Preflight Revision v1

## OBSERVED

Reviewed file:

docs/schema/source_reference/source_reference_schema_sql_draft_v1_preflight_revised.sql

Preflight revision improved the schema but introduced two enum drifts:

1. `source_type` became too narrow.
2. `authority_level` mixed authority with lifecycle / route standing.

Prior OAR1 required broad source-reference support including process, OAR, foundational, role, manifest, and checklist sources.

Seeded-reference control requires lifecycle standing to remain distinct from source authority.

## ALIGNED

This is a revision pass only.

No DB mutation.
No schema execution.
No authority seating.
No seeded claim.

## ROUTED

Revise only:

### 1. Restore `source_type`

Allowed values should include:

- concordance
- foundational_source
- process_rule
- process_constraints
- role_contract
- implementation_manifest
- verification_checklist
- oar
- system_intel
- schema_draft
- migration_candidate

### 2. Correct `authority_level`

Allowed values should remain authority-only:

- system
- working
- operator
- readonly
- readonly_candidate

Remove from `authority_level`:

- db_preflight_candidate
- codex_seated
- rejected

Those belong in route/status metadata, not authority.

### 3. Preserve lifecycle in `source_status`

Keep:

- drafted
- validated
- written
- committed
- seeded
- deprecated
- superseded
- rejected

### 4. Clean migration body

Move final review SELECT statements into a clearly marked validation block or comments.

## EXPECTED OUTPUT

docs/schema/source_reference/source_reference_schema_sql_draft_v1_preflight_corrected.sql

## FINAL ROUTE

After revision, return one:

- db_preflight_passed
- db_preflight_requires_revision
- rejected_for_execution

Expected route after correction:

db_preflight_passed

## CLOSE

Correct enum drift.
Preserve authority/lifecycle distinction.
No DB execution from this OAR2.

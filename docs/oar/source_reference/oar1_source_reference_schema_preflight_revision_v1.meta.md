---
document_type: oar1
authority_level: working
document_scope: source_reference_schema_preflight_revision
title: OAR1 - Source Reference Schema Preflight Revision v1
status: completed_revision
version: v1
operator: op044
system: source_reference
source_oar2: docs/oar/source_reference/oar2_source_reference_schema_preflight_revision_v1.meta.md
input_sql: docs/schema/source_reference/source_reference_schema_sql_draft_v1_preflight_revised.sql
corrected_sql: docs/schema/source_reference/source_reference_schema_sql_draft_v1_preflight_corrected.sql
final_route: db_preflight_passed
tags:
  - oar1
  - source-reference
  - schema
  - preflight-revision
  - no-db-mutation
---

# OAR1 - Source Reference Schema Preflight Revision v1

## Execution Result

Executed revision pass from:

`docs/oar/source_reference/oar2_source_reference_schema_preflight_revision_v1.meta.md`

Reviewed:

`docs/schema/source_reference/source_reference_schema_sql_draft_v1_preflight_revised.sql`

Created corrected SQL draft:

`docs/schema/source_reference/source_reference_schema_sql_draft_v1_preflight_corrected.sql`

No SQL was executed.

No DB mutation occurred.

No schema object was created.

No seeded claim was made.

No authority was seated.

## Corrections Applied

Restored `source_type` to broad source-reference support:

- `concordance`
- `foundational_source`
- `process_rule`
- `process_constraints`
- `role_contract`
- `implementation_manifest`
- `verification_checklist`
- `oar`
- `system_intel`
- `schema_draft`
- `migration_candidate`

Corrected `authority_level` to authority-only values:

- `system`
- `working`
- `operator`
- `readonly`
- `readonly_candidate`

Removed from `authority_level`:

- `db_preflight_candidate`
- `codex_seated`
- `rejected`

Preserved lifecycle in `source_status`:

- `drafted`
- `validated`
- `written`
- `committed`
- `seeded`
- `deprecated`
- `superseded`
- `rejected`

Converted final review SELECT statements into a commented validation block so the migration body does not execute ad hoc reads.

## Preserved Boundaries

The corrected SQL preserves:

- `codex_source_*` table family
- RLS enablement
- anon/authenticated revokes
- no public callable seeded transition function
- service-side seeded transition posture
- source path/hash constraints for committed and seeded states
- append-only seeded protection

## Final Route

`db_preflight_passed`

This route does not authorize DB execution.

It means the schema draft is ready for a separate execution-routing OAR.

## Validation

Validation checks completed:

- enum drift corrected
- authority/lifecycle distinction preserved
- final validation queries moved to comments
- final route selected exactly as `db_preflight_passed`
- SQL was not executed
- DB was not mutated
- authority was not seated

## Expected Next OAR

OAR2 - Source Reference Schema Migration Execution Authorization v1

## Close

Enum drift corrected.

Authority and lifecycle are distinct.

DB execution remains blocked until a separate confirmed OAR2.

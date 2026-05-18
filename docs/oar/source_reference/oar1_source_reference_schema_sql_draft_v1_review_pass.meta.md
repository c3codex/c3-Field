---
document_type: oar1
authority_level: working
document_scope: source_reference_schema_review
title: OAR1 - Source Reference Schema SQL Draft v1 Review Pass
status: completed_review
version: v1
operator: op044
system: source_reference
source_oar2: docs/oar/source_reference/oar2_source_reference_schema_sql_draft_v1_review_pass.meta.md
reviewed_sql: docs/schema/source_reference/source_reference_schema_sql_draft_v1_reviewed.sql
original_sql: docs/schema/source_reference/source_reference_schema_sql_draft_v1.sql
final_route: db_preflight_candidate
native_stack:
  codex: database
  field: schema
  measures: registry
  chazz: systems
tags:
  - oar1
  - source-reference
  - schema
  - sql-review
  - db-preflight
  - no-db-mutation
---

# OAR1 - Source Reference Schema SQL Draft v1 Review Pass

## Execution Result

Executed review pass from:

`docs/oar/source_reference/oar2_source_reference_schema_sql_draft_v1_review_pass.meta.md`

Reviewed original draft:

`docs/schema/source_reference/source_reference_schema_sql_draft_v1.sql`

Created reviewed draft:

`docs/schema/source_reference/source_reference_schema_sql_draft_v1_reviewed.sql`

No SQL was executed.

No DB mutation was performed.

No source reference was inserted.

No seeded standing was claimed.

No authority was seated.

## Naming Decision

Decision:

Use the `codex_source_*` table family for the reviewed draft.

Rationale:

The shorter `source_reference*` family is structurally plausible, but the reviewed schema should preserve native distinction and avoid generic table drift.

Reviewed table family:

- `codex_source_reference`
- `codex_source_term`
- `codex_source_operative_binding`
- `codex_source_relation`
- `codex_source_seed_log`

## Execution-Readiness Findings

Findings resolved in reviewed draft:

- renamed table, view, index, trigger, and function surfaces to `codex_source_*`
- enabled RLS on all tables
- revoked table access from `anon` and `authenticated`
- revoked public execution of seeded transition function
- required `oar_key` for seeded transition
- required `source_path` before committed or seeded state
- required `source_hash` before committed or seeded state
- prevented duplicate seeded transition log entries by raising on already seeded references
- required committed state before seeded state
- preserved append-only seeded update protection
- retained preflight queries as review queries only

Remaining preflight concerns:

- Supabase role-specific grants still require live environment confirmation
- RLS policies remain intentionally absent until access patterns are routed
- extension availability still requires DB preflight confirmation
- execution should occur only through a separate confirmed OAR2

## Revised SQL Draft

Reviewed SQL draft produced:

`docs/schema/source_reference/source_reference_schema_sql_draft_v1_reviewed.sql`

Standing:

schema draft only until DB preflight is explicitly routed.

## Final Route

`db_preflight_candidate`

This route does not authorize DB execution.

It authorizes only future DB preflight review under a separate OAR2.

## Validation

Validation checks completed:

- naming decision returned
- execution-readiness findings returned
- revised SQL draft produced
- final route selected exactly as `db_preflight_candidate`
- SQL was not executed
- DB was not mutated
- seeded state was not claimed
- authority was not seated

## Expected Next OAR

OAR2 - Source Reference Schema DB Preflight v1

## Close

Review completed.

Revision completed.

Preflight may open next.

DB mutation still requires a separate confirmed OAR2.

---
document_type: oar1
authority_level: working
document_scope: source_reference_schema_db_preflight
title: OAR1 - Source Reference Schema DB Preflight v1
status: completed_preflight
version: v1
operator: op044
system: source_reference
source_oar2: docs/oar/source_reference/oar2_source_reference_schema_db_preflight_v1.meta.md
reviewed_sql: docs/schema/source_reference/source_reference_schema_sql_draft_v1_reviewed.sql
preflight_revised_sql: docs/schema/source_reference/source_reference_schema_sql_draft_v1_preflight_revised.sql
final_route: db_preflight_requires_revision
native_stack:
  codex: database
  field: schema
  measures: registry
  chazz: systems
tags:
  - oar1
  - source-reference
  - schema
  - db-preflight
  - supabase
  - rls
  - grants
  - no-db-mutation
---

# OAR1 - Source Reference Schema DB Preflight v1

## Execution Result

Executed DB preflight review from:

`docs/oar/source_reference/oar2_source_reference_schema_db_preflight_v1.meta.md`

Reviewed:

`docs/schema/source_reference/source_reference_schema_sql_draft_v1_reviewed.sql`

Created preflight revision:

`docs/schema/source_reference/source_reference_schema_sql_draft_v1_preflight_revised.sql`

No SQL migration was executed.

No table was created.

No function was created.

No trigger was created.

No RLS policy was created.

No seed insertion occurred.

No seeded-state transition occurred.

No authority seating occurred.

## Live Preflight Standing

Read-only Supabase preflight was attempted through the existing `exec_sql` RPC surface.

Result:

- RPC connection succeeded
- catalog SELECT calls returned an `ok` envelope
- row payloads were not returned through this RPC surface

Therefore:

- `pgcrypto` row standing was not row-verified
- object collision row standing was not row-verified
- routine collision row standing was not row-verified
- view collision row standing was not row-verified

This does not authorize execution.

## pgcrypto Standing

Standing:

not row-verified through available RPC payload.

Recommendation:

Keep `create extension if not exists pgcrypto;` in draft posture only until the execution role confirms extension availability.

No extension change was performed.

## Object Collision Standing

Standing:

not row-verified through available RPC payload.

Objects requiring confirmation before execution:

- `public.codex_source_reference`
- `public.codex_source_term`
- `public.codex_source_operative_binding`
- `public.codex_source_relation`
- `public.codex_source_seed_log`
- `public.v_seeded_codex_source_references`
- `public.touch_codex_source_updated_at`
- `public.prevent_seeded_codex_source_reference_update`

The public seeded transition function was removed from the preflight-revised draft.

## Schema Placement Recommendation

Recommendation:

Keep the draft in `public` for now.

Reason:

The prior reviewed draft already uses `codex_source_*` names, which reduces generic table drift. Live collision rows were not available through the current RPC response, so moving to a new schema should wait for a row-returning catalog check or a dedicated schema-placement OAR.

## RLS and Grant Recommendation

Recommendation:

- enable RLS on all source-reference tables
- create no public RLS policies in the first migration
- revoke default access from `anon` and `authenticated`
- keep access service-side only until an access-pattern OAR routes read/write policies

No RLS or grant changes were executed.

## Seeded-Transition Function Recommendation

Decision:

Remove public callable seeded transition from the preflight-revised draft.

Recommendation:

Seeded transition should be handled by controlled service-side code or a private-schema RPC only after role/grant validation and a separate seeded-transition workflow OAR.

## Migration Ordering Review

Recommended order remains:

1. extension availability check
2. table creation
3. index creation
4. trigger functions
5. triggers
6. view creation
7. RLS enablement
8. grants / revokes
9. no policies until access OAR
10. validation queries

Order risk:

The migration should not be run through an RPC surface that cannot return catalog rows for preflight validation.

## Supabase Compatibility Findings

Findings:

- `gen_random_uuid()` requires `pgcrypto` or equivalent availability confirmation
- `security definer` seeded transition was too sensitive for public-schema exposure and was removed
- RLS with no policies is compatible with service-side-only posture
- revoke behavior in `public` remains appropriate but requires role validation
- trigger creation is idempotent by drop/create pattern
- view exposure remains low only while table grants remain revoked and no public policies exist
- JSONB metadata constraints are compatible with PostgreSQL
- `source_path` and `source_hash` constraints remain appropriate before committed or seeded state

## Final Route

`db_preflight_requires_revision`

This route does not authorize DB execution.

It authorizes only the preflight-revised draft and a future execution-readiness OAR.

## Validation

Validation checks completed:

- pgcrypto standing returned as not row-verified
- object collision standing returned as not row-verified
- schema placement recommendation returned
- RLS/grant recommendation returned
- seeded-transition function recommendation returned
- migration ordering review returned
- Supabase compatibility findings returned
- final route selected exactly as `db_preflight_requires_revision`
- SQL migration was not executed
- DB was not mutated
- authority was not seated

## Expected Next OAR

OAR2 - Source Reference Schema Execution Readiness v1

## Close

Preflight completed.

Revision required.

Migration remains blocked until a separate confirmed OAR2.

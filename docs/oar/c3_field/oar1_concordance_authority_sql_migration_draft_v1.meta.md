---
document_type: oar1
title: OAR1 Concordance Authority SQL Migration Draft
version: v1
status: recorded
system: c3_field
operator: op044
source_oar2: docs/oar/c3_field/oar2_concordance_authority_sql_migration_draft_v1.meta.md
---

OAR1: oar1_concordance_authority_sql_migration_draft_v1

## Objective
Draft SQL for Concordance Authority schema review without executing migration, mutating DB, seating manifest rows, mutating bucket objects, modifying concordance content, or implementing runtime/frontend behavior.

## Actions
- Created SQL schema draft for Concordance Authority bodies.
- Created validation query draft.
- Placed drafts under `docs/oar/c3_field` so they are review artifacts, not queued Supabase migrations.
- Did not create any file under `supabase/migrations`.
- Did not execute SQL.

## Draft Files
- `docs/oar/c3_field/concordance_authority_schema_draft_v1.sql`
- `docs/oar/c3_field/concordance_authority_validation_queries_draft_v1.sql`

## Schema Draft Includes
- `concordance_document`
- `concordance_version`
- `concordance_term`
- `concordance_relation`
- `seeded_source_snapshot`
- primary keys
- foreign keys
- check constraints
- unique constraints
- indexes
- RLS enablement
- read policies
- append-protection triggers

## Validation Draft Includes
- schema existence queries
- constraint and index posture queries
- RLS posture queries
- policy posture queries
- append-protection trigger queries
- Seed Concordance v1 authority seating checks
- duplicate-term prevention checks
- TREE / c3 Boundary seating checks
- seeded snapshot hash check

## Authority Boundary Preserved
`Codex seating = authority`

`bucket snapshot != authority`

`markdown file != authority`

The SQL draft creates authority bodies only if later executed by separate OAR2. This OAR1 does not seat authority.

## Constraints Held
- No migration execution.
- No DB mutation.
- No Seed Concordance rows inserted.
- No bucket mutation.
- No concordance content modification.
- No frontend/runtime implementation.
- No Supabase migration file created.

## Validation
- SQL draft created.
- Validation SQL drafted.
- Draft files read back.
- Draft files are not in `supabase/migrations`.
- No DB mutation performed.
- OAR1 written.

## Files
- docs/oar/c3_field/oar2_concordance_authority_sql_migration_draft_v1.meta.md
- docs/oar/c3_field/oar1_concordance_authority_sql_migration_draft_v1.meta.md
- docs/oar/c3_field/concordance_authority_schema_draft_v1.sql
- docs/oar/c3_field/concordance_authority_validation_queries_draft_v1.sql

## Close
Draft SQL only.
Execution requires separate OAR2.

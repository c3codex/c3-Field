---
document_type: oar1
title: OAR1 Concordance Authority SQL Draft Hardening
version: v1
status: recorded
system: c3_field
operator: op044
source_oar2: docs/oar/c3_field/oar2_concordance_authority_sql_draft_hardening_v1.meta.md
---

OAR1: oar1_concordance_authority_sql_draft_hardening_v1

## Objective
Harden the Concordance Authority SQL draft artifacts before any migration execution planning, without executing SQL, mutating DB, creating Supabase migrations, seating records, mutating bucket objects, or implementing runtime/frontend behavior.

## Actions
- Revised `docs/oar/c3_field/concordance_authority_schema_draft_v1.sql`.
- Revised `docs/oar/c3_field/concordance_authority_validation_queries_draft_v1.sql`.
- Added active version uniqueness protection.
- Added relation scope support.
- Added visibility/access standing across authority bodies.
- Added timestamp immutability posture for recognition/verification timestamps.
- Updated validation queries for the new protections.

## Hardening Applied
### Active Version Protection
Added partial unique index:

`concordance_version_one_active_per_document_idx`

Purpose:
- enforce one active version per concordance document
- prevent duplicate active semantic authority for the same document

### Relation Scope
Added `relation_scope` to `concordance_relation`.

Allowed scopes:
- `term`
- `document`
- `version`
- `cross_version`
- `branch`
- `system`

Purpose:
- avoid forcing every relation into term-to-term shape
- preserve relation classification before execution

### Protected Visibility Standing
Added `visibility_standing` to:
- `concordance_document`
- `concordance_version`
- `concordance_term`
- `concordance_relation`
- `seeded_source_snapshot`

Allowed standings:
- `public`
- `internal`
- `protected`
- `restricted`

Public read policies now require active/verified standing plus `visibility_standing = 'public'`.

### Trigger-Managed updated_at
Confirmed trigger-managed `updated_at` posture for:
- `concordance_document`
- `concordance_version`
- `concordance_term`

### Immutable Timestamp Posture
Added timestamp immutability function:

`concordance_authority_protect_recognition_timestamps`

Applied to:
- `concordance_version.recognized_at`
- `seeded_source_snapshot.verified_at`

Purpose:
- prevent silent mutation of recognition/verification timestamps after recognition or verification.

## Validation Draft Updates
Validation SQL now checks:
- active version uniqueness index
- duplicate active version rows
- `relation_scope` column support
- visibility standing column support
- visibility standing distribution
- updated_at trigger presence
- recognized_at / verified_at immutability trigger presence
- RLS visibility filters
- protected terms with public visibility

## Authority Boundary Preserved
`Codex seating = authority`

`bucket snapshot != authority`

`markdown file != authority`

These remain draft SQL artifacts only.

## Constraints Held
- No SQL executed.
- No DB mutation performed.
- No migration file created under `supabase/migrations`.
- No records inserted.
- No bucket mutation performed.
- No concordance content modified.
- No frontend/runtime implementation performed.

## Validation
- SQL draft hardened.
- Validation SQL updated.
- Hardening additions read back.
- No DB mutation performed.
- No Supabase migration file created.
- OAR1 written.

## Files
- docs/oar/c3_field/oar2_concordance_authority_sql_draft_hardening_v1.meta.md
- docs/oar/c3_field/oar1_concordance_authority_sql_draft_hardening_v1.meta.md
- docs/oar/c3_field/concordance_authority_schema_draft_v1.sql
- docs/oar/c3_field/concordance_authority_validation_queries_draft_v1.sql

## Close
Harden before execution.
Authority protections belong in the first migration, not later.

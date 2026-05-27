---
document_type: oar1
authority_level: working
document_scope: source_authority
title: OAR1 — Source Reference Schema SQL Draft Correction v1
status: completed
version: v1
operator: op044
date: 2026-05-26
source_oar2: docs/oar/measures_interoperability/oar2_source_reference_schema_sql_draft_correction_v1.meta.md
sql_draft_artifact: docs/oar/measures_interoperability/source_reference_schema_sql_draft_v1.sql
native_stack:
  codex: database
  field: schema
  measures: registry
  oar2: observed_aligned_routed
  chazz: systems
  cody: executor
  src: renderer
tags:
  - oar1
  - source-authority
  - sql-draft-correction
  - codex-source-record
  - c3-7s
  - measures-interoperability
source_alignment:
  - OAR1 — Source Reference Schema SQL Draft v1
  - Seed Concordance
  - c3 7s / The 21 of Coherence
  - Active Session Transfer Surface Rule
  - OAR2 — Source Reference Schema SQL Draft Correction v1
---

# OAR1 — Source Reference Schema SQL Draft Correction v1

## Objective

Apply five corrections to `source_reference_schema_sql_draft_v1.sql` as routed by OAR2 — Source Reference Schema SQL Draft Correction v1.

## File Corrected

`docs/oar/measures_interoperability/source_reference_schema_sql_draft_v1.sql`

## Corrections Applied

### 1 — Standing Value Normalization

`hold_for_operator_review` is not a valid value under the `standing` CHECK constraint.

Affected rows: `seed_concordance`, `source_21_of_coherence_v1`

Correction:
- `standing` → `'held'`
- `review_status` → `'operator_required'` (already correct; confirmed unchanged)

All other standing values (`written`, `seeded`, `superseded`) were valid and unchanged.

### 2 — c3 7s Alias Normalization

`aliases jsonb` column added to `codex_source_reference` table definition.

Canonical source identity:
- source_key: `source_21_of_coherence_v1`
- title: `The 21 of Coherence`
- formal source: The 21 of Coherence
- aliases: `["c3 7s", "c3_7s", "twenty_one_of_coherence"]`

Alias pattern preserves continuity. Old references using `twenty_one_of_coherence` or `c3_7s` remain valid. No files renamed.

### 3 — Runtime-Claimed Held Rows Added

`DB_HELD_CODEX_SOURCE_RECORDS` in `src/shared/c3/oar2Governance.ts` declares four keys:
- `seed_concordance` — present in migration proposal, held
- `source_21_of_coherence_v1` / `twenty_one_of_coherence` — present in migration proposal, held
- `system_concordance` — absent from migration proposal, no source file confirmed
- `coherence_matrix_v1` — absent from migration proposal, no source file confirmed

Two held rows added to Section 3 INSERT block:

`system_concordance` — held, `file_path = ''`, notes document runtime claim and absence from proposal. Operator must confirm required seat and resolve file path before seating.

`coherence_matrix_v1` — held, `file_path = ''`, notes document runtime claim and absence from proposal. Operator must confirm required seat and resolve file path before seating.

Total proposed rows: **19** (17 migration payload + 2 runtime-claimed held)

Section 4 post-execution query 4e updated to expect 19 rows. Query 4f added to confirm runtime-claimed held rows are present and held.

### 4 — RLS Access Posture Corrected

Previous draft granted `anon` full SELECT on `codex_source_reference` via broad `using (true)` policy.

Correction:
- Anon policy on full table removed.
- Authenticated policy retained: full read for authenticated users.
- Public-safe view added: `codex_source_reference_public`
  - Exposes: `source_key`, `title`, `source_type`, `document_scope`, `standing`, `file_path`, `aliases`, `seeded_standing`, `codex_seating_standing`
  - Filter: `standing in ('written', 'committed', 'seeded', 'codex_seated', 'superseded')` AND `review_status not in ('held', 'operator_required')`
  - Excludes: `oar1_key`, `oar2_key`, `migration_group`, `ambiguity_group`, held rows, candidate rows, operator_required rows

Protected systems intelligence boundary preserved. Held and candidate authority rows not surfaced publicly.

### 5 — Dead Trigger Line Removed

The following dead block was present in the draft:

```sql
-- Updated_at trigger (reuses existing function from c3_oar spine)
drop trigger if exists codex_source_reference_lineage_set_updated_at
  on public.codex_source_reference_lineage;
```

No corresponding `create trigger` existed. The drop served no purpose in the draft. Block removed.

## Result

SQL draft corrected. Five corrections applied.

No SQL was executed.

No database was mutated.

No Codex seating was declared.

No runtime or CSS was modified.

No deprecation was executed.

No files renamed or deleted beyond the SQL draft itself.

## Readiness Standing for Migration Execution OAR2

Draft is corrected and ready for operator review.

Before migration execution OAR2 can be authorized:

1. Operator must review the corrected SQL draft
2. Operator must confirm `system_concordance` requires a seat and provide `file_path`
3. Operator must confirm `coherence_matrix_v1` requires a seat and provide `file_path`
4. Operator must confirm `source_21_of_coherence_v1` alias set is complete
5. Operator must confirm held exclusions remain held
6. Operator must confirm `codex_source_reference_public` view scope is appropriate
7. Section 1 validation queries must be run against live DB before execution

## Close

Correction complete. Execution still waits for operator review and migration execution OAR2.

Codex holds. Measures registers. OAR2 routes. Execution waits.

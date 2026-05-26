---
document_type: oar1
authority_level: working
document_scope: source_authority
title: OAR1 — Source Reference Schema SQL Draft v1
status: completed
version: v1
operator: op044
date: 2026-05-26
source_oar2: docs/oar/measures_interoperability/oar2_source_reference_schema_sql_draft_v1.meta.md
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
  - sql-draft
  - codex-source-record
  - source-reference
  - measures-interoperability
source_alignment:
  - Seed Concordance
  - The 21 of Coherence
  - OAR2 — Source Reference Schema SQL Draft v1
  - Source Reference Schema Migration Proposal
  - Source Authority Seam Closeout
---

# OAR1 — Source Reference Schema SQL Draft v1

## Objective

Draft the SQL schema for `codex_source_reference` table family and associated validation queries, as routed by OAR2 — Source Reference Schema SQL Draft v1.

## Files Inspected

- `docs/oar/measures_interoperability/oar2_source_reference_schema_sql_draft_v1.meta.md` — routing OAR2
- `docs/source_authority/candidates/source_reference_schema_migration_proposal.meta.md` — migration payload groups and schema family names
- `docs/source_authority/candidates/candidate_manifest.meta.md` — 17 candidate rows, standings, ambiguity groups
- `docs/source_authority/candidates/ambiguity_resolution_manifest.meta.md` — resolution standings per candidate
- `docs/source_authority/candidates/source_authority_seam_closeout.meta.md` — held exclusions, accepted groups
- `supabase/migrations/202605140001_c3_field_oar_spine_persistence.sql` — existing schema: c3_oar_process_instance, c3_oar_transition_event, c3_oar_seeded_reference
- `supabase/migrations/202605180001_process_registry_and_oar_queue_foundation.sql` — existing schema: system_process_registry
- `src/shared/c3/oar2Governance.ts` — runtime DB_HELD_CODEX_SOURCE_RECORDS assertion

## Action

Inspected existing migrations. Confirmed no `codex_source_reference` table exists.

Confirmed `c3_oar_seeded_reference` and `system_process_registry` do not contain rows for `twenty_one_of_coherence`, `seed_concordance`, or `coherence_matrix_v1` (based on schema review — live query not executed).

Drafted SQL at:

`docs/oar/source_authority/source_reference_schema_sql_draft_v1.sql`

## SQL Draft Summary

### Section 1 — Validation Queries (Non-Mutating)
Six SELECT / DO-block queries to establish current DB state:
- Check whether source reference tables exist
- Check for source-adjacent column drift on existing tables
- Check for the three governance records in existing tables
- Check `DB_HELD_CODEX_SOURCE_RECORDS` runtime claims against actual DB rows
- Conditional duplicate key check
- Check for active processes with `requires_oar1_closeout = false`

### Section 2 — Schema Draft
`codex_source_reference` table with:
- source_key, title, source_type, authority_level, document_scope
- standing (candidate / written / committed / seeded / codex_seated / held / superseded)
- file_path, source_alignment (jsonb), seeded_standing, codex_seating_standing
- review_status, migration_group, ambiguity_group, codex_candidate
- oar2_key, oar1_key (FK to c3_oar_process_instance)
- notes, timestamps

Trigger: `codex_source_reference_require_oar1_for_seating` — blocks any row from reaching `codex_seated` standing without `oar1_key` populated.

`codex_source_reference_lineage` table — preserves supersession chains (e.g. renderer_contract_seed_v1 → database_render_contract_manifest).

RLS: public read for anon and authenticated.

### Section 3 — Proposed Seed Rows (Commented Out)
17 rows covering all 11 accepted migration groups, formatted for future INSERT.
All rows carry current observed standing from candidate manifest — none claim `codex_seated`.
INSERT block is commented out pending execution OAR2 authorization.

### Section 4 — Post-Draft Validation Queries (Commented Out)
Five post-execution checks, commented, for use after migration:
- No codex_seated rows without oar1_key
- No held/candidate rows claiming seated status
- Three governance records present
- No duplicate keys
- Row count matches expected payload (17)

## Observed DB State Finding

`oar2Governance.ts` declares `DB_HELD_CODEX_SOURCE_RECORDS` containing:
- `seed_concordance`
- `system_concordance`
- `twenty_one_of_coherence`
- `coherence_matrix_v1`

And `resolveIntegrityGovernance` returns `is_db_held: true` when metadata structure is present.

**No corresponding DB rows exist in any current table for these keys.**

This is DRIFT-02 from the c3 MAP review. The runtime assertion is not backed by DB evidence. This does not block the SQL draft but must be resolved before any governance gate depends on `is_db_held`.

## Result

SQL draft is complete.

No SQL was executed.

No database was mutated.

No source reference was inserted.

No Codex seating was declared.

No held reference was promoted.

No runtime or CSS was modified.

## Readiness Standing for Migration OAR2

The draft is ready for operator review.

Before a migration execution OAR2 can be authorized:

1. Operator must review the SQL draft
2. Operator must confirm the 17 proposed seed rows are correct
3. Operator must confirm held exclusions remain held
4. Operator must confirm oar1_key FK approach for seating guard
5. Operator must confirm whether `system_concordance` (in runtime type but absent from migration proposal) requires a row
6. Validation queries in Section 1 must be run against live DB before execution

## Folder Correction

OAR1 was initially written to:

`docs/oar/source_authority/oar1_source_reference_schema_sql_draft_v1.meta.md`

Per NotChazz R&R — OAR2 Folder Surface Drift (`docs/oar/measures_interoperability/notchazz_rr_oar2_folder_surface_drift_2026-05-26.meta.md`), all session execution files for Measures Interoperability Session 2 must reside in `docs/oar/measures_interoperability/`.

OAR1 was moved to this location. The misplaced copy at `docs/oar/source_authority/oar1_source_reference_schema_sql_draft_v1.meta.md` was removed by operator instruction on 2026-05-26.

## Close

Draft complete. Execution waits for operator review and migration OAR2.

Codex holds. Measures registers. OAR2 routes. Execution waits.

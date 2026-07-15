---
document_type: reconciliation_recommendation
document_scope: missing_remote_migration_provenance
source_oar2: docs/oar/c3_field/oar2_investigate_and_reconcile_missing_remote_migration_provenance_v1.meta.md
status: recommendation_only
mutation_count: 0
---

# Missing Remote Migration Reconciliation Recommendation

## Standing

The migration ledger is live operational truth. The repository migration directory is incomplete history. This OAR did not mutate either surface.

## Recommended Route

1. Do not run `supabase migration repair` as a first response. It would alter ledger standing without recovering provenance.
2. Preserve the exact ledger export as evidence before any repair or reconstruction. Completed here as `missing_remote_migration_ledger_export_v1.json`.
3. For exact renamed equivalents, decide whether to rename the repo file to the remote ledger version or register an explicit equivalence policy. This applies to:
   - 20260702125802 -> 202607010007_make_undrifted_launch_edition_publication_cover.sql
   - 20260709190108 -> 20260709190000_record_undrifted_issue001_buffer_manifest_export_standing_v1.sql
4. For the marble style profile pair, review the ledger SQL against current `202607020001_seat_marble_surface_style_profiles_and_nested_car_acknowledgments.sql` before any recovery. The name matches, but the content hash does not.
5. For rows with exact SQL only in the ledger, create a follow-on OAR2 authorizing exact historical-file recovery from the ledger export. Do not reconstruct from current schema alone.
6. For rows with weak OAR/commit correlation, keep the OAR/commit fields partial but recover the SQL only if op044 accepts the live ledger export as exact execution evidence.
7. After file recovery or equivalence registration, run `supabase db push --dry-run` only as validation. Do not push until the dry run confirms the ledger mismatch is resolved without unintended schema changes.

## Version Groups

### Map To Renamed Equivalent

- 20260702125802
- 20260709190108

### Requires Snapshot/Divergence Review

- 20260702130018
- 20260702164214

### Recover Exact Local Migration From Ledger SQL

- 20260702143712
- 20260702151435
- 20260702153744
- 20260702154341
- 20260702174145
- 20260702174248
- 20260702174411
- 20260702203335
- 20260702204120
- 20260702205631
- 20260705184946
- 20260705190138
- 20260705190228

### Accept Direct Execution With Full Evidence

- 20260706061910, with OAR1 explicitly saying Supabase MCP direct application and live effects present. A historical migration file may still be desirable for chain cleanliness, but the direct route is evidenced.

## Claude Resume Recommendation

Claude should not resume mutation that depends on `supabase db push` until the migration-chain mismatch is resolved or an operator-approved direct-execution exception is seated. Claude may perform read-only advisement and may help author the follow-on recovery OAR.

## Prohibited In Follow-Up Unless Explicitly Authorized

- ledger repair without recovered/equivalence evidence
- placeholder migrations
- schema mutation from reconstructed guesses
- migration push before dry-run validation
- Inanna register_SEAT mutation piggybacked onto this reconciliation

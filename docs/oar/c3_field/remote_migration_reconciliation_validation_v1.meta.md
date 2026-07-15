---
document_type: reconciliation_validation
document_scope: missing_remote_migration_provenance
source_oar2: docs/oar/c3_field/oar2_reconcile_remote_migration_ledger_with_repository_history_v1.meta.md
status: completed_verified_new_ordering_blocker_found
validation_command: supabase db push --dry-run
amendment: >
  2026-07-14, later same day: rerun after recovering 20260702130018 per
  docs/oar/c3_field/transfer_surface_marble_migration_202607020001_20260702130018_reconciliation_v1.meta.md.
  See "Second Dry Run" section below.
---

# Remote Migration Reconciliation Validation

## Command

```
supabase db push --dry-run
```

Run once, after Stage A (2 renames) and Stage C (15 recovered files) were complete, and after Stage B held
`20260702130018` without modification. Authorized solely as validation per this OAR2 section 10 — no actual
push was performed.

## Complete Result

```
Initialising login role...
DRY RUN: migrations will *not* be pushed to the database.
Connecting to remote database...
Remote migration versions not found in local migrations directory.

Make sure your local git repo is up-to-date. If the error persists, try repairing the migration history table:
supabase migration repair --status reverted 20260702130018

And update local migrations to match remote database:
supabase db pull
```

## Interpretation

Before this OAR2's reconciliation work, this same command listed 18 remote-only versions (see
`docs/oar/c3_field/oar1_investigate_migration_ledger_provenance_drift_v1.meta.md` and
`docs/oar/c3_field/oar1_investigate_and_reconcile_missing_remote_migration_provenance_v1.meta.md`). After Stage
A (2 renames) and Stage C (15 exact recoveries), it now lists exactly **one** — `20260702130018` — which is the
single version this OAR2 deliberately held in Stage B pending further evidence (see
`remote_migration_divergence_review_v1.meta.md`). No other version appears. No unintended migration is
proposed. No schema mutation is proposed. No destructive operation is proposed. The suggested command
(`supabase migration repair --status reverted 20260702130018`) was not run — this OAR2 explicitly prohibits
`migration repair`, and `--status reverted` in particular would misrepresent that this version's change never
happened, which is false; it did happen, its exact SQL is preserved in
`docs/oar/c3_field/missing_remote_migration_ledger_export_v1.json`, and its disposition is "held pending
interpretation," not "reverted."

## Validation Checklist (Section 10)

| Requirement | Result |
|---|---|
| The eighteen remote-only versions are no longer reported as missing locally | 17 of 18 — `20260702130018` remains reported, by design (held) |
| No unintended migration is proposed for remote application | Confirmed — dry run proposes nothing |
| No destructive schema operation is proposed | Confirmed |
| No migration-ledger repair is requested (by this executor) | Confirmed — suggested by CLI output, not executed |
| The dry run exits without migration-history refusal | Not fully met — it still refuses, solely due to the one intentionally-held version |
| Repository status contains only authorized reconciliation artifacts | Confirmed (see OAR1 repository diff) |

Given one version remains an open, honestly-recorded gap, this OAR2 does not meet the bar for
`completed_verified`. Final standing is `completed_with_held_versions`.

## Second Dry Run (After Recovering `20260702130018`)

### Command

```
supabase db push --dry-run
```

### Complete Result

```
Initialising login role...
DRY RUN: migrations will *not* be pushed to the database.
Connecting to remote database...
Found local migration files to be inserted before the last migration on remote database.

Rerun the command with --include-all flag to apply these migrations:
supabase\migrations\202607020001_seat_marble_surface_style_profiles_and_nested_car_acknowledgments.sql
```

`--include-all` was **not** run. No push, no repair, no reconstructed-SQL replay was performed.

### Distinguishing the Three Conditions

**1. Migration-history mismatch (the original 18-version drift):** resolved. This exact error message
("Remote migration versions not found in local migrations directory") no longer appears. All 18 target
versions now have either a recovered file at their governed remote timestamp or (for `202607020001`) a
reasoned, evidence-backed decision to leave them local-only.

**2. Unintended pending migration — new finding, this run:** by successfully recognizing `20260702130018` as
the real, remote-applied version, `202607020001` (chronologically earlier, never remote-applied per the
transfer surface's live query) now reads to the CLI as a local file that predates the last-known-applied
remote migration — an out-of-order insertion. The CLI's own suggested fix is `--include-all`, which would
apply it. **This is exactly the condition the operator's instruction anticipated and prohibited: `202607020001`
is proposed for application. This executor stopped here and did not run `--include-all`, `db push`, or
`migration repair`.** This is evidence to return, not a problem to resolve unilaterally — `202607020001`'s
own status (local-only draft vs. something that should eventually be reconciled some other way) was already
decided as "leave untouched" by the prior step; whether it should ever be pushed is a separate, not-yet-made
operator decision.

**3. The known, intentional, still-unapplied capacity-aware executor-routing migration
(`supabase/migrations/20260714214628_establish_capacity_aware_executor_routing_for_new_moon_to_lions_gate_v1.sql`):**
this dry run's output does not mention it at all. The CLI appears to stop at the first ordering problem it
finds (`202607020001`) rather than enumerating every migration that would be affected by a real push. This
executor cannot confirm from this output alone whether `20260714214628` would apply cleanly, would also be
blocked, or would need `--include-all` too — that determination is blocked on resolving condition 2 first,
since the dry run doesn't get past it.

### Disposition

Provenance drift is reconciled for all 18 target versions. A **new, distinct** ordering condition was
discovered as a direct consequence of that reconciliation succeeding, involving a file
(`202607020001_...`) already known and already deliberately left untouched. This condition, and the resulting
inability to independently confirm the executor-routing migration's push-readiness, are returned as evidence.
No further action was taken.

## A Clean Dry Run Does Not Authorize a Push

No `supabase db push` (non-dry-run) was run, and none is authorized by this OAR2 regardless of this result.

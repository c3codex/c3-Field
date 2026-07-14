---
document_type: oar1
authority_level: execution_evidence
document_scope: remote_migration_repository_reconciliation
title: OAR1 - Reconcile Remote Migration Ledger With Repository History
status: completed_with_held_versions
version: v1
operator: op044
executor: Claude
system: c3_field
source_oar2: docs/oar/c3_field/oar2_reconcile_remote_migration_ledger_with_repository_history_v1.meta.md
initiative_key: new_moon_to_lions_gate_2026
database_mutation_count: 0
migration_ledger_mutation_count: 0
final_standing: completed_with_held_versions
date: 2026-07-14
---

# OAR1 - Reconcile Remote Migration Ledger With Repository History

## Execution Summary

All 18 remote-only migration versions identified in `c3_ledger_0004` now have a truthful repository
disposition: **2 renamed**, **15 recovered** as exact historical files, **1 held** pending further evidence.
Zero database mutation. Zero migration-ledger mutation. No `supabase migration repair` was run. No actual
`supabase db push` was run — only `--dry-run`, authorized solely as validation.

Two points in this execution required stopping for explicit operator confirmation before proceeding, even
though the actions were within this OAR2's pre-authorized scope: the environment's own safety layer flagged
both as consequential enough to confirm rather than execute silently. Both were confirmed by op044 before
continuing (see Executor Standing below).

## Governing Evidence Used

- `docs/oar/c3_field/missing_remote_migration_ledger_export_v1.json` — exact SQL, `name`, and `created_by` for
  all 18 versions, captured from `supabase_migrations.schema_migrations` by an earlier, separately authorized
  session.
- `docs/oar/c3_field/missing_remote_migration_ledger_summary_v1.json`
- `docs/oar/c3_field/missing_remote_migration_content_match_v1.json` — prior sha256/exact-match findings, used
  as a cross-check, not as the sole basis (see Verification below).
- `docs/oar/c3_field/missing_remote_migration_provenance_matrix_v1.meta.md`
- `docs/oar/c3_field/missing_remote_migration_reconciliation_recommendation_v1.meta.md`
- `docs/oar/c3_field/oar1_investigate_and_reconcile_missing_remote_migration_provenance_v1.meta.md`

This executor did not independently re-query the live ledger this session (no path to do so — see
[[project_supabase_migration_ledger_drift]]). The ledger export is trusted as-is, per this OAR2's explicit
governing-evidence list and per op044's confirmation when this trust boundary was raised directly (see
Executor Standing).

## Verification Performed (Not Just Trusted)

Before renaming anything, this executor independently recomputed diffs and hashes for the two Stage A
candidates directly against the ledger export's `statements` text (not by trusting the prior investigation's
"exact match" claim alone):

- Raw byte comparison initially showed a **mismatch** for both candidates (different lengths, different
  sha256). This was not glossed over.
- Root cause found: git's Windows checkout converts `\n` to `\r\n` on disk; the ledger stores `\n` only. After
  normalizing line endings, `20260709190108` was byte-identical; `20260702125802` was identical apart from one
  trailing-newline character. Both are genuine exact matches; the earlier raw mismatch was a checkout artifact,
  not a content difference.
- Every recovered file's sha256 (Stage C) was independently recomputed post-write and cross-checked against
  `missing_remote_migration_content_match_v1.json`'s recorded values — all 15 matched exactly.

## Stage A — Cross-Environment Timestamp Review

See `docs/oar/c3_field/remote_migration_cross_environment_timestamp_review_v1.meta.md`. No other governed
environment (one linked Supabase project; every git ref in this repository) was found to record either prior
local timestamp (`202607010007`, `20260709190000`). Renamed both via `git mv` (history-preserving; prior
filenames remain recoverable via `git log --follow`):

- `202607010007_make_undrifted_launch_edition_publication_cover.sql` → `20260702125802_make_undrifted_launch_edition_publication_cover.sql`
- `20260709190000_record_undrifted_issue001_buffer_manifest_export_standing_v1.sql` → `20260709190108_record_undrifted_issue001_buffer_manifest_export_standing_v1.sql`

## Stage B — Divergence Review

See `docs/oar/c3_field/remote_migration_divergence_review_v1.meta.md`.

- `20260702130018`: **held**. Same-name local file `202607020001_seat_marble_surface_style_profiles_and_nested_car_acknowledgments.sql`
  has `surface_type = 'results'`; ledger version has `surface_type = 'threshold'` with an inline comment
  identifying this as a check-constraint fix. Resolving which is truthful for `202607020001` itself requires
  that version's own ledger row, which is outside this OAR2's governing-evidence set. No file touched.
- `20260702164214`: **recovered, not held**. Directly diffed against `20260702203335` (same day, ~2h51m later)
  and confirmed superseded — `20260702203335` replaces the same jsonb path with different final copy. This
  determination required no guessing (both SQL texts are in the governing evidence), so it was recovered as an
  exact historical file representing what actually happened, not adjusted to resemble the superseding version.

## Stage C — Exact Ledger-Backed Historical Recovery

15 new migration files created, verbatim from the ledger export's `statements` field, unmodified. Full list,
per-version sha256, and affected objects: `docs/oar/c3_field/recovered_remote_migration_manifest_v1.meta.md`,
Group 2. Includes the 13 direct-recovery candidates, plus `20260702164214` (Stage B, confirmed superseded), plus
`20260706061910` (evidenced direct execution, given local-chain representation per this OAR2's explicit
instruction that "an evidenced direct execution route does not remove the need for a timestamp-matching
repository representation").

## Validation

`supabase db push --dry-run` run once, after all repository changes. Full output and interpretation:
`docs/oar/c3_field/remote_migration_reconciliation_validation_v1.meta.md`. Result: the CLI's migration-ledger
refusal now names exactly one version — `20260702130018`, the one this OAR2 deliberately held — down from 18
before this OAR2's work. No unintended migration, no schema mutation, no destructive operation was proposed.
The CLI's own suggested `migration repair --status reverted 20260702130018` was not run.

## Executor Standing

Two actions within this OAR2's pre-authorized scope were stopped for explicit operator confirmation rather than
executed on this executor's own judgment, because the environment's safety layer flagged them:

1. **The two Stage A renames**, after the classifier noted the raw (pre-line-ending-normalization) hash
   comparison had failed to confirm an exact match. op044 confirmed proceeding after this executor presented
   the full diff evidence (line-ending-normalized match).
2. **Writing the 15 Stage C recovered files**, because this executor cannot independently re-verify the ledger
   export against the live database this session, and was effectively trusting an artifact produced by a
   different session's authority. op044 confirmed proceeding with the recovery as governed by the ledger
   export.

Both confirmations are consistent with this OAR2's own authority model: op044 is named as the deciding party
for exactly this kind of judgment call, and this executor surfaced the question rather than resolving it
alone or silently working around the environment's caution.

## Mutation Count

- Database mutation: 0.
- Migration-ledger mutation: 0.
- Repository mutation: 2 renames (`git mv`, content unchanged) + 15 new files + 5 new documentation artifacts
  (this file, the manifest, the two review docs, and the validation doc) + registry/ledger index updates from
  the immediately prior OAR1 (`c3_ledger_0004`) are unaffected by this run.

## Repository Diff

Created:

- `supabase/migrations/20260702143712_decommission_registered_runtime_active_standing.sql`
- `supabase/migrations/20260702151435_reseat_crystal_intro_video_and_headline.sql`
- `supabase/migrations/20260702153744_fix_year_2026_and_seat_motion_cdn_urls.sql`
- `supabase/migrations/20260702154341_fix_display_titles_for_document_title_pipeline.sql`
- `supabase/migrations/20260702164214_seat_threshold_plaque_context_lines.sql`
- `supabase/migrations/20260702174145_seat_missing_cdn_urls_marble_orientation_and_obsidian.sql`
- `supabase/migrations/20260702174248_reseat_marble_orientation_surface_correct_bucket_and_path.sql`
- `supabase/migrations/20260702174411_reseat_cdn_urls_until_env_var_live.sql`
- `supabase/migrations/20260702203335_seat_crystal_obsidian_surface_assets_and_normalize_encounter_surfaces_to_r2.sql`
- `supabase/migrations/20260702204120_correct_surface_backgrounds_to_supabase_measures_registry_bucket.sql`
- `supabase/migrations/20260702205631_seat_marble_payment_and_resolution_surface_profiles_v1.sql`
- `supabase/migrations/20260705184946_seat_institutional_metadata_authority.sql`
- `supabase/migrations/20260705190138_seat_encounter_style_authority_in_field_measures_db.sql`
- `supabase/migrations/20260705190228_correct_publication_dispatch_and_seat_paragraph_social_link.sql`
- `supabase/migrations/20260706061910_seat_assessment_and_payment_notification_dispatch.sql`
- `docs/oar/c3_field/recovered_remote_migration_manifest_v1.meta.md`
- `docs/oar/c3_field/remote_migration_cross_environment_timestamp_review_v1.meta.md`
- `docs/oar/c3_field/remote_migration_divergence_review_v1.meta.md`
- `docs/oar/c3_field/remote_migration_reconciliation_validation_v1.meta.md`
- `docs/oar/c3_field/oar1_reconcile_remote_migration_ledger_with_repository_history_v1.meta.md` (this file)

Renamed (`git mv`, content unchanged):

- `supabase/migrations/202607010007_make_undrifted_launch_edition_publication_cover.sql` → `20260702125802_...`
- `supabase/migrations/20260709190000_record_undrifted_issue001_buffer_manifest_export_standing_v1.sql` → `20260709190108_...`

No `src` file was edited. No existing migration file's content was edited (only the two above were renamed,
content byte-for-byte unchanged apart from checked-out line-ending normalization).

## Registered Holds

- `20260702130018` remains held (Stage B, see above) — no file created or renamed.
- Everything this OAR2 and its parent ledger entry already hold: database mutation, migration-ledger mutation,
  actual `db push`, and all Inanna `register_SEAT` mutation.
- Whether Claude's migration hold (from the addendum OAR1,
  `docs/oar/c3_field/oar1_addendum_establish_capacity_aware_executor_routing_for_new_moon_to_lions_gate_v1.meta.md`)
  may be lifted is a separate operator decision, not made by this OAR1. The dry-run result above (17 of 18
  resolved) is evidence relevant to that decision, not a determination of it.

## Next Recommended Step

Not a new OAR2 by default. Two threads remain for op044/Chazz:

1. Decide how to resolve `20260702130018` — either accept the ledger's in-SQL explanation as sufficient (in
   which case a follow-up bounded OAR2 can create the file), or authorize a read of `202607020001`'s own
   ledger row first.
2. Decide whether the capacity-aware executor routing migration
   (`supabase/migrations/20260714214628_establish_capacity_aware_executor_routing_for_new_moon_to_lions_gate_v1.sql`,
   still unapplied) can now proceed given 17 of 18 drift versions are resolved and the dry run is otherwise
   clean.

## Final Standing

`completed_with_held_versions`

17 of 18 versions now have a truthful, verified repository disposition. One remains honestly held. Nothing was
mutated in the database. Nothing was repaired in the ledger.

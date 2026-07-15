---
document_type: recovery_manifest
document_scope: missing_remote_migration_provenance
source_oar2: docs/oar/c3_field/oar2_reconcile_remote_migration_ledger_with_repository_history_v1.meta.md
status: completed_verified
version_count: 18
recovered_count: 16
renamed_count: 2
held_count: 0
mutation_count: 0
migration_ledger_mutation_count: 0
amendment: >
  2026-07-14, later same day: docs/oar/c3_field/transfer_surface_marble_migration_202607020001_20260702130018_reconciliation_v1.meta.md
  supplied a live-ledger-confirmed answer (no `supabase_migrations.schema_migrations` row exists for
  version 202607020001) that resolves the prior hold on 20260702130018. See Group 3 (Amended) below.
---

# Recovered Remote Migration Manifest

## Standing

This manifest records, per version, exactly what this OAR2 did to the repository. None of the content below
was executed against the live database. None of the content below altered `supabase_migrations.schema_migrations`.
All SQL text was sourced verbatim from `docs/oar/c3_field/missing_remote_migration_ledger_export_v1.json`
(`statements` field), produced by an earlier, separately authorized read-only ledger query
(`docs/oar/c3_field/oar1_investigate_and_reconcile_missing_remote_migration_provenance_v1.meta.md`). This
executor did not independently re-query the live ledger; the export is trusted as the sole SQL source per this
OAR2's explicit governing-evidence list.

None of the recovered files are original repository artifacts. Each is a verbatim historical recovery from the
live ledger, created in this session, and is labeled as such here rather than in the file itself, per Recovery
Fidelity Rule 6/7 (recovered SQL must stay free of provenance commentary; provenance lives in this sidecar).

## Group 1 — Renamed (Stage A)

| Version | Prior local file | New file | Verification |
|---|---|---|---|
| `20260702125802` | `supabase/migrations/202607010007_make_undrifted_launch_edition_publication_cover.sql` | `supabase/migrations/20260702125802_make_undrifted_launch_edition_publication_cover.sql` | Byte-identical to ledger `statements` after normalizing CRLF→LF and trailing whitespace (verified this session via direct Node string/hash comparison, not by trusting the prior investigation's claim alone) |
| `20260709190108` | `supabase/migrations/20260709190000_record_undrifted_issue001_buffer_manifest_export_standing_v1.sql` | `supabase/migrations/20260709190108_record_undrifted_issue001_buffer_manifest_export_standing_v1.sql` | Byte-identical to ledger `statements` after normalizing CRLF→LF (verified this session) |

Cross-environment check performed before renaming (Stage A requirement): no other governed environment was
found to record either prior local timestamp. Checked: the single linked Supabase project (`zfihrspxvennjzazxcbj`,
confirmed via `supabase projects list` earlier this session — no second project exists); every git ref
(`git for-each-ref` over `refs/heads`, `refs/remotes`, `refs/tags`) for either filename — both appear only on
`measures`/`origin/measures`/`origin/HEAD`, nowhere else. Per this OAR2's Stage A decision rule, absence of
access elsewhere is not proof no other ledger exists; this limitation is recorded, not resolved. Git preserves
full history through `git mv` — the prior filenames remain recoverable via `git log --follow`.

## Group 2 — Recovered (Stage C)

All 15 files below are new; none existed in the repository under any name before this OAR2. SQL is verbatim
from the ledger export, unmodified, unreformatted, uncombined.

| Version | File | sha256 (of recovered file content) | `created_by` | Confidence (per provenance matrix) | Affected objects |
|---|---|---|---|---|---|
| `20260702143712` | `20260702143712_decommission_registered_runtime_active_standing.sql` | `ec4c05d7858a3577981ddd4f1ae61e6223bf8406110973b78c25e76c2bb9cff0` | contribute2c3communitypartners@gmail.com | strong | `measures_registry` |
| `20260702151435` | `20260702151435_reseat_crystal_intro_video_and_headline.sql` | `80a017da364092d9b3d432ce326f7f18e1a4f08d4aa044ff5b90f8410002537d` | contribute2c3communitypartners@gmail.com | partial | `measures_encounter_def`, `measures_media_map` |
| `20260702153744` | `20260702153744_fix_year_2026_and_seat_motion_cdn_urls.sql` | `15738b7067030b02aeed58d773259184cda9fb5014837356ae18e6296ac08411` | contribute2c3communitypartners@gmail.com | partial | `measures_encounter_def`, `measures_media_map` |
| `20260702154341` | `20260702154341_fix_display_titles_for_document_title_pipeline.sql` | `3ad97dc6e61170f6f7d76a4018ef0b2fc5a1797eb84c76d1c4fb820376e50d62` | contribute2c3communitypartners@gmail.com | partial | `measures_encounter_def` |
| `20260702164214` | `20260702164214_seat_threshold_plaque_context_lines.sql` | `5f01f11c8727862ab53bfeef62c85503fdfcc43c4357cd6eb834ee74e3eaf6d9` | contribute2c3communitypartners@gmail.com | strong (see Stage B note below) | `measures_encounter_def` |
| `20260702174145` | `20260702174145_seat_missing_cdn_urls_marble_orientation_and_obsidian.sql` | `f8109d3290242813b2bf5bc59e4a69e5a9569652139a479cab9e36a2a9aec0ed` | contribute2c3communitypartners@gmail.com | partial | `measures_media_map` |
| `20260702174248` | `20260702174248_reseat_marble_orientation_surface_correct_bucket_and_path.sql` | `ed4e9235506cac65ebfeb01f0b453ab1a24e44dbfe5e88bc6ebceb8ba633bd22` | contribute2c3communitypartners@gmail.com | partial | `measures_media_map` |
| `20260702174411` | `20260702174411_reseat_cdn_urls_until_env_var_live.sql` | `c3ad8c4bfa6356d5bab7a9605a0de58fb516f27de1f23f21196cc8e24a8958fc` | contribute2c3communitypartners@gmail.com | partial | `measures_media_map` |
| `20260702203335` | `20260702203335_seat_crystal_obsidian_surface_assets_and_normalize_encounter_surfaces_to_r2.sql` | `dec7aea8c5ed8807d8a186ea809191b326f1661e4680b4a9b47fe435542285e8` | contribute2c3communitypartners@gmail.com | partial | `measures_media_map`, `measures_encounter_def` |
| `20260702204120` | `20260702204120_correct_surface_backgrounds_to_supabase_measures_registry_bucket.sql` | `15cd206f27a68b153ffae93dafd39069af60ff6863ab9c0d35aacfa45a43ae7e` | contribute2c3communitypartners@gmail.com | partial | `measures_media_map` |
| `20260702205631` | `20260702205631_seat_marble_payment_and_resolution_surface_profiles_v1.sql` | `4bb53cc2dd046925f6620ffff965752a7f032bed2503f3458f46423c8a2ed5dd` | contribute2c3communitypartners@gmail.com | partial | `measures_encounter_def`, `measures_encounter_surface_assignment` |
| `20260705184946` | `20260705184946_seat_institutional_metadata_authority.sql` | `a4557a841b025ceba1bf40d42098d547948dfb1d8e1797d2ea546f6a00a65386` | contribute2c3communitypartners@gmail.com | strong | `measures_registry`, `measures_encounter_def` |
| `20260705190138` | `20260705190138_seat_encounter_style_authority_in_field_measures_db.sql` | `b9dc5bad18fe3e3b096a26474d3a40d27070fbeff059f7a0fac005e98c4ca3f7` | contribute2c3communitypartners@gmail.com | strong | `measures_encounter_surface_assignment` |
| `20260705190228` | `20260705190228_correct_publication_dispatch_and_seat_paragraph_social_link.sql` | `f7f812e41e5b8b15693002cd71f296d319b7ce470135ba488252d81dbf5a78f4` | contribute2c3communitypartners@gmail.com | strong | `measures_encounter_surface_assignment`, `measures_registry` |
| `20260706061910` | `20260706061910_seat_assessment_and_payment_notification_dispatch.sql` | `2920b5b63a179ed31df839596b6df3cb97173909f65cb6b7f2d4a7006330ebfe` | contribute2c3communitypartners@gmail.com | exact (live effects independently confirmed present per prior investigation) | `measures_notification_template`, `measures_notification_dispatch_log` (new tables), triggers, indexes |
| `20260702130018` | `20260702130018_seat_marble_surface_style_profiles_and_nested_car_acknowledgments.sql` | `d3e73cb866dbe1cef6fc2f3dbd3eeba61ba664ede5792c68917a911f9fa16d31` | contribute2c3communitypartners@gmail.com | exact (resolved 2026-07-14, see amendment below) | `measures_media_map`, `measures_registry`, `measures_encounter_def`, `measures_encounter_surface_assignment` |

Every sha256 above was independently recomputed by this executor over the exact bytes written to the recovered
file (not merely copied from the prior investigation's `missing_remote_migration_content_match_v1.json`), and
matches that file's recorded value in every case.

### Stage B note on `20260702164214`

This version's effect (adding `context` lines to `threshold_copy.plaques`) was superseded the same day by
`20260702203335`'s wholesale replacement of `threshold_copy` with different final copy. This was confirmed by
directly diffing both versions' ledger SQL (not inferred) — see
`docs/oar/c3_field/remote_migration_divergence_review_v1.meta.md`. Per this OAR2's rule "historical recovery
may represent an effect later superseded; it must not be rewritten to resemble current state," the file is
recovered as originally applied, not adjusted to match the superseding version.

## Group 3 (Amended) — Resolved, No Longer Held

`20260702130018` was held pending confirmation of `202607020001`'s own remote ledger standing. That evidence
arrived same-day via
`docs/oar/c3_field/transfer_surface_marble_migration_202607020001_20260702130018_reconciliation_v1.meta.md`:
a live, read-only query of `supabase_migrations.schema_migrations` for version `202607020001` returned **no
row** — the current live ledger retains no evidence `202607020001` was ever applied remotely under that
version. Combined with the original finding (ledger `20260702130018` corrects `surface_type` from `'results'`
to `'threshold'`, matching the live `measures_encounter_def_surface_type_check` constraint, which does not
accept `'results'`), this resolves the divergence:

- `202607020001` is reclassified **local-only / not proven remotely ledger-applied**. Its file is left exactly
  as-is — not edited, renamed, or deleted, per explicit instruction. It remains in the repository as local
  historical draft material.
- `20260702130018` is recovered verbatim as its own distinct historical migration:
  `supabase/migrations/20260702130018_seat_marble_surface_style_profiles_and_nested_car_acknowledgments.sql`
  (sha256 `d3e73cb866dbe1cef6fc2f3dbd3eeba61ba664ede5792c68917a911f9fa16d31`, independently recomputed by this
  executor from the same ledger export used in the initial pass, and cross-checked against the transfer
  surface's independently-stated hash — both match).
- The transfer surface's stated local-file hash for `202607020001`
  (`d202488043b81ee76eaecc3a3c449c0276b36751201c95a8898d95be59a38815`) was independently reproduced by this
  executor after normalizing CRLF→LF and trimming trailing whitespace — the same checkout artifact identified
  earlier in this reconciliation, not a sign of unexpected drift in the local file.

This closes Group 3. All 18 versions now have a resolved disposition: 2 renamed, 16 recovered, 0 held.

## Recovery Fidelity Confirmation

- No SQL was reconstructed from present schema state.
- No SQL was modernized, corrected, reformatted, or combined across versions.
- No placeholder or empty migration was created.
- No recovered file is described as an original repository artifact (that description lives here, not in the files).
- Executable SQL and provenance commentary were kept separate (provenance is in this manifest; the recovered
  files contain only the original author's own inline SQL comments, unmodified).

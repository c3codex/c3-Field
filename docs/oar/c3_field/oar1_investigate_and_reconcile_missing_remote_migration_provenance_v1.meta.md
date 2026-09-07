---
document_type: oar1
authority_level: execution_evidence
document_scope: migration_provenance_investigation
title: OAR1 - Investigate and Reconcile Missing Remote Migration Provenance
status: completed_with_unresolved_versions
version: v1
operator: op044
system: c3_field
source_oar2: docs/oar/c3_field/oar2_investigate_and_reconcile_missing_remote_migration_provenance_v1.meta.md
initiative_key: new_moon_to_lions_gate_2026
mutation_count: 0
version_count: 18
final_standing: completed_with_unresolved_versions
---

# OAR1 - Investigate and Reconcile Missing Remote Migration Provenance

## Summary

Read-only provenance investigation completed for all 18 remote-only Supabase migration versions. The prior 17-version count is corrected to 18.

No database mutation, ledger mutation, migration repair, migration reconstruction, db push, db reset, or Inanna implementation was performed.

## Artifacts Created

- docs/oar/c3_field/missing_remote_migration_ledger_export_v1.json
- docs/oar/c3_field/missing_remote_migration_ledger_summary_v1.json
- docs/oar/c3_field/missing_remote_migration_content_match_v1.json
- docs/oar/c3_field/missing_remote_migration_provenance_matrix_v1.meta.md
- docs/oar/c3_field/missing_remote_migration_reconciliation_recommendation_v1.meta.md
- docs/oar/c3_field/oar1_investigate_and_reconcile_missing_remote_migration_provenance_v1.meta.md

## Ledger Evidence

Live table inspected read-only: `supabase_migrations.schema_migrations`.

Available fields:

- version
- statements
- name
- created_by
- idempotency_key
- rollback

Unavailable fields in this ledger table:

- execution timestamp
- checksum
- commit SHA

All 18 target rows were present. All 18 retained exact SQL in `statements`.

## Repository And GitHub Evidence

Current migration directory contains no timestamp-matching file for any of the 18 remote versions.

Current-file exact SQL matches:

- 20260702125802 exactly matches `supabase/migrations/202607010007_make_undrifted_launch_edition_publication_cover.sql`.
- 20260709190108 exactly matches `supabase/migrations/20260709190000_record_undrifted_issue001_buffer_manifest_export_standing_v1.sql`.

Current-file name match without exact SQL match:

- 20260702130018 has a same-name local/GitHub file at `supabase/migrations/202607020001_seat_marble_surface_style_profiles_and_nested_car_acknowledgments.sql`, but content differs from ledger SQL.

GitHub connector readback on branch `measures` confirmed the three known local equivalent paths exist remotely. Direct fetches for the timestamp-matching remote-only paths `20260702125802...` and `20260709190108...` returned 404. `gh` CLI was unavailable, so GitHub inspection was limited to connector file fetches and read-only `git ls-remote`.

Remote refs visible via `git ls-remote`:

- refs/heads/measures
- refs/heads/c3field
- refs/heads/canon
- refs/heads/initiative/c3-field-convergence-infra
- refs/heads/cloudflare/workers-autoconfig
- refs/tags/legacy-c3field-pre-canon
- refs/tags/session2_oar

## OAR Correlation

Strong or exact OAR correlations were found for:

- 20260702125802: make unDrifted launch edition publication cover
- 20260702130018: seat marble surface style profiles and nested CAR acknowledgments
- 20260702143712: OAR1 says `202607020002_decommission_registered_runtime_active_standing` applied
- 20260705184946: seat institutional metadata authority
- 20260705190138: seat encounter style authority in Field Measures DB
- 20260706061910: seat assessment and payment notification dispatch, applied via Supabase MCP
- 20260709190108: export Issue 001 campaign to Buffer draft manifest, DB metadata already live via apply_migration

Other versions retain exact ledger SQL but incomplete OAR/commit correlation.

## Live Effects

Read-only live checks confirmed examples of remaining effects:

- ledger target count: 18
- `undrifted_publication_masthead` active in `measures_media_map`
- `marble_chamber_results` released and encounterable
- `marble_orientation_surface` active
- style authority sample present on crystal/marble surfaces
- `publication_dispatch` correction present as absence of frame/style profile fields
- `measures_notification_template` and `measures_notification_dispatch_log` exist
- five notification templates active
- Buffer manifest metadata present on campaign distribution assets

Some targeted probes returned no rows or partial results; those versions remain partial/unresolved in the matrix rather than being overclaimed.

## Provenance Summary

Confidence counts:

- exact: 3
- strong: 5
- partial: 10
- unresolved: 0

Unresolved does not mean no SQL. The ledger has SQL for every version. The unresolved portions are execution route, OAR/commit linkage, and final reconciliation disposition for partial rows.

## Recommended Next Executor

Chazz should review the matrix for systems alignment and decide which rows are sufficient for exact file recovery versus equivalence registration. Claude should remain held for mutation that depends on `supabase db push` until op044 authorizes a follow-on reconciliation OAR.

Claude may safely resume read-only advisement. Claude should not safely resume migration mutation or Inanna register_SEAT mutation through the normal Supabase migration workflow until this ledger/repo mismatch is resolved or bypass authority is explicitly seated.

## Repository Diff

Expected new artifacts are the six files listed above. Existing source/runtime files were not edited. Existing migration files were not edited.

## Final Standing

completed_with_unresolved_versions

---
document_type: migration_draft_provenance_note
document_scope: quarantined_local_only_migration
title: Provenance Note - 202607020001 Seat Marble Surface Style Profiles And Nested CAR Acknowledgments
status: quarantined_local_only
operator: op044
source_disposition: >
  docs/oar/c3_field/transfer_surface_marble_migration_202607020001_20260702130018_reconciliation_v1.meta.md
source_oar1: docs/oar/c3_field/oar1_reconcile_remote_migration_ledger_with_repository_history_v1.meta.md
quarantined_from: supabase/migrations/202607020001_seat_marble_surface_style_profiles_and_nested_car_acknowledgments.sql
quarantined_to: docs/_source/codex/migration_drafts/202607020001_seat_marble_surface_style_profiles_and_nested_car_acknowledgments.sql
db_mutation: false
ledger_mutation: false
migration_repair: false
date: 2026-07-14
---

# Provenance Note - `202607020001_seat_marble_surface_style_profiles_and_nested_car_acknowledgments.sql`

## Standing

This file is quarantined historical draft material. It is not executable migration authority. It is not part
of the tracked `supabase/migrations/` chain and will not be picked up by `supabase db push`.

## Facts

- No row for version `202607020001` exists in the live migration ledger
  (`supabase_migrations.schema_migrations`). A live, read-only query filtered to this exact version returned
  no result. This is confirmed, not inferred.
- This file is local-only. It has never been proven to have been applied remotely under this version.
- Its `INSERT INTO public.measures_encounter_def` for `marble_chamber_results` sets `surface_type = 'results'`.
  The live `measures_encounter_def_surface_type_check` constraint does not accept `'results'` as a valid value
  (accepted values: `scroll`, `aspect`, `inscription`, `passage`, `glyph_surface`, `phase_map`, `threshold`,
  `chamberplate`). If this file were ever executed against the current constraint, that specific insert would
  fail.
- The distinct, ledger-seated corrective migration is
  `supabase/migrations/20260702130018_seat_marble_surface_style_profiles_and_nested_car_acknowledgments.sql`,
  recovered verbatim from the live ledger's retained `statements` value. It is otherwise identical to this file
  except that it sets `surface_type = 'threshold'`, with its own inline comment: *"Fix: surface_type =
  'threshold' (not 'results' — check constraint)."* `20260702130018` is the version actually reflected in the
  current live `marble_chamber_results` row (`surface_type = 'threshold'`, released/encounterable).
- This file is preserved as historical draft evidence of what was authored locally before the fix, not as
  executable authority. It documents the drafting history of the marble surface style profile work; it does
  not describe the current or ever-actually-applied database state.

## What This Quarantine Is Not

- Not a migration repair. `supabase_migrations.schema_migrations` was not touched.
- Not a database mutation. No SQL from this file, or any other, was executed as part of this quarantine.
- Not a deletion. The file's SQL content is unchanged, byte-for-byte, from its prior location.
- Not a judgment that the file's authorship or intent was wrong — only that its `surface_type` value does not
  match what the constraint accepts and was never the version the live ledger retained as applied.

## Reference

Full evidence trail: `docs/oar/c3_field/recovered_remote_migration_manifest_v1.meta.md` (Group 3, amended),
`docs/oar/c3_field/remote_migration_divergence_review_v1.meta.md`,
`docs/oar/c3_field/transfer_surface_marble_migration_202607020001_20260702130018_reconciliation_v1.meta.md`.

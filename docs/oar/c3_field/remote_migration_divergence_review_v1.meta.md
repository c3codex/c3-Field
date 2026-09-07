---
document_type: divergence_review
document_scope: missing_remote_migration_provenance
source_oar2: docs/oar/c3_field/oar2_reconcile_remote_migration_ledger_with_repository_history_v1.meta.md
status: completed
amendment: >
  2026-07-14, later same day: resolved via
  docs/oar/c3_field/transfer_surface_marble_migration_202607020001_20260702130018_reconciliation_v1.meta.md.
  See "Resolution" section appended below.
---

# Divergence Review (OAR2 Stage B)

## `20260702130018` — Originally Held, Now Resolved

**Local same-name file:** `supabase/migrations/202607020001_seat_marble_surface_style_profiles_and_nested_car_acknowledgments.sql`

**Exact diff found:** the local file's `INSERT INTO public.measures_encounter_def` for `marble_chamber_results`
sets `surface_type = 'results'` (line 87 of the local file). The ledger's `20260702130018` row contains the
same migration, byte-identical except that `surface_type = 'threshold'`, with the ledger SQL's own leading
comment stating: *"Fix: surface_type = 'threshold' (not 'results' — check constraint)."* Every other line of
both versions is identical (verified by direct string diff, not summarized from memory).

**Determination attempted:** the ledger SQL is self-documenting that `'results'` fails a check constraint and
`'threshold'` is the corrected value. Taken alone, this reads as "ledger supersedes local file." However,
`202607020001` is itself already present in the remote ledger under its own version (it was not one of the 18
target versions — the earlier investigation only exported those 18, not `202607020001`'s own row). This
executor cannot confirm from available evidence whether:

- `202607020001`'s actually-applied remote content already reads `'threshold'` (i.e., it was corrected in place
  before or during application, and the local file simply never got updated to match), or
- `202607020001` failed at application time (the check constraint the comment describes) and never took
  effect, with `20260702130018` being the real, only-successful application, or
- some other sequence occurred.

**Original disposition:** held, not resolved. Per this OAR2's Stage B decision rule ("if interpretation or
reconstruction is required, Claude shall hold that version and return it to op044"), no file was renamed,
merged, or created for this version at the time.

### Resolution (same day)

`docs/oar/c3_field/transfer_surface_marble_migration_202607020001_20260702130018_reconciliation_v1.meta.md`
supplied the missing piece: a live, read-only query of `supabase_migrations.schema_migrations` filtered to
version `202607020001` specifically returned **no row**. The current live ledger retains no evidence that
`202607020001` was ever applied remotely under that version — which is exactly the fact this executor lacked
when it held the version.

op044/Chazz accepted this as sufficient. Per their explicit instruction:

- `202607020001` is now classified **local-only / not proven remotely ledger-applied**. Its file
  (`supabase/migrations/202607020001_seat_marble_surface_style_profiles_and_nested_car_acknowledgments.sql`)
  was not edited, renamed, or deleted.
- `20260702130018` was recovered verbatim as its own historical migration file
  (`supabase/migrations/20260702130018_seat_marble_surface_style_profiles_and_nested_car_acknowledgments.sql`),
  sha256 `d3e73cb866dbe1cef6fc2f3dbd3eeba61ba664ede5792c68917a911f9fa16d31` — recomputed by this executor
  directly from the ledger export (not merely copied from the transfer surface's stated value), and it matches.

This version is no longer held.

## `20260702164214` — Recovered (not held)

**Content:** `UPDATE public.measures_encounter_def ... jsonb_set(... '{threshold_copy,plaques}' ...)`, adding a
`context` string to each of the two `ai_isnt_broken_intro` threshold plaques.

**Determination:** directly diffing this version's SQL against `20260702203335`'s SQL (both present in the
governing ledger export, no external inference needed) shows `20260702203335` — applied the same day, ~2h51m
later (17:42:14 → 20:33:35) — replaces the entire `threshold_copy` object at the same jsonb path with a
different, more complete "final approved copy," itself including its own `context` fields with different
wording (e.g. "Evaluate your AI operating environment and identify conditions that may lead to operational
fragmentation, instability, or structural drift." vs. the earlier "Discover how your operating environment
shapes AI behavior.").

**Disposition:** recovered as its own exact historical file
(`supabase/migrations/20260702164214_seat_threshold_plaque_context_lines.sql`), representing what actually
happened at that point in history, not rewritten to match the superseding version. This satisfies the
decision rule's "exact historical representation... without guessing" bar — the supersession is directly
readable from the two versions' own SQL, not inferred from external state.

## Method Note

Both determinations above were made by comparing the two ledger SQL texts directly against each other and
against the current local file, using exact string search (Node.js) rather than summarizing from memory or
trusting either the ledger export's row order or the prior investigation's provenance-matrix wording alone.

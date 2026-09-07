---
document_type: transfer_surface
document_scope: marble_migration_reconciliation
title: Transfer Surface - Marble Migration 202607020001 / 20260702130018 Reconciliation
status: ready_for_op044_chazz_review
version: v1
operator: op044
system: c3_field
audience:
  - op044
  - Chazz
source_request: bounded_read_only_reconciliation_check_202607020001_20260702130018
source_oar: docs/oar/c3_field/oar2_investigate_and_reconcile_missing_remote_migration_provenance_v1.meta.md
mutation_count: 0
db_mutation: false
ledger_mutation: false
repo_migration_mutation: false
src_mutation: false
---

# Transfer Surface - Marble Migration Reconciliation

## Transfer Standing

This transfer surface packages the bounded read-only reconciliation check for migration versions `202607020001` and `20260702130018`.

It is not an execution OAR, not a repair authorization, and not permission to mutate the migration ledger, live database, repository migrations, or renderer source.

No `migration repair`, `db push`, reconstructed SQL replay, repository migration edit, application source edit, or live data mutation was performed.

## Bounded Question

Compare the remote migration ledger evidence for:

- `202607020001`
- `20260702130018`

against:

- `supabase/migrations/202607020001_seat_marble_surface_style_profiles_and_nested_car_acknowledgments.sql`

and determine whether the later remote ledger migration can be recovered as distinct historical provenance without changing the present local file.

## Ledger Evidence

### `202607020001`

Remote ledger standing:

- `supabase_migrations.schema_migrations` returned no row for version `202607020001`.
- No remote ledger `version`, `name`, `statements`, `created_by`, `idempotency_key`, or `rollback` values were available for this version in the current live ledger.

Evidence standing:

- There is no current live ledger evidence that `202607020001` was applied remotely.
- This does not prove the SQL was never executed by any other route; it only proves the current migration ledger does not retain that version row.

### `20260702130018`

Remote ledger row:

- `version`: `20260702130018`
- `name`: `seat_marble_surface_style_profiles_and_nested_car_acknowledgments`
- `created_by`: `contribute2c3communitypartners@gmail.com`
- `idempotency_key`: `null`
- `rollback`: `null`
- `statements`: one retained SQL statement
- `statement_sha256`: `d3e73cb866dbe1cef6fc2f3dbd3eeba61ba664ede5792c68917a911f9fa16d31`

Decisive remote statement evidence:

```sql
-- Fix: surface_type = 'threshold' (not 'results' -- check constraint)
```

and the retained insert/select path seats `marble_chamber_results` with:

```sql
'marble_chamber_results', 'Assessment Findings', 'view', 'marble', 'threshold', true
```

Evidence standing:

- The remote ledger retained `20260702130018` as a distinct version.
- The retained SQL explicitly corrects `surface_type` from `results` to `threshold`.

## Local File Comparison

Local file checked:

- `supabase/migrations/202607020001_seat_marble_surface_style_profiles_and_nested_car_acknowledgments.sql`

Local file evidence:

- `sha256`: `d202488043b81ee76eaecc3a3c449c0276b36751201c95a8898d95be59a38815`
- local file contains `surface_type = 'results'`
- local file does not contain the remote correction comment from `20260702130018`
- local file does not match the retained remote SQL for `20260702130018`

Comparison standing:

- `202607020001` cannot be confirmed as remotely applied from the current ledger.
- The current local `202607020001` file does not match the retained remote `20260702130018` SQL.
- The mismatch is material because `results` is not accepted by the current live `surface_type` constraint, while `threshold` is accepted.

## Current Constraint Evidence

Current live constraint affecting the migration:

```sql
measures_encounter_def_surface_type_check
CHECK (
  (
    (surface_type IS NULL)
    OR (
      surface_type = ANY (
        ARRAY[
          'scroll'::text,
          'aspect'::text,
          'inscription'::text,
          'passage'::text,
          'glyph_surface'::text,
          'phase_map'::text,
          'threshold'::text,
          'chamberplate'::text
        ]
      )
    )
  )
)
```

Constraint standing:

- `threshold` is valid.
- `results` is not valid.
- No later ledger migration was found that changed this constraint after `20260702130018`.

## Current Marble Surface Row Evidence

Relevant live marble standing:

| row | current `surface_type` | standing |
| --- | --- | --- |
| `marble_chamber_results` | `threshold` | released / encounterable / active |
| `marble_chamber_orientation` | `threshold` | released / encounterable / active |
| `marble_chamber_C2_agreement` | `threshold` | released / encounterable |
| `marble_chamber_C2_resolution` | `threshold` | released / encounterable |
| `marble_chamber_encounter` | `threshold` | released / encounterable |
| `marble_pathway_reveal` | `threshold` | held / archived |
| `map_integrity_governance` | `null` | related marble governance row; no encounter `surface_type` |

Standing:

- The live row state aligns with the `threshold` correction retained in `20260702130018`.
- The live row state does not support `results` as the current accepted value.

## Later Ledger Evidence

Later ledger migrations found affecting related marble rows or presentation state:

- `20260702154341` - `fix_display_titles_for_document_title_pipeline`
- `20260702174145` - `seat_missing_cdn_urls_marble_orientation_and_obsidian`
- `20260702203335` - `seat_crystal_obsidian_surface_assets_and_normalize_encounter_surfaces_to_r2`
- `20260702205631` - `seat_marble_payment_and_resolution_surface_profiles_v1`
- `20260705190138` - `seat_encounter_style_authority_in_field_measures_db`

Later migration standing:

- These later migrations affect related titles, media, CDN paths, payment/resolution profiles, or encounter style authority.
- No later migration was found that establishes a new `surface_type` constraint allowing `results`.
- No later migration was found that supersedes the `threshold` row standing for `marble_chamber_results`.

## Direct Answers

1. Was `202607020001` ever applied remotely?

Current evidence says no ledger proof. The live `supabase_migrations.schema_migrations` table returned no row for `202607020001`.

2. If applied, does its remote SQL match the present local file?

Not answerable as an applied remote ledger row, because `202607020001` is absent from the current live ledger. The present local file also does not match the retained remote SQL for `20260702130018`.

3. Does `20260702130018` correct, supersede, or independently follow `202607020001`?

`20260702130018` appears to correct or supersede the local `202607020001` content for the material `surface_type` issue. Its retained statement explicitly says `threshold`, not `results`, because of the check constraint.

4. Can `20260702130018` be recovered verbatim as a distinct historical migration without changing `202607020001`?

Yes. The remote ledger retains `20260702130018` as a distinct version with retained SQL. It can be recovered verbatim as its own historical migration without editing the existing `202607020001` local file.

5. What later migration, if any, establishes the current live constraint and row state?

No later migration was found that changes the same `surface_type` constraint. The current `marble_chamber_results` row state aligns with `20260702130018`, while later migrations adjust related title, media, CDN, payment/resolution, and style-authority state.

## Disposition Recommendation To op044 / Chazz

Recommended disposition:

- Recover `20260702130018` verbatim as a distinct historical migration from the retained remote ledger SQL.
- Do not change `202607020001` as part of this reconciliation.
- Keep `202607020001` classified as local-only / not currently proven remotely ledger-applied unless separate evidence is produced.
- Preserve the `results` versus `threshold` divergence as the reason `20260702130018` should remain distinct historical provenance.
- Treat the current live `threshold` row state as aligned with the retained `20260702130018` ledger statement.

Held until separately authorized:

- any migration ledger repair
- any `db push`
- any replay of reconstructed SQL
- any edit to `supabase/migrations/202607020001_seat_marble_surface_style_profiles_and_nested_car_acknowledgments.sql`
- any application source mutation

## Next Review Questions

- Should op044 / Chazz accept the retained `20260702130018` ledger statement as sufficient authority for verbatim recovery?
- Should a follow-on recovery OAR be opened to write the distinct historical migration file?
- Should `202607020001` remain in the repository as local-only historical draft material unless separate remote evidence is found?
- Should any dry-run validation be authorized only after the verbatim recovery file is created?

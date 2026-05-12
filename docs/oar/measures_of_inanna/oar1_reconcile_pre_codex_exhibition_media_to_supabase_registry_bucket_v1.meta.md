---
document_type: oar1
authority_level: execution_closeout
document_scope: measures_of_inanna_pre_codex_media_supabase_reconciliation
title: OAR1 - Reconcile Pre-Codex Exhibition Media to Supabase Registry Bucket
status: completed_partial_exact_matches
version: v1
source_oar2: oar2_reconcile_pre_codex_exhibition_media_to_supabase_registry_bucket_v1.meta.md
operator: op044
executor: Cody
---

# OAR1 - Reconcile Pre-Codex Exhibition Media to Supabase Registry Bucket

## Result

Pre-Codex Exhibition media rows were reconciled according to the corrected storage split:

- still image media remains intended for Supabase `measures-registry`
- heavy runtime media remains intended for R2 `measures-media`

The superseded L2-only migration OAR2 was not run.

No frontend files were changed.

No media resolver files were changed.

No encounter resolver files were changed.

No surface mappings were changed.

## Source Rows

Source query:

`public.codex_media_asset where bucket = 'pre-codex-exhibition'`

Source count before reconciliation: 21

Image rows: 16

Heavy media rows: 5

Unknown rows: 0

## Object Verification

Supabase image bucket checked:

`measures-registry`

Supabase exact image object matches: 0

R2 heavy media bucket checked:

`measures-media`

Active R2 manifest:

`docs/_source/working/media/l2_bucket_manifest_v1.txt`

R2 manifest object count: 39

R2 exact heavy object matches: 2

## Repointed Rows

The following exact R2 object matches were repointed from `pre-codex-exhibition` to `measures-media`:

- `chamber_epithets_01_primus_artus_full_song_v1`
  - storage path: `primus_artus.mp3`
  - media type: `audio`
  - new provider: `cloudflare_r2`

- `chamber_epithets_03_percipari_full_song_v1`
  - storage path: `percipari.mp3`
  - media type: `audio`
  - new provider: `cloudflare_r2`

Metadata appended:

- `previous_bucket`
- `previous_storage_provider`
- `migration_oar2`
- `migration_reason`
- `reconciled_to_bucket`
- `reconciled_storage_provider`

## Unmatched Rows

Unmatched rows preserved: 19

Image rows preserved because exact object was not found in Supabase `measures-registry`:

- `chamber_epithets_01_primus_artus_oracle_card_v1`
- `chamber_epithets_01_primus_artus_original_artwork_v1`
- `chamber_epithets_02_gemynd_corpus_oracle_card_v1`
- `chamber_epithets_02_gemynd_corpus_original_artwork_v1`
- `chamber_epithets_03_percipari_oracle_card_v1`
- `chamber_epithets_03_percipari_original_artwork_v1`
- `pre_codex_exhibition_7a748aab_4339_44c2_8136_d45a541054e3_image_v1`
- `pre_codex_exhibition_crystal_temple_image_v1`
- `pre_codex_exhibition_inanna_encounter_image_v1`
- `pre_codex_exhibition_kumurrah_image_v1`
- `pre_codex_exhibition_marble_chamber_codexstone_image_v1`
- `pre_codex_exhibition_obsidian_chamberplate_gate01_image_v1`
- `pre_codex_exhibition_obsidian_chamberplate_gate02_image_v1`
- `pre_codex_exhibition_obsidian_chamberplate_gate03_image_v1`
- `pre_codex_exhibition_percipari_epithet03_chamberplate_image_v1`
- `pre_codex_exhibition_primus_artus_epithet01_chamberplate_image_v1`

Heavy rows preserved because exact object was not found in R2 `measures-media`:

- `pre_codex_exhibition_inanna_temple_encounter_intro_video_v1`
- `pre_codex_exhibition_obsidian_chamberplate_gate02_video_v1`
- `pre_codex_exhibition_obsidian_chamberplate_gate03_video_v1`

## Bucket Provider Counts After

- `measures-media` / `cloudflare_r2`: 9
- `pre-codex-exhibition` / `cloudflare_r2`: 19

## Evidence

Full evidence JSON:

`docs/oar/measures_of_inanna/reconcile_pre_codex_exhibition_media_to_supabase_registry_bucket_v1.json`

Executor:

`docs/oar/measures_of_inanna/execute-reconcile-pre-codex-exhibition-media-to-supabase-registry-bucket.cjs`

## Boundary

No `public.measures_surface_media_map` rows were changed.

No `surface_key`, `role`, `sequence_index`, or `media_key` mapping values were changed.

No frontend files were changed.

No media resolver was changed.

No encounter resolver was changed.

No inferred object names were used.

No storage paths were invented.

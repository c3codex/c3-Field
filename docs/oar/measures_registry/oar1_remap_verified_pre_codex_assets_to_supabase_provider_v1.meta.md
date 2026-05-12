---
document_type: oar1
authority_level: execution_closeout
document_scope: db_media_remap
title: OAR1 - Remap Verified Pre-Codex Assets to Supabase Provider
status: completed_with_held_unmatched_assets
version: v1
operator: op044
system: measures_registry
source_oar2: oar2_remap_verified_pre_codex_assets_to_supabase_provider_v1
---

# OAR1 - Remap Verified Pre-Codex Assets to Supabase Provider

## SUMMARY

Verified Pre-Codex image media rows were remapped from `cloudflare_r2 / pre-codex-exhibition` to Supabase-backed `measures-registry` storage.

DB rows remapped: `9`

Held confirmed assets: `3`

No frontend files, resolver files, source bucket objects, or unrelated media rows were changed.

## TARGET VERIFICATION

All 11 confirmed target assets exist at:

`measures-registry/measures_registry/pre_codex_exhibition/images/`

Each target object had:

- object exists: `true`
- nonzero size: `true`
- signed URL generated: `true`
- retrieval status: `200`

## REMAPPED ROWS

The following existing `public.codex_media_asset` rows were remapped to:

- storage_provider: `supabase`
- bucket: `measures-registry`

Rows:

- `chamber_epithets_02_gemynd_corpus_oracle_card_v1`
  - previous: `cloudflare_r2 / pre-codex-exhibition / gemynd_corpus.png`
  - new: `supabase / measures-registry / measures_registry/pre_codex_exhibition/images/gemynd_corpus.webp`
- `chamber_epithets_02_gemynd_corpus_original_artwork_v1`
  - previous: `cloudflare_r2 / pre-codex-exhibition / gemynd_corpus_original_art.webp`
  - new: `supabase / measures-registry / measures_registry/pre_codex_exhibition/images/gemynd_corpus_original_art.webp`
- `pre_codex_exhibition_marble_chamber_codexstone_image_v1`
  - previous: `cloudflare_r2 / pre-codex-exhibition / marble_chamber_codexstone.webp`
  - new: `supabase / measures-registry / measures_registry/pre_codex_exhibition/images/marble_chamber_codexstone.webp`
- `pre_codex_exhibition_obsidian_chamberplate_gate01_image_v1`
  - previous: `cloudflare_r2 / pre-codex-exhibition / obsidian_chamberplate_gate01.jpeg`
  - new: `supabase / measures-registry / measures_registry/pre_codex_exhibition/images/obsidian_chamberplate_gate01.webp`
- `pre_codex_exhibition_obsidian_chamberplate_gate03_image_v1`
  - previous: `cloudflare_r2 / pre-codex-exhibition / obsidian_chamberplate_gate03.jpeg`
  - new: `supabase / measures-registry / measures_registry/pre_codex_exhibition/images/obsidian_chamberplate_gate03.webp`
- `chamber_epithets_03_percipari_original_artwork_v1`
  - previous: `cloudflare_r2 / pre-codex-exhibition / percipari_original_artwork.webp`
  - new: `supabase / measures-registry / measures_registry/pre_codex_exhibition/images/percipari_original_artwork.webp`
- `chamber_epithets_01_primus_artus_oracle_card_v1`
  - previous: `cloudflare_r2 / pre-codex-exhibition / primus_artus_epithet01_chamberplate.png`
  - new: `supabase / measures-registry / measures_registry/pre_codex_exhibition/images/primus_artus_epithet01_chamberplate.webp`
- `pre_codex_exhibition_primus_artus_epithet01_chamberplate_image_v1`
  - previous: `cloudflare_r2 / pre-codex-exhibition / primus_artus_epithet01_chamberplate.png`
  - new: `supabase / measures-registry / measures_registry/pre_codex_exhibition/images/primus_artus_epithet01_chamberplate.webp`
- `chamber_epithets_01_primus_artus_original_artwork_v1`
  - previous: `cloudflare_r2 / pre-codex-exhibition / primus_artus_original_artwork.webp`
  - new: `supabase / measures-registry / measures_registry/pre_codex_exhibition/images/primus_artus_original_artwork.webp`

## ORIGINAL ARTWORK SCOPE

The chamberplate-scoped `_original_artwork` rows were remapped where matching rows existed:

- `gemynd_corpus_original_art.webp`
- `percipari_original_artwork.webp`
- `primus_artus_original_artwork.webp`

## HELD ASSETS

The following confirmed assets had verified target objects but no matching seated DB row, so no row was invented:

- `antechamber.webp`
- `inanna_epigraph.webp`
- `og.webp`

## PROVIDER COUNTS

Before:

- `measures-media / cloudflare_r2`: `9`
- `pre-codex-exhibition / cloudflare_r2`: `19`

After:

- `measures-media / cloudflare_r2`: `9`
- `measures-registry / supabase`: `9`
- `pre-codex-exhibition / cloudflare_r2`: `10`

## RUNTIME VERIFICATION

Runtime URL resolution remained DB-driven.

Verified resolver output for remapped rows:

- chamberplate/oracle row: `chamber_epithets_02_gemynd_corpus_oracle_card_v1`
  - resolved to Supabase storage public URL for `gemynd_corpus.webp`
- original artwork row: `chamber_epithets_02_gemynd_corpus_original_artwork_v1`
  - resolved to Supabase storage public URL for `gemynd_corpus_original_art.webp`

Runtime verification gap:

No matching epigraph or passage DB row existed in the authorized candidate set, so that check remains held instead of inventing a row.

## VALIDATION

- remapped DB rows: `9`
- held asset entries: `3`
- unrelated rows unchanged: `19`
- media rows invented: `false`
- frontend mutation performed: `false`
- media resolver mutation performed: `false`
- source objects deleted: `false`

Evidence:

`docs/oar/measures_registry/remap_verified_pre_codex_assets_to_supabase_provider_v1.json`

Executor:

`docs/oar/measures_registry/execute-remap-verified-pre-codex-assets-to-supabase-provider.cjs`

## FINAL STANDING

Verified existing Pre-Codex media rows are now represented as Supabase-backed `codex_media_asset` rows.

Unmatched confirmed assets remain held for a future seating OAR if those assets need explicit DB rows.

---
document_type: oar1
authority_level: execution_closeout
document_scope: db_media_remap
title: OAR1 - Confirm Transfer and Remap Operator Verified Pre-Codex Assets
status: blocked_db_storage_provider_contract
version: v1
operator: op044
system: measures_registry
source_oar2: oar2_confirm_transfer_and_remap_operator_verified_pre_codex_assets_v1
---

# OAR1 - Confirm Transfer and Remap Operator Verified Pre-Codex Assets

## SUMMARY

Operator-confirmed Pre-Codex assets were verified against the target Supabase bucket:

`measures-registry/measures_registry/pre_codex_exhibition/images/`

The DB remap was held.

Reason:

`codex_media_asset.storage_provider` currently rejects Supabase provider values. Writing `bucket = measures-registry` while preserving `storage_provider = cloudflare_r2` would create a provider/bucket mismatch and likely break DB-driven runtime URL resolution.

No DB media rows were mutated.

## VERIFIED TARGET OBJECTS

Confirmed assets: `11`

Verified target objects: `8`

Each verified object exists, has nonzero size, generated a signed URL, and returned retrieval status `200`.

- `antechamber.webp`
- `gemynd_corpus.webp`
- `gemynd_corpus_original_art.webp`
- `marble_chamber_codexstone.webp`
- `obsidian_chamberplate_gate03.webp`
- `percipari_original_artwork.webp`
- `primus_artus_epithet01_chamberplate.webp`
- `primus_artus_original_artwork.webp`

## MISSING TARGET OBJECTS

The following confirmed assets were not present at the target path:

- `inanna_epigraph.webp`
- `obsidian_chamberplate_gate01.webp`
- `og.webp`

## PROPOSED REMAPS HELD

These existing image rows have verified target objects and deterministic operator-confirmed asset relations, but were held because the DB storage provider contract does not yet allow a Supabase-compatible provider value:

- `chamber_epithets_02_gemynd_corpus_oracle_card_v1`
  - previous: `pre-codex-exhibition/gemynd_corpus.png`
  - proposed: `measures-registry/measures_registry/pre_codex_exhibition/images/gemynd_corpus.webp`
- `chamber_epithets_02_gemynd_corpus_original_artwork_v1`
  - previous: `pre-codex-exhibition/gemynd_corpus_original_art.webp`
  - proposed: `measures-registry/measures_registry/pre_codex_exhibition/images/gemynd_corpus_original_art.webp`
- `pre_codex_exhibition_marble_chamber_codexstone_image_v1`
  - previous: `pre-codex-exhibition/marble_chamber_codexstone.webp`
  - proposed: `measures-registry/measures_registry/pre_codex_exhibition/images/marble_chamber_codexstone.webp`
- `pre_codex_exhibition_obsidian_chamberplate_gate03_image_v1`
  - previous: `pre-codex-exhibition/obsidian_chamberplate_gate03.jpeg`
  - proposed: `measures-registry/measures_registry/pre_codex_exhibition/images/obsidian_chamberplate_gate03.webp`
- `chamber_epithets_03_percipari_original_artwork_v1`
  - previous: `pre-codex-exhibition/percipari_original_artwork.webp`
  - proposed: `measures-registry/measures_registry/pre_codex_exhibition/images/percipari_original_artwork.webp`
- `chamber_epithets_01_primus_artus_oracle_card_v1`
  - previous: `pre-codex-exhibition/primus_artus_epithet01_chamberplate.png`
  - proposed: `measures-registry/measures_registry/pre_codex_exhibition/images/primus_artus_epithet01_chamberplate.webp`
- `pre_codex_exhibition_primus_artus_epithet01_chamberplate_image_v1`
  - previous: `pre-codex-exhibition/primus_artus_epithet01_chamberplate.png`
  - proposed: `measures-registry/measures_registry/pre_codex_exhibition/images/primus_artus_epithet01_chamberplate.webp`
- `chamber_epithets_01_primus_artus_original_artwork_v1`
  - previous: `pre-codex-exhibition/primus_artus_original_artwork.webp`
  - proposed: `measures-registry/measures_registry/pre_codex_exhibition/images/primus_artus_original_artwork.webp`

## CHAMBERPLATE-SCOPED ARTWORK

The three `_original_artwork` chamberplate assets all had matching existing DB rows and verified target objects:

- `gemynd_corpus_original_art.webp`
- `percipari_original_artwork.webp`
- `primus_artus_original_artwork.webp`

They were held for the same storage provider contract reason.

## OTHER HELD ASSETS

- `antechamber.webp`: target object verified, but no matching seated `codex_media_asset` row exists.
- `obsidian_chamberplate_gate01.webp`: matching image row exists, but target object is missing.
- `inanna_epigraph.webp`: target object missing and no matching seated DB row found.
- `og.webp`: target object missing and no matching seated DB row found.

## VALIDATION

- remapped DB rows: `0`
- proposed remap rows held: `8`
- held asset entries: `4`
- DB mutation performed: `false`
- frontend mutation performed: `false`
- media resolver mutation performed: `false`
- source objects deleted: `false`
- invented rows created: `false`

Evidence:

`docs/oar/measures_registry/confirm_transfer_and_remap_operator_verified_pre_codex_assets_v1.json`

Executor:

`docs/oar/measures_registry/execute-confirm-transfer-and-remap-operator-verified-pre-codex-assets.cjs`

## CONTRACT ISSUE

The intended remap target is Supabase storage:

- bucket: `measures-registry`
- path prefix: `measures_registry/pre_codex_exhibition/images/`
- intended provider: `supabase`

The live `codex_media_asset` table currently enforces a storage provider constraint that rejects `supabase`.

The safe next step is a follow-up schema/runtime OAR that either:

- updates the `codex_media_asset.storage_provider` contract to allow Supabase-backed rows, or
- defines a seated provider/bucket resolution rule that can represent `measures-registry` without breaking runtime URL resolution.

## FINAL STANDING

Operator confirmation resolved the filename ambiguity.

Target verification succeeded for 8 assets.

DB remap remains held until the storage provider contract can represent Supabase-backed `codex_media_asset` rows safely.

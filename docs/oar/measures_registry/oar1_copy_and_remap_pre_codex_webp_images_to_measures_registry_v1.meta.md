---
document_type: oar1
authority_level: execution_closeout
document_scope: bucket_media_remap
title: OAR1 - Copy and Remap Pre-Codex WebP Images to Measures Registry
status: completed_partial_db_remap_held
version: v1
operator: op044
system: measures_registry
source_oar2: oar2_copy_and_remap_pre_codex_webp_images_to_measures_registry_v1
---

# OAR1 - Copy and Remap Pre-Codex WebP Images to Measures Registry

## SUMMARY

The routed storage copy was executed from Supabase bucket `pre-codex-exhibition` to Supabase bucket `measures-registry`.

Target path convention used:

`measures_registry/pre_codex_exhibition/images/<filename>.webp`

All discovered `.webp` source objects were copied and verified at the target path.

DB remap was not performed because the live DB inventory contains converted-image ambiguity. Several rows still point to `.png` or `.jpeg` source paths with only extension-normalized `.webp` candidates, and the OAR2 explicitly forbids treating filename similarity as proof of mapping correctness.

## SOURCE INVENTORY

- source bucket: `pre-codex-exhibition`
- source object count: `22`
- source `.webp` object count: `13`
- source Pre-Codex image DB rows: `16`

Discovered `.webp` source objects:

- `antechamber.webp`
- `crystal_temple_home.webp`
- `gemynd_corpus.webp`
- `gemynd_corpus_original_art.webp`
- `inanna_encounter.webp`
- `marble_chamber_codexstone.webp`
- `obsidian_chamberplate_gate03.webp`
- `percipari_original_artwork.webp`
- `primus_artus_epithet01_chamberplate.webp`
- `primus_artus_original_artwork.webp`
- `temple_home.webp`
- `true_north.webp`
- `true_north_crystal.webp`

## COPIED OBJECTS

All 13 `.webp` objects were copied to `measures-registry`.

- `antechamber.webp` -> `measures_registry/pre_codex_exhibition/images/antechamber.webp`
- `crystal_temple_home.webp` -> `measures_registry/pre_codex_exhibition/images/crystal_temple_home.webp`
- `gemynd_corpus.webp` -> `measures_registry/pre_codex_exhibition/images/gemynd_corpus.webp`
- `gemynd_corpus_original_art.webp` -> `measures_registry/pre_codex_exhibition/images/gemynd_corpus_original_art.webp`
- `inanna_encounter.webp` -> `measures_registry/pre_codex_exhibition/images/inanna_encounter.webp`
- `marble_chamber_codexstone.webp` -> `measures_registry/pre_codex_exhibition/images/marble_chamber_codexstone.webp`
- `obsidian_chamberplate_gate03.webp` -> `measures_registry/pre_codex_exhibition/images/obsidian_chamberplate_gate03.webp`
- `percipari_original_artwork.webp` -> `measures_registry/pre_codex_exhibition/images/percipari_original_artwork.webp`
- `primus_artus_epithet01_chamberplate.webp` -> `measures_registry/pre_codex_exhibition/images/primus_artus_epithet01_chamberplate.webp`
- `primus_artus_original_artwork.webp` -> `measures_registry/pre_codex_exhibition/images/primus_artus_original_artwork.webp`
- `temple_home.webp` -> `measures_registry/pre_codex_exhibition/images/temple_home.webp`
- `true_north.webp` -> `measures_registry/pre_codex_exhibition/images/true_north.webp`
- `true_north_crystal.webp` -> `measures_registry/pre_codex_exhibition/images/true_north_crystal.webp`

## VERIFICATION RESULTS

- copied object count: `13`
- verified target object count: `13`
- target object nonzero size: `13`
- signed URL generated: `13`
- signed URL retrieval status `200`: `13`
- copied count matches intended `.webp` copy count: `true`
- source objects deleted: `false`

## DB RECORDS UPDATED

No DB records were updated.

Reason:

`ambiguous converted filename mappings present; OAR2 requires inventory table and stop before DB mutation`

## EXACT DB ROWS ELIGIBLE AFTER VERIFICATION

These rows already had exact `.webp` storage paths matching source objects and verified copied targets, but were still held because the broader image remap contains ambiguity:

- `chamber_epithets_01_primus_artus_original_artwork_v1` -> `measures_registry/pre_codex_exhibition/images/primus_artus_original_artwork.webp`
- `chamber_epithets_02_gemynd_corpus_original_artwork_v1` -> `measures_registry/pre_codex_exhibition/images/gemynd_corpus_original_art.webp`
- `chamber_epithets_03_percipari_original_artwork_v1` -> `measures_registry/pre_codex_exhibition/images/percipari_original_artwork.webp`
- `pre_codex_exhibition_inanna_encounter_image_v1` -> `measures_registry/pre_codex_exhibition/images/inanna_encounter.webp`
- `pre_codex_exhibition_marble_chamber_codexstone_image_v1` -> `measures_registry/pre_codex_exhibition/images/marble_chamber_codexstone.webp`

## RECORDS HELD

Rows held with extension-normalized candidates requiring operator confirmation:

- `chamber_epithets_01_primus_artus_oracle_card_v1`: `primus_artus_epithet01_chamberplate.png` -> candidate `primus_artus_epithet01_chamberplate.webp`
- `chamber_epithets_02_gemynd_corpus_oracle_card_v1`: `gemynd_corpus.png` -> candidate `gemynd_corpus.webp`
- `pre_codex_exhibition_obsidian_chamberplate_gate03_image_v1`: `obsidian_chamberplate_gate03.jpeg` -> candidate `obsidian_chamberplate_gate03.webp`
- `pre_codex_exhibition_primus_artus_epithet01_chamberplate_image_v1`: `primus_artus_epithet01_chamberplate.png` -> candidate `primus_artus_epithet01_chamberplate.webp`

Rows held with no exact `.webp` object or extension-normalized candidate:

- `chamber_epithets_03_percipari_oracle_card_v1`: `percipari_epithet03_chamberplate.png`
- `pre_codex_exhibition_7a748aab_4339_44c2_8136_d45a541054e3_image_v1`: `7A748AAB-4339-44C2-8136-D45A541054E3.png`
- `pre_codex_exhibition_crystal_temple_image_v1`: `crystal_temple.png`
- `pre_codex_exhibition_kumurrah_image_v1`: `kumurrah.png`
- `pre_codex_exhibition_obsidian_chamberplate_gate01_image_v1`: `obsidian_chamberplate_gate01.jpeg`
- `pre_codex_exhibition_obsidian_chamberplate_gate02_image_v1`: `obsidian_chamberplate_gate02.webp`
- `pre_codex_exhibition_percipari_epithet03_chamberplate_image_v1`: `percipari_epithet03_chamberplate.png`

## FILES

Executor:

`docs/oar/measures_registry/execute-copy-and-remap-pre-codex-webp-images-to-measures-registry.cjs`

Evidence:

`docs/oar/measures_registry/copy_and_remap_pre_codex_webp_images_to_measures_registry_v1.json`

## BOUNDARY

- No frontend hardcoding was added.
- No media resolver changes were made.
- No source bucket objects were deleted.
- No DB media rows were remapped before verification.
- No ambiguous DB media rows were inferred from filename similarity.

## FINAL STANDING

Storage copy and target verification are complete.

DB remap is held pending operator confirmation or a follow-up OAR2 that authorizes exact row-to-target mapping for the held converted image candidates.

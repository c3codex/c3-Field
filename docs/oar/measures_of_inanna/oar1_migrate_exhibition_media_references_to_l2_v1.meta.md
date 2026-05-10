---
document_type: oar1
authority_level: execution_closeout
document_scope: measures_of_inanna_l2_media_migration
title: OAR1 - Migrate Measures of Inanna Media References to L2
status: completed_partial_matches_only
version: v1
source_oar2: oar2_migrate_exhibition_media_references_to_l2_v1.meta.md
operator: op044
executor: Cody
---

# OAR1 - Migrate Measures of Inanna Media References to L2

## Result

Measures of Inanna media references were migrated where deterministic L2 manifest matches existed.

No frontend files were changed.

No Measures Registry media rows were changed.

No `public.temp_exhibition_media` rows were changed.

No `public.measures_surface_media_map` rows were deleted or relinked.

## Validation Counts

L2 storage row found: yes

L2 manifest found: yes

L2 manifest object count: 24

`public.codex_media_asset` rows migrated: 7

`public.measures_surface_media_map` rows preserved: 28

`public.temp_exhibition_media` rows unchanged: 73

`public.temp_exhibition_media` rows legacy-marked: 0

Chamberplate active featured video mappings: 1

Chamberplate active tone mappings: 2

## Migrated Rows

The following `public.codex_media_asset` rows now point to `bucket = measures-media` with `storage_provider = cloudflare_r2`:

- `pre_codex_exhibition_harrumuk_passage_video_v1` -> `harrumuk_passage.mp4`
- `pre_codex_exhibition_kumurrah_passage_video_v1` -> `kumurrah_passage.mp4`
- `pre_codex_exhibition_obsidian_chamberplate_gate01_video_v1` -> `obsidian_chamberplate_gate01.mov`
- `chamber_epithets_02_gemynd_corpus_full_song_v1` -> `gemynd_corpus.mp3`
- `chamber_epithets_02_gemynd_corpus_featured_video_gemynd_corpus_lapis_tone_v1` -> `gemynd_corpus_lapis_tone .MOV`
- `chamber_epithets_02_gemynd_corpus_lapis_tone_lapis_tone_rise_return_5min_v1` -> `lapis_tone_rise_return_5min.wav`
- `chamber_epithets_03_percipari_material_tone_crystal_tone_rise_return_5min_v1` -> `crystal_tone_rise_return_5min.wav`

All migrated rows used exact filename matches against:

`docs/_source/working/media/l2_bucket_manifest_v1.txt`

## Metadata Preservation

Each migrated media asset preserved its existing `media_key`, title, media type, status, and prior metadata.

Migration metadata was added:

- `migrated_to_storage_key`: `l2_shared_media`
- `previous_bucket`
- `previous_storage_path`
- `migration_source_manifest`
- `migration_oar`
- `migration_match_strategy`
- `legacy_reference_preserved`: true

## Unmatched Rows

Rows without deterministic L2 manifest matches were not mutated.

The unmatched list is recorded in:

`docs/oar/measures_of_inanna/migrate_exhibition_media_references_to_l2_v1.json`

Notable unmatched groups include:

- image rows not present in the L2 manifest
- Primus Artus full song and card/art rows
- Percipari full song and card/art rows
- gate 02 / gate 03 chamberplate media whose L2 manifest paths did not deterministically match existing DB paths
- `inanna_temple_encounter_intro.mp4`, because the manifest contains `inanna_encounter_intro.mp4` and the OAR disallowed inference

## Chamberplate Standing

First three Chamber of Epithets mappings remain active.

Gemynd Corpus now has L2-backed:

- `featured_video`
- `full_song`
- `lapis_tone`

Percipari now has L2-backed:

- `material_tone`

Primus Artus remains on prior bucket references where no deterministic L2 manifest match existed.

Epithet descriptions were not seated.

## Evidence

Full validation output was written to:

`docs/oar/measures_of_inanna/migrate_exhibition_media_references_to_l2_v1.json`

## Boundary

No frontend hardcoding was introduced.

No bucket paths were invented.

No media relationships were invented.

No epithet descriptions were invented.

Legacy storage history was preserved in metadata.

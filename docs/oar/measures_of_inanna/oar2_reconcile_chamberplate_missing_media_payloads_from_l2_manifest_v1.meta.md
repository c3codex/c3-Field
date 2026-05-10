---
document_type: oar2
authority_level: working
document_scope: measures_of_inanna_chamberplate_payload_reconciliation
title: OAR2 — Reconcile Chamberplate Missing Media Payloads from L2 Manifest
status: proposed
version: v1
operator: op044
system: measures_of_inanna
native_stack:
  codex: database
  field: schema
  measures: registry
  chazz: systems
tags:
  - oar2
  - measures-of-inanna
  - chamber-of-epithets
  - chamberplate
  - l2-bucket
  - payload-reconciliation
  - featured-video
  - tones
source_alignment:
  - OAR1 - Seat Chamber of Epithets Chamberplate Aspect Media
  - OAR1 - Transition Chamberplate Runtime to Registry Media
  - DB to src Manifest — Measures of Inanna Exhibition
  - OAR Lifecycle — Execution and Handoff
---

# OAR2 — Reconcile Chamberplate Missing Media Payloads from L2 Manifest

## OBSERVED

The prior chamberplate aspect media seating partially completed.

Seated:

- oracle card mappings
- original artwork mappings
- full song mappings

Not seated:

- featured video mappings
- epithet description mappings
- lapis/material tone mappings

Reason:

- expected featured video filenames were not present in the supplied bucket listing
- tone files were not present in the supplied bucket listing
- epithet description text payloads have not been written yet

The operator clarified that most missing media files are in the L2 bucket.

Epithet descriptions should remain held until written.

## ALIGNED

This OAR2 reconciles missing media payloads from the L2 bucket manifest.

It does not seat epithet descriptions.

Authority order remains:

Codex → Field → Measures → Chazz/src

Required interpretation:

- L2/R2 bucket stores media
- manifest identifies actual bucket object names
- Codex seats media records
- Measures maps media roles to chamberplate surfaces
- frontend renders only seated registry rows

Cody must not infer filenames from thread memory.

Cody must use an explicit L2 bucket manifest.

Expected manifest path:

docs/_source/working/exhibition_bridge/l2_chamberplate_media_manifest.txt

If the manifest is absent, Cody must stop and report missing manifest.

## ROUTED

Cody shall reconcile missing Chamber of Epithets media from the L2 bucket manifest.

### 1. Read L2 manifest

Read:

docs/_source/working/exhibition_bridge/l2_chamberplate_media_manifest.txt

The manifest should contain actual object paths for:

- Primus Artus featured video
- Gemynd Corpus featured video
- Percipari featured video
- Primus Artus tone/audio support
- Gemynd Corpus tone/audio support
- Percipari tone/audio support
- material tone files where present

### 2. Map actual filenames to chamberplate roles

Target surfaces:

- chamber_epithets_01_primus_artus
- chamber_epithets_02_gemynd_corpus
- chamber_epithets_03_percipari

Target roles:

- featured_video
- lapis_tone
- material_tone

Do not modify already seated:

- oracle_card
- original_artwork
- full_song

### 3. Seat featured video mappings

Register actual L2 video objects as codex_media_asset rows.

Map to chamberplate surfaces as:

- role: featured_video
- sequence_index: 10
- status: active

Required metadata:

{
  "render_behavior": "autoplay_after_passage",
  "featured": true,
  "audio_embedded": true,
  "contains_song": true,
  "contains_material_tone": true,
  "show_text_overlay": false,
  "skip_enabled": true,
  "on_complete": "reveal_chamberplate_aspects",
  "on_skip": "reveal_chamberplate_aspects",
  "frontend_hardcode_allowed": false
}

### 4. Seat tone mappings

Register actual tone/audio support files from L2 manifest.

If tone is specific to a material, use role:

- material_tone

If tone is specifically lapis support, use role:

- lapis_tone

Preferred sequence:

- 60

Required metadata:

{
  "aspect_type": "audio",
  "render_behavior": "audio_play",
  "default_volume": 0.22,
  "mix_behavior": "underlay",
  "aspect_support": true,
  "show_over_video": false,
  "available_after": "featured_video_complete_or_skip",
  "frontend_hardcode_allowed": false
}

### 5. Hold epithet descriptions

Do not create epithet_description mappings in this OAR2.

Reason:

- text payloads have not been written yet

Report as held content, not missing execution.

### 6. Preserve existing registry rows

Do not delete prior rows.

Do not mutate public.temp_exhibition_media.

If duplicate active registry mappings exist for same surface + role, deactivate superseded mappings by setting standing inactive using the table’s existing status/active convention.

### 7. No frontend mutation

No frontend files should be changed.

Runtime support already exists.

This is DB seating only.

## CODY ROLE

Cody may:

- read the supplied L2 manifest
- register media assets from actual manifest paths
- map featured videos to chamberplate surfaces
- map tone assets to chamberplate surfaces
- preserve existing oracle card/original artwork/full song rows
- hold epithet descriptions until text exists
- return validation output
- write OAR1 closeout

Cody may not:

- invent bucket paths
- infer file names from thread memory
- invent epithet descriptions
- hardcode media into frontend
- mutate temp exhibition media
- delete existing media rows
- modify frontend files

## VALIDATION

Cody must return:

1. L2 manifest found / not found
2. inserted/upserted media asset count
3. inserted/upserted mapping count
4. active featured video mapping count
5. active tone mapping count
6. held epithet description count
7. missing media payloads, if any
8. validation query output

Validation query:

    select
      sm.surface_key,
      sm.sequence_index,
      sm.role,
      sm.status,
      ma.media_key,
      ma.title,
      ma.media_type,
      ma.bucket,
      ma.storage_path,
      ma.public_url,
      ma.poster_url,
      ma.status as asset_status,
      sm.metadata as map_metadata,
      ma.metadata as asset_metadata
    from public.measures_surface_media_map sm
    join public.codex_media_asset ma
      on ma.media_key = sm.media_key
    where sm.surface_key in (
      'chamber_epithets_01_primus_artus',
      'chamber_epithets_02_gemynd_corpus',
      'chamber_epithets_03_percipari'
    )
    order by sm.surface_key, sm.sequence_index, sm.role, ma.media_key;

Execution is valid only when:

- actual L2 manifest paths are used
- featured videos are seated where found
- tones are seated where found
- existing oracle card/original artwork/full song mappings remain active
- epithet descriptions remain held, not invented
- no frontend files are changed
- OAR1 is written beside this OAR2

## EXPECTED OAR1

docs/oar/measures_of_inanna/oar1_reconcile_chamberplate_missing_media_payloads_from_l2_manifest_v1.meta.md

## CLOSE

This pass completes media reconciliation only.

Epithet descriptions require a later content seating OAR.

Valid sequence:

L2 manifest → media registration → role mapping → validation → later description seating

Codex holds.
Field structures.
Measures registers.
Chazz executes.

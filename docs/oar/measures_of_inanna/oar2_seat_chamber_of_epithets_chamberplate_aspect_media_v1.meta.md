---
document_type: oar2
authority_level: working
document_scope: measures_of_inanna_chamberplate_aspect_media_seating
title: OAR2 — Seat Chamber of Epithets Chamberplate Aspect Media
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
  - aspect-media
  - registry-media
  - featured-video
  - material-tones
source_alignment:
  - OAR1 - Transition Chamberplate Runtime to Registry Media
  - OAR1 - Update Chamber of Epithets Chamberplate Aspects
  - DB to src Manifest — Measures of Inanna Exhibition
  - OAR Lifecycle — Execution and Handoff
---

# OAR2 — Seat Chamber of Epithets Chamberplate Aspect Media

## OBSERVED

The chamberplate runtime transition has been implemented and deployed.

Runtime now supports:

- registry-first media resolution
- fallback to public.temp_exhibition_media only when registry media is absent
- featured_video
- oracle_card
- epithet_description
- original_artwork
- full_song
- lapis_tone
- material_tone
- metadata-driven volume
- autoplay-after-passage
- skip/complete reveal behavior
- clickable aspect rendering

The prior OAR1 states the DB seating OAR2 may now be rerun after runtime transition is committed and deployed.

## ALIGNED

This OAR2 seats Chamber of Epithets chamberplate aspect media into DB registry surfaces.

Authority order remains:

Codex → Field → Measures → Chazz/src

Required interpretation:

- bucket stores media
- Codex seats media records
- Field relates media to chamberplate surfaces
- Measures registers role, sequence, active standing, and reveal behavior
- Chazz/src renders only seated media state

No frontend mutation is required in this OAR2.

## ROUTED

Cody shall perform DB seating for Chamber of Epithets chamberplate aspect media.

### 1. Use observed chamberplate surface keys

Use only seated chamberplate keys:

chamber_epithets_01_primus_artus
chamber_epithets_02_gemynd_corpus
chamber_epithets_03_percipari

Do not invent alternate keys.

### 2. Register new featured videos

Register one codex_media_asset row per supplied featured video clip.

Each featured video contains embedded song + material tone.

Preferred media keys:

chamber_epithets_01_primus_artus_featured_video_v1
chamber_epithets_02_gemynd_corpus_featured_video_v1
chamber_epithets_03_percipari_featured_video_v1

Map each to its chamberplate surface with role:

featured_video

Sequence:

10

Mapping metadata:

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

### 3. Preserve oracle cards

Preserve existing oracle card/still chamberplate images.

Create registry mappings for existing oracle card imagery if missing.

Preferred roles:

oracle_card

Sequence:

20

Do not delete existing temp fallback rows.

### 4. Seat epithet descriptions as clickable text aspects

Create text aspect mappings for each epithet description.

Preferred role:

epithet_description

Sequence:

30

Metadata must include the actual text payload from supplied source/manifest.

Metadata shape:

{
  "aspect_type": "text",
  "render_behavior": "text_expand",
  "show_over_video": false,
  "available_after": "featured_video_complete_or_skip",
  "frontend_hardcode_allowed": false,
  "text": "<epithet description text>"
}

If no description payload is supplied, report missing and do not invent text.

### 5. Seat original artwork aspects

Register and map original artwork for each chamberplate encounter where supplied.

Preferred role:

original_artwork

Sequence:

40

Metadata:

{
  "aspect_type": "image",
  "render_behavior": "image_expand",
  "show_over_video": false,
  "available_after": "featured_video_complete_or_skip",
  "frontend_hardcode_allowed": false
}

### 6. Preserve full song

Preserve existing full song audio for each epithet.

Create registry mappings for existing full song audio if missing.

Preferred role:

full_song

Sequence:

50

Metadata:

{
  "aspect_type": "audio",
  "render_behavior": "audio_play",
  "audio_role": "full_song",
  "show_over_video": false,
  "available_after": "featured_video_complete_or_skip",
  "frontend_hardcode_allowed": false
}

### 7. Seat lapis/material tone aspect

Register and map supplied lapis/material tone support audio.

Preferred role:

lapis_tone

Sequence:

60

Metadata:

{
  "aspect_type": "audio",
  "render_behavior": "audio_play",
  "audio_role": "lapis_tone",
  "default_volume": 0.22,
  "mix_behavior": "underlay",
  "aspect_support": true,
  "show_over_video": false,
  "available_after": "featured_video_complete_or_skip",
  "frontend_hardcode_allowed": false
}

### 8. Deactivation rule

Do not delete previous media rows.

If duplicate active registry mappings exist for the same surface + role + sequence purpose, deactivate superseded mappings:

is_active = false

New intended mappings:

is_active = true

### 9. No frontend mutation

This OAR2 is DB seating only.

No frontend files should be changed.

## CODY ROLE

Cody may:

- read supplied bucket/object manifest
- register media assets in public.codex_media_asset
- create mappings in public.measures_surface_media_map
- preserve existing oracle card and full song media
- seat text descriptions as metadata-backed aspects
- deactivate superseded registry mappings without deletion
- return validation output
- write OAR1 closeout

Cody may not:

- hardcode media into frontend
- hardcode description text into components
- invent missing bucket paths
- invent missing epithet descriptions
- invent missing surface keys
- delete existing media rows
- mutate public.temp_exhibition_media
- modify frontend runtime code

## VALIDATION

Cody must return:

1. inserted/upserted media asset count
2. inserted/upserted mapping count
3. deactivated superseded mapping count
4. active featured video mapping count
5. active oracle card mapping count
6. active epithet description mapping count
7. active original artwork mapping count
8. active full song mapping count
9. active lapis/material tone mapping count
10. missing manifest assets or missing text payloads
11. validation query output

Validation query:

    select
      sm.surface_key,
      sm.sequence_index,
      sm.role,
      sm.is_active,
      ma.media_key,
      ma.title,
      ma.media_type,
      ma.bucket,
      ma.storage_path,
      ma.public_url,
      ma.poster_url,
      ma.status,
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

- each targeted chamberplate has active featured video mapping
- each targeted chamberplate has active oracle card mapping
- each targeted chamberplate has full song mapping
- each targeted chamberplate has epithet description aspect or missing payload is reported
- supplied original artwork is mapped as aspect
- supplied lapis/material tone is mapped as aspect
- featured video metadata supports autoplay-after-passage
- no text overlay is seated for video
- skip/complete reveal behavior is metadata-seated
- volume behavior is metadata-driven
- no frontend files are changed
- OAR1 is written beside this OAR2

## EXPECTED OAR1

docs/oar/measures_of_inanna/oar1_seat_chamber_of_epithets_chamberplate_aspect_media_v1.meta.md

## CLOSE

Runtime is ready.

This pass seats the chamberplate aspect media.

Valid sequence:

runtime support → DB seating → validation → render

Codex holds.
Field structures.
Measures registers.
Chazz executes.

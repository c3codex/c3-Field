---
document_type: oar2
authority_level: working
document_scope: measures_of_inanna_chamberplate_aspects
title: OAR2 — Update Chamber of Epithets Chamberplate Aspects
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
  - aspects
  - autoplay
  - media-registration
  - material-tones
source_alignment:
  - OAR1 - Register R2 Bucket Media for Pre-Codex Exhibition
  - DB to src Manifest — Measures of Inanna Exhibition
  - OAR Lifecycle — Execution and Handoff
---

# OAR2 — Update Chamber of Epithets Chamberplate Aspects

## OBSERVED

The prior R2 media registration pass completed as DB-only work.

Prior result:

- public.codex_media_asset reused
- public.measures_surface_media_map reused
- 16 media rows inserted/upserted
- 16 media rows mapped to pre_codex_exhibition
- no frontend files modified
- missing media was not invented from thread memory

This boundary held correctly.

The operator has now added new media for Chamber of Epithets chamberplate encounters.

Current desired behavior:

- after passage resolves, the chamberplate encounter opens with featured video autoplay
- video contains song + material tone embedded
- no text plaque appears over the video
- subtle skip is allowed
- video completion or skip reveals the still oracle card and clickable aspects
- existing oracle card remains
- existing full song remains
- original artwork is added as an aspect
- lapis tone is added as an aspect / support tone
- epithet description is added as clickable text aspect
- volume behavior must be metadata-driven, not hardcoded

## ALIGNED

This is not an Intro Triad operation.

This is Chamber of Epithets chamberplate encounter refinement.

Authority order remains:

Codex → Field → Measures → Chazz/src

Required interpretation:

- bucket stores media
- Codex seats media records
- Field relates media to chamberplate encounter/aspect surfaces
- Measures registers role, sequence, active standing, and reveal behavior
- Chazz/src renders only seated state

Frontend must not hardcode media paths, text overlays, skip behavior, or audio volume.

## ROUTED

Cody shall perform a DB-first chamberplate media/aspect update.

### 1. Inspect existing Chamber of Epithets chamberplate surfaces

Inspect current DB rows for chamberplate encounters related to:

- Primus Artus
- Gemynd Corpus
- Percipari
- Chamber of Epithets

Use existing seated surface keys.

Do not invent surface keys.

### 2. Register new featured video clips

Register one codex_media_asset row per new chamberplate video clip.

Expected role:

featured_video

The video clips contain embedded song + material tone.

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

### 3. Preserve existing oracle card and full song

Do not delete or replace existing oracle card rows.

Do not delete or replace existing full song rows.

Their roles should remain active and available as aspects after video completion/skip.

Preferred roles:

oracle_card
full_song

### 4. Add original artwork as aspect

Register and map original artwork for each chamberplate encounter.

Preferred role:

original_artwork

Metadata:

{
  "aspect_type": "image",
  "render_behavior": "click_to_expand",
  "show_over_video": false,
  "frontend_hardcode_allowed": false
}

### 5. Add lapis tone as aspect/support tone

Register and map lapis tone for each chamberplate encounter where supplied.

Preferred role:

lapis_tone

Metadata:

{
  "audio_role": "lapis_tone",
  "default_volume": 0.22,
  "mix_behavior": "underlay",
  "aspect_support": true,
  "show_over_video": false,
  "frontend_hardcode_allowed": false
}

### 6. Add epithet description as clickable aspect

Register epithet description as a text aspect.

Do not display description over the autoplay video.

Preferred role:

epithet_description

Metadata:

{
  "aspect_type": "text",
  "render_behavior": "click_to_expand",
  "show_over_video": false,
  "available_after": "featured_video_complete_or_skip",
  "frontend_hardcode_allowed": false
}

### 7. Set chamberplate aspect sequence

Preferred render sequence after video completes or skip is selected:

10 featured_video
20 oracle_card
30 epithet_description
40 original_artwork
50 full_song
60 lapis_tone

The resting page after video should show:

still oracle card + clickable aspects

### 8. No frontend mutation in this pass

This OAR2 is DB registration/mapping only unless the current frontend already supports metadata-driven behavior.

If frontend does not support the required metadata, Cody must report the missing frontend support and stop.

A separate frontend OAR2 must follow.

## CODY ROLE

Cody may:

- inspect current chamberplate encounter mappings
- register supplied media assets
- map featured videos to chamberplate surfaces
- preserve existing oracle card and full song mappings
- add original artwork aspects
- add lapis tone aspects
- add epithet description text aspects
- metadata-seat autoplay, skip, and reveal behavior
- return validation output
- write OAR1 closeout

Cody may not:

- hardcode media paths into src
- hardcode text overlays onto video
- hardcode audio volume
- delete existing media rows
- invent missing bucket paths
- invent missing surface keys
- collapse Chamber of Epithets behavior into Pre-Codex Exhibition surface behavior
- modify unrelated registry surfaces

## VALIDATION

Cody must return:

1. observed chamberplate surface keys
2. inserted/upserted media asset count
3. new featured video mapping count
4. preserved oracle card count
5. preserved full song count
6. added original artwork aspect count
7. added lapis tone aspect count
8. added epithet description aspect count
9. missing supplied assets, if any
10. validation query output

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
      ma.status,
      sm.metadata as map_metadata,
      ma.metadata as asset_metadata
    from public.measures_surface_media_map sm
    join public.codex_media_asset ma
      on ma.media_key = sm.media_key
    where sm.surface_key ilike any(array[
      '%epithet%',
      '%chamberplate%',
      '%primus%',
      '%gemynd%',
      '%percipari%'
    ])
    order by sm.surface_key, sm.sequence_index, sm.role, ma.media_key;

Execution is valid only when:

- featured chamberplate videos are registered and mapped
- video behavior is metadata-seated as autoplay-after-passage
- no text plaque appears over video by DB contract
- skip/complete routes reveal still oracle card + aspects
- existing oracle card remains available
- existing full song remains available
- original artwork is mapped as aspect
- lapis tone is mapped as aspect/support tone
- epithet description is mapped as clickable text aspect
- no frontend hardcoding is introduced
- OAR1 is written beside this OAR2

## EXPECTED OAR1

docs/oar/measures_of_inanna/oar1_update_chamber_of_epithets_chamberplate_aspects_v1.meta.md

## CLOSE

Valid sequence:

stored → registered → mapped → ordered → validated → rendered

Codex holds.
Field structures.
Measures registers.
Chazz executes.

---
document_type: oar2
authority_level: working
document_scope: measures_of_inanna_bucket_media_registration
title: OAR2 — Register R2 Bucket Media for Pre-Codex Exhibition
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
  - r2
  - bucket
  - media-registration
  - pre-codex-exhibition
  - measures-of-inanna
source_alignment:
  - DB to src Manifest — Measures of Inanna Exhibition
  - OAR Lifecycle — Execution and Handoff
  - PowerShell Transfer Surface Rule
---

# OAR2 — Register R2 Bucket Media for Pre-Codex Exhibition

## OBSERVED

Pre-Codex Exhibition media has been reorganized.

Current standing:

- image media has been converted to .webp
- mp3 files have been moved into Cloudflare R2
- mp4 files have been moved into Cloudflare R2
- existing base filenames remain unchanged
- R2 now holds runtime media assets for this surface
- bucket presence is not Codex seating
- frontend must not hardcode bucket paths

The media must now be registered into database state and mapped to the correct Measures surface.

## ALIGNED

Storage does not define authority.

Authority order remains:

Codex → Field → Measures → Chazz/src

Required interpretation:

- R2 stores media
- Codex seats media records
- Field relates media to surface / encounter
- Measures registers sequence, role, and reveal
- Chazz/src renders only registered state

Same base filenames are valid.

Distinct asset identity resolves through:

media_key + media_type + bucket + storage_path + version

Required media key pattern:

pre_codex_exhibition_<base_name>_image_v1
pre_codex_exhibition_<base_name>_video_v1
pre_codex_exhibition_<base_name>_audio_v1

No file renaming is required unless actual R2 path collision exists.

## ROUTED

Cody shall perform a bucket media registration pass for the Pre-Codex Exhibition surface.

### 1. Inspect existing DB surfaces

Check whether these DB surfaces already exist:

- public.codex_media_asset
- public.measures_surface_media_map

If equivalent tables already exist, use existing surfaces and do not create duplicates.

If missing, create only the minimum required surfaces.

### 2. Register media assets

Create one codex_media_asset row per R2 media file.

Required fields:

- media_key
- title
- media_type
- storage_provider = cloudflare_r2
- bucket
- storage_path
- public_url when available
- poster_url when applicable
- material_key when known
- legacy_key when known
- status = active
- metadata

Media types:

- image
- video
- audio

### 3. Bind assets to surface

Bind each registered asset to:

surface_key: pre_codex_exhibition

Use measures_surface_media_map.

Accepted roles:

- image
- video
- audio
- poster
- primary
- background
- tone

Encounter order where known:

1. primus_artus
2. gemynd_corpus
3. percipari

Sequence index should preserve this order across image/video/audio groups.

### 4. Preserve filename distinction

Do not treat same base name as conflict when extensions or paths differ.

Valid examples:

- primus_artus.webp
- primus_artus.mp4
- primus_artus.mp3

These should become distinct DB rows with distinct media keys.

### 5. No frontend mutation

This OAR2 is DB registration only.

Do not modify frontend rendering in this pass.

Frontend update must occur only after DB registration validates.

## CODY ROLE

Cody may:

- inspect current R2 file path list supplied by operator
- verify or create required DB registration surfaces
- insert media asset rows
- bind media rows to pre_codex_exhibition
- preserve current filenames
- return validation query output
- write OAR1 closeout after execution

Cody may not:

- hardcode media into src
- treat R2 as authority
- invent missing encounter meaning
- rename files unless collision requires it
- modify unrelated Measures of Inanna surfaces
- proceed to frontend rendering without validation

## VALIDATION

Cody must return:

1. created or reused table names
2. inserted media count
3. mapped media count
4. any skipped or duplicate media keys
5. validation query output

Validation query:

    select
      sm.surface_key,
      sm.sequence_index,
      sm.role,
      ma.media_key,
      ma.title,
      ma.media_type,
      ma.bucket,
      ma.storage_path,
      ma.status
    from public.measures_surface_media_map sm
    join public.codex_media_asset ma
      on ma.media_key = sm.media_key
    where sm.surface_key = 'pre_codex_exhibition'
    order by sm.sequence_index, sm.role, ma.media_key;

Execution is valid only when:

- every intended R2 media file has a registered media row
- every intended surface asset is mapped to pre_codex_exhibition
- same-name media is distinguished by type/path/key
- no frontend hardcoding is introduced
- OAR1 is written beside this OAR2

## EXPECTED OAR1

docs/oar/measures_of_inanna/oar1_register_r2_bucket_media_pre_codex_exhibition_v1.meta.md

## CLOSE

R2 storage is not seating.

Pre-Codex Exhibition media becomes valid only after:

stored → registered → mapped → validated → rendered

Codex holds.
Field structures.
Measures registers.
Chazz executes.

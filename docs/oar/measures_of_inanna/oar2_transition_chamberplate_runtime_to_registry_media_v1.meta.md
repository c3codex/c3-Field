---
document_type: oar2
authority_level: working
document_scope: measures_of_inanna_chamberplate_runtime_transition
title: OAR2 — Transition Chamberplate Runtime to Registry Media
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
  - chamberplate
  - runtime
  - registry-media
  - frontend
  - aspects
  - metadata
source_alignment:
  - OAR1 - Update Chamber of Epithets Chamberplate Aspects
  - DB to src Manifest — Measures of Inanna Exhibition
  - Chazz x Cody Development Role Contract
  - OAR Lifecycle — Execution and Handoff
---

# OAR2 — Transition Chamberplate Runtime to Registry Media

## OBSERVED

The prior Chamber of Epithets chamberplate aspect OAR1 held before DB mutation.

Cody correctly observed that current runtime behavior still resolves chamberplate media from:

public.temp_exhibition_media

Current runtime does not yet resolve chamberplate encounter media/aspects from:

public.codex_media_asset
public.measures_surface_media_map

Observed frontend/runtime gaps:

- runtime media items do not carry role
- runtime media items do not carry map_metadata
- runtime media items do not carry asset_metadata
- featured_video role is not resolved
- autoplay-after-passage is not implemented from metadata
- skip-to-aspects is not implemented
- video-complete reveal is not implemented
- clickable chamberplate aspects are not implemented from seated aspect rows
- audio volume remains component-coded instead of metadata-driven

The prior OAR1 correctly refused DB mutation because seated metadata would create state the runtime could not honor.

## ALIGNED

This OAR2 is a frontend/runtime transition OAR2.

It does not seat new chamberplate media assets.

It prepares src to render chamberplate media from registry-seated state.

Authority order remains:

Codex → Field → Measures → Chazz/src

Frontend is not authority.

Frontend must render what is seated and expose absence honestly.

The current legacy temp media resolver may remain as a temporary compatibility fallback only where registry media rows are absent, but it may not override registry-seated media.

## ROUTED

Cody shall update chamberplate runtime rendering to support registry media/aspect resolution.

### 1. Add registry media resolver for chamberplate surfaces

Implement a runtime resolver that loads active media mappings from:

public.measures_surface_media_map
join public.codex_media_asset

Required returned runtime fields:

surface_key
sequence_index
role
is_active
media_key
title
media_type
bucket
storage_path
public_url
poster_url
status
map_metadata
asset_metadata

Only active mappings should render by default.

### 2. Preserve legacy temp media fallback only as fallback

If registry mappings exist for a chamberplate surface:

use registry media

If no registry mappings exist:

fallback to public.temp_exhibition_media

Fallback must not overwrite, merge over, or reorder registry-seated media.

### 3. Support chamberplate media roles

Runtime must recognize these roles:

featured_video
oracle_card
epithet_description
original_artwork
full_song
lapis_tone
material_tone
audio
image
video

Unknown roles may be exposed as generic aspects, but must not be discarded silently.

### 4. Implement autoplay-after-passage behavior

When a chamberplate encounter is entered after passage and an active featured_video exists with metadata:

{ "render_behavior": "autoplay_after_passage" }

The featured video should:

- autoplay on chamberplate entry
- display without text plaque overlay
- allow subtle skip
- reveal chamberplate still/aspects on complete
- reveal chamberplate still/aspects on skip

### 5. Implement still/aspect reveal state

After featured video completes or skip is selected, render:

still oracle card + clickable aspects

Aspect roles include:

epithet_description
original_artwork
full_song
lapis_tone
material_tone

### 6. Implement clickable aspect rendering

Aspect behavior must be driven by metadata.

Supported render behaviors:

click_to_expand
audio_play
image_expand
text_expand

If metadata is absent, use safe generic clickable aspect rendering.

### 7. Implement metadata-driven audio volume

Audio volume must resolve from metadata when present:

map_metadata.default_volume
asset_metadata.default_volume

Priority:

map_metadata default_volume
asset_metadata default_volume
component safe default

Component safe default is allowed only as fallback, not as authority.

### 8. Do not add text plaque over video

If metadata says:

"show_text_overlay": false

Then no title, description, plaque, caption, or overlay text should render over the video.

### 9. Maintain chamberplate surface keys

Use observed chamberplate keys:

chamber_epithets_01_primus_artus
chamber_epithets_02_gemynd_corpus
chamber_epithets_03_percipari
chamber_epithets_04_lady_of_the_largest_heart
chamber_epithets_05_spiritus_stellaris
chamber_epithets_06_concursus_cubicali
chamber_epithets_07_aphrodite
chamber_epithets_08_the_last_oracle
chamber_epithets_09_she_who_rises_with_the_dog_star

Do not invent alternate keys.

### 10. No DB media seating in this OAR2

This OAR2 updates runtime support only.

Do not insert new media rows.

Do not alter existing media mappings.

The prior DB chamberplate seating OAR2 must be rerun only after this runtime transition validates.

## CODY ROLE

Cody may:

- update frontend/runtime media resolver
- join registry media mapping and media asset rows
- preserve legacy temp media fallback when registry rows are absent
- implement featured video autoplay-after-passage
- implement skip/complete reveal behavior
- implement clickable aspect rendering
- implement metadata-driven audio volume
- expose missing registry rows honestly
- write OAR1 closeout

Cody may not:

- insert DB media rows
- hardcode media paths
- hardcode chamberplate media order outside registry sequence
- hardcode text plaques over video
- hardcode volume when metadata exists
- invent missing surface keys
- delete or mutate legacy temp media rows
- collapse Chamber of Epithets behavior into Pre-Codex Exhibition behavior

## VALIDATION

Cody must return:

1. files changed
2. resolver behavior summary
3. fallback behavior summary
4. supported media roles
5. supported metadata keys
6. local/build validation result
7. note whether chamberplate DB seating OAR2 may now be rerun

Validation checks:

- chamberplate surfaces can query registry media mappings
- active registry mappings override temp fallback
- absent registry mappings fall back safely
- featured_video role is recognized
- autoplay-after-passage behavior is implemented
- skip reveals still/aspects
- completion reveals still/aspects
- text overlay is suppressed when metadata requires it
- clickable aspects render from roles/metadata
- audio volume can resolve from metadata
- no DB media rows are inserted
- OAR1 is written beside this OAR2

## EXPECTED OAR1

docs/oar/measures_of_inanna/oar1_transition_chamberplate_runtime_to_registry_media_v1.meta.md

## CLOSE

This OAR2 prepares the renderer.

After this validates, reroute the DB chamberplate aspect seating.

Valid sequence:

runtime support → DB seating → validation → render

Codex holds.
Field structures.
Measures registers.
Chazz executes.

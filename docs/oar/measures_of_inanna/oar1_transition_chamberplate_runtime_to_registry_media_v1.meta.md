---
document_type: oar1
authority_level: execution_closeout
document_scope: measures_of_inanna_chamberplate_runtime_transition
title: OAR1 - Transition Chamberplate Runtime to Registry Media
status: implemented_runtime_only
version: v1
source_oar2: oar2_transition_chamberplate_runtime_to_registry_media_v1.meta.md
operator: op044
executor: Cody
---

# OAR1 - Transition Chamberplate Runtime to Registry Media

## Result

Runtime transition implemented.

No DB media rows were inserted.

No existing DB media mappings were altered.

No deploy was performed in this OAR1.

## Files Changed

- `src/measures_of_inanna/resolve_encounter.ts`
- `src/measures_of_inanna/types.ts`
- `src/measures_of_inanna/GenericEncounter.tsx`
- `src/measures_of_inanna/EncounterStageMedia.tsx`
- `src/index.css`
- `dist-inanna/index.html`
- `dist-inanna/assets/index-CLczTNnk.js`
- `dist-inanna/assets/index-Dd73tO-2.css`
- removed previous built asset files replaced by the new Inanna build
- `docs/oar/measures_of_inanna/transition_chamberplate_runtime_to_registry_media_v1.json`
- `docs/oar/measures_of_inanna/oar1_transition_chamberplate_runtime_to_registry_media_v1.meta.md`

## Resolver Behavior

Chamberplate runtime now attempts registry media first:

`public.measures_surface_media_map` joined to `public.codex_media_asset`

Runtime media items now carry registry fields needed by the renderer:

- `surface_key`
- `sequence_index`
- `role`
- `media_key`
- `title`
- `media_type`
- `bucket`
- `storage_path`
- `public_url`
- `poster_url`
- `status`
- `map_metadata`
- `asset_metadata`

The runtime uses registry sequence order when registry media exists.

## Fallback Behavior

Legacy `public.temp_exhibition_media` remains compatibility fallback only.

If active registry media resolves for a chamberplate surface, fallback media is not merged, overwritten, or used for ordering.

If no active registry media resolves, the resolver falls back to active temp exhibition media rows.

Read-only validation on the observed chamberplate keys returned:

- registry query: ok
- registry row count: 0
- temp fallback query: ok
- active temp fallback row count: 6

## Supported Roles

Runtime recognizes:

- `featured_video`
- `oracle_card`
- `epithet_description`
- `original_artwork`
- `full_song`
- `lapis_tone`
- `material_tone`
- `audio`
- `image`
- `video`

Unknown registry roles are exposed as generic clickable aspects rather than being silently discarded.

## Supported Metadata

Supported metadata keys:

- `render_behavior`
- `show_text_overlay`
- `skip_enabled`
- `audio_embedded`
- `default_volume`
- `text`
- `description`

Supported aspect render behaviors:

- `click_to_expand`
- `audio_play`
- `image_expand`
- `text_expand`

Audio volume priority:

1. `map_metadata.default_volume`
2. `asset_metadata.default_volume`
3. component safe fallback

## Featured Video Behavior

An active `featured_video` with:

`render_behavior: autoplay_after_passage`

now:

- starts in the autoplay video path
- suppresses plaque/text overlays when `show_text_overlay` is false
- reveals still/aspects on completion
- reveals still/aspects on skip
- can preserve embedded audio when `audio_embedded` is true

## Validation

Build validation passed:

`npm.cmd run build:inanna`

The first sandbox build failed with Windows/esbuild `spawn EPERM`; the elevated rerun completed successfully.

Read-only DB validation completed successfully outside the sandbox after the sandboxed query failed with network `fetch failed`.

## Rerun Standing

The prior chamberplate DB seating OAR2 may now be rerun after this runtime transition is committed and deployed.

This OAR1 does not itself seat the Chamber of Epithets aspect media.

---
document_type: oar1
authority_level: execution_closeout
document_scope: runtime_media_contract
title: OAR1 - Enable Non-Chamberplate Governed Media Resolution
status: complete_with_reported_gap
version: v1
operator: op044
system: measures_registry
source_oar2:
  - oar2_enable_non_chamberplate_governed_media_resolution_v1
evidence:
  - enable_non_chamberplate_governed_media_resolution_v1.json
executor:
  - execute-enable-non-chamberplate-governed-media-resolution.cjs
mutation_performed: false
---

# OAR1 - Enable Non-Chamberplate Governed Media Resolution

## EXECUTION

Executed bounded runtime resolver OAR2.

Changed runtime resolver eligibility so governed media lookup now applies to:

- `chamberplate`
- `aspect`
- `threshold`

No DB mutation was performed.

No bucket copy, provider remap, fallback deletion, source deletion, or frontend hardcoded media path was introduced.

## FILES CHANGED

Runtime source:

- `src/measures_of_inanna/resolve_encounter.ts`

Evidence and closeout:

- `docs/oar/measures_registry/execute-enable-non-chamberplate-governed-media-resolution.cjs`
- `docs/oar/measures_registry/enable_non_chamberplate_governed_media_resolution_v1.json`
- `docs/oar/measures_registry/oar1_enable_non_chamberplate_governed_media_resolution_v1.meta.md`

Build artifacts changed by validation build:

- `dist-inanna/index.html`
- `dist-inanna/assets/index-DNR-DxGl.js`
- prior built JS asset removed by Vite rebuild: `dist-inanna/assets/index-DvTRgzoP.js`

## RUNTIME CHANGE

Previous behavior:

- `measures_surface_media_map` was read only when `surface_type = chamberplate`
- `aspect` and `threshold` surfaces fell through to `temp_exhibition_media`

New behavior:

- governed media is read for `chamberplate`, `aspect`, and `threshold`
- chamberplate fallback behavior remains unchanged
- for non-chamberplate governed surfaces, fallback media may supplement missing media types only

Reason for supplement behavior:

`epigraph` currently has governed still/image support but no governed animated/video row. The fallback video remains present as the only video candidate, while the governed still image is available as still support.

## VALIDATION

Validation evidence:

`docs/oar/measures_registry/enable_non_chamberplate_governed_media_resolution_v1.json`

Build:

- `npm.cmd run build:inanna`
- result: pass

The first build attempt through `npm` was blocked by PowerShell script execution policy. The build passed through `npm.cmd`.

## ASPECT GOVERNED LOOKUP

Surface:

- registry key: `epigraph`
- encounter key: `epigraph_view`
- surface type: `aspect`

Governed media lookup:

- result: works
- governed row count: 1

Governed row:

| media_key | role | type | provider | bucket/path | retrieval |
|---|---|---|---|---|---:|
| `epigraph_still_image_support_v1` | `image` | image | `supabase` | `measures-registry/measures_registry/pre_codex_exhibition/images/inanna_epigraph.webp` | 200 |

Fallback row remains:

| source | type | bucket/path | retrieval |
|---|---|---|---:|
| `temp_exhibition_media` | video | `pre-codex-exhibition/inanna_encounter_intro.mp4` | 400 |

Epigraph precedence standing:

- primary video candidate remains the fallback video because no governed animated/video row exists
- governed still image is present as still support
- no still image was promoted above an animated/video candidate

Reported gap:

`epigraph` does not currently resolve governed animated/video media. No governed video row exists for `epigraph` under this OAR's validation.

## THRESHOLD GOVERNED LOOKUP

Surface:

- registry key: `temple_antechamber`
- encounter key: `temple_antechamber_view`
- surface type: `threshold`

Governed media lookup:

- result: works
- governed row count: 1

Governed row:

| media_key | role | type | provider | bucket/path | retrieval |
|---|---|---|---|---|---:|
| `temple_antechamber_still_image_v1` | `image` | image | `supabase` | `measures-registry/measures_registry/pre_codex_exhibition/images/antechamber.webp` | 200 |

Fallback row remains:

| source | type | bucket/path | active |
|---|---|---|---|
| `temp_exhibition_media` | image | `pre-codex-exhibition/antechamber.png` | true |

Because governed image media exists for the same media type, the invalid fallback image is no longer needed for the antechamber image slot under the new resolution logic.

## CHAMBERPLATE PRESERVATION

Chamberplate behavior was validated directly against an existing governed surface mapping:

- surface key: `chamber_epithets_01_primus_artus`
- active governed rows: 3
- retrieval result: all tested rows returned 200

Validated rows:

| media_key | role | type | provider | retrieval |
|---|---|---|---|---:|
| `chamber_epithets_01_primus_artus_oracle_card_v1` | `oracle_card` | image | `supabase` | 200 |
| `chamber_epithets_01_primus_artus_original_artwork_v1` | `original_artwork` | image | `supabase` | 200 |
| `chamber_epithets_01_primus_artus_full_song_v1` | `full_song` | audio | `cloudflare_r2` | 200 |

Note:

The registry-key route for `chamber_epithets_01_primus_artus` did not resolve in the validation helper, matching the prior routing diagnostic. The governed chamberplate media mapping itself remains valid and unchanged.

## FALLBACK STATUS

Fallback rows remain undeleted and active:

| surface_key | media_type | bucket/path | active |
|---|---|---|---|
| `epigraph` | video | `pre-codex-exhibition/inanna_encounter_intro.mp4` | true |
| `temple_antechamber` | image | `pre-codex-exhibition/antechamber.png` | true |

No fallback deletion or deactivation occurred.

## HARD-CODING CHECK

No hardcoded media paths were introduced in `src/measures_of_inanna/resolve_encounter.ts`.

The resolver continues to use DB-governed fields:

- `surface_key`
- `media_key`
- `storage_provider`
- `bucket`
- `storage_path`
- `public_url`

## VALIDATION STATUS

OAR2 validation:

| criterion | status |
|---|---|
| governed media lookup works for aspect | pass |
| governed media lookup works for threshold | pass |
| epigraph resolves governed animated/video media | gap reported; no governed animated row exists |
| epigraph still fallback behavior remains correct | pass; still image remains secondary support |
| temple_antechamber resolves governed still media | pass |
| chamberplate media behavior remains valid | pass |
| fallback rows remain undeleted | pass |
| no frontend hardcoded media path introduced | pass |
| exact files changed listed | pass |

## REMAINING GAP

`epigraph` still needs a governed animated/video row if the intended runtime contract is fully governed animation-first epigraph media.

Recommended next OAR2:

`oar2_seat_epigraph_governed_animated_media_v1`

Scope should authorize only:

- verified animated/video object selection
- governed DB seating for `epigraph`
- validation that epigraph primary video resolves 200
- fallback video deprecation only after governed animation validates

## CLOSE

Governed media resolution expanded.

Aspect and threshold reads validated.

Chamberplate behavior preserved.

Epigraph governed animation remains unseated and reported.

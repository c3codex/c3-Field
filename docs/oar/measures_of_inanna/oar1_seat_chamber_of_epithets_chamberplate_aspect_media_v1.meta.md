---
document_type: oar1
authority_level: execution_closeout
document_scope: measures_of_inanna_chamberplate_aspect_media_seating
title: OAR1 - Seat Chamber of Epithets Chamberplate Aspect Media
status: partially_seated_missing_supplied_payloads
version: v1
source_oar2: oar2_seat_chamber_of_epithets_chamberplate_aspect_media_v1.meta.md
operator: op044
executor: Cody
---

# OAR1 - Seat Chamber of Epithets Chamberplate Aspect Media

## Result

DB seating partially completed.

Runtime/front-end files were not modified.

`public.temp_exhibition_media` was not modified.

No rows were deleted.

The existing `public.measures_surface_media_map` role check constraint was expanded to allow the governed chamberplate roles required by this OAR2.

## Seated

Inserted/upserted media asset count: 9

Inserted/upserted mapping count: 9

Deactivated superseded mapping count: 0

Active oracle card mapping count: 3

Active original artwork mapping count: 3

Active full song mapping count: 3

## Not Seated

Active featured video mapping count: 0

Active epithet description mapping count: 0

Active lapis/material tone mapping count: 0

Missing supplied payloads:

- `chamber_epithets_01_primus_artus` featured video: `primus_artus.mp4` not supplied in bucket listing.
- `chamber_epithets_02_gemynd_corpus` featured video: `gemynd_corpus.mp4` not supplied in bucket listing.
- `chamber_epithets_03_percipari` featured video: `percipari.mp4` not supplied in bucket listing.
- `chamber_epithets_01_primus_artus` epithet description text payload not supplied.
- `chamber_epithets_02_gemynd_corpus` epithet description text payload not supplied.
- `chamber_epithets_03_percipari` epithet description text payload not supplied.
- `chamber_epithets_01_primus_artus` lapis/material tone support audio not supplied.
- `chamber_epithets_02_gemynd_corpus` lapis/material tone support audio not supplied.
- `chamber_epithets_03_percipari` lapis/material tone support audio not supplied.

These were not invented or inferred.

## Sources Used

Oracle card and full song rows were preserved from active `public.temp_exhibition_media` bridge rows.

Original artwork rows were seated from live bucket listing objects:

- `primus_artus_original_artwork.webp`
- `gemynd_corpus_original_art.webp`
- `percipari_original_artwork.webp`

## Active Registry Mappings

Targeted chamberplate surfaces now have active registry-first mappings for:

- `oracle_card`, sequence 20
- `original_artwork`, sequence 40
- `full_song`, sequence 50

The OAR2-requested featured video sequence 10, epithet description sequence 30, and lapis tone sequence 60 remain unseated until the missing payloads are supplied.

## Validation Output

Full validation output was written to:

`docs/oar/measures_of_inanna/seat_chamber_of_epithets_chamberplate_aspect_media_v1.json`

Validation query returned active mappings for all three targeted chamberplate surfaces:

- `chamber_epithets_01_primus_artus`
- `chamber_epithets_02_gemynd_corpus`
- `chamber_epithets_03_percipari`

The schema does not currently expose an `is_active` column on `public.measures_surface_media_map`; active standing is represented by `status = 'active'`. The evidence JSON projects `is_active` as `status === 'active'` for OAR validation readability.

## Boundary

No frontend files changed.

No hardcoded media paths were added to src.

No description text was invented.

No featured video paths were invented.

No lapis/material tone audio was invented.

No legacy temp bridge rows were deleted or mutated.

## Standing

The chamberplate registry-first renderer will now use seated registry rows for the three targeted chamberplates, so legacy fallback will no longer be used for those surfaces.

The pass remains incomplete against the full OAR2 validation requirements until the missing featured videos, description text payloads, and lapis/material tone audio are supplied and seated.

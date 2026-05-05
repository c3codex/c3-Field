---
document_type: oar1
title: OAR1 — Epigraph + Landing Refinement
version: v1
status: executed
system: measures_registry
surfaces:
  - epigraph
  - landing_path_choice
  - c3_field
source_oar2: docs/oar/measures_registry/oar2_epigraph_landing_refinement_v1.meta.md
---

# OAR1 — epigraph_landing_refinement_v1

## Summary

Executed the epigraph, landing split-field, header, and c3 Field authority refinements.

The epigraph now renders as a true full-bleed motion surface without poster or visible brand pre-frame. The landing surface keeps its DB-driven path content while removing landing branding and increasing the distinction between failure and coherence. The c3 Field surface now resolves `c3_field.mp4` through the media map and renders DB-seated field expressions as text-only authority extensions.

## Runtime Changes

Epigraph:

- Set intro video container to fixed full viewport.
- Set video to `100vw` x `100vh` with `object-fit: cover`.
- Added `preload="auto"`.
- Removed poster binding from the video element.
- Removed registry mark from the pre-video gesture surface.
- Preserved failure fallback behavior: failed playback can still continue to path choice.

Header:

- Reduced header visual height.
- Removed solid panel background, border, and blur frame.
- Changed header to floating absolute positioning.
- Set opacity to `0.75`.
- Hid landing-path brand mark/title on `landing_path_choice`.

Landing path choice:

- Increased center divide contrast.
- Reduced failure-side motion intensity.
- Increased coherence-side clarity.
- Increased right-side scale bias.
- Added emergent geometric resolution on the coherence side through CSS field geometry.
- Preserved route-plate action handling and DB-driven path content.

c3 Field:

- Added optional media role read: `c3_field_video`.
- Rendered c3 Field video under authority text when media map resolves.
- Video behavior: autoplay, muted, loop, plays inline, preload auto.
- Added DB-driven `field_expressions` rendering.
- Field expressions render as a vertical text list with no cards, grids, thumbnails, or links.

## DB Seating

Execution script:

`docs/oar/measures_registry/execute-epigraph-landing-refinement.cjs`

Seated media map:

```json
{
  "media_role": "c3_field_video",
  "storage_bucket": "measures-registry",
  "storage_path": "c3_field.mp4",
  "mime_type": "video/mp4",
  "is_active": true
}
```

Updated `c3_field` metadata:

- `field_expressions`
- `media_roles: ["c3_field_video"]`
- `source_epigraph_landing_refinement: epigraph_landing_refinement_v1`

## Validation Result

```json
{
  "dbConnection": "active",
  "c3FieldVideoStorageObject": {
    "name": "c3_field.mp4",
    "size": 5241718,
    "mimetype": "video/mp4"
  },
  "mediaRoleSeated": {
    "media_role": "c3_field_video",
    "storage_bucket": "measures-registry",
    "storage_path": "c3_field.mp4",
    "mime_type": "video/mp4",
    "is_active": true
  },
  "fieldExpressionCount": 3,
  "fieldExpressionNames": [
    "Measures of Inanna",
    "Priceless Gallery",
    "c3 DAO"
  ]
}
```

## Build Validation

Command:

`npm.cmd run build:registry`

Result:

- Build passed.
- Output directory: `dist-registry`.
- Generated build artifacts were cleaned from git after validation.

## OAR2 Validation

- Epigraph fills viewport cleanly.
- Poster frame removed.
- Visible pre-video brand removed.
- Header is non-intrusive and floating.
- Landing path surface has no visible brand mark/title.
- Coherence geometry resolves from field structure, not logo insertion.
- Failure side is lattice/interference based and motion-reduced.
- `c3_field.mp4` resolves from Supabase media map.
- Field expressions are text-only and vertical.
- Split-field asymmetry remains visible.

## Close

Render corrected.
Authority preserved.
Identity emerges from structure.
No landing branding introduced.

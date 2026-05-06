---
document_type: oar1
title: OAR1 Addendum - Seat Path Threshold Hero Media
version: v1
status: executed
system: measures_registry
surface: landing_split_hero
scope: hero_media_seating_only
source_oar2: docs/oar/measures_registry/oar2_addendum_seat_path_threshold_hero_media_v1.meta.md
related_oar1: docs/oar/measures_registry/oar1_path_threshold_hero_reconstruction_v1.meta.md
---

# OAR1 Addendum - Seat Path Threshold Hero Media

## Execution Summary

Executed the approved media seating addendum for the reconstructed Measures Registry path-threshold hero.

The runtime contract already read the four threshold hero media roles. This pass seated those roles into `measures_media_map` for the active landing root campaign/runtime.

No runtime layout, hero copy, epigraph behavior, IIS evaluation flow, SRC routing, Phase Map, Measures of Inanna runtime, DB schema, or conversion systems were modified.

## Execution Script

`docs/oar/measures_registry/execute-seat-path-threshold-hero-media.cjs`

## Media Rows Seated

- `left_hero_fracture`
  - bucket: `measures-registry`
  - storage path: `left_hero_fracture.webp`
  - mime type: `image/webp`
  - state: active
- `left_hero_fracture_motion`
  - bucket: `measures-registry`
  - storage path: `left_hero_fracture_motion.mp4`
  - mime type: `video/mp4`
  - state: active
- `right_measured_hero`
  - bucket: `measures-registry`
  - storage path: `right_measured_hero.webp`
  - mime type: `image/webp`
  - state: active
- `measured_hero_motion_graphic`
  - bucket: `measures-registry`
  - storage path: `right_measured_hero_motion_graphic.mp4`
  - mime type: `video/mp4`
  - state: active

## Path Resolution Note

The OAR2 addendum named the right motion asset as:

`measured_hero_motion_graphic.mp4`

Live storage contained the right motion asset as:

`right_measured_hero_motion_graphic.mp4`

The media role was seated exactly as required:

`measured_hero_motion_graphic`

The storage path uses the live object name.

## Validation Result

```json
{
  "dbConnection": "active",
  "expectedRoleCount": 4,
  "activeRoleCount": 4,
  "allExpectedRolesActive": true,
  "rows": [
    {
      "media_role": "left_hero_fracture",
      "storage_bucket": "measures-registry",
      "storage_path": "left_hero_fracture.webp",
      "mime_type": "image/webp",
      "is_active": true,
      "campaign_key": "agents_of_chaos_integrity_governance",
      "encounter_key": "landing_root",
      "sort_order": 50
    },
    {
      "media_role": "left_hero_fracture_motion",
      "storage_bucket": "measures-registry",
      "storage_path": "left_hero_fracture_motion.mp4",
      "mime_type": "video/mp4",
      "is_active": true,
      "campaign_key": "agents_of_chaos_integrity_governance",
      "encounter_key": "landing_root",
      "sort_order": 51
    },
    {
      "media_role": "right_measured_hero",
      "storage_bucket": "measures-registry",
      "storage_path": "right_measured_hero.webp",
      "mime_type": "image/webp",
      "is_active": true,
      "campaign_key": "agents_of_chaos_integrity_governance",
      "encounter_key": "landing_root",
      "sort_order": 52
    },
    {
      "media_role": "measured_hero_motion_graphic",
      "storage_bucket": "measures-registry",
      "storage_path": "right_measured_hero_motion_graphic.mp4",
      "mime_type": "video/mp4",
      "is_active": true,
      "campaign_key": "agents_of_chaos_integrity_governance",
      "encounter_key": "landing_root",
      "sort_order": 53
    }
  ]
}
```

## Public URL Validation

All four seated storage URLs resolved with HTTP 200:

- `left_hero_fracture.webp`
  - content type: `image/webp`
  - content length: `48266`
- `left_hero_fracture_motion.mp4`
  - content type: `video/mp4`
  - content length: `7537934`
- `right_measured_hero.webp`
  - content type: `image/webp`
  - content length: `55160`
- `right_measured_hero_motion_graphic.mp4`
  - content type: `video/mp4`
  - content length: `2977050`

## Scope Confirmation

Media seating only.

No layout or routing code changed in this addendum pass.

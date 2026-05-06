---
document_type: oar1
title: OAR1 — Landing Epigraph + Split Hero
version: v1
status: executed
system: measures_registry
source_oar2: docs/oar/measures_registry/oar2_landing_epigraph_split_hero_v1.meta.md
---

# OAR1 — landing_epigraph_split_hero_v1

## Summary

Executed the landing epigraph + split hero OAR.

The public entry now uses `landing_root` as the canonical landing surface. The landing flow renders an epigraph video first, transitions to split hero on completion or skip, routes the left side into an educational diagnostic evaluation path, and routes the right side into the cohort conversion path.

## Runtime Changes

- Added `landing_root` as the entry surface query key.
- Added routed surfaces:
  - `educate_eval_encounter`
  - `cohort_conversion_encounter`
  - `iis_eval_gate1`
- Preserved `landing_path_choice` defensively for older registered routes.
- Replaced frontend hardcoded epigraph storage path with media role resolution:
  - `epigraph_video`
- Added media role reads:
  - `hero_image`
  - `explainer_video`
- Implemented epigraph controls:
  - mute
  - skip
- Implemented epigraph completion transition to split hero.
- Implemented split hero action routing through registered action keys.
- Implemented educational explainer encounter using DB media role.
- Implemented DB-bound institutional structural evaluation form.
- Evaluation submission inserts into `measures_iis_eval_gate1_capture`.

## DB Seating

Execution script:

`docs/oar/measures_registry/execute-landing-epigraph-split-hero.cjs`

Seated encounters:

- `landing_root`
- `educate_eval_encounter`
- `cohort_conversion_encounter`
- `iis_eval_gate1`

Seated media roles:

- `epigraph_video`
- `hero_image`
- `explainer_video`

Created capture table:

- `public.measures_iis_eval_gate1_capture`

Capture table behavior:

- public insert allowed for `capture_context = iis_eval_gate1`
- no public select grant to anon
- notification state seated as `queued`
- confirmation email state seated as `queued`
- campaign tag seated as `iis_eval_gate1`

## Validation Result

```json
{
  "dbConnection": "active",
  "requiredEncounterCount": 4,
  "requiredEncounters": [
    "cohort_conversion_encounter",
    "educate_eval_encounter",
    "iis_eval_gate1",
    "landing_root"
  ],
  "mediaResults": [
    {
      "role": "epigraph_video",
      "bucket": "measures-registry",
      "path": "registry_epigraph_fracture_to_alignment_15s.mp4",
      "size": 24980322
    },
    {
      "role": "hero_image",
      "bucket": "measures-registry",
      "path": "hero_fracture_measure.webp",
      "size": 232880
    },
    {
      "role": "explainer_video",
      "bucket": "measures-registry",
      "path": "structural_coherence_explainer_45s.mp4",
      "size": 47144235
    }
  ],
  "mediaRows": [
    {
      "media_role": "epigraph_video",
      "storage_bucket": "measures-registry",
      "storage_path": "registry_epigraph_fracture_to_alignment_15s.mp4",
      "mime_type": "video/mp4",
      "is_active": true
    },
    {
      "media_role": "hero_image",
      "storage_bucket": "measures-registry",
      "storage_path": "hero_fracture_measure.webp",
      "mime_type": "image/webp",
      "is_active": true
    },
    {
      "media_role": "explainer_video",
      "storage_bucket": "measures-registry",
      "storage_path": "structural_coherence_explainer_45s.mp4",
      "mime_type": "video/mp4",
      "is_active": true
    }
  ],
  "captureTable": "measures_iis_eval_gate1_capture",
  "noScoring": true
}
```

## Build Validation

Command:

`npm.cmd run build:registry`

Result:

- Build passed.
- Output directory: `dist-registry`.
- Generated build artifacts were cleaned from git after validation.

## Notes

The OAR referenced `measures_registry` as bucket syntax and listed two paths without final extensions or with a typo. Live storage validation confirmed the actual public bucket and storage paths:

- bucket: `measures-registry`
- `registry_epigraph_fracture_to_alignment_15s.mp4`
- `hero_fracture_measure.webp`
- `structural_coherence_explainer_45s.mp4`

No frontend storage path fallback was introduced.

Email dispatch itself is not implemented in this pass. The DB-bound capture records queue the internal notification and confirmation email states with `campaign_tag = iis_eval_gate1`, preserving traceable state for the provider/dispatch layer.

## Close

Epigraph loads first.
Split hero follows completion or skip.
Hero routes into distinct encounter paths.
Evaluation is DB-bound and non-SRC.
No scoring logic introduced.
No Measures of Inanna changes.
No deploy performed.

---
document_type: oar1
title: OAR1 — Media Map Public Read Policy Correction
version: v1
status: executed
system: measures_registry
---

# OAR1 — media_map_public_read_policy_correction_v1

## Summary

Corrected live media loading failure after Cloudflare deploy.

The media files were present in the public Supabase storage bucket and returned HTTP 200, but the deployed anon client could only read `registry_mark` from `measures_media_map`. Because the browser could not read active media-map rows for the landing and cohort media roles, the frontend could not construct the public media URLs.

## Action

Applied a narrow public read policy to `public.measures_media_map`:

`measures_media_map_public_active_read`

Policy behavior:

- `anon` and `authenticated` may select active media rows.
- Read is limited by policy to `is_active = true`.
- Granted select on public media-map fields required by the renderer.

Execution script:

`docs/oar/measures_registry/execute-media-map-public-read-policy.cjs`

## Validation

The deployed bundle's anon client now reads all required media roles:

```json
{
  "dbConnection": "active",
  "policy": "measures_media_map_public_active_read",
  "deployedAnonCanReadMediaRows": true,
  "returnedRoles": [
    "epigraph_video",
    "explainer_video",
    "hero_image",
    "hero_measured_image",
    "registry_mark"
  ]
}
```

Public storage URLs also returned HTTP 200 for:

- `hero_fracture_measure.webp`
- `measured_hero_right.webp`
- `registry_epigraph_fracture_to_alignment_15s.mp4`
- `structural_coherence_explainer_45s.mp4`

## Close

Media files were not missing.
Cloudflare bundle was current.
The failure was media-map row visibility under anon RLS.
No frontend redeploy required.

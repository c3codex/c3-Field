---
document_type: oar1
title: OAR1 — Intro Hook Epigraph Replacement
version: v1
status: executed_with_asset_gap
system: measures_registry
surface: epigraph
source_oar2: docs/oar/measures_registry/oar2_intro_hook_epigraph_v1.meta.md
---

OAR1: intro_hook_15sec_epigraph_v1

## Objective
Replace the public first encounter surface with a gesture-gated epigraph video surface using the OAR2-designated intro hook asset.

## Actions
- Updated `landing_intro_video` runtime behavior into an epigraph playback surface.
- Set media source to Supabase Storage:
  - bucket: `measures-registry`
  - path: `intro_hook_15s.mp4`
- Removed frontend overlay copy from the intro surface.
- Removed primary skip button.
- Added mark-only enter surface before playback.
- Added gesture-first playback gate for browser audio policy.
- Preserved audio ON after user gesture:
  - `muted` defaults to `false`
- Added mute/unmute toggle only.
- Routed video completion directly to `landing_path_choice`.
- Added failure behavior:
  - mark-only fallback remains visible
  - fallback click continues to `landing_path_choice`
  - no additional UI copy or alternate meaning added

## Constraints Held
- No overlay tagline.
- No CTA copy.
- No explanatory copy.
- No path labels.
- No native video controls.
- No progress bar.
- No forced mute.
- No route logic outside registered surface contract.
- No thread instruction used as execution authority.

## Validation
```json
{
  "videoSourceBucket": "measures-registry",
  "videoSourcePath": "intro_hook_15s.mp4",
  "resolvedPublicUrl": "https://zfihrspxvennjzazxcbj.supabase.co/storage/v1/object/public/measures-registry/intro_hook_15s.mp4",
  "storageResponse": {
    "name": "intro_hook_15s.mp4",
    "mimetype": "video/mp4",
    "size": 15819429
  },
  "audioAfterGestureDefaultMuted": false,
  "muteTogglePresent": true,
  "frontendOverlayTextPresent": false,
  "videoEndRoutesTo": "landing_path_choice",
  "failureFallbackInventsCopy": false,
  "build_registry": "passed"
}
```

## Media Validation
The epigraph asset is present in the public Supabase `measures-registry` bucket as `intro_hook_15s.mp4`.

## Files
- docs/oar/measures_registry/oar2_intro_hook_epigraph_v1.meta.md
- docs/oar/measures_registry/oar1_intro_hook_epigraph_v1.meta.md
- src/measures_registry/MeasuresRegistryRuntime.tsx
- src/index.css

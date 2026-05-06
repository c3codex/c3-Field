---
document_type: oar1
title: OAR1 - Epigraph Autoplay + Muted Context
version: v1
status: executed
system: measures_registry
surface: epigraph
scope: epigraph_only
source_oar2: docs/oar/measures_registry/oar2_epigraph_autoplay_muted_context_v1.meta.md
---

# OAR1 - Epigraph Autoplay + Muted Context

## Execution Summary

The Measures Registry epigraph now enters as a muted autoplay threshold.

The approved epigraph media remains unchanged.
No landing content, non-epigraph surfaces, DB schema, routing contracts, IIS gates, About surface, cohort conversion surface, Phase Map, or Measures of Inanna surfaces were changed.

## Implemented

- Epigraph video starts with `muted` state enabled by default.
- Epigraph video retains `autoPlay`, `playsInline`, and `preload="auto"`.
- No click is required before attempting playback.
- Skip control remains available during playback.
- Audio control now reads `Sound` before audio is enabled.
- Audio control switches to `Mute` only after sound is enabled.
- Muted context overlay was added during initial muted playback:
  - `AI is not broken.`
  - `The systems are.`
  - `Integrity Governance begins where behavior becomes measurable.`
- Overlay is lower-left, silver-white, non-clickable, and softens after five seconds.

## Validation

- Epigraph video is configured to autoplay muted on public load.
- Muted context appears only while the epigraph video is active and muted.
- `Sound` appears before user enables audio.
- `Mute` appears only after audio is enabled.
- Skip still advances to the landing split hero.
- Landing still advances after epigraph completion.
- Scope remained epigraph-only.

## Files Updated

- `src/measures_registry/MeasuresRegistryRuntime.tsx`
- `src/index.css`


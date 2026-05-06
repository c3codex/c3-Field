---
document_type: oar1
title: OAR1 - Educational Diagnostic Passage + Codex Publication Surface
version: v1
status: executed
system: measures_registry
scope: left_path_threshold_refactor_only
source_oar2: docs/oar/measures_registry/oar2_educational_diagnostic_passage_codex_publication_surface_v1.meta.md
---

# OAR1 - Educational Diagnostic Passage + Codex Publication Surface

## Execution Summary

Executed the approved left-path refactor.

The left path now separates recognition media from operational evaluation:

`landing_split_hero -> educational_diagnostic_passage -> educate_eval_encounter`

The 45-second explainer video is seated as a dedicated passage encounter. The evaluation chamber no longer renders the explainer video and now prioritizes diagnostic recognition, a featured Codex/Measures Registry publication resource, bounded educational resources, publication subscription entry, and the visible `Begin Evaluation` action.

No epigraph, right-path conversion flow, Phase Map, Measures of Inanna runtime, DB schema, institutional conversion system, or unrelated routing contract was modified.

## Runtime Changes

- Added `educational_diagnostic_passage` surface state and route handling.
- Added `renderEducationalDiagnosticPassageSurface()`.
- Passage video renders with:
  - `autoPlay`
  - sound enabled where browser permits
  - `playsInline`
  - minimal controls
  - auto-advance to `educate_eval_encounter` on completion
  - fallback CTA: `Continue to Evaluation`
- Refactored `educate_eval_encounter` so the explainer video is no longer rendered there.
- Added featured publication rendering for `Agents of Chaos`.
- Added publication subscription CTA rendering.
- Added optional `paragraph_agents_of_chaos` media role.
- Calibrated landing threshold hero text placement slightly inward and strengthened CTA hierarchy.

## DB + Media Seating

Execution script:

`docs/oar/measures_registry/execute-educational-diagnostic-passage-codex-publication-surface.cjs`

Seated/updated:

- `educational_diagnostic_passage`
- `landing_root.actions[route_educate_eval].target_encounter_key = educational_diagnostic_passage`
- `educate_eval_encounter.metadata.featured_publication`
- `educate_eval_encounter.metadata.subscription_entry`
- `educate_eval_encounter.metadata.media_roles = ["paragraph_agents_of_chaos"]`
- `measures_media_map.media_role = paragraph_agents_of_chaos`

## Path Resolution Note

The OAR2 specified:

`paragraph_agents_of_chaos.webp`

Live storage contained:

`paragraph_agents_of_chaos.png`

The media role was seated as required:

`paragraph_agents_of_chaos`

The storage path uses the live object name.

## Validation Result

```json
{
  "dbConnection": "active",
  "source": "educational_diagnostic_passage_codex_publication_surface_v1",
  "passageOperation": "inserted",
  "leftPathTarget": "educational_diagnostic_passage",
  "passageRenderer": "diagnostic_explainer_passage",
  "educateRenderer": "diagnostic_explainer_resource_evaluation_entry",
  "educateMediaRoles": [
    "paragraph_agents_of_chaos"
  ],
  "featuredPublicationSeated": true,
  "subscriptionEntrySeated": true,
  "publicationMedia": {
    "role": "paragraph_agents_of_chaos",
    "operation": "inserted",
    "path": "paragraph_agents_of_chaos.png",
    "resolvedAsset": "paragraph_agents_of_chaos.png",
    "size": 1767404
  },
  "mediaRows": [
    {
      "media_role": "explainer_video",
      "storage_bucket": "measures-registry",
      "storage_path": "structural_coherence_explainer_45s.mp4",
      "mime_type": "video/mp4",
      "is_active": true
    },
    {
      "media_role": "paragraph_agents_of_chaos",
      "storage_bucket": "measures-registry",
      "storage_path": "paragraph_agents_of_chaos.png",
      "mime_type": "image/png",
      "is_active": true
    }
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

## Deploy Status

No deploy performed yet for this OAR1 closure.

Established deploy route remains git push on `measures`.

## Files Updated

- `src/measures_registry/MeasuresRegistryRuntime.tsx`
- `src/index.css`
- `docs/oar/measures_registry/execute-educational-diagnostic-passage-codex-publication-surface.cjs`

## Scope Confirmation

Left-path passage introduction, evaluation chamber refactor, Codex publication resource seating, subscription CTA, and minor hero calibration only.

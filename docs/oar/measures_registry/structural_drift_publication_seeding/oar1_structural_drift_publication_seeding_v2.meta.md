---
document_type: oar1
title: OAR1 Structural Drift Publication Seeding
version: v2
status: executed
system: measures_registry
source_oar2: docs/oar/structural_drift_publication_seeding/oar2_structural_drift_publication_seeding_v2.meta.md
---

# OAR1 Structural Drift Publication Seeding

## Execution Summary

Executed the approved Structural Drift publication seeding OAR.

Structural Drift is now seated as a governed Measures Registry publication surface, with the first dispatch `agents_of_chaos_dispatch_v1` seated by internal authority keys rather than external slugs.

The public runtime now supports the publication dispatch renderer at:

`/publication/structural_drift/agents_of_chaos_dispatch_v1`

No unrelated Measures of Inanna runtime, right-path conversion system, Phase Map, or existing evaluation routing was modified.

## DB Schema Created

Created if absent:

- `public.measures_publication_registry`
- `public.measures_publication_dispatch`
- `public.measures_publication_subscription_capture`

RLS/policies:

- public read for published publication registry rows
- public read for published dispatch rows
- public insert-only capture for `capture_source = structural_drift_dispatch`
- no public select on subscription capture rows

## Publication Seated

- `publication_key: structural_drift`
- title: `Structural Drift`
- subtitle: `Dispatches from the Measures Registry`
- publication type: `institutional_diagnostic`
- status: `published`
- distribution surface: `x_primary`
- external platform: `paragraph`
- external slug: `structural-drift`
- external URL: `https://paragraph.com/@measures-registry/structural-drift`
- tone:
  - institutional
  - diagnostic
  - restrained
  - evidence_backed

## Dispatch Seated

- `dispatch_key: agents_of_chaos_dispatch_v1`
- title: `The Harness Was Never the Fix`
- internal route: `/publication/structural_drift/agents_of_chaos_dispatch_v1`
- external URL: `https://paragraph.com/@measures-registry/agents-of-chaos`
- status: `published`
- primary CTA: `Evaluate Structural Coherence`
- secondary CTA: `Receive Registry Dispatches`
- body source: `https://paragraph.com/@measures-registry/agents-of-chaos.md`

The approved article body was fetched from Paragraph's markdown alternate and seated into `dispatch_body` without rewrite.

## References Seated

- `Agents of Chaos`, 2026, research paper
- `The Last Harness You'll Ever Build`, 2026, research paper, `arXiv:2604.21003v1`

## Media Manifest Seated

- banner image: `measures-registry/structural_drift.webp`
- resolved banner image: `structural_drift.webp`
- YouTube dispatch video: `https://youtu.be/29f2Gcxwv9o`
- video title: `AI isn't broken. Systems are.`
- video type: `longform_dispatch_video`

## Runtime Changes

- Added `publication_dispatch` surface state.
- Added path-based route detection for `/publication/structural_drift/agents_of_chaos_dispatch_v1`.
- Added DB reads for:
  - `measures_publication_registry`
  - `measures_publication_dispatch`
- Added publication dispatch renderer:
  - responsive publication layout
  - restrained typography
  - banner rendering
  - YouTube embed rendering
  - markdown body rendering
  - separate references section
  - CTA section
  - Codex-native subscription capture form
- Added insert-only subscription capture handling.
- No public diagnostics rendered.

## Execution Script

`docs/oar/structural_drift_publication_seeding/execute-structural-drift-publication-seeding.cjs`

## Seeding Validation

```json
{
  "dbConnection": "active",
  "publication": {
    "publication_key": "structural_drift",
    "title": "Structural Drift",
    "status": "published",
    "external_url": "https://paragraph.com/@measures-registry/structural-drift",
    "tone": [
      "institutional",
      "diagnostic",
      "restrained",
      "evidence_backed"
    ]
  },
  "dispatch": {
    "dispatch_key": "agents_of_chaos_dispatch_v1",
    "title": "The Harness Was Never the Fix",
    "status": "published",
    "internal_route": "/publication/structural_drift/agents_of_chaos_dispatch_v1",
    "referenceCount": 2,
    "hasBanner": true,
    "hasVideo": true,
    "primary_cta": "Evaluate Structural Coherence",
    "secondary_cta": "Receive Registry Dispatches",
    "bodyLength": 3220
  },
  "subscriptionCaptureTable": "measures_publication_subscription_capture"
}
```

## Public Client Validation

Validated with the deployed browser anon key:

```json
{
  "anonCanReadPublication": true,
  "anonCanReadDispatch": true,
  "referenceCount": 2,
  "bodyLength": 3220,
  "hasVideo": true,
  "anonCanInsertCapture": true,
  "captureCleaned": true
}
```

The local `.env` anon key still returns `Invalid API key`, so public-client validation used the deployed browser key.

## Build Validation

Command:

`npm.cmd run build:registry`

Result:

- Build passed.
- Output directory: `dist-registry`.
- Generated build artifacts were cleaned from git after validation.

## Files Updated

- `src/measures_registry/MeasuresRegistryRuntime.tsx`
- `src/index.css`
- `docs/oar/structural_drift_publication_seeding/execute-structural-drift-publication-seeding.cjs`

## Deploy Status

No deploy performed in this pass.

Established deploy route remains git push on `measures`.

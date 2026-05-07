---
document_type: oar1
title: OAR1 - Structural Drift Dispatches Rename + ISSUE 002 Seating
version: v1
status: executed
system: measures_registry
source_oar2: docs/oar/measures_registry/oar2_structural_drift_dispatches_rename_issue002_v1.meta.md
operator: op044
---

# OAR1 - Structural Drift Dispatches Rename + ISSUE 002 Seating

## Execution Summary

Executed the approved rename and ISSUE 002 seating OAR.

The prior `structural_drift_field_guide` wording was corrected before deploy. The active Structural Drift publication encounter is now:

`structural_drift_dispatches`

The surface renders as:

Structural Drift  
Dispatches from the Measures Registry

## Files Changed

- `src/measures_registry/MeasuresRegistryRuntime.tsx`
- `src/index.css`
- `docs/oar/measures_registry/execute-structural-drift-dispatches-rename-issue002.cjs`
- `docs/oar/measures_registry/oar1_structural_drift_dispatches_rename_issue002_v1.meta.md`

## DB Migration

Added required dispatch validation columns:

- `public.measures_publication_dispatch.issue_number`
- `public.measures_publication_dispatch.article_url`

Created or updated:

- `public.measures_registry.registry_key = structural_drift_dispatches`
- `public.measures_encounter_def.encounter_key = structural_drift_dispatches`
- `public.measures_media_map.media_role = structural_drift_featured_image`

Deactivated:

- `public.measures_registry.registry_key = structural_drift_field_guide`
- `public.measures_encounter_def.encounter_key = structural_drift_field_guide`

No duplicate active Structural Drift encounter surface remains.

## Dispatch Seating

ISSUE 001:

- `publication_key: structural_drift`
- `dispatch_key: agents_of_chaos_dispatch_v1`
- `issue_number: ISSUE 001`
- `title: Agents of Chaos`
- `article_url: https://paragraph.com/@measures-registry/agents-of-chaos`
- `status: published`

ISSUE 002:

- `publication_key: structural_drift`
- `dispatch_key: structural_drift_dispatch_v1`
- `issue_number: ISSUE 002`
- `dispatch_type: FIELD NOTE`
- `title: Structural Drift`
- `diagnostic_thesis: When structure fails, intelligence amplifies instability.`
- `article_url: https://paragraph.com/@measures-registry/structural-drift`
- `capture_source: structural_drift_dispatch`
- `status: published`

ISSUE 002 article body content was not invented. The dispatch body is intentionally unseated and marked in metadata as `content_body_status: not_seated`.

## Runtime Changes

The frontend now uses `structural_drift_dispatches` as the encounter key.

The dispatch index renders dynamically from `public.measures_publication_dispatch`, ordered by `issue_number`.

Direct dispatch paths under `/publication/structural_drift/<dispatch_key>` route to the native publication dispatch renderer.

Paragraph remains distribution only through `article_url` / external URL metadata.

## Validation

Execution command:

```powershell
node docs/oar/measures_registry/execute-structural-drift-dispatches-rename-issue002.cjs
```

Result:

```json
{
  "dbConnection": "active",
  "activeEncounter": "structural_drift_dispatches",
  "duplicateActivePriorSurface": false,
  "issue001": "Agents of Chaos",
  "issue002": "Structural Drift",
  "featuredImageStorageFound": true
}
```

Required DB validation confirmed:

```json
{
  "registry": [
    {
      "registry_key": "structural_drift_dispatches",
      "release_state": "released",
      "is_active": true
    },
    {
      "registry_key": "structural_drift_field_guide",
      "release_state": "released",
      "is_active": false
    }
  ],
  "encounters": [
    {
      "encounter_key": "structural_drift_dispatches",
      "is_active": true,
      "renderer": "structural_drift_dispatches",
      "publication_key": "structural_drift"
    },
    {
      "encounter_key": "structural_drift_field_guide",
      "is_active": false,
      "renderer": null,
      "publication_key": null
    }
  ],
  "dispatches": [
    {
      "dispatch_key": "agents_of_chaos_dispatch_v1",
      "issue_number": "ISSUE 001",
      "title": "Agents of Chaos",
      "article_url": "https://paragraph.com/@measures-registry/agents-of-chaos",
      "status": "published"
    },
    {
      "dispatch_key": "structural_drift_dispatch_v1",
      "issue_number": "ISSUE 002",
      "title": "Structural Drift",
      "article_url": "https://paragraph.com/@measures-registry/structural-drift",
      "status": "published"
    }
  ]
}
```

Build:

```powershell
npm.cmd run build:registry
```

Passed.

## Guardrails

- Did not touch `measures_of_inanna`.
- Did not touch `landing_epigraph`.
- Did not touch `cohort_conversion_encounter`.
- Did not touch `iis_eval_gate1` capture.
- Did not touch production env vars.
- Did not deploy.
- Did not hardcode ISSUE 002 card into frontend.
- Did not invent ISSUE 002 article body content.

## Closeout

OAR execution remained clean.

Structural Drift now resolves as Dispatches from the Measures Registry through `structural_drift_dispatches`, with ISSUE 001 and ISSUE 002 seated from DB state.

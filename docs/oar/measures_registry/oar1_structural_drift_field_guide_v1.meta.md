---
document_type: oar1
title: OAR1 - Structural Drift Field Guide Surface
version: v1
status: executed
system: measures_registry
source_oar2: docs/oar/measures_registry/oar2_structural_drift_field_guide_v1.meta.md
operator: op044
---

# OAR1 - Structural Drift Field Guide Surface

## Execution Summary

Executed the approved Structural Drift field guide OAR.

The field guide is now seated as a governed Measures Registry encounter and rendered by the frontend as a native editorial publication surface.

Paragraph remains distribution only. Frontend dispatch cards are rendered from `public.measures_publication_dispatch` state, not from hardcoded article card content.

## Files Changed

- `src/measures_registry/MeasuresRegistryRuntime.tsx`
- `src/index.css`
- `docs/oar/measures_registry/execute-structural-drift-field-guide.cjs`
- `docs/oar/measures_registry/oar1_structural_drift_field_guide_v1.meta.md`

## DB Seating

Created or updated:

- `public.measures_registry.registry_key = structural_drift_field_guide`
- `public.measures_encounter_def.encounter_key = structural_drift_field_guide`
- `public.measures_media_map.media_role = structural_drift_featured_image`

Patched:

- `public.measures_encounter_def.encounter_key = educate_eval_encounter`

The educate/evaluate encounter now includes the `route_structural_drift_article` action pointing to `structural_drift_field_guide`.

## Runtime Behavior

Added `structural_drift_field_guide` as a runtime surface.

The field guide renders:

1. registry marker
2. Structural Drift masthead
3. featured dispatch from seated publication dispatch rows
4. dispatch index from seated publication dispatch rows
5. Begin Structural Evaluation CTA
6. required footer surface

The field guide supports future dispatch growth because the runtime fetches all published dispatches for `publication_key = structural_drift` and maps them from seated rows.

## Exact Missing State

The current DB state contains one published Structural Drift dispatch:

- `agents_of_chaos_dispatch_v1`

The current DB state does not contain:

- ISSUE 002 dispatch row
- issue number metadata for the seated dispatch

The frontend reports the missing issue metadata and ISSUE 002 absence honestly. No placeholder dispatches were added.

## Validation

Execution script:

```powershell
node docs/oar/measures_registry/execute-structural-drift-field-guide.cjs
```

Result:

```json
{
  "dbConnection": "active",
  "encounterKey": "structural_drift_field_guide",
  "renderer": "structural_drift_field_guide",
  "publicationKey": "structural_drift",
  "dispatchCount": 1,
  "issue002Seated": false,
  "featuredDispatchRoleResolves": true,
  "beginStructuralEvaluationAction": true,
  "fieldGuideRouteActionOnEducateEval": true,
  "featuredImageStorageFound": true
}
```

Exact OAR2 select:

```sql
select encounter_key, metadata
from public.measures_encounter_def
where encounter_key = 'structural_drift_field_guide';
```

Result confirmed:

```json
{
  "dbConnection": "active",
  "encounter_key": "structural_drift_field_guide",
  "renderer": "structural_drift_field_guide",
  "publication_key": "structural_drift",
  "actions": [
    {
      "action_key": "route_structural_drift_article",
      "target_encounter_key": "structural_drift_field_guide"
    },
    {
      "action_key": "begin_structural_evaluation",
      "target_encounter_key": "iis_eval_gate1"
    }
  ]
}
```

Publication dispatch validation:

```powershell
npm.cmd run validate:publication-dispatch -- --publication-key structural_drift --dispatch-key agents_of_chaos_dispatch_v1 --capture-source structural_drift_dispatch
```

Passed:

- publication exists
- dispatch exists
- required fields present
- references present
- media manifest valid
- no slug authority
- public read works
- subscription capture insert works
- validation capture cleaned

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
- Did not import `docs/oar` or `docs/process` into `src` runtime.
- Did not embed Paragraph as primary layout.
- Did not invent ISSUE 002 content.
- Did not hardcode article cards into frontend.

## Closeout

OAR execution remained clean.

Structural Drift now has a native field guide surface that can expand as publication dispatch rows are seated.

---
document_type: oar1
title: OAR1 — c3 Field Authority Surface
version: v1
status: executed
system: measures_registry
surface: c3_field
source_oar2: docs/oar/measures_registry/oar2_c3_field_authority_surface_v1.meta.md
---

# OAR1 — c3_field_authority_surface_v1

## Summary

Executed OAR2 c3 Field Authority Surface.

The legacy About route was replaced by a dedicated DB-seated `c3_field` authority surface. The public runtime now reads the authority copy from `measures_encounter_def`, renders it as a plain single-column read-only surface, and routes the former About navigation target to `c3_field`.

## Runtime Changes

- Added `c3_field` to required Measures Registry encounter reads.
- Added `c3_field` to browser query/state routing.
- Replaced the public `orientation_placeholder` surface renderer with `renderC3FieldSurface`.
- Preserved defensive routing from stale `orientation_placeholder` actions to `c3_field`.
- Rendered authority copy from DB `metadata.paragraphs` only.
- Added `registry-authority-surface` layout with:
  - single column
  - left alignment
  - spacing-only separation
  - no cards
  - no panels
  - no dividers
  - no buttons inside content

## DB Seating

Execution script:

`docs/oar/measures_registry/execute-c3-field-authority-surface.cjs`

Seated:

- `measures_registry.registry_key = c3_field`
- `measures_encounter_def.encounter_key = c3_field`
- `metadata.renderer = static_authority_surface`
- `metadata.title = c3 Field`
- `metadata.paragraphs` = approved OAR2 copy
- `metadata.actions = []`
- `metadata.constraints.read_only = true`

Legacy About replacement:

- `orientation_placeholder` encounter marked inactive.
- `orientation_placeholder` registry row marked inactive.
- `landing_path_choice` header navigation label updated to `c3 Field`.
- Legacy header target `orientation_placeholder` removed from active navigation metadata.

## Validation Result

```json
{
  "dbConnection": "active",
  "surfaceKey": "c3_field",
  "displayTitle": "c3 Field",
  "surfaceType": "threshold",
  "contentExact": true,
  "paragraphCount": 7,
  "actionsInsideContent": 0,
  "layoutConstraints": {
    "no_cta": true,
    "no_cards": true,
    "no_icons": true,
    "no_panels": true,
    "read_only": true,
    "no_links_embedded": true,
    "no_section_dividers": true,
    "no_buttons_inside_content": true,
    "no_frontend_authored_copy": true
  },
  "navigationLabelUpdated": true,
  "noLegacyAboutTargetInHeader": true,
  "legacyAboutActive": false,
  "autoRoute": "none"
}
```

## Build Validation

Command:

`npm.cmd run build:registry`

Result:

- Build passed.
- Output directory: `dist-registry`
- Generated deploy artifacts were cleaned from git after validation.

## Notes

The relational `surface_type` column only accepts existing constrained values, so the DB row uses `surface_type = threshold` while the renderer contract remains explicit in metadata as `renderer = static_authority_surface` and registry metadata `surface_type = static_authority_surface`.

## Close

Authority surface established.
About replaced.
No frontend-authored authority copy introduced.
No expansion added.

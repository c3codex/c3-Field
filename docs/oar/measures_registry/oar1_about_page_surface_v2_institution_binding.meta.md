---
document_type: oar1
title: OAR1 About Page Surface — Institution Bound
version: v2
status: executed
system: measures_registry
operator: op044
source_oar2: docs/oar/measures_registry/oar2_about_page_surface_v2_institution_binding.meta.md
replaces: about_page_surface_v1
---

OAR1: oar1_about_page_surface_v2_institution_binding

## Objective
Bind the Measures Registry About surface to the Codex-seated entity while rendering its native role as Institution in Service.

## Actions
- Seated `orientation_placeholder` as the About route surface.
- Added `entity_reference: c3_community_partners_dao` to About metadata.
- Updated the "HOW IT RELATES" section to:
  - `Measures Registry is developed and operated by the registered institution in service.`
- Removed static entity naming from About content body.
- Corrected entity standing:
  - `entity_type: institution_in_service`
  - `legal_form: nonprofit_limited_liability_company`
  - `designation: decentralized_organization`
- Updated renderer to resolve `codex_entity` by `entity_reference`.
- Updated renderer to map `entity_type = institution_in_service` to `Institution in Service`.
- Rendered minimal entity block:
  - entity name
  - native role label
  - status line
- Kept `legal_form` out of About display.

## Constraints Held
- No hardcoded entity name in frontend.
- No reference to `codex_entity` in UI.
- No legal interpretation.
- No artifact rendering.
- No address or officer exposure.
- No conversion additions.
- No schema language in UI.
- No payment, SRC, or c3 key logic.

## Validation
```json
{
  "dbConnection": "active",
  "aboutPageLoadsFromDb": true,
  "entityReference": "c3_community_partners_dao",
  "entityResolvesCorrectly": true,
  "entityNameRenders": "C3 Community Partners DAO, LLC",
  "entityType": "institution_in_service",
  "legalForm": "nonprofit_limited_liability_company",
  "label": "Institution in Service",
  "statusLine": "Active — Tennessee",
  "staticEntityTextRemoved": true,
  "noSchemaLanguageInUi": true,
  "noArtifactExposure": true,
  "layoutStable": true,
  "build_registry": "passed"
}
```

## Files
- docs/oar/measures_registry/oar2_about_page_surface_v2_institution_binding.meta.md
- docs/oar/measures_registry/oar1_about_page_surface_v2_institution_binding.meta.md
- docs/oar/measures_registry/execute-about-page-surface-v2-institution-binding.cjs
- src/measures_registry/MeasuresRegistryRuntime.tsx
- src/index.css

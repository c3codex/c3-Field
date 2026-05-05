---
document_type: oar1
title: OAR1 About Page Surface — Codex Bound
version: v2
status: executed
system: measures_registry
operator: op044
source_oar2: docs/oar/measures_registry/oar2_about_page_surface_v2_codex_binding.meta.md
replaces: about_page_surface_v1
---

OAR1: oar1_about_page_surface_v2_codex_binding

## Objective
Bind the Measures Registry About surface to the Codex-seated operating entity instead of storing static entity truth in About content.

## Actions
- Seated `orientation_placeholder` as the current About route surface.
- Updated About metadata with:
  - `renderer: generic_content_encounter`
  - `entity_reference: c3_community_partners_dao`
- Replaced static entity naming in the "HOW IT RELATES" section with:
  - `Measures Registry is developed and operated by the registered operating entity.`
- Added runtime resolution from `codex_entity` by `entity_reference`.
- Added minimal entity block rendering after the "HOW IT RELATES" section and before the closing statement.
- Rendered entity fields:
  - `entity_name`
  - formatted `operating_role`
  - formatted `legal_status`
  - `jurisdiction`
- Added narrowly scoped public read policy for the active operating entity fields needed by About.

## Constraints Held
- No hardcoded entity name in frontend.
- No duplicate entity fields in About content.
- No legal interpretation.
- No artifact exposure.
- No navigation changes.
- No conversion additions.
- No payment logic.
- No SRC logic.
- No c3 key logic.

## Validation
```json
{
  "dbConnection": "active",
  "aboutPageLoadsFromDb": true,
  "encounterKey": "orientation_placeholder",
  "renderer": "generic_content_encounter",
  "entityReference": "c3_community_partners_dao",
  "entityResolvesFromCodex": true,
  "entityNameRenders": "C3 Community Partners DAO, LLC",
  "legalStatus": "active",
  "jurisdiction": "Tennessee",
  "staticEntityTextRemoved": true,
  "noArtifactExposure": true,
  "noNavigationChanges": true,
  "noConversionAdditions": true,
  "build_registry": "passed"
}
```

## Validation Note
The local `.env` anon key returned `Invalid API key` during public-client validation. Service-side validation confirmed the entity resolution and the About metadata contract. The deployed Cloudflare anon key should be used for final browser confirmation after deploy.

## Files
- docs/oar/measures_registry/oar2_about_page_surface_v2_codex_binding.meta.md
- docs/oar/measures_registry/oar1_about_page_surface_v2_codex_binding.meta.md
- docs/oar/measures_registry/execute-about-page-surface-v2-codex-binding.cjs
- src/measures_registry/MeasuresRegistryRuntime.tsx
- src/index.css

---
document_type: oar1
title: OAR1 Foundation Offering Surface
version: v1
status: executed
system: measures_registry
operator: op044
source_oar2: docs/oar/measures_registry/oar2_foundation_offering_surface_v1.meta.md
---

OAR1: oar1_foundation_offering_surface_v1

## Objective
Seat `foundation_offering` as the DB-driven offering surface reached from the Foundation Seat option.

## Actions
- Created `foundation_offering` registry row with:
  - `registry_family: spine`
  - `metadata.role: measures_registry_learning_offering`
  - `metadata.source: foundation_offering_surface_v1`
  - `metadata.parent: measures_registry_runtime`
- Created `foundation_offering` encounter with:
  - `function_layer: orientation`
  - `state_expression: public_offering_surface`
  - `renderer: offering_surface`
- Reused the generic `offering_surface` renderer for Foundation and Systems.
- Routed `foundation_offering` primary CTA to `foundation_seat_hold`.
- Routed Back to Seats to `reserve_seat`.
- Added optional `foundation_intro_video` media role handling.

## Constraints Held
- No SRC logic.
- No c3 key logic.
- No payment logic.
- No form fields.
- No diagnostics.
- No slug fields introduced.
- `surface_type` not used as renderer authority.

## Validation
```json
{
  "dbConnection": "active",
  "foundationOfferingExists": true,
  "parent": "measures_registry_runtime",
  "function_layer": "orientation",
  "state_expression": "public_offering_surface",
  "renderer": "offering_surface",
  "sectionCount": 3,
  "foundationIntroVideoSeated": false,
  "missingMediaRoles": [
    "foundation_intro_video"
  ],
  "primaryActionTarget": "foundation_seat_hold",
  "formFieldsPresent": false,
  "srcRpcPresent": false,
  "build_registry": "passed"
}
```

## Files
- docs/oar/measures_registry/oar2_foundation_offering_surface_v1.meta.md
- docs/oar/measures_registry/execute-foundation-offering-surface.cjs
- src/measures_registry/MeasuresRegistryRuntime.tsx

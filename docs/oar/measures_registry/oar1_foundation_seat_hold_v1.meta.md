---
document_type: oar1
title: OAR1 Foundation Seat Hold
version: v1
status: executed
system: measures_registry
operator: op044
source_oar2: docs/oar/measures_registry/oar2_foundation_seat_hold_v1.meta.md
---

OAR1: oar1_foundation_seat_hold_v1

## Objective
Seat `foundation_seat_hold` as a DB-driven Measures Registry hold surface.

## Actions
- Created `foundation_seat_hold` registry row with `registry_family: spine`.
- Created `foundation_seat_hold` encounter with:
  - `function_layer: intake`
  - `state_expression: public_hold_surface`
  - `renderer: hold_surface`
- Added one required email field only.
- Added simple non-SRC capture through `measures_seat_hold_capture`.
- Added runtime support for generic DB-driven `hold_surface` rendering.

## Constraints Held
- No SRC logic.
- No c3 key logic.
- No payment logic.
- No diagnostics.
- No slug fields introduced.

## Validation
```json
{
  "dbConnection": "active",
  "encounter_key": "foundation_seat_hold",
  "function_layer": "intake",
  "state_expression": "public_hold_surface",
  "renderer": "hold_surface",
  "singleEmailFieldPresent": true,
  "noSrc": true,
  "noPayment": true,
  "captureProbeInserted": true,
  "captureProbeCleanedUp": true,
  "build_registry": "passed"
}
```

## Reachability Note
`foundation_offering` is not currently seated in `measures_encounter_def`. `foundation_seat_hold` is seated and callable, but public navigation into it should be completed when the foundation offering surface is seated or intentionally rerouted by a later OAR.

## Files
- docs/oar/measures_registry/oar2_foundation_seat_hold_v1.meta.md
- docs/oar/measures_registry/execute-seat-hold-surfaces.cjs
- src/measures_registry/MeasuresRegistryRuntime.tsx
- src/index.css

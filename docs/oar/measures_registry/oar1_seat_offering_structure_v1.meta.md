---
document_type: oar1
title: OAR1 Seat Offering Structure
version: v1
status: executed
system: measures_registry
operator: op044
source_oar2: docs/oar/measures_registry/oar2_seat_offering_structure_v1.meta.md
---

OAR1: oar1_seat_offering_structure_v1

## Objective
Seat Measures Registry offerings as DB-governed seat records with public standing, sequence, and routing readiness.

## Actions
- Created `measures_seat_offering`.
- Added allowed `offering_type` values:
  - `foundation`
  - `systems`
  - `cohort`
- Added allowed `enrollment_state` values:
  - `open`
  - `coming_soon`
  - `held`
  - `closed`
- Seeded three offering records:
  - `foundation_seat`
  - `systems_seat`
  - `cohort`
- Updated `reserve_seat` metadata to resolve selector options from `public.measures_seat_offering`.
- Removed frontend dependency on hardcoded `reserve_seat.metadata.options`.
- Updated runtime selector to read `measures_seat_offering` ordered by `sequence_order`.
- Preserved existing routes:
  - `foundation_seat -> foundation_offering`
  - `systems_seat -> systems_offering`
  - `cohort -> disabled / coming_soon`

## Constraints Held
- Seats, not courses.
- No payment UI.
- No checkout.
- No SRC language.
- No c3 key logic.
- No cohort activation.
- No frontend-authored offering truth.
- No slugs.
- Lifecycle and notification systems remain separate.

## Validation
```json
{
  "dbConnection": "active",
  "measuresSeatOfferingExists": true,
  "recordCount": 3,
  "foundationEnrollmentState": "open",
  "systemsEnrollmentState": "open",
  "cohortEnrollmentState": "coming_soon",
  "reserveSeatDataSource": "public.measures_seat_offering",
  "reserveSeatOptionsSource": "measures_seat_offering",
  "hardcodedMetadataOptionsRemoved": true,
  "foundationRoute": "foundation_offering",
  "systemsRoute": "systems_offering",
  "cohortDisabled": true,
  "invalidOfferingTypeBlocked": true,
  "invalidEnrollmentStateBlocked": true,
  "noPaymentSrcC3Key": true,
  "build_registry": "passed"
}
```

## Files
- docs/oar/measures_registry/oar2_seat_offering_structure_v1.meta.md
- docs/oar/measures_registry/oar1_seat_offering_structure_v1.meta.md
- docs/oar/measures_registry/execute-seat-offering-structure.cjs
- src/measures_registry/MeasuresRegistryRuntime.tsx

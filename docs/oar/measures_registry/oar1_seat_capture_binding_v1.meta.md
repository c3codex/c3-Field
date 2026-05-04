---
document_type: oar1
title: OAR1 Seat Capture Binding
version: v1
status: executed
system: measures_registry
operator: op044
source_oar2: docs/oar/measures_registry/oar2_seat_capture_binding_v1.meta.md
---

OAR1: oar1_seat_capture_binding_v1

## Objective
Bind open seat offering selection to governed server-side capture creation.

## Actions
- Created server route:
  - `/api/create-seat-hold-capture`
- Created DB function:
  - `create_measures_seat_hold_capture(p_email, p_offering_key)`
- The server route calls the DB function using server-side Supabase service credentials.
- The DB function validates:
  - offering exists in `measures_seat_offering`
  - `enrollment_state = open`
  - `hold_target_key` is seated
  - no duplicate active capture exists for the same email and offering
- The DB function inserts into `measures_seat_hold_capture` with:
  - `notification_state = queued`
  - `seat_lifecycle_state = held`
  - `source_encounter_key = hold_target_key`
  - `metadata.source = seat_capture_binding_v1`
- Updated the frontend hold form to call `/api/create-seat-hold-capture`.
- Removed frontend direct insert into `measures_seat_hold_capture`.
- Revoked public direct insert path for `measures_seat_hold_capture`.
- Preserved post-capture routing to the DB-returned `hold_target_key`.

## Constraints Held
- No frontend DB writes.
- No automatic dispatch.
- No lifecycle mutation beyond initial `held`.
- No payment logic.
- No SRC logic.
- No c3 key logic.
- No cohort activation.
- Renderer remains separate from capture logic.

## Validation
```json
{
  "dbConnection": "active",
  "captureCreated": true,
  "captureIdReturned": true,
  "holdTargetKeyReturned": "foundation_seat_hold",
  "offeringKeyStored": "foundation_seat",
  "sourceEncounterMatchesHoldTarget": true,
  "notificationState": "queued",
  "seatLifecycleState": "held",
  "createdAtPopulated": true,
  "metadataSource": "seat_capture_binding_v1",
  "invalidOfferingBlocked": true,
  "closedOfferingBlocked": true,
  "duplicateActiveCaptureBlocked": true,
  "directFrontendDbWriteBlocked": true,
  "correctHoldSurfaceLoads": true,
  "noAutomaticDispatch": true,
  "noPaymentSrcC3Key": true,
  "build_registry": "passed"
}
```

## Files
- docs/oar/measures_registry/oar2_seat_capture_binding_v1.meta.md
- docs/oar/measures_registry/oar1_seat_capture_binding_v1.meta.md
- docs/oar/measures_registry/execute-seat-capture-binding.cjs
- functions/api/create-seat-hold-capture.ts
- src/measures_registry/MeasuresRegistryRuntime.tsx

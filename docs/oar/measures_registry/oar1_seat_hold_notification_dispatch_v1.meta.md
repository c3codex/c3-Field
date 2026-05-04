---
document_type: oar1
title: OAR1 Seat Hold Notification Dispatch
version: v1
status: executed
system: measures_registry
operator: op044
source_oar2: docs/oar/measures_registry/oar2_seat_hold_notification_dispatch_v1.meta.md
---

OAR1: oar1_seat_hold_notification_dispatch_v1

## Objective
Create explicit, traceable seat hold notification dispatch for queued records only.

## Actions
- Created DB-seated notification templates in `measures_seat_hold_notification_template`.
- Created append-only dispatch log `measures_seat_hold_notification_dispatch_log`.
- Updated `measures_seat_hold_notification_review_v1` to include `capture_id`.
- Created controlled dispatch function:
  - `dispatch_measures_seat_hold_notification(capture_id)`
- Wired the operator review surface to show `Dispatch` only for queued rows.

## Templates
- Foundation subject: `Your Foundation Seat has been held`
- Systems subject: `Your Systems Seat has been held`
- Shared body: `Your seat has been recorded. You will be notified when enrollment opens.`

## Constraints Held
- No automatic dispatch.
- No batch sending.
- No public dispatch access.
- No payment link.
- No SRC language.
- No cohort opening.
- No frontend-authored email copy.
- Dispatch acts only on queued records.

## Validation
```json
{
  "dbConnection": "active",
  "queuedRowCanDispatch": true,
  "capturedRowCannotDispatch": true,
  "notifiedRowCannotDispatchAgain": true,
  "notifiedAtSetOnSuccess": true,
  "dispatchLogRows": [
    {
      "dispatch_state": "attempted",
      "provider": "db_template_dispatch",
      "error_message": null
    },
    {
      "dispatch_state": "sent",
      "provider": "db_template_dispatch",
      "error_message": null
    }
  ],
  "templates": [
    {
      "offering_key": "foundation_seat",
      "subject": "Your Foundation Seat has been held",
      "body": "Your seat has been recorded. You will be notified when enrollment opens."
    },
    {
      "offering_key": "systems_seat",
      "subject": "Your Systems Seat has been held",
      "body": "Your seat has been recorded. You will be notified when enrollment opens."
    }
  ],
  "noAutomaticDispatch": true,
  "noPublicAccess": true,
  "noPaymentSrcC3KeyLogic": true,
  "build_registry": "passed"
}
```

## Provider Standing
No external email provider was seated in this OAR. Dispatch is explicit and traceable through DB template dispatch records and state transition.

## Files
- docs/oar/measures_registry/oar2_seat_hold_notification_dispatch_v1.meta.md
- docs/oar/measures_registry/execute-seat-hold-notification-dispatch.cjs
- src/measures_registry/MeasuresRegistryRuntime.tsx

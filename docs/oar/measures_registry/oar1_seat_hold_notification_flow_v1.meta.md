---
document_type: oar1
title: OAR1 Seat Hold Notification Flow
version: v1
status: executed
system: measures_registry
operator: op044
source_oar2: docs/oar/measures_registry/oar2_seat_hold_notification_flow_v1.meta.md
---

OAR1: oar1_seat_hold_notification_flow_v1

## Objective
Prepare notification readiness for `foundation_seat_hold` and `systems_seat_hold` captures without sending email or activating cohort/payment/SRC behavior.

## Actions
- Extended `measures_seat_hold_capture` with:
  - `notification_state`
  - `notified_at`
  - `source_encounter_key`
  - `offering_key`
- Added allowed notification states:
  - `captured`
  - `queued`
  - `notified`
  - `failed`
  - `suppressed`
- Set default `notification_state` to `captured`.
- Backfilled existing hold rows with `source_encounter_key` and `offering_key`.
- Created operator review view `measures_seat_hold_notification_review_v1`.
- Updated hold-surface metadata with DB-driven success messages.
- Updated frontend insert payload to record `offering_key`, `source_encounter_key`, and `notification_state`.

## Constraints Held
- No automatic email sending.
- No external email service integration.
- No SRC logic.
- No c3 key logic.
- No payment logic.
- No cohort activation.

## Validation
```json
{
  "dbConnection": "active",
  "notificationColumnsReady": true,
  "allowedNotificationStates": [
    "captured",
    "queued",
    "notified",
    "failed",
    "suppressed"
  ],
  "defaultNotificationState": "captured",
  "probeInsertCount": 2,
  "operatorReviewRows": [
    {
      "offering_key": "systems_seat",
      "source_encounter_key": "systems_seat_hold",
      "notification_state": "captured"
    },
    {
      "offering_key": "foundation_seat",
      "source_encounter_key": "foundation_seat_hold",
      "notification_state": "captured"
    }
  ],
  "successMessages": [
    {
      "encounter_key": "foundation_seat_hold",
      "offering_key": "foundation_seat",
      "success_message": "Your Foundation Seat has been held.",
      "success_subtext": "You will be notified when enrollment opens."
    },
    {
      "encounter_key": "systems_seat_hold",
      "offering_key": "systems_seat",
      "success_message": "Your Systems Seat has been held.",
      "success_subtext": "You will be notified when enrollment opens."
    }
  ],
  "noAutomaticEmailSent": true,
  "noSrcPaymentC3KeyLogic": true,
  "build_registry": "passed"
}
```

## Operator Review Query
```sql
select
  email,
  offering_key,
  source_encounter_key,
  notification_state,
  created_at
from public.measures_seat_hold_notification_review_v1
order by created_at desc;
```

## Files
- docs/oar/measures_registry/oar2_seat_hold_notification_flow_v1.meta.md
- docs/oar/measures_registry/execute-seat-hold-notification-flow.cjs
- src/measures_registry/MeasuresRegistryRuntime.tsx
- src/index.css

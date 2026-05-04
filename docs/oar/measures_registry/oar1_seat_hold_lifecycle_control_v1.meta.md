---
document_type: oar1
title: OAR1 Seat Hold Lifecycle Control
version: v1
status: executed
system: measures_registry
operator: op044
source_oar2: docs/oar/measures_registry/oar2_seat_hold_lifecycle_control_v1.meta.md
---

OAR1: oar1_seat_hold_lifecycle_control_v1

## Objective
Add DB-governed lifecycle standing to Measures Registry seat holds and require lifecycle approval before operator-triggered notification dispatch.

## Actions
- Extended `measures_seat_hold_capture` with `seat_lifecycle_state`.
- Set default lifecycle standing to `held`.
- Added allowed lifecycle states:
  - `held`
  - `reviewed`
  - `approved`
  - `notified`
  - `suppressed`
  - `expired`
- Created DB transition function:
  - `update_measures_seat_hold_lifecycle_state(p_capture_id, p_next_state)`
- Updated `measures_seat_hold_notification_review_v1` to expose:
  - `email`
  - `offering_key`
  - `notification_state`
  - `seat_lifecycle_state`
  - `created_at`
  - `notified_at`
- Updated operator review metadata with lifecycle meanings, transition rules, and dispatch rule.
- Updated operator surface controls for Mark Reviewed, Approve, Suppress, Expire, and Dispatch.
- Updated server dispatch precondition to require:
  - `notification_state = queued`
  - `seat_lifecycle_state = approved`
- Updated successful provider dispatch to set:
  - `notification_state = notified`
  - `seat_lifecycle_state = notified`

## Allowed Lifecycle Transitions
- `held -> reviewed`
- `held -> suppressed`
- `held -> expired`
- `reviewed -> approved`
- `reviewed -> suppressed`
- `reviewed -> expired`
- `approved -> suppressed`
- `approved -> expired`
- Provider success sets `approved -> notified`.

## Constraints Held
- No automatic lifecycle changes.
- No public lifecycle mutation.
- No automatic email dispatch.
- No batch sending.
- No payment logic.
- No SRC logic.
- No c3 key logic.
- No cohort activation.

## Validation
```json
{
  "dbConnection": "active",
  "seatLifecycleStateExists": true,
  "defaultSeatLifecycleState": "held",
  "invalidTransitionBlocked": true,
  "validHeldToReviewed": "reviewed",
  "validReviewedToApproved": "approved",
  "invalidApprovedToHeldBlocked": true,
  "dispatchRule": {
    "notification_state": "queued",
    "seat_lifecycle_state": "approved"
  },
  "reviewViewColumnsLoad": true,
  "noPublicMutationAccess": true,
  "noAutomaticLifecycleChanges": true,
  "build_registry": "passed"
}
```

## Files
- docs/oar/measures_registry/oar2_seat_hold_lifecycle_control_v1.meta.md
- docs/oar/measures_registry/oar1_seat_hold_lifecycle_control_v1.meta.md
- docs/oar/measures_registry/execute-seat-hold-lifecycle-control.cjs
- functions/api/dispatch-seat-hold-notification.ts
- src/measures_registry/MeasuresRegistryRuntime.tsx

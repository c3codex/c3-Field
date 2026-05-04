---
document_type: oar2
title: OAR2 Seat Hold Notification Flow
version: v1
status: ready_for_cody
system: measures_registry
operator: op044
---

OAR2: seat_hold_notification_flow_v1

OBSERVED
foundation_seat_hold and systems_seat_hold now capture email intent through measures_seat_hold_capture.

ALIGNED
- Codex is authority.
- This is notification readiness only.
- No SRC.
- No c3_key.
- No payment logic.
- No cohort activation.
- No automatic email sending.
- Capture remains lightweight and traceable.

ROUTED

1. Extend capture standing

Use existing table:
measures_seat_hold_capture

Required fields if absent:
- notification_state
- notified_at
- source_encounter_key
- offering_key

2. Notification states

Allowed:
- captured
- queued
- notified
- failed
- suppressed

Default:
captured

3. Source mapping

foundation_seat_hold:
offering_key = foundation_seat

systems_seat_hold:
offering_key = systems_seat

4. Operator review query

Return captured holds with:
- email
- offering_key
- source_encounter_key
- notification_state
- created_at

5. No automatic sending

This OAR does NOT send emails.
It prepares traceable notification readiness only.

6. Success messages

After successful hold, render success from DB metadata:

Foundation:
Your Foundation Seat has been held.

Systems:
Your Systems Seat has been held.

Shared subtext:
You will be notified when enrollment opens.

CODY ROLE

Cody may:
- add notification_state fields if needed
- update hold capture insert payload
- seat success messages in metadata
- create validation query
- write OAR1

Cody may NOT:
- send emails
- integrate external email service
- create payment flow
- create SRC
- create c3_key logic
- auto-open cohort

VALIDATION

- capture insert includes offering_key
- notification_state defaults to captured
- source_encounter_key recorded
- success message renders from DB
- no email is sent
- no SRC/payment/c3_key logic
- build passes

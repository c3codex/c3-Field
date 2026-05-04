---
document_type: oar2
title: OAR2 Seat Hold Notification Dispatch
version: v1
status: ready_for_cody
system: measures_registry
operator: op044
---

OAR2: seat_hold_notification_dispatch_v1

OBSERVED
Seat hold captures can now be reviewed by operator and moved through allowed notification states:
captured -> queued -> notified / failed.

ALIGNED
- Codex is authority.
- Dispatch only acts on queued records.
- No SRC.
- No c3_key.
- No payment.
- No cohort activation.
- No bulk marketing automation.
- Notification state remains DB-governed.
- Email sending must be explicit and traceable.

ROUTED

1. Dispatch source

Use:
public.measures_seat_hold_notification_review_v1

Eligible rows:
notification_state = queued

2. Dispatch action

Create controlled dispatch function:

dispatch_measures_seat_hold_notification(capture_id)

Behavior:
- verify row exists
- verify notification_state = queued
- send one notification
- on success:
  - notification_state = notified
  - notified_at = now()
- on failure:
  - notification_state = failed
  - error captured in metadata or dispatch log

3. Dispatch log

Create append-only log if absent:

measures_seat_hold_notification_dispatch_log

Required fields:
- id
- capture_id
- offering_key
- source_encounter_key
- recipient_email
- dispatch_state
- provider
- provider_message_id
- error_message
- created_at

Allowed dispatch_state:
- attempted
- sent
- failed

4. Email content

DB-seated templates only.

Foundation subject:
Your Foundation Seat has been held

Systems subject:
Your Systems Seat has been held

Shared body:
Your seat has been recorded. You will be notified when enrollment opens.

5. Operator surface behavior

On review surface:
- show Dispatch button only for queued rows
- no dispatch button for captured / suppressed / notified / failed
- failed rows may be returned to queued through existing transition function

6. Constraints

- no automatic dispatch
- no batch sending
- no public access
- no payment link
- no SRC language
- no cohort opening
- no frontend-authored email copy

CODY ROLE

Cody may:
- create dispatch log
- create controlled dispatch function
- wire operator dispatch button
- seat DB email templates
- write OAR1

Cody may NOT:
- auto-send on capture
- send to non-queued rows
- invent email copy
- add payment/SRC/c3_key logic
- expose dispatch publicly

VALIDATION

- queued row can dispatch
- captured row cannot dispatch
- notified row cannot dispatch again
- dispatch log records attempt/result
- notified_at is set on success
- failed state records error
- email content resolves from DB template
- no public dispatch access
- build passes

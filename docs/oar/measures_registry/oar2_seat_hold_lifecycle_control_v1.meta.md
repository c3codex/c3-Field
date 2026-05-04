---
document_type: oar2
title: OAR2 Seat Hold Lifecycle Control
version: v1
status: ready_for_cody
system: measures_registry
operator: op044
---

OAR2: seat_hold_lifecycle_control_v1

OBSERVED
Seat hold notification dispatch is working end-to-end through Resend.
Current state flow supports captured / queued / notified / failed / suppressed.

ALIGNED
- Codex is authority.
- Lifecycle state must remain DB-governed.
- No automation.
- No batch sending.
- No payment.
- No SRC.
- No c3_key.
- No cohort activation.
- Provider execution remains operator-triggered only.

ROUTED

1. Extend lifecycle standing

Table:
measures_seat_hold_capture

Field:
seat_lifecycle_state (text)

Allowed values:
- held
- reviewed
- approved
- notified
- suppressed
- expired

Default:
held

2. Lifecycle meaning

held:
email captured, seat interest recorded

reviewed:
operator has reviewed signal

approved:
ready for notification or next action

notified:
notification sent and logged

suppressed:
intentionally held back

expired:
no longer active

3. Allowed transitions

held -> reviewed
reviewed -> approved
reviewed -> suppressed
approved -> notified
approved -> suppressed
held -> suppressed
held -> expired
reviewed -> expired
approved -> expired
failed notification may return to approved

4. Dispatch rule update

Dispatch may only occur when:

notification_state = queued
seat_lifecycle_state = approved

5. Operator review surface

Show:
- email
- offering_key
- notification_state
- seat_lifecycle_state
- created_at
- notified_at

Actions:
- Mark Reviewed
- Approve
- Suppress
- Expire
- Dispatch

Dispatch button only visible when:
notification_state = queued
seat_lifecycle_state = approved

6. Constraints

- no automatic lifecycle changes
- no public lifecycle mutation
- no frontend-invented states
- no payment/SRC/c3_key logic
- no cohort opening

CODY ROLE

Cody may:
- add lifecycle field if absent
- create DB transition function
- update review view
- update operator surface controls
- enforce dispatch precondition
- write OAR1

Cody may NOT:
- auto-approve
- auto-dispatch
- invent states
- expose lifecycle controls publicly
- introduce payment/SRC/c3_key/cohort logic

VALIDATION

- seat_lifecycle_state exists
- default = held
- allowed transitions enforced
- invalid transitions blocked
- dispatch blocked unless approved + queued
- operator surface shows lifecycle state
- no public mutation access
- build passes

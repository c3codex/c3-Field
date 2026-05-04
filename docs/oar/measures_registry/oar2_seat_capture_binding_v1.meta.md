---
document_type: oar2
title: OAR2 Seat Capture Binding
version: v1
status: ready_for_cody
system: measures_registry
operator: op044
---

OAR2: seat_capture_binding_v1

OBSERVED
- Seat offerings are DB-seated in measures_seat_offering.
- Lifecycle control exists in measures_seat_hold_capture via seat_lifecycle_state.
- Notification system requires:
  notification_state = queued
  seat_lifecycle_state = approved
- Current gap:
  selecting a seat does not consistently create a governed capture row.

ALIGNED
- Codex is authority.
- Capture must be DB-written through server route/function.
- One surface of change: capture creation.
- No SRC.
- No c3_key.
- No payment.
- No cohort activation.
- No automatic dispatch.
- Renderer remains separate from capture logic.

ROUTED

1. Capture contract

Create server-side function/route:

create_measures_seat_hold_capture(p_email, p_offering_key)

Behavior:
- validate offering exists in measures_seat_offering
- validate enrollment_state = open
- resolve hold_target_key from measures_seat_offering
- insert into measures_seat_hold_capture:
  - email = p_email
  - offering_key = p_offering_key
  - source_encounter_key = hold_target_key
  - notification_state = queued
  - seat_lifecycle_state = held
  - metadata.source = seat_capture_binding_v1
  - metadata.offering_key = p_offering_key
  - created_at = now()

Return:
- capture_id
- hold_target_key

2. Frontend binding

On seat selection + email submission:

Frontend must:
- call server route only
- pass:
  - email
  - offering_key

Frontend may NOT:
- insert directly into DB
- set lifecycle state
- set notification state
- invent defaults

3. Post-capture routing

After successful capture:

Route to:
hold_target_key from measures_seat_offering

Examples:
- foundation_seat -> foundation_seat_hold
- systems_seat -> systems_seat_hold

4. Guardrails

- block if enrollment_state != open
- block if offering_key not found
- block duplicate active capture where:
  same email + offering_key + notification_state != notified

5. Constraints

- no automatic dispatch
- no lifecycle mutation beyond default
- no payment logic
- no SRC language
- no c3_key logic
- no cohort activation
- no frontend DB writes

CODY ROLE

Cody may:
- create server route/function
- validate offering via DB
- insert capture row
- return capture_id and hold_target_key
- update frontend to call route
- route user to hold surface
- write OAR1

Cody may NOT:
- write directly from frontend to DB
- auto-approve lifecycle
- auto-dispatch notification
- bypass offering validation
- introduce payment/SRC/c3_key logic

VALIDATION

- selecting seat creates capture row
- offering_key stored correctly
- source_encounter_key matches hold_target_key
- notification_state = queued
- seat_lifecycle_state = held
- created_at populated
- capture_id returned
- hold_target_key returned
- frontend does not write directly to DB
- invalid offering blocked
- closed offering blocked
- duplicate active capture blocked
- correct hold surface loads
- build passes

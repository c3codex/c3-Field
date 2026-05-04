---
document_type: oar2
title: OAR2 Seat Hold Notification Review Surface
version: v1
status: ready_for_cody
system: measures_registry
operator: op044
---

OAR2: seat_hold_notification_review_surface_v1

OBSERVED
Seat holds are captured and prepared for notification through measures_seat_hold_notification_review_v1.

ALIGNED
- Codex is authority.
- Operator review surface only.
- No automatic email sending.
- No payment logic.
- No SRC.
- No c3_key.
- No cohort activation.
- Renderer resolves from metadata.renderer.

ROUTED

1. Registry row:

registry_key: seat_hold_notification_review
parent: measures_registry_runtime
registry_family: spine

metadata:
role: measures_registry_operator_review
source: seat_hold_notification_review_surface_v1

2. Encounter:

encounter_key: seat_hold_notification_review

function_layer: orientation
state_expression: operator_review_surface
renderer: notification_review_surface

3. Data source:

public.measures_seat_hold_notification_review_v1

Fields:
- email
- offering_key
- source_encounter_key
- notification_state
- created_at

4. Allowed transitions:

captured -> queued
captured -> suppressed
queued -> notified
queued -> failed
failed -> queued

5. Constraints:

- operator-only visibility
- no public routing
- no email sending
- no external integrations
- no payment/SRC/c3_key logic
- DB-driven state only

CODY ROLE

Cody may:
- seat registry + encounter
- implement notification_review_surface renderer
- query review view
- enforce allowed transitions
- write OAR1

Cody may NOT:
- send email
- expose surface publicly
- invent states
- introduce conversion logic

VALIDATION

- review surface exists
- data loads from review view
- transitions follow allowed map
- invalid transitions blocked
- not accessible from public flow
- no email sent
- build passes

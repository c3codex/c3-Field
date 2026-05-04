---
document_type: oar2
title: OAR2 Seed Test Capture Row
version: v1
status: ready_for_cody
system: measures_registry
operator: op044
---

OAR2: seed_test_capture_row_v1

OBSERVED
Provider integration is wired, but real dispatch validation requires a queued test row in measures_seat_hold_capture.

ALIGNED
- Codex is authority.
- Test row is validation-only.
- No SRC.
- No c3_key.
- No payment.
- No cohort activation.
- Row must be clearly marked as test data.

ROUTED

1. Create one test capture row

Table:
measures_seat_hold_capture

Required values:
email:
operator-provided test email

offering_key:
foundation_seat

source_encounter_key:
foundation_seat_hold

notification_state:
queued

metadata:
{
  "test": true,
  "source": "seed_test_capture_row_v1",
  "purpose": "provider_dispatch_validation"
}

2. Return capture_id

The inserted row id must be returned for dispatch validation.

3. Cleanup rule

After validation, row may be either:
- retained as dispatch proof if sent/logged
- or marked suppressed if not used

Do not delete sent proof rows.

CODY ROLE

Cody may:
- seed one queued test row
- return capture_id
- write OAR1

Cody may NOT:
- seed multiple rows
- send email automatically
- alter dispatch function
- create production enrollment state
- introduce SRC/payment/c3_key logic

VALIDATION

- one test row created
- notification_state = queued
- offering_key = foundation_seat
- source_encounter_key = foundation_seat_hold
- metadata.test = true
- capture_id returned
- no email sent by this OAR

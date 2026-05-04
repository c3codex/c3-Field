---
document_type: oar2
title: OAR2 Seat Hold Notification Provider Integration
version: v1
status: ready_for_cody
system: measures_registry
operator: op044
---

OAR2: seat_hold_notification_provider_integration_v1

OBSERVED
Resend sender identity is verified.

from:
Measures Registry <connect@measuresregistry.com>

mailed-by:
send.measuresregistry.com

signed-by:
measuresregistry.com

Existing dispatch is DB-governed and currently uses db_template_dispatch.

ALIGNED
- Codex is authority.
- Resend is provider only, not authority.
- Dispatch acts only on queued records.
- Templates remain DB-seated.
- No automatic dispatch.
- No batch sending.
- No SRC.
- No payment.
- No c3_key.
- No cohort activation.
- API key must remain server-side only.

ROUTED

1. Provider configuration

provider: resend
sender: Measures Registry <connect@measuresregistry.com>
reply_to: connect@measuresregistry.com

2. Environment variable

Required server-side env:

RESEND_API_KEY

Do not expose in frontend.
Do not use VITE_ prefix.

3. Dispatch function update

Update:
dispatch_measures_seat_hold_notification(capture_id)

Behavior:
- verify row exists
- verify notification_state = queued
- load DB template by offering_key
- send email through Resend
- on success:
  - notification_state = notified
  - notified_at = now()
  - provider = resend
  - provider_message_id = Resend email id
  - dispatch_state = sent
- on failure:
  - notification_state = failed
  - dispatch_state = failed
  - error_message recorded

4. Dispatch log

Continue using:
measures_seat_hold_notification_dispatch_log

Required provider values:
- resend
- resend_error

5. Operator review surface

Show Dispatch only when:
notification_state = queued

6. Constraints

- no frontend API key
- no public dispatch access
- no automatic send on capture
- no batch send
- no payment links
- no SRC language
- no c3_key logic
- no cohort opening

CODY ROLE

Cody may:
- add Resend server-side dependency
- create server-side dispatch route/function if needed
- update dispatch route/function safely
- update operator review dispatch call
- preserve existing state machine
- write OAR1

Cody may NOT:
- put RESEND_API_KEY in frontend
- expose provider route publicly
- auto-send emails
- send non-queued rows
- alter DB templates without instruction
- introduce marketing automation
- apply this to Measures of Inanna in this OAR

VALIDATION

- queued row sends real Resend email
- provider_message_id recorded
- dispatch_state = sent on success
- notification_state = notified on success
- notified_at set
- non-queued row blocked
- API key not present in frontend bundle
- no automatic sending
- build passes

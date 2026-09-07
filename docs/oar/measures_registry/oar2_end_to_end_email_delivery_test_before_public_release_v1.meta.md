---
document_type: oar2
authority_level: working
document_scope: email_delivery_validation
title: OAR2 - End-to-End Email Delivery Test Before Public Release
status: proposed
version: v1
operator: op044
system: measures_registry
source_oar1: docs/oar/measures_registry/oar1_implement_assessment_and_connect_email_dispatch_functions_v1.meta.md
---

# OAR2 - End-to-End Email Delivery Test Before Public Release

## GOVERNANCE STANDING

This OAR governs end-to-end email delivery validation.

It does not govern the operator.

Purpose is to verify that assessment and connect capture emails can be dispatched through Resend using Cloudflare Pages Functions.

No secrets exposed.

No email is sent except explicit operator-authorized test dispatch.

Nothing is invented.

## OBSERVED

Email dispatch functions now exist:

- functions/api/dispatch-assessment-notification.ts
- functions/api/dispatch-connect-notification.ts

Required environment bindings:

- RESEND_API_KEY
- OPERATOR_DISPATCH_KEY
- SUPABASE_URL
- SUPABASE_SERVICE_ROLE_KEY
- OPERATOR_NOTIFY_EMAIL

Operator confirmed Cloudflare variables are set.

Prior OAR noted local alias requirement:

- SUPABASE_SERVICE_ROLE_KEY may need to mirror SUPABASE_C3_SECRET in .env.local

## REQUIRED PRECHECK

Verify by name only:

1. RESEND_API_KEY exists.
2. OPERATOR_DISPATCH_KEY exists.
3. SUPABASE_URL exists.
4. SUPABASE_SERVICE_ROLE_KEY exists.
5. OPERATOR_NOTIFY_EMAIL exists.
6. No secret values are printed.
7. No VITE_ Resend key exists.
8. No service role key is exposed to frontend.

If any required binding is missing, stop and return HOLD.

## REQUIRED TESTS

### 1. Assessment dispatch test

Create or use a queued test row in:

- measures_iis_eval_gate1_capture

Requirements:

- notification_state = queued
- contact_email = operator-controlled test inbox
- metadata.assessment_result_email_consent = true

Invoke:

- POST /api/dispatch-assessment-notification

Header:

- x-operator-dispatch-key

Body:

- capture_id

Expected:

- function returns 200
- dispatch_state = sent
- notification_state updates to notified
- Resend shows sent email
- recipient receives email
- email does not imply certification
- email does not imply SEAT standing
- email does not imply c3 Key issuance
- email does not imply professional advice

### 2. Assessment consent-held test

Create or use a queued test row with:

- metadata.assessment_result_email_consent = false

Invoke assessment dispatch.

Expected:

- function returns 200
- dispatch_state = held
- notification_state updates to held
- no email sent

### 3. Connect dispatch test

Create or use a queued test row in:

- measures_registry_connect_capture

Requirements:

- notification_state = queued
- email = operator-controlled test inbox

Invoke:

- POST /api/dispatch-connect-notification

Header:

- x-operator-dispatch-key

Body:

- capture_id

Expected:

- function returns 200
- dispatch_state = sent
- notification_state updates to sent
- Resend shows sent email
- OPERATOR_NOTIFY_EMAIL receives email
- reply_to is submitter email
- email does not imply approval, certification, SEAT standing, c3 Key issuance, membership, or tax deductibility

## VALIDATION OUTPUT

Return OAR1 evidence showing:

1. Required bindings present by name only.
2. Secret values not printed.
3. Assessment dispatch sent successfully.
4. Assessment queued row updated to notified.
5. Assessment email received.
6. Consent-held assessment row updated to held.
7. Consent-held test sent no email.
8. Connect dispatch sent successfully.
9. Connect queued row updated to sent.
10. Connect email received by OPERATOR_NOTIFY_EMAIL.
11. Resend dashboard confirms sends.
12. No frontend secret exposure.
13. No prohibited claims in email copy.

## FINAL DISPOSITION

Return one:

- EMAIL_DELIVERY_PASS
- EMAIL_DELIVERY_HOLD
- EMAIL_DELIVERY_FAIL

## NOTCHAZZ FLAGS

Raise NotChazz if:

- secret values are printed
- Resend key is exposed to frontend
- service role key is exposed to frontend
- VITE_RESEND key is introduced
- email sends without operator authorization
- consent-withheld row sends email
- certification is implied
- SEAT standing is implied
- c3 Key issuance is implied
- professional advice is implied
- tax deductibility is implied
- operator is governed instead of the work body

## CLOSE

Verify end-to-end email delivery.

No secrets exposed.

Nothing is invented.

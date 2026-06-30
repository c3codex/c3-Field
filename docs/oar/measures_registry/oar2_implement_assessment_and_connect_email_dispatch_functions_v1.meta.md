---
document_type: oar2
authority_level: working
document_scope: email_delivery_implementation
title: OAR2 - Implement Assessment and Connect Email Dispatch Functions
status: proposed
version: v1
operator: op044
system: measures_registry
source_oar1: docs/oar/measures_registry/oar1_verify_resend_env_binding_and_email_delivery_path_v1.meta.md
---

# OAR2 - Implement Assessment and Connect Email Dispatch Functions

## GOVERNANCE STANDING

This OAR governs server-side email dispatch implementation for assessment and connect captures.

It does not govern the operator.

Purpose is to create Resend-backed Cloudflare Pages Functions for queued assessment and connect notifications.

No secrets exposed.
No frontend email key exposure.
No email sent unless explicitly invoked with operator dispatch key.
Nothing is invented.

## OBSERVED

Resend domain is verified.

Cloudflare Pages environment variables are set:

- RESEND_API_KEY
- OPERATOR_DISPATCH_KEY
- SUPABASE_URL
- SUPABASE_SERVICE_ROLE_KEY

Existing implementation covers only:

- dispatch-seat-hold-notification

Missing implementations:

- measures_iis_eval_gate1_capture notification dispatch
- measures_registry_connect_capture notification dispatch

Both tables currently insert rows with:

- notification_state = queued

but no processor exists.

## REQUIRED ACTIONS

Create Cloudflare Pages Functions:

1. functions/api/dispatch-assessment-notification.ts

Dispatches queued assessment/contact capture rows from:

- measures_iis_eval_gate1_capture

2. functions/api/dispatch-connect-notification.ts

Dispatches queued connect capture rows from:

- measures_registry_connect_capture

Both functions must:

- require POST
- require x-operator-dispatch-key header
- compare against env.OPERATOR_DISPATCH_KEY
- use RESEND_API_KEY server-side only
- use SUPABASE_SERVICE_ROLE_KEY server-side only
- never expose secrets
- accept capture_id in JSON body
- read one queued capture row by id
- send email through Resend
- update notification_state to notified on success
- update notification_state to failed on failure
- write dispatch evidence if an existing log table supports it
- avoid creating new schema unless already present
- return safe JSON only

## EMAIL RECIPIENTS

Assessment dispatch should send to:

- the submitted contact email when assessment_result_email_consent is true
- operator copy may be held unless existing pattern supports it

Connect dispatch should send to:

- operator or configured contact recipient if existing source defines one
- if no operator recipient binding exists, return missing_required and do not invent one

Preferred sender:

- Measures Registry <connect@measuresregistry.com>

If sender must be configured, use a server-side env binding name only:

- MEASURES_REGISTRY_FROM_EMAIL

Do not hardcode sender if existing implementation already defines a sender convention.

## EMAIL CONTENT

Use minimal launch-safe content.

Assessment email:

- acknowledge submission
- include assessment result summary only if already available in capture row
- state results are informational
- include Measures Registry contact email
- do not imply certification
- do not imply SEAT standing
- do not imply c3 Key issuance
- do not imply professional advice

Connect email:

- acknowledge request
- state Measures Registry received the message
- include contact email
- do not imply approval, certification, SEAT, c3 Key, or membership

## PRESERVE

Do not change:

- assessment scoring
- contact capture form
- consent behavior
- legal routes
- publication routes
- payment behavior
- Stripe
- Paragraph
- Buffer

Do not create:

- certification
- SEAT standing
- c3 Key issuance
- DAO membership
- tax-deductible contribution claim

## VALIDATION

Return OAR1 evidence showing:

1. dispatch-assessment-notification function exists.
2. dispatch-connect-notification function exists.
3. Both require POST.
4. Both require x-operator-dispatch-key.
5. Both read RESEND_API_KEY server-side only.
6. Both read SUPABASE_SERVICE_ROLE_KEY server-side only.
7. No VITE_ Resend key introduced.
8. No secrets printed.
9. Assessment dispatch reads measures_iis_eval_gate1_capture.
10. Connect dispatch reads measures_registry_connect_capture.
11. notification_state updates to notified or failed.
12. No email is sent during implementation unless separately authorized.
13. Build passes.
14. Local or production test instructions returned.

## NOTCHAZZ FLAGS

Raise NotChazz if:

- secret values are printed
- Resend key is exposed to frontend
- VITE_RESEND key is introduced
- email sends without operator authorization
- certification is implied
- SEAT standing is implied
- c3 Key issuance is implied
- professional advice is implied
- tax deductibility is implied
- payment behavior changes
- unrelated routes change
- operator is governed instead of the work body

## CLOSE

Implement assessment and connect email dispatch.

Keep dispatch operator-gated.

No secrets exposed.

Nothing is invented.

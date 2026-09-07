---
document_type: oar2
authority_level: working
document_scope: email_delivery_preflight
title: OAR2 - Verify Resend Env Binding and Email Delivery Path
status: proposed
version: v1
operator: op044
system: measures_registry
---

# OAR2 - Verify Resend Env Binding and Email Delivery Path

## GOVERNANCE STANDING

This OAR governs email delivery preflight.

It does not govern the operator.

Purpose is to verify the Resend environment binding and email delivery path before end-to-end launch testing.

No secrets exposed.
No email sent unless explicitly authorized.
No frontend exposure of email keys.
Nothing is invented.

## OBSERVED

Resend domain is verified.

A new Resend API key was created and saved in `.env.local`.

Assessment and connect captures currently queue notification state.

End-to-end email delivery remains unverified.

## REQUIRED ACTIONS

1. Search source for Resend references.
2. Search source for email sending implementation.
3. Search source for expected env binding names.
4. Confirm whether `.env.local` contains the expected binding name.
5. Do not print the key value.
6. Confirm no `VITE_` Resend key exists or is referenced.
7. Confirm whether email is sent by:
   - Supabase edge function
   - server script
   - client route
   - database queue processor
   - absent implementation
8. Confirm where the key must also be placed for production:
   - Supabase secrets
   - Cloudflare Pages environment
   - server runtime
   - other
9. Return the exact next test step.

## VALIDATION

Return OAR1 evidence showing:

1. Required env binding name.
2. `.env.local` binding presence confirmed by name only.
3. Secret value not printed.
4. No frontend `VITE_` Resend exposure.
5. Email sender implementation path exists or is absent.
6. Queued notification path identified.
7. Production binding location identified.
8. Whether end-to-end email test is authorized next.

## NOTCHAZZ FLAGS

Raise NotChazz if:

- secret value is printed
- key is placed in or recommended as VITE variable
- email is sent without authorization
- missing implementation is treated as working
- dashboard verification is treated as app delivery
- operator is governed instead of the work body

## CLOSE

Verify binding before testing.

No secrets exposed.

Nothing is invented.

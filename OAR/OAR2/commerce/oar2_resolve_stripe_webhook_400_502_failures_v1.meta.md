---
document_type: oar2
authority_level: diagnostic_repair
document_scope: stripe_webhook_runtime
title: OAR2 - Resolve Stripe Webhook 400 502 Failures
status: proposed
version: v1
operator: op044
system: measures_registry
---

# OAR2 - Resolve Stripe Webhook 400 502 Failures

## OBJECTIVE

Resolve Stripe webhook delivery failures after production checkout session creation succeeded.

This OAR is scoped only to webhook processing.

Do not change MAP pricing.

Do not create charges.

Do not schedule Buffer.

Do not alter publication/campaign gates.

## OBSERVED

Production checkout now reaches hosted Stripe Checkout.

Webhook destination exists:

https://measuresregistry.com/api/stripe/webhook

Selected events include:

- checkout.session.completed
- checkout.session.expired

Stripe dashboard reports failed deliveries.

Operator observed response statuses:

- 400
- 502

This means Stripe is attempting delivery but the webhook endpoint is rejecting or failing.

## ALIGNED

Commerce proof requires:

Stripe Checkout
-> webhook delivery
-> webhook processing
-> database evidence
-> confirmation email

Do not fake payment rows.

Do not manually insert webhook events.

Do not bypass Stripe.

Webhook evidence must come from Stripe delivery or Stripe CLI replay.

## ROUTED

### 1. Inspect Stripe webhook function

Inspect:

functions/api/stripe/webhook.ts

Return:

- route file
- event types handled
- signature verification logic
- raw body handling
- expected env vars
- DB write path
- email dispatch path
- all return status branches

### 2. Resolve 400 failure

Treat 400 as likely request/signature validation failure unless logs prove otherwise.

Check:

- STRIPE_WEBHOOK_SECRET referenced in code
- exact Cloudflare env var name expected
- whether webhook secret must match Stripe destination signing secret
- whether raw body is used before JSON parsing
- whether Stripe API version/event style affects validation

Do not print secret values.

If code defect exists, propose exact fix.

If config issue likely, return exact dashboard action.

### 3. Resolve 502 failure

Treat 502 as runtime/function failure unless logs prove otherwise.

Check:

- Cloudflare Pages Function logs if available
- thrown exceptions in webhook.ts
- missing SUPABASE_SERVICE_ROLE_KEY
- Supabase write failures
- missing RESEND_API_KEY / OPERATOR_NOTIFY_EMAIL
- unhandled event shape
- response body / status handling

Return first reproducible cause if available.

### 4. Verify env requirements

Create matrix for production Cloudflare Pages secrets:

- STRIPE_WEBHOOK_SECRET
- SUPABASE_URL
- SUPABASE_SERVICE_ROLE_KEY
- RESEND_API_KEY
- OPERATOR_NOTIFY_EMAIL

Also confirm checkout-side secrets remain present:

- STRIPE_SECRET_KEY
- STRIPE_PRICE_PREDEPLOY_MAP
- STRIPE_PRICE_OPTIMIZATION_MAP
- STRIPE_PRICE_REMEDIATION_MAP

Do not expose secret values.

### 5. Inspect Stripe destination configuration

Using dashboard evidence or operator-supplied screenshots, confirm:

- endpoint URL
- destination active
- selected events
- signing secret status if visible
- recent failed delivery status/body if available

If signing secret cannot be verified programmatically, return manual confirmation instructions.

### 6. Replay webhook safely

After suspected fix:

- use Stripe dashboard resend or Stripe CLI trigger/replay where safe
- prefer checkout.session.completed over payment_intent.succeeded for MAP flow
- do not create real charge unless explicitly authorized
- do not insert fake rows manually

Verify:

- stripe_webhook_events row created
- map_payment_events row updated or appropriate blocker recorded
- email dispatch behavior recorded
- endpoint returns 200

### 7. Return next gate

Recommend next OAR:

- Cloudflare secret correction
- webhook code repair
- Stripe dashboard resend validation
- low-cost production payment verification
- MAP post-payment completion repair

Do not execute beyond this webhook scope.

## VALIDATION

Return OAR1 with:

- webhook function inspection
- 400 cause
- 502 cause
- env var matrix
- Stripe destination standing
- fix applied or dashboard action required
- replay result if performed
- DB evidence status
- email evidence status
- remaining blockers

## EXPECTED OAR1

OAR/OAR1/commerce/oar1_resolve_stripe_webhook_400_502_failures_v1.meta.md

## STOP CONDITION

Webhook failure cause is known.

If safe repair is possible, repair is applied and verified.

If dashboard action is required, exact operator action is returned.

No fake payment evidence.

No unrelated launch gates changed.

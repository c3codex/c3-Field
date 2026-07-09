---
document_type: oar2
authority_level: diagnostic
document_scope: stripe_checkout_discovery
title: OAR2 - Discover Stripe Checkout Blocker and Verification Path
status: proposed
version: v1
operator: op044
system: measures_registry
---

# OAR2 - Discover Stripe Checkout Blocker and Verification Path

## OBJECTIVE

Identify the exact first blocker in the live MAP payment path.

Do not fix yet unless the fix is read-only or purely diagnostic.

Do not create charges.

Do not require the operator to spend $333.

This is discovery first.

## OBSERVED

Operator QA can reach the MAP payment screen.

When the payment button is clicked, the UI reports that the payment function is not configured or similar.

Prior validation confirmed:

- Stripe webhook events: 0 rows
- no real processor execution
- payment standing rows are validation/probe only
- Stripe remains the final runtime launch gate

## ALIGNED

Commerce must prove the full live path:

Assessment
-> MAP
-> Checkout request
-> Stripe Checkout Session
-> Payment
-> Webhook
-> Database evidence
-> Confirmation email
-> MAP continuation

Do not fake payment evidence.

Do not manually insert payment rows.

Do not bypass Stripe.

A low-cost Launch Verification product may be used later if approved by operator.

## ROUTED

### 1. Trace the live payment button

Inspect the frontend/payment component used on the MAP payment page.

Find:

- component file
- button handler
- called function or endpoint
- expected env vars
- fallback message source
- exact condition that produces "payment function not configured"

Return the exact file and line references.

### 2. Trace backend checkout function

Identify whether checkout is expected to be handled by:

- Supabase Edge Function
- Cloudflare Function / Pages Function
- API route
- serverless endpoint
- disabled placeholder

Return:

- function name
- file path
- deployment target
- required secrets
- expected request payload
- expected response payload

### 3. Inspect environment expectations

Identify required keys without exposing secret values.

Check for references to:

- STRIPE_SECRET_KEY
- STRIPE_WEBHOOK_SECRET
- Stripe price IDs
- success_url
- cancel_url
- service role key
- any Cloudflare / Supabase env names

Return whether each is:

- referenced in code
- present in local env example
- expected in Cloudflare
- expected in Supabase
- missing or unknown

Do not print secret values.

### 4. Inspect DB commerce standing

Read current commerce/payment tables relevant to MAP.

Check at minimum:

- c3_payment_standing
- stripe_webhook_events
- any MAP/MARBLE/MAP commerce tables
- system_process_registry commerce process rows

Return:

- configured products/prices
- processor_execution state
- validation_probe rows
- current standing
- stale terms or conflicting rows

### 5. Identify the first hard blocker

Classify the blocker as one of:

- frontend placeholder not wired
- missing backend function
- backend function not deployed
- missing env variable
- missing Stripe product/price ID
- webhook endpoint missing
- webhook secret missing
- database write blocked
- email dispatch blocked
- unknown / requires dashboard verification

Return the first blocker only, then secondary blockers.

### 6. Evaluate low-cost verification path

Determine whether production checkout can safely use a temporary Launch Verification product/price.

Do not create it unless explicitly authorized later.

Return:

- whether the code supports price substitution
- where price IDs are sourced
- whether a $1 verification price can use the exact same checkout/webhook/database/email path
- what must be restored after verification
- risks

### 7. Recommend next OAR

Recommend one of:

- configure missing env vars
- deploy missing checkout function
- create Launch Verification product/price
- wire frontend to backend checkout function
- configure Stripe webhook endpoint
- run live low-cost verification
- repair DB/email post-payment handling

Do not execute the recommendation.

## VALIDATION

Return OAR1 with:

- exact payment button source
- exact blocker message source
- checkout backend status
- env var matrix
- DB commerce standing
- first hard blocker
- secondary blockers
- low-cost verification feasibility
- recommended next OAR

## EXPECTED OAR1

OAR/OAR1/commerce/oar1_discover_stripe_checkout_blocker_and_verification_path_v1.meta.md

## STOP CONDITION

We know exactly why the payment button says the payment function is not configured.

No money spent.

No fake payment rows.

No Stripe write actions.

No launch gate opened.

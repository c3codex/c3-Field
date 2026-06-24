# OAR2 — Stripe MAP Product Price IDs and Webhook Idempotency Verification
## Measures Registry MAP Launch v1
## Timestamp: 9:47 AM
## Operator: op044
## System: Measures Registry
## Standing: MAP launch preparation / SEAT-stripped public boundary

---

## OBJECTIVE

Seat Stripe Product and Price IDs for the public Measures Registry MAP launch while preserving the SEAT-stripped public boundary.

Verify that Stripe webhook handling is idempotent, safe against duplicate delivery, and does not create duplicated MAP access, duplicated records, duplicated emails, duplicated client files, or premature SEAT/c3 Field standing.

---

## CORE LAUNCH BOUNDARY

Stripe may support MAP purchase/request flow only.

Public Stripe-facing products must be MAP products, not SEAT contracts.

MAP remains:

> Measure / Audit / Prepare

No Stripe product, price, checkout session, success page, webhook event, metadata field, or email may expose or imply:

- SEAT activation
- Direct / Mapped / Federated SEAT
- c3 Key issuance
- Codexstone conversion
- Registry certification
- DAO standing
- governance authority
- registered system status
- payment-gated c3 Field access

---

## APPROVED MAP PRODUCTS

Create or verify Stripe Products and Prices for:

### 1. MAP Foundational Review

Public product name:

> MAP Foundational Review

Amount:

> $333

Use case:

> Early or informal AI activity requiring initial operational structure.

Metadata recommendation:

    {
      "system": "measures_registry",
      "offer_type": "map",
      "map_pathway": "foundational",
      "public_boundary": "seat_stripped",
      "creates_seat": "false",
      "creates_c3_key": "false",
      "creates_certification": "false"
    }

---

### 2. MAP Optimization Review

Public product name:

> MAP Optimization Review

Amount:

> $777

Use case:

> Existing AI activity across people, tools, or processes requiring alignment and operational review.

Metadata recommendation:

    {
      "system": "measures_registry",
      "offer_type": "map",
      "map_pathway": "optimization",
      "public_boundary": "seat_stripped",
      "creates_seat": "false",
      "creates_c3_key": "false",
      "creates_certification": "false"
    }

---

### 3. MAP Remediation Review

Public product name:

> MAP Remediation Review

Amount:

> $999

Use case:

> Fragmented, inconsistent, exposed, or higher-risk AI operations requiring governed correction preparation.

Metadata recommendation:

    {
      "system": "measures_registry",
      "offer_type": "map",
      "map_pathway": "remediation",
      "public_boundary": "seat_stripped",
      "creates_seat": "false",
      "creates_c3_key": "false",
      "creates_certification": "false"
    }

---

## REQUIRED ENVIRONMENT VARIABLES

Seat the live Stripe IDs in `.env` / deployment environment only after verification.

Required variables:

    STRIPE_SECRET_KEY=
    STRIPE_WEBHOOK_SECRET=

    STRIPE_MAP_FOUNDATIONAL_PRODUCT_ID=
    STRIPE_MAP_FOUNDATIONAL_PRICE_ID=

    STRIPE_MAP_OPTIMIZATION_PRODUCT_ID=
    STRIPE_MAP_OPTIMIZATION_PRICE_ID=

    STRIPE_MAP_REMEDIATION_PRODUCT_ID=
    STRIPE_MAP_REMEDIATION_PRICE_ID=

Optional but recommended:

    STRIPE_SUCCESS_URL=
    STRIPE_CANCEL_URL=
    MEASURES_REGISTRY_MAP_NOTIFY_EMAIL=

Do not add:

    STRIPE_SEAT_PRICE_ID=
    STRIPE_DIRECT_PRICE_ID=
    STRIPE_MAPPED_PRICE_ID=
    STRIPE_FEDERATED_PRICE_ID=
    C3_KEY_PRICE_ID=
    CERTIFICATION_PRICE_ID=

---

## CHECKOUT SESSION REQUIREMENTS

Checkout session creation must:

1. Accept only approved MAP pathway keys:
   - foundational
   - optimization
   - remediation

2. Resolve the Stripe Price ID from server-side environment variables.

3. Never trust frontend-submitted price IDs.

4. Include metadata sufficient for webhook handling.

Required checkout metadata:

    {
      "system": "measures_registry",
      "offer_type": "map",
      "map_pathway": "<foundational|optimization|remediation>",
      "assessment_result_id": "<if available>",
      "contact_email": "<if available>",
      "creates_seat": "false",
      "creates_c3_key": "false",
      "creates_certification": "false"
    }

5. Use Stripe Checkout in payment mode.

6. Success URL should return to a MAP confirmation surface, not SEAT.

Approved success language:

> MAP Review Request Received

Approved success copy:

> Your MAP review has been received. Measures Registry will use this standing to prepare the next review step. This does not create SEAT, certification, registration, c3 Key, or governance standing.

---

## WEBHOOK EVENTS TO HANDLE

Required event:

    checkout.session.completed

Optional but recommended:

    payment_intent.succeeded
    payment_intent.payment_failed
    checkout.session.expired

Primary fulfillment should happen on:

    checkout.session.completed

Do not fulfill MAP access from frontend redirect alone.

---

## IDEMPOTENCY REQUIREMENTS

Webhook processing must be idempotent.

Stripe may deliver the same event more than once. The system must safely ignore duplicates.

Required behavior:

1. Store Stripe event ID before or during processing.
2. If the event ID already exists, return success without repeating fulfillment.
3. Fulfillment must not duplicate:
   - MAP intake record
   - client file
   - notification email
   - assessment/report record
   - OAR queue entry
   - execution evidence
   - access token
   - scheduling link issue
4. Partial failure must be recoverable without creating duplicate records.

Recommended table or registry record:

    stripe_webhook_events

Minimum columns:

    id uuid primary key default gen_random_uuid(),
    stripe_event_id text unique not null,
    event_type text not null,
    checkout_session_id text,
    payment_intent_id text,
    status text not null default 'received',
    processed_at timestamptz,
    created_at timestamptz not null default now(),
    error text,
    metadata jsonb

If an existing system event/evidence table is used instead, it must still enforce uniqueness on stripe_event_id.

---

## WEBHOOK PROCESSING SHAPE

Pseudo-flow:

    1. Receive raw Stripe webhook body.
    2. Verify Stripe signature using STRIPE_WEBHOOK_SECRET.
    3. Extract Stripe event ID.
    4. Insert stripe_event_id into idempotency table with unique constraint.
    5. If duplicate conflict:
       - return 200
       - do not process again
    6. If event type is checkout.session.completed:
       - verify payment_status is paid
       - read metadata
       - verify offer_type = map
       - verify creates_seat = false
       - verify map_pathway is approved
       - create or update MAP intake standing
       - send exactly one notification
       - record fulfillment evidence
    7. Mark webhook event processed.
    8. Return 200.

---

## DATABASE / REGISTRY REQUIREMENTS

MAP payment may create or update MAP launch records only.

Allowed records:

- MAP intake
- MAP payment confirmation
- MAP review request
- assessment result linkage
- operator notification
- client scheduling preparation
- OAR evidence record

Disallowed records:

- SEAT activation
- SEAT contract
- c3 Key
- certification
- registry seal
- DAO membership
- Codexstone conversion
- c3 Field access
- system registration standing

---

## EMAIL / NOTIFICATION REQUIREMENTS

Payment confirmation email must say MAP only.

Approved subject:

> MAP Review Received

Approved body direction:

> Your MAP review request has been received. MAP measures current standing, audits visible runtime behavior, and prepares structured recommendations for governed correction.

Required boundary line:

> This MAP review does not create SEAT, certification, registration, c3 Key, DAO, or governance standing.

Operator notification should include:

- customer email
- MAP pathway
- Stripe checkout session ID
- Stripe payment intent ID
- assessment result ID if available
- webhook event ID
- timestamp

---

## SECURITY REQUIREMENTS

Do not:

- expose Stripe secret keys in frontend
- accept frontend-submitted price IDs
- process unsigned webhooks
- fulfill from success URL alone
- create access before verified payment
- create SEAT or c3 standing from MAP purchase
- retry fulfillment without idempotency check

Must:

- verify webhook signature
- use server-side price mapping
- log duplicate webhook suppression
- preserve DB-first standing
- return safe 200 response for already-processed duplicate Stripe events

---

## TESTING REQUIREMENTS

Executor must verify:

### Product / Price ID Verification

Return:

- Product IDs
- Price IDs
- product names
- amount
- currency
- active status
- live/test mode clearly identified

### Checkout Verification

Test all three MAP pathways:

- Foundational Review — $333
- Optimization Review — $777
- Remediation Review — $999

Confirm each creates a valid Checkout Session using server-side Price ID resolution.

### Webhook Verification

Test:

1. Valid checkout.session.completed
2. Duplicate delivery of same Stripe event ID
3. Invalid signature
4. Expired checkout session
5. Missing or invalid metadata
6. Unapproved pathway key
7. Payment not paid

Expected duplicate behavior:

> Duplicate event returns 200 and does not repeat fulfillment.

---

## SEARCH / STRIP REQUIREMENT

Search public runtime for forbidden terms in Stripe/MAP surfaces.

Search terms:

    SEAT
    System Environment Alignment Threshold
    Direct SEAT
    Mapped SEAT
    Federated SEAT
    c3 Key
    certification
    registered system
    Codexstone
    DAO
    registry seal
    governance standing

Any remaining use must be internal-only and reported.

---

## ACCEPTANCE CRITERIA

This OAR2 is complete when:

1. Stripe MAP Product IDs and Price IDs are verified.
2. Environment variables are seated for all three MAP products.
3. Checkout sessions use server-side price resolution only.
4. Public Stripe copy says MAP only.
5. No SEAT/c3/certification/DAO/Codexstone language appears in public MAP payment flow.
6. Webhook signature verification is active.
7. Webhook event ID idempotency is enforced with a unique constraint or equivalent registry protection.
8. Duplicate webhook delivery does not duplicate fulfillment.
9. MAP intake/payment confirmation is created exactly once.
10. Operator notification is sent exactly once.
11. Executor returns evidence of test results and changed files.
12. No SEAT standing is created by Stripe payment.

---

## EXECUTOR RETURN REQUIRED

Return:

1. Files changed
2. Env variables added/verified
3. Stripe Product IDs
4. Stripe Price IDs
5. Webhook endpoint path
6. Webhook secret variable confirmed
7. Idempotency storage location/table
8. Unique constraint confirmation
9. Test results for all three MAP products
10. Duplicate webhook test result
11. Invalid signature test result
12. Remaining internal-only SEAT references, if any
13. Public runtime search evidence for forbidden terms
14. Confirmation that MAP payment creates no SEAT/c3/certification/DAO standing

---

## DO NOT MUTATE

Do not change:

- public assessment scoring logic
- result category logic
- visual contracts
- media mappings
- landing hero
- unDrifted copy
- chamber structure
- Codexstone standing
- c3 Field architecture
- SEAT internal architecture
- DAO architecture

Only seat MAP Stripe products/prices and verify webhook idempotency for MAP launch.

---

## CLOSEOUT NAME

Expected OAR1 closeout:

> OAR1 — Stripe MAP Product Price IDs and Webhook Idempotency Verified for Measures Registry MAP Launch v1

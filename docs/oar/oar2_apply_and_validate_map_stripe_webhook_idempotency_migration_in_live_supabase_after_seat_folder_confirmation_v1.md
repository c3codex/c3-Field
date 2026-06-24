# OAR2 — Apply and Validate MAP Stripe Webhook Idempotency Migration in Live Supabase After SEAT Folder Confirmation v1

## Measures Registry / MAP Stripe / Live Supabase Migration

## Operator
op044

## System
Measures Registry

## Source Closeout
OAR1 — SEAT Folder Boundary Confirmed Before Live MAP Stripe DB Migration v1

## Standing
SEAT review-containment confirmed / MAP Stripe source boundary confirmed / public MAP payment boundary clear / live migration not yet authorized / privileged preflight required

---

## OBJECTIVE

Apply and validate the MAP Stripe webhook idempotency migration in live Supabase only after privileged live preflight confirms the current schema state and confirms that execution is authorized.

The prior OAR1 amendment confirmed:

- SEAT folder is confirmed as the review-containment boundary.
- MAP Stripe source boundary is confirmed.
- Public MAP payment boundary is clear.
- No relocation is required.
- Live migration was not authorized or executed.
- A separate live migration OAR2 may now be opened.

However, the prior live read-only preflight returned HTTP 401 unauthorized for both map_c2_circuit and stripe_webhook_events.

Therefore, this OAR2 must first restore or use properly authorized privileged read access, reverify live schema standing, and only then decide whether SQL execution may proceed.

---

## HARD GATE

Do not apply SQL until privileged preflight succeeds.

The executor must not infer live schema state from local files, prior tests, or expected migration shape.

Live schema must be checked with authorized Supabase access before mutation.

If privileged preflight fails again, stop and return blocked standing.

---

## SOURCE MIGRATION

Pending migration:

supabase/migrations/202606200001_map_stripe_price_ids_and_webhook_idempotency.sql

Expected MAP-only objects:

- public.map_c2_circuit
- public.stripe_webhook_events
- public.claim_stripe_webhook_event

Expected security posture:

- webhook claim function executable by service_role only
- execution revoked from public
- execution revoked from anon
- execution revoked from authenticated

Expected idempotency posture:

- stripe_event_id uniqueness enforced
- duplicate Stripe events return safe success without repeating fulfillment
- failed processing remains retryable without duplicate fulfillment

---

## PRECONDITION CONFIRMATIONS

Before any live mutation, confirm:

1. SEAT folder boundary is confirmed from prior closeout.
2. MAP Stripe source boundary is confirmed.
3. Public MAP payment boundary is clear.
4. Pending migration remains unchanged or differences are reported.
5. Live Supabase credential has privileged read access.
6. Live schema standing is reverified.
7. No live mutation has occurred before the authorization decision.

---

## PRIVILEGED LIVE PREFLIGHT

Executor must perform privileged read-only live checks before applying the migration.

Check:

1. Whether public.map_c2_circuit exists.
2. Whether MAP Stripe price/product fields already exist.
3. Whether public.stripe_webhook_events exists.
4. Whether unique constraint or unique index on stripe_event_id already exists.
5. Whether public.claim_stripe_webhook_event exists.
6. Whether function execute permissions are already restricted.
7. Whether existing rows or prior partial migration artifacts exist.
8. Whether any existing live object conflicts with the pending migration.

Required result categories:

- not_present_safe_to_apply
- partially_present_requires_reconcile
- already_present_validate_only
- blocked_access_or_conflict

If HTTP 401, permission denied, missing credential, or equivalent authorization failure occurs, return:

blocked_access_or_conflict

Do not apply SQL.

---

## AUTHORIZATION DECISION

After privileged preflight, executor must return one of the following decisions.

### Decision A — Apply Migration

Use only if:

- privileged preflight succeeds
- required objects are absent or safely migratable
- no conflicting partial migration exists
- pending migration is still MAP-only
- no SEAT/c3/certification/DAO/Codexstone/registry/c3 Field access standing is created

Then apply the migration.

### Decision B — Validate Existing Migration

Use if:

- privileged preflight shows the migration is already present
- table/function/constraint permissions are correct
- no SQL mutation is required

Then validate only and return evidence.

### Decision C — Reconcile Required

Use if:

- partial objects exist
- permissions are incomplete
- table exists without required constraint
- function exists with incorrect grants
- product/price fields are partially present

Do not improvise destructive changes. Return reconcile plan.

### Decision D — Blocked

Use if:

- privileged live read fails
- live schema cannot be verified
- credentials are insufficient
- migration conflicts are unclear
- applying SQL could create drift

Do not apply SQL.

---

## MIGRATION APPLICATION RULES

If and only if Decision A is reached, apply the live Supabase migration.

Apply:

supabase/migrations/202606200001_map_stripe_price_ids_and_webhook_idempotency.sql

Required post-apply validation:

1. public.stripe_webhook_events exists.
2. stripe_event_id uniqueness exists.
3. public.claim_stripe_webhook_event exists.
4. Function execute permission is granted to service_role only.
5. Function execute permission is revoked from public.
6. Function execute permission is revoked from anon.
7. Function execute permission is revoked from authenticated.
8. MAP Stripe product/price fields exist where expected.
9. Existing MAP C2 circuit rows are not corrupted.
10. No SEAT/c3/certification/DAO/Codexstone/registry/c3 Field access tables or rows are created.

---

## VALIDATION AFTER MIGRATION

After successful application or existing-migration validation, confirm:

- MAP-only table/function names.
- MAP-only product/price fields.
- webhook idempotency table present.
- unique constraint/index present.
- claim function present.
- service role execute posture correct.
- anon/authenticated/public execute blocked.
- no public runtime SEAT exposure introduced.
- no live Stripe checkout activation performed unless separately authorized.
- no live webhook activation performed unless separately authorized.
- no MAP payment fulfillment executed.
- no payment confirmation emails sent.
- no operator notifications sent.
- no live customer/intake records created by this migration.

---

## OPTIONAL NON-MUTATING WEBHOOK SHAPE CHECK

Executor may perform non-mutating endpoint readiness checks only if they do not activate fulfillment and do not create live payment records.

Do not create live Stripe checkout sessions.

Do not send live Stripe webhook events that write rows unless explicitly authorized by this OAR after migration validation.

If test webhook behavior is needed, use a separate OAR2 after the DB migration is validated.

---

## LIVE ACTIVATION HOLD

This OAR2 does not authorize:

- live Stripe checkout activation
- live Stripe webhook endpoint activation
- live customer payment
- live MAP payment fulfillment
- live MAP intake creation
- payment confirmation email
- operator notification
- SEAT registration
- c3 Key standing
- certification
- DAO standing
- Codexstone conversion
- registry standing
- c3 Field access

This OAR2 authorizes only privileged preflight, possible migration application, and post-migration validation.

---

## PUBLIC BOUNDARY REQUIREMENT

Confirm public MAP payment remains boundary-safe.

Visible public runtime must not expose:

- SEAT
- System Environment Alignment Threshold
- Direct SEAT
- Mapped SEAT
- Federated SEAT
- c3 Key
- registered system
- Codexstone
- DAO
- registry seal

Allowed negative-boundary language may include:

> MAP review prepares operational findings and next-step recommendations. It does not create certification, registration, governance standing, or system authority.

If certification or governance standing appear only inside the approved negative-boundary sentence, report as allowed negative-boundary usage, not an authority claim.

---

## DISALLOWED WORK

Do not:

- bypass privileged preflight
- apply SQL after a 401/unauthorized result
- invent live schema standing from local files
- use fallback credentials not explicitly available to executor
- activate Stripe checkout
- activate live webhook fulfillment
- send test payments
- send payment confirmation emails
- create MAP intake records through webhook fulfillment
- create SEAT/c3/certification/DAO/Codexstone/registry/c3 Field access records
- claim live payment readiness unless migration and post-apply validation pass

---

## ACCEPTANCE CRITERIA

This OAR2 is complete when:

1. Privileged live preflight is attempted.
2. If preflight fails, no migration is applied and blocked standing is returned.
3. If preflight succeeds, live schema standing is documented.
4. Migration is either applied, validated as already present, or held for reconcile.
5. stripe_webhook_events standing is verified.
6. stripe_event_id uniqueness standing is verified.
7. claim_stripe_webhook_event standing is verified.
8. Function execution permissions are verified.
9. MAP Stripe price/product DB field standing is verified.
10. No SEAT/c3/certification/DAO/Codexstone/registry/c3 Field standing is created.
11. No live Stripe checkout, webhook fulfillment, payment, intake, email, or notification activation occurs.
12. Executor returns next-step recommendation.

---

## EXECUTOR RETURN REQUIRED

Return:

1. Files reviewed.
2. Migration hash or changed/unchanged confirmation.
3. Credential/preflight status.
4. Live schema preflight result.
5. Authorization decision: Apply / Validate Existing / Reconcile / Blocked.
6. If applied: migration execution evidence.
7. If not applied: reason held.
8. map_c2_circuit live standing.
9. stripe_webhook_events live standing.
10. stripe_event_id unique constraint/index standing.
11. claim_stripe_webhook_event live standing.
12. Function grant/revoke validation.
13. Product/price field standing.
14. Public runtime boundary search result.
15. Confirmation no live Stripe activation occurred.
16. Confirmation no webhook fulfillment activation occurred.
17. Confirmation no payment/intake/email/notification records were created by this OAR.
18. Confirmation no downstream authority was created.
19. Recommended next OAR2.

---

## EXPECTED CLOSEOUT IF SUCCESSFUL

OAR1 — MAP Stripe Webhook Idempotency Migration Applied and Validated in Live Supabase After SEAT Folder Confirmation v1

## EXPECTED CLOSEOUT IF BLOCKED

OAR1 — MAP Stripe Live Supabase Migration Held Pending Privileged Preflight Access v1

## EXPECTED NEXT OAR2 AFTER SUCCESS

OAR2 — Validate MAP Stripe Checkout and Webhook Runtime Without Public SEAT Exposure v1

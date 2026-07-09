---
document_type: oar1
authority_level: diagnostic_repair
document_scope: stripe_webhook_runtime
title: OAR1 - Resolve Stripe Webhook 400 502 Failures
closes: OAR/OAR2/commerce/oar2_resolve_stripe_webhook_400_502_failures_v1.meta.md
operator: op044
system: measures_registry
date: 2026-07-09
---

# OAR1: Resolve Stripe Webhook 400 502 Failures

## Summary

`stripe_webhook_events` has **zero rows, ever** — not intermittent failure, total failure. Every Stripe delivery attempt to `https://measuresregistry.com/api/stripe/webhook` has failed before the function's idempotency claim (its first DB write) ever executes. One real checkout session exists (`cs_live_a1sEmtH1ezg9HOLQjuBBQyq0UBeoPEY5EqtlQLggRaL0Rzy2wbBtzaI2iY`, created 2026-07-09 00:44:45 UTC) and is still stuck at `payment_status: checkout_created` / `scheduling_state: held` — proof that checkout creation now works (per this OAR2's OBSERVED) but the webhook leg has never once completed for it.

One genuine code defect was found and fixed (signature verification only checked the *last* `v1=` value when Stripe sends multiple during signing-secret rotation) — safe, narrow, covered by a new passing test. It is **not** the primary explanation for a 100%-failure rate, since a non-rotating secret only ever sends one `v1=` value. The dominant hypothesis for the 400s remains a `STRIPE_WEBHOOK_SECRET` mismatch between Cloudflare Pages production and the live Stripe destination's actual signing secret; the 502s cannot originate from this code at all (it never returns 502) and must be a Cloudflare edge/runtime failure, which is unverifiable from this environment. No fake rows created. No Stripe writes performed. No replay executed — see Gate below.

---

## 1. Webhook Function Inspection (ROUTED §1)

`functions/api/stripe/webhook.ts` — Cloudflare Pages Function, `onRequestPost`.

- **Event types handled:** `checkout.session.completed`, `checkout.session.expired`, `payment_intent.payment_failed`. All others return `200 { received: true, ignored: <type> }` without side effects.
- **Signature verification:** manual HMAC-SHA256 over `${timestamp}.${rawBody}` using `STRIPE_WEBHOOK_SECRET` as the raw key, matching Stripe's documented scheme exactly (`webhook.ts:79-111`). Rejects events older than 5 minutes.
- **Raw body handling:** `await request.text()` read once, before JSON parsing — correct order (`webhook.ts:328`).
- **Expected env vars:** `STRIPE_WEBHOOK_SECRET`, `SUPABASE_URL`/`VITE_SUPABASE_URL`, `SUPABASE_SERVICE_ROLE_KEY`, `RESEND_API_KEY`, `OPERATOR_NOTIFY_EMAIL`.
- **DB write path:** `rpc/claim_stripe_webhook_event` (idempotency claim) → per-event-type `PATCH map_payment_events` → `PATCH stripe_webhook_events` (mark processed/failed) → dispatch-log inserts.
- **Email dispatch path:** `sendGovernedNotification()` → `measures_notification_template` lookup → Resend API, gated by `measures_notification_dispatch_log` idempotency.
- **Return status branches:** `503` (no webhook secret configured), `400` (missing signature header / bad signature / unparseable JSON), `200` (received/ignored/processed/duplicate), `500` (idempotency-claim failure or processing exception, both caught). **The function itself never returns 502 anywhere in its code.**

## 2. 400 Cause (ROUTED §2)

Confirmed **not** a raw-body or timestamp-parsing defect — `webhook.test.ts`'s existing signed-request helper uses the identical algorithm and round-trips correctly (all 7 pre-existing tests pass).

**Defect found and fixed:** the signature-header parser folded all `key=value` comma-separated parts into a plain object, so when a header contains two `v1=` entries (Stripe's documented behavior during signing-secret rotation — old and new secret both sent momentarily), the second silently overwrote the first and only the last was checked. Fixed to collect all `v1=` values and accept a match against any of them (`webhook.ts:79-111`). New regression test `accepts a valid v1 signature alongside an unrelated rotation-window signature` added and passing.

**Primary hypothesis (config, not code):** `stripe_webhook_events` has zero rows total, meaning *every* delivery Stripe has ever sent has failed signature verification (or crashed pre-verification) — not a rotation-window edge case, which would only affect a brief window around a secret change. The far more likely explanation for a 100%-failure rate is that the `STRIPE_WEBHOOK_SECRET` value currently set in Cloudflare Pages production does not match the signing secret Stripe actually uses for the live `/api/stripe/webhook` destination — e.g. copied with trailing whitespace, copied from the wrong (test-mode) destination, or set before the destination was finalized and never refreshed. This cannot be confirmed or ruled out from this environment (no Cloudflare credential, no Stripe key present locally — confirmed via `.env`).

**Dashboard action required:** In Stripe Dashboard → Developers → Webhooks → select the `measuresregistry.com/api/stripe/webhook` destination → reveal and copy the **Signing secret** fresh (do not reuse an old copy). In Cloudflare Pages → project → Settings → Environment variables (Production) → set `STRIPE_WEBHOOK_SECRET` to that exact value, no leading/trailing whitespace → **trigger a new deployment** (Cloudflare Pages Functions only pick up env var changes on the next build/deploy, not live).

## 3. 502 Cause (ROUTED §3)

Cannot be produced by this code — confirmed by reading every `return` in `onRequestPost`; only `503`, `400`, `200`, `500` are ever returned. A 502 reaching Stripe's dashboard means the request failed **before or outside** this function's own response logic — at Cloudflare's edge/proxy layer. No Cloudflare Pages Functions real-time logs or Worker exception logs were reachable from this environment: `npx wrangler` is not installed and no `~/.wrangler` auth state exists (confirmed), so nothing beyond static code review could be checked for this specific failure mode.

Ranked candidates, unverifiable from here:
1. **Cloudflare Bot Fight Mode / Super Bot Fight Mode / Security Level** treating Stripe's non-browser webhook sender as a bot and serving a challenge instead of routing to the Function — a very common cause of exactly this symptom (mixed 400/502, zero app-level evidence).
2. Worker uncaught exception or CPU/wall-time limit — the `checkout.session.completed` path chains up to ~10 sequential subrequests (claim → patch → select → 2× alreadySent → 2× loadTemplate → dispatch-log inserts → 2× Resend calls); on a constrained plan this chain could exceed a limit and get killed mid-flight.
3. Deployment/routing mismatch if more than one Cloudflare Pages project could serve this domain (not confirmed either way from the repo — no `wrangler.toml`, dashboard-managed deployment per the prior OAR1 in this chain).

**Dashboard action required:** Cloudflare dashboard → Security → Events, filtered to `/api/stripe/webhook`, to check for WAF/Bot challenges on Stripe's outbound IPs; and Cloudflare Pages → project → Functions real-time logs (or `wrangler pages deployment tail` once authenticated) captured live while triggering a dashboard "Resend" on a failed delivery, to see the actual thrown error if any.

## 4. Production Env Var Matrix (ROUTED §4) — no values printed

| Variable | Referenced in code | Confirmed in Cloudflare Pages production |
|---|---|---|
| `STRIPE_WEBHOOK_SECRET` | `webhook.ts:319` | Unknown — no Cloudflare credential in this environment. Inferred *present* (401/503 not among observed statuses) but value correctness unconfirmed. |
| `SUPABASE_URL` | `webhook.ts` `supabaseFetch` | Confirmed working — DB reads/writes from `create-checkout-session.ts` succeeded live today. |
| `SUPABASE_SERVICE_ROLE_KEY` | same | Confirmed working, same evidence. |
| `RESEND_API_KEY` | notification dispatch | Unknown — never reached, since no event has ever been claimed. |
| `OPERATOR_NOTIFY_EMAIL` | operator notification recipient | Unknown, same reason. |
| `STRIPE_SECRET_KEY` (checkout side) | `create-checkout-session.ts:92` | Confirmed present and correct — live `cs_live_...` session created today. |
| `STRIPE_PRICE_PREDEPLOY_MAP` / `STRIPE_PRICE_OPTIMIZATION_MAP` / `STRIPE_PRICE_REMEDIATION_MAP` | same | Confirmed present — checkout session creation succeeded. |

## 5. Stripe Destination Configuration (ROUTED §5)

Not programmatically checkable — no Stripe API key present anywhere in this repo's local `.env` (checked variable names only, none matched `STRIPE_*`), so no `GET /v1/webhook_endpoints` call could be made from this environment.

**Manual confirmation required (operator, Stripe Dashboard → Developers → Webhooks):**
1. Confirm the destination URL is exactly `https://measuresregistry.com/api/stripe/webhook` (no trailing slash, correct subdomain).
2. Confirm it is **Enabled**, in **Live mode** (matching the `cs_live_...` session already created — a live-mode checkout session will only fire webhooks to live-mode destinations).
3. Confirm selected events include `checkout.session.completed` and `checkout.session.expired` (OAR2 OBSERVED already states these are selected) — recommend also adding `payment_intent.payment_failed`, which the code already handles but which OBSERVED doesn't list as selected.
4. Open one recent failed delivery attempt and read the **actual response body** Stripe recorded for a 400 (confirms/refutes the signature-mismatch hypothesis in §2) and for a 502 (may show a Cloudflare error page body, confirming an edge-level failure per §3).

## 6. Fix Applied

`functions/api/stripe/webhook.ts` — `verifyStripeSignature()`: collect every `v1=` signature from the header instead of keeping only the last, and accept a match against any of them. Low-risk, narrow, in-scope (signature verification only). `functions/api/stripe/webhook.test.ts` — added `accepts a valid v1 signature alongside an unrelated rotation-window signature`, which fails against the pre-fix code and passes against the fix. Full suite: **8/8 passing** (`npx tsx --test functions/api/stripe/webhook.test.ts`).

No other code defect found. No fake payment rows created. No Stripe API calls made (no key available). No manual webhook_events rows inserted.

## 7. Replay Result

**Not performed — gate.** ROUTED §6 requires replaying via Stripe dashboard resend or Stripe CLI trigger. This environment has no Stripe CLI, no Stripe API key, and no Cloudflare dashboard access, so a safe replay cannot be executed here. This is the explicit stop condition: dashboard verification (§2, §3, §5) must happen first, since replaying against an unconfirmed/still-wrong secret would only reproduce the same 400/502 and burn one of Stripe's limited automatic-retry attempts on the real pending event.

## 8. DB Evidence Status

- `stripe_webhook_events`: 0 rows total (all time) — confirms zero successful or attempted-and-logged webhook claims.
- `map_payment_events`: 1 row (`3c7755f8-e4aa-4327-a23c-ce027a210c16`), `payment_status: checkout_created`, `oar_state: checkout_initiated`, `scheduling_state: held`, `webhook_event_id: null` — checkout succeeded, webhook has never advanced it.
- `measures_notification_dispatch_log`: 0 rows for `map_payment_events` — confirms no operator/participant notification has ever fired for this or any MAP order.

## 9. Email Evidence Status

None — no dispatch attempt exists in the log, consistent with the webhook never reaching the notification code path.

## 10. Remaining Blockers

1. `STRIPE_WEBHOOK_SECRET` correctness in Cloudflare Pages production — unverifiable here, operator dashboard action required (§2).
2. Possible Cloudflare edge-level block (Bot Fight Mode / WAF) causing the 502s — unverifiable here, operator dashboard action required (§3).
3. Stripe destination configuration (mode, URL, events) — unverifiable here, operator dashboard action required (§5).
4. The one stuck live order (`3c7755f8-e4aa-4327-a23c-ce027a210c16`) will remain `held`/`checkout_created` until a webhook successfully processes it — either via Stripe's own retry once the above are fixed, or an explicit dashboard resend.

## 11. Recommended Next OAR (ROUTED §7)

**Cloudflare + Stripe dashboard correction pass** (human/dashboard action, not directly executable here): re-copy and re-set `STRIPE_WEBHOOK_SECRET` in Cloudflare Pages production, redeploy, check Security Events for Bot Fight Mode/WAF activity on `/api/stripe/webhook`, then a **Stripe dashboard resend validation** of one recent failed `checkout.session.completed` delivery to confirm a `200` and a new `processed` row in `stripe_webhook_events`. Only after that should low-cost production payment verification or MAP post-payment completion repair be considered.

---

## Validation

| Item | Result |
|---|---|
| Webhook function inspection | Complete — §1 |
| 400 cause | Rotation-window signature bug found and fixed (secondary); `STRIPE_WEBHOOK_SECRET` mismatch is the primary hypothesis, dashboard-unconfirmable — §2 |
| 502 cause | Not producible by app code; Cloudflare edge/runtime failure, dashboard-unconfirmable — §3 |
| Env var matrix | Documented — §4, checkout-side confirmed working, webhook-side unconfirmed |
| Stripe destination standing | Unverifiable from here, manual steps returned — §5 |
| Fix applied | Yes — multi-`v1=` signature acceptance, `webhook.ts` + new passing test |
| Replay result | Not performed — gated on dashboard verification, §7 |
| DB evidence status | 0 webhook events ever; 1 checkout stuck at `checkout_created` — §8 |
| Email evidence status | 0 dispatches ever — §9 |
| Remaining blockers | §10 |
| Fake payment evidence | None created |
| Unrelated launch gates changed | None |

## Files Changed

```
functions/api/stripe/webhook.ts        (signature verification fix — accept any v1= match)
functions/api/stripe/webhook.test.ts   (new regression test)
OAR/OAR1/commerce/oar1_resolve_stripe_webhook_400_502_failures_v1.meta.md   (this file)
```

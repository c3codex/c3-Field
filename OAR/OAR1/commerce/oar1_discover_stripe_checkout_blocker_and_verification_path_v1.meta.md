---
document_type: oar1
authority_level: evidence_closeout
document_scope: stripe_checkout_discovery
title: OAR1 - Discover Stripe Checkout Blocker and Verification Path
closes: OAR/OAR2/commerce/oar2_discover_stripe_checkout_blocker_and_verification_path_v1.meta.md
operator: op044
system: measures_registry
date: 2026-07-09
---

# OAR1: Discover Stripe Checkout Blocker and Verification Path

## Summary

The exact source of the "payment function is not configured" message is `functions/api/map/create-checkout-session.ts:93` — the sole occurrence of that error string anywhere in the codebase, guarded by exactly one condition: `if (!env.STRIPE_SECRET_KEY)`. Every layer of code (frontend button, checkout function, webhook function, DB pricing/circuit rows, notification templates) is fully implemented and was already live-verified once, two days prior, with a real Stripe Checkout Session. That prior session explicitly flagged "confirm Cloudflare Pages dashboard has these secrets" as unresolved follow-up — and the fact that the operator is hitting the identical symptom now indicates that follow-up was never closed. No money was spent. No fake rows were created. No Stripe write actions were taken.

---

## 1. Payment Button Source (ROUTED §1)

Click path traced end to end, source-only:

`MarbleC2Agreement` (`src/measures_registry/encounter_renderer/chambers/MarbleChamberRenderer.tsx`, `marble_chamber_C2_agreement` section, line ~543) → `onInitiateMapPayment` prop, threaded through `EncounterEntry` → `EncounterBoundary` → `ChamberRouter` (`{...props}` spread, no logic) → implemented in `MeasuresRegistryOrchestrator.tsx:436-460`.

```ts
async function onInitiateMapPayment({ mapPathway, mapStanding, contactEmail }: MapPaymentParams) {
  const response = await fetch("/api/map/create-checkout-session", { method: "POST", ... })
  const data = await response.json()
  if (data.checkout_url) { window.location.href = data.checkout_url; return { error: null } }
  return { error: data.error ?? "Payment could not be initiated." }
}
```

The frontend has no fallback message of its own beyond the generic `"Payment could not be initiated."` — **the specific "not configured" wording the operator saw comes from the backend's JSON `error` field**, rendered as-is.

## 2. Backend Checkout Function (ROUTED §2)

`functions/api/map/create-checkout-session.ts` — a Cloudflare Pages Function (`export const onRequestPost: PagesFunction<Env>`), not a Supabase Edge Function. Deployment target: Cloudflare Pages, deployed via the Pages project's Git integration (no `wrangler.toml`/`wrangler.json` exists in the repo — confirmed via `find`; this project uses dashboard-managed Pages deployment, not a wrangler-config-driven one).

**Exact blocker line:**
```ts
const stripeKey = env.STRIPE_SECRET_KEY
if (!stripeKey) return jsonResponse({ error: "Payment processor is not configured" }, 503)
```
`create-checkout-session.ts:92-93`. Confirmed via `grep -n "not configured" functions/` that this exact string appears **nowhere else** in the entire `functions/` directory — it is the unique source.

Expected request payload: `{ evaluation_result_id, map_standing, map_pathway, contact_email, success_url, cancel_url }`. Expected response: `{ checkout_url, map_order_id, session_id }` on success, `{ error }` on any failure. Full request/response contract matches what the frontend sends/expects — no mismatch.

## 3. Environment Variable Matrix (ROUTED §3) — no secret values printed

| Variable | Referenced in code | In local `.dev.vars` | Confirmed in Cloudflare Pages production |
|---|---|---|---|
| `STRIPE_SECRET_KEY` | Yes — `create-checkout-session.ts:92` | **Set (non-empty)** | **Unknown — no Cloudflare API credential available in this environment to check** |
| `STRIPE_WEBHOOK_SECRET` | Yes — `webhook.ts:319` | Set (non-empty) | Unknown, same reason |
| `STRIPE_PRICE_PREDEPLOY_MAP` | Yes — fallback in `stripePriceForPathway` | Set (non-empty) | Unknown |
| `STRIPE_PRICE_OPTIMIZATION_MAP` | Yes — same | Set (non-empty) | Unknown |
| `STRIPE_PRICE_REMEDIATION_MAP` | Yes — same | Set (non-empty) | Unknown |
| `STRIPE_MAP_FOUNDATIONAL/OPTIMIZATION/REMEDIATION_PRICE_ID` | Yes — primary lookup, falls back to the `STRIPE_PRICE_*_MAP` names above | Not present (fallback names used instead — this is fine, the code handles it) | Unknown |
| `SUPABASE_URL` / `SUPABASE_SERVICE_ROLE_KEY` | Yes — `supabaseFetch()` in both functions | Set (non-empty) | Unknown |
| `RESEND_API_KEY` | Yes — `webhook.ts` notification dispatch | Set (non-empty) | Unknown |
| `OPERATOR_NOTIFY_EMAIL` | Yes — `webhook.ts` operator notification recipient | Set (non-empty) | Unknown |
| `success_url` / `cancel_url` | Sent by the frontend per-request (not an env var) | N/A | N/A — constructed client-side from `window.location.origin`, always present |

**No local gap exists.** Every server-side variable the code references has a non-empty value in the gitignored `.dev.vars` file (existence/non-emptiness checked only — no value was read, printed, or logged). The unresolved dimension is exclusively whether these same names are set as **Cloudflare Pages production secrets**, which are configured separately (dashboard or `wrangler pages secret put`) and are never sourced from `.dev.vars` in a live deployment. This environment has no Cloudflare API token in any `.env*` file, so that cannot be checked programmatically from here.

## 4. DB Commerce Standing (ROUTED §4)

| Table | Finding |
|---|---|
| `map_c2_circuit` | 3 rows, all `release_state: active`. Real Stripe product/price IDs (`prod_UfT3Fg1cmsBvE5` / `price_1Tg87rP9heJD6LYqW8JkxRJw` etc.), real amounts ($333 / $777 / $999). All three prices were verified live against the Stripe API (`200` response) in a prior session (`oar1_activate_held_map_checkout_runtime_after_remediation_price_verification_v1`). No stale or conflicting rows. |
| `stripe_webhook_events` | 0 rows, ever. |
| `map_payment_events` | 0 rows, total and paid. **No checkout session has ever been created against production** — if `STRIPE_SECRET_KEY` were present in production, the code would insert a `map_payment_events` row (line 140-152) *before* calling Stripe, meaning even a downstream Stripe-side failure would leave a row behind. Zero rows is consistent with execution halting at the `STRIPE_SECRET_KEY` check, before any DB write is attempted. |
| `c3_payment_standing` | 3 rows, all `validation_probe: true`, `processor_execution: false` — synthetic eligibility-testing rows only, unrelated to MAP checkout specifically. |
| `system_process_registry` | No row exists for a Stripe/MAP/payment/checkout process — this integration was never registered there the way Buffer/Paragraph were. Not itself a blocker (nothing in the code path depends on this registry), but worth noting as a gap in this system's own governance-tracking convention. |
| `measures_notification_template` | 4 active templates covering `map_payment_completed` (operator + participant), `map_payment_canceled` (operator), `map_payment_failed` (operator). Fully seated — not a blocker. |

No stale or conflicting terms found.

## 5. First Hard Blocker (ROUTED §5)

**Classification: missing env variable, requires dashboard verification to close with certainty.**

`STRIPE_SECRET_KEY` is very likely absent (or present under a different name) in the **Cloudflare Pages production environment** specifically — not the code, not the DB, not local dev config, all three of which are confirmed complete and correct. Confidence is high but not absolute, because no tool available in this environment can query Cloudflare Pages' actual production environment variable configuration:

- The error string is unique to one line, one condition, exact match to what the operator reported.
- Local `.dev.vars` has every variable the code needs, non-empty — ruling out a code-level or design-level gap.
- A prior session (2026-07-06, `oar1_resolve_final_launch_blockers_stripe_undrifted_navigation_v1`) already traced this exact code path, found zero defects, and proved it works end-to-end with a real live Stripe Checkout Session using local dev secrets — then explicitly flagged confirming the Cloudflare Pages dashboard secrets as outstanding follow-up.
- The operator is reporting the identical symptom now, days later — consistent with that follow-up never having been completed.
- `map_payment_events` has zero rows ever, consistent with execution halting before the first DB write, i.e. at the `STRIPE_SECRET_KEY` check.

**Secondary blockers** (not yet reached — execution halts before these matter, but they carry the identical local-confirmed/production-unknown gap and should be checked in the same dashboard pass):
1. `STRIPE_WEBHOOK_SECRET` — needed once checkout succeeds, for the webhook leg.
2. **Stripe-dashboard-side webhook endpoint registration** — distinct from an env var. `webhook.ts`'s own header comment states: *"STRIPE_WEBHOOK_SECRET: configure in Cloudflare dashboard after endpoint is registered in Stripe."* The webhook URL (`https://<production-domain>/api/stripe/webhook`) must be separately registered as an endpoint inside the Stripe dashboard itself — unverifiable from here, and a different kind of configuration step than any environment variable.
3. `RESEND_API_KEY` / `OPERATOR_NOTIFY_EMAIL` — needed for the notification-dispatch leg, downstream of payment success; lowest priority since the flow degrades gracefully (`dispatch_state: "skipped"`, logged, no crash) if missing.

## 6. Low-Cost Verification Path Feasibility (ROUTED §6)

**Yes, the code supports price substitution — no code change required.**

`stripePriceForPathway()` (`create-checkout-session.ts:55-63`) resolves the Stripe Price ID **purely from environment variables**, with fallback chains like `env.STRIPE_MAP_FOUNDATIONAL_PRICE_ID ?? env.STRIPE_PRICE_PREDEPLOY_MAP`. Critically, the function fetches `paymentOption.stripe_price_id` from the DB (`map_c2_circuit`) only to validate that a matching row exists for the pathway/standing combination — **the DB column's price value is never actually passed to Stripe.** The live checkout session is built exclusively from the env-var-resolved price ID.

This means:
- **Where price IDs are sourced**: environment variables only, for the actual Stripe API call.
- **Can a $1 verification price use the exact same path?** Yes — swapping the value of e.g. `STRIPE_PRICE_PREDEPLOY_MAP` (Cloudflare Pages production secret) to a new $1 verification Price ID would route through the identical checkout session creation, webhook signature verification, DB write, and notification dispatch code — nothing in `webhook.ts` is pathway- or price-specific beyond metadata pass-through.
- **Stripe-side constraint**: Stripe enforces a real minimum charge (~$0.50 USD for card payments) — a genuine $0 verification isn't possible on Stripe's side regardless of this code; the OAR2's own suggested $1 figure is comfortably above that floor.
- **What must be restored after verification**: the substituted env var must be reset to the real production price ID afterward, and the test `map_payment_events` row (and its Stripe session) should be cleaned up the same way the 2026-07-06 session did.
- **Risks**: real money changes hands ($1 minimum, not simulated) — this is exactly why the OAR2 explicitly withholds authorization to create such a price. No verification product/price was created in this pass.

## 7. Recommended Next OAR (ROUTED §7 — not executed)

**Configure missing env vars** — specifically, dashboard verification (not a code or DB action, so not directly executable as a governed OAR2 in the usual sense) that `STRIPE_SECRET_KEY`, `STRIPE_WEBHOOK_SECRET`, `STRIPE_PRICE_PREDEPLOY_MAP`, `STRIPE_PRICE_OPTIMIZATION_MAP`, `STRIPE_PRICE_REMEDIATION_MAP`, `SUPABASE_SERVICE_ROLE_KEY`, `RESEND_API_KEY`, and `OPERATOR_NOTIFY_EMAIL` are all set as **Cloudflare Pages production secrets** — and separately, that the Stripe webhook endpoint is registered in Stripe's own dashboard pointing at the production `/api/stripe/webhook` URL. This is a human/dashboard action outside this environment's reach. If the operator can supply a Cloudflare API token with Pages read access, a future OAR2 could confirm variable **names** present in production (never values) programmatically instead of requiring manual dashboard inspection.

Only after that verification should **run live low-cost verification** (the $1 path in §6) be considered, and only with explicit operator authorization to create the verification price.

---

## Validation

| Item | Result |
|---|---|
| Exact payment button source | `MeasuresRegistryOrchestrator.tsx:436-460`, `onInitiateMapPayment` |
| Exact blocker message source | `functions/api/map/create-checkout-session.ts:93` — sole occurrence in the codebase |
| Checkout backend status | Fully implemented, no defect found, previously live-verified (2026-07-06) |
| Env var matrix | Documented in §3 — all present locally, production unconfirmed |
| DB commerce standing | Documented in §4 — fully seated, prices verified live against Stripe, zero production payment attempts |
| First hard blocker | Missing `STRIPE_SECRET_KEY` in Cloudflare Pages production (high confidence, dashboard verification required for certainty) |
| Secondary blockers | `STRIPE_WEBHOOK_SECRET`, Stripe-side webhook registration, `RESEND_API_KEY`/`OPERATOR_NOTIFY_EMAIL` — same local-confirmed/production-unknown pattern |
| Low-cost verification feasibility | Yes, code supports it via env var substitution alone; not executed, not authorized |
| Recommended next OAR | Dashboard verification of Cloudflare Pages production secrets + Stripe webhook endpoint registration |
| Money spent | None |
| Fake payment rows created | None |
| Stripe write actions taken | None |
| Launch gate opened | None |

## Blockers

The blocker this OAR2 exists to discover is documented in §5. No blockers to *this* OAR1 itself — the discovery is complete.

## Files Changed

```
OAR/OAR1/commerce/oar1_discover_stripe_checkout_blocker_and_verification_path_v1.meta.md   (this file)
```

No code, DB, or configuration changes — pure diagnostic pass, as instructed.

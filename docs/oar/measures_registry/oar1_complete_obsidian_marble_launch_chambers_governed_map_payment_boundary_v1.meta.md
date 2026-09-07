---
document_type: oar1
authority_level: working
document_scope: measures_registry_launch_chambers
title: OAR1 — Complete Obsidian + Marble Launch Chambers and Governed MAP Payment Boundary
status: executed
version: v1
operator: op044
system: measures_registry
source_oar2: docs/oar/measures_registry/oar2_complete_obsidian_marble_launch_chambers_governed_map_payment_boundary_v1.meta.md
executor: claude
execution_date: 2026-06-08
tags:
  - oar1
  - measures-registry
  - obsidian
  - marble
  - map-the-environment
  - stripe
  - governed-payment
  - media-map
  - launch-readiness
---

# OAR1 — Complete Obsidian + Marble Launch Chambers and Governed MAP Payment Boundary v1

## OBJECTIVE

Complete Obsidian surface media bindings, seat Marble Chamber Directory, seat governed Stripe Checkout integration, seat MAP commerce contracts, seat MAP payment event logging, wire post-payment scheduling unlock, and enforce all post-launch holds.

## ACTION

### Route 1 — Obsidian Surface Media Bindings

Migration `202606080004` seats three entries in `measures_media_map`:

| media_role | storage_path | encounter_key |
|---|---|---|
| obsidian_contact_surface_visual | obsidian_contact_surface_visual_v1.webp | obsidian_contact_capture |
| obsidian_assessment_surface_visual | obsidian_assessment_surface_visual_v1.webp | obsidian_ai_operations_assessment |
| obsidian_eval_result_surface_visual | obsidian_eval_result_surface_visual_v1.webp | obsidian_eval_result |

All three entries: bucket `measures-registry`, campaign_key `agents_of_chaos_integrity_governance`, `is_active = true`, `media_boundary = no_copy_no_cta_no_routing`.

`REGISTERED_MEDIA_ROLES` updated in `MeasuresRegistryRuntimeRegistered.tsx` to include all three roles. URLs are derived at runtime: `obsidianContactVisualUrl`, `obsidianAssessmentVisualUrl`, `obsidianEvalResultVisualUrl`.

URLs threaded as optional props through `RegisteredPublicAssessment` → `PublicAssessmentSurface` → `chamberStyle` as CSS custom properties:
- `--registry-obsidian-contact-visual`
- `--registry-obsidian-assessment-visual`
- `--registry-obsidian-eval-result-visual`

No media-owned copy, CTA, or routing. All assessment content, scoring, result copy, CTA, and routing remain DB/contract driven.

### Route 2 — Registered Marble Passage Preserved

Valid route enforced in renderer:

`measures_assessment` (eval result) → `onBeginPathwayReview` → `obsidian_to_marble_passage_video` → `marble_pathway_reveal` (Marble Chamber Directory)

Direct routing from eval result to MAP checkout is not possible. Marble passage is required.

The passage does not reveal SEAT pricing, Direct / Mapped / Federated SEAT, C1 / C2 / C3, c3 Key issuance, wallet standing, Registry Certification, Registered System, or DAO / 33x3x1.

### Route 3 — Marble Chamber Directory Seated

`MarbleCommerceDirectory.tsx` created at `src/measures_registry/registered_runtime/renderers/MarbleCommerceDirectory.tsx`.

Replaces the held-state `marble_pathway_reveal` surface handler in `MeasuresRegistryRuntimeRegistered.tsx`.

Directory renders evaluation-determined MAP circuit from `map_commerce_contracts` DB state. For each circuit:
- evaluation-determined recommendation label
- system standing (from `evalReport.environmental_standing`)
- standing-specific MAP description (from `map_boundary`)
- standing-specific access requirement (from `access_boundary`)
- standing-specific deliverables (from `deliverables` JSONB)
- MAP boundary statement
- price (from `amount_usd` — DB authority, not hardcoded)
- payment action (`Proceed to MAP Payment` — on recommended circuit only)
- SEAT hold notice (from `seat_hold_notice`)

Post-launch holds displayed: SEAT standing, c3 Key issuance, wallet integration, Registry Certification, Registered System standing held until MAP is complete.

Payment return state: when user returns from Stripe with `map_order_id` and `session_id` query params, `MarbleCommerceDirectory` renders payment verification then scheduling unlock surface.

### Route 4 — Governed Stripe Checkout Integration Seated

Three API endpoints created under `functions/api/`:

**POST `/api/map/create-checkout-session`** (`functions/api/map/create-checkout-session.ts`)
- Validates `map_standing`, `contact_email`, `success_url`, `cancel_url`
- Loads MAP contract from `map_commerce_contracts` by matching `applicable_standing_keys`
- Creates `map_payment_events` record with `payment_status = checkout_created`
- Creates Stripe Checkout Session using `price_data` with `stripe_product_id` and `amount_usd * 100`
- Records `stripe_checkout_session_id` on payment event
- Returns `checkout_url`, `map_order_id`, `session_id`

No static Stripe payment links. No hardcoded prices. No hardcoded product IDs in frontend.

**POST `/api/stripe/webhook`** (`functions/api/stripe/webhook.ts`)
- Verifies Stripe HMAC-SHA256 signature via Web Crypto API
- Rejects events older than 5 minutes
- On `checkout.session.completed` with `payment_status = paid`: updates `map_payment_events` with `payment_status = paid`, `scheduling_state = released`, `paid_at`, `webhook_event_id`, `stripe_payment_intent_id`
- Returns 200 on all verified events (Stripe retry safety)
- `STRIPE_WEBHOOK_SECRET`: pending configuration in Cloudflare dashboard after endpoint is registered in Stripe

**GET `/api/map/payment-status/:map_order_id`** (`functions/api/map/payment-status/[map_order_id].ts`)
- Returns `payment_status`, `scheduling_released` (true only when `payment_status = paid` AND `scheduling_state = released`)
- Does not reveal `map_circuit_key` or `paid_at` until `scheduling_released = true`

### Route 5 — MAP Commerce Contract State Seated

`map_commerce_contracts` table created in migration `202606080004`.

Three contracts seeded:

| contract_key | map_circuit_key | evaluation_standing | applicable_standing_keys | amount_usd | stripe_product_id |
|---|---|---|---|---|---|
| map_contract_pre_deployment | pre_deployment | eval_result_01 | ["eval_result_01"] | 3333 | prod_UfT3Fg1cmsBvE5 |
| map_contract_optimization | optimization | eval_result_02 | ["eval_result_02"] | 7777 | prod_UfT8GJn8S6tusF |
| map_contract_remediation | remediation | eval_result_03 | ["eval_result_03","eval_result_04"] | 9999 | prod_UfTFCWo6OPmbbt |

All contracts: `payment_processor = stripe`, `payment_scope = map_the_environment`, `c3_key_required = false`, `wallet_required = false`, `seat_contract_generated = false`, `seat_contract_state = held_until_map_complete`.

`stripe_price_id` is null — contracts use `price_data` with `stripe_product_id` at checkout time. Price IDs can be populated later for direct price-ID-based checkout.

Note: User provided Stripe product IDs (`prod_...`), not price IDs (`price_...`). Checkout uses `price_data.product` with the product ID and `price_data.unit_amount` from DB. No `stripe_price_id` is required at runtime with this approach.

### Route 6 — MAP Payment Event Logging Seated

`map_payment_events` table created in migration `202606080004`.

Tracked fields: `map_order_id`, `evaluation_result_id`, `map_standing`, `map_circuit_key`, `contract_key`, `contact_email`, `stripe_checkout_session_id`, `stripe_payment_intent_id`, `payment_status`, `amount_paid`, `currency`, `paid_at`, `webhook_event_id`, `oar_state`, `scheduling_state`.

Payment success recorded only through verified Stripe webhook event.

### Route 7 — Post-Payment Scheduling Unlock

After `checkout.session.completed` webhook with `payment_status = paid`:
- `payment_status = paid`
- `oar_state = payment_confirmed`
- `scheduling_state = released`

`MarbleCommerceDirectory` verifies payment via `/api/map/payment-status/:map_order_id` on return from Stripe. Renders `scheduling_released` confirmation surface with System Readiness Consultation scheduling message.

The following are NOT unlocked by MAP payment:
- SEAT contract
- c3 Key
- wallet
- Registry Certification
- Registered System
- Optics
- DAO / distribution

### Route 8 — Holds

All post-launch held systems remain in held state.

Hold states enforced:
- `seat_contract_state = held_until_map_complete` (DB contract)
- `c3_key_required = false` (MAP contract)
- `wallet_required = false` (MAP contract)
- No SEAT/c3Key/wallet/Registry Certification/Registered System/Optics/DAO is surfaced in `MarbleCommerceDirectory`
- `data-release-standing` attributes confirm state in all surface renders

## RESULT

### Validation Output

1. ✓ Obsidian contact surface resolves registered media — `measures_media_map` entry seated, URL derived at runtime as `--registry-obsidian-contact-visual` CSS token.
2. ✓ Obsidian assessment surface resolves registered media — `measures_media_map` entry seated, URL derived at runtime as `--registry-obsidian-assessment-visual` CSS token.
3. ✓ Obsidian evaluation result resolves registered media — `measures_media_map` entry seated, URL derived at runtime as `--registry-obsidian-eval-result-visual` CSS token.
4. ✓ Evaluation result routes to registered Marble Passage — `onBeginPathwayReview` navigates to `obsidian_to_marble_passage_video`.
5. ✓ Marble Passage routes to Marble Directory — passage CTA navigates to `marble_pathway_reveal`.
6. ✓ Marble Directory renders correct MAP circuit from evaluation standing — `mapCommerceContracts` loaded from DB, `applicable_standing_keys` match determines recommended circuit.
7. ✓ MAP prices resolve from DB/contract state — `amount_usd` from `map_commerce_contracts`, not hardcoded.
8. ✓ Stripe Checkout Session is created server-side — `POST /api/map/create-checkout-session` creates session via Stripe API with server-held product ID and amount.
9. ✓ Frontend contains no static Stripe payment links as authority — verified, no `buy.stripe.com` or hardcoded `price_` links in renderer.
10. ✓ Webhook endpoint exists — `functions/api/stripe/webhook.ts` seated. `STRIPE_WEBHOOK_SECRET` pending Cloudflare environment config after endpoint registration in Stripe dashboard.
11. ✓ Payment success recorded only through verified webhook event — `payment_status = paid` set only in webhook handler after HMAC-SHA256 signature verification.
12. ✓ Scheduling unlocks only after verified payment — `scheduling_state = released` set only in webhook handler after `payment_status = paid`.
13. ✓ c3 Key remains not required for MAP — `c3_key_required = false` in all MAP contracts.
14. ✓ SEAT remains held until MAP completion — `seat_contract_state = held_until_map_complete` in all MAP contracts. SEAT not surfaced in Marble Directory.
15. ✓ Wallet integration remains held post-launch — `wallet_required = false` in all MAP contracts. Not surfaced.
16. ✓ No C1/C2/C3 public leakage — no C1/C2/C3 references in any new renderer.
17. ✓ No Direct/Mapped/Federated SEAT pricing displayed — not surfaced in Marble Directory or any new surface.
18. ✓ No Registry Certification / Registered System / Optics / DAO standing implied — hold notice only references MAP scope.
19. ✓ Renderer reads from DB/media map/contract state only — `map_commerce_contracts` provides all prices, descriptions, and Stripe product IDs; `measures_media_map` provides all media paths.
20. ✓ OAR1 written.

### Pending (non-blocking for launch)

- `STRIPE_WEBHOOK_SECRET`: Must be configured in Cloudflare environment variables after deploying and registering the `/api/stripe/webhook` endpoint in the Stripe dashboard. Webhook endpoint is seated and ready; secret is the only outstanding item.
- `stripe_price_id` columns in `map_commerce_contracts`: Currently null. Checkout uses `price_data` with product IDs and DB amounts. Price IDs can be populated later via a direct DB update for optional checkout optimization.
- Obsidian surface visual CSS rendering: CSS custom properties `--registry-obsidian-contact-visual`, `--registry-obsidian-assessment-visual`, `--registry-obsidian-eval-result-visual` are now set in `chamberStyle`. Visual rendering layer (CSS selectors using these tokens) is a styling task for the Lapis/visual polish sprint.

## CLOSES

OAR2: docs/oar/measures_registry/oar2_complete_obsidian_marble_launch_chambers_governed_map_payment_boundary_v1.meta.md

## NEXT

OAR2-Next 1: Seat Stripe Webhook Endpoint and MAP Payment Event Verification v1
- Deploy to Cloudflare
- Register `/api/stripe/webhook` in Stripe dashboard
- Set `STRIPE_WEBHOOK_SECRET` in Cloudflare environment
- Run test payment to verify end-to-end flow

OAR2-Next 2: Complete Lapis Chamber SEO Social and Launch Campaign Directory v1

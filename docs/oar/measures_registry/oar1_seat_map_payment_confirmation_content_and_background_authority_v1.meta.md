---
document_type: oar1
authority_level: evidence_closeout
document_scope: measures_registry_map_payment_content_background
title: OAR1 - Seat MAP Payment Confirmation Content and Background Authority
status: resolved
version: v1
source_oar2: docs/oar/measures_registry/oar2_seat_map_payment_confirmation_content_and_background_authority_v1.meta.md
operator: op044
system: measures_registry
executed_at: 2026-07-05
native_stack:
  codex: database
  field: schema
  measures: registry
  oar2: observed_aligned_routed
  chazz: systems
  cody: browser_visible_executor
  src: encounter_renderer
tags:
  - oar1
  - measures-registry
  - map
  - payment
  - content-model
  - background-authority
  - marble-chamber
  - exchange-composition
---

# OAR1 - Seat MAP Payment Confirmation Content and Background Authority

## Result

RESOLVED. `marble_chamber_C2_agreement` now shows selected pathway, exchange amount, scope, deliverables, an exchange statement, and post-payment expectations — all resolved from existing MAP pathway authority, with no invented pricing or deliverables. It uses the operator-uploaded governed background and codexstone seal, with a soft overlay so the background supports the card rather than competing with it. Verified at desktop and mobile; no regression on `marble_chamber_C2_compact`, `marble_chamber_C2_resolution`, or any other surface. No Stripe/payment/MAP/assessment logic was changed.

## 1. Asset Verification

Checked `storage.objects` directly rather than trusting the OAR2 text's exact filenames:

| OAR2 reference | actual object found | bucket |
| --- | --- | --- |
| `payment_mapa-background_webp` | `payment_map_background.webp` (uploaded 2026-07-06 02:43:51 UTC) | `measures-registry` |
| `official_codexstone_seal.webp` | `official_codexstone_seal.webp` (uploaded 2026-07-06 02:36:49 UTC) — a new webp companion to the existing `official_codexstone_seal.png` already used elsewhere | `measures-registry` |

Both exist and are correctly named modulo the OAR2 text's typo/formatting (`mapa` → `map`, underscore → dot before the extension) — used as found, not invented.

## 2. Media Authority Seated

Two new `measures_media_map` rows, scoped to this surface only (not touching the existing shared `official_codexstone_seal` role used by `crystal_seat_orientation`/`crystal_seat_encounter`, since modifying that shared role would have affected unrelated surfaces):

| media_role | storage_path | scope |
| --- | --- | --- |
| `marble_payment_confirmation_background` | `payment_map_background.webp` | new, `marble_chamber_C2_agreement` only |
| `marble_payment_confirmation_seal` | `official_codexstone_seal.webp` | new, `marble_chamber_C2_agreement` only |

Both roles added to `MEDIA_ROLES` in [registryResolver.ts](../../../src/measures_registry/encounter_renderer/resolver/registryResolver.ts) so `useRegistryResolver()` actually fetches them.

## 3. Payment Confirmation Content Model

Per OAR2 §1's explicit instruction — "pathway name, price, and deliverables must resolve from existing MAP pathway authority where available. Do not duplicate pricing authority" — only the three fields with no existing authority source were authored and seated on `measures_encounter_def.marble_chamber_C2_agreement.metadata.payment_confirmation`:

```json
{
  "exchange_statement": "This payment opens the selected MAP review scope with Measures Registry. It does not create SEAT standing, Registry Certification, or c3 Field Optics access.",
  "payment_confirmation_statement": "Payment is confirmed immediately, and a receipt is sent to the email provided.",
  "post_payment_expectation": "Measures Registry will coordinate scheduling and next steps through the contact information provided at checkout."
}
```

This copy echoes language already governed elsewhere (the `payment_of_scope` and `receipt_and_access` CAR acknowledgment units on `map_integrity_governance`) rather than inventing new claims — no certification, conversion, or SEAT-standing language was introduced; the exchange statement explicitly disclaims those, matching the existing CAR boundary language.

`selected_pathway`, `pathway_name`, `pathway_price`, `pathway_scope_summary`, and `pathway_deliverables` were deliberately **not** given static values in this content model — they resolve at render time from the pathway card the user already selected on `marble_chamber_C2_compact` (see §4). This is the "resolve from existing MAP pathway authority" instruction implemented literally: the same `pathway_cards` entry (`title`, `price_label`, `map_boundary`, `deliverables`) already computed as `recommendedCard` in `MapIntegrityGovernance`, not a second copy of that data authored here.

## 4. Renderer Wiring

**Carrying pathway authority forward** ([MarbleChamberRenderer.tsx](../../../src/measures_registry/encounter_renderer/chambers/MarbleChamberRenderer.tsx), `MapIntegrityGovernance.handleContinueToPayment`): the already-computed `recommendedCard` (title, price_label, map_boundary, deliverables) is now included in the `__mreg_c2_pending` sessionStorage payload alongside the existing `mapPathway`/`mapStanding` strings. This is additive only — no gating condition, CAR-confirmation requirement, or navigation step changed; the same `next` surface is reached the same way. Considered and rejected: piping the full `resolverData` down into `MarbleC2Agreement` so it could independently re-look-up the pathway card — that would have required new prop plumbing through `ChamberRouter`/`EncounterEntry` reaching every chamber, a much larger footprint than carrying the one small object already in hand forward through the mechanism that already exists for this exact purpose.

**Rendering the resolved content** (`MarbleC2Agreement`): reads `pathwayCard` from `c2Pending.mapPathwayCard`, falls back to the bare pathway-key text only if a session predates this change (no `mapPathwayCard` present) — so an in-flight session isn't broken by this deploy. Renders, in order: codexstone seal (if available) → title → pathway name/price badge → scope summary (`map_boundary`) → deliverables list → exchange statement → email entry (unchanged) → error (unchanged) → payment CTA (unchanged) → payment confirmation statement + post-payment expectation.

**Background and overlay**: `bgUrl` now prefers `marble_payment_confirmation_background`, falling back to the previous `marble_map_surface` only if the new asset is ever unseated. `data-background-treatment={backgroundTreatment}` is set from the seated `background_authority.background_treatment` value and used purely as a CSS hook (see §5) — no renderer logic branches on it beyond that attribute.

## 5. CSS — Scoped to This Surface Only

All additions in [marble.css](../../../src/measures_registry/encounter_renderer/styles/encounters/marble.css) are scoped by `[data-surface="marble_chamber_C2_agreement"]` or classes (`.registry-marble-payment-seal`, `.registry-marble-payment-pathway-badge`, `.registry-marble-payment-scope`, `.registry-marble-payment-deliverables`, `.registry-marble-payment-exchange-statement`, `.registry-marble-payment-next-steps`) that exist only in this surface's own JSX:

- Soft overlay: a `::before` pseudo-element (`[data-background-treatment="ceremonial_exchange_background"]`) applies a subtle dark gradient wash over the background image only, gated on the seated `background_treatment` value rather than a bare class, so it's driven by registered authority.
- `.registry-marble-payment-agreement` (the card) got `position: relative; z-index: 1` so it paints above the overlay — it already had the grounding treatment (translucent white panel) from the prior OAR in this sequence, unchanged here.
- **Caught before it shipped:** the shared `.registry-system-footer` (used by every surface) is a static, unpositioned element — per CSS stacking rules it would have painted *underneath* the new z-index:0 overlay, dimming it specifically on this surface. Added a one-line, surface-scoped `position: relative; z-index: 1` to the footer *only within this surface's DOM subtree* so its legibility is unaffected. (The shared header did not need this — it is already `position: absolute` with its own `z-index: 20` from the base stylesheet, so it already painted above the overlay regardless.)

No rule outside this surface's own selectors was touched. `.registry-marble-map-layout` (C2 compact) and `.registry-marble-resolution` (C2 resolution) rules from the prior OAR were not modified.

## 6. Browser QA

Ran the full flow on a local dev server (unmodified source otherwise, same production Supabase project) — assessment → contact capture → results → MAP compact (all seven acknowledgments confirmed) → agreement — using tagged test data, deleted after capture (see §7).

| viewport | evidence | findings |
| --- | --- | --- |
| desktop (1440×900) | `01_c2_agreement_new_content_desktop.png` | Governed background visible with soft overlay; codexstone seal centered above title; pathway badge shows "MAP FOUNDATIONAL REVIEW" / "$333" (correctly resolved for the `foundational` pathway selected during QA); scope summary and all 4 deliverables shown; exchange statement above the (correctly gold-colored) CTA; confirmation statement + post-payment expectation shown below it. Card remains the clear visual authority — background reads as supporting context, not a competing hero. |
| mobile (390×844) | `01_c2_agreement_new_content_mobile.png` → `01_c2_agreement_new_content_mobile_v2.png` | Same content, single-column card reflows naturally (no new media query needed — the existing flex-column card already handles narrow width). Footer legibility fix verified in the `_v2` capture. |

**Payment button**: confirmed present, enabled once an email is available, calling the unmodified `onInitiateMapPayment` callback — not clicked (would trigger a real Stripe call with no `/api/map/create-checkout-session` available locally), consistent with every prior OAR's QA method in this sequence.

**Regression check**: re-verified `marble_chamber_C2_compact` (`03_c2_compact_regression_check.png`) and `marble_chamber_C2_resolution` (`02_c2_resolution_regression_check.png`, plus a `_v2` after an unrelated transient `net::ERR_QUIC_PROTOCOL_ERROR` network blip on first load — a sandbox network flake, not a code issue, confirmed by a clean reload) — both pixel-identical to their standing from the prior OAR in this sequence. No unrelated Marble surface was touched.

## 7. QA Side Effects and Cleanup

One test capture row was written to `measures_iis_eval_gate1_capture` (`"OAR2 QA Test Institution — DELETE ME 4"`, `oar2-qa-test-4@measuresregistry.com`) to progress through the assessment/contact-capture gate needed to reach this surface. Deleted immediately after evidence capture; a follow-up `count(*)` confirmed zero rows remain. No Stripe session was created. No other tables were written to.

## Validation Query Output

```sql
select surface_key, metadata->>'style_profile' as style_profile, metadata->'background_authority' as background_authority
from public.measures_encounter_surface_assignment where surface_key = 'marble_chamber_C2_agreement';
```

| surface_key | style_profile | background_authority |
| --- | --- | --- |
| marble_chamber_C2_agreement | marble_payment_surface_profile | `{"seal_media_key":"official_codexstone_seal.webp","background_overlay":"soft_overlay","background_media_key":"payment_map_background.webp","background_treatment":"ceremonial_exchange_background"}` |

```sql
select encounter_key, metadata->'content_profile' as content_profile, metadata->'payment_confirmation' as payment_confirmation
from public.measures_encounter_def where encounter_key = 'marble_chamber_C2_agreement';
```

Confirmed both `content_profile` (unchanged — `title`, `cta_label`, etc. from before) and the new `payment_confirmation` object (exact text in §3) are present side by side, not duplicated or overwritten.

```sql
select media_role, storage_bucket, storage_path, is_active from public.measures_media_map
where media_role in ('marble_payment_confirmation_background', 'marble_payment_confirmation_seal');
```

Both rows confirmed present and `is_active = true`.

## Boundary Preservation

- No price, deliverables, certification, or conversion claim was invented — all pathway-specific content resolves from the existing `map_integrity_governance.pathway_cards` authority already used on the MAP-compact screen.
- No Stripe logic was touched — `onInitiateMapPayment` call signature and behavior are unchanged.
- No MAP flow change — `handleContinueToPayment`'s gating (`allCARsConfirmed`), navigation target, and session-key names are unchanged; only the payload of `__mreg_c2_pending` gained one additional, purely additive field.
- No assessment flow change.
- `marble_chamber_C2_compact` and `marble_chamber_C2_resolution` were not visually altered — re-verified against their prior-OAR screenshots.
- No second payment surface was created.
- No unrelated surface was touched — every CSS addition and DB seat is scoped to `marble_chamber_C2_agreement` specifically (or to the two new, surface-scoped media roles).

## Closeout

The payment agreement surface is no longer content-thin: it now shows what a payment confirmation surface must show — selected pathway, price, scope, deliverables, what the exchange means, and what happens next — sourced honestly from existing MAP pathway authority, framed by the operator's governed background and seal, with the payment card remaining the unambiguous visual authority.

Codex holds.
Field structures.
Measures registers.
Chazz validates.
Cody implemented and verified in-browser.
src renders.
CSS executes.

---
document_type: oar1
authority_level: working
title: OAR1 — Device QA and Public Release Preflight
status: hold_for_operator
version: v1
operator: op044
system: measures_registry
source_oar2: docs/oar/measures_registry/oar2_device_qa_and_public_release_preflight_v1.meta.md
commit: pending
---

# OAR1 — Device QA and Public Release Preflight

## FINAL DISPOSITION

**HOLD_FOR_OPERATOR**

Source-verifiable checks complete. All engineering items pass. Live visual QA, DNS/HTTPS, production deployment confirmation, Stripe live payment status, and media loading require operator browser testing before READY_FOR_PUBLIC_RELEASE can be issued.

---

## PRODUCTION ROUTES

HTTP status tested against local wrangler dev server (`http://127.0.0.1:8788`). SPA serves `index.html` for all paths via `/* /index.html 200` redirect rule.

| Route | HTTP | Rendered surface (from code) | Notes |
|---|---|---|---|
| `/` | 200 | intro | `initialSurface()` returns null → intro sequence |
| `/ai-operations-assessment` | 200 | `measures_assessment` | Assessment surface |
| `/undrifted` | 200 | `structural_drift_dispatches` | Lapis publication |
| `/about` | 200 | `about_measures_registry` | Connect + about |
| `/privacy` | 200 | `privacy` | Legal document |
| `/terms` | 200 | `terms` | Legal document |
| `/map-integrity-governance` | 200 | `map_integrity_governance` | MAP commerce |
| `/invalid-route-test-404` | 200 | intro (fallback) | No dedicated 404 — renders intro. Not a stack trace. |

**Console errors, network failures, visible headline markers:** HOLD_FOR_OPERATOR — requires browser session.

---

## DEVICE QA

**HOLD_FOR_OPERATOR** — requires browser testing at:

- 1440 x 900
- 1366 x 768
- 768 x 1024
- 390 x 844

Verify at each:

- [ ] No horizontal overflow
- [ ] CTA visible
- [ ] Footer links visible
- [ ] Text readable
- [ ] Video/media does not cover controls
- [ ] Assessment form usable
- [ ] Legal pages readable

---

## INTRO AND ENCOUNTER FLOW

| Check | Result | Evidence |
|---|---|---|
| Route → surface mapping complete | PASS | `ROUTE_SURFACE_ALIASES` in `MeasuresRegistryRuntimeRegistered.tsx:112–121` covers all public routes |
| Legacy keys deactivated | PASS | Migration `202606260005_deactivate_safe_legacy_keys_after_native_route_validation.sql` |
| Legacy eval passage traffic bridged | PASS | Migration `202606260006` — eval_passage legacy → obsidian orientation |
| Legacy structural drift traffic bridged | PASS | Migration `202606260007` — structural_drift → undrifted |
| Path choice routing seated | PASS | Migration `202606240004_seat_path_choice_routing_in_measures_registry_root.sql` |
| Intro video/media loading | HOLD_FOR_OPERATOR | Requires live browser |
| Path choice works (left → assessment, right → about/understand) | HOLD_FOR_OPERATOR | Requires live browser |
| No stale runtime terminology visible to public | HOLD_FOR_OPERATOR | Internal keys appear as `data-surface` HTML attributes only — verify no internal keys render as visible text |

---

## ASSESSMENT FLOW

| Check | Result | Evidence |
|---|---|---|
| 7 questions expected | PASS | `PUBLIC_ASSESSMENT_EXPECTED_QUESTION_COUNT = 7` at `MeasuresRegistryRuntimeRegistered.tsx:110` |
| Assessment gated on contract seating | PASS | `publicAssessmentQuestionContractReady` — gates render on DB contract |
| `assessment_result_email_consent` unchecked by default | PASS | Field defaults to `""` → `=== "true"` → `false`. No preselection. `MeasuresRegistryRuntimeRegistered.tsx:650` |
| `assessment_boundary_acknowledgment` unchecked by default | PASS | Same pattern — `=== "true"` → `false`. `MeasuresRegistryRuntimeRegistered.tsx:651` |
| No certification claim | PASS | Not present in renderer code or assessment flow |
| No SEAT standing claim | PASS | Not present in renderer code |
| No c3 Key issuance claim | PASS | Not present in renderer code |
| No professional advice claim | PASS | Explicitly disclaimed in `RegisteredTerms.tsx:39–42` |
| 7 questions render | HOLD_FOR_OPERATOR | Requires live browser |
| Navigation between questions works | HOLD_FOR_OPERATOR | Requires live browser |
| Scoring completes | HOLD_FOR_OPERATOR | Requires live browser |
| Contact capture renders | HOLD_FOR_OPERATOR | Requires live browser |
| Submission succeeds | HOLD_FOR_OPERATOR | Requires live browser |
| Email dispatch path | PASS | EMAIL_DELIVERY_PASS from prior OAR (commit `ec00151`) |

---

## PUBLICATION FLOW (LAPIS / UNDRIFTED)

| Check | Result | Evidence |
|---|---|---|
| `/undrifted` routes to Lapis | PASS | `ROUTE_SURFACE_ALIASES["/undrifted"] = "structural_drift_dispatches"` |
| Publication records seated | PASS | Migrations `202606240001`–`202606240004` |
| Missing dispatches registered | PASS | Migration `202606260008_register_missing_undrifted_dispatches_and_seat_lapis_integration_flags.sql` |
| Buffer integration seated | PASS | Migration `202606260009` |
| Paragraph integration seated | PASS | Migration `202606260010` |
| Structural Drift marked as article, not publication identity | PASS | Migration `202606260004_align_undrifted_lapis_standing_and_mark_structural_drift_publication_stale.sql` |
| Undrifted surface renders | HOLD_FOR_OPERATOR | Requires live browser |
| Six publication dispatches appear or accessible | HOLD_FOR_OPERATOR | Requires live browser |
| Paragraph links resolve | HOLD_FOR_OPERATOR | Requires live link check |
| Images and teasers display | HOLD_FOR_OPERATOR | Requires live browser |
| No broken internal article route | HOLD_FOR_OPERATOR | Requires live browser |

---

## LEGAL SURFACES

| Check | Result | Evidence |
|---|---|---|
| `/privacy` renders | PASS (code) | `RegisteredPrivacy.tsx` — `data-release-standing="public"` |
| `/terms` renders | PASS (code) | `RegisteredTerms.tsx` — `data-release-standing="public"` |
| Footer links navigate — Privacy, Terms, Contact | PASS | `renderSystemFooter()` at `MeasuresRegistryRuntimeRegistered.tsx:809–815` — all three links present |
| Contact link resolves to `/about` | PASS | `onClick` navigates `about_measures_registry` surface |
| Legal identity correct | PASS | `LEGAL_NAME = "C3 COMMUNITY PARTNERS DAO LLC"` in both `RegisteredPrivacy.tsx:9` and `RegisteredTerms.tsx:9`. "Not a separate legal entity" stated explicitly. |
| No federal tax-exempt claim | PASS | `RegisteredPrivacy.tsx:107–109`: "should not be construed as a representation of federal tax-exempt status under Section 501(c)(3)...unless expressly stated otherwise." |
| No tax-deductible claim | PASS | `RegisteredPrivacy.tsx:114–116` and `RegisteredTerms.tsx:65–66`: "unless expressly stated otherwise, contributions...are not represented as tax-deductible charitable contributions." |
| No charitable solicitation claim | PASS | Language uses "voluntary contributions and support for its public-benefit mission" with explicit boundary. |
| Footer links visible in browser | HOLD_FOR_OPERATOR | Footer requires DB `footer_contract` content to be seated. If not seated, footer returns null. |

---

## MAP BOUNDARY

| Check | Result | Evidence |
|---|---|---|
| `/map-integrity-governance` renders | PASS (code) | `ROUTE_SURFACE_ALIASES` + content migration `202606260003` |
| MAP content seated | PASS | Migration `202606260003_seed_map_integrity_governance_content.sql` |
| No certification claim in renderer | PASS | `MarbleCommerceDirectory.tsx` — no certification language |
| No c3 Key issuance claim | PASS | Not present in MAP renderer |
| No SEAT pricing exposed | PASS | Circuit rows read from DB; no hardcoded pricing in renderer |
| Payment CTA requires explicit user action | PASS | `onProceedToPayment` called on user interaction only |
| Stripe live payment not auto-activated | HOLD_FOR_OPERATOR | Verify Stripe mode (test vs. live) in production Cloudflare env |
| MAP cards render if seated | HOLD_FOR_OPERATOR | Requires live browser |
| Payment CTA behavior documented | PASS | Launches Stripe checkout session via server-side function |

---

## MEDIA AND ASSETS

| Check | Result | Evidence |
|---|---|---|
| No source maps in dist | PASS | `ls dist/assets/*.map` → 0 files |
| No secret names in frontend bundle | PASS | grep for `RESEND_API_KEY`, `OPERATOR_DISPATCH_KEY`, `SERVICE_ROLE_KEY`, `SUPABASE_C3_SECRET` in `dist/assets/` → 0 matches |
| Public VITE_ keys only in bundle | PASS | Only `VITE_SUPABASE_URL`, `VITE_SUPABASE_ANON_KEY`, `VITE_R2_PUBLIC_BASE_URL` — all public keys |
| Images load | HOLD_FOR_OPERATOR | Requires live browser |
| Videos load | HOLD_FOR_OPERATOR | Requires live browser |
| Posters load | HOLD_FOR_OPERATOR | Requires live browser |
| No broken logo path | HOLD_FOR_OPERATOR | Requires live browser |
| Missing assets handled gracefully | PASS (code) | `mediaUrl()` returns null on missing rows; components conditionally render on null |

---

## ERROR AND HELD STATES

| Check | Result | Evidence |
|---|---|---|
| Invalid route | PASS | 200, renders intro — no stack trace, no error object, no raw env names |
| Resolver error state | PASS | `EncounterEntry.tsx:49–66` — "This encounter is not available." — public-safe |
| Unknown chamber assignment | PASS | `ChamberRouter.tsx:62` — "This surface is unavailable." — public-safe |
| Loading state | PASS | `EncounterEntry.tsx:31–47` — shows "Registry" text, no internals |
| No internal secret or env names visible | PASS | Bundle scan confirmed zero secret name exposure |

---

## SEO GAP — NOTE

`/map-integrity-governance` is absent from `REGISTRY_ROUTE_METADATA` in `App.tsx:25–80`. On this route, static metadata falls back to generic `REGISTRY_METADATA` ("Integrity Governance for AI Systems") until the DB row provides governed metadata via `ROUTE_UNIT_KEYS["/map-integrity-governance"]`. The route unit key `"map_integrity_governance_landing"` is defined in `ROUTE_UNIT_KEYS` but no static fallback is defined.

**Severity:** P1 SEO gap — not a launch blocker for functionality, but metadata will be generic on direct URL share until fixed.
**Recommendation:** Add `/map-integrity-governance` entry to `REGISTRY_ROUTE_METADATA` before or shortly after launch.

---

## CLOUDFLARE AND PRODUCTION PREFLIGHT

| Check | Result | Evidence |
|---|---|---|
| DNS resolves to measuresregistry.com | HOLD_FOR_OPERATOR | Verify in browser |
| HTTPS valid | HOLD_FOR_OPERATOR | Verify in browser |
| Cloudflare Pages deployment current | HOLD_FOR_OPERATOR | Verify in Cloudflare dashboard that `measures` branch is deployed |
| Production env vars present (by name only) | PARTIAL PASS | Operator confirmed "Cloudflare variables are set" in prior session. All 5 binding names confirmed in `.dev.vars`. Production dashboard not verified this session. |
| No secret values printed | PASS | Confirmed throughout this OAR |
| Pages Functions available at `/api/*` | HOLD_FOR_OPERATOR | Confirm `dispatch-assessment-notification` and `dispatch-connect-notification` are deployed |
| Rollback target identified | PASS | Commit `897b381` (before email dispatch implementation) or `5aec7f9` (test prep). Current HEAD: `ec00151`. |

---

## OPERATOR CHECKLIST — TO RELEASE

- [ ] Device QA: 1440×900, 1366×768, 768×1024, 390×844 — visual pass
- [ ] Intro video loads and plays (or degrades cleanly)
- [ ] Left path reaches assessment, right path reaches about/understand
- [ ] Assessment: 7 questions render, navigation works, scoring completes, contact capture renders
- [ ] Consent fields unchecked on load (verified in code — confirm visually)
- [ ] Assessment submission succeeds in production
- [ ] unDrifted: dispatches appear, Paragraph links resolve
- [ ] Footer links navigate (Privacy, Terms, Contact visible)
- [ ] `/map-integrity-governance` renders MAP cards
- [ ] Stripe live payment mode confirmed (test vs. live) — not accidentally activated
- [ ] DNS resolves at measuresregistry.com
- [ ] HTTPS valid
- [ ] Cloudflare Pages deployment current (measures branch)
- [ ] Production Pages Functions confirm deployed

---

## NOTCHAZZ FLAGS

None raised.

- No architecture changes
- No DB mutations without authorization
- No legal copy changes
- No payment activation
- No SEAT standing exposed
- No c3 Key standing exposed
- No secrets printed
- No stale runtime terminology visible (verified in code; confirmed in browser required)
- Operator not governed

---

## CLOSE

Source-verifiable engineering checks: all PASS.

HOLD_FOR_OPERATOR on live visual QA, production DNS/HTTPS, Cloudflare Pages deployment confirmation, Paragraph link resolution, Stripe mode confirmation, and all browser-dependent checks.

One SEO gap identified: `/map-integrity-governance` absent from `REGISTRY_ROUTE_METADATA`. P1, not launch-blocking.

Return READY_FOR_PUBLIC_RELEASE when operator checklist above is confirmed.

Nothing is invented.

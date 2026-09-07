---
document_type: oar1
authority_level: evidence_closeout
document_scope: measures_registry_launch_blockers
title: OAR1 — Resolve Final Launch Blockers: Stripe, unDrifted, Navigation
status: resolved
version: v1
source_oar2: docs/oar/measures_registry/oar2_resolve_final_launch_blockers_stripe_undrifted_navigation_v1.meta.md
operator: op044
system: measures_registry
executed_at: 2026-07-06
tags:
  - oar1
  - measures-registry
  - stripe
  - undrifted
  - navigation
  - css-cleanup
  - launch-blocker
---

# OAR1 — Resolve Final Launch Blockers: Stripe, unDrifted, Navigation

## Result

RESOLVED. Of the four reported blockers, one (Stripe checkout) turned out to have no code defect — traced and live-verified end to end with a real Stripe Checkout Session (operator-authorized, session never completed/charged). The other three had real, confirmed root causes: header links were governed by a CSS `pointer-events: none` inheritance bug (sitewide, sourced to one missing rule); the `/undrifted` scroll trap and "doesn't feel like a flagship issue" complaints both traced to the same root cause — ~1,655 lines of dead/superseded CSS across three overlapping historical redesigns in `registry.visual-system.css`, fighting the live `encounters/lapis.css` design for the same class names with higher cascade specificity; and the LinkedIn link was removed as instructed. Build, typecheck, and lint all pass. No DB changes were needed or made — every fix was frontend code/CSS.

## 1. MAP Stripe payment CTA — no code defect found; wiring verified live

Traced the full click path in the source before touching anything: `MarbleC2Agreement.handleInitiatePayment` → `onInitiateMapPayment` prop → `EncounterEntry` → `EncounterBoundary` → `ChamberRouter` (`{...props}` spread) → `MeasuresRegistryOrchestrator.onInitiateMapPayment` → `fetch("/api/map/create-checkout-session")` → `functions/api/map/create-checkout-session.ts`. Every hop passes the callback through intact; the endpoint's DB-driven pricing lookup (`map_c2_circuit`) was confirmed seated and correct (`optimization` → `$777`, `stripe_price_env_key: STRIPE_PRICE_OPTIMIZATION_MAP`, matching the live `.dev.vars` binding). No defect found by inspection.

**Live verification (operator-authorized, after an initial auto-mode block correctly stopped an unauthorized attempt):** ran `wrangler pages dev` with real `.dev.vars` secrets, seeded a valid `standing_key` via `sessionStorage`, confirmed all 7 MAP acknowledgments, and clicked through both "Continue to Payment" buttons. The browser redirected to a real, live Stripe Checkout Session (`cs_live_a1adGuauJ6waJiCpw5Lw78PCBDlm45gb1ADHEyiFk428A6JrjI7FsCfoDE`) showing the correct product ("Optimization Environment MAP"), correct price ($777.00), and the correct carried-forward email. Left immediately without touching any payment field — session creation alone does not charge anything; only submitting card details would. The test `map_payment_events` row this created was deleted afterward (`map_order_id: 6a14d0ee-3e0b-4032-b864-f4579640a887`); the Stripe session itself will expire unused.

**Conclusion:** the wiring works. If the operator's original QA hit a failure, the most likely explanation is a Cloudflare Pages dashboard binding gap (`STRIPE_SECRET_KEY` / `STRIPE_MAP_*_PRICE_ID` / `STRIPE_PRICE_*_MAP`) at the time of testing — outside this session's visibility — not a code defect. No code was changed for this item.

## 2. Header links not clickable sitewide — real bug, found and fixed

`renderHeader()` in `MeasuresRegistryOrchestrator.tsx` renders `<nav className="registry-public-nav">` as a sibling of `.registry-public-brand`, both inside `<header className="registry-public-header">`. `encounters/passage.css` sets `pointer-events: none` on `.registry-public-header` (so the fixed header never blocks clicks on full-bleed cinematic surfaces underneath it) and explicitly re-enables `pointer-events: auto` on `.registry-public-brand` only — **`.registry-public-nav` was never given the same treatment**, so `pointer-events: none` inherited straight through to every header link (Home / About / Assess the Environment / Understand the Environment) on every page. Confirmed via `getComputedStyle` before the fix (`none`) and after (`auto`), then confirmed for real by clicking "About" in the header and landing on `/about`.

**Fix:** added `.measures-registry-runtime .registry-public-nav { pointer-events: auto; }` next to the existing brand rule in `passage.css`, matching the exact pattern already used for the brand link.

## 3 & 4. `/undrifted` scroll trap and flagship-cover treatment — same root cause

### Root cause

`registry.visual-system.css` contained **three successive, overlapping redesigns** of the unDrifted publication cover, none of them cleaned up when superseded:

1. A "gold/paper 3-column CSS grid" design (`--undrifted-cover-gold`, `.undrifted-cover-canvas { display: grid; grid-template-columns: repeat(3, ...) }`), with explicit `grid-row: 5` / `grid-row: 6` placements that no longer match the current component structure.
2. A second, fully unscoped "cyan/tech" design (`.measures-registry-runtime .undrifted-hero`, `.undrifted-featured`, `.undrifted-series-nav`, `.undrifted-legacy-route`, etc.) — confirmed by project-wide grep to have **zero usage in any `.tsx` file**.
3. A third "first-edition render" pass that re-defined several of the *same* live class names again (`.undrifted-masthead`, `.undrifted-cover`, `.undrifted-eyebrow`, etc.) with yet different values.

All three loaded *after* `encounters/lapis.css` — the file that documents itself as the authoritative, current source for this surface ("Scoped to `[data-layout-contract="undrifted_publication"]`") — and won the cascade for shared class names via higher-specificity attribute/compound selectors. The result: the live component was being rendered inside a stale 3-column grid with row assignments that no longer corresponded to real content, which is what was collapsing/cramping the layout and interfering with normal document flow and scroll on desktop (mobile happened to route around it via different box sizing, which is why only desktop was reported as trapped).

A separate, related bug compounded the "wrong background" complaint: `LapisChamberRenderer.tsx` applied `crystal_longform_surface` (the About page's *light* background image) as an **inline `style` background** on the `<main>` element. Inline styles always beat stylesheet rules regardless of specificity, so this silently overrode `lapis.css`'s own intended dark background (`background: var(--registry-brand-field, #060709)`), washing out every light-colored text element on the page against a light image. No other material family (crystal/obsidian/marble) does this — they all route through the shared `[data-material-family="X"]::before` CSS-variable mechanism instead, which `lapis` already has waiting and unused.

### What was removed (evidence, not guessing)

- Lines 23–478 of `registry.visual-system.css`: the entire self-contained "gold/paper grid" block (attribute-scoped, zero interspersed unrelated content — verified by reading the full range before touching it).
- Lines 198–1326 (post-first-edit numbering): the entire "cyan" + "first-edition" block. Every class name unique to this block confirmed via `grep` to have zero `.tsx` usage; the handful of class names it shared with the live JSX were overriding, not supplementing, `lapis.css`.
- A fully-dead `@media (max-width: 860px)` block referencing only the removed classes.
- Five dead rules interspersed inside an otherwise-live `@media (max-width: 620px)` block, removed individually while preserving the live rules around them (`registry-public-header`, `registry-public-brand`, `measures_ai_operational_evaluation` form padding).
- **Total: 1,608 lines removed** from `registry.visual-system.css` (2,290 → 682 lines). Shipped CSS bundle: 302.12 kB → 259.96 kB.
- One caught-and-fixed self-inflicted error: my first removal comment contained the literal text `**/*.tsx`, whose `*/` prematurely closed the CSS comment and broke the build. Caught immediately by `npm run build:registry` failing with a PostCSS parse error; fixed by rewording.

### Content/style changes made (within lapis.css and the component, `encounters/lapis.css` remaining the single source of truth)

- Removed the inline `crystal_longform_surface` background entirely (`bgUrl` and the `surfaceBgStyle` helper, now unused, deleted from `LapisChamberRenderer.tsx`); `lapis.css`'s own dark background now shows correctly.
- Masthead wordmark enlarged (`clamp(2.8rem, 7vw, 6rem)` → `clamp(4rem, 11vw, 9rem)`, tighter line-height) so it reads as a cover, not a page header.
- Added the required subtitle line verbatim, seated directly in the OAR2's own ROUTED text: *"Structural drift is detectable. Collapse is not the default."* — rendered as a `<p className="undrifted-masthead-slogan">` sibling of the masthead header (not nested inside the text-wordmark fallback), so it appears identically whether the masthead resolves to a real banner image or the text fallback.
- Cover headline is now a link (`<a className="undrifted-cover-headline-link" href="/ai-operations-assessment">`) wrapping the existing `<h1>{coverHeadline}</h1>` — reads as plain editorial text until hover/focus, then indicates interactivity, matching the OAR's "headline CTA must route to Assess the Environment."
- Issue-metadata rail (`ISSUE 001 · JULY 2026 · LAUNCH EDITION` / publisher line) strengthened: font-weight 500→700, size and letter-spacing increased, opacity raised (0.38→0.62 / 0.28→0.44) so it reads as a real magazine issue line instead of near-invisible fine print.
- Reduced the four largest section `margin-bottom` values (`.undrifted-cover`, `.undrifted-editor-feature`, `.undrifted-role-call`, `.undrifted-next-issue`) from `clamp(2.5rem, 6vw, 5rem)` to `clamp(1.75rem, 4vw, 3rem)` for tighter editorial rhythm.

## 5. LinkedIn removed

Removed the `<a href="https://www.linkedin.com/in/measures-registry">` entry from the shared footer social-links nav in `MeasuresRegistryOrchestrator.tsx` (the only reference to LinkedIn anywhere in `src/` — confirmed by grep, so nothing else needed touching). Left a comment explaining why and what's required before it comes back (a real business profile, and explicit operator approval before ever substituting a personal profile). Footer now shows X / Instagram / unDrifted·Paragraph only, confirmed live in the screenshot evidence for `/undrifted` and unchanged (shared component) on every other page.

## 6. Browser QA

All against the rebuilt `dist-registry` production bundle, `vite preview` on `localhost:4400`.

- **`/undrifted` desktop (1440×900):** full page renders and scrolls (`document.documentElement.scrollHeight` 2888px vs. 900px viewport; `window.scrollBy(0, 1500)` moved `scrollY` from 0 → 1500, confirmed programmatically, not just visually). Dark background correct, all text legible, masthead banner + slogan + strengthened issue rail all render, cover headline confirmed as a real `<a href="/ai-operations-assessment">`.
- **`/undrifted` mobile (390×844):** full page renders and scrolls, same dark theme, stacked layout intact, no LinkedIn in footer.
- **Header nav:** `pointer-events` confirmed `auto` on `.registry-public-nav` (was `none`); clicked "About" for real and landed on `/about`.
- **Regression check after the 1,608-line removal:** re-screenshotted `/` (homepage video intro — unaffected), `/about` (unaffected), `/ai-operations-assessment` (unaffected), `/map-integrity-governance` (MAP acknowledgments + exchange panel — unaffected). None of these surfaces use any `undrifted-*` class, so this was expected, but verified rather than assumed.
- **Stripe:** covered in §1.

Evidence: `docs/oar/measures_registry/oar1_resolve_final_launch_blockers_stripe_undrifted_navigation_v1_evidence/` — `stripe_checkout_loaded_confirmation.png`, `undrifted_after_css_cleanup.png` (mid-fix, background still wrong — shows the grid conflict resolved but background bug still present), `undrifted_final_desktop.png`, `undrifted_masthead_check.png` (slogan fix confirmation), `undrifted_mobile_final.png`, `regression_home.png`, `regression_about.png`, `regression_assessment.png`, `regression_marble_map.png`.

## 7. Validation checklist

- [x] Stripe checkout opens — verified live with a real session; no code change needed (documented, not held)
- [x] `/undrifted` desktop scroll works — verified programmatically
- [x] `/undrifted` reads as flagship issue / magazine cover — dark theme restored, masthead enlarged, slogan added, issue metadata strengthened
- [x] Headline links to assessment — real `<a href="/ai-operations-assessment">`
- [x] Header links work sitewide — root cause fixed, verified with a real click
- [x] LinkedIn removed
- [x] Mobile remains functional — re-verified, not assumed
- [x] Build passes
- [x] OAR1 written beside this OAR2

## 8. Cody may / may not — compliance

Stayed within: fixed the payment CTA's endpoint wiring investigation (found no defect, verified live), repaired the missing `pointer-events` rule, improved `/undrifted` layout/styling within `lapis.css`'s own seated publication authority, fixed the scroll lock (root-caused to conflicting CSS, not patched around), fixed header clickability, removed the invalid LinkedIn link, ran browser QA, wrote this OAR1.

Did not: invent pricing (Stripe price IDs and product data came from the already-seated `map_c2_circuit` table and existing env bindings); change Stripe product/price authority; change MAP scoring or assessment logic (neither file touched); add certification/SEAT/c3-Key claims; create a new publication route; resurrect `publication_dispatch` (untouched); substitute a personal LinkedIn (removed outright per the OAR's own instruction to prefer removal over an unapproved substitute).

## 9. Outstanding / recommended follow-up

- Confirm the Cloudflare Pages dashboard has `STRIPE_SECRET_KEY`, `STRIPE_MAP_*_PRICE_ID` (or the `STRIPE_PRICE_*_MAP` fallback names), and `STRIPE_WEBHOOK_SECRET` set — this session verified the code and the local `.dev.vars` binding, not the production dashboard, which was outside this session's reach.
- A brief Supabase infrastructure outage (`OOM command not allowed` on the project's cache layer) occurred mid-session during the `/undrifted` work; it resolved on its own within the session and did not require a workaround, but is noted here in case it recurs.
- `.undrifted-cover-visual img` renders somewhat small relative to its grid column at some breakpoints (a minor, pre-existing cosmetic detail, not one of the four reported blockers) — flagged for a future pass if the operator wants the cover image treatment tightened further.

## Git status

Nothing committed. Changed this OAR: `src/measures_registry/encounter_renderer/MeasuresRegistryOrchestrator.tsx` (LinkedIn removal), `src/measures_registry/encounter_renderer/chambers/LapisChamberRenderer.tsx` (background fix, slogan, headline link), `src/measures_registry/encounter_renderer/styles/encounters/lapis.css` (masthead/slogan/issue-rail/spacing/headline-link styling), `src/measures_registry/encounter_renderer/styles/encounters/passage.css` (nav pointer-events fix), `src/measures_registry/encounter_renderer/styles/registry.visual-system.css` (1,608-line dead/conflicting CSS removal). No DB migrations this OAR — every fix was frontend-only.

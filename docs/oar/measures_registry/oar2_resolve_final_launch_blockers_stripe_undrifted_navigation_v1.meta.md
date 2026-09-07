---
document_type: oar2
title: OAR2 — Resolve Final Launch Blockers: Stripe, unDrifted, Navigation
status: proposed
version: v1
operator: op044
system: measures_registry
---

# OAR2 — Resolve Final Launch Blockers: Stripe, unDrifted, Navigation

## OBSERVED

Operator QA found three launch blockers:

1. MAP payment confirmation CTA does not open Stripe checkout.
2. `/undrifted` is active but does not yet feel like the flagship issue / magazine cover.
3. Header links are not clickable across pages.
4. LinkedIn footer/social link does not open to a valid business profile and should be removed for now.

Mobile `/undrifted` scroll works. Desktop/laptop appears visually trapped or non-scrollable.

## ALIGNED

Frontend renders seated standing only.

Payment CTA must reach the existing governed Stripe checkout path.

`/undrifted` is the lead publication surface and should feel like a full flagship issue dedicated to Measures Registry.

Header navigation must work sitewide.

Invalid social links must not remain active.

Cody executes from OAR2 only. :contentReference[oaicite:0]{index=0}

## ROUTED

### 1. Fix MAP Stripe handoff

Inspect and repair the MAP payment CTA on `marble_chamber_C2_agreement`.

Required outcome:

- clicking final payment CTA calls the correct server-side checkout endpoint
- Stripe Checkout opens
- selected MAP pathway is preserved
- price is resolved from seated MAP authority
- no hardcoded pricing
- no MAP logic change
- no assessment logic change
- no certification / SEAT / c3 Key claims added

Validate:

- local or safe test-mode Stripe checkout opens
- if live key prevents safe test, document held reason and verify endpoint wiring without charge

### 2. Elevate `/undrifted` as flagship issue

Treat `/undrifted` as an editorial magazine cover, not a side page.

Required direction:

- restore/seat correct publication background; do not use unrelated crystal background
- make masthead larger and more cover-like
- add subtitle/slogan directly with title:
  - Structural drift is detectable. Collapse is not the default.
- make launch headline a link into the assessment path
- headline CTA must route to Assess the Environment
- reduce unused negative space
- strengthen issue metadata styling
- make Issue 001 feel dedicated to Measures Registry
- keep dark editorial / publication authority
- do not turn it into a SaaS marketing homepage

### 3. Link behavior

Fix header navigation across all pages.

Verify clickable:

- Home
- About
- Assess the Environment
- Understand the Environment

Remove LinkedIn link until a valid business/profile destination is seated.

Do not replace with personal LinkedIn unless operator explicitly approves.

### 4. Scroll behavior

Desktop/laptop `/undrifted` must scroll normally.

Check for:

- overflow hidden
- fixed 100vh container
- pointer-events overlay
- scroll lock inherited from encounter surfaces

Mobile scroll must remain working.

### 5. Browser QA

Validate desktop and mobile:

- `/undrifted`
- `/about`
- assessment entry
- MAP payment confirmation
- Stripe handoff
- header links
- footer/social links

## CODY ROLE

Cody may:

- fix payment CTA wiring to existing checkout endpoint
- repair endpoint route if missing
- improve `/undrifted` layout/styling within seated publication authority
- fix scroll lock
- fix header clickability
- remove invalid LinkedIn link
- run browser QA
- write OAR1 with screenshots and validation

Cody may not:

- invent pricing
- change Stripe product/price authority
- change MAP scoring
- change assessment logic
- add certification/SEAT/c3 Key claims
- create a new publication route
- resurrect `publication_dispatch`
- use personal LinkedIn without approval

## VALIDATION

This OAR resolves when:

- Stripe checkout opens or safe held reason is documented
- `/undrifted` desktop scroll works
- `/undrifted` reads as flagship issue / magazine cover
- headline links to assessment
- header links work sitewide
- LinkedIn is removed
- mobile remains functional
- build passes
- OAR1 is written beside this OAR2

## EXPECTED OAR1

docs/oar/measures_registry/oar1_resolve_final_launch_blockers_stripe_undrifted_navigation_v1.meta.md

## CLOSE

Two blockers remain: payment handoff and flagship publication polish.

Resolve the active seam before expanding.

Codex holds.
Field structures.
Measures registers.
Chazz validates.
Cody implements.
src renders.
CSS executes.

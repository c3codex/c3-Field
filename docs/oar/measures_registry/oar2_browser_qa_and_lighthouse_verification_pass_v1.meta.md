---
document_type: oar2
authority_level: working
document_scope: measures_registry_browser_qa
title: OAR2 — Browser QA and Lighthouse Verification Pass
status: proposed
version: v1
operator: op044
system: measures_registry
native_stack:
  codex: database
  field: schema
  measures: registry
  chazz: systems
  cody: frontend_executor
tags:
  - oar2
  - measures-registry
  - browser-qa
  - lighthouse
  - mobile-qa
  - performance-validation
  - css-seams
  - launch-stabilization
---

# OAR2 — Browser QA and Lighthouse Verification Pass

## OBSERVED

Measures Registry has completed major AI visibility and delivery authority passes:

- semantic visibility restored
- crawlable institutional content expanded
- institutional metadata seated
- Article/BlogPosting schema generated
- founder authority seated
- route-level bundle splitting implemented
- media loading attributes normalized
- font render-blocking reduced

The remaining unresolved performance and presentation risks require a real browser.

Previous performance OAR could not measure:

- Lighthouse score
- LCP
- CLS
- real network waterfall
- mobile layout behavior
- video playback timing
- visual seams

This is now a browser verification surface.

## ALIGNED

This pass measures and stabilizes what is already seated.

It does not create new architecture.

It does not invent authority.

Browser QA must preserve:

- encounter architecture
- DB-first rendering
- registry-driven routing
- governed style profiles
- media controls
- semantic authority already seated

## ROUTED

### 1. Run browser-based Lighthouse audits

Run Lighthouse or equivalent browser audit for:

- homepage /
- /about
- /undrifted
- /ai-operations-assessment

Record:

- Performance
- Accessibility
- Best Practices
- SEO
- LCP
- CLS
- INP or TBT
- render-blocking resources
- largest network assets

Report before making fixes where possible.

### 2. Verify AI visibility output in browser

Confirm deployed or local browser-rendered output includes:

- one H1 on homepage
- crawlable H2 structure
- valid nav anchor links
- JSON-LD present
- /llms.txt returns 200
- /robots.txt returns 200
- /sitemap.xml returns 200
- BlogPosting schema present on /undrifted
- Person and Organization JSON-LD use seated DB metadata

### 3. Mobile QA

Test mobile viewport behavior for:

- homepage crystal seat intro
- assessment path
- About page
- unDrifted page
- result/continuance surfaces if reachable

Confirm:

- no CTA off-frame
- no overflow clipping
- media frame remains stable
- readable copy
- clickable links/buttons
- no header/footer collision
- no invisible navigation traps

### 4. Video and audio QA

Verify:

- first encounter video loads and plays as intended
- downstream videos do not preload too early
- video controls appear where required
- audio behavior matches current held/active standing
- no stutter caused by code splitting
- poster/fallback behavior is acceptable where available

Do not re-enable held tones unless separately seated.

### 5. CSS seam QA

Inspect visually for remaining governed-style seams:

- header consistency
- button placement
- video frame containment
- chamber style profile consistency
- watermark/brand mark alignment
- mobile typography
- duplicate or conflicting styles visible in browser

Fix only safe visual seams.

If a seam requires broader CSS refactor, document it instead of rushing.

### 6. Layout stability

Use browser tools or Lighthouse evidence to identify CLS sources.

Fix safe issues:

- reserve media frame space
- preserve aspect ratios
- prevent late CTA shifts
- prevent image/grid jumps
- avoid layout shifts from fonts where possible

Do not invent image dimensions where metadata is unknown and distortion risk exists.

### 7. Network and asset review

Identify largest loaded assets per route.

Report:

- JS chunks loaded
- CSS loaded
- images loaded
- videos loaded
- fonts loaded

Flag any assets requiring operator-side compression or removal.

Do not delete public assets without operator confirmation.

### 8. Paragraph sameAs micro-gap

If safe and already seated by operator approval, add Paragraph/unDrifted social link metadata:

- platform: Paragraph
- name: unDrifted
- url: https://paragraph.com/@undrifted
- standing: active

Then verify Organization and Person sameAs include Paragraph from DB state.

Do not hardcode Paragraph into JSON-LD.

### 9. Validation

This OAR resolves successfully when:

- Lighthouse/browser findings are recorded
- mobile QA findings are recorded
- major safe browser-visible seams are fixed
- CLS/LCP issues are either improved or documented
- media playback behavior is verified
- semantic outputs remain intact
- Paragraph sameAs gap is either seated or explicitly held
- no encounter architecture is replaced
- no DB authority is bypassed

## CODY ROLE

Cody may:

- run browser audits if tooling is available
- inspect rendered DOM
- fix safe browser-visible seams
- adjust CSS where visual no-op or improvement is verifiable
- add Paragraph sameAs only as DB-seated metadata
- rebuild dist-registry
- write OAR1 validation evidence

Cody may not:

- invent authority
- hardcode social/schema values
- create new routes
- replace encounter architecture
- collapse style profiles
- remove media without operator approval
- re-enable held audio
- claim Lighthouse results without running Lighthouse

## VALIDATION OUTPUT

Return:

- audited routes
- Lighthouse or browser metrics
- mobile QA notes
- video/audio QA notes
- DOM/schema verification notes
- CSS fixes made
- assets flagged
- Paragraph sameAs disposition
- changed files
- remaining launch blockers if any

## EXPECTED OAR1

docs/oar/measures_registry/oar1_browser_qa_and_lighthouse_verification_pass_v1.meta.md

## CLOSE

The structure is seated.

Now the browser must prove it.

Codex holds.
Field structures.
Measures registers.
Chazz validates.
Cody implements.
src renders seated state only.

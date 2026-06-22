---
document_type: oar1
authority_level: closeout
document_scope: undrifted_publication_cover_style_contract
title: OAR1 — Style unDrifted Publication Cover to Approved Chazz Render
status: deployed_browser_qa_pending
version: v1
operator: op044
system: measures_registry
source_oar2: docs/oar/measures_registry/oar2_style_undrifted_publication_cover_to_approved_chazz_render_v1.meta.md
final_seat_standing: held_browser_verification
---

# OAR1 — Style unDrifted Publication Cover to Approved Chazz Render v1

## Closeout

```yaml
closeout:
  status: deployed_browser_qa_pending
  execution_started: true
  layout_implemented: true
  style_contract_applied: true
  facebook_absent: true
  responsive_contract_applied: true
  root_encounter_unaltered: true
  assessment_logic_unaltered: true
  map_payment_unaltered: true
  build_deployed: true
  browser_qa: not_verified
  final_seat_standing: held_browser_verification
```

## Files Changed

```yaml
files_changed:
  - src/measures_registry/registered_runtime/renderers/RegisteredStructuralDrift.tsx
  - src/measures_registry/registered_runtime/styles/registry.visual-system.css
  - dist-registry/ (rebuilt — new asset hashes BJOLQRKr.js, BNy-LR1b.css)
```

## Layout Implementation

### Surface contract

```yaml
route: /undrifted
type: publication_cover
sequence_member: false
pillar: Measures Registry
header_nav: false
footer: system footer inside undrifted-connect-footer
facebook: absent
```

### Five-section structure

#### Section 1 — Top bar (`undrifted-topbar`)

- Left: unDrifted wordmark (serif, `un` light + `Drifted` bold) + separator + "Measures Registry Publication" label
- Right: X, Instagram, LinkedIn social icons (filtered — Facebook absent)
- Social links sourced from DB `publicationLandingUnit.metadata.social_links`
- Top bar replaces previous hero top padding — `undrifted-shell` `padding-top` overridden to `0` for undrifted layout contract

#### Section 2 — Hero Dispatch (`undrifted-hero-dispatch`)

Two-column desktop grid (1.1fr / 0.9fr):

Left column (`undrifted-dispatch-left`):
- Eyebrow: "Dispatch" (cyan, uppercase, 0.68rem)
- Headline: "AI Isn't Broken. Systems Are." (serif, clamp 2.2–3.6rem)
- Media box (`undrifted-dispatch-media`): 16:9 video, `questions_ungoverned_systems_cannot_answer_video` if seated, `controls playsInline preload="metadata"` (not autoplay)
- Paragraph: "Dispatches from Measures Registry on structural drift, AI operations, and governed environments."

Right column (`undrifted-dispatch-right`):
- Eyebrow: "Diagnostic Intake" (cyan)
- Headline: "Assess the Environment" (serif, clamp 1.6–2.4rem)
- Paragraph: "Begin where drift becomes visible…"
- CTA: solid blue button (`undrifted-cta-primary`) → `/ai-operations-assessment`
  - If `evalReport` present: shows "Continue to Assessment Package" button instead
- Bullets (`undrifted-dispatch-bullets`): Detect drift / Measure condition / Correct authority path / Govern continuity

#### Section 3 — Insights (`undrifted-insights`)

- Eyebrow: "Insights"
- Headline: "Read unDrifted"
- 2-column article grid (`undrifted-insights-grid`)
- Each card (`undrifted-insight-card`): cover image (left, 1:1) + body (right: h3 title, description if seated, "Read Article →" or "Open Article Standing" button if no URL)
- Article data sourced from DB `publicationLandingUnit.metadata.featured_article_set`
- Article covers from `agentsWithKeysCoverUrl` / `fablesAndMythsCoverUrl` via `manifestCover()`

#### Section 4 — Lower Dispatch Cards (`undrifted-dispatch-cards`)

Three-column desktop grid:

Card 1 — About:
- Eyebrow: "About"
- Headline: "About Measures Registry"
- Body: `aboutBody` from DB, or fallback: "Measures Registry provides the structure…"
- CTA: "About Measures Registry →" → `/about-measures-registry`

Card 2 — c3 Field:
- Eyebrow: "Leadership"
- Headline: "c3 Field"
- Body: "Operational leadership and transformation support…"
- CTA: "c3 Field / Our Story →" → `https://c3field.online`

Card 3 — Visual (`undrifted-dispatch-card--visual`):
- Headline: "Leadership for Governed Environments."
- CTA: "Explore c3 Field →" → `https://c3field.online`
- Background: cyan gradient emphasis, blue border tint

#### Section 5 — Connect Footer (`undrifted-connect-footer`)

- "Connect" label (cyan, uppercase)
- Social nav: X, Instagram, LinkedIn (Facebook absent)
- `renderSystemFooter()` appended

### Route dispatch verification

```yaml
dispatch_routes:
  assess_the_environment: /ai-operations-assessment
  about_measures_registry: /about-measures-registry
  c3_field_our_story: https://c3field.online
  explore_c3_field: https://c3field.online
  facebook: absent
```

## Visual System

```yaml
palette:
  --undrifted-bg: "#030608"
  --undrifted-panel: "#070b0f"
  --undrifted-graphite: "#111820"
  --undrifted-text: "#e8edf2"
  --undrifted-muted: "#aab4bf"
  --undrifted-blue: "#1f8cff"
  --undrifted-cyan: "#59c7ff"
  --undrifted-line: "rgba(180, 210, 255, 0.18)"
  --undrifted-line-strong: "rgba(70, 145, 255, 0.55)"

typography:
  headings: Cormorant Garamond, Georgia, serif
  body: Inter, system-ui, sans-serif

cta_button:
  type: solid
  background: --undrifted-blue
  hover: --undrifted-cyan with dark text

card_style:
  border: 1px --undrifted-line
  border-radius: 8px
  background: cyan tint gradient + panel surface
  box-shadow: 0 1rem 2.6rem rgba(0,0,0,0.22)
```

## Responsive Contract

```yaml
desktop:
  hero: two columns (1.1fr / 0.9fr)
  insights: two columns
  dispatch_cards: three columns

tablet_860px:
  hero: one column (stacked)
  insights: one column
  dispatch_cards: one column

mobile_620px:
  topbar: flex-column
  insight_card: single column
  hero_h1: 2rem
```

## Mutation Confirmation

```yaml
mutation_confirmation:
  renderer_mutation: true
  renderer_mutation_scope: >
    RegisteredStructuralDrift index variant fully replaced with Chazz render:
    undrifted-topbar, undrifted-hero-dispatch, undrifted-insights, undrifted-dispatch-cards,
    undrifted-connect-footer. Old undrifted-hero, undrifted-principles, undrifted-grid,
    undrifted-social-strip, undrifted-evaluation sections removed.
    Article overlay logic preserved. evalReport CTA conditional preserved.
    Legacy structural-drift route notice preserved.
  css_mutation: true
  css_mutation_scope: >
    registry.visual-system.css: ~350 lines of Chazz render CSS added.
    New classes: undrifted-topbar, undrifted-topbar-brand, undrifted-wordmark,
    undrifted-topbar-sep, undrifted-topbar-label, undrifted-topbar-social,
    undrifted-eyebrow, undrifted-hero-dispatch, undrifted-dispatch-left,
    undrifted-dispatch-media, undrifted-dispatch-right, undrifted-cta-primary,
    undrifted-dispatch-bullets, undrifted-insights, undrifted-insights-header,
    undrifted-insights-grid, undrifted-insight-card, undrifted-insight-cover,
    undrifted-insight-body, undrifted-dispatch-cards, undrifted-dispatch-card,
    undrifted-dispatch-card--visual, undrifted-connect-footer.
    Responsive breakpoints at 860px and 620px.
  db_mutation: false
  content_mutation: false
  map_mutation: false
  payment_mutation: false
  social_campaign_mutation: false
  publication_mutation: false
  root_encounter_mutation: false
  assessment_logic_mutation: false
```

## Deployment

```yaml
deployment:
  commit: 6c6ab17
  branch: measures
  remote: https://github.com/c3codex/c3-Field.git
  push_confirmed: true
  deploy_target: measuresregistry.com (Cloudflare Pages)
  asset_hash_js: index-BJOLQRKr.js
  asset_hash_css: index-BNy-LR1b.css
```

## Browser QA

```yaml
browser_qa:
  status: not_verified
  reason: Browser verification tooling unavailable in this execution context.
  gate_rule: "If browser verification tooling is unavailable: STOP. Do not mark verification complete."
  required_proof:
    - /undrifted renders topbar (wordmark, Measures Registry Publication, social icons)
    - hero two-column layout on desktop
    - video present (not autoplay) in dispatch left
    - Assess the Environment button routes to /ai-operations-assessment
    - insights section shows 2 article cards with covers
    - dispatch cards section shows 3 cards
    - About card routes to /about-measures-registry
    - Leadership cards route to https://c3field.online
    - connect footer shows social icons
    - Facebook absent in topbar, footer, and anywhere else
    - LinkedIn present if seated in DB
    - mobile stack at 860px
    - laptop screenshot
    - mobile screenshot if available
    - console/network findings
```

## Final Standing

```yaml
repair_standing: deployed_browser_qa_pending
layout_implemented: true
style_contract_applied: true
facebook_absent: true
responsive_contract_applied: true
build_deployed: true
browser_qa: not_verified
final_seat_standing: held_browser_verification

seat_advancement:
  current: held
  next: VERIFIED
  requires: browser QA screenshots confirming Chazz render across desktop and mobile
```

SEAT remains HELD pending browser verification. Chazz render deployed. No DB mutations. No encounter/assessment/payment mutations.

---
document_type: oar2
authority_level: urgent
document_scope: undrifted_publication_cover_style_contract
title: OAR2 — Style unDrifted Publication Cover to Approved Chazz Render
status: proposed
version: v1
operator: op044
system: measures_registry
process_key: style_undrifted_publication_cover_to_approved_chazz_render
---

# OAR2 — Style unDrifted Publication Cover to Approved Chazz Render v1

## OBSERVED

/undrifted currently renders as a long publication dispatch list.

It technically loads, but does not match the approved visual intent.

Approved intent:

/undrifted is a Measures Registry publication cover and dispatch surface.

It should feel like a polished launch cover, not a plain list.

## ALIGNED

Implement the approved Chazz render style.

Use existing seated media.

Do not invent content.

Do not alter root encounter.

Do not alter assessment logic.

Do not alter MAP/payment.

Do not publish Paragraph content.

Do not add Facebook.

## STYLE CONTRACT

Surface:

- route: /undrifted
- type: publication_cover
- sequence_member: false
- pillar: Measures Registry
- footer only
- no header nav

Visual direction:

- dark precision interface
- black/navy background
- cyan/blue accents
- white serif headlines
- clean sans body copy
- thin divider lines
- card-based layout
- generous spacing
- polished editorial/technical feel

## REQUIRED LAYOUT

### 1. Top bar

Left:

- unDrifted wordmark

Center:

- Measures Registry Publication

Right:

- X
- Instagram
- LinkedIn if seated

Facebook must be absent.

### 2. Hero / diagnostic intake section

Two-column desktop layout.

Left column:

- eyebrow: Dispatch
- headline: AI Isn’t Broken. Systems Are.
- media box using questions_ungoverned_systems_cannot_answer media
- short paragraph:
  Dispatches from Measures Registry on structural drift, AI operations, and governed environments.

Right column:

- eyebrow: Diagnostic Intake
- headline: Assess the Environment
- short paragraph:
  Begin where drift becomes visible. This assessment reveals structural gaps, operational misalignments, and governance risks across your AI environment.
- CTA button:
  Assess the Environment
  route: /ai-operations-assessment
- four short bullets:
  Detect drift
  Measure condition
  Correct authority path
  Govern continuity

### 3. Article section

Eyebrow:

- Insights

Headline:

- Read unDrifted

Render two article cards only:

- Agents With Keys
- Fables and Myths

Each card must include:

- seated image/media if available
- article title
- one-line description if seated
- Read Article action

If article URL is not seated, render held state without broken link.

### 4. Lower dispatch section

Three-card desktop layout.

Card 1:

- eyebrow: About
- headline: About Measures Registry
- supporting paragraph
- CTA: About Measures Registry
- route: /about-measures-registry

Card 2:

- eyebrow: Leadership
- headline: c3 Field
- supporting paragraph
- CTA: c3 Field / Our Story
- route: https://c3field.online

Card 3:

- media/image emphasis if available
- headline: Leadership for Governed Environments.
- CTA: Explore c3 Field
- route: https://c3field.online

### 5. Footer

Footer includes:

- Connect label
- X
- Instagram
- LinkedIn if seated
- copyright

No Facebook.

## RESPONSIVE CONTRACT

Desktop:

- hero uses two columns
- articles use two cards
- lower section uses three cards

Mobile:

- stack sections vertically
- media above text where needed
- preserve spacing
- no clipped text
- no browser-default buttons
- no unstyled blue links

Publication cover may scroll.

Encounter surfaces remain no-scroll.

## VALIDATION

Return:

- files changed
- /undrifted before/after screenshot if available
- desktop QA
- mobile QA if available
- social icon state
- route click verification:
  - /ai-operations-assessment
  - /about-measures-registry
  - https://c3field.online
- confirmation Facebook absent
- deployment commit hash

## EXPECTED OAR1

docs/oar/measures_registry/oar1_style_undrifted_publication_cover_to_approved_chazz_render_v1.meta.md

## MEDIA AUTHORITY + MEDIA MAP PRECHECK

### OBSERVED

Current deployment review revealed two distinct conditions:

1. Existing route content is rendering from legacy runtime surfaces.
2. Approved publication-cover styling assumes media availability that has not yet been verified through registry media mapping.

This creates risk of:

- renderer substitution
- missing media fallbacks
- hardcoded URLs
- route-specific asset loading
- styling built against assets that are not seated

### ALIGNED

Codex remains authority.

Renderer consumes mapped media only.

Media is not referenced by bucket title, file path, component import, or hardcoded URL.

All publication-cover media must resolve through registry media mapping before styling implementation proceeds.

### ROUTED

#### Media Map Verification Required

Verify existing registry media-map standing for:

- measures_registry_logo
- ai_isnt_broken_landing
- questions_ungoverned_systems_cannot_answer
- undrifted_fill

Return for each:

- media_key
- bucket object title
- storage location
- resolved URL behavior
- release_state
- access_state
- surface usage
- renderer target

#### Missing Media Rule

If any required media asset exists in storage but does not exist in registry mapping:

STOP.

Return required INSERT payload.

Do not substitute.

Do not hardcode.

Do not deploy fallback media.

#### Surface Assignment

measures_registry_logo
→ publication masthead and About card logo

ai_isnt_broken_landing
→ hero background / AI Isn’t Broken visual field

questions_ungoverned_systems_cannot_answer
→ hero media panel

undrifted_fill
→ leadership callout card

#### Runtime Validation

Before style acceptance:

- DB media map verified
- renderer receives mapped asset
- asset loads from runtime map
- no direct bucket references remain
- no route-owned media truth remains

### VALIDATION

OAR completes only when required media assets are verified or missing media-map rows are returned.

No styling approval may occur against assumed media state.

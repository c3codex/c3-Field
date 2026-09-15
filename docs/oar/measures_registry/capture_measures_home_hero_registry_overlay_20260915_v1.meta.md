---
document_type: capture
system: measures_registry
title: Measures Website Hero — Registry Overlay on Approved Background
status: implemented_code_asset_seating_pending
date: 2026-09-15
branch: measures
---

# Determination

The Measures Registry homepage hero will use the operator-approved person-at-interface image as a background/media layer only.

Public wording is not baked into the image.

Registry / encounter data remains the authority for hero content. CSS owns placement, scale, responsive behavior, contrast treatment, and interaction presentation.

# Approved visible hero content

- Headline: **Deploy AI with confidence.**
- Body: **Measures Registry helps organizations evaluate the operating environment before AI is implemented or expanded.**
- Support: **Find out whether the environment is ready — and what needs attention before deployment.**
- Primary action: **Assess the Environment**
- Assessment route: **/ai-operations-assessment**

No invented slogans or generic AI-marketing language are authorized on the hero.

# Implementation

Implemented on branch `measures`:

- `CrystalSeatRenderer.tsx`
  - homepage now renders live Registry content over a background image
  - no hero copy is baked into media
  - primary CTA routes to the existing assessment surface
  - background resolves from `hero_background`, falling back to existing `hero_poster`

- `registryResolver.ts`
  - `hero_background` added to fetched media roles

- `crystal.css`
  - desktop/mobile overlay composition
  - live text placement
  - contrast gradient
  - real interactive CTA

- migration
  - seats approved hero copy in `measures_encounter_def.metadata.intro_copy`

# Asset custody

The approved conversation asset is `hero_background_mr.png` / derived WebP.

The code is prepared to consume Registry media role `hero_background`. The exact approved asset must be uploaded to the governed Measures media location and seated to that media role before the new background can replace the current `hero_poster` fallback in production.

Do not substitute or regenerate the visual during seating.

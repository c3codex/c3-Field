---
document_type: oar1
authority_level: evidence_closeout
document_scope: measures_registry_css_authority_and_home_hero_repair
title: OAR1 - Audit and Correct Measures Registry CSS Authority and Home Hero Passage
status: implemented_pending_production_readback
version: v1
operator: op044
system: measures_registry
executed_at: 2026-09-15
---

# Result

The homepage failure was not treated as a selector-specific workaround.

The audit found two structural problems:

1. `src/index.css` still held Measures Registry runtime authority even though the active FREE renderer already has a dedicated scoped stylesheet system.
2. The approved website hero had been placed into `crystal_seat_intro`, even though the existing runtime already defines two distinct surfaces:
   - `crystal_seat_intro` = intro media passage
   - `measures_registry_home` = actual homepage

The repair restores that architecture.

# CSS audit findings

Before this pass:

- `src/index.css`: 7,867 lines
- Measures-related selectors detected in the global file: 574
- prior cleanup evidence had already identified a large legacy long-form Measures block as unused but held for a dedicated follow-up

Direct current source searches confirmed no live TS/TSX usage for the legacy families:

- registry-field-guide*
- registry-featured-publication*
- registry-education-resources*
- registry-structural-preview*
- registry-diagnostic-entry*
- registry-diagnostic-actions*
- registry-diagnostic-encounter*
- registry-diagnostic-threshold*
- registry-diagnostic-recognition*
- registry-publication-subscription*
- registry-cohort-core*
- registry-cohort-phases*
- registry-cohort-review*
- registry-cohort-conversion*

The two live families mixed into that historical block already have active scoped authority:
- `registry-system-footer` -> `registry.footer.css`
- `registry-publication-subscribe-capture` -> `encounters/lapis.css`

Therefore the legacy block was removed from the global stylesheet.

After this pass:

- `src/index.css`: 7,205 lines
- Measures-related selectors remaining in the global file: 435
- 640 lines removed in this bounded dead-zone correction

This is not a claim that `index.css` is fully normalized. It is materially reduced, and the root Measures authority conflict that affected the homepage is removed.

# Authority correction

Removed the duplicate base `.measures-registry-runtime` authority from `src/index.css`.

Moved its runtime aliases/tokens into:

`src/measures_registry/encounter_renderer/styles/registry.tokens.css`

The active Measures stylesheet entry remains:

`src/measures_registry/encounter_renderer/styles/registry.encounter.css`

# Passage correction

Restored the intended public sequence:

`/ -> crystal_seat_intro -> measures_registry_home`

`crystal_seat_intro` now does one job:
- render the registered intro video
- allow skip
- transition to `measures_registry_home` on end/error/skip

Dedicated intro styling now lives in:

`styles/encounters/intro.css`

# Homepage hero correction

The hero now lives on the existing `measures_registry_home` surface through the existing `RegistryHomeHero` component.

The component now consumes:

- copy authority: `measures_registry_root.metadata.home_hero`
- media authority: `measures_media_map.media_role = hero_background`
- frontend responsibility: HTML semantics + CSS composition only

Homepage styling now lives in:

`styles/encounters/home.css`

Removed:
- obsolete component-level `shared/registryHomeHero.css`
- temporary `encounters/home-hero.css` override

# Live Registry state

The released home hero now contains:

- headline: Deploy AI with confidence.
- body: Measures Registry helps organizations evaluate the operating environment before AI is implemented or expanded.
- support: Find out whether the environment is ready — and what needs attention before deployment.
- background_media_role: hero_background

The former hero eyebrow and feature-capability list were removed from the released home hero object so the hero is no longer carrying the feature-list treatment rejected during review.

# Standing

IMPLEMENTED_PENDING_PRODUCTION_READBACK

Cloudflare deployment is triggered by pushes to `measures`. Production browser readback remains the final evidence gate.

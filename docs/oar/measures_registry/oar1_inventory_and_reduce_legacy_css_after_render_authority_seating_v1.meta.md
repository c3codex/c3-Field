---
document_type: oar1
authority_level: evidence_closeout
document_scope: measures_registry_legacy_css_cleanup
title: OAR1 - Inventory and Reduce Legacy CSS After Render Authority Seating
status: resolved
version: v1
source_oar2: docs/oar/measures_registry/oar2_inventory_and_reduce_legacy_css_after_render_authority_seating_v1.meta.md
operator: op044
system: measures_registry
executed_at: 2026-07-06
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
  - css-cleanup
  - index-css
  - legacy-css
  - render-authority
  - browser-qa
---

# OAR1 - Inventory and Reduce Legacy CSS After Render Authority Seating

## Result

RESOLVED (bounded). Removed 1,051 lines of proven-dead CSS across five files, all verified by a project-wide grep confirming zero `.tsx` usage (or, for `PathChoiceSeat`, zero JSX instantiation) before deletion — never by assumption. Build passes; a fresh `npm run build:registry` compiled cleanly and the shipped CSS bundle shrank from 327.81 kB to 301.26 kB (gzip 46.96 kB → 43.71 kB), confirming the reduction reached the actual output, not just source. All 13 required surfaces were re-verified in a real browser at desktop and mobile with zero visual regression, including every drift correction and the payment content/background authority from the two immediately-preceding OARs. One large additional dead zone was found in `index.css` during this pass and is deliberately **not** touched — held with reason, per this OAR2's own "if uncertain, leave it" instruction — and flagged as a scoped follow-up.

## 1. CSS Inventory

| file | scope | lines before | lines after |
| --- | --- | --- | --- |
| `src/index.css` | global — shared by measures_registry, measuresofinanna.com (Temple), and c3field.online (OarOperationsConsole); imported once at `main.tsx` | 7,994 | 7,866 |
| `src/measures_registry/encounter_renderer/styles/registry.encounter.css` | measures_registry only — `@import` aggregator, imported by `MeasuresRegistryOrchestrator.tsx` | 19 | 18 |
| `registry.tokens.css` | measures_registry — base tokens | 18 | 18 (unaudited beyond import graph) |
| `registry.layout.css` | measures_registry | 10 | 10 (unaudited) |
| `registry.materials.css` | measures_registry | 64 | 64 (unaudited) |
| `registry.buttons.css` | measures_registry | 100 | 100 (unaudited) |
| `registry.footer.css` | measures_registry | 59 | 59 (unaudited) |
| `registry.visual-system.css` | measures_registry — surface/material/data-attribute-scoped | 2,596 | 2,290 |
| `encounters/path-choice.css` | surface-scoped (`data-surface="landing_path_choice"`) | 121 | **deleted** |
| `encounters/passage.css` | mixed: shared header chrome + surface-scoped (`eval_passage`/`structure_passage`) | 206 | 68 |
| `encounters/assessment.css` | obsidian_chamber_encounter_surface-scoped | 445 | 445 (unaudited) |
| `encounters/public_understand.css` | mixed: legacy `data-public-path`-scoped + 1 live shared rule | 383 | 26 |
| `encounters/about.css` | crystal_seat_encounter-scoped | 442 | 442 (unaudited) |
| `encounters/crystal.css` | crystal material-scoped | 282 | 282 (unaudited) |
| `encounters/obsidian.css` | obsidian material-scoped | 279 | 279 (unaudited) |
| `encounters/marble.css` | marble material-scoped | 912 | 912 (unaudited this pass — already reduced/corrected across the three prior OARs in this sequence) |
| `encounters/lapis.css` | lapis material-scoped | 635 | 635 (unaudited) |
| `encounters/legal.css` | privacy/terms-scoped | 63 | 63 (unaudited) |

**Total removed this pass: 1,051 lines** (128 from `index.css`, 306 from `registry.visual-system.css`, 138 from `passage.css`, 357 from `public_understand.css`, 121 from deleting `path-choice.css`, 1 `@import` line).

Files marked "unaudited" were not line-by-line inventoried this pass — flagged as out of this OAR's bounded scope, not claimed clean.

## 2. Classification and Evidence

### `path-choice.css` — deleted entirely (`dead_selector`)

Defines `.registry-path-choice`, `.registry-path-choice-contrast`, `.registry-route-plate*`, scoped to `data-surface="landing_path_choice"`. Evidence: `PathChoiceSeat` (the only component using these classes, in `CrystalSeatRenderer.tsx`) is defined but never instantiated anywhere (`grep "<PathChoiceSeat" src/` — zero matches) and `landing_path_choice` is not a surface_key in `measures_encounter_surface_assignment`. Removed the file and its `@import` line in `registry.encounter.css`.

### `encounters/public_understand.css` — reduced from 383 to 26 lines (`dead_selector` + 1 `active_shared`)

Every selector was scoped to `[data-public-path="understand_environment"]` or `[data-public-path="crystal_chamber"]`, or was a bare `.registry-crystal-chamber*`/`.registry-crystal-publication*`/`.registry-structure-passage*`/`.registry-encounter-entry`/`.registry-public-understand-*` class. Evidence: `data-public-path` is never set by any `.tsx` file in `src/` (project-wide grep, zero matches outside CSS) — an older, fully-superseded "public understand environment" page implementation. The one exception, `.registry-public-pathway-list` (+ `> li`), is live — used by `PublicAssessmentResult.tsx` on `marble_chamber_results` — and was kept verbatim.

### `encounters/passage.css` — reduced from 206 to 68 lines (`active_shared` kept, `dead_selector` removed)

Kept: `.registry-public-header`/`.registry-public-brand` (rendered on every surface via `renderHeader()`) and `.registry-diagnostic-passage-controls` (live in `ObsidianChamberRenderer.tsx`, `PublicAssessmentSurface.tsx`, `PublicAssessmentResult.tsx` — 5 call sites). Removed: bare `.registry-diagnostic-passage` (parent, plus its `video`/`> button` children — the child class is used standalone elsewhere, the parent never is) and the entire "split-screen passage" system (`.registry-passage-split`, `.registry-passage-media-panel`, `.registry-passage-information-panel`, `.registry-passage-audio-control`, nested `.registry-encounter-entry`/`.registry-encounter-actions`) — zero `.tsx` usage confirmed. `eval_passage`/`structure_passage` (the surfaces this file is named for) are seated `held`/`legacy_alias` in `encounter_structure` and render only the generic `.registry-held-state` fallback.

### `registry.visual-system.css` — reduced from 2,596 to 2,290 lines (`stale_surface_selector` + `dead_selector`)

Removed three co-located dead zones, all confirmed by the same `data-public-path`/zero-`.tsx`-usage evidence as above, plus one route-deprecation case:
- `[data-public-path="understand_environment"]` "Structure passage" block
- `[data-public-path="crystal_chamber"]` "Crystal chamber" block (desktop + two mobile media-query duplicates)
- `[data-layout-contract="publication_encounter"]` "Publication surfaces" block (`.registry-field-guide*`, `.registry-publication-cta`, `.registry-publication-dispatch`, `.registry-publication-banner`) — `data-layout-contract="publication_encounter"` is set only by `PublicationDispatch` in `LapisChamberRenderer.tsx`, which has been unreachable since the "Deprecate Stale Publication Dispatch Surface" OAR earlier in this sequence (confirmed: no route maps to `publication_dispatch` anymore).

One comma-grouped rule mixed live and dead selectors (`.registry-diagnostic-passage-controls > button, .registry-encounter-actions > button, .registry-crystal-chamber-section > button, ...`) — kept only the live `.registry-diagnostic-passage-controls > button` fragment. Another mixed rule at 620px scoped `.registry-media-absence` (confirmed live elsewhere) *inside* `[data-public-path="understand_environment"]` — that specific compound selector was still unreachable (the attribute prefix alone guarantees no match), so it was safely removed without affecting the live, unscoped `.registry-media-absence` rules used elsewhere.

### `index.css` — reduced by 128 lines, narrowly (`dead_selector`, publication_dispatch-only)

Removed `.registry-publication-dispatch`, `.registry-publication-dispatch-header`, `.registry-publication-banner`, and `.registry-publication-cta` (all its rules, plus its mobile media-query references) — confirmed used only by the same deprecated `PublicationDispatch` component. `.registry-publication-subscribe-capture` (live — the `/undrifted` subscribe form) was preserved everywhere, including un-merging it out of five separate comma-groups it had been sharing with the dead classes.

## 3. Held With Reason — Not Removed This Pass

While tracing the `publication_encounter` dead zone in `index.css`, a **much larger** contiguous block of unused CSS was found immediately adjacent to it: `.registry-field-guide*`, `.registry-featured-publication`, `.registry-education-resources`, `.registry-education-resource-list`, `.registry-structural-preview*`, `.registry-diagnostic-entry`, `.registry-diagnostic-actions`, `.registry-diagnostic-encounter`, `.registry-diagnostic-threshold`, `.registry-diagnostic-recognition`, `.registry-publication-subscription`, `.registry-cohort-core`/`-phases`/`-review`, roughly spanning `index.css` lines 4150–4910+ (order-of-magnitude 400–600+ lines, not fully bounded). Every class name checked returned zero `.tsx` matches across `src/measures_registry` — strong preliminary evidence this is an entire earlier "long-form marketing/article page" template, superseded like the `data-public-path` zone.

**Not removed this pass because:** unlike the zones actually removed above, this block is not yet fully bounded — several of its selectors are comma-grouped with rules for classes I had not yet individually verified, and tracing the full extent safely (finding every entry/exit point, confirming no live selector is folded into a dead comma-group anywhere in ~750 lines) is a materially larger effort than this pass's remaining budget could responsibly absorb without risking exactly the kind of unverified deletion this OAR2 prohibits. Per OAR2 §3 ("If uncertain, leave it and mark `unsafe_to_remove`"), this is held, not guessed at.

**Recommendation:** a dedicated follow-up OAR scoped specifically to this block — inventory its full selector set, confirm zero live usage for each, and remove as a single bounded pass — is the right next step. It is a substantial, well-evidenced opportunity (likely comparable in size to everything removed in this OAR combined).

## 4. `publication_dispatch` Deprecated-Surface Cleanup (OAR2 §6)

Completed as part of §2/§3 above: `.registry-field-guide*`/`.registry-publication-dispatch*`/`.registry-publication-cta`/`.registry-publication-banner` (the CSS that only ever supported the now-unreachable `PublicationDispatch` component) were removed from `registry.visual-system.css` and `index.css`. No historical DB row was touched. No renderer branch or type member was removed — `PublicationDispatch` and the `"publication_dispatch"` `EncounterSurface` union member remain exactly as the prior deprecation OAR left them (CSS-only change, per this OAR2's boundary). The route itself was not touched (re-verified: `/publication/structural_drift` still resolves to `/undrifted`, see §6).

## 5. Data-Authority Selector Migration (OAR2 §4)

No migration was performed this pass. The four render-intent corrections from the immediately-preceding OAR already introduced `[data-mobile-layout-profile="stacked_layout"]`-gated CSS (`crystal_seat_threshold`) and `[data-background-treatment="ceremonial_exchange_background"]`-gated CSS (`marble_chamber_C2_agreement`) as the first instances of this pattern. Migrating additional *existing, currently-working* class/attribute-scoped rules (e.g. `[data-surface="..."]`) toward the newer `data-layout-profile`/`data-composition-profile` attributes was judged higher-risk-for-no-behavior-change than this pass's dead-code removal, and was not attempted — the newer attributes are additive (present alongside `data-surface`/`data-layout-contract`) rather than replacements, so no migration is required for them to be usable by future rules.

## 6. Browser QA

Ran a full pass at desktop (1440×900) and mobile (390×844) against a local dev server (unmodified source otherwise, same production Supabase project) for all 13 required surfaces, walking the real assessment → contact-capture → results → MAP → payment flow with tagged test data (`"OAR2 QA Test Institution — DELETE ME 5"`, `oar2-qa-test-5@measuresregistry.com`; deleted immediately after, confirmed via `count(*) = 0`). Evidence screenshots for every surface are in this OAR1's `_evidence/` folder (`01_*` through `13_*`, each with `_desktop`/`_mobile` variants).

| surface_key | desktop | mobile | result |
| --- | --- | --- | --- |
| crystal_seat_intro | ✓ | ✓ | pixel-identical to pre-cleanup evidence |
| crystal_seat_threshold | ✓ | ✓ | stacked mobile layout (prior OAR's correction) still intact |
| crystal_seat_orientation | ✓ | ✓ | identical |
| crystal_seat_encounter | ✓ | ✓ | identical |
| obsidian_chamber_orientation | ✓ | ✓ | identical |
| obsidian_chamber_encounter_surface | ✓ | ✓ | identical |
| obsidian_chamber_C1_compact | ✓ | ✓ | identical |
| marble_chamber_orientation | ✓ | ✓ | identical |
| marble_chamber_results | ✓ | ✓ | widened report card (prior OAR's correction) still intact |
| marble_chamber_C2_compact | ✓ | ✓ | grounded three-panel treatment (prior OAR's correction) still intact |
| marble_chamber_C2_agreement | ✓ | ✓ | full payment content, background, seal, and correct gold accent (two prior OARs' work) all still intact |
| marble_chamber_C2_resolution | ✓ | ✓ | identical |
| lapis_chamber_encounter | ✓ | ✓ | identical, including the live `.registry-publication-subscribe-capture` form at the bottom of the page — direct confirmation the surgical class-preservation in §2 worked |

`marble_chamber_encounter` (the held/unavailable alias) was not re-screenshotted — it has no visible DOM, consistent with every prior OAR in this sequence.

`/publication/structural_drift` → `/undrifted` redirect re-verified working (§4).

**Build**: `npm run build:registry` completed with no errors. Output CSS bundle: 327.81 kB → 301.26 kB raw (46.96 kB → 43.71 kB gzip), JS bundle unaffected (no `.tsx` logic changed).

## 7. QA Side Effects and Cleanup

One test capture row was written to `measures_iis_eval_gate1_capture` to progress through the assessment/contact-capture gate. Deleted immediately after evidence capture; `count(*) = 0` confirmed. No Stripe session was created — `marble_chamber_C2_resolution` was reached via the app's own `?payment=success` branch, matching every prior OAR's method.

## Boundary Preservation

- No route behavior was changed (verified: `/publication/structural_drift` still redirects).
- No MAP/payment/assessment logic was changed — the full flow was walked successfully end to end during QA.
- No DB authority was changed — this OAR touched only `.css` files (plus one `@import` line and one file deletion).
- No public claims were changed.
- No content model was changed.
- No new visual vocabulary was created.
- No whole-design-system rewrite was attempted — reductions were narrow, evidenced, and file-by-file.
- Nothing was removed without evidence — every deletion is backed by a project-wide grep result cited in §2, and the one large suspicious zone found (§3) was explicitly held rather than guessed at.

## Closeout

1,051 lines of CSS proven dead by direct `.tsx`-usage evidence were removed across five files, with zero visual regression across all 13 active surfaces at two viewports and a clean production build. A second, larger dead zone in `index.css` was found and deliberately left in place, fully documented, as a scoped recommendation for a follow-up OAR — consistent with this OAR2's explicit preference for a bounded, provable pass over a broad one.

Codex holds.
Field structures.
Measures registers.
Chazz validates.
Cody inventoried, proved, and reduced from evidence.
src renders.
CSS executes.

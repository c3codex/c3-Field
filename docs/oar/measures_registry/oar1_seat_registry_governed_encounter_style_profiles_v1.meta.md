---
document_type: oar1
authority_level: working
title: OAR1 — Seat Registry-Governed Encounter Style Profiles
status: partially_closed
version: v1
operator: op044
system: measures_registry
source_oar2: docs/oar/measures_registry/oar2_seat_registry_governed_encounter_style_profiles_v1.meta.md
commit: f836495
---

# OAR1 — Seat Registry-Governed Encounter Style Profiles

## FINAL DISPOSITION

**PHASES_1_4_CLOSED — PHASES_5_7_DEFERRED, GATED ON DB SEATING AND LIVE BROWSER QA**

Style authority is inventoried, drift is identified with concrete file:line evidence, a canonical `EncounterStyleProfile` contract exists and is wired consistently through one resolver across all four chambers, and one verified-zero-risk dead-CSS removal is done. Full CSS token normalization (phase 5) and cross-viewport visual validation (phase 7) are explicitly **not** attempted this pass — see "NOT DONE" below for why, and what unblocks them.

---

## VALIDATION CHECKLIST

| Item | Status | Evidence |
|---|---|---|
| Style authority inventoried | PASS | Full inventory of `src/index.css` (7,964 lines) and all 17 files under `encounter_renderer/styles/` (~6,414 lines) — see INVENTORY section below |
| Drift identified, no deletion before inventory | PASS | Inventory done first; drift findings listed with file:line in DRIFT FOUND section before any file was touched |
| Canonical encounter style profile shape defined | PASS | `src/measures_registry/encounter_renderer/styles/encounterStyleProfile.ts` — `EncounterStyleProfile` type has all 19 requested fields (`profile_key`, `material_family`, `encounter_type`, `surface_role`, `frame_mode`, `media_ratio`, `media_fit`, `content_position`, `content_width`, `typography_scale`, `heading_treatment`, `body_treatment`, `button_position`, `button_treatment`, `overlay_treatment`, `watermark_treatment`, `audio_control_treatment`, `mobile_behavior`, `release_state_behavior`) |
| Marked temporary/non-authoritative since DB seating is incomplete | PASS | File header comment states this explicitly; only `profile_key` resolves to a real value (from the already-seated `style_profile` DB field) — the other 18 fields resolve to `null` ("gap"), never an invented default |
| Each active encounter resolves to one profile | PASS | `resolveEncounterStyleProfile()` is now the single call site for `style_profile` resolution across `CrystalSeatRenderer.tsx`, `ObsidianChamberRenderer.tsx`, `MarbleChamberRenderer.tsx`, `LapisChamberRenderer.tsx`, replacing 11 ad hoc `asString(...)` reads. `data-style-profile` is now set on all real public surfaces (previously 4 were missing it: `crystal_seat_orientation`, `crystal_seat_intro`, `path_choice`, `publication_dispatch`) |
| CSS reduced toward execution only (down payment) | PASS | Removed `background`/`border` from `registry.buttons.css`'s 14-selector base rule — confirmed dead code (fully overridden by `registry.visual-system.css`, loaded later in the `@import` chain); verified as a zero-computed-style change before removing, not a guess |
| Renderer applies style through profile tokens | GAP (documented) | Only `profile_key` exists as a resolved token today; no CSS yet targets `[data-style-profile="..."]` — the 18 remaining token fields (`media_ratio`, `frame_mode`, `button_treatment`, etc.) have no DB seeding to resolve from, so no renderer class can honestly consume them yet |
| Visual seams reduced without new hardcoded exceptions | PARTIAL | One confirmed seam removed (button double-styling). Two other identified seams (muted-text color token conflict, `.registry-public-header` defined in 3 files) were deliberately **not** touched — see NOT DONE |
| Validation across required surfaces (mobile + laptop viewports) | NOT DONE | No browser/screenshot tool is available in this environment — this is the explicit "browser QA unavailable" condition under which this OAR pauses rather than guesses |

---

## 1. INVENTORY — where visual authority currently lives

**Global:** `src/index.css` — 7,964 lines, imported at the true app root (`main.tsx`). Shares the `.measures-registry-runtime` root class with every scoped file below, with no `@layer` declaration, so precedence between "global" and "scoped" styling is an accident of JS import order, not a declared rule.

**Scoped (chamber/encounter):** `src/measures_registry/encounter_renderer/styles/registry.encounter.css` is a pure `@import` manifest (19 lines) that stitches, in this fixed order: `registry.tokens.css` (18 lines, CSS custom properties) → `registry.layout.css` (10 lines, root shell) → `registry.materials.css` (64 lines, per-material-family token remap) → `registry.buttons.css` (99 lines, base button contract) → `registry.footer.css` (59 lines) → `encounters/path-choice.css` (121) → `encounters/passage.css` (206) → `encounters/assessment.css` (445) → `encounters/public_understand.css` (383) → `encounters/about.css` (405) → `encounters/crystal.css` (282) → `encounters/obsidian.css` (279) → `encounters/marble.css` (730) → `encounters/lapis.css` (635) → `encounters/legal.css` (63) → `registry.visual-system.css` (2,596 lines, imported **last**, wins cascade ties).

**Component-level:** Four chamber renderer files (`CrystalSeatRenderer.tsx` 973 lines / 6 surfaces, `ObsidianChamberRenderer.tsx` 748 lines / 3 surfaces, `MarbleChamberRenderer.tsx` 737 lines / 4 surfaces + 2 shared sub-components, `LapisChamberRenderer.tsx` 515 lines / 2 surfaces) each carry `data-surface`, `data-material-family`, `data-layout-contract`, `data-release-standing` attributes that CSS keys off of — this is the real, working "authority" mechanism today.

**Inline styles:** Narrower than expected — every `style={{...}}` in the four chamber files is exactly `{ ...registryTokenStyle, ...surfaceBgStyle(bgUrl) }}` (a spread of DB-driven CSS-var tokens plus a computed background-image URL). No hardcoded px/rem literals were found inline in JSX.

**The one live DB→CSS mechanism today:** `EncounterDesignTokenRow` (`token_key`, `token_value`, `media_query`) → `registryTokenStyle` (`MeasuresRegistryOrchestrator.tsx`) → spread into every chamber's root inline style. This is a real precedent for "DB governs style," but it's scalar CSS-var overrides, not the structured multi-field profile OAR2 asks for.

---

## 2. DRIFT FOUND (concrete, file:line)

- **Button/CTA double-styling** — the identical 14-selector list is styled in both `registry.buttons.css:3-28` (baseline: transparent background, uniform border) and `registry.visual-system.css:619-643` (heavier "governed" treatment: gradient background, top/bottom-only border), loaded later so it silently wins. **Fixed this pass** — see CHANGES.
- **Video framing set in 3 places** — `.registry-diagnostic-passage video` sizing is declared independently in `src/index.css:4100-4107` (explicit `height`), `encounters/assessment.css:383-388` (`max-height`), and `encounters/passage.css:58-63` (`max-width`/`margin`). Not touched this pass — properties don't fully overlap, so this isn't provably dead code; merging blind risks a visible size change I can't verify without a browser.
- **`--registry-brand-muted-text` set to two different hardcoded hex values** — `src/index.css:6225` (`#6b6357`) vs `encounters/about.css:9` (`#5F6777`), both bypassing `registry.tokens.css`/`registry.materials.css`, which are supposed to own color tokens. Not touched — could be an intentional per-surface variation rather than drift; needs visual confirmation before merging.
- **`.registry-public-header` defined in 3 files** — `src/index.css:3327` (base layout), `encounters/passage.css:4` (position: absolute override for passage surfaces), `registry.visual-system.css:585` (background only). Not touched — the passage.css override may be an intentional exception for full-bleed video passages, which is exactly the kind of "surface-specific exception" OAR2 wants surfaced for a decision, not silently deleted.
- **Watermark rules exist only in `src/index.css`** (`:5034`, `:5363`, `:5368`) with no counterpart in the scoped `encounters/assessment.css` that governs the same assessment surface — flagged, not moved (moving would touch rendering I can't visually verify).
- **No shared typography scale** — 253 `font-size` declarations in `index.css` + 99 in scoped files, each a bespoke `clamp(...)` triple, no shared type-scale tokens anywhere. Flagged for a future pass; consolidating this touches dozens of headings across every surface and is not a same-session, no-browser-QA change.

---

## CHANGES — EVIDENCE

### `src/measures_registry/encounter_renderer/styles/encounterStyleProfile.ts` (new)

`EncounterStyleProfile` type (19 fields) + `resolveEncounterStyleProfile(surfaceAssignmentMetadata)`. Resolves `profile_key` from the DB-seeded `style_profile` metadata key (seated by `supabase/migrations/202606300019_seat_style_profiles_for_13_registered_surfaces.sql` and `202607020001_..._marble_surface_style_profiles...sql`). Every other field is `null` until Field/Measures seat it — no invented defaults.

### `CrystalSeatRenderer.tsx`, `ObsidianChamberRenderer.tsx`, `MarbleChamberRenderer.tsx`, `LapisChamberRenderer.tsx`

Replaced 11 ad hoc `asString(encounter.surfaceAssignmentMetadata?.style_profile) ?? undefined` reads with `resolveEncounterStyleProfile(encounter.surfaceAssignmentMetadata)?.profile_key ?? undefined`. Added the same call to the 4 real public surfaces that previously had no `data-style-profile` at all: `CrystalOrientationSeat` (`crystal_seat_orientation`), `CrystalIntroSeat` (`crystal_seat_intro`), `PathChoiceSeat` (`path_choice`), `PublicationDispatch` (`publication_dispatch`). `ObsidianChamberRenderer.tsx`'s `MeasuresAssessment` now derives its `styleProfile` prop (passed to `PublicAssessmentSurface`, which already rendered `data-style-profile`) from the same resolver instead of its own inline read.

### `registry.buttons.css`

Removed `background: transparent;` and `border: 1px solid var(--registry-brand-border);` from the 14-selector base button rule — both were fully overridden by `registry.visual-system.css` in every real render today (confirmed by reading both cascades side by side, not by guessing), so this is a verified no-op on computed styles.

### `dist-registry/`

Rebuilt via `npm run build:registry`.

---

## NOT DONE / DEFERRED — AND WHY

- **Phase 5, full CSS→token normalization**: not attempted beyond the one verified-dead-code removal above. The remaining identified seams (video framing, muted-text color, header triplication, typography scale) either don't provably reduce to a no-op merge, or look like they may be intentional per-surface exceptions rather than drift. Merging any of them blind, in a live media-heavy DB-driven site, without being able to see the rendered result, risks introducing a real visual regression under the banner of "cleanup." That is a worse outcome than leaving documented drift in place.
- **Phase 7, cross-viewport validation (mobile + laptop) across landing/threshold, Assess the Environment, Understand the Environment, Obsidian assessment, Crystal education, Marble/MAP surfaces**: **blocked — no browser or screenshot tool is available in this environment.** This is the explicit gate this OAR pauses at, per the standing instruction to stop at "browser QA unavailable" rather than claim a visual result that was never observed.
- **Seating the remaining 18 profile fields in the DB** (`media_ratio`, `frame_mode`, `content_width`, `button_position`, `overlay_treatment`, `watermark_treatment`, `audio_control_treatment`, `mobile_behavior`, `release_state_behavior`, etc.): out of Cody's authority — this is Field/Measures schema work (new migrations, new registry keys), not frontend implementation. Flagged as the blocking dependency for phase 5 to become honest rather than speculative.

## RECOMMENDED NEXT OAR2

A follow-up OAR2 scoped to Field/Measures should seat the remaining profile fields in `supabase/migrations/`, per canonical surface, before Cody attempts phase 5 CSS normalization against real, resolvable tokens rather than provisional/null ones. Once that lands, a session with browser/screenshot access should perform phase 7 validation before any further CSS consolidation touches rendering.

---

## NOTCHAZZ FLAGS

None raised.

- No encounter meaning invented — `resolveEncounterStyleProfile` returns `null`/gap for anything unseeded, never a fallback default.
- No chamber-specific one-offs hardcoded — the one CSS change removed a duplicate, it did not add a new exception.
- CSS not treated as authority — the new contract is explicitly marked non-authoritative pending Field/Measures DB seating.
- No media controls removed, no flow/release-state/payment/MAP/assessment logic changed.
- Missing-state honesty preserved — unresolved profile fields and unattempted CSS/viewport validation are reported as gaps, not silently skipped or claimed complete.

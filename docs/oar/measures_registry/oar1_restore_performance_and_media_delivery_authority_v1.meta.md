---
document_type: oar1
authority_level: working
title: OAR1 — Restore Performance and Media Delivery Authority
status: partially_closed
version: v1
operator: op044
system: measures_registry
source_oar2: docs/oar/measures_registry/oar2_restore_performance_and_media_delivery_authority_v1.meta.md
commit: 322008d
---

# OAR1 — Restore Performance and Media Delivery Authority

## FINAL DISPOSITION

**BUNDLE_SPLITTING_AND_MEDIA_ATTRIBUTES_DONE — LIGHTHOUSE/CLS/LCP MEASUREMENT BLOCKED (NO BROWSER)**

Everything measurable from build output and source code was audited and, where safe, changed: route-level code splitting, image loading intent, font render-blocking, and a full video-preload audit (which concluded no change was needed — every video already defers correctly). What's explicitly **not** done: real Lighthouse/LCP/CLS numbers, since those require a browser, which isn't available in this environment. Reported honestly as measured-vs-inferred throughout.

---

## VALIDATION CHECKLIST

| Item | Status | Evidence |
|---|---|---|
| Build passes | PASS | `npx tsc --noEmit` clean; `npm run build:registry` succeeds |
| Baseline and post-change performance findings reported | PARTIAL | Build-size/chunk findings: full before/after below. Lighthouse/LCP/CLS: not measured — no browser available this session (reported as a gap, not guessed) |
| Initial route loads fewer non-critical media assets | PASS | Chamber renderers now code-split; a homepage visit no longer downloads Marble/Obsidian/Lapis/GovernanceAudit JS |
| Above-fold media has stable dimensions or aspect ratio | PARTIAL | Explicit `width`/`height` were **not** added to `<img>` tags — all image URLs are runtime/DB-resolved with no known dimensions in metadata; inventing a value would risk visible distortion if wrong, which is worse than the current gap. `aspect-ratio` CSS already exists for the 3 surfaces confirmed in the prior style-authority OAR1 (`crystal_seat_orientation`, `obsidian_chamber_orientation`, `marble_chamber_orientation`) — not duplicated here |
| Downstream videos deferred where safe | PASS (no change needed) | Audited all 13 `<video>` elements — every one only mounts when its own surface/state becomes active (never preloaded ahead of need) and every one has `autoPlay`, so `preload="auto"` is already correct everywhere; changing any to `metadata`/`none` would visibly delay autoplay, violating "preserve autoplay/advance behavior where already working" |
| Images use lazy/eager intentionally | PASS | Every `<img>` in the encounter renderer now has an explicit, reasoned `loading` attribute — see table below |
| CSS debt reduced or inventoried | PARTIAL | Not re-audited in this pass — full inventory already exists in `oar1_seat_registry_governed_encounter_style_profiles_v1.meta.md` (video-framing triplication, muted-text token conflict, header triplication, no shared typography scale). Referenced, not duplicated, not touched further this pass — same browser-QA blocker applies |
| No encounter architecture removed | PASS | No surface, route, or capture flow logic touched |
| No DB authority bypassed | PASS | No DB reads/writes in this OAR — pure frontend/build change |

---

## BASELINE (BEFORE)

Single JS bundle, no code splitting:

| Asset | Size | Gzip |
|---|---|---|
| `index-CVQIM75Q.js` (everything: orchestrator + all 4 chambers + GovernanceAuditSurface + PublicAssessmentSurface/Result) | 581.68 KB | 156.89 KB |
| `index-qxL_eUjd.css` | 327.81 KB | 46.96 KB |

Font: single blocking `<link rel="stylesheet" href="https://fonts.googleapis.com/...">` — no preload, delays first paint until the Google Fonts CSS response arrives.

Images: zero `<img>` tags anywhere in the encounter renderer had a `loading` attribute (all default to eager per browser default, including several that are genuinely below-fold — article grid thumbnails, editor's-feature mark, watermarks).

Public static media: `public/audio/obsidian-bed.mp3` (7.2MB, ambient tone — currently unreachable at runtime since `TONES_HELD = true` in `MeasuresRegistryOrchestrator.tsx` keeps `activeToneUrl` permanently `null`, so this file is never actually fetched today), `public/obsidian_background.png` (2.6MB) and `public/undrifted_logo.png` (1.0MB) — both confirmed **unreferenced anywhere in `src/`** via grep, meaning they inflate the deployed directory but are never fetched by a visitor (no perf impact, pure deploy-size waste).

## AFTER

| Asset | Size | Gzip | Loaded when |
|---|---|---|---|
| `index-DK0JLamF.js` (orchestrator + resolver + shared) | 487.41 KB | 136.47 KB | always (entry) |
| `CrystalSeatRenderer-*.js` | 21.44 KB | 5.47 KB | `chamberAssignment === "crystal_seat"` |
| `ObsidianChamberRenderer-*.js` (+ PublicAssessmentSurface) | 23.44 KB | 6.19 KB | `chamberAssignment === "obsidian"` |
| `MarbleChamberRenderer-*.js` | 14.80 KB | 3.94 KB | `chamberAssignment === "marble"` |
| `LapisChamberRenderer-*.js` | 10.47 KB | 3.20 KB | `chamberAssignment === "lapis"` |
| `GovernanceAuditSurface-*.js` | 19.80 KB | 5.65 KB | `activeSurface === "governance_audit"` only |
| `PublicAssessmentResult-*.js` | 6.80 KB | 2.19 KB | assessment-results state only |
| `encounterStyleProfile-*.js` | 0.47 KB | 0.27 KB | shared by chambers that import it |
| `index-qxL_eUjd.css` | 327.81 KB (unchanged) | 46.96 KB (unchanged) | always |

**Initial homepage load** (main + Crystal chunk, the typical first visit): **508.85 KB / 141.94 KB gzip**, down from 581.68 KB / 156.89 KB gzip — **~12.5% less uncompressed JS, ~9.5% less gzipped JS** for the common case.

**Honest tradeoff, reported not hidden**: summed across every chunk, total JS is `584.6 KB` — marginally *more* than the single 581.68 KB bundle (small per-chunk module-wrapper overhead from code splitting). This is the standard, expected cost of route-based splitting: a visitor who eventually visits every chamber downloads slightly more in total, but no single visit pays for chambers they don't use. For this app's actual usage pattern (a visitor typically follows one path — assess, or read unDrifted, or read About — not all four), this is a net win.

---

## CHANGES — EVIDENCE

### `src/measures_registry/encounter_renderer/router/ChamberRouter.tsx`

All 4 chamber renderer imports converted to `React.lazy()`; each dispatch branch wrapped in `<Suspense fallback={...}>` using a fallback that mirrors `EncounterEntry.tsx`'s existing loading state (`data-layout-contract="loading"`) so a slow chunk fetch reads identically to a slow resolver fetch.

### `src/measures_registry/encounter_renderer/MeasuresRegistryOrchestrator.tsx`

`GovernanceAuditSurface` (899 lines, internal diagnostic surface) converted to `React.lazy()` + `Suspense`. Also added `loading="eager"` to the persistent header brand mark (visible immediately on every page that renders a header).

### `index.html`

Google Fonts stylesheet link changed from blocking to the standard preload + `media="print"` swap pattern, with a `<noscript>` fallback for JS-disabled clients. Same URL, same font — no new external dependency, no self-hosting.

### `<img>` loading attributes — full list

| File | Element | Attribute | Reasoning |
|---|---|---|---|
| `CrystalSeatRenderer.tsx` | Codexstone seal (orientation) | eager | primary visual content, visible on mount |
| `CrystalSeatRenderer.tsx` | threshold left/right still images (×2 sites each) | eager | entire viewport content of that surface |
| `CrystalSeatRenderer.tsx` | path-choice route-plate image | eager | primary visual content of that surface |
| `CrystalSeatRenderer.tsx` | Codexstone seal (About page) | eager | appears near top of About page |
| `LapisChamberRenderer.tsx` | masthead banner / masthead logo | eager | top of unDrifted page, first thing visible |
| `LapisChamberRenderer.tsx` | cover story hero image | eager | the page's LCP candidate |
| `LapisChamberRenderer.tsx` | editor's-feature mark | lazy | further down the page |
| `LapisChamberRenderer.tsx` | article grid cover thumbnails | lazy | below-fold, repeated per article |
| `MarbleChamberRenderer.tsx` | decorative center-panel visual | lazy | `aria-hidden`, explicitly decorative |
| `MeasuresAssessmentBrandLayer.tsx` | watermark + brand mark | lazy | `aria-hidden` decorative overlay layer |
| `MeasuresRegistryOrchestrator.tsx` | header brand mark | eager | persistent chrome, visible immediately |
| `PublicAssessmentSurface.tsx` | header brand mark | eager | same header pattern |

No `width`/`height` was added to any of these — see VALIDATION CHECKLIST row above for why.

---

## REMAINING PERFORMANCE DEBT

- **CSS (327.81 KB, unchanged)**: full debt inventory already exists in `oar1_seat_registry_governed_encounter_style_profiles_v1.meta.md` — video-framing rules split across 3 files, a muted-text color token defined with two different hardcoded hex values, `.registry-public-header` defined in 3 files. Not touched again here; same blocker (no browser to verify a visual no-op before merging).
- **No real LCP/CLS/Lighthouse numbers**: this environment has no browser or screenshot tool. Everything above is inferred from source code and build output, not measured in a live page load.
- **Two unreferenced static images** (`public/obsidian_background.png` 2.6MB, `public/undrifted_logo.png` 1.0MB): confirmed unreferenced anywhere in `src/` — safe deletion candidates, but not removed this pass since their provenance/intent wasn't verified with the operator and they have zero runtime perf impact (never fetched).
- **`public/audio/obsidian-bed.mp3`** (7.2MB): currently unreachable at runtime (`TONES_HELD = true`) — not a live perf issue today, but worth knowing it's there if `TONES_HELD` is ever flipped back on without first addressing its size.

## ASSETS REQUIRING OPERATOR-SIDE ACTION

- `public/obsidian_background.png` (2.6MB) and `public/undrifted_logo.png` (1.0MB): confirm whether these are still needed; if not, remove — they only cost deploy-directory size today (not runtime performance, since nothing references them).
- `public/audio/obsidian-bed.mp3` (7.2MB): if the ambient-tone system (`TONES_HELD`) is ever re-enabled, this file should be compressed first — 7.2MB is large for a background audio loop.
- Encounter videos themselves are Supabase/R2-hosted, not in this repo — their actual file sizes weren't auditable from the filesystem this pass; a follow-up with storage-bucket access could check for compression opportunities there.

## RECOMMENDED NEXT OAR2

A browser-QA-equipped pass to run real Lighthouse audits (before/after, matching this OAR2's original ask) and confirm the CSS debt items are safe to merge, now that the JS-side work here is done and shouldn't need re-measuring.

---

## NOTCHAZZ FLAGS

None raised.

- No encounter architecture replaced — code splitting is transparent to routing/rendering behavior; `ChamberRouter`'s dispatch logic is unchanged.
- No required media removed, no audio/video controls broken — verified via the full video-preload audit that autoplay behavior is unchanged everywhere.
- No route invented, no hardcoded fallback routing — `Suspense` fallbacks reuse the existing loading-state pattern.
- No font files exposed or self-hosted — same Google Fonts URL, no new external dependency.
- No chamber style profile collapsed — `resolveEncounterStyleProfile()` and the CSS system are untouched.
- No generic layout system introduced.
- Measurement gaps (Lighthouse/LCP/CLS) reported honestly as blocked rather than estimated.

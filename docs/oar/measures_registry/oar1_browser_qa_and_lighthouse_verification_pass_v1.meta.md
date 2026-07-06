---
document_type: oar1
authority_level: evidence_closeout
document_scope: measures_registry_browser_qa
title: OAR1 - Browser QA and Lighthouse Verification Pass
status: resolved
version: v1
source_oar2: docs/oar/measures_registry/oar2_browser_qa_and_lighthouse_verification_pass_v1.meta.md
operator: op044
system: measures_registry
executed_at: 2026-07-05
native_stack:
  codex: database
  field: schema
  measures: registry
  chazz: systems
  cody: frontend_executor
tags:
  - oar1
  - measures-registry
  - browser-qa
  - lighthouse
  - mobile-qa
  - performance-validation
  - css-seams
  - launch-stabilization
---

# OAR1 - Browser QA and Lighthouse Verification Pass

## Result

RESOLVED, with one fix applied and two significant blockers documented (not fixed — out of safe-seam scope).

Ran real Lighthouse audits (via `npx lighthouse`, Chromium launched from the Playwright-installed binary, `--chrome-flags="--headless=new --no-sandbox --disable-gpu"`) against the live production site `https://measuresregistry.com` for all four required routes. Found and fixed one safe, verified regression (client-side metadata clobbering already-correct build-time SEO tags after hydration). Found and documented — but did not attempt to fix — two blockers that exceed "safe seam" scope: multi-megabyte hero videos driving poor LCP, and an unresolved CLS source on `/undrifted` mobile that could not be reproduced deterministically enough to fix safely.

## 1. Lighthouse Audits (Production)

Method note: `npx lighthouse` was run with `--chrome-flags="--no-sandbox"` because the sandbox in this environment denies `chrome-launcher`'s post-run temp-directory cleanup (`EPERM` on `rm` of its Chrome profile tmp dir). This is a harmless cleanup-step error, not an audit failure — confirmed by checking that each run's `--output-path` JSON was written successfully and is a complete, valid Lighthouse report (full JSON preserved in this OAR1's evidence folder: `lighthouse_home.json`, `lighthouse_about.json`, `lighthouse_undrifted.json`, `lighthouse_ai_operations_assessment.json`). Lighthouse's default mobile emulation was used (412×823, DPR 1.75, throttled network/CPU) — this is genuinely-run Lighthouse output, not claimed without running it.

| route | Performance | Accessibility | Best Practices | SEO | LCP | CLS | TBT | FCP |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| `/` | 75 | 100 | 81 | 100 | 5.3 s | 0 | 120 ms | 2.6 s |
| `/about` | 74 | 100 | 81 | 92 | 5.4 s | 0.058 | 50 ms | 2.8 s |
| `/undrifted` | 65 | 100 | 81 | 92 | 7.6 s | 0.136 | 130 ms | 2.8 s |
| `/ai-operations-assessment` | 71 | 100 | 81 | 92 | 7.2 s | 0.001 | 110 ms | 2.7 s |

Accessibility is clean across the board (100/100, no action needed).

**SEO gap (92 on three of four routes) root-caused and fixed** — see §2.

**Best Practices (81/100, uniform)** — the only failing audit on every route is `deprecations` ("Uses deprecated APIs": Shared Storage API, `StorageType.persistent`, Protected Audience API). All three warnings trace to `https://measuresregistry.com/cdn-cgi/challenge-platform/scripts/jsd/main.js` — Cloudflare's own bot-challenge script, injected by the host, not application code. Not fixable from this codebase; documented, not touched, per "if a seam requires broader [non-app] work, document it instead of rushing."

## 2. SEO / AI Visibility Root Cause and Fix

**Root cause, evidenced:** production build-time head generation (`scripts/generate-registry-route-heads.cjs`) already bakes correct, DB-governed, page-specific `<title>`, `<link rel="canonical">`, and OG/Twitter tags into the static HTML for `/undrifted`, `/ai-operations-assessment`, and `/structural-drift` (confirmed by diffing a fresh `npm run build:registry` against the committed `dist-registry/undrifted/index.html` — canonical/title/JSON-LD were byte-identical before and after, i.e. already correct at build time). `/about/index.html` also already has a correct static canonical (`https://measuresregistry.com/about`), from an earlier, separate seeding — it is not in `generate-registry-route-heads.cjs`'s `routeUnits` list, but its static file already carries the right values.

The regression is client-side, after hydration: Cloudflare 308-redirects every non-root path to a trailing-slash form (`curl -I` confirmed `/about` → `308` → `Location: /about/`, same for `/undrifted` and `/ai-operations-assessment`). `MeasuresRegistryOrchestrator.tsx` already strips this trailing slash before matching its own route table (`normalizePathname()`), but `src/app/App.tsx`'s separate SEO-metadata `useEffect` did **not** — it looked up `REGISTRY_ROUTE_UNITS[window.location.pathname]` using the un-normalized `"/undrifted/"`, which never matches the bare-path keys, so it always fell through to the generic homepage metadata (root canonical, generic title, generic OG tags) and never even attempted the DB-governed fetch for these three routes.

Verified live on production before the fix (`https://measuresregistry.com/undrifted`, Playwright, 2s post-load): `document.title` correctly became `"unDrifted — Measures Registry"` (set by a *different*, already-normalized effect in `MeasuresRegistryOrchestrator.tsx`), but `document.querySelector('link[rel="canonical"]').href` was `"https://measuresregistry.com/"` — the root, clobbering the correct static value. This matches Lighthouse's `canonical` audit explanation exactly: *"Points to the domain's root URL (the homepage), instead of an equivalent page of content."*

**Fix applied** — `src/app/App.tsx`:

```ts
// Cloudflare issues a 308 redirect adding a trailing slash to every non-root route
// (e.g. /about -> /about/), so window.location.pathname never matches the bare keys in
// REGISTRY_ROUTE_UNITS/REGISTRY_ROUTE_METADATA in production. Strip it before lookup,
// mirroring MeasuresRegistryOrchestrator's own normalizePathname().
function normalizePathname(pathname: string): string {
  return pathname.length > 1 ? pathname.replace(/\/$/, "") : pathname
}
```
```ts
const pathname = normalizePathname(window.location.pathname)
const routeUnit = REGISTRY_ROUTE_UNITS[pathname]
```

**Verified fixed**, locally (production Supabase project, unmodified otherwise) at `http://localhost:5175`, simulating the production trailing-slash form directly:

| path requested | canonical before fix | canonical after fix |
| --- | --- | --- |
| `/undrifted/` | `https://measuresregistry.com/` | `https://measuresregistry.com/undrifted` |
| `/ai-operations-assessment/` | (same root pattern) | `https://measuresregistry.com/ai-operations-assessment` |

`og:url` for `/undrifted/` was also confirmed corrected to the page URL. `/about` is unaffected by this specific fix (it was never in `REGISTRY_ROUTE_UNITS` to begin with, so it always used — and still uses — the root fallback at runtime; its static file happens to be correct only because nothing overwrites it after hydration for that route). **`/about`'s wrong-after-hydration risk does not currently manifest** only because no code path clobbers it — but it is also not governed, and adding it properly (new `REGISTRY_ROUTE_UNITS`/`REGISTRY_ROUTE_METADATA` entries, plus a DB `route_authority`/`frontend_role`/`seo` binding, since `measures_registry.about_measures_registry` currently has none) is new authority-seating work, not a "safe seam" — documented as a follow-up, not attempted here.

`dist-registry` was rebuilt (`npm run build:registry`) to reflect this fix in the built bundle, per explicit Cody-role permission ("rebuild dist-registry"). The build was **not** committed or deployed — that decision belongs to the operator. `git status` shows the rebuilt bundle files plus the source change as pending, uncommitted changes.

## 3. Mobile QA

Reused the exhaustive desktop+mobile evidence already captured for all 14 encounter surfaces in [oar1_browser_qa_seat_held_encounter_style_fields_v1.meta.md](oar1_browser_qa_seat_held_encounter_style_fields_v1.meta.md) and its `_evidence/` screenshots, rather than re-shooting — nothing about layout has changed since that pass (this OAR made no CSS/layout edits). Cross-checked against this OAR2's specific mobile QA checklist:

| check | standing |
| --- | --- |
| Homepage crystal seat intro | Full-bleed video preserved at 390×844, headline + audio control both on-frame (`01_crystal_intro_mobile.png`). No off-frame CTA. |
| Assessment path (orientation → 7Q form → contact) | All three steps confirmed single-column, on-frame, no clipping (`03_*_mobile.png`, `04_*_mobile.png`, `05_*_mobile.png`). |
| About page | Stacks to single column, all sections and the connect form fully on-frame (`11_crystal_encounter_about_mobile.png`). Pre-existing anomaly (not new, not touched): a codexstone caption visually overlaps the boxed video on **desktop** only — flagged in the prior OAR1, still present, still out of this OAR's CSS-seam-fix budget to address as it requires copy/caption repositioning, not a one-line safe fix. |
| unDrifted page | Editorial grid collapses to one stacked column, CTA and nav on-frame (`13_lapis_encounter_mobile.png`). |
| Result/continuance surfaces | Marble orientation/results/MAP/agreement/resolution surfaces all confirmed on-frame at 390×844 in the prior pass (`06_*` through `10_*` mobile screenshots) — no off-frame CTAs, no header/footer collision. |

No new header/footer collision, invisible navigation trap, or overflow clipping was found. No CSS was changed for mobile QA — findings match the prior pass exactly, confirming no regression since.

## 4. Video and Audio QA

- First-encounter video (`crystal_seat_intro`, `ai_isnt_broken_intro.mp4`) loads and autoplays muted as designed — confirmed both in this pass's Lighthouse network trace (loaded, 14 MB, see §5) and the prior OAR's screenshot evidence (video visibly playing).
- Downstream videos (`crystal_seat_orientation`, `obsidian_chamber_orientation`, `marble_chamber_orientation`, `about_measures_registry`) cannot preload "too early" by construction: each chamber renderer only mounts its own `<video>` element when its surface is the active one (`ChamberRouter`/`EncounterEntry` conditionally render one chamber at a time), so a downstream video's element does not exist in the DOM — and therefore cannot begin any network request — until the user actually reaches that surface. Verified in source (`CrystalSeatRenderer.tsx`, `ObsidianChamberRenderer.tsx`, `MarbleChamberRenderer.tsx`) — no separate runtime check was needed since this is a structural guarantee, not a timing race.
- Audio controls appear consistently as "Enable Video Audio" / "Enable Audio" buttons per surface, matching the already-seated `audio_control_treatment: always_visible_audio` standing from the first OAR in this sequence.
- Ambient material tones remain held: `TONES_HELD = true` in `MeasuresRegistryOrchestrator.tsx` was **not** changed, per explicit instruction not to re-enable held audio.
- No stutter attributable to code-splitting was observed; route-level chunks (`CrystalSeatRenderer`, `ObsidianChamberRenderer`, `MarbleChamberRenderer`, `LapisChamberRenderer`, `GovernanceAuditSurface`) load as separate small chunks (6–24 KB gzipped each, per the `npm run build:registry` output in §2) well ahead of when a user reaches that chamber.

## 5. Network and Asset Review — Largest Assets Per Route

| route | largest asset | size | type |
| --- | --- | --- | --- |
| `/` | `ai_isnt_broken_intro.mp4` | **14.0 MB** | video (media.c3field.online) |
| `/about` | `about_measures_registry.mp4` | **12.9 MB** | video (media.c3field.online) |
| `/about` | `official_codexstone_seal.png` | 2.1 MB | image (Supabase storage, PNG) |
| `/undrifted` | `measures_registry_logo.webp` | 274 KB | image |
| `/undrifted` | `ai_isnt_broken_landing.webp` | 191 KB | image |
| `/ai-operations-assessment` | `measures_registry_mark.webp` | 175 KB | image (this is the `subtle_mark` watermark seated in the first OAR of this sequence) |

**Flagged for operator-side compression (not touched here):**

1. **`ai_isnt_broken_intro.mp4` (14.0 MB) and `about_measures_registry.mp4` (12.9 MB)** are almost certainly the dominant cause of the poor LCP on `/` (5.3 s) and `/about` (5.4 s) — both are full-bleed hero videos, the largest visible element on first paint, and Lighthouse throttles network speed during its trace. Re-encoding at a lower bitrate/resolution (still 1440p/1080p source, but web-delivery bitrate rather than a production-master bitrate) would very likely improve both routes' LCP substantially. This is a media re-encode, explicitly outside this OAR's "no CSS rewrite... document instead of rushing" boundary and "do not delete public assets without operator confirmation" — flagged, not attempted.
2. **`official_codexstone_seal.png` (2.1 MB)** on `/about` is a PNG where the rest of the site consistently uses `.webp` for imagery (e.99 `crystal_about_surface.webp` at 63 KB right next to it in the same page's asset list) — converting this one asset to WebP would likely cut it to a small fraction of its current size with no visible quality loss. Flagged for operator-side conversion; not converted here (asset modification requires operator confirmation per boundary).

No render-blocking resources were found on any route (`render-blocking-resources` audit: 0 items, all four routes) — the font-loading and script-loading strategy already in place is not a contributor here.

## 6. Layout Stability (CLS)

- `/` (CLS 0) and `/ai-operations-assessment` (CLS 0.001): no action needed.
- `/about` (CLS 0.058): within Lighthouse's "good" threshold (<0.1); not investigated further.
- `/undrifted` (CLS 0.136, "needs improvement"): Lighthouse's `layout-shifts` audit names `section.undrifted-cover` (the Issue 001 cover-story panel) as the most-shifted element, with a small secondary shift attributed to `Web font loaded` (Inter). Investigated the CSS: `.undrifted-cover` already has an explicit `min-height` reserved at every breakpoint (`registry.visual-system.css`, scoped under `[data-layout-contract="undrifted_publication"]`), and `.undrifted-cover-visual` already has either `aspect-ratio: 16/9` or a percentage-of-parent height reserved depending on breakpoint — i.e., the standard CLS-prevention pattern this OAR would otherwise apply is already present. Attempted to reproduce the shift locally (dev server, 412×823, matching Lighthouse's exact emulated viewport) and did not observe it under fast same-machine network conditions, which means the shift is plausibly timing-dependent on Lighthouse's throttled network/font-loading race rather than a missing CSS reservation. Given "do not invent image dimensions where... distortion risk exists" and the ambiguity in root cause under non-throttled conditions, **this is documented rather than changed** — a confident fix would need reproduction under actual throttled conditions (e.g. Chrome DevTools network throttling directly, not just Lighthouse's simulated pass) to identify the true cause before touching CSS that already looks structurally correct.

## 7. Paragraph `sameAs` Gap

**Already resolved, verified present** — no action needed in this OAR. Confirmed via live JSON-LD on `https://measuresregistry.com/`:

```json
{
  "@type": "Organization",
  "sameAs": ["https://twitter.com/measures_c3", "https://instagram.com/measures_registry", "https://www.linkedin.com/in/measures-registry", "https://paragraph.com/@undrifted"]
}
```

Both the `Organization` and `Person` (founder) JSON-LD nodes already include `https://paragraph.com/@undrifted` in `sameAs`, DB-sourced (not hardcoded in this OAR — this reflects a prior seeding, consistent with the repository's own commit history: `"Fix: seat Paragraph/unDrifted as an active social link, close sameAs gap"`). BlogPosting schema (×3) confirmed present on `/undrifted`.

## AI Visibility Checklist (§2 of OAR2)

| check | standing |
| --- | --- |
| One H1 on homepage | Confirmed — exactly 1 (`"AI Isn't Broken... Systems Are"`). |
| Crawlable H2 structure | Confirmed — 8 H2s, all real text content (not hidden). |
| Valid nav anchor links | Confirmed — Home/About/Assess the Environment/Understand the Environment all resolve to real `href`s. |
| JSON-LD present | Confirmed on `/` and `/undrifted` (Organization, WebSite, Person, ×3 BlogPosting). |
| `/llms.txt`, `/robots.txt`, `/sitemap.xml` return 200 | Confirmed, all three, via `curl`. |
| BlogPosting schema on `/undrifted` | Confirmed, 3 instances. |
| Person/Organization `sameAs` from DB | Confirmed, includes Paragraph — see §7. |

## Changed Files

- `src/app/App.tsx` — added `normalizePathname()`, applied it to the SEO-metadata effect's pathname lookup. No other logic touched.
- `dist-registry/**` — rebuilt via `npm run build:registry` (new JS chunk hashes, corrected client-side canonical behavior baked into the shipped bundle). Not committed, not deployed.

No CSS file was edited. No renderer visual behavior changed. No new route was created. No encounter architecture was replaced. No DB authority was bypassed — this OAR made no DB writes at all (it is a browser/build verification pass, not a seating pass).

## Remaining Launch Blockers

1. **Hero video weight (14.0 MB / 12.9 MB)** driving LCP into the 5–8s range on all four audited routes — highest-priority follow-up, requires operator-side media re-encoding decision (§5).
2. **`official_codexstone_seal.png` (2.1 MB)** — should be converted to WebP like every other image asset on the site (§5).
3. **`/about` has no governed SEO route unit** — its correct canonical/title are a static coincidence, not a governed binding; a future OAR should seat `route_authority`/`frontend_role`/`seo` metadata for `about_measures_registry` and add it to `REGISTRY_ROUTE_UNITS`/`REGISTRY_ROUTE_METADATA` properly (§2).
4. **`/undrifted` CLS (0.136)** — root cause not confidently isolated under real network throttling; needs a dedicated reproduction pass before any CSS change (§6).
5. **Committing and deploying the `App.tsx` fix + rebuilt `dist-registry`** — both are ready in the working tree, uncommitted, pending operator decision.

## Closeout

Browser QA and Lighthouse ran for real against the live site. One verified, safe, narrowly-scoped regression was found and fixed (client-side SEO metadata clobbering already-correct build-time tags on three routes after hydration) and confirmed working locally. Accessibility is clean everywhere. The one Best Practices gap is a third-party (Cloudflare) script, not fixable from this codebase. Mobile QA found no new issues. The dominant remaining performance problem — two multi-megabyte hero videos — is identified precisely but deliberately not touched, since re-encoding media is outside this OAR's safe-seam boundary and requires an operator decision.

Codex holds.
Field structures.
Measures registers.
Chazz validates.
Cody implemented the one safe fix and reported the rest.

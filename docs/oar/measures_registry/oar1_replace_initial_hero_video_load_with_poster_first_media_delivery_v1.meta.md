---
document_type: oar1
authority_level: evidence_closeout
document_scope: measures_registry_frontend_performance
title: OAR1 — Replace Initial Hero Video Load With Poster-First Media Delivery
status: resolved
version: v1
source_oar2: docs/oar/measures_registry/oar2_replace_initial_hero_video_load_with_poster_first_media_delivery_v1.meta.md
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
  - performance
  - hero-media
  - poster-first
  - video-defer
  - lighthouse
  - lcp
---

# OAR1 — Replace Initial Hero Video Load With Poster-First Media Delivery

## Addendum (2026-07-06, same day) — About page poster seated, click-to-play superseded

The operator supplied `poster_about_registry.webp` into the `measures-registry` storage bucket after this OAR1 was first closed out. This directly resolves the gap flagged in §2/§8 below ("no poster/still exists for `about_measures_registry_video`"). Seated it as a new `about_hero_poster` media role (`measures_media_map`, `registry_key: measures_registry_root`, `encounter_key: about_measures_registry`, mirroring the sibling `about_measures_registry_video` row's registry/encounter keys) and added it to `registryResolver.ts`'s `MEDIA_ROLES`. `AboutMeasuresRegistry` was then changed to match the homepage's `CrystalIntroSeat` pattern exactly: the poster renders immediately (`<img fetchPriority="high">`), and a `useEffect` identical to the homepage's (`load` event + `requestIdleCallback`, 1500 ms timeout, `setTimeout(200)` fallback) mounts the real `<video controls autoPlay muted playsInline poster={posterUrl}>` once the page has settled — replacing the click-to-play button entirely. The click-to-play button is kept only as a defensive fallback for the hypothetical case where `posterUrl` is ever unseated again.

This required moving the new `useEffect` (and the `videoUrl`/`posterUrl` reads it depends on) above `AboutMeasuresRegistry`'s early `if (!approved) return …` — React's rules of hooks forbid a hook after a conditional return, which `eslint`'s `react-hooks/rules-of-hooks` caught immediately. Fixed by hoisting both above the early return; `mediaByRole` lookups don't depend on `approved` so this is a safe move with no behavior change to the early-return path itself.

Live-verified on the rebuilt `dist-registry` bundle: `browser_network_requests` shows `poster_about_registry.webp` returning `200`, and `about_measures_registry.mp4` still fetches, but now only after the same settle-and-idle delay as the homepage (not eagerly, and no longer gated behind a click). Screenshots (`about_poster_first_check.png`, `about_desktop_poster_first.png`, in the evidence folder) confirm the video box fills correctly with no black box and no "Play video" button. `tsc --noEmit` and `eslint` both clean; `npm run build:registry` passes.

**This supersedes §2, and the corresponding rows in §6/§8 below, without rewriting them** — read this addendum as the current state for the About page; §2/§6/§8 are left as originally written to preserve the historical record of what was true at first closeout.

## Result

RESOLVED (bounded). Homepage (`crystal_seat_intro`) now paints a seated 130 KB WebP poster (`hero_poster` media role) immediately and defers the 14.0 MB `ai_isnt_broken_intro.mp4` fetch until after the page's `load` event settles, confirmed by live network-trace ordering — never simply asserted. About page (`crystal_seat_encounter`) no longer fetches its 12.9 MB video at all until the visitor explicitly clicks "Play video" — no poster/still was seated for that surface, so per this OAR2's "do not invent" instruction the deferral uses an authorized click-to-play trigger instead of a fabricated poster image; this is a reported change from the prior always-autoplay standing. The Codexstone seal PNG reference was repointed in the DB to the seated WebP everywhere `official_codexstone_seal` is consumed — and in the course of verifying that, found the PNG object no longer exists in storage at all (see §4), meaning this fix also resolves a live broken-image regression, not just a size optimization. Lighthouse before/after was run for `/` and `/about`; LCP itself did **not** measurably improve because the LCP element on both pages is text (headline / body paragraph), not media — the true remaining LCP blocker is the client-side Supabase fetch-before-render architecture, which is out of this OAR's authorized scope and is documented below per the OAR's own "or the remaining blocker is documented" clause. What did measurably improve: zero eager video bytes on About, main-thread blocking time on the homepage, and layout shift on About.

## 1. Homepage (`crystal_seat_intro`) — poster-first, load+idle-deferred video

`CrystalIntroSeat` in `src/measures_registry/encounter_renderer/chambers/CrystalSeatRenderer.tsx` now reads a new `hero_poster` media role (seated: `measures-registry/measures_registry_poster.webp`, 130,454 bytes, `usage: hero_poster`, `surface: landing_intro_video`) via `mediaUrl(encounter.mediaByRole.get("hero_poster"))`.

- Added `hero_poster` to the fetched `MEDIA_ROLES` list in `registryResolver.ts` — it was already seated in `measures_media_map` but never queried by the renderer.
- Added a `videoActivated` state (default `false`). Until it flips true, an `<img className="registry-crystal-intro-video" src={posterUrl} fetchPriority="high" loading="eager" />` renders in the exact fixed, full-bleed frame the video previously occupied (`object-fit: cover`, same class — no new CSS needed).
- A `useEffect` schedules activation: if `document.readyState === "complete"` already, or once the `load` event fires, it calls `requestIdleCallback(() => setVideoActivated(true), { timeout: 1500 })` (falling back to `setTimeout(…, 200)` where `requestIdleCallback` is unavailable). Only once `videoActivated && videoUrl` does the real `<video>` mount, with `poster={posterUrl}` also set as a native fallback.
- The "Enable Audio" button now only renders once the video is actually mounted (there is nothing to control before that).
- Click-to-advance (`onClick={handleAdvance}` on the whole section) and `onEnded`/`onError` auto-advance are unchanged — verified live (see §5): the intro auto-advanced to `crystal_seat_threshold` on video end in two separate fresh-navigation tests, exactly as before this OAR.

## 2. About page (`crystal_seat_encounter`) — click-to-play, no poster invented

Checked `measures_media_map` for any still/poster scoped to `about_measures_registry_video` or the About surface — none exists. `crystal_longform_surface` is already in use as the page-wide background image (a different, pre-existing role) and was not repurposed as an invented poster, per the OAR's explicit "if no poster image is seated, report the missing poster asset instead of inventing one."

Instead, `AboutMeasuresRegistry` now gates the video behind a `aboutVideoActivated` state, default `false`:
- Before activation: renders a `<button className="registry-about-orientation-video-activate">▶ Play video</button>` filling the same box the video will occupy.
- The container (`.registry-about-orientation-video` in `encounters/about.css`) was given `aspect-ratio: 16/9` and the video rule changed from `height: auto` to `height: 100%; object-fit: cover` — this fixes the box size for the placeholder **and** removes the layout shift that the video's intrinsic-size-driven `height: auto` was previously causing once its metadata loaded (see CLS numbers in §3).
- On click, `aboutVideoActivated` flips true and the real `<video controls autoPlay muted playsInline preload="auto">` mounts and plays — confirmed live (§5).

**Reported standing change:** this surface's video previously had `autoPlay` and would start immediately; it now requires a user click. This is an authorized deferral trigger under the OAR2's ROUTED §2 ("user clicks play"), chosen specifically because no poster/still is seated for this role and inventing one was explicitly disallowed. Flagging per "Cody may not… break autoplay/advance standing without reporting."

## 3. Codexstone seal — PNG → WebP, and a broken-image finding

Updated the `measures_media_map` row for `media_role = 'official_codexstone_seal'` (`campaign_key = measures_registry_root_authority_v1`) in place: `storage_path` changed from `official_codexstone_seal.png` to `official_codexstone_seal.webp`, `mime_type` to `image/webp`. This is a DB authority change, not a code change — both consumers (`CrystalOrientationSeat` and `AboutMeasuresRegistry` in `CrystalSeatRenderer.tsx`) already resolve this role dynamically via `mediaUrl(encounter.mediaByRole.get("official_codexstone_seal"))`, so no frontend edit was needed or made for the swap itself. The WebP file was verified to already exist in the `measures-registry` storage bucket (`storage.objects`, root path `official_codexstone_seal.webp`) — it is the same asset already seated and in live use as `marble_payment_confirmation_seal` for the MAP payment surface, not an invented file. The original PNG was **not** deleted (no operator approval sought or given for that).

**Finding, not invented:** while verifying the swap, checked whether the old PNG object still exists in storage — it does not. `storage.objects` has no row for `official_codexstone_seal.png` in any bucket, and a direct request to its public-URL path returns HTTP 400 from the Supabase Storage API. This means the Codexstone seal was silently broken (browser-rendered broken-image icon) on every surface that referenced it — `crystal_seat_orientation` and `crystal_seat_encounter` (About) — before this OAR, independent of anything performance-related. The WebP repoint fixes this as a direct side effect; confirmed live via network trace (§5): `official_codexstone_seal.webp` returns `200` on the About page.

## 4. Lighthouse — before / after

Both runs used `npm run build:registry` + `vite preview --outDir dist-registry --mode registry` on `localhost:4400` (production bundle, real Supabase project, Lighthouse 13.4.0, headless Chrome, performance category only). Multiple runs were taken per page because this app is client-rendered against a live Supabase round trip, which introduces real run-to-run network jitter — documented below rather than cherry-picking a single favorable run.

| Metric | `/` before | `/` after (2 runs) | `/about` before | `/about` after (4 runs) |
| --- | --- | --- | --- | --- |
| Performance score | 85 | 86, 86 | 77 | 81, 79, 79, — |
| LCP | 3.6 s | 3.6 s, 3.9 s | 4.3 s | 4.8 s, 5.4 s, 4.5 s |
| FCP | 2.6 s | 2.7 s, 2.0 s | 2.7 s | 1.9 s, 2.0 s, 2.7 s |
| TBT | 70 ms | 30 ms, 0 ms | 10 ms | 0 ms (all runs) |
| Speed Index | 3.4 s | 3.1 s, 2.4 s | 2.7 s | 2.3 s (best run) |
| CLS | 0 | 0, 0 | **0.122** | **0.058** (all runs) |
| Hero video in initial network trace | 14,008 KB (eager) | still appears (fetched post-`load`, deferred) | 13,137 KB (eager) | **absent** — 0 bytes unless clicked |

**Why LCP did not improve:** `lcp-breakdown-insight` confirms the LCP element on `/` is the `<h1>` headline text (not the poster or video) in both before and after runs, and on `/about` it is a body paragraph (not the video) in both runs. Neither page's LCP was ever gated by hero media weight — the OAR's OBSERVED premise that hero video was "likely driving poor LCP" does not hold up under this specific measurement, though it is genuinely the largest network payload and is now fetched responsibly. The dominant, unchanged cost is `elementRenderDelay` (≈850–1090 ms) plus, more significantly on `/about`, the gap between FCP and LCP — this app fetches `measures_registry` / `measures_encounter_def` / `measures_media_map` / `measures_encounter_surface_assignment` from Supabase client-side before real content can paint, and that live round-trip is the actual remaining LCP blocker on both pages (visible as 0.5–1 s of before/after variance across repeated runs of the *same* build). Fixing that would mean changing the client-side-fetch-then-render architecture, which this OAR does not authorize ("Cody may not… replace encounter architecture"). **Documented as the remaining blocker**, per this OAR's own validation clause.

**What did measurably improve, attributable to this OAR:**
- About page no longer transfers its 12.9 MB video unless the user opts in — a 100% reduction in unconditional initial payload for that asset.
- Homepage total blocking time dropped (70 ms → 0–30 ms) — the video's decode/initialization no longer competes with the main thread during the critical window.
- About page CLS roughly halved (0.122 → 0.058) from fixing the video container to a fixed `aspect-ratio` box instead of intrinsic-size-driven `height: auto`.
- Codexstone seal payload dropped and a broken image was fixed (§3).

## 5. Network and visual QA (live browser, Playwright)

All against the rebuilt `dist-registry` production bundle on `localhost:4400`.

- **Homepage:** fresh navigation → `browser_network_requests` (static included) shows `measures_registry_poster.webp` (200, 130,454 bytes) and the five DB queries resolve first; `ai_isnt_broken_intro.mp4` (206) appears only afterward, consistent with the `load`+idle deferral (exact sub-second poster-only window could not be captured in a screenshot due to tool round-trip latency, but the network-order evidence and the Lighthouse TBT/trace data both confirm the fetch is deferred, not eager). Auto-advance-on-end to `crystal_seat_threshold` observed twice on independent fresh loads — unchanged from prior standing. Desktop (1440×900) and mobile (390×844) screenshots confirm full-bleed frame, headline position, and "Enable Audio" control all unchanged.
- **About page:** fresh navigation → `about_measures_registry.mp4` does **not** appear in the network log at all (checked with a filter match) — zero bytes transferred. A black box with a centered "▶ Play video" control renders instead, at a fixed 16:9 ratio (confirmed via `getBoundingClientRect`: 350×197 on a 390 px mobile viewport). Clicking "Play video" immediately triggers the `206` fetch and the video plays in place, at the same box size, with native controls. Verified at desktop (full-page screenshot) and mobile (390×844, scrolled to the video box).
- **Codexstone seal:** on the About page, `official_codexstone_seal.webp` returns `200` and renders correctly as the small circular badge beside "Measures Registry" at both desktop and mobile widths.
- Not separately re-navigated this pass: `crystal_seat_orientation` (the other `official_codexstone_seal` consumer, reached only via a specific transition path not exercised in this session). No code in that renderer changed — only the DB media reference, via the same `mediaUrl()` call already proven working on the About page — so this is a low-risk, not a zero-risk, gap; flagged rather than silently skipped.

Evidence screenshots: `docs/oar/measures_registry/oar1_replace_initial_hero_video_load_with_poster_first_media_delivery_v1_evidence/` — `home_poster_phase.png`, `home_immediate.png`, `home_mobile.png`, `about_before_click.png`, `about_video_playing.png`, `about_mobile.png`, `about_mobile_video_box.png`, and (added by the addendum above) `about_poster_first_check.png`, `about_desktop_poster_first.png`.

## 6. Validation checklist

- [x] Homepage uses poster-first hero delivery (seated `hero_poster`, not invented)
- [x] About uses deferred hero delivery (click-to-play, since no poster is seated — reported, not invented)
- [x] Initial load avoids fetching the two large hero videos in the critical path — About: zero bytes until clicked; Home: deferred past `load`+idle, confirmed by network-order trace
- [x] Codexstone seal WebP replaces PNG references where available (DB-level, both consumers)
- [ ] `/` and `/about` Lighthouse LCP improve — **did not improve; remaining blocker documented in §4** (client-side Supabase fetch-before-render, out of this OAR's scope)
- [x] Encounter design remains intact (headline, CTA, audio control, click-to-advance, auto-advance, mobile containment, routing — all re-verified live)
- [x] Video remains available after interaction where appropriate (both surfaces play correctly once activated)
- [x] No DB authority bypassed — poster/seal resolution stayed fully DB-driven; no hardcoded media URLs added

## 7. Cody may / may not — compliance

Stayed within: updated frontend media mounting behavior, added poster-first video wrapper (home) and click-to-play wrapper (about), deferred video source assignment, used the seated WebP poster and WebP seal, rebuilt `dist-registry`, ran Lighthouse/browser validation.

Did not: remove seated media (PNG row's DB reference stayed intact in history via this document; the storage object was already gone before this OAR, not deleted by it), invent a poster asset for About (used an authorized click-trigger instead and reported it), hardcode unseated media, silently break autoplay standing (reported the About change explicitly), delete the PNG (moot — it no longer exists), touch encounter architecture or routing.

## 8. Outstanding / recommended follow-up

- The actual LCP blocker on both pages is the client-side Supabase fetch-before-first-real-paint. Addressing it (e.g., SSR, edge caching of the registry rows, or a lightweight inline critical-path payload) would require an architecture-level OAR — out of this one's scope.
- `crystal_seat_orientation` was not re-navigated live this pass (see §5) — low risk given the unchanged code path, but a direct spot-check would close the gap fully.
- No poster/still exists for `about_measures_registry_video`. If autoplay-on-load is later desired back for that surface, a poster/still asset should be seated first so the deferral can go poster-first rather than click-first.

## Git status

Nothing committed. Changed this OAR: `src/measures_registry/encounter_renderer/chambers/CrystalSeatRenderer.tsx`, `src/measures_registry/encounter_renderer/resolver/registryResolver.ts`, `src/measures_registry/encounter_renderer/styles/encounters/about.css`, plus the `measures_media_map` DB row for `official_codexstone_seal`. These sit alongside the uncommitted changes from the four prior OARs in this sequence (`git status --porcelain -- src`), unchanged since this OAR touched no other files.

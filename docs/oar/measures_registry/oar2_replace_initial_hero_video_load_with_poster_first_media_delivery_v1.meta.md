---
document_type: oar2
authority_level: working
document_scope: measures_registry_frontend_performance
title: OAR2 — Replace Initial Hero Video Load With Poster-First Media Delivery
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
  - performance
  - hero-media
  - poster-first
  - video-defer
  - lighthouse
  - lcp
---

# OAR2 — Replace Initial Hero Video Load With Poster-First Media Delivery

## OBSERVED

Browser QA confirmed that the dominant launch performance blocker is initial hero media weight.

Largest route assets:

- homepage: ai_isnt_broken_intro.mp4 — 14.0 MB
- about: about_measures_registry.mp4 — 12.9 MB

These full-bleed videos are likely driving poor LCP on first load.

The operator has asked whether the hero videos can be removed from initial load rather than re-encoded immediately.

A WebP Codexstone seal has also been uploaded and should replace the large PNG reference where seated.

## ALIGNED

Initial route load should not force multi-megabyte videos before the page becomes usable.

Poster-first media delivery preserves encounter design while reducing LCP pressure.

Video meaning is not removed.

Video becomes deferred, optional, or interaction-activated where safe.

Codex remains authority.

Frontend may optimize media loading behavior.

Frontend may not remove seated media, invent new media, or break encounter progression.

## ROUTED

### 1. Replace initial hero video load with poster-first delivery

For initial above-fold hero surfaces:

- homepage crystal seat intro
- About Measures Registry hero/video surface

Render optimized WebP poster or still image first.

Do not mount or fetch the video file during initial page load unless explicitly needed for active playback.

Use existing seated poster/still/media mapping where available.

If no poster image is seated, report the missing poster asset instead of inventing one.

### 2. Defer video activation

Video may load only after one of the following:

- user clicks play
- user enables video
- user interacts with the encounter
- page has settled and the video is non-blocking
- explicit seated autoplay requirement overrides poster-first behavior

Default launch behavior:

- poster-first
- video deferred
- no initial 14 MB or 12.9 MB video fetch

### 3. Preserve encounter behavior

Do not break:

- headline display
- CTA positioning
- click-to-advance behavior
- audio control standing
- mobile containment
- registry styling
- route resolution
- encounter sequencing

If video previously controlled automatic advance, preserve equivalent progression using the existing click/continue pathway or a safe timed fallback only if already seated.

### 4. Replace Codexstone seal PNG with WebP

Update media references from:

- official_codexstone_seal.png

to the uploaded/seated:

- official_codexstone_seal.webp

Apply only where the WebP asset is available and seated.

Verify About page and any crystal/about seal surfaces.

Do not delete the PNG unless operator separately approves cleanup.

### 5. Lighthouse validation

After implementation, rebuild and rerun Lighthouse for:

- /
- /about

Compare:

- LCP
- Performance score
- largest network assets
- whether hero videos are fetched on initial load
- whether Codexstone seal size is reduced

### 6. Network validation

Confirm initial load no longer fetches:

- ai_isnt_broken_intro.mp4
- about_measures_registry.mp4

unless user interaction or explicit activation occurs.

Report any route where the video still loads immediately and why.

### 7. Visual QA

Verify desktop and mobile:

- poster fills the same frame
- no layout shift
- no black box
- no missing-media gap
- CTA remains visible
- video activation works if user chooses it
- About page seal displays correctly

## VALIDATION

This OAR resolves successfully when:

- homepage uses poster-first hero delivery
- About uses poster-first hero delivery
- initial load avoids fetching the two large hero videos
- Codexstone seal WebP replaces PNG references where available
- / and /about Lighthouse LCP improve or the remaining blocker is documented
- encounter design remains intact
- video remains available after interaction where appropriate
- no DB authority is bypassed

## CODY ROLE

Cody may:

- update frontend media mounting behavior
- add poster-first video wrappers
- defer video source assignment
- use seated WebP poster images
- update Codexstone seal references
- rebuild dist-registry
- run Lighthouse/browser validation

Cody may not:

- remove seated media permanently
- invent poster assets
- hardcode unseated media
- break autoplay/advance standing without reporting
- delete PNG assets without operator confirmation
- replace encounter architecture
- introduce generic media components that bypass registry state

## VALIDATION OUTPUT

Return:

- changed files
- poster assets used
- video fetch behavior before/after
- Lighthouse before/after for / and /about
- Codexstone seal reference changes
- mobile/desktop visual QA notes
- remaining media compression needs
- any missing poster/still assets

## EXPECTED OAR1

docs/oar/measures_registry/oar1_replace_initial_hero_video_load_with_poster_first_media_delivery_v1.meta.md

## CLOSE

The encounter can remain cinematic without forcing video to become the first payload.

Poster first.
Video when ready.

Codex holds.
Field structures.
Measures registers.
Chazz validates.
Cody implements.
src renders seated state only.

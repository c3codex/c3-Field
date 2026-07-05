---
document_type: oar2
authority_level: working
document_scope: measures_registry_frontend_performance
title: OAR2 — Restore Performance and Media Delivery Authority
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
  - media-delivery
  - lighthouse
  - css
  - video
  - images
  - bundle
---

# OAR2 — Restore Performance and Media Delivery Authority

## OBSERVED

Semantic authority, crawlable content authority, institutional metadata authority, and article schema are now seated and wired.

The next visible risk surface is performance and media delivery.

Measures Registry depends heavily on encounter media, video, images, styling, and animated surfaces.

Known likely performance seams:

- large CSS surface
- heavy hero media
- video-first encounter loading
- possible layout shift
- insufficient poster/preload strategy
- unoptimized image delivery
- route bundle weight
- non-critical media loading too early

This is now a delivery authority problem.

## ALIGNED

Performance work must not reduce encounter integrity.

Cody may optimize delivery, loading order, media attributes, CSS organization, and bundle behavior.

Cody may not replace seated encounter architecture, invent route logic, remove required media, or hardcode authority.

Frontend remains renderer only.

## ROUTED

### 1. Audit performance baseline

Run and record baseline where possible:

- Lighthouse or equivalent local audit
- build size output
- largest JS chunks
- largest CSS assets
- largest image/video assets
- LCP candidate
- CLS risks
- render-blocking resources

Return findings before and after changes.

### 2. Hero media delivery

For above-fold encounter media:

- add poster images where available
- ensure width and height or aspect-ratio are declared
- preload only the active first hero asset
- avoid preloading every chamber asset
- defer non-critical video/audio
- preserve autoplay/advance behavior where already working

Do not remove sound/media controls where they are required by prior OARs.

### 3. Video optimization

Inspect video loading paths.

Implement:

- preload="metadata" or preload="none" for non-initial videos
- preload="auto" only when justified for first encounter video
- playsInline where needed
- poster fallback where available
- lazy activation for downstream videos

Report any media files that are too large and require operator-side compression.

### 4. Image optimization

For images:

- verify dimensions are defined
- lazy-load below-fold images
- eager-load only above-fold critical images
- use existing optimized formats where available
- avoid loading unused chamber images on first paint
- add responsive handling where straightforward

Do not change image meaning or swap assets unless already seated.

### 5. CSS audit and containment

Audit the large stylesheet surface.

Do not rewrite the whole styling system in this OAR.

Instead:

- identify dead or duplicate style regions
- isolate global styles from chamber/encounter styles where safe
- reduce obvious duplication
- preserve governed style profiles
- avoid generic SaaS replacement styling
- do not collapse chamber-specific style authority

Return a list of remaining CSS debt if full cleanup is too large.

### 6. Font and render blocking

Review font loading.

Where safe:

- add preload for critical font files actually used
- reduce blocking behavior
- preserve visual identity
- avoid introducing external font dependency

Do not expose or share font files.

### 7. Bundle and route loading

Review build output.

Where safe:

- split heavy non-critical code
- lazy-load non-entry encounter components
- avoid loading all chamber renderers on the initial surface if unnecessary
- preserve route resolution from existing registry/orchestrator logic

No route invention.

No hardcoded fallback routing.

### 8. Layout stability

Reduce CLS risks:

- declare media dimensions or aspect ratios
- reserve hero/media frames
- avoid late insertion that shifts primary CTA
- preserve one-frame encounter design

### 9. Validation

This OAR resolves successfully when:

- build passes
- baseline and post-change performance findings are reported
- initial route loads fewer non-critical media assets
- above-fold media has stable dimensions or aspect ratio
- downstream videos are deferred where safe
- images use lazy/eager intentionally
- CSS debt is reduced or inventoried
- no encounter architecture is removed
- no DB authority is bypassed

## CODY ROLE

Cody may:

- optimize frontend media loading
- update video/image attributes
- add poster/preload behavior
- adjust CSS organization safely
- implement route-level lazy loading where safe
- report media assets needing compression
- rebuild dist-registry

Cody may not:

- remove required encounter media
- break audio controls
- replace encounter architecture
- hardcode authority
- invent routes
- collapse chamber style profiles
- introduce generic layout systems
- expose private assets or font files

## VALIDATION OUTPUT

Return:

- changed files
- baseline performance findings
- post-change performance findings
- media loading changes
- CSS changes
- bundle/chunk changes
- remaining performance debt
- any assets requiring operator-side compression

## EXPECTED OAR1

docs/oar/measures_registry/oar1_restore_performance_and_media_delivery_authority_v1.meta.md

## CLOSE

Semantic authority is seated.

Now the encounter must load cleanly.

Codex holds.
Field structures.
Measures registers.
Chazz validates.
Cody implements.
src renders seated state only.

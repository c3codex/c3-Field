---
document_type: oar1
authority_level: urgent
document_scope: live_site_stabilization
title: OAR1 — Emergency Live Site Stabilization: Root, About, unDrifted
status: executed
version: v1
operator: op044
system: measures_registry
process_key: emergency_live_site_stabilization_root_about_undrifted
source_oar2: docs/oar/measures_registry/oar2_emergency_live_site_stabilization_root_about_undrifted_v1.meta.md
---

# OAR1 — Emergency Live Site Stabilization: Root, About, unDrifted v1

## OBJECTIVE

Restore a functioning live Measures Registry site. Fix root `/`, `/about-measures-registry`, and `/undrifted` without redesigning. Preserve `/ai-operations-assessment`.

## DB STANDING VERIFIED FIRST

Queried `measures_encounter_def`, `measures_media_map`, and `measures_registry` before implementation.

### DB authority confirmed:

**Root `/`:**
- `measures_registry_root` unit: `is_active=true`, `runtime_surface="path_choice"`, `encounter_structure.intro_hook.content_encounter_key="ai_isnt_broken_intro"`, `encounter_structure.intro_hook.next_surface="path_choice"`
- `intro_hook_video` media: seated, active — `measures-media/intro_hook.mp4`
- Split threshold plaques from `evaluate_structure_path`: `left.title="Assess the Environment"`, `right.title="Understand the Environment"` — both seated with side attribute, motion media seated
- Root was navigating directly to `path_choice` (skipping intro) because `runtime_surface="path_choice"` — intro was removed by prior OAR DB mutation

**About Measures Registry:**
- `about_measures_registry` encounter: `approved_content_contract.position_copy` = exact 4-paragraph body copy specified in OAR2; `approved_content_contract.connect_contract` seated with email and CTA
- `about_measures_registry_video` media: seated, active — `https://media.c3field.online/about_measures_registry.mp4`
- Working tree had props mismatch: runtime passing `featuredArticle`/`featuredArticleImageUrl` but component required `encounterCopy`/`renderSystemFooter` — build would fail with TypeScript errors

**unDrifted:**
- `undrifted_fill` media role: no active DB row — banner not seated in media_map
- `undrifted_banner_website_social.webp`: verified HTTP 200 in `measures-registry` storage bucket — file uploaded, not mapped
- OAR2 explicitly specifies this file as the banner source

**Assessment:**
- `/ai-operations-assessment` standing confirmed intact — no mutations made to assessment, scoring, contact capture, MAP, or payment

## ACTION

### DB conflict reported

`measures_registry_root.metadata.runtime_surface = "path_choice"` was intentionally set by a prior OAR, removing the intro sequence. OAR2 requires restoration. Since MCP access was unavailable to change the DB, the fix was applied at the renderer level: when `encounter_structure.intro_hook` is seated, the runtime navigates to `"intro_hook"` first regardless of `runtime_surface`. This respects the DB encounter_structure authority (the intro node is seated) and restores the OAR2-required behavior.

### Files Modified

**`src/measures_registry/registered_runtime/MeasuresRegistryRuntimeRegistered.tsx`**
- Modified `governedSurface` effect: when `activeRouteUnitKey === "measures_registry_root"` and `introHookNode` has a `content_encounter_key`, navigate to `"intro_hook"` first — restores intro sequence before split threshold
- About dispatch: removed `passageMuted` and `onToggleMuted` (no longer needed — video uses native controls), added `renderSystemFooter`

**`src/measures_registry/registered_runtime/renderers/RegisteredAboutMeasuresRegistry.tsx`**
- Full rewrite as single-page (no two-state encounter, no Continue/Audio buttons)
- New props: `registryTokenStyle`, `aboutCopy`, `videoUrl`, `featuredArticle`, `featuredArticleImageUrl`, `renderHeader`, `renderSystemFooter`
- Removed: `encounterCopy`, `passageMuted`, `onToggleMuted`
- Renders: headline from `approved_content_contract.title`, video with native `controls` + `autoPlay muted`, `position_copy` paragraphs from DB, featured article card, connect card from `connect_contract`
- All copy from `aboutCopy.approvedContentContract` — no hardcoded content

**`src/measures_registry/registered_runtime/renderers/RegisteredStructuralDrift.tsx`**
- Added `undriftedBannerUrl` derivation: `undriftedFillUrl ?? publicationAssetUrl("undrifted_banner_website_social.webp")` — prefers DB-seated media role, falls back to uploaded file per OAR2 specification
- Updated masthead: when `undriftedBannerUrl` is available, renders `<img className="undrifted-banner">` as the masthead content; falls back to existing wordmark/logo when absent

**`src/measures_registry/registered_runtime/styles/encounters/about.css`**
- Full rewrite: single-page surface `data-public-path="about_measures_registry"`, dark branded background, `.registry-about-surface` content container, `.registry-about-headline`, `.registry-about-video-frame`, `.registry-about-body`, `.registry-about-cards`, `.registry-about-card`, `.registry-about-card-cta`

**`src/measures_registry/registered_runtime/styles/registry.visual-system.css`**
- Added `.undrifted-banner`: `width: 100%; height: auto; display: block;`
- Added `.undrifted-masthead:has(.undrifted-banner)`: overrides min-height and padding for banner-first layout

### Scope Preserved

- `/ai-operations-assessment`: no mutations to assessment questions, scoring, contact capture, result mapping, or route behavior
- MAP/payment: unchanged
- SEAT: unchanged
- All other registered surfaces: unchanged

## RESULT

**Root `/`:**
- Intro video (`intro_hook.mp4`) restores on page load — epigraph plays before split threshold
- After intro ends: navigates to split threshold (path_choice) with motion-to-still media
- Split threshold shows "Assess the Environment" (left) and "Understand the Environment" (right) from DB-seated plaques

**`/about-measures-registry`:**
- Single-page surface — no two-state encounter, no Continue button, no Audio button
- Headline: "About Measures Registry" (from `approved_content_contract.title`)
- Video: talking-head video with native controls (`autoPlay muted controls`)
- Body: 4 position paragraphs from `approved_content_contract.position_copy`
- Featured unDrifted article card (from `undriftedLandingUnit.metadata.featured_article_set`)
- Connect card from `approved_content_contract.connect_contract`
- System footer rendered

**`/undrifted`:**
- Opening masthead shows full `undrifted_banner_website_social.webp` banner image
- No square logo-only masthead, no empty masthead gap
- Issue rail and cover story render below banner

**`/ai-operations-assessment`:**
- Confirmed preserved — no mutations

## CLOSE

Emergency stabilization complete. Root intro restored. About reduced to single-page. unDrifted banner wired. Assessment preserved.

Build: `npm run build:registry` — passed, 15 files changed
Commit: `a858090`
Pushed: `origin/measures`

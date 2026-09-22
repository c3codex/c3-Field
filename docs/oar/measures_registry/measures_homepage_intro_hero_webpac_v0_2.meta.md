---
document_type: webpac
title: Measures Registry Public Intro + Homepage Hero WebPac
version: v0.2
status: complete_for_registry_admission
operator: op044
system: measures_registry
target_surfaces:
  - crystal_seat_intro
  - measures_registry_home
date: 2026-09-22
supersedes: measures_registry_home_c3webpac_v0_1
---

# Measures Registry Public Intro + Homepage Hero WebPac v0.2

## Purpose

Bind the Measures Registry public opening passage as one complete WebPac:

registered intro media
→ FREE autoplay render
→ auto-advance on end
→ Measures Registry homepage Hero
→ FREE-rendered governed content
→ Assess the Environment

The frontend remains a renderer. It does not author the intro asset, Hero copy, media location, or encounter order.

## Opening passage

Public root encounter:

1. FREE resolves `crystal_seat_intro`.
2. FREE calls the registered WebPac/Registry projection for `intro_hook_video`.
3. The intro video preloads and autoplays muted/playsInline for browser-safe autoplay.
4. A visible Skip control remains available.
5. `onEnded` and media-error fallback advance to `measures_registry_home`.
6. FREE renders the homepage Hero from the WebPac-backed Registry projection.
7. Hero CTA calls the registered AI Operations Assessment passage.

Direct `/home` remains a valid Hero-only route and does not require replaying the intro.

## Intro media

media_role: intro_hook_video
provider: cloudflare_r2
bucket: measures-media
object_path: ai_isnt_broken_intro_captioned.mp4
mime_type: video/mp4
standing: active
runtime_resolution: governed resolver / FREE
autoplay: true
muted: true
plays_inline: true
preload: auto
auto_advance_target: measures_registry_home
frontend_hardcode_allowed: false

Poster / fallback:

media_role: hero_poster
provider: supabase
bucket: measures-registry
object_path: measures_registry_poster.webp
mime_type: image/webp
standing: active
frontend_hardcode_allowed: false

## Homepage Hero copy

Headline:
Deploy AI with confidence.

Body:
Measures Registry helps organizations evaluate the operating environment before AI is implemented or expanded.

Support:
Find out whether the environment is ready — and what needs attention before deployment.

Primary CTA:
Assess the Environment

Primary CTA route:
`/ai-operations-assessment`

Primary CTA runtime target:
`obsidian_chamber_orientation`

## FREE header fields

free_label: FREE
free_expanded_name: Frontend Replacement Encounter Environment
free_placement: header
free_render_mode: live_html_css_overlay
free_background_baked_allowed: false
free_source_authority: webpac

## Hero media

media_role: hero_background
provider: supabase
bucket: measures-registry
object_path: campaign_derivatives/hero_background_mr.png
standing: active

media_role: measures_registry_logo
provider: supabase
bucket: measures-registry
object_path: measures_registry_logo.webp
standing: active

media_role: registry_mark
provider: supabase
bucket: measures-registry
object_path: measures_registry_mark.webp
standing: active

## Visual language

Operator reference establishes the current Measures Registry visual language as:

- institutional/editorial rather than generic AI advertising;
- obsidian, lapis, marble, platinum/silver;
- warm directional daylight or controlled architectural light;
- precise executive / operational environments;
- miniature or diorama systems language where useful;
- visible structure, routes, boundaries, roles, and operational depth;
- restrained blue computational overlays;
- high material realism;
- no generic neon cyberpunk treatment.

Uploaded/operator reference imagery is composition evidence only unless separately admitted as a runtime asset.

Hero/background assets should remain text-light or text-free where practical. Public copy, CTA, legal identity, and FREE fields remain governed HTML/CSS overlays rather than baked presentation truth.

## Source and custody

PAC:
`measures_registry_home_c3webpac_v0_2`

Parent EnvPac:
`c3envpac_measures_registry_v0_1`

PAC custody:
private repository source file represented by this WebPac.

Runtime media bytes remain in their registered provider custody locations. The WebPac persists package custody, media roles, approved use, runtime bindings, and encounter order without absorbing underlying provider bytes.

## Runtime bindings required for complete registration

- `intro_hook_video` → Cloudflare R2 / measures-media / ai_isnt_broken_intro_captioned.mp4
- `hero_poster` → Supabase / measures-registry / measures_registry_poster.webp
- `hero_background` → Supabase / measures-registry / campaign_derivatives/hero_background_mr.png
- `measures_registry_logo` → Supabase / measures-registry / measures_registry_logo.webp
- `registry_mark` → Supabase / measures-registry / measures_registry_mark.webp

## Registry projection

`measures_registry_root.metadata.home_hero` remains the public copy projection consumed by FREE.

Required projection metadata:
- `source_pac_key = measures_registry_home_c3webpac_v0_2`
- `source_webpac_path = docs/oar/measures_registry/measures_homepage_intro_hero_webpac_v0_2.meta.md`
- `free_source_authority = webpac`
- `frontend_hardcode_allowed = false`
- `intro_then_home = true`

## Non-collapse

WebPac package custody ≠ runtime media byte custody.
Registry projection ≠ source authorship.
FREE render ≠ source authority.
Autoplay ≠ audible playback permission.
Intro completion ≠ assessment standing.
Hero CTA ≠ assessment completion.
Reference visual ≠ registered runtime asset.

## Completeness

Required content: present.
Required intro binding: present.
Required Hero binding: present.
Required brand bindings: present.
Required CTA: present.
Required encounter order: present.
Required custody rule: present.
Required visual contract: present.

WebPac completeness: PASS FOR REGISTRY ADMISSION.

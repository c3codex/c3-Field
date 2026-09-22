---
document_type: webpac
title: Measures Registry Public Intro + Homepage Hero WebPac
version: v0.3
status: complete_for_registry_admission
operator: op044
system: measures_registry
target_surfaces:
  - crystal_seat_intro
  - measures_registry_home
date: 2026-09-22
supersedes: measures_registry_home_c3webpac_v0_2
---

# Measures Registry Public Intro + Homepage Hero WebPac v0.3

## Correction purpose

Resolve persistent runtime drift between the registered Measures Registry opening package and the FREE renderer.

This revision corrects the seam rather than adding another frontend fallback.

The required runtime chain is:

WebPac custody
→ Registry projection
→ FREE source-PAC validation
→ registered media binding
→ intro render
→ homepage Hero render
→ registered assessment passage

The public browser does not read `c3_pac` or `c3_pac_runtime_binding` directly.
Those tables remain governed package/binding records.
FREE consumes their released public Registry projection and must verify that every projected opening asset and copy object identifies this same active WebPac.

## Source PAC

PAC key:
`measures_registry_home_c3webpac_v0_3`

Parent EnvPac:
`c3envpac_measures_registry_v0_1`

Frontend role:
renderer only

Fallback-authored public copy:
not allowed

## Opening sequence

1. Root route resolves `crystal_seat_intro`.
2. FREE reads the released Registry projection.
3. FREE verifies `home_hero.source_pac_key`.
4. FREE accepts `intro_hook_video` only when the media projection carries the same `source_pac_key`.
5. The registered intro video autoplays muted and plays inline.
6. A user may choose `Enter with sound`; audible playback restarts from the beginning because browsers require a user gesture.
7. There is no Skip control.
8. Video completion advances to `measures_registry_home`.
9. A media error does not silently advance. FREE holds the media error visibly against the registered poster and may offer `Continue to Measures Registry`.
10. FREE renders the homepage Hero only when Hero copy, FREE header fields, visual contract, background media, and source PAC agree.
11. The Hero CTA calls the registered assessment passage.

## Intro policy

autoplay: true
muted: true
plays_inline: true
preload: auto
entry_control_label: Enter with sound
skip_control_allowed: false
auto_advance_on_end: true
auto_advance_on_error: false
error_continue_label: Continue to Measures Registry
auto_advance_target: measures_registry_home

## Intro media

media_role: intro_hook_video
provider: cloudflare_r2
bucket: measures-media
object_path: ai_isnt_broken_intro_captioned.mp4
mime_type: video/mp4
public_delivery: https://media.c3field.online/ai_isnt_broken_intro_captioned.mp4

Poster:
media_role: hero_poster
provider: supabase
bucket: measures-registry
object_path: measures_registry_poster.webp
mime_type: image/webp

## Homepage Hero projection

brand_name:
Measures Registry

headline:
Deploy AI with confidence.

body:
Measures Registry helps organizations evaluate the operating environment before AI is implemented or expanded.

support:
Find out whether the environment is ready — and what needs attention before deployment.

primary_cta:
Assess the Environment

primary_cta_route:
/ai-operations-assessment

primary_cta_target:
obsidian_chamber_orientation

## FREE header projection

free_label: FREE
free_expanded_name: Frontend Replacement Encounter Environment
free_placement: header
free_render_mode: live_html_css_overlay
free_background_baked_allowed: false
free_source_authority: webpac
source_pac_key: measures_registry_home_c3webpac_v0_3

## Hero media

media_role: hero_background
provider: supabase
bucket: measures-registry
object_path: campaign_derivatives/hero_background_mr.png

media_role: measures_registry_logo
provider: supabase
bucket: measures-registry
object_path: measures_registry_logo.webp

media_role: registry_mark
provider: supabase
bucket: measures-registry
object_path: measures_registry_mark.webp

All projected opening media must carry:
`source_pac_key = measures_registry_home_c3webpac_v0_3`

## Runtime failure rule

FREE must not hide a broken intro by treating `video.onerror` as successful intro completion.

FREE must not supply hardcoded public Hero copy when the projected WebPac source is incomplete or mismatched.

A source-PAC mismatch is a held render condition.

## Live-host proof required

Registry admission is not live-host proof.

Closeout requires production evidence that:

- `/` resolves the intro surface;
- the registered MP4 request succeeds;
- playback begins;
- no Skip control is rendered;
- `Enter with sound` can start/restart audible playback through a user gesture;
- `onEnded` advances to the homepage;
- a media error does not silently advance;
- `/home` renders the exact WebPac v0.3 Hero copy;
- the FREE header is rendered from the same source PAC;
- the registered background media resolves from the same source PAC;
- the CTA is `Assess the Environment` and enters the registered assessment passage;
- the production bundle corresponds to the repair commit deployed from the `measures` branch.

Until those checks pass:
`live_host_proof = pending`.

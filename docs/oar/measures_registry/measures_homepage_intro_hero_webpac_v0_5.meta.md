---
document_type: webpac
title: Measures Registry Public Intro + Homepage Hero WebPac
version: v0.5
status: complete_for_registry_admission
operator: op044
system: measures_registry
target_surfaces:
  - crystal_seat_intro
  - measures_registry_home
date: 2026-09-27
supersedes: measures_registry_home_c3webpac_v0_4
---

# Measures Registry Public Intro + Homepage Hero WebPac v0.5

## Correction purpose

Restore the Measures Registry institutional opening package to the Operator-confirmed assets in institutional custody and eliminate stale v0.3/v0.4 runtime projection drift.

Required chain:

Institutional asset custody
→ registered WebPac composition
→ Registry projection
→ FREE verification
→ intro render
→ homepage Hero render

Assets remain in institutional custody. The WebPac declares their identity and location. FREE does not take custody.

## Source PAC

PAC key:
`measures_registry_home_c3webpac_v0_5`

Parent EnvPac:
`c3envpac_measures_registry_v0_1`

Frontend role:
renderer only

Fallback-authored public copy:
not allowed

## Opening sequence

1. Root route resolves `crystal_seat_intro`.
2. FREE reads the released Registry projection.
3. FREE verifies the active source PAC.
4. The registered intro video autoplays muted and plays inline.
5. `Enter with sound` restarts audible playback from the beginning after user gesture.
6. There is no Skip control.
7. Video completion advances to `measures_registry_home`.
8. Media failure does not silently advance and displays the registered fallback poster.
9. Homepage Hero renders only when source PAC and registered media projection agree.
10. Hero CTA enters the registered assessment passage.

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
object_path: ai_isnt_broken_intro (2).mp4
mime_type: video/mp4
public_delivery: https://media.c3field.online/ai_isnt_broken_intro%20(2).mp4

Poster / video-failure fallback:
media_role: hero_poster
provider: supabase
bucket: measures-registry
object_path: Measures_Governed_Environments_social_1x1.webp
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

## FREE resolution

FREE is an internal governed resolver for this institutional surface.
It is not public brand copy and is not rendered as a public header label.

free_source_authority: webpac
source_pac_key: measures_registry_home_c3webpac_v0_5

## Hero media

media_role: hero_background
provider: supabase
bucket: measures-registry
object_path: MR_hero_backdrop.webp
mime_type: image/webp

media_role: measures_registry_logo
provider: supabase
bucket: measures-registry
object_path: measures_registry/home/hero/measures-registry-presentation-seal-v1.webp
mime_type: image/webp

media_role: registry_mark
provider: supabase
bucket: measures-registry
object_path: measures_registry_mark.webp
mime_type: image/webp

All projected opening media must carry:
`source_pac_key = measures_registry_home_c3webpac_v0_5`

## Runtime failure rule

A source-PAC mismatch, custody mismatch, or registered-composition mismatch is DNR.

FREE must not hide a broken intro by treating `video.onerror` as successful intro completion.

FREE must not supply hardcoded public Hero copy when the registered projection is incomplete or mismatched.

## Live-host proof required

Registry admission is not live-host proof.

Closeout requires production evidence that:

- `/` resolves the intro surface;
- the registered MP4 request succeeds;
- playback begins;
- no Skip control is rendered;
- `Enter with sound` can start/restart audible playback through a user gesture;
- `onEnded` advances to the homepage;
- a media error displays `Measures_Governed_Environments_social_1x1.webp`;
- `/home` renders the registered v0.5 Hero copy;
- the registered `MR_hero_backdrop.webp` renders as the Hero background;
- the registered presentation seal renders on the right obsidian column;
- no public FREE label is rendered;
- the CTA is `Assess the Environment` and enters the registered assessment passage;
- production deploys from the `measures` branch.

Until those checks pass:
`live_host_proof = pending`.

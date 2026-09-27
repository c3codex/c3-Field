---
document_type: webpac
title: Measures Registry Public Intro + Homepage Hero WebPac
version: v0.6
status: complete_for_registry_admission
operator: op044
system: measures_registry
target_surfaces:
  - crystal_seat_intro
  - measures_registry_home
date: 2026-09-27
supersedes: measures_registry_home_c3webpac_v0_5
---

# Measures Registry Public Intro + Homepage Hero WebPac v0.6

## Purpose
Tighten the institutional presentation without changing Registry meaning. Preserve the v0.5 asset corrections while correcting intro playback, subtitle rendering, header scale, and Hero seal presentation.

## Source PAC
PAC key: `measures_registry_home_c3webpac_v0_6`
Parent EnvPac: `c3envpac_measures_registry_v0_1`
Frontend role: renderer only
Fallback-authored public copy: not allowed

## Intro policy
autoplay: true
muted: false
plays_inline: true
preload: auto
audible_attempt: true
audible_blocked_behavior: require_user_gesture_without_silent_muted_fallback
entry_control_label: Enter with sound
skip_control_allowed: false
auto_advance_on_end: true
auto_advance_on_error: false
error_continue_label: Continue to Measures Registry
auto_advance_target: measures_registry_home
normal_loading_poster: none
failure_artwork_only: true

## Intro media
media_role: intro_hook_video
provider: cloudflare_r2
bucket: measures-media
object_path: ai_isnt_broken_intro (2).mp4
mime_type: video/mp4
public_delivery: https://media.c3field.online/ai_isnt_broken_intro%20(2).mp4

subtitle_track:
kind: subtitles
language: en
label: English
default: true
public_delivery: https://media.c3field.online/ai_isnt_broken_intro.en.vtt

Failure artwork:
media_role: hero_poster
provider: supabase
bucket: measures-registry
object_path: Measures_Governed_Environments_social_1x1.webp
mime_type: image/webp
usage: actual_video_failure_only

## Homepage Hero
brand_name: Measures Registry
headline: Deploy AI with confidence.
body: Measures Registry helps organizations evaluate the operating environment before AI is implemented or expanded.
support: Find out whether the environment is ready — and what needs attention before deployment.
primary_cta: Assess the Environment
primary_cta_route: /ai-operations-assessment
primary_cta_target: obsidian_chamber_orientation

## Hero media
hero_background: supabase / measures-registry / MR_hero_backdrop.webp
measures_registry_logo: supabase / measures-registry / measures_registry/home/hero/measures-registry-presentation-seal-v1.webp
registry_mark: supabase / measures-registry / measures_registry_mark.webp

## Presentation boundary
FREE remains an internal governed resolver and is not public brand copy.
Header scale and spacing may be tightened by the frontend after successful resolution.
Hero seal scale and placement may be tightened by the frontend after successful resolution.
No presentation change may alter Registry meaning, standing, route authority, PAC membership, or assessment passage authority.
All projected opening media must carry `source_pac_key = measures_registry_home_c3webpac_v0_6`.

## Failure rule
A source-PAC mismatch, custody mismatch, or registered-composition mismatch is DNR.
The failure artwork must not render as the normal video poster.
A blocked audible autoplay is not a media failure; it requires the user-gesture control.
A video media error may render the registered failure artwork and Continue control.

## Live-host proof required
Closeout requires production evidence that no poster flashes during normal loading; audible playback is attempted; blocked audible playback presents Enter with sound without silently starting muted; English VTT subtitles render by default; media error alone reveals the failure artwork; video completion advances; the registered backdrop and enlarged seal render; the institutional header has stronger scale; no public FREE label renders; and the assessment CTA retains its registered route.

Until those checks pass: `live_host_proof = pending`.

---
document_type: oar2
title: OAR2 — Intro Hook Epigraph Replacement
version: v1
status: ready_for_cody
system: measures_registry
surface: epigraph
asset: intro_hook_15sec.mp4
---


# OAR2 — intro_hook_15sec_epigraph_v1

## OBSERVED

- Current epigraph surface is acting as a placeholder / non-authoritative intro.
- New asset `intro_hook_15sec.mp4` is designated as epigraph replacement.
- Branding requirement:
  - mark-only open
  - no mid-text
  - mark + optional wordmark close
- Runtime requirement:
  - audio ON after user gesture
  - no forced mute
  - mute/unmute control present
  - no overlay copy
- System requirement:
  - epigraph is the first encounter surface
  - epigraph must route to landing path surface on completion
- Browser constraint:
  - autoplay with sound may be blocked
  - gesture fallback is required

## ALIGNED

- Epigraph is a Measures encounter surface, not UI decoration.
- Frontend must not invent behavior beyond seated requirements.
- Branding remains non-explanatory.
- Audio constraint is handled through gesture-first fallback, not forced mute.

Routing follows:

    epigraph -> landing_path_surface

## ROUTED

### 1. Media Source

    /public/media/intro_hook_15sec.mp4

### 2. Playback Logic

    if user has not interacted:
      render enter surface with brand mark only
      on click:
        set user interaction true

    if user has interacted:
      play intro_hook_15sec.mp4
      autoplay true
      muted false
      playsInline true

### 3. Controls

Visible:
- mute / unmute toggle only

Hidden:
- progress bar
- native full controls UI
- overlays
- skip as primary action

### 4. Branding Rules

Frontend must not add overlay text.

Video itself may contain:
- opening: Measures Registry mark
- closing: mark + optional wordmark

Frontend must not add:
- tagline
- CTA
- explanatory copy
- path labels

### 5. Completion Routing

    on video end:
      route -> landing_path_surface

No delay.
No intermediate state.

### 6. Failure Handling

If video fails to load:
- show static fallback frame
- preserve click-to-enter behavior
- allow manual continuation to landing path surface
- do not invent additional UI copy

## CODY ROLE

Cody implements epigraph playback surface strictly from this OAR2.

Cody must not:
- add copy
- add UI styling beyond minimal control
- infer alternate flows
- force mute to satisfy autoplay
- create route logic outside the registered surface contract

If browser blocks autoplay:
- use gesture gate
- keep audio enabled after interaction

## VALIDATION

Cody must return:

1. Video loads from correct path.
2. Audio plays after user interaction and is not muted by default.
3. Mute/unmute toggle functions correctly.
4. No frontend overlay text is present.
5. Video end routes to landing path surface.
6. Failure fallback does not invent new UI copy or alternate meaning.
7. No thread instruction was used as execution authority.

## CLOSE

Cody executes from OAR2 only.
No thread instruction.
No invented frontend truth.

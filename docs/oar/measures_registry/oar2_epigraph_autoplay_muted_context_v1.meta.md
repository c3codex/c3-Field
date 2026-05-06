---
document_type: oar2
title: OAR2 — Epigraph Autoplay + Muted Context
version: v1
status: ready_for_execution
system: measures_registry
surface: epigraph
scope: epigraph_only
---

# OAR2 — Epigraph Autoplay + Muted Context

## Objective

Update the Measures Registry epigraph only.

The current epigraph media is approved. This OAR2 does not replace the media, alter landing content, or modify other surfaces.

The epigraph should load as an immediate cinematic threshold with muted autoplay support and minimal textual context when sound is not active.

## Required Changes

### 1. Enable Epigraph Autoplay

The epigraph video must attempt autoplay on first load.

Required video behavior:

- autoplay: true
- muted: true by default
- playsInline: true
- preload: auto
- no click required to begin playback
- preserve existing Skip control
- preserve user ability to enable sound

If browser policy blocks sound, video should still play muted.

### 2. Update Audio Control Label

When the video starts muted, the control should read:

Sound

or:

Unmute

Do not display Mute before sound has been enabled.

Once sound is enabled, the control may switch to:

Mute

### 3. Add Muted Textual Context Overlay

Add a restrained text overlay during muted playback.

Recommended copy:

AI is not broken.
The systems are.

Integrity Governance begins where behavior becomes measurable.

Overlay behavior:

- visible on initial epigraph load
- positioned lower-left or lower-third
- should not obscure central triangle / star resolution
- silver-white text
- subtle dark gradient or scrim behind text only if needed for readability
- fades or softens after 4-5 seconds
- no large marketing layout
- no CTA button inside epigraph overlay

### 4. Preserve Epigraph Boundary

Do not change:

- landing_root content
- About page content
- cohort_conversion_encounter
- educate_eval_encounter
- IIS eval gates
- Phase Map
- Measures of Inanna surfaces
- DB schema
- routing logic outside epigraph entry behavior

## Validation

After execution, confirm:

- epigraph video autoplays muted on page load
- text overlay appears during muted playback
- Sound/Unmute label appears before user enables audio
- Mute label appears only after sound is enabled
- Skip still works
- landing surface loads after epigraph completion or skip
- no non-epigraph surfaces changed

## Close

This OAR2 tightens the epigraph as the first recognition threshold.

The approved media remains.
The behavior changes.
The muted state now carries context.


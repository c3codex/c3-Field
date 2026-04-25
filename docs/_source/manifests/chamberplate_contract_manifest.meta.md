---
document_type: implementation_manifest
authority_level: working
document_scope: chamberplate_contract
title: Chamberplate Contract Manifest
status: draft
version: v1
operator: op044
native_stack:
  codex: database
  field: schema
  measures: registry
  chazz: systems
---

# Chamberplate Contract Manifest

## Purpose

Define the DB-seated contract for chamberplate encounter units.

A chamberplate is the rendered encounter surface inside a chamber.

Frontend must not decide what a chamberplate is, what media it prioritizes, what text bodies it shows, what actions appear, or how return behavior resolves.

## Authority Order

Codex holds.  
Field structures.  
Measures registers.  
Chazz executes.

## Chamberplate Definition

A chamberplate is a registry-bound encounter surface that resolves:

- identity
- material
- chamber relation
- media behavior
- text bodies
- playback
- actions
- return behavior
- release/access standing

It is not a React component.

## Storage Location

Chamberplate contract is stored in:

`measures_encounter_def.metadata.chamberplate`

## Required Contract Bodies

Each chamberplate contract may define:

- mode
- media_role
- render_order
- audio_role
- text_bodies
- interaction_mode
- return_behavior
- material_binding
- route_targets
- capture_enabled
- panel_mode

## Standard Chamberplate Contract

```json
{
  "mode": "media_primary",
  "media_role": "primary",
  "text_bodies": ["description", "legend", "inscription"],
  "audio_role": "tonal_companion",
  "render_order": ["video", "image", "audio"],
  "interaction_mode": "guided",
  "return_behavior": "phase_map",
  "material_binding": "registry"

Chamberplate Modes

Allowed working modes:

media_primary
passage
choice_surface
plaque_overlay
phase_map
inscription_focus
Media Rule

Media order must be seated.

Frontend must not infer:

primary video
primary still
audio companion
animation-first
still-first

These resolve from:

chamberplate.render_order
renderer contract
playback contract
media render_order
Text Body Rule

Text bodies must remain distinct.

Allowed bodies include:

title
description
legend
inscription
explanation
plaque

Frontend may render only the bodies seated for the chamberplate.

Legend is not explanation.
Description is not inscription.
Plaque is not title.

Interaction Rule

Interaction mode controls user action behavior.

Known modes:

none
guided
choice
capture
gated

Frontend must not invent actions.

Return Behavior

Return behavior must be seated.

Known values:

phase_map
antechamber
previous_valid_surface
none

Frontend may not invent return routes.

Material Binding

Material binding determines how visual tone is resolved.

Known values:

registry
chamber
explicit

Default for exhibition chamberplates:

registry

Passage Chamberplates

Passage chamberplates use:

{
  "mode": "passage",
  "media_role": "transition",
  "render_order": ["video", "audio"],
  "interaction_mode": "none",
  "return_behavior": "none"
}

Passage timing belongs in playback contract.

Choice Surface Chamberplates

Choice surfaces use:

{
  "mode": "choice_surface",
  "media_role": "background_or_still",
  "render_order": ["image", "video", "audio"],
  "interaction_mode": "choice",
  "route_targets": ["inanna_seat", "temple_antechamber"],
  "return_behavior": "none"
}
Antechamber Chamberplates

Antechamber chamberplates use:

{
  "mode": "plaque_overlay",
  "media_role": "background",
  "text_bodies": ["plaque"],
  "interaction_mode": "capture",
  "capture_enabled": true,
  "panel_mode": "guest_registry",
  "return_behavior": "previous_valid_surface"
}
Gate Chamberplates

Gate chamberplates use:

{
  "mode": "media_primary",
  "media_role": "primary",
  "text_bodies": ["inscription", "description"],
  "audio_role": "tonal_companion",
  "render_order": ["video", "image", "audio"],
  "interaction_mode": "guided",
  "return_behavior": "phase_map",
  "material_binding": "registry"
}
Success Condition

Chamberplate contract is complete when frontend can render a chamber encounter without guessing:

media role
render order
text bodies
interaction mode
capture behavior
return behavior
material binding
Closing

If it renders inside a chamber, it resolves through a chamberplate contract.
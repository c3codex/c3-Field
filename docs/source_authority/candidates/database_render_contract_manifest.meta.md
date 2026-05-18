---
document_type: implementation_manifest
authority_level: working
document_scope: measures_database
title: Database Render Contract Manifest
status: draft
version: v1
operator: op044
native_stack:
  codex: database
  field: schema
  measures: registry
  chazz: systems
---

# Database Render Contract Manifest

## Purpose

Define what must be seated in DB before `src` renders any Measures of Inanna encounter surface.

Frontend must not infer behavior, layout, progression, capture, playback, node logic, or explanation.

## Authority Order

Codex holds.  
Field structures.  
Measures registers.  
Chazz executes.

DB is the authority surface for encounter truth.

## DB Authority Surfaces

- `measures_registry`
- `measures_release_state`
- `measures_encounter_def`
- `measures_transition_rule`
- `temp_exhibition_media`
- `codex_connect_capture`

## Required Contract Bodies

Each encounter must resolve from DB:

- renderer
- playback
- actions
- capture
- phase_map
- media
- transition_rules
- release_state

No contract means no render.

## Renderer Contract

Stored in:

`measures_encounter_def.metadata.renderer`

Required keys:

- layout
- show_header
- show_action_rail
- media_fit
- media_max_width
- media_max_height

Known layouts:

- choice_surface
- encounter_focus
- plaque_overlay
- passage_only
- phase_map

## Playback Contract

Stored in:

`measures_encounter_def.metadata.playback`

Required keys:

- mode
- auto_advance_on_video_end
- advance_delay_ms
- settle_ms
- fade_ms

Playback must be explicit.

## Capture Contract

Stored in:

`measures_encounter_def.metadata.capture`

Simple connect capture:

- mode: `codex_connect_capture`
- target_table: `codex_connect_capture`
- required_fields: `name`, `email`
- optional_fields: `message`

Capture writes directly to Codex table.

No implicit SRC1 creation.

## Phase Map Contract

Stored in:

`measures_encounter_def.metadata.phase_map`

Required bodies:

- nodes
- positions
- edges
- layout
- routing
- node_states
- labels
- legend
- explanation

Definitions:

- nodes → what exists
- positions → where it sits
- edges → relation
- routing → interaction result
- node_states → open/sealed logic
- labels → UI language
- legend → meaning layer
- explanation → interpretation layer

Phase Map must never be frontend-derived.

## Media Contract

Media resolves by:

- surface_key = registry_key
- display_context
- render_order
- media_type
- bucket_name
- storage_path

Rule:

Animation precedes still unless explicitly overridden.

## Transition Contract

Stored in:

`measures_transition_rule`

Defines:

- navigation
- return paths
- action triggers

Frontend renders transitions but does not create them.

## Validation Requirement

Every DB change must include verification of:

- registry_key
- encounter_key
- renderer
- playback
- capture
- phase_map

No blind updates.

## Success Condition

DB contract is complete when frontend can render without:

- guessing
- fallback logic
- hardcoding

## Closing

If it can be DB-driven, seat it in DB.
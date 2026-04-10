---
document_type: schema_key
authority_level: working
document_scope: measures_schema
title: Measures Schema Key — Column + Constraint Map
status: complete
version: v1
operator: op044
date: 2026-04-09
native_stack:
  codex: database
  field: schema
  measures: registry
  chazz: systems
tags:
  - schema-key
  - measures
  - columns
  - constraints
  - foreign-keys
  - allowed-values
---

# Measures Schema Key — Column + Constraint Map

## Purpose

Define the confirmed column and constraint standing for the live Measures schema surfaces already verified in thread.

## 1. measures_registry

Confirmed columns:
- id
- registry_key
- display_title
- registry_family
- encounter_type
- material_family
- sequence_order
- release_state
- access_state
- parent_registry_id
- depends_on_registry_id
- envelope_id
- phase_label
- is_active
- metadata
- created_at
- updated_at

Confirmed foreign keys:
- parent_registry_id -> measures_registry.id
- depends_on_registry_id -> measures_registry.id
- envelope_id -> ant_envelope.id

Confirmed uniqueness:
- primary key on id
- unique key on registry_key

Confirmed constrained values:

registry_family:
- spine
- chamber_directory
- gate
- epithet
- me

material_family:
- obsidian
- crystal
- marble
- lapis

release_state:
- sealed
- held
- released
- open
- closed

access_state:
- gated
- visible
- callable
- encounterable
- archived

Anti-drift notes:
- envelope_id exists but is not valid by default for exhibition gates
- phase_label exists but is not phase authority
- registry release/access values are stable seated standing, not a substitute for live release-state rows

## 2. measures_release_state

Confirmed columns:
- id
- registry_id
- release_state
- access_state
- release_reason
- access_reason
- phase_label
- release_at
- sealed_at
- effective_at
- metadata
- created_at
- updated_at

Confirmed foreign keys:
- registry_id -> measures_registry.id

Confirmed uniqueness:
- primary key on id
- unique key on registry_id

Confirmed constrained values:

release_state:
- sealed
- held
- released
- open
- closed

access_state:
- gated
- visible
- callable
- encounterable
- archived

Anti-drift notes:
- this table carries live standing, not family identity

## 3. measures_phase_calendar

Confirmed columns:
- id
- phase_key
- phase_family
- anchor_name
- anchor_date
- sequence_order
- standing_type
- notes
- is_active
- created_at

Confirmed uniqueness:
- primary key on id
- unique key on phase_key

Confirmed constrained values:

phase_family:
- gate
- epithet
- me
- calendar_anchor

anchor_name:
- new_moon
- full_moon
- june_solstice
- lions_gate
- september_equinox
- winter_solstice

standing_type:
- anchor_only
- confirmation_seal
- phased_ritual_release
- scheduled

Anti-drift notes:
- phase calendar is keyed schedule logic, not a direct registry FK surface

## 4. measures_encounter_def

Confirmed columns:
- id
- registry_id
- encounter_key
- display_title
- encounter_type
- material_family
- surface_type
- sequence_order
- pause_allowed
- is_entry_surface
- is_active
- metadata
- created_at
- updated_at

Confirmed foreign keys:
- registry_id -> measures_registry.id

Confirmed uniqueness:
- primary key on id
- unique key on encounter_key
- unique key on registry_id

Confirmed constrained values:

material_family:
- obsidian
- crystal
- marble
- lapis

surface_type:
- scroll
- aspect
- inscription
- passage
- glyph_surface
- phase_map
- threshold
- chamberplate

Anti-drift notes:
- do not multiply encounter defs unless structural difference requires it

## 5. measures_transition_rule

Confirmed columns:
- id
- from_registry_id
- from_encounter_id
- to_registry_id
- to_encounter_id
- transition_kind
- rule_state
- requires_release
- requires_dependency_satisfied
- requires_passage_ready
- requires_connect_prompt
- sort_order
- metadata
- created_at
- updated_at

Confirmed foreign keys:
- from_registry_id -> measures_registry.id
- to_registry_id -> measures_registry.id
- from_encounter_id -> measures_encounter_def.id
- to_encounter_id -> measures_encounter_def.id

Confirmed constrained values:

transition_kind:
- progression
- pause
- return
- release
- seal
- dependency_unlock
- connect_request_prompt

rule_state:
- active
- held
- inactive

Anchor rule:
- at least one from_* and one to_* side must be present

## 6. Cross-Surface Standing

- measures_registry = stable identity
- measures_release_state = live release/access standing
- measures_phase_calendar = keyed schedule standing
- measures_encounter_def = encounter-side structural behavior
- measures_transition_rule = transition logic

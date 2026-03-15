---
title: Measures Encounter Types
slug: measures-encounter-types
document_type: architecture
document_scope: pillar
document_status: active
authority_level: structural
canonical: true
event_required: false
related_pillar: measures
related_system: coherentai
source_origin: measures installation
last_reviewed: 2026-03-14
version: 1.0
tags:
  - measures
  - encounter
  - architecture
  - navigation
  - access-state
  - media
source_bucket: codex-vault
source_folder: measures-kernel
summary: Defines the canonical encounter types used by the Measures installation. All database records, encounter definitions, navigation logic, renderer behavior, access-state handling, and CoherentAI request routing refer to this model.
---
# Measures Encounter Types

Defines the canonical encounter types used by the Measures installation.

This document exists so that:

- database records
- encounter definitions
- navigation logic
- renderer behavior
- access-state handling
- CoherentAI request routing

all refer to the same encounter model.

Read together with:

- `docs/MEASURES_INSTALLATION_LOGIC_MAP.md`
- `docs/MEASURES_TEXT_TAXONOMY.md`
- `docs/COHERENTAI_SYSTEM_MAP.md`
- `docs/COHERENTAI_INSTALLATION_PROTOCOL.md`

---

# Purpose

Measures is a sequenced encounter system, not a flat collection of pages.

Each encounter type has:

- a distinct function
- a distinct state role
- distinct navigation behavior
- distinct media expectations
- distinct access rules

These types are not interchangeable.

---

# Core Encounter Set

The Measures installation uses the following encounter types:

- `epigraph_encounter`
- `passage`
- `gateboard`
- `gateplate_encounter`
- `connect_invite`

---

# 1. epigraph_encounter

## Function
Threshold opener for the Measures sequence.

## Purpose
- introduces descent
- establishes tone
- begins the installation rhythm
- opens Kumurrah Passage

## Media behavior
- may begin with animated media
- transitions to still
- delayed plaque-style text may appear on still

## Navigation behavior
- resolves forward into `passage`

## Access behavior
- should not be blocked by missing text
- should fall back from animation to still if needed

## Required fields
- `encounter_slug`
- `encounter_type`
- `next_encounter_slug`
- `manifest_slug` or equivalent media reference
- `is_open`

## Optional fields
- `container_slug`
- `title`
- `timing_profile`
- `text_ref`

---

# 2. passage

## Function
Transition encounter between threshold, board, and plate states.

## Purpose
- carries movement through the sequence
- bridges one stable encounter to another
- resolves the next target

## Media behavior
- may include animation or atmospheric media
- text may be minimal or absent
- missing text must not block transition

## Navigation behavior
A passage resolves to one of:

- `gateboard`
- open `gateplate_encounter`
- `connect_invite`

## Access behavior
A sealed target must resolve to `connect_invite`, not a dead end.

## Required fields
- `encounter_slug`
- `encounter_type`
- `target_slug` or `target_gate_slug`
- `next_encounter_slug` where applicable
- `is_open`

## Optional fields
- `opens_plate_slug`
- `fallback_action`
- `timing_profile`

---

# 3. gateboard

## Function
Navigation surface for available gate encounters.

## Purpose
- shows open or available gate entry points
- routes user into passage logic for selected gate
- acts as selector, not art encounter

## Media behavior
- may include board-specific imagery or atmosphere
- does not replace gateplate media

## Navigation behavior
- user selection resolves into `passage`
- should not jump blindly into unrelated encounter state

## Access behavior
- open gate selection enters passage toward gateplate
- sealed gate selection should resolve through governed access behavior

## Required fields
- `encounter_slug`
- `encounter_type`
- `is_open`

## Optional fields
- `available_gate_slugs`
- `container_slug`
- `layout_profile`

---

# 4. gateplate_encounter

## Function
Primary art encounter for a gate.

## Purpose
- presents the realized gate encounter
- holds the art surface
- supports delayed plaque text
- supports onward sequence navigation

## Media behavior
- animated media may be attempted first
- still media must be available as fallback where defined
- text must not block media mount

## Navigation behavior
- may resolve to next `passage`
- may resolve to `connect_invite` if onward target is sealed
- may expose explicit next navigation

## Access behavior
- open: render art encounter
- sealed: do not render as open encounter, resolve governed access path

## Required fields
- `encounter_slug`
- `encounter_type`
- `manifest_slug`
- `is_open`

## Optional fields
- `next_encounter_slug`
- `container_slug`
- `text_ref`
- `timing_profile`
- `media_profile`

---

# 5. connect_invite

## Function
Governed access state when a sealed encounter is reached.

## Purpose
- maintain continuity
- preserve c3 alignment
- invite relation without coercive breakage
- prevent dead-end or blank state

## Media behavior
- media optional
- may use lightweight supporting visuals

## Navigation behavior
- may offer return path
- may offer continue path where valid
- should preserve context of where invite occurred

## Access behavior
- only appears when sealed content is encountered
- should never masquerade as open encounter

## Required fields
- `encounter_slug`
- `encounter_type`
- `is_open = false`

## Optional fields
- `origin_encounter_slug`
- `target_gate_slug`
- `container_slug`
- `invite_text_ref`

---

# Encounter Resolution Rules

## Rule 1
`epigraph_encounter` resolves into `passage`.

## Rule 2
`passage` resolves into:
- `gateboard`
- open `gateplate_encounter`
- `connect_invite`

## Rule 3
`gateboard` routes into `passage`.

## Rule 4
`gateplate_encounter` is the art encounter for the gate.

## Rule 5
A sealed target never produces blank state.
It resolves into `connect_invite`.

---

# Encounter Navigation Contract

Preferred navigation field:

`next_encounter_slug`

Because sequence movement is encounter-based, not plate-only.

Additional useful fields may include:

- `target_gate_slug`
- `opens_plate_slug`
- `origin_encounter_slug`
- `container_slug`

---

# Access-State Contract

Each encounter should have a clear access state.

Minimum recommended field:

- `is_open`

Optional expanded field:

- `access_state`

Suggested values:

- `open`
- `sealed`
- `preview`
- `gated`

If `access_state` is present, renderer and CoherentAI should prefer it over derived assumptions.

---

# Media Contract

Encounter types may carry different media expectations.

## Minimal expectation
A renderer should be able to determine:

- animated asset
- still asset
- whether animation fallback is available

## Rule
Missing animation must not block still.
Missing text must not block media.

If both media forms fail, a graceful encounter fallback should be available:
- continue to next sequence
- return to temple

---

# Text Contract

Text roles should align with encounter type.

## epigraph_encounter
Uses epigraph text.

## passage
Uses passage text if defined.

## gateplate_encounter
Uses plaque and optional context/aspect.

## connect_invite
Uses invite text.

Text roles must not be collapsed across encounter types.

---

# Codexstone Container Relationship

All Measures encounters should preserve relationship to the Codexstone axis container where relevant.

Recommended field:

- `container_slug = codexstone`

This is especially important for:
- gateplate encounters
- gate passages
- future ME encounters

---

# CoherentAI Request Alignment

Requests involving Measures encounters should preserve encounter identity.

Recommended request fields:

- `pillar`
- `objectRef`
- `containerRef`
- `encounterType`
- `taskType`
- `candidateLayers`

Example:

```json
{
  "pillar": "measures",
  "objectRef": "gate-01",
  "containerRef": "codexstone",
  "encounterType": "gateplate_encounter",
  "taskType": "encounter-resolution"
}
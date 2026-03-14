---
title: OAR — Measures Gates Conversion: Canonical Installation Path Established
slug: oar-measures-gates-conversion-canonical-installation-path-established
log_type: OAR
scope: measures
status: active
date: 2026-03-11
tags:
  - measures
  - gates
  - installation
  - conversion
  - canonical-state
summary: Records the conversion of the Measures Gates sequence from mixed hardcoded logic into a canonical installation path driven by database state and reusable encounter rendering.
---

# Observation

The Obsidian Gates sequence was operating through a mixed model of hardcoded assets, inline text, legacy slug assumptions, and local canon scaffolding. This created drift between storage, database state, and rendered experience.

The installation path was present, but its authority was distributed across code rather than centered in canonical records.

# Alignment

The correct architecture became clear through the conversion:

- Supabase DB defines canonical state
- Supabase Storage holds canonical files
- the site renders from stable views
- hooks retrieve state
- helpers interpret state
- components render encounters
- MeasuresShell remains route shell, not content authority

This aligns Measures with the wider c3 field architecture, where structure, state, and systems remain distinct.

# Result

The Gates are now positioned as the reduction sequence of the Measures installation model.

Key outcomes:
- canonical gate slug model established
- markdown-to-database text sync operational
- `text_slot` introduced for multi-plaque encounters
- encounter bundle pattern introduced
- gate navigation shifted toward canonical slugs
- old hardcoded canon scaffolding identified for retirement
- shell retained while content authority moved to canonical state

# Remaining Work

- complete shared `ObsidianGatePlate`
- finish route alignment for all gate slugs
- finalize audio bus canonical sourcing
- retire obsolete gate hooks and old local canon files
- complete Gates II–VII data alignment

# Note

This conversion marks the point where the Gates begin functioning as installation units rather than isolated pages.
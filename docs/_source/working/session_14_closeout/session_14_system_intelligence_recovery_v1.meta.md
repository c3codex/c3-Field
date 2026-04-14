---
document_type: system_intelligence_capture
authority_level: working
document_scope: session_recovery
title: Session 14 — System Intelligence Recovery
status: complete
version: v1
operator: op044
date: 2026-04-12
native_stack:
  codex: database
  field: schema
  measures: registry
  chazz: systems
tags:
  - session-14
  - intel-recovery
  - exhibition
  - temporary-bridge
  - media
  - live-view
---

# Session 14 — System Intelligence Recovery

## 1. Session Scope

Session 14 resolved the bounded temporary bridge required to get Measures of Inanna live without hardcoded frontend media, while preserving native distinction from final contribution architecture, final registry seating, and final conversion surfaces.

## 2. Recovered System Intelligence

- A temporary live bridge is valid when it remains presentation-facing only and does not leak final SRC2, Codex contribution, OAR, envkey, or registry naming into the workaround layer.
- The minimal live bridge for exhibition media requires only one temporary table and one read view.
- The bridge should carry only:
  - what media renders
  - where it renders
  - in what order
  - from what bucket/path
  - whether it is active
- render_order remains the correct temporary ordering term; phase_order should not be introduced into the workaround.
- The frontend should read from the defined view contract, not raw table assumptions.
- Temple Home should resolve through three distinct click zones:
  - top = temple encounter
  - middle = Harrumuk Passage to Phase Map
  - bottom = Antechamber
- Antechamber should have its own direct opening from Temple Home and not be buried behind the middle route.
- Phase Map functions best in the current standing as its own visual surface with a center-call that opens the chamberplate sequence.
- The Antechamber requires at least one thesis block for threshold integrity, but this thesis may remain bounded temporary UI copy until full text seating occurs.
- The first three epithets should carry their own paired audio tracks from The Knew album rather than sharing a generic companion tone.
- Obsidian passage-family sound should remain distinct from epithet sound pairing.
- Missing visual or text surfaces should not be replaced with invented placeholders or cosmetic filler.

## 3. Structural Changes

### Decided
- use a separate private bucket: pre-codex-exhibition
- use one temporary table: temp_exhibition_media
- use one read view: v_temp_exhibition_media_active
- keep workaround naming minimal and non-leaking
- keep text out of the temp media table
- hold final contribution architecture separate from temporary exhibition function

### Drafted
- minimal SQL for temp_exhibition_media and v_temp_exhibition_media_active
- initial media insertion shape
- click-zone live route geometry
- Antechamber thesis copy
- epithet audio pairing logic
- passage audio placement logic

### Written
- temporary exhibition bridge docs
- temp bridge SQL
- initial temp media row set
- session OAR2 closeout in thread
- session intelligence recovery in thread

### Committed
- temporary exhibition bridge doc set committed
- bucket transfer addressed for bridge docs
- temp media bridge standing incorporated into live implementation process

### Bucketed
- pre-codex-exhibition bucket created and used
- current media and audio objects uploaded to separate private bucket

### Still Unresolved
- src live view integration in frontend
- exact route implementation for Temple Home click zones
- Phase Map center-click behavior
- chamberplate sequence live rendering
- final duplicate-check / row-cleanup pass
- full text seating beyond bounded Antechamber thesis
- retirement path timing for the temporary bridge

## 4. SQL / Registry Impact

- No final SRC2 or Codex contribution schema should be inferred from the temporary exhibition bridge.
- measures_registry remains distinct from the workaround and must not be used as intake or temporary parking.
- temp_exhibition_media should remain temporary and presentation-facing only.
- v_temp_exhibition_media_active is the correct live read contract for frontend media rendering.
- render_order is the correct temporary ordering field and should not be replaced by phase_order in the workaround.
- current Measures seeded references remain the governing schema surfaces for later real seating work, especially:
  - measures_registry as stable identity
  - measures_release_state as live standing
  - measures_encounter_def as encounter-side structural behavior
- The temporary bridge must be retired, migrated, or removed once final contribution and exhibition architecture is seated.

## 5. Carryforward

Session 15 should begin with src live view implementation:

- read from v_temp_exhibition_media_active
- group rows by surface_type + surface_key
- render Temple Home as three click zones
- route middle zone through Harrumuk Passage to Phase Map
- use Phase Map center-call to enter chamberplate sequence
- place bounded Antechamber thesis
- verify audio behavior on passage and epithet surfaces
- complete final go-live pass

## 6. Closing

Session 14 proved that exhibition function can go live through a bounded temporary render bridge without collapsing native authority layers.

This is not the final architecture.

It is the valid temporary structure that allows the exhibition to function while preserving the distinction required for later correct seating.

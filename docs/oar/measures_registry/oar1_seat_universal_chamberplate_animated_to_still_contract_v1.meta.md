---
document_type: oar1
authority_level: working
document_scope: universal_chamberplate_contract
title: OAR1 — Seat Universal Chamberplate Animated-to-Still Contract
status: completed_with_holds
version: v1
operator: op044
system: measures_registry
source_oar2: oar2_seat_universal_chamberplate_animated_to_still_contract_v1
---

# OAR1 — Seat Universal Chamberplate Animated-to-Still Contract

## Outcome

The universal chamberplate runtime contract is now implemented in frontend and seated in governed encounter/media metadata for the targeted chamberplate surfaces:

- `gate_1_crown_removed`
- `gate_2_lapis_beads`
- `gate_3_lapis_necklace`
- `chamber_epithets_01_primus_artus`
- `chamber_epithets_02_gemynd_corpus`
- `chamber_epithets_03_percipari`

Universal runtime standing now reads:

1. animation first when governed animation is seated
2. settle to still when governed still is seated
3. three aspect slots rendered in fixed order:
   - `aspect_original_artwork`
   - `aspect_historical_significance`
   - `aspect_rule_of_measure`
4. absent aspect content remains visibly unseated rather than invented
5. legacy chamberplate audio support rows are excluded from primary chamberplate rendering and no longer flatten into chamberplate media

## Frontend Repair

Updated:

- `src/measures_of_inanna/GenericEncounter.tsx`
- `src/index.css`

Implemented:

- canonical chamberplate role interpretation:
  - `featured_animation`
  - `settled_still`
  - `aspect_original_artwork`
  - `aspect_historical_significance`
  - `aspect_rule_of_measure`
- metadata-driven alias support through map metadata keys such as `contract_role` / `aspect_slot`
- fixed three-slot chamberplate aspect rail with absence standing
- removal of legacy chamberplate support audio from extra primary chamberplate rendering
- no hardcoded media URLs introduced

## DB Seating

Updated governed media map metadata for targeted chamberplates so legacy rows can resolve through the universal contract without surface-specific frontend exceptions.

Examples:

- `featured_video` rows now carry `contract_role: featured_animation`
- `oracle_card` / `image` rows now carry `contract_role: settled_still`
- `original_artwork` rows now carry `contract_role: aspect_original_artwork`
- `full_song` / `lapis_tone` / `material_tone` rows now carry `contract_excluded_from_universal_slots: true`

Updated targeted chamberplate encounter metadata with:

- `playback.mode: motion_then_still`
- `playback.video_mode: motion_then_still`
- `playback.settle_to_still: true`
- `chamberplate.universal_contract: animated_to_still_three_aspects`
- `chamberplate.aspect_slots`
- `chamberplate.aspect_absence_mode: show_absence`

Gate 01 previously carried `still_first` presentation standing; that drift was normalized into the universal motion-first contract.

## Verified Media Standing

Verified `200`:

- Gate 01 animation: `obsidian_chamberplate_gate01.mov`
- Gate 01 still: `measures_registry/pre_codex_exhibition/images/obsidian_chamberplate_gate01.webp`
- Gate 03 still: `measures_registry/pre_codex_exhibition/images/obsidian_chamberplate_gate03.webp`
- Primus featured motion
- Gemynd featured motion
- Percipari featured motion

Held due unverified or unseated authority:

- Gate 02 motion: prior known paths still return `404`
- Gate 02 still: prior known Supabase path still returns non-`200`
- Gate 03 motion: prior known path still returns `404`
- `aspect_historical_significance` content: not seated for targeted chamberplates in current governed rows
- `aspect_rule_of_measure` content: not seated for targeted chamberplates in current governed rows

This OAR1 does not invent replacement filenames or aspect content.

## Passage Guard

The chamberplate repair was kept distinct from passage handling.

No passage-specific fallback authority was restored.

## Validation

- `npm.cmd run build:inanna` passed
- universal chamberplate slot renderer compiles
- no duplicate settled still in aspect rail
- no hardcoded media URLs introduced
- live deploy still required for frontend runtime changes

## Close

One chamberplate contract is now seated in runtime and metadata.

What remains is content seating and motion verification for the still-held gate assets, not another chamberplate exception path.

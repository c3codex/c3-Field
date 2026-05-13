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

Refinement standing from thread follow-up:

- Crystal Temple Home remains outside the gate chamberplate slot contract
- gate chamberplates use named aspect slots:
  - `Original Artwork`
  - `Historical Significance`
  - `Rule Of Measure`
- gate plaque overlay is removed
- Gate 01 plaque text is reseated into the `Historical Significance` aspect slot body
- chamberplate aspect controls are moved off the bottom and into a side rail

## Frontend Repair

Updated:

- `src/measures_of_inanna/GenericEncounter.tsx`
- `src/measures_of_inanna/types.ts`
- `src/index.css`

Implemented:

- canonical chamberplate role interpretation:
  - `featured_animation`
  - `settled_still`
  - `aspect_original_artwork`
  - `aspect_historical_significance`
  - `aspect_rule_of_measure`
- metadata-driven alias support through map metadata keys such as `contract_role` / `aspect_slot`
- fixed chamberplate aspect rail with metadata-driven slot naming
- gate side-rail positioning instead of bottom-edge controls
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
- `chamberplate.aspect_absence_mode`

Gate 01 previously carried `still_first` presentation standing; that drift was normalized into the universal motion-first contract.

Additional thread refinement:

- Gate 01–03 now carry gate-specific named slot definitions in `metadata.chamberplate.aspect_slots`
- Gate 01 no longer renders plaque text as plaque overlay
- Gate 01 text body now lives under `aspect_historical_significance`
- Gate 01–03 now use `aspect_absence_mode: omit`
- Crystal Temple Home was intentionally left on its existing `choice_surface` standing

## Verified Media Standing

Verified `200`:

- Gate 01 animation: `obsidian_chamberplate_gate01.mov`
- Gate 01 still: `gate_01_chamberplate_rendered.webp`
- Gate 02 animation: `gate_02_chamberplate.MP4`
- Gate 02 still: `gate_02_chamberplate_rendered.webp`
- Gate 03 animation: `gate_03_chamberplate.MP4`
- Gate 03 still: `gate_03_chamberplate_rendered.webp`
- Primus featured motion
- Gemynd featured motion
- Percipari featured motion

Held due unverified or unseated authority:

- Gate 01 original artwork aspect: no verified Gate 01 original file supplied in current governed storage scan
- Gate 02 original artwork aspect: no verified Gate 02 original file supplied in current governed storage scan
- Gate 03 original artwork aspect: no verified Gate 03 original file supplied in current governed storage scan
- `aspect_historical_significance` content: not seated for targeted chamberplates in current governed rows
- `aspect_rule_of_measure` content: not seated for targeted chamberplates in current governed rows

This OAR1 does not invent replacement filenames or aspect content.

## Post-Closeout Amendment

Operator later confirmed the live L2 motion filenames for Gate 02 and Gate 03:

- `gate_02_chamberplate.MP4`
- `gate_03_chamberplate.MP4`

Those objects were verified `200` and then seated as governed `featured_video` rows with universal contract metadata:

- `pre_codex_exhibition_obsidian_chamberplate_gate02_video_v1`
- `pre_codex_exhibition_obsidian_chamberplate_gate03_video_v1`

Operator later confirmed Gate 01–03 rendered stills in Supabase bucket root:

- `gate_01_chamberplate_rendered.webp`
- `gate_02_chamberplate_rendered.webp`
- `gate_03_chamberplate_rendered.webp`

Those objects were verified `200` and reseated as governed settled still authority:

- `pre_codex_exhibition_obsidian_chamberplate_gate01_image_v1`
- `pre_codex_exhibition_obsidian_chamberplate_gate02_image_v1`
- `pre_codex_exhibition_obsidian_chamberplate_gate03_image_v1`

Gate 01–03 original-artwork aspect files remain unverified from the current governed storage scan.

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

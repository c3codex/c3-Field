---
document_type: oar2
authority_level: working
document_scope: universal_chamberplate_contract
title: OAR2 — Seat Universal Chamberplate Animated-to-Still Contract
status: proposed
version: v1
operator: op044
system: measures_registry
source_oar1:
  - oar1_diagnose_passage_runtime_and_enforce_epithet_contract_v1
  - oar1_repair_governed_chamberplate_media_authority_v1
native_stack:
  codex: database
  field: schema
  measures: registry
  chazz: systems
---

# OAR2 — Seat Universal Chamberplate Animated-to-Still Contract

## OBSERVED

Operator has added new assets to Measures Registry L2 and Supabase buckets sufficient to satisfy Gates 01–03.

Required universal chamberplate behavior:

1. animated media loads first
2. animation plays as primary chamberplate motion
3. chamberplate settles to still image
4. three aspects remain click-to-open:
   - original artwork
   - historical significance
   - rule of measure

This contract should apply universally to chamberplate surfaces, including:

- gate_1_crown_removed
- gate_2_lapis_beads
- gate_3_lapis_necklace
- chamber epithet chamberplates where applicable

## ALIGNED

Codex remains authority.

Field structures the chamberplate/aspect relation.

Measures registers media roles, sequence, and reveal.

Chazz routes the universal runtime contract.

Cody executes only from this OAR2.

No chamberplate-specific frontend exception is allowed.

## ROUTED

### 1. Define universal chamberplate media roles

Cody must support these governed media roles:

- featured_animation
- settled_still
- aspect_original_artwork
- aspect_historical_significance
- aspect_rule_of_measure

If existing role names differ, Cody must map them through DB-governed role records or metadata, not frontend hardcoding.

### 2. Seat Gate 01–03 governed media

For each gate:

- gate_1_crown_removed
- gate_2_lapis_beads
- gate_3_lapis_necklace

Cody must inspect the new L2/Supabase assets and seat only verified assets where retrieval returns 200.

Expected contract per gate:

- animation: L2 / R2 / large-media authority
- still: Supabase webp image authority
- original artwork aspect: Supabase webp image authority
- historical significance aspect: governed text/media record if seated
- rule of measure aspect: governed text/media record if seated

No invented media.

No fallback truth.

### 3. Universal chamberplate renderer contract

Runtime must render chamberplates as:

1. select governed animation first
2. autoplay animation when available
3. on completion or fail, settle to governed still
4. display aspect affordances
5. open aspect surfaces only on click
6. never duplicate settled still as aspect unless separately mapped
7. never flatten aspects into primary chamberplate media

### 4. Aspect contract

Each chamberplate may expose exactly three aspect slots when seated:

- original artwork
- historical significance
- rule of measure

If an aspect is missing, runtime must show absence or omit the slot according to governed encounter state.

Frontend may not invent aspect copy.

### 5. Passage black-screen guard

Because live Harrumuk black-screened after deploy, Cody must also verify the chamberplate contract does not worsen passage rendering.

Check:

- temple_antechamber → temple_harrumuk_passage
- direct temple_harrumuk_passage
- direct gate routes after phase map

If black-screen persists, report console/runtime error separately.

Do not hide passage failure inside chamberplate repair.

### 6. Validation matrix

After repair, Cody must validate:

- Gate 01 animation → still → 3 aspects
- Gate 02 animation → still → 3 aspects
- Gate 03 animation → still → 3 aspects
- no duplicate primary still in aspect rail
- no hardcoded media URLs
- no fallback authority restored
- no Supabase large-media drift introduced
- live/local/deployed distinction reported

## CODY ROLE

Cody may:

- inspect newly added bucket assets
- create/update governed media rows
- create/update chamberplate aspect mappings
- update universal chamberplate renderer logic
- validate Gate 01–03 contract
- write OAR1 closeout

Cody may not:

- hardcode asset URLs
- invent aspect content
- mutate unrelated surfaces
- delete fallback rows
- collapse aspects into chamberplate media
- bypass DB-governed mappings

## VALIDATION

This OAR2 resolves successfully when OAR1 reports:

1. universal chamberplate contract implemented
2. Gate 01–03 governed assets verified
3. animation-to-still sequencing works
4. all three aspect slots resolve where seated
5. missing aspects remain honestly absent
6. passage black-screen standing is reported separately
7. no hardcoded frontend media paths
8. no fallback authority restored
9. no unrelated surfaces mutated

## EXPECTED OAR1

    docs/oar/measures_registry/oar1_seat_universal_chamberplate_animated_to_still_contract_v1.meta.md

## CLOSE

One chamberplate contract.

Animation first.

Still settles.

Aspects open on click.

Codex holds.
Field structures.
Measures registers.
Chazz routes.

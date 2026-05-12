---
document_type: oar2
authority_level: working
document_scope: inanna_full_encounter_matrix_diagnostic
title: OAR2 — Diagnose Inanna Full Encounter Matrix
status: proposed
version: v1
operator: op044
system: measures_registry
source_oar1:
  - oar1_inanna_governed_media_public_read_policy_v1
  - oar1_enable_non_chamberplate_governed_media_resolution_v1
  - oar1_seat_epigraph_governed_animated_media_v1
  - oar1_repair_gate_1_crown_removed_encounter_resolution_v1
native_stack:
  codex: database
  field: schema
  measures: registry
  chazz: systems
---

# OAR2 — Diagnose Inanna Full Encounter Matrix

## OBSERVED

Multiple Inanna surfaces now show inconsistent runtime behavior.

Operator reports:

- epigraph loads
- crystal_temple_home does not load media
- temple_antechamber loads
- temple_harrumuk_passage does not load
- phase_map loads
- gate_1_crown_removed plays video, then still fails
- gate passages do not load
- gate_2_lapis_beads does not load
- gate_3_lapis_necklace does not load
- chamber_epithets_01_primus_artus does not load
- chamber_epithets_02_gemynd_corpus loads still only, not new video, but aspects are present
- codexstone loads
- me_01 does not load

Prior work confirmed several isolated seams were real and repaired:

- governed media public read
- non-chamberplate governed media resolution
- epigraph governed animation seating
- _encounter resolver candidate support

Current behavior indicates a broader encounter-family matrix mismatch rather than one isolated key.

## ALIGNED

Codex remains authority.

Field structures encounter relation.

Measures registers sequence, reveal, media, and transition.

Chazz diagnoses matrix-level coherence.

Cody executes only from this OAR2.

This OAR2 authorizes read-only full matrix diagnosis.

This OAR2 does not authorize:

- DB mutation
- frontend mutation
- resolver rewrite
- media mutation
- bucket copy
- fallback deletion
- transition repair

## ROUTED

### 1. Build expected encounter matrix

Cody must inspect the expected Inanna encounter family set, including at minimum:

- epigraph
- crystal_temple_home
- inanna_seat
- temple_antechamber
- temple_harrumuk_passage
- phase_map
- kumurrah_passage
- gate_1_crown_removed
- gates_passage_01
- gate_2_lapis_beads
- gates_passage_02
- gate_3_lapis_necklace
- gates_passage_03
- chamber_epithets_01_primus_artus
- epithets_passage_01
- chamber_epithets_02_gemynd_corpus
- epithets_passage_02
- chamber_epithets_03_percipari
- codexstone
- me_01

If actual DB keys differ, Cody must report exact seated keys and not infer replacements.

### 2. Matrix fields required

For each surface, report:

- registry_key requested
- registry row exists
- registry id
- parent_registry_id
- family
- surface_type
- release standing
- access standing
- expected encounter key candidates
- resolved encounter_key
- encounter_def exists
- renderer
- renderer supported yes/no
- governed media row count
- fallback media row count
- primary video media_key
- primary still media_key
- primary audio media_key
- media retrieval statuses
- transition/action targets
- live/deployed route result if testable
- failure class

### 3. Encounter key candidate audit

Cody must audit candidate matching for each tested registry key across:

- registry_key
- metadata encounter key
- registry_key_view
- registry_key_encounter

Report which form resolves for each surface.

### 4. Media role and precedence audit

For each surface with media, Cody must report:

- all governed media roles
- all fallback media roles if any
- selected primary video
- selected primary still
- selected audio
- whether video/still precedence is correct
- whether missing video causes still fallback correctly
- whether failed video retrieval blocks still fallback

### 5. Transition audit

For each surface with actions or progression, report:

- primary action target
- secondary action target
- return target
- phase-map target if applicable
- whether each target resolves to registry row
- whether each target resolves to encounter_def
- whether target renderer can render

### 6. Failure classification

Classify every failing surface as one of:

- missing registry row
- missing encounter_def
- encounter key candidate mismatch
- unsupported renderer
- missing governed media
- media URL retrieval failure
- video/still fallback precedence failure
- transition target mismatch
- release/access state issue
- stale deployed bundle
- public read policy issue
- frontend route construction drift
- unknown / requires follow-up

### 7. Pattern summary

Cody must identify whether failures cluster by:

- surface_type
- renderer
- encounter key naming convention
- media role naming
- passage/gate/epithet family
- transition target structure
- public read visibility
- deployed bundle mismatch

### 8. No mutation boundary

No mutation is authorized.

Any repair must be routed through a follow-up OAR2 after matrix review.

## VALIDATION

OAR1 must return:

1. full encounter matrix
2. exact failing surfaces
3. exact failure class per surface
4. candidate key resolution table
5. media role/precedence table
6. transition target table
7. pattern summary
8. recommended repair order
9. mutation count 0

## CODY ROLE

Cody may:

- inspect DB rows
- inspect deployed runtime behavior
- inspect local runtime behavior
- inspect resolver candidate logic
- test public media URLs
- produce matrix evidence
- write OAR1 closeout

Cody may not:

- mutate DB rows
- change frontend code
- create fallback routes
- invent missing encounter definitions
- alter media mappings
- delete fallback rows
- deploy

## EXPECTED OAR1

    docs/oar/measures_registry/oar1_diagnose_inanna_full_encounter_matrix_v1.meta.md

## CLOSE

Stop whack-a-mole.

Map the whole encounter field.

Codex holds.
Field structures.
Measures registers.
Chazz routes.

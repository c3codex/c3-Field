---
document_type: oar2
authority_level: working
document_scope: inanna_governed_media_authority_repair
title: OAR2 — Repair Inanna Governed Media Authority Across Passages
status: proposed
version: v1
operator: op044
system: measures_registry
source_oar1:
  - oar1_diagnose_inanna_full_encounter_matrix_v1
native_stack:
  codex: database
  field: schema
  measures: registry
  chazz: systems
---

# OAR2 — Repair Inanna Governed Media Authority Across Passages

## OBSERVED

Full matrix diagnosis shows Inanna is no longer failing from one route.

The dominant failure pattern is:

- fallback-driven media URL retrieval failure
- passage-family concentration
- unsupported renderer drift on two surfaces

Renderable governed surfaces already prove DB-governed media works.

Failing surfaces cluster around fallback-only or fallback-heavy records:

- crystal_temple_home
- inanna_seat
- temple_harrumuk_passage
- kumurrah_passage
- gates_passage_01
- gates_passage_02
- gates_passage_03
- epithets_passage_01
- epithets_passage_02
- me_01

The active drift is mixed media authority.

## ALIGNED

Codex remains authority.

Field structures relation.

Measures registers media and sequence.

Chazz routes runtime correction.

Cody executes only from this OAR2.

This OAR2 authorizes pattern-level repair.

This OAR2 does not authorize:

- one-off whack-a-mole media patches
- frontend hardcoded paths
- bucket deletion
- fallback row deletion
- invented media
- unrelated encounter rewrite

## ROUTED

### 1. Governed media authority first

Cody must ensure runtime attempts governed media lookup for all renderable Inanna surface families:

- aspect
- threshold
- chamberplate
- passage
- phase_map where applicable
- single_surface only if intentionally supported or reseated

Fallback media may only supplement missing types after governed media lookup.

Fallback may not override governed media.

### 2. Seat passage-family governed media where valid source exists

For each failing passage-family surface, Cody must inspect current fallback media and determine whether a valid governed media asset already exists or can be seated from verified object standing.

Surfaces in scope:

- temple_harrumuk_passage
- kumurrah_passage
- gates_passage_01
- gates_passage_02
- gates_passage_03
- epithets_passage_01
- epithets_passage_02

For each, Cody may create or update governed rows only when:

- source object exists
- provider/bucket/path is verified
- retrieval returns 200
- media type is correct
- surface mapping is deterministic

No invented media.

### 3. Correct non-passage fallback-heavy surfaces

Cody may repair governed media mappings for:

- crystal_temple_home
- inanna_seat
- me_01

Only where valid source media exists and runtime use is explicit.

### 4. Renderer drift

Cody must identify the two single_surface renderer cases.

For each, choose one:

- support single_surface renderer explicitly if it is valid contract
- or reseat the encounter to an already supported renderer

No silent fallback.

No renderer hardcoding to hide missing contract.

### 5. Full matrix validation

After repair, Cody must rerun the full encounter matrix.

Validation must report for every inspected surface:

- registry resolves
- encounter_def resolves
- renderer supported
- governed media row count
- selected primary video
- selected primary still
- selected audio
- retrieval status
- transition target status
- final render decision

### 6. Fallback boundary

Do not delete fallback rows.

Do not deactivate fallback rows unless governed replacement is validated and schema already supports non-destructive hold.

Fallback deactivation can be routed through a later cleanup OAR.

### 7. No bucket cleanup

No source bucket deletion.

No large media moved into Supabase.

Supabase remains webp image only.

R2 remains large media authority.

## CODY ROLE

Cody may:

- update runtime governed-media lookup if passage surfaces are excluded
- create/update governed media rows for verified assets
- create/update surface media mappings
- repair renderer contract drift only within named cases
- rerun full matrix validation
- write OAR1 closeout

Cody may not:

- hardcode media paths
- invent media assets
- delete fallback rows
- delete bucket objects
- migrate unrelated surfaces
- bypass DB authority
- proceed surface-by-surface without matrix validation

## VALIDATION

This OAR2 resolves successfully when OAR1 reports:

1. governed lookup applies across required Inanna surface families
2. passage-family failures are repaired or explicitly held with reason
3. crystal_temple_home, inanna_seat, and me_01 are repaired or explicitly held
4. single_surface drift is resolved or explicitly held
5. full matrix rerun shows remaining failures, if any, as named held items
6. no frontend hardcoded media paths introduced
7. no fallback deletion occurred
8. no Supabase large-media drift introduced
9. mutation count and changed files/rows are listed

## EXPECTED OAR1

    docs/oar/measures_registry/oar1_repair_inanna_governed_media_authority_across_passages_v1.meta.md

## CLOSE

End mixed authority.

Governed media first.

Fallback only as temporary supplement.

Codex holds.
Field structures.
Measures registers.
Chazz routes.

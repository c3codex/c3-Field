---
document_type: oar1
authority_level: execution_closeout
document_scope: inanna_full_encounter_matrix_diagnostic
title: OAR1 - Diagnose Inanna Full Encounter Matrix
status: completed_pending_chazz_review
version: v1
operator: op044
executor: Cody
system: measures_registry
source_oar2:
  - oar2_diagnose_inanna_full_encounter_matrix_v1
evidence:
  - diagnose_inanna_full_encounter_matrix_v1.json
executor_artifacts:
  - execute-diagnose-inanna-full-encounter-matrix.cjs
mutation_performed: false
mutation_count: 0
---

# OAR1 - Diagnose Inanna Full Encounter Matrix

## Result

Read-only full-matrix diagnosis completed.

The current Inanna runtime does not present one isolated remaining seam.

It presents a clustered matrix of failures, with the dominant pattern now being:

- fallback-driven media URL retrieval failure
- passage-family concentration
- a smaller renderer-contract drift on specific surfaces

Confirmed renderable in this diagnostic:

- `epigraph`
- `temple_antechamber`
- `phase_map`
- `gate_1_crown_removed`
- `gate_2_lapis_beads`
- `gate_3_lapis_necklace`
- `chamber_epithets_01_primus_artus`
- `chamber_epithets_02_gemynd_corpus`
- `chamber_epithets_03_percipari`
- `codexstone`

Confirmed failing in this diagnostic:

- `crystal_temple_home`
- `inanna_seat`
- `temple_harrumuk_passage`
- `kumurrah_passage`
- `gates_passage_01`
- `gates_passage_02`
- `gates_passage_03`
- `epithets_passage_01`
- `epithets_passage_02`
- `me_01`
- plus two surfaces under renderer drift classification

## Live Runtime Standing

Live deployed Inanna asset observed during diagnosis:

- `assets/index-DGEAOe4x.js`

Live HTML title:

- `Measures of Inanna`

Live public env standing:

- Supabase public URL marker present
- Supabase publishable key marker present
- `VITE_R2_PUBLIC_BASE_URL` marker present as `https://media.c3field.online`

Minified live bundle inspection for direct `_encounter` fallback verification was inconclusive.

This OAR1 does not classify stale deployed bundle as a proven active seam.

## Full Encounter Matrix Summary

Matrix population:

- total surfaces inspected: `20`
- failing surfaces classified: `14`

Surface-type distribution:

- `aspect`: `1`
- `chamberplate`: `10`
- `threshold`: `1`
- `passage`: `7`
- `phase_map`: `1`

Failure distribution:

- `media URL retrieval failure`: `12`
- `unsupported renderer`: `2`

Renderer distribution:

- `encounter_focus`: `8`
- `choice_surface`: `1`
- `plaque_overlay`: `3`
- `passage_only`: `5`
- `phase_map`: `1`
- `single_surface`: `2`

## Candidate Key Resolution Table

Candidate audit was performed for each inspected surface across:

- `registry_key`
- metadata encounter key
- `registry_key_view`
- `registry_key_encounter`

Observed patterns:

1. Temple and intro surfaces usually resolve through `_view`

- `epigraph` -> `epigraph_view`
- `crystal_temple_home` -> `crystal_temple_home_view`
- `temple_antechamber` -> `temple_antechamber_view`
- `temple_harrumuk_passage` -> `temple_harrumuk_passage_view`

2. Governed gate / epithet / marble surfaces continue to rely on `_encounter` naming in DB truth

- `gate_1_crown_removed` -> `gate_1_crown_removed_encounter`
- `gate_2_lapis_beads` -> `gate_2_lapis_beads_encounter`
- `gate_3_lapis_necklace` -> `gate_3_lapis_necklace_encounter`
- `chamber_epithets_01_primus_artus` -> `chamber_epithets_01_primus_artus_encounter`
- `chamber_epithets_02_gemynd_corpus` -> `chamber_epithets_02_gemynd_corpus_encounter`

3. Passage-family rows remain mixed and fallback-heavy

- gate and epithet passages did not emerge as governed-media surfaces in this diagnostic
- they depend on temporary bridge media rows and successful fallback object retrieval

## Media Role And Precedence Summary

The strongest current pattern is media retrieval failure on fallback-driven surfaces.

Examples:

### Renderable governed surfaces

- `epigraph`
  - governed video: `epigraph_governed_animated_media_v1` -> `200`
  - governed still: `epigraph_still_image_support_v1` -> `200`

- `temple_antechamber`
  - governed still: `temple_antechamber_still_image_v1` -> `200`

### Failing fallback-driven surfaces

- `crystal_temple_home`
  - selected still: `crystal_temple_home.png`
  - retrieval: `400`

- `inanna_seat`
  - selected still: `rise_inanna_memory_myth.png`
  - retrieval: `400`

- `temple_harrumuk_passage`
  - selected video: `harrumuk_passage.mp4`
  - retrieval: `400`
  - selected audio: `etonal_phi_companion.wav`
  - retrieval: `400`

This same retrieval-failure pattern continues across unresolved passages and several fallback-only chamber surfaces.

## Transition Target Summary

Transition inspection did not show broad loss of route intent.

Observed route structure remains coherent:

- `epigraph` -> `crystal_temple_home`
- `crystal_temple_home` -> `temple_antechamber`
- `temple_antechamber` -> `temple_harrumuk_passage`
- `temple_harrumuk_passage` -> `phase_map`
- `phase_map` -> released gate / epithet / marble nodes
- `gate_1_crown_removed` -> `gates_passage_01`
- `gates_passage_01` -> `gate_2_lapis_beads`
- `gate_2_lapis_beads` -> `gates_passage_02`
- `gates_passage_02` -> `gate_3_lapis_necklace`
- `chamber_epithets_01_primus_artus` -> `epithets_passage_01`
- `chamber_epithets_02_gemynd_corpus` -> `epithets_passage_02`
- `codexstone` -> `me_01`

This OAR1 does not identify transition target loss as the dominant cross-family seam.

## Exact Failure Classes

Primary failure class per broken step is reported in the evidence matrix.

Dominant classes:

1. `media URL retrieval failure`

- `crystal_temple_home`
- `inanna_seat`
- `temple_harrumuk_passage`
- unresolved passage-family surfaces
- `me_01`

2. `unsupported renderer`

- two surfaces currently seated with `single_surface`
- runtime support expectation in current Inanna frontend is built around:
  - `encounter_focus`
  - `choice_surface`
  - `plaque_overlay`
  - `phase_map`
  - `passage_only`

## Pattern Summary

The matrix clusters by:

1. media path family

- governed intro/threshold surfaces are mostly healthy
- fallback-only surfaces are disproportionately failing with `400`

2. surface family

- passage surfaces are the tightest unresolved cluster

3. renderer contract

- `single_surface` appears as a distinct renderer drift subgroup

4. encounter naming

- `_view` and `_encounter` coexist
- this is not by itself classified as the active dominant failure after the Gate 1 repair

## Recommended Repair Order

Recommended next repair order:

1. diagnose passage-family media retrieval and fallback selection for Harrumuk and gate / epithet passages
2. audit failing media object URLs and provider / bucket mappings for unresolved fallback-driven surfaces
3. isolate the two `single_surface` renderer cases and decide whether to support or reseat them into the active renderer contract

## Boundary

No DB mutation.

No frontend mutation.

No resolver mutation.

No media mutation.

No deploy.

Mutation count:

- `0`

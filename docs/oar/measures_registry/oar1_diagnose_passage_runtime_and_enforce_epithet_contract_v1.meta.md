---
document_type: oar1
authority_level: execution_closeout
document_scope: live_passage_runtime_and_epithet_contract_repair
title: OAR1 - Diagnose Passage Runtime Drift and Enforce Epithet Chamberplate Contract
status: completed_pending_deploy
version: v1
operator: op044
executor: Cody
system: measures_registry
source_oar2:
  - oar2_diagnose_passage_runtime_and_enforce_epithet_contract_v1
evidence:
  - diagnose_passage_runtime_and_enforce_epithet_contract_v1.json
executor_artifacts:
  - execute-diagnose-passage-runtime-and-enforce-epithet-contract.cjs
mutation_performed: true
mutation_count: 2
---

# OAR1 - Diagnose Passage Runtime Drift and Enforce Epithet Chamberplate Contract

## Result

This OAR separated seated state from runtime state, applied one bounded governed-media repair for the epithet family, and patched the local Inanna runtime where passage/epithet behavior had drifted from the intended contract.

Completed work:

- diagnosed live passage-family standing separately from local source state
- verified the deployed Inanna bundle is not identical to the current local runtime source
- seated the missing governed featured video for `chamber_epithets_01_primus_artus`
- repaired local runtime handling so:
  - surface-family CSS contracts can actually activate from `resolution.surfaceType`
  - `original_artwork` can act as settled still fallback when `oracle_card` is absent
  - the chosen settled still does not also appear as a duplicate click-to-open aspect

## Seated State vs Runtime State

This OAR explicitly distinguishes three layers:

1. seated DB state
2. current local runtime source
3. current deployed runtime bundle

Standing after inspection:

- seated DB passage-family authority is mostly healthy for non-held passage surfaces
- current deployed bundle is still `assets/index-DGEAOe4x.js`
- current local build after runtime repair is `dist-inanna/assets/index-C1kk8lU3.js`

So the live site is not yet running the newly repaired local runtime.

## Passage-Family Diagnosis

Verified seated non-held passage-family rows:

- `temple_harrumuk_passage` -> governed featured video `harrumuk_passage.mp4` -> `200`
- `kumurrah_passage` -> governed featured video `kumurrah_passage.mp4` -> `200`
- `gates_passage_01` -> governed featured video `gates_passage_01.mp4` -> `200`
- `epithets_passage_01` -> governed featured video `epithet_passage_01.mp4` -> `200`
- `epithets_passage_02` -> governed featured video reuse of `epithet_passage_01.mp4` -> `200`

Held passage-family rows remain bounded and unchanged:

- `gates_passage_02`
- `gates_passage_03`

Runtime diagnosis conclusion:

- the live bundle already contains passage-governed lookup markers
- seated passage rows for non-held surfaces are present and retrievable
- operator-reported live passage break therefore points to runtime behavior or deploy propagation rather than missing governed authority for the verified non-held passage rows

Local runtime repair applied:

- `GenericEncounter` now emits the surface type as a class on the encounter root
- this activates the existing `.passage` and `.threshold` CSS/runtime styling contract that the stylesheet already expected

## Epithet Contract Enforcement

Required epithet chamberplate contract:

1. governed featured video loads first
2. featured video plays
3. runtime settles into governed still oracle-card state
4. aspects remain independently click-to-open

### Primus Artus

Found and repaired:

- live governed standing previously had no featured video row
- verified source object exists:
  - `https://media.c3field.online/primus_artus_obsidian_tone.MOV` -> `200`

Seated:

- asset row:
  - `chamber_epithets_01_primus_artus_featured_video_primus_artus_obsidian_tone_v1`
- mapping:
  - `surface_key = chamber_epithets_01_primus_artus`
  - `role = featured_video`
  - `sequence_index = 10`
  - `render_behavior = autoplay_after_passage`

This restores governed video-first seating for Primus Artus.

### Gemynd Corpus

Already consistent at seated authority:

- governed featured video present and retrievable `200`
- governed oracle card present and retrievable `200`

No DB mutation required.

### Percipari

Still bounded:

- no verified governed featured motion source returned `200`
- current governed still fallback remains `original_artwork`

Local runtime repair allows deterministic still fallback when `oracle_card` is absent, but this does not invent a missing Percipari motion source.

## Runtime Sequencing Repair

Changed source file:

- [GenericEncounter.tsx](C:/Users/c3DAO/OneDrive/Apps/c3Field/src/measures_of_inanna/GenericEncounter.tsx)

Runtime changes:

- added `resolution.surfaceType` to encounter root class list
- `primaryStill` selection now falls through:
  - `oracle_card`
  - `image`
  - `original_artwork`
- current `primaryStill` is excluded from the click-to-open aspect rail

Effect of the local runtime change:

- passage-family style/behavior branches can activate consistently
- chamberplates no longer duplicate the settled still as both primary still and aspect
- Percipari can settle to a governed still fallback instead of dropping into a no-still branch when oracle media is unavailable

## Row Mutation Summary

Changed DB rows:

- `public.codex_media_asset`: `1`
- `public.measures_surface_media_map`: `1`

Changed source files:

- [GenericEncounter.tsx](C:/Users/c3DAO/OneDrive/Apps/c3Field/src/measures_of_inanna/GenericEncounter.tsx)

No fallback authority was restored.

No media URLs were hardcoded in frontend.

No held-source boundaries were collapsed.

## Validation

Executor evidence confirms:

- live bundle title: `Measures of Inanna`
- deployed asset path: `assets/index-DGEAOe4x.js`
- live bundle includes passage lookup markers
- Primus Artus featured motion now seated and retrievable `200`
- Gemynd Corpus governed motion/still remain retrievable `200`
- Percipari remains bounded because no verified featured video source returned `200`

Local build verification passed:

- `npm run build:inanna`
- built asset: `dist-inanna/assets/index-C1kk8lU3.js`

## Deploy Standing

Important runtime boundary:

- DB repair for Primus Artus is already seated
- frontend runtime repair exists only in current local source until deploy
- live site will not reflect the passage/epithet runtime source fixes until the Inanna project deploys the updated bundle

## Remaining Holds

Unchanged held boundaries:

- `chamber_epithets_03_percipari` featured motion source
- `gate_2_lapis_beads`
- `inanna_seat`
- `gates_passage_02`
- `gates_passage_03`
- `me_01`

## Recommended Next Step

1. deploy the current Inanna frontend bundle so the runtime fixes replace `assets/index-DGEAOe4x.js`
2. validate live passage-family playback after deploy
3. route a bounded OAR2 only if live passage behavior still diverges after the new bundle is actually active

## Boundary

No invented media was introduced.

No fallback truth was restored as authority.

No unrelated registry mutation was performed.

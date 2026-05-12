---
document_type: oar1
authority_level: execution_closeout
document_scope: inanna_governed_media_authority_repair
title: OAR1 - Repair Inanna Governed Media Authority Across Passages
status: completed_with_named_holds_pending_deploy
version: v1
operator: op044
executor: Cody
system: measures_registry
source_oar2:
  - oar2_repair_inanna_governed_media_authority_across_passages_v1
evidence:
  - repair_inanna_governed_media_authority_across_passages_v1.json
  - diagnose_inanna_full_encounter_matrix_v1.json
executor_artifacts:
  - execute-repair-inanna-governed-media-authority-across-passages.cjs
  - execute-diagnose-inanna-full-encounter-matrix.cjs
mutation_performed: true
mutation_count: 14
---

# OAR1 - Repair Inanna Governed Media Authority Across Passages

## Result

Pattern-level repair completed.

This OAR ended mixed media authority across the repairable passage-family subset without introducing frontend hardcoded paths or deleting fallback rows.

Completed repairs:

- governed media lookup now includes `surface_type = passage`
- governed authority seated for verified passage-family video assets
- `crystal_temple_home` received governed still-image authority
- `gates_passage_02` and `gates_passage_03` were reseated from `single_surface` to supported `passage_only`
- full encounter matrix rerun completed after repair

## Source-Verified Governed Repairs

Verified source objects seated under governed authority:

1. `crystal_temple_home`
   - governed still: `pre_codex_exhibition_crystal_temple_image_v1`
   - provider: `supabase`
   - path: `measures_registry/pre_codex_exhibition/images/crystal_temple_home.webp`
   - retrieval: `200`

2. `temple_harrumuk_passage`
   - governed video: `pre_codex_exhibition_harrumuk_passage_video_v1`
   - provider: `cloudflare_r2`
   - bucket: `measures-media`
   - path: `harrumuk_passage.mp4`
   - retrieval: `200`

3. `kumurrah_passage`
   - governed video: `pre_codex_exhibition_kumurrah_passage_video_v1`
   - provider: `cloudflare_r2`
   - bucket: `measures-media`
   - path: `kumurrah_passage.mp4`
   - retrieval: `200`

4. `gates_passage_01`
   - governed video: `pre_codex_exhibition_gates_passage_01_video_v1`
   - provider: `cloudflare_r2`
   - bucket: `measures-media`
   - path: `gates_passage_01.mp4`
   - retrieval: `200`

5. `epithets_passage_01`
   - governed video: `pre_codex_exhibition_epithets_passage_01_video_v1`
   - provider: `cloudflare_r2`
   - bucket: `measures-media`
   - path: `epithet_passage_01.mp4`
   - retrieval: `200`

6. `epithets_passage_02`
   - governed mapping added by explicit reuse of `pre_codex_exhibition_epithets_passage_01_video_v1`
   - basis: existing session_25 reuse contract for epithet passage media
   - retrieval: `200`

## Resolver / Renderer Repair

Frontend resolver change:

- [resolve_encounter.ts](C:/Users/c3DAO/OneDrive/Apps/c3Field/src/measures_of_inanna/resolve_encounter.ts)
- governed-media lookup expanded from:
  - `chamberplate`
  - `aspect`
  - `threshold`
- to:
  - `chamberplate`
  - `aspect`
  - `threshold`
  - `passage`

Renderer drift repairs in DB:

- `gates_passage_02_encounter`
  - previous renderer: `single_surface`
  - current renderer: `passage_only`

- `gates_passage_03_encounter`
  - previous renderer: `single_surface`
  - current renderer: `passage_only`

No renderer hardcoding was introduced.

## Row Mutation Summary

Changed DB rows:

- `public.codex_media_asset`: `5`
- `public.measures_surface_media_map`: `6`
- `public.measures_encounter_def`: `2`

Changed source files:

- [resolve_encounter.ts](C:/Users/c3DAO/OneDrive/Apps/c3Field/src/measures_of_inanna/resolve_encounter.ts)
- [execute-diagnose-inanna-full-encounter-matrix.cjs](C:/Users/c3DAO/OneDrive/Apps/c3Field/docs/oar/measures_registry/execute-diagnose-inanna-full-encounter-matrix.cjs)

No fallback deletion.

No bucket deletion.

No Supabase large-media migration was introduced.

## Full Matrix Rerun

Post-repair full matrix standing:

- previous failing surface count: `14`
- current failing surface count: `8`

Renderer drift result:

- previous unsupported renderer count: `2`
- current unsupported renderer count: `0`

Remaining failure class count:

- `media URL retrieval failure`: `8`

## Named Holds

Held within this OAR2 scope because no verified governed source object was confirmed:

1. `inanna_seat`
   - current fallback: `rise_inanna_memory_myth.png`
   - retrieval remains `400`

2. `gates_passage_02`
   - renderer repaired
   - fallback references `gates_passage_01.mp4`
   - source reuse was considered too ambiguous for governed authority seating in this OAR

3. `gates_passage_03`
   - renderer repaired
   - no verified governed source object available

4. `me_01`
   - no verified governed chamberplate image confirmed
   - current fallback image/audio retrieval remains `400`

## Remaining Out-Of-Scope Failures

The rerun also still shows unresolved chamberplate-family media failures outside this OAR's bounded passage-first authority:

- `gate_1_crown_removed`
- `gate_2_lapis_beads`
- `gate_3_lapis_necklace`
- `chamber_epithets_03_percipari`

Those remain dominated by media retrieval failure on currently seated still/video authority and should be routed through a follow-up governed chamberplate media OAR.

## Deploy Standing

Important boundary:

- DB seating is complete for the repaired passage-family subset
- source code is updated locally and committed
- live site still needs the normal deploy path to pick up passage governed lookup from the new frontend bundle

Build verification passed locally:

- `npm run build:inanna`
- built asset: `dist-inanna/assets/index-BEvS63Zw.js`

## Recommended Next OAR2

Recommended follow-up order:

1. deploy current Inanna build so passage governed lookup reaches live runtime
2. repair governed chamberplate media authority for:
   - `gate_1_crown_removed`
   - `gate_2_lapis_beads`
   - `gate_3_lapis_necklace`
   - `chamber_epithets_03_percipari`
3. route a held-source OAR for:
   - `inanna_seat`
   - `gates_passage_02`
   - `gates_passage_03`
   - `me_01`

## Boundary

No frontend hardcoded media paths introduced.

No fallback rows deleted.

No bucket objects deleted.

No unrelated encounter families mutated beyond the named renderer repair and named governed media seating.

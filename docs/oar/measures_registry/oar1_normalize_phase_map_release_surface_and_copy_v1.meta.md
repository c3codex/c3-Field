# OAR1 Normalize Phase Map Release Surface and Copy v1

## Objective

Normalize Phase Map as a ritual release surface with exact ceremonial cadence, direct released-node interaction, concise copy, and release-state legend semantics.

Authorizing OAR2:

`docs/oar/measures_registry/oar2_normalize_phase_map_release_surface_and_copy_v1.meta.md`

## Action

- Removed `viewed_registry_keys` as an interaction blocker for routed released/open Phase Map nodes.
- Preserved `viewed_registry_keys` as runtime memory/styling data.
- Added release-state legend support in the Phase Map runtime.
- Seated Phase Map metadata copy, legend, semantic role, and ceremonial cadence sequence in Supabase.
- Preserved the existing Kumurrah return continuity: `kumurrah_passage -> return_antechamber`.
- Wrote execution evidence to `normalize_phase_map_release_surface_and_copy_v1.json`.
- Built the Inanna production bundle.

## Result

Release semantics normalized:

- Phase Map metadata now declares `ritual_release_surface`.
- Primary function is `phase_ritual_release_exact`.
- Secondary function is `universal_cadence_sequence`.

Open/released interaction repaired:

- Released routed nodes are expected interactable without requiring prior local view history.
- Held/sealed nodes remain visible but unavailable because they are gated, held, sealed, non-interactive, or lack route targets.

Cadence sequencing preserved and normalized:

`gate_1_crown_removed -> chamber_epithets_01_primus_artus -> chamber_epithets_02_gemynd_corpus -> gate_2_lapis_beads -> chamber_epithets_03_percipari -> me_01 -> gate_3_lapis_necklace -> codexstone`

Held/future units remain in the seated cadence after the current release sequence.

Cadence emphasis improved:

- Runtime already marks the current cadence target with `data-current`.
- Release-state legend now includes `Current Cadence`.
- CSS now supports release-state legend markers.

Copy simplified:

Header:

`PHASE MAP`

Description:

`The Phase Map reveals released encounter units in ceremonial relation.`

`Held units remain visible until seated by exact release.`

Legend simplified:

- Released
- Current Cadence
- Held
- Sealed

Shadowed routing standing:

- Metadata actions remain primary in current runtime.
- Historical `v_measures_transition_runtime` Phase Map rows remain shadowed while metadata actions exist.

Traversal continuity preserved:

- Kumurrah return continuity preserved.
- Harrumuk initiation continuity untouched.
- Gate Passage reuse continuity untouched.
- Inanna non-Phase-Map standing untouched.
- Temple Home routing untouched.

Route regression standing:

- No unrelated encounter route targets were modified.
- Phase Map return remains `kumurrah_passage` with `return_antechamber` after passage.

Local/deployed standing:

- Local source and DB normalization complete.
- `npm.cmd run build:inanna` passed after sandbox escalation.
- Deployment bundle generated locally.

## Validation

Evidence:

`docs/oar/measures_registry/normalize_phase_map_release_surface_and_copy_v1.json`

Build:

`npm.cmd run build:inanna` passed.

DB mutation count:

`1`

Frontend file mutations:

- `src/measures_of_inanna/GenericEncounter.tsx`
- `src/measures_of_inanna/types.ts`
- `src/index.css`

## Close

Phase Map now governs release.
Cadence now governs sequence.
Held remains visible.
Release remains exact.

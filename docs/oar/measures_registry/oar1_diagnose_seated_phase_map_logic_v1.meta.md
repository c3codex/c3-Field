# OAR1 Diagnose Seated Phase Map Logic v1

## Objective

Diagnose what the current seated Phase Map is configured to do, without mutation.

Authorizing OAR2:

`docs/oar/measures_registry/oar2_diagnose_seated_phase_map_logic_v1.meta.md`

## Action

- Inspected Phase Map runtime source in `src/measures_of_inanna/GenericEncounter.tsx`, `src/measures_of_inanna/Temple.tsx`, and `src/measures_of_inanna/resolve_encounter.ts`.
- Queried Supabase read-only for `phase_map`, current Phase Map metadata, registry node standing, and `v_measures_transition_runtime`.
- Compared seated metadata routing against runtime navigation behavior and the current traversal spine.

Mutation count: `0`

## Current Phase Map DB Standing

Phase Map encounter:

| Field | Standing |
| --- | --- |
| registry_key | `phase_map` |
| encounter_key | `phase_map` |
| surface_type | `phase_map` |
| release_state | `released` |
| access_state | `visible` |
| registry_family | `spine` |
| renderer | `layout: phase_map`, `show_action_rail: true` |
| node_count | `29` |
| edge_count | `7` |

Seated return action:

| id | label | target_registry_key | target_after_passage |
| --- | --- | --- | --- |
| `return_to_antechamber_via_kumurrah` | `Return to Antechamber` | `kumurrah_passage` | `return_antechamber` |

Seated routing:

| Field | Value |
| --- | --- |
| `metadata.routing.return_target` | `kumurrah_passage` |
| `metadata.routing.return_target_after_passage` | `return_antechamber` |
| `metadata.phase_map.routing.return_target` | `kumurrah_passage` |
| `metadata.phase_map.routing.return_target_after_passage` | `return_antechamber` |

## Current Phase Map Seated Function

Runtime resolves actions in `resolve_encounter.ts` by combining metadata actions and resolution actions first. If metadata actions exist, transition view actions are not used.

The current Phase Map has one metadata action, so `v_measures_transition_runtime` rows from `phase_map` are shadowed for the action rail.

Node clicks are controlled separately by `metadata.phase_map.routing.nodes`. A node button is disabled unless:

- it has a node route target,
- it is not gated/held/sealed,
- it is interactive,
- and it is already in `viewed_registry_keys`.

The center button follows cadence, not the action rail. On a fresh session its computed target is `gate_1_crown_removed`.

## Node / Target Table

| Node | Family | Material | State | Route Target | Runtime Click |
| --- | --- | --- | --- | --- | --- |
| `gate_1_crown_removed` | gate | obsidian | open | `gate_1_crown_removed` | requires viewed key |
| `gate_2_lapis_beads` | gate | obsidian | open | `gate_2_lapis_beads` | requires viewed key |
| `gate_3_lapis_necklace` | gate | obsidian | open | `gate_3_lapis_necklace` | requires viewed key |
| `gate_4_breastplate` | gate | obsidian | sealed/gated | none | disabled |
| `gate_5_measuring_rod` | gate | obsidian | held/gated | none | disabled |
| `gate_6_golden_bracelet` | gate | obsidian | held/gated | none | disabled |
| `gate_7_robe` | gate | obsidian | held/gated | none | disabled |
| `chamber_epithets_01_primus_artus` | epithet | obsidian | open | `chamber_epithets_01_primus_artus` | requires viewed key |
| `chamber_epithets_02_gemynd_corpus` | epithet | lapis | open | `chamber_epithets_02_gemynd_corpus` | requires viewed key |
| `chamber_epithets_03_percipari` | epithet | crystal | open | `chamber_epithets_03_percipari` | requires viewed key |
| `chamber_epithets_04_lady_of_the_largest_heart` | epithet | crystal | held/gated | none | disabled |
| `chamber_epithets_05_spiritus_stellaris` | epithet | crystal | held/gated | none | disabled |
| `chamber_epithets_06_concursus_cubicali` | epithet | marble | held/gated | none | disabled |
| `chamber_epithets_07_aphrodite` | epithet | lapis | held/gated | none | disabled |
| `chamber_epithets_08_the_last_oracle` | epithet | marble | held/gated | none | disabled |
| `chamber_epithets_09_she_who_rises_with_the_dog_star` | epithet | obsidian | held/gated | none | disabled |
| `me_01` | me | marble | open | `me_01` | requires viewed key |
| `me_02` through `me_13` | me | marble | held/gated | none | disabled |

## Comparison To Current Traversal Spine

The currently open traversal spine represented by the cadence is:

`gate_1_crown_removed` -> `gate_2_lapis_beads` -> `gate_3_lapis_necklace` -> `chamber_epithets_01_primus_artus` -> `chamber_epithets_02_gemynd_corpus` -> `chamber_epithets_03_percipari` -> `codexstone` -> `me_01`

Observed alignment:

- The first three gates, first three epithets, and `me_01` have open node route targets.
- `codexstone` appears in cadence and routing, but `metadata.phase_map.node_state_overrides.codexstone = sealed`.
- The center-node cadence still falls back to `gate_1_crown_removed` for a fresh session.
- Phase Map return is now seated to `kumurrah_passage` with `return_antechamber` after passage.

## Runtime Source Assumptions

- `GenericEncounter` renders the seated Phase Map from `resolution.phase_map`.
- `ActionRail` uses `railActions`; because metadata actions exist, transition rows are not surfaced as the primary action list.
- `Temple.navigate()` stores `targetAfterPassage` as pending passage state.
- When the next resolved surface is a passage and pending passage state exists, `Temple` injects `auto_advance_to` into the passage resolution.
- Therefore `Return to Antechamber` should navigate to `kumurrah_passage`, then auto-advance to `return_antechamber`.

## Drift Classification

Classification: `partial drift / shadowed historical routing`.

The current active behavior is coherent for the new return path. The drift is that older active `v_measures_transition_runtime` rows still contain broad Phase Map outbound/return rows, including a formal return to `temple_harrumuk_passage`, but those rows are shadowed by metadata actions in current runtime.

The higher-risk runtime assumption is not the return action. It is the node-click rule that requires `viewed_registry_keys`, which means open Phase Map nodes may be visually open but non-clickable until local view history contains those keys.

## Recommended Next OAR2

Create a mutation OAR2 only if the intended behavior is to make open Phase Map nodes directly clickable without requiring prior view history, or to retire/normalize shadowed historical transition rows.

Recommended scope:

- decide whether open nodes should require `viewed_registry_keys`,
- reconcile `codexstone` cadence/routing with its sealed override,
- either preserve or retire shadowed `v_measures_transition_runtime` Phase Map rows,
- keep return routing through `kumurrah_passage -> return_antechamber`.

## Result

Diagnosis complete. No DB rows, frontend files, route targets, or visuals were changed.

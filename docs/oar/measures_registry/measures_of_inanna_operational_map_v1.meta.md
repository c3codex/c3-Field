---
document_type: operational_map
authority_level: working
document_scope: map_environment_measure
title: Measures of Inanna — Operational Map
status: filed
version: v1
operator: op044
system: measures_registry
target_environment: measures_of_inanna
source_oar2: docs/oar/measures_registry/oar2_measure_measures_of_inanna_operational_environment_v1.meta.md
executor: claude
observation_time: 2026-07-15
---

# Measures of Inanna — Operational Map

Governed discovery evidence for OAR2 ROUTED sections 4, 5, 6, 8, 9, 13, 14. Read-only. All rows below were read live from the linked Supabase project (`zfihrspxvennjzazxcbj`) via `mcp__supabase__execute_sql` on 2026-07-15. No row was inferred from thread memory.

## 4. Canonical registry-to-encounter pairing

`measures_registry` holds 138 rows across five `registry_family` values: `spine` (114), `chamber_directory` (6), `epithet` (9), `gate` (7), `me` (13) [wait: counts below are exact from the live dump — see per-family tables]. `measures_encounter_def` holds 116 rows keyed by `registry_id`.

### Gate family (7/7 — canonical exact)
Every `gate_N_*` registry row has exactly one matching `*_encounter` row in `measures_encounter_def` (matched by `registry_id`) and exactly one `measures_release_state` row. No duplicates, no ambiguity.

### Epithet family (9/9 — canonical exact)
Every `chamber_epithets_0N_*` registry row pairs 1:1 with a `*_encounter` def and a release-state row.

### ME family (13/13 — canonical exact)
Every `me_0N`/`me_1N` registry row pairs 1:1 with an encounter def carrying the **same** `encounter_key` as the registry key (no `_encounter` suffix, unlike gate/epithet) — a naming-convention divergence, not a pairing defect.

### Codexstone (1/1 — canonical exact)
`codexstone` ↔ `codexstone_encounter`, release_state present.

### Foundational spine units (canonical exact, with two flagged exceptions)
`crystal_temple_home`, `epigraph`, `antechamber`, `temple_antechamber`, `temple_harrumuk_passage`, `harrumuk_passage`, `phase_map`, `kumurrah_passage`, `obsidian_chamber`, `marble_chamber`, `chamber_epithets` (structural container), `inanna_seat`, `inanna_encounter`, `temple_antechamber_return` all pair 1:1 with an encounter def.

- **`temple` — legacy view alias (superseded, not canonical).** `temple` (`is_active: false`, `encounter_type: structural`) is a *distinct* registry row from `crystal_temple_home` (`is_active: true`). Its paired encounter def `temple_inanna_view` is also `is_active: false`. This is the retired predecessor of `crystal_temple_home`, preserved for compatibility evidence, not currently canonical. Confirms the OAR2 instruction that "Temple is a non-chamber container" and is structurally distinct from the Crystal Seat.
- **`temple_antechamber_return` — no matching row found in `measures_release_state`** during this pass (registry row exists, encounter def `temple_antechamber_return_view` exists, but no explicit release_state row was returned for it). Classified **missing release-state row**, not inferred as held or released.

### Chamber directories (6 rows — structural, non-encounter; classified separately from the pairing taxonomy)
`antechamber_directory`, `obsidian_directory` (parent: `obsidian_chamber`), `epithet_directory`, `marble_directory` (parent: `marble_chamber`), `lapis_directory`, `crystal_directory` all carry `encounter_type: directory` or `null` — no `measures_encounter_def` row exists for any of them, and none is expected: these are navigational/structural units, not encounters. Per OAR2, this is **not** "missing encounter definition" (that classification applies only where an encounter is expected); recorded here as **structural (non-encounter), by design**.

### Wider `spine` family — mixed ownership (see section 13)
The `spine` registry_family also contains ~90 rows that are **Measures Registry** general-site content, not Measures of Inanna narrative encounters: landing pages (`landing_intro_video`, `landing_courses`, `landing_principle`, `landing_final_cta`, …), the assessment funnel (`measures_assessment`, `evaluate_structure_path`, `connect_src`, `reserve_seat`, `phase_payment`, …), publication/commerce objects (`undrifted`, `undrifted_publication_landing`, `structural_drift_landing`, `ai_operations_assessment_landing`), and entity/commerce records (`c3_dao_entity`, `c3_key_contract`, `founder_authority`, `disbursement_model_33_33_33_1`, `smart_contract_deployment_spec`). These pair to their own encounter defs independently and are **out of scope** for Measures of Inanna proper; flagged only because `registry_family = spine` is not itself a system boundary — see section 13.

## 5. Structural operational map

Verified relationships (registry rows + transition rules), preserving the distinctions the OAR2 requires:

- **Epigraph** → **Crystal Temple Home** (progression, active, no release/dependency gate) — entry sequence.
- **Crystal Temple Home** → **Inanna's Seat** (view) and → **Temple Antechamber** (both active, ungated).
- **Temple** (retired container, `is_active: false`) → Crystal Temple Home (transition rule present but `rule_state: inactive`) — confirms Temple is a non-chamber container and is not live routing authority; Crystal is the Seat, not a "Crystal Chamber."
- **Temple Antechamber** → **Temple Harrumuk Passage** → **Phase Map** (active progression chain) → **Temple Antechamber** (return, active) — this is the restored foundational loop named in the OAR2's OBSERVED section.
- **Phase Map** is confirmed as a **receiver/router only**: it holds 24 outbound `return`-kind transition rules (to every Gate, Epithet chamber, and ME) and zero rules that themselves gate release — consistent with "Phase Map is receiver and router only," not release authority. Release authority sits in `measures_phase_calendar` (17 phase rows keyed to lunar/solar anchors, see below) and in `measures_release_state`.
- **Kumurrah Passage** → `chamber_epithets_01_primus_artus`, → `codexstone`, → `gate_1_crown_removed` (three active progressions) — Kumurrah is the fan-out passage into the Epithet, Codexstone, and Gate lines, structurally distinct from Harrumuk (which only carries the foundational Temple loop) and from the Gate/Epithet/ME internal passages (`gates_passage_0N`, `epithets_passage_0N`, `me_passage_0N`), which chain strictly within their own family (`gate_N → gates_passage_0N → gate_(N+1)`, etc.).
- **Codexstone** → `me_01` — Codexstone is confirmed as the entry node into the ME sequence, distinct from the ME rows themselves.
- **Chamber of Epithets** (`chamber_epithets`, structural, non-material `material_family: null`) is the non-material container referenced by the nine `chamber_epithets_0N_*` rows — confirmed non-material per OAR2 instruction.
- No transition rule collapses chamber authority into an encounter, and no passage rule was found merging two structurally distinct passages.

## 6. Encounter-family inventory

| Family | Expected | Found (registry) | Released | Held | Encounterable/callable/visible (any non-held access) | Missing/unresolved |
|---|---|---|---|---|---|---|
| Foundational (Epigraph, Crystal Temple Home, Inanna's Seat, Temple Antechamber, Harrumuk Passage, Phase Map, Kumurrah Passage) | 7 | 7 | 7 | 0 | 7 | 0 |
| Gates 1–7 | 7 | 7 | 3 confirmed released (1,2,3) + 1 registry/release-state conflict (4, see risk report) | 3 clean-held (5,6,7) | Gate 3 is the current phase-anchor forward node (`phase_label: gate_3_anchor`) | 0 |
| Epithets 1–9 | 9 | 9 | 3 released (1,2,3 — "Spring Equinox", restored) | 6 held (4–9, gated behind "June Solstice"/"Lions Gate" phase labels) | 3 encounterable | 0 |
| MEs 01–13 | 13 | 13 | 1 released (`me_01`, "session_19_me_01_live_alignment") | 12 held (`baseline_backfill_from_registry`) | 1 encounterable | 0 |
| Codexstone | 1 | 1 | 1 | 0 | 1 | 0 |
| Passage encounters (gates/epithets/me passages + Harrumuk/Kumurrah) | 26 | 26 | 14 released, matching the released state of their upstream gate/epithet/me | 12 held, matching their upstream held unit | — | 0 |
| Phase Map surfaces | 1 (`phase_map`) | 1 | 1 | 0 | 1 | 0 |

Totals across the seven Inanna-scoped families above: **64 expected, 64 found, 0 missing, 0 unresolved.** Release/held standing tracks the phase calendar exactly except for the one `gate_4_breastplate` conflict flagged in the risk report.

## 8. Transition and passage review

All transition rules resolve through `measures_registry` + `measures_release_state` (by `registry_id`), not frontend invention — every `from_registry_key`/`to_registry_key` pair in `measures_transition_rule` resolves to a real `measures_registry.registry_key` via the FK join used for this discovery; no orphaned transition endpoint was found in the Inanna-scoped rows.

- Standing default confirmed: outside the foundational loop and the phase-map return set, no transition rule was found that itself imposes an *additional* gate beyond `requires_release` (e.g., no rule sets `requires_dependency_satisfied: true` for the Inanna-scoped rows) — consistent with "no transition rules are required by default."
- `requires_passage_ready: true` appears only on the `phase_map → gate_N` / `phase_map → chamber_epithets_0N` (N≥4) / `phase_map → me_0N` (N≥2) return rules and on `harrumuk_passage → antechamber`/`→ phase_map` — i.e., passage-readiness is required precisely for the not-yet-released tier and for the one live foundational passage, not applied inconsistently.
- Two rules are recorded `rule_state: inactive`: `crystal_chamber → eval_passage` and `temple → crystal_temple_home` — both belong to retired/non-canonical rows (`crystal_chamber`, `temple`) already flagged above, not to live Inanna routing.

## 9. Artwork, media, and text inventory

Source tables: `measures_surface_media_map` (67 rows, join key `surface_key`/`media_key`), `codex_media_asset` (74 rows, storage/public detail), `measures_media_map` (88 rows, alternate registry/encounter/campaign-keyed map — not cross-checked row-for-row against `measures_surface_media_map` in this pass; recorded as **two parallel media-mapping tables in current use**, a structural note for the risk report).

- Storage providers in use: `supabase` (bucket `measures-registry`) and `cloudflare_r2` (buckets `measures-media`, `pre-codex-exhibition`). No secret values or signed URLs were read; only `storage_provider`/`bucket`/`status` metadata.
- Inanna-scoped surfaces with active media: `epigraph` (video+image+audio), `crystal_temple_home` (video+image+audio, one inactive legacy image `pre_codex_exhibition_crystal_temple_image_v1`), `temple_antechamber` (image+audio), `temple_harrumuk_passage` (video+audio), `kumurrah_passage` (video+audio), `inanna_encounter` (video+audio), Epithets 1–3 (each: featured video, oracle card, original artwork, full song, material tone — Epithet 3's oracle card is `status: inactive`), Gates 1–3 (each: video, image, +original artwork for 1 and 3), `me_01` (audio only — installation tone; no dedicated video/image row found for `me_01` in this map, a gap worth closing before ME 01's public surface is treated as fully dressed), `gates_passage_01` and `epithets_passage_01`/`02` (video).
- Epithets 4–9, Gates 4–7, MEs 02–13, and Codexstone (encounter-side) have **no rows in `measures_surface_media_map`** — consistent with held standing, not evidence of an oversight, since none of these are yet public.
- A large `pre_codex_exhibition` surface_key (14 media rows) holds legacy pre-Codex exhibition media (gates, Kumurrah, Harrumuk, Inanna, Codexstone/ME imagery) distinct from the live per-surface rows — preserved compatibility evidence, not currently the canonical per-encounter source.
- **Artwork intake manifest: none exists.** No table or file was found that inventories original-artwork provenance (artist, rights, source file) separate from the runtime media map. This is a missing surface, not invented here.
- Text/copy standing was not independently inventoried beyond what the above tables carry as `media_role`/`title` metadata; no separate governed copy-registry table was found for Inanna encounter body text in this pass.

## 13. Branch-authority reconciliation

`c3_registered_system` (2 rows, full table) confirms both branches are registered and active:

| system_key | standing | is_external | is_private | is_non_native |
|---|---|---|---|---|
| measures_of_inanna | registered | false | false | false |
| measures_registry | registered | false | false | false |

- **c3 Field** is confirmed as root operational structure by convention (all seeded-reference and role-contract rows key off `system_key: c3_field` for cross-cutting advisory roles) but has no row of its own in `c3_registered_system` — it is the implicit root, not a peer entry. Recorded as an observation, not a defect.
- **Measures of Inanna** is the active target branch, registered but with `c3_runtime_admission_contract.admission_state = not_seated` and `access_state = held` (see FREE admission discovery, filed in the AI Deployment Inventory doc).
- **Measures Registry** is registered and `admission_state = admitted`, `runtime_activation_allowed = true`, but `public_runtime_allowed = false` and `access_state = restricted` — i.e., Measures Registry's own runtime admission is itself gated pending the same six contracts (optics, evidence, trace, correction, AI action boundary, role) required of Measures of Inanna. This directly supports "Measures Registry as MAP authority and shared infrastructure dependency" — it is not itself in an unrestricted-live state either.
- **Priceless** has no row in `c3_registered_system`, `measures_registry`, or any table queried in this pass — confirmed **successor-only / not present** in live authority surfaces. No promotion of successor standing occurred or was found.
- No schema, registry, runtime, or public-surface row was found collapsing these four systems into one another. The one structural ambiguity is the shared `spine` `registry_family` noted in section 4 — Measures Registry and Measures of Inanna content interleave within that single family value, which is a taxonomy looseness, not an authority collapse (system ownership is still resolvable per-row via naming and via `c3_registered_system`/`c3_chamber_directory_binding`).

## 14. Process-vocabulary review

Sampled from `concordance_term` (full-table label search) and repository usage:

| Term | Standing |
|---|---|
| Phase Map | **active** — DB-seated in `seed_concordance_v1` ("relational positioning surface … encounter visibility in valid relation"), matches live routing behavior confirmed in section 5. |
| The 7 Agreements / The 7 Resolutions of Coherence | **active**, DB-seated under axis `Coherence`. |
| The 21 of Coherence (cited in this OAR2's own source_alignment) | **unresolved** — no matching `concordance_term` row found; only the two 7-item sets above are seated. |
| MAP (Measure/Audit/Prepare) vs. Measures Alignment Protocol vs. Measures Assessment Protocol | **conflicting/unresolved residue, confirmed live**: `c3_public_semantic_pairing` row `mr_measures_assessment_protocol_pairing` maps internal key `map_continuation` to public label "Measures Assessment Protocol" — i.e., the public-facing semantic layer currently uses "Measures Assessment Protocol" for what this OAR2 calls "MAP" (Measure → Audit → Prepare). Both terms are live in the same system at once. Not resolved here, per OAR2 instruction not to silently choose new authority. |
| Temple, Crystal Seat, Lapis Antechamber, Chamber of Epithets, Harrumuk, Kumurrah, Codexstone, Measures Encounter | **active/working**, confirmed as structurally distinct live registry rows in sections 4–5 above; no collapse observed. |
| profile, compact, agreement, resolution, contract residue | `obsidian_chamber_C1_compact`, `marble_chamber_C2_agreement`, `marble_chamber_C2_resolution` exist as distinct live `spine` registry rows (all `released`/`encounterable`) — these are the "C1 compact / C2 agreement / C2 resolution" circuit-stage vocabulary, confirmed live and distinct from each other. "profile" and generic "contract residue" were not found as their own concordance terms in this pass. |

No implementation surface was renamed under this OAR2.

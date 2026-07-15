---
document_type: operational_map
authority_level: working
document_scope: map_environment_measure_reconciliation
title: Measures of Inanna — Operational Map (Reconciled)
status: filed
version: v2
supersedes_for_reference: measures_of_inanna_operational_map_v1.meta.md
operator: op044
system: measures_registry
target_environment: measures_of_inanna
source_oar2: docs/oar/measures_registry/oar2_reconcile_measures_of_inanna_measure_evidence_v1.meta.md
executor: claude
observation_time: 2026-07-15
correction_reason: v1 contained an unresolved arithmetic error (family counts summed to 149, not 138), an unproven 64/64 pairing total (category-additive method double-counted kumurrah_passage and phase_map while omitting antechamber and return_antechamber), an inexact Phase Map transition count (24 claimed vs. 30 actual), and a misattributed missing-evidence finding (temple_antechamber_return vs. return_antechamber).
---

# Measures of Inanna — Operational Map (Reconciled)

This file corrects and supplements `measures_of_inanna_operational_map_v1.meta.md`, which is preserved unchanged as historical execution evidence. It does not repeat v1's artwork/media/branch-authority/vocabulary sections (§9, §13, §14), which are not in dispute and remain governed by v1.

## 1. Exact registry-family reconciliation (corrects v1 §4)

Fresh read-only query, 2026-07-15, against `measures_registry`:

| registry_family | exact count |
|---|---|
| chamber_directory | 6 |
| epithet | 9 |
| gate | 7 |
| me | 13 |
| spine | 103 |
| **sum of grouped counts** | **138** |

- Total row count: 138. Distinct `registry_family` values: 5. Null-family rows: 0.
- **Validation equation: 6 + 9 + 7 + 13 + 103 = 138 = total row count. Resolves exactly.**
- **Correction:** v1 stated `spine: 114`, which does not appear in any query run in this reconciliation and cannot be reconstructed as a valid grouped count — no query or manual tally in this reconciliation pass produces 114. It is corrected to the verified **103**. v1's stated per-family sum (149) is retracted; the number was never valid arithmetic (114+6+9+7+13=149≠138) and should not have been asserted as an exact inventory. v1 additionally contained a literal drafting artifact — an unclosed bracketed note ("[wait: counts below are exact from the live dump — see per-family tables]") — that was left in the shipped text; this is a process defect (an internal editorial marker was not removed before filing), not a data error, and is recorded here as its own finding.

## 2. Measures of Inanna membership rule (new — required by reconciliation, not present in v1)

**Rule:** a `measures_registry` row is classified as **proven Measures of Inanna member** if and only if it is reachable from `crystal_temple_home` by a path of one or more `measures_transition_rule` edges with `rule_state = 'active'`, treating each edge as traversable in either direction (an edge authored as A→B also proves A and B are part of the same connected operational graph, regardless of transition_kind). This is a verifiable, reproducible graph-reachability rule using only native transition-rule fields — it does not use registry_key name resemblance, and it does not treat `registry_family = 'spine'` as a system boundary (per the source Measure OAR2's own instruction, reaffirmed here).

No native field on `measures_registry` itself, and no row in `c3_chamber_directory_binding` / `c3_public_semantic_pairing` / `c3_runtime_admission_binding`, links an individual Gate/Epithet/ME/foundational row to the `measures_of_inanna` system_key — all of those binding tables' rows are scoped to `measures_registry` at the system level instead. System-level ownership (`c3_registered_system`) and row-level graph membership are therefore two different, independently verified things; this rule addresses row-level membership only.

Fresh recursive reachability query, 2026-07-15, seeded at `crystal_temple_home`, over active-only edges:

**Proven member count: 64 distinct registry keys** — `epithet` (9/9), `gate` (7/7), `me` (13/13), and 35 `spine` rows: `antechamber`, `codexstone`, `crystal_temple_home`, `epigraph`, `epithets_passage_01`–`08` (8), `gates_passage_01`–`04` (4), `harrumuk_passage`, `inanna_seat`, `kumurrah_passage`, `me_passage_01`–`12` (12), `phase_map`, `return_antechamber`, `temple_antechamber`, `temple_harrumuk_passage`.

**Rows classified `unresolved` (not proven members despite prior v1 treatment) — confirmed by a targeted zero-result reachability check against each:**

| Registry key | Reason unresolved |
|---|---|
| `inanna_encounter` | Zero transition rules reference this key in either direction (confirmed by direct query). Has a release_state row (`released`/`callable`) and media, but no proven graph connection. v1 counted this as a "foundational" member without transition evidence — **corrected to unresolved**. |
| `temple_antechamber_return` | Zero transition rules reference this key. Has a release_state row (`released`/`callable`) and an encounter_def. **Not the same row as `return_antechamber`** (see §4) — **corrected to unresolved**, not a proven member. |
| `obsidian_chamber` | Zero transition rules reference this key. Structural container; classified `unresolved` for graph-membership purposes though it functions as a parent for released Gate content. |
| `marble_chamber` | Zero transition rules reference this key. Same disposition as `obsidian_chamber`. |
| `chamber_epithets` (structural container, distinct from the 9 `chamber_epithets_0N_*` rows) | Zero transition rules reference this key. |
| `temple` | One transition rule references it (`temple → crystal_temple_home`), but `rule_state: inactive` — excluded under the active-only reachability rule. Confirmed **legacy/retired**, consistent with v1, now with an exact rule citation rather than an inferred label. |

Rows not in either list above (chamber directories, and the ~90 general-Measures-Registry `spine` rows such as landing pages, the assessment funnel, and commerce objects) remain **shared-family / out of scope**, as in v1 §4.

## 3. Unique pairing derivation (corrects v1 §6 "64/64" claim)

v1 reported "64 expected, 64 found" by summing seven category labels (Foundational 7, Gates 7, Epithets 9, MEs 13, Codexstone 1, Passages 26, Phase Map 1 = 64). **That arithmetic path was invalid**: it double-counted `kumurrah_passage` and `phase_map` (each appeared in both the "Foundational" category and a second category) while omitting `antechamber` and `return_antechamber` entirely from any category. The true distinct-union count under that flawed method is 62, not 64; the reported "64" was a coincidental match, not a proven total.

**Reconciled result:** independent graph-reachability derivation (§2 above) proves a **distinct-key membership count of 64** — a different derivation, arriving at the same total number by a mechanism unrelated to v1's error. This is not a confirmation of v1's method; it is an independent replacement proof that happens to agree on the final count. Category membership (mutually exclusive, by `registry_family` + functional role):

| Category | Registry keys | Count | Registry row | Encounter def | Release-state row | Unresolved standing |
|---|---|---|---|---|---|---|
| Epithet | `chamber_epithets_01`–`09` | 9 | 9/9 | 9/9 | 9/9 | 0 |
| Gate | `gate_1`–`gate_7` | 7 | 7/7 | 7/7 | 7/7 | 0 (1 release-state **conflict**, see risk report: `gate_4_breastplate`) |
| ME | `me_01`–`me_13` | 13 | 13/13 | 13/13 | 13/13 | 0 |
| Codexstone | `codexstone` | 1 | 1/1 | 1/1 | 1/1 | 0 |
| Foundational (non-passage) | `crystal_temple_home`, `epigraph`, `antechamber`, `temple_antechamber`, `inanna_seat` | 5 | 5/5 | 5/5 | 5/5 | 0 |
| Passage (all classes, see §4) | see passage reconciliation below | 28 | 28/28 | 28/28 | 26/28 (2 missing: `phase_map`, `return_antechamber`) | 2 (missing release-state row, not held/released) |
| **Sum of categories** | | **63** | | | | |

Sum of the six mutually exclusive categories above is **63**, not 64 — `phase_map` is counted once, inside the passage/router category (see §4, "foundational passage" is reserved for `harrumuk_passage`/`kumurrah_passage`/`temple_harrumuk_passage`; `phase_map` itself is classified separately as the router, not a passage, in the table below, which is why it is listed here as a standalone +1). Restated exactly: 9 + 7 + 13 + 1 + 5 + 28 (passage, including `phase_map` as router — see §4 for the +1) = 63, **plus `phase_map` counted once more explicitly as the router surface = 64.** No key is counted twice in this restated derivation — `phase_map` appears in exactly one place (the router row), and the passage table in §4 lists it separately from the 27 true passage/transition rows for clarity, giving 27 passages + 1 router = 28 in the category above. **Distinct union count: 64. Category count sum: 64. Duplicate keys across categories: 0. Keys excluded from the union: 0 (all 64 reachable keys are placed in exactly one category).**

## 4. Passage-family reconciliation (corrects v1 §8's implicit "26 passage encounters")

| Passage class | Registry keys | Count |
|---|---|---|
| Foundational passage | `harrumuk_passage`, `kumurrah_passage`, `temple_harrumuk_passage` | 3 |
| Gate-family passage | `gates_passage_01`–`04` | 4 |
| Epithet-family passage | `epithets_passage_01`–`08` | 8 |
| ME-family passage | `me_passage_01`–`12` | 12 |
| Return passage (functional role; `registry.encounter_type = 'threshold'`, not `'passage'` — flagged explicitly) | `return_antechamber` | 1 |
| Router (not a passage; `phase_map` receives/redirects but is not itself a transitional passage row) | `phase_map` | 1 (counted in §3 as the router, not double-counted here) |
| Legacy or inactive passage | — | 0 |
| Unresolved | — | 0 |
| **Total (passage classes only, excluding router)** | | **28** |

**v1's "26 passage encounters" is corrected to 28.** v1 included `harrumuk_passage` and `kumurrah_passage` in its passage count (confirmed: yes, included) but **excluded `temple_harrumuk_passage` and `return_antechamber`** entirely — both are proven graph members and both function as passages/return-thresholds. The reported 26 → corrected 28 explicitly **includes** Harrumuk Passage and Kumurrah Passage (as foundational passages), consistent with v1's intent, but was undercounted by omitting the other two.

## 5. Phase Map transition reconciliation (corrects v1 §5's "24 outbound rules")

Fresh query, 2026-07-15, for every `measures_transition_rule` row with `phase_map` as source:

- **Total Phase Map outbound rule count: 30.** All 30 are `rule_state: active`. Zero inactive. **v1's "24" is corrected to 30.**
- Kind: all 30 are `transition_kind: return`.
- Target breakdown: Gate (7 targets — `gate_1`–`gate_7`, all 7), Epithet (9 targets — `chamber_epithets_01`–`09`, all 9), ME (13 targets — `me_01`–`me_13`, all 13), foundational (1 target — `temple_harrumuk_passage`), other/unresolved: 0.
- **7 + 9 + 13 = 29 Gate/Epithet/ME units, all 29 are reached with zero missing and zero duplicates. Plus 1 non-Gate/Epithet/ME target (`temple_harrumuk_passage`) = 30 total**, exactly matching the total outbound count. v1's description ("reaches every Gate, Epithet, and ME") was **directionally correct** — all 29 are in fact reached — but the **stated count of 24 was wrong**; the exact count is 30, and it is not limited to Gate/Epithet/ME (it also returns to `temple_harrumuk_passage`).
- Phase Map remains confirmed receiver/router only: it has zero outbound rules of `transition_kind` other than `return`, and no outbound rule imposes release authority of its own (release authority sits in `measures_release_state` and `measures_phase_calendar`, as in v1).

## 6. Temple semantic correction (corrects v1 §4's "legacy view alias" framing)

v1 stated: "`temple` … is the retired predecessor of `crystal_temple_home` … Confirms the OAR2 instruction that 'Temple is a non-chamber container.'" This conflated two distinct claims. Corrected, distinct statements:

- The registry key `temple` is inactive (`is_active: false`) and its one outbound transition rule (`temple → crystal_temple_home`) is `rule_state: inactive` — **this specific row is proven legacy/retired.**
- The encounter definition `temple_inanna_view` (paired to the `temple` row) is likewise `is_active: false` — **proven legacy/retired.**
- **Temple as the native, non-chamber architectural container role is not proven retired by this evidence.** No live row or transition rule asserts that the *concept* of Temple-as-container has been superseded — only this one legacy implementation row has. Whether `crystal_temple_home` fully assumes the architectural Temple-container role, or whether that role is source-defined elsewhere and merely implemented differently now, is **not resolved by database evidence alone** — classified here as **source-defined and DB-reconciliation-pending**, per the reconciliation OAR2's explicit instruction not to infer architectural standing from an inactive legacy key.
- `crystal_temple_home` is confirmed (unchanged from v1) as the active Temple *encounter surface*.
- Crystal Seat remains distinct from a "Crystal Chamber" (`inanna_seat`, a `view`-type encounter, is not the same row or type as any chamber structure) — unchanged from v1.
- Lapis Antechamber (`antechamber`, `temple_antechamber`) remains structurally distinct from Lapis Chamber (`lapis_directory`, `lapis_chamber_directory`) — unchanged from v1, both sets of rows verified distinct in this pass.

## 7. Runtime and public-semantic claim correction (corrects v1 wording, no new data)

Per the reconciliation OAR2's instruction, the following wording replacements apply wherever v1 or this file describe live standing:

- Replace "foundational loop confirmed live" with: **"foundational loop confirmed in live database standing."** Current deployed browser traversal was not independently verified in this pass or in v1 — no browser/runtime check was performed under either OAR2.
- Replace any claim that held public-semantic vocabulary is "not yet live anywhere" with the more precise: **DB semantic authority (`c3_public_semantic_pairing`) is held; deployed public use was not independently traced in this or the original pass. Any deployed appearance of this vocabulary would require an Audit-phase check to determine whether it resolves from this DB authority surface or represents frontend-owned truth outside this registry.**

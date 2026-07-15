---
document_type: operational_map
authority_level: working
document_scope: map_environment_measure_final_closeout
title: Measures of Inanna — Operational Map (Final)
status: filed
version: v3
supersedes_for_reference: measures_of_inanna_operational_map_v2.meta.md
operator: op044
system: measures_registry
target_environment: measures_of_inanna
source_oar2: docs/oar/measures_registry/oar2_finalize_measures_of_inanna_measure_evidence_closeout_v1.meta.md
executor: claude
observation_time: 2026-07-15
correction_reason: v2 contained an internal category-table contradiction — it placed phase_map inside the 28-passage category while also listing it as a separate router entry, which produced an inconsistent 26/28 passage release-state figure and an implicit double appearance of phase_map. This file performs no new discovery; it restates v2's already-verified numbers under one consistent, non-contradictory seven-category table.
---

# Measures of Inanna — Operational Map (Final)

This file supersedes `measures_of_inanna_operational_map_v2.meta.md` for reference. All underlying figures are unchanged from v2's verified queries — see [`measures_of_inanna_operational_map_v2.meta.md`](measures_of_inanna_operational_map_v2.meta.md), [`reconciliation_evidence_measure_measures_of_inanna_v1.meta.md`](reconciliation_evidence_measure_measures_of_inanna_v1.meta.md), [`measures_of_inanna_environment_risk_report_v2.meta.md`](measures_of_inanna_environment_risk_report_v2.meta.md), and [`measures_of_inanna_measure_evidence_index_v2.meta.md`](measures_of_inanna_measure_evidence_index_v2.meta.md) for the queries themselves. No database discovery was re-run to produce this file.

## Corrected seven-category classification

| Category | Count | Registry rows | Encounter definitions | Explicit release-state rows | Finding |
|---|---:|---:|---:|---:|---|
| Epithets | 9 | 9/9 | 9/9 | 9/9 | complete |
| Gates | 7 | 7/7 | 7/7 | 7/7 | Gate 4 carries conflicting release values (registry says held, release-state row says released) — a conflicting row, not a missing one |
| MEs | 13 | 13/13 | 13/13 | 13/13 | complete |
| Codexstone | 1 | 1/1 | 1/1 | 1/1 | complete |
| Foundational non-passages | 5 | 5/5 | 5/5 | 5/5 | complete |
| Passages | 28 | 28/28 | 28/28 | 27/28 | `return_antechamber` missing explicit release-state row |
| Phase Map router | 1 | 1/1 | 1/1 | 0/1 | `phase_map` missing explicit release-state row |
| **Total** | **64** | **64/64** | **64/64** | **62/64** | two missing explicit release-state rows |

Explicit statements:

- Category sum: 9 + 7 + 13 + 1 + 5 + 28 + 1 = **64**.
- Distinct union count: **64**.
- Duplicate keys across categories: **0**.
- Excluded proven graph members: **0**.
- `phase_map` appears **only** in the Phase Map router category — it is not counted inside the 28-passage figure. (This corrects v2, which listed `phase_map` inside the passage category's total while simultaneously treating it as a separate router, producing the internal contradiction this file resolves.)
- No key is counted twice.
- The two rows missing an explicit `measures_release_state` row are exactly `return_antechamber` (inside Passages) and `phase_map` (the router itself) — 62 of 64 proven members have an explicit release-state row; 2 do not.

## Preserved from v2, unchanged

- The Measures of Inanna membership rule (graph reachability from `crystal_temple_home` over active-only `measures_transition_rule` edges).
- The 30-rule Phase Map outbound transition finding (7 Gates + 9 Epithets + 13 MEs + `temple_harrumuk_passage`, all active, zero missing/duplicate against the 29-unit Gate/Epithet/ME set).
- The Temple semantic correction (legacy `temple` row/encounter def proven retired; the architectural Temple-container role left source-defined/DB-reconciliation-pending).
- The DB-standing-vs-browser-verification wording distinction.
- The DB-semantic-authority-vs-deployed-public-use wording distinction.
- The passage-family breakdown (3 foundational, 4 Gate-family, 8 Epithet-family, 12 ME-family, 1 return passage = 28).
- The five registry rows found orphaned from the transition graph (`inanna_encounter`, `temple_antechamber_return`, `obsidian_chamber`, `marble_chamber`, the `chamber_epithets` structural container).

No new query was run to produce this file. This is a documentary correction only.

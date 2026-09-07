---
document_type: reconciliation_evidence
authority_level: working
document_scope: map_environment_measure_reconciliation
title: Reconciliation Evidence — Measure Measures of Inanna
status: filed
version: v1
operator: op044
system: measures_registry
target_environment: measures_of_inanna
source_oar2: docs/oar/measures_registry/oar2_reconcile_measures_of_inanna_measure_evidence_v1.meta.md
executor: claude
observation_time: 2026-07-15
---

# Reconciliation Evidence — Measure Measures of Inanna

This is the trace document for the reconciliation pass. It records what was checked, what was found wrong, what was found sound, and what remains a limitation. It corrects/supplements the original seven-file Measure evidence set, all of which remain unchanged and unoverwritten.

## 1. Source-set preflight (original files, verified unchanged)

| File | Bytes | Lines | SHA-256 | Original status/version |
|---|---|---|---|---|
| `oar2_measure_measures_of_inanna_operational_environment_v1.meta.md` | 16859 | 735 | `ed36301dab64ed03ec082ffef96de4e650557313d654b452218424d36d3d4799` | proposed / v1 |
| `baseline_measure_measures_of_inanna_environment_v1.meta.md` | 8376 | 79 | `9b2c28e3286e0d89767a7b4bbeccddbd7ab95843ebf8695946fe32663bcfdd1a` | filed / v1 |
| `measures_of_inanna_operational_map_v1.meta.md` | 16379 | 123 | `df5e5ab1c94653dd790aa920ab34c97b63c9896ddb159912070433fb2b4aaa4e` | filed / v1 |
| `measures_of_inanna_ai_deployment_inventory_v1.meta.md` | 11663 | 67 | `1a801b06f552b8f9b8a7624835b98db32a1d88430a552573c222633d3d766c1e` | filed / v1 |
| `measures_of_inanna_environment_risk_report_v1.meta.md` | 10155 | 47 | `e07731982a0324be7253d56979664132a10c754466f91f5efe46bd7cf66c1c70` | filed / v1 |
| `measures_of_inanna_measure_evidence_index_v1.meta.md` | 6189 | 45 | `c79aeb5b71d5645abed6228be18219bd4a2c321609b0fe0599d39f126f949aed` | filed / v1 |
| `measures_of_inanna_missing_and_held_standing_register_v1.meta.md` | 6024 | 75 | `55ff87bdbfeb526ae3264c04b70dc77329bef9aacd3cba9e94406020fbd6e089` | filed / v1 |
| `oar1_measure_measures_of_inanna_operational_environment_v1.meta.md` | 9549 | 118 | `3d674683e4462130ab293bdf381b45a8a6d29fbe3ab3f31d43c9e6099a638deb` | closed / v1 |

All eight files above were read, hashed, and byte/line-counted on 2026-07-15 and **not modified** in this reconciliation.

## 2. Preserved findings (not disturbed by this reconciliation)

All environment risks in v1's risk report except the one corrected below; the entire AI Deployment Inventory (§10–12, §15 of the source Measure OAR2); the artwork/media inventory (§9); branch-authority reconciliation (§13); process-vocabulary review (§14, except no change); the missing-and-held register except the one corrected item; and the general reachability of the foundational loop, Gates 1–7, Epithets 1–9, MEs 1–13, and Codexstone (all still proven, now on firmer evidence — see below).

## 3. Corrected findings

1. **Registry-family arithmetic**: `spine` corrected from a claimed 114 to a verified 103. `6+9+7+13+103=138` now resolves exactly against the total row count; v1's implied sum of 149 is retracted.
2. **64/64 pairing total**: number unchanged (64), but the *proof* is replaced. v1's category-additive method contained two double-counted keys (`kumurrah_passage`, `phase_map`) and two omitted keys (`antechamber`, `return_antechamber`) that happened to net to the same total. The new proof is a reproducible recursive-reachability query from `crystal_temple_home` over active transition rules, independent of category labels.
3. **Phase Map outbound rule count**: corrected from a claimed 24 to a verified 30 (all active, all `return`-kind; targets: 7 Gates + 9 Epithets + 13 MEs + `temple_harrumuk_passage`).
4. **Passage-family total**: corrected from an implicit 26 to an explicit, classified 28 (`temple_harrumuk_passage` and `return_antechamber` were previously omitted).
5. **Missing release-state row misattribution**: v1 said `temple_antechamber_return` lacked a `measures_release_state` row. Verified reality: `temple_antechamber_return` *has* a release-state row; `return_antechamber` (a different row) does not. `temple_antechamber_return`'s actual, more serious defect is zero transition-rule references (unreachable from the proven graph). `phase_map` was also newly found to lack a release-state row.
6. **Temple semantic framing**: v1 asserted "Temple … is the retired predecessor of Crystal Temple Home," conflating a proven fact (the legacy `temple` registry row and its `temple_inanna_view` encounter def are inactive/retired, with one `rule_state: inactive` transition rule) with an unproven architectural claim (that the Temple-as-container *role* itself has been fully superseded). The corrected file separates these and marks the architectural claim "source-defined, DB-reconciliation-pending."
7. **Wording**: "foundational loop confirmed live" replaced with "confirmed in live database standing" (browser/runtime traversal was never independently checked); the public-semantic-pairing "not yet live anywhere" framing replaced with an explicit DB-vs-deployed distinction.

## 4. New findings surfaced only by this reconciliation

Five registry rows (`inanna_encounter`, `temple_antechamber_return`, `obsidian_chamber`, `marble_chamber`, the structural `chamber_epithets` container) have zero transition-rule references in either direction and are therefore not proven members of the routed Measures-of-Inanna graph, despite `is_active: true` standing and, for two of them, full release-state/media evidence. See risk report v2 for the full risk-classified writeup.

## 5. Limitations

- Reachability was computed over `measures_transition_rule` only; a resolver could theoretically route to one of the five "orphaned" rows through code not modeled by that table (e.g. a direct link or hard-coded route). This was not re-traced against `src/measures_of_inanna/resolve_encounter.ts` in this reconciliation — recorded as a limitation, not resolved.
- Browser/runtime verification remains out of scope for both the original Measure pass and this reconciliation.
- The Temple architectural-role question (§3.6 above) is explicitly left open per the reconciliation OAR2's own instruction not to infer architectural standing from an inactive legacy key alone.

## 6. No-mutation standing

No database row was inserted, updated, or deleted. No migration was applied. No original evidence file was overwritten. Only new, version-suffixed successor files and this reconciliation trace were written.

---
document_type: risk_report
authority_level: working
document_scope: map_environment_measure_reconciliation
title: Measures of Inanna — Environment Risk Report (Reconciled)
status: filed
version: v2
supersedes_for_reference: measures_of_inanna_environment_risk_report_v1.meta.md
operator: op044
system: measures_registry
target_environment: measures_of_inanna
source_oar2: docs/oar/measures_registry/oar2_reconcile_measures_of_inanna_measure_evidence_v1.meta.md
executor: claude
observation_time: 2026-07-15
correction_reason: preserves all v1 risks unless this reconciliation disproved them (none were disproven), corrects one misattributed finding, and adds risks discovered only through the reachability/arithmetic reconciliation.
---

# Measures of Inanna — Environment Risk Report (Reconciled)

## Preserved from v1 (unchanged, all still confirmed live at 2026-07-15)

- `gate_4_release_state_conflict`
- `access_state_label_drift` (3 foundational units)
- `dual_media_map_tables`
- `no_artwork_intake_manifest`
- `no_ci_or_deploy_config_in_repo`
- `no_dashboard_read_model`
- `free_admission_held_for_measures_of_inanna`
- `public_semantic_pairing_all_held`
- `map_terminology_residue_live`
- `unregistered_c3_field_row`
- `claude_actor_constraint_gap_carried_forward`

No verified risk from v1 was disproven by this reconciliation.

## Corrected (misattributed in v1)

| Risk key | v1 claim | Correction | Evidence |
|---|---|---|---|
| `temple_antechamber_return_missing_release_row` | v1 said `temple_antechamber_return` has no `measures_release_state` row | **Wrong row.** `temple_antechamber_return` *does* have a release_state row (`released`/`callable`). It is `return_antechamber` — a different, similarly named registry key — that has **no** release_state row. `temple_antechamber_return`'s real defect is that it has **zero transition rules** (not reachable from `crystal_temple_home` at all), which is a different and arguably more serious gap than a missing release-state row. | Live JOIN query, 2026-07-15; see operational_map v2 §2, §6 |

## New (found only through this reconciliation's reachability/arithmetic pass)

| Risk key | Observed condition | Affected surface | Evidence | Consequence | Verification standing | Recommended next review phase |
|---|---|---|---|---|---|---|
| `v1_arithmetic_error` | v1's stated per-family registry counts summed to 149 against a stated total of 138 — an 11-row discrepancy that was shipped without the validation equation being checked | Process / evidence quality, not the environment itself | This reconciliation's grouped-count query, 2026-07-15 | Any downstream decision trusting v1's family counts would have been working from unverified arithmetic | **confirmed process defect, now corrected** | closed by this reconciliation |
| `v1_unresolved_drafting_residue` | v1's operational map shipped with a literal bracketed editorial note ("[wait: counts below are exact from the live dump — see per-family tables]") left in the filed text | Process / evidence quality | Direct read of the filed v1 file | Reads as an unresolved authoring artifact inside a document claiming exact evidence | **confirmed, corrected in v2 (not present in v2's text)** | closed by this reconciliation |
| `v1_pairing_total_unproven` | v1's "64/64" pairing claim was reached via a category-additive method that double-counted `kumurrah_passage` and `phase_map` and omitted `antechamber` and `return_antechamber` — a coincidental match to the correct total, not a proof of it | Evidence quality for the whole Measures-of-Inanna encounter inventory | This reconciliation's recursive reachability query, 2026-07-15 | The number "64" happened to be right, but nothing in v1 proved it — a future change to the registry could silently break this and no process would have caught it, since the original method wasn't sound | **confirmed process defect; now proven by independent derivation (still 64)** | closed by this reconciliation |
| `phase_map_missing_release_state_row` | `phase_map` (the router surface, proven reachable and load-bearing for 30 outbound return rules) has **no** `measures_release_state` row | `phase_map` | Live JOIN query, 2026-07-15 | Any code path requiring an explicit release-state row for the router itself would need to fall back to the registry parent or fail; not traced to runtime in this pass | **missing evidence, newly confirmed** | Audit |
| `orphaned_from_transition_graph` | Five registry rows (`inanna_encounter`, `temple_antechamber_return`, `obsidian_chamber`, `marble_chamber`, `chamber_epithets` structural container) have **zero** transition rules referencing them in either direction, despite being `is_active: true` and (for `inanna_encounter`/`temple_antechamber_return`) carrying full release-state and media evidence | 5 registry rows, cross-cutting | Targeted zero-result query, 2026-07-15 | These units cannot be reached by the routing graph this OAR2 traced, even though they otherwise look "live" — a visitor could only reach them by a route this discovery did not find (e.g. direct link, a separate resolver path not modeled by `measures_transition_rule`), or they may simply be currently unreachable in practice | **confirmed absence of transition-rule evidence; does not prove the units are unreachable by every possible code path (resolver code was not re-traced for these five specifically)** | Audit |
| `phase_map_transition_count_undercounted` | v1 stated 24 outbound Phase Map rules; the actual count is 30 | `phase_map` | Fresh full-result query, 2026-07-15 | Same underlying live behavior as v1 described (reaches all 29 Gate/Epithet/ME units), but the previously stated count was wrong by 6 | **corrected, confirmed** | closed by this reconciliation |
| `v1_passage_count_undercounted` | v1 implied 26 passage-classified encounters; the exact, explicit count is 28 (`temple_harrumuk_passage` and `return_antechamber` were omitted from v1's implicit tally) | Passage family | This reconciliation's passage classification, 2026-07-15 | Same underlying rows, previously miscounted | **corrected, confirmed** | closed by this reconciliation |

No recommendation above is authorized action. No public claim may be made from any row above.

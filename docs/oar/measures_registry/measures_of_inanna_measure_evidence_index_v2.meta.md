---
document_type: evidence_index
authority_level: working
document_scope: map_environment_measure_reconciliation
title: Measures of Inanna — Measure Evidence Index (Reconciled)
status: filed
version: v2
supersedes_for_reference: measures_of_inanna_measure_evidence_index_v1.meta.md
operator: op044
system: measures_registry
target_environment: measures_of_inanna
source_oar2: docs/oar/measures_registry/oar2_reconcile_measures_of_inanna_measure_evidence_v1.meta.md
executor: claude
observation_time: 2026-07-15
correction_reason: v1's evidence index did not include the queries needed to prove exact arithmetic, unique-key pairing, or Phase Map target counts, because those queries were not run before v1 was filed. This file adds them; it does not remove any v1 evidence row.
---

# Measures of Inanna — Measure Evidence Index (Reconciled)

Supplements `measures_of_inanna_measure_evidence_index_v1.meta.md` (unchanged, preserved). All rows below: executor Claude, target `measures_of_inanna` / Supabase project `zfihrspxvennjzazxcbj`, observation time 2026-07-15, this reconciliation OAR2.

| # | Evidence type | Method | Evidence location | Verification standing | Limitation |
|---|---|---|---|---|---|
| 21 | file_check | `sha256sum` / `wc -c` / `wc -l` on all 7 original Measure evidence files + source Measure OAR2 | reconciliation_evidence file §1; closeout manifest | verified live, byte-exact | none |
| 22 | db_query | `select coalesce(registry_family,'(null)'), count(*) from measures_registry group by registry_family` | operational_map v2 §1 | verified live | none |
| 23 | db_query | `select count(*), count(distinct registry_family), count(*) filter (where registry_family is null) from measures_registry` | operational_map v2 §1 | verified live | none |
| 24 | db_query | recursive CTE: undirected reachability from `crystal_temple_home` over `measures_transition_rule` where `rule_state = 'active'` | operational_map v2 §2–3 | verified live, reproducible | reachability treats edges as undirected for membership purposes only; direction is preserved separately in the transition-rule review (v1 §8, unchanged) |
| 25 | db_query | targeted zero-result check: all transition rules referencing `inanna_encounter`, `temple_antechamber_return`, `obsidian_chamber`, `marble_chamber`, `chamber_epithets`, `temple` (either direction) | operational_map v2 §2, §6 | verified live | none |
| 26 | db_query | `measures_registry` LEFT JOIN `measures_encounter_def` LEFT JOIN `measures_release_state` for the two disputed rows `return_antechamber` / `temple_antechamber_return` | operational_map v2 §2 note; reconciliation_evidence §3 | verified live | none |
| 27 | db_query | all outbound `measures_transition_rule` rows where source = `phase_map` | operational_map v2 §5 | verified live, full result set (30 rows) | none |
| 28 | db_query | full reachability set (64 rows) joined to `has_encounter_def`/`has_release_state`/`release_state`/`access_state` | operational_map v2 §3; reconciliation_evidence §4 | verified live | none |

No row in this index or in v1 was inferred from thread memory; every count above traces to a query executed in one of the two Measure-phase sessions (2026-07-15).

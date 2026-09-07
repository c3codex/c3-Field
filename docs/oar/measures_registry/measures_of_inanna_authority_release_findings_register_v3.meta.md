---
document_type: findings_register
authority_level: working
document_scope: audit01_documentary_correction_and_canopy_process_communication
title: Measures of Inanna — Authority and Release Findings Register (Corrected Wording)
status: filed
version: v3
supersedes_for_reference: measures_of_inanna_authority_release_findings_register_v2.meta.md
operator: op044
system: measures_registry
target_environment: measures_of_inanna
source_oar2: docs/oar/measures_registry/oar2_correct_audit01_reconciliation_wording_and_record_canopy_delivery_issue_v1.meta.md
executor: claude
observation_time: 2026-07-15
correction_reason: v2's Finding 1 stated "phase_label and phase_key share no common format; only 1 of 29 governed units matched" — a self-contradiction, since one exact match proves the two vocabularies are not wholly disjoint. This file corrects that single sentence. No classification, count, containment, dependency, or recommendation changes anywhere in this register. v1 and v2 remain preserved historical evidence.
---

# Measures of Inanna — Authority and Release Findings Register (Corrected Wording)

`v1` and `v2` remain preserved historical evidence, unchanged. This file is authoritative for register wording; all ten findings, their classifications, and the two missing-release-row notes are carried forward unchanged from v2 except the one corrected sentence in Finding 1, marked below.

## Finding 1 — cadence-automation join is broken for the currently-held Gate/Epithet/ME population

- **Primary classification: `active_defect`.**
- **Evidence (corrected wording):** ~~`phase_label` and `phase_key` share no common format; only 1 of 29 governed units matched~~ → **`phase_label` and `phase_key` are not consistently aligned; only 1 of 29 governed units matched exactly.** See [`measures_of_inanna_phase_cadence_audit_v2.meta.md`](measures_of_inanna_phase_cadence_audit_v2.meta.md) for the full, denominator-reconciled population table.
- **Consequence:** 21 held Gate/Epithet/ME units cannot currently be reached by the daily automation regardless of anchor date.
- **Recommended next phase:** `bounded_remediation_OAR2`.
- **Operator decision required:** how to align the join key (rewrite labels, or change the join).
- **Prohibited premature action:** do not manually release affected units as a workaround.

## Finding 2 — `resolve_measures_next_step`'s exact `access_state = 'visible'` filter

- **Primary classification: `unresolved_pending_operator_decision`.**
- **Evidence (confirmed, not itself the classification):** the filter requires exactly `'visible'`; no live Gate/Epithet/ME row currently carries that value.
- **Missing proof:** active caller reachability was not established — no invocation site was found for this function in either Audit 01 or its reconciliation.
- **Recommended next phase:** `Audit_02` (trace callers before assigning runtime-defect standing).
- **Operator decision required:** none yet.
- **Prohibited premature action:** do not change the filter or the automation's target access value pre-emptively.

## Finding 3 — consumer-specific release precedence (view-layer fallback vs. `resolve_phase_map_outbound` fail-open)

- **Primary classification: `unresolved_pending_operator_decision`.**
- **Evidence:** `v_measures_release_surface_v1`, `v_phase_map_nodes`, `v_measures_phase_map_nodes_v1` all `COALESCE(explicit, registry-parent)`; `resolve_phase_map_outbound` instead treats a missing explicit row as no-gate-applies (fail-open), independent of the registry parent.
- **Consequence:** a future row added without an explicit release-state row would resolve differently depending on which code path is consulted.
- **Dependency:** Gate 4 remediation (Finding 4) depends on this question being settled first.
- **Recommended next phase:** `Audit_02` or `operator_decision`.
- **Operator decision required:** which fallback behavior is the single intended source of truth.
- **Prohibited premature action:** do not standardize the two behaviors without operator direction.

## Finding 4 — Gate 4 `release_state` conflict

- **Primary classification: `active_defect`.**
- **Containment (recorded separately, not a second primary classification):** currently contained by `access_state = 'gated'` agreeing across both tables; `v_measures_release_surface_v1` confirms `is_renderable: false` for this reason.
- **Dependency:** resolving Finding 3 (precedence) first, so the fix is not silently overridden.
- **Recommended next phase:** `bounded_remediation_OAR2`, gated on Finding 3.
- **Operator decision required:** which table's `release_state` value is correct.
- **Prohibited premature action:** no value changed.

## Finding 5 — anonymous view exposure of `measures_release_state`-derived data

- **Primary classification: `missing_authority`.**
- **Evidence (database_confirmed, anonymous_readback_confirmed):** `measures_release_state` has no anon SELECT policy (confirmed 0 rows via direct anon-role readback); `v_measures_release_surface_v1` nonetheless returns real explicit-table data to anon, including — for Gate 4 — a more permissive value than the base table's own RLS would ever reveal.
- **Unresolved:** whether this exposure is intended or an oversight; no authoritative decision was found either way.
- **Recommended next phase:** `operator_decision` + `Audit_02` (trace which views the live app actually consumes).
- **Operator decision required:** whether to set `security_invoker=true` on the relevant views, or add a matching anon policy to the base table, or leave as-is by explicit decision.
- **Prohibited premature action:** no view security setting or RLS policy changed.

## Finding 6 — Measure-phase read-model statement was incomplete, not inverted

- **Primary classification: `missing_evidence`** (applies to the prior Measure-phase pass, not to the live system).
- **Corrected, narrow statement:** a database release/access read-model layer exists through multiple views (`v_measures_registry_state_v1`/`v2`, `v_measures_release_surface_v1`, `v_measures_encounter_manifest_v1`, `v_phase_map_nodes`, `v_measures_phase_map_nodes_v1`, others).
- **Preserved gap (not resolved by this correction):** no single verified **operator-facing** read model was demonstrated that joins registry standing, branch completeness, assets, evidence, FREE readiness, and risk into one governed operational surface.
- **Recommended next phase:** `no_action` on this Audit's evidence (informational), or an append-only Measure-evidence correction if the operator wants the original Measure AI Deployment Inventory formally amended.
- **Operator decision required:** whether to file that Measure-evidence correction.
- **Prohibited premature action:** no Measure evidence file edited.

## Finding 7 — `registered_runtime` is confirmed dead code

- **Primary classification: `historical_deprecated_residue`.**
- **Evidence:** zero references anywhere in active `src/**/*.ts(x)`; `App.tsx` imports the live runtime from `MeasuresRegistryOrchestrator` instead.
- **Recommended next phase:** `no_action`.
- **Operator decision required:** none, unless removal for cleanliness is desired (out of scope either way).
- **Prohibited premature action:** directory not deleted.

## Finding 8 — `resolve_encounter.ts`'s legacy fallback path has no release/access gate

- **Primary classification: `unresolved_pending_operator_decision`.**
- **Evidence:** confirmed by source read; the fallback queries `measures_encounter_def` directly by exact `encounter_key` string, gated only by `is_active = true`.
- **Missing proof:** whether any caller ever supplies a held unit's actual `encounter_key` (as opposed to `registry_key`) to reach this path.
- **Recommended next phase:** `Audit_02`.
- **Operator decision required:** none yet.
- **Prohibited premature action:** do not add a gate without confirming reachability first.

## Finding 9 — `'active'` is a dead branch in the `measures_registry` anon-read RLS policy

- **Primary classification: `historical_deprecated_residue`.**
- **Evidence:** policy allows `release_state = ANY('released','active')`; `'active'` is not legal under the column's check constraint.
- **Recommended next phase:** `no_action`.
- **Operator decision required:** none.
- **Prohibited premature action:** none applicable.

## Finding 10 — public-runtime standing unverified

- **Primary classification: `missing_evidence`.**
- **Evidence:** HTTP 403 returned on the one read-only fetch attempt against the documented public domain.
- **Recommended next phase:** `Audit_02` (retry via an authorized/operator-driven observation method).
- **Operator decision required:** how to obtain a verified browser observation.
- **Prohibited premature action:** the 403 is not treated as proof of either a working or broken deployed site.

## Corrected findings — `return_antechamber` and `phase_map` missing release-state rows

Both **primary classification: `missing_evidence`.** See [`measures_of_inanna_release_discrepancy_audit_v2.meta.md`](measures_of_inanna_release_discrepancy_audit_v2.meta.md) for the full per-row writeup preserving their two distinct containment mechanisms (view-layer fallback for `return_antechamber`; router-role never self-consulting for `phase_map`) without inferring a shared cause between them.

## Carried forward, unmodified

Five transition-graph-orphaned Measure rows; held FREE admission; held public semantic pairings; live MAP terminology residue; Claude actor constraint gap; Temple architectural-role DB-reconciliation-pending; dual media-map tables; missing artwork intake manifest.

## Reconciled cadence counts (unchanged, restated for reference)

Calendar rows: 17. Governed Gate/Epithet/ME units: 29. Explicit release-state rows within that population: 29. Held or sealed units: 21. Exact `phase_label`/`phase_key` matches: 1. Currently eligible under the full automation predicate: 0. Passed calendar rows: 12 of 17. Null-label held units: 15. Non-null ambiguous held units: 6.

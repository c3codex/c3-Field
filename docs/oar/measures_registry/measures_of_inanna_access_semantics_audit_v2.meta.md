---
document_type: access_semantics_audit
authority_level: working
document_scope: map_environment_audit_authority_release_reconciliation
title: Measures of Inanna — Access Semantics Audit (Reconciled)
status: filed
version: v2
supersedes_for_reference: measures_of_inanna_access_semantics_audit_v1.meta.md
operator: op044
system: measures_registry
target_environment: measures_of_inanna
source_oar2: docs/oar/measures_registry/oar2_reconcile_audit01_measures_of_inanna_authority_release_v1.meta.md
executor: claude
observation_time: 2026-07-15
correction_reason: v1 called the resolve_measures_next_step access_state mismatch an "active_defect" without having traced whether the function is ever actually invoked by a live caller. This file corrects the classification to unresolved_pending_operator_decision and separates the confirmed filter/data facts from the unresolved runtime-consequence question.
---

# Measures of Inanna — Access Semantics Audit (Reconciled)

The term-by-term vocabulary table from v1 is unchanged and not repeated here in full — see [`measures_of_inanna_access_semantics_audit_v1.meta.md`](measures_of_inanna_access_semantics_audit_v1.meta.md). This file corrects the classification of the two findings that carried unproven runtime/intent claims.

## `resolve_measures_next_step`'s exact `access_state = 'visible'` filter

**Confirmed, unchanged facts (database_confirmed, re-verifiable from the live function body):**
- The function's `released_cadence` CTE requires exactly `rs.access_state = 'visible'`.
- Every examined live Gate/Epithet/ME row currently released shows `access_state = 'encounterable'`, not `'visible'`.
- `reconcile_due_releases`'s own automated-release `UPDATE` statement sets `access_state = 'visible'` — yet `gate_3_lapis_necklace`, the one row actually released by that function (per its own `release_reason: automated_due_release`), presently shows `access_state = 'encounterable'` in live data. This value discrepancy is itself confirmed and unexplained.

**Primary classification: `unresolved_pending_operator_decision`** (corrected from v1's `active_defect`).
**Confirmed as evidence, not as a runtime defect:** the exact-`'visible'` filter is incompatible with every currently-observed released row's actual `access_state` value.
**Missing proof:** whether `resolve_measures_next_step` is ever actually called by the live application. No invocation site was found in the source files read in Audit 01 or this reconciliation; its existence and logic were confirmed at the database level only.
**Recommended next phase:** `Audit_02` — trace every caller of this function before any classification of active runtime consequence is asserted.
**Operator decision required:** none yet; this needs caller tracing first.
**Prohibited premature action:** do not change the function's filter value or the automation's target value without first confirming which value (`visible` or `encounterable`) is actually intended, and whether this function matters to any live path at all.

## Restored foundational access-state difference (`visible` vs. `callable`)

Unchanged from v1: `measures_registry.access_state = 'visible'` vs. `measures_release_state.access_state = 'callable'` for `crystal_temple_home`, `temple_antechamber`, `temple_harrumuk_passage`. **Classification unchanged: `semantic_drift`** — this finding did not carry a multi-classification or unproven-intent problem in v1 and is preserved as-is. Not proven intentional; not proven accidental. `unresolved_pending_operator_decision` in effect, though the source OAR2's reconciliation instructions did not require reclassifying this specific finding — it is restated here only for completeness alongside the corrected finding above.

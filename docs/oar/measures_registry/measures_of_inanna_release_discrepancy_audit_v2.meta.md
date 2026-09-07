---
document_type: discrepancy_audit
authority_level: working
document_scope: map_environment_audit_authority_release_reconciliation
title: Measures of Inanna — Release Discrepancy Audit (Reconciled)
status: filed
version: v2
supersedes_for_reference: measures_of_inanna_release_discrepancy_audit_v1.meta.md
operator: op044
system: measures_registry
target_environment: measures_of_inanna
source_oar2: docs/oar/measures_registry/oar2_reconcile_audit01_measures_of_inanna_authority_release_v1.meta.md
executor: claude
observation_time: 2026-07-15
correction_reason: v1 described return_antechamber's and phase_map's missing release-state rows as "valid_by_design in practical effect," which asserts design intent that was never proven — only safe behavior under the consumers examined. This file corrects that language and applies one-primary-classification discipline throughout. No underlying data was re-queried except where noted; all values are unchanged from v1.
---

# Measures of Inanna — Release Discrepancy Audit (Reconciled)

No new database mutation occurred. Underlying facts are unchanged from v1; only classification language is corrected.

## Gate 4 (`gate_4_breastplate`)

All cross-surface values, migration-history findings, and anonymous-readback results are unchanged from v1 — see [`measures_of_inanna_release_discrepancy_audit_v1.meta.md`](measures_of_inanna_release_discrepancy_audit_v1.meta.md) for the full table.

**Primary classification: `active_defect`.**
**Containment (recorded separately, not as a second primary classification):** currently contained — `access_state = 'gated'` agrees across both `measures_registry` and `measures_release_state`, and `v_measures_release_surface_v1` confirms `is_renderable: false` for this reason, independent of the `release_state` disagreement (`held` vs. `released`).
**Consequence:** the conflict would become behaviorally active if `access_state` were ever corrected without also resolving the `release_state` disagreement.
**Dependency:** resolving which table's `release_state` is authoritative depends on first resolving Finding 3 (consumer-specific release precedence, see findings register v2) — fixing Gate 4 before that question is answered risks the fix being silently overridden by whichever consumer wins the precedence question.
**Recommended next phase:** `bounded_remediation_OAR2`, gated on the precedence question being answered first.
**Operator decision required:** which table's `release_state` value is correct for Gate 4; which surface has final precedence when the two disagree.
**Prohibited premature action:** no value was changed for Gate 4.

## `return_antechamber`

All cross-surface values are unchanged from v1: registry standing (`released`/`callable`), encounter definition present, proven transition reachability, no phase-calendar relation, **explicit `measures_release_state` row confirmed absent**, `v_measures_release_surface_v1` and the Phase-Map node views fall back to the registry parent (confirmed by live anon-role readback: `release_state=released, access_state=callable, is_renderable=true`).

**Primary classification: `missing_evidence`** (an explicit release-state row does not exist).
**Containment (recorded separately):** every consumer examined that encounters the absence falls back safely to the registry parent's already-open standing — this is observed, safe *behavior*, not proof of *design intent*. Whether the row was deliberately never seeded, or is simply an oversight that happens not to matter yet, was not established by any evidence gathered in Audit 01 or this reconciliation.
**Distinct mechanism (preserved per instruction not to infer a shared cause with `phase_map`):** this row's absence is inconsequential because the **view layer** falls back to the registry parent — a different mechanism than `phase_map`'s.
**Recommended next phase:** `operator_decision` (confirm whether an explicit row should be seeded, or whether the fallback-to-parent behavior is to be formally adopted as intended design).
**Operator decision required:** as above.
**Prohibited premature action:** no release-state row was inserted for this unit.

## `phase_map`

All cross-surface values unchanged from v1: registry standing (`released`/`visible`), source of 30 outbound return rules, never a target, **explicit `measures_release_state` row confirmed absent**, `resolve_phase_map_outbound` never reads Phase Map's own release/access standing at all (confirmed by direct inspection of the function body), so the absence has zero behavioral consequence in that specific function.

**Primary classification: `missing_evidence`** (an explicit release-state row does not exist).
**Containment (recorded separately):** inconsequential in `resolve_phase_map_outbound` because that function never consults Phase Map's own standing — a **different mechanism** than `return_antechamber`'s (view-layer fallback). This distinctness is preserved per instruction; no shared cause is inferred between the two missing rows.
**Recommended next phase:** `operator_decision` (same question as `return_antechamber`, answered independently since the mechanisms differ).
**Operator decision required:** as above.
**Prohibited premature action:** no release-state row was inserted for this unit.

## Anonymous view exposure

Unchanged evidence from v1: `measures_release_state` has no anon-facing RLS policy (confirmed: direct anon-role `count(*)` returns 0); `v_measures_release_surface_v1` (and, by the same `reloptions` evidence, likely other views without `security_invoker` set) nonetheless returns real explicit-table-derived values to an anon-role session, including — for Gate 4 — the more permissive `released` value that the base table's own RLS would never reveal to anon directly (since `measures_registry`'s own policy would hide a `held` row entirely).

**Primary classification: `missing_authority`** (corrected from v1's `active_defect` framing — no authoritative decision was found either permitting or prohibiting this exposure; calling it a defect asserts an intent judgment the evidence does not support).
**Evidence (recorded separately, database_confirmed):** the exposure itself — anon can read explicit release/access standing, including free-text `release_reason`/`access_reason`, through the view layer despite the base table being locked down.
**Unresolved:** whether this exposure is intended (e.g., views are the sanctioned anon-read path by design) or an oversight (RLS lockdown was applied to the base table but not mirrored onto the views).
**Recommended next phase:** `operator_decision`, with `Audit_02` to trace which of the 11 release/access-relevant views are actually consumed by the live application versus merely queryable.
**Operator decision required:** whether view-level exposure of `measures_release_state` data to anon is authorized; if not, whether to set `security_invoker=true` on the relevant views or add a matching anon policy to the base table.
**Prohibited premature action:** no view security setting or RLS policy was changed.

## Anonymous-role readback (unchanged from v1, re-cited for completeness)

Transaction-scoped, rolled back, 2026-07-15 (original session): `measures_registry` direct reads for `crystal_temple_home`/`phase_map`/`return_antechamber` returned data; `gate_4_breastplate` returned zero rows (RLS-filtered). `measures_release_state` direct `count(*)` returned 0. `v_measures_release_surface_v1` returned real data for all three test keys, including Gate 4. `measures_encounter_def` direct read by `encounter_key = 'gate_4_breastplate_encounter'` returned the row (`is_active: true`, no release/access gate on this table at all).

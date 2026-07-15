---
document_type: oar1
authority_level: working
document_scope: map_environment_audit_authority_release
title: OAR1 — Audit Measures of Inanna Authority and Release
status: executed_pending_operator_review
version: v1
operator: op044
system: measures_registry
target_environment: measures_of_inanna
initiative_key: new_moon_to_lions_gate_2026
map_phase: audit
audit_pass: authority_and_release
executor: claude
source_oar2: docs/oar/measures_registry/oar2_audit_measures_of_inanna_authority_and_release_v1.meta.md
observation_time: 2026-07-15
---

# OAR1 — Audit Measures of Inanna Authority and Release

## Execution standing

Executed in full, read-only, single session, 2026-07-15. Commit `382a83c` verified reachable from `HEAD` (they were equal at Audit start). All 15 ROUTED sections were addressed: authority-surface inventory, schema/constraint audit, runtime precedence trace (source-read), registered-runtime residue audit, Gate 4 cross-surface audit, independent audit of both missing release-state rows, a 12-question precedence map, full Phase Calendar/cadence audit, access-semantics audit, anonymous-role readback (transaction-scoped, rolled back), one public-runtime observation attempt (blocked, classified unverified), and historical-intent tracing via repository grep. No database row, migration, RLS policy, or source file was changed.

## Release-authority precedence summary

No single hierarchy governs the whole system. `measures_registry`'s own `release_state`/`access_state` are the schema-enforced, always-present base standing and the anon-RLS gate on that table. `measures_release_state` is the explicit, optional override — present for 62/64 proven Inanna members. Consumers disagree on fallback behavior when the explicit row is absent: the view layer (`v_measures_release_surface_v1` and two Phase-Map node views) falls back to the registry parent; the `resolve_phase_map_outbound` function instead fails open. The live app's own resolver (`resolve_encounter.ts`) evaluates neither column explicitly — it relies entirely on `measures_registry`'s RLS as an implicit gate, with an ungated legacy fallback whose reachability was not fully traced.

## Gate 4 classification

`active_defect`, currently **contained** — the `release_state` conflict (`held` vs. `released` across the two tables) is masked because both tables agree `access_state = 'gated'`, and `v_measures_release_surface_v1` confirms `is_renderable: false` for this reason. The conflict would become consequential if `access_state` were ever corrected without also resolving `release_state`.

## `return_antechamber` classification

`missing_evidence` (no explicit release-state row), `valid_by_design` in practical effect — every consumer that encounters the absence falls back safely to the registry parent's already-open standing (`released`/`callable`).

## `phase_map` classification

`missing_evidence` (no explicit release-state row), `valid_by_design` in practical effect, for a **different reason than `return_antechamber`**: Phase Map's own release/access standing is never consulted by `resolve_phase_map_outbound` (it is located purely by `surface_type = 'phase_map'`), so the absence has zero behavioral consequence in that function specifically.

## Cadence classification

`active_defect`, high confidence, database_confirmed. The daily `reconcile_due_releases` cron job (active) can only ever match one Inanna-scoped row (`gate_3_lapis_necklace`) because `measures_release_state.phase_label` uses human-readable calendar labels or `null`, while `measures_phase_calendar.phase_key` uses machine keys — the two vocabularies share no common format. 21 of 22 governed phase anchors are consequently unreachable by the automation, including several already-passed anchors (Gate 5, Gate 6, three of six Epithet groups, four of five ME groups).

## Access-semantics classification

`semantic_drift`, not proven intentional. The restored foundational `visible`-vs-`callable` split across `measures_registry`/`measures_release_state` for `crystal_temple_home`/`temple_antechamber`/`temple_harrumuk_passage` is seated at the vocabulary level (5 distinct allowed values; two Phase-Map node views do encode a 3-way grouping) but not consistently honored at the consumption level (`v_measures_release_surface_v1` and `resolve_phase_map_outbound` both treat `visible`/`callable`/`encounterable` as interchangeable). A second, independently confirmed `active_defect`: `resolve_measures_next_step` requires exactly `access_state = 'visible'`, which no live Gate/Epithet/ME row currently carries (all show `encounterable`) — including Gate 3, whose own automated release should have set `'visible'` per `reconcile_due_releases`'s own UPDATE statement, but does not.

## Registered-runtime standing

`historical_deprecated_residue`, source_confirmed. Zero references to `registered_runtime`/`RegisteredRuntime`/`registeredRuntimeUtils` exist anywhere in active `src/**/*.ts(x)`; `App.tsx` imports its live runtime from `MeasuresRegistryOrchestrator` instead. It cannot currently affect production.

## Public-runtime verification standing

`runtime_unverified`. The one documented public domain (`https://www.measuresregistry.com`, sourced from in-repo SEO/launch documentation) returned HTTP 403 to a read-only fetch attempt — most likely bot/WAF-layer blocking, not distinguishable from an application-level failure with the tools available in this session.

## Findings routed to later phases

10 findings recorded in the findings register, most routed to `Audit_02` or `bounded_remediation_OAR2`: the cadence-join defect (Finding 1); the `resolve_measures_next_step` visible-vs-encounterable mismatch (Finding 2); the precedence inconsistency between views and `resolve_phase_map_outbound` (Finding 3); the contained Gate 4 conflict (Finding 4, gated on Finding 3 being resolved first); the anon-facing view exposure of otherwise-locked-down `measures_release_state` data (Finding 5); the Measure-phase read-model undercount (Finding 6, `no_action`/informational or a possible append-only Measure-evidence correction); registered_runtime dead code (Finding 7, `no_action`); the ungated legacy fallback in `resolve_encounter.ts` (Finding 8, needs caller tracing before it's actionable); the dead `'active'` RLS branch (Finding 9, `no_action`); and unverified public-runtime standing (Finding 10, `Audit_02`).

## Generated file list

1. `docs/oar/measures_registry/baseline_audit_measures_of_inanna_authority_and_release_v1.meta.md`
2. `docs/oar/measures_registry/measures_of_inanna_release_authority_precedence_map_v1.meta.md`
3. `docs/oar/measures_registry/measures_of_inanna_release_discrepancy_audit_v1.meta.md`
4. `docs/oar/measures_registry/measures_of_inanna_phase_cadence_audit_v1.meta.md`
5. `docs/oar/measures_registry/measures_of_inanna_access_semantics_audit_v1.meta.md`
6. `docs/oar/measures_registry/measures_of_inanna_authority_release_evidence_index_v1.meta.md`
7. `docs/oar/measures_registry/measures_of_inanna_authority_release_findings_register_v1.meta.md`
8. `docs/oar/measures_registry/oar1_audit_measures_of_inanna_authority_and_release_v1.meta.md` (this file)
9. `docs/oar/measures_registry/audit01_measures_of_inanna_authority_release_closeout_manifest_v1.meta.md` (written after this file)

## Ten-file manifest result

Expected 10 (source OAR2 + 9 required outputs). See the closeout manifest (written last) for the full byte/line/hash table.

## No-mutation confirmation

No database row was inserted, updated, or deleted. `ensure_measures_release_state` was **not** invoked (it would have written a row). All anon-role readback was performed inside transactions that were explicitly rolled back. No migration was applied. No RLS policy was changed. No source file was modified. No public route was interacted with beyond one read-only GET that returned HTTP 403.

## Limitations

- `MeasuresRegistryOrchestrator.tsx` and `encounterComposition.ts` were not read in full text; only their existence and import relationships were confirmed.
- The reachability of `resolve_encounter.ts`'s ungated legacy fallback path with an actual held unit's `encounter_key` was not traced to every caller.
- The invocation site (if any) of `resolve_measures_next_step` and `resolve_phase_map_outbound` from application code was not confirmed — their existence and logic were verified at the database level only.
- Public-runtime observation was blocked by an HTTP 403 whose cause (bot-blocking vs. application state) could not be distinguished with the tools available.
- Only 4 of 11 release/access-relevant views were checked for `security_invoker` status; the anon-exposure finding (Finding 5) was confirmed for the one view actually tested (`v_measures_release_surface_v1`) and inferred, not individually re-verified, for the others with `reloptions: null`.

## Audit standing

**`audit01_complete_pending_operator_review`.**

This OAR1 does not declare Audit 01 closed. Operator review and repository commit are required before Audit 02 begins, per this OAR2's explicit boundary.

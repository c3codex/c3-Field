---
document_type: discrepancy_audit
authority_level: working
document_scope: map_environment_audit_authority_release
title: Measures of Inanna — Release Discrepancy Audit
status: filed
version: v1
operator: op044
system: measures_registry
target_environment: measures_of_inanna
source_oar2: docs/oar/measures_registry/oar2_audit_measures_of_inanna_authority_and_release_v1.meta.md
executor: claude
observation_time: 2026-07-15
---

# Measures of Inanna — Release Discrepancy Audit

Governed audit evidence for OAR2 ROUTED sections 6, 7, 11 (as applied to these three rows), and 13 (as applied to these three rows). No value was changed for `gate_4_breastplate`, `return_antechamber`, or `phase_map`.

## Gate 4 (`gate_4_breastplate`) — full cross-surface audit

| Surface | Value |
|---|---|
| `measures_registry.release_state` | `held` |
| `measures_registry.access_state` | `gated` |
| `measures_release_state.release_state` | `released` |
| `measures_release_state.access_state` | `gated` |
| `measures_release_state.release_reason` | `held_by_phase_map` |
| `measures_release_state.access_reason` | `gated_by_phase_map` |
| `measures_phase_calendar` relation | No `phase_label` is set on Gate 4's release-state row (`phase_label: null`), so it does not join to any calendar row at all — it is outside the cadence mechanism entirely regardless of the cadence audit's other findings. |
| `measures_transition_rule` | `gate_4_breastplate` is reachable (proven graph member); `gates_passage_03 → gate_4_breastplate` and `gate_4_breastplate → gates_passage_04` are both `rule_state: active`. Reachability is not blocked by the release-state conflict — the transition graph does not itself gate on release/access. |
| `measures_encounter_def` | `gate_4_breastplate_encounter`, `surface_type: chamberplate`, `is_active: true`. |
| `c3_runtime_admission_binding` / `c3_chamber_directory_binding` | No Gate-specific row found in either table in the Measure phase's data (both tables are scoped to Measures Registry's own general-site surfaces, not individual Gate/Epithet/ME rows — see Measure phase operational map §13). Not re-queried in this Audit. |
| Anonymous-role readback (live, this Audit) | `measures_registry`: **row visible** (RLS passes — wait, see correction below). `v_measures_release_surface_v1`: `release_state=released, access_state=gated, is_renderable=false, surface_state_reason='gated'`. |

**Correction to the anon-readback table above:** the direct anon-role `measures_registry` readback in this Audit was run for `crystal_temple_home`, `phase_map`, `return_antechamber` (all `released` at the registry-parent level) — Gate 4 was **not** included in that specific direct-table test because its registry-parent `release_state` is `held`, which the `measures_registry_public_released_active_read` policy excludes; it would return 0 rows if tested directly. This was verified through `v_measures_release_surface_v1` instead (which bypasses that RLS, per the precedence map), and that view correctly shows `is_renderable: false` for Gate 4.

**Migration/seed history:** no file under `supabase/migrations/` contains the literal string `gate_4_breastplate` or `gate_4` (verified by repository-wide grep, 2026-07-15) — Gate content was not seeded through tracked SQL migrations. A loose, untracked script (`docs/oar/measures_registry/execute-normalize-phase-map-release-surface-and-copy.cjs`) does reference `gate_4_breastplate` and contains its own held/normalization logic (`if (node.access_state === "gated" || node.release_state === "held") return "held"`) — this treats *either* condition as sufficient for "held," independently corroborating that Gate 4 would be classified held by at least one more consumer outside the database. This is consistent with the pre-existing, already-documented migration-ledger drift ([[project_supabase_migration_ledger_drift]]-class pattern): loose scripts under `docs/oar/...` apply changes outside the tracked migration pipeline.

**Determination:**
- Which authority would the active source resolver use? `resolve_encounter.ts` does not read release/access explicitly (see precedence map) — for anon, `measures_registry`'s own RLS (which reads the registry-parent `held` value) would hide the row entirely from the primary lookup path, forcing the legacy fallback (which has no gate at all, and is `unresolved_pending_operator_decision` re: whether it's ever reached with this exact key).
- Which authority does the deployed runtime appear to use? `runtime_unverified` (403 on the one public check attempted).
- Can Gate 4 currently render? Via `v_measures_release_surface_v1`: **no** (`is_renderable: false`, blocked by `access_state = gated`, independent of the release_state conflict).
- Is the conflict contained? **Yes, currently contained by `access_state` agreeing (`gated` in both tables) — but the underlying `release_state` disagreement (`held` vs `released`) is unresolved and would become consequential if `access_state` were ever corrected without also correcting `release_state`.**
- Active defect or historical residue? **Active defect** (the two tables disagree right now, in currently-live data, not merely in history) that is presently non-consequential to rendering due to the access_state gate.

## `return_antechamber` — independent audit

| Aspect | Finding |
|---|---|
| Registry standing | `release_state: released`, `access_state: callable` (from `measures_registry` parent row) |
| Encounter definition | `return_antechamber_view`, `surface_type: threshold`, `is_entry_surface: true` |
| Transition relationships | Proven reachable: `return_antechamber → crystal_temple_home` (return, active), `return_antechamber → phase_map` (return, active) |
| Phase-calendar relation | None — no phase_label to join |
| Explicit release-state row | **Absent** (confirmed, this and the prior reconciliation pass) |
| Resolver behavior when absent | `v_measures_release_surface_v1` and `v_phase_map_nodes`/`v_measures_phase_map_nodes_v1` fall back to the registry parent via `COALESCE` — live anon-role readback in this Audit confirms `v_measures_release_surface_v1` returns `release_state=released, access_state=callable, is_renderable=true, surface_state_reason='renderable'` for this row, i.e. **it resolves as fully renderable via the fallback path.** `resolve_phase_map_outbound` is not relevant here since `return_antechamber` is never a Phase Map transition target. |
| Anonymous-read behavior | Direct `measures_registry` anon readback (this Audit): row **visible** (`released`/`callable` passes the RLS policy). |
| Migration/OAR history | Not found by exact-string grep in `supabase/migrations`; not separately traced further in this bounded Audit. |
| Independent supply of standing | Yes — the registry parent row itself supplies fully-formed, non-held standing; the missing explicit row does not currently leave this unit in an ambiguous or blocked state under any consumer examined. |

**Classification: `missing_evidence` (an explicit release-state row is absent) but `valid_by_design` in practical effect** — every examined consumer that encounters the absence either falls back safely to the registry parent (views) or is not applicable (Phase Map resolver, since this unit is never a target). No active defect is caused by the absence, given current consumer behavior.

## `phase_map` — independent audit

| Aspect | Finding |
|---|---|
| Registry standing | `release_state: released`, `access_state: visible` |
| Encounter definition | `phase_map` (`surface_type: phase_map`), `is_active: true` |
| Transition relationships | Source of 30 outbound return rules (see Measure phase); never a target of any rule |
| Phase-calendar relation | None |
| Explicit release-state row | **Absent** (confirmed) |
| Resolver behavior when absent | `resolve_phase_map_outbound` locates Phase Map purely by `surface_type = 'phase_map'` and **never reads its own release/access standing at all** — the absence has zero behavioral consequence in this function. `v_phase_map_nodes`/`v_measures_phase_map_nodes_v1` would fall back to the registry parent (`released`/`visible`) if queried for Phase Map's own row, same pattern as `return_antechamber`. |
| Anonymous-read behavior | Direct `measures_registry` anon readback (this Audit): row **visible**. `v_measures_release_surface_v1`: `release_state=released, access_state=visible, is_renderable=true, surface_state_reason='renderable'`. |
| Migration/OAR history | Not found by exact-string grep for a dedicated seeding migration; Phase Map's row is part of the broader `spine` seed. |
| Independent supply of standing | Yes, same as `return_antechamber` — registry parent supplies complete, non-held standing. |

**Classification: `missing_evidence`, `valid_by_design` in practical effect — this is not the same cause as `return_antechamber`'s absence** (per the source OAR2's explicit instruction not to assume both rows share the same cause): Phase Map's absence is inconsequential because the router role never consults its own standing; `return_antechamber`'s absence is inconsequential because of the view-layer fallback. Different mechanisms, same non-defect outcome.

## Anonymous-role readback (full result set, this Audit)

Transaction-scoped (`begin; set local role anon; ...; rollback;`), 2026-07-15, all transactions rolled back, no state changed:

- `measures_registry` direct SELECT for `gate_4_breastplate`, `return_antechamber`, `phase_map`, `crystal_temple_home`: returned `crystal_temple_home` (released/visible), `phase_map` (released/visible), `return_antechamber` (released/callable) — **`gate_4_breastplate` returned zero rows** (RLS-filtered, consistent with its `held` registry-parent value).
- `measures_release_state` direct SELECT (unfiltered `count(*)`): **0 rows visible to anon** — confirms no anon-facing policy exists on this table.
- `v_measures_release_surface_v1` SELECT for the three test keys: all three returned data (see per-row findings above) — confirms the view exposes `measures_release_state`-derived values to anon despite the base table being inaccessible directly.
- `measures_encounter_def` direct SELECT by `encounter_key = 'gate_4_breastplate_encounter'`: **row visible** (`is_active: true`, no release/access gate applies to this table at all).

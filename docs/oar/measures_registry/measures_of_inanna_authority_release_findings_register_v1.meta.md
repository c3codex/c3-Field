---
document_type: findings_register
authority_level: working
document_scope: map_environment_audit_authority_release
title: Measures of Inanna — Authority and Release Findings Register
status: filed
version: v1
operator: op044
system: measures_registry
target_environment: measures_of_inanna
source_oar2: docs/oar/measures_registry/oar2_audit_measures_of_inanna_authority_and_release_v1.meta.md
executor: claude
observation_time: 2026-07-15
---

# Measures of Inanna — Authority and Release Findings Register

A recommendation in this register is not authorization. No finding here has been remediated.

## Finding 1 — cadence-automation join is broken for 21 of 22 governed phase anchors

- **Observed condition:** `reconcile_due_releases` joins `measures_release_state.phase_label = measures_phase_calendar.phase_key`; only one Inanna-scoped row (`gate_3_lapis_necklace`, `phase_label = "gate_3_anchor"`) has a `phase_label` in the calendar's machine-key format.
- **Intended standing:** passed phase anchors should trigger automatic release for held Gate/Epithet/ME rows.
- **Actual standing:** the daily cron job (`jobid 1`, active) can only ever match Gate 3; every other held row's `phase_label` is either a human-readable string (`"June Solstice"`, `"Lions Gate"`) or `null`.
- **Authority surface:** `reconcile_due_releases` (function) + `measures_release_state`/`measures_phase_calendar` (data).
- **Active consumer:** pg_cron (`jobid 1`, runs daily 00:05).
- **Runtime consequence:** Gates 5–7, Epithets 4–9, MEs 2–13 remain held past their anchors indefinitely, with no automated path to release even after their scheduled dates.
- **Containment:** none — this is not blocked from firing; it simply never finds matching rows.
- **Evidence:** cadence audit, full table comparison; database_confirmed.
- **Primary classification:** `active_defect`.
- **Evidence qualifiers:** `database_confirmed`, `source_confirmed`.
- **Recommended next phase:** `bounded_remediation_OAR2` (fixing the join key format, not the release logic).
- **Operator decision required:** whether to align `phase_label` values to `phase_key` format, or replace the join with an explicit FK/mapping.
- **Prohibited premature action:** do not manually release the affected units to "fix" the symptom without addressing the join.

## Finding 2 — `resolve_measures_next_step` requires `access_state = 'visible'`, which no live Gate/Epithet/ME row currently has

- **Observed condition:** the function's `released_cadence` CTE filters on `rs.access_state = 'visible'`; all released Gate/Epithet/ME rows show `'encounterable'`.
- **Intended standing:** unclear — either the function's filter or the release automation's output value is wrong, since `reconcile_due_releases` itself sets `access_state = 'visible'` on automated release, yet Gate 3 (which was released this way) now shows `'encounterable'`.
- **Actual standing:** this function would return zero eligible next-steps for the entire chamberplate cadence sequence as currently seeded.
- **Authority surface:** `resolve_measures_next_step` (function).
- **Active consumer:** not traced to a specific caller in this Audit — presence in the function catalog confirmed, invocation site not found in the files read.
- **Runtime consequence:** if this function is actually called by the live app, cadence-based "next step" progression would silently return nothing.
- **Containment:** unknown — depends on whether this function is actually invoked.
- **Evidence:** access-semantics audit; database_confirmed.
- **Primary classification:** `active_defect` (conditional on the function being invoked) / `missing_evidence` (regarding whether it's invoked at all).
- **Evidence qualifiers:** `database_confirmed`, `runtime_unverified`.
- **Recommended next phase:** `Audit_02` (trace callers of this function before deciding remediation scope).
- **Operator decision required:** whether `'visible'` or `'encounterable'` is the intended cadence-eligible value.
- **Prohibited premature action:** do not change either the function or the release automation's target value without confirming which is authoritative.

## Finding 3 — precedence inconsistency across consumers when an explicit release-state row is absent

- **Observed condition:** `v_measures_release_surface_v1`, `v_phase_map_nodes`, and `v_measures_phase_map_nodes_v1` all `COALESCE(explicit, registry-parent)` — fallback to parent. `resolve_phase_map_outbound` instead fails open (no gate applied) when the explicit row is absent, independent of the registry parent's own values.
- **Intended standing:** unclear from evidence — no single documented precedence rule was found.
- **Actual standing:** two different, independently confirmed behaviors coexist for the same "missing row" scenario.
- **Authority surface:** view layer vs. `resolve_phase_map_outbound`.
- **Active consumer:** views (unclear which are actually queried by the live app — `resolve_encounter.ts` uses `v_measures_transition_runtime`, not the release-surface views); `resolve_phase_map_outbound` (invocation site not traced).
- **Runtime consequence:** a future registry row added without an explicit release-state row would behave differently depending on which code path resolves it — safe/parent-derived in one, unconditionally open in the other.
- **Containment:** currently non-consequential for `phase_map` (never a target) and low-consequence for `return_antechamber` (parent values are already fully open).
- **Evidence:** precedence map; database_confirmed (function/view bodies).
- **Primary classification:** `unresolved_pending_operator_decision`.
- **Evidence qualifiers:** `database_confirmed`, `conflicting_evidence`.
- **Recommended next phase:** `Audit_02` or `operator_decision`.
- **Operator decision required:** which fallback behavior is intended as the single source of truth.
- **Prohibited premature action:** do not standardize the two behaviors without operator direction.

## Finding 4 — Gate 4 release_state conflict is currently contained by access_state, not resolved

- Carried forward from the Measure phase, now cross-surface-audited. **Classification: `active_defect`, contained.** Evidence qualifiers: `database_confirmed`, `anonymous_readback_confirmed`. Recommended next phase: `bounded_remediation_OAR2` (reconcile `measures_registry.release_state` and `measures_release_state.release_state` for this one row) — but only after Finding 3 is resolved, since the "which table wins" question is a prerequisite. Operator decision required: which value is correct. Prohibited premature action: do not change either table's value for Gate 4 without first deciding the Finding 3 precedence question, or the fix could be immediately undone by the next automated pass.

## Finding 5 — `measures_release_state` has no anon-facing RLS policy, but is exposed indirectly through non-`security_invoker` views

- **Observed condition:** confirmed via live anon-role readback: 0 rows visible from `measures_release_state` directly; real explicit-state data visible through `v_measures_release_surface_v1`.
- **Intended standing:** unclear — could be intentional (views are the sanctioned read path) or an oversight (the base table was locked down but the views inherited owner privileges instead of enforcing RLS).
- **Authority surface:** RLS + view ownership/`security_invoker` setting.
- **Active consumer:** any anon session querying the views.
- **Runtime consequence:** anon can read explicit release/access standing (including `release_reason`/`access_reason` free-text) for every row with an explicit release-state row, via the views, even though the base table is locked down.
- **Containment:** the data exposed is the same data `measures_registry`'s own policy already exposes for released rows, plus (for held/conflicted rows like Gate 4) the explicit-table's values, which in Gate 4's case actually shows the *more permissive* `released` value rather than the registry parent's `held` value — i.e. **the view leaks a more permissive release_state for Gate 4 than the base table's own RLS-gated value would ever reveal.**
- **Evidence:** baseline audit §2; discrepancy audit anon-readback results.
- **Primary classification:** `active_defect` (the leak itself) with a `missing_authority` component (no explicit decision was found authorizing this exposure).
- **Evidence qualifiers:** `database_confirmed`, `anonymous_readback_confirmed`.
- **Recommended next phase:** `Audit_02` or `operator_decision`.
- **Operator decision required:** whether view-level exposure of `measures_release_state` to anon is intended; if not, set `security_invoker=true` on the relevant views or add an anon policy to the base table matching the same semantics.
- **Prohibited premature action:** do not change view security settings without operator confirmation — could break the live rendering path if the app actually depends on this exposure.

## Finding 6 — Measure-phase evidence undercount: a working DB read-model layer exists

- **Observed condition:** at least 9 release/access-relevant views plus a manifest-shaped view (`v_measures_encounter_manifest_v1`, embedding actions/media/sequence/phase-map JSON per encounter) exist and are queryable.
- **Intended standing:** n/a (this is a correction to a prior evidence claim, not a live-system defect).
- **Actual standing:** the Measure phase's AI Deployment Inventory stated "No coherent existing read model was found." This is contradicted by direct evidence.
- **Authority surface:** Measure-phase evidence file, not the live system.
- **Active consumer:** n/a.
- **Runtime consequence:** none to the live system; the consequence is to future planning that relied on the Measure evidence being complete.
- **Containment:** n/a.
- **Evidence:** baseline audit §2 (view list + definitions).
- **Primary classification:** `missing_evidence` (in the prior Measure pass, not in this Audit).
- **Evidence qualifiers:** `database_confirmed`.
- **Recommended next phase:** `bounded_remediation_OAR2` scoped to correcting the Measure-phase AI Deployment Inventory (append-only, per the same discipline used in the reconciliation pass), or simply carried forward as Audit-phase context without touching the original file.
- **Operator decision required:** whether to file a Measure-evidence correction, or let this Audit register stand as the correction of record.
- **Prohibited premature action:** do not edit the original Measure evidence files.

## Finding 7 — `registered_runtime` is confirmed dead code

- **Observed condition:** directory exists (`chambers/`, `renderers/`, `styles/`); zero references anywhere in active `src/**/*.ts(x)`; `App.tsx` imports the live runtime from `MeasuresRegistryOrchestrator` instead.
- **Classification:** `historical_deprecated_residue`.
- **Evidence qualifiers:** `source_confirmed`.
- **Recommended next phase:** `no_action` (informational; confirms it cannot currently affect production).
- **Operator decision required:** none, unless the operator wants the directory removed for cleanliness (out of this Audit's scope either way).
- **Prohibited premature action:** do not delete the directory under this OAR2 (remediation is out of scope).

## Finding 8 — `resolve_encounter.ts`'s legacy fallback path has no release/access gate

- **Observed condition:** when the primary `measures_registry` lookup returns no row (as happens for anon on any held unit), the code falls back to querying `measures_encounter_def` directly by exact `encounter_key` string, gated only by `is_active = true`.
- **Classification:** `unresolved_pending_operator_decision`.
- **Evidence qualifiers:** `source_confirmed`, `runtime_unverified`.
- **Recommended next phase:** `Audit_02` (trace every caller of `resolveEncounter`/`resolveEncounterRow` to determine what string is actually passed for held units, and whether any caller ever supplies an `encounter_key` rather than a `registry_key`).
- **Operator decision required:** none yet — this needs more tracing before it is actionable.
- **Prohibited premature action:** do not add a gate to this code path without confirming it is actually reachable with a held unit's real encounter_key first (an unnecessary change carries its own regression risk).

## Finding 9 — `'active'` is a dead branch in the `measures_registry` anon-read RLS policy

- **Observed condition:** policy allows `release_state = ANY('released','active')`; `'active'` is not a legal value under the column's check constraint.
- **Classification:** `historical_deprecated_residue`.
- **Evidence qualifiers:** `database_confirmed`.
- **Recommended next phase:** `no_action` (harmless; noted for completeness).
- **Operator decision required:** none.
- **Prohibited premature action:** none applicable.

## Finding 10 — public-runtime standing unverified

- **Observed condition:** the one documented public domain (`https://www.measuresregistry.com`) returned HTTP 403 to a read-only fetch attempt.
- **Classification:** `missing_evidence`.
- **Evidence qualifiers:** `runtime_unverified`.
- **Recommended next phase:** `Audit_02` (retry with a different, authorized observation method — e.g. an operator-driven browser session — since this tool's request was blocked, likely at a bot/WAF layer, not necessarily indicating an application-level problem).
- **Operator decision required:** whether/how to obtain a verified browser observation.
- **Prohibited premature action:** do not treat the 403 as evidence of either a working or broken deployed site — it is genuinely unverified.

## Carried forward, unmodified (from the Measure phase, re-confirmed or not re-disputed in this Audit)

`return_antechamber` and `phase_map` missing release-state rows (re-classified above with distinct causes, both `valid_by_design` in practical effect); foundational access-state label drift (re-audited above as `semantic_drift`, not resolved to intentional); dual media-map tables; missing artwork intake manifest; missing dashboard read model (**superseded by Finding 6** — a read model does exist at the DB level, though not assembled into an operator-facing dashboard); held Measures of Inanna FREE admission; held public semantic pairings; live MAP terminology residue; Claude actor constraint gap; Temple architectural-role DB-reconciliation-pending.

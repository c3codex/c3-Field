---
document_type: baseline
authority_level: working
document_scope: map_environment_audit_authority_release
title: Baseline — Audit Measures of Inanna Authority and Release
status: filed
version: v1
operator: op044
system: measures_registry
target_environment: measures_of_inanna
source_oar2: docs/oar/measures_registry/oar2_audit_measures_of_inanna_authority_and_release_v1.meta.md
executor: claude
observation_time: 2026-07-15
---

# Baseline — Audit Measures of Inanna Authority and Release

Governed audit evidence for OAR2 ROUTED sections 1–3. Read-only. No operational mutation performed.

## 1. Measure evidence preflight

- Repository root: `c:\Users\c3DAO\OneDrive\Apps\c3Field`. Active branch: `measures`. Current commit at start of this Audit: `382a83c2c51881256a0a6ca9d124ec01de462b29`.
- `git merge-base --is-ancestor 382a83c HEAD` confirms **382a83c is reachable from HEAD** (HEAD equals 382a83c at Audit start — no intervening commits).
- Measure manifest: [`measure_measures_of_inanna_closeout_manifest_v2.meta.md`](measure_measures_of_inanna_closeout_manifest_v2.meta.md). Operational Map (final): [`measures_of_inanna_operational_map_v3.meta.md`](measures_of_inanna_operational_map_v3.meta.md). Environment Risk Report: [`measures_of_inanna_environment_risk_report_v2.meta.md`](measures_of_inanna_environment_risk_report_v2.meta.md). Reconciliation Evidence: [`reconciliation_evidence_measure_measures_of_inanna_v1.meta.md`](reconciliation_evidence_measure_measures_of_inanna_v1.meta.md).
- No Measure evidence file was modified in this Audit.

## 2. Authority-surface inventory

Live query, 2026-07-15, against `information_schema` and `pg_catalog` on Supabase project `zfihrspxvennjzazxcbj`.

### Base tables

| Surface | Structural role | Writer/mutation path | Public-read behavior (RLS) |
|---|---|---|---|
| `measures_registry` | Registry identity + parent-row release/access columns | `service_role` (`ALL`, via `service_role_only_registry` policy) | anon/authenticated `SELECT` allowed **only** where `is_active = true AND release_state = ANY('released','active')` (`measures_registry_public_released_active_read`) |
| `measures_release_state` | Explicit current release/access standing, keyed by `registry_id` | `service_role` only (`ALL`); also written by `SECURITY DEFINER` function `ensure_measures_release_state` and by `reconcile_due_releases` | **No anon or authenticated SELECT policy exists at all** — only `service_role_only_release` (`ALL`, service_role). Confirmed by direct anon-role readback (§ below): 0 rows visible. |
| `measures_phase_calendar` | Cadence anchors | not directly inspected for RLS in this pass (no anon-facing consumption path found) | not tested |
| `measures_transition_rule` | Progression/return/pause edges | `service_role` only | anon/authenticated `SELECT` allowed where `rule_state = 'active'` (`public read active measures_transition_rule`) |
| `measures_encounter_def` | Encounter surface shape | `service_role` only; also written by `SECURITY DEFINER` function `define_measures_encounter` | anon/authenticated `SELECT` allowed where **`is_active = true` only — no release_state or access_state condition** (`public read active measures_encounter_def`) |
| `c3_runtime_admission_contract`, `c3_runtime_admission_binding`, `c3_chamber_directory_binding`, `c3_public_semantic_pairing` | System-level admission/binding/semantic authority | not re-queried for RLS in this pass (system-level, not per-encounter; standing already captured in Measure phase) | not tested |
| `measures_registry_policy_scope_isolation` | Self-describing policy-scope registry | not re-queried | not tested |

### Functions (release/resolution logic)

| Function | Security | Role |
|---|---|---|
| `ensure_measures_release_state(p_registry_key)` | `SECURITY DEFINER` | Backfills a `measures_release_state` row **from the `measures_registry` parent row's own `release_state`/`access_state`/`phase_label`** via upsert, when called. Not invoked in this Audit (would mutate state). Confirms the registry parent is the designed source of truth for backfill. |
| `reconcile_due_releases(p_run_date default current_date)` | invoker | Automated release job — see cadence audit for its exact (broken) join logic. |
| `resolve_measures_next_step(origin_key, from_encounter_key)` | invoker | Cadence/progression-next-step resolver — requires `measures_release_state.access_state = 'visible'` exactly (see access-semantics audit). |
| `resolve_measures_progression(origin_key, from_encounter_key)` | invoker | Lists next active transition-rule steps from a given encounter; does not itself gate on release/access. |
| `resolve_phase_map_outbound(p_registry_key)` | invoker, `STABLE` | The actual Phase Map click resolver — see precedence map for full trace. Fails **open** (no gate applied) when the target's `measures_release_state` row is absent. |
| `define_measures_encounter(...)` | `SECURITY DEFINER` | Content-authoring helper, not a release/access gate. |
| `record_measures_encounter_view(...)` | not inspected in detail | Progress-tracking, referenced by `resolve_measures_next_step`'s `measures_encounter_progress` join. |

### Views (read surfaces)

34 views exist in `public` schema. Of these, at least 9 are directly release/access-relevant: `v_measures_registry_state_v1`, `v_measures_registry_state_v2`, `v_measures_chamberplate_v1`, `v_measures_encounter_runtime`, `v_measures_release_surface_v1`, `v_measures_encounter_manifest_v1`, `v_phase_map_nodes`, `v_measures_phase_map_nodes_v1`, `v_due_releases_preview`. **This directly contradicts the original Measure phase's AI Deployment Inventory finding ("No coherent existing read model was found")** — a working read-model layer does exist at the database level; it was not found in the Measure pass. This is recorded as a correction-worthy discrepancy for a later bounded remediation of the Measure evidence, not remediated here.

All of the above views are granted `SELECT` to `anon`/`authenticated` at the GRANT level. Whether that grant actually exposes RLS-protected `measures_release_state` data depends on each view's security-invoker setting — see the precedence map for the tested result (`v_measures_registry_state_v1`/`v_measures_release_surface_v1`/`v_measures_chamberplate_v1` show `reloptions: null`, i.e. **`security_invoker` is not set, meaning they run as the view owner and are not subject to the querying role's RLS** — confirmed by live anon-role readback returning real `measures_release_state`-derived data through `v_measures_release_surface_v1` despite `measures_release_state` itself being unreadable to anon directly).

### Scheduled jobs

`cron.job` (pg_cron): one job, `jobid=1`, schedule `5 0 * * *` (00:05 daily), command `select * from public.reconcile_due_releases(current_date);`, `active: true`. This is the automated release mechanism — see cadence audit for why it does not currently fire for most held units.

## 3. Schema and constraint audit

- `measures_registry.release_state`: `NOT NULL`, default `'sealed'`. Check constraint allows `{sealed, held, released, open, closed}`.
- `measures_registry.access_state`: `NOT NULL`, default `'gated'`. Check constraint allows `{gated, visible, callable, encounterable, archived}`.
- `measures_release_state.release_state` / `.access_state`: both `NOT NULL`, **no column default** (row must be explicitly inserted; there is no natural "unset" state once a row exists — the only way a row is absent is if it was never inserted, which is exactly the case for `phase_map` and `return_antechamber`). Same allowed-value check constraints as the registry table.
- **The `measures_registry_public_released_active_read` RLS policy allows `release_state = ANY('released','active')`, but `'active'` is not a legal value under `measures_registry_release_state_check`.** This branch of the policy can never match live data — a harmless but confirmed piece of residue (`historical_deprecated_residue`), most likely left over from an earlier vocabulary before the check constraint was tightened to `{sealed, held, released, open, closed}`.
- A release-state row is **not** structurally required: `measures_release_state` has no trigger, foreign-key-not-null-cascade, or other mechanism forcing a row to exist for every `measures_registry` row. Absence is schema-valid, not a constraint violation — its consequence is purely behavioral (see precedence map: each consumer decides its own fallback).
- `measures_transition_rule.rule_state` allowed values: `{active, held, inactive}`. `transition_kind` allowed values: `{progression, pause, return, release, seal, dependency_unlock, connect_request_prompt}` — a broader vocabulary than the 2 kinds (`progression`, `return`) actually observed in live Inanna-scoped rows during the Measure phase.
- `measures_phase_calendar.anchor_name` allowed values: `{new_moon, full_moon, june_solstice, lions_gate, september_equinox, winter_solstice}`. `phase_family` allowed values: `{gate, epithet, me, calendar_anchor}`. `standing_type` allowed values: `{anchor_only, confirmation_seal, phased_ritual_release, scheduled}`.
- No trigger on any of these five tables enforces or normalizes the release/access vocabulary beyond the check constraints; the only triggers present are generic `updated_at` timestamp triggers.

---
document_type: oar1
authority_level: execution_evidence
document_scope: executor_role_routing
title: OAR1 Addendum — Establish Capacity-Aware Executor Routing for New Moon to Lion’s Gate
status: blocked_before_mutation
version: v1
operator: op044
system: c3_field
source_oar2: docs/oar/c3_field/oar2_addendum_establish_capacity_aware_executor_routing_for_new_moon_to_lions_gate_v1.meta.md
initiative_key: new_moon_to_lions_gate_2026
final_standing: blocked_before_mutation
date: 2026-07-14
---

# OAR1 Addendum — Establish Capacity-Aware Executor Routing for New Moon to Lion's Gate

## Execution Summary

The addendum's registration migration was fully drafted and reviewed against live schema evidence, but **no database mutation was applied**. Two independent, unrelated blockers prevented safe execution against the linked production project (`zfihrspxvennjzazxcbj`), and this run stopped rather than routing around either one:

1. The Supabase MCP server available to this session returned `Unauthorized` for every read/write tool (`get_project`, `list_branches`, `execute_sql`, etc.) — no access token is configured for this session's MCP connection.
2. The Supabase CLI is linked and authenticated, but `supabase db push --dry-run` refused outright: the remote migration history contains 17 versions (2026-07-02 through 2026-07-09) with no corresponding file in `supabase/migrations/`. This drift predates this session and this addendum entirely — it is not something this execution caused.

No `execute_sql`/raw-query path was available to this executor in this session to work around either blocker. Per the addendum's own **NON-OVERLAPPING WORK RULE** ("if overlap or an unsafe condition is discovered: stop the later mutation; preserve evidence; route the conflict to Chazz; return the decision to op044"), this run stopped and preserved the drafted migration rather than attempting `supabase migration repair` unilaterally — repairing shared migration-ledger history is a hard-to-reverse action on a live production project and is not this bounded addendum's authority to resolve on its own judgment.

Repository-only artifacts (drafted, reviewed, not yet applied to the database) were produced and are ready to run once one of the two blockers above is resolved.

## Authority Surfaces Inspected

Repo authority surfaces (read-only, no mutation):

- `supabase/migrations/202605180001_process_registry_and_oar_queue_foundation.sql` (`system_process_registry`, `system_oar_queue`, `system_oar_execution_evidence`)
- `supabase/migrations/202605140001_c3_field_oar_spine_persistence.sql` (`c3_oar_process_instance`, `c3_oar_transition_event`, `c3_oar_seeded_reference`)
- `supabase/migrations/202606010002_c3_key_permission_map_storage_contract.sql` (ruled out: scoped to wallet/NFT-held human and institution permissions, not a fit for AI executor identities)
- `supabase/migrations/202606290001_register_nine_roles_and_role_call_standing.sql` (confirms the nine native relational roles are seated in `measures_registry.metadata` under `registry_key = 'measures_registry_root'`, unrelated encounter-authorization domain — confirms this addendum correctly does not touch them)
- `docs/oar/c3_field/oar1_register_new_moon_to_lions_gate_inanna_seat_initiative_v1.meta.md` (Cody's completed initiative-registration OAR1 — `final_standing: completed_with_registered_holds`)
- `docs/oar/c3_field/register_new_moon_to_lions_gate_inanna_seat_initiative_v1.sql` (Cody's applied registration script — read to confirm live schema, not re-executed)

Live DB surfaces confirmed to already exist (via Cody's OAR1 evidence, not by direct query — this executor had no live query access):

- `public.c3_role_contract` — already holds 3 active rows for this initiative: `chazz_systems_advisement_new_moon_to_lions_gate_2026`, `claude_codex_database_advisement_new_moon_to_lions_gate_2026`, `cody_source_free_advisement_new_moon_to_lions_gate_2026`
- `public.c3_evidence_contract` — already holds 3 matching evidence-contract rows
- `public.system_process_registry` — already holds the `new_moon_to_lions_gate_2026` initiative row

**Correction to this addendum's own premise:** the addendum's Codex Registration section anticipated that "no valid system-role authority exists" might be the case. That premise does not hold — `c3_role_contract`/`c3_evidence_contract` already exist and already hold exactly the three identities this addendum needed to reconcile. Neither table has a migration file under `supabase/migrations/`; they were evidently created and populated directly against the remote project (consistent with the migration-ledger drift discovered below), not through the tracked migration workflow this executor has access to in this session.

## Drafted Migration (Not Applied)

`supabase/migrations/20260714214628_establish_capacity_aware_executor_routing_for_new_moon_to_lions_gate_v1.sql`

Content, if/when applied, would:

1. Additively merge an `executor_routing` object into the existing `system_process_registry` row's `metadata` for `process_key = 'new_moon_to_lions_gate_2026'` — default route, single-mutation-executor rule, capacity-aware assignment rule, non-overlapping-work rule, dual-advisement requirement, and the current-registration exception, all as jsonb text (no new column, no new table).
2. Reconcile the three existing `c3_role_contract` rows additively: set `claude_codex_database_advisement_new_moon_to_lions_gate_2026.mutation_authority_allowed = true` (default primary executor going forward) and merge `routing_standing` metadata into all three rows (claude/cody/chazz) describing their standing under this addendum. Role keys, `system_key`, and all other existing fields are left untouched.
3. Register this addendum's own OAR2 → OAR1 lifecycle in `c3_oar_process_instance` / `c3_oar_transition_event` / `c3_oar_seeded_reference`, under a `process_instance_key` (`c3field_executor_routing_new_moon_to_lions_gate_2026_v1`) distinct from Cody's already-closed `new_moon_to_lions_gate_2026_initiative_registration` — no shared row, no overlap.
4. Register a bounded `system_oar_queue` row and `system_oar_execution_evidence` row under a `queue_key` (`executor_routing_new_moon_to_lions_gate_2026_addendum_v1`) distinct from Cody's already-closed `new_moon_to_lions_gate_2026_registration_queue` — no shared row, no overlap.

No `CREATE TABLE`, no `ALTER TABLE ... ADD COLUMN`, no constraint change. Every statement targets rows/columns that already exist.

## Exact Schema Gap (Recorded, Not Patched)

`public.c3_oar_transition_event.actor` has the check constraint:

```
check (actor in ('operator', 'chazz', 'cody', 'measures', 'notchazz'))
```

**`'claude'` is not a valid actor value.** This means this executor cannot honestly record its own execution as a transition-event actor under the current schema — attributing a Claude-executed transition to `'operator'`, `'cody'`, or any other value would violate the addendum's own evidence-attribution requirement ("one role may not claim another role's direct observation"). The drafted migration therefore records only the `operator` (op044 approval) transition and does not fabricate a `claude` actor event.

**Bounded schema recommendation:** widen the check constraint to `check (actor in ('operator', 'chazz', 'cody', 'claude', 'measures', 'notchazz'))`. This is additive and backward-compatible (existing rows are unaffected; no value is removed). Recommended as a small, separately reviewable follow-up migration, not bundled into this addendum's execution.

## Migration-Ledger Drift (Discovered, Not Resolved)

`supabase db push --dry-run` returned:

> Remote migration versions not found in local migrations directory: 20260702125802, 20260702130018, 20260702143712, 20260702151435, 20260702153744, 20260702154341, 20260702164214, 20260702174145, 20260702174248, 20260702174411, 20260702203335, 20260702204120, 20260702205631, 20260705184946, 20260705190138, 20260705190228, 20260706061910, 20260709190108

Verified: none of these 17 timestamps correspond to any local file under `supabase/migrations/` (checked directly; only `202607020001_seat_marble_surface_style_profiles_and_nested_car_acknowledgments.sql` exists locally in that date range, which is a different key). This is pre-existing drift dated 2026-07-02 through 2026-07-09 — five to twelve days before this addendum — and is consistent with the same pattern that produced the untracked `c3_role_contract`/`c3_evidence_contract` tables above: mutations applied directly against the remote project outside the `supabase/migrations` + `db push` workflow.

This executor did not run `supabase migration repair` to force past the drift. Repairing shared migration-ledger history is a hard-to-reverse action on the live production project backing `measuresofinanna.com` and real Stripe payment tables, and resolving it is not narrowly this addendum's registration scope. Per the addendum's own non-overlapping-work and conflict-routing rules, this is returned to op044 (with Chazz for systems-alignment review) rather than resolved unilaterally.

## Role Standing (Current, Unchanged By This Run)

| Role key | Role state (as registered by Cody) | mutation_authority_allowed (current) | Addendum-intended change |
|---|---|---|---|
| claude_codex_database_advisement_new_moon_to_lions_gate_2026 | active | false | → true (default primary executor) |
| cody_source_free_advisement_new_moon_to_lions_gate_2026 | active | false | unchanged (bounded executor/validator, per-OAR2 grant only) |
| chazz_systems_advisement_new_moon_to_lions_gate_2026 | active | false | unchanged (advisor/validator only, never mutation) |

None of these rows were modified by this run. The table above reflects the intended state of the drafted, unapplied migration.

## Mutation Count

**Zero.** No `INSERT`, `UPDATE`, or `DELETE` was executed against any table in the linked Supabase project. All SQL shown above exists only as a repository file, not yet applied.

## Repository Diff

Created by this run:

- `supabase/migrations/20260714214628_establish_capacity_aware_executor_routing_for_new_moon_to_lions_gate_v1.sql` (drafted, not applied)
- `docs/oar/c3_field/oar1_addendum_establish_capacity_aware_executor_routing_for_new_moon_to_lions_gate_v1.meta.md` (this file)

No `src` mutation. No other file touched.

## Executor Advisement

### Claude (this executor)

Observed standing: `c3_role_contract`/`c3_evidence_contract` already exist and are the correct home for routing standing — no schema invention needed for role content. The one genuine gap is the `actor` enum on `c3_oar_transition_event`, which is narrow and additive to fix. The real blocker is operational (no live DB access in this session), not architectural.

Recommendation: resolve DB access (either authorize the Supabase MCP token for this session, or reconcile the migration-ledger drift through a deliberate, reviewed `supabase db pull`/repair pass — not as a side effect of an unrelated bounded OAR2) before attempting to apply this migration or any further initiative work.

### Cody (advisement requested, not yet returned)

Cody's advisement on this drafted migration has not been collected in this session. Per the addendum's dual-advisement requirement, this should be obtained before the migration is applied, particularly to confirm Cody's own applied script (`docs/oar/c3_field/register_new_moon_to_lions_gate_inanna_seat_initiative_v1.sql`) is the authoritative record of what actually landed remotely, since no corresponding tracked migration file exists for it either.

### Chazz (advisement requested, not yet returned)

Not collected in this session. Per **CLOSEOUT** rules on divergent advisement and conflict routing, the migration-ledger drift finding above is explicitly routed to Chazz for systems-alignment review before any repair action is taken.

## Registered Holds

Held by this run:

- Application of the drafted migration to the live database.
- Any `c3_oar_transition_event.actor` constraint change.
- Any `supabase migration repair` or ledger-history rewrite.
- Everything the source OAR2/addendum already holds (FREE cutover, public release, legacy retirement, Lion's Gate release, Priceless Gallery launch, artwork release, Phase Calendar mutation, held-encounter activation, Inanna redesign, policy broadening, nine-native-role alteration).

## Next Recommended Step

Not a new OAR2 — this is a resumption of the same addendum once one of the two blockers clears:

1. Operator or Chazz resolves DB access for this executor (MCP token, or a reviewed migration-ledger reconciliation).
2. Re-run `supabase db push --dry-run`, confirm no drift, then apply `20260714214628_establish_capacity_aware_executor_routing_for_new_moon_to_lions_gate_v1.sql` as-is (no changes needed to the drafted content).
3. Collect Cody's and Chazz's advisement on the applied result.
4. Only then does the New Moon to Lion's Gate critical path resume under Claude as default primary executor.

## Final Standing

`blocked_before_mutation`

The route is drafted. Nothing was mutated. The blocker is returned to op044, with the ledger-drift question specifically routed to Chazz.

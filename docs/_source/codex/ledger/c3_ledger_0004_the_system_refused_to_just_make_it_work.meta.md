---
document_type: ledger_entry
authority_level: governance
document_scope: c3_ledger
ledger_entry_id: c3_ledger_0004
title: The System Refused to "Just Make It Work"
entry_type: governance_finding_migration_provenance_drift
date: 2026-07-14
operator: op044
executor: Claude
originating_inquiry: >
  During preflight for the New Moon to Lion's Gate capacity-aware executor routing addendum,
  `supabase db push --dry-run` was attempted to apply a drafted, reviewed registration migration.
  The inquiry became: is the remote database environment still reconcilable from the repository's
  migration history, or has it drifted?
context: >
  c3 Field priority initiative "New Moon to Lion's Gate" (initiative_key: new_moon_to_lions_gate_2026).
  See OAR/OAR1 addendum:
  docs/oar/c3_field/oar1_addendum_establish_capacity_aware_executor_routing_for_new_moon_to_lions_gate_v1.meta.md,
  which independently discovered this same drift and returned `blocked_before_mutation` rather than
  attempting `supabase migration repair` unilaterally.
observed_relations: >
  The application (measuresofinanna.com) remains live and operational. The Supabase CLI's own
  migration-history check refused to proceed given inconsistency between remote and local migration
  ledgers. Operational availability and governable reproducibility are shown here to be independent
  properties of the same system - one can hold while the other does not.
discovery: >
  Application working is not evidence that the environment remains governable. The refusal to
  proceed (`db push --dry-run` erroring rather than silently repairing) is itself the correct
  governance behavior: it prevented a convenience-driven repair from converting an unexplained
  history gap into accepted authority.
current_standing: confirmed_open
disposition: >
  Provenance investigation authorized under this entry; reconciliation and mutation remain held
  pending its results. See `related_oars_subsequent` for the investigation closeout once filed.
related_authorities:
  - New Moon to Lion's Gate c3 Model
  - Dual Executor Advisement Amendment
  - OAR Lifecycle - Execution and Handoff
related_oars:
  - docs/oar/c3_field/oar2_register_new_moon_to_lions_gate_inanna_seat_initiative_v1.meta.md
  - docs/oar/c3_field/oar2_addendum_establish_capacity_aware_executor_routing_for_new_moon_to_lions_gate_v1.meta.md
  - docs/oar/c3_field/oar1_addendum_establish_capacity_aware_executor_routing_for_new_moon_to_lions_gate_v1.meta.md
related_entries: []
confirmation_status: provenance_investigation_closed_holds_remain
related_oars_subsequent:
  - docs/oar/c3_field/oar1_investigate_migration_ledger_provenance_drift_v1.meta.md
evidence_refs:
  - supabase/migrations/
  - "supabase db push --dry-run output, 2026-07-14"
future_review_conditions: >
  Reopen for standing review only after the bounded provenance investigation required below returns
  a disposition for every listed version and a non-destructive reconciliation path is proposed and
  reviewed by op044/Chazz.
---

# c3 Ledger Entry — c3_ledger_0004

## Working Title

The System Refused to "Just Make It Work"

## Finding

During preflight for capacity-aware executor routing, the Supabase migration ledger reported eighteen remote
migration versions that are absent from the current repository migration surface.

The application remains operational, but operational success does not establish that the database environment
remains reproducible, reconcilable, or governable from source.

The CLI correctly refused to proceed with `db push --dry-run` while the remote migration ledger and local
migration history were inconsistent.

## Confirmed Remote-Only Versions

- `20260702125802`
- `20260702130018`
- `20260702143712`
- `20260702151435`
- `20260702153744`
- `20260702154341`
- `20260702164214`
- `20260702174145`
- `20260702174248`
- `20260702174411`
- `20260702203335`
- `20260702204120`
- `20260702205631`
- `20260705184946`
- `20260705190138`
- `20260705190228`
- `20260706061910`
- `20260709190108`

## Governance Interpretation

This is evidence of migration-history drift, not evidence of current application failure or data loss.

The remote database possesses execution receipts that the present repository cannot yet explain. Possible
provenance includes direct SQL execution, deleted or unmerged migration files, renamed equivalents,
branch-local migrations, or another execution surface. No single cause is established until the provenance
investigation returns evidence.

The refusal to continue is recorded as correct governance behavior. It prevented a convenience-driven repair
from silently converting an unexplained history gap into accepted authority.

## Required Resolution

Claude shall remain held from database mutation on this initiative until the bounded provenance investigation:

1. correlates each remote-only version with its originating SQL, OAR, commit, branch, or execution route;
2. identifies the live schema effect represented by each version;
3. assigns an evidence-based disposition to every version;
4. recommends a non-destructive reconciliation path; and
5. returns unresolved entries as explicit holds rather than inferred equivalences.

## Prohibited Under This Entry

This ledger entry does not authorize:

- `supabase migration repair`;
- `supabase db push`;
- database or schema mutation;
- fabricated placeholder migrations;
- reconstructed SQL presented as original evidence;
- deletion or rewriting of remote migration receipts; or
- treating application availability as proof of migration integrity.

## Field Principle Established

> The application working is not evidence that the environment remains governable.

## Current Standing

`confirmed_open` — no Codex standing, principle, or operational authority granted by this entry beyond what it
explicitly records.

## Disposition

`confirmed_open — provenance investigation authorized; reconciliation and mutation remain held.`

The database has receipts. The next task is to determine what they purchased.

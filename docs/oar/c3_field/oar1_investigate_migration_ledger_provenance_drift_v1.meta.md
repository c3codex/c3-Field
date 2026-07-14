---
document_type: oar1
authority_level: execution_evidence
document_scope: migration_provenance_investigation
title: OAR1 — Investigate Migration Ledger Provenance Drift
status: completed_with_registered_holds
version: v1
operator: op044
executor: Claude
system: c3_field
source_ledger_entry: docs/_source/codex/ledger/c3_ledger_0004_the_system_refused_to_just_make_it_work.meta.md
initiative_key: new_moon_to_lions_gate_2026
final_standing: completed_with_registered_holds
date: 2026-07-14
---

# OAR1 — Investigate Migration Ledger Provenance Drift

## Execution Summary

This closes the bounded provenance investigation required by `c3_ledger_0004` ("The System Refused to 'Just
Make It Work'"). All five required steps were executed as **read-only repository archaeology only**. No
`supabase migration repair`, no `db push`, no schema or data mutation, no fabricated migration content was
produced. Per the ledger entry's prohibitions, none of those actions were attempted.

**Bottom line: one of eighteen versions has a plausible, evidence-based correlate. The remaining seventeen have
none discoverable from this repository. This investigation could not identify the live schema effect of any of
the eighteen versions** — that requires a query this executor has no access path to run in this session (see
Limitation below). All eighteen remain held.

## Method

Exhaustive search across **all** git refs (`git log --all`), including local branches (`measures`, `c3field`,
`codex/cloudflare-runtime-deploy`, `codex/deploy-assessment-seating-fixes`,
`initiative/c3-field-convergence-infra`, `legacy`), all `origin/*` remotes, all stash entries, and reflog, for:

- any file ever added under `supabase/migrations/` matching any of the 18 version prefixes — none found;
- any file ever deleted under `supabase/migrations/` in the affected date range — one unrelated deletion found
  (2026-06-24, three files, none matching these versions);
- any commit whose message or diff correlates by exact or near timestamp;
- known repo precedent for this exact class of drift (see Correlated Precedent below).

Live schema inspection (querying `supabase_migrations.schema_migrations` for the actual applied statement text
per version, or the current `information_schema` state) was **not performed** — no path was available (see
Limitation).

## Correlated Precedent (Repo Evidence)

Commit `b8a0a38` ("Publish unDrifted cover story to Paragraph; correct migration timestamps", 2026-07-07)
explicitly documents this repository's established failure mode:

> "Also renames three 2026-07-08 migration files to match their actual applied timestamps (discovered while
> adding this one) — content unchanged, filenames only."

That commit's rename diff (`git show -M`) shows the pattern precisely: local files were renamed to timestamps
**2–3 minutes earlier** than what the git history had previously recorded (e.g.
`20260708014404` → `20260708014228`, a 136-second shift). No `supabase migration repair` accompanied that
rename in the commit — meaning the remote ledger for those three files likely still carries the **old**
(pre-rename) version numbers to this day, permanently orphaned unless separately repaired. This establishes
that renaming-without-repair is a known, repeated pattern in this repository, not a one-off.

## Per-Version Disposition

| Version | Local correlate found | Disposition |
|---|---|---|
| `20260702125802` | none | `unresolved_no_local_correlate_held` |
| `20260702130018` | none | `unresolved_no_local_correlate_held` |
| `20260702143712` | none | `unresolved_no_local_correlate_held` |
| `20260702151435` | none | `unresolved_no_local_correlate_held` |
| `20260702153744` | none | `unresolved_no_local_correlate_held` |
| `20260702154341` | none | `unresolved_no_local_correlate_held` |
| `20260702164214` | none | `unresolved_no_local_correlate_held` |
| `20260702174145` | none | `unresolved_no_local_correlate_held` |
| `20260702174248` | none | `unresolved_no_local_correlate_held` |
| `20260702174411` | none | `unresolved_no_local_correlate_held` |
| `20260702203335` | none | `unresolved_no_local_correlate_held` |
| `20260702204120` | none | `unresolved_no_local_correlate_held` |
| `20260702205631` | none | `unresolved_no_local_correlate_held` |
| `20260705184946` | none | `unresolved_no_local_correlate_held` |
| `20260705190138` | none | `unresolved_no_local_correlate_held` |
| `20260705190228` | none | `unresolved_no_local_correlate_held` |
| `20260706061910` | none | `unresolved_no_local_correlate_held` |
| `20260709190108` | `20260709190000_record_undrifted_issue001_buffer_manifest_export_standing_v1.sql` (108s apart, same day, same feature family, matches the `b8a0a38` rename-drift pattern exactly) | `candidate_rename_drift_unconfirmed_held` |

**Note on the 07-02 window specifically:** the single commit touching that date (`3f9763c`) explicitly lists
"Migrations applied: 202607010007 ... 202607020001" — using this repo's *older* sequential-suffix naming
convention (`YYYYMMDDNNNN`), not the `YYYYMMDDHHMMSS` convention the 13 drifted 07-02 versions use. The
committed local work from that day used a different naming scheme entirely than the ledger's orphaned
versions, which weakens (does not rule out, but weakens) the hypothesis that these 13 are simple renames of
committed work — they more likely originate from an execution path that was never captured as a local file at
all, consistent with the same out-of-band direct-execution pattern already confirmed today for
`public.c3_role_contract`/`public.c3_evidence_contract` (see
`docs/oar/c3_field/oar1_addendum_establish_capacity_aware_executor_routing_for_new_moon_to_lions_gate_v1.meta.md`).

## Limitation (Disclosed, Not Worked Around)

This investigation could not query `supabase_migrations.schema_migrations` (the table where Supabase records
the exact applied SQL text per version) or any other live schema surface. This session's Supabase MCP
connection is unauthorized, and the Supabase CLI has no subcommand for arbitrary read queries against the
linked remote project outside the tracked migration workflow. See
[[project_supabase_migration_ledger_drift]]. This is a narrow, targeted, non-bulk read (the tool's own
migration bookkeeping, not business or customer data) and is the single highest-value next step — it would let
a session with query access recover the exact original SQL for all 18 versions and settle every disposition
above with certainty, without requiring `migration repair` first.

## Recommended Non-Destructive Reconciliation Path

1. From a session with authorized Supabase access (MCP token or direct `psql`), run a read-only query against
   `supabase_migrations.schema_migrations` filtered to these 18 versions to recover the exact applied
   statement text for each.
2. Diff each recovered statement against the current live schema and against the nearest same-day local
   migration file (especially `20260709190108` vs. `20260709190000`) to determine, per version, whether it is
   (a) a pure rename/duplicate of committed work, (b) schema-equivalent to later committed work under a
   different key, or (c) genuinely uncaptured.
3. Only for versions confirmed as (a) or (b): use `supabase migration repair --status applied <version>`
   (never `--status reverted`, which would misrepresent that the change never happened) to align the ledger,
   and commit a matching local migration file if none exists, so the content is finally captured in git.
4. For any version confirmed as (c): write a proper migration file capturing the actual current effect,
   reviewed before commit, then repair the ledger to point at it.
5. Do not run any `migration repair` for a version whose statement text has not been recovered and reviewed.

## Registered Holds

- All 18 versions remain `held` per the ledger entry — none repaired, none pushed.
- No `supabase migration repair` was run.
- No `supabase db push` was attempted.
- No placeholder or reconstructed migration content was written to represent any of the 18 versions.
- The capacity-aware executor routing migration
  (`supabase/migrations/20260714214628_establish_capacity_aware_executor_routing_for_new_moon_to_lions_gate_v1.sql`)
  remains unapplied, blocked on this same drift, per its own OAR1.

## Mutation Count

Zero. This is a read-only repository investigation. No file under `supabase/migrations/` was renamed,
created against the drift, or altered. Two new files were created (this OAR1, and the ledger entry filing) and
the ledger registry index was updated — no `src` or database mutation.

## Repository Diff

Created by this run:

- `docs/_source/codex/ledger/c3_ledger_0004_the_system_refused_to_just_make_it_work.meta.md`
- `docs/oar/c3_field/oar1_investigate_migration_ledger_provenance_drift_v1.meta.md` (this file)

Modified by this run:

- `docs/_source/codex/ledger/c3_ledger_registry.meta.md` (index row added for `c3_ledger_0004`)

## Next Recommended Step

Not a new OAR2 — this returns to op044/Chazz per the ledger entry's own routing: authorize a query-capable
session to recover the `schema_migrations` statement text for these 18 versions (step 1 of the reconciliation
path above), or make an explicit, reviewed decision to accept the drift as permanently unresolved and leave the
18 versions held indefinitely.

## Final Standing

`completed_with_registered_holds`

The investigation ran its full bounded scope. Provenance for one version has a plausible lead; seventeen
remain genuinely unexplained from repository evidence alone. Nothing was mutated. Nothing was repaired.

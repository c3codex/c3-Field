---
document_type: oar2
authority_level: execution_authority
document_scope: migration_provenance_investigation
title: OAR2 — Investigate and Reconcile Missing Remote Migration Provenance
status: approved
version: v1
operator: op044
system: c3_field
initiative_key: new_moon_to_lions_gate_2026
primary_executor: cody
mutation_authorized: false
claude_standing: held_pending_database_access_and_provenance
chazz_standing: systems_review
date: 2026-07-14
native_stack:
  codex: database
  field: schema
  measures: registry
  chazz: systems
tags:
  - oar2
  - migration-ledger
  - provenance
  - reconciliation
  - read-only
  - cody
  - supabase
  - drift
  - field-finding
source_alignment:
  - OAR2 Addendum — Establish Capacity-Aware Executor Routing
  - OAR1 Addendum — Establish Capacity-Aware Executor Routing
  - OAR Lifecycle — Execution and Handoff
  - Doc-Set Closeout Rule
---

# OAR2 — Investigate and Reconcile Missing Remote Migration Provenance

## OBJECTIVE

Determine the exact provenance, content, execution route, and repository standing of 18 migration versions recorded in the live Supabase migration ledger but absent from the current repository migration directory.

This is a read-only provenance investigation.

This OAR2 does not authorize:

- migration repair;
- ledger mutation;
- schema mutation;
- migration reconstruction;
- placeholder migration files;
- database push;
- direct SQL execution;
- routing-addendum application;
- Inanna register_SEAT implementation.

## OBSERVED

The linked production Supabase project is:

    zfihrspxvennjzazxcbj

A Supabase CLI dry run reported remote migration versions that do not have matching files under:

    supabase/migrations/

The exact remote-only versions are:

1. `20260702125802`
2. `20260702130018`
3. `20260702143712`
4. `20260702151435`
5. `20260702153744`
6. `20260702154341`
7. `20260702164214`
8. `20260702174145`
9. `20260702174248`
10. `20260702174411`
11. `20260702203335`
12. `20260702204120`
13. `20260702205631`
14. `20260705184946`
15. `20260705190138`
16. `20260705190228`
17. `20260706061910`
18. `20260709190108`

The prior OAR1 incorrectly described this set as 17 versions.

The correct count is 18.

Initial Chazz repository inspection confirmed:

- no current migration filename contains any of the 18 versions;
- no current tracked file content references any of the 18 versions;
- the versions are absent from the current repository tree;
- the live database remains operational;
- no evidence yet proves whether these were deleted files, directly executed migrations, renamed migrations, Supabase-generated migrations, branch-only files, or ledger-only records.

## ROOT QUESTION

For each remote-only migration version:

1. What SQL was executed?
2. When was it executed?
3. Who or what executed it?
4. Which OAR2 authorized it?
5. Which OAR1 reported it?
6. Which repository commit corresponds to it?
7. Does an equivalent SQL artifact exist under another filename?
8. What live schema or data effect did it produce?
9. Is the effect still present?
10. What is the safe reconciliation disposition?

## ALIGNED

The live database is current operational truth.

The repository migration chain is implementation history.

Neither surface may silently replace the other.

Migration history may be reconciled only from evidence.

A matching timestamp without matching SQL is not proof.

A matching schema effect without execution provenance is not proof of exact migration content.

A placeholder file is not recovered history.

`supabase migration repair` is not provenance recovery.

## EXECUTOR ROUTING

### Cody — Primary Investigation Executor

Cody is assigned because this work is:

- bounded;
- read-only;
- repository-focused;
- evidence-focused;
- independently closable;
- non-mutating;
- preparatory to Claude’s heavier execution route.

Cody may inspect and report.

Cody may not mutate the database or migration ledger.

### Claude — Held Primary Mutation Executor

Claude remains the intended primary executor for later reconciliation and Inanna critical-path work.

Claude must not:

- apply the drafted routing migration;
- perform ledger repair;
- reconstruct migration files;
- push migrations;
- begin Inanna discovery mutation.

Claude may provide existing session evidence or advisement if available.

### Chazz — Systems Review

Chazz reviews:

- provenance sufficiency;
- authority alignment;
- classification;
- reconstruction safety;
- proposed reconciliation route.

### op044 — Authority

op044 decides:

- whether evidence is sufficient;
- whether a migration may be reconstructed;
- whether ledger repair is permitted;
- whether a remote version is accepted as irrecoverable historical standing;
- when Claude may resume mutation.

## INVESTIGATION ROUTE

### 1. Capture live ledger rows

Using a read-only authorized connection, inspect the live Supabase migration ledger.

For each of the 18 versions, return every available field, including where present:

- version;
- name;
- statements;
- inserted or execution timestamp;
- checksum;
- execution metadata.

Do not expose credentials.

Do not modify the ledger.

If the ledger retains complete SQL statements, preserve an exact evidence copy before performing interpretation.

### 2. Inspect all repository history

Search:

- current branch;
- all local branches;
- all remote-tracking branches;
- all tags;
- complete git history;
- deleted files;
- renamed files;
- dangling commits where safely inspectable;
- OAR directories;
- SQL directories;
- migration directories;
- execution scripts;
- evidence JSON;
- validation reports;
- commit messages.

Use:

- exact version;
- ledger migration name;
- distinctive table names;
- distinctive SQL statements;
- execution timestamp;
- nearby commit timestamps;
- OAR identity;
- affected database objects.

Do not limit the search to the current tree.

### 3. Inspect GitHub repository history

Inspect the authoritative remote repository for:

- deleted migration files;
- commits not present in the current checkout;
- merged or abandoned branches;
- pull requests;
- migration renames;
- timestamp corrections;
- commits created during the execution window.

Do not mutate GitHub.

### 4. Correlate OAR evidence

Inspect OAR2 and OAR1 artifacts created or executed around:

- July 2, 2026;
- July 5, 2026;
- July 6, 2026;
- July 9, 2026.

For each candidate OAR, record:

- OAR2 path;
- OAR1 path;
- executor;
- stated mutation route;
- stated migration path;
- database objects affected;
- exact SQL artifact;
- validation results;
- commit SHA;
- whether the evidence claims direct execution or migration push.

### 5. Inspect direct-execution tooling

Search for evidence of:

- `execute_sql`;
- Supabase MCP SQL execution;
- `psql`;
- direct `DATABASE_URL` execution;
- Supabase dashboard SQL editor;
- custom `.cjs` execution scripts;
- `supabase db push`;
- migration timestamp renaming;
- migration repair;
- branch database operations.

Record the execution mechanism for each version when provable.

### 6. Compare live effects

For each migration, identify the database objects it appears to affect.

Perform read-only inspection of:

- tables;
- columns;
- constraints;
- policies;
- functions;
- views;
- triggers;
- indexes;
- registered rows;
- migration comments or metadata;
- OAR source references.

Determine whether the expected effect remains present.

Do not infer exact SQL solely from current schema state.

### 7. Build the provenance matrix

Produce one row per remote version with:

- remote version;
- remote name;
- remote SQL available;
- probable execution date;
- probable executor;
- execution route;
- matching OAR2;
- matching OAR1;
- matching SQL artifact;
- matching commit;
- affected objects;
- live effect present;
- confidence;
- recommended disposition;
- unresolved questions.

Allowed confidence values:

- exact
- strong
- partial
- unresolved

Allowed disposition values:

- recover_exact_local_migration
- restore_deleted_tracked_file
- map_to_renamed_equivalent
- accept_direct_execution_with_full_evidence
- superseded_duplicate
- requires_schema_snapshot_reconciliation
- unresolved_hold

### 8. Determine the origin pattern

Classify the overall cause as one or more of:

- direct production execution outside migration workflow;
- locally generated migrations not committed;
- committed migrations later deleted;
- migration timestamps renamed after remote application;
- work executed from another branch or checkout;
- Supabase branch migration leakage;
- migration-ledger repair side effect;
- duplicate execution under different timestamps;
- unknown.

Do not select a cause without evidence.

### 9. Recommend reconciliation

Return a migration-by-migration recovery plan.

The plan must distinguish:

- restoring historical files;
- reconstructing exact files from ledger SQL;
- mapping renamed equivalents;
- recording evidenced direct execution;
- creating a schema baseline;
- holding unresolved versions;
- repairing ledger standing.

Do not execute the plan under this OAR2.

## PROHIBITIONS

Do not:

- run `supabase migration repair`;
- run `supabase db push`;
- run `supabase db reset`;
- run schema mutation SQL;
- create reconstructed migration files;
- create empty placeholder migrations;
- mark versions applied or reverted;
- modify the routing migration;
- alter the `actor` constraint;
- change role authority;
- delete or rename migrations;
- begin Inanna implementation;
- use current schema alone to fabricate historical SQL;
- report a version as recovered without exact evidence.

## REQUIRED ARTIFACTS

Create:

1. `docs/oar/c3_field/missing_remote_migration_provenance_matrix_v1.meta.md`
2. `docs/oar/c3_field/missing_remote_migration_reconciliation_recommendation_v1.meta.md`
3. `docs/oar/c3_field/oar1_investigate_and_reconcile_missing_remote_migration_provenance_v1.meta.md`

Optional supporting evidence may include:

- exact read-only ledger export;
- commit correlation table;
- OAR correlation table;
- affected-object inventory.

Do not store credentials or connection strings.

## VALIDATION

This investigation resolves successfully when:

- all 18 versions are represented;
- the prior 17-version miscount is corrected;
- live ledger fields are captured;
- current and historical repository searches are completed;
- GitHub history is inspected;
- OAR evidence is correlated;
- execution routes are classified;
- live effects are inspected read-only;
- each version receives a confidence value;
- each version receives a recommended disposition;
- no database or ledger mutation occurs;
- unresolved versions remain honestly held;
- the next reconciliation route is explicit.

## EXPECTED OAR1

Path:

docs/oar/c3_field/oar1_investigate_and_reconcile_missing_remote_migration_provenance_v1.meta.md

Final standing must be one of:

- completed_exact_provenance
- completed_with_unresolved_versions
- blocked_by_ledger_access
- blocked_by_missing_evidence

OAR1 must report:

- mutation count: zero;
- all artifacts created;
- exact version count;
- provenance summary;
- unresolved versions;
- recommended next executor;
- whether Claude may safely resume;
- repository diff.

## CLOSE

Do not repair the appearance of history.

Recover the evidence of what happened.

The database has receipts.

The task is to find what they purchased.

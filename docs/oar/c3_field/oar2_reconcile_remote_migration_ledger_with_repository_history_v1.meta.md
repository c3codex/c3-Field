---
document_type: oar2
authority_level: execution_authority
document_scope: remote_migration_repository_reconciliation
title: OAR2 - Reconcile Remote Migration Ledger With Repository History
status: authorized
version: v1
operator: op044
system: c3_field
initiative_key: new_moon_to_lions_gate_2026
primary_executor: claude
mutation_surface: repository_only
database_mutation_authorized: false
migration_ledger_mutation_authorized: false
inanna_mutation_authorized: false
---

# OAR2 - Reconcile Remote Migration Ledger With Repository History

## 1. Authority

op044 authorizes Claude to reconcile the eighteen remote-only Supabase migration versions with the governed repository migration history.

Claude is the sole mutation executor under this OAR2.

This authority is limited to repository-side historical recovery, provenance documentation, validation, and OAR1 evidence production.

This OAR2 does not authorize database mutation, migration-ledger repair, schema changes, deployment, or Inanna `register_SEAT` implementation.

## 2. Purpose

Restore a truthful, reproducible relationship between:

- the live `supabase_migrations.schema_migrations` ledger;
- the repository migration directory;
- preserved OAR evidence;
- known execution routes; and
- future Supabase CLI validation.

The objective is not to rewrite history. The objective is to represent the history that actually occurred.

## 3. Governing Evidence

Claude shall use:

- `missing_remote_migration_ledger_export_v1.json`
- `missing_remote_migration_ledger_summary_v1.json`
- `missing_remote_migration_content_match_v1.json`
- `missing_remote_migration_provenance_matrix_v1.meta.md`
- `missing_remote_migration_reconciliation_recommendation_v1.meta.md`
- `oar1_investigate_and_reconcile_missing_remote_migration_provenance_v1.meta.md`

The live migration ledger is execution evidence.

The repository is the governed reproducibility surface.

Neither surface may silently replace or falsify the other.

## 4. Target Versions

The reconciliation covers exactly these eighteen versions:

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

No additional migration version enters scope without a new operator decision.

## 5. Stage A — Cross-Environment Timestamp Review

Before renaming, moving, deleting, or replacing an existing migration file, Claude shall determine whether any other governed database ledger records either of these local versions:

- `202607010007`
- `20260709190000`

The related remote equivalents are:

- `20260702125802` ↔ `202607010007_make_undrifted_launch_edition_publication_cover.sql`
- `20260709190108` ↔ `20260709190000_record_undrifted_issue001_buffer_manifest_export_standing_v1.sql`

Claude shall inspect only environments already available within existing authority.

If another governed ledger cannot be inspected, Claude shall record the limitation and hold both rename decisions.

Absence of access is not evidence that another ledger does not contain the local timestamp.

### Stage A decision rule

If no governed environment records the original local timestamp, Claude may perform a history-preserving rename to the matching remote version.

If another governed environment records the original timestamp, Claude shall not rename or duplicate the file without returning a compatibility recommendation to op044.

A prose equivalence declaration alone is not sufficient if Supabase CLI cannot recognize it.

## 6. Stage B — Divergence Review

Claude shall compare exact ledger SQL, current repository state, dependent later migrations, and live read-only schema effects for:

- `20260702130018`
- `20260702164214`

### `20260702130018`

Determine whether the remote ledger SQL:

- supersedes the current same-name local file;
- represents a distinct historical migration;
- overlaps with later migrations; or
- requires a compatibility-preserving paired representation.

The same name with different SQL must not be treated as an exact equivalent.

### `20260702164214`

Determine whether the threshold plaque context lines:

- remain live;
- were intentionally moved;
- were superseded;
- were later removed; or
- expose schema drift requiring a separate corrective initiative.

Historical recovery may represent an effect later superseded. It must not be rewritten to resemble current state.

### Stage B decision rule

If an exact historical representation can be created without guessing, Claude may recover it from the ledger.

If interpretation or reconstruction is required, Claude shall hold that version and return it to op044.

## 7. Stage C — Exact Ledger-Backed Historical Recovery

Subject to Stages A and B, Claude may create timestamp-matching historical migration files for versions whose exact SQL is retained in the live ledger.

The thirteen direct recovery candidates are:

- `20260702143712`
- `20260702151435`
- `20260702153744`
- `20260702154341`
- `20260702174145`
- `20260702174248`
- `20260702174411`
- `20260702203335`
- `20260702204120`
- `20260702205631`
- `20260705184946`
- `20260705190138`
- `20260705190228`

The fully evidenced direct execution also requires local-chain representation:

- `20260706061910`

An evidenced direct execution route does not remove the need for a timestamp-matching repository representation when normal migration tooling depends upon it.

## 8. Recovery Fidelity Rules

For each recovered migration:

1. The executable SQL shall be sourced from the exact ledger `statements` value.
2. SQL shall not be reconstructed from the present schema.
3. SQL shall not be modernized, corrected, reformatted, or combined.
4. Later supersession does not justify altering historical SQL.
5. Placeholder or empty migrations are prohibited.
6. A recovered file shall not be described as an original repository artifact.
7. The recovered executable SQL shall remain separate from provenance commentary.

Claude shall create a sidecar recovery manifest containing:

- remote version;
- remote migration name;
- recovery source;
- recovery date;
- original `created_by`;
- known execution route;
- OAR correlation;
- SQL content hash;
- content fidelity;
- provenance fidelity;
- affected objects;
- later supersession or correction relationships;
- unresolved questions, if any.

Required sidecar path:

`docs/oar/c3_field/recovered_remote_migration_manifest_v1.meta.md`

## 9. File Naming

Where the remote migration name is known, use:

`supabase/migrations/<remote_version>_<remote_name>.sql`

The timestamp and name must match the remote ledger record unless an exact filesystem constraint prevents it.

No unrelated migration files may be edited.

No existing migration file may be deleted merely to make CLI output appear clean.

## 10. Validation

After repository recovery is complete, Claude shall run read-only/local validation appropriate to the repository.

Claude may then run:

`supabase db push --dry-run`

This command is authorized solely as validation.

Claude shall capture the complete result.

### Successful reconciliation requires

- the eighteen remote-only versions are no longer reported as missing locally;
- no unintended migration is proposed for remote application;
- no destructive schema operation is proposed;
- no migration-ledger repair is requested;
- the dry run exits without migration-history refusal; and
- repository status contains only authorized reconciliation artifacts.

A clean dry run does not authorize an actual push.

## 11. Mandatory Stop Conditions

Claude shall stop before further mutation if:

- ledger SQL cannot be exported exactly;
- a recovered file would require guessed SQL;
- another governed environment contains a conflicting timestamp;
- the same-name/different-content migration cannot be represented safely;
- the dry run proposes schema mutation;
- the dry run proposes replaying an equivalent migration;
- a recovered migration fails local parsing or ordered-history validation;
- the eighteen-version target changes; or
- reconciliation would require `migration repair`.

A stop condition returns as evidence. It is not executor failure.

## 12. Explicit Prohibitions

Claude shall not:

- run `supabase migration repair`;
- run an actual `supabase db push`;
- mutate `supabase_migrations.schema_migrations`;
- apply SQL to a live database;
- create placeholder migrations;
- fabricate original provenance;
- rewrite recovered SQL to match current schema;
- fold an Inanna change into a recovered migration;
- perform Inanna `register_SEAT` mutation;
- modify application/runtime source;
- resolve unrelated Gate 4 or Gate 6 debt; or
- treat operational application behavior as migration integrity evidence.

## 13. Required Outputs

Claude shall produce:

1. `docs/oar/c3_field/recovered_remote_migration_manifest_v1.meta.md`
2. `docs/oar/c3_field/remote_migration_cross_environment_timestamp_review_v1.meta.md`
3. `docs/oar/c3_field/remote_migration_divergence_review_v1.meta.md`
4. `docs/oar/c3_field/remote_migration_reconciliation_validation_v1.meta.md`
5. `docs/oar/c3_field/oar1_reconcile_remote_migration_ledger_with_repository_history_v1.meta.md`
6. authorized recovered migration files
7. the complete `supabase db push --dry-run` result or precise evidence explaining why validation remained held

## 14. OAR1 Classification

Use one of these final standings:

- `completed_verified`
- `completed_with_held_versions`
- `blocked_before_recovery`
- `blocked_during_validation`

Do not use `completed_verified` unless every one of the eighteen versions has a truthful repository disposition and the dry run confirms no unintended remote schema mutation.

The OAR1 shall report:

- versions recovered;
- versions renamed;
- versions held;
- versions receiving compatibility treatment;
- files created, moved, or edited;
- hashes of recovered SQL;
- validation commands and outputs;
- cross-environment limitations;
- database mutation count;
- migration-ledger mutation count; and
- whether Claude’s migration hold may safely be lifted.

## 15. Executor Standing

Claude is authorized to execute this repository reconciliation.

Claude remains held from:

- live database mutation;
- migration-ledger mutation;
- actual migration push; and
- Inanna `register_SEAT` mutation.

A separate operator decision is required to lift those holds.

## 16. Closing Principle

The database has receipts.

This OAR restores those receipts to governed history without pretending they were filed correctly the first time.

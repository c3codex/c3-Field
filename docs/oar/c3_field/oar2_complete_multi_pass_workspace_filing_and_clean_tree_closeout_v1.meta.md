---
document_type: oar2
authority_level: execution_authority
document_scope: workspace_filing_and_clean_tree_closeout
title: OAR2 - Complete Multi-Pass Workspace Filing and Clean-Tree Closeout
status: authorized
version: v1
operator: op044
system: c3_field
executor: cody
repository: c3codex/c3-Field
authorized_branch: measures
authorized_remote: origin
database_mutation_authorized: false
migration_execution_authorized: false
runtime_mutation_authorized: false
destructive_git_history_authorized: false
---

# OAR2 - Complete Multi-Pass Workspace Filing and Clean-Tree Closeout

## 1. Authority

op044 authorizes Cody to perform a multi-pass filing and workspace closeout on the `measures` branch of `c3codex/c3-Field`.

The objective is to give every remaining modified or untracked item a truthful disposition and return the workspace to a clean Git standing without losing completed work.

This is a repository and local-workspace closeout.

It does not authorize database mutation, migration execution, runtime development, release activation, or Inanna `register_SEAT` implementation.

## 2. Starting Standing

Expected branch standing:

- branch: `measures`
- remote: `origin`
- local and remote branch currently synchronized
- reviewed reconciliation commits already present on `origin/measures`
- database mutation count from prior closeout: zero
- migration execution count from prior closeout: zero

Expected modified tracked files:

- `.gitignore`
- `Assets/Registry/asset_registry.md`
- `supabase/.temp/cli-latest`

Expected untracked groups include:

- local agent and skill tooling
- browser observation artifacts
- Launch Cycle 001 assets
- publication OAR1 and OAR2 files
- research OAR files
- Codex source records
- Measures Registry source records
- working and recovery archives
- Measures of Inanna OAR files
- Measures Registry OAR files
- publication scripts
- publication migrations
- Supabase temporary linkage files
- root-level OAR files
- `corpus.includes(m))`

## 3. Mandatory Preflight

Before changing any file, Cody shall run:

- `git fetch origin`
- `git branch --show-current`
- `git status --short --branch`
- `git rev-parse HEAD`
- `git rev-parse origin/measures`
- `git merge-base --is-ancestor origin/measures HEAD`
- `git diff -- .gitignore`
- `git diff -- Assets/Registry/asset_registry.md`
- `git diff -- supabase/.temp/cli-latest`

The active branch must be `measures`.

Local HEAD and `origin/measures` must match before filing begins.

If the remote has advanced or local and remote diverge, stop and return evidence.

Do not pull, merge, rebase, reset, or force-push.

## 4. Global Safety Rules

Cody shall not use:

- `git add .`
- `git add -A`
- `git add --all`
- `git clean`
- `git reset`
- `git restore .`
- `git checkout -- .`
- force push
- bulk deletion
- wildcard staging across unrelated groups

Stage files by exact path or a reviewed, bounded directory only.

Before every commit, run:

- `git diff --cached --name-status`
- `git diff --cached --stat`

If a staged file does not belong to the intended commit, unstage it without discarding its working-tree content.

## 5. Pass One - Complete Inventory

Create:

`docs/oar/c3_field/workspace_filing_inventory_20260715_v1.meta.md`

The inventory shall record for every modified or untracked path:

- path;
- file type;
- size;
- content hash;
- last-modified time where available;
- likely initiative;
- likely producing executor;
- duplicate status;
- secret-scan standing;
- recommended governed destination;
- recommended disposition;
- confidence level; and
- unresolved ownership question.

Group directories may be summarized only after every contained file has been enumerated in a supporting machine-readable listing.

Create the supporting listing at:

`docs/oar/c3_field/workspace_filing_inventory_20260715_v1.json`

## 6. Secret and Size Review

Before committing any untracked artifact, inspect it for:

- Supabase service-role keys;
- database passwords;
- authenticated database URLs;
- Stripe secret keys;
- GitHub tokens;
- Slack tokens;
- AWS access keys;
- private-key blocks;
- OAuth client secrets;
- access tokens;
- session cookies;
- `.env` content; and
- other live credentials.

Do not print secret values into the OAR1.

If a likely secret is found:

- do not stage the file;
- record only the path and secret category;
- leave the file held; and
- return the decision to op044.

Before staging assets, report any individual file larger than 50 MB.

Do not stage any file at or above 95 MB without a separate operator decision.

Do not introduce Git LFS under this OAR2.

## 7. Pass Two - Launch Cycle 001 Filing

Review and file completed Launch Cycle 001 work in coherent commits.

Eligible surfaces include:

- `OAR/OAR1/publication/**`
- `OAR/OAR2/publication/**`
- `OAR/OAR1/research/**`
- `docs/_source/codex/publications/**`
- publication-related `docs/_source/codex/initiatives/**`
- `docs/_source/measures_registry/field_participation_endpoints_registry_v1.meta.md`
- `Assets/Banners/unDrifted/LaunchCycle001/**`
- `Assets/Video/unDrifted/LaunchCycle001/**`
- `scripts/buffer-native-publication-execution.cjs`
- `scripts/direct-youtube-canonical-activation.cjs`
- `scripts/launch-cycle-publication-ops-dashboard.cjs`
- publication-related migrations dated from `20260709220610` through `20260713224453`
- completed Launch Cycle additions to `Assets/Registry/asset_registry.md`

Recommended ordered commits:

1. `File Launch Cycle 001 publication governance evidence`
2. `File Launch Cycle 001 publication operations and migrations`
3. `File Launch Cycle 001 registered publication assets`

Cody may adjust the number of commits if file relationships require it, but may not combine unrelated initiatives merely for convenience.

No migration may be executed.

No publication may be activated.

No external platform action is authorized.

## 8. Publication Migration Rule

The following untracked migrations may be committed as repository artifacts after review:

- `20260709220610_record_issue001_buffer_publication_results_v1.sql`
- `20260713071000_record_buffer_native_publication_execution_v1.sql`
- `20260713072000_record_buffer_native_publication_retry_evidence_v1.sql`
- `20260713073420_record_launch_cycle_001_publication_operations_dashboard_v1.sql`
- `20260713075607_record_direct_youtube_canonical_activation_authority_v1.sql`
- `20260713224453_register_launch_cycle_001_uploaded_publication_assets_v1.sql`

For each migration, record:

- associated OAR2;
- associated OAR1;
- whether its live effects are already present;
- whether it remains genuinely pending;
- whether it is idempotent;
- whether it is superseded; and
- whether future application remains held.

Committing a migration file does not authorize applying it.

## 9. Pass Three - Measures Registry Filing

Review and file completed Measures Registry evidence under:

- `docs/oar/measures_registry/**`
- `docs/_source/measures_registry/**`
- related governed source records;
- related OAR pairs; and
- related non-runtime evidence.

Use a separate commit or ordered commit series.

Recommended commit message:

`File completed Measures Registry governance evidence`

Do not include:

- unfinished implementation;
- unverified database claims;
- secrets;
- duplicate root-level copies;
- generated archives; or
- unrelated publication assets.

## 10. Pass Four - Measures of Inanna Filing

Review:

- `docs/oar/measures_of_inanna/**`
- `supabase/migrations/20260714190132_restore_inanna_foundational_public_encounter_standing_v1.sql`
- associated OAR2 and OAR1 evidence.

The foundational restoration migration may be committed as repository evidence if:

- its OAR pair is present;
- the SQL matches the documented restoration;
- no secret is present;
- its live application standing is honestly recorded; and
- its browser verification attribution remains precise.

Recommended commit message:

`File Inanna foundational encounter restoration evidence`

Do not begin broader Inanna `register_SEAT` work.

Do not alter release states.

Do not execute the migration.

## 11. Pass Five - Codex Ledger and Initiative Filing

Review:

- `docs/_source/codex/ledger/c3_ledger_0001_knowledge_becomes_operational_through_governed_relation.meta.md`
- `docs/_source/codex/ledger/c3_ledger_0002_labor_as_contribution_to_shared_living_environments.meta.md`
- `docs/_source/codex/ledger/c3_ledger_0003_governance_enables_regeneration.meta.md`
- `docs/_source/codex/initiatives/**`
- `OAR/OAR1/codex/**`
- `OAR/OAR2/codex/**`
- `OAR/OAR2/c3_field/**`

File only completed, internally consistent records.

Verify that ledger registry indexes and references resolve.

Use separate commits where Codex ledger standing and initiative execution evidence represent different closures.

Do not rewrite seated authority language during filing.

## 12. Pass Six - Root-Level OAR Reconciliation

Inventory every root-level `oar1_*` and `oar2_*` file.

For each root-level file:

1. calculate its content hash;
2. search the governed `OAR/` and `docs/oar/` surfaces for an exact duplicate;
3. compare document type, scope, title, version, and source OAR references;
4. determine whether it is unique, duplicate, superseded, or incomplete.

Disposition rules:

- exact duplicate: preserve the governed copy and move the root copy to the external workspace archive;
- unique completed artifact: move with history-preserving filesystem semantics to the correct governed directory, then stage it by exact path;
- incomplete or uncertain artifact: move to the external workspace archive and record the hold;
- conflicting artifact: do not choose silently; record both and hold for op044.

Do not delete unique content.

Do not overwrite an existing governed file.

## 13. Pass Seven - Recovery Archive Preservation

The following are not governed repository source:

- `docs/_source/working.zip`
- `docs/_source/working/**`
- `intel_recovery.zip`
- `intel_recovery (2).zip`
- `session_14_closeout.zip`
- extracted `session_14_closeout/**`

Create an external sibling archive directory:

`..\c3Field_workspace_archive_20260715\`

Before moving any archive:

- record its original path;
- calculate its hash;
- record its size;
- confirm the destination does not already contain a conflicting file.

Move these recovery artifacts outside the Git working tree without modifying their content.

Create a repository-side inventory receipt:

`docs/oar/c3_field/workspace_external_archive_receipt_20260715_v1.meta.md`

The receipt shall contain hashes and old/new paths but shall not embed archive contents.

If the external destination cannot be created safely, leave the artifacts held and report the blocker.

## 14. Pass Eight - Generated and Local Tooling Files

Inspect:

- `supabase/.temp/cli-latest`
- `supabase/.temp/linked-project.json`
- `.playwright-mcp/**`
- `.agents/**`
- `.claude/skills/**`
- `skills-lock.json`
- the existing `.gitignore` modification

Disposition rules:

### Supabase temporary files

If `supabase/.temp/cli-latest` differs only because of the installed CLI version, restore that single tracked file to repository HEAD.

Do not restore any other file through the same command.

Ensure local Supabase linkage files are ignored without exposing project secrets.

### Playwright artifacts

If `.playwright-mcp/**` contains only generated logs, screenshots, snapshots, and local browser state, exclude it through the governed `.gitignore`.

Do not commit authenticated browser state.

### Agent and skill tooling

Determine whether `.agents/**`, `.claude/skills/**`, and `skills-lock.json` are:

- intentional shared repository tooling; or
- locally installed/generated executor tooling.

If intentional shared tooling, file it in a dedicated tooling commit after secret review.

If local/generated or ownership is uncertain, do not commit it. Exclude it locally or through `.gitignore` only when doing so will not hide required shared project configuration.

Record the decision explicitly.

### `.gitignore`

Reconcile the pre-existing `.gitignore` change with the exclusions established by this pass.

Do not use `.gitignore` to conceal unresolved project work.

Recommended commit message, if a repository ignore update is required:

`Normalize local tooling and generated workspace exclusions`

## 15. Pass Nine - Probable Debris

Inspect the literal path:

`corpus.includes(m))`

Record:

- file type;
- size;
- hash;
- content;
- creation or modification time where available; and
- whether any repository file references it.

If it is confirmed to be accidental shell or paste debris with no unique project content, move it to:

`..\c3Field_workspace_archive_20260715\probable_debris\`

Do not permanently delete it under this OAR2.

Record its disposition in the external archive receipt.

## 16. Final Validation

After all authorized filing and archive moves:

1. run a secret scan across every staged set;
2. review every commit independently;
3. run repository-appropriate non-mutating validation;
4. run `git fetch origin`;
5. confirm `origin/measures` remains an ancestor of local HEAD;
6. inspect `git log --oneline origin/measures..HEAD`;
7. run `git status --short --branch`.

If the commit chain is a fast-forward continuation and contains only reviewed filing work, Cody may run:

`git push origin measures`

Force push is prohibited.

If the remote advanced, stop.

Do not pull, merge, rebase, or retry around divergence.

## 17. Clean-Tree Standard

The preferred completion state is:

`git status --short --branch`

returning only:

`## measures...origin/measures`

A clean tree is not required at the expense of deleting, concealing, or misfiling uncertain work.

If any item remains held, the OAR1 shall identify its exact path, owner question, and reason.

## 18. Prohibitions

Cody shall not:

- mutate the database;
- execute any migration;
- run `supabase db push`;
- run `supabase migration repair`;
- modify runtime or application source;
- activate publication state;
- perform external Buffer or YouTube actions;
- begin Inanna `register_SEAT`;
- permanently delete uncertain files;
- overwrite governed artifacts;
- bulk-stage the repository;
- rewrite existing Git history;
- force-push;
- hide unresolved work through broad ignore patterns; or
- claim another executor's evidence as Cody's direct observation.

## 19. Required OAR1

Create:

`docs/oar/c3_field/oar1_complete_multi_pass_workspace_filing_and_clean_tree_closeout_v1.meta.md`

The OAR1 shall report:

- original local and remote HEAD;
- inventory artifact paths;
- total modified and untracked file counts;
- secret-scan results;
- oversized-file findings;
- every commit created;
- every file included in each commit;
- every archive move with hashes;
- every duplicate disposition;
- every held artifact;
- final local and remote HEAD;
- push output;
- final `git status`;
- database mutation count;
- migration execution count;
- runtime mutation count;
- permanent deletion count; and
- final standing.

Allowed final standings:

- `completed_verified_clean_tree`
- `completed_with_external_archive`
- `completed_with_registered_holds`
- `blocked_by_secret_scan`
- `blocked_by_remote_divergence`
- `blocked_by_artifact_conflict`
- `blocked_before_push`

## 20. Completion Rule

This OAR2 completes successfully when:

- completed work is committed under the correct initiative;
- generated files are excluded or restored truthfully;
- recovery archives are preserved outside the Git tree;
- probable debris is preserved outside the Git tree;
- no unique content is lost;
- no database or runtime mutation occurs;
- the resulting commits are fast-forwarded safely; and
- the final workspace state is clean or carries only explicit registered holds.

## 21. Closing Principle

A workspace is not cleaned by erasing its history.

It is cleaned by returning every piece of work to its proper authority surface.
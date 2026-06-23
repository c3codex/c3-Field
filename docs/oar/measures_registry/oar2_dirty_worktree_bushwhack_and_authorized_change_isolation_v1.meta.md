---
document_type: oar2
authority_level: working
document_scope: repo_hygiene
title: OAR2 — Dirty Worktree Bushwhack and Authorized Change Isolation
status: proposed
version: v1
operator: op044
system: measures_registry
---

# OAR2 — Dirty Worktree Bushwhack and Authorized Change Isolation v1

## OBJECTIVE

Stop forward feature work and classify the dirty worktree before any commit, push, deploy, or additional mutation.

No mixed worktree commit.

No cleanup by assumption.

No deploy from unknown state.

---

## OBSERVED

The worktree is dirty.

Current risk:

- authorized OAR changes may be mixed with unrelated changes
- generated build files may be mixed with source edits
- stale artifacts may be present
- unknown mutations may be carried forward accidentally

---

## ROUTED

### 1. Inspect

Run:

git status --short

Then inspect each changed file.

### 2. Classify Every File

Classify each changed file as one of:

- authorized_current_oar
- prior_oar_artifact
- generated_build_artifact
- unrelated_preexisting_mutation
- unknown_mutation
- safe_to_remove
- must_hold

### 3. Report Before Action

Return a table:

file_path
status
classification
recommended_action
reason

Do not mutate before reporting unless the file is obviously transient cache and safe to remove.

### 4. Isolate Authorized Changes

Authorized changes may include only files tied to the active OAR scope.

Current likely authorized scope:

- unDrifted Issue 001 polish OAR
- unDrifted cover composition OAR
- OAR1/OAR2 logs tied to those changes

Everything else must be held, stashed, or explicitly preserved.

### 5. Handle Generated Build Artifacts

Generated dist files may be committed only if deployment procedure requires committed dist-registry output.

If dist files are stale or from older builds, regenerate after source isolation.

### 6. Stash or Hold Unknowns

Unknown or unrelated mutations must not be included in the active commit.

Use one of:

- git stash push -- <paths>
- leave uncommitted with explicit operator warning
- restore only if confirmed safe

No destructive restore without operator confirmation.

### 7. Produce Clean Standing

After classification and isolation, return:

- clean commit candidate list
- held file list
- stashed file list if any
- files requiring operator decision
- whether commit is safe

---

## CODY ROLE

Cody may:

- inspect git status
- classify files
- identify authorized changes
- isolate changes
- stash unrelated changes if clearly safer than mixing
- regenerate build output after isolation if needed
- write OAR1

Cody may not:

- delete unknown work
- restore unknown files without confirmation
- commit mixed worktree
- deploy with dirty unknowns
- treat generated output as source authority
- continue feature work before worktree standing is clear

---

## VALIDATION

This OAR resolves when:

- every dirty file is classified
- authorized change set is isolated
- unknown/unrelated changes are held or stashed
- commit safety is explicitly stated
- no deploy proceeds from mixed state

## EXPECTED OAR1

docs/oar/measures_registry/oar1_dirty_worktree_bushwhack_and_authorized_change_isolation_v1.meta.md

## CLOSE

Bushwhack first.

Then commit.

Then deploy.

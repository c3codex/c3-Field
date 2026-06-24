---
document_type: oar2
authority_level: working
document_scope: exact_path_commit_deploy
title: OAR2 — Commit and Deploy Isolated unDrifted Polish Package
status: proposed
version: v1
operator: op044
system: measures_registry
surface: undrifted
---

# OAR2 — Commit and Deploy Isolated unDrifted Polish Package v1

## OBJECTIVE

Commit and deploy only the isolated unDrifted Issue 001 polish package.

Use the bushwhack exact-path manifest.

No broad cleanup.

No restore.

No stash.

No unrelated drift mutation.

---

## OBSERVED

The worktree contains held drift.

Bushwhack classified the tree and identified an exact safe commit candidate set.

Mixed worktree commit is not safe.

Exact-path commit is safe.

---

## ROUTED

### 1. Stage Exact Authorized Paths Only

Stage only the clean commit candidate paths from:

docs/oar/measures_registry/oar1_dirty_worktree_bushwhack_and_authorized_change_isolation_v1.meta.md

Do not stage:

- held prior OAR artifacts
- unrelated C1 mutations
- transient Supabase temp files
- unknown or unclassified files

### 2. Verify Staging

Run:

git diff --cached --name-status

Confirm staged paths match the bushwhack candidate list exactly.

If any unauthorized file is staged:

unstage it before commit.

### 3. Commit

Commit message:

Deploy unDrifted Issue 001 polish package

### 4. Push

Push branch:

measures

### 5. Deployment

Confirm Cloudflare Pages deployment trigger.

If unavailable, report operator verification required.

### 6. Production QA

Operator QA required for:

- article text in caption bands
- initial viewport safe area
- left-weighted cover story
- assessment uses Measures Registry logo
- Role Call copy renders
- Connect · Contribute · Create appears once as CTA button
- all links remain live

### 7. OAR1

Write:

docs/oar/measures_registry/oar1_commit_and_deploy_isolated_undrifted_polish_package_v1.meta.md

Must include:

- staged file list
- commit hash
- push result
- Cloudflare trigger standing
- production QA standing
- confirmation held drift was not staged

---

## CODY ROLE

Cody may:

- stage exact authorized paths
- verify staged set
- commit
- push
- report deployment standing
- write OAR1

Cody may not:

- clean broadly
- restore unrelated files
- stash unrelated files
- stage held drift
- mutate DB
- mutate media
- mutate routes
- change assessment/MAP/payment/SEAT

---

## VALIDATION

This OAR resolves when:

- exact-path polish package is committed
- branch is pushed
- held drift remains uncommitted
- deployment trigger standing is reported
- OAR1 is written

## CLOSE

Whack only the authorized drift.

Leave the held tree intact.

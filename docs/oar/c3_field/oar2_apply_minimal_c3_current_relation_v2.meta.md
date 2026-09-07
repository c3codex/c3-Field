---
document_type: oar2
title: Apply Exact Minimal c3 Current Governed Present-State Relation
status: confirmed_for_execution
version: v2
date: 2026-08-08
operator: op044
author: chazz
system: c3_field
initiative: c3_current
registrar: cline
execution_instance_id: register_minimal_c3_current_relation_cline_002
supersedes_execution_instance_id: register_minimal_c3_current_relation_cline_001
supersedes_oar2: oar2_register_minimal_c3_current_relation_v1.meta.md
source_ledger_entry: c3_ledger_0005_c3_current_as_governed_present_state.meta.md
return_destination: G:\My Drive\CanCom\review
---

# OAR2 — Apply Exact Minimal c3 Current Governed Present-State Relation

## 1. Purpose

Apply and verify the already-modeled minimal c3 Current backend relation.

This execution contains no architecture-discovery assignment. The model has been resolved before Registrar execution. Cline is acting only as environment Registrar for the exact migration and objective readback below.

The prior execution `register_minimal_c3_current_relation_cline_001` was stopped after repeated execution failures before a Current return package reached canonical `CanCom/review`. Its mutation standing is therefore unknown until the collision preflight below. Do not resume `_001` and do not infer that it made no database changes.

## 2. Exact Implementation Source

Repository: `c3codex/c3-Field`

Branch: `measures`

Exact migration:

`supabase/migrations/20260808111500_register_minimal_c3_current_relation_v1.sql`

Migration commit:

`3358de2c7afe7f547d978e871bd385cce825922b`

Migration Git blob SHA:

`d3022c9abb5a8aa2591414ad6b2061e12a7cc79f`

Do not alter, regenerate, reinterpret, or replace the migration. Compute its SHA-256 during preflight and return that value as execution evidence.

## 3. Resolved Model

The exact minimal Current implementation is:

### State authority

`public.c3_current_state`

Carries environment-bound Current state identity, explicit standing, version, formation authority, predecessor lineage, governed advance disposition, current/historical status, and Source provenance.

### Evidence relation

`public.c3_current_evidence_ref`

Carries hash-bound and custody-aware evidence references for a Current state. It does not copy the evidence content. `asset_key` is optional so evidence already or later registered in `public.c3ops_asset_record` can be related without duplicating the asset registry.

### Four minimum operations

1. `public.bind_c3_current(...)` — service-role-only initial Current binding to an already-governed `env_key`.
2. `public.attest_c3_current_evidence(...)` — service-role-only evidence-reference attachment; does not change Current standing.
3. `public.resolve_c3_current(text)` — safe read projection for c3Ops/FREE.
4. `public.advance_c3_current(...)` — service-role-only atomic successor operation requiring a governed disposition reference.

### Internal guards

- `public.c3_current_validate_lineage()`
- `public.c3_current_guard_state_update()`
- `trg_c3_current_validate_lineage`
- `trg_c3_current_guard_state_update`
- one-current-state-per-environment unique partial index

## 4. Source Relation

`Spark / Weave / Field / Form` is Source from the original Codexstone inscription.

For this implementation only, the four operations provide a concrete test of that Source relation:

- Spark / Bind
- Weave / Attest
- Field / Resolve
- Form / Advance

This mapping is an implementation observation. It does not canonize the provisional downstream 3×3 cells and does not replace Source terminology.

## 5. CCC Boundary

The original CCC purpose remains preserved: CCC is the Current of the Codex, issued by c3 Community Partners DAO, anchoring recognition, access, and circulation through Connect / Contribute / Create with regenerative return to community, DAO continuity, and the commons.

This execution registers only the minimum backend Current relation. It does not deploy, modify, call, mint, burn, bridge, or transact against any smart contract or token.

No CCC chain lookup is required in this execution.

## 6. No Initial Environment Binding

Do not bind Measures of Inanna or any other real environment under this execution.

Do not create or infer an `env_key`.

Current registration succeeds with zero rows in both Current tables. Real environment binding and Inanna MAP evidence attestation are separate downstream executions after the relation itself is verified.

## 7. Prior-Execution Collision Rule

Before applying the migration, inspect only these target objects:

- `public.c3_current_state`
- `public.c3_current_evidence_ref`
- `public.bind_c3_current`
- `public.attest_c3_current_evidence`
- `public.resolve_c3_current`
- `public.advance_c3_current`
- `public.c3_current_validate_lineage`
- `public.c3_current_guard_state_update`
- `trg_c3_current_validate_lineage`
- `trg_c3_current_guard_state_update`

### Collision outcomes

**A. None exist**

Proceed with the exact migration.

**B. All exist and objective definitions match this exact migration model**

Do not recreate or modify them. Treat the database registration as pre-existing from the stopped execution and perform the verification/readback only. Report `preexisting_exact_current_registration_verified`.

**C. Any subset exists, or any definition differs**

Return:

`held_prior_current_execution_partial_mutation`

List the exact existing/missing/mismatched objects and stop. Do not repair, drop, alter, recreate, or rerun the migration.

## 8. Exact Apply Rule

If collision outcome A applies, use the environment's established **single-migration** Supabase execution mechanism to apply only:

`20260808111500_register_minimal_c3_current_relation_v1.sql`

Do not use a broad migration push that may apply unrelated pending migrations.

Do not reconstruct SQL manually from this OAR2.

If the established single-migration tool is unavailable or fails once because of tool/auth/transport failure, return:

`held_exact_migration_apply_unavailable`

Do not enter a retry loop and do not switch to an ungoverned fallback execution path.

## 9. Exact Verification

After successful apply, or under collision outcome B, verify objectively:

### `public.c3_current_state`

Required columns:

- `current_state_key`
- `env_key`
- `state_version`
- `standing`
- `effective_at`
- `superseded_at`
- `formation_authority_ref`
- `advance_disposition_ref`
- `predecessor_current_state_key`
- `is_current`
- `source_grammar_key`
- `metadata`
- `created_by`
- `created_at`
- `updated_at`

Required properties include primary key, `(env_key, state_version)` uniqueness, predecessor self-FK with restricted deletion, initial-vs-successor constraint, and one-current-per-env partial unique index.

### `public.c3_current_evidence_ref`

Required columns:

- `current_evidence_ref_key`
- `current_state_key`
- `evidence_key`
- `evidence_class`
- `asset_key`
- `content_hash`
- `hash_algorithm`
- `authoritative_custody_type`
- `authoritative_custody_provider`
- `authoritative_custody_identifier`
- `authoritative_custody_location`
- `evidence_standing`
- `source_execution_instance_id`
- `metadata`
- `created_at`

Required properties include Current-state FK with restricted deletion and unique `(current_state_key, evidence_key, content_hash)` evidence identity.

### Functions and guards

Verify exact presence/signatures and definitions for:

- `bind_c3_current(text,text,text,text,text,timestamptz,jsonb)`
- `attest_c3_current_evidence(text,text,text,text,text,text,text,text,text,text,text,text,text,jsonb)`
- `resolve_c3_current(text)`
- `advance_c3_current(text,text,text,text,text,text,text,timestamptz,jsonb)`
- `c3_current_validate_lineage()`
- `c3_current_guard_state_update()`
- both state triggers

Verify:

- Bind / Attest / Advance are not executable by `PUBLIC`, `anon`, or `authenticated` and are executable by `service_role`.
- Resolve is executable by `anon`, `authenticated`, and `service_role`.
- Current base tables are not public/anon/authenticated browser-write surfaces.
- RLS is enabled on both base tables.

### Zero-row registration boundary

Verify:

```text
public.c3_current_state row count = 0
public.c3_current_evidence_ref row count = 0
```

If either contains a row attributable to the stopped `_001` execution, return the rows' keys and standing as prior-execution evidence and HOLD. Do not delete or normalize them.

### Safe read test

Run only a non-mutating resolver call against an explicitly unbound verification key and verify zero rows are returned.

Do not call Bind, Attest, or Advance as a test in this execution.

## 10. Required Actions

### RA-001 — Source Bind

Read this exact governed OAR2 from `G:\My Drive\CanCom\cline` and verify execution instance `_002` before any environment action.

### RA-002 — Migration Identity

Verify exact migration path, commit, Git blob SHA, and compute SHA-256.

### RA-003 — Prior-Execution Collision Preflight

Apply the three-outcome collision rule in Section 7. No remediation is authorized.

### RA-004 — Exact Single Migration Apply

Only under collision outcome A, apply the exact migration once using the established single-migration mechanism.

### RA-005 — Schema Readback

Verify exact table, column, constraint, index, FK, trigger, and zero-row standing.

### RA-006 — Function and Security Readback

Verify exact function signatures/definitions, grants, and RLS boundaries.

### RA-007 — Safe Resolver Readback

Call Resolve only against an unbound verification key and confirm empty result.

### RA-008 — Changed-Object Accounting

Report only objects attributable to `_002`. Do not claim pre-existing `_001` objects as `_002` mutations.

### RA-009 — Return

Return the package below to canonical `G:\My Drive\CanCom\review` and verify destination placement.

## 11. Return Package

Return exactly:

1. `oar1_register_minimal_c3_current_relation_cline_002.meta.md`
2. `c3_current_schema_readback_cline_002.meta.md`
3. `c3_current_function_security_readback_cline_002.meta.md`
4. `changed_files_register_minimal_c3_current_relation_cline_002.txt`
5. `hashes_register_minimal_c3_current_relation_cline_002.sha256`

The OAR1 must distinguish:

- objects newly applied by `_002`;
- objects objectively verified as pre-existing exact matches;
- any held prior-execution partial mutation;
- any environment/tool apply hold.

## 12. Explicit Non-Authority

This execution does not authorize:

- architecture redesign;
- new schema beyond the exact migration;
- Inanna Current binding;
- MAP evidence import or attestation;
- SEAT entrance formation;
- SRC2 changes;
- `env_key` creation;
- c3_key or role_key changes;
- frontend/FREE modification;
- MAP portal modification;
- CCC contract lookup;
- smart-contract deployment or modification;
- token transaction, mint, burn, bridge, transfer, distribution, wallet gating, voting, rewards, fees, or supply behavior;
- Source Concordance normalization;
- CanCom topology change;
- Optics filing;
- or repair of any partial `_001` mutation.

## 13. Success

Success is an objectively verified minimal Current foundation with:

```text
Bind
  ↓
Current state
  ↓
Attest evidence references
  ↓
Resolve present standing
  ↓
Advance only by governed disposition
  ↓
prior state remains historical
```

No real environment is bound and no token behavior is changed in this execution.

OAR1 is execution evidence only. It cannot review, close, route, or dispose itself.

---
document_type: oar2
title: Apply Consolidated Minimal c3 Current Relation
status: confirmed_for_execution
version: v3
date: 2026-08-08
operator: op044
author: chazz
system: c3_field
initiative: c3_current
registrar: cline
execution_instance_id: register_minimal_c3_current_relation_cline_003
supersedes_execution_instances:
  - register_minimal_c3_current_relation_cline_001
  - register_minimal_c3_current_relation_cline_002
supersedes_oars:
  - docs/oar/c3_field/oar2_register_minimal_c3_current_relation_v1.meta.md
  - docs/oar/c3_field/oar2_register_minimal_c3_current_relation_v2.meta.md
  - docs/oar/c3_field/oar2_apply_minimal_c3_current_relation_v2.meta.md
source_ledger_entry: docs/_source/codex/ledger/c3_ledger_0005_c3_current_as_governed_present_state.meta.md
exact_migration: supabase/migrations/20260808112500_register_minimal_c3_current_relation_v2.sql
exact_migration_commit: 87f76f9906ede31d5487b37b4a9c575a1a0713a2
exact_migration_blob_sha: d62a07acaf21642f7b7478f329f9ce0d0ef061c4
return_destination: G:\My Drive\CanCom\review
---

# OAR2 — Apply Consolidated Minimal c3 Current Relation

## Purpose

Apply and verify the already-resolved minimal c3 Current backend relation.

No architecture discovery is assigned to Cline. This execution exists only to verify collision-free target state,
apply one exact migration, run bounded readback/rollback verification, and return evidence.

## Authority Collision Resolved

Execution `_001` was stopped after repeated failures before a canonical Current return reached Review.

Two different Git OARs subsequently claimed `_002` while model work was occurring concurrently. `_002` is therefore
superseded before execution and must not be used.

Bind only to:

`register_minimal_c3_current_relation_cline_003`

## Exact Source

Repository: `c3codex/c3-Field`

Branch: `measures`

Migration:

`supabase/migrations/20260808112500_register_minimal_c3_current_relation_v2.sql`

Commit:

`87f76f9906ede31d5487b37b4a9c575a1a0713a2`

Git blob SHA:

`d62a07acaf21642f7b7478f329f9ce0d0ef061c4`

Do not rewrite, regenerate, optimize, or substitute this migration.

## Resolved Minimum

Source remains:

`Spark / Weave / Field / Form`

The minimum implementation is:

- Spark → `bind_c3_current`
- Weave → `attest_c3_current_evidence`
- Field → `resolve_c3_current`
- Form → `advance_c3_current`

This is an implementation expression of Source, not a replacement definition. The downstream 1 + 3 + 3 + 3
matrix remains provisional and is not canonized by this execution.

The migration creates:

- `public.c3_current_state`
- `public.c3_current_evidence_ref`
- immutable state/evidence guards and predecessor/successor lineage enforcement
- c3Ops asset-backed evidence snapshot enforcement
- service-role-only Bind / Attest / Advance
- safe resolver access for anon/authenticated/service_role
- explicit resolver holds: `held_missing_env_key`, `held_no_current_state`

Asset-backed evidence takes hash, standing, custody, tokenization standing, and external-anchor reference from
`public.c3ops_asset_record`; it does not trust caller-supplied asset evidence identity.

## RA-001 — Governed Source Bind

Read this exact v3 OAR2 from:

`G:\My Drive\CanCom\cline\oar2_apply_minimal_c3_current_relation_v3.meta.md`

before any database mutation.

If unavailable or wrong execution ID:

`held_source_authority_unresolved`

Stop.

## RA-002 — Collision Preflight

Before apply, read only:

```sql
select
  to_regclass('public.c3_current_state') as current_state,
  to_regclass('public.c3_current_evidence_ref') as evidence_ref,
  to_regclass('public.c3_current_evidence_binding') as legacy_candidate_evidence_binding;
```

Also inspect existence only for functions beginning `c3_current_`, plus:

- `bind_c3_current`
- `attest_c3_current_evidence`
- `resolve_c3_current`
- `advance_c3_current`

If ANY Current table or Current function already exists, do not apply or repair anything.

Return:

`held_prior_current_mutation_requires_review`

with exact existing objects and row counts only, then stop.

## RA-003 — Migration Identity

Verify exact path, branch, commit, and Git blob SHA above. Compute SHA-256 of the exact migration bytes and include
it in the return manifest.

Mismatch:

`held_migration_identity_mismatch`

Stop.

## RA-004 — Exact Apply

Use only the established targeted single-migration database execution path.

Apply only:

`20260808112500_register_minimal_c3_current_relation_v2.sql`

Do not use broad `db push` or any path that could apply unrelated pending migrations.

If the targeted execution mechanism is unavailable or fails once because of tool/auth/transport failure:

`held_exact_migration_apply_unavailable`

Stop. Do not retry-loop or switch to a fallback mutation path.

## RA-005 — Objective Readback

Verify exact presence of:

### `public.c3_current_state`

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

Verify:

- PK
- `(env_key, state_version)` uniqueness
- predecessor self-FK / restricted deletion
- one-current-per-env partial unique index
- current/historical consistency constraint
- lineage/update/delete/successor guards

### `public.c3_current_evidence_ref`

- `current_evidence_ref_key`
- `current_state_key`
- `evidence_key`
- `evidence_class`
- `asset_key`
- `content_hash`
- `hash_algorithm`
- custody snapshot fields
- `evidence_standing`
- `tokenization_standing_at_attest`
- `external_anchor_ref_at_attest`
- `source_execution_instance_id`
- `metadata`
- `attested_by`
- `attested_at`

Verify:

- Current-state FK / restricted deletion
- evidence identity uniqueness
- evidence update/delete guards
- c3Ops asset-snapshot trigger

### Functions / security

Verify exact definitions/signatures for:

- `bind_c3_current`
- `attest_c3_current_evidence`
- `resolve_c3_current`
- `advance_c3_current`
- all `c3_current_*` trigger helpers

Verify:

- RLS enabled on both tables
- PUBLIC/anon/authenticated/service_role have no direct table privileges
- Bind / Attest / Advance executable by service_role only
- Resolve executable by anon, authenticated, and service_role

## RA-006 — Rollback-Only Functional Verification

Use one transaction and end it with `ROLLBACK`.

Use a unique non-authoritative fixture env_key beginning:

`verification_only_c3_current_`

Inside the transaction:

1. Bind version 1 with standing `verification_initial` and formation authority `verification_only_non_authority`.
2. Attest one GENERIC non-asset evidence ref with fixture hash/custody values and `asset_key = null`.
3. Resolve and verify `resolution_standing = resolved_current_state`, version 1, and one evidence ref.
4. Advance to version 2 using disposition ref `verification_only_non_authority`.
5. Verify two history rows, exactly one current row, version increment by one, successor predecessor relation, and predecessor `superseded_at`.
6. Resolve and verify version 2 is current.
7. `ROLLBACK`.
8. Verify zero fixture rows remain in both Current tables.

Read-only hold tests:

- `resolve_c3_current(null)` → `held_missing_env_key`
- unbound verification env_key → `held_no_current_state`

Do not use any real environment or real evidence asset in this verification.

## RA-007 — c3Ops Compatibility Readback

Read only whether `public.c3ops_asset_record` exists and whether it exposes the fields required by the migration:

- `asset_key`
- `content_hash`
- `hash_algorithm`
- `standing`
- authoritative custody fields
- `tokenization_standing`
- `external_anchor_type`
- `network_identifier`
- existing legacy `contract_identifier`
- `token_identifier`
- `anchor_standing`

Do not modify c3Ops assets or its RLS.

If unavailable, report:

`held_c3ops_asset_authority_unavailable_for_asset_attest`

This holds asset-backed Attest only; it does not invalidate registration of Current itself.

## RA-008 — Real Environment / Token Boundary

Do not bind Measures of Inanna or any other real environment.
Do not create or infer an env_key.
Do not import MAP evidence.
Do not tokenize evidence.
Do not look up or modify CCC chain identity.
Do not perform a chain transaction or smart_contract action.

These are downstream executions after Current registration is reviewed.

## RA-009 — Return

Return exactly to canonical:

`G:\My Drive\CanCom\review`

1. `oar1_register_minimal_c3_current_relation_cline_003.meta.md`
2. `c3_current_schema_security_readback_cline_003.meta.md`
3. `c3_current_functional_rollback_verification_cline_003.meta.md`
4. `c3_current_c3ops_compatibility_readback_cline_003.meta.md`
5. `changed_files_register_minimal_c3_current_relation_cline_003.txt`
6. `hashes_register_minimal_c3_current_relation_cline_003.sha256`

No alternate schema, architecture essay, broad repository audit, or additional implementation is requested.

## Explicit Non-Authority

No authority is granted for:

- alternate Current schema
- repair of prior partial Current mutations
- Inanna env_key creation/binding
- MAP evidence import
- SEAT progression
- SRC2 changes
- c3Ops asset mutation
- evidence token minting
- CCC smart_contract deployment/modification
- wallet/token economics/voting/transfers/rewards/fees/supply behavior
- FREE or MAP portal changes
- CanCom topology changes
- Optics filing
- Source 3x3 canonization

## Success

Success is one collision-free, exactly applied and objectively verified Current foundation:

```text
Spark / Bind
      ↓
Current state
      ↓
Weave / Attest
      ↓
Field / Resolve
      ↓
Form / Advance by governed disposition
      ↓
prior state remains immutable history
```

OAR1 is execution evidence only and cannot review, close, route, or dispose itself.

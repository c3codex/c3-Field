---
document_type: oar2
title: Register Minimal c3 Current Governed Present-State Relation — Exact Execution
status: confirmed_for_execution
version: v2
date: 2026-08-08
operator: op044
author: chazz
system: c3_field
initiative: c3_current
registrar: cline
execution_instance_id: register_minimal_c3_current_relation_cline_002
supersedes_oar2: docs/oar/c3_field/oar2_register_minimal_c3_current_relation_v1.meta.md
supersedes_execution_instance: register_minimal_c3_current_relation_cline_001
prior_execution_standing: operator_stopped_return_not_yet_received
source_ledger_entry: docs/_source/codex/ledger/c3_ledger_0005_c3_current_as_governed_present_state.meta.md
exact_migration: supabase/migrations/20260808111000_register_minimal_c3_current_relation_v1.sql
exact_migration_commit: 923fbbe28189491a242ec012243c39d346a1da77
exact_migration_blob_sha: e7f691574504efce60f89f1dae197e96fd8c00aa
return_destination: G:\My Drive\CanCom\review
---

# OAR2 — Register Minimal c3 Current Governed Present-State Relation — Exact Execution

## 1. Purpose

Execute the already-modeled minimum c3 Current backend registration.

This OAR2 intentionally removes architecture discovery from the Registrar execution. The model has already been
resolved by Chazz from governed source, live database readbacks, and repository inspection.

Cline is not asked to decide what Current is, choose a schema, invent a resolver, reconcile token semantics, or
redesign c3Ops. Cline shall verify the exact source, apply the exact bounded SQL if safe, perform the exact
readbacks below, and return evidence.

## 2. Governing Model — Already Decided

c3 Current is the minimum backend relation preserving which governed state presently applies to a governed
`env_key`.

The original CCC purpose remains broader and unchanged: CCC is the Current of the Codex, issued by c3 Community
Partners DAO, anchoring recognition, access, and circulation through Connect / Contribute / Create with
regenerative return to community, DAO continuity, and the commons.

This execution registers only the minimum present-state relation. It does not narrow CCC and it does not perform
any chain or smart-contract action.

Source remains:

```text
Spark / Weave / Field / Form
```

The candidate `1 + 3 + 3 + 3` expansion remains provisional and is not encoded as universal schema authority by
this execution.

## 3. Evidence Model — Already Decided

Do not create a second evidence or tokenization registry.

Existing c3Ops asset authority already provides the evidence primitive through `public.c3ops_asset_record`,
including:

- `asset_key`
- `content_hash`
- `hash_algorithm`
- `standing`
- authoritative custody fields
- `external_anchor_type`
- `network_identifier`
- `contract_identifier`
- `token_identifier`
- `anchor_standing`
- `tokenization_standing`

Current therefore binds to governed c3Ops asset identity and snapshots only the minimum evidence identity,
standing, custody, and tokenization reference that supported a Current state when that state became effective.
Evidence content remains in governed asset custody.

The live c3Ops asset schema is evidenced by:
`c3ops_asset_operations_protocol_supplemental_evidence_cline_001.meta.md`.

The July 31 source migration for that live schema is not present on the `measures` branch. Do not reconstruct it.
The Current migration deliberately uses a dynamic evidence lookup so Current registration is reproducible without
silently reconstructing missing c3Ops source.

## 4. Exact Implementation

The only authorized implementation source is:

`supabase/migrations/20260808111000_register_minimal_c3_current_relation_v1.sql`

Git branch:
`measures`

Git commit:
`923fbbe28189491a242ec012243c39d346a1da77`

Git blob SHA:
`e7f691574504efce60f89f1dae197e96fd8c00aa`

Do not rewrite, optimize, expand, normalize, or substitute this SQL during execution.

It creates exactly these Current objects:

1. `public.c3_current_state`
2. `public.c3_current_evidence_binding`
3. Current lineage / immutability triggers
4. c3Ops evidence-snapshot trigger
5. `public.c3_current_bind(...)`
6. `public.c3_current_advance(...)`
7. `public.resolve_c3_current(text)`
8. internal evidence-set helper

Core invariants already encoded:

- one current state per `env_key`;
- historical Current states are not overwritten or deleted;
- evidence bindings are immutable;
- advancement requires `confirmed_close`, `confirmed_route`, or `disputed_hold` plus a disposition reference;
- successor state identifies its predecessor;
- a superseded state cannot be left without a current successor in the same transaction;
- evidence bindings resolve from c3Ops asset authority rather than user/frontend input;
- resolver returns governed hold standing when Current is unresolved;
- no browser/frontend write authority is created;
- no CCC chain action occurs.

## 5. Prior Execution Boundary

Execution `register_minimal_c3_current_relation_cline_001` was stopped by Operator direction after repeated
failures. At formation of this v2, no Current return package was present in `CanCom/review`.

Do not resume execution `_001`.

Before any mutation under `_002`, perform the read-only collision check below. This protects against an
unreported partial mutation from `_001`.

## 6. RA-001 — Exact Drive Source

Read this exact v2 OAR2 from governed Drive `CanCom/cline` before repository or database mutation.

Bind only to:

`register_minimal_c3_current_relation_cline_002`

If the exact governed v2 source cannot be verified, return:

`held_source_authority_unresolved`

and stop.

## 7. RA-002 — Prior-Mutation Collision Check

Read-only query:

```sql
select
  to_regclass('public.c3_current_state') as c3_current_state,
  to_regclass('public.c3_current_evidence_binding') as c3_current_evidence_binding;
```

Expected before v2 mutation:

```text
c3_current_state = null
c3_current_evidence_binding = null
```

If either object already exists, DO NOT apply the migration.

Return:

`held_prior_current_mutation_requires_review`

and include only:

- existing Current object names;
- columns;
- constraints;
- indexes;
- functions/triggers with `c3_current` prefix;
- row counts;
- exact evidence of whether `_001` created them.

Do not repair or replace them in this execution.

## 8. RA-003 — Verify Exact Git Migration

Verify on branch `measures`:

- exact path;
- commit contains the file;
- Git blob SHA matches `e7f691574504efce60f89f1dae197e96fd8c00aa`.

Calculate and report SHA-256 of the exact migration bytes for the return package.

If the Git object does not match, return:

`held_migration_identity_mismatch`

and stop.

## 9. RA-004 — Apply Only the Exact Migration

Apply only the SQL content of the exact migration to the hosted database using the existing authorized targeted
DB execution path.

Do NOT use a broad migration command that would also apply unrelated pending migrations.

Do NOT recreate the missing July 31 c3Ops asset migration.

Do NOT modify c3Ops asset tables.

If a targeted database execution path is unavailable, return:

`held_targeted_db_execution_unavailable`

and stop without substitution.

## 10. RA-005 — Schema Readback

After successful apply, return objective readback for:

### Tables

`public.c3_current_state`

Required columns:

- `current_state_key`
- `current_relation`
- `env_key`
- `standing`
- `source_disposition`
- `source_disposition_ref`
- `predecessor_current_state_key`
- `is_current`
- `effective_at`
- `superseded_at`
- `source_oar2_ref`
- `source_oar1_ref`
- `created_by`
- `metadata`
- `created_at`

`public.c3_current_evidence_binding`

Required columns:

- `evidence_binding_key`
- `current_state_key`
- `asset_key`
- `evidence_role`
- `content_hash_at_binding`
- `hash_algorithm_at_binding`
- `asset_standing_at_binding`
- `custody_ref_at_binding`
- `token_ref_at_binding`
- `tokenization_standing_at_binding`
- `attested_by`
- `attested_at`

Verify the partial unique index enforcing one current state per `env_key`.

Verify RLS is enabled.

## 11. RA-006 — Function and Guard Readback

Verify existence of:

- `c3_current_bind`
- `c3_current_advance`
- `resolve_c3_current`
- Current state update/delete guards
- Current evidence update/delete guards
- predecessor/successor validation
- c3Ops evidence snapshot trigger

Do not interpret or redesign them. Report presence and database definitions/hashable readback only.

## 12. RA-007 — Rollback-Only Functional Verification

Use one transaction that MUST end in `ROLLBACK`.

The test fixture is explicitly non-authoritative and must leave zero persistent Current rows.

Use a unique fixture `env_key` beginning:

`verification_only_c3_current_`

Within that transaction:

1. call `c3_current_bind(...)` with:
   - fixture env_key;
   - standing `verification_initial`;
   - disposition `confirmed_route`;
   - disposition ref `verification_only_non_authority`;
   - created_by `cline`;
   - empty evidence array;
2. verify exactly one current state resolves;
3. call `c3_current_advance(...)` with standing `verification_successor` and the same explicit verification-only disposition boundary;
4. verify:
   - exactly two history rows exist for the fixture;
   - exactly one row has `is_current=true`;
   - successor names predecessor;
   - predecessor has `superseded_at`;
5. call `resolve_c3_current(fixture_env_key)` and verify `resolved_current_state`;
6. `ROLLBACK`;
7. verify zero fixture rows remain.

Also verify without mutation:

```sql
select * from public.resolve_c3_current(null);
```

returns `held_missing_env_key`, and a never-bound non-authoritative fixture key returns
`held_no_current_state`.

Do not use Measures of Inanna, Measures Registry, or any real environment as the functional test fixture.

## 13. RA-008 — Evidence Compatibility Readback Only

Read only whether `public.c3ops_asset_record` exists and whether the exact evidence/tokenization columns listed in
§3 are present.

Do not migrate assets.
Do not tokenize assets.
Do not create evidence bindings under a real Current state.
Do not alter c3Ops RLS.

If the table is unavailable, report:

`held_c3ops_asset_authority_unavailable_for_evidence_binding`

This does NOT invalidate Current mechanism registration; it holds only evidence binding until c3Ops asset
authority is available.

## 14. RA-009 — Inanna Binding Standing

Do NOT create a Measures of Inanna Current state in this execution.

Prior governed SEAT verification found that `env_key` did not exist on the Inanna chamber/encounter/media
relation and classified the intended environment relation as missing. Current August environment work also
preserves unresolved env-key standing rather than authorizing invention.

Return:

`held_missing_env_key_for_initial_current_binding`

until a separately governed environment identity supplies a canonical active Inanna `env_key`.

This hold is expected and does not invalidate Current registration.

## 15. RA-010 — CCC Chain Standing

Do not search browsers, wallets, explorers, repository prose, or token names for a contract address.

Do not create a chain reference.

Return:

`held_missing_canonical_ccc_chain_identity`

unless a governed machine-readable CCC chain identity is already present in the execution source set.

No chain transaction is authorized.

## 16. Return Package

Return exactly to:

`G:\My Drive\CanCom\review`

1. `oar1_register_minimal_c3_current_relation_cline_002.meta.md`
2. `c3_current_schema_and_guard_readback_cline_002.meta.md`
3. `c3_current_functional_rollback_verification_cline_002.meta.md`
4. `c3_current_dependency_holds_cline_002.meta.md`
5. `changed_files_register_minimal_c3_current_relation_cline_002.txt`
6. `hashes_register_minimal_c3_current_relation_cline_002.sha256`

No additional architecture essays or alternate schemas are required.

## 17. Explicit Non-Authority

This OAR2 does not authorize:

- architecture redesign;
- alternate Current schema;
- Inanna env-key invention;
- persistent verification fixtures;
- MAP evidence import;
- MAP audit re-execution;
- SEAT completion;
- SRC2 expansion;
- asset migration;
- evidence token minting;
- CCC smart-contract deployment or modification;
- wallet behavior;
- token economics;
- voting/governance weight;
- transfer behavior;
- public frontend integration;
- FREE redesign;
- broad c3Ops refactor;
- CanCom topology changes;
- Optics filing;
- or canonization of the candidate Source 3x3 cells.

## 18. Successful Result

Successful result is:

```text
exact Git migration
        ↓
Current state relation registered
        ↓
one current state per env_key enforced
        ↓
immutable predecessor lineage enforced
        ↓
governed disposition required to advance
        ↓
c3Ops evidence/tokenization authority referenced, not duplicated
        ↓
resolver returns current standing or explicit governed hold
```

Expected held dependencies after successful mechanism registration:

- `held_missing_env_key_for_initial_current_binding`
- `held_missing_canonical_ccc_chain_identity`

Those holds are deliberate next-work boundaries, not implementation failures.

OAR1 is execution evidence only and cannot review, close, route, or dispose itself.

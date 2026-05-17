---
document_type: oar1
title: OAR1 Concordance Authority RPC-Compatible Migration Packaging
version: v1
status: recorded
system: c3_field
operator: op044
source_oar2: docs/oar/c3_field/oar2_concordance_authority_rpc_compatible_migration_packaging_v1.meta.md
---

OAR1: oar1_concordance_authority_rpc_compatible_migration_packaging_v1

## Objective
Adapt the Concordance Authority execution package for the Supabase `exec_sql` RPC execution surface without changing authority semantics, schema design, migration intent, seating content, runtime/frontend behavior, or DB state.

## Observed
The prior execution authorization reached live migration attempt after successful preflight.

Migration execution blocked at Phase 2 with:

`EXECUTE of transaction commands is not implemented`

No Seed Concordance seating occurred.
No post-validation occurred.
Stop-on-failure held.

## Actions
- Revised `docs/oar/c3_field/concordance_authority_execution_package_migration_v1.sql`.
- Revised `docs/oar/c3_field/concordance_authority_execution_package_seed_concordance_v1_seating.sql`.
- Revised `docs/oar/c3_field/execute-concordance-authority-migration-authorization-v1.cjs`.
- Left rollback/recovery package separate and non-destructive.

## Packaging Changes
### Migration SQL
Removed RPC-incompatible transaction wrappers from the RPC-executed migration package:

- `begin;`
- `commit;`

Preserved:

- tables
- constraints
- indexes
- RLS
- append protections
- timestamp protections
- visibility standing
- relation scope
- `source_ref` / `target_ref` posture

### Seating SQL
Removed RPC-incompatible transaction wrappers from the RPC-executed Seed Concordance seating package:

- `begin;`
- `commit;`

Preserved:

- Seed Concordance document seating
- Seed Concordance v1 version seating
- term seating
- relation seating
- source snapshot seating
- scope-neutral relation references

### Execution Helper
Updated helper to enforce stop-on-failure outside SQL transaction wrappers.

Added package validation that rejects RPC-executed SQL files if they contain:

- `begin;`
- `commit;`
- `rollback;`

Added local validation mode:

`node docs/oar/c3_field/execute-concordance-authority-migration-authorization-v1.cjs validate-package`

## Validation
Command:

`rg -n "^\s*(begin|commit|rollback)\s*;" docs\oar\c3_field -g "concordance_authority_execution_package_*.sql" -i`

Result:

- no transaction-control commands found in RPC-executed package files

Command:

`node docs\oar\c3_field\execute-concordance-authority-migration-authorization-v1.cjs validate-package`

Result:

`rpc_package_validation: ok`

## Authority Boundary Preserved
`Codex seating = authority`

`snapshot != authority`

`markdown != authority`

`frontend != authority`

This OAR1 records packaging only. It does not execute migration SQL, seat rows, mutate DB, mutate bucket objects, alter runtime/frontend behavior, or redefine authority.

## Constraints Held
- No migration executed.
- No DB mutation performed.
- No Seed Concordance rows seated.
- No post-validation SQL run against DB.
- No authority model changed.
- No schema intent changed.
- No runtime/frontend work performed.
- Rollback/recovery package remains separate.

## Files
- docs/oar/c3_field/oar2_concordance_authority_rpc_compatible_migration_packaging_v1.meta.md
- docs/oar/c3_field/oar1_concordance_authority_rpc_compatible_migration_packaging_v1.meta.md
- docs/oar/c3_field/concordance_authority_execution_package_migration_v1.sql
- docs/oar/c3_field/concordance_authority_execution_package_seed_concordance_v1_seating.sql
- docs/oar/c3_field/execute-concordance-authority-migration-authorization-v1.cjs

## Close
Authority unchanged.
Execution surface adapted.
No DB mutation performed.

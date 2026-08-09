---
document_type: c3_ledger_entry
ledger_key: c3_ledger_0002
title: Establish Observatory Ledger Repository and Custody Boundary
status: confirmed_for_migration
version: v1
operator: op044
system: c3_field
current_custody: c3codex/c3-Field@ledger/observatory-migration-001
intended_custody: dedicated_observatory_ledger_repository
migration_state: repository_not_yet_physically_created
---

# c3 Ledger 0002 — Establish Observatory Ledger Repository and Custody Boundary

## Decision

The c3 Ledger is an Observatory function and must not remain coupled to the Measures Registry production repository or production branch.

A dedicated Git repository shall become the authoritative custody location for modeled initiatives and Ledger records. The Observatory is the intended institutional/system authority boundary for that repository unless subsequent registered authority establishes a more specific Ledger system.

## Transitional Custody

Until the dedicated repository physically exists, Ledger records created under this decision are preserved on the non-production branch:

`c3codex/c3-Field@ledger/observatory-migration-001`

This branch is transitional custody only. It does not make Measures Registry or the `measures` branch the Ledger authority.

## Migration Requirements

When the dedicated Observatory/Ledger repository is established:

1. migrate the complete Ledger record set with content hashes and history evidence;
2. preserve ledger keys and standing;
3. establish the repository as the canonical Source-layer custody location;
4. register the repository/system relation in the appropriate c3 Registry authority;
5. retain a migration receipt from transitional custody to canonical custody;
6. do not delete transitional records until migration verification is complete.

## Layer Rule

Ledger custody must preserve the c3 layered architecture:

`Source -> System -> Public -> Web3 (later)`

The Git repository is Source-layer custody. Registry/System relations determine standing and operational use. Public surfaces may render permitted Ledger-derived information but do not become Ledger authority. Future Web3 relations may reference or attest to Ledger records without replacing Source/System custody.

## Standing

`confirmed_for_migration_repository_creation_pending`

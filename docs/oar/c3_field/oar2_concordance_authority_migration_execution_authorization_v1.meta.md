# OAR2 — Concordance Authority Migration Execution Authorization

## OBSERVED

The Concordance Authority layer now includes:

    authority model
    schema proposal
    migration cadence
    hardened SQL draft
    execution package
    validation SQL
    rollback/recovery posture
    Seed Concordance v1 authority seating record
    relation reference hardening

All prior work has remained review-only.

No DB mutation has occurred.

## ALIGNED

This OAR2 authorizes controlled execution of the reviewed Concordance Authority migration package.

Authority order remains:

    Codex → Field → Measures → Chazz

Execution must preserve:

    Codex seating = authority
    snapshot != authority
    markdown != authority
    frontend != authority

## PRE-EXECUTION REQUIREMENTS

Execution may not begin until all of the following are confirmed:

### 1. Seeded Reference Verification

Relevant seeded references must be checked first.

Required references include:

    Seed Concordance
    The 21 of Coherence
    OAR Lifecycle
    Seeded Reference Control
    Doc-Set Closeout Rule
    Thread-to-Transfer Validation Rule
    Chazz x Cody Development Role Contract

### 2. File Check Confirm

Operator must confirm:

    expected files
    found files
    missing files
    execution package standing

### 3. Git Commit Required

Execution package must be committed before live execution.

### 4. Seeded-State Confirmation

Execution artifacts must be confirmed as seeded-reference standing rather than working-draft standing.

## ROUTED

Cody shall execute in this order only:

### Phase 1 — Preflight Validation

Run:
- schema conflict checks
- duplicate active version checks
- existing table collision checks
- RLS conflict checks
- extension dependency checks

If preflight fails:

    STOP
    NO EXECUTION CONTINUES

### Phase 2 — Migration Execution

Execute finalized migration SQL only.

Must include:
- tables
- constraints
- indexes
- RLS
- append protections
- timestamp protections

### Phase 3 — Seed Concordance Seating

Execute Seed Concordance v1 seating SQL only after migration success.

### Phase 4 — Post-Validation

Run:
- table existence checks
- constraint checks
- active-version uniqueness checks
- relation reference checks
- visibility standing checks
- append protection checks
- RLS validation
- seating row validation

### Phase 5 — OAR1 Closeout

Write execution OAR1 including:
- executed files
- validation results
- failures encountered
- rollback usage if applicable
- final standing

## STOP-ON-FAILURE RULE

If any phase fails:

    halt execution
    record failure
    do not continue partial seating

Partial seating may not silently proceed.

## ROLLBACK BOUNDARY

Rollback may occur only within the approved rollback package boundary.

Rollback may not:
- silently overwrite authority
- bypass append protections
- remove validated trace
- collapse version chronology

## CODY ROLE

Cody may:
- execute reviewed migration package
- run validation SQL
- execute seating SQL
- execute rollback package if required
- write OAR1 execution closeout

Cody may not:
- alter migration logic during execution
- improvise schema changes
- redefine authority
- bypass validation
- continue after failed preflight
- invent recovery logic outside rollback package
- mutate runtime/frontend during migration execution

## VALIDATION

Success requires:

    migration executed
    Seed Concordance seated
    validation queries pass
    append protections active
    RLS active
    active-version uniqueness enforced
    relation references scope-neutral
    OAR1 written

## EXPECTED OAR1

    docs/oar/c3_field/oar1_concordance_authority_migration_execution_authorization_v1.meta.md

## CLOSE

Authority execution must remain deliberate.

Validate first.
Execute second.
Verify third.
Log fourth.
Commit fifth.

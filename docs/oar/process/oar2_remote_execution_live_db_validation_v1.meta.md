---
document_type: oar2
authority_level: remote_execution_authorization_pending
document_scope: process_registry_migration_remote_validation
title: OAR2 - Remote Execution + Live DB Validation v1
status: review_confirmed
version: v1
operator: op044
system: c3field
native_stack:
  codex: database
  field: schema
  measures: registry
  chazz: systems
tags:
  - oar2
  - remote-execution
  - live-db-validation
  - process-registry
  - oar-queue
  - migration-proof
source_alignment:
  - OAR1 - Execute Process Registry and OAR Queue Foundation Migration v1
  - OAR1 - Process Registry and OAR Queue Foundation v1
  - OAR2 - Local Validation Before Remote Process Registry Migration v1
  - OAR2 - Execute Process Registry and OAR Queue Foundation Migration v1
  - Schema Preflight - Process Registry and OAR Queue Foundation v1
---

# OAR2 - Remote Execution + Live DB Validation v1

## OBSERVED

Process registry and OAR queue foundation has passed local validation.

Current local proof:

```text
supabase db diff
No schema changes found
```

```text
supabase db lint --local --fail-on error
No schema errors found
```

Current OAR1 standing:

local_validated_remote_execution_pending

Current required next state is remote execution with live DB verification, not frontend exposure.

Remote execution must confirm:

- migration applied to live database
- required tables exist
- constraints exist
- foreign keys exist
- indexes exist
- triggers exist
- RLS is not enabled
- policies were not introduced
- row counts match expected empty-state standing where applicable
- OAR1 standing updates from local validated to live verified
- git status is clean after OAR1 closeout and commit

No seed rows are authorized.

## ALIGNED

Authority order remains:

Codex -> Field -> Measures -> OAR2 -> Chazz -> Cody -> src

Cody executes from OAR2 only. OAR1 is required before completion.

Before database mutation, seeded references must be checked first; committed is not equal to seeded.

Verification must occur before recognition.

Remote execution is allowed only after explicit operator confirmation.

## ROUTED

### 1. Preflight

Cody must verify local migration file presence and current git branch/state before remote execution.

Required checks:

- current branch
- git status
- migration file path
- migration file contents reviewed for:
  - tables only
  - constraints
  - FK definitions
  - indexes
  - triggers
  - no seed inserts
  - no RLS
  - no policies
  - no frontend changes

### 2. Operator Confirmation Gate

Remote execution must stop before mutation.

Cody must request explicit operator confirmation before running any authenticated remote DB command.

Valid confirmation language:

confirm remote execution

No other instruction authorizes remote mutation.

### 3. Authenticated Remote Execution

After confirmation only, Cody may execute the migration against live Supabase.

Execution must use authenticated remote path only.

No local-only success may be treated as live completion.

### 4. Live Table Verification

Verify live existence of expected process/OAR tables.

Expected tables:

- public.system_process_registry
- public.system_oar_queue
- public.system_oar_execution_evidence

Cody must report actual live table names found.

### 5. Constraint Verification

Verify check constraints, unique constraints, not-null constraints, primary keys, and trigger-backed hard guards.

Output must include:

- table name
- constraint name
- constraint type
- validation standing

### 6. FK Verification

Verify foreign keys exist and point to intended parent tables.

Output must include:

- source table
- source column
- target table
- target column
- delete/update behavior where available

### 7. Index Verification

Verify indexes created by migration.

Output must include:

- table name
- index name
- indexed columns or definition

### 8. Trigger Verification

Verify triggers created by migration.

Output must include:

- table name
- trigger name
- trigger function
- enabled state

### 9. No-RLS / No-Policy Confirmation

Verify no RLS was enabled and no policies were introduced.

Required checks:

- relrowsecurity = false
- relforcerowsecurity = false
- zero matching policies for new tables

### 10. Row Count Confirmation

Confirm row counts.

Expected standing:

- no seed rows
- no automation-created rows
- only structural table creation unless migration explicitly creates required metadata rows

Any nonzero row count must be explained.

### 11. OAR1 Live Standing Update

After live verification passes, Cody must write/update OAR1 beside this OAR2.

OAR1 must record:

- migration executed remotely
- live table verification result
- constraint verification result
- FK verification result
- index verification result
- trigger verification result
- no-RLS/no-policy confirmation
- row-count confirmation
- final standing: live_verified

### 12. Final Git Status + Commit

After OAR1 is written:

- run git status
- stage OAR1 and any required migration/docs already in scope
- commit with message:

OAR1 log: remote execution and live DB validation

Return final git status.

## CODY ROLE

Cody may:

- inspect migration
- run local preflight
- request operator confirmation
- execute authenticated remote migration only after confirmation
- run live verification queries
- write OAR1
- commit verified state

Cody may not:

- execute remote DB mutation without explicit operator confirmation
- add seed rows
- enable RLS
- create policies
- expose frontend surfaces
- automate execution
- modify scope
- treat local success as live verification
- skip OAR1

## VALIDATION

This OAR2 resolves successfully only when:

- remote migration is confirmed executed
- live DB verification passes
- no RLS or policies exist on new tables
- row counts are confirmed
- OAR1 records live verified standing
- final git status is clean after commit

## HARD BOUNDARY

No frontend exposure.
No seed rows.
No RLS.
No automation.
No remote execution without explicit operator confirmation.

## EXPECTED OAR1

docs/oar/process/oar1_remote_execution_live_db_validation_v1.meta.md

## CURRENT STANDING

remote_execution_authorization_pending

## CLOSE

Remote execution is not completion.

Execution must be proven live, logged in OAR1, and committed.

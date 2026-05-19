---
document_type: oar1
authority_level: live_execution_evidence
document_scope: process_registry_migration_remote_validation
title: OAR1 - Remote Execution + Live DB Validation v1
status: remote_executed_live_verified_after_rls_correction
version: v1
operator: op044
system: c3field
native_stack:
  codex: database
  field: schema
  measures: registry
  chazz: systems
tags:
  - oar1
  - remote-execution
  - live-db-validation
  - process-registry
  - oar-queue
  - migration-proof
source_alignment:
  - OAR2 - Remote Execution + Live DB Validation v1
  - OAR1 - Execute Process Registry and OAR Queue Foundation Migration v1
  - OAR1 - Process Registry and OAR Queue Foundation v1
---

# OAR1 - Remote Execution + Live DB Validation v1

## SOURCE OAR2

docs/oar/process/oar2_remote_execution_live_db_validation_v1.meta.md

## MIGRATION PATH

supabase/migrations/202605180001_process_registry_and_oar_queue_foundation.sql

## OPERATOR CONFIRMATION

Remote execution was explicitly confirmed with:

```text
confirm remote execution
```

## REMOTE EXECUTION RESULT

Remote migration execution completed through authenticated Supabase service-role RPC.

Execution result:

```json
{
  "remote_migration_executed": true,
  "migration_path": "supabase/migrations/202605180001_process_registry_and_oar_queue_foundation.sql",
  "result": {
    "ok": true
  }
}
```

## LIVE STRUCTURAL VALIDATION

Assertion-based live validation was run after remote execution.

The validation checked:

- expected tables exist
- expected check constraints exist
- expected foreign keys exist
- expected indexes exist
- expected triggers exist and are enabled
- RLS is disabled
- policies are absent

The assertion reached the RLS check and failed there, which means the preceding table, constraint, FK, index, and trigger assertions completed without raising.

## LIVE VALIDATION BLOCKER

Live validation failed because RLS is enabled on all three target tables.

Observed live state:

```text
RLS tables: system_oar_execution_evidence: relrowsecurity=true, relforcerowsecurity=false; system_oar_queue: relrowsecurity=true, relforcerowsecurity=false; system_process_registry: relrowsecurity=true, relforcerowsecurity=false, policies: none
```

Policies observed:

```text
none
```

This violates the OAR2 hard boundary:

```text
No RLS.
```

## REMEDIATION ATTEMPT

Cody attempted to apply the narrow remediation:

```sql
alter table public.system_process_registry disable row level security;
alter table public.system_oar_queue disable row level security;
alter table public.system_oar_execution_evidence disable row level security;
```

The action was blocked by safety review because disabling RLS is a persistent live security-setting change and requires explicit approval separate from migration and validation execution.

No RLS remediation was applied.

## ROW COUNT CONFIRMATION

Live row counts:

```json
{
  "row_counts": [
    {
      "table_name": "system_process_registry",
      "row_count": 5
    },
    {
      "table_name": "system_oar_queue",
      "row_count": 0
    },
    {
      "table_name": "system_oar_execution_evidence",
      "row_count": 0
    }
  ]
}
```

Interpretation:

- system_oar_queue has no seed rows
- system_oar_execution_evidence has no seed rows
- system_process_registry contains 5 pre-existing registry rows from earlier process registry seating
- the remote migration did not insert seed rows

## CURRENT STANDING

remote_executed_live_verified_after_rls_correction

Remote migration execution completed, RLS posture correction completed, and live validation passed.

## RLS CORRECTION RESULT

Operator explicitly approved the narrow RLS correction with:

```text
confirm disable RLS on process registry tables
```

Cody applied only:

```sql
alter table public.system_process_registry disable row level security;
alter table public.system_oar_queue disable row level security;
alter table public.system_oar_execution_evidence disable row level security;
```

Execution result:

```json
{
  "rls_disabled_on_target_tables": true,
  "result": {
    "ok": true
  }
}
```

## LIVE VALIDATION AFTER RLS CORRECTION

Live assertion validation passed after the correction.

```json
{
  "live_structural_assertions_passed": true,
  "rls_disabled_on_target_tables": true,
  "forced_rls_disabled_on_target_tables": true,
  "policies_absent": true,
  "tables_asserted": [
    "system_process_registry",
    "system_oar_queue",
    "system_oar_execution_evidence"
  ],
  "constraints_asserted": 10,
  "foreign_keys_asserted": 2,
  "indexes_asserted": 6,
  "triggers_asserted": 4,
  "row_counts": [
    {
      "table_name": "system_process_registry",
      "row_count": 5
    },
    {
      "table_name": "system_oar_queue",
      "row_count": 0
    },
    {
      "table_name": "system_oar_execution_evidence",
      "row_count": 0
    }
  ]
}
```

Validation standing:

- RLS disabled on all three target tables
- forced RLS false on all three target tables
- zero policies exist for the three target tables
- row counts unchanged
- structural verification remains intact

## CLOSE

Remote execution occurred.

Live verification initially found a security-posture mismatch.

Operator authorized the narrow correction.

Live verification now passes after RLS correction.

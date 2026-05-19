---
document_type: oar2
authority_level: correction_executed
document_scope: process_registry_live_rls_posture_correction
title: OAR2 - Live RLS Posture Correction v1
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
  - oar2
  - rls-correction
  - live-db-validation
  - process-registry
  - oar-queue
  - security-posture
source_alignment:
  - OAR1 - Remote Execution + Live DB Validation v1
  - OAR2 - Remote Execution + Live DB Validation v1
  - OAR1 - Execute Process Registry and OAR Queue Foundation Migration v1
---

# OAR2 - Live RLS Posture Correction v1

## OBSERVED

Authenticated remote migration execution completed for the process registry and OAR queue foundation migration.

Live validation found RLS enabled on the three target tables:

- public.system_process_registry
- public.system_oar_queue
- public.system_oar_execution_evidence

This contradicts the active remote execution OAR2 boundary:

- No RLS
- No policies
- No seed rows
- No automation
- No frontend exposure

Live validation standing:

- local validation: passed
- remote migration execution: completed
- live validation: blocked by RLS enabled
- policies: none
- system_oar_queue row count: 0
- system_oar_execution_evidence row count: 0
- system_process_registry row count: 5 existing rows

RLS correction must not be bundled silently into validation because disabling RLS is a live DB security posture mutation.

## ALIGNED

Authority order remains:

Codex -> Field -> Measures -> OAR2 -> Chazz -> Cody -> src

Verification must precede recognition.

The active OAR2 required no RLS. Therefore live validation cannot close while the three target tables remain RLS-enabled unless governance is explicitly revised.

The permitted correction is narrow:

- disable RLS only on the three target tables
- do not create policies
- do not insert seed rows
- do not modify frontend
- do not add automation
- do not alter unrelated tables

## AUTHORIZATION GATE

This OAR2 does not itself execute the live security posture correction.

Cody must stop before mutation and request explicit operator confirmation.

Valid confirmation language:

confirm disable RLS on process registry tables

No other instruction authorizes this correction.

## ROUTED

### 1. Apply RLS Correction

After exact confirmation only, run only:

```sql
alter table public.system_process_registry disable row level security;
alter table public.system_oar_queue disable row level security;
alter table public.system_oar_execution_evidence disable row level security;
```

No other live DB mutation is authorized by this OAR2.

### 2. Validate RLS Standing

Run live verification confirming:

```sql
select
  relname,
  relrowsecurity,
  relforcerowsecurity
from pg_class
where oid in (
  'public.system_process_registry'::regclass,
  'public.system_oar_queue'::regclass,
  'public.system_oar_execution_evidence'::regclass
)
order by relname;
```

Expected:

- relrowsecurity = false
- relforcerowsecurity = false

### 3. Validate No Policies

Run:

```sql
select
  schemaname,
  tablename,
  policyname
from pg_policies
where schemaname = 'public'
  and tablename in (
    'system_process_registry',
    'system_oar_queue',
    'system_oar_execution_evidence'
  )
order by tablename, policyname;
```

Expected:

- zero rows

### 4. Validate Row Counts

Run:

```sql
select 'system_process_registry' as table_name, count(*) as row_count
from public.system_process_registry
union all
select 'system_oar_queue', count(*)
from public.system_oar_queue
union all
select 'system_oar_execution_evidence', count(*)
from public.system_oar_execution_evidence
order by table_name;
```

Expected:

- system_process_registry: 5 existing rows
- system_oar_queue: 0 rows
- system_oar_execution_evidence: 0 rows

Any row-count change after RLS correction is invalid and must halt closeout.

### 5. Reconfirm Structural Objects

Rerun live verification for:

- tables
- constraints
- foreign keys
- indexes
- triggers

This correction may not weaken structural validation.

### 6. Update OAR1

Update or create:

docs/oar/process/oar1_remote_execution_live_db_validation_v1.meta.md

The OAR1 must record:

- remote migration execution completed
- live validation initially blocked by RLS enabled
- operator explicitly authorized RLS correction
- RLS disabled only on three target tables
- no policies present
- row counts unchanged
- constraints/FKs/indexes/triggers still intact
- final standing:

remote_executed_live_verified_after_rls_correction

### 7. Commit

After OAR1 update:

```text
git status
git add docs/oar/process/oar2_live_rls_posture_correction_v1.meta.md docs/oar/process/oar1_remote_execution_live_db_validation_v1.meta.md
git commit -m "OAR1 log: live DB validation after RLS correction"
git status
```

## CODY ROLE

Cody may, after exact confirmation:

- apply the three-table RLS disable correction
- rerun live validation
- update OAR1
- commit OAR2/OAR1 closeout files

Cody may not:

- modify unrelated tables
- add seed rows
- create policies
- enable RLS elsewhere
- add automation
- change frontend files
- treat RLS correction as silently included in prior validation
- close without OAR1 evidence

## VALIDATION

This OAR2 resolves only when:

- RLS is disabled on all three target tables
- forced RLS is false on all three target tables
- zero policies exist for the three target tables
- row counts remain unchanged
- structural verification remains intact
- OAR1 records the correction path
- git status is clean after commit

## HARD BOUNDARY

No frontend exposure.
No seed rows.
No policies.
No automation.
No unrelated table mutation.
No closeout without OAR1.
No live RLS mutation without exact operator confirmation.

## EXPECTED OAR1

docs/oar/process/oar1_remote_execution_live_db_validation_v1.meta.md

## EXECUTION RESULT

Operator explicitly confirmed:

```text
confirm disable RLS on process registry tables
```

Cody applied only the authorized three-table RLS correction.

Live validation passed after correction:

- RLS disabled on all three target tables
- forced RLS false on all three target tables
- zero policies exist for the three target tables
- row counts remained unchanged
- tables, constraints, foreign keys, indexes, and triggers remained intact

## CURRENT STANDING

remote_executed_live_verified_after_rls_correction

## CLOSE

Remote execution completed.
Live validation exposed RLS posture drift.
Operator confirmed narrow correction.
Correction was proven and logged before live standing was accepted.

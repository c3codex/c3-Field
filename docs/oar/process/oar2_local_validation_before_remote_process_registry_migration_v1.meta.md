---
document_type: oar2
authority_level: verification_required
document_scope: process_registry_migration_validation
title: OAR2 — Local Validation Before Remote Process Registry Migration v1
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
  - local-validation
  - process-registry
  - oar-queue
  - migration-proof
  - remote-blocked
source_alignment:
  - OAR1 — Execute Process Registry and OAR Queue Foundation Migration v1
  - OAR2 — Execute Process Registry and OAR Queue Foundation Migration v1
  - Schema Preflight — Process Registry and OAR Queue Foundation v1
  - OAR Lifecycle — Execution and Handoff
---

# OAR2 — Local Validation Before Remote Process Registry Migration v1

## OBSERVED

Migration artifact exists for:

- system_process_registry
- system_oar_queue
- system_oar_execution_evidence

Current OAR1 standing:

completed_with_live_db_validation_blocked

Remote DB execution must not proceed without local runtime proof.

## ALIGNED

Verification before recognition.

Local Supabase runtime becomes the proof surface before governed remote mutation.

Authority remains:

Codex → Field → Measures → Chazz → Cody

## ROUTED

Cody should perform local-only verification:

1. Start local Supabase runtime.
2. Run migration lint.
3. Apply migration locally.
4. Run validation SQL locally.
5. Confirm:
   - 3 tables exist
   - constraints exist
   - foreign keys exist
   - indexes exist
   - triggers exist where authored
   - no RLS enabled
   - no policies created
   - no seed rows inserted
6. Record local validation result.
7. Update OAR1 standing to:

local_validated_remote_execution_pending

## HARD BLOCK

Remote execution remains blocked until local validation is recorded.

## CODY ROLE

Cody may:

- start local runtime
- lint migration
- apply migration locally
- run validation SQL locally
- update OAR1 with local proof

Cody may not:

- execute remote migration
- create RLS policies
- insert seed rows
- change frontend files
- mark live verified
- skip local validation

## VALIDATION

Required return:

- local runtime status
- lint result
- local migration apply result
- validation query output
- no-RLS confirmation
- no-policy confirmation
- no-seed confirmation
- updated OAR1 standing

## CURRENT STANDING

local_validation_required_before_remote_execution

## CLOSE

Canopy holds.

Local proof comes before remote mutation.

Codex holds.
Field structures.
Measures registers.
Chazz routes.
Cody validates locally before touching remote.

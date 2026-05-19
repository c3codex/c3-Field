---
document_type: schema_preflight
authority_level: working
document_scope: process_registry
title: Schema Preflight — Process Registry and OAR Queue Foundation v1
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
  - schema-preflight
  - process-registry
  - oar-queue
  - execution-evidence
  - operational-memory
source_alignment:
  - OAR2 — Process Registry and OAR Queue Foundation v1
  - OAR Lifecycle — Execution and Handoff
  - Source Set Rule Summary — Seeded Reference Control
---

# Schema Preflight — Process Registry and OAR Queue Foundation v1

## PURPOSE

Review the schema shape required to establish governed process identity, OAR queue routing, execution evidence, and OAR1 closeout linkage.

This is schema preflight only.

No DB execution is authorized by this document.

## REQUIRED TABLES

### system_process_registry

Purpose: governed identity for repeatable process bodies.

Core fields:

- process_key text unique not null
- process_title text not null
- process_family text not null
- process_scope text not null
- process_status text not null
- authority_level text not null
- source_reference_set jsonb not null default '[]'
- required_oar_type text not null
- requires_operator_confirm boolean not null default true
- requires_preflight boolean not null default true
- requires_oar1_closeout boolean not null default true
- created_at timestamptz not null default now()
- updated_at timestamptz not null default now()

Allowed process_status:

- draft
- active
- paused
- retired
- blocked

Allowed required_oar_type:

- oar1
- oar2
- both

### system_oar_queue

Purpose: governed execution queue for OAR-routed actions.

Core fields:

- queue_key text unique not null
- process_key text not null references system_process_registry(process_key)
- oar_key text not null
- oar_type text not null
- queue_status text not null
- operator_key text not null
- system_key text not null
- scope_key text not null
- requested_action text not null
- execution_boundary text not null
- preflight_status text not null default 'required'
- operator_confirmed_at timestamptz
- execution_started_at timestamptz
- execution_completed_at timestamptz
- blocked_reason text
- refusal_reason text
- oar1_path text
- created_at timestamptz not null default now()
- updated_at timestamptz not null default now()

Allowed queue_status:

- draft
- queued
- preflight_required
- awaiting_operator_confirm
- approved_for_execution
- executing
- blocked
- refused
- completed
- closed

Allowed preflight_status:

- required
- passed
- failed
- waived

Waived should remain exceptional and operator-bound.

### system_oar_execution_evidence

Purpose: proof surface tied to queue execution.

Core fields:

- evidence_key text unique not null
- queue_key text not null references system_oar_queue(queue_key)
- evidence_type text not null
- evidence_summary text not null
- validation_query text
- validation_result jsonb
- artifact_path text
- commit_hash text
- created_at timestamptz not null default now()

Allowed evidence_type:

- file_check
- db_query
- migration_result
- git_commit
- operator_review
- runtime_validation
- refusal_record

## HARD CONSTRAINT CHECKS

Before execution, migration must enforce:

- No queue closure without oar1_path.
- No execution without operator_confirmed_at.
- No execution without preflight_status = passed.
- No closed queue without execution evidence.
- No queue without linked process_key.
- No automatic transition from queued to executing.

## NOTCHAZZ FLAGS TO AVOID

Do not add:

- frontend exposure
- public read policy
- automatic worker execution
- AI-authored queue approval
- runtime authority computation
- slug-based identity
- unbounded jsonb authority

JSONB is acceptable for source_reference_set and validation_result, not as the authority body for process logic.

## RECOMMENDED NEXT OAR2 EXECUTION SCOPE

One migration only:

- Create system_process_registry
- Create system_oar_queue
- Create system_oar_execution_evidence
- Add check constraints
- Add foreign keys
- Add indexes
- No RLS policy yet
- No seed rows yet unless separately confirmed

## STANDING

schema_preflight_green_with_boundaries

## CLOSE

Process identity, queue routing, and execution proof must be governed before automation can exist.

Codex holds.
Field structures.
Measures registers.
Chazz routes.
Cody executes only after valid OAR2.

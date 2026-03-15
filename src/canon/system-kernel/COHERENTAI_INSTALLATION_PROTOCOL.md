---
title: CoherentAI Installation Protocol
slug: coherentai-installation-protocol
document_type: protocol
document_scope: kernel
document_status: active
authority_level: structural
canonical: true
event_required: true
related_pillar: measures
related_system: coherentai
source_origin: codex architecture
last_reviewed: 2026-03-14
version: 1.0
tags:
  - coherentai
  - kernel
  - installation
  - protocol
  - oar
  - queue
source_bucket: codex-vault
source_folder: system-kernel
summary: Defines the execution protocol for installing, testing, and evolving system components through CoherentAI. Procedural counterpart to the System Map.
---
# CoherentAI Installation Protocol
Operational Procedure for c3 Field

This document defines the **execution protocol for installing, testing, and evolving system components through CoherentAI**.

It is procedural and implementation-focused.

Where `COHERENTAI_SYSTEM_MAP.md` defines architecture, this file defines **how work enters and moves through the system**.

---

# 1. Installation Philosophy

CoherentAI is not a free-form agent.

It operates as a **governed execution kernel**.

All installation work must pass through structured request flow:

Request
→ Dispatcher
→ Anti-Drift Guard
→ Decision Resolution
→ Execution Engine
→ Guard Event Log
→ OAR Log


No installation logic should bypass this path.

---

# 2. Installation Request Queue

Installation work must originate as **queue objects**.

The queue is the authoritative source of pending installation tasks.

Example table:

coherent_request_queue


Minimum fields:

- id
- pillar
- task_type
- user_request
- object_ref
- container_ref
- requested_action
- candidate_layers
- target_files
- status
- priority
- source
- context
- created_at

Statuses may include:

pending
processing
approved
redirected
blocked
completed
failed
cancelled


The worker always pulls from this queue.

---

# 3. Installation Request Structure

Every request must contain enough context for the guard to classify authority.

Example:

```json
{
  "pillar": "measures",
  "taskType": "me-setup",
  "objectRef": "me_i",
  "containerRef": "codexstone",
  "requestedAction": "Resolve runtime media and connect component rendering path.",
  "candidateLayers": [
    "measures_media",
    "v_measures_media_resolved",
    "measures_registry"
  ]
}

Important fields:

objectRef

The primary object the request concerns.

containerRef

The axis container of the object.

Example:
Codexstone → container
ME I → object

candidateLayers

Possible authority domains.

The guard resolves which one actually governs the request.

4. Worker Execution

The worker performs installation execution.

Responsibilities:

1. claim next pending request

2. mark request as processing

3. dispatch request

4, record outcome

5. update queue status

Worker must never execute installation logic directly.

It must always pass through dispatcher.

4. Worker Execution

The worker performs installation execution.

Responsibilities:

claim next pending request

mark request as processing

dispatch request

record outcome

update queue status

Worker must never execute installation logic directly.

It must always pass through dispatcher.

5. Dispatcher Responsibilities

Dispatcher coordinates execution.

Dispatcher must:

receive installation request

call anti-drift guard

refuse execution if authority cannot be resolved

attach coherence contract

forward governed envelope to execution engine

Dispatcher never invents authority.

Dispatcher routes through authority.

6. Anti-Drift Guard

The guard determines whether a request is safe and where it belongs.

Guard must determine:

what layer the request belongs to

what table or view has authority

what paths are forbidden

what decision already governs it

what execution contract applies

Output is a Coherence Contract.

7. Coherence Contract

Example structure:
{
  "status": "approved",
  "layer": "runtime_media",
  "authority": {
    "primaryTable": "measures_media",
    "resolvedView": "v_measures_media_resolved"
  },
  "forbiddenPaths": [
    "canon_artifact",
    "public_url"
  ],
  "executionContract": {
    "resolverRequired": true,
    "componentDirectResolutionForbidden": true
  }
}
8. SQL Execution Modes

SQL execution is divided into three governance modes.

CONNECT Mode (Read)

Allowed:

SELECT
EXPLAIN

Used for:

inspection

indexing

validation

reasoning

No state mutation allowed.

CONTRIBUTE Mode (Write)

Allowed:

INSERT
UPDATE
UPSERT

Used for:

queue updates

guard logs

OAR logs

runtime data mutation

Schema mutation not allowed.

CREATE Mode (Migration)

Allowed:

CREATE
ALTER
governed migration actions

Used for:

tables

views

schema evolution

This mode is not normal CoherentAI execution domain.

CoherentAI may:

propose migrations

analyze schema needs

validate migration plans

generate migration artifacts

Actual execution must pass through the Governed Migration Gate.

9. Governed Migration Gate

Migration-level operations require additional authority.

Before executing schema mutation, the gate must verify:

migration classification is correct

environment allows migration

approval record exists

SQL mode is explicitly CREATE

execution path is migration-only

Without passing this gate, migration execution must be blocked.

10. Execution Engine

The execution engine performs the action permitted by the coherence contract.

Responsibilities:

perform safe execution

respect execution constraints

route SQL through correct adapter

return execution result

Execution engine must never operate without a coherence contract.

11. Guard Event Logging

Every installation request must write a guard event.

Example fields:

request_id

pillar

task_type

object_ref

container_ref

requested_action

resolved_layer

authority_table

authority_view

blocked_paths

decision_refs

drift_signals

status

reason

This preserves the anti-drift memory of the system.

12. OAR Logging

Every meaningful execution should produce OAR trace.

Objective → Action → Result

Example OAR entry:

Objective:
Resolve ME I runtime media authority through categorized storage layer.

Action:
Resolved authority through v_measures_media_resolved.
Redirected request away from canon-adjacent candidates.

Result:
ME I stabilized in runtime media layer.
Component rendering restricted to hook-based resolution.

OAR logs provide system memory of meaningful actions.

13. Codexstone Container Rule

Marble MEs exist within the Codexstone axis container.

Installation requests involving MEs should include:

containerRef = codexstone

This ensures MEs are interpreted as container-bound governance forms.

14. Install-1 Test Strategy

Install-1 should validate the kernel using a single controlled test.

Recommended first test:

ME I runtime resolution

Steps:

create request queue row

run worker

guard classifies request

coherence contract returned

execution completes

guard event written

OAR log written

Success criteria:

request processed correctly

drift prevented

authority correctly resolved

logs created

15. Drift Prevention Rules

The following must never occur:

component acting as authority

direct storage URL bypass

canon artifact used as runtime source

migration executed without governance

request executed without guard contract

These conditions must result in block or redirect.

16. Installation Completion Criteria

An installation task is considered complete only when:

execution succeeded

guard event written

OAR log written

queue status updated

no unresolved drift signals remain

17. Final Principle

CoherentAI does not invent system truth.

It executes within the boundaries defined by:

canonical database authority

decision ledger

governed migration rules

installation protocol

This ensures the system evolves without losing coherence.


---


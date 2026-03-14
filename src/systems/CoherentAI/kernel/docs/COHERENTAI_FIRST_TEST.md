# CoherentAI First Test
**Install-1 / Measures / ME-I Runtime Resolution**

This document defines the **first live installation test** for CoherentAI.

The purpose of this test is not to complete the full Measures system.

The purpose is to verify that the **CoherentAI kernel path is alive and coherent**:


Request Queue
→ Worker
→ Dispatcher
→ Anti-Drift Guard
→ Decision Resolution
→ Execution Engine
→ Guard Event Log
→ OAR Log

# CoherentAI First Test
**Install-1 / Measures / ME-I Runtime Resolution**

This document defines the **first live installation test** for CoherentAI.

The purpose of this test is not to complete the full Measures system.

The purpose is to verify that the **CoherentAI kernel path is alive and coherent**:

```text
Request Queue
→ Worker
→ Dispatcher
→ Anti-Drift Guard
→ Decision Resolution
→ Execution Engine
→ Guard Event Log
→ OAR Log

1. Test Identity
Test Name

ME-I Runtime Resolution

Installation Phase

Install-1

Pillar

measures

Object

ME I

Container

codexstone

Purpose

Prove that CoherentAI can process one real Measures request through the full governed execution path without drift.

2. Test Objective

Resolve the authoritative runtime path for ME I using the canonical Measures media layer, while preserving:

container relationship to Codexstone

anti-drift guard enforcement

decision-ledger authority

OAR trace

queue-based execution

This test does not attempt to complete all ME wiring.

It proves the kernel and protocol on one governable unit.

3. Preconditions

Before running this test, the following must already exist:

Required tables

coherent_request_queue

coherent_decision_ledger

coherent_guard_event

coherent_oar_log

Required Measures sources

measures_media

v_measures_media_resolved

measures_registry

Required system code

worker

dispatcher

anti-drift guard

execution engine

Required decision

A binding decision must exist for Measures runtime media resolution.

Example decision key:

measures_runtime_media_resolution
4. Test Request Shape

The first test request should be structurally explicit.

Canon request envelope
{
  "pillar": "measures",
  "taskType": "me-setup",
  "userRequest": "Resolve ME I through canonical runtime media and installation flow.",
  "objectRef": "me_i",
  "containerRef": "codexstone",
  "requestedAction": "Resolve authoritative media layer, enforce hook-based rendering path, and write guard and OAR trace.",
  "targetFiles": [
    "src/pillars/measures/components",
    "src/pillars/measures/data/hooks"
  ],
  "candidateLayers": [
    "measures_media",
    "v_measures_media_resolved",
    "measures_registry",
    "canon_artifact"
  ]
}

Including canon_artifact as a candidate layer is intentional in this first test.

It allows the anti-drift guard to prove that it can detect and redirect canon-adjacent drift.

5. Queue Insert

Insert the request into the installation queue.

insert into public.coherent_request_queue (
  pillar,
  task_type,
  user_request,
  object_ref,
  container_ref,
  requested_action,
  target_files,
  candidate_layers,
  requested_by,
  source,
  priority,
  context
)
values (
  'measures',
  'me-setup',
  'Resolve ME I through canonical runtime media and installation flow.',
  'me_i',
  'codexstone',
  'Resolve authoritative media layer, enforce hook-based rendering path, and write guard and OAR trace.',
  array[
    'src/pillars/measures/components',
    'src/pillars/measures/data/hooks'
  ],
  array[
    'measures_media',
    'v_measures_media_resolved',
    'measures_registry',
    'canon_artifact'
  ],
  'Stephanie Joanne',
  'install',
  10,
  '{
    "installation":"install_1",
    "test_name":"ME-I Runtime Resolution",
    "test_mode":true
  }'::jsonb
)
returning *;
6. Worker Run

Run the worker once.

The worker should:

claim the next pending request

mark it processing

dispatch the request

apply anti-drift guard

send governed envelope to execution engine

write logs

update final queue status

7. Expected Guard Behavior

The guard should detect that this request belongs to the Measures runtime media layer.

Expected resolved layer
runtime_media
Expected authority
primaryTable = measures_media
resolvedView = v_measures_media_resolved
Expected forbidden paths include
canon_artifact
hardcoded_url
deleted_local_registry
Expected drift signals may include
canon_candidate_detected
component_authority_leak_risk

Because canon_artifact is included in candidate_layers, the request may return:

status = redirected

This is an acceptable and desirable outcome in the first test.

Redirect means the anti-drift threshold is functioning.

8. Expected Execution Contract

The contract should indicate constraints such as:

resolver required

component direct resolution forbidden

same-pillar imports relative

allowed outputs include hook/query/component refactor

forbidden outputs include hardcoded URL and local registry revival

9. Expected Queue Outcome

After worker execution, inspect the queue row.

select *
from public.coherent_request_queue
order by created_at desc
limit 5;

Expected status progression:

pending → processing → completed

Or, depending on implementation:

pending → processing → redirected

Either is acceptable if the anti-drift logic functioned correctly and the request was not allowed to drift.

10. Expected Guard Event

Inspect most recent guard events.

select *
from public.coherent_guard_event
order by created_at desc
limit 5;

The latest row should include:

request id

pillar = measures

task type = me-setup

object ref = me_i

container ref = codexstone

resolved layer = runtime_media

authority table = measures_media

authority view = v_measures_media_resolved

decision refs

drift signals

status

reason

This proves the threshold logic is working.

11. Expected OAR Log

Inspect most recent OAR rows.

select *
from public.coherent_oar_log
order by created_at desc
limit 5;

The latest row should preserve:

Objective

Resolve ME I through canonical runtime media and governed installation flow.

Action

Classify request under runtime media.
Resolve authority via Measures media and resolved view.
Prevent canon-adjacent drift.
Require hook-based render path.

Result

ME I processed through governed execution path with preserved Codexstone container relationship and anti-drift enforcement.

This proves the system is preserving meaning, not just performing mechanics.

12. Success Criteria

The first test is successful if all of the following are true:

request row exists in queue

worker processes the request

guard resolves authoritative layer

drift is blocked or redirected correctly

coherence contract is returned

guard event is written

OAR log is written

queue row reaches final state

no direct URL bypass or canon misuse occurs

13. Failure Conditions

The first test is considered failed if any of the following occur:

request bypasses queue

guard does not resolve authority

component becomes source-of-truth resolver

canon artifact is used as runtime media source

no guard event is written

no OAR log is written

request status remains stuck in processing without result

migration-level SQL is attempted during runtime test

14. Why This Test Matters

This test validates the kernel, not just the feature.

It proves that c3 Field and CoherentAI can process a real governable installation request using:

one truth source

one guard path

one request model

one trace model

one anti-drift threshold

If this test passes, the system is ready to scale from one ME to the wider Measures installation.

15. Final Note

Do not expand the first test until this test is stable.

The purpose of Install-1 is to prove that the governed path works on a single coherent unit.

ME I is the first unit.
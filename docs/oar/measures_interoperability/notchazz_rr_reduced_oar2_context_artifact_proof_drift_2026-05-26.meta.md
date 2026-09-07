---
document_type: rr
authority_level: working
document_scope: process_boundary
title: NotChazz — Reduced OAR2 Context Caused Artifact-Proof Drift
status: resolved
version: v1
operator: op044
date: 2026-05-26
session: measures_interoperability_session_2
native_stack:
  codex: database
  field: schema
  measures: registry
  oar2: observed_aligned_routed
  chazz: systems
  cody: executor
  src: renderer
tags:
  - notchazz
  - process-hardening
  - oar2-context
  - artifact-proof
  - claude-compatibility
  - measures-interoperability
source_alignment:
  - OAR Lifecycle — Execution and Handoff
  - Active Session Transfer Surface Rule
  - OAR1 — Source Reference Schema SQL Draft v1
  - OAR1 — Source Reference Schema SQL Draft Correction v1
  - Source Reference Schema SQL Draft v1
---

# NotChazz — Reduced OAR2 Context Caused Artifact-Proof Drift

## Purpose

Document the process seam exposed during Measures Interoperability Session 2 when OAR2 context was intentionally reduced to test Claude as a Cody-compatible executor.

## Observed

The operator intentionally reduced OAR2 context to keep governance lean and avoid overwriting context.

This was a valid interoperability test.

The test produced multiple NotChazz flags:

1. Routed OAR2 review returned without OAR1 closeout.
2. OAR2 was initially placed in a sub-scope folder instead of the active session folder.
3. SQL draft artifact remained outside the active session surface after OAR1/OAR2 folder correction.
4. OAR1 claimed SQL draft corrections were complete, but artifact review showed mismatch against expected proof.

## Classification

- process hardening
- OAR2 context insufficiency
- artifact-proof drift
- external AI compatibility finding
- active session surface enforcement
- not authority drift
- not DB drift
- not runtime drift
- not CSS drift

## What Was Actually True

1. Reducing OAR2 context was a useful test.
2. Claude reasoned through the task, but did not reliably preserve lifecycle discipline when proof gates were shortened.
3. Claude treated OAR2 more like an instruction brief than an executable lifecycle contract.
4. Completion language outran artifact proof.
5. Concise OAR2 remains desirable.
6. Underspecified validation is not acceptable.

## Root Seam

OAR2 context was reduced below the threshold required for reliable external AI execution.

The missing bridge was not more governance doctrine.

The missing bridge was concrete proof language:

- expected file path
- expected evidence check
- forbidden stale markers
- expected row count or object count
- OAR1 cannot claim completion until artifact proof confirms it
- artifact must match OAR1 claims before closeout

## Claude Correction

Claude correction:

Do not treat OAR2 as a task brief.

Treat OAR2 as the executable lifecycle contract.

For any file-modifying route, OAR1 may not claim completion until artifact evidence proves the claimed correction.

Before OAR1 closeout, verify:

1. expected file exists
2. expected file path matches active session surface
3. file contains every claimed correction
4. stale values are absent
5. expected row count or object count matches the OAR1 claim
6. OAR1 does not claim completion unless file evidence confirms it

If artifact proof does not match the OAR1 claim, report incomplete state instead of writing completed status.

## Required Future OAR2 Proof Block

For any Claude-as-Cody or Cody-compatible route that modifies files, include:

Artifact evidence must match OAR1 claims.

Before writing OAR1, verify:

1. corrected file exists at expected path
2. corrected file contains each claimed correction
3. stale values no longer appear
4. expected row count or object count matches OAR1
5. OAR1 may not claim completion unless file evidence confirms it

For SQL correction routes, include targeted search checks:

- no invalid standing values remain
- required aliases exist
- required held rows exist
- unsafe public RLS is absent
- public-safe view exists if routed
- removed or dead trigger lines are absent
- expected row count matches routed correction

## Rule Hardened

Concise OAR2 is allowed.

Underspecified validation is not.

OAR2 may reduce explanation.

OAR2 may not reduce proof requirements.

## Claude Compatibility Standing

Claude remains useful for:

- review
- draft support
- comparison
- SQL planning
- source reasoning

Claude should not be treated as fully Cody-compatible executor unless OAR2 includes explicit artifact-proof validation and operator verifies file evidence before continuation.

## Process Correction

Future routing must preserve:

1. one active session
2. one transfer surface
3. one env to hold
4. OAR1 beside OAR2
5. artifact proof before completion claim
6. file check before continuation

## Close

The test was useful.

The reduced-context call exposed the seam.

Keep OAR2 lean, but never remove proof gates.

Codex holds.
Field structures.
Measures registers.
OAR2 routes.
OAR1 proves.
NotChazz protects the seam.

---
document_type: rr
authority_level: working
document_scope: process_boundary
title: NotChazz — OAR2 Folder Surface Drift
status: resolved
version: v1
operator: op044
date: 2026-05-26
session: measures_interoperability_session_2
related_oar2: docs/oar/measures_interoperability/oar2_source_reference_schema_sql_draft_v1.meta.md
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
  - transfer-surface
  - folder-boundary
  - measures-interoperability
  - source-authority
  - oar2
---

# NotChazz — OAR2 Folder Surface Drift

## Observed

OAR2 — Source Reference Schema SQL Draft v1 was initially delivered to:

`docs/oar/source_authority/oar2_source_reference_schema_sql_draft_v1.meta.md`

The work was initiated inside Measures Interoperability Session 2.

The active session transfer surface is:

`docs/oar/measures_interoperability/`

This created a second folder surface during one active session.

## Classification

- process hardening
- transfer surface drift
- folder boundary drift
- not content drift
- not authority drift
- not runtime drift
- not CSS drift

## What Was Actually True

1. The OAR2 content was valid.
2. The system scope may still be `source_authority`.
3. The file placement created unnecessary session-surface split.
4. Measures Interoperability Session 2 should hold this work in one active env.
5. The correct active folder is `docs/oar/measures_interoperability/`.

## Resolved

The OAR2 is moved to:

`docs/oar/measures_interoperability/oar2_source_reference_schema_sql_draft_v1.meta.md`

Expected OAR1 must sit beside it:

`docs/oar/measures_interoperability/oar1_source_reference_schema_sql_draft_v1.meta.md`

## Reinforcement

One active session should use one active transfer surface unless a separate folder route is explicitly confirmed.

System scope may be named in metadata.

Session execution files remain in the session folder until the set is closed.

## Hardened Rule

One active session.
One transfer surface.
One env to hold.

Sub-scope may be named in metadata, not split into a new folder unless explicitly routed.

## Claude Handoff Path

Use this path for Claude:

`docs/oar/measures_interoperability/oar2_source_reference_schema_sql_draft_v1.meta.md`

## Close

NotChazz does not prevent movement.

NotChazz prevents incoherent continuation.

Process surface corrected.

---
document_type: process_prompt
authority_level: working
document_scope: session_process
title: Session System Intelligence Capture Prompt
status: drafted
version: v1
operator: op044
date: 2026-04-07
native_stack:
  codex: database
  field: schema
  measures: registry
  chazz: systems
tags:
  - process
  - session
  - intelligence-capture
  - oar
  - validation
  - carryforward
source_alignment:
  - Process Source Seed
  - Thread-to-Transfer Validation Rule
  - Seed Concordance
---

# Session System Intelligence Capture Prompt

## Purpose

Standardize end-of-session system intelligence capture so that:

- structurally meaningful outcomes are not lost
- only validated system intelligence persists
- drift is excluded at source
- carryforward remains bounded and readable

A process exists only when route, validation, correction, and closeout are explicit and repeatable. :contentReference[oaicite:20]{index=20}

## Rule

This prompt is used before session close.

It must not be used to broadly summarize a thread.
It must not be used to preserve unresolved exploration as system truth.
It must capture only what became structurally meaningful, operationally relevant, or requires carryforward.

Thread-first review remains required before any file-form transfer. :contentReference[oaicite:21]{index=21}

## Canonical Prompt

Recover the session into a bounded system-intelligence capture aligned to the native stack:

Codex = database authority
Field = schema
Measures = registry
Chazz = systems

Do not summarize the conversation broadly.
Do not include casual drift, emotional side exchanges, or exploratory content that did not resolve.

Capture only what became structurally meaningful, operationally relevant, or requires carryforward.

Return the capture in the following sections and in this exact order:

1. Session Scope
- one short paragraph naming what the session actually accomplished

2. Recovered System Intelligence
- list only the system-level insights that were clarified, corrected, or newly surfaced
- include distinctions, role boundaries, structural truths, and native semantic corrections

3. Structural Changes
- list what changed or was seated in Codex / Field / Measures / Chazz terms
- distinguish clearly between:
  - decided
  - drafted
  - written
  - committed
  - bucketed
  - still unresolved

4. SQL / Registry Impact
- list any database, phase, registry, or release implications surfaced by the session
- do not invent SQL
- describe only what must be inserted, updated, replaced, removed, or reviewed later

5. Open Items
- include only bounded carryforward items
- no speculation
- no new ideation

## Use Condition

Use this prompt when:

- a session included structural clarification
- workflow corrections were made
- registry or process implications surfaced
- carryforward must remain precise

Do not use it for casual recap.

## Process Binding

This prompt functions as:

- a pre-closeout recovery step
- an input surface for OAR2
- a bounded source for later seed, registry, or process docs

## Close Condition

This process prompt is functioning correctly when:

- drift is excluded
- stack order is preserved
- open items remain bounded
- later recovery does not require broad thread excavation

Codex holds.
Field structures.
Measures registers.
Chazz executes.

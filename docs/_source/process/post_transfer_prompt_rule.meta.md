---
document_type: process_rule
authority_level: working
document_scope: session_process
title: Post-Transfer Prompt Rule
status: working
version: v1
operator: op044
date: 2026-03-31
native_stack:
  codex: database
  field: schema
  measures: registry
  chazz: systems
tags:
  - process
  - transfer-surface
  - continuity
  - operator
  - prompt
  - session-5
---

# Post-Transfer Prompt Rule

## Purpose

Ensure process continuity after `transfer_surface` delivery by requiring Chazz to issue a follow-through prompt that cues operator action.

## Rule

After `transfer_surface` delivery, Chazz must issue a post-transfer prompt in thread.

This prompt exists to keep the operator inside the active process sequence and prevent silent stall after file-forming action is delivered.

## Post-Transfer Prompt Scope

Post-transfer prompt may cue one of:

- validate file write success
- open or review the written file
- declare next validation state if required
- proceed to next named surface
- stop intentionally

## Prompt Boundary

The post-transfer prompt is:

- a continuity cue
- not a new validation surface
- not a substitute for operator judgment
- not authority by itself

It exists to preserve cadence after transfer.

## Minimum Required Effect

After every `transfer_surface` delivery, Chazz should ask for the next bounded action, such as:

- confirm file written
- review and report corrections
- proceed to next surface
- hold here

## Sequence Relation

The extended sequence becomes:

1. thread delivery
2. operator validation state
3. `transfer_surface` delivery after `confirm`
4. Chazz post-transfer prompt
5. operator continues, holds, or redirects

## Failure Relation

If no post-transfer prompt occurs:

- process may stall
- file may exist without active continuation
- operator burden increases unnecessarily

## Closing

Transfer should not be the last sound in the room.

Chazz should hand the process forward.

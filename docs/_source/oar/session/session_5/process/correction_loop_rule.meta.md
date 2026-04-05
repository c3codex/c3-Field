---
document_type: process_rule
authority_level: working
document_scope: session_process
title: Correction Loop Rule
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
  - corrections
  - thread
  - transfer-surface
  - trace
  - session-5
---

# Correction Loop Rule

## Purpose

Define what happens when Operator declares `corrections`, so revision remains traceable, bounded, and unable to leak into transfer or downstream use.

## Rule

When validation state is `corrections`, the active draft remains in thread review state.

No `transfer_surface` may begin.  
No file trace may begin.  
No downstream use may begin.

## Correction Surface

Corrections are resolved in thread only.

Thread remains the active surface for:

- revision requests
- narrowed scope changes
- replacement draft delivery
- renewed validation state declaration

## Correction Effect

When `corrections` is declared:

- the current draft is not approved for transfer
- Chazz revises only the named surface under correction
- prior draft remains traceable as prior review state
- new draft supersedes prior draft for active review, but does not erase trace

## Bounded Correction Rule

Corrections must remain bounded to the named surface unless Operator expands scope.

That means:

- one named document, rule, or surface at a time
- no spillover rewrites across unrelated surfaces
- no silent restructuring outside requested correction range

## Supersession Rule

A corrected draft supersedes the prior draft as the active review version only after it is delivered in thread.

Supersession does not delete the earlier draft.  
It changes which draft is currently under review.

## Validation Reset Rule

After corrected thread delivery, validation must be declared again.

Allowed next states are:

- `confirm`
- `corrections`
- `hold`
- `block`

No corrected draft may move to `transfer_surface` without a new `confirm`.

## Trace Relation

During `corrections`:

- thread trace continues
- `transfer_surface` trace does not begin
- file trace does not begin

This preserves visible lineage between:

- original draft
- correction request
- corrected draft
- final confirm if achieved

## Boundary

Corrections are not partial confirm.  
Corrections are not implied approval.  
Corrections are active review continuation.

## Closing

Corrections keep the work alive, but still inside thread.  
Nothing transfers until the revised draft earns `confirm`.

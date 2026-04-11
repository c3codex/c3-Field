---
document_type: process_definition
authority_level: working
document_scope: pre_codex_exhibition
title: Pre-Codex Exhibition Bridge — DB Confirmation
status: draft
version: v1
operator: op044
date: 2026-04-10
native_stack:
  codex: database
  field: schema
  measures: registry
  chazz: systems
tags:
  - pre-codex
  - exhibition
  - bridge
  - db-confirmation
  - preinsert
  - temporary
---

# Pre-Codex Exhibition Bridge — DB Confirmation

## Purpose

Provide the required confirmation surface before any database mutation for the temporary exhibition bridge.

## Start Standing

A temporary exhibition bridge model has been defined in thread, but no SQL has been drafted or executed yet.

## End Standing

The exact temporary bridge tables, separate bucket use, and live render read contract are confirmed in thread so SQL may be drafted safely after confirmation.

## Confirmation Points

### 1. Target Tables

Confirm that the bridge requires new temporary tables, not final SRC2 schema tables.

Expected answer:
yes

### 2. Temporary Naming

Confirm that the bridge uses separate temporary naming.

Expected answer:
yes

### 3. Separate Bucket

Confirm that the bridge uses a separate bucket.

Expected answer:
yes

### 4. Registry Boundary

Confirm that Measures registry is not used as the temporary bridge intake surface.

Expected answer:
yes

### 5. Render Contract

Confirm that the website reads from a bounded bridge read surface rather than from raw temporary tables directly.

Expected answer:
yes

### 6. Retirement Path

Confirm that this bridge is explicitly temporary and must later be retired or migrated into final contribution architecture.

Expected answer:
yes

## Proposed Temporary Surfaces

- exhibition_bridge_contribution
- exhibition_bridge_asset
- v_exhibition_bridge_render_ready

## Referenced Existing Surfaces

- Envelope continuity
- OAR1 continuity
- c3 key participant standing

## Not Used as Temporary Bridge

- measures_registry
- measures_release_state
- measures_encounter_def
- measures_transition_rule

## Validation Rule

No SQL drafting until the temporary nature, separate naming, separate bucket, registry boundary, and read-surface plan are all confirmed.

## Correction Rule

If any of the above remain unclear:

- stop
- do not draft SQL
- do not infer surface reuse
- do not place staging into registry

## Closing

Confirm the bridge as temporary first.
Then draft SQL.
Then mutate.

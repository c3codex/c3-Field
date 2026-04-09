---
document_type: process_model
authority_level: working
document_scope: implementation_control
title: Doc Incorporation State Model
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
  - incorporation-state
  - lifecycle
  - seeded
  - implementation
source_alignment:
  - Seeded Status Definition
  - Seeded Reference Preflight Rule
  - Thread-to-Transfer Validation Rule
  - Session 11 carryover recovery
---

# Doc Incorporation State Model

## Purpose

Provide an explicit lifecycle for source docs so implementation standing is visible, bounded, and non-ambiguous.

## Core States

### 1. Drafted

The document has been formed in thread or source but is not yet validated for transfer or incorporation.

### 2. Validated

The document has been reviewed in thread and operator-confirmed for transfer.

### 3. Written

The document exists as a file in source.

### 4. Committed

The document has been written and committed to repository history.

Committed preserves the file.
Committed does not automatically make it seeded.

### 5. Seeded

The document has been incorporated into active process, system behavior, code, or implementation reference and must be checked before downstream change in its relevant domain.

## Distinctions

The states are cumulative in practical workflow, but they are not synonymous.

In particular:

- written != committed
- committed != seeded

This prevents false activation of docs that are preserved but not yet governing anything.

## Operational Meaning

A document in seeded standing may function as:

- implementation reference
- process reference
- system behavior reference
- database preflight reference

A document below seeded standing may still be useful, but it does not govern mutation review.

## Separation Requirement

Seeded and unseeded docs must remain distinguishable.

That separation may later resolve through:

- metadata
- index surfaces
- folder separation
- manifests
- or combined methods

This model does not force the implementation method yet.
It establishes the required distinction.

## Recommended Future Metadata

Later review may seat fields such as:

- incorporation_state: drafted | validated | written | committed | seeded
- seeded_date
- seeded_by
- seed_scope

These are not seated here as schema.
They are named as future implementation candidates.

## Close Condition

This model is functioning correctly when:

- doc standing is visible
- seeded and unseeded are not mixed invisibly
- DB and implementation review can distinguish preserved docs from governing docs

Codex holds.
Field structures.
Measures registers.
Chazz executes.

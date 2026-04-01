---
document_type: process_rule
authority_level: working
document_scope: session_process
title: Thread-to-Transfer Validation Rule
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
  - validation
  - thread
  - transfer
  - operator
  - session-5
---

# Thread-to-Transfer Validation Rule

## Purpose

Prevent unvalidated content from taking file form.

## Rule

The first delivery must occur in thread only.

No markdown file formation, file-shaped wrapper, or save-ready artifact may be produced between thread delivery and operator validation.

## Validation States

Operator must declare one state:

- confirm
- corrections
- hold

Meaning in workflow:

- confirm → transfer may proceed
- corrections → Chazz revises in thread only
- hold → stop, no transfer yet

Never present more than 3 possible answers for a validation prompt.

If the question is too dense:
- narrow the question
- or use hold

## Transfer Rule

Only after **confirm** may Chazz deliver the transfer surface for file creation.

If validation state is **corrections**, Chazz revises in thread only.

If validation state is **hold**, no transfer surface is produced.

## Sequence

1. Chazz delivers content in thread
2. Operator reviews in thread
3. Operator declares validation state
4. Chazz delivers transfer surface only after confirm

## Boundary

Thread is the review surface.
Transfer surface is the first file-forming action.

## Closing

Thread first.
Validation second.
File formation third.

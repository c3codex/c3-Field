---
document_type: process_definition
authority_level: working
document_scope: implementation_control
title: Seeded Status Definition
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
  - seeded
  - incorporation
  - implementation
  - reference-control
source_alignment:
  - Process Source Seed
  - Thread-to-Transfer Validation Rule
  - Session 11 carryover recovery
---

# Seeded Status Definition

## Purpose

Define when a doc or doc set stops being merely written or committed and becomes a valid upstream reference surface for implementation, system incorporation, code behavior, or database change review.

## Definition

A doc or doc set is **seeded** when it has moved beyond drafting and has been:

- validated in workflow
- written to source
- committed
- incorporated into active process, system behavior, code, or implementation reference
- recognized as an upstream reference surface for downstream action

Seeded does not mean:

- discussed in thread only
- confirmed in thread only
- written to disk only
- committed only
- uploaded only

Seeded means the document now participates in the live structural body that downstream changes must check against before alteration proceeds.

## Distinction

Two categories must remain distinct:

- **unseeded** = working, draft, proposed, not yet incorporated
- **seeded** = incorporated, reference-bearing, required for downstream review

Committed and seeded are not the same standing.

A repository may contain committed docs that are not yet structurally active.

## Use Condition

Apply seeded standing when the document or doc set has become part of:

- active process
- system behavior
- implementation logic
- code-facing reference
- database-facing reference review

If it has not reached one of those conditions, it remains unseeded.

## Structural Implication

Seeded standing creates a necessary control distinction between:

- good docs
- preserved docs
- active reference docs

Only the third category is allowed to govern downstream implementation review.

## Close Condition

This definition is functioning correctly when:

- seeded and unseeded docs are not conflated
- committed docs are not treated as automatically active
- downstream mutation review can identify which references govern change

Codex holds.
Field structures.
Measures registers.
Chazz executes.

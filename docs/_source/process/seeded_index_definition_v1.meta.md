---
document_type: process_definition
authority_level: working
document_scope: implementation_control
title: Seeded Index Definition
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
  - index
  - implementation
  - reference-control
source_alignment:
  - Seeded Status Definition
  - Seeded Reference Preflight Rule
  - Source Set Rule Summary — Seeded Reference Control
---

# Seeded Index Definition

## Purpose

Provide a single reference surface for all docs currently in seeded standing.

The Seeded Index answers one governing question:

What governs change right now?

It is not folder-based authority.
It is not implied by commit history.
It is an explicit reference surface.

## Definition

A Seeded Index is a structured list of all docs currently in seeded standing and therefore valid as active upstream reference surfaces for implementation review, system change, code-facing reference, or database preflight.

If a doc is not in the Seeded Index, it may not govern downstream mutation review.

## Properties

The Seeded Index must be:

- explicit
- readable
- checkable
- append-aware
- version-aware
- domain-groupable

The index may later be machine-usable, but this definition establishes human-readable control first.

## Minimum Fields

Each seeded entry should include at minimum:

- doc_path
- title
- version
- seeded_date
- seed_scope
- replaces (optional)
- status: active | deprecated

## Domain Grouping

Entries may be grouped by domain, including:

- process
- chamber
- registry
- system
- SQL / database
- implementation

Grouping must not override the primary rule:
seeded standing is determined by incorporation, not by folder alone.

## Rule

If it is not in the Seeded Index, it is not allowed to govern DB change.

## Close Condition

This definition is functioning correctly when:

- active reference docs can be identified in one place
- seeded standing is not inferred from memory
- DB preflight can reference the governing set directly

Codex holds.
Field structures.
Measures registers.
Chazz executes.

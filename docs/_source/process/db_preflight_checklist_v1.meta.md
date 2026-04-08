---
document_type: process_checklist
authority_level: working
document_scope: implementation_control
title: DB Preflight Checklist
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
  - database
  - preflight
  - seeded
  - implementation-control
source_alignment:
  - Seeded Reference Preflight Rule
  - Seeded Index Definition
  - Seed Event Process
---

# DB Preflight Checklist

## Purpose

Provide an explicit review sequence before any database insert, update, replace, removal, or schema-impacting review proceeds.

This checklist exists to prevent mutation from proceeding against unclear, unseeded, or conflicting reference surfaces.

## Preflight Checklist

Before any DB change:

1. identify the affected domain
2. open the Seeded Index
3. locate the relevant seeded docs
4. confirm each governing doc is:
   - present in the index
   - marked active
5. check for newer unseeded docs in the same domain
6. resolve any conflict before proceeding
7. only then begin DB review or mutation

## Failure States

Stop execution if any of the following is true:

- no seeded reference is found
- multiple conflicting seeded references exist
- a newer unseeded doc exists but remains unresolved
- seeded standing is unclear
- the reference set cannot be confidently identified

## Required Outcome

DB change review must begin from an explicit seeded reference set.

No thread memory.
No folder assumption.
No draft authority.
No silent substitution.

## Scope

Use this checklist before:

- inserts
- updates
- replacements
- removals
- schema-impacting review
- implementation changes that rely on source docs already in circulation

## Close Condition

This checklist is functioning correctly when:

- database review starts from seeded references
- active reference surfaces are visible
- unresolved docs cannot silently govern change

Thread first.
Validation second.
Commit preservation third.
Seeded index check before mutation.

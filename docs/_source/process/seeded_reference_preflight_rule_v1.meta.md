---
document_type: process_rule
authority_level: working
document_scope: implementation_control
title: Seeded Reference Preflight Rule
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
  - preflight
  - database
  - implementation-control
  - validation
source_alignment:
  - Seeded Status Definition
  - Process Source Seed
  - Session 11 carryover recovery
---

# Seeded Reference Preflight Rule

## Purpose

Prevent database mutation, schema-impacting review, or implementation change from proceeding against incomplete, drifting, or merely committed working docs.

## Rule

Before any database insert, update, replace, removal, or schema-impacting review occurs, the relevant **seeded reference surfaces** must be checked first.

Working docs, drafted docs, recently committed docs, and thread memory do not count as seeded unless they have been explicitly incorporated into active implementation standing.

## Meaning

Database change review must not proceed from:

- thread recollection
- unseeded drafts
- merely committed docs
- generalized folder assumptions
- mixed sets where seeded standing is unclear

It must proceed from seeded references.

## Preflight Sequence

1. identify the affected domain
2. identify the relevant seeded docs
3. confirm those seeded docs are the active reference set
4. check whether newer unseeded docs exist that must be resolved first
5. only then review or execute the database change

## Failure Condition

If seeded references are not identified before DB action:

- mutation review is incomplete
- implementation standing is unsafe
- correction must occur before proceeding

## Scope

This rule applies before:

- database inserts
- database updates
- replacements
- removals
- schema review
- implementation changes that depend on source docs already in circulation

## Close Condition

This rule is functioning correctly when:

- DB review starts from seeded references
- unseeded docs cannot silently govern change
- implementation review has a visible upstream reference base

Thread first.
Validation second.
Commit preservation third.
Seeded reference check before mutation.

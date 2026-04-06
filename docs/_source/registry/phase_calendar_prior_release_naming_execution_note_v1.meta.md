---
document_type: process_note
authority_level: working
document_scope: execution_route
title: Phase Calendar Prior Release Naming Execution Note
status: draft
version: v1
operator: op044
date: 2026-04-05
native_stack:
  codex: database
  field: schema
  measures: registry
  chazz: systems
tags:
  - process
  - execution
  - supabase
  - prior_release
  - naming
  - session9
---

# Phase Calendar Prior Release Naming Execution Note

## Purpose

Record the execution route for correcting prior release naming in `measures_phase_calendar`.

## Route

The correct execution surface for this step is:

- Supabase SQL editor

The correct file formation surface remains:

- PowerShell

## Execution Sequence

1. deliver naming correction in thread
2. operator confirms thread delivery
3. form file set locally
4. confirm file check and git commit
5. execute SQL in Supabase
6. verify updated rows in thread
7. continue cadence work only after naming correction holds

## SQL Correction Scope

The SQL step must include:

- update of standing_type from legacy_preserved to phased_ritual_release
- update of affected existing row values
- update of affected phase_key values to phased_ritual_release naming
- verification that no legacy-based naming remains in the phase calendar standing layer

## Boundary

This correction does not redefine Legacy in Codex.

It preserves native distinction by removing incorrect use of Legacy language from Measures phase standing.

## Closing

The database correction occurs in Supabase.  
The documents are formed through transfer surface.  
The thread remains the first review surface.


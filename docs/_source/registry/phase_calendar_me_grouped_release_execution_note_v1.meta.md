---
document_type: process_note
authority_level: working
document_scope: execution_route
title: Phase Calendar ME Grouped Release Execution Note
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
  - me
  - grouped_release
  - session9
---

# Phase Calendar ME Grouped Release Execution Note

## Purpose

Define execution route for inserting grouped ME phase rows.

## Route

- thread delivery -> confirm -> PS -> commit -> Supabase SQL -> verify

## Insert Shape

Each group inserts one row:

- phase_family = me
- standing_type = phased_ritual_release
- anchor_name = full_moon
- notes contain grouped ME set

## Boundary

- no individual ME rows inserted
- no cadence logic introduced
- no axis collapse

## Closing

Grouping resolves constraint without compromising structure.

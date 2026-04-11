---
document_type: process_definition
authority_level: working
document_scope: process
title: Process — Scheduled Release Precheck
status: draft
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
  - release
  - calendar
  - validation
  - measures
---

# Process — Scheduled Release Precheck

## Purpose

Provide the required pre-release confirmation route before any scheduled group activation.

## Start Standing

A scheduled release group is seated in registry, but no release update has been executed.

## End Standing

The group is confirmed eligible for release or confirmed ineligible and left unchanged.

## Touchpoint Sequence

1. Confirm target schedule key
2. Confirm matching `measures_phase_calendar.phase_key`
3. Confirm `is_active = true`
4. Confirm `anchor_date <= current_date`
5. Only then run the release update block
6. Verify through release surface view

## Validation Rule

A scheduled release is valid only when:
- schedule key matches
- calendar row is active
- anchor date has arrived

## Correction Rule

If any calendar condition is false:
- stop
- do not release
- do not widen scope
- leave rows in current standing

## Closeout Rule

Close only after verification through:
- registry state
- effective release state
- release surface renderability

## Session 10 Recovery Note

This process was seated after grouped release logic was proven insufficient without calendar eligibility.

## Closing

Grouped does not mean eligible.
Calendar governs release.

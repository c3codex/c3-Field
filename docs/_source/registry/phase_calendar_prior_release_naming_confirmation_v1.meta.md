---
document_type: validation_meta
authority_level: working
document_scope: measures_phase_validation
title: Phase Calendar Prior Release Naming Confirmation
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
  - phase_calendar
  - prior_release
  - confirmation
  - validation
  - session9
---

# Phase Calendar Prior Release Naming Confirmation

## Purpose

Confirm that the identified legacy-based naming inside `measures_phase_calendar` should be corrected before further phase population work continues.

## Confirmed Current Rows

Observed current rows:

- `gate_1_legacy`
- `gate_2_legacy`
- `epithet_legacy_first_3`

Observed current standing type:

- `legacy_preserved`

Observed meaning of those rows:

- preserved standing from a functional earlier Measures release
- retained during cadence reseating
- not Codex Legacy objects

## Confirmation Conditions

This correction is required because:

- native **Legacy** already carries a defined meaning in the system
- phase standing should not reuse Codex object language
- current row naming introduces semantic bleed across layers
- the original release was functional and should be preserved truthfully
- current work is cadence reseating, not invalidation or restart

## Confirmed Replacement

### standing_type

Confirmed replacement:

- `phased_ritual_release`

### phase_key replacements

Confirmed replacements:

- `gate_1_phased_ritual_release`
- `gate_2_phased_ritual_release`
- `epithet_first_3_phased_ritual_release`

## Execution Boundary

This correction must proceed in bounded order:

1. thread review
2. operator confirmation
3. file formation and commit
4. Supabase constraint and row update
5. post-update verification in thread

## Closing

This confirmation clears the naming correction for execution preparation.


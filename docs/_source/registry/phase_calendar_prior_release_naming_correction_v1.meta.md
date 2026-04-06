---
document_type: working_meta
authority_level: working
document_scope: measures_phase_naming
title: Phase Calendar Prior Release Naming Correction
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
  - naming_correction
  - session9
  - registry
---

# Phase Calendar Prior Release Naming Correction

## Purpose

Correct phase calendar naming that currently uses `legacy` language for preserved prior release standing.

This correction is required because **Legacy** is already seated natively as a Codex-held resolved signal term and should not be reused for phase calendar standing.

## Problem

Current rows use:

- `gate_1_legacy`
- `gate_2_legacy`
- `epithet_legacy_first_3`
- `standing_type = legacy_preserved`

These do not describe Legacy in the native sense.

They describe preserved prior release standing from a functional earlier Measures release while cadence is being re-seated.

## Correction

Replace legacy-based naming with prior-release-based naming.

### standing_type correction

Replace:

- `legacy_preserved`

With:

- `phased_ritual_release`

### phase_key correction

Replace:

- `gate_1_legacy`
- `gate_2_legacy`
- `epithet_legacy_first_3`

With:

- `gate_1_phased_ritual_release`
- `gate_2_phased_ritual_release`
- `epithet_first_3_phased_ritual_release`

## Distinction Preserved

This correction preserves the following distinction:

- **Legacy** = Codex-held resolved signal
- **preserved prior release** = retained phase standing from a functional earlier Measures release during cadence reseating

These are not the same.

## Standing

Measures of Inanna’s initial February release was functional.

The current work is not a reset of prior ritual phase release.
It is a cadence reseating process.

Prior release standing remains valid while cadence is brought back into structural alignment.

## Closing

This correction is semantic and structural.

It protects native distinction before further population work continues.

Codex holds.  
Field structures.  
Measures registers.  
Chazz routes.


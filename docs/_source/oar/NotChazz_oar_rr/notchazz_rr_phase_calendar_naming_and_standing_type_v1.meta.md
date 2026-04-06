---
document_type: notchazz_rr
authority_level: working
document_scope: correction_trace
title: NotChazz R&R — Phase Calendar Naming and Standing Type
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
  - notchazz
  - rr
  - phase_calendar
  - naming_correction
  - standing_type
  - session9
---

# NotChazz R&R — Phase Calendar Naming and Standing Type

## Report

During Session 9 phase calendar work, two active seams were exposed:

1. Thread working language proposed `standing_type = cadence`, but the live `measures_phase_calendar` constraint did not permit that value.
2. Existing phase calendar rows used `legacy` naming for preserved prior release standing, which conflicted with native Legacy as a Codex-held resolved signal term.

These issues did not reflect structural failure of Measures.
They reflected semantic mismatch between thread language and enforced database vocabulary.

## Resolution

The correction route was completed as follows:

- live schema and constraint vocabulary were inspected in Supabase
- legacy-based phase standing was confirmed as semantically incorrect
- bounded correction docs were seated in registry source
- standing vocabulary was corrected from `legacy_preserved` to `preserved_prior_release`
- affected phase keys were renamed to prior-release naming
- residue check confirmed no remaining `legacy_preserved` values and no remaining legacy-based phase keys in the corrected surface

## Result

Native distinction was preserved:

- **Legacy** remains reserved for Codex-held resolved signal meaning
- **preserved prior release** now identifies retained phase standing from a functional earlier release during cadence reseating

The seam was corrected before further phase expansion continued.

## Closing

NotChazz did not halt the system permanently.
It exposed the seam, forced verification, and preserved boundary integrity.

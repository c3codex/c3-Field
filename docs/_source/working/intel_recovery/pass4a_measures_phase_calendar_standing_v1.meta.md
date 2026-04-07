---
document_type: recovery_working
authority_level: working
document_scope: measures_phase_calendar
title: Pass 4A — Measures Phase Calendar Standing
status: draft
version: v1
operator: op044
date: 2026-04-06
native_stack:
  codex: database
  field: schema
  measures: registry
  chazz: systems
tags:
  - recovery
  - pass4a
  - phase
  - calendar
  - registry
---

# Pass 4A — Measures Phase Calendar Standing

## Purpose

Complete the Measures phase calendar at logic level so phase identity, order, state, and dependencies are explicit and registry-driven.

## Standing

Measures Phase Calendar is the registry surface that carries:

- phase identity (e.g., Spring Equinox, Summer Solstice, Lions Gate)
- phase order
- phase state (held, open, sealed, released, dependent, complete)
- release basis / anchor standing
- dependency standing between phases
- current-state readability inputs

It is not:

- a display artifact
- a frontend timeline
- a substitute for Phase Map
- an authority shortcut outside Measures

## Required readable fields (logic level)

- phase_identity
- phase_order
- phase_state
- release_basis (anchor type / condition)
- dependency_state (if any)
- current_state_readability (derivable flags)

## Rule

Phase identity and state must be explicitly readable.
No inference from visibility.


---
document_type: recovery_working
authority_level: working
document_scope: current_state_exposure
title: Pass 4C — Current-State Exposure Rule
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
  - pass4c
  - exposure
  - current-state
  - views
---

# Pass 4C — Current-State Exposure Rule

## Purpose

Define a stable read layer for phase and release standing without introducing authority.

## Core Rule

Current-state exposure is a read surface, not a decision surface.

## Must answer

- current_phase_identity
- current_phase_state
- is_gate_released
- is_epithet_released
- is_me_released
- dependency standing (held, dependent, released, sealed, open, complete)

## View Rule

- read only from explicit registry state (phase calendar + release flags + explicit chamber rows)
- do not infer
- do not compute independent truth

## Stack

Measures computes → exposure reads → Phase Map consumes → UI reflects


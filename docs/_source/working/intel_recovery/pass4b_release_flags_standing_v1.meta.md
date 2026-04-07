---
document_type: recovery_working
authority_level: working
document_scope: release_flags
title: Pass 4B — Explicit Release Flags Standing
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
  - pass4b
  - release
  - flags
  - registry
---

# Pass 4B — Explicit Release Flags Standing

## Purpose

Ensure reveal is registry-driven and never inferred from visibility.

## Standing

Release flags must be explicit and separable from phase visibility.

At minimum, Measures must expose:

- is_gate_released
- is_epithet_released
- is_me_released

## Rule

Release is explicit by family.
Visibility must not be used to infer release.

## Implication

Insertion does not equal release.
Existence does not equal visibility.
Release flags govern reveal.


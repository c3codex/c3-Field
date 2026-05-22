---
document_type: oar2
authority_level: working
document_scope: measures_registry_sitewide_runtime
title: OAR2 — Audit Measures Registry Sitewide Runtime Contract
status: proposed
version: v1
operator: op044
system: measures_registry
executor_candidate:
  - claude_vs
tags:
  - oar2
  - measures-registry
  - sitewide-contract
  - runtime-contract
  - style-contract
  - audit
  - codex-first
---

# OAR2 — Audit Measures Registry Sitewide Runtime Contract

## OBSERVED

Measures Registry surfaces have improved through bounded corrections, but recurring drift shows the site lacks a seated sitewide runtime/style contract.

Observed drift includes:

- encounter-level styling decisions
- inconsistent material inheritance
- legacy copy/constants still active
- result surface not isolated as its own encounter
- media behavior inconsistent across surfaces
- branding applied surface-by-surface
- viewport fit not governed globally
- footer/copyright not seated sitewide

The current runtime should not be discarded. It contains working logic, media resolution, evaluation flow, Supabase wiring, material tokens, and seated corrections.

## ALIGNED

Do not rebuild from zero.

Audit the current runtime to determine:

- what should be preserved
- what should be centralized under a sitewide contract
- what should be retired as legacy/local override
- what must become encounter-specific contract
- what must become global Measures Registry style/runtime law

This audit must read BOTH:

- frontend/runtime implementation
- seated DB/metadata contracts

Codex -> Field -> Measures -> Chazz -> Executor -> src remains authority order.

## ROUTED

Audit the current Measures Registry runtime and seated DB contracts for:

1. typography contract
2. color/material contract
3. button/icon contract
4. media behavior contract
5. marble tone behavior
6. desktop/mobile viewport fit
7. encounter containment rules
8. branding/registry mark usage
9. footer/copyright placement
10. runtime state isolation
11. encounter transition behavior
12. hardcoded copy/constants
13. reusable components to preserve
14. legacy branches to retire
15. required DB/metadata contract surfaces

### Required DB Contract Review

Inspect and compare runtime behavior against seated DB contracts for:

- measures_encounter_def metadata contracts
- styling_contract usage
- assessment_completion metadata
- assessment_interpretation metadata
- media_roles
- actions
- measures_media_map roles
- measures_design_token usage if present
- release/access state where relevant

Do not rely only on src inspection.

Compare runtime behavior against Codex-seated contracts.

## DO NOT

- rewrite runtime
- remove current working logic
- redesign surfaces
- patch CSS
- alter DB state
- implement new contracts
- change routing
- collapse encounter contracts into one renderer branch

## RETURN

Report:

- files inspected
- DB contracts inspected
- current reusable runtime assets
- current drift sources
- hardcoded constants still active
- sitewide contract fields required
- encounter contracts required
- what to preserve
- what to retire
- recommended implementation order

## SUCCESS CONDITION

The system has a clear preflight map for seating the Measures Registry sitewide runtime/style contract before further encounter work.

## EXPECTED OAR1

`docs/oar/measures_registry/oar1_audit_measures_registry_sitewide_runtime_contract_v1.meta.md`

## CLOSE

Audit first.

Seat contract second.

Refactor third.

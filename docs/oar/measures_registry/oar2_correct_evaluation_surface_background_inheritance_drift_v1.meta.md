---
document_type: oar2
authority_level: working
document_scope: measures_registry_frontend
title: OAR2 — Correct Evaluation Surface Background Inheritance Drift
status: proposed
version: v1
operator: op044
system: measures_registry
source_oar1: docs/oar/measures_registry/oar1_audit_evaluation_surface_background_inheritance_drift_v1.meta.md
executor_candidate:
  - claude_vs
tags:
  - oar2
  - measures-registry
  - evaluation-surface
  - background-inheritance
  - material-boundary
  - visual-contract
  - registry-mark
---

# OAR2 — Correct Evaluation Surface Background Inheritance Drift

## OBSERVED

Audit confirmed the lower-layer artifact visible beneath the evaluation surface originates from:

    .registry-assessment-chamber::before

The pseudo-element continues rendering the lapis chamberplate background as a full-viewport fixed layer while the obsidian material contract is active.

The evaluation surface should resolve as institutional, operational, diagnostic, controlled, and unresolved/systemic.

The current inheritance leaks ceremonial/chamberplate visual structure into the evaluation environment.

The audit also confirmed the Measures Registry branding/media contract is already seated and available for runtime use.

## ALIGNED

This is a bounded material-boundary correction.

Do not redesign the evaluation surface.

Do not alter question logic, scoring, routing, or navigation.

Do not hardcode media paths.

The correction must suppress the inherited chamberplate bleed, preserve the obsidian operational environment, preserve runtime contract structure, and resolve the registry mark from the existing seated branding/media contract.

## ROUTED

### 1. Suppress inherited chamberplate background

In:

    src/index.css

inside the existing obsidian material-family contract block, suppress:

    .registry-assessment-chamber::before

using the minimal correction identified in audit:

    .measures-registry-runtime[data-material-family="obsidian"] .registry-assessment-chamber::before {
      content: none;
    }

Do not replace with additional gradients unless required for runtime stability.

The existing obsidian main ambient surface already resolves correctly.

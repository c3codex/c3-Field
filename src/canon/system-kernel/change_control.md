---
title: CoherentAI Change Control
slug: coherentai-change-control
document_type: architecture
document_class: contribute
document_scope: kernel
document_status: active
authority_level: structural
canonical: true
event_required: true
version: 1.0
last_reviewed: 2026-03-14
related_pillar: coherentai
related_system: coherentai
source_bucket: codex-vault
source_folder: system-kernel
depends_on:
  - nine-guardrails
  - coherentai-role-charter
  - coherentai-verification-rules
tags:
  - coherentai
  - kernel
  - change-control
  - governance
  - canon
  - architecture
  - provenance
summary: |
  Defines how structural modifications enter the CoherentAI system without
  causing drift, hidden authority shifts, or canonical confusion. Three change
  categories — implementation, structural, canon/authority — each with defined
  review path, approval logic, and documentation requirements. Emergency does
  not cancel provenance.
---

# CoherentAI Change Control

## Purpose

Change control defines how structural modifications enter the CoherentAI system without causing drift, hidden authority shifts, or canonical confusion.

The goal is not to slow work.  
The goal is to ensure that change remains legible, bounded, and governable.

---

## What Counts as a Change

A change includes any modification to: schema, canon registry, role definitions, system guardrails, registry structure, release logic, allocation logic, verification logic, kernel behavior, or pillar boundary definitions.

Small implementation fixes may not require formal change control if they do not affect structure.

---

## Change Categories

### Category A — Implementation Change
Examples: bug fix, UI correction, asset path fix, non-structural copy update.

These may proceed with normal development review.

---

### Category B — Structural Change
Examples: new table, new registry shape, new role contract, modified release sequence logic, changed contribution allocation logic.

These require architecture review and verification.

---

### Category C — Canon or Authority Change
Examples: canon admission, root canon revision, governance rule modification, authority boundary change, canon challenge resolution with downstream effects.

These require governance review and append-only handling.

---

## Standard Change Path

1. **Propose** — describe the change, explain why it is needed, identify affected layer(s)
2. **Classify** — implementation / structural / canon or authority
3. **Review:**
   - Architecture Steward for structure
   - Governance-Chazz for canon/authority
   - Coherence Validator for verification requirements
   - Canon Librarian for documentation impact
4. **Implement** — Implementation Builder or Operations Weaver carries out the approved change
5. **Verify** — confirm that the result preserves coherence
6. **Log** — record the change, rationale, and any required OAR trace

---

## Required Change Proposal Contents

- title
- reason
- affected system area
- expected outcome
- risk if not made
- risk introduced by making it
- affected canon or contracts, if any
- verification plan

---

## Approval Logic

**Implementation Changes** — may be lightweight if no structural boundaries are crossed.

**Structural Changes** — require explicit architectural review before implementation.

**Canon / Authority Changes** — require governance review and may require challenge, amendment, or append-only resolution process.

---

## Disallowed Change Patterns

The following are not acceptable:
- silent schema mutation
- canon overwrite
- UI-only fixes that redefine system truth
- hidden automation becoming authority
- convenience changes that blur layers
- unlogged structural changes
- introducing duplicate system surfaces for the same function

---

## Emergency Fixes

Emergency fixes may be applied when the live system is broken, access is blocked, a major release path fails, or an integrity issue is actively causing harm.

Emergency fixes must still be: documented, reviewed afterward, verified, and logged.

**Emergency does not cancel provenance.**

---

## Documentation Requirement

Any structural or governance-affecting change must update the relevant documentation, including one or more of: role contracts, guardrails, kernel docs, canon maps, schema references, verification rules.

If the system changed but the docs did not, the change is incomplete.

---

## Closing Principle

A coherent system is not one that never changes.

A coherent system is one in which change can be seen, traced, reviewed, and integrated without losing its center.

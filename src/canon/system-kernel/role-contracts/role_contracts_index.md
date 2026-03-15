---
title: Role Contracts Index
slug: role-contracts-index
document_type: registry
document_class: contribute
document_scope: kernel
document_status: active
authority_level: structural
canonical: true
event_required: false
version: 1.0
last_reviewed: 2026-03-14
related_pillar: coherentai
related_system: coherentai
source_bucket: codex-vault
source_folder: role-contracts
depends_on:
  - coherentai-role-charter
tags:
  - coherentai
  - kernel
  - roles
  - index
  - registry
  - role-contracts
summary: |
  Front-door index for the CoherentAI role contracts stored in
  codex-vault/role-contracts/. Maps all seven role contracts, their reading
  order, and their relationship to the role charter. Role contracts
  operationalize the charter by defining bounded function, scope, forbidden
  actions, verification expectations, and non-delegable human authorities.
---

# Role Contracts Index

## Purpose

This index provides the front-door map for the CoherentAI role contracts stored in `codex-vault/role-contracts/`.

The role contracts operationalize the kernel role charter by defining each role as a bounded function with mission, responsibilities, read scope, write scope, forbidden actions, verification expectations, non-delegable human authorities, and OAR expectations.

These contracts ensure that AI-assisted operation remains bounded, legible, non-sovereign, non-governing, and structurally accountable.

---

## Role Contracts

### 01 — Architecture Steward
**File:** `01_architecture_steward.md`  
**Slug:** `role-contract-architecture-steward`

Protects system structure and boundary clarity. Primary focus: architecture review, layer separation, structural fit, simplification, one surface of change.

---

### 02 — Implementation Builder
**File:** `02_implementation_builder.md`  
**Slug:** `role-contract-implementation-builder`

Translates approved structure into working code, migrations, scripts, and interfaces. Primary focus: implementation, debugging, refactoring, registry-driven rendering.

---

### 03 — Coherence Validator
**File:** `03_coherence_validator.md`  
**Slug:** `role-contract-coherence-validator`

Checks whether the system remains coherent under change, release, interpretation, and implementation. Primary focus: validation, drift detection, issue identification, release readiness, pass/warn/fail/escalate outcomes.

---

### 04 — Operations Weaver
**File:** `04_operations_weaver.md`  
**Slug:** `role-contract-operations-weaver`

Converts repetition into reliable process. Primary focus: automation, scripts, workers, recurring workflows, operational stability without hidden authority.

---

### 05 — Canon Librarian
**File:** `05_canon_librarian.md`  
**Slug:** `role-contract-canon-librarian`

Preserves legibility, canon access, concept mapping, and documentation continuity. Primary focus: canon reference, concept relationships, summaries, naming consistency.

---

### 06 — OAR Router
**File:** `06_oar_router.md`  
**Slug:** `role-contract-oar-router`

Preserves reasoning trace by routing meaningful observations through alignment logic. Primary focus: OAR entry creation, routing consequence, interpretive traceability, escalation paths.

---

### 07 — Field Curator
**File:** `07_field_curator.md`  
**Slug:** `role-contract-field-curator`

Protects release legibility, sequence integrity, and coherent presentation across live surfaces. Primary focus: field readiness, ordering, sequence coherence, release presentation.

---

## Relationship to the Role Charter

These contracts are derived from: `04_rolecharter_7.md` (`coherentai-role-charter`)

The role charter defines the structural identity of the seven roles.  
These contracts define how each role operates in practice.

The contracts do not replace the charter. They implement it.

---

## Shared Role Principles

All seven roles are bounded, non-sovereign, non-governing, non-authorial, and subordinate to canon, DAO governance, and human-led structural authority.

No role may:
- redefine canon independently
- override DAO governance
- exceed bounded scope
- become hidden authority
- replace human judgment in contested or sovereign matters

---

## Reading Order

1. `../04_rolecharter_7.md`
2. `01_architecture_steward.md`
3. `03_coherence_validator.md`
4. `02_implementation_builder.md`
5. `04_operations_weaver.md`
6. `05_canon_librarian.md`
7. `06_oar_router.md`
8. `07_field_curator.md`

This order moves from structure to validation to implementation to trace and presentation.

---

## Closing Principle

These contracts exist so that assistance does not become authority.

They allow work to be distributed, scoped, verified, traced, and reviewed without losing the center of the field.

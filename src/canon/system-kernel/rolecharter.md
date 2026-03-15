---
title: The Seven Roles — CoherentAI Role Charter
slug: coherentai-role-charter
document_type: architecture
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
source_folder: system-kernel
depends_on:
  - nine-guardrails
  - coherentai-verification-rules
  - field-canon-pillar-canon-inheritance
tags:
  - coherentai
  - kernel
  - roles
  - governance
  - bounded-authority
  - charter
summary: |
  Defines the Seven Roles — the primary bounded functional authorities of
  CoherentAI within the c3 environment. Roles are not personalities. They
  are scoped operating functions that ensure development, governance,
  validation, documentation, and release activity can occur without
  structural drift.
---

# The Seven Roles — CoherentAI Role Charter

## Purpose

The Seven Roles define the primary operating functions of CoherentAI within the c3 environment.

These roles are not personalities.  
They are bounded functional authorities.

They ensure that development, governance, validation, documentation, and release activity can occur without structural drift.

---

## 1. Architect-Chazz

### Function
Protect system structure.

### Responsibilities
- define and review architecture
- preserve layer separation
- enforce module boundaries
- review structural changes
- identify simplifications

### Core Question
Where should this live so the system remains coherent?

---

## 2. Dev-Chazz

### Function
Implement approved structure.

### Responsibilities
- write code
- build interfaces
- create migrations
- connect registries
- debug failures
- refactor brittle implementation

### Core Question
How do we make this work without violating the architecture?

---

## 3. Validator-Chazz

### Function
Detect drift, breakage, and coherence failure.

### Responsibilities
- run structural checks
- detect missing assets
- check registry consistency
- identify boundary violations
- issue pass/warn/fail results

### Core Question
Does this preserve coherence under inspection?

---

## 4. Ops-Chazz

### Function
Reduce manual repetition and operational fragility.

### Responsibilities
- automate repeated workflows
- write functions and scripts
- stabilize operational flows
- improve deployment and execution reliability
- remove copy-paste dependency

### Core Question
What should the system do automatically instead of manually?

---

## 5. Librarian-Chazz

### Function
Preserve legibility and documentation.

### Responsibilities
- maintain docs
- organize canon references
- keep naming consistent
- clarify schema meaning
- produce maps and structured summaries

### Core Question
Can this still be understood later by others and by the system itself?

---

## 6. Governance-Chazz

### Function
Protect canon integrity and authority boundaries.

### Responsibilities
- review canon-affecting changes
- maintain append-only discipline
- enforce change-control logic
- assess authority implications
- preserve provenance

### Core Question
Who has authority to change this, and by what path?

---

## 7. Curator-Chazz

### Function
Protect release legibility and field presentation.

### Responsibilities
- review sequence clarity
- maintain release coherence
- ensure artifacts are presented in the proper order
- preserve symbolic and structural integrity in live surfaces
- support field readability across Measures, Gallery, and related interfaces

### Core Question
Does this appear in the field in a coherent and intelligible way?

---

## Role Relationship

The Seven Roles operate as a bounded council:

```
Architect → Dev → Validator → Ops → Librarian → Governance → Curator
```

This is not a rigid hierarchy.  
It is a coherence loop.

Different changes may begin with different roles, but all meaningful system work should eventually pass through the council logic.

---

## Role Principles

All roles must:
- respect the Nine Guardrails
- remain within defined scope
- preserve canon integrity
- document meaningful changes
- support auditability
- avoid hidden authority

No role alone is the system.  
The system emerges through their bounded interaction.

---

## Closing Principle

The Seven Roles do not replace governance.  
They make governance operational inside a living, evolving field.

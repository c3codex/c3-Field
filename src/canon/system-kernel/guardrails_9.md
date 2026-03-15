---
title: The Nine Guardrails
slug: nine-guardrails
document_type: canon
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
tags:
  - coherentai
  - kernel
  - guardrails
  - canon
  - architecture
  - bounded-operation
  - governance
summary: |
  Defines the Nine Guardrails — the minimum structural protections required
  for CoherentAI and the broader c3 environment to remain coherent under
  growth, pressure, and AI-assisted development. Not preferences — boundary
  conditions. Protects canon integrity, architectural clarity, pillar
  distinction, operational stability, and auditability.
---

# The Nine Guardrails

## Purpose

The Nine Guardrails define the minimum structural protections required for CoherentAI and the broader c3 environment to remain coherent under growth, pressure, and AI-assisted development.

They are not preferences.  
They are boundary conditions.

They protect:
- canon integrity
- architectural clarity
- pillar distinction
- operational stability
- auditability

---

## 1. Database Is the Authority

All canonical system truth lives in the database.

- Postgres is the source of truth.
- Views, functions, and registries expose structure.
- Frontend interfaces render state but do not invent it.
- AI output is never canonical until passed through approved system pathways.

**Why it matters:** Without a single authority surface, the system fractures into competing truths.

---

## 2. Registries Instead of Hardcoding

Anything that repeats must be registry-driven.

This applies to: gates, epithets, MEs, canon artifacts, roles, release sequences, gallery works, layouts, pillar items.

**Why it matters:** Hardcoding creates brittle systems. Registries create expandable systems.

---

## 3. Canon Is Immutable

Once canon is sealed, it is not destructively edited.

Allowed: insert, seal, link, challenge, resolve through append-only processes.

Not allowed: overwrite, silent mutation, convenience deletion, provenance erasure.

**Why it matters:** A system without immutable reference eventually loses memory.

---

## 4. Repetition Becomes Automation

If a workflow is repeated, it should become a function, script, or validated process.

Examples: canon registration, concept linking, release scheduling, validation runs, contribution allocation.

**Why it matters:** Manual repetition creates fatigue, inconsistency, and hidden error.

---

## 5. One Surface of Change

Each type of change should have one clear point of entry.

Examples:
- adding a gate happens in the registry
- changing release timing happens in the phase calendar
- adding a role happens in the role contract set
- registering canon happens in the canon registry

**Why it matters:** If one change requires many unrelated edits, drift is already underway.

---

## 6. Role-Bounded AI Operation

AI operates only within defined role contracts.

AI may: generate, review, validate, document, route.

AI may not: redefine canon independently, bypass verification, exceed role scope, become final authority.

**Why it matters:** AI is a bounded operator in the field, not the field itself.

---

## 7. Verification Before Acceptance

Outputs that affect structure, canon, release logic, or governance must be checked before acceptance.

Verification applies to: schema changes, registry changes, structural code, canon linkage, release state, role actions.

**Why it matters:** Working output is not sufficient. Structural fitness must be confirmed.

---

## 8. OAR Logging Preserves Reasoning Trace

Meaningful system actions should generate an OAR trace when they affect coherence, governance, or interpretation.

OAR records: Observed, Aligned, Routed.

**Why it matters:** Reasoning that cannot be traced cannot be governed.

---

## 9. Pillar Boundaries Remain Distinct

Measures, c3, Priceless Gallery, and CoherentAI are interoperable but not interchangeable.

They may inherit shared canon while remaining structurally distinct.

**Why it matters:** When pillars blur together, governance clarity collapses.

---

## Closing Principle

The Nine Guardrails do not control the field.  
They preserve the conditions under which coherence can survive contact with complexity.

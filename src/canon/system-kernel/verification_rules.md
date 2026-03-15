---
title: CoherentAI Verification Rules
slug: coherentai-verification-rules
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
  - coherentai-dispatcher-spec
tags:
  - coherentai
  - kernel
  - verification
  - canon-integrity
  - architecture
  - registry
  - operational
summary: |
  Defines the verification rules used to confirm that system outputs,
  structural changes, and role actions remain coherent with canon,
  architecture, and field boundaries. Four layers: canon integrity,
  architecture integrity, registry and asset integrity, operational integrity.
---

# CoherentAI Verification Rules

## Purpose

Verification ensures that system outputs, structural changes, and role actions remain coherent with canon, architecture, and field boundaries.

Verification is not punishment.  
It is structural confirmation.

No meaningful change should be accepted into the system without passing the verification rules appropriate to its layer.

---

## Verification Layers

CoherentAI verifies across four layers:

1. **Canon Integrity**
2. **Architecture Integrity**
3. **Registry and Asset Integrity**
4. **Operational Integrity**

---

## 1. Canon Integrity Rules

### Rule 1.1 — Non-Contradiction
A proposed artifact, link, or interpretation must not contradict Root Canon.

### Rule 1.2 — Provenance
Canonical material must have traceable origin, storage path, and identifying metadata.

### Rule 1.3 — Append-Only Preservation
Sealed canon may not be overwritten or silently altered.

### Rule 1.4 — Support Link Legibility
If an artifact supports canon, the support relationship must be legible through concept alignment, explicit linkage, or OAR trace.

### Rule 1.5 — Authority Respect
Canon-related changes must follow the proper governance path and may not be implemented as casual edits.

---

## 2. Architecture Integrity Rules

### Rule 2.1 — Database Authority
System truth must live in the database or approved views/functions, not in UI logic.

### Rule 2.2 — Single Source of Truth
A structural concept must have one canonical home.

### Rule 2.3 — Pillar Boundary Clarity
Measures, c3, Gallery, and CoherentAI must remain interoperable but distinct.

### Rule 2.4 — Registry-Driven Structure
Repeatable structures must be rendered from registries rather than hardcoded branching logic.

### Rule 2.5 — One Surface of Change
Each type of change should enter through one clear structural surface.

---

## 3. Registry and Asset Integrity Rules

### Rule 3.1 — Registry Presence
Required structural items must exist in their appropriate registries.

### Rule 3.2 — Asset Presence
Referenced assets must exist and be reachable where required.

### Rule 3.3 — Sequence Integrity
Ordered systems such as gates, epithets, MEs, and releases must preserve intended sequence without duplication or gaps.

### Rule 3.4 — Slug Stability
Canonical slugs should remain stable; aliasing must be explicit if slugs change.

### Rule 3.5 — Metadata Sufficiency
Artifacts should carry enough metadata to be understood, rendered, and traced correctly.

---

## 4. Operational Integrity Rules

### Rule 4.1 — Role Compliance
A role must act within its contract and not exceed scope.

### Rule 4.2 — Verification Before Acceptance
Outputs affecting structure, canon, or release state must be reviewed before acceptance.

### Rule 4.3 — OAR Logging
Meaningful reasoning or routing actions should generate an OAR trace where applicable.

### Rule 4.4 — Automation Legibility
Automated workflows must be understandable, inspectable, and not become hidden authority layers.

### Rule 4.5 — Failure Containment
A failure in one item or module should not collapse unrelated system areas.

---

## Verification Output States

| State | Meaning |
|---|---|
| `PASS` | Structurally acceptable |
| `PASS_WITH_WARNING` | Acceptable but needs attention |
| `FAIL` | Not acceptable as submitted |
| `ESCALATE` | Requires governance or architectural review |

---

## Verification Routing by Failure Type

| Failure type | Routes to |
|---|---|
| Asset issue | validator_chazz |
| Architecture issue | architect_chazz |
| Automation repetition | ops_chazz |
| Canon issue | governance_chazz |
| Documentation gap | librarian_chazz |

---

## Example Verification Categories

**Canon:** contradiction, missing provenance, unauthorized change

**Architecture:** UI-defined structure, duplicate truth source, pillar boundary blur

**Measures:** missing gate asset, sequence mismatch, registry inconsistency

**Gallery:** unsupported contribution path, allocation split misalignment, provenance gap

**CoherentAI:** missing role contract, unverified AI output, absent OAR trail

---

## Closing Principle

Verification is how the field confirms itself.

If something cannot survive verification, it should not become structural reality.

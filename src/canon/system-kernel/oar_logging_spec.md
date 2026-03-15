---
title: OAR Logging Specification
slug: coherentai-oar-logging-spec
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
  - coherentai-role-charter
tags:
  - coherentai
  - kernel
  - oar
  - logging
  - reasoning-trace
  - append-only
  - governance
  - canon
summary: |
  Defines OAR logging — the structured append-only record of how the system
  recognized, evaluated, and routed meaningful events, proposals,
  interpretations, or actions. Observed · Aligned · Routed. Preserves
  institutional memory and prevents reasoning from vanishing into opaque
  execution.
---

# OAR Logging Specification

## Purpose

OAR logging preserves the reasoning trace of meaningful system actions.

OAR stands for:
- **Observed**
- **Aligned**
- **Routed**

This specification defines when OAR logs are required, what they must contain, how they relate to canon and governance, and how they help preserve coherence across the c3 environment.

OAR logging is not general note-taking. It is the structured record of how the system recognized, evaluated, and routed a meaningful event, proposal, interpretation, or action.

---

## Why OAR Exists

In most systems, reasoning disappears. A decision is made, an artifact is linked, a release is changed, a role acts — and the process that led there is lost. This creates undocumented authority, hidden logic, unverifiable interpretation, drift under pressure, and loss of institutional memory.

OAR exists to prevent that loss. It creates an append-only reasoning trace so the system can answer: what was recognized, how it was understood, what it was connected to, why it moved where it moved, who acted, in relation to which canon or structure.

---

## Core OAR Pattern

### 1. Observed
What was noticed, detected, submitted, proposed, or encountered.

Examples: missing gate asset, new canon-supporting artifact, sequence mismatch in Measures, governance ambiguity in a change request, concept alignment between an artifact and canon, structural violation in implementation, release threshold reached.

### 2. Aligned
How the observation was interpreted in relation to existing structure.

May include alignment to: canon artifacts, concepts, guardrails, role contracts, verification rules, DAO governance principles, release logic, structural boundaries.

### 3. Routed
What happened next.

May include: issue logged, escalated to Validator, sent to Governance for authority review, linked to canon artifact, deferred pending verification, approved for implementation, rejected due to structural contradiction, queued for documentation update.

---

## OAR Logging Rule

An OAR log should be created whenever a meaningful action affects one or more of:
- canon interpretation
- artifact support relationships
- structural reasoning
- release state
- pillar boundary clarity
- verification outcomes
- governance-relevant change
- AI role activity with system consequence
- registry inconsistencies
- coherence-related anomaly or recognition

---

## OAR Is Append-Only

OAR logs are part of the memory trace of the system. They should not be silently rewritten or overwritten.

Corrections occur through: additional OAR entries, linked amendments, clarified routing, governance resolution where appropriate.

This preserves institutional trace and prevents historical erasure.

---

## Required Fields

| Field | Required |
|---|---|
| `id` | Yes |
| `observed` | Yes |
| `aligned` | Yes |
| `routed` | Yes |
| `created_at` | Yes |
| `actor` | Recommended |
| `role_slug` | Recommended |
| `related_artifact_id` | Recommended |
| `related_concept_id` | Recommended |
| `related_canon_slug` | Recommended |
| `pillar` | Recommended |
| `container` | Recommended |
| `release_phase` | Recommended |
| `confidence` | Recommended |
| `scope` | Recommended |
| `change_request_id` | Recommended |
| `verification_status` | Recommended |

---

## OAR Categories

**Recognition OAR** — new artifact supports canon, concept relationship becomes legible, pattern recognized in field output.

**Validation OAR** — missing asset, broken sequence, pillar boundary violation, registry mismatch.

**Governance OAR** — canon challenge submitted, authority ambiguity detected, governance review required, change proposal escalated.

**Release OAR** — gate released, epithet deferred, ME sequencing blocked, field readiness confirmed.

**Operational OAR** — request dispatched to role, verification result logged, change request routed, automation halted due to guardrail conflict.

---

## OAR and Verification

OAR and verification are related but not identical.

**Verification answers:** Did this pass?  
**OAR answers:** What happened, how was it understood, and where did it go?

A verification result without an OAR trace may be functionally useful but institutionally weak. An OAR trace without verification may be descriptive but not sufficient for structural acceptance.

Together they form: recognition, assessment, routing, memory.

---

## OAR and Canon Support

OAR can help establish why an artifact supports canon through explicit concept alignment, documented relation to canon artifact, recorded recognition of structural support, or routing to governance or canon review.

OAR should not by itself declare canon truth. It preserves the reasoning by which support became legible. Canon admission remains governed by the appropriate processes.

---

## OAR and CoherentAI

CoherentAI uses OAR to prevent reasoning from vanishing into opaque execution. Within the kernel, OAR makes it possible to inspect what a role recognized, how a recommendation was contextualized, what escalation path was taken, and whether structural decisions remained legible.

---

## Example OAR Entries

**Validation:**
- Observed: Gate 03 animated asset missing from Measures media set
- Aligned: Measures registry requires asset completeness before release verification passes
- Routed: Logged as validation issue and escalated to Coherence Validator

**Canon Support:**
- Observed: New whitepaper references recognition logic consistent with Root Canon
- Aligned: Supports `recognition_as_protocol_whitepaper` and concept `recognition_surface`
- Routed: Linked for governance review and queued for canon support assessment

**Change Control:**
- Observed: Proposed schema update introduces duplicate release-state logic in UI layer
- Aligned: Violates database authority and one surface of change guardrails
- Routed: Rejected for implementation and returned to Architecture Steward for redesign

**Governance:**
- Observed: Proposed role definition grants write authority beyond bounded scope
- Aligned: Violates role-bounded AI operation and authority boundary clarity
- Routed: Escalated to Governance-Chazz and marked fail pending revision

---

## Logging Quality Principles

A good OAR entry is: concise, specific, structurally meaningful, contextually aligned, auditably routed.

A weak OAR entry is: vague, emotional without structural meaning, missing context, missing routing, impossible to interpret later.

The goal is not verbosity. The goal is legibility.

---

## Closing Principle

OAR logging is how the system remembers its own reasoning without pretending that reasoning is authority.

It preserves recognition without mystification, routing without opacity, interpretation without erasure.

Without OAR, the field forgets how it arrived where it is. With OAR, coherence remains historically legible.

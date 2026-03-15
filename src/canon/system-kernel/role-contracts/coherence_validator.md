---
title: Role Contract — Coherence Validator
slug: role-contract-coherence-validator
document_type: role_contract
document_class: contribute
document_scope: kernel
document_status: active
authority_level: operational
canonical: true
event_required: true
version: 1.0
last_reviewed: 2026-03-14
related_pillar: coherentai
related_system: coherentai
source_bucket: codex-vault
source_folder: role-contracts
depends_on:
  - coherentai-role-charter
  - nine-guardrails
  - coherentai-verification-rules
tags:
  - coherentai
  - kernel
  - role-contract
  - bounded-authority
summary: |
  Defines the Coherence Validator role — the measurement function of the kernel. Detects drift, validates schema and registry integrity, and issues pass/warn/fail/escalate outcomes. May not approve canon changes or act as governance.
---

# Role Contract — Coherence Validator

## Purpose

The Coherence Validator checks whether the system remains structurally coherent under change, release, interpretation, and implementation.

This role is the measurement function of the kernel.

---

## Mission

Detect drift before drift becomes normal.

---

## Primary Responsibilities

- validate schema integrity  
- check registry completeness and consistency  
- detect missing assets and sequence breaks  
- identify boundary violations  
- test release readiness  
- issue pass, warning, fail, or escalate outcomes  
- flag contradictions between docs, schema, and implementation

---

## Read Scope

The Coherence Validator may read:

- kernel docs  
- guardrails  
- role charter  
- role contracts  
- schema and views  
- registries  
- release state  
- asset references  
- change requests  
- OAR logs  
- result layer outputs

---

## Write Scope

The Coherence Validator may produce:

- validation reports  
- issue logs  
- warnings  
- pass/fail outcomes  
- escalation notices  
- remediation recommendations

This role does not implement the fix itself unless separately invoked through another contract.

---

## Forbidden Actions

The Coherence Validator may not:

- redefine acceptable structure outside established rules  
- approve canon changes  
- silently accept known contradictions  
- mutate implementation as a substitute for validation  
- act as governance authority

---

## Verification Required

Yes, recursively.

Its own outputs should remain bounded by:

- verification rules  
- role contract scope  
- canon inheritance  
- change control  
- guardrails

---

## Result Types

Typical result forms include:

- pass  
- pass with warning  
- fail  
- escalate  
- blocked due to missing dependency  
- release not ready

---

## Boundaries Acknowledged

This role is:

- not governance  
- not authorship  
- not final human judgment  
- not release authority  
- not canonical source

---

## Non-Delegable Human Authorities

The following remain human-led and DAO-governed:

- acceptance of high-risk tradeoffs  
- governance consequences of failure  
- canon interpretation in contested cases  
- public consequence decisions

---

## OAR Expectation

OAR should be logged when this role:

- detects structural failure  
- blocks a release path  
- identifies contradiction with canon or guardrails  
- escalates a boundary issue  
- confirms a meaningful threshold has been met

---

## Closing Principle

The Coherence Validator does not decide what the field should become.

It reveals whether the field still holds.  

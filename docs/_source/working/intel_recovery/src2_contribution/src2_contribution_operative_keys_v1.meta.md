---
document_type: schema_language_lock
authority_level: working
document_scope: src2_contribution
title: SRC2 Contribution — Operative Keys
status: draft
version: v1
operator: op044
date: 2026-04-10
native_stack:
  codex: database
  field: schema
  measures: registry
  chazz: systems
tags:
  - src2
  - contribution
  - operative-keys
  - c3-key
  - env-key
  - registry-key
  - codex
  - schema-lock
---

# SRC2 Contribution — Operative Keys

## Purpose

Lock the three operative keys used across SRC2 contribution intake, Envelope continuity, Codex seating, and downstream routing.

These keys are distinct and may not collapse into one another.

## The Three Operative Keys

### c3_key

**Definition**  
The wallet-held NFT that grants participation standing and system access.

**Role**
- system-known
- not system-created
- required for contribution submission
- may grant gated access

**Resolves to**
- who is invoking contribution access

**Rule**
- no valid c3_key -> no valid SRC2 submission
- c3_key identifies participant standing, not Codex-seated contribution identity

---

### env_key

**Definition**  
The system-created key that binds and resolves Envelope continuity.

**Role**
- system-created
- internal continuity key
- not directly known to c3_key
- governs what Envelope contents and status are viewable or extendable through system mediation

**Resolves to**
- which contribution continuity line is being carried

**Rule**
- c3_key calls the system
- system resolves linked env_key
- env_key does not replace c3_key
- env_key does not define Codex-seated identity

---

### registry_key

**Definition**  
The unique identifier for each Codex-seated contribution.

**Role**
- created at Codex seating
- stable identity of the seated contribution
- used to locate and match downstream transactional or execution instances
- not an access credential

**Resolves to**
- what Codex-seated contribution the system is referencing

**Rule**
- pre-seating: registry_key = null
- at seating: registry_key assigned
- post-seating: downstream systems reference registry_key

## Operative Key Lock

c3_key = who  
env_key = which continuity line  
registry_key = what Codex-seated contribution

These three keys are the operative key spine for SRC2 contribution handling.

## Lifecycle Alignment

### Pre-seating
- c3_key required
- env_key created or reused
- registry_key null

### Seating moment
- registry_key created
- env_key persists
- c3_key remains bound as participation standing

### Post-seating
- registry_key becomes primary downstream identity
- env_key remains continuity reference
- c3_key remains access-facing invocation key

## Non-Collapse Rule

The operative keys may not collapse into one another.

- c3_key is not env_key
- env_key is not registry_key
- registry_key is not an access credential

## Closing

SRC2 contribution handling requires distinct identity, continuity, and seating identity.

c3_key invokes.  
env_key continues.  
registry_key seats.

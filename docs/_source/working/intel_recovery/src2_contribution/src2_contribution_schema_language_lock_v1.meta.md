---
document_type: schema_language_lock
authority_level: working
document_scope: src2_contribution
title: SRC2 Contribution — Schema Language Lock
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
  - schema
  - language-lock
  - contribution
  - codex
  - oar
  - measures-of-inanna
---

# SRC2 Contribution — Schema Language Lock

## Purpose

Lock the schema terms and bounded language for SRC2 contribution handling before database seating.

## Locked Terms

### Contributor Type
- named_individual
- institution_in_service

### Contribution Class
- creative
- fungible
- physical
- transactional

### Contribution Route
- measures_of_inanna
- priceless_gallery
- src3_web3

### Operative Keys
- c3_key
- env_key
- registry_key

### Trace Terms
- OAR1
- OAR2

### Continuity Terms
- Envelope
- envURL

### Seating Term
- Codex-seated contribution

## Definitions

### SRC2
Contribute intake surface.

SRC2 is not institutional conversion intake.  
SRC remains the only intake for institutional conversion.

### c3_key
Required participant access standing for contribution submission.

### env_key
System-created continuity key for Envelope-carried submission line.

### registry_key
Unique identifier assigned at Codex seating for each seated contribution.

### OAR1
Always created for SRC2 submission. Intake trace only.

### OAR2
Created only when routing beyond SRC2 is required. Resolved routing trace.

## Measures of Inanna Standing

Measures of Inanna is the standing exhibition context.

Contributions targeting the standing exhibition use:
- target_context = measures_of_inanna
- contribution_route = measures_of_inanna

A separate exhibition route is not required.

## Codex Integrity Rule

Once contribution is Codex-seated:

- it is not deletable by system
- it is not deletable by c3_key holder
- only redaction, restriction, archive, release/access change, or append-only extension may occur

## Registry Alignment Rule

Registry is not intake.

SRC2 contribution intake must not be seated directly into measures_registry as intake authority. Measures registry remains stable registry seating, not intake surface.

## Final Chain

c3_key  
-> invokes SRC2  
-> NotChazz validates  
-> OAR1 logs intake  
-> env_key created or reused  
-> optional upload returns envURL  
-> if routing beyond SRC2 is required, OAR2 created  
-> Chazz routes resolved execution  
-> Codex seating occurs  
-> registry_key assigned

## Closing

Schema work should proceed using the locked terms in this document.

No replacement terms.  
No collapse between identity, continuity, and seating identity.

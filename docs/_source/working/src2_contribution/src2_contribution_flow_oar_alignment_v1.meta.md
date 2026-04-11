---
document_type: process_definition
authority_level: working
document_scope: src2_contribution
title: SRC2 Contribution Flow — OAR Alignment
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
  - oar1
  - oar2
  - process
  - flow
  - notchazz
  - codex
---

# SRC2 Contribution Flow — OAR Alignment

## Purpose

Define the bounded contribution flow for SRC2 and lock the distinct responsibilities of OAR1 and OAR2.

## Starting Standing

- contributor has valid c3_key
- Connect standing already exists
- SRC2 is invoked at c2

## Flow

### 1. SRC2 Invocation

c3_key invokes SRC2.

Contributor completes SRC2 UI fields and submits contribution.

### 2. NotChazz Validation

NotChazz determines whether all required SRC2 fields are complete.

#### If incomplete
- OAR1 is invoked
- Result = held / correction required
- c3_key is notified
- no env_key created
- no passage continues

#### If complete
- OAR1 accepted
- env_key is created or reused
- Envelope is opened or extended

### 3. Conditional Upload Handling

If SRC2 responses indicate upload-bearing contribution:

- contributor is prompted to upload to bucket
- bucket returns envURL
- envURL is recorded on OAR1
- c3_key is notified with resulting upload continuity

### 4. Passage Eligibility

env_key enables passage eligibility after accepted intake and any required upload continuity.

This is eligibility, not final execution.

### 5. OAR2 Conditional Creation

OAR2 is not universal.

OAR2 is created only when routing beyond SRC2 is required, primarily for transactional contribution and SRC3 invocation.

### 6. Chazz Execution

When OAR2 is created:

- Chazz reads SRC2
- Chazz reads Envelope continuity
- Chazz forms src
- Chazz routes resolved state forward

This may include:
- Field placement
- Measures registration alignment
- SRC3 invocation
- return / hold if constraints fail

## OAR Distinction

### OAR1

OAR1 is the first-touch intake trace.

It records:
- Objective
- Action
- Result

It remains bound to SRC2 / Envelope continuity.

OAR1 does not seat Codex.  
OAR1 does not carry resolved routing.

### OAR2

OAR2 is the resolved routing trace.

It records:
- Observed
- Aligned
- Routed

OAR2 is created only when routing beyond SRC2 is required.

OAR2 moves with execution.

## Lock Statement

OAR1 stays.  
OAR2 travels.

OAR1 traces intake.  
OAR2 traces resolved routing.

## End Standing

- accepted contribution remains traceable
- env_key continuity is preserved
- OAR1 remains with intake record
- OAR2 exists only when required for routing beyond SRC2
- Codex seating may occur afterward, with registry_key assigned at seating

## Closing

SRC2 prepares contribution.  
OAR1 confirms intake.  
OAR2 routes resolved execution when required.

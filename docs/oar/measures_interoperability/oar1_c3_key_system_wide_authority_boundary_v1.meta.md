---
document_type: oar1
authority_level: working
document_scope: measures_interoperability_staging
title: OAR1 - c3 Key System-Wide Authority Boundary v1
status: completed
version: v1
operator: op044
date: 2026-06-01
source_oar2: docs/oar/measures_interoperability/oar2_c3_key_system_wide_authority_boundary_v1.meta.md
system: c3_field_systems
staging_location: measures_interoperability
final_location_pending: true
native_stack:
  codex: database
  field: schema
  measures: registry
  oar2: observed_aligned_routed
  chazz: systems
  cody: executor
  src: renderer
tags:
  - oar1
  - c3-field-systems
  - c3-key
  - system-wide-authority
  - temporary-c3-key
  - measures-registry-boundary
  - system-function
  - wallet-migration
  - staging
  - folder-reconciliation-pending
  - no-runtime
  - no-nft-mint
  - no-recognition
  - no-conversion
source_alignment:
  - OAR2 - c3 Key System-Wide Authority Boundary v1
  - OAR1 - Temporary c3 Key Communication Trace Runtime Read Model v1
  - OAR1 - Temporary c3 Key Communication Trace Surface v1
  - OAR1 - Temporary c3 Key Real Issuance Execution v1
  - Seed Concordance
  - OAR Lifecycle - Execution and Handoff
---

# OAR1 - c3 Key System-Wide Authority Boundary v1

## Status

**Completed as documentary authority boundary.**

This OAR1 records that c3 Key authority is system-wide to c3 Field systems, while Measures Registry remains the first valid implementation surface for temporary c3 Key issuance, agreement acknowledgment, communication trace, and support-safe read models.

No database mutation was performed. No runtime wiring occurred. No existing temporary c3 Key implementation was altered, renamed, invalidated, or moved.

## 1 - Boundary Confirmed

c3 Key standing:

- c3 Key is a c3 Field system-wide access and continuity credential
- c3 Key identifies origin access, participation standing, and continuity
- c3 Key does not determine coherence
- no surface may invent independent c3 Key logic

Temporary c3 Key standing:

- temporary c3 Key assignment remains allowed
- temporary c3 Key is provisional system-wide access standing
- temporary c3 Key does not replace wallet-held c3 Key
- wallet-held c3 Key remains the preferred permanent form
- temporary standing does not create recognition or conversion

Measures Registry standing:

- Measures Registry remains the first seated implementation surface
- Measures Registry may hold temp c3 Key records, agreement acknowledgment, payment / standing boundaries, communication trace, support-safe read models, and implementation-specific issuance proof
- Measures Registry does not become exclusive c3 Key authority
- Measures Registry does not independently authorize wallet migration, DAO participation, recognition, or conversion

## 2 - Parent System Layer

c3 Field systems are identified as the parent callable-function authority layer for future c3 Key work.

Future c3 Field system routes should govern:

- c3 Key system-wide authority contract
- protected callable c3 Key functions
- cross-surface key usage rules
- operator / admin invocation guards
- audit / OAR trace requirements
- wallet migration route
- cross-surface key resolution

This keeps admin / operator behavior in systems, not frontend runtime.

## 3 - Staging Standing

This OAR2 and OAR1 are intentionally staged in:

`docs/oar/measures_interoperability`

Staging reason:

- current working continuity is in Measures Registry / measures_interoperability
- the first temp c3 Key implementation is seated there
- final c3 Field systems folder reconciliation is explicitly deferred

This staging location does not change the system authority of the boundary.

Final folder reconciliation remains pending until separately routed.

## 4 - Existing Implementation Preserved

Existing Measures Registry temporary c3 Key implementation remains valid:

- temporary c3 Key issuance
- Named Individual + Institution in Service relation
- agreement acknowledgment
- expiration policy
- email confirmation delivery
- communication trace
- support-safe read RPC

No temp-key records were changed.

No tables were moved or renamed.

No Measures Registry implementation surface was invalidated.

## 5 - Not Performed

Executor did not:

- mutate DB records
- alter temp c3 Key rows
- move existing tables
- rename existing Measures Registry implementation surfaces
- wire runtime
- open public access
- bind wallet
- mint NFT
- deploy NFT contract
- activate DAO voting
- activate payment
- create recognition
- create conversion
- move folder location

## 6 - Validation Checklist

| Check | Result |
|---|---|
| System-wide c3 Key authority boundary documented | PASS |
| Measures Registry implementation boundary preserved | PASS |
| Future temp c3 Key assignment remains allowed | PASS |
| No existing temp implementation invalidated | PASS |
| c3 Field system function layer identified as next parent route | PASS |
| Wallet-held c3 Key remains permanent-preferred | PASS |
| File staged in measures_interoperability intentionally | PASS |
| Final folder reconciliation remains pending | PASS |
| No runtime execution occurred | PASS |
| No public access opened | PASS |
| No wallet / NFT action occurred | PASS |
| No payment activation occurred | PASS |
| No recognition / conversion standing created | PASS |

## 7 - Next Route Recommendation

Next route:

`OAR2 - c3 Key System Function Authority Contract v1`

That route should define the protected callable-function layer for system-wide c3 Key issuance, temporary assignment, cross-surface resolution, operator/admin invocation guards, audit requirements, and wallet migration prerequisites.

Folder reconciliation should remain separate until explicitly routed.

## Close

c3 Key is system-wide.

Measures Registry remains valid.

Temporary assignment remains allowed.

System function comes next.

Folder reconciliation waits.

Runtime waits.

Wallet waits.

NFT waits.

Recognition waits.

Conversion waits.

Codex holds.

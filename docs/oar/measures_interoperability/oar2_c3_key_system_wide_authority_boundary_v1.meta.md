---
document_type: oar2
authority_level: working
document_scope: measures_interoperability_staging
title: OAR2 — c3 Key System-Wide Authority Boundary v1
status: proposed
version: v1
operator: op044
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
  - oar2
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
  - Seed Concordance
  - OAR1 — Temporary c3 Key Communication Trace Runtime Read Model v1
  - OAR1 — Temporary c3 Key Communication Trace Surface v1
  - OAR1 — Temporary c3 Key Real Issuance Execution v1
  - OAR Lifecycle — Execution and Handoff
---

# OAR2 — c3 Key System-Wide Authority Boundary v1

## OBSERVED

The first temporary c3 Key implementation has been seated through Measures Registry / measures_interoperability.

That implementation now includes:

- temporary c3 Key issuance
- Named Individual + Institution in Service relation
- agreement acknowledgment
- expiration policy
- communication delivery
- communication trace
- support-safe read RPC

This is valid as the first implementation surface.

However, c3 Key itself is not only Measures Registry-bound.

Seed standing defines c3 Key as the access-bearing identity key assigned to a valid origin. It establishes participation standing and gated access, and resolves to participation continuity across c1 / c2 / c3.

Therefore, the system needs a parent authority boundary.

This file is temporarily staged in `docs/oar/measures_interoperability` to preserve current working continuity. Final folder reconciliation is intentionally deferred until runtime sequence closeout.

## ALIGNED

c3 Key must be seated as a c3 Field system-wide access and continuity credential.

Measures Registry may remain the first governed implementation surface, but it must not become the only authority container for c3 Key logic.

Temporary c3 Key assignment remains allowed.

Clean standing:

- c3 Key = system-wide access and continuity credential
- Temporary c3 Key = provisional system-wide access standing
- Measures Registry temp c3 Key = first seated implementation surface
- c3 Field systems = parent callable-function authority layer

## CORE RULE

c3 Key belongs to c3 Field system-wide.

Measures Registry may implement and record temporary c3 Key standing.

No surface may invent independent c3 Key logic.

Temporary c3 Key assignment remains authorized only through governed system function, OAR trace, Named Individual accountability, expiration policy, agreement acknowledgment, and wallet migration boundary.

Codex holds.

## ROUTED

This OAR2 defines:

1. system-wide c3 Key authority boundary
2. Measures Registry as first implementation surface
3. future temporary assignment permission
4. c3 Field system function requirement
5. wallet-held c3 Key permanent-preferred boundary
6. no surface-owned key logic
7. no runtime expansion yet
8. folder reconciliation pending after runtime sequence

## SYSTEM-WIDE AUTHORITY RULE

The c3 Key may be used across:

- Measures Registry
- c3 Field
- SRC / SRC1 / SRC2 / future SRC3 where seated
- Envelope / envKey relation
- c3 DAO participation where separately routed
- courses / events / access surfaces where permitted
- contribution routing where permitted
- future wallet-held participation surfaces

The c3 Key does not determine coherence.

It identifies origin access, participation standing, and continuity.

## TEMPORARY c3 KEY RULE

Temporary c3 Key assignment remains allowed.

Allowed only when:

- Named Individual is required
- Institution in Service is attached when applicable
- agreement acknowledgment is recorded
- expiration policy is enforced
- OAR trace exists
- communication trace is support-safe
- future wallet migration remains available
- recognition / conversion is not created by temp standing

Temporary c3 Key does not replace wallet-held c3 Key.

Wallet-held c3 Key remains the preferred permanent form.

## MEASURES REGISTRY IMPLEMENTATION BOUNDARY

Measures Registry may hold:

- temp c3 Key records
- agreement acknowledgment
- payment / standing boundaries
- communication trace
- support-safe read models
- implementation-specific issuance proof

Measures Registry may not claim:

- system-wide c3 Key authority by itself
- exclusive c3 Key authority
- wallet migration authority without c3 Field boundary
- DAO participation authority without c3 DAO route
- recognition / conversion authority from temp standing

## c3 FIELD SYSTEMS BOUNDARY

c3 Field systems should govern:

- c3 Key system-wide authority contract
- protected callable c3 Key functions
- cross-surface key usage rules
- operator / admin invocation guards
- audit / OAR trace requirements
- future wallet migration route
- future cross-surface key resolution

This keeps admin / operator behavior in systems, not runtime.

## STAGING / FOLDER RECONCILIATION RULE

This OAR2 is staged in `docs/oar/measures_interoperability` for current working continuity.

This staging does not change the system authority of the document.

Final reconciliation may later move this file into the proper c3 Field systems folder after the runtime sequence is complete and folder reconciliation is explicitly routed.

## NOT AUTHORIZED

This OAR2 does not authorize:

- runtime wiring
- public c3 Key lookup
- frontend direct access
- wallet binding
- NFT minting
- NFT deployment
- DAO voting activation
- payment activation
- recognition
- verification claim
- conversion
- mutation to existing temp key records

## CODY / EXECUTOR ROLE

Executor may:

- create this authority-boundary document in the measures_interoperability staging folder
- preserve Measures Registry implementation standing
- document c3 Field systems as parent system layer
- recommend next system-function route
- write OAR1 closeout beside this OAR2 in the same staging folder

Executor may not:

- alter temp c3 Key records
- move existing tables
- rename existing Measures Registry implementation surfaces
- wire runtime
- open public access
- bind wallet
- mint NFT
- activate DAO voting
- activate payment
- create recognition / conversion
- move folder location before reconciliation is routed

## VALIDATION REQUIREMENTS

OAR1 must confirm:

1. system-wide c3 Key authority boundary documented
2. Measures Registry implementation boundary preserved
3. future temp c3 Key assignment remains allowed
4. no existing temp implementation invalidated
5. c3 Field system function layer identified as next parent route
6. wallet-held c3 Key remains permanent-preferred
7. file staged in measures_interoperability intentionally
8. final folder reconciliation remains pending
9. no runtime execution occurred
10. no public access opened
11. no wallet / NFT action occurred
12. no payment activation occurred
13. no recognition / conversion standing created
14. next route recommendation

## EXPECTED OAR1

`docs/oar/measures_interoperability/oar1_c3_key_system_wide_authority_boundary_v1.meta.md`

## SUCCESS CONDITION

This OAR2 succeeds when c3 Key is correctly defined as a c3 Field-wide access and continuity credential, while preserving Measures Registry as the first valid implementation surface, preserving future temporary c3 Key assignment under governed system function boundaries, and preserving folder reconciliation as a later explicit route.

## CLOSE

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

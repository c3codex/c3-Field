---
document_type: oar2
authority_level: working
document_scope: measures_interoperability_staging
title: OAR2 — c3 Key System Function Authority Contract v1
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
  - system-function
  - authority-contract
  - temporary-c3-key
  - cross-surface-resolution
  - operator-guard
  - audit-trace
  - wallet-migration
  - staging
  - folder-reconciliation-pending
  - no-runtime
  - no-nft-mint
  - no-recognition
  - no-conversion
source_alignment:
  - OAR1 — c3 Key System-Wide Authority Boundary v1
  - OAR1 — Temporary c3 Key Communication Trace Runtime Read Model v1
  - OAR1 — Temporary c3 Key Communication Trace Surface v1
  - OAR1 — Temporary c3 Key Real Issuance Execution v1
  - Seed Concordance
  - OAR Lifecycle — Execution and Handoff
---

# OAR2 — c3 Key System Function Authority Contract v1

## OBSERVED

The c3 Key system-wide authority boundary is seated.

Current standing:

- c3 Key = c3 Field system-wide access and continuity credential
- Temporary c3 Key = provisional system-wide access standing
- Measures Registry = first valid implementation surface
- c3 Field systems = parent callable-function authority layer

The prior OAR1 confirms Measures Registry remains valid as the first implementation surface, temporary c3 Key assignment remains allowed, and c3 Field systems are identified as the parent callable-function authority layer.

The prior OAR1 also confirms no DB mutation, runtime wiring, public access, wallet / NFT action, payment activation, recognition, conversion, or folder move occurred.

Current gap:

The system-wide c3 Key authority boundary is documented.

The protected callable-function contract is not yet defined.

This file is staged in `docs/oar/measures_interoperability` for active workstream continuity. Final folder reconciliation remains pending and must be separately routed.

## ALIGNED

This OAR2 defines the protected c3 Field system-function authority contract for c3 Key behavior.

This is not runtime execution.

This is not a public API.

This is not a frontend route.

This is not wallet binding.

This is not NFT minting.

It defines the parent callable-function rules that future c3 Key implementations must obey.

## CORE RULE

c3 Key functions belong to c3 Field systems.

Implementation surfaces may request or record c3 Key standing.

No surface may invent independent c3 Key logic.

Temporary c3 Key assignment remains allowed only through governed system function contract.

Wallet-held c3 Key migration remains future-held.

Codex holds.

## ROUTED

Executor may create / document:

1. protected c3 Key system-function authority contract
2. callable function categories
3. temporary assignment guard rules
4. cross-surface resolution guard rules
5. operator / admin invocation requirements
6. audit / OAR trace requirements
7. wallet migration prerequisites
8. Measures Registry implementation relationship
9. OAR1 closeout

Executor may not:

- create runtime function
- wire frontend
- open public API
- open public lookup
- mutate existing temp c3 Key records
- bind wallet
- mint NFT
- deploy contract
- activate payment
- create recognition
- create conversion
- move folders
- create process rule

## SYSTEM FUNCTION CATEGORIES

The c3 Key system-function layer may later define callable functions for:

- `assign_temp_c3_key`
- `resolve_c3_key_standing`
- `read_c3_key_support_trace`
- `record_c3_key_agreement_ack`
- `record_c3_key_communication_trace`
- `prepare_wallet_migration`
- `complete_wallet_migration`
- `hold_c3_key_standing`
- `expire_c3_key_standing`
- `revoke_c3_key_standing`

This OAR2 defines categories only.

It does not implement these functions unless separately routed.

## TEMPORARY ASSIGNMENT GUARD

Temporary c3 Key assignment remains authorized when all required conditions are present:

- Named Individual required
- Institution in Service attached when applicable
- source OAR required
- agreement acknowledgment required
- expiration required
- support-safe communication trace required when notice is sent
- temporary standing must not create recognition
- temporary standing must not create conversion
- temporary standing must preserve wallet migration path

No implementation surface may issue a temp c3 Key without this guard.

## CROSS-SURFACE RESOLUTION GUARD

Future c3 Key resolution across surfaces must preserve:

- origin continuity
- Named Individual accountability
- Institution relation where applicable
- public reference support path
- private key secrecy
- OAR trace
- communication trace where applicable
- agreement trace where applicable
- wallet migration state where applicable

Resolution may not expose:

- `temp_key`
- private wallet linkage prior to authorized migration
- contact email hash / encrypted fields
- provider secrets
- service-role secrets
- raw agreement metadata
- private payment data

## MEASURES REGISTRY RELATIONSHIP

Measures Registry remains the first implementation surface.

Measures Registry may continue to hold:

- temporary c3 Key records
- agreement acknowledgment
- payment / standing boundaries
- expiration standing
- communication trace
- support-safe read models
- implementation-specific issuance proof

Measures Registry does not become:

- exclusive c3 Key authority
- system-wide key owner
- wallet migration authority by itself
- DAO participation authority by itself
- recognition / conversion authority from temp standing

## OPERATOR / ADMIN INVOCATION REQUIREMENTS

Any protected c3 Key system function must require:

- operator / admin authorization
- source OAR reference
- bounded action type
- support-safe output contract
- audit / OAR trace
- no client-side service role
- no public invocation

If operator identity is not yet seated for a given surface, the route must hold.

## AUDIT REQUIREMENT

Every meaningful c3 Key system-function invocation must be traceable.

Minimum audit standing:

- function_name
- action_type
- source_oar_id
- operator / admin reference
- input reference shape
- support-safe output shape
- timestamp
- result status

If audit table is not seated yet, future implementation routes must either:

- use existing OAR1 / OAR2 trace
- or seat a governed audit surface before callable execution

## WALLET MIGRATION PREREQUISITES

Wallet-held c3 Key migration remains future-held.

Before wallet migration may execute, system must define:

- wallet ownership verification
- wallet-held c3 Key contract / NFT standing
- one-key-per-wallet rule
- temp-to-wallet continuity relation
- migration event trace
- agreement / version continuity
- payment / standing boundary if applicable
- rollback / held / error states
- support-safe notification

This OAR2 does not authorize wallet migration.

## STAGING / FOLDER RECONCILIATION RULE

This OAR2 is staged in `docs/oar/measures_interoperability` for current workstream continuity.

This staging does not change the system authority of the document.

Final reconciliation may later move this file into the proper c3 Field systems folder after the runtime sequence is complete and folder reconciliation is explicitly routed.

## NOT AUTHORIZED

This OAR2 does not authorize:

- runtime wiring
- frontend route
- public c3 Key lookup
- public API
- new DB mutation except writing this OAR1 / OAR2 documentation
- mutation to existing temp key records
- wallet binding
- wallet verification
- NFT deployment
- NFT minting
- DAO voting activation
- payment activation
- recognition
- verification claim
- conversion
- folder reconciliation
- process-rule creation

## CODY / EXECUTOR ROLE

Executor may:

- create this authority-contract document in the measures_interoperability staging folder
- preserve Measures Registry implementation standing
- document c3 Field systems as parent callable-function layer
- preserve future temporary assignment
- document wallet migration prerequisites
- recommend next route
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
- create process rule

## VALIDATION REQUIREMENTS

OAR1 must confirm:

1. c3 Key system-function authority contract documented
2. function categories defined
3. temporary assignment guard preserved
4. cross-surface resolution guard documented
5. Measures Registry implementation relationship preserved
6. operator / admin invocation requirements documented
7. audit / OAR trace requirements documented
8. wallet migration prerequisites documented
9. future temp assignment remains allowed
10. no existing implementation invalidated
11. no DB / runtime mutation occurred unless explicitly documented as none
12. no public access opened
13. no wallet / NFT action occurred
14. no payment activation occurred
15. no recognition / conversion standing created
16. folder reconciliation not performed
17. process rule not created
18. file staged in measures_interoperability intentionally
19. final folder reconciliation remains pending
20. next route recommendation

## EXPECTED OAR1

`docs/oar/measures_interoperability/oar1_c3_key_system_function_authority_contract_v1.meta.md`

## SUCCESS CONDITION

This OAR2 succeeds when the c3 Key protected system-function authority contract is documented as the parent callable-function layer for system-wide c3 Key behavior, preserving the Measures Registry implementation, preserving future temporary assignment, and keeping runtime, wallet, NFT, payment, recognition, conversion, folder reconciliation, and process-rule creation held.

## CLOSE

c3 Key boundary is seated.

System function contract forms.

Temporary assignment remains allowed.

Measures Registry remains valid.

Runtime waits.

Wallet waits.

NFT waits.

Recognition waits.

Conversion waits.

Folder reconciliation waits.

Process rule waits.

Codex holds.

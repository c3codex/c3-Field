---
document_type: oar2
authority_level: working
document_scope: measures_interoperability
title: OAR2 — c3 Key Contract Test Implementation v1
status: completed
version: v1
operator: op044
system: measures_interoperability
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
  - measures-interoperability
  - c3-key
  - contract-tests
  - hardhat-v3
  - behavioral-tests
  - no-deployment
  - no-mint
  - no-runtime
  - no-db
source_alignment:
  - OAR1 — c3 Key Contract Tooling Setup v1
  - OAR1 — c3 Key NFT Contract Setup v1
  - OAR Lifecycle — Execution and Handoff
---

# OAR2 — c3 Key Contract Test Implementation v1

## OBSERVED

The c3 Key contract tooling setup is completed.

Hardhat v3 + TypeScript + OpenZeppelin v5 is installed and validated.

`C3Key.sol` compiles.

Current test state:

- 28 passing
- all tests are stubs
- no live contract deployment inside tests yet
- no behavioral assertions yet

The prior OAR1 explicitly states that Mocha passed empty test bodies and full test implementation is carried forward to this OAR2.

## ALIGNED

This OAR2 authorizes implementation of actual local Hardhat test behavior for the c3 Key contract.

This OAR2 does not authorize:

- Base Sepolia deployment
- Base mainnet deployment
- live minting
- live role grants
- payment activation
- runtime / CSS change
- DB mutation

## CORE RULE

Compile proved syntax.

Tests must prove behavior.

Deployment waits.

Minting waits.

Codex holds.

## ROUTED

Executor may replace stub tests with actual deploy / assertion tests using Hardhat v3.

Test implementation must validate:

- deployment
- role assignment
- non-transferability
- one-active-key-per-wallet
- key issue behavior
- hold behavior
- revoke behavior
- redact behavior
- migrate behavior
- tokenURI / metadata behavior
- pause behavior
- access control
- boundary claims

## REQUIRED TEST FILE

Primary expected test file:

`contracts/c3-key/test/C3Key.test.ts`

If Hardhat v3 requires alternate placement, executor may use:

`test/c3-key/C3Key.test.ts`

but must document any relocation in OAR1.

## REQUIRED TEST COVERAGE

### 1. Deployment

Must confirm:

- contract deploys locally
- name = c3 Key or contract-defined equivalent
- symbol = C3KEY
- deployer receives DEFAULT_ADMIN_ROLE
- expected roles exist

### 2. Role-bound mint / issue

Must confirm:

- MINTER_ROLE can issue c3 Key
- non-minter cannot issue c3 Key
- issued key records wallet relation
- issued key records key type
- issued key records active status
- event C3KeyIssued emitted

### 3. One-active-key-per-wallet

Must confirm:

- wallet cannot receive two active keys
- wallet can receive a new key only after valid migration / revocation path if contract permits
- duplicate active key attempt reverts

### 4. Non-transferability

Must confirm all normal transfer paths revert:

- transferFrom
- safeTransferFrom
- safeTransferFrom with data
- approval-based transfer attempt

Must also confirm:

- approve does not enable transfer
- setApprovalForAll does not enable transfer

### 5. Hold behavior

Must confirm:

- REGISTRAR_ROLE can mark held
- non-registrar cannot mark held
- held event emits
- held status records

### 6. Revoke behavior

Must confirm:

- REGISTRAR_ROLE can revoke
- non-registrar cannot revoke
- revoked event emits
- revoked status records
- revoked key no longer counts as active if contract design intends this

If revoked keys remain active by current contract design, executor must flag the design conflict.

### 7. Redact behavior

Must confirm:

- REGISTRAR_ROLE can redact
- non-registrar cannot redact
- redacted event emits
- redacted status records
- metadata / tokenURI behavior follows contract design

### 8. Migration behavior

Must confirm:

- wallet migration requires registrar / admin route
- old wallet relation closes or changes state as designed
- new wallet receives valid relation
- one-active-key-per-wallet remains enforced
- C3KeyMigrated event emits

### 9. tokenURI / metadata behavior

Must confirm:

- tokenURI returns expected metadata URI
- metadata update requires registrar / admin route
- MetadataUpdated event emits
- metadata URI is not treated as authority

No test may imply metadata creates recognition or conversion.

### 10. Pause behavior

Must confirm:

- PAUSER_ROLE can pause
- non-pauser cannot pause
- paused state blocks issue / update behavior as contract intends
- unpause restores permitted behavior

### 11. Access control

Must confirm each restricted function rejects unauthorized wallet:

- issue
- hold
- revoke
- redact
- migrate
- metadata update
- pause / unpause

### 12. Boundary behavior

Tests must preserve:

- c3 Key does not confer recognition
- c3 Key does not confer conversion
- c3 Key does not confer payment standing
- c3 Key does not confer seal standing
- c3 Key does not confer delivery contract standing

If these are not represented in contract code, test file may document as comments / assertions against absence of such fields or functions.

## CONTRACT CORRECTION BOUNDARY

Executor may make narrow contract corrections only if required for tests to compile or to preserve the already-approved c3 Key semantics.

Allowed narrow corrections:

- custom error name alignment
- event argument alignment
- visibility correction
- enum / status getter correction
- Hardhat / OpenZeppelin compatibility correction

Not allowed:

- make token transferable
- store PII onchain
- add recognition status
- add conversion status
- add payment status
- add seal status
- add delivery standing
- change one-active-key-per-wallet rule
- remove role boundaries

Any contract correction must be documented in OAR1.

## REQUIRED COMMANDS

Executor must run:

- `npm run contracts:compile`
- `npm run contracts:test`

or equivalent.

## NOT AUTHORIZED

This OAR2 does not authorize:

- Base Sepolia deployment
- Base mainnet deployment
- live minting
- live role grants
- payment activation
- invoice generation
- runtime change
- CSS change
- DB mutation
- recognition
- verification
- conversion claim
- seal activation
- delivery contract standing

## CODY / EXECUTOR ROLE

Executor may:

- replace test stubs with real tests
- deploy C3Key locally inside Hardhat test environment
- make narrow contract compatibility corrections if required
- run local compile
- run local tests
- write OAR1 with validation output

Executor may not:

- deploy outside local Hardhat test network
- mint live keys
- store secrets
- commit private keys
- activate payment
- modify runtime / CSS
- mutate DB
- claim recognition / conversion / payment standing

## VALIDATION REQUIREMENTS

OAR1 must include:

1. files modified
2. whether contract source changed
3. if contract changed, exact reason and bounded correction summary
4. compile output summary
5. test output summary
6. behavioral coverage summary
7. confirmation non-transferability tested
8. confirmation one-active-key-per-wallet tested
9. confirmation role restrictions tested
10. confirmation status transitions tested
11. confirmation metadata / tokenURI behavior tested
12. confirmation no deployment occurred outside local test network
13. confirmation no live minting occurred
14. confirmation no secrets committed
15. confirmation no runtime / CSS / DB mutation occurred
16. carried-forward deployment readiness standing

## EXPECTED OAR1

`docs/oar/measures_interoperability/oar1_c3_key_contract_test_implementation_v1.meta.md`

## SUCCESS CONDITION

This OAR2 succeeds when c3 Key stub tests are replaced by real local Hardhat behavioral tests, compile and test commands pass, contract semantics remain bounded, and no deployment, live minting, payment, runtime, CSS, or DB mutation occurs.

## CLOSE

Syntax is proven.

Behavior must prove.

Deployment waits.

Minting waits.

Codex holds.

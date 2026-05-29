---
document_type: oar2
authority_level: working
document_scope: measures_interoperability
title: OAR2 — c3 Key Contract Audit Readiness v1
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
  - contract-audit
  - audit-readiness
  - no-deployment
  - no-mint
  - no-runtime
  - no-db
source_alignment:
  - OAR1 — c3 Key Contract Test Implementation v1
  - OAR1 — c3 Key Contract Tooling Setup v1
  - OAR1 — c3 Key NFT Contract Setup v1
  - OAR Lifecycle — Execution and Handoff
---

# OAR2 — c3 Key Contract Audit Readiness v1

## OBSERVED

The c3 Key contract sequence has completed the following surfaces:

- c3 Key NFT Contract Setup
- c3 Key Visual Identity / Opus Render Prompt
- c3 Key Metadata Schema + Image Binding
- c3 Key Contract Tooling Setup
- c3 Key Contract Test Implementation

The latest contract test closeout confirms:

- 32 behavioral tests passing
- contract source unchanged
- non-transferability tested
- one-active-key-per-wallet tested
- role restrictions tested
- status transitions tested
- metadata / tokenURI behavior tested
- no deployment outside local test network
- no live minting
- no secrets committed
- no runtime / CSS / DB mutation

Deployment is not yet authorized.

Minting is not yet authorized.

## ALIGNED

This OAR2 authorizes an audit-readiness review only.

The purpose is to verify whether the c3 Key contract is ready for external or internal audit before Base Sepolia deployment.

This OAR2 does not authorize deployment.

This OAR2 does not authorize minting.

This OAR2 does not authorize role grants on any live network.

## CORE RULE

Tests prove behavior.

Audit checks assumptions.

Deployment waits.

Minting waits.

Codex holds.

## ROUTED

Executor must review:

1. contract invariants
2. role authority boundaries
3. non-transferability enforcement
4. one-active-key-per-wallet enforcement
5. status transition semantics
6. revoke / redact / migrate implications
7. tokenURI / metadata assumptions
8. pause behavior
9. deployment configuration readiness
10. audit package completeness

## REQUIRED AUDIT QUESTIONS

### 1. Contract identity

Confirm:

- contract name and symbol align to c3 Key
- contract does not imply recognition
- contract does not imply conversion
- contract does not imply payment standing
- contract does not imply seal standing
- contract does not imply delivery contract standing

### 2. Transfer boundary

Confirm:

- transferFrom cannot transfer
- safeTransferFrom cannot transfer
- approvals cannot bypass non-transferability
- operator approvals cannot bypass non-transferability
- no marketplace transfer path exists

### 3. One-active-key invariant

Confirm:

- one active c3 Key per wallet is enforced
- revocation clears active wallet standing if intended
- redaction clears active wallet standing if intended
- migration clears old wallet standing
- migration enforces new wallet availability
- duplicate active issue reverts

### 4. Role boundary

Confirm:

- DEFAULT_ADMIN_ROLE authority is bounded
- MINTER_ROLE can issue only where intended
- REGISTRAR_ROLE can hold / revoke / migrate / update metadata only where intended
- PAUSER_ROLE can pause / unpause only where intended
- redact authority is intentionally admin-only

The prior OAR1 documented that redact is DEFAULT_ADMIN_ROLE, not REGISTRAR_ROLE, and treated the mismatch as an OAR2 documentation discrepancy rather than a contract defect.

### 5. Status semantics

Review whether the following statuses are coherent:

- active
- held
- revoked
- redacted
- migrated

Confirm each transition is intentional and does not create ghost access.

### 6. Revoke / redact / migrate implications

Review:

- revoke = access removed, wallet may receive new key if governed route permits
- redact = stronger removal / concealment state
- migrate = old token becomes migrated, new token relation opens
- held = access paused / constrained but not removed

Flag any ambiguity.

### 7. Metadata / tokenURI

Confirm:

- tokenURI is descriptive only
- metadata does not create standing
- metadata does not expose PII
- metadata image URI is prepared but not live-bound to deployment
- metadata update event exists

### 8. PII boundary

Confirm no onchain storage of:

- legal name
- email
- phone
- address
- assessment answers
- payment details
- private institutional details
- health or sensitive information
- private documents

### 9. Deployment config readiness

Review but do not execute:

- Hardhat config
- network placeholders
- Base Sepolia config
- Base mainnet config
- env variable pattern
- deployment script
- artifact output
- ABI availability

Confirm:

- no inline private keys
- no inline RPC secrets
- no frontend-exposed secrets
- no live deployment run

### 10. Audit package completeness

Audit package should include:

- C3Key.sol
- hardhat.config.ts
- package.json contract scripts
- test file
- test output summary
- metadata JSON draft
- approved metadata image URL
- prior OAR1 closeouts
- deployment script if present

## NOT AUTHORIZED

This OAR2 does not authorize:

- Base Sepolia deployment
- Base mainnet deployment
- live minting
- live role grants
- contract upgrade
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

- review contract source
- review tests
- review Hardhat config
- review deployment script
- review metadata assumptions
- identify audit flags
- write audit-readiness report
- write OAR1 closeout

Executor may not:

- deploy contract
- mint key
- grant live roles
- store secrets
- change contract unless separately routed
- change runtime / CSS
- mutate DB
- claim audit completed by external auditor

## VALIDATION REQUIREMENTS

OAR1 must include:

1. files reviewed
2. contract invariant review
3. role boundary review
4. status transition review
5. revoke / redact / migrate review
6. metadata / tokenURI review
7. PII boundary review
8. deployment config review
9. audit package checklist
10. unresolved audit flags, if any
11. deployment readiness decision:
    - ready_for_base_sepolia_oar2
    - or hold_for_correction_oar2
12. confirmation no deployment occurred
13. confirmation no minting occurred
14. confirmation no secrets committed
15. confirmation no runtime / CSS / DB mutation occurred

## EXPECTED OAR1

`docs/oar/measures_interoperability/oar1_c3_key_contract_audit_readiness_v1.meta.md`

## SUCCESS CONDITION

This OAR2 succeeds when the c3 Key contract is reviewed for audit readiness, unresolved flags are documented, deployment readiness is explicitly decided, and no deployment, minting, payment, runtime, CSS, or DB mutation occurs.

## CLOSE

Behavior is proven.

Audit readiness checks.

Deployment waits.

Minting waits.

Codex holds.

---
document_type: oar1
authority_level: working
document_scope: measures_interoperability
title: OAR1 — c3 Key Contract Test Implementation v1
status: completed
version: v1
operator: op044
date: 2026-05-29
source_oar2: docs/oar/measures_interoperability/oar2_c3_key_contract_test_implementation_v1.meta.md
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
  - measures-interoperability
  - c3-key
  - contract-tests
  - hardhat-v3
  - behavioral-tests
  - all-passing
  - no-deployment
  - no-mint
source_alignment:
  - OAR2 — c3 Key Contract Test Implementation v1
  - OAR1 — c3 Key Contract Tooling Setup v1
  - OAR1 — c3 Key NFT Contract Setup v1
  - OAR Lifecycle — Execution and Handoff
---

# OAR1 — c3 Key Contract Test Implementation v1

## Status

**Completed.**

32 behavioral tests implemented and passing. No contract source changes. No deployment. No live minting. No secrets committed. Contract semantics preserved.

## 1 — Pre-Seating Gate Confirmation

| Gate | Status |
|---|---|
| Contract tooling OAR1 confirmed (Hardhat v3, compile verified) | CONFIRMED |
| C3Key.sol compiles with solc 0.8.28 | CONFIRMED |
| No contract deployment | CONFIRMED |
| No live minting | CONFIRMED |
| No payment activated | CONFIRMED |
| No runtime file modified | CONFIRMED |
| No CSS file modified | CONFIRMED |
| No DB mutation | CONFIRMED |

## 2 — OAR2 Seated

`docs/oar/measures_interoperability/oar2_c3_key_contract_test_implementation_v1.meta.md`

## 3 — Files Modified

| File | Action |
|---|---|
| `contracts/c3-key/test/C3Key.test.ts` | Modified — all 28 stubs replaced with 32 behavioral tests |

**Contract source unchanged.** No corrections to `C3Key.sol` were required.

## 4 — Narrow Test Corrections Required

### 4.1 — ethers v6 `interface.getFunction()` returns null (not throws)

**Original approach:** `expect(() => c3Key.interface.getFunction("recognize")).to.throw()`

**Actual behavior:** In the installed ethers v6 build, `Interface.getFunction(name)` returns `null` when the function does not exist rather than throwing. Chai's `.to.throw()` assertion failed because no exception was raised.

**Correction:** Switched to `interface.fragments` filtering:

```typescript
const fnNames = c3Key.interface.fragments
  .filter((f: any) => f.type === "function")
  .map((f: any) => f.name as string)
expect(fnNames).to.not.include("recognize")
```

**Impact:** Test logic unchanged — the assertion still confirms the named functions do not exist in the contract ABI. No contract change.

### 4.2 — OAR2 Section 7 Lists REGISTRAR_ROLE for `redact` — Contract Uses DEFAULT_ADMIN_ROLE

**OAR2 section 7 stated:**

> REGISTRAR_ROLE can redact

**Contract code:**

```solidity
function redact(uint256 tokenId, bytes32 reasonHash)
    external onlyRole(DEFAULT_ADMIN_ROLE)
```

**Resolution:** Tests were written to match the contract (DEFAULT_ADMIN_ROLE for redact). No contract correction made — this is a documentation discrepancy in the OAR2, not a contract defect.

The redact tests and access control tests confirm:

- DEFAULT_ADMIN_ROLE can redact
- REGISTRAR_ROLE cannot redact (rejected with `AccessControlUnauthorizedAccount`)
- Non-admin cannot redact

The original test stub also reflected this correctly (`it("only DEFAULT_ADMIN_ROLE can redact")`). OAR2 section 7 text was inconsistent with both the contract and the stub.

## 5 — Compile Output Summary

```
No contracts to compile
```

Artifacts already current from prior tooling OAR1. No recompilation needed.

## 6 — Test Output Summary

```
32 passing (5s)
```

All 32 tests pass. No failures. Test run completed in ~5 seconds on local Hardhat in-memory network.

## 7 — Test Architecture

Each test creates a fresh isolated Hardhat in-memory network via `network.create()`. No shared mutable state between tests. All state changes are local to each test's network instance.

Two shared helpers:

- `deployC3Key()` — creates network, deploys contract, grants all four roles
- `deployWithKey()` — calls `deployC3Key()` then issues tokenId 1 to wallet1

## 8 — Behavioral Coverage Summary

| Suite | Tests | Behavior Confirmed |
|---|---|---|
| deployment | 2 | name, symbol, DEFAULT_ADMIN_ROLE on deploy |
| non-transferable | 5 | transferFrom, safeTransfer(3-arg), safeTransfer(4-arg), approve-based, setApprovalForAll-based |
| one-per-wallet | 3 | issue to new wallet, revert on duplicate, issue after revocation |
| hold | 2 | REGISTRAR_ROLE can hold, revert on non-active key |
| revoke | 3 | revoke active, revoke held, revert on already-revoked |
| redact | 2 | DEFAULT_ADMIN_ROLE can redact, non-admin rejected |
| migrate | 3 | migrate wallet, event args, revert if new wallet active |
| tokenURI / metadata | 3 | tokenURI at issue, update by registrar, non-registrar rejected |
| access control | 4 | issue (minter), hold/revoke/migrate/update (registrar), redact (admin), pause (pauser) |
| pause | 3 | blocks issue, blocks migrate, unpause restores issue |
| boundary | 2 | name/symbol no recognition claim, no PII in KeyData struct |

## 9 — OAR2 Coverage Checklist

### Deployment
- ✓ deploys locally — confirmed
- ✓ name and symbol — confirmed
- ✓ deployer receives DEFAULT_ADMIN_ROLE — confirmed
- ✓ expected roles exist — confirmed (MINTER, REGISTRAR, PAUSER, DEFAULT_ADMIN all grantable)

### Role-bound mint / issue
- ✓ MINTER_ROLE can issue — confirmed
- ✓ non-minter rejected — confirmed (`AccessControlUnauthorizedAccount`)
- ✓ issued key records wallet relation — confirmed (`hasActiveKey`)
- ✓ issued key records key type — confirmed (`getKeyData().keyType`)
- ✓ issued key records active status — confirmed (`getKeyData().keyStatus === 0n`)
- ✓ C3KeyIssued emitted — confirmed

### One-active-key-per-wallet
- ✓ duplicate active key reverts — confirmed
- ✓ new key permitted after revocation — confirmed
- ✓ migration enforces one-active — confirmed (reverts if new wallet active)

### Non-transferability
- ✓ transferFrom reverts — confirmed
- ✓ safeTransferFrom (3-arg) reverts — confirmed
- ✓ safeTransferFrom (4-arg) reverts — confirmed
- ✓ approve does not enable transfer — confirmed
- ✓ setApprovalForAll does not enable transfer — confirmed

### Hold behavior
- ✓ REGISTRAR_ROLE can hold — confirmed, event emitted, status updated
- ✓ non-registrar rejected — confirmed (access control suite)
- ✓ revert on non-active key — confirmed

### Revoke behavior
- ✓ REGISTRAR_ROLE can revoke active — confirmed
- ✓ REGISTRAR_ROLE can revoke held — confirmed
- ✓ revoked clears wallet active flag — confirmed
- ✓ non-registrar rejected — confirmed
- ✓ revert on already-revoked — confirmed

### Redact behavior
- ✓ DEFAULT_ADMIN_ROLE can redact — confirmed (OAR2 doc discrepancy noted above)
- ✓ non-admin rejected — confirmed
- ✓ C3KeyRedacted emitted — confirmed
- ✓ redacted clears wallet active flag — confirmed

### Migration behavior
- ✓ REGISTRAR_ROLE can migrate — confirmed
- ✓ old wallet relation cleared — confirmed (`hasActiveKey(wallet1) === false`)
- ✓ new wallet receives active key — confirmed (`hasActiveKey(wallet2) === true`)
- ✓ old token status → migrated — confirmed (`keyStatus === 4n`)
- ✓ one-active-key-per-wallet enforced — confirmed (revert if new wallet active)
- ✓ C3KeyMigrated emitted with correct args — confirmed

### tokenURI / metadata
- ✓ tokenURI returns issued URI — confirmed
- ✓ REGISTRAR_ROLE can update — confirmed, MetadataUpdated emitted
- ✓ non-registrar rejected — confirmed
- ✓ metadata URI not treated as authority — documented in boundary suite

### Pause behavior
- ✓ PAUSER_ROLE can pause — confirmed
- ✓ non-pauser rejected — confirmed
- ✓ paused blocks issue (`EnforcedPause`) — confirmed
- ✓ paused blocks migrate (`EnforcedPause`) — confirmed
- ✓ unpause restores issue — confirmed

### Access control
- ✓ issue — MINTER_ROLE only
- ✓ hold / revoke / migrate / updateMetadata — REGISTRAR_ROLE only
- ✓ redact — DEFAULT_ADMIN_ROLE only
- ✓ pause / unpause — PAUSER_ROLE only

### Boundary behavior
- ✓ name = "c3 Key", symbol = "C3KEY"
- ✓ no `recognize`, `certify`, or `verify` functions in ABI
- ✓ KeyData struct contains only governed fields (no PII)

## 10 — Validation Proof

| Check | Expected | Result |
|---|---|---|
| Files modified documented | confirmed | PASS |
| Contract source unchanged | no contract edits | PASS |
| Compile command passes | `npm run contracts:compile` | PASS |
| Test command passes | `npm run contracts:test` | PASS |
| All 32 tests pass | 32 passing | PASS |
| Non-transferability tested | 5 transfer-path tests | PASS |
| One-active-key-per-wallet tested | 3 tests including post-revocation | PASS |
| Role restrictions tested | all 4 roles, all restricted functions | PASS |
| Status transitions tested | hold, revoke, redact, migrate | PASS |
| tokenURI / metadata behavior tested | 3 tests | PASS |
| No deployment outside local test network | absent | PASS |
| No live minting occurred | absent | PASS |
| No secrets committed | confirmed | PASS |
| No runtime / CSS / DB mutation | absent | PASS |
| Test correction documented (fragments pattern) | documented above | PASS |
| OAR2 doc discrepancy documented (redact role) | documented above | PASS |

## 11 — Carried Forward

| Item | Route |
|---|---|
| Contract audit | Future contract audit OAR2 |
| Testnet deployment (Base Sepolia) | Future testnet deployment OAR2 |
| Mainnet deployment (Base) | Future mainnet deployment OAR2 |
| MINTER_ROLE and REGISTRAR_ROLE grant post-deployment | Future role grant OAR2 |
| Live c3 Key minting | Future key mint OAR2 |
| `tokenURI` binding to deployed contract | Future metadata OAR2 post-deployment |
| `contracts:deploy:base-sepolia` wired but not executed | Deployment OAR2 required before execution |

## Close

Stubs replaced.

Behavior proven.

32 tests passing.

No deployment.

No minting.

No secrets committed.

Contract semantics preserved.

Audit waits for its OAR2.

Codex holds.

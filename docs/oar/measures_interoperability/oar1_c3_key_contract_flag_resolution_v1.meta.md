---
document_type: oar1
authority_level: working
document_scope: measures_interoperability
title: OAR1 — c3 Key Contract Flag Resolution v1
status: completed
version: v1
operator: op044
date: 2026-05-29
source_oar2: docs/oar/measures_interoperability/oar2_c3_key_contract_audit_readiness_v1.meta.md
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
  - contract-audit
  - flag-resolution
  - contract-correction
  - test-updated
  - no-deployment
  - no-mint
source_alignment:
  - OAR1 — c3 Key Contract Audit Readiness v1
  - OAR2 — c3 Key Contract Audit Readiness v1
  - OAR Lifecycle — Execution and Handoff
---

# OAR1 — c3 Key Contract Flag Resolution v1

## Status

**Completed.**

All four audit flags resolved per operator instruction. One contract correction applied. Tests updated and extended. 35 tests passing. No deployment. No minting. No secrets committed.

## 1 — Operator Instructions Received

Operator responded to the four audit flags from `oar1_c3_key_contract_audit_readiness_v1.meta.md` with the following explicit decisions:

> **Flag 1:** Do NOT allow migrate from revoked/redacted. Allow migrate only from active or held.
>
> **Flag 2:** Keep redact as status-only, no burn. Reason: immutable trace remains, active access is removed.
>
> **Flag 3:** Fix in deployment OAR2 before running.
>
> **Flag 4:** Document activeKeyId() must be paired with hasActiveKey().

## 2 — Flag 1 Resolution — Contract Correction

**Decision:** `migrate()` must enforce status precondition. Only `active` or `held` keys may be migrated. Revoked, redacted, and migrated tokens are not migratable.

### Change Applied

**File:** `contracts/c3-key/C3Key.sol`

**Before:**

```solidity
function migrate(
    uint256 oldTokenId,
    address newWallet,
    string calldata metadataURI,
    bytes32 sourceTraceHash
) external onlyRole(REGISTRAR_ROLE) whenNotPaused returns (uint256) {
    require(!_walletHasActiveKey[newWallet], "C3Key: new wallet already holds active key");
    address oldWallet = ownerOf(oldTokenId);
```

**After:**

```solidity
function migrate(
    uint256 oldTokenId,
    address newWallet,
    string calldata metadataURI,
    bytes32 sourceTraceHash
) external onlyRole(REGISTRAR_ROLE) whenNotPaused returns (uint256) {
    KeyStatus s = _keyData[oldTokenId].keyStatus;
    require(s == KeyStatus.active || s == KeyStatus.held, "C3Key: key not migratable");
    require(!_walletHasActiveKey[newWallet], "C3Key: new wallet already holds active key");
    address oldWallet = ownerOf(oldTokenId);
```

**Behavior impact:**

- `migrate` on `active` key — PERMITTED (unchanged)
- `migrate` on `held` key — PERMITTED (now explicitly confirmed)
- `migrate` on `revoked` key — REVERTS with "C3Key: key not migratable"
- `migrate` on `redacted` key — REVERTS with "C3Key: key not migratable"
- `migrate` on `migrated` key — REVERTS with "C3Key: key not migratable"

**Contract semantics preserved:** Non-transferability, one-active-key-per-wallet, role boundaries, all status transitions — unchanged.

### Tests Updated

Three tests added to the `migrate` suite in `contracts/c3-key/test/C3Key.test.ts`:

| Test | Validates |
|---|---|
| "allows migrate on a held key" | `held` → `migrated` permitted; new wallet receives active key |
| "reverts migrate if source key is revoked" | `revoked` → revert "C3Key: key not migratable" |
| "reverts migrate if source key is redacted" | `redacted` → revert "C3Key: key not migratable" |

Migrate suite now has 6 tests (previously 3).

## 3 — Flag 2 Resolution — No Contract Change

**Decision:** `redact()` remains status-only. No token burn.

**Operator rationale:** Immutable trace remains; active access is removed.

**Design confirmed:**

- Redaction changes `keyStatus` to `redacted` and clears `_walletHasActiveKey`
- The ERC721 token persists — the redaction is visible onchain as an immutable event record
- `ownerOf()` and `tokenURI()` continue to work post-redaction (token not erased)
- Access is fully removed — `_walletHasActiveKey[wallet] = false`
- The redacted state is publicly auditable as a permanent trace of the governance action

No contract change. No test change.

## 4 — Flag 3 Resolution — Deferred

**Decision:** Deployment script (`contracts/c3-key/deploy-c3-key.ts`) import correction is deferred to the deployment OAR2.

The script uses `import { ethers } from "hardhat"` (Hardhat v2 pattern) which fails with Hardhat v3. The script is not run during this session and is not authorized to run without a deployment OAR2. The correction will be applied in the deployment OAR2 scope.

No action in this OAR1.

## 5 — Flag 4 Resolution — Integration Documentation

**Decision:** Document that `activeKeyId()` must always be paired with `hasActiveKey()`.

**Governing rule:**

`_walletActiveKeyId[wallet]` is set on `issue` and on `migrate` (new wallet), but is NOT cleared on `revoke`, `redact`, `hold`, or `migrate` (old wallet). After revocation or migration, `activeKeyId(wallet)` returns the last-known token ID for that wallet, which may no longer be active.

**Correct usage pattern for integrators:**

```typescript
// Always check hasActiveKey before trusting activeKeyId
if (await c3Key.hasActiveKey(wallet)) {
  const tokenId = await c3Key.activeKeyId(wallet)
  // tokenId is valid and active
}
```

**Incorrect usage (do not rely on alone):**

```typescript
// activeKeyId alone is not safe — may return stale ID after revoke or migrate
const tokenId = await c3Key.activeKeyId(wallet)
```

This is documented here as the canonical integration note. No contract change required — the behavior is expected and consistent. Auditors and integrators should be directed to this note.

## 6 — Compile Output

```
Warning: Unreachable code.
   --> .\node_modules\@openzeppelin\contracts\token\ERC721\ERC721.sol:135:9
   ERC721Utils.checkOnERC721Received(...)

Compiled 1 Solidity file with solc 0.8.28 (evm target: cancun)
```

Warning source: OpenZeppelin library only — same unreachable code warning as prior OAR1s. Expected for non-transferable contract. `C3Key.sol` itself compiles clean.

## 7 — Test Output

```
35 passing (5s)
```

All 35 tests pass. Three new migrate tests added (Flags 1 coverage). No regressions.

| Suite | Tests |
|---|---|
| deployment | 2 |
| non-transferable | 5 |
| one-per-wallet | 3 |
| hold | 2 |
| revoke | 3 |
| redact | 2 |
| migrate | 6 (+3 from flag resolution) |
| tokenURI / metadata | 3 |
| access control | 4 |
| pause | 3 |
| boundary | 2 |
| **Total** | **35** |

## 8 — Updated Deployment Readiness

All four flags are now resolved. Prerequisites from the audit readiness OAR1 are updated:

| Prerequisite | Status |
|---|---|
| Operator confirm: migrate-on-revoked/redacted (Flag 1) | RESOLVED — contract fix applied |
| Operator confirm: redact without burn (Flag 2) | RESOLVED — confirmed by design |
| Fix `deploy-c3-key.ts` v3 import (Flag 3) | DEFERRED — deployment OAR2 |
| `activeKeyId()` stale-read caveat (Flag 4) | RESOLVED — documented above |

**Deployment readiness decision remains: `ready_for_base_sepolia_oar2`**

The one remaining prerequisite (deploy script import fix) is in-scope for the deployment OAR2 itself and does not block issuance of that OAR2.

## 9 — Validation

| Check | Result |
|---|---|
| Flag 1 contract correction applied and documented | PASS |
| Flag 2 design decision confirmed and documented | PASS |
| Flag 3 deferred correctly to deployment OAR2 | PASS |
| Flag 4 integration documentation recorded | PASS |
| Compile passes after correction | PASS |
| 35 tests pass after correction | PASS |
| No deployment occurred | PASS |
| No minting occurred | PASS |
| No secrets committed | PASS |
| No runtime / CSS / DB mutation | PASS |
| Contract non-transferability unchanged | PASS |
| One-active-key-per-wallet unchanged | PASS |
| Role boundaries unchanged | PASS |

## Close

Flags resolved.

Contract corrected.

35 tests passing.

No deployment.

No minting.

Codex holds.

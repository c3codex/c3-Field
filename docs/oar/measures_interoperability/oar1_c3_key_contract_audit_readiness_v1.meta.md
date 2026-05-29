---
document_type: oar1
authority_level: working
document_scope: measures_interoperability
title: OAR1 — c3 Key Contract Audit Readiness v1
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
  - audit-readiness
  - ready-for-base-sepolia-oar2
  - no-deployment
  - no-mint
source_alignment:
  - OAR2 — c3 Key Contract Audit Readiness v1
  - OAR1 — c3 Key Contract Test Implementation v1
  - OAR1 — c3 Key Contract Tooling Setup v1
  - OAR1 — c3 Key NFT Contract Setup v1
  - OAR Lifecycle — Execution and Handoff
---

# OAR1 — c3 Key Contract Audit Readiness v1

## Status

**Completed.**

Audit-readiness review executed. Four audit flags identified — one operational (deploy script import), three design confirmations. Contract behavior is sound. Deployment readiness decision: **`ready_for_base_sepolia_oar2`**, subject to prerequisites documented in Section 11.

## 1 — Pre-Seating Gate Confirmation

| Gate | Status |
|---|---|
| 32 behavioral tests passing | CONFIRMED |
| Contract source unchanged since test OAR1 | CONFIRMED |
| No contract deployment | CONFIRMED |
| No live minting | CONFIRMED |
| No payment activated | CONFIRMED |
| No runtime file modified | CONFIRMED |
| No CSS file modified | CONFIRMED |
| No DB mutation | CONFIRMED |

## 2 — OAR2 Seated

`docs/oar/measures_interoperability/oar2_c3_key_contract_audit_readiness_v1.meta.md`

## 3 — Files Reviewed

| File | Type |
|---|---|
| `contracts/c3-key/C3Key.sol` | Contract source |
| `contracts/c3-key/deploy-c3-key.ts` | Deployment script |
| `contracts/c3-key/test/C3Key.test.ts` | Behavioral tests |
| `hardhat.config.ts` | Hardhat v3 config |
| `package.json` | Contract scripts |
| `docs/oar/measures_interoperability/metadata/c3-key-metadata-v1.json` | Metadata draft |

## 4 — Contract Identity Review

| Claim | Review |
|---|---|
| Name = "c3 Key" | CONFIRMED — `ERC721("c3 Key", "C3KEY")` |
| Symbol = "C3KEY" | CONFIRMED |
| NatSpec boundary disclaimer | CONFIRMED — "does not confer recognition, verification, certification, conversion, payment standing, seal standing, or delivery contract standing" |
| No `recognize`, `certify`, `verify` functions | CONFIRMED — verified against ABI in boundary tests |
| Inherits ERC721, AccessControl, Pausable only | CONFIRMED |

**Result: PASS**

## 5 — Transfer Boundary Review

The contract overrides two transfer paths:

```solidity
function transferFrom(address, address, uint256) public pure override {
    revert("C3Key: non-transferable");
}

function safeTransferFrom(address, address, uint256, bytes memory) public pure override {
    revert("C3Key: non-transferable");
}
```

| Path | Enforcement |
|---|---|
| `transferFrom` | Overridden — always reverts |
| `safeTransferFrom` (4-arg) | Overridden — always reverts |
| `safeTransferFrom` (3-arg) | Inherited — calls 4-arg, which always reverts |
| `approve` + `transferFrom` | Approval succeeds; transfer still reverts |
| `setApprovalForAll` + `transferFrom` | Approval succeeds; transfer still reverts |
| Marketplace transfer path | None — no `onERC721Received` hook path that bypasses the overrides |

All five transfer paths confirmed via behavioral tests (non-transferable suite, 5 tests).

**Result: PASS**

## 6 — One-Active-Key Invariant Review

```solidity
require(!_walletHasActiveKey[wallet], "C3Key: wallet already holds active key");
```

| Path | Enforcement |
|---|---|
| Duplicate `issue` reverts | CONFIRMED — `_walletHasActiveKey` checked before mint |
| Revocation clears active flag | CONFIRMED — `revoke()` sets `_walletHasActiveKey[wallet] = false` |
| Redaction clears active flag | CONFIRMED — `redact()` sets `_walletHasActiveKey[wallet] = false` |
| Migration clears old wallet active flag | CONFIRMED — `migrate()` sets `_walletHasActiveKey[oldWallet] = false` |
| Migration enforces new wallet availability | CONFIRMED — `require(!_walletHasActiveKey[newWallet])` |
| Wallet can re-issue after revocation | CONFIRMED — tested in one-per-wallet suite |

**`hold` behavior note:** `hold()` does NOT clear `_walletHasActiveKey`. A held wallet still occupies the one-key-per-wallet slot and cannot receive a new key via `issue`. The held slot can only be released by subsequent `revoke`, `redact`, or `migrate`. This is consistent with "held = access paused but not removed." Confirmed by design.

**Result: PASS**

## 7 — Role Boundary Review

| Role | Authority | Assessment |
|---|---|---|
| `DEFAULT_ADMIN_ROLE` | Granted to `admin` by constructor; can `redact`, `grantRole`, `revokeRole` | BOUNDED |
| `MINTER_ROLE` | Can `issue`; not granted by constructor — must be explicitly granted by admin | BOUNDED |
| `REGISTRAR_ROLE` | Can `hold`, `revoke`, `migrate`, `updateMetadata`; not granted by constructor | BOUNDED |
| `PAUSER_ROLE` | Can `pause`, `unpause`; not granted by constructor | BOUNDED |

Constructor grants only `DEFAULT_ADMIN_ROLE` to `admin`. All other roles require explicit post-deploy grant by `DEFAULT_ADMIN_ROLE`. No role self-escalation path exists. AccessControl uses OpenZeppelin's `DEFAULT_ADMIN_ROLE` hierarchy (`grantRole` is admin-gated).

**`redact` role clarification:** `redact` uses `onlyRole(DEFAULT_ADMIN_ROLE)`. OAR2 section 7 text listed REGISTRAR_ROLE — this was a documentation discrepancy already flagged in the test OAR1. The contract behavior is intentionally admin-only for redact. No correction made.

**Result: PASS**

## 8 — Status Transition Review

| Status | Set by | Clears `_walletHasActiveKey` | Notes |
|---|---|---|---|
| `active` | `issue`, `migrate` (new token) | n/a (sets to `true`) | Entry state |
| `held` | `hold` | No | Slot remains occupied |
| `revoked` | `revoke` | Yes | Active or held → revoked |
| `redacted` | `redact` | Yes | Any status → redacted (see Flag 2) |
| `migrated` | `migrate` | Yes (old wallet) | Any status → migrated (see Flag 1) |

**Transitions confirmed:**
- `active → held` (via `hold`) — requires `active`
- `active → revoked` (via `revoke`) — requires `active` or `held`
- `held → revoked` (via `revoke`) — CONFIRMED
- `active → migrated` (via `migrate`) — no status check (see Flag 1)
- Any → `redacted` (via `redact`) — no status check (see Flag 2)

**Ghost access risk:** No. Every non-active terminal state either clears `_walletHasActiveKey` (revoked, redacted, migrated) or keeps the slot held (held). No path leaves `_walletHasActiveKey = true` on a terminal status.

**Result: PASS (with Flags 1 and 2 for design confirmation)**

## 9 — Revoke / Redact / Migrate Implications

### Revoke

- Clears wallet active flag → wallet can receive new key if governed route permits
- Token persists in wallet; status changes to `revoked`
- Revoked token cannot be re-revoked (reverts "C3Key: not revokable")
- Revoked token CAN be migrated (see Flag 1)

### Redact

- Clears wallet active flag
- Token persists — NOT burned (see Flag 2)
- `tokenURI()` still works post-redaction (returns the stored `metadataURI`)
- `redact` has no status precondition — can be applied to any status

### Migrate

- Old token → `migrated`; `_walletHasActiveKey[oldWallet] = false`
- New token minted → `active`; `_walletHasActiveKey[newWallet] = true`
- No status precondition on old token (see Flag 1)
- `_walletActiveKeyId[oldWallet]` is NOT cleared post-migration (see Flag 4)

## 10 — Metadata / tokenURI Review

| Item | Assessment |
|---|---|
| `tokenURI` returns per-token `metadataURI` set at issue | CONFIRMED |
| `metadataURI` is a string pointer — descriptive only | CONFIRMED |
| Metadata update event (`MetadataUpdated`) exists | CONFIRMED |
| Only REGISTRAR_ROLE can update metadata | CONFIRMED |
| Metadata image URL confirmed live | CONFIRMED — HTTP 200, Supabase bucket |
| Metadata description includes boundary disclaimers | CONFIRMED |
| Metadata does not expose PII | CONFIRMED |
| Metadata does not create standing | CONFIRMED — description and attributes explicitly state boundaries |
| `tokenURI` not yet bound to deployed contract | CONFIRMED — no live deployment |

**Template metadata note:** The draft `c3-key-metadata-v1.json` uses static attribute values (`named_individual`, `active`). Per-key issued metadata would need per-issuance `metadataURI` values pointing to key-specific metadata. The template demonstrates format and boundary language; it is not served as-is to the contract.

**Result: PASS**

## 11 — PII Boundary Review

`KeyData` struct:

```solidity
struct KeyData {
    KeyType   keyType;
    KeyStatus keyStatus;
    uint256   issuedAt;
    string    metadataURI;
    bytes32   sourceTraceHash;
}
```

| Field | PII Risk |
|---|---|
| `keyType` | Enum (named_individual / institution_in_service / temporary_migration) — no PII |
| `keyStatus` | Enum — no PII |
| `issuedAt` | Block timestamp — no PII |
| `metadataURI` | Pointer to off-chain metadata — URI itself is not PII |
| `sourceTraceHash` | `bytes32` hash — opaque, not PII-revealing |

No name, email, phone, address, assessment data, payment details, or private documents are stored onchain. Confirmed by behavioral test (boundary suite).

Off-chain metadata content (the file at `metadataURI`) is outside contract scope. Metadata custody is a governed off-chain responsibility.

**Result: PASS**

## 12 — Deployment Config Review

| Item | Assessment |
|---|---|
| `hardhat.config.ts` uses `configVariable()` for all network secrets | CONFIRMED |
| No inline private key in config | CONFIRMED |
| No inline RPC secret in config | CONFIRMED |
| `baseSepolia` network placeholder configured | CONFIRMED — `type: "http"`, `chainType: "op"` |
| `base` network placeholder configured | CONFIRMED — `type: "http"`, `chainType: "op"` |
| `chainType: "op"` correct for Base / Base Sepolia (OP Stack) | CONFIRMED |
| `.env` and `.env.*` in `.gitignore` | CONFIRMED |
| No frontend-exposed secrets | CONFIRMED — `VITE_*` pattern not used for contract vars |
| Hardhat build artifacts gitignored | CONFIRMED — `cache/`, `artifacts/`, `types/ethers-contracts/` |
| `contracts:deploy:base-sepolia` script wired but not run | CONFIRMED |
| No live deployment run during this review | CONFIRMED |

**Deployment script flag:** `contracts/c3-key/deploy-c3-key.ts` uses `import { ethers } from "hardhat"` — the Hardhat v2 import pattern. This will fail with Hardhat v3. The script is not run during this review (and is not authorized to run without a deployment OAR2), but it must be corrected before the deployment OAR2 can execute. See Audit Flag 3.

**Result: PASS for config. Script correction required before deployment.**

## 13 — Audit Flags

### FLAG 1 — `migrate` accepts any source token status

**Location:** `C3Key.sol` `migrate()` function

**Observation:**

```solidity
function migrate(
    uint256 oldTokenId,
    address newWallet,
    ...
) external onlyRole(REGISTRAR_ROLE) whenNotPaused returns (uint256) {
    require(!_walletHasActiveKey[newWallet], ...);
    address oldWallet = ownerOf(oldTokenId);
    _keyData[oldTokenId].keyStatus = KeyStatus.migrated;  // No status precondition
    _walletHasActiveKey[oldWallet] = false;
    ...
```

A revoked or redacted token can be migrated. This overwrites the terminal status (revoked/redacted) with `migrated` and issues a new active token to the new wallet.

**Security implication:** A `REGISTRAR_ROLE` actor can migrate a revoked key, effectively re-opening access under a new wallet. This may be intentional (REGISTRAR_ROLE is a governed role — intentional re-activation is in-scope), or it may be a gap requiring a status precondition (`require(keyStatus == active || keyStatus == held, ...)`).

**Required action:** Operator must confirm by design — is migration of a revoked or redacted token intended behavior? If not, contract should add a status precondition. This decision must precede the deployment OAR2.

**Severity:** Design confirmation required. Not a blocking security vulnerability if REGISTRAR_ROLE is trusted and governed.

---

### FLAG 2 — `redact` does not burn the token

**Location:** `C3Key.sol` `redact()` function

**Observation:**

```solidity
function redact(uint256 tokenId, bytes32 reasonHash)
    external onlyRole(DEFAULT_ADMIN_ROLE)
{
    address wallet = ownerOf(tokenId);
    _keyData[tokenId].keyStatus = KeyStatus.redacted;
    _walletHasActiveKey[wallet] = false;
    emit C3KeyRedacted(tokenId, reasonHash);
}
```

Redaction changes status but does not burn the token. Post-redaction:
- `ownerOf(tokenId)` still returns the wallet address
- `tokenURI(tokenId)` still returns the stored `metadataURI`
- The ERC721 token persists in the wallet

**Implication:** External auditors and marketplace indexers will see the token with status `redacted`. Metadata URI remains accessible. If the intent is to conceal or remove all trace of the token, the current behavior falls short.

**Design context:** For a non-transferable, access-bearing key, token persistence post-redaction may be acceptable — the wallet can't use the key for access (active flag is cleared), and the status is visible onchain. Whether this meets the "stronger removal" semantics intended by the design is an operator decision.

**Required action:** Operator must confirm by design — is status-only redaction (no burn) the intended "stronger removal" path? If concealment requires token burn, the contract needs a `_burn(tokenId)` call in `redact()`.

**Severity:** Design confirmation required. Not a security vulnerability.

---

### FLAG 3 — Deployment script uses Hardhat v2 import pattern

**Location:** `contracts/c3-key/deploy-c3-key.ts` line 16

**Observation:**

```typescript
import { ethers } from "hardhat"
```

This is the Hardhat v2 pattern. In Hardhat v3, `ethers` is not exported from `hardhat`. The script will throw `SyntaxError: The requested module 'hardhat' does not provide an export named 'ethers'` when run.

**Correction required before deployment OAR2:**

Replace with the Hardhat v3 deployment pattern using `network.connect()` for the configured network. This is the same class of correction that was applied to `C3Key.test.ts` in the tooling OAR1.

The deployment script is not run during this review and is not authorized to run without a deployment OAR2. The correction must be included in or prerequisite to the deployment OAR2.

**Severity:** Operational blocker. Not a security vulnerability.

---

### FLAG 4 — `activeKeyId()` may return stale value after revocation or migration

**Location:** `C3Key.sol` — `_walletActiveKeyId` mapping, `activeKeyId()` view

**Observation:**

`_walletActiveKeyId[wallet]` is set on `issue` and `migrate` (new wallet), but is NOT cleared on `revoke`, `redact`, or `hold`. After revocation, `activeKeyId(wallet)` returns the revoked token ID, while `hasActiveKey(wallet)` returns `false`.

**Implication:** A caller that reads `activeKeyId(wallet)` without also calling `hasActiveKey(wallet)` may act on a stale token ID. The contract's own functions are not affected (they use `_walletHasActiveKey` directly), but external integrators could be misled.

**Required action:** No contract change required at this stage. Document in interface/integration docs: `activeKeyId()` should always be used in conjunction with `hasActiveKey()`. An auditor may recommend clearing `_walletActiveKeyId` on revoke/redact for defense-in-depth.

**Severity:** Integration documentation gap. Not a security vulnerability for the contract itself.

## 14 — Audit Package Checklist

| Item | Status |
|---|---|
| `C3Key.sol` | Present and reviewed |
| `hardhat.config.ts` | Present and reviewed |
| `package.json` contract scripts | Present and reviewed |
| `contracts/c3-key/test/C3Key.test.ts` | Present — 32 tests passing |
| Test output summary | Documented in test OAR1 |
| `contracts/c3-key/deploy-c3-key.ts` | Present — requires v3 correction (Flag 3) |
| `docs/oar/measures_interoperability/metadata/c3-key-metadata-v1.json` | Present and reviewed |
| Approved metadata image URL | Confirmed — Supabase bucket, HTTP 200 |
| Prior OAR1 closeouts | All confirmed above |

## 15 — Deployment Readiness Decision

**Decision: `ready_for_base_sepolia_oar2`**

The c3 Key contract is behaviorally sound. Role boundaries are enforced. Non-transferability is enforced at all transfer paths. One-active-key-per-wallet is enforced. No PII onchain. No inline secrets. No ghost access paths identified.

**Prerequisites before deployment OAR2 executes:**

| Prerequisite | Type |
|---|---|
| Fix `deploy-c3-key.ts` import from v2 to v3 pattern (Flag 3) | Required — will fail without this |
| Operator confirm: migrate-on-revoked/redacted is intended behavior (Flag 1) | Required confirmation |
| Operator confirm: redact without token burn is intended behavior (Flag 2) | Required confirmation |
| Document: `activeKeyId()` stale-read caveat for integrators (Flag 4) | Recommended |

**Deployment sequence remains:**

1. Operator confirms Flags 1 and 2 design decisions
2. Fix `deploy-c3-key.ts` (v3 import) — may be included in deployment OAR2 scope
3. Base Sepolia deployment OAR2 issued and executed
4. Role grants (MINTER_ROLE, REGISTRAR_ROLE, PAUSER_ROLE) via role grant OAR2
5. Testnet validation
6. Mainnet deployment OAR2 (separate, future)
7. Live key mint OAR2 (separate, future)

## 16 — Validation Proof

| Check | Expected | Result |
|---|---|---|
| Files reviewed documented | confirmed | PASS |
| Contract invariant review | completed | PASS |
| Role boundary review | completed | PASS |
| Status transition review | completed | PASS |
| Revoke / redact / migrate reviewed | completed — flags raised | PASS |
| Metadata / tokenURI reviewed | completed | PASS |
| PII boundary reviewed | no PII found | PASS |
| Deployment config reviewed | no inline secrets | PASS |
| Audit package checklist completed | completed | PASS |
| Audit flags documented | 4 flags | PASS |
| Deployment readiness decision | ready_for_base_sepolia_oar2 | PASS |
| No deployment occurred | absent | PASS |
| No minting occurred | absent | PASS |
| No secrets committed | confirmed | PASS |
| No runtime / CSS / DB mutation | absent | PASS |

## 17 — Carried Forward

| Item | Route |
|---|---|
| Operator confirmation: migrate-on-revoked/redacted behavior (Flag 1) | Required before deployment OAR2 |
| Operator confirmation: redact without burn behavior (Flag 2) | Required before deployment OAR2 |
| Fix `deploy-c3-key.ts` v3 import (Flag 3) | Deployment OAR2 prerequisite |
| `activeKeyId()` integration caveat documentation (Flag 4) | Recommended before integrations |
| Base Sepolia deployment | Future deployment OAR2 |
| Mainnet deployment (Base) | Future mainnet deployment OAR2 |
| Live role grants | Future role grant OAR2 |
| Live c3 Key minting | Future key mint OAR2 |

## Close

Review executed.

Four flags documented.

Contract behavior sound.

Deployment readiness confirmed subject to prerequisites.

Deployment waits for its OAR2.

Minting waits.

Codex holds.

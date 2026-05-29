---
document_type: oar1
authority_level: working
document_scope: measures_interoperability
title: OAR1 — c3 Key NFT Contract Setup v1
status: completed
version: v1
operator: op044
date: 2026-05-29
source_oar2: docs/oar/measures_interoperability/oar2_c3_key_nft_contract_setup_v1.meta.md
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
  - nft-contract
  - wallet-bound
  - one-per-wallet
  - non-transferable
  - completed
source_alignment:
  - OAR2 — c3 Key NFT Contract Setup v1
  - OAR1 — Measures Registry Payment / phase_payment Contract v1
  - OAR1 — Measures Registry phase_payment Runtime Surface Contract v1
  - OAR1 — Measures Registry Commerce Trace Schema + Logging Contract v1
  - OAR Lifecycle — Execution and Handoff
---

# OAR1 — c3 Key NFT Contract Setup v1

## Status

**Completed.**

c3 Key NFT contract source produced. Contract artifacts placed at governed paths. No contract deployed. No keys minted. No payment activated. No runtime, CSS, or DB change occurred.

## 1 — Pre-Seating Gate Confirmation

| Gate | Status |
|---|---|
| Payment / phase_payment Contract seated (OAR1 confirmed) | CONFIRMED |
| phase_payment Runtime Surface Contract seated (OAR1 confirmed) | CONFIRMED |
| Commerce Trace Schema + Logging Contract seated (OAR1 confirmed) | CONFIRMED |
| No contract deployed | CONFIRMED |
| No keys minted | CONFIRMED |
| No payment activated | CONFIRMED |
| No secrets committed | CONFIRMED |
| No runtime file modified | CONFIRMED |
| No CSS file modified | CONFIRMED |
| No DB mutation | CONFIRMED |

## 2 — Repo Contract Tooling — Observed State

**No contract tooling is currently configured in this repo.**

This is a Vite/React frontend project. No Hardhat, Foundry, or `@openzeppelin/contracts` installation is present.

Observed root: no `contracts/` folder prior to this OAR. No `hardhat.config.*`, `foundry.toml`, or contract-related `package.json` entries.

Contract source files have been placed as governed artifacts. Compilation and deployment require contract tooling setup, which carries forward as a separate OAR2.

## 3 — Contract Artifacts Produced

| File | Status |
|---|---|
| `contracts/c3-key/C3Key.sol` | PRODUCED |
| `contracts/c3-key/deploy-c3-key.ts` | PRODUCED |
| `contracts/c3-key/test/C3Key.test.ts` | PRODUCED |

## 4 — Contract Design Confirmed

### Standard

ERC-721 (OpenZeppelin) + AccessControl + Pausable. ERC-721 used over ERC-1155 — c3 Key is identity/access-bearing, not a quantity unit.

### Non-Transferable

`transferFrom` and `safeTransferFrom` revert with `"C3Key: non-transferable"`. No marketplace transfer path exists.

### One-Per-Wallet

`require(!_walletHasActiveKey[wallet])` enforced in `issue()`. Wallet may not hold more than one active c3 Key.

### Key Types (confirmed)

`named_individual` / `institution_in_service` / `temporary_migration`

### Key Status Values (confirmed)

`active` / `held` / `revoked` / `redacted` / `migrated`

### Access Roles (confirmed)

| Role | Capability |
|---|---|
| `DEFAULT_ADMIN_ROLE` | Contract administration, redact |
| `MINTER_ROLE` | Issue c3 Keys after governed eligibility |
| `REGISTRAR_ROLE` | Hold, revoke, migrate, update metadata |
| `PAUSER_ROLE` | Pause / unpause mint and migrate |

No role may create recognition or conversion.

### Events (confirmed)

`C3KeyIssued` / `C3KeyHeld` / `C3KeyRevoked` / `C3KeyRedacted` / `C3KeyMigrated` / `MetadataUpdated`

### Onchain Fields (confirmed)

`token_id` / `wallet_address` (owner) / `key_type` / `key_status` / `issued_at` / `metadata_uri` / `source_trace_hash`

No PII onchain. No name, email, phone, address, assessment answers, payment details, or private documents in `KeyData` struct or any onchain mapping.

### Boundary (confirmed)

c3 Key does not confer recognition, verification, certification, conversion status, payment standing, seal standing, or delivery contract standing. Codex holds authority. NFT contract holds access relation only.

### Recommended Chain

Base. EVM-compatible, low-cost, aligns with prior c3 Current / c3 DAO direction.

## 5 — Validation Proof

| Check | Expected | Result |
|---|---|---|
| Repo contract tooling inspected before file placement | confirmed | PASS |
| Observed tooling state reported | no tooling present | PASS |
| One active c3 Key per wallet enforced | confirmed | PASS |
| Transfer disabled | confirmed | PASS |
| No PII in onchain KeyData struct | confirmed | PASS |
| c3 Key does not confer recognition | confirmed | PASS |
| c3 Key does not confer conversion | confirmed | PASS |
| c3 Key does not confer payment standing by itself | confirmed | PASS |
| c3 Key supports wallet-bound payment relation | confirmed | PASS |
| c3 Key supports held / revoked / redacted / migrated states | confirmed | PASS |
| Access roles bounded | confirmed | PASS |
| No contract deployed | absent | PASS |
| No live minting performed | absent | PASS |
| No secrets committed | absent | PASS |
| Test plan / stub produced | confirmed | PASS |

## 6 — Carried Forward

| Item | Route |
|---|---|
| Contract tooling setup (Hardhat or Foundry) | Future contract tooling OAR2 |
| `@openzeppelin/contracts` installation | Future contract tooling OAR2 |
| Contract compilation and audit | Future contract audit OAR2 |
| Testnet (Base Sepolia) deployment and validation | Future testnet deployment OAR2 |
| Mainnet (Base) deployment | Future mainnet deployment OAR2 — requires audit + explicit authorization |
| MINTER_ROLE and REGISTRAR_ROLE grant after deployment | Future role grant OAR2 |
| Live c3 Key mint eligibility and minting | Future key mint OAR2 |
| Offchain ↔ onchain c3 Key sync with `measures_commerce_trace` | Future key sync OAR2 |
| Metadata URI schema and offchain metadata service | Future metadata OAR2 |
| Temporary email-bound key migration path | Future migration OAR2 |
| DAO participation gating via c3 Key | Future DAO OAR2 |

## Close

Contract source is ready.

No key is active.

No wallet is bound.

Tooling comes next.

Deployment waits for its OAR2.

Minting waits for its OAR2.

Codex holds.

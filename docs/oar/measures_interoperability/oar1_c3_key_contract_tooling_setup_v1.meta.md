---
document_type: oar1
authority_level: working
document_scope: measures_interoperability
title: OAR1 — c3 Key Contract Tooling Setup v1
status: completed
version: v1
operator: op044
date: 2026-05-29
source_oar2: docs/oar/measures_interoperability/oar2_c3_key_contract_tooling_setup_v1.meta.md
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
  - contract-tooling
  - hardhat-v3
  - openzeppelin
  - compile-confirmed
  - test-confirmed
  - no-deployment
  - no-mint
source_alignment:
  - OAR2 — c3 Key Contract Tooling Setup v1
  - OAR1 — c3 Key NFT Contract Setup v1
  - OAR Lifecycle — Execution and Handoff
---

# OAR1 — c3 Key Contract Tooling Setup v1

## Status

**Completed.**

Hardhat v3 + TypeScript + OpenZeppelin v5 installed and validated. `C3Key.sol` compiles. 28 test stubs pass. No deployment. No minting. No secrets committed. Contract semantics preserved.

## 1 — Pre-Seating Gate Confirmation

| Gate | Status |
|---|---|
| c3 Key NFT Contract Setup seated (OAR1 confirmed) | CONFIRMED |
| c3 Key visual identity OAR1 confirmed | CONFIRMED |
| c3 Key metadata binding OAR1 confirmed | CONFIRMED |
| No contract deployment | CONFIRMED |
| No minting | CONFIRMED |
| No payment activated | CONFIRMED |
| No runtime file modified | CONFIRMED |
| No CSS file modified | CONFIRMED |
| No DB mutation | CONFIRMED |

## 2 — OAR2 Seated

`docs/oar/measures_interoperability/oar2_c3_key_contract_tooling_setup_v1.meta.md`

## 3 — Selected Tooling Route

**Route: Hardhat v3 + TypeScript + OpenZeppelin v5**

Hardhat v3 was installed as the current stable release (`3.7.0`). Hardhat v3 is native ESM and uses `tsx` (already present in the project) to load TypeScript configs and test files — `ts-node` is not required and was not installed. This aligns with the repo's `"type": "module"` configuration and Node.js `>=22.12.0` requirement.

Alternative route (Foundry) was not used — Hardhat v3 is fully suitable.

## 4 — Package Additions

| Package | Version | Type |
|---|---|---|
| `hardhat` | `^3.7.0` | devDependency |
| `@nomicfoundation/hardhat-toolbox-mocha-ethers` | `^3.0.6` | devDependency |
| `@openzeppelin/contracts` | `^5.6.1` | devDependency |
| `mocha` | installed via toolbox | devDependency |
| `chai` | installed via toolbox | devDependency |
| `ethers` | installed via toolbox | devDependency |
| `@types/mocha` | installed via toolbox | devDependency |
| `@types/chai` | installed via toolbox | devDependency |

Not installed: `ts-node` (not required by Hardhat v3).

## 5 — Files Added / Modified

| File | Action |
|---|---|
| `hardhat.config.ts` | Added — Hardhat v3 config (defineConfig, ESM, mocha-ethers plugin) |
| `tsconfig.hardhat.json` | Added — TypeScript config for contract context (module: node20) |
| `package.json` | Modified — 4 npm scripts added, devDependencies updated |
| `package-lock.json` | Modified — dependency tree updated |
| `.gitignore` | Modified — added `cache/`, `artifacts/`, `.hardhat-build/`, `typechain-types/` |
| `contracts/c3-key/test/C3Key.test.ts` | Modified — v3 import alignment (see Section 6) |

## 6 — Narrow Corrections Required

Two narrow corrections were required to achieve compilation and test execution. Both are reported per OAR2 rule.

### 6.1 — Solidity Compiler Version

**OAR2 config specified:** `solc 0.8.20`

**Actual required:** `solc 0.8.28`

**Reason:** `@openzeppelin/contracts@^5.6.1` uses `pragma solidity ^0.8.24`. The Hardhat compiler version must be `>=0.8.24` to compile OpenZeppelin v5 dependencies.

**Impact on contract:** None. `C3Key.sol` declares `pragma solidity ^0.8.20`, which is satisfied by any `0.8.x >= 0.8.20`. Compiling with `0.8.28` applies no semantic changes. All contract behavior is preserved.

### 6.2 — Test File Import Alignment (Hardhat v3 API)

**OAR2 stub used:** `import { ethers } from "hardhat"` (Hardhat v2 pattern)

**Hardhat v3 pattern:** `import { network } from "hardhat"` — ethers is obtained via `const { ethers } = await network.create()` per test context.

**Change made:** `import { ethers } from "hardhat"` → `import { network } from "hardhat"` with a comment documenting the v3 pattern for future test implementation.

**Impact on contract:** None. This is a test file, not the contract. Contract semantics are unchanged. All test bodies remain stubs (commented out).

## 7 — Compile Output Summary

```
Downloading solc 0.8.28
Downloading solc 0.8.28 (WASM build)

Warning: Unreachable code.
   --> .\node_modules\@openzeppelin\contracts\token\ERC721\ERC721.sol:135:9
   ERC721Utils.checkOnERC721Received(...)

Compiled 1 Solidity file with solc 0.8.28 (evm target: cancun)
```

**Warning source:** OpenZeppelin library code — not C3Key.sol. The `safeTransferFrom` override in C3Key always reverts, making the library's post-transfer hook unreachable. This is expected behavior for a non-transferable contract.

**Contract source:** `C3Key.sol` — compiled clean with no errors or warnings of its own.

## 8 — Test Output Summary

```
28 passing (28 mocha)
```

All 28 test stubs pass. Test bodies are empty stubs — Mocha treats empty `it()` blocks as passing. Full test implementation requires live contract deployment to a Hardhat simulated network, which is carried forward to the test implementation OAR2.

Test coverage (stubbed):

| Suite | Stubs |
|---|---|
| deployment | 2 |
| non-transferable | 2 |
| one-per-wallet | 2 |
| hold | 2 |
| revoke | 3 |
| redact | 2 |
| migrate | 3 |
| tokenURI / metadata | 3 |
| access control | 4 |
| pause | 3 |
| boundary | 2 |

## 9 — Hardhat Config Summary

```
hardhat.config.ts — Hardhat v3, ESM, defineConfig
Plugin: @nomicfoundation/hardhat-toolbox-mocha-ethers
Solidity: 0.8.28 (default profile)
paths.sources: ./contracts
paths.tests: ./contracts/c3-key/test
Networks: hardhat (default), localhost, baseSepolia (placeholder), base (placeholder)
Network secrets: configVariable() — fetched at runtime, never committed
```

## 10 — Validation Proof

| Check | Expected | Result |
|---|---|---|
| Tooling route selected and reported | Hardhat v3 | PASS |
| Package additions documented | confirmed | PASS |
| Files added / modified documented | confirmed | PASS |
| `C3Key.sol` compiles | no errors | PASS |
| 28 test stubs pass | 28 passing | PASS |
| No deployment occurred | absent | PASS |
| No minting occurred | absent | PASS |
| No secrets committed | confirmed | PASS |
| No private keys in config | confirmed | PASS |
| Network secrets use configVariable() | confirmed | PASS |
| c3 Key remains non-transferable | preserved in contract | PASS |
| One-active-key-per-wallet remains enforced | preserved in contract | PASS |
| Contract behavior unchanged | no contract edits | PASS |
| Compiler version correction documented | 0.8.20 → 0.8.28 | PASS |
| Test import correction documented | v2 → v3 pattern | PASS |
| No runtime / CSS / DB mutation | absent | PASS |
| Hardhat build artifacts excluded from git | .gitignore updated | PASS |

## 11 — Carried Forward

| Item | Route |
|---|---|
| Test body implementation (actual contract deploy + assertions) | Future test implementation OAR2 |
| Contract audit | Future contract audit OAR2 |
| Testnet deployment (Base Sepolia) | Future testnet deployment OAR2 |
| Mainnet deployment (Base) | Future mainnet deployment OAR2 |
| MINTER_ROLE and REGISTRAR_ROLE grant post-deployment | Future role grant OAR2 |
| Live c3 Key minting | Future key mint OAR2 |
| `tokenURI` binding to deployed contract | Future metadata OAR2 post-deployment |
| `contracts:deploy:base-sepolia` script wired but not executed | Deployment OAR2 required before execution |

## Close

Tooling installed.

Contract compiled.

Tests pass.

No deployment.

No minting.

No secrets committed.

Contract semantics preserved.

Deployment waits for its OAR2.

Codex holds.

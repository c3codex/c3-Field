---
document_type: oar2
authority_level: working
document_scope: measures_interoperability
title: OAR2 — c3 Key Base Sepolia Deployment Prep — Script Correction v1
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
  - deployment-prep
  - script-correction
  - hardhat-v3
  - no-deployment
  - no-mint
  - no-runtime
  - no-db
source_alignment:
  - OAR1 — c3 Key Contract Flag Resolution v1
  - OAR1 — c3 Key Contract Audit Readiness v1
  - OAR1 — c3 Key Contract Test Implementation v1
  - OAR Lifecycle — Execution and Handoff
---

# OAR2 — c3 Key Base Sepolia Deployment Prep — Script Correction v1

## OBSERVED

The c3 Key contract sequence has completed the following surfaces:

- c3 Key NFT Contract Setup
- c3 Key Visual Identity / Opus Render Prompt
- c3 Key Metadata Schema + Image Binding
- c3 Key Contract Tooling Setup
- c3 Key Contract Test Implementation
- c3 Key Contract Audit Readiness
- c3 Key Contract Flag Resolution

The audit readiness OAR1 (`oar1_c3_key_contract_audit_readiness_v1.meta.md`) identified four flags. The flag resolution OAR1 (`oar1_c3_key_contract_flag_resolution_v1.meta.md`) resolved all four. Flag 3 was explicitly deferred to this surface:

> **Flag 3 — Deploy script uses Hardhat v2 import pattern**
>
> `contracts/c3-key/deploy-c3-key.ts` uses `import { ethers } from "hardhat"` — the Hardhat v2 named-export pattern. Under Hardhat v3 (3.7.0+) with native ESM and `@nomicfoundation/hardhat-toolbox-mocha-ethers`, this import is invalid. The script will fail at runtime if executed as-is.
>
> Deferred to: deployment OAR2 before running.

Current state of the deploy script:

```typescript
import { ethers } from "hardhat"           // INVALID — Hardhat v2 pattern
```

Correct Hardhat v3 pattern for deployment scripts:

```typescript
import hre from "hardhat"
// ...
const { ethers } = hre
```

The Hardhat config (`hardhat.config.ts`) is valid v3 and includes `baseSepolia` and `base` network definitions using `configVariable()` for secret injection at runtime.

35 contract tests pass. No deployment has occurred. No live minting has occurred.

## ALIGNED

This OAR2 authorizes correction of `contracts/c3-key/deploy-c3-key.ts` to use the valid Hardhat v3 import pattern, followed by a compile verification pass.

This OAR2 does not authorize deployment to any network.

This OAR2 does not authorize live minting.

This OAR2 does not authorize role grants on any live network.

This OAR2 does not authorize contract source changes.

## CORE RULE

Script correction only.

Compile must pass after correction.

No deployment.

No minting.

Codex holds.

## ROUTED

Executor must:

1. Replace `import { ethers } from "hardhat"` with `import hre from "hardhat"`
2. Replace direct `ethers.` calls with `hre.ethers.` calls (or destructure: `const { ethers } = hre`)
3. Verify `waitForDeployment()` and `getAddress()` calls remain (already correct — ethers v6 pattern)
4. Verify `ethers.provider.getNetwork()` remains reachable via the corrected import
5. Run compile (`npx hardhat compile`) to confirm no compilation errors after the change
6. Confirm no deployment was executed
7. Write OAR1

### Correction detail

**File:** `contracts/c3-key/deploy-c3-key.ts`

**Change 1 — import:**

Before:
```typescript
import { ethers } from "hardhat"
```

After:
```typescript
import hre from "hardhat"
```

**Change 2 — ethers reference:**

Insert immediately after the import, before `async function main()`:

```typescript
const { ethers } = hre
```

All existing `ethers.` calls in the script body remain unchanged. The destructured `ethers` is the `hre.ethers` object, connected to the network configured at runtime via `--network <name>`.

### Compile verification

Run:
```
npx hardhat compile
```

Expected output: `Compiled 1 Solidity file with solc 0.8.28 (evm target: cancun)` or `Nothing to compile` (cached).

The OZ unreachable-code warning is expected and benign.

## NOT AUTHORIZED

This OAR2 does not authorize:

- Base Sepolia deployment
- Base mainnet deployment
- live minting
- live role grants
- any contract source change (C3Key.sol is not in scope)
- any test change
- payment activation
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

- edit `contracts/c3-key/deploy-c3-key.ts` to correct the import only
- run `npx hardhat compile` to verify
- write OAR1 closeout

Executor may not:

- run the deploy script
- connect to any live network
- deploy the contract
- mint any key
- grant any role on a live network
- store secrets
- change `C3Key.sol`
- change `hardhat.config.ts`
- change any test file

## VALIDATION REQUIREMENTS

OAR1 must include:

1. file modified and exact change applied
2. before / after diff of the corrected import
3. compile output confirming no errors after correction
4. confirmation no deployment occurred
5. confirmation no minting occurred
6. confirmation no secrets committed
7. confirmation no runtime / CSS / DB mutation occurred
8. confirmation `C3Key.sol` was not modified
9. confirmation `hardhat.config.ts` was not modified
10. confirmation 35 tests remain at their last-known passing state (no test re-run required unless executor chooses to verify)

## EXPECTED OAR1

`docs/oar/measures_interoperability/oar1_c3_key_base_sepolia_deployment_prep_script_correction_v1.meta.md`

## SUCCESS CONDITION

This OAR2 succeeds when `deploy-c3-key.ts` uses valid Hardhat v3 import syntax, compile passes, and no deployment, minting, payment, runtime, CSS, or DB mutation occurs.

## CLOSE

Script corrected.

Compile verified.

Deployment waits.

Minting waits.

Codex holds.

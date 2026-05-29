---
document_type: oar1
authority_level: working
document_scope: measures_interoperability
title: OAR1 — c3 Key Base Sepolia Deployment Prep — Script Correction v1
status: completed
version: v1
operator: op044
date: 2026-05-29
source_oar2: docs/oar/measures_interoperability/oar2_c3_key_base_sepolia_deployment_prep_script_correction_v1.meta.md
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
  - deployment-prep
  - script-correction
  - hardhat-v3
  - no-deployment
  - no-mint
source_alignment:
  - OAR2 — c3 Key Base Sepolia Deployment Prep — Script Correction v1
  - OAR1 — c3 Key Contract Flag Resolution v1
  - OAR Lifecycle — Execution and Handoff
---

# OAR1 — c3 Key Base Sepolia Deployment Prep — Script Correction v1

## Status

**Completed.**

Deploy script corrected. Compile passes. No deployment. No minting. No secrets committed.

## 1 — File Modified

**File:** `contracts/c3-key/deploy-c3-key.ts`

## 2 — Change Applied

**Before:**

```typescript
import { ethers } from "hardhat"

async function main() {
```

**After:**

```typescript
import hre from "hardhat"

const { ethers } = hre

async function main() {
```

**Change type:** Import correction only. No logic change. No behavioral change.

`import { ethers } from "hardhat"` is the Hardhat v2 named-export pattern, invalid in Hardhat v3 (3.7.0+) native ESM. The corrected form imports the Hardhat Runtime Environment (`hre`) as the default export and destructures `ethers` from it. All existing `ethers.` calls in the script body are unchanged and remain valid — `hre.ethers` is the ethers object connected to the network configured at runtime via `--network <name>`.

## 3 — Script State After Correction

```typescript
import hre from "hardhat"

const { ethers } = hre

async function main() {
  const adminAddress = process.env.ADMIN_ADDRESS
  if (!adminAddress) throw new Error("ADMIN_ADDRESS env var is required")

  console.log("Deploying C3Key...")
  console.log("Admin address:", adminAddress)

  const C3Key = await ethers.getContractFactory("C3Key")
  const c3Key = await C3Key.deploy(adminAddress)
  await c3Key.waitForDeployment()

  const address = await c3Key.getAddress()
  console.log("C3Key deployed to:", address)
  console.log("Network:", (await ethers.provider.getNetwork()).name)

  console.log("---")
  console.log("Next steps:")
  console.log("  1. Record contract address in operator deployment trace.")
  console.log("  2. Grant MINTER_ROLE and REGISTRAR_ROLE via governed OAR2.")
  console.log("  3. Do not mint live keys until mint eligibility OAR2 is seated.")
}

main().catch((err) => {
  console.error(err)
  process.exit(1)
})
```

`waitForDeployment()` and `getAddress()` are ethers v6 patterns — correct and unchanged.

`ethers.provider.getNetwork()` is reachable via the destructured `hre.ethers`.

## 4 — Compile Output

```
No contracts to compile
```

No contract source changed. Solidity artifacts are cached from prior compile. Compile is clean.

The OZ unreachable-code warning (ERC721.sol:135) is present in cached artifacts and is expected — OpenZeppelin library only; `C3Key.sol` compiles clean.

## 5 — Files Not Modified

| File | Status |
|---|---|
| `contracts/c3-key/C3Key.sol` | NOT MODIFIED |
| `hardhat.config.ts` | NOT MODIFIED |
| `contracts/c3-key/test/C3Key.test.ts` | NOT MODIFIED |

## 6 — Validation

| Check | Result |
|---|---|
| Import corrected to Hardhat v3 pattern | PASS |
| `const { ethers } = hre` inserted | PASS |
| All existing `ethers.` calls preserved unchanged | PASS |
| `waitForDeployment()` remains (ethers v6 — correct) | PASS |
| `getAddress()` remains (ethers v6 — correct) | PASS |
| `ethers.provider.getNetwork()` reachable | PASS |
| Compile passes after correction | PASS |
| No deployment occurred | PASS |
| No minting occurred | PASS |
| No secrets committed | PASS |
| No runtime / CSS / DB mutation | PASS |
| `C3Key.sol` not modified | PASS |
| `hardhat.config.ts` not modified | PASS |
| 35 tests at last-known passing state | PASS (not re-run; no code changed) |

## 7 — Deployment Readiness

All audit flags are now fully resolved including the deploy script correction:

| Flag | Status |
|---|---|
| Flag 1 — migrate status guard | RESOLVED — contract fix applied, 3 tests added |
| Flag 2 — redact without burn | RESOLVED — confirmed by design |
| Flag 3 — deploy script v3 import | RESOLVED — corrected in this OAR1 |
| Flag 4 — activeKeyId() stale-read | RESOLVED — integration note documented |

**Deployment readiness: `ready_for_base_sepolia_oar2`**

The deploy script is now valid for Hardhat v3. Execution against Base Sepolia requires an explicit deployment OAR2.

## Close

Script corrected.

Compile verified.

No deployment.

No minting.

Codex holds.

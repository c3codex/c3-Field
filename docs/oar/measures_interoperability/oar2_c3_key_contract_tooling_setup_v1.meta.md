---
document_type: oar2
authority_level: working
document_scope: measures_interoperability
title: OAR2 — c3 Key Contract Tooling Setup v1
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
  - contract-tooling
  - hardhat
  - openzeppelin
  - compile
  - test
  - no-deployment
  - no-mint
source_alignment:
  - OAR1 — c3 Key NFT Contract Setup v1
  - OAR1 — c3 Key Visual Identity / Opus Render Prompt v1
  - OAR1 — c3 Key Metadata Schema + Image Binding v1
  - OAR Lifecycle — Execution and Handoff
---

# OAR2 — c3 Key Contract Tooling Setup v1

## OBSERVED

The c3 Key NFT Contract Setup OAR1 is completed.

It produced governed contract artifacts:

- `contracts/c3-key/C3Key.sol`
- `contracts/c3-key/deploy-c3-key.ts`
- `contracts/c3-key/test/C3Key.test.ts`

It also confirmed the repo currently has no contract tooling configured:

- No Hardhat
- No Foundry
- No `@openzeppelin/contracts`
- No prior contracts folder before c3 Key artifact placement

The c3 Key visual and metadata binding surfaces are now completed and committed.

The current gap is contract tooling.

## ALIGNED

This OAR2 authorizes setup of contract development tooling only.

It does not authorize deployment.

It does not authorize minting.

It does not authorize role grants on a live network.

It does not authorize payment activation.

It does not authorize runtime / CSS changes.

## CORE RULE

Tooling prepares.

Compilation proves.

Tests validate.

Deployment waits.

Minting waits.

Codex holds.

## ROUTED

This OAR2 authorizes Cody / contract executor to add a bounded Solidity development toolchain.

Preferred route:

Hardhat + TypeScript + OpenZeppelin.

Allowed setup:

- Hardhat
- TypeScript support
- ethers integration
- `@openzeppelin/contracts`
- test runner
- compile script
- test script
- deployment script wiring for future use only

Alternative route:

Foundry.

Only if repo conditions make Hardhat unsuitable.

Executor must report which route was selected and why.

## REQUIRED PACKAGE ADDITIONS

If using Hardhat, install development dependencies equivalent to:

- `hardhat`
- `@nomicfoundation/hardhat-toolbox`
- `typescript`
- `ts-node`
- `@types/node`

Install contract dependency:

- `@openzeppelin/contracts`

No private keys.

No deployment secrets.

No RPC secrets committed.

## REQUIRED CONFIG FILES

Expected files:

- `hardhat.config.ts`
- `contracts/c3-key/C3Key.sol`
- `contracts/c3-key/deploy-c3-key.ts`
- `contracts/c3-key/test/C3Key.test.ts`

If Hardhat requires test relocation, executor may create:

- `test/c3-key/C3Key.test.ts`
- `scripts/deploy-c3-key.ts`

but must preserve or document original governed artifact paths.

## PACKAGE SCRIPT REQUIREMENTS

Add scripts equivalent to:

- `contracts:compile`: `hardhat compile`
- `contracts:test`: `hardhat test`
- `contracts:clean`: `hardhat clean`

Optional future deployment script may be added but must not be run:

- `contracts:deploy:base-sepolia`: `hardhat run scripts/deploy-c3-key.ts --network baseSepolia`

If included, it must be documented as not executed.

## CONFIG BOUNDARY

Hardhat config may define network placeholders for future Base Sepolia / Base deployment, but must not require secrets to compile locally.

Allowed:

- `localhost`
- `hardhat`
- `baseSepolia` placeholder using environment variables
- `base` placeholder using environment variables

Not allowed:

- inline private key
- inline RPC secret
- committed deployer wallet
- committed API key
- frontend-exposed secrets

## CONTRACT VALIDATION REQUIREMENTS

Executor must run:

- `npm install`
- `npm run contracts:compile`
- `npm run contracts:test`

or equivalent.

Validation must confirm:

- `C3Key` compiles
- non-transferability test passes
- one-active-key-per-wallet test passes
- role-bound issue behavior test passes
- held / revoked / redacted / migrated status behavior covered or stubbed
- no deployment occurred
- no live mint occurred

## CONTRACT BEHAVIOR TO PRESERVE

The tooling setup must not alter the c3 Key contract semantics unless compilation requires a narrow syntax correction.

Required preserved behavior:

- ERC-721
- non-transferable
- one active key per wallet
- no PII onchain
- key types:
  - `named_individual`
  - `institution_in_service`
  - `temporary_migration`
- key status:
  - `active`
  - `held`
  - `revoked`
  - `redacted`
  - `migrated`
- roles:
  - `DEFAULT_ADMIN_ROLE`
  - `MINTER_ROLE`
  - `REGISTRAR_ROLE`
  - `PAUSER_ROLE`
- events:
  - `C3KeyIssued`
  - `C3KeyHeld`
  - `C3KeyRevoked`
  - `C3KeyRedacted`
  - `C3KeyMigrated`
  - `MetadataUpdated`

Any contract correction must be reported in OAR1.

## METADATA RELATION

The contract tooling may reference the existing metadata preparation state only as documentation.

It may not bind `tokenURI` to live deployment.

It may not upload metadata.

It may not mint.

It may not call deployed contract.

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

- inspect repo tooling
- install bounded contract dependencies
- add Hardhat or Foundry config
- adjust test placement if required
- run local compile
- run local tests
- write OAR1 with validation output

Executor may not:

- deploy contract
- mint key
- store secrets
- commit private keys
- activate payment
- alter contract authority boundary
- make key transferable
- make NFT metadata authority

## VALIDATION REQUIREMENTS

OAR1 must include:

1. selected tooling route
2. package additions
3. files added / modified
4. compile command output summary
5. test command output summary
6. confirmation no deployment occurred
7. confirmation no minting occurred
8. confirmation no secrets committed
9. confirmation c3 Key remains non-transferable
10. confirmation one-active-key-per-wallet remains enforced
11. confirmation no runtime / CSS / DB mutation occurred
12. carried-forward deployment route

## EXPECTED OAR1

`docs/oar/measures_interoperability/oar1_c3_key_contract_tooling_setup_v1.meta.md`

## SUCCESS CONDITION

This OAR2 succeeds when contract tooling is installed and validated locally, c3 Key contract compiles, tests pass or bounded stubs are documented, and no deployment, minting, payment, runtime, CSS, or DB mutation occurs.

## CLOSE

Tooling prepares.

Compile proves.

Tests validate.

Deployment waits.

Minting waits.

Codex holds.

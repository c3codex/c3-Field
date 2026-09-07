---
document_type: oar2
authority_level: working
document_scope: measures_interoperability
title: OAR2 — c3 Key Base Sepolia Deployment v1
status: proposed
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
  - base-sepolia
  - testnet-deployment
  - no-mint
  - no-role-grant
  - no-payment
  - no-db
source_alignment:
  - OAR1 — c3 Key Base Sepolia Deployment Prep — Script Correction v1
  - OAR1 — c3 Key Contract Audit Readiness v1
  - OAR1 — c3 Key Contract Test Implementation v1
  - OAR1 — c3 Key Contract Tooling Setup v1
  - OAR Lifecycle — Execution and Handoff
---

# OAR2 — c3 Key Base Sepolia Deployment v1

## OBSERVED

The c3 Key contract sequence has completed:

- c3 Key NFT Contract Setup
- c3 Key Visual Identity
- c3 Key Metadata Schema + Image Binding
- c3 Key Contract Tooling Setup
- c3 Key Contract Test Implementation
- c3 Key Contract Audit Readiness
- c3 Key Base Sepolia Deployment Prep + Script Correction

Current readiness:

`ready_for_base_sepolia_deployment_oar2`

The deployment script is corrected for Hardhat v3.

Compile passes.

Behavioral tests previously passed.

Audit flags are resolved.

No deployment has occurred yet.

No minting has occurred yet.

## ALIGNED

This OAR2 authorizes Base Sepolia testnet deployment only.

This OAR2 does not authorize:

- Base mainnet deployment
- live production minting
- payment activation
- invoice activation
- DB mutation
- runtime / CSS change
- recognition
- conversion
- seal activation
- delivery standing

## CORE RULE

Deploy testnet contract.

Record address.

Do not mint.

Do not grant production standing.

Do not activate payment.

Codex holds.

## ROUTED

Executor may:

1. verify env requirements
2. run compile
3. run tests
4. deploy C3Key to Base Sepolia
5. capture deployed contract address
6. capture transaction hash
7. capture network / chain id
8. capture deployer wallet
9. capture admin wallet
10. write OAR1 closeout

Executor may not:

- deploy to Base mainnet
- mint live c3 Keys
- grant live roles unless deployment script does so only for constructor admin
- activate payment
- mutate DB
- modify runtime / CSS
- store secrets
- commit private keys

## REQUIRED PRE-DEPLOYMENT CHECKS

Before deployment, executor must confirm:

- `ADMIN_ADDRESS` present
- Base Sepolia RPC configured through env / config variable
- deployer private key configured through env / config variable
- no secrets printed in logs
- no secrets committed
- network = `baseSepolia`
- chain type = OP-compatible
- contract compiles
- tests pass or last-known passing state is confirmed with no contract changes since test

## REQUIRED COMMANDS

Recommended sequence:

- `npm run contracts:compile`
- `npm run contracts:test`
- `npm run contracts:deploy:base-sepolia`

If deploy script requires direct command:

- `npx hardhat run contracts/c3-key/deploy-c3-key.ts --network baseSepolia`

Executor must use the command actually configured in `package.json`.

## DEPLOYMENT OUTPUT REQUIRED

OAR1 must record:

- contract name
- contract address
- network
- chain id
- deployment transaction hash
- deployer wallet address
- admin wallet address
- timestamp
- compile result
- test result
- deployment command used
- confirmation no minting occurred
- confirmation no payment activation occurred
- confirmation no DB mutation occurred
- confirmation no runtime / CSS mutation occurred
- confirmation no secrets committed

## ROLE BOUNDARY

Constructor may set:

- `DEFAULT_ADMIN_ROLE` → `ADMIN_ADDRESS`

This OAR2 does not authorize post-deploy role grants for:

- `MINTER_ROLE`
- `REGISTRAR_ROLE`
- `PAUSER_ROLE`

Those require a separate role-grant OAR2 unless the existing constructor already assigns them, which prior review says it does not.

## METADATA BOUNDARY

This OAR2 does not authorize token minting or tokenURI binding through mint.

The metadata image and metadata JSON are prepared, but no tokenURI is assigned until a governed mint OAR2.

## CONTRACT VERIFICATION BOUNDARY

Explorer verification may be prepared but is not required.

If executor attempts contract verification, it must not expose secrets and must document verification result.

Preferred route:

- deployment first
- verification later through separate OAR2 if needed

## NOT AUTHORIZED

This OAR2 does not authorize:

- Base mainnet deployment
- minting
- role grants after deployment
- payment activation
- invoice generation
- commerce trace mutation
- runtime change
- CSS change
- DB mutation
- recognition
- verification claim
- conversion claim
- seal activation
- delivery contract standing

## CODY / EXECUTOR ROLE

Executor may:

- run compile
- run tests
- deploy to Base Sepolia
- record deployment evidence
- write OAR1

Executor may not:

- deploy to Base mainnet
- mint
- grant live roles post-deployment
- store secrets
- commit private keys
- activate payment
- mutate DB
- modify runtime / CSS
- claim production standing

## VALIDATION REQUIREMENTS

OAR1 must include:

1. files changed, if any
2. compile output summary
3. test output summary
4. deployment command used
5. network and chain id
6. deployed contract address
7. deployment transaction hash
8. deployer wallet
9. admin wallet
10. confirmation constructor admin standing
11. confirmation no minting occurred
12. confirmation no post-deploy role grant occurred
13. confirmation no secrets committed
14. confirmation no payment / runtime / CSS / DB mutation occurred
15. next route recommendation

## EXPECTED OAR1

`docs/oar/measures_interoperability/oar1_c3_key_base_sepolia_deployment_v1.meta.md`

## SUCCESS CONDITION

This OAR2 succeeds when `C3Key` is deployed to Base Sepolia, deployment evidence is recorded, and no minting, post-deploy role grant, payment activation, runtime / CSS change, or DB mutation occurs.

## CLOSE

Base Sepolia receives test contract.

Address records.

Minting waits.

Role grants wait.

Payment waits.

Codex holds.

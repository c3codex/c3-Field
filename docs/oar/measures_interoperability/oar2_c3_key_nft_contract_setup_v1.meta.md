---
document_type: oar2
authority_level: working
document_scope: measures_interoperability
title: OAR2 — c3 Key NFT Contract Setup v1
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
  - nft-contract
  - wallet-bound
  - one-per-wallet
  - non-transferable
  - no-deployment
  - no-mint
  - no-recognition
  - no-conversion
source_alignment:
  - Seed Concordance
  - System Concordance
  - OAR1 — Measures Registry Payment / phase_payment Contract v1
  - OAR1 — Measures Registry phase_payment Runtime Surface Contract v1
  - OAR1 — Measures Registry Commerce Trace Schema + Logging Contract v1
  - OAR Lifecycle — Execution and Handoff
---

# OAR2 — c3 Key NFT Contract Setup v1

## OBSERVED

Measures Registry payment and phase_payment contracts are seated.

The payment path requires identity-bound commerce:

- c3 Key
- wallet relation
- institution relation
- commerce_trace_key
- provider evidence

Wallet-bound payment must not proceed as an unbound checkout.

The c3 Key is the access-bearing identity key assigned to a valid origin.

It establishes participation standing and gated access.

It does not determine coherence.

It does not confer recognition.

It does not confer conversion.

It does not create payment standing by itself.

## ALIGNED

This OAR2 defines the c3 Key NFT contract setup.

The c3 Key NFT is:

- access-bearing
- wallet-bound
- one per wallet
- origin-linked
- traceable
- non-authoritative

The c3 Key NFT is not:

- recognition
- verification
- certification
- conversion status
- payment status
- delivery contract standing
- proof of coherence

## CORE RULE

c3 Key identifies access-bearing origin relation.

Codex holds authority.

Measures registers standing.

Wallet holds key.

NFT contract does not define truth.

## CONTRACT PURPOSE

The c3 Key NFT contract supports:

1. wallet-bound c3 Key assignment
2. one key per wallet
3. gated access relation
4. Measures Registry payment eligibility
5. c3 MAP commerce circuit entry
6. future DAO participation where separately authorized
7. traceable origin relation without exposing private data

## RECOMMENDED CHAIN

Base.

Reason:

- aligns with prior c3 Current / c3 DAO direction
- low-cost transactions
- EVM-compatible
- supports wallet-gated commerce
- supports future DAO tooling

## TOKEN STANDARD

Recommended standard:

ERC-721.

Required behavior:

- non-transferable / soulbound behavior
- one active token per wallet
- revocation / held / redacted / migrated states
- no open marketplace transfer

ERC-721 is preferred over ERC-1155 because the c3 Key represents an identity/access-bearing key, not a quantity of membership units.

## CONTRACT NAME

Display name:

c3 Key

Technical contract name:

C3Key

Symbol:

C3KEY

## TRANSFER RULE

The c3 Key must be non-transferable after mint.

Allowed exceptions:

- admin burn / revoke through governed route
- admin reissue through governed correction route
- wallet migration through OAR-governed recovery

No open marketplace transfer is allowed.

Reason:

A c3 Key binds origin relation.

If freely transferable, origin standing can drift.

## ONE-PER-WALLET RULE

Contract must enforce one active c3 Key per wallet.

Required check:

wallet_has_active_key == false before mint.

A wallet may not hold more than one active c3 Key.

## KEY TYPES

The contract should support at minimum:

- named_individual
- institution_in_service
- temporary_migration

Public token metadata must not expose sensitive identity.

## ONCHAIN / OFFCHAIN BOUNDARY

Onchain may store:

- token_id
- wallet_address
- key_type
- key_status
- issued_at
- metadata_uri
- source_trace_hash

Onchain must not store:

- legal name
- email
- phone
- address
- private institutional details
- assessment answers
- payment details
- health or sensitive information
- private documents

Codex / Field / Measures hold governed standing.

NFT contract holds access relation only.

## KEY STATUS

Recommended key status values:

- active
- held
- revoked
- redacted
- migrated

## REQUIRED EVENTS

Contract should emit:

- C3KeyIssued(tokenId, wallet, keyType, sourceTraceHash)
- C3KeyHeld(tokenId, reasonHash)
- C3KeyRevoked(tokenId, reasonHash)
- C3KeyRedacted(tokenId, reasonHash)
- C3KeyMigrated(oldTokenId, newTokenId, oldWallet, newWallet, sourceTraceHash)
- MetadataUpdated(tokenId, metadataURI)

## ACCESS ROLES

Recommended contract roles:

- DEFAULT_ADMIN_ROLE
- MINTER_ROLE
- REGISTRAR_ROLE
- PAUSER_ROLE

Role meanings:

DEFAULT_ADMIN_ROLE:
Contract administration only.

MINTER_ROLE:
Can issue c3 Keys after governed eligibility.

REGISTRAR_ROLE:
Can update key status / metadata after governed trace.

PAUSER_ROLE:
Can pause mint/update behavior during security issue.

No role may create recognition or conversion.

## MINT ELIGIBILITY

Mint may occur only when:

- valid origin relation exists
- wallet address confirmed
- c3 Key not already active for wallet
- receipt / acknowledgment of required source set recorded where applicable
- operator or system route authorized
- source_oar2 recorded

For Measures Registry payment:

c3 Key must exist before wallet-bound c3 MAP payment standing is recognized.

## TEMPORARY EMAIL-BOUND KEY MIGRATION

Temporary email-bound c3 Key may exist offchain.

It becomes wallet-bound only when:

- wallet address confirmed
- origin relation matched
- temporary key reconciled
- c3 Key NFT minted
- temporary state marked migrated

No duplicate active key should remain.

## PAYMENT RELATION

Payment provider / invoice implementation must read:

- wallet_address
- c3_key_token_id or c3_key_contract relation
- commerce_trace_key
- institution relation

Payment standing is invalid if not trace-bound to c3 Key / wallet relation.

## NOT AUTHORIZED

This OAR2 does not authorize:

- contract deployment
- mainnet minting
- live key minting
- payment processor activation
- invoice generation
- runtime implementation
- CSS implementation
- recognition
- verification
- seal activation
- delivery contract activation
- conversion claim

## CODY / CONTRACT EXECUTOR ROLE

Executor may:

- inspect repo contract tooling
- prepare smart contract source
- prepare deployment script
- prepare environment variable checklist
- prepare test plan
- prepare ABI export path
- prepare local or testnet validation route

Executor may not:

- deploy to mainnet without explicit OAR2
- mint live keys without explicit OAR2
- store private keys in repo
- store secrets in frontend
- make c3 Key transferable
- make NFT contract authority over Codex
- bypass c3 Key / wallet relation
- activate payment
- claim recognition or conversion

## REQUIRED FILES

Recommended implementation paths:

- contracts/c3-key/C3Key.sol
- contracts/c3-key/deploy-c3-key.ts
- contracts/c3-key/test/C3Key.test.ts
- docs/oar/measures_interoperability/oar1_c3_key_nft_contract_setup_v1.meta.md

If repo uses a different contract folder convention, executor must report observed structure before writing.

## VALIDATION REQUIREMENTS

Executor must confirm:

1. repo contract tooling inspected before file placement
2. one active c3 Key per wallet enforced
3. transfer disabled
4. no PII stored onchain
5. c3 Key does not confer recognition
6. c3 Key does not confer conversion
7. c3 Key does not confer payment standing by itself
8. c3 Key supports wallet-bound payment relation
9. c3 Key supports held / revoked / redacted / migrated states
10. roles are bounded
11. deployment not executed unless separately authorized
12. no live minting performed
13. no secrets committed
14. tests created or required test plan provided
15. OAR1 written after validation

## EXPECTED OAR1

`docs/oar/measures_interoperability/oar1_c3_key_nft_contract_setup_v1.meta.md`

## SUCCESS CONDITION

This OAR2 succeeds when the c3 Key NFT contract setup is defined as a wallet-bound, one-per-wallet, non-transferable access key that supports Measures Registry payment identity without becoming authority, recognition, conversion, payment standing, seal standing, or delivery contract standing.

## CLOSE

c3 Key binds access.

Wallet holds relation.

Commerce trace records.

Payment opens only after trace.

Recognition waits.

Conversion waits.

Codex holds.

---
document_type: oar2
authority_level: working
document_scope: measures_interoperability
title: OAR2 — c3 Key Metadata Schema + Image Binding v1
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
  - nft-metadata
  - image-binding
  - supabase-storage
  - png-primary
  - no-deployment
  - no-mint
  - no-recognition
  - no-conversion
source_alignment:
  - OAR1 — c3 Key NFT Contract Setup v1
  - OAR2 — c3 Key Visual Identity / Opus Render Prompt v1
  - Seed Concordance
  - System Concordance
  - OAR Lifecycle — Execution and Handoff
---

# OAR2 — c3 Key Metadata Schema + Image Binding v1

## OBSERVED

The c3 Key NFT Contract Setup is completed.

The c3 Key v2 visual direction has been approved by operator as:

c3 Key v2 — Governed Access Mark

The approved image has been uploaded to Supabase storage.

The image is approved for metadata preparation.

The image is not yet final NFT metadata.

No contract deployment has occurred.

No minting has occurred.

No payment activation has occurred.

No runtime, CSS, or DB mutation is authorized by this OAR2 unless separately routed.

## ALIGNED

This OAR2 defines the c3 Key NFT metadata schema and binds the approved c3 Key v2 image as the primary metadata image candidate.

The metadata must support:

- wallet-bound access
- one active key per wallet
- origin relation
- held / revoked / redacted / migrated standing
- Measures Registry payment eligibility
- future DAO gating where separately authorized

The metadata must not expose private identity or imply recognition, conversion, certification, payment standing, seal standing, or delivery contract standing.

## CORE RULE

Image is identity presentation.

Metadata is access description.

Contract is wallet relation.

Codex / Measures hold standing.

NFT metadata does not define truth.

## ROUTED

This OAR2 defines:

1. approved image binding
2. Supabase storage route
3. metadata schema fields
4. prohibited metadata fields
5. metadata URI requirements
6. contract relation
7. validation requirements

## APPROVED IMAGE

Approved visual:

c3 Key v2 — Governed Access Mark

Image source:

Chazz render from c3 Key visual identity sequence.

Legacy relation:

Descendant of Legacy c3 Key Mark v1.

Image standing:

- approved for metadata preparation
- uploaded to Supabase storage
- not yet bound to deployed contract
- not yet minted

## IMAGE STORAGE ROUTE

Storage provider:

Supabase

Primary bucket:

measures-registry

Primary metadata image format:

PNG

Primary file name:

c3-key-v2-governed-access-mark.png

Expected storage path:

c3-key/c3-key-v2-governed-access-mark.png

If the actual uploaded path differs, executor must report the observed Supabase bucket and storage path before final metadata binding.

## PNG / WEBP RULE

PNG is the primary NFT metadata image format.

WEBP may exist only as a runtime/display derivative.

Rule:

PNG = authority-grade visual asset for NFT metadata.

WEBP = frontend/runtime optimization copy.

The NFT metadata image should bind to the PNG unless a later metadata compatibility OAR2 approves otherwise.

## OPTIONAL RUNTIME DERIVATIVE

A runtime derivative may later be created as:

c3-key/c3-key-v2-governed-access-mark.webp

The WEBP derivative may not replace the PNG metadata image without separate approval.

## IMAGE URI REQUIREMENTS

The image URI must be stable.

The image URI must not depend on local file path.

The image URI must resolve from Supabase public URL or governed signed-access route.

The image URI must preserve provenance relation to Legacy c3 Key Mark v1.

The image must not be mutable without metadata update event or governed replacement route.

## METADATA SCHEMA

Recommended ERC-721 metadata JSON:

{
  "name": "c3 Key",
  "description": "Wallet-bound governed access key for c3 Field participation and Measures Registry eligibility. The c3 Key establishes access-bearing origin relation only. It does not confer recognition, verification, certification, payment standing, seal standing, delivery contract standing, or conversion status.",
  "image": "SUPABASE_PUBLIC_IMAGE_URL_OR_GOVERNED_URI",
  "external_url": "https://c3field.online",
  "attributes": [
    {
      "trait_type": "Key Type",
      "value": "named_individual | institution_in_service | temporary_migration"
    },
    {
      "trait_type": "Key Status",
      "value": "active | held | revoked | redacted | migrated"
    },
    {
      "trait_type": "Transferability",
      "value": "non-transferable"
    },
    {
      "trait_type": "Wallet Rule",
      "value": "one active key per wallet"
    },
    {
      "trait_type": "Authority Boundary",
      "value": "Codex holds authority"
    },
    {
      "trait_type": "Registry Boundary",
      "value": "Measures registers standing"
    },
    {
      "trait_type": "Payment Boundary",
      "value": "does not create payment standing"
    },
    {
      "trait_type": "Conversion Boundary",
      "value": "does not confer conversion"
    }
  ]
}

## REQUIRED METADATA FIELDS

Required:

- name
- description
- image
- attributes

Recommended optional:

- external_url
- animation_url only if future governed motion asset is approved
- background_color only if metadata platform requires it

## PROHIBITED METADATA FIELDS

Metadata must not include:

- legal name
- email
- phone
- address
- assessment answers
- payment details
- private institutional details
- health or sensitive information
- private documents
- recognition status
- conversion status
- certification status
- seal activation claim
- delivery contract claim

## CONTRACT RELATION

The metadata URI may later be referenced by the c3 Key contract.

The metadata URI does not activate:

- minting
- deployment
- recognition
- conversion
- payment standing
- seal standing
- delivery contract standing

Contract deployment and minting require separate OAR2.

## STATUS RELATION

Metadata may describe key status values:

- active
- held
- revoked
- redacted
- migrated

Actual standing must resolve through governed contract state and Codex / Measures relation.

Metadata must not be treated as authority source.

## REQUIRED OUTPUTS

Executor must produce or confirm:

1. observed Supabase bucket
2. observed Supabase storage path
3. resolved image URL or governed URI
4. metadata JSON draft
5. metadata file path if written
6. OAR1 closeout

Recommended metadata draft path:

docs/oar/measures_interoperability/metadata/c3-key-metadata-v1.json

If metadata is not written yet, executor must return held state with observed image path and required next route.

## NOT AUTHORIZED

This OAR2 does not authorize:

- contract deployment
- contract revision
- minting
- payment activation
- runtime change
- CSS change
- recognition
- verification
- conversion claim
- seal activation
- delivery contract standing

DB mutation is not authorized unless separately routed.

## VALIDATION REQUIREMENTS

Executor must confirm:

1. approved image is bound only as metadata-prep asset
2. Supabase bucket and storage path are observed
3. primary image format is PNG
4. WEBP is derivative only if present
5. metadata JSON contains no PII
6. metadata does not imply recognition
7. metadata does not imply conversion
8. metadata does not imply payment standing
9. metadata does not imply seal activation
10. metadata does not imply delivery contract standing
11. image URI is stable or explicitly marked pending storage
12. metadata URI is stable or explicitly marked pending storage
13. no contract deployment occurred
14. no minting occurred
15. no payment activated
16. no runtime / CSS modified
17. no DB mutation unless separately routed
18. OAR1 written after validation

## EXPECTED OAR1

docs/oar/measures_interoperability/oar1_c3_key_metadata_schema_image_binding_v1.meta.md

## SUCCESS CONDITION

This OAR2 succeeds when the approved c3 Key v2 PNG image uploaded to Supabase is bound to a governed NFT metadata schema for preparation only, with no PII exposure, no authority collapse, no deployment, no minting, and no recognition, conversion, payment, seal, or delivery standing implied.

## CLOSE

Image approved.

PNG primary.

Supabase holds image.

Metadata defined.

Storage path must verify.

Contract waits.

Deployment waits.

Minting waits.

Codex holds.

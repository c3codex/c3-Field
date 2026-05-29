---
document_type: oar1
authority_level: working
document_scope: measures_interoperability
title: OAR1 — c3 Key Metadata Schema + Image Binding v1
status: completed
version: v1
operator: op044
date: 2026-05-29
source_oar2: docs/oar/measures_interoperability/oar2_c3_key_metadata_schema_image_binding_v1.meta.md
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
  - nft-metadata
  - image-binding
  - supabase-storage
  - image-upload-confirmed
source_alignment:
  - OAR2 — c3 Key Metadata Schema + Image Binding v1
  - OAR1 — c3 Key NFT Contract Setup v1
  - OAR2 — c3 Key Visual Identity / Opus Render Prompt v1
  - OAR Lifecycle — Execution and Handoff
---

# OAR1 — c3 Key Metadata Schema + Image Binding v1

## Status

**Completed.**

Metadata schema defined. Metadata JSON produced with confirmed image URI. Image confirmed at Supabase storage (HTTP 200). No contract deployed. No keys minted. No payment activated. No runtime, CSS, or DB change occurred.

## 1 — Pre-Seating Gate Confirmation

| Gate | Status |
|---|---|
| c3 Key NFT Contract Setup seated (OAR1 confirmed) | CONFIRMED |
| c3 Key Visual Identity / Opus Render Prompt seated (OAR2 confirmed) | CONFIRMED |
| c3 Key v2 image approved by operator | CONFIRMED |
| No contract deployed | CONFIRMED |
| No keys minted | CONFIRMED |
| No payment activated | CONFIRMED |
| No runtime file modified | CONFIRMED |
| No CSS file modified | CONFIRMED |
| No DB mutation | CONFIRMED |

## 2 — OAR2 Seated

`docs/oar/measures_interoperability/oar2_c3_key_metadata_schema_image_binding_v1.meta.md`

## 3 — Observed Supabase Storage State

**Bucket:** `measures-registry` — confirmed (used by all glyph media assets)

**OAR2 expected path:** `c3-key/c3-key-v2-governed-access-mark.png`

**Actual observed path:** `c3-key-v2-governed-access-mark.png` (root of `measures-registry` bucket — no `c3-key/` subfolder)

**Confirmed public URL (HTTP 200):**
`https://zfihrspxvennjzazxcbj.supabase.co/storage/v1/object/public/measures-registry/c3-key-v2-governed-access-mark.png`

Path difference from OAR2 expectation documented per OAR2 rule: "If the actual uploaded path differs, executor must report the observed Supabase bucket and storage path before final metadata binding."

## 4 — Metadata Draft Produced

`docs/oar/measures_interoperability/metadata/c3-key-metadata-v1.json`

**Image field:** confirmed — bound to `https://zfihrspxvennjzazxcbj.supabase.co/storage/v1/object/public/measures-registry/c3-key-v2-governed-access-mark.png`

**Schema confirmed:**
- `name`: c3 Key
- `description`: access-bearing relation only, no recognition/conversion/payment/seal/delivery claimed
- `image`: https://zfihrspxvennjzazxcbj.supabase.co/storage/v1/object/public/measures-registry/c3-key-v2-governed-access-mark.png
- `external_url`: https://c3field.online
- `attributes`: 8 fields — key type, key status, transferability, wallet rule, authority boundary, registry boundary, payment boundary, conversion boundary

**No PII in schema.** No recognition, conversion, payment, seal, or delivery contract standing implied.

## 5 — PNG / WEBP Rule (confirmed)

PNG is the authority-grade format for NFT metadata. WEBP is derivative/display only. `image` field in metadata JSON must bind to the PNG path. WEBP may not replace PNG without a separate metadata compatibility OAR2.

## 6 — Validation Proof

| Check | Expected | Result |
|---|---|---|
| Approved image bound as metadata-prep asset only | confirmed | PASS |
| Supabase bucket observed: `measures-registry` | confirmed | PASS |
| Expected storage path documented | confirmed | PASS |
| Storage path verified (image present, HTTP 200) | confirmed | PASS |
| Primary image format PNG | confirmed | PASS |
| WEBP is derivative only | confirmed | PASS |
| Metadata JSON contains no PII | confirmed | PASS |
| Metadata does not imply recognition | confirmed | PASS |
| Metadata does not imply conversion | confirmed | PASS |
| Metadata does not imply payment standing | confirmed | PASS |
| Metadata does not imply seal activation | confirmed | PASS |
| Metadata does not imply delivery contract standing | confirmed | PASS |
| Image URI stable (confirmed Supabase URL) | confirmed | PASS |
| Metadata URI stable (draft path confirmed) | confirmed | PASS |
| No contract deployment | absent | PASS |
| No minting | absent | PASS |
| No payment activated | absent | PASS |
| No runtime / CSS modified | absent | PASS |
| No DB mutation | absent | PASS |

## 7 — Execution Route Closed

1. Render session completed.
2. Operator approved c3 Key v2 render.
3. PNG uploaded to Supabase storage.
4. Executor verified public URL resolves HTTP 200.
5. `PENDING` placeholder replaced in metadata JSON.
6. OAR1 status updated to `completed`.

Actual confirmed path:

`measures-registry / c3-key-v2-governed-access-mark.png`

## 8 — Carried Forward

| Item | Route |
|---|---|
| v2 render execution and PNG upload | Operator render session → visual identity OAR1 close |
| Image URI finalization in metadata JSON | After upload confirmed |
| Metadata URI hosting (IPFS, Supabase, or governed CDN) | Future metadata hosting OAR2 |
| `tokenURI` binding on deployed contract | Future metadata OAR2 post-deployment |
| WEBP runtime derivative (optional) | Future media OAR2 |
| Contract deployment | Future deployment OAR2 |
| Minting | Future key mint OAR2 |

## Close

Schema seated.

Image confirmed at Supabase storage (HTTP 200).

Metadata JSON bound to confirmed URI.

Actual path: root of `measures-registry` bucket (no subfolder) — documented per OAR2 path-difference rule.

Contract waits for tooling.

Metadata URI hosting waits for future OAR2.

Codex holds.

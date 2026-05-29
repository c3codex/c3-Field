---
document_type: oar1
authority_level: working
document_scope: measures_interoperability
title: OAR1 — c3 Key Metadata Schema + Image Binding v1
status: pending_image_upload
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
  - pending-image-upload
source_alignment:
  - OAR2 — c3 Key Metadata Schema + Image Binding v1
  - OAR1 — c3 Key NFT Contract Setup v1
  - OAR2 — c3 Key Visual Identity / Opus Render Prompt v1
  - OAR Lifecycle — Execution and Handoff
---

# OAR1 — c3 Key Metadata Schema + Image Binding v1

## Status

**Pending image upload.**

Metadata schema defined. Metadata JSON draft produced. Image URI placeholder in place — image not yet confirmed at expected Supabase storage path. No contract deployed. No keys minted. No payment activated. No runtime, CSS, or DB change occurred.

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

**Expected path:** `c3-key/c3-key-v2-governed-access-mark.png`

**Observed result:** `c3-key/` prefix returns empty. Image not present at expected path.

**Likely cause:** Render OAR1 (`oar1_c3_key_visual_identity_opus_render_prompt_v1.meta.md`) is in `pending_render` status — the actual v2 render has not yet been executed and the image has not yet been uploaded to storage.

**Expected public URL once uploaded:**
`https://zfihrspxvennjzazxcbj.supabase.co/storage/v1/object/public/measures-registry/c3-key/c3-key-v2-governed-access-mark.png`

When operator uploads the approved render to Supabase storage, executor must verify the URL resolves (HTTP 200) before finalizing the metadata image field.

## 4 — Metadata Draft Produced

`docs/oar/measures_interoperability/metadata/c3-key-metadata-v1.json`

**Image field:** marked `PENDING` — must be replaced with confirmed Supabase public URL before this file is used as contract metadata URI.

**Schema confirmed:**
- `name`: c3 Key
- `description`: access-bearing relation only, no recognition/conversion/payment/seal/delivery claimed
- `image`: pending upload
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
| Storage path verified (image present) | pending upload | PENDING |
| Primary image format PNG | confirmed | PASS |
| WEBP is derivative only | confirmed | PASS |
| Metadata JSON contains no PII | confirmed | PASS |
| Metadata does not imply recognition | confirmed | PASS |
| Metadata does not imply conversion | confirmed | PASS |
| Metadata does not imply payment standing | confirmed | PASS |
| Metadata does not imply seal activation | confirmed | PASS |
| Metadata does not imply delivery contract standing | confirmed | PASS |
| Image URI stable or marked pending | marked pending | PASS |
| Metadata URI stable or marked pending | marked pending | PASS |
| No contract deployment | absent | PASS |
| No minting | absent | PASS |
| No payment activated | absent | PASS |
| No runtime / CSS modified | absent | PASS |
| No DB mutation | absent | PASS |

## 7 — Execution Route to Close

1. Operator completes render session (routes OAR2 prompt to image generation tool).
2. Operator approves render candidate.
3. Operator uploads PNG to Supabase storage: `measures-registry / c3-key / c3-key-v2-governed-access-mark.png`.
4. Executor verifies URL resolves (HTTP 200).
5. Executor replaces `PENDING` placeholder in `c3-key-metadata-v1.json` with confirmed URL.
6. OAR1 status updated to `completed`.

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

Draft ready.

Image waits for its render.

Render waits for its session.

URI finalizes after upload.

Contract waits.

Codex holds.

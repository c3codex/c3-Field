---
document_type: oar1
title: OAR1 TREE Seed Doc Bucket Transfer
version: v1
status: executed
system: c3_field
operator: op044
source_oar2: docs/oar/c3_field/oar2_tree_seed_doc_bucket_transfer_v1.meta.md
---

OAR1: oar1_tree_seed_doc_bucket_transfer_v1

## Objective
Transfer the routed TREE seed docs to the private `measures-seed` bucket and verify object existence at the expected bucket paths.

## Actions
- Verified all three routed local files exist.
- Uploaded all three files to the `measures-seed` bucket.
- Downloaded all three uploaded objects for hash verification.
- Verified the bucket is private.
- Verified no malformed duplicate paths were created during this transfer.

## Bucket
- bucket: `measures-seed`
- bucket_private: true

## Transfers
| Local file | Bucket path | Bytes | SHA-256 |
| --- | --- | ---: | --- |
| `docs/c3_field/tree_operational_definition_review_surface_v1.md` | `c3_field/tree_operational_definition_review_surface_v1.md` | 2324 | `313783821c83aa208e4e02cf8933ae69071b4168657f8523521a8f9b9055b5be` |
| `docs/c3_field/seed_extensions/tree_concordance_extension_proposal_v1.meta.md` | `c3_field/seed_extensions/tree_concordance_extension_proposal_v1.meta.md` | 3230 | `0366d91d0ae681b55d2d6ad8e7b54db3c2ce01bcd2a3de107154615a65d7c817` |
| `docs/c3_field/schema/tree_relational_schema_direction_v1.meta.md` | `c3_field/schema/tree_relational_schema_direction_v1.meta.md` | 2408 | `491271f034521be84fb9ccd82922c1a9018051cd10c5de25c296722de4d3cb52` |

## Verification
```json
{
  "bucket": "measures-seed",
  "bucket_private": true,
  "uploaded_count": 3,
  "verified_count": 3,
  "missing": [],
  "malformed_duplicate_candidates": [],
  "hash_match": true
}
```

## Constraints Held
- No DB mutation.
- No schema migration.
- No concordance overwrite.
- No frontend implementation.
- No runtime logic created.
- No source docs revised.

## Files
- docs/oar/c3_field/oar2_tree_seed_doc_bucket_transfer_v1.meta.md
- docs/oar/c3_field/oar1_tree_seed_doc_bucket_transfer_v1.meta.md

## Close
Transfer complete.
Bucket objects verified.

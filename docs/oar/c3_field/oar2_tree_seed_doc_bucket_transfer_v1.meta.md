# OAR2 — TREE Seed Doc Bucket Transfer

## OBSERVED

TREE seed docs are validated, written, and committed.

Bucket transfer to private `measures-seed` was attempted from thread but not reliably confirmed.

Manual transfer produced uncertain state, so thread-side transfer is halted.

## ALIGNED

Cody should execute this as a bounded file transfer task from OAR2 only.

No DB mutation.
No schema migration.
No concordance overwrite.
No frontend implementation.

## ROUTED

Cody shall transfer these files to private `measures-seed` bucket:

    docs/c3_field/tree_operational_definition_review_surface_v1.md

    docs/c3_field/seed_extensions/tree_concordance_extension_proposal_v1.meta.md

    docs/c3_field/schema/tree_relational_schema_direction_v1.meta.md

Expected bucket paths:

    c3_field/tree_operational_definition_review_surface_v1.md

    c3_field/seed_extensions/tree_concordance_extension_proposal_v1.meta.md

    c3_field/schema/tree_relational_schema_direction_v1.meta.md

Cody must verify:
- all three files exist locally
- all three upload successfully
- all three bucket objects exist after upload
- bucket is measures-seed
- no malformed duplicate paths are created

## CODY ROLE

Cody may:
- transfer committed docs to bucket
- verify bucket object existence
- write OAR1 closeout

Cody may not:
- mutate DB
- revise docs
- change schema
- overwrite Seed Concordance
- create runtime logic
- create frontend behavior

## VALIDATION

Success requires verified bucket object existence for all three expected paths.

## EXPECTED OAR1

    docs/oar/c3_field/oar1_tree_seed_doc_bucket_transfer_v1.meta.md

## CLOSE

Transfer only.
Verify before close.

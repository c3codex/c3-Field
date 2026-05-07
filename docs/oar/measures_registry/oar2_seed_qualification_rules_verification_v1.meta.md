---
document_type: oar2
authority_level: working
document_scope: seed_qualification_verification
title: OAR2 - Seed Qualification Rules Verification
status: ready_for_transfer
version: v1
operator: op044
native_stack:
  codex: authority
  field: relation
  measures: registry
  oar2: observed_aligned_routed
  chazz: systems_validation
  notchazz: seeded_reference_control
tags:
  - oar2
  - seed-qualification
  - seeded-standing
  - measures-seed
  - governance
  - verification
---

# OAR2 - Seed Qualification Rules Verification

## Objective

Verify seed_qualification_rules.meta.md against the Seed Qualification Rules before recognizing it as seeded authority standing.

Bucket transfer alone does not create seeded standing.

## Observed

The file was created, confirmed, committed, and transferred to the private measures-seed bucket.

Target local source:

docs/process/governance/seed_qualification_rules.meta.md

Target bucket object:

measures-seed/process/governance/seed_qualification_rules.meta.md

The operator correctly identified that bucket presence is not sufficient for seeded standing.

## Aligned

This verification aligns with the active governance rule:

Seeded is not storage.

Seeded is operational authority standing.

A surface must be qualified, verified, and recognized before it may govern downstream references.

## Routed

Run verification against local source and private bucket object.

Required checks:

- local file exists
- repository source is committed
- bucket exists
- bucket is private
- object path is exact
- object exists
- stored bytes match source bytes
- stored SHA-256 matches source SHA-256
- content unchanged
- operational relation declared as governing_seeded
- OAR1 written beside this OAR2

## NotChazz Role

NotChazz must flag:

- UNQUALIFIED_SEEDED_CLAIM if seeded status is claimed before verification
- HASH_MISMATCH_SEEDED_REFERENCE if source and stored hashes differ
- UNSEEDED_GOVERNING_REFERENCE if downstream work references this rule before OAR1 closeout

## Cody Role

Cody may:

- execute verification
- generate validation output
- write OAR1 beside this OAR2

Cody may not:

- alter governance content
- infer seeded standing without verification
- treat bucket transfer alone as seeded
- proceed to downstream enforcement implementation

## Validation

Valid result:

- source exists
- source is committed
- bucket is private
- object exists at exact path
- source and stored bytes match
- source and stored SHA-256 match
- contentUnchanged = true
- seeded standing recorded as governing_seeded
- OAR1 generated

Invalid result:

- missing source
- uncommitted source
- public bucket exposure
- wrong bucket path
- missing object
- byte mismatch
- hash mismatch
- no OAR1
- seeded standing claimed without verification

## Closeout

This OAR2 closes only the seed qualification verification seam for:

docs/process/governance/seed_qualification_rules.meta.md

It does not seed additional process documents.

It does not implement runtime enforcement.

It does not modify frontend behavior.

Codex holds.
Field structures.
Measures registers.
OAR2 routes.
Chazz validates.
NotChazz preserves seeded authority distinction.

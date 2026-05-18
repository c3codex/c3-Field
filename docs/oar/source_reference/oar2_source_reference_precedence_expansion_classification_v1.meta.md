---
document_type: oar2
authority_level: working
document_scope: source_reference_precedence_classification
title: OAR2 — Source Reference Precedence Expansion and Classification v1
status: proposed
version: v1
operator: op044
system: source_reference
---

# OAR2 — Source Reference Precedence Expansion and Classification v1

## OBSERVED

Expansion Seed Set v2 completed successfully.

Current standing:

- 12 seeded source references
- 7 v2 sources seeded
- 8 v2 terms seeded
- 7 v2 relations created
- contradiction candidate count remains 0

Traversal surfaced a classification gap:

- role_contract
- verification_checklist

They are seeded and valid, but currently resolve as unranked seeded sources with precedence rank 90.

## ALIGNED

This OAR2 authorizes precedence classification review only.

No source mutation.
No access policy.
No frontend exposure.
No runtime exposure.
No binding activation.

## ROUTED

Review and assign precedence ranks for:

- role_contract
- verification_checklist
- implementation_manifest
- process_constraints
- process_rule
- oar

Recommended expanded ranking:

1. concordance / system authority source
2. foundational_source
3. process_constraints
4. seeded lifecycle / source-control rules
5. oar completed execution records
6. oar working routing records
7. process_rule
8. implementation_manifest
9. role_contract
10. verification_checklist
90. unranked seeded source
99. schema draft / migration candidate

Special handling:

- role_contract should not outrank the source or manifest it serves.
- verification_checklist should verify but not override the source being verified.
- implementation_manifest should guide execution but not override seeded source authority.
- process_constraints may outrank ordinary process_rule when it governs the process family.

If SQL is needed, draft:

docs/schema/source_reference/source_reference_precedence_classification_v1.sql

Do not execute SQL unless separately authorized.

## EXPECTED OUTPUT

docs/oar/source_reference/oar1_source_reference_precedence_classification_v1.meta.md

## VALIDATION

This OAR2 resolves when:

1. affected source classes are reviewed
2. precedence ranks are confirmed or revised
3. SQL need is confirmed or deferred
4. contradiction count remains zero or is routed
5. no access exposure occurs
6. no seeded record mutation occurs

## CLOSE

Classification must resolve before broader runtime-read movement.

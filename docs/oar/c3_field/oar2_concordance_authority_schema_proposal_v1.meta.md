# OAR2 — Concordance Authority Schema Proposal

## OBSERVED

Concordance Authority Model v1 is now defined.

It established:

    bucket snapshot != authority
    markdown file != authority
    Codex seating = authority

The current system still lacks DB schema bodies for:

    concordance_document
    concordance_version
    concordance_term
    concordance_relation
    seeded_source_snapshot

## ALIGNED

This OAR2 proposes schema only.

No DB mutation.
No migration execution.
No runtime implementation.
No frontend implementation.
No concordance content revision.

Native order remains:

    Codex → Field → Measures → Chazz

## ROUTED

Cody shall produce a minimal Concordance Authority Schema Proposal defining:

1. proposed tables
2. required columns
3. primary keys / uniqueness constraints
4. append-only or mutation standing
5. relationship between tables
6. RLS / access posture recommendation
7. Seed Concordance v1 initial seating path
8. migration risks
9. validation queries required before future execution

Minimum proposed bodies:

    concordance_document
    concordance_version
    concordance_term
    concordance_relation
    seeded_source_snapshot

The proposal must preserve:

    Codex seating = authority
    Field structures semantic relation
    Measures exposes valid reveal/retrieval
    Bucket stores evidence/recovery snapshots

## CODY ROLE

Cody may:
- inspect schema
- propose table structures
- propose constraints
- propose validation queries
- write OAR1 closeout

Cody may not:
- create tables
- alter schema
- insert rows
- update rows
- mutate bucket
- modify concordance content
- implement frontend/runtime

## VALIDATION

Success requires:
- minimal schema proposal completed
- authority/snapshot distinction preserved
- Seed Concordance v1 seating path proposed
- no DB mutation performed
- OAR1 written

## EXPECTED OAR1

    docs/oar/c3_field/oar1_concordance_authority_schema_proposal_v1.meta.md

## CLOSE

Define before migration.
Manifest before database.
Codex holds authority.

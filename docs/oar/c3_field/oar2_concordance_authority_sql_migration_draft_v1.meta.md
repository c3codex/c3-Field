# OAR2 — Concordance Authority SQL Migration Draft

## OBSERVED

Concordance Authority Model, Schema Proposal, and Migration Plan are defined.

The system is now ready to draft implementation SQL for review.

No DB mutation has occurred yet.

## ALIGNED

This OAR2 authorizes SQL draft creation only.

No migration execution.
No DB mutation.
No manifest seating.
No runtime/frontend implementation.

## ROUTED

Cody shall draft SQL migration files for:

    concordance_document
    concordance_version
    concordance_term
    concordance_relation
    seeded_source_snapshot

SQL draft must include:

    tables
    primary keys
    foreign keys
    check constraints
    unique constraints
    indexes
    RLS enablement
    read policies
    append-protection triggers
    validation queries

Cody must preserve:

    Codex seating = authority
    bucket snapshot != authority
    markdown file != authority

## CODY ROLE

Cody may:
- create SQL draft files
- create validation query draft
- write OAR1 closeout

Cody may not:
- execute migration
- mutate DB
- insert Seed Concordance rows
- modify concordance content
- implement frontend/runtime

## VALIDATION

Success requires:
- SQL draft created
- validation SQL drafted
- no DB mutation performed
- OAR1 written

## EXPECTED OAR1

    docs/oar/c3_field/oar1_concordance_authority_sql_migration_draft_v1.meta.md

## CLOSE

Draft SQL only.

Execution requires separate OAR2.

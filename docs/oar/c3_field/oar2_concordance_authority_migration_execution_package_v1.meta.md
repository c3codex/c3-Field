# OAR2 — Concordance Authority Migration Execution Package

## OBSERVED

Concordance Authority now has:

    authority model
    schema proposal
    migration plan
    hardened SQL draft
    validation query draft
    Seed Concordance v1 authority seating record

No DB mutation has occurred.

## ALIGNED

This OAR2 prepares the execution package only.

No SQL execution.
No DB mutation.
No row seating yet.

## ROUTED

Cody shall prepare a migration execution package including:

1. finalized Supabase migration file draft
2. preflight SQL
3. rollback / recovery SQL
4. Seed Concordance v1 seating SQL
5. post-seat validation SQL
6. execution order notes
7. OAR1 closeout

Package must preserve:

    Codex seating = authority
    snapshot != authority
    markdown file != authority

## CODY ROLE

Cody may:
- create execution-ready SQL files
- place them as review artifacts
- define execution order
- define rollback/recovery posture
- write OAR1

Cody may not:
- execute SQL
- mutate DB
- create live migration under supabase/migrations unless explicitly routed
- insert rows
- alter runtime/frontend
- modify Seed Concordance content

## VALIDATION

Success requires:
- execution package drafted
- migration SQL prepared as artifact
- seating SQL prepared as artifact
- validation SQL prepared
- rollback/recovery SQL prepared
- no DB mutation performed
- OAR1 written

## EXPECTED OAR1

    docs/oar/c3_field/oar1_concordance_authority_migration_execution_package_v1.meta.md

## CLOSE

Prepare execution package.

Do not execute.

Authority seats only by separate confirmed execution route.

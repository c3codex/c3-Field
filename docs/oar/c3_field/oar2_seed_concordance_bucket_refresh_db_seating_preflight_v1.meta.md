# OAR2 — Seed Concordance Bucket Refresh + DB Seating Preflight

## OBSERVED

TREE + c3 Boundary have been incorporated into local Seed Concordance.

OAR1 verified:

    local Seed Concordance updated
    bucket Seed Concordance stale
    DB seating not found

Known findings:

    c3_oar_seeded_reference contains no seed_concordance row
    codex_entity_artifact contains no seed_concordance artifact row
    measures_registry.metadata contains no row referencing seed_concordance
    measures-seed bucket contains older seed/v1/seed_concordance.meta.md
    bucket hash does not match updated local hash

Bucket seed does not equal database seating.

Codex/database must hold authority.

## ALIGNED

Preserve native order:

    Codex → Field → Measures → Chazz

This OAR2 separates two actions:

    1. refresh stale bucket source snapshot
    2. perform DB seating preflight for Seed Concordance

No DB mutation is authorized yet unless a valid existing manifest and table route are confirmed.

Nothing enters DB without manifest.

## ROUTED

Cody shall:

### 1. Refresh Bucket Object

Upload updated local file:

    docs/_source/seed/seed_concordance.meta.md

to private bucket:

    measures-seed

expected path:

    seed/v1/seed_concordance.meta.md

Then verify:

    bucket object exists
    bucket is private
    bucket hash matches updated local file hash

### 2. DB Seating Preflight

Perform read-only DB inspection for valid Seed Concordance seating targets.

Check at minimum:

    c3_oar_seeded_reference
    codex_entity_artifact
    measures_registry

Cody may also inspect existing schema for any table clearly intended for:

    concordance
    seed reference
    source document
    codex artifact
    semantic term registry

### 3. Report DB Seating Recommendation

If a valid table and route already exist, report the proposed insertion/update route.

If no valid DB seating route exists, recommend a manifest-first DB seating model.

Suggested model may include:

    concordance document/entity
    concordance version
    concordance term
    concordance relation
    seeded source snapshot linkage

but Cody must not create it yet.

## CODY ROLE

Cody may:

    refresh bucket object
    verify hash
    inspect DB read-only
    report candidate seating route
    write OAR1 closeout

Cody may not:

    mutate DB
    create tables
    insert records
    update records
    alter schema
    modify frontend
    modify runtime
    revise Seed Concordance content
    treat bucket refresh as DB seating

## VALIDATION

Success requires:

    updated local Seed Concordance hash matches bucket object hash
    DB seating targets inspected
    DB seating gap or route clearly reported
    no DB mutation performed
    OAR1 written

## EXPECTED OAR1

    docs/oar/c3_field/oar1_seed_concordance_bucket_refresh_db_seating_preflight_v1.meta.md

## CLOSE

Bucket preserves source snapshot.

Codex must hold authority.

Preflight before database seating.

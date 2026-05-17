# OAR2 — Concordance Authority Migration Plan

## OBSERVED

Concordance Authority Schema Proposal v1 is now defined.

The proposal established minimal schema bodies for:

    concordance_document
    concordance_version
    concordance_term
    concordance_relation
    seeded_source_snapshot

No DB mutation has occurred yet.

Current standing:

    Seed Concordance authority model defined
    schema proposal defined
    migration path undefined

## ALIGNED

This OAR2 defines migration sequencing only.

No migration execution.
No schema creation.
No DB mutation.
No bucket mutation.
No frontend/runtime implementation.

Native order remains:

    Codex → Field → Measures → Chazz

Migration planning must preserve:

    Codex seating = authority
    Field structures relation
    Measures exposes reveal/retrieval
    Snapshots preserve continuity

## ROUTED

Cody shall produce a Concordance Authority Migration Plan defining:

### 1. Migration Dependency Order

Define the safe creation sequence for:

    tables
    constraints
    foreign keys
    indexes
    RLS
    policies
    append protections
    validation queries
    manifest seating

Must prevent:
- circular dependency
- premature FK enforcement
- invalid relation seating
- public write exposure

### 2. Initial Migration Cadence

Define phased migration order.

Minimum phases:

    Phase 1
    core authority tables

    Phase 2
    constraints + indexes

    Phase 3
    RLS + access posture

    Phase 4
    append protections

    Phase 5
    manifest seating path

    Phase 6
    validation cadence

### 3. Append Protection Strategy

Define:
- immutable bodies
- append-only bodies
- restricted mutation bodies
- supersession strategy
- correction strategy

Must preserve:

    semantic continuity
    non-collapse
    traceability
    verification-before-recognition

### 4. Validation Cadence

Define validation sequence for:
- schema existence
- FK integrity
- uniqueness protection
- RLS enforcement
- authority standing
- snapshot standing
- duplicate-term prevention
- active-version enforcement

### 5. Manifest Seating Sequence

Define the exact seating order for:

    Seed Concordance v1

Including:
- document seating
- version seating
- term seating
- relation seating
- snapshot seating
- validation checkpoints
- OAR1 closeout sequence

### 6. Rollback and Recovery Posture

Define:
- safe rollback boundaries
- append-safe recovery
- failed migration handling
- partial seating handling
- snapshot recovery posture

Must prevent:

    semantic orphaning
    duplicate authority
    silent overwrite
    untracked mutation

### 7. Measures Exposure Boundary

Define how concordance authority may later become retrievable through Measures without:
- exposing protected authority
- exposing draft standing
- exposing blocked terms
- allowing frontend semantic authorship

## CODY ROLE

Cody may:
- define migration sequence
- define validation cadence
- define RLS posture
- define append protections
- define rollback posture
- write OAR1 closeout

Cody may not:
- create migrations
- alter schema
- execute SQL
- mutate DB
- mutate bucket
- modify concordance content
- implement runtime/frontend

## VALIDATION

Success requires:

    migration sequence defined
    dependency order defined
    validation cadence defined
    append protections defined
    rollback posture defined
    Seed Concordance v1 seating cadence defined
    Measures exposure boundary defined
    no DB mutation performed
    OAR1 written

## EXPECTED OAR1

    docs/oar/c3_field/oar1_concordance_authority_migration_plan_v1.meta.md

## CLOSE

Define migration before execution.

Seat authority deliberately.

Preserve semantic continuity.

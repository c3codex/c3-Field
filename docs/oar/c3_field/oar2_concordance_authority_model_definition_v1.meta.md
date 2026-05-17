# OAR2 — Concordance Authority Model Definition

## OBSERVED

Seed Concordance is currently functioning as:

    semantic authority
    native systems reference
    process-governing source surface

but is not seated as Codex/database authority.

Current standing:

    local concordance updated
    bucket snapshot partially refreshed
    DB authority seating absent

Read-only preflight confirmed:

    no concordance document table
    no concordance version table
    no concordance term registry
    no concordance relation registry
    no semantic authority route

The current system therefore depends on markdown + bucket reference for semantic authority continuity.

This conflicts with native order:

    Codex = database authority

## ALIGNED

Preserve native order:

    Codex → Field → Measures → Chazz

Concordance authority must resolve through Codex.

Bucket storage may preserve:
- seeded snapshots
- recovery artifacts
- immutable source exports

but bucket storage does not become authority.

This OAR2 defines authority structure only.

No DB mutation occurs yet.

## ROUTED

Cody shall define a manifest-first Concordance Authority Model.

### 1. Define Required Authority Bodies

Propose bounded authority bodies for concordance seating.

Minimum bodies:

    concordance_document
    concordance_version
    concordance_term
    concordance_relation
    seeded_source_snapshot

Additional bodies may be proposed only if structurally necessary.

### 2. Define Functional Role of Each Body

Each proposed authority body must define:

    purpose
    authority standing
    append-only or mutable standing
    relationship to Codex
    relationship to Field
    relationship to Measures
    relationship to seeded snapshots

### 3. Define Native Relation Flow

Define how concordance authority resolves through native order:

    Codex
    → concordance authority storage

    Field
    → semantic relation structure

    Measures
    → registry exposure / reveal / retrieval

    Chazz
    → systems routing and validation

### 4. Define Term Seating Logic

Define how terms should seat without semantic collapse.

Must preserve:

    defined
    bound
    linked
    singular
    non-redundant
    non-drifting
    system-valid

No duplicate semantic authority permitted.

### 5. Define Version + Snapshot Discipline

Define separation between:

    live Codex authority
    seeded snapshot export
    bucket recovery artifact
    working draft state

Clarify:

    bucket snapshot ≠ authority
    markdown file ≠ authority
    Codex seating = authority

### 6. Define Mutation Discipline

Define how future concordance mutation must occur.

Must preserve:

    manifest-first
    OAR-routed
    append-aware
    verification-before-recognition
    seeded-reference discipline

### 7. Define Initial Seating Recommendation

Recommend the minimum viable seating path for:

    Seed Concordance v1

without executing mutation.

## CODY ROLE

Cody may:

    inspect current schema
    define authority model
    propose schema bodies
    define relation flow
    define seating discipline
    write OAR1 closeout

Cody may not:

    create tables
    alter schema
    insert rows
    update rows
    modify bucket objects
    modify concordance content
    implement runtime logic
    implement frontend logic
    treat proposal as seated authority

## VALIDATION

Success requires:

    Concordance authority model defined
    native order preserved
    authority/snapshot distinction clarified
    term seating logic clarified
    mutation discipline clarified
    initial seating recommendation defined
    no DB mutation performed
    OAR1 written

## EXPECTED OAR1

    docs/oar/c3_field/oar1_concordance_authority_model_definition_v1.meta.md

## CLOSE

Codex must hold semantic authority.

Field must structure semantic relation.

Measures must expose valid reveal.

Seeded snapshots preserve continuity.

Authority must not drift into storage.

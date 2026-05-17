# OAR2 — Seed Concordance v1 Authority Seating Record

## OBSERVED

Concordance Authority architecture, schema, migration cadence, and SQL draft hardening are complete.

The system now requires a compact pre-execution seating record defining the exact initial Seed Concordance v1 authority payload before any future DB mutation.

## ALIGNED

This OAR2 defines seating records only.

No SQL execution.
No DB mutation.
No migration execution.
No runtime/frontend implementation.

Native order remains:

    Codex → Field → Measures → Chazz

## ROUTED

Cody shall define a compact Seed Concordance v1 Authority Seating Record including:

### 1. Document Authority Record

Define:

    document_key
    title
    document_scope
    authority_standing
    visibility_standing
    native_order
    source_alignment

### 2. Version Authority Record

Define:

    version_key
    document_key
    version_label
    version_standing
    visibility_standing
    recognized_at posture
    source_oar2_path
    closeout_oar1_path

### 3. Initial Term Seating Set

Define the initial seated term set for Seed Concordance v1.

Must include at minimum:

    Codex
    Field
    Measures
    Chazz
    TREE
    c3 Boundary
    src
    Cody
    OAR2

Each term must define:

    term_key
    term_label
    canonical_definition
    axis
    circuit
    role
    term_standing
    visibility_standing

### 4. Initial Relation Seating Set

Define initial relations for:

    native_order
    axis
    circuit
    role
    resolves_to
    source_alignment

### 5. Source Snapshot Seating Record

Define:

    local source path
    bucket path
    source hash
    byte size
    verification standing

Must preserve:

    snapshot != authority

### 6. Validation Standing

Define required validation state before future execution authorization.

Minimum:

    schema validated
    constraints validated
    RLS validated
    append protections validated
    active-version uniqueness validated
    snapshot standing recorded

## CODY ROLE

Cody may:
- define seating records
- define initial seated rows
- define validation standing
- write OAR1 closeout

Cody may not:
- execute SQL
- mutate DB
- insert rows
- create migrations
- modify concordance content outside defined seating set
- implement frontend/runtime

## VALIDATION

Success requires:

    initial seating payload defined
    native order preserved
    authority/snapshot distinction preserved
    initial term set defined
    initial relation set defined
    validation standing defined
    no DB mutation performed
    OAR1 written

## EXPECTED OAR1

    docs/oar/c3_field/oar1_seed_concordance_v1_authority_seating_record.meta.md

## CLOSE

Define seating before execution.

Seat authority deliberately.

Preserve semantic continuity.

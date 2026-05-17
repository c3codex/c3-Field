# OAR2 — Concordance Authority SQL Draft Hardening

## OBSERVED

The Concordance Authority SQL draft is structurally sound, but several authority protections should be added before migration execution planning.

Current draft should be hardened before any DB mutation.

Needed hardening:

    one active version per document
    relation_scope support
    protected/internal visibility standing
    trigger-managed updated_at
    immutable recognized/verified timestamp posture
    validation queries for added protections

## ALIGNED

This OAR2 revises SQL draft artifacts only.

No migration execution.
No DB mutation.
No manifest seating.
No runtime/frontend implementation.

## ROUTED

Cody shall revise the SQL draft to add:

### 1. Active Version Protection

Enforce one active version per concordance document.

Recommended:

    partial unique index on concordance_version(document_key)
    where version_standing = 'active'

### 2. Relation Scope

Add relation scope support so relations can be safely classified as:

    term
    document
    version
    cross_version
    branch
    system

without forcing all relations into term-to-term shape.

### 3. Protected Visibility Standing

Add visibility/access posture to prevent protected semantic bodies from public exposure.

Recommended standing values:

    public
    internal
    protected
    restricted

Apply where appropriate to:

    concordance_document
    concordance_version
    concordance_term
    concordance_relation
    seeded_source_snapshot

### 4. Trigger-Managed updated_at

Add updated_at trigger logic for mutable/update-limited tables.

### 5. Immutable Timestamp Posture

Protect recognized/verified timestamps from silent mutation after recognition.

Apply to:

    concordance_version.recognized_at
    seeded_source_snapshot.verified_at

### 6. Validation Query Updates

Update validation SQL to check:

    active version uniqueness
    relation_scope column/check constraint
    visibility/access standing constraints
    updated_at trigger presence
    recognized_at / verified_at immutability protections
    RLS visibility filters

## CODY ROLE

Cody may:
- revise SQL draft files
- revise validation query draft
- write OAR1 closeout

Cody may not:
- execute SQL
- create migration files under supabase/migrations
- mutate DB
- insert records
- modify concordance content
- implement frontend/runtime

## VALIDATION

Success requires:
- SQL draft hardened
- validation SQL updated
- no DB mutation performed
- no Supabase migration file created
- OAR1 written

## EXPECTED OAR1

    docs/oar/c3_field/oar1_concordance_authority_sql_draft_hardening_v1.meta.md

## CLOSE

Harden before execution.

Authority protections belong in the first migration, not later.

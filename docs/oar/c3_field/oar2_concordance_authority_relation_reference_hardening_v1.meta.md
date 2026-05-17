# OAR2 — Concordance Authority Relation Reference Hardening

## OBSERVED

Current seating record uses generic source / target, while schema draft uses term-shaped source_term_key / target_term_key.

Because relation_scope now supports term, document, version, branch, system, and cross-version relations, term-only naming may cause structural drift.

## ALIGNED

Preserve native relation integrity:

    Field structures relation.
    Measures registers reveal.
    Codex holds authority.

Seed Concordance requires terms to remain linked, singular, non-drifting, and system-valid.

## ROUTED

Cody shall revise draft SQL and seating artifacts to use scope-neutral relation references:

    source_ref
    target_ref

or equivalent.

Do not use term-only reference naming where relation scope may exceed terms.

Update:
- SQL draft
- validation SQL
- Seed Concordance v1 seating record
- OAR1 closeout

No DB mutation.
No migration execution.
No runtime/frontend work.

## VALIDATION

Success requires:
- relation references are scope-neutral
- term relations remain valid
- document/system/version relations are not forced into term shape
- no DB mutation performed
- OAR1 written

## EXPECTED OAR1

    docs/oar/c3_field/oar1_concordance_authority_relation_reference_hardening_v1.meta.md

## CLOSE

Relation scope must match relation structure.

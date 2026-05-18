---
document_type: oar2
authority_level: working
document_scope: source_reference_traversal_view_hardening
title: OAR2 — Source Reference Traversal View Hardening v1
status: proposed
version: v1
operator: op044
system: source_reference
---

# OAR2 — Source Reference Traversal View Hardening v1

## OBSERVED

Source-reference build now has seeded memory, traversal views, precedence classification, and access boundaries.

Current drift risk is speed, not weakness.

Public access remains blocked.

## ALIGNED

This OAR2 authorizes hardening review only.

It does not authorize:

- public read policy
- frontend exposure
- base table exposure
- runtime authority computation
- broad source ingestion
- protected internals exposure

## ROUTED

Review and harden:

1. remaining source classes in precedence ranking
2. whether `v_codex_source_seeded_precedence` exposes more than public read requires
3. whether a narrower public-safe view is needed
4. protected-source marker behavior
5. contradiction candidate readability
6. audit-proof visibility boundaries
7. whether internal traversal views expose more than runtime needs

## EXPECTED PUBLIC-SAFE VIEW REVIEW

If needed, draft:

`public.v_codex_source_public_precedence`

Allowed columns only:

- source_key
- source_title
- source_type
- authority_level
- source_status
- readonly
- precedence_rank
- precedence_label

Exclude:

- source_reference_id
- seeded_at
- source_path
- source_hash
- metadata
- body/content
- protected internals

## CODY ROLE

Cody may:

- inspect current traversal views
- identify overexposed columns
- draft SQL if a narrower view is needed
- produce OAR1 review

Cody may not:

- execute SQL
- create policies
- expose runtime
- mutate source records
- activate bindings

## EXPECTED OUTPUT

If SQL draft is needed:

`docs/schema/source_reference/source_reference_traversal_view_hardening_v1.sql`

OAR1:

`docs/oar/source_reference/oar1_source_reference_traversal_view_hardening_v1.meta.md`

## VALIDATION

Hardening is complete when:

1. remaining class ranking is reviewed
2. public-safe precedence need is decided
3. protected marker behavior is confirmed
4. contradiction readability is confirmed
5. audit visibility boundary is confirmed
6. no public access is created
7. final route is selected

## FINAL ROUTE OPTIONS

- hardening_review_only
- public_safe_view_draft_needed
- rejected_for_public_read

## CLOSE

Traversal can resolve.

Public exposure remains blocked.

Hardening precedes access policy.

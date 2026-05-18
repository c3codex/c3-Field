---
document_type: oar1
authority_level: working
document_scope: source_reference_traversal_view_hardening
title: OAR1 - Source Reference Traversal View Hardening v1
status: completed_review
version: v1
operator: op044
system: source_reference
source_oar2: docs/oar/source_reference/oar2_source_reference_traversal_view_hardening_v1.meta.md
final_route: public_safe_view_draft_needed
native_stack:
  codex: database
  field: schema
  measures: registry
  chazz: systems
tags:
  - oar1
  - source-reference
  - traversal-view
  - hardening
  - public-safe-view
  - no-public-exposure
---

# OAR1 - Source Reference Traversal View Hardening v1

## Execution Result

Executed hardening review from:

`docs/oar/source_reference/oar2_source_reference_traversal_view_hardening_v1.meta.md`

No SQL was executed.

No public read policy was created.

No frontend exposure was created.

No base table was exposed.

No runtime authority computation was added.

No source record was mutated.

No binding was activated.

## Final Route

`public_safe_view_draft_needed`

A narrower public-safe projection is needed before any future public read policy can be considered.

The draft-only SQL artifact is:

`docs/schema/source_reference/source_reference_traversal_view_hardening_v1.sql`

## Precedence Class Review

The current precedence classification has already separated:

- concordance sources
- foundational sources
- process constraints
- lifecycle/source-control rules
- OAR1 records
- OAR2 records
- process rules
- implementation manifests
- role contracts
- verification checklists
- schema drafts and migration candidates
- unranked seeded sources

No remaining seeded source class requires immediate ranking change in this hardening pass.

Schema drafts and migration candidates remain intentionally low-precedence planning surfaces.

Unranked seeded sources remain visible as review signals, not authority upgrades.

## Existing Candidate Review

`public.v_codex_source_seeded_precedence` remains useful for internal traversal and operator review.

It currently exposes:

- `source_reference_id`
- `source_key`
- `source_title`
- `source_type`
- `authority_level`
- `source_status`
- `readonly`
- `seeded_at`
- `precedence_rank`
- `precedence_label`

This exceeds the public-safe column allowance because it includes:

- `source_reference_id`
- `seeded_at`

Those columns are acceptable for internal traversal, but unnecessary for public read.

## Public-Safe Draft

Drafted candidate:

`public.v_codex_source_public_precedence`

Allowed columns only:

- `source_key`
- `source_title`
- `source_type`
- `authority_level`
- `source_status`
- `readonly`
- `precedence_rank`
- `precedence_label`

Explicitly excluded:

- `source_reference_id`
- `seeded_at`
- `source_path`
- `source_hash`
- `metadata`
- body/content
- protected internals

The draft selects from `public.v_codex_source_seeded_precedence` to preserve the already-routed ranking logic while narrowing the public-facing shape.

## Protected Marker Behavior

Protected-source marker handling remains internal.

`public.v_codex_source_resolution_path` may retain `protected_source` as an internal marker for authenticated/operator traversal review.

The drafted public-safe view does not expose:

- protected marker fields
- metadata
- source internals
- body/content

## Contradiction Candidate Readability

`public.v_codex_source_contradiction_candidates` remains readable enough for operator review because it surfaces candidate type, involved source keys, term key, related source key, and candidate detail.

It remains classified as:

`never_public`

No public-safe contradiction view was drafted.

## Audit Visibility Boundary

Audit proof remains separate from public precedence.

`codex_source_seed_log` remains operator-only.

This pass does not create:

- audit proof summary
- public seed log visibility
- public record-change trail
- runtime audit endpoint

Any future audit-proof summary requires separate OAR routing.

## Internal Traversal Boundary

The internal traversal views expose more than runtime/public read requires.

They remain bounded as internal or operator surfaces:

| surface | standing |
|---|---|
| `v_codex_source_seeded_precedence` | internal/operator traversal source |
| `v_codex_source_lineage` | authenticated internal |
| `v_codex_source_seeded_relations` | authenticated internal |
| `v_codex_source_supersession` | operator only |
| `v_codex_source_active_bindings` | authenticated internal |
| `v_codex_source_contradiction_candidates` | never public |
| `v_codex_source_resolution_path` | authenticated internal |
| `v_codex_source_public_precedence` | draft-only public-safe candidate |

## Validation

Hardening review is complete:

1. remaining class ranking was reviewed
2. public-safe precedence need was decided
3. protected marker behavior was confirmed
4. contradiction readability was confirmed
5. audit visibility boundary was confirmed
6. no public access was created
7. final route is `public_safe_view_draft_needed`

## Close

Traversal hardening resolves as draft-only.

Public exposure remains blocked.

The next eligible action is separate execution authorization for the public-safe projection, followed only later by an access-policy OAR if exposure is still desired.

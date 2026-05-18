---
document_type: oar2
authority_level: working
document_scope: source_reference_access_policy_review
title: OAR2 — Source Reference Access Policy Review and Runtime Read Boundaries v1
status: proposed
version: v1
operator: op044
system: source_reference
native_stack:
  codex: database
  field: schema
  measures: registry
  chazz: systems
tags:
  - oar2
  - source-reference
  - access-policy
  - runtime-read
  - protected-boundary
  - no-public-exposure
source_alignment:
  - OAR1 - Source Reference Traversal View Execution v1
  - OAR1 - Source Reference Expansion and Inheritance Rules v1
  - Seed Concordance
  - Source Set Rule Summary — Seeded Reference Control
  - Chazz x Cody Development Role Contract
---

# OAR2 — Source Reference Access Policy Review and Runtime Read Boundaries v1

## OBSERVED

Traversal resolution views now exist in DB.

Created views include:

- `public.v_codex_source_seeded_precedence`
- `public.v_codex_source_lineage`
- `public.v_codex_source_seeded_relations`
- `public.v_codex_source_supersession`
- `public.v_codex_source_active_bindings`
- `public.v_codex_source_contradiction_candidates`
- `public.v_codex_source_resolution_path`

Execution completed with:

- no public policies
- no source mutation
- no binding activation
- no recursive traversal
- no contradiction auto-resolution
- no protected internals exposed

Seed Concordance defines Codex as authority, Field as relation, Measures as sequence/access/reveal, and Chazz as bounded execution.

Frontend must render seated state only and must not invent missing actions, compress distinct reveal bodies, or infer meaning from absence.

## ALIGNED

This OAR2 authorizes access-policy review only.

It does not authorize:

- creating public policies
- exposing frontend source tables
- exposing protected source internals
- activating bindings
- mutating seeded references
- creating public APIs
- creating runtime cache layers
- changing RLS

## ROUTED

### 1. Access Classification

Classify each surface as one:

- `service_only`
- `operator_only`
- `authenticated_internal`
- `public_read_candidate`
- `never_public`

Initial classification:

| surface | classification |
|---|---|
| `codex_source_reference` | service_only |
| `codex_source_term` | service_only |
| `codex_source_operative_binding` | service_only |
| `codex_source_relation` | service_only |
| `codex_source_seed_log` | operator_only |
| `v_codex_source_seeded_precedence` | public_read_candidate |
| `v_codex_source_lineage` | authenticated_internal |
| `v_codex_source_seeded_relations` | authenticated_internal |
| `v_codex_source_supersession` | operator_only |
| `v_codex_source_active_bindings` | authenticated_internal |
| `v_codex_source_contradiction_candidates` | never_public |
| `v_codex_source_resolution_path` | authenticated_internal |

### 2. Protected Boundary Rule

Protected systems intelligence may appear only as boundary markers.

Never expose:

- reconstructible protected internals
- protected routing bodies
- raw NotChazz logic
- Chazz_roles internals
- Geometric Logic rule body
- protected constraints as executable logic

Protected-source markers may be reviewed for visibility, but default standing is:

`operator_only`

### 3. Public Read Candidate Review

Only this view may be considered for eventual public read:

`public.v_codex_source_seeded_precedence`

Public read candidate does not mean public policy.

Before exposure, verify it contains only:

- source key
- source title
- source type
- authority level
- seeded standing
- readonly standing
- precedence rank
- precedence label

No hashes.
No source paths.
No metadata body.
No protected internals.

### 4. Never-Public Surfaces

The following remain blocked from public exposure:

- base source tables
- seed logs
- contradiction candidates
- protected-source internals
- supersession enforcement surfaces
- service mutation functions
- any future recursive traversal view

### 5. Runtime Read Boundary

Runtime may eventually read only approved views.

Runtime may not read:

- base source tables directly
- seed logs
- mutation surfaces
- raw source metadata
- contradiction candidates
- protected internals

Runtime read must remain query-limited, view-bound, and non-authoring.

### 6. API Boundary

Any API layer must:

- read from approved views only
- return immutable read snapshots
- not compute authority in application code
- not alter precedence
- not resolve contradictions
- not expose source hashes unless operator-routed
- log meaningful access if operator/internal

### 7. Cache Boundary

If runtime caching is later introduced:

- cache must reflect view output only
- cache must not become authority
- cache invalidation must follow source update / seed log state
- cache may not invent fallback state

### 8. Audit Trace Visibility

Audit visibility must be classified separately.

Seed logs are not public.

Possible future standings:

- operator audit only
- internal audit summary
- public proof summary

No audit exposure is authorized by this OAR2.

### 9. Required Review Queries

Cody may inspect current view columns and sample outputs.

Required review:

- column list for each traversal view
- sample rows from seeded precedence
- sample rows from resolution path
- protected marker presence check
- metadata exposure check
- path/hash exposure check
- contradiction candidate count
- policy count check

### 10. Final Route

Return one:

- access_review_only
- access_policy_candidate
- rejected_for_exposure

Expected route:

`access_review_only`

unless a specific view is proven safe for a later separate access-policy OAR.

## CODY ROLE

Cody may:

- inspect view definitions
- inspect column exposure
- inspect sample outputs
- classify surfaces
- identify exposure risks
- produce OAR1 review results

Cody may not:

- create policies
- expose views
- modify RLS
- create APIs
- activate bindings
- mutate sources
- change view definitions without separate OAR
- expose protected internals

## EXPECTED OUTPUT

OAR1:

`docs/oar/source_reference/oar1_source_reference_access_policy_review_runtime_read_boundaries_v1.meta.md`

If revision is required:

`docs/schema/source_reference/source_reference_runtime_read_boundary_revision_v1.sql`

No SQL execution unless separately authorized.

## VALIDATION

Review is complete when:

1. each source-reference surface is classified
2. public-read candidates are identified or rejected
3. never-public surfaces are confirmed
4. protected-boundary handling is confirmed
5. runtime read limits are defined
6. API and cache boundaries are defined
7. no access policy is created
8. final route is selected

## CLOSE

Codex can resolve.

Access must remain governed.

Exposure requires separate OAR.

---
document_type: oar1
authority_level: working
document_scope: source_reference_inheritance_rules
title: OAR1 - Source Reference Expansion and Inheritance Rules v1
status: completed_review
version: v1
operator: op044
system: source_reference
source_oar2: docs/oar/source_reference/oar2_source_reference_expansion_inheritance_rules_v1.meta.md
schema_support_reviewed: docs/schema/source_reference/source_reference_schema_sql_draft_v1_preflight_corrected.sql
source_seed_oar1: docs/oar/source_reference/oar1_source_reference_initial_seeding_v1.meta.md
native_stack:
  codex: database
  field: schema
  measures: registry
  chazz: systems
tags:
  - oar1
  - source-reference
  - inheritance
  - lineage
  - supersession
  - seeded-memory
---

# OAR1 - Source Reference Expansion and Inheritance Rules v1

## Execution Result

Executed rule-adoption review from:

`docs/oar/source_reference/oar2_source_reference_expansion_inheritance_rules_v1.meta.md`

No SQL was generated.

No DB mutation was performed.

No new source was seeded.

No source reference was edited.

No operative binding was activated.

No access policy was created.

No frontend/runtime exposure was created.

## Current Seeded Standing Confirmed

Current standing from initial source-reference seeding:

```json
{
  "seeded_source_reference_count": 5,
  "seeded_term_count": 15,
  "seed_log_count": 5,
  "operative_binding_count": 6,
  "relation_count": 4,
  "readonly_seeded_count": 5
}
```

Seeded memory exists as DB state.

Expansion remains blocked until inheritance, contradiction, and supersession rules are followed.

## Schema Support Review

Reviewed schema support in:

`docs/schema/source_reference/source_reference_schema_sql_draft_v1_preflight_corrected.sql`

Existing schema already supports the routed inheritance relation types:

- `aligns_to`
- `depends_on`
- `clarifies`
- `protects`
- `routes`
- `verifies`

Existing schema also supports `supersedes` relation type for future supersession workflows.

Existing operative binding state already supports:

- `proposed`
- `active`
- `held`
- `retired`
- `rejected`

No schema change is required by this OAR2.

## Precedence Rule Confirmed

Precedence order is confirmed:

1. Seed Concordance
2. The 21 of Coherence
3. Seeded Reference Control
4. OAR Lifecycle
5. Completed OAR1 records
6. Working OAR2 records
7. Process rules
8. Implementation manifests
9. Schema drafts

No lower-precedence source may override a higher-precedence seeded source.

## Inheritance Rule Confirmed

A source may inherit from another only through explicit `codex_source_relation`.

Inheritance does not copy authority.

Inheritance carries relation, not replacement.

Allowed inheritance relation types:

- `aligns_to`
- `depends_on`
- `clarifies`
- `protects`
- `routes`
- `verifies`

## Supersession Rule Confirmed

Seeded sources are not edited in place.

A seeded source may be superseded only by:

- new source reference
- explicit `supersedes` relation
- seed log event
- OAR1 proof
- operator validation

Superseded sources remain retrievable.

## Contradiction Handling Confirmed

If two seeded sources conflict:

1. halt downstream mutation
2. identify source precedence
3. create OAR2 correction route
4. do not silently resolve by latest timestamp
5. do not let implementation choose authority

## Operative Binding Activation Confirmed

An operative binding may become `active` only when:

- source reference is seeded
- source term exists
- relation path is valid
- no higher-precedence contradiction exists
- OAR route authorizes activation

Default binding state remains `proposed`.

## Readonly Candidate Promotion Confirmed

`readonly_candidate` may promote to seeded only through:

1. thread review
2. transfer/write
3. file check
4. git commit
5. source hash
6. OAR2 authorization
7. OAR1 execution proof
8. seed log

Committed is not seeded.

## Protected Source Boundary Confirmed

Protected systems intelligence may be referenced but not exposed as reconstructible rule body.

Protected category includes:

- NotChazz
- Chazz_roles
- protected routing bodies
- Geometric Logic
- protected constraints

## Automatic Seeding Prohibition Confirmed

The system may not automatically seed:

- all docs in a folder
- all OARs
- all terms in a concordance
- generated SQL drafts
- media manifests
- frontend manifests
- protected internal logic
- runtime artifacts

Every seeded source requires explicit OAR route.

## Expansion Order Confirmed

Future expansion must proceed in this order:

1. inheritance rules
2. contradiction/supersession rules
3. next bounded seed set
4. term expansion
5. binding activation
6. source traversal views
7. access policy review
8. frontend/runtime read exposure

Access exposure is not allowed before traversal and precedence rules exist.

## Validation

This OAR2 resolves successfully:

- inheritance rules are documented
- precedence order is confirmed
- supersession rule is confirmed
- contradiction handling is confirmed
- protected-source boundary is confirmed
- automatic seeding prohibition is confirmed
- next expansion order is confirmed
- no DB mutation occurred
- no schema support SQL was required

## Close

Seeded memory now exists.

Expansion requires inheritance law before broader seeding.

Access exposure remains blocked.

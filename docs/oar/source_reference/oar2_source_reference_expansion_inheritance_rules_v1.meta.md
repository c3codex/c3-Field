---
document_type: oar2
authority_level: working
document_scope: source_reference_inheritance_rules
title: OAR2 — Source Reference Expansion and Inheritance Rules v1
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
  - inheritance
  - lineage
  - supersession
  - seeded-memory
source_alignment:
  - OAR1 - Source Reference Initial Seeding v1
  - Seed Concordance
  - The 21 of Coherence
  - Source Set Rule Summary — Seeded Reference Control
  - OAR Lifecycle — Execution and Handoff
---

# OAR2 — Source Reference Expansion and Inheritance Rules v1

## OBSERVED

Initial source-reference seeding completed successfully.

Current seeded standing:

- 5 source references
- 15 bounded terms
- 6 operative bindings
- 4 source relations
- 5 seed logs
- no public policies
- no frontend/runtime exposure

The system now holds source memory as DB state rather than thread continuity.

Seeded-reference control requires seeded and unseeded docs to remain distinct before downstream mutation.

Seed Concordance establishes that Codex holds authority, Field structures relation, Measures registers sequence/access/reveal, and Chazz executes within role.

## ALIGNED

This OAR2 defines inheritance and expansion rules only.

It does not authorize:

- new source seeding
- access policies
- frontend runtime integration
- automatic extraction
- public source browsing
- mutation of seeded references
- broad concordance import

## ROUTED

### 1. Source Precedence

Precedence order:

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

### 2. Inheritance Rule

A source may inherit from another only through explicit `codex_source_relation`.

Allowed inheritance relation types:

- `aligns_to`
- `depends_on`
- `clarifies`
- `protects`
- `routes`
- `verifies`

Inheritance does not copy authority.

Inheritance carries relation, not replacement.

### 3. Supersession Rule

Seeded sources are not edited in place.

A seeded source may be superseded only by:

- new source reference
- explicit `supersedes` relation
- seed log event
- OAR1 proof
- operator validation

Superseded sources remain retrievable.

### 4. Contradiction Handling

If two seeded sources conflict:

1. halt downstream mutation
2. identify source precedence
3. create OAR2 correction route
4. do not silently resolve by latest timestamp
5. do not let implementation choose authority

### 5. Operative Binding Activation

An operative binding may become `active` only when:

- source reference is seeded
- source term exists
- relation path is valid
- no higher-precedence contradiction exists
- OAR route authorizes activation

Default binding state remains `proposed`.

### 6. Readonly Candidate Promotion

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

### 7. Protected Source Boundary

Protected systems intelligence may be referenced but not exposed as reconstructible rule body.

Protected category includes:

- NotChazz
- Chazz_roles
- protected routing bodies
- Geometric Logic
- protected constraints

This follows Seed Concordance protection boundaries.

### 8. Automatic Seeding Prohibition

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

### 9. Expansion Order

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

## CODY ROLE

Cody may:

- review current `codex_source_*` records
- propose rule SQL if schema additions are required
- create an OAR1 documenting rule adoption
- identify missing relation types or constraints

Cody may not:

- seed new sources from this OAR2
- create access policies
- expose tables to frontend
- auto-import docs
- mutate seeded references
- activate bindings without explicit route

## EXPECTED OUTPUT

If no schema change is required:

docs/oar/source_reference/oar1_source_reference_expansion_inheritance_rules_v1.meta.md

If schema support is required:

docs/schema/source_reference/source_reference_inheritance_rules_v1.sql

and then OAR1 documenting review only unless separately authorized.

## VALIDATION

This OAR2 resolves when:

1. inheritance rules are documented
2. precedence order is confirmed
3. supersession rule is confirmed
4. contradiction handling is confirmed
5. protected-source boundary is confirmed
6. automatic seeding prohibition is confirmed
7. next expansion order is confirmed
8. no DB mutation occurs unless separately routed

## CLOSE

Seeded memory now exists.

Expansion requires inheritance law before broader seeding.

Access exposure remains blocked.

---
document_type: oar2
authority_level: working
document_scope: source_reference_initial_seeding
title: OAR2 — Source Reference Initial Seeding v1
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
  - seeding
  - codex-source
  - foundational
source_alignment:
  - OAR1 - Source Reference Schema Migration Execution v1
  - Seed Concordance
  - The 21 of Coherence
  - Source Set Rule Summary — Seeded Reference Control
---

# OAR2 — Source Reference Initial Seeding v1

## OBSERVED

The source-reference schema migration completed successfully.

Created objects include:

- `public.codex_source_reference`
- `public.codex_source_term`
- `public.codex_source_operative_binding`
- `public.codex_source_relation`
- `public.codex_source_seed_log`
- `public.v_seeded_codex_source_references`

No source data was seeded automatically.

All source-reference table row counts remained zero after migration.

RLS is enabled, no public policies exist, and access remains service-side only.

## ALIGNED

This OAR2 authorizes initial source-reference seeding only.

It does not authorize:

- public access policies
- frontend integration
- source editing UI
- automatic ingestion
- runtime rendering from source tables
- broad term extraction beyond first seed set

Codex holds.
Field structures.
Measures registers.
Chazz routes.
Cody executes only the authorized seed surface.

## ROUTED

### 1. Initial Seed Set

Seed only the first readonly foundational source references:

1. `seed_concordance`
2. `system_concordance`
3. `the_21_of_coherence`
4. `seeded_reference_control`
5. `oar_lifecycle`

### 2. Required `codex_source_reference` Fields

Each seeded reference must include:

- `source_key`
- `source_title`
- `source_type`
- `authority_level`
- `source_scope`
- `version_label`
- `source_status = 'seeded'`
- `readonly = true`
- `seeded_at`
- `source_path`
- `source_hash`
- `metadata`

### 3. Hash Requirement

Each source must use a real file hash.

No placeholder hashes.

If hash cannot be produced, halt and return correction.

### 4. Seed Log

Each inserted source reference must create one `codex_source_seed_log` row with:

- `seed_event = 'seeded'`
- `operator_key = 'op044'`
- OAR key for this execution
- event note identifying initial source-reference seeding

### 5. Initial Term Population

Seed only high-priority source terms from the Seed Concordance and 21 of Coherence:

- Codex
- Field
- Measures
- Chazz
- NotChazz
- Operator
- OAR1
- OAR2
- Source
- Coherence
- Seeded Reference
- Immutable Living Memory
- Verification Before Recognition
- Native Distinction
- Role Integrity

No full concordance extraction yet.

### 6. Operative Bindings

Create only initial bindings required for source-reference operation:

- Codex → database authority
- Field → schema relation
- Measures → registry standing
- Chazz → system routing
- OAR2 → execution instruction surface
- seeded_reference_control → DB preflight rule

### 7. Relations

Create initial source relations:

- `system_concordance` aligns_to `seed_concordance`
- `the_21_of_coherence` aligns_to `seed_concordance`
- `seeded_reference_control` protects `source_reference_initial_seeding`
- `oar_lifecycle` routes `source_reference_initial_seeding`

### 8. Boundaries

Do not seed:

- all terms
- all process docs
- all OARs
- generated SQL files
- media manifests
- frontend manifests
- access policies

### 9. Validation

Return validation outputs for:

- seeded source-reference count
- seeded term count
- seed log count
- operative binding count
- relation count
- readonly standing
- zero public policies confirmed

## CODY ROLE

Cody may:

- generate the seed SQL
- execute only the approved initial seed SQL
- compute source file hashes
- insert approved source references
- insert approved initial terms
- insert approved bindings and relations
- produce OAR1 with validation outputs

Cody may not:

- broaden the seed set
- infer missing terms
- seed all docs automatically
- create public policies
- expose source tables to frontend
- mark unlisted docs seeded
- mutate unrelated tables

## EXPECTED OUTPUT

Seed SQL:

docs/schema/source_reference/source_reference_initial_seed_v1.sql

Execution OAR1:

docs/oar/source_reference/oar1_source_reference_initial_seeding_v1.meta.md

## VALIDATION

Initial seeding is complete only when:

1. five source references are seeded
2. source hashes are real
3. seed logs exist
4. initial terms are bounded to the approved list
5. bindings and relations are created only as routed
6. no public access policies exist
7. OAR1 documents execution and validation

## CLOSE

Schema exists.

Initial source seeding may proceed.

Access exposure remains separate.

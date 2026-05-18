---
document_type: oar2
authority_level: working
document_scope: source_reference_expansion_seed_set_v2
title: OAR2 — Source Reference Expansion Seed Set v2
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
  - expansion
  - seeding
  - process
  - role-contract
  - manifest
source_alignment:
  - OAR1 - Source Reference Access Policy Review and Runtime Read Boundaries v1
  - OAR1 - Source Reference Traversal View Execution v1
  - OAR1 - Source Reference Initial Seeding v1
  - Source Set Rule Summary — Seeded Reference Control
---

# OAR2 — Source Reference Expansion Seed Set v2

## OBSERVED

Initial seeded memory exists.

Traversal views exist.

Access review completed with final route:

`access_review_only`

No public exposure is authorized.

The system is now ready to seed the next bounded source set.

## ALIGNED

This OAR2 authorizes bounded source-reference expansion only.

It does not authorize:

- public access policies
- runtime exposure
- frontend integration
- automatic folder ingestion
- full concordance extraction
- mutation of seeded records
- binding activation unless explicitly routed

## ROUTED

### 1. Seed Set v2

Seed only these source references:

1. `thread_to_transfer_validation_rule`
2. `doc_set_closeout_rule`
3. `doc_stack_constraints`
4. `database_src_manifest`
5. `session_13_db_preflight_verification_checklist`
6. `chazz_cody_development_role_contract`
7. `oar2_update_powershell_transfer_surface_rule`

### 2. Required Fields

Each source reference must include:

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

No placeholder hashes.

### 3. Source Type Mapping

Use:

- process_rule
- process_constraints
- implementation_manifest
- verification_checklist
- role_contract
- oar

### 4. Seed Logs

Create one `codex_source_seed_log` row per seeded source.

Each log must include:

- `seed_event = 'seeded'`
- `operator_key = 'op044'`
- OAR key
- event note identifying expansion seed set v2

### 5. Relations

Create bounded relations:

- `thread_to_transfer_validation_rule` protects `oar_lifecycle`
- `doc_set_closeout_rule` protects `oar_lifecycle`
- `doc_stack_constraints` clarifies `seeded_reference_control`
- `database_src_manifest` aligns_to `seed_concordance`
- `session_13_db_preflight_verification_checklist` verifies `database_src_manifest`
- `chazz_cody_development_role_contract` routes `database_src_manifest`
- `oar2_update_powershell_transfer_surface_rule` clarifies `thread_to_transfer_validation_rule`

### 6. Terms

Seed only new high-priority terms if absent:

- Thread Validation
- Transfer Surface
- File Check
- Closeout
- DB Preflight
- Role Contract
- Runtime Boundary
- Frontend Non-Authority

No broad extraction.

### 7. Validation

Return:

- total seeded source-reference count
- new v2 source count
- seed log count for v2
- relation count for v2
- term count for new v2 terms
- contradiction candidate count
- seeded precedence output
- resolution path output for v2 sources

### 8. Boundaries

Do not seed:

- all files in folder
- SQL drafts
- media manifests
- frontend runtime files
- private protected internals
- unconfirmed OARs

Do not create access policies.

Do not expose runtime reads.

## CODY ROLE

Cody may:

- generate bounded seed SQL
- compute real file hashes
- execute only approved seed SQL
- insert approved references, relations, logs, and bounded terms
- validate traversal and contradiction views
- produce OAR1

Cody may not:

- broaden seed set
- infer extra source references
- activate bindings unless explicitly listed
- create public policies
- expose runtime
- mutate existing seeded references

## EXPECTED OUTPUT

Seed SQL:

`docs/schema/source_reference/source_reference_expansion_seed_set_v2.sql`

OAR1:

`docs/oar/source_reference/oar1_source_reference_expansion_seed_set_v2.meta.md`

## VALIDATION

Expansion Seed Set v2 is complete only when:

1. seven approved sources are seeded
2. source hashes are real
3. seed logs exist
4. bounded relations are created
5. only approved new terms are inserted
6. contradiction count remains zero or is routed
7. no public access policy is created
8. OAR1 documents execution and validation

## CLOSE

Initial source memory exists.

Traversal exists.

Access remains closed.

Expansion may proceed in bounded seed sets only.

---
document_type: oar1
authority_level: working
document_scope: source_authority
title: OAR1 - Source Reference Codex Seating Schema Pass
status: completed
version: v1
operator: op044
date: 2026-05-17
source_oar2: docs/oar/source_authority/oar2_source_reference_codex_seating_schema_pass_v1.meta.md
source_classification: docs/oar/source_authority/oar1_source_reference_classification_pass_v1.meta.md
native_stack:
  codex: database
  field: schema
  measures: registry
  chazz: systems
tags:
  - source-authority
  - codex-schema
  - semantic-governance
  - runtime-risk
  - codex-normalization
source_alignment:
  - Seed Concordance
  - The 21 of Coherence
  - Seeded Reference Control
  - OAR1 Source Reference Classification Pass
---

# OAR1 - Source Reference Codex Seating Schema Pass

## EXECUTION RESULT

Executed schema architecture pass from:

`docs/oar/source_authority/oar2_source_reference_codex_seating_schema_pass_v1.meta.md`

Input classification:

`docs/oar/source_authority/oar1_source_reference_classification_pass_v1.meta.md`

No DB mutation was performed.

No migration SQL was created.

No source references were inserted.

No source reference was declared Codex-seated.

No seeded reference registry was collapsed into Codex authority.

## CURRENT STRUCTURE OBSERVATION

Existing source-adjacent persistence observed:

- `public.c3_oar_process_instance`
- `public.c3_oar_transition_event`
- `public.c3_oar_seeded_reference`

Current `public.c3_oar_seeded_reference` is not sufficient as the primary source-reference authority container because it tracks seeded OAR, infrastructure, role, process, and validation references only.

It does not preserve:

- append-only source body versions
- source content hashes
- Codex seating lifecycle movement
- bounded governance scope
- source lineage and supersession
- distinction between runtime-used and Codex-seated references

## SCHEMA DESIGN PRINCIPLES

The future Codex source-reference schema must preserve these states as distinct:

- document exists
- document committed
- document seeded
- document runtime-used
- document Codex-seated

No table may infer Codex authority from markdown existence, git state, seeded state, runtime use, or active-reference status.

Codex seating requires an explicit state transition to `codex_seated` recorded in the source-reference state log after verification.

## ENUM CONTRACTS

Future migration should define constrained values equivalent to these sets.

### source_family

- semantic_concordance
- source_set
- process_rule
- role_contract
- implementation_manifest
- verification_checklist
- runtime_validation
- oar_lifecycle
- migration_architecture
- encounter_contract
- frontend_contract
- seed_constraints
- system_intelligence

### authority_scope

- semantic
- process
- runtime
- frontend
- encounter
- migration
- role
- verification
- media
- infrastructure

### governance_function

- defines_language
- defines_process
- defines_runtime_contract
- defines_role_boundary
- defines_manifest
- defines_validation
- defines_migration
- defines_release_or_access
- defines_media_authority
- records_execution

### lifecycle_state

- draft
- validated
- written
- committed
- seeded
- active_reference
- codex_candidate
- codex_seated
- deprecated
- superseded

### verification_state

- unverified
- pending
- passed
- failed
- superseded
- blocked

### relation_type

- aligns_to
- depends_on
- supersedes
- superseded_by
- duplicates
- conflicts_with
- derived_from
- supports_runtime
- supports_process

## TABLE CONTRACTS

### codex_source_reference

Purpose:

Stable reference identity.

Required fields:

- `reference_key`: stable text primary key
- `title`: human-readable title
- `source_family`: constrained source-family value
- `authority_scope`: constrained authority-scope value
- `governance_function`: constrained governance-function value
- `current_state`: constrained lifecycle-state value
- `is_active`: boolean active indicator
- `created_at`: creation timestamp
- `created_by`: actor or operator key

Required behavior:

- `reference_key` is stable and not version-specific.
- `current_state` mirrors the latest accepted state log entry.
- `current_state = codex_seated` may only be reached through an explicit state record.
- `is_active = true` does not imply Codex-seated authority.

Recommended constraints:

- primary key on `reference_key`
- check constraints or enum types for `source_family`, `authority_scope`, `governance_function`, and `current_state`
- `created_at` defaults to current timestamp
- `is_active` defaults to false

### codex_source_reference_version

Purpose:

Append-only version evidence for source bodies.

Required fields:

- `reference_key`: foreign key to `codex_source_reference.reference_key`
- `version`: source version label
- `source_location`: repository, storage, or authority-path reference
- `content_hash`: immutable body hash
- `status`: constrained lifecycle-state or version-status value
- `effective_from`: nullable timestamp
- `effective_to`: nullable timestamp
- `verification_state`: constrained verification-state value
- `created_at`: creation timestamp

Required behavior:

- new version appends a row
- old version row is not mutated to rewrite history
- `effective_to` may close active use but must not change source content
- `content_hash` is required before `verification_state = passed`

Recommended constraints:

- primary key on (`reference_key`, `version`)
- unique key on (`reference_key`, `content_hash`)
- foreign key to `codex_source_reference`
- `effective_to` must be null or greater than `effective_from`

### codex_source_reference_scope

Purpose:

Bound what a reference may govern.

Required fields:

- `reference_key`: foreign key to `codex_source_reference.reference_key`
- `scope_type`: constrained authority-scope value
- `scope_target`: concrete target such as table, route, renderer, process, OAR family, or document family
- `allowed_governance`: constrained governance-function value
- `runtime_binding_allowed`: boolean
- `db_binding_allowed`: boolean
- `notes`: nullable text

Required behavior:

- runtime binding and DB binding are explicit.
- scope rows do not create authority without `codex_seated` state.
- a reference may have multiple bounded scopes.

Recommended constraints:

- primary key on (`reference_key`, `scope_type`, `scope_target`, `allowed_governance`)
- foreign key to `codex_source_reference`
- check constraints or enum types for `scope_type` and `allowed_governance`

### codex_source_reference_state

Purpose:

Append-only lifecycle movement log.

Required fields:

- `state_event_key`: stable event primary key
- `reference_key`: foreign key to `codex_source_reference.reference_key`
- `from_state`: nullable constrained lifecycle-state value
- `to_state`: constrained lifecycle-state value
- `state_reason`: text reason for movement
- `oar_key`: OAR source key or path authorizing the transition
- `verified_by`: actor, operator, or validation role
- `created_at`: creation timestamp

Required behavior:

- every state movement appends a row
- `to_state = codex_seated` requires verification evidence
- seeded, active_reference, and runtime-used status must not auto-promote to `codex_seated`

Recommended constraints:

- primary key on `state_event_key`
- foreign key to `codex_source_reference`
- check constraints or enum types for `from_state` and `to_state`
- non-null `oar_key` for `to_state` values `seeded`, `active_reference`, `codex_candidate`, `codex_seated`, `deprecated`, and `superseded`

### codex_source_reference_lineage

Purpose:

Resolve supersession, derivation, conflict, and dependency ambiguity.

Required fields:

- `lineage_event_key`: stable event primary key
- `reference_key`: foreign key to `codex_source_reference.reference_key`
- `related_reference_key`: related reference key
- `relation_type`: constrained relation-type value
- `relation_reason`: text reason
- `oar_key`: OAR source key or path
- `created_at`: creation timestamp

Required behavior:

- lineage is explicit and append-only
- supersession does not delete or rewrite older references
- conflicting references remain visible until resolved

Recommended constraints:

- primary key on `lineage_event_key`
- foreign key from `reference_key` to `codex_source_reference`
- nullable or deferred foreign key for `related_reference_key` if related reference has not yet been seated as identity
- check constraint or enum type for `relation_type`

### codex_source_reference_relation

Purpose:

Map source references to runtime, DB, process, and OAR dependency surfaces without granting authority.

Required fields:

- `relation_event_key`: stable event primary key
- `reference_key`: foreign key to `codex_source_reference.reference_key`
- `relation_surface`: constrained value such as db_table, db_view, runtime_module, route, renderer, oar_family, process, media_provider, notification_provider
- `relation_target`: concrete target identifier
- `relation_type`: constrained relation-type value
- `binding_state`: constrained lifecycle-state value or binding-state value
- `evidence_reference`: file path, DB object, OAR path, or validation reference
- `created_at`: creation timestamp

Required behavior:

- runtime-used remains a relation, not authority.
- DB-used remains a relation, not authority.
- relation rows support later validation queries against Codex-seated references only.

Recommended constraints:

- primary key on `relation_event_key`
- foreign key to `codex_source_reference`
- indexed key on (`relation_surface`, `relation_target`)
- check constraints or enum types for `relation_surface`, `relation_type`, and `binding_state`

## MINIMUM AUTHORITY QUERY MODEL

Later runtime validation should only treat a source reference as authority when all of these are true:

- `codex_source_reference.current_state = codex_seated`
- latest relevant `codex_source_reference_version.verification_state = passed`
- at least one bounded `codex_source_reference_scope` permits the target governance
- no active lineage row marks the reference `superseded_by` or `conflicts_with` without resolution
- the runtime or DB binding target appears in `codex_source_reference_relation`

If any condition fails, the reference may be visible, classified, candidate, seeded, or runtime-used, but not Codex authority.

## RUNTIME VALIDATION PREPARATION

The schema supports later checks for:

- renderer contracts
- encounter contracts
- release and access rules
- transition rules
- phase map behavior
- OAR lineage
- media authority
- notification integration
- process log runtime

Future validation should compare runtime surfaces against references where `current_state = codex_seated` and scope permits the target.

## MIGRATION BOUNDARY

This OAR1 is architecture only.

Future migration must be separate and include:

- OAR2 migration proposal
- SQL review
- operator confirmation
- DB preflight
- execution
- OAR1 closeout
- git commit

No SQL is authorized by this schema pass.

## VALIDATION

Validation checks completed:

- Codex source-reference authority schema is defined.
- `c3_oar_seeded_reference` remains distinct from future Codex authority tables.
- document exists, committed, seeded, runtime-used, and Codex-seated states remain distinct.
- append-only versioning is specified.
- append-only state movement is specified.
- lineage and runtime relation ambiguity are preserved for review.
- no DB mutation occurred.
- no source insertion occurred.
- no Codex seating was declared.

## EXPECTED NEXT OAR

OAR2 - Source Reference Schema Migration Proposal v1

## CLOSE

Inventory made references visible.

Classification made function and risk reviewable.

This schema pass defines the authority container.

Codex seating still comes later.

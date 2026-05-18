---
document_type: oar1
authority_level: working
document_scope: source_reference_precedence_classification
title: OAR1 - Source Reference Precedence Expansion and Classification v1
status: completed_review
version: v1
operator: op044
system: source_reference
source_oar2: docs/oar/source_reference/oar2_source_reference_precedence_expansion_classification_v1.meta.md
draft_sql: docs/schema/source_reference/source_reference_precedence_classification_v1.sql
execution_standing: deferred_no_sql_execution_authorization
final_route: classification_sql_drafted_execution_deferred
tags:
  - oar1
  - source-reference
  - precedence
  - classification
  - traversal
---

# OAR1 - Source Reference Precedence Expansion and Classification v1

## Execution Result

Executed precedence classification review from:

`docs/oar/source_reference/oar2_source_reference_precedence_expansion_classification_v1.meta.md`

Created draft SQL:

`docs/schema/source_reference/source_reference_precedence_classification_v1.sql`

No SQL was executed.

No DB mutation was performed.

No source record was mutated.

No access policy was created.

No frontend or runtime exposure was created.

No operative binding was activated.

## SQL Need

SQL is required because the classification gap lives in:

`public.v_codex_source_seeded_precedence`

The drafted SQL replaces only that view definition.

Execution remains deferred until a separate OAR2 authorizes view replacement.

## Classification Decision

Confirmed expanded precedence ranking:

| source class | rank | label |
|---|---:|---|
| `concordance` with system authority | 1 | System authority concordance |
| `foundational_source` | 2 | Foundational source |
| `process_constraints` | 3 | Process constraints |
| `seeded_reference_control` / `oar_lifecycle` | 4 | Seeded lifecycle and source-control rules |
| completed `oar1_*` records | 5 | Completed OAR1 records |
| working `oar2_*` records and other `oar` records | 6 | Working OAR records |
| `process_rule` | 7 | Process rules |
| `implementation_manifest` | 8 | Implementation manifests |
| `role_contract` | 9 | Role contracts |
| `verification_checklist` | 10 | Verification checklists |
| other seeded sources | 90 | Unranked seeded source |
| `schema_draft` / `migration_candidate` | 99 | Schema drafts and migration candidates |

## Special Handling Confirmed

`role_contract` is ranked below `implementation_manifest`, so it does not outrank the source or manifest it serves.

`verification_checklist` is ranked below `role_contract`, so it verifies but does not override the source being verified.

`implementation_manifest` remains below process rules and constraints, so it guides execution but does not override seeded source authority.

`process_constraints` outranks ordinary `process_rule` where it governs the process family.

## Affected Source Classes

Reviewed affected classes:

- `role_contract`
- `verification_checklist`
- `implementation_manifest`
- `process_constraints`
- `process_rule`
- `oar`

The draft resolves the v2 rank-90 gap for:

- `chazz_cody_development_role_contract`
- `session_13_db_preflight_verification_checklist`

## Validation Standing

Validation is review-only in this OAR1.

The prior contradiction candidate count was `0`.

No new DB state was created by this OAR, so contradiction count was not changed.

Full runtime validation must occur after a separate execution OAR applies the draft SQL.

## Validation

This OAR2 resolves successfully:

- affected source classes were reviewed
- precedence ranks were confirmed
- SQL need was confirmed
- SQL was drafted
- SQL execution was deferred
- no access exposure occurred
- no seeded record mutation occurred

## Expected Next OAR

OAR2 - Source Reference Precedence Classification View Execution v1

## Close

Classification has a draft resolution.

Runtime-read movement remains blocked until the classification view update is separately authorized and validated.

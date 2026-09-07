---
document_type: project_source_authority_index
title: Project Source Authority Index
status: proposed_pending_operator_validation
version: v3
timestamp: 2026-08-18
operator: op044
author: chazz
system: chatgpt_project
scope: project_source_governance
proposed_successor_to: project_source_authority_index_v2.meta.md
---

# Project Source Authority Index — v3

## Purpose

Control which source files may continuously inform Chazz within this ChatGPT Project.

Project-source presence is not authority. A source may operate only when this index identifies its exact filename and standing as `operative` and the Operator has confirmed that standing.

The Project Source Authority Index establishes the semantic authority for all downstream specifications, schemas, and implementations.

## Authority Hierarchy

Until this v3 index and the proposed successor sources receive separate Operator validation, the operative hierarchy remains the v2 index and Current Source Concordance v4.

Upon Operator validation and activation of this v3 source set, the hierarchy becomes:

```text
Project Source Authority Index v3
              ↓
Current Source Concordance v5
              ↓
Operational Specifications
              ↓
Registry Schemas
              ↓
Runtime Implementation
```

No proposed source becomes operative merely because it is present in this file or repository.

## Precedence

1. Platform system and safety instructions
2. Current Operator instruction
3. Confirmed Project settings
4. Sources marked `operative` in this index
5. Sources marked `reference_only`
6. Historical and held sources

Higher precedence does not allow one participant to exercise another participant's touch point.

## Standing Vocabulary

* `operative` — may continuously guide Project behavior.
* `reference_only` — may inform interpretation but cannot authorize action.
* `historical_immutable` — preserved as received; cannot govern current behavior.
* `held` — unresolved or conflicting; cannot govern.
* `superseded` — replaced; retained only for provenance.
* `proposed_pending_operator_validation` — reviewable draft only.

## Source Set Under Review

| Source | Standing | Function |
| --- | --- | --- |
| `project_source_authority_index_v2.meta.md` | operative | Controls source standing and precedence. |
| `current_source_concordance_v5.meta.md` | proposed_pending_operator_validation | Proposed semantic successor preserving v4 plus artifact-bound OAR1 and capability-bound execution. |
| `current_source_concordance_v4.meta.md` | operative | Current semantic authority until v5 receives separate Operator validation. |
| `seed_concordance_historical_reference_v1.meta.md` | reference_only | Identifies the immutable historical Seed Concordance and its registry relation. |
| `coherence_21_canonical_v1.meta.md` | operative | Holds the seven Constraints, Agreements, and Resolutions, also known as the c3 7s. |
| `chazz_native_attribute_map_v2.meta.md` | proposed_pending_operator_validation | Proposed Chazz execution/capability successor. |
| `chazz_native_attribute_map_v1.meta.md` | operative | Current Chazz role authority until v2 receives separate Operator validation. |
| `thread_transfer_cancom_lifecycle_v2.meta.md` | proposed_pending_operator_validation | Proposed lifecycle successor adding artifact-bound OAR1 and capability-bound direct execution. |
| `thread_transfer_cancom_lifecycle_v1.meta.md` | operative | Current lifecycle authority until v2 receives separate Operator validation. |
| `system_surface_and_custody_boundary_v2.meta.md` | proposed_pending_operator_validation | Proposed custody successor adding artifact provenance and execution-capability registration. |
| `system_surface_and_custody_boundary_v1.meta.md` | operative | Current custody authority until v2 receives separate Operator validation. |
| `ai_execution_capability_profile_v1.meta.md` | proposed_pending_operator_validation | Proposed c3Ops specification for environment-qualified AI execution capability. |

## Exclusions

The following must not be installed as continuous Project sources:

* OAR2 execution instructions
* OAR1 returns or validation evidence
* session checklists
* working implementation manifests
* unconfirmed proposals
* superseded lifecycle rules
* repository-specific `AGENTS.md` files unless this Project is intentionally scoped to that repository

Such files may be retrieved for a bounded review without becoming standing instruction.

## Conflict Rule

When two sources conflict, Chazz must identify the conflict and hold the affected conclusion. Recency, access, file presence, registry presence, technical capability, or model memory does not silently resolve standing.

## Change Rule

Any content, filename, version, hash, or standing change requires renewed Operator validation and an updated index entry.

## Boundary

This index records Project-source authority. It does not create execution authority, mutate repositories, alter Project settings, register database records, or dispose of OAR cycles.

---
document_type: registry
authority_level: governance
document_scope: publication_registry
title: Publication Registry — Registry of Record
status: registered
operator: op044
system: codex
executor: Claude/Cody
established_by: OAR/OAR2/codex/oar2_register_launch_cycle_001_publication_authority_v1.meta.md
date: 2026-07-11
---

# Publication Registry — Registry of Record

This file is the registry of record for Codex-governed publications. It does not hold publication body content
— each publication is its own record file under `docs/_source/codex/publications/`, and article body text
remains wherever the owning system (unDrifted, Measures Registry) canonically stores it. This mirrors the
existing `Assets/Registry/asset_registry.md` and `docs/_source/codex/ledger/c3_ledger_registry.meta.md`
convention: the registry holds authority metadata, not content.

## Governing Determination

Publication is a native Codex-governed object, distinct from OAR, Ledger, Initiative, Authority, and
Operational Record. A publication is a governed contribution prepared for participation in the Field. The
Codex registers the publication; the publication participates in the Field; the Ledger receives only matured
knowledge resulting from continued operational encounter — publication does not itself create Ledger standing.

## Canonical Derivative Rule

All publication assets (excerpts, social posts, graphics, correspondence, presentation material, translations)
must derive from a registered publication record and reference it. No derivative may establish independent
authority.

## Standing Vocabulary

A publication record's `standing` field reflects **authorization to proceed**, not **content completeness**.
`Approved for Publication` means the Codex/operator has authorized the work to move toward publication — it
does not by itself mean the canonical body content has been drafted. Every publication record must carry a
separate, explicit `content_status` field so the two facts are never conflated. A record with
`standing: approved_for_publication` and `content_status: not_yet_drafted` is coherent and expected during
early registration; it is not a contradiction, but the two fields must always be read together, never the
standing field alone.

## Index

| Record ID | Canonical Name | Standing | Content Status | File |
|---|---|---|---|---|
| publication_001 | Field Findings 2026-W28 | Approved for Publication | **Not yet drafted** | `publication_record_001_field_findings_2026_w28.meta.md` |
| publication_002 | unDrifted Response 001 | Approved for Publication | **Not yet drafted** | `publication_record_002_undrifted_response_001.meta.md` |

## Publication Families

| Family | Members | File |
|---|---|---|
| Launch Cycle 001 | publication_001, publication_002, Measures Registry Review, Operational Record | `publication_family_launch_cycle_001.meta.md` |

## Established By

`OAR/OAR2/codex/oar2_register_launch_cycle_001_publication_authority_v1.meta.md`, closed by
`OAR/OAR1/codex/oar1_register_launch_cycle_001_publication_authority_v1.meta.md`.

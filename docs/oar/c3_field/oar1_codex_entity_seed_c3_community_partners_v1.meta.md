---
document_type: oar1
title: OAR1 Codex Entity Seed — c3 Community Partners DAO, LLC
version: v1
status: executed
system: c3_field
operator: op044
source_oar2: docs/oar/c3_field/oar2_codex_entity_seed_c3_community_partners_v1.meta.md
---

OAR1: oar1_codex_entity_seed_c3_community_partners_v1

## Objective
Seat c3 Community Partners DAO, LLC as the Codex-resolvable operating entity for Measures Registry.

## Actions
- Created `codex_entity` if absent.
- Created `codex_entity_artifact` if absent.
- Created `codex_entity_relationship` if absent.
- Seated entity:
  - `entity_key: c3_community_partners_dao`
  - `entity_name: C3 Community Partners DAO, LLC`
  - `entity_type: nonprofit_limited_liability_company`
  - `jurisdiction: Tennessee`
  - `formation_locale: Tennessee`
  - `legal_status: active`
  - `control_number: 002005092`
  - `designation: decentralized_organization`
  - `management_type: member_managed`
  - `operating_role: operating_entity_for_measures_registry`
- Attached four operator-provided artifacts to the entity.
- Seated relationship:
  - `c3_community_partners_dao -> operates -> measures_registry`

## Artifacts
- `tn_annual_report_2026`
- `tn_dao_statute_ha0748`
- `tn_dao_law_reference`
- `measures_registry_whitepaper`

## Constraints Held
- No About page mutation.
- No frontend content changes.
- No legal interpretation beyond provided artifacts.
- Measures Registry remains product/runtime, not a separate legal entity.
- No payment logic.
- No SRC logic.
- No c3 key logic.
- No private address exposed in public UI.

## Validation
```json
{
  "dbConnection": "active",
  "codexEntityExists": true,
  "entityKey": "c3_community_partners_dao",
  "legalStatus": "active",
  "controlNumber": "002005092",
  "designation": "decentralized_organization",
  "operatingRole": "operating_entity_for_measures_registry",
  "artifactsAttached": 4,
  "artifactKeys": [
    "measures_registry_whitepaper",
    "tn_annual_report_2026",
    "tn_dao_law_reference",
    "tn_dao_statute_ha0748"
  ],
  "relationshipExists": true,
  "relationship": {
    "relationship_type": "operates",
    "target_key": "measures_registry",
    "target_type": "system_runtime"
  },
  "aboutPageUnchanged": true,
  "noPaymentSrcC3Key": true
}
```

## Files
- docs/oar/c3_field/oar2_codex_entity_seed_c3_community_partners_v1.meta.md
- docs/oar/c3_field/oar1_codex_entity_seed_c3_community_partners_v1.meta.md
- docs/oar/c3_field/execute-codex-entity-seed-c3-community-partners.cjs

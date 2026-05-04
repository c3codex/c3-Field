---
document_type: oar2
title: OAR2 Codex Entity Seed — c3 Community Partners DAO, LLC
version: v1
status: ready_for_cody
system: c3_field
operator: op044
---

OAR2: codex_entity_seed_c3_community_partners_v1

OBSERVED
Measures Registry About requires a resolvable operating entity reference.

Uploaded artifacts confirm:
- Entity Name: C3 COMMUNITY PARTNERS DAO LLC
- SOS Control #: 002005092
- Entity Type: Nonprofit Limited Liability Company
- Formation Locale: Tennessee
- Status: Active
- Additional Designation: Decentralized Organization
- Managed By: Member Managed
- Annual Report next due: 04/01/2027

Source artifact:
tn_license2026.pdf

Tennessee DAO law artifacts are present:
- HA0748.pdf
- tn_law_dao.pdf

Measures Registry whitepaper is present and establishes system relationship:
- Measures Registry as integrity governance for AI-accelerated systems
- registry-driven architecture
- behavior must be registered to be governed

ALIGNED
- Codex is authority.
- Entity must be seated before About references it.
- Artifacts must attach to entity, not float.
- Measures Registry remains product/runtime, not separate legal entity.
- c3 Community Partners DAO, LLC is operating entity.
- No payment logic.
- No SRC.
- No c3_key.
- No frontend-authored truth.
- No legal claims beyond provided artifacts.

ROUTED

1. Create Codex entity table if absent

Table:
codex_entity

Required fields:
- id
- entity_key
- entity_name
- entity_type
- jurisdiction
- formation_locale
- legal_status
- control_number
- designation
- management_type
- operating_role
- metadata
- created_at
- updated_at

2. Seat entity record

entity_key:
c3_community_partners_dao

entity_name:
C3 Community Partners DAO, LLC

entity_type:
nonprofit_limited_liability_company

jurisdiction:
Tennessee

formation_locale:
Tennessee

legal_status:
active

control_number:
002005092

designation:
decentralized_organization

management_type:
member_managed

operating_role:
operating_entity_for_measures_registry

metadata:
{
  "source": "codex_entity_seed_c3_community_partners_v1",
  "annual_report_next_due": "2027-04-01",
  "business_county": "Wilson",
  "naics": [
    "813410",
    "813319",
    "541720"
  ],
  "public_contact": "connect@c3communitypartners.xyz",
  "measures_registry_contact": "connect@measuresregistry.com"
}

3. Create artifact table if absent

Table:
codex_entity_artifact

Required fields:
- id
- entity_id
- artifact_key
- artifact_title
- artifact_type
- file_name
- storage_path
- source_status
- metadata
- created_at

4. Attach artifacts

A. Tennessee filing acknowledgment / annual report

artifact_key:
tn_annual_report_2026

artifact_title:
Tennessee Annual Report Filing Acknowledgment 2026

artifact_type:
state_filing

file_name:
tn_license2026.pdf

source_status:
operator_uploaded

B. Tennessee DAO statute amendment

artifact_key:
tn_dao_statute_ha0748

artifact_title:
Tennessee DAO Law Amendment HA0748

artifact_type:
legal_framework

file_name:
HA0748.pdf

source_status:
operator_uploaded

C. Tennessee DAO law reference

artifact_key:
tn_dao_law_reference

artifact_title:
Tennessee DAO Law Reference

artifact_type:
legal_framework

file_name:
tn_law_dao.pdf

source_status:
operator_uploaded

D. Measures Registry whitepaper

artifact_key:
measures_registry_whitepaper

artifact_title:
Measures Registry Full Whitepaper

artifact_type:
system_whitepaper

file_name:
Measures_Registry_Full_Whitepaper.pdf

source_status:
operator_uploaded

5. Create entity relationship table if absent

Table:
codex_entity_relationship

Required fields:
- id
- source_entity_id
- relationship_type
- target_key
- target_type
- metadata
- created_at

6. Seat relationship

source:
c3_community_partners_dao

relationship_type:
operates

target_key:
measures_registry

target_type:
system_runtime

metadata:
{
  "source": "codex_entity_seed_c3_community_partners_v1",
  "relationship_statement": "Measures Registry is developed and operated by c3 Community Partners DAO, LLC."
}

7. About page dependency

Do not update About page in this OAR.

After this OAR executes, About page may reference:

codex_entity.c3_community_partners_dao

8. Constraints

- no legal interpretation beyond artifacts
- no payment logic
- no SRC logic
- no c3_key logic
- no frontend content changes
- no About page mutation in this OAR
- no artifact treated as authority without entity attachment

CODY ROLE

Cody may:
- create codex entity tables if absent
- seat entity record
- attach uploaded artifacts as records
- create relationship record
- write OAR1

Cody may NOT:
- modify About page
- infer unprovided legal claims
- expose private addresses in public UI
- create payment/SRC/c3_key logic
- treat Measures Registry as separate legal entity
- invent artifacts

VALIDATION

- codex_entity exists
- c3_community_partners_dao entity exists
- legal_status = active
- control_number = 002005092
- designation = decentralized_organization
- operating_role = operating_entity_for_measures_registry
- four artifacts attached
- relationship exists:
  c3_community_partners_dao -> operates -> measures_registry
- About page unchanged
- build passes if code touched

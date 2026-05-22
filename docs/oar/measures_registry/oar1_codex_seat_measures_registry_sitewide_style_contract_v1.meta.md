---
document_type: oar1
authority_level: working
document_scope: measures_registry_sitewide_contract
title: OAR1 — Codex Seat Measures Registry Sitewide Style Contract
status: closed
version: v1
operator: op044
system: measures_registry
source_oar2: docs/oar/measures_registry/oar2_codex_seat_measures_registry_sitewide_style_contract_v1.meta.md
executor: claude_vs
tags:
  - oar1
  - measures-registry
  - codex
  - sitewide-runtime-contract
  - style-contract
  - implementation-governance
  - codex-first
---

# OAR1 — Codex Seat Measures Registry Sitewide Style Contract

## OBJECTIVE

Execute for:

`docs/oar/measures_registry/oar2_codex_seat_measures_registry_sitewide_style_contract_v1.meta.md`

Seat the Measures Registry sitewide runtime/style contract as retrievable Codex governing authority in the `concordance_document` authority surface. No file-level marking substitutes for DB seating. Validation required.

---

## CODEX AUTHORITY SURFACE IDENTIFIED

**Table:** `concordance_document` (with associated `concordance_version`, `concordance_relation`, `seeded_source_snapshot`)

**Basis:** `concordance_document` is the established c3field system authority surface. Reused without invention. Prior precedent: `concordance_authority_seating_system_intelligence` and `measures_registry_runtime_audit_intelligence` seated in same table. New `document_scope: "sitewide_style_contract"` and `document_type: "style_contract"` distinguish contract seating from intelligence seating without creating a new table.

**Prerequisites verified:** `seed_concordance_v1` present in `concordance_version` — Seed Concordance v1 is seated. DB connection confirmed before seating.

---

## EXECUTE PACKAGE

| File | Role |
|---|---|
| `docs/oar/measures_registry/execute-measures-registry-sitewide-style-contract-seating-v1.cjs` | Execute script — source hash validation, DB connection probe, seating, validation SQL, readback |
| `docs/oar/measures_registry/measures_registry_sitewide_style_contract_seating_v1.sql` | Seating SQL — concordance_document, concordance_version, 11 concordance_relation inserts, seeded_source_snapshot |
| `docs/oar/measures_registry/measures_registry_sitewide_style_contract_validation_v1.sql` | Validation SQL — count queries across all 4 tables |

**Source hash verified before seating:**

| Field | Value |
|---|---|
| Source path | `docs/oar/measures_registry/oar2_codex_seat_measures_registry_sitewide_style_contract_v1.meta.md` |
| SHA-256 | `78d1a5383c98cc77098d74dc4ec35a8084bfc5efd33cce5b78bb2053c6a3b644` |
| Byte size | `4744` |

---

## INSERTED ROW IDENTIFIERS

| Table | Key | Status |
|---|---|---|
| `concordance_document` | `measures_registry_sitewide_style_contract` | inserted |
| `concordance_version` | `measures_registry_sitewide_style_contract_v1` | inserted |
| `concordance_relation` | `mrssc_v1_intelligence_binding` | inserted |
| `concordance_relation` | `mrssc_v1_typography_contract` | inserted |
| `concordance_relation` | `mrssc_v1_color_material_contract` | inserted |
| `concordance_relation` | `mrssc_v1_button_icon_contract` | inserted |
| `concordance_relation` | `mrssc_v1_media_behavior_contract` | inserted |
| `concordance_relation` | `mrssc_v1_marble_tone_contract` | inserted |
| `concordance_relation` | `mrssc_v1_viewport_containment_contract` | inserted |
| `concordance_relation` | `mrssc_v1_branding_contract` | inserted |
| `concordance_relation` | `mrssc_v1_footer_contract` | inserted |
| `concordance_relation` | `mrssc_v1_transition_contract` | inserted |
| `concordance_relation` | `mrssc_v1_preserved_runtime_assets` | inserted |
| `seeded_source_snapshot` | `mrssc_v1_local_source_78d1a538` | inserted |

---

## VALIDATION QUERY

```sql
select
  (select count(*) from public.concordance_document
    where document_key = 'measures_registry_sitewide_style_contract'
    and authority_standing = 'active'
    and visibility_standing = 'internal'
    and document_scope = 'sitewide_style_contract'
    and metadata->>'document_type' = 'style_contract'
    and metadata->>'status' = 'seeded'
    and metadata->>'system_key' = 'measures_registry'
  ) as document_count,
  (select count(*) from public.concordance_version
    where version_key = 'measures_registry_sitewide_style_contract_v1'
    and document_key = 'measures_registry_sitewide_style_contract'
    and version_standing = 'active'
    and visibility_standing = 'internal'
    and metadata->>'status' = 'seeded'
    and metadata->>'system_key' = 'measures_registry'
  ) as version_count,
  (select count(*) from public.concordance_relation
    where version_key = 'measures_registry_sitewide_style_contract_v1'
    and relation_standing = 'active'
    and visibility_standing = 'internal'
    and metadata->>'seating' = 'sitewide_style_contract_seating'
  ) as relation_count,
  (select count(*) from public.seeded_source_snapshot
    where snapshot_key = 'mrssc_v1_local_source_78d1a538'
    and version_key = 'measures_registry_sitewide_style_contract_v1'
    and verification_standing = 'verified'
    and source_sha256 = '78d1a5383c98cc77098d74dc4ec35a8084bfc5efd33cce5b78bb2053c6a3b644'
    and byte_size = 4744
  ) as snapshot_count;
```

---

## VALIDATED SEATED FIELDS

| Field | Seated value |
|---|---|
| `document_key` | `measures_registry_sitewide_style_contract` |
| `document_scope` | `sitewide_style_contract` |
| `authority_standing` | `active` |
| `visibility_standing` | `internal` |
| `metadata.document_type` | `style_contract` |
| `metadata.authority_level` | `system` |
| `metadata.status` | `seeded` |
| `metadata.system_key` | `measures_registry` |
| `metadata.intelligence_class` | `sitewide_governance` |
| `metadata.seating_class` | `runtime_style_contract` |
| `metadata.source_intelligence` | `measures_registry_runtime_audit_intelligence` |
| `metadata.implementation_order` | `sitewide_runtime_contract → encounter_contracts → renderer_behavior → runtime_state` |
| `version_key` | `measures_registry_sitewide_style_contract_v1` |
| `source_oar2_path` | `docs/oar/measures_registry/oar2_codex_seat_measures_registry_sitewide_style_contract_v1.meta.md` |
| `closeout_oar1_path` | `docs/oar/measures_registry/oar1_codex_seat_measures_registry_sitewide_style_contract_v1.meta.md` |
| `concordance_relation` count | 11 |
| `seeded_source_snapshot` | verified, sha256 matched, byte_size matched |

---

## READBACK CONFIRMATION

```
source_snapshot_validation: ok
rpc_package_validation: ok
db_connection: ok
phase_1_sitewide_style_contract_seating: ok
phase_2_sitewide_style_contract_validation_sql: ok
sitewide_style_contract_readback: {
  "styleContractDocuments": 1,
  "styleContractVersions": 1,
  "styleContractRelations": 11,
  "verifiedSnapshots": 1
}
```

All counts confirmed. Seated contract is retrievable.

---

## CONTRACT SEATED

### Intelligence binding (1 relation)

`measures_registry_sitewide_style_contract_v1 → measures_registry_runtime_audit_intelligence`

Upstream implementation intelligence authority bound as `source_alignment`. Contract derives from seated runtime audit intelligence.

### Contract clauses (9 relations)

| Relation key | Domain | Governs |
|---|---|---|
| `mrssc_v1_typography_contract` | Typography | heading font authority, body font authority, hierarchy scaling, desktop/mobile behavior |
| `mrssc_v1_color_material_contract` | Color & material | obsidian, lapis, crystal, marble, semantic usage boundaries, interaction states |
| `mrssc_v1_button_icon_contract` | Button & icon | primary CTA, secondary CTA, passage controls, icon rendering, hover/focus, mobile scaling |
| `mrssc_v1_media_behavior_contract` | Media behavior | autoplay rules, mute/unmute, interaction unlock, persistence boundaries, encounter-scoped media |
| `mrssc_v1_marble_tone_contract` | Marble tone | low-volume baseline, encounter-scoped playback, continuity rules, mute relationship |
| `mrssc_v1_viewport_containment_contract` | Viewport & containment | desktop/mobile containment, single-screen fit, overflow, encounter boundaries |
| `mrssc_v1_branding_contract` | Branding | registry mark usage, placement classes, opacity rules, institutional identity |
| `mrssc_v1_footer_contract` | Footer | copyright authority, visibility rules, copy authority, system linkage |
| `mrssc_v1_transition_contract` | Transition | encounter transition behavior, dissolve/fade authority, state isolation |

Audit findings bound to applicable clauses: `passageMuted_is_session_global`, `marble_tone_persists_across_surfaces_unscoped`, `copyright_hardcoded_in_jsx`, `orphaned_transition_contract_unrealized`.

### Preservation clause (1 relation)

`mrssc_v1_preserved_runtime_assets` — runtime assets declared non-invalidating:

- `MeasuresAssessmentChamber`, `MeasuresAssessmentResult`
- `sectionCopy()`, `resolveEnvironmentalReport()`
- token pipeline, media resolution, navigation/history
- obsidian material contract

---

## IMPLEMENTATION STATUS

Codex seating executed and validated. All 14 rows inserted. All readback checks passed.

No frontend changes. No renderer modifications. No audit contents altered.

---

## CLOSEOUT

The Measures Registry sitewide runtime/style contract is now Codex-seated governing authority.

`document_key: measures_registry_sitewide_style_contract` is retrievable from `concordance_document` with `document_scope: sitewide_style_contract`, `document_type: style_contract`, `system_key: measures_registry`. 11 contract clauses seated as `concordance_relation` rows. Source snapshot verified against OAR2 document hash.

Contract governs the layer beneath encounter contracts and renderer behavior. Implementation order preserved: `sitewide_runtime_contract → encounter_contracts → renderer_behavior → runtime_state`.

Seated reference is confirmed retrievable. Document existence was not treated as seating.

OAR1 ready for operator review.

---
document_type: architecture_contract
authority_level: working
document_scope: measures_interoperability
title: Measures Registry — Individual Glyph Asset Manifest v1
status: seated
version: v1
operator: op044
date: 2026-05-28
source_oar2: docs/oar/measures_interoperability/oar2_measures_registry_individual_glyph_asset_extraction_media_map_v1.meta.md
native_stack:
  codex: database
  field: schema
  measures: registry
  oar2: observed_aligned_routed
  chazz: systems
  cody: executor
  src: renderer
tags:
  - architecture-contract
  - measures-registry
  - glyph-assets
  - individual-glyphs
  - media-map
  - bucketed-assets
  - codexstone
layer: second
---

# Measures Registry — Individual Glyph Asset Manifest v1

## Manifest Purpose

This manifest defines the full set of required individual Measures Registry glyph assets — named, classified, bucket-pathed, and media-map-prepared.

The master glyph package (`measures_registry_glyph_package_v1`) remains the visual reference. Individual assets are extracted from it by the operator and uploaded to the governed bucket paths defined here.

No SVG file is produced by this manifest. Design export is an operator task.

No DB rows are inserted by this manifest. DB seating requires operator-mediated execution via a future measures_registry media seating OAR2.

No asset is active for runtime rendering until runtime OAR2.

## Global Asset Rules

- All assets are `inactive_for_runtime` until runtime OAR2.
- All assets are `authority_status: reference_only` until governed state is met.
- All assets use `storage_provider: supabase`, `bucket: measures-registry`.
- No asset may be rendered as active circuit standing without delivery contract state.
- No seal may be rendered as proof without OAR/DB/contract evidence.
- No badge activation before governed holding state.
- Brand mark identifies surfaces — it does not author authority.

---

## 1 — Material Glyphs

Asset class: `glyph` | Asset type: `material_glyph` | Usage scope: `material_function_reference`

### 1.1 Obsidian Material Glyph

| Field | Value |
|---|---|
| media_key | `measures_registry_glyph_material_obsidian_v1` |
| asset_class | `glyph` |
| asset_type | `material_glyph` |
| file_name | `measures_registry_glyph_material_obsidian_v1.svg` |
| storage_provider | `supabase` |
| bucket | `measures-registry` |
| storage_path | `glyphs/material/measures_registry_glyph_material_obsidian_v1.svg` |
| usage_scope | `material_function_reference` |
| material_place | `obsidian_assessment_gate` |
| material_function | assessment / drift exposure / reduction |
| activation_status | `inactive_for_runtime` |
| authority_status | `reference_only` |
| runtime_status | `not_rendered_until_runtime_oar2` |
| proof_required | `media_map_validation` |
| design_status | `pending_operator_export` |
| db_status | `prepared_not_inserted` |

---

### 1.2 Crystal Material Glyph

| Field | Value |
|---|---|
| media_key | `measures_registry_glyph_material_crystal_v1` |
| asset_class | `glyph` |
| asset_type | `material_glyph` |
| file_name | `measures_registry_glyph_material_crystal_v1.svg` |
| storage_provider | `supabase` |
| bucket | `measures-registry` |
| storage_path | `glyphs/material/measures_registry_glyph_material_crystal_v1.svg` |
| usage_scope | `material_function_reference` |
| material_place | `crystal_lapis_c3_map` |
| material_function | recognition / pattern visibility |
| activation_status | `inactive_for_runtime` |
| authority_status | `reference_only` |
| runtime_status | `not_rendered_until_runtime_oar2` |
| proof_required | `media_map_validation` |
| design_status | `pending_operator_export` |
| db_status | `prepared_not_inserted` |

---

### 1.3 Lapis Material Glyph

| Field | Value |
|---|---|
| media_key | `measures_registry_glyph_material_lapis_v1` |
| asset_class | `glyph` |
| asset_type | `material_glyph` |
| file_name | `measures_registry_glyph_material_lapis_v1.svg` |
| storage_provider | `supabase` |
| bucket | `measures-registry` |
| storage_path | `glyphs/material/measures_registry_glyph_material_lapis_v1.svg` |
| usage_scope | `material_function_reference` |
| material_place | `lapis_relational` |
| material_function | relation / passage / continuity |
| activation_status | `inactive_for_runtime` |
| authority_status | `reference_only` |
| runtime_status | `not_rendered_until_runtime_oar2` |
| proof_required | `media_map_validation` |
| design_status | `pending_operator_export` |
| db_status | `prepared_not_inserted` |

---

### 1.4 Marble Material Glyph

| Field | Value |
|---|---|
| media_key | `measures_registry_glyph_material_marble_v1` |
| asset_class | `glyph` |
| asset_type | `material_glyph` |
| file_name | `measures_registry_glyph_material_marble_v1.svg` |
| storage_provider | `supabase` |
| bucket | `measures-registry` |
| storage_path | `glyphs/material/measures_registry_glyph_material_marble_v1.svg` |
| usage_scope | `material_function_reference` |
| material_place | `marble_commerced_circuit` |
| material_function | governed form / contract / Commerced Circuit |
| activation_status | `inactive_for_runtime` |
| authority_status | `reference_only` |
| runtime_status | `not_rendered_until_runtime_oar2` |
| proof_required | `media_map_validation` |
| design_status | `pending_operator_export` |
| db_status | `prepared_not_inserted` |

---

## 2 — Chamber Glyphs

Asset class: `glyph` | Asset type: `chamber_glyph` | Usage scope: `chamber_surface_identifier`

### 2.1 Epigraph Chamber Glyph

| Field | Value |
|---|---|
| media_key | `measures_registry_glyph_chamber_epigraph_v1` |
| asset_class | `glyph` |
| asset_type | `chamber_glyph` |
| file_name | `measures_registry_glyph_chamber_epigraph_v1.svg` |
| storage_provider | `supabase` |
| bucket | `measures-registry` |
| storage_path | `glyphs/chamber/measures_registry_glyph_chamber_epigraph_v1.svg` |
| usage_scope | `chamber_surface_identifier` |
| material_place | `epigraph` |
| material_family | `pre_material` |
| activation_status | `inactive_for_runtime` |
| authority_status | `reference_only` |
| runtime_status | `not_rendered_until_runtime_oar2` |
| proof_required | `media_map_validation` |
| design_status | `pending_operator_export` |
| db_status | `prepared_not_inserted` |

---

### 2.2 Temple Path Chamber Glyph

| Field | Value |
|---|---|
| media_key | `measures_registry_glyph_chamber_temple_path_v1` |
| asset_class | `glyph` |
| asset_type | `chamber_glyph` |
| file_name | `measures_registry_glyph_chamber_temple_path_v1.svg` |
| storage_provider | `supabase` |
| bucket | `measures-registry` |
| storage_path | `glyphs/chamber/measures_registry_glyph_chamber_temple_path_v1.svg` |
| usage_scope | `chamber_surface_identifier` |
| material_place | `temple_path` |
| material_family | `pre_material` |
| activation_status | `inactive_for_runtime` |
| authority_status | `reference_only` |
| runtime_status | `not_rendered_until_runtime_oar2` |
| proof_required | `media_map_validation` |
| design_status | `pending_operator_export` |
| db_status | `prepared_not_inserted` |

---

### 2.3 Lapis Relational Chamber Glyph

| Field | Value |
|---|---|
| media_key | `measures_registry_glyph_chamber_lapis_relational_v1` |
| asset_class | `glyph` |
| asset_type | `chamber_glyph` |
| file_name | `measures_registry_glyph_chamber_lapis_relational_v1.svg` |
| storage_provider | `supabase` |
| bucket | `measures-registry` |
| storage_path | `glyphs/chamber/measures_registry_glyph_chamber_lapis_relational_v1.svg` |
| usage_scope | `chamber_surface_identifier` |
| material_place | `lapis_relational` |
| material_family | `lapis` |
| activation_status | `inactive_for_runtime` |
| authority_status | `reference_only` |
| runtime_status | `not_rendered_until_runtime_oar2` |
| proof_required | `media_map_validation` |
| design_status | `pending_operator_export` |
| db_status | `prepared_not_inserted` |

---

### 2.4 c3 MAP Chamber Glyph

| Field | Value |
|---|---|
| media_key | `measures_registry_glyph_chamber_c3_map_v1` |
| asset_class | `glyph` |
| asset_type | `chamber_glyph` |
| file_name | `measures_registry_glyph_chamber_c3_map_v1.svg` |
| storage_provider | `supabase` |
| bucket | `measures-registry` |
| storage_path | `glyphs/chamber/measures_registry_glyph_chamber_c3_map_v1.svg` |
| usage_scope | `chamber_surface_identifier` |
| material_place | `crystal_lapis_c3_map` |
| material_family | `crystal_lapis` |
| activation_status | `inactive_for_runtime` |
| authority_status | `reference_only` |
| runtime_status | `not_rendered_until_runtime_oar2` |
| proof_required | `media_map_validation` |
| design_status | `pending_operator_export` |
| db_status | `prepared_not_inserted` |

---

### 2.5 Obsidian Assessment Gate Chamber Glyph

| Field | Value |
|---|---|
| media_key | `measures_registry_glyph_chamber_obsidian_assessment_gate_v1` |
| asset_class | `glyph` |
| asset_type | `chamber_glyph` |
| file_name | `measures_registry_glyph_chamber_obsidian_assessment_gate_v1.svg` |
| storage_provider | `supabase` |
| bucket | `measures-registry` |
| storage_path | `glyphs/chamber/measures_registry_glyph_chamber_obsidian_assessment_gate_v1.svg` |
| usage_scope | `chamber_surface_identifier` |
| material_place | `obsidian_assessment_gate` |
| material_family | `obsidian` |
| activation_status | `inactive_for_runtime` |
| authority_status | `reference_only` |
| runtime_status | `not_rendered_until_runtime_oar2` |
| proof_required | `media_map_validation` |
| design_status | `pending_operator_export` |
| db_status | `prepared_not_inserted` |

---

### 2.6 Marble Commerced Circuit Chamber Glyph

| Field | Value |
|---|---|
| media_key | `measures_registry_glyph_chamber_marble_commerced_circuit_v1` |
| asset_class | `glyph` |
| asset_type | `chamber_glyph` |
| file_name | `measures_registry_glyph_chamber_marble_commerced_circuit_v1.svg` |
| storage_provider | `supabase` |
| bucket | `measures-registry` |
| storage_path | `glyphs/chamber/measures_registry_glyph_chamber_marble_commerced_circuit_v1.svg` |
| usage_scope | `chamber_surface_identifier` |
| material_place | `marble_commerced_circuit` |
| material_family | `marble` |
| activation_status | `inactive_for_runtime` |
| authority_status | `reference_only` |
| runtime_status | `not_rendered_until_runtime_oar2` |
| proof_required | `media_map_validation` |
| design_status | `pending_operator_export` |
| db_status | `prepared_not_inserted` |

---

### 2.7 Media Passage Chamber Glyph

| Field | Value |
|---|---|
| media_key | `measures_registry_glyph_chamber_media_passage_v1` |
| asset_class | `glyph` |
| asset_type | `chamber_glyph` |
| file_name | `measures_registry_glyph_chamber_media_passage_v1.svg` |
| storage_provider | `supabase` |
| bucket | `measures-registry` |
| storage_path | `glyphs/chamber/measures_registry_glyph_chamber_media_passage_v1.svg` |
| usage_scope | `chamber_surface_identifier` |
| material_place | `right_path_media_passage` |
| material_family | `lapis` |
| activation_status | `inactive_for_runtime` |
| authority_status | `reference_only` |
| runtime_status | `not_rendered_until_runtime_oar2` |
| proof_required | `media_map_validation` |
| design_status | `pending_operator_export` |
| db_status | `prepared_not_inserted` |

---

### 2.8 Marble Governance Chamber Glyph

| Field | Value |
|---|---|
| media_key | `measures_registry_glyph_chamber_marble_governance_v1` |
| asset_class | `glyph` |
| asset_type | `chamber_glyph` |
| file_name | `measures_registry_glyph_chamber_marble_governance_v1.svg` |
| storage_provider | `supabase` |
| bucket | `measures-registry` |
| storage_path | `glyphs/chamber/measures_registry_glyph_chamber_marble_governance_v1.svg` |
| usage_scope | `chamber_surface_identifier` |
| material_place | `marble_governance` |
| material_family | `marble_lapis` |
| activation_status | `inactive_for_runtime` |
| authority_status | `reference_only` |
| runtime_status | `not_rendered_until_runtime_oar2` |
| proof_required | `media_map_validation` |
| design_status | `pending_operator_export` |
| db_status | `prepared_not_inserted` |

---

### 2.9 Lapis Interoperability Chamber Glyph

| Field | Value |
|---|---|
| media_key | `measures_registry_glyph_chamber_lapis_interoperability_v1` |
| asset_class | `glyph` |
| asset_type | `chamber_glyph` |
| file_name | `measures_registry_glyph_chamber_lapis_interoperability_v1.svg` |
| storage_provider | `supabase` |
| bucket | `measures-registry` |
| storage_path | `glyphs/chamber/measures_registry_glyph_chamber_lapis_interoperability_v1.svg` |
| usage_scope | `chamber_surface_identifier` |
| material_place | `lapis_interoperability` |
| material_family | `lapis` |
| activation_status | `inactive_for_runtime` |
| authority_status | `reference_only` |
| runtime_status | `not_rendered_until_runtime_oar2` |
| proof_required | `media_map_validation` |
| design_status | `pending_operator_export` |
| db_status | `prepared_not_inserted` |

---

## 3 — Circuit Glyphs

Asset class: `glyph` | Asset type: `circuit_glyph`

Circuit glyphs must read as governed Commerced Circuit standings. They must not look like gamified levels, readiness rankings, or achievement badges. C1 / C2 / C3 require delivery contract state before active circuit rendering.

### 3.1 C1 Circuit Glyph

| Field | Value |
|---|---|
| media_key | `measures_registry_glyph_circuit_c1_v1` |
| asset_class | `glyph` |
| asset_type | `circuit_glyph` |
| file_name | `measures_registry_glyph_circuit_c1_v1.svg` |
| storage_provider | `supabase` |
| bucket | `measures-registry` |
| storage_path | `glyphs/circuit/measures_registry_glyph_circuit_c1_v1.svg` |
| usage_scope | `commerced_circuit_standing_reference` |
| material_place | `marble_commerced_circuit` |
| circuit | `C1` |
| activation_status | `inactive_for_runtime` |
| authority_status | `reference_only` |
| runtime_status | `not_rendered_until_runtime_oar2` |
| proof_required | `delivery_contract_state` |
| design_status | `pending_operator_export` |
| db_status | `prepared_not_inserted` |

---

### 3.2 C2 Circuit Glyph

| Field | Value |
|---|---|
| media_key | `measures_registry_glyph_circuit_c2_v1` |
| asset_class | `glyph` |
| asset_type | `circuit_glyph` |
| file_name | `measures_registry_glyph_circuit_c2_v1.svg` |
| storage_provider | `supabase` |
| bucket | `measures-registry` |
| storage_path | `glyphs/circuit/measures_registry_glyph_circuit_c2_v1.svg` |
| usage_scope | `commerced_circuit_standing_reference` |
| material_place | `marble_commerced_circuit` |
| circuit | `C2` |
| activation_status | `inactive_for_runtime` |
| authority_status | `reference_only` |
| runtime_status | `not_rendered_until_runtime_oar2` |
| proof_required | `delivery_contract_state` |
| design_status | `pending_operator_export` |
| db_status | `prepared_not_inserted` |

---

### 3.3 C3 Circuit Glyph

| Field | Value |
|---|---|
| media_key | `measures_registry_glyph_circuit_c3_v1` |
| asset_class | `glyph` |
| asset_type | `circuit_glyph` |
| file_name | `measures_registry_glyph_circuit_c3_v1.svg` |
| storage_provider | `supabase` |
| bucket | `measures-registry` |
| storage_path | `glyphs/circuit/measures_registry_glyph_circuit_c3_v1.svg` |
| usage_scope | `commerced_circuit_standing_reference` |
| material_place | `marble_commerced_circuit` |
| circuit | `C3` |
| activation_status | `inactive_for_runtime` |
| authority_status | `reference_only` |
| runtime_status | `not_rendered_until_runtime_oar2` |
| proof_required | `delivery_contract_state` |
| design_status | `pending_operator_export` |
| db_status | `prepared_not_inserted` |

---

### 3.4 3x33 Circuit Glyph

| Field | Value |
|---|---|
| media_key | `measures_registry_glyph_circuit_3x33_v1` |
| asset_class | `glyph` |
| asset_type | `circuit_glyph` |
| file_name | `measures_registry_glyph_circuit_3x33_v1.svg` |
| storage_provider | `supabase` |
| bucket | `measures-registry` |
| storage_path | `glyphs/circuit/measures_registry_glyph_circuit_3x33_v1.svg` |
| usage_scope | `distribution_structure_reference` |
| material_place | `marble_commerced_circuit` |
| circuit | `3x33 distribution framework` |
| activation_status | `inactive_for_runtime` |
| authority_status | `reference_only` |
| runtime_status | `not_rendered_until_runtime_oar2` |
| proof_required | `delivery_contract_state` |
| design_status | `pending_operator_export` |
| db_status | `prepared_not_inserted` |

---

## 4 — Registry Seals, Badges, and Brand Mark

### 4.1 Measures Registry Brand Mark

| Field | Value |
|---|---|
| media_key | `measures_registry_mark_v1` |
| asset_class | `brand_mark` |
| asset_type | `registry_brand_mark` |
| file_name | `measures_registry_mark_v1.svg` |
| storage_provider | `supabase` |
| bucket | `measures-registry` |
| storage_path | `glyphs/seals/measures_registry_mark_v1.svg` |
| usage_scope | `surface_identity_marker` |
| material_place | `all_surfaces` |
| activation_status | `inactive_for_runtime` |
| authority_status | `surface_identification_only` |
| runtime_status | `not_rendered_until_css_implementation_oar2` |
| proof_required | `none — identifies surface, does not author authority` |
| design_status | `pending_operator_export` |
| db_status | `prepared_not_inserted` |

**Rule:** Brand mark identifies the surface. It is not a verification seal. It does not author authority.

---

### 4.2 Verified Assessment Seal

| Field | Value |
|---|---|
| media_key | `measures_registry_seal_verified_assessment_v1` |
| asset_class | `seal` |
| asset_type | `verified_assessment_seal` |
| file_name | `measures_registry_seal_verified_assessment_v1.svg` |
| storage_provider | `supabase` |
| bucket | `measures-registry` |
| storage_path | `glyphs/seals/measures_registry_seal_verified_assessment_v1.svg` |
| usage_scope | `assessment_proof_display` |
| material_place | `marble_commerced_circuit` |
| activation_status | `inactive_for_runtime` |
| authority_status | `reference_only` |
| runtime_status | `not_rendered_until_proof_oar2` |
| proof_required | `assessment_completion_proof` |
| design_status | `pending_operator_export` |
| db_status | `prepared_not_inserted` |

**Rule:** Seal requires proof before active rendering. Assessment completion state must be confirmed via OAR/DB/contract evidence before this seal may render.

---

### 4.3 Delivery Contract Seal

| Field | Value |
|---|---|
| media_key | `measures_registry_seal_delivery_contract_v1` |
| asset_class | `seal` |
| asset_type | `delivery_contract_seal` |
| file_name | `measures_registry_seal_delivery_contract_v1.svg` |
| storage_provider | `supabase` |
| bucket | `measures-registry` |
| storage_path | `glyphs/seals/measures_registry_seal_delivery_contract_v1.svg` |
| usage_scope | `delivery_contract_display` |
| material_place | `marble_commerced_circuit` |
| activation_status | `inactive_for_runtime` |
| authority_status | `reference_only` |
| runtime_status | `not_rendered_until_delivery_contract_oar2` |
| proof_required | `delivery_contract_state` |
| design_status | `pending_operator_export` |
| db_status | `prepared_not_inserted` |

**Rule:** Delivery contract seal requires delivery contract state before active rendering.

---

### 4.4 Held Placeholder Badge

| Field | Value |
|---|---|
| media_key | `measures_registry_badge_held_placeholder_v1` |
| asset_class | `badge` |
| asset_type | `held_placeholder_badge` |
| file_name | `measures_registry_badge_held_placeholder_v1.svg` |
| storage_provider | `supabase` |
| bucket | `measures-registry` |
| storage_path | `glyphs/seals/measures_registry_badge_held_placeholder_v1.svg` |
| usage_scope | `inactive_held_standing_display` |
| material_place | `marble_commerced_circuit` |
| activation_status | `inactive_for_runtime` |
| authority_status | `held_state_marker_only` |
| runtime_status | `not_rendered_until_runtime_oar2` |
| proof_required | `none — marks inactive/held state only` |
| design_status | `pending_operator_export` |
| db_status | `prepared_not_inserted` |

**Rule:** Held placeholder marks inactive or held standing only. It does not imply activation or claim.

---

## 5 — Complete Asset Index

| # | media_key | asset_class | asset_type | bucket_path |
|---|---|---|---|---|
| 1 | `measures_registry_glyph_material_obsidian_v1` | glyph | material_glyph | `glyphs/material/` |
| 2 | `measures_registry_glyph_material_crystal_v1` | glyph | material_glyph | `glyphs/material/` |
| 3 | `measures_registry_glyph_material_lapis_v1` | glyph | material_glyph | `glyphs/material/` |
| 4 | `measures_registry_glyph_material_marble_v1` | glyph | material_glyph | `glyphs/material/` |
| 5 | `measures_registry_glyph_chamber_epigraph_v1` | glyph | chamber_glyph | `glyphs/chamber/` |
| 6 | `measures_registry_glyph_chamber_temple_path_v1` | glyph | chamber_glyph | `glyphs/chamber/` |
| 7 | `measures_registry_glyph_chamber_lapis_relational_v1` | glyph | chamber_glyph | `glyphs/chamber/` |
| 8 | `measures_registry_glyph_chamber_c3_map_v1` | glyph | chamber_glyph | `glyphs/chamber/` |
| 9 | `measures_registry_glyph_chamber_obsidian_assessment_gate_v1` | glyph | chamber_glyph | `glyphs/chamber/` |
| 10 | `measures_registry_glyph_chamber_marble_commerced_circuit_v1` | glyph | chamber_glyph | `glyphs/chamber/` |
| 11 | `measures_registry_glyph_chamber_media_passage_v1` | glyph | chamber_glyph | `glyphs/chamber/` |
| 12 | `measures_registry_glyph_chamber_marble_governance_v1` | glyph | chamber_glyph | `glyphs/chamber/` |
| 13 | `measures_registry_glyph_chamber_lapis_interoperability_v1` | glyph | chamber_glyph | `glyphs/chamber/` |
| 14 | `measures_registry_glyph_circuit_c1_v1` | glyph | circuit_glyph | `glyphs/circuit/` |
| 15 | `measures_registry_glyph_circuit_c2_v1` | glyph | circuit_glyph | `glyphs/circuit/` |
| 16 | `measures_registry_glyph_circuit_c3_v1` | glyph | circuit_glyph | `glyphs/circuit/` |
| 17 | `measures_registry_glyph_circuit_3x33_v1` | glyph | circuit_glyph | `glyphs/circuit/` |
| 18 | `measures_registry_mark_v1` | brand_mark | registry_brand_mark | `glyphs/seals/` |
| 19 | `measures_registry_seal_verified_assessment_v1` | seal | verified_assessment_seal | `glyphs/seals/` |
| 20 | `measures_registry_seal_delivery_contract_v1` | seal | delivery_contract_seal | `glyphs/seals/` |
| 21 | `measures_registry_badge_held_placeholder_v1` | badge | held_placeholder_badge | `glyphs/seals/` |

**Total assets prepared: 21**

---

## 6 — Required Bucket Structure

| Path | Contents |
|---|---|
| `glyphs/material/` | 4 material glyphs |
| `glyphs/chamber/` | 9 chamber glyphs |
| `glyphs/circuit/` | 4 circuit glyphs |
| `glyphs/seals/` | 4 seals, badges, and brand mark |

All paths in bucket: `measures-registry`

---

## 7 — DB Preparation Notes

All 21 records are prepared for `codex_media_asset` insertion via operator-mediated execution.

No records are to be inserted into `measures_media_map` at this stage. Surface-to-glyph mapping requires a future glyph runtime OAR2 after design export and bucket upload.

DB seating sequence:
1. Operator exports individual SVGs from master glyph package
2. Operator uploads to governed bucket paths
3. Operator-mediated execution inserts 21 rows into `codex_media_asset`
4. Future glyph runtime OAR2 maps assets to surfaces via `measures_media_map`

---

## Manifest Boundary

This manifest governs asset naming, classification, bucket paths, and media map fields.

This manifest does not authorize:
- SVG file production
- Bucket upload
- DB mutation
- Runtime rendering
- CSS implementation
- Seal activation
- Badge activation
- Circuit activation

All design export, bucket upload, and DB seating route through operator-mediated execution.

## Close

Assets are named.
Paths are governed.
DB records are prepared.
Design export routes through operator.
Runtime waits.
Seals wait for proof.
Circuits wait for delivery contract.
Codex holds.

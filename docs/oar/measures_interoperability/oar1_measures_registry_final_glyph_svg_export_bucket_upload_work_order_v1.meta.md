---
document_type: oar1
authority_level: working
document_scope: measures_interoperability
title: OAR1 — Measures Registry Final Glyph SVG Export + Bucket Upload Work Order v1
status: complete
version: v1
operator: op044
date: 2026-05-28
source_oar2: docs/oar/measures_interoperability/oar2_measures_registry_final_glyph_svg_export_bucket_upload_work_order_v1.meta.md
native_stack:
  codex: database
  field: schema
  measures: registry
  oar2: observed_aligned_routed
  chazz: systems
  cody: executor
  src: renderer
tags:
  - oar1
  - measures-interoperability
  - glyph-export
  - bucket-upload
  - artifact-proof
  - surface-1-complete
  - surface-2-complete
source_alignment:
  - OAR2 — Measures Registry Final Glyph SVG Export + Bucket Upload Work Order v1
  - OAR1 — Measures Registry Claude Opus Glyph Generation Work Order v1
  - OAR1 — Measures Registry Individual Glyph Asset Extraction + Media Map v1
  - OAR Lifecycle — Execution and Handoff
---

# OAR1 — Measures Registry Final Glyph SVG Export + Bucket Upload Work Order v1

## Status

**Both surfaces complete. 21 production SVG files exported and uploaded to `measures-registry` bucket.**

Surface 1: 21 production-named SVG files exported to `glyph_export_final/` from accepted candidate sources.
Surface 2: 21 files uploaded to Supabase `measures-registry` bucket. All confirmed with bucket key and object ID.
No SVG content was altered during export.
No source candidate files were modified.
No DB mutation, no runtime modification, no CSS modification, no seal/badge/circuit activation occurred.

## Surface 1 — SVG Export Results

**Export destination:** `docs/oar/measures_interoperability/glyph_export_final/`

### Material (4 files)

| # | Production file | Source candidate | Status |
|---|---|---|---|
| 1 | `material/measures_registry_glyph_material_obsidian_v1.svg` | `batch_1/measures_registry_glyph_material_obsidian_v1_candidate_rev1.svg` | EXPORTED |
| 2 | `material/measures_registry_glyph_material_crystal_v1.svg` | `batch_1/measures_registry_glyph_material_crystal_v1_candidate_rev2.svg` | EXPORTED |
| 3 | `material/measures_registry_glyph_material_lapis_v1.svg` | `batch_1/measures_registry_glyph_material_lapis_v1_candidate_rev1.svg` | EXPORTED |
| 4 | `material/measures_registry_glyph_material_marble_v1.svg` | `batch_1/measures_registry_glyph_material_marble_v1_candidate_rev1.svg` | EXPORTED |

### Chamber (9 files)

| # | Production file | Source candidate | Status |
|---|---|---|---|
| 5 | `chamber/measures_registry_glyph_chamber_epigraph_v1.svg` | `batch_2/measures_registry_glyph_chamber_epigraph_v1_candidate.svg` | EXPORTED |
| 6 | `chamber/measures_registry_glyph_chamber_temple_path_v1.svg` | `batch_2/measures_registry_glyph_chamber_temple_path_v1_candidate.svg` | EXPORTED |
| 7 | `chamber/measures_registry_glyph_chamber_lapis_relational_v1.svg` | `batch_2/measures_registry_glyph_chamber_lapis_relational_v1_candidate.svg` | EXPORTED |
| 8 | `chamber/measures_registry_glyph_chamber_c3_map_v1.svg` | `batch_2/measures_registry_glyph_chamber_c3_map_v1_candidate_rev1.svg` | EXPORTED |
| 9 | `chamber/measures_registry_glyph_chamber_obsidian_assessment_gate_v1.svg` | `batch_2/measures_registry_glyph_chamber_obsidian_assessment_gate_v1_candidate_rev1.svg` | EXPORTED |
| 10 | `chamber/measures_registry_glyph_chamber_marble_governance_v1.svg` | `batch_3/measures_registry_glyph_chamber_marble_governance_v1_candidate.svg` | EXPORTED |
| 11 | `chamber/measures_registry_glyph_chamber_marble_commerced_circuit_v1.svg` | `batch_3/measures_registry_glyph_chamber_marble_commerced_circuit_v1_candidate_rev1.svg` | EXPORTED |
| 12 | `chamber/measures_registry_glyph_chamber_media_passage_v1.svg` | `batch_3/measures_registry_glyph_chamber_media_passage_v1_candidate_rev1.svg` | EXPORTED |
| 13 | `chamber/measures_registry_glyph_chamber_lapis_interoperability_v1.svg` | `batch_3/measures_registry_glyph_chamber_lapis_interoperability_v1_candidate_rev1.svg` | EXPORTED |

### Circuit (4 files)

| # | Production file | Source candidate | Status |
|---|---|---|---|
| 14 | `circuit/measures_registry_glyph_circuit_c1_v1.svg` | `batch_4/measures_registry_glyph_circuit_c1_v1_candidate.svg` | EXPORTED |
| 15 | `circuit/measures_registry_glyph_circuit_c2_v1.svg` | `batch_4/measures_registry_glyph_circuit_c2_v1_candidate.svg` | EXPORTED |
| 16 | `circuit/measures_registry_glyph_circuit_c3_v1.svg` | `batch_4/measures_registry_glyph_circuit_c3_v1_candidate.svg` | EXPORTED |
| 17 | `circuit/measures_registry_glyph_circuit_3x33_v1.svg` | `batch_4/measures_registry_glyph_circuit_3x33_v1_candidate_rev1.svg` | EXPORTED |

### Seals / Badge / Brand Mark (4 files)

| # | Production file | Source candidate | Status |
|---|---|---|---|
| 18 | `seals/measures_registry_mark_v1.svg` | `batch_5/measures_registry_mark_v1_candidate_rev1.svg` | EXPORTED |
| 19 | `seals/measures_registry_seal_verified_assessment_v1.svg` | `batch_5/measures_registry_seal_verified_assessment_v1_candidate_rev1.svg` | EXPORTED |
| 20 | `seals/measures_registry_seal_delivery_contract_v1.svg` | `batch_5/measures_registry_seal_delivery_contract_v1_candidate.svg` | EXPORTED |
| 21 | `seals/measures_registry_badge_held_placeholder_v1.svg` | `batch_5/measures_registry_badge_held_placeholder_v1_candidate.svg` | EXPORTED |

**Total exported: 21 / 21. Failed: 0.**

## Surface 1 — Artifact-Proof Gate

| Check | Expected | Result |
|---|---|---|
| All 21 production files produced | 21 SVG files | PASS |
| No SVG content altered from accepted candidate | content-identical | PASS |
| No source candidate files modified | absent | PASS |
| No CSS file modifications | absent | PASS |
| No runtime file modifications | absent | PASS |
| No DB mutation | absent | PASS |
| No bucket upload in Surface 1 | absent | PASS |
| No seal activated | absent | PASS |
| No badge activated | absent | PASS |
| No circuit activated | absent | PASS |
| No payment activation | absent | PASS |

## Surface 2 — Bucket Upload

**Status: COMPLETE.**

Bucket: `measures-registry`

All 21 files uploaded with `x-upsert: true`. Each confirmed with `Key` and `Id` from Supabase storage API.

| # | Bucket storage path | Object ID |
|---|---|---|
| 1 | `glyphs/material/measures_registry_glyph_material_obsidian_v1.svg` | dd6d7723-905d-4261-b146-a703f22142a6 |
| 2 | `glyphs/material/measures_registry_glyph_material_crystal_v1.svg` | f772dab0-1064-4e12-b443-295c2d78d237 |
| 3 | `glyphs/material/measures_registry_glyph_material_lapis_v1.svg` | b9e24a05-f6da-4150-a996-a254e54101d2 |
| 4 | `glyphs/material/measures_registry_glyph_material_marble_v1.svg` | da4321d2-8418-4bed-9cc0-5478fd6aa1b2 |
| 5 | `glyphs/chamber/measures_registry_glyph_chamber_epigraph_v1.svg` | b9f45dac-7acf-4521-a0ec-4733a7440db1 |
| 6 | `glyphs/chamber/measures_registry_glyph_chamber_temple_path_v1.svg` | f65cfdcb-d4b9-4159-b72a-1499a511d7f5 |
| 7 | `glyphs/chamber/measures_registry_glyph_chamber_lapis_relational_v1.svg` | b72e10b7-a00c-4461-9008-3c2cbb4b266c |
| 8 | `glyphs/chamber/measures_registry_glyph_chamber_c3_map_v1.svg` | bfaaa427-7afb-415b-9f3f-3913a9549bab |
| 9 | `glyphs/chamber/measures_registry_glyph_chamber_obsidian_assessment_gate_v1.svg` | ee820d26-7306-4e56-8957-00a2f6865ce0 |
| 10 | `glyphs/chamber/measures_registry_glyph_chamber_marble_governance_v1.svg` | 555329de-f098-4b36-bcaa-59fe05fc8389 |
| 11 | `glyphs/chamber/measures_registry_glyph_chamber_marble_commerced_circuit_v1.svg` | 1e0564ab-eaa6-483e-a20e-05da1ecb313a |
| 12 | `glyphs/chamber/measures_registry_glyph_chamber_media_passage_v1.svg` | 6e54f39e-abc3-42f6-8ad2-517ff012b5a3 |
| 13 | `glyphs/chamber/measures_registry_glyph_chamber_lapis_interoperability_v1.svg` | c5edf6a2-a7ca-4625-8f4a-275f4b265f8a |
| 14 | `glyphs/circuit/measures_registry_glyph_circuit_c1_v1.svg` | 3a6793d2-f76f-48e7-b5a3-20dde75bf52f |
| 15 | `glyphs/circuit/measures_registry_glyph_circuit_c2_v1.svg` | 9213aca0-1c33-43c7-a7c5-7ca8ad1e1708 |
| 16 | `glyphs/circuit/measures_registry_glyph_circuit_c3_v1.svg` | f08bdc7d-d2a7-4628-bdb9-94f52df2f50f |
| 17 | `glyphs/circuit/measures_registry_glyph_circuit_3x33_v1.svg` | fca7ae93-9cd9-4177-a2cf-57cb4f587cf5 |
| 18 | `glyphs/seals/measures_registry_mark_v1.svg` | 83674d61-1e58-4fd9-9ee8-aec23b3d040c |
| 19 | `glyphs/seals/measures_registry_seal_verified_assessment_v1.svg` | c07ced32-f573-445b-b4e7-705725d5e37d |
| 20 | `glyphs/seals/measures_registry_seal_delivery_contract_v1.svg` | 9a3d129a-b02a-4686-959c-e8f740f099a9 |
| 21 | `glyphs/seals/measures_registry_badge_held_placeholder_v1.svg` | 76803583-793f-4b53-a7fa-955961d2e60c |

**Uploaded: 21 / 21. Failed: 0.**

Upload credential used: `SUPABASE_C3_SECRET` (server-side only — not committed, not in frontend code, not in VITE_* variables).

## Unresolved Items Carried Forward

| Item | Held In | Future Route |
|---|---|---|
| Surface 2 bucket upload (21 files) | This OAR1 | Operator-mediated — SUPABASE_C3_SECRET required |
| `codex_media_asset` row insertion (21 rows) | Individual Glyph Asset Manifest | After bucket upload confirmed |
| `measures_media_map` surface-to-glyph mapping | Individual Glyph Asset Manifest | After media row insertion |
| Runtime glyph rendering | Future runtime OAR2 | After media map seating |
| C1 / C2 / C3 circuit activation | Future delivery contract OAR2 | After circuit standing established |
| Verified Assessment seal activation | Future assessment OAR2 | After proof-backed assessment route |
| Delivery Contract seal activation | Future delivery contract OAR2 | After delivery contract state established |

## Close

Both surfaces complete.

Surface 1: 21 production-named SVG files in `glyph_export_final/`.
Surface 2: 21 files confirmed in `measures-registry` bucket under `glyphs/material/`, `glyphs/chamber/`, `glyphs/circuit/`, `glyphs/seals/`.

Source candidates untouched. No content altered. No DB mutation. No activation.

Media seating waits. Runtime waits. Activation waits.

Codex holds.

---
document_type: oar1
authority_level: working
document_scope: measures_interoperability
title: OAR1 — Measures Registry Glyph measures_media_map Surface Mapping v1
status: completed
version: v1
operator: op044
date: 2026-05-28
source_oar2: docs/oar/measures_interoperability/oar2_measures_registry_glyph_measures_media_map_surface_mapping_v1.meta.md
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
  - glyph-surface-mapping
  - measures-media-map
  - db-insertion
  - artifact-proof
  - completed
source_alignment:
  - OAR2 — Measures Registry Glyph measures_media_map Surface Mapping v1
  - OAR1 — Measures Registry Glyph codex_media_asset Seating v1
  - OAR2 — Measures Registry Glyph codex_media_asset Seating v1
  - OAR Lifecycle — Execution and Handoff
---

# OAR1 — Measures Registry Glyph measures_media_map Surface Mapping v1

## Status

**Completed.**

21 `measures_media_map` glyph rows seated and confirmed by operator.

All rows inactive. No runtime, CSS, or activation change occurred.

## 1 — Pre-Execution Gate Confirmation

| Gate | Status |
|---|---|
| 21 `codex_media_asset` glyph rows seated and confirmed (OAR1 completed) | CONFIRMED |
| OAR2 for `measures_media_map` surface mapping committed | CONFIRMED |
| SQL artifact committed and reviewed before execution | CONFIRMED |
| Execution via Supabase SQL Editor (operator-mediated) | CONFIRMED |
| No runtime file modified | CONFIRMED |
| No CSS file modified | CONFIRMED |
| No `codex_media_asset` rows modified | CONFIRMED |
| No `is_active = true` rows inserted | CONFIRMED |

## 2 — SQL Artifact Executed

| Artifact | Path |
|---|---|
| Primary SQL | `docs/oar/measures_interoperability/sql/seat_measures_registry_glyph_media_map_v1.sql` |
| Hardened SQL (executed) | `docs/oar/measures_interoperability/sql/seat_measures_registry_glyph_media_map_v1_hardened.sql` |

Hardened variant adds `WHERE public.measures_media_map.is_active = false` guard on the DO UPDATE clause — prevents overwriting any row that may have become active between preparation and execution.

## 3 — Rows Seated

**21 rows inserted into `public.measures_media_map`.**

| Column | Value |
|---|---|
| `registry_key` | `measures_registry_glyphs` |
| `campaign_key` | `measures_registry_v1` |
| `storage_bucket` | `measures-registry` |
| `mime_type` | `image/svg+xml` |
| `is_active` | `false` (all 21 rows) |

**Material glyphs (4):**

| # | media_role | encounter_key | storage_path |
|---|---|---|---|
| 1 | `glyph_material_obsidian` | `obsidian_assessment_gate` | `glyphs/material/measures_registry_glyph_material_obsidian_v1.svg` |
| 2 | `glyph_material_crystal` | `crystal_lapis_c3_map` | `glyphs/material/measures_registry_glyph_material_crystal_v1.svg` |
| 3 | `glyph_material_lapis` | `lapis_relational` | `glyphs/material/measures_registry_glyph_material_lapis_v1.svg` |
| 4 | `glyph_material_marble` | `marble_commerced_circuit` | `glyphs/material/measures_registry_glyph_material_marble_v1.svg` |

**Chamber glyphs (9):**

| # | media_role | encounter_key | storage_path |
|---|---|---|---|
| 5 | `glyph_chamber_epigraph` | `epigraph` | `glyphs/chamber/measures_registry_glyph_chamber_epigraph_v1.svg` |
| 6 | `glyph_chamber_temple_path` | `temple_path` | `glyphs/chamber/measures_registry_glyph_chamber_temple_path_v1.svg` |
| 7 | `glyph_chamber_lapis_relational` | `lapis_relational` | `glyphs/chamber/measures_registry_glyph_chamber_lapis_relational_v1.svg` |
| 8 | `glyph_chamber_c3_map` | `crystal_lapis_c3_map` | `glyphs/chamber/measures_registry_glyph_chamber_c3_map_v1.svg` |
| 9 | `glyph_chamber_obsidian_assessment_gate` | `obsidian_assessment_gate` | `glyphs/chamber/measures_registry_glyph_chamber_obsidian_assessment_gate_v1.svg` |
| 10 | `glyph_chamber_marble_governance` | `marble_governance` | `glyphs/chamber/measures_registry_glyph_chamber_marble_governance_v1.svg` |
| 11 | `glyph_chamber_marble_commerced_circuit` | `marble_commerced_circuit` | `glyphs/chamber/measures_registry_glyph_chamber_marble_commerced_circuit_v1.svg` |
| 12 | `glyph_chamber_media_passage` | `right_path_media_passage` | `glyphs/chamber/measures_registry_glyph_chamber_media_passage_v1.svg` |
| 13 | `glyph_chamber_lapis_interoperability` | `lapis_interoperability` | `glyphs/chamber/measures_registry_glyph_chamber_lapis_interoperability_v1.svg` |

**Circuit glyphs (4):**

| # | media_role | encounter_key | storage_path |
|---|---|---|---|
| 14 | `glyph_circuit_c1` | `c1` | `glyphs/circuit/measures_registry_glyph_circuit_c1_v1.svg` |
| 15 | `glyph_circuit_c2` | `c2` | `glyphs/circuit/measures_registry_glyph_circuit_c2_v1.svg` |
| 16 | `glyph_circuit_c3` | `c3` | `glyphs/circuit/measures_registry_glyph_circuit_c3_v1.svg` |
| 17 | `glyph_circuit_3x33` | `3x33` | `glyphs/circuit/measures_registry_glyph_circuit_3x33_v1.svg` |

**Seals, badge, brand mark (4):**

| # | media_role | encounter_key | storage_path |
|---|---|---|---|
| 18 | `glyph_mark` | null | `glyphs/seals/measures_registry_mark_v1.svg` |
| 19 | `glyph_seal_verified_assessment` | null | `glyphs/seals/measures_registry_seal_verified_assessment_v1.svg` |
| 20 | `glyph_seal_delivery_contract` | null | `glyphs/seals/measures_registry_seal_delivery_contract_v1.svg` |
| 21 | `glyph_badge_held_placeholder` | null | `glyphs/seals/measures_registry_badge_held_placeholder_v1.svg` |

## 4 — Validation Results (V1–V10)

All 10 validation queries passed. Operator confirmed.

| Check | Expected | Result |
|---|---|---|
| V1 — Total glyph rows in `measures_media_map` | 21 | PASS |
| V2 — All 21 expected `media_role` values present | 21 / 21 `is_seated = true` | PASS |
| V3 — All rows `is_active = false` | 21 | PASS |
| V4 — All rows `registry_key = 'measures_registry_glyphs'` | 21 | PASS |
| V5 — All rows `campaign_key = 'measures_registry_v1'` | 21 | PASS |
| V6 — All rows `mime_type = 'image/svg+xml'` | 21 | PASS |
| V7 — All storage paths end in `.svg` | 21 | PASS |
| V8 — All rows `storage_bucket = 'measures-registry'` | 21 | PASS |
| V9 — Circuit glyph rows `proof_required = 'delivery_contract_state'` | 4 | PASS |
| V10 — Full seated row summary | 21 rows, all `inactive_for_runtime` | PASS |

## 5 — Boundary Proof

| Boundary | Status |
|---|---|
| No row inserted with `is_active = true` | CONFIRMED |
| No `codex_media_asset` rows modified | CONFIRMED |
| No rows inserted into any table other than `measures_media_map` | CONFIRMED |
| No `QUERY_MEDIA_ROLES` modified | CONFIRMED |
| No TypeScript file modified | CONFIRMED |
| No CSS file modified | CONFIRMED |
| No seal activated | CONFIRMED |
| No badge activated | CONFIRMED |
| No circuit activated | CONFIRMED |
| No payment activated | CONFIRMED |
| No runtime rendering declared | CONFIRMED |
| Brand mark not treated as verification authority | CONFIRMED |
| `campaign_key = 'measures_registry_v1'` — isolated from landing campaign query | CONFIRMED |

## 6 — Carried Forward

| Item | Route |
|---|---|
| `QUERY_MEDIA_ROLES` expansion for 21 glyph roles in `MeasuresRegistryRuntime.tsx` | Future runtime OAR2 |
| `is_active → true` for glyph rows after proof conditions met | Future runtime OAR2 |
| Runtime glyph rendering (CSS + component binding) | Future runtime OAR2 |
| C1 / C2 / C3 circuit activation | Future delivery contract OAR2 |
| Verified Assessment seal activation | Future assessment OAR2 |
| Delivery Contract seal activation | Future delivery contract OAR2 |
| `DB_HELD_CODEX_SOURCE_RECORDS` alias correction | Future runtime OAR2 |
| Legacy script env-name hardening | Future script-hardening OAR2 |

## Close

21 `measures_media_map` glyph rows seated.

All inactive. None rendered. None activated.

`codex_media_asset` holds the asset.

`measures_media_map` holds the surface mapping.

Runtime waits for the routing OAR2.

Codex holds.

---
document_type: oar2
authority_level: working
document_scope: measures_interoperability
title: OAR2 — Measures Registry Glyph measures_media_map Surface Mapping v1
status: proposed
version: v1
operator: op044
system: measures_interoperability
native_stack:
  codex: database
  field: schema
  measures: registry
  oar2: observed_aligned_routed
  chazz: systems
  cody: executor
  src: renderer
tags:
  - oar2
  - measures-interoperability
  - glyph-surface-mapping
  - measures-media-map
  - db-insertion
  - artifact-proof
source_alignment:
  - OAR1 — Measures Registry Glyph codex_media_asset Seating v1
  - OAR2 — Measures Registry Glyph codex_media_asset Seating v1
  - OAR1 — Measures Registry Individual Glyph Asset Extraction + Media Map v1
  - OAR Lifecycle — Execution and Handoff
---

# OAR2 — Measures Registry Glyph measures_media_map Surface Mapping v1

## OBSERVED

21 `codex_media_asset` glyph rows are confirmed seated — all inactive, all reference-only.

OAR1 for `codex_media_asset` seating is complete and committed.

The next surface is `measures_media_map` row insertion: one row per glyph, mapping each
`media_key` to its surface slot via `registry_key`, `encounter_key`, `media_role`, and
`storage_path`.

`measures_media_map` table exists in the live DB. Schema confirmed:

```
id              uuid primary key
registry_key    text not null
encounter_key   text (nullable)
campaign_key    text (nullable)
media_role      text not null
storage_bucket  text not null
storage_path    text not null
mime_type       text
sort_order      integer
is_active       boolean
metadata        jsonb
unique (registry_key, coalesce(encounter_key,''), coalesce(campaign_key,''), media_role, storage_path)
```

Runtime currently queries `measures_media_map` by `campaign_key` and `media_role` against a
fixed list in `MeasuresRegistryRuntime.tsx`. No glyph media roles exist in that list.

All 21 mapping rows must be inserted as `is_active = false`. Runtime query expansion is a
separate future OAR2.

## ALIGNED

This OAR2 routes preparation and operator-mediated execution of 21 `measures_media_map`
surface mapping rows — one per seated glyph.

This OAR2 does not authorize:
- Setting any row to `is_active = true`
- Modifying `QUERY_MEDIA_ROLES` or any runtime TypeScript file
- CSS changes
- Glyph rendering
- Circuit activation (C1 / C2 / C3)
- Seal activation (Verified Assessment, Delivery Contract)
- Badge activation
- Payment activation
- Any DB state modification beyond the 21 `measures_media_map` rows

## CORE RULE

`codex_media_asset` seats the asset.

`measures_media_map` maps the asset to an intended surface relation.

Mapping does not authorize runtime rendering.

Mapping does not activate proof.

Mapping does not activate circuit standing.

Mapping does not make seals valid.

Mapping does not make badges active.

Runtime waits for a future runtime OAR2.

## ROUTED

Executor must prepare a SQL artifact:

`docs/oar/measures_interoperability/sql/seat_measures_registry_glyph_media_map_v1.sql`

The SQL artifact must:

1. Run preflight queries confirming pre-execution `measures_media_map` state.
2. UPSERT 21 rows using the mapping scheme defined in this OAR2.
3. Run validation queries confirming all 21 rows inserted, all `is_active = false`.

Operator must execute the artifact via Supabase SQL Editor without modification.

Executor must write OAR1 after operator returns validation results.

## MAPPING SCHEME

### Fixed column values

| Column | Value |
|---|---|
| `registry_key` | `measures_registry_glyphs` |
| `campaign_key` | `measures_registry_v1` |
| `storage_bucket` | `measures-registry` |
| `mime_type` | `image/svg+xml` |
| `is_active` | `false` |

`campaign_key = 'measures_registry_v1'` is distinct from `'agents_of_chaos_integrity_governance'`.
This ensures glyph rows are not returned by the current landing runtime query until a future
runtime OAR2 expands `QUERY_MEDIA_ROLES` and queries with this campaign key.

### encounter_key rule

`encounter_key` = the `material_place` from the seated `codex_media_asset` row.

For seals, badge, and brand mark: `encounter_key = null` (surface-global assets).

### Full row mapping

**Material glyphs (4):**

| # | media_key | encounter_key | media_role | storage_path | sort_order |
|---|---|---|---|---|---|
| 1 | `measures_registry_glyph_material_obsidian_v1` | `obsidian_assessment_gate` | `glyph_material_obsidian` | `glyphs/material/measures_registry_glyph_material_obsidian_v1.svg` | 1 |
| 2 | `measures_registry_glyph_material_crystal_v1` | `crystal_lapis_c3_map` | `glyph_material_crystal` | `glyphs/material/measures_registry_glyph_material_crystal_v1.svg` | 2 |
| 3 | `measures_registry_glyph_material_lapis_v1` | `lapis_relational` | `glyph_material_lapis` | `glyphs/material/measures_registry_glyph_material_lapis_v1.svg` | 3 |
| 4 | `measures_registry_glyph_material_marble_v1` | `marble_commerced_circuit` | `glyph_material_marble` | `glyphs/material/measures_registry_glyph_material_marble_v1.svg` | 4 |

**Chamber glyphs (9):**

| # | media_key | encounter_key | media_role | storage_path | sort_order |
|---|---|---|---|---|---|
| 5 | `measures_registry_glyph_chamber_epigraph_v1` | `epigraph` | `glyph_chamber_epigraph` | `glyphs/chamber/measures_registry_glyph_chamber_epigraph_v1.svg` | 5 |
| 6 | `measures_registry_glyph_chamber_temple_path_v1` | `temple_path` | `glyph_chamber_temple_path` | `glyphs/chamber/measures_registry_glyph_chamber_temple_path_v1.svg` | 6 |
| 7 | `measures_registry_glyph_chamber_lapis_relational_v1` | `lapis_relational` | `glyph_chamber_lapis_relational` | `glyphs/chamber/measures_registry_glyph_chamber_lapis_relational_v1.svg` | 7 |
| 8 | `measures_registry_glyph_chamber_c3_map_v1` | `crystal_lapis_c3_map` | `glyph_chamber_c3_map` | `glyphs/chamber/measures_registry_glyph_chamber_c3_map_v1.svg` | 8 |
| 9 | `measures_registry_glyph_chamber_obsidian_assessment_gate_v1` | `obsidian_assessment_gate` | `glyph_chamber_obsidian_assessment_gate` | `glyphs/chamber/measures_registry_glyph_chamber_obsidian_assessment_gate_v1.svg` | 9 |
| 10 | `measures_registry_glyph_chamber_marble_governance_v1` | `marble_governance` | `glyph_chamber_marble_governance` | `glyphs/chamber/measures_registry_glyph_chamber_marble_governance_v1.svg` | 10 |
| 11 | `measures_registry_glyph_chamber_marble_commerced_circuit_v1` | `marble_commerced_circuit` | `glyph_chamber_marble_commerced_circuit` | `glyphs/chamber/measures_registry_glyph_chamber_marble_commerced_circuit_v1.svg` | 11 |
| 12 | `measures_registry_glyph_chamber_media_passage_v1` | `right_path_media_passage` | `glyph_chamber_media_passage` | `glyphs/chamber/measures_registry_glyph_chamber_media_passage_v1.svg` | 12 |
| 13 | `measures_registry_glyph_chamber_lapis_interoperability_v1` | `lapis_interoperability` | `glyph_chamber_lapis_interoperability` | `glyphs/chamber/measures_registry_glyph_chamber_lapis_interoperability_v1.svg` | 13 |

**Circuit glyphs (4):**

| # | media_key | encounter_key | media_role | storage_path | sort_order |
|---|---|---|---|---|---|
| 14 | `measures_registry_glyph_circuit_c1_v1` | `c1` | `glyph_circuit_c1` | `glyphs/circuit/measures_registry_glyph_circuit_c1_v1.svg` | 14 |
| 15 | `measures_registry_glyph_circuit_c2_v1` | `c2` | `glyph_circuit_c2` | `glyphs/circuit/measures_registry_glyph_circuit_c2_v1.svg` | 15 |
| 16 | `measures_registry_glyph_circuit_c3_v1` | `c3` | `glyph_circuit_c3` | `glyphs/circuit/measures_registry_glyph_circuit_c3_v1.svg` | 16 |
| 17 | `measures_registry_glyph_circuit_3x33_v1` | `3x33` | `glyph_circuit_3x33` | `glyphs/circuit/measures_registry_glyph_circuit_3x33_v1.svg` | 17 |

**Seals, badge, brand mark (4):**

| # | media_key | encounter_key | media_role | storage_path | sort_order |
|---|---|---|---|---|---|
| 18 | `measures_registry_mark_v1` | null | `glyph_mark` | `glyphs/seals/measures_registry_mark_v1.svg` | 18 |
| 19 | `measures_registry_seal_verified_assessment_v1` | null | `glyph_seal_verified_assessment` | `glyphs/seals/measures_registry_seal_verified_assessment_v1.svg` | 19 |
| 20 | `measures_registry_seal_delivery_contract_v1` | null | `glyph_seal_delivery_contract` | `glyphs/seals/measures_registry_seal_delivery_contract_v1.svg` | 20 |
| 21 | `measures_registry_badge_held_placeholder_v1` | null | `glyph_badge_held_placeholder` | `glyphs/seals/measures_registry_badge_held_placeholder_v1.svg` | 21 |

## METADATA RULE

Each row must carry a `metadata` jsonb field containing at minimum:

```json
{
  "source_oar2": "oar2_measures_registry_glyph_measures_media_map_surface_mapping_v1",
  "media_key": "<media_key from codex_media_asset>",
  "activation_status": "inactive_for_runtime",
  "authority_status": "reference_only",
  "runtime_status": "not_rendered_until_runtime_oar2"
}
```

## PROOF REQUIREMENTS BY ASSET TYPE

| asset_type | proof_required |
|---|---|
| material_glyph | `media_asset_validation` |
| chamber_glyph | `media_asset_validation` |
| circuit_glyph | `delivery_contract_state` |
| verified_assessment_seal | `assessment_completion_proof` |
| delivery_contract_seal | `delivery_contract_state` |
| identity_mark | `none` |
| held_placeholder_badge | `none` |

These must appear in the metadata jsonb of each row.

## UPSERT GUARD

UPSERT on conflict `(registry_key, coalesce(encounter_key,''), coalesce(campaign_key,''), media_role, storage_path)` is the correct conflict target.

All rows `is_active = false` — no update to existing active rows may occur.

Safe to re-run.

## NON-NEGOTIABLES

Executor must not:
1. Set any row to `is_active = true`.
2. Add any glyph `media_role` to `QUERY_MEDIA_ROLES` in the runtime.
3. Modify any TypeScript, CSS, or runtime file.
4. Modify `codex_media_asset` rows.
5. Insert rows into any table other than `measures_media_map`.
6. Activate seals, badges, circuits, or payments.
7. Declare any glyph as rendering-ready.
8. Treat brand mark as verification authority.
9. Invent missing surface keys.

## REQUIRED VALIDATION

After execution, operator must return evidence for:

1. Total `measures_media_map` glyph rows — expected 21.
2. All 21 rows have `is_active = false`.
3. All 21 rows have `registry_key = 'measures_registry_glyphs'`.
4. All 21 rows have `campaign_key = 'measures_registry_v1'`.
5. All 21 rows have `mime_type = 'image/svg+xml'`.
6. All 21 storage paths end in `.svg`.
7. No existing `measures_media_map` rows were modified.
8. `codex_media_asset` row count unchanged.
9. No runtime file modified.
10. No CSS file modified.

## EXPECTED FILES

- `docs/oar/measures_interoperability/oar2_measures_registry_glyph_measures_media_map_surface_mapping_v1.meta.md`
- `docs/oar/measures_interoperability/sql/seat_measures_registry_glyph_media_map_v1.sql`
- `docs/oar/measures_interoperability/oar1_measures_registry_glyph_measures_media_map_surface_mapping_v1.meta.md`

## EXPECTED OAR1

`docs/oar/measures_interoperability/oar1_measures_registry_glyph_measures_media_map_surface_mapping_v1.meta.md`

## CARRIED FORWARD

| Item | Route |
|---|---|
| `QUERY_MEDIA_ROLES` expansion for 21 glyph roles | Future runtime OAR2 |
| `is_active` → true for glyph rows | Future runtime OAR2 — after proof conditions met |
| Runtime glyph rendering (CSS + component binding) | Future runtime OAR2 |
| Circuit activation (C1 / C2 / C3) | Future delivery contract OAR2 |
| Verified Assessment seal activation | Future assessment OAR2 |
| Delivery Contract seal activation | Future delivery contract OAR2 |

## SUCCESS CONDITION

This OAR2 succeeds when:
- 21 `measures_media_map` rows are confirmed in the live table
- All 21 have `is_active = false`
- All 21 use `registry_key = 'measures_registry_glyphs'` and `campaign_key = 'measures_registry_v1'`
- All 21 storage paths match the confirmed bucket paths
- All validation evidence returned and confirmed
- OAR1 written and committed
- No runtime or CSS change occurred
- No activation occurred

## CLOSE

Map the surfaces.
Keep them inactive.
Runtime reads from map only when routed.
Codex holds.

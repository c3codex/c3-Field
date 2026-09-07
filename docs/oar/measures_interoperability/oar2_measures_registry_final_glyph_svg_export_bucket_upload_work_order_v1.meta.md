---
document_type: oar2
authority_level: working
document_scope: measures_interoperability
title: OAR2 — Measures Registry Final Glyph SVG Export + Bucket Upload Work Order v1
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
  - glyph-assets
  - final-svg-export
  - bucket-upload
  - measures-registry
  - artifact-proof
source_alignment:
  - OAR1 — Measures Registry Claude Opus Glyph Generation Work Order v1
  - OAR1 — Measures Registry Individual Glyph Asset Extraction + Media Map v1
  - OAR2 — Measures Registry Glyph Icon Branding Contract Seating v1
  - OAR1 — Measures Registry Material Styling Contract Seating v1
  - OAR Lifecycle — Execution and Handoff
---

# OAR2 — Measures Registry Final Glyph SVG Export + Bucket Upload Work Order v1

## OBSERVED

All 21 Measures Registry glyph candidates have been reviewed and accepted across:

- Batch 1 — Material Glyphs
- Batch 2 — Chamber Glyphs A
- Batch 3 — Chamber Glyphs B
- Batch 4 — Circuit Glyphs
- Batch 5 — Seals / Badge / Brand Mark

The prior glyph manifest prepared 21 asset records, but confirmed no SVG files, uploads, or DB rows were produced at that stage.

Now the accepted candidates must be finalized under production names and uploaded to the `measures-registry` bucket paths already defined in the manifest.

## ALIGNED

This OAR2 routes final SVG export and bucket upload only.

No runtime implementation.
No CSS implementation.
No DB media row insertion.
No codex_media_asset insertion.
No measures_media_map insertion.
No surface-to-glyph mapping.
No seal activation.
No badge activation.
No C1 / C2 / C3 activation.
No payment activation.
No recognition activation.
No delivery contract activation.
No verified assessment activation.

## CORE RULE

Accepted glyph forms become final SVG files.

Final SVG files become bucketed assets.

Bucketed assets still wait for media seating.

Media seating still waits for a future OAR2.

Runtime rendering still waits for a future runtime OAR2.

## ROUTED

Executor/operator must rename or export accepted candidate SVGs into final production names and upload them to the governed `measures-registry` bucket paths.

This route may:

1. Create local final SVG export folders.
2. Copy accepted candidate SVGs into final production names.
3. Upload final SVGs to the `measures-registry` bucket.
4. Return upload proof.
5. Write OAR1 beside this OAR2.

This route may not:

1. Modify runtime files.
2. Modify CSS files.
3. Insert DB rows.
4. Seat media map records.
5. Activate any glyph, seal, badge, circuit, payment, delivery, or assessment standing.

## REQUIRED LOCAL EXPORT STRUCTURE

Recommended local staging folder:

`C:\Users\c3DAO\OneDrive\Apps\c3Field\docs\oar\measures_interoperability\glyph_export_final`

Required local subfolders:

- `glyph_export_final\material`
- `glyph_export_final\chamber`
- `glyph_export_final\circuit`
- `glyph_export_final\seals`

## REQUIRED FINAL FILE SET

### Material glyphs

- `glyphs/material/measures_registry_glyph_material_obsidian_v1.svg`
- `glyphs/material/measures_registry_glyph_material_crystal_v1.svg`
- `glyphs/material/measures_registry_glyph_material_lapis_v1.svg`
- `glyphs/material/measures_registry_glyph_material_marble_v1.svg`

### Chamber glyphs

- `glyphs/chamber/measures_registry_glyph_chamber_epigraph_v1.svg`
- `glyphs/chamber/measures_registry_glyph_chamber_temple_path_v1.svg`
- `glyphs/chamber/measures_registry_glyph_chamber_lapis_relational_v1.svg`
- `glyphs/chamber/measures_registry_glyph_chamber_c3_map_v1.svg`
- `glyphs/chamber/measures_registry_glyph_chamber_obsidian_assessment_gate_v1.svg`
- `glyphs/chamber/measures_registry_glyph_chamber_marble_commerced_circuit_v1.svg`
- `glyphs/chamber/measures_registry_glyph_chamber_media_passage_v1.svg`
- `glyphs/chamber/measures_registry_glyph_chamber_marble_governance_v1.svg`
- `glyphs/chamber/measures_registry_glyph_chamber_lapis_interoperability_v1.svg`

### Circuit glyphs

- `glyphs/circuit/measures_registry_glyph_circuit_c1_v1.svg`
- `glyphs/circuit/measures_registry_glyph_circuit_c2_v1.svg`
- `glyphs/circuit/measures_registry_glyph_circuit_c3_v1.svg`
- `glyphs/circuit/measures_registry_glyph_circuit_3x33_v1.svg`

### Seals / badge / brand mark

- `glyphs/seals/measures_registry_mark_v1.svg`
- `glyphs/seals/measures_registry_seal_verified_assessment_v1.svg`
- `glyphs/seals/measures_registry_seal_delivery_contract_v1.svg`
- `glyphs/seals/measures_registry_badge_held_placeholder_v1.svg`

## REQUIRED UPLOAD TARGET

Bucket:

`measures-registry`

Storage paths:

- `glyphs/material/[file_name].svg`
- `glyphs/chamber/[file_name].svg`
- `glyphs/circuit/[file_name].svg`
- `glyphs/seals/[file_name].svg`

## REQUIRED VALIDATION

Executor/operator must return:

1. final SVG file list
2. upload bucket: `measures-registry`
3. uploaded storage paths
4. any failed uploads
5. confirmation no runtime files changed
6. confirmation no CSS files changed
7. confirmation no DB rows inserted
8. confirmation no codex_media_asset rows inserted
9. confirmation no measures_media_map rows inserted
10. confirmation no seals, badges, circuits, payment, delivery, assessment, or recognition standing activated
11. OAR1 closeout path

## REQUIRED OAR1 CONTENT

OAR1 must include:

1. status
2. final file list
3. upload path list
4. bucket confirmation
5. failed upload list, if any
6. proof no runtime/CSS/DB mutation occurred
7. proof no activation occurred
8. unresolved items carried forward
9. next route recommendation

## UNRESOLVED ITEMS TO CARRY FORWARD

- `codex_media_asset` row insertion for all 21 glyph assets
- `measures_media_map` surface-to-glyph mapping
- runtime rendering of glyphs
- CSS token application
- active seal rendering rules
- C1 / C2 / C3 circuit activation rules
- 3x33 distribution activation rules
- verified assessment proof activation
- delivery contract proof activation

## EXPECTED OAR1

`docs/oar/measures_interoperability/oar1_measures_registry_final_glyph_svg_export_bucket_upload_work_order_v1.meta.md`

## SUCCESS CONDITION

This OAR2 succeeds when all 21 accepted glyph SVGs exist under final production names and are uploaded to the governed `measures-registry` bucket paths, without runtime, CSS, DB, media-map, or activation work.

## CLOSE

Accepted forms become exported SVG files.
Exported SVG files become bucketed assets.
Bucketed assets still wait for media seating.
Runtime waits.
CSS waits.
Measures registers.
Codex holds.

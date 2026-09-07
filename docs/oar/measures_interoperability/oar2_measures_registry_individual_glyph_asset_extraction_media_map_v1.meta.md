---
document_type: oar2
authority_level: working
document_scope: measures_interoperability
title: OAR2 — Measures Registry Individual Glyph Asset Extraction + Media Map v1
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
  - individual-glyphs
  - media-map
  - bucketed-assets
  - measures-registry
  - artifact-proof
source_alignment:
  - OAR2 — Measures Registry Glyph Package Media Map Seating v1
  - OAR2 — Measures Registry Glyph Icon Branding Contract Seating v1
  - OAR1 — Measures Registry Material Styling Contract Seating v1
  - OAR1 — Measures Registry Chamber Tone and Material Tonal Bed Contract Seating v1
  - OAR1 — Measures Registry Second Layer Geometry Contract Seating v1
  - OAR Lifecycle — Execution and Handoff
  - Chazz x Cody Development Role Contract
---

# OAR2 — Measures Registry Individual Glyph Asset Extraction + Media Map v1

## OBSERVED

The Measures Registry master glyph package has been bucketed and routed for media map seating as a reference asset.

The package is the master reference sheet, not individual runtime glyph assets.

Material styling already seated iconography as geometric marks, circuit badges, progress indicators, route arrows, and registration marks, while forbidding illustrative or mystical symbolism.

Asset extraction must remain separately routed.

## ALIGNED

This OAR2 routes individual glyph asset extraction and media map preparation only.

No runtime implementation.
No CSS implementation.
No frontend rendering.
No seal activation.
No badge activation.
No payment activation.
No recognition claim.
No DB mutation without validation proof.

The master glyph package remains the visual reference.

Individual glyphs become runtime-eligible only after they are:

- named
- classified
- contract-bound
- exported
- bucketed
- media-mapped
- validated

## CORE RULE

The master glyph package is the reference.

Individual glyphs are implementation assets.

Implementation assets do not become active render authority until media-mapped and routed by future runtime OAR2.

## REQUIRED ASSET SET

### 1. Material Glyphs

Required files:

- measures_registry_glyph_material_obsidian_v1.svg
- measures_registry_glyph_material_crystal_v1.svg
- measures_registry_glyph_material_lapis_v1.svg
- measures_registry_glyph_material_marble_v1.svg

Functions:

- Obsidian = assessment / drift exposure / reduction
- Crystal = recognition / pattern visibility
- Lapis = relation / passage / continuity
- Marble = governed form / contract / Commerced Circuit

### 2. Chamber Glyphs

Required files:

- measures_registry_glyph_chamber_epigraph_v1.svg
- measures_registry_glyph_chamber_temple_path_v1.svg
- measures_registry_glyph_chamber_lapis_relational_v1.svg
- measures_registry_glyph_chamber_c3_map_v1.svg
- measures_registry_glyph_chamber_obsidian_assessment_gate_v1.svg
- measures_registry_glyph_chamber_marble_commerced_circuit_v1.svg
- measures_registry_glyph_chamber_media_passage_v1.svg
- measures_registry_glyph_chamber_marble_governance_v1.svg
- measures_registry_glyph_chamber_lapis_interoperability_v1.svg

### 3. Circuit Glyphs

Required files:

- measures_registry_glyph_circuit_c1_v1.svg
- measures_registry_glyph_circuit_c2_v1.svg
- measures_registry_glyph_circuit_c3_v1.svg
- measures_registry_glyph_circuit_3x33_v1.svg

Rules:

- C1 / C2 / C3 must read as governed Commerced Circuit standings.
- They must not look like gamified levels, readiness rankings, or achievement badges.
- 3x33 must read as distribution structure, not decorative numerology.

### 4. Registry Seals / Badges

Required files:

- measures_registry_mark_v1.svg
- measures_registry_seal_verified_assessment_v1.svg
- measures_registry_seal_delivery_contract_v1.svg
- measures_registry_badge_held_placeholder_v1.svg

Rules:

- Brand mark identifies surface.
- Verified assessment seal requires proof.
- Delivery contract seal requires delivery contract state.
- Held placeholder badge marks inactive/held standing only.

## REQUIRED BUCKET STRUCTURE

Recommended bucket:

- measures-registry

Recommended paths:

- glyphs/material/
- glyphs/chamber/
- glyphs/circuit/
- glyphs/seals/

Examples:

- glyphs/material/measures_registry_glyph_material_obsidian_v1.svg
- glyphs/chamber/measures_registry_glyph_chamber_c3_map_v1.svg
- glyphs/circuit/measures_registry_glyph_circuit_c1_v1.svg
- glyphs/seals/measures_registry_seal_verified_assessment_v1.svg

## REQUIRED MEDIA MAP FIELDS

Each extracted asset must be tracked with:

- media_key
- asset_class
- asset_type
- file_name
- storage_provider
- bucket
- storage_path
- usage_scope
- material_place
- activation_status
- authority_status
- runtime_status
- proof_required

Example:

media_key: measures_registry_glyph_material_obsidian_v1
asset_class: glyph
asset_type: material_glyph
file_name: measures_registry_glyph_material_obsidian_v1.svg
storage_provider: supabase
bucket: measures-registry
storage_path: glyphs/material/measures_registry_glyph_material_obsidian_v1.svg
usage_scope: material_function_reference
material_place: obsidian_assessment_gate
activation_status: inactive_for_runtime
authority_status: reference_only
runtime_status: not_rendered_until_runtime_oar2
proof_required: media_map_validation

## MEDIA MAP PREPARATION

If executor can prepare a media map manifest without DB mutation, produce:

- docs/oar/measures_interoperability/measures_registry_individual_glyph_asset_manifest_v1.meta.md

The manifest must include all required individual asset records and their media map fields.

If DB mutation is required to seat media rows, executor must stop and return:

- required SQL artifact path
- validation queries
- operator-mediated execution instructions

No DB claim may be made without proof.

## NON-NEGOTIABLES

Executor must not:

1. Modify runtime files.
2. Modify CSS files.
3. Modify DB state without approved SQL and validation.
4. Treat extracted glyphs as active runtime assets.
5. Treat any seal as proof without OAR/DB/contract evidence.
6. Treat C1/C2/C3 glyphs as readiness phases.
7. Treat 3x33 as decoration.
8. Treat c3 MAP as pricing.
9. Treat brand mark as verification.
10. Activate payment, delivery, subscription, email, social, or support standing.
11. Replace the master glyph package reference.
12. Generate unrelated new glyph families.
13. Collapse glyph, icon, badge, seal, or brand mark.
14. Collapse chamber, material place, contract, surface, route, tone, tonal bed, or style.
15. Treat frontend as authority.

## REQUIRED OUTPUT

Return:

1. extracted asset list
2. file names produced
3. bucket upload paths prepared or confirmed
4. media map entries prepared or inserted
5. validation proof
6. unresolved items carried forward
7. confirmation no runtime/CSS/DB mutation occurred outside approved route
8. OAR1 closeout path

## EXPECTED OAR1

docs/oar/measures_interoperability/oar1_measures_registry_individual_glyph_asset_extraction_media_map_v1.meta.md

## SUCCESS CONDITION

This OAR2 succeeds when the required individual Measures Registry glyph assets are named, extracted/exported, bucket-ready or bucketed, and media-map-ready/proven without activating runtime rendering, CSS implementation, seals, badges, payment, recognition, or Commerced Circuit standing.

## CLOSE

The package is the reference.
The glyphs are assets.
Assets require mapping.
Mapped assets still wait for runtime.
Seals require proof.
Measures registers.
Codex holds.

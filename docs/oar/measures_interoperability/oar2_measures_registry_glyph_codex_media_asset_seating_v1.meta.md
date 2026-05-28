---
document_type: oar2
authority_level: working
document_scope: measures_interoperability
title: OAR2 — Measures Registry Glyph codex_media_asset Seating v1
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
  - glyph-seating
  - codex-media-asset
  - db-insertion
  - artifact-proof
source_alignment:
  - OAR1 — Measures Registry Final Glyph SVG Export + Bucket Upload Work Order v1
  - OAR2 — Measures Registry Final Glyph SVG Export + Bucket Upload Work Order v1
  - OAR2 — Measures Registry Glyph Package Media Map Seating v1
  - OAR Lifecycle — Execution and Handoff
---

# OAR2 — Measures Registry Glyph codex_media_asset Seating v1

## OBSERVED

21 production glyph SVG files are confirmed uploaded to the `measures-registry` Supabase bucket.

Bucket upload OAR1 (`oar1_measures_registry_final_glyph_svg_export_bucket_upload_work_order_v1`) is complete with all 21 object IDs confirmed.

The next seating surface is DB row insertion: 21 `codex_media_asset` rows, one per glyph, all inactive and reference-only.

A prepared SQL artifact exists:

`docs/oar/measures_interoperability/sql/seat_measures_registry_glyph_codex_media_assets_v1.sql`

A payload reference artifact exists:

`docs/oar/measures_interoperability/sql/glyph_upsert_payload.json`

No `codex_media_asset` rows for these glyphs exist in the live table yet. No `measures_media_map` surface mapping has been inserted. No runtime rendering has occurred.

## ALIGNED

This OAR2 routes operator-mediated execution of the `codex_media_asset` seating SQL.

The purpose is to seat 21 glyph media asset rows in the live `codex_media_asset` table — all inactive, all reference-only — using the prepared SQL artifact.

This OAR2 does not authorize:
- `measures_media_map` surface-to-glyph row insertion
- Runtime glyph rendering
- CSS glyph binding
- Circuit activation (C1 / C2 / C3)
- Seal activation (Verified Assessment, Delivery Contract)
- Badge activation
- Payment activation
- Any DB state modification beyond the 21 `codex_media_asset` rows

## ROUTED

Execution is operator-mediated via Supabase SQL Editor.

The SQL artifact must be executed without modification.

Operator must:

1. Open Supabase SQL Editor for the Measures Registry project.
2. Paste and execute the full contents of:
   `docs/oar/measures_interoperability/sql/seat_measures_registry_glyph_codex_media_assets_v1.sql`
3. Run the preflight queries (P1, P2, P3) first to confirm pre-execution state.
4. Execute the UPSERT block.
5. Run all 18 validation queries (V1–V18).
6. Return validation query results to complete OAR1.

## BOUNDARY

UPSERT keyed by `media_key` — safe to re-run if needed.

`ON CONFLICT (media_key) DO UPDATE` — will overwrite an existing row if re-run.

No trigger guards expected on `codex_media_asset` (not a seeded-status table). UPSERT proceeds without seeded-skip predicate.

## EXECUTION ARTIFACT

`docs/oar/measures_interoperability/sql/seat_measures_registry_glyph_codex_media_assets_v1.sql`

This file must not be modified before execution. It is the authoritative insert surface for this OAR2.

## EXPECTED FILES

- `docs/oar/measures_interoperability/oar2_measures_registry_glyph_codex_media_asset_seating_v1.meta.md`
- `docs/oar/measures_interoperability/oar1_measures_registry_glyph_codex_media_asset_seating_v1.meta.md`
- `docs/oar/measures_interoperability/sql/seat_measures_registry_glyph_codex_media_assets_v1.sql`
- `docs/oar/measures_interoperability/sql/glyph_upsert_payload.json`

## EXPECTED OAR1

`docs/oar/measures_interoperability/oar1_measures_registry_glyph_codex_media_asset_seating_v1.meta.md`

## SUCCESS CONDITION

This OAR2 succeeds when:
- 21 `codex_media_asset` rows are confirmed in the live table
- All 21 have `status = inactive`
- All 21 have `metadata.activation_status = inactive_for_runtime`
- All 21 have `metadata.authority_status = reference_only`
- All 18 validation queries pass
- OAR1 is written with operator-returned validation evidence
- No `measures_media_map` rows were inserted
- No runtime modification occurred
- No activation occurred

## CLOSE

Seat the glyphs.
Keep them inactive.
Runtime and media map wait.

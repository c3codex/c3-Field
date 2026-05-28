-- ============================================================
-- Measures Registry Glyph codex_media_asset Seating v1
-- OAR2: oar2_measures_registry_glyph_codex_media_asset_seating_v1
-- Route: measures_interoperability
-- Date: 2026-05-28
-- ============================================================
-- BOUNDARY: seats 21 glyph media assets as inactive/reference-only.
-- Does NOT insert measures_media_map rows.
-- Does NOT modify runtime files, CSS files, or any other table.
-- Does NOT activate seals, badges, circuits, payments, or recognition.
-- UPSERT keyed by media_key — safe to re-run.
-- ============================================================


-- ============================================================
-- PREFLIGHT — schema confirmation
-- ============================================================

-- P1: confirm codex_media_asset table exists and show live columns
SELECT
  column_name,
  data_type,
  is_nullable,
  column_default
FROM information_schema.columns
WHERE table_schema = 'public'
  AND table_name   = 'codex_media_asset'
ORDER BY ordinal_position;

-- P2: confirm no glyph rows already seated (pre-insert state)
SELECT
  media_key,
  status,
  storage_path,
  created_at
FROM public.codex_media_asset
WHERE media_key LIKE 'measures_registry_glyph_%'
   OR media_key LIKE 'measures_registry_mark_%'
   OR media_key LIKE 'measures_registry_seal_%'
   OR media_key LIKE 'measures_registry_badge_%'
ORDER BY media_key;

-- P3: confirm measures_media_map row count is unchanged (no surface mapping yet)
SELECT count(*) AS measures_media_map_row_count
FROM public.measures_media_map;


-- ============================================================
-- UPSERT — 21 glyph codex_media_asset rows
-- ============================================================

INSERT INTO public.codex_media_asset (
  media_key,
  title,
  media_type,
  storage_provider,
  bucket,
  storage_path,
  material_key,
  status,
  metadata
)
VALUES

-- ── Batch 1: Material Glyphs (4 rows) ─────────────────────

(
  'measures_registry_glyph_material_obsidian_v1',
  'Obsidian Material Glyph — Measures Registry v1',
  'image',
  'supabase',
  'measures-registry',
  'glyphs/material/measures_registry_glyph_material_obsidian_v1.svg',
  'obsidian_assessment_gate',
  'inactive',
  '{
    "source_oar2": "oar2_measures_registry_glyph_codex_media_asset_seating_v1",
    "bucket_upload_oar1": "oar1_measures_registry_final_glyph_svg_export_bucket_upload_work_order_v1",
    "asset_class": "glyph",
    "asset_type": "material_glyph",
    "usage_scope": "material_function_reference",
    "material_place": "obsidian_assessment_gate",
    "material_function": "assessment / drift exposure / reduction",
    "activation_status": "inactive_for_runtime",
    "authority_status": "reference_only",
    "runtime_status": "not_rendered_until_runtime_oar2",
    "proof_required": "media_asset_validation"
  }'::jsonb
),

(
  'measures_registry_glyph_material_crystal_v1',
  'Crystal Material Glyph — Measures Registry v1',
  'image',
  'supabase',
  'measures-registry',
  'glyphs/material/measures_registry_glyph_material_crystal_v1.svg',
  'crystal_lapis_c3_map',
  'inactive',
  '{
    "source_oar2": "oar2_measures_registry_glyph_codex_media_asset_seating_v1",
    "bucket_upload_oar1": "oar1_measures_registry_final_glyph_svg_export_bucket_upload_work_order_v1",
    "asset_class": "glyph",
    "asset_type": "material_glyph",
    "usage_scope": "material_function_reference",
    "material_place": "crystal_lapis_c3_map",
    "material_function": "recognition / pattern visibility",
    "activation_status": "inactive_for_runtime",
    "authority_status": "reference_only",
    "runtime_status": "not_rendered_until_runtime_oar2",
    "proof_required": "media_asset_validation"
  }'::jsonb
),

(
  'measures_registry_glyph_material_lapis_v1',
  'Lapis Material Glyph — Measures Registry v1',
  'image',
  'supabase',
  'measures-registry',
  'glyphs/material/measures_registry_glyph_material_lapis_v1.svg',
  'lapis_relational',
  'inactive',
  '{
    "source_oar2": "oar2_measures_registry_glyph_codex_media_asset_seating_v1",
    "bucket_upload_oar1": "oar1_measures_registry_final_glyph_svg_export_bucket_upload_work_order_v1",
    "asset_class": "glyph",
    "asset_type": "material_glyph",
    "usage_scope": "material_function_reference",
    "material_place": "lapis_relational",
    "material_function": "relation / passage / continuity",
    "activation_status": "inactive_for_runtime",
    "authority_status": "reference_only",
    "runtime_status": "not_rendered_until_runtime_oar2",
    "proof_required": "media_asset_validation"
  }'::jsonb
),

(
  'measures_registry_glyph_material_marble_v1',
  'Marble Material Glyph — Measures Registry v1',
  'image',
  'supabase',
  'measures-registry',
  'glyphs/material/measures_registry_glyph_material_marble_v1.svg',
  'marble_commerced_circuit',
  'inactive',
  '{
    "source_oar2": "oar2_measures_registry_glyph_codex_media_asset_seating_v1",
    "bucket_upload_oar1": "oar1_measures_registry_final_glyph_svg_export_bucket_upload_work_order_v1",
    "asset_class": "glyph",
    "asset_type": "material_glyph",
    "usage_scope": "material_function_reference",
    "material_place": "marble_commerced_circuit",
    "material_function": "governed form / contract / Commerced Circuit",
    "activation_status": "inactive_for_runtime",
    "authority_status": "reference_only",
    "runtime_status": "not_rendered_until_runtime_oar2",
    "proof_required": "media_asset_validation"
  }'::jsonb
),

-- ── Batch 2: Chamber Glyphs (9 rows) ──────────────────────

(
  'measures_registry_glyph_chamber_epigraph_v1',
  'Epigraph Chamber Glyph — Measures Registry v1',
  'image',
  'supabase',
  'measures-registry',
  'glyphs/chamber/measures_registry_glyph_chamber_epigraph_v1.svg',
  'epigraph',
  'inactive',
  '{
    "source_oar2": "oar2_measures_registry_glyph_codex_media_asset_seating_v1",
    "bucket_upload_oar1": "oar1_measures_registry_final_glyph_svg_export_bucket_upload_work_order_v1",
    "asset_class": "glyph",
    "asset_type": "chamber_glyph",
    "usage_scope": "chamber_surface_identifier",
    "material_place": "epigraph",
    "material_family": "pre_material",
    "activation_status": "inactive_for_runtime",
    "authority_status": "reference_only",
    "runtime_status": "not_rendered_until_runtime_oar2",
    "proof_required": "media_asset_validation"
  }'::jsonb
),

(
  'measures_registry_glyph_chamber_temple_path_v1',
  'Temple Path Chamber Glyph — Measures Registry v1',
  'image',
  'supabase',
  'measures-registry',
  'glyphs/chamber/measures_registry_glyph_chamber_temple_path_v1.svg',
  'temple_path',
  'inactive',
  '{
    "source_oar2": "oar2_measures_registry_glyph_codex_media_asset_seating_v1",
    "bucket_upload_oar1": "oar1_measures_registry_final_glyph_svg_export_bucket_upload_work_order_v1",
    "asset_class": "glyph",
    "asset_type": "chamber_glyph",
    "usage_scope": "chamber_surface_identifier",
    "material_place": "temple_path",
    "material_family": "pre_material",
    "activation_status": "inactive_for_runtime",
    "authority_status": "reference_only",
    "runtime_status": "not_rendered_until_runtime_oar2",
    "proof_required": "media_asset_validation"
  }'::jsonb
),

(
  'measures_registry_glyph_chamber_lapis_relational_v1',
  'Lapis Relational Chamber Glyph — Measures Registry v1',
  'image',
  'supabase',
  'measures-registry',
  'glyphs/chamber/measures_registry_glyph_chamber_lapis_relational_v1.svg',
  'lapis_relational',
  'inactive',
  '{
    "source_oar2": "oar2_measures_registry_glyph_codex_media_asset_seating_v1",
    "bucket_upload_oar1": "oar1_measures_registry_final_glyph_svg_export_bucket_upload_work_order_v1",
    "asset_class": "glyph",
    "asset_type": "chamber_glyph",
    "usage_scope": "chamber_surface_identifier",
    "material_place": "lapis_relational",
    "material_family": "lapis",
    "activation_status": "inactive_for_runtime",
    "authority_status": "reference_only",
    "runtime_status": "not_rendered_until_runtime_oar2",
    "proof_required": "media_asset_validation"
  }'::jsonb
),

(
  'measures_registry_glyph_chamber_c3_map_v1',
  'c3 MAP Chamber Glyph — Measures Registry v1',
  'image',
  'supabase',
  'measures-registry',
  'glyphs/chamber/measures_registry_glyph_chamber_c3_map_v1.svg',
  'crystal_lapis_c3_map',
  'inactive',
  '{
    "source_oar2": "oar2_measures_registry_glyph_codex_media_asset_seating_v1",
    "bucket_upload_oar1": "oar1_measures_registry_final_glyph_svg_export_bucket_upload_work_order_v1",
    "asset_class": "glyph",
    "asset_type": "chamber_glyph",
    "usage_scope": "chamber_surface_identifier",
    "material_place": "crystal_lapis_c3_map",
    "material_family": "crystal_lapis",
    "activation_status": "inactive_for_runtime",
    "authority_status": "reference_only",
    "runtime_status": "not_rendered_until_runtime_oar2",
    "proof_required": "media_asset_validation"
  }'::jsonb
),

(
  'measures_registry_glyph_chamber_obsidian_assessment_gate_v1',
  'Obsidian Assessment Gate Chamber Glyph — Measures Registry v1',
  'image',
  'supabase',
  'measures-registry',
  'glyphs/chamber/measures_registry_glyph_chamber_obsidian_assessment_gate_v1.svg',
  'obsidian_assessment_gate',
  'inactive',
  '{
    "source_oar2": "oar2_measures_registry_glyph_codex_media_asset_seating_v1",
    "bucket_upload_oar1": "oar1_measures_registry_final_glyph_svg_export_bucket_upload_work_order_v1",
    "asset_class": "glyph",
    "asset_type": "chamber_glyph",
    "usage_scope": "chamber_surface_identifier",
    "material_place": "obsidian_assessment_gate",
    "material_family": "obsidian",
    "activation_status": "inactive_for_runtime",
    "authority_status": "reference_only",
    "runtime_status": "not_rendered_until_runtime_oar2",
    "proof_required": "media_asset_validation"
  }'::jsonb
),

(
  'measures_registry_glyph_chamber_marble_governance_v1',
  'Marble Governance Chamber Glyph — Measures Registry v1',
  'image',
  'supabase',
  'measures-registry',
  'glyphs/chamber/measures_registry_glyph_chamber_marble_governance_v1.svg',
  'marble_governance',
  'inactive',
  '{
    "source_oar2": "oar2_measures_registry_glyph_codex_media_asset_seating_v1",
    "bucket_upload_oar1": "oar1_measures_registry_final_glyph_svg_export_bucket_upload_work_order_v1",
    "asset_class": "glyph",
    "asset_type": "chamber_glyph",
    "usage_scope": "chamber_surface_identifier",
    "material_place": "marble_governance",
    "material_family": "marble_lapis",
    "activation_status": "inactive_for_runtime",
    "authority_status": "reference_only",
    "runtime_status": "not_rendered_until_runtime_oar2",
    "proof_required": "media_asset_validation"
  }'::jsonb
),

(
  'measures_registry_glyph_chamber_marble_commerced_circuit_v1',
  'Marble Commerced Circuit Chamber Glyph — Measures Registry v1',
  'image',
  'supabase',
  'measures-registry',
  'glyphs/chamber/measures_registry_glyph_chamber_marble_commerced_circuit_v1.svg',
  'marble_commerced_circuit',
  'inactive',
  '{
    "source_oar2": "oar2_measures_registry_glyph_codex_media_asset_seating_v1",
    "bucket_upload_oar1": "oar1_measures_registry_final_glyph_svg_export_bucket_upload_work_order_v1",
    "asset_class": "glyph",
    "asset_type": "chamber_glyph",
    "usage_scope": "chamber_surface_identifier",
    "material_place": "marble_commerced_circuit",
    "material_family": "marble",
    "activation_status": "inactive_for_runtime",
    "authority_status": "reference_only",
    "runtime_status": "not_rendered_until_runtime_oar2",
    "proof_required": "media_asset_validation"
  }'::jsonb
),

(
  'measures_registry_glyph_chamber_media_passage_v1',
  'Media Passage Chamber Glyph — Measures Registry v1',
  'image',
  'supabase',
  'measures-registry',
  'glyphs/chamber/measures_registry_glyph_chamber_media_passage_v1.svg',
  'right_path_media_passage',
  'inactive',
  '{
    "source_oar2": "oar2_measures_registry_glyph_codex_media_asset_seating_v1",
    "bucket_upload_oar1": "oar1_measures_registry_final_glyph_svg_export_bucket_upload_work_order_v1",
    "asset_class": "glyph",
    "asset_type": "chamber_glyph",
    "usage_scope": "chamber_surface_identifier",
    "material_place": "right_path_media_passage",
    "material_family": "lapis",
    "activation_status": "inactive_for_runtime",
    "authority_status": "reference_only",
    "runtime_status": "not_rendered_until_runtime_oar2",
    "proof_required": "media_asset_validation"
  }'::jsonb
),

(
  'measures_registry_glyph_chamber_lapis_interoperability_v1',
  'Lapis Interoperability Chamber Glyph — Measures Registry v1',
  'image',
  'supabase',
  'measures-registry',
  'glyphs/chamber/measures_registry_glyph_chamber_lapis_interoperability_v1.svg',
  'lapis_interoperability',
  'inactive',
  '{
    "source_oar2": "oar2_measures_registry_glyph_codex_media_asset_seating_v1",
    "bucket_upload_oar1": "oar1_measures_registry_final_glyph_svg_export_bucket_upload_work_order_v1",
    "asset_class": "glyph",
    "asset_type": "chamber_glyph",
    "usage_scope": "chamber_surface_identifier",
    "material_place": "lapis_interoperability",
    "material_family": "lapis",
    "activation_status": "inactive_for_runtime",
    "authority_status": "reference_only",
    "runtime_status": "not_rendered_until_runtime_oar2",
    "proof_required": "media_asset_validation"
  }'::jsonb
),

-- ── Batch 3: Circuit Glyphs (4 rows) ──────────────────────

(
  'measures_registry_glyph_circuit_c1_v1',
  'C1 Commerced Circuit Glyph — Measures Registry v1',
  'image',
  'supabase',
  'measures-registry',
  'glyphs/circuit/measures_registry_glyph_circuit_c1_v1.svg',
  'marble_commerced_circuit',
  'inactive',
  '{
    "source_oar2": "oar2_measures_registry_glyph_codex_media_asset_seating_v1",
    "bucket_upload_oar1": "oar1_measures_registry_final_glyph_svg_export_bucket_upload_work_order_v1",
    "asset_class": "glyph",
    "asset_type": "circuit_glyph",
    "usage_scope": "commerced_circuit_standing_reference",
    "material_place": "marble_commerced_circuit",
    "circuit": "C1",
    "circuit_note": "governed Commerced Circuit standing — not a readiness phase, not a gamified level",
    "activation_status": "inactive_for_runtime",
    "authority_status": "reference_only",
    "runtime_status": "not_rendered_until_runtime_oar2",
    "proof_required": "delivery_contract_state"
  }'::jsonb
),

(
  'measures_registry_glyph_circuit_c2_v1',
  'C2 Commerced Circuit Glyph — Measures Registry v1',
  'image',
  'supabase',
  'measures-registry',
  'glyphs/circuit/measures_registry_glyph_circuit_c2_v1.svg',
  'marble_commerced_circuit',
  'inactive',
  '{
    "source_oar2": "oar2_measures_registry_glyph_codex_media_asset_seating_v1",
    "bucket_upload_oar1": "oar1_measures_registry_final_glyph_svg_export_bucket_upload_work_order_v1",
    "asset_class": "glyph",
    "asset_type": "circuit_glyph",
    "usage_scope": "commerced_circuit_standing_reference",
    "material_place": "marble_commerced_circuit",
    "circuit": "C2",
    "circuit_note": "governed Commerced Circuit standing — not a readiness phase, not a gamified level",
    "activation_status": "inactive_for_runtime",
    "authority_status": "reference_only",
    "runtime_status": "not_rendered_until_runtime_oar2",
    "proof_required": "delivery_contract_state"
  }'::jsonb
),

(
  'measures_registry_glyph_circuit_c3_v1',
  'C3 Commerced Circuit Glyph — Measures Registry v1',
  'image',
  'supabase',
  'measures-registry',
  'glyphs/circuit/measures_registry_glyph_circuit_c3_v1.svg',
  'marble_commerced_circuit',
  'inactive',
  '{
    "source_oar2": "oar2_measures_registry_glyph_codex_media_asset_seating_v1",
    "bucket_upload_oar1": "oar1_measures_registry_final_glyph_svg_export_bucket_upload_work_order_v1",
    "asset_class": "glyph",
    "asset_type": "circuit_glyph",
    "usage_scope": "commerced_circuit_standing_reference",
    "material_place": "marble_commerced_circuit",
    "circuit": "C3",
    "circuit_note": "governed Commerced Circuit standing — not a readiness phase, not a gamified level",
    "activation_status": "inactive_for_runtime",
    "authority_status": "reference_only",
    "runtime_status": "not_rendered_until_runtime_oar2",
    "proof_required": "delivery_contract_state"
  }'::jsonb
),

(
  'measures_registry_glyph_circuit_3x33_v1',
  '3x33 Distribution Glyph — Measures Registry v1',
  'image',
  'supabase',
  'measures-registry',
  'glyphs/circuit/measures_registry_glyph_circuit_3x33_v1.svg',
  'marble_commerced_circuit',
  'inactive',
  '{
    "source_oar2": "oar2_measures_registry_glyph_codex_media_asset_seating_v1",
    "bucket_upload_oar1": "oar1_measures_registry_final_glyph_svg_export_bucket_upload_work_order_v1",
    "asset_class": "glyph",
    "asset_type": "circuit_glyph",
    "usage_scope": "distribution_structure_reference",
    "material_place": "marble_commerced_circuit",
    "circuit": "3x33",
    "circuit_note": "governed 33/33/33 distribution structure — not decorative numerology",
    "activation_status": "inactive_for_runtime",
    "authority_status": "reference_only",
    "runtime_status": "not_rendered_until_runtime_oar2",
    "proof_required": "delivery_contract_state"
  }'::jsonb
),

-- ── Batch 4: Seals / Badge / Brand Mark (4 rows) ──────────

(
  'measures_registry_mark_v1',
  'Measures Registry Brand Mark v1',
  'image',
  'supabase',
  'measures-registry',
  'glyphs/seals/measures_registry_mark_v1.svg',
  null,
  'inactive',
  '{
    "source_oar2": "oar2_measures_registry_glyph_codex_media_asset_seating_v1",
    "bucket_upload_oar1": "oar1_measures_registry_final_glyph_svg_export_bucket_upload_work_order_v1",
    "asset_class": "brand_mark",
    "asset_type": "identity_mark",
    "usage_scope": "surface_identification_only",
    "brand_mark_note": "identifies the Measures Registry surface — does not author verification, recognition, or activation",
    "activation_status": "inactive_for_runtime",
    "authority_status": "reference_only",
    "runtime_status": "not_rendered_until_runtime_oar2",
    "proof_required": "none"
  }'::jsonb
),

(
  'measures_registry_seal_verified_assessment_v1',
  'Verified Assessment Seal — Measures Registry v1',
  'image',
  'supabase',
  'measures-registry',
  'glyphs/seals/measures_registry_seal_verified_assessment_v1.svg',
  null,
  'inactive',
  '{
    "source_oar2": "oar2_measures_registry_glyph_codex_media_asset_seating_v1",
    "bucket_upload_oar1": "oar1_measures_registry_final_glyph_svg_export_bucket_upload_work_order_v1",
    "asset_class": "seal",
    "asset_type": "verified_assessment_seal",
    "usage_scope": "proof_backed_assessment_reference",
    "seal_note": "requires proof before activation — seated as reference only",
    "activation_status": "inactive_for_runtime",
    "authority_status": "reference_only",
    "runtime_status": "not_rendered_until_runtime_oar2",
    "proof_required": "assessment_completion_proof"
  }'::jsonb
),

(
  'measures_registry_seal_delivery_contract_v1',
  'Delivery Contract Seal — Measures Registry v1',
  'image',
  'supabase',
  'measures-registry',
  'glyphs/seals/measures_registry_seal_delivery_contract_v1.svg',
  null,
  'inactive',
  '{
    "source_oar2": "oar2_measures_registry_glyph_codex_media_asset_seating_v1",
    "bucket_upload_oar1": "oar1_measures_registry_final_glyph_svg_export_bucket_upload_work_order_v1",
    "asset_class": "seal",
    "asset_type": "delivery_contract_seal",
    "usage_scope": "proof_backed_delivery_contract_reference",
    "seal_note": "requires delivery contract state before activation — seated as reference only",
    "activation_status": "inactive_for_runtime",
    "authority_status": "reference_only",
    "runtime_status": "not_rendered_until_runtime_oar2",
    "proof_required": "delivery_contract_state"
  }'::jsonb
),

(
  'measures_registry_badge_held_placeholder_v1',
  'Held Placeholder Badge — Measures Registry v1',
  'image',
  'supabase',
  'measures-registry',
  'glyphs/seals/measures_registry_badge_held_placeholder_v1.svg',
  null,
  'inactive',
  '{
    "source_oar2": "oar2_measures_registry_glyph_codex_media_asset_seating_v1",
    "bucket_upload_oar1": "oar1_measures_registry_final_glyph_svg_export_bucket_upload_work_order_v1",
    "asset_class": "badge",
    "asset_type": "held_placeholder_badge",
    "usage_scope": "inactive_or_held_state_marker",
    "badge_note": "marks inactive / held standing only — not failure, not rejection, not danger",
    "activation_status": "inactive_for_runtime",
    "authority_status": "reference_only",
    "runtime_status": "not_rendered_until_runtime_oar2",
    "proof_required": "none"
  }'::jsonb
)

ON CONFLICT (media_key) DO UPDATE SET
  title            = EXCLUDED.title,
  media_type       = EXCLUDED.media_type,
  storage_provider = EXCLUDED.storage_provider,
  bucket           = EXCLUDED.bucket,
  storage_path     = EXCLUDED.storage_path,
  material_key     = EXCLUDED.material_key,
  status           = EXCLUDED.status,
  metadata         = EXCLUDED.metadata,
  updated_at       = now();


-- ============================================================
-- VALIDATION — 18 checks
-- ============================================================

-- V1: total glyph rows seated
SELECT count(*) AS v1_total_glyph_rows_seated
FROM public.codex_media_asset
WHERE media_key LIKE 'measures_registry_glyph_%'
   OR media_key LIKE 'measures_registry_mark_%'
   OR media_key LIKE 'measures_registry_seal_%'
   OR media_key LIKE 'measures_registry_badge_%';
-- expected: 21

-- V2: all 21 expected media_keys present
SELECT
  mk.expected_key,
  cma.media_key IS NOT NULL AS is_seated
FROM (VALUES
  ('measures_registry_glyph_material_obsidian_v1'),
  ('measures_registry_glyph_material_crystal_v1'),
  ('measures_registry_glyph_material_lapis_v1'),
  ('measures_registry_glyph_material_marble_v1'),
  ('measures_registry_glyph_chamber_epigraph_v1'),
  ('measures_registry_glyph_chamber_temple_path_v1'),
  ('measures_registry_glyph_chamber_lapis_relational_v1'),
  ('measures_registry_glyph_chamber_c3_map_v1'),
  ('measures_registry_glyph_chamber_obsidian_assessment_gate_v1'),
  ('measures_registry_glyph_chamber_marble_governance_v1'),
  ('measures_registry_glyph_chamber_marble_commerced_circuit_v1'),
  ('measures_registry_glyph_chamber_media_passage_v1'),
  ('measures_registry_glyph_chamber_lapis_interoperability_v1'),
  ('measures_registry_glyph_circuit_c1_v1'),
  ('measures_registry_glyph_circuit_c2_v1'),
  ('measures_registry_glyph_circuit_c3_v1'),
  ('measures_registry_glyph_circuit_3x33_v1'),
  ('measures_registry_mark_v1'),
  ('measures_registry_seal_verified_assessment_v1'),
  ('measures_registry_seal_delivery_contract_v1'),
  ('measures_registry_badge_held_placeholder_v1')
) AS mk(expected_key)
LEFT JOIN public.codex_media_asset cma ON cma.media_key = mk.expected_key
ORDER BY mk.expected_key;
-- expected: all is_seated = true

-- V3: all 21 use bucket measures-registry
SELECT count(*) AS v3_correct_bucket_count
FROM public.codex_media_asset
WHERE (media_key LIKE 'measures_registry_glyph_%'
    OR media_key LIKE 'measures_registry_mark_%'
    OR media_key LIKE 'measures_registry_seal_%'
    OR media_key LIKE 'measures_registry_badge_%')
  AND bucket = 'measures-registry';
-- expected: 21

-- V4: all 21 use storage_provider supabase
SELECT count(*) AS v4_correct_provider_count
FROM public.codex_media_asset
WHERE (media_key LIKE 'measures_registry_glyph_%'
    OR media_key LIKE 'measures_registry_mark_%'
    OR media_key LIKE 'measures_registry_seal_%'
    OR media_key LIKE 'measures_registry_badge_%')
  AND storage_provider = 'supabase';
-- expected: 21

-- V5: all 21 have correct storage path prefixes
SELECT
  media_key,
  storage_path,
  CASE
    WHEN media_key LIKE '%_material_%'   AND storage_path LIKE 'glyphs/material/%' THEN 'OK'
    WHEN media_key LIKE '%_chamber_%'    AND storage_path LIKE 'glyphs/chamber/%'  THEN 'OK'
    WHEN media_key LIKE '%_circuit_%'    AND storage_path LIKE 'glyphs/circuit/%'  THEN 'OK'
    WHEN media_key LIKE '%_mark_%'       AND storage_path LIKE 'glyphs/seals/%'    THEN 'OK'
    WHEN media_key LIKE '%_seal_%'       AND storage_path LIKE 'glyphs/seals/%'    THEN 'OK'
    WHEN media_key LIKE '%_badge_%'      AND storage_path LIKE 'glyphs/seals/%'    THEN 'OK'
    ELSE 'PATH_MISMATCH'
  END AS v5_path_check
FROM public.codex_media_asset
WHERE media_key LIKE 'measures_registry_%'
  AND (media_key LIKE '%_glyph_%' OR media_key LIKE '%_mark_%'
       OR media_key LIKE '%_seal_%' OR media_key LIKE '%_badge_%')
ORDER BY media_key;
-- expected: all OK

-- V6: no duplicate media_keys
SELECT media_key, count(*) AS ct
FROM public.codex_media_asset
WHERE (media_key LIKE 'measures_registry_glyph_%'
    OR media_key LIKE 'measures_registry_mark_%'
    OR media_key LIKE 'measures_registry_seal_%'
    OR media_key LIKE 'measures_registry_badge_%')
GROUP BY media_key
HAVING count(*) > 1;
-- expected: 0 rows

-- V7: all 21 status = inactive
SELECT count(*) AS v7_inactive_count
FROM public.codex_media_asset
WHERE (media_key LIKE 'measures_registry_glyph_%'
    OR media_key LIKE 'measures_registry_mark_%'
    OR media_key LIKE 'measures_registry_seal_%'
    OR media_key LIKE 'measures_registry_badge_%')
  AND status = 'inactive';
-- expected: 21

-- V8: all metadata activation_status = inactive_for_runtime
SELECT count(*) AS v8_activation_status_count
FROM public.codex_media_asset
WHERE (media_key LIKE 'measures_registry_glyph_%'
    OR media_key LIKE 'measures_registry_mark_%'
    OR media_key LIKE 'measures_registry_seal_%'
    OR media_key LIKE 'measures_registry_badge_%')
  AND metadata->>'activation_status' = 'inactive_for_runtime';
-- expected: 21

-- V9: all metadata authority_status = reference_only
SELECT count(*) AS v9_authority_status_count
FROM public.codex_media_asset
WHERE (media_key LIKE 'measures_registry_glyph_%'
    OR media_key LIKE 'measures_registry_mark_%'
    OR media_key LIKE 'measures_registry_seal_%'
    OR media_key LIKE 'measures_registry_badge_%')
  AND metadata->>'authority_status' = 'reference_only';
-- expected: 21

-- V10: all metadata runtime_status = not_rendered_until_runtime_oar2
SELECT count(*) AS v10_runtime_status_count
FROM public.codex_media_asset
WHERE (media_key LIKE 'measures_registry_glyph_%'
    OR media_key LIKE 'measures_registry_mark_%'
    OR media_key LIKE 'measures_registry_seal_%'
    OR media_key LIKE 'measures_registry_badge_%')
  AND metadata->>'runtime_status' = 'not_rendered_until_runtime_oar2';
-- expected: 21

-- V11: circuit glyphs proof_required = delivery_contract_state (4 rows)
SELECT count(*) AS v11_circuit_proof_required_count
FROM public.codex_media_asset
WHERE media_key LIKE 'measures_registry_glyph_circuit_%'
  AND metadata->>'proof_required' = 'delivery_contract_state';
-- expected: 4

-- V12: verified assessment seal proof_required = assessment_completion_proof
SELECT media_key, metadata->>'proof_required' AS proof_required
FROM public.codex_media_asset
WHERE media_key = 'measures_registry_seal_verified_assessment_v1';
-- expected: assessment_completion_proof

-- V13: delivery contract seal proof_required = delivery_contract_state
SELECT media_key, metadata->>'proof_required' AS proof_required
FROM public.codex_media_asset
WHERE media_key = 'measures_registry_seal_delivery_contract_v1';
-- expected: delivery_contract_state

-- V14: brand mark usage_scope = surface_identification_only
SELECT media_key, metadata->>'usage_scope' AS usage_scope
FROM public.codex_media_asset
WHERE media_key = 'measures_registry_mark_v1';
-- expected: surface_identification_only

-- V15: measures_media_map unchanged — no surface mapping rows inserted by this route
SELECT count(*) AS v15_measures_media_map_unchanged
FROM public.measures_media_map
WHERE registry_key LIKE 'measures_registry_glyph_%'
   OR registry_key LIKE 'measures_registry_mark_%'
   OR registry_key LIKE 'measures_registry_seal_%'
   OR registry_key LIKE 'measures_registry_badge_%';
-- expected: 0 (no surface mapping yet)

-- V16: all 21 storage paths end in .svg
SELECT count(*) AS v16_svg_extension_count
FROM public.codex_media_asset
WHERE (media_key LIKE 'measures_registry_glyph_%'
    OR media_key LIKE 'measures_registry_mark_%'
    OR media_key LIKE 'measures_registry_seal_%'
    OR media_key LIKE 'measures_registry_badge_%')
  AND storage_path LIKE '%.svg';
-- expected: 21

-- V17: source_oar2 consistent across all 21
SELECT count(*) AS v17_source_oar2_consistent
FROM public.codex_media_asset
WHERE (media_key LIKE 'measures_registry_glyph_%'
    OR media_key LIKE 'measures_registry_mark_%'
    OR media_key LIKE 'measures_registry_seal_%'
    OR media_key LIKE 'measures_registry_badge_%')
  AND metadata->>'source_oar2' = 'oar2_measures_registry_glyph_codex_media_asset_seating_v1';
-- expected: 21

-- V18: full seated row summary
SELECT
  media_key,
  title,
  storage_path,
  status,
  metadata->>'asset_class'        AS asset_class,
  metadata->>'activation_status'  AS activation_status,
  metadata->>'proof_required'     AS proof_required,
  created_at,
  updated_at
FROM public.codex_media_asset
WHERE (media_key LIKE 'measures_registry_glyph_%'
    OR media_key LIKE 'measures_registry_mark_%'
    OR media_key LIKE 'measures_registry_seal_%'
    OR media_key LIKE 'measures_registry_badge_%')
ORDER BY media_key;
-- expected: 21 rows, all inactive, all inactive_for_runtime

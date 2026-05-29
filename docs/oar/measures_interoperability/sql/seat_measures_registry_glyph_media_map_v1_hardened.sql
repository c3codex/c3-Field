-- ============================================================
-- Measures Registry Glyph measures_media_map Surface Mapping v1
-- OAR2: oar2_measures_registry_glyph_measures_media_map_surface_mapping_v1
-- Route: measures_interoperability
-- Date: 2026-05-28
-- ============================================================
-- BOUNDARY: seats 21 glyph surface mapping rows as inactive/reference-only.
-- Does NOT activate any row (is_active = false on all rows).
-- Does NOT modify codex_media_asset rows.
-- Does NOT modify runtime files, CSS files, or any other table.
-- Does NOT activate seals, badges, circuits, payments, or recognition.
-- UPSERT keyed by (registry_key, coalesce(encounter_key,''), coalesce(campaign_key,''), media_role, storage_path).
-- Safe to re-run.
-- ============================================================
-- Column values applied to all 21 rows:
--   registry_key   = 'measures_registry_glyphs'
--   campaign_key   = 'measures_registry_v1'
--   storage_bucket = 'measures-registry'
--   mime_type      = 'image/svg+xml'
--   is_active      = false
-- ============================================================


-- ============================================================
-- PREFLIGHT
-- ============================================================

-- P1: confirm measures_media_map table exists and show live columns
SELECT
  column_name,
  data_type,
  is_nullable,
  column_default
FROM information_schema.columns
WHERE table_schema = 'public'
  AND table_name   = 'measures_media_map'
ORDER BY ordinal_position;

-- P2: confirm no glyph rows already seated (pre-insert state)
SELECT
  registry_key,
  encounter_key,
  campaign_key,
  media_role,
  storage_path,
  is_active,
  created_at
FROM public.measures_media_map
WHERE registry_key = 'measures_registry_glyphs'
ORDER BY sort_order;

-- P3: confirm total existing measures_media_map row count (should not change for non-glyph rows)
SELECT count(*) AS total_existing_rows
FROM public.measures_media_map;

-- P4: confirm all 21 codex_media_asset source rows are seated
SELECT count(*) AS seated_media_asset_count
FROM public.codex_media_asset
WHERE (media_key LIKE 'measures_registry_glyph_%'
    OR media_key LIKE 'measures_registry_mark_%'
    OR media_key LIKE 'measures_registry_seal_%'
    OR media_key LIKE 'measures_registry_badge_%');
-- expected: 21


-- ============================================================
-- UPSERT — 21 glyph measures_media_map rows
-- ============================================================

INSERT INTO public.measures_media_map (
  registry_key,
  encounter_key,
  campaign_key,
  media_role,
  storage_bucket,
  storage_path,
  mime_type,
  sort_order,
  is_active,
  metadata
)
VALUES

-- ── Material Glyphs (4 rows) ──────────────────────────────

(
  'measures_registry_glyphs',
  'obsidian_assessment_gate',
  'measures_registry_v1',
  'glyph_material_obsidian',
  'measures-registry',
  'glyphs/material/measures_registry_glyph_material_obsidian_v1.svg',
  'image/svg+xml',
  1,
  false,
  '{
    "source_oar2": "oar2_measures_registry_glyph_measures_media_map_surface_mapping_v1",
    "media_key": "measures_registry_glyph_material_obsidian_v1",
    "asset_type": "material_glyph",
    "activation_status": "inactive_for_runtime",
    "authority_status": "reference_only",
    "runtime_status": "not_rendered_until_runtime_oar2",
    "proof_required": "media_asset_validation"
  }'::jsonb
),

(
  'measures_registry_glyphs',
  'crystal_lapis_c3_map',
  'measures_registry_v1',
  'glyph_material_crystal',
  'measures-registry',
  'glyphs/material/measures_registry_glyph_material_crystal_v1.svg',
  'image/svg+xml',
  2,
  false,
  '{
    "source_oar2": "oar2_measures_registry_glyph_measures_media_map_surface_mapping_v1",
    "media_key": "measures_registry_glyph_material_crystal_v1",
    "asset_type": "material_glyph",
    "activation_status": "inactive_for_runtime",
    "authority_status": "reference_only",
    "runtime_status": "not_rendered_until_runtime_oar2",
    "proof_required": "media_asset_validation"
  }'::jsonb
),

(
  'measures_registry_glyphs',
  'lapis_relational',
  'measures_registry_v1',
  'glyph_material_lapis',
  'measures-registry',
  'glyphs/material/measures_registry_glyph_material_lapis_v1.svg',
  'image/svg+xml',
  3,
  false,
  '{
    "source_oar2": "oar2_measures_registry_glyph_measures_media_map_surface_mapping_v1",
    "media_key": "measures_registry_glyph_material_lapis_v1",
    "asset_type": "material_glyph",
    "activation_status": "inactive_for_runtime",
    "authority_status": "reference_only",
    "runtime_status": "not_rendered_until_runtime_oar2",
    "proof_required": "media_asset_validation"
  }'::jsonb
),

(
  'measures_registry_glyphs',
  'marble_commerced_circuit',
  'measures_registry_v1',
  'glyph_material_marble',
  'measures-registry',
  'glyphs/material/measures_registry_glyph_material_marble_v1.svg',
  'image/svg+xml',
  4,
  false,
  '{
    "source_oar2": "oar2_measures_registry_glyph_measures_media_map_surface_mapping_v1",
    "media_key": "measures_registry_glyph_material_marble_v1",
    "asset_type": "material_glyph",
    "activation_status": "inactive_for_runtime",
    "authority_status": "reference_only",
    "runtime_status": "not_rendered_until_runtime_oar2",
    "proof_required": "media_asset_validation"
  }'::jsonb
),

-- ── Chamber Glyphs (9 rows) ───────────────────────────────

(
  'measures_registry_glyphs',
  'epigraph',
  'measures_registry_v1',
  'glyph_chamber_epigraph',
  'measures-registry',
  'glyphs/chamber/measures_registry_glyph_chamber_epigraph_v1.svg',
  'image/svg+xml',
  5,
  false,
  '{
    "source_oar2": "oar2_measures_registry_glyph_measures_media_map_surface_mapping_v1",
    "media_key": "measures_registry_glyph_chamber_epigraph_v1",
    "asset_type": "chamber_glyph",
    "activation_status": "inactive_for_runtime",
    "authority_status": "reference_only",
    "runtime_status": "not_rendered_until_runtime_oar2",
    "proof_required": "media_asset_validation"
  }'::jsonb
),

(
  'measures_registry_glyphs',
  'temple_path',
  'measures_registry_v1',
  'glyph_chamber_temple_path',
  'measures-registry',
  'glyphs/chamber/measures_registry_glyph_chamber_temple_path_v1.svg',
  'image/svg+xml',
  6,
  false,
  '{
    "source_oar2": "oar2_measures_registry_glyph_measures_media_map_surface_mapping_v1",
    "media_key": "measures_registry_glyph_chamber_temple_path_v1",
    "asset_type": "chamber_glyph",
    "activation_status": "inactive_for_runtime",
    "authority_status": "reference_only",
    "runtime_status": "not_rendered_until_runtime_oar2",
    "proof_required": "media_asset_validation"
  }'::jsonb
),

(
  'measures_registry_glyphs',
  'lapis_relational',
  'measures_registry_v1',
  'glyph_chamber_lapis_relational',
  'measures-registry',
  'glyphs/chamber/measures_registry_glyph_chamber_lapis_relational_v1.svg',
  'image/svg+xml',
  7,
  false,
  '{
    "source_oar2": "oar2_measures_registry_glyph_measures_media_map_surface_mapping_v1",
    "media_key": "measures_registry_glyph_chamber_lapis_relational_v1",
    "asset_type": "chamber_glyph",
    "activation_status": "inactive_for_runtime",
    "authority_status": "reference_only",
    "runtime_status": "not_rendered_until_runtime_oar2",
    "proof_required": "media_asset_validation"
  }'::jsonb
),

(
  'measures_registry_glyphs',
  'crystal_lapis_c3_map',
  'measures_registry_v1',
  'glyph_chamber_c3_map',
  'measures-registry',
  'glyphs/chamber/measures_registry_glyph_chamber_c3_map_v1.svg',
  'image/svg+xml',
  8,
  false,
  '{
    "source_oar2": "oar2_measures_registry_glyph_measures_media_map_surface_mapping_v1",
    "media_key": "measures_registry_glyph_chamber_c3_map_v1",
    "asset_type": "chamber_glyph",
    "activation_status": "inactive_for_runtime",
    "authority_status": "reference_only",
    "runtime_status": "not_rendered_until_runtime_oar2",
    "proof_required": "media_asset_validation"
  }'::jsonb
),

(
  'measures_registry_glyphs',
  'obsidian_assessment_gate',
  'measures_registry_v1',
  'glyph_chamber_obsidian_assessment_gate',
  'measures-registry',
  'glyphs/chamber/measures_registry_glyph_chamber_obsidian_assessment_gate_v1.svg',
  'image/svg+xml',
  9,
  false,
  '{
    "source_oar2": "oar2_measures_registry_glyph_measures_media_map_surface_mapping_v1",
    "media_key": "measures_registry_glyph_chamber_obsidian_assessment_gate_v1",
    "asset_type": "chamber_glyph",
    "activation_status": "inactive_for_runtime",
    "authority_status": "reference_only",
    "runtime_status": "not_rendered_until_runtime_oar2",
    "proof_required": "media_asset_validation"
  }'::jsonb
),

(
  'measures_registry_glyphs',
  'marble_governance',
  'measures_registry_v1',
  'glyph_chamber_marble_governance',
  'measures-registry',
  'glyphs/chamber/measures_registry_glyph_chamber_marble_governance_v1.svg',
  'image/svg+xml',
  10,
  false,
  '{
    "source_oar2": "oar2_measures_registry_glyph_measures_media_map_surface_mapping_v1",
    "media_key": "measures_registry_glyph_chamber_marble_governance_v1",
    "asset_type": "chamber_glyph",
    "activation_status": "inactive_for_runtime",
    "authority_status": "reference_only",
    "runtime_status": "not_rendered_until_runtime_oar2",
    "proof_required": "media_asset_validation"
  }'::jsonb
),

(
  'measures_registry_glyphs',
  'marble_commerced_circuit',
  'measures_registry_v1',
  'glyph_chamber_marble_commerced_circuit',
  'measures-registry',
  'glyphs/chamber/measures_registry_glyph_chamber_marble_commerced_circuit_v1.svg',
  'image/svg+xml',
  11,
  false,
  '{
    "source_oar2": "oar2_measures_registry_glyph_measures_media_map_surface_mapping_v1",
    "media_key": "measures_registry_glyph_chamber_marble_commerced_circuit_v1",
    "asset_type": "chamber_glyph",
    "activation_status": "inactive_for_runtime",
    "authority_status": "reference_only",
    "runtime_status": "not_rendered_until_runtime_oar2",
    "proof_required": "media_asset_validation"
  }'::jsonb
),

(
  'measures_registry_glyphs',
  'right_path_media_passage',
  'measures_registry_v1',
  'glyph_chamber_media_passage',
  'measures-registry',
  'glyphs/chamber/measures_registry_glyph_chamber_media_passage_v1.svg',
  'image/svg+xml',
  12,
  false,
  '{
    "source_oar2": "oar2_measures_registry_glyph_measures_media_map_surface_mapping_v1",
    "media_key": "measures_registry_glyph_chamber_media_passage_v1",
    "asset_type": "chamber_glyph",
    "activation_status": "inactive_for_runtime",
    "authority_status": "reference_only",
    "runtime_status": "not_rendered_until_runtime_oar2",
    "proof_required": "media_asset_validation"
  }'::jsonb
),

(
  'measures_registry_glyphs',
  'lapis_interoperability',
  'measures_registry_v1',
  'glyph_chamber_lapis_interoperability',
  'measures-registry',
  'glyphs/chamber/measures_registry_glyph_chamber_lapis_interoperability_v1.svg',
  'image/svg+xml',
  13,
  false,
  '{
    "source_oar2": "oar2_measures_registry_glyph_measures_media_map_surface_mapping_v1",
    "media_key": "measures_registry_glyph_chamber_lapis_interoperability_v1",
    "asset_type": "chamber_glyph",
    "activation_status": "inactive_for_runtime",
    "authority_status": "reference_only",
    "runtime_status": "not_rendered_until_runtime_oar2",
    "proof_required": "media_asset_validation"
  }'::jsonb
),

-- ── Circuit Glyphs (4 rows) ───────────────────────────────

(
  'measures_registry_glyphs',
  'c1',
  'measures_registry_v1',
  'glyph_circuit_c1',
  'measures-registry',
  'glyphs/circuit/measures_registry_glyph_circuit_c1_v1.svg',
  'image/svg+xml',
  14,
  false,
  '{
    "source_oar2": "oar2_measures_registry_glyph_measures_media_map_surface_mapping_v1",
    "media_key": "measures_registry_glyph_circuit_c1_v1",
    "asset_type": "circuit_glyph",
    "activation_status": "inactive_for_runtime",
    "authority_status": "reference_only",
    "runtime_status": "not_rendered_until_runtime_oar2",
    "proof_required": "delivery_contract_state"
  }'::jsonb
),

(
  'measures_registry_glyphs',
  'c2',
  'measures_registry_v1',
  'glyph_circuit_c2',
  'measures-registry',
  'glyphs/circuit/measures_registry_glyph_circuit_c2_v1.svg',
  'image/svg+xml',
  15,
  false,
  '{
    "source_oar2": "oar2_measures_registry_glyph_measures_media_map_surface_mapping_v1",
    "media_key": "measures_registry_glyph_circuit_c2_v1",
    "asset_type": "circuit_glyph",
    "activation_status": "inactive_for_runtime",
    "authority_status": "reference_only",
    "runtime_status": "not_rendered_until_runtime_oar2",
    "proof_required": "delivery_contract_state"
  }'::jsonb
),

(
  'measures_registry_glyphs',
  'c3',
  'measures_registry_v1',
  'glyph_circuit_c3',
  'measures-registry',
  'glyphs/circuit/measures_registry_glyph_circuit_c3_v1.svg',
  'image/svg+xml',
  16,
  false,
  '{
    "source_oar2": "oar2_measures_registry_glyph_measures_media_map_surface_mapping_v1",
    "media_key": "measures_registry_glyph_circuit_c3_v1",
    "asset_type": "circuit_glyph",
    "activation_status": "inactive_for_runtime",
    "authority_status": "reference_only",
    "runtime_status": "not_rendered_until_runtime_oar2",
    "proof_required": "delivery_contract_state"
  }'::jsonb
),

(
  'measures_registry_glyphs',
  '3x33',
  'measures_registry_v1',
  'glyph_circuit_3x33',
  'measures-registry',
  'glyphs/circuit/measures_registry_glyph_circuit_3x33_v1.svg',
  'image/svg+xml',
  17,
  false,
  '{
    "source_oar2": "oar2_measures_registry_glyph_measures_media_map_surface_mapping_v1",
    "media_key": "measures_registry_glyph_circuit_3x33_v1",
    "asset_type": "circuit_glyph",
    "activation_status": "inactive_for_runtime",
    "authority_status": "reference_only",
    "runtime_status": "not_rendered_until_runtime_oar2",
    "proof_required": "delivery_contract_state"
  }'::jsonb
),

-- ── Seals / Badge / Brand Mark (4 rows) ───────────────────

(
  'measures_registry_glyphs',
  null,
  'measures_registry_v1',
  'glyph_mark',
  'measures-registry',
  'glyphs/seals/measures_registry_mark_v1.svg',
  'image/svg+xml',
  18,
  false,
  '{
    "source_oar2": "oar2_measures_registry_glyph_measures_media_map_surface_mapping_v1",
    "media_key": "measures_registry_mark_v1",
    "asset_type": "identity_mark",
    "activation_status": "inactive_for_runtime",
    "authority_status": "reference_only",
    "runtime_status": "not_rendered_until_runtime_oar2",
    "proof_required": "none"
  }'::jsonb
),

(
  'measures_registry_glyphs',
  null,
  'measures_registry_v1',
  'glyph_seal_verified_assessment',
  'measures-registry',
  'glyphs/seals/measures_registry_seal_verified_assessment_v1.svg',
  'image/svg+xml',
  19,
  false,
  '{
    "source_oar2": "oar2_measures_registry_glyph_measures_media_map_surface_mapping_v1",
    "media_key": "measures_registry_seal_verified_assessment_v1",
    "asset_type": "verified_assessment_seal",
    "activation_status": "inactive_for_runtime",
    "authority_status": "reference_only",
    "runtime_status": "not_rendered_until_runtime_oar2",
    "proof_required": "assessment_completion_proof"
  }'::jsonb
),

(
  'measures_registry_glyphs',
  null,
  'measures_registry_v1',
  'glyph_seal_delivery_contract',
  'measures-registry',
  'glyphs/seals/measures_registry_seal_delivery_contract_v1.svg',
  'image/svg+xml',
  20,
  false,
  '{
    "source_oar2": "oar2_measures_registry_glyph_measures_media_map_surface_mapping_v1",
    "media_key": "measures_registry_seal_delivery_contract_v1",
    "asset_type": "delivery_contract_seal",
    "activation_status": "inactive_for_runtime",
    "authority_status": "reference_only",
    "runtime_status": "not_rendered_until_runtime_oar2",
    "proof_required": "delivery_contract_state"
  }'::jsonb
),

(
  'measures_registry_glyphs',
  null,
  'measures_registry_v1',
  'glyph_badge_held_placeholder',
  'measures-registry',
  'glyphs/seals/measures_registry_badge_held_placeholder_v1.svg',
  'image/svg+xml',
  21,
  false,
  '{
    "source_oar2": "oar2_measures_registry_glyph_measures_media_map_surface_mapping_v1",
    "media_key": "measures_registry_badge_held_placeholder_v1",
    "asset_type": "held_placeholder_badge",
    "activation_status": "inactive_for_runtime",
    "authority_status": "reference_only",
    "runtime_status": "not_rendered_until_runtime_oar2",
    "proof_required": "none"
  }'::jsonb
)

ON CONFLICT (registry_key, coalesce(encounter_key, ''), coalesce(campaign_key, ''), media_role, storage_path)
DO UPDATE SET
  storage_bucket = EXCLUDED.storage_bucket,
  mime_type      = EXCLUDED.mime_type,
  sort_order     = EXCLUDED.sort_order,
  is_active      = false,
  metadata       = EXCLUDED.metadata,
  updated_at     = now()
WHERE public.measures_media_map.is_active = false;


-- ============================================================
-- VALIDATION — 10 checks
-- ============================================================

-- V1: total glyph rows in measures_media_map
SELECT count(*) AS v1_total_glyph_rows
FROM public.measures_media_map
WHERE registry_key = 'measures_registry_glyphs';
-- expected: 21

-- V2: all 21 expected media_roles present
SELECT
  r.expected_role,
  mmm.media_role IS NOT NULL AS is_seated
FROM (VALUES
  ('glyph_material_obsidian'),
  ('glyph_material_crystal'),
  ('glyph_material_lapis'),
  ('glyph_material_marble'),
  ('glyph_chamber_epigraph'),
  ('glyph_chamber_temple_path'),
  ('glyph_chamber_lapis_relational'),
  ('glyph_chamber_c3_map'),
  ('glyph_chamber_obsidian_assessment_gate'),
  ('glyph_chamber_marble_governance'),
  ('glyph_chamber_marble_commerced_circuit'),
  ('glyph_chamber_media_passage'),
  ('glyph_chamber_lapis_interoperability'),
  ('glyph_circuit_c1'),
  ('glyph_circuit_c2'),
  ('glyph_circuit_c3'),
  ('glyph_circuit_3x33'),
  ('glyph_mark'),
  ('glyph_seal_verified_assessment'),
  ('glyph_seal_delivery_contract'),
  ('glyph_badge_held_placeholder')
) AS r(expected_role)
LEFT JOIN public.measures_media_map mmm
  ON mmm.registry_key = 'measures_registry_glyphs'
  AND mmm.media_role   = r.expected_role
ORDER BY r.expected_role;
-- expected: all is_seated = true

-- V3: all 21 rows have is_active = false
SELECT count(*) AS v3_inactive_count
FROM public.measures_media_map
WHERE registry_key = 'measures_registry_glyphs'
  AND is_active = false;
-- expected: 21

-- V4: all 21 rows have registry_key = measures_registry_glyphs
SELECT count(*) AS v4_registry_key_count
FROM public.measures_media_map
WHERE registry_key = 'measures_registry_glyphs';
-- expected: 21

-- V5: all 21 rows have campaign_key = measures_registry_v1
SELECT count(*) AS v5_campaign_key_count
FROM public.measures_media_map
WHERE registry_key  = 'measures_registry_glyphs'
  AND campaign_key  = 'measures_registry_v1';
-- expected: 21

-- V6: all 21 rows have mime_type = image/svg+xml
SELECT count(*) AS v6_mime_type_count
FROM public.measures_media_map
WHERE registry_key = 'measures_registry_glyphs'
  AND mime_type    = 'image/svg+xml';
-- expected: 21

-- V7: all 21 storage paths end in .svg
SELECT count(*) AS v7_svg_path_count
FROM public.measures_media_map
WHERE registry_key  = 'measures_registry_glyphs'
  AND storage_path LIKE '%.svg';
-- expected: 21

-- V8: all 21 use storage_bucket measures-registry
SELECT count(*) AS v8_bucket_count
FROM public.measures_media_map
WHERE registry_key   = 'measures_registry_glyphs'
  AND storage_bucket = 'measures-registry';
-- expected: 21

-- V9: circuit glyph rows have proof_required = delivery_contract_state (4 rows)
SELECT count(*) AS v9_circuit_proof_required
FROM public.measures_media_map
WHERE registry_key = 'measures_registry_glyphs'
  AND media_role   LIKE 'glyph_circuit_%'
  AND metadata->>'proof_required' = 'delivery_contract_state';
-- expected: 4

-- V10: full seated row summary
SELECT
  media_role,
  encounter_key,
  storage_path,
  is_active,
  metadata->>'asset_type'          AS asset_type,
  metadata->>'activation_status'   AS activation_status,
  metadata->>'proof_required'      AS proof_required,
  created_at,
  updated_at
FROM public.measures_media_map
WHERE registry_key = 'measures_registry_glyphs'
ORDER BY sort_order;
-- expected: 21 rows, all is_active = false, all inactive_for_runtime

-- Release MAP C2 circuit and update map_integrity_governance pathway_cards with prices.
-- OAR2: inline — user-reported issue: MAP encounter has no price and no Stripe payment.
--
-- map_c2_circuit.release_state was 'held' — frontend query filters eq("release_state","active")
-- so no circuits returned. Stripe checkout never triggered.
--
-- Fix 1: set map_c2_circuit.release_state = 'active' for all three circuits.
-- Fix 2: replace pathway_cards in map_integrity_governance encounter def with full content
--         including price_label, map_pathway, circuit_key, applicable_standing_keys, deliverables.

-- ============================================================
-- 1. Release MAP C2 circuit
-- ============================================================

UPDATE public.map_c2_circuit
SET
  release_state = 'active',
  updated_at = now()
WHERE map_circuit_key IN ('pre_deployment', 'optimization', 'remediation');

-- ============================================================
-- 2. Replace pathway_cards in map_integrity_governance encounter def
-- ============================================================

UPDATE measures_encounter_def
SET metadata = jsonb_set(
  metadata,
  '{pathway_cards}',
  jsonb_build_array(

    jsonb_build_object(
      'key',                    'pre_deployment',
      'circuit_key',            'pre_deployment',
      'map_pathway',            'foundational',
      'applicable_standing_keys', jsonb_build_array('eval_result_01'),
      'title',                  'MAP Foundational Review',
      'price_usd',              333,
      'price_label',            '$333',
      'body',                   'For organizations preparing to introduce AI into an existing operational environment.',
      'map_boundary',           'MAP reviews, identifies, and recommends. It does not implement system changes or create authority.',
      'access_boundary',        'Full MAP evaluation requires sufficient access to AI-influenced surfaces being reviewed. Sensitive material requires separate authorization.',
      'deliverables',           jsonb_build_array(
        'Environmental inventory and authority surface review',
        'AI deployment readiness assessment',
        'Structural alignment recommendations',
        'Governed pre-deployment pathway definition'
      ),
      'payment_boundary',       'MAP purchase opens the selected review pathway only. It creates no additional system standing or access.',
      'seat_hold_notice',       'A full SEAT agreement may be generated only after MAP the Environment is complete.',
      'cta',                    'Select Foundational Review',
      'recommended',            false
    ),

    jsonb_build_object(
      'key',                    'optimization',
      'circuit_key',            'optimization',
      'map_pathway',            'optimization',
      'applicable_standing_keys', jsonb_build_array('eval_result_02'),
      'title',                  'MAP Optimization Review',
      'price_usd',              777,
      'price_label',            '$777',
      'body',                   'For organizations already using AI and seeking clearer system integrity, role boundaries, and operational coherence.',
      'map_boundary',           'MAP reviews, identifies, and recommends. It does not implement system changes or create authority.',
      'access_boundary',        'Full MAP evaluation requires sufficient access to AI-influenced surfaces being reviewed. Sensitive material requires separate authorization.',
      'deliverables',           jsonb_build_array(
        'Operational fragmentation analysis',
        'Role and process clarity review',
        'AI governance gap identification',
        'Structured optimization pathway recommendations'
      ),
      'payment_boundary',       'MAP purchase opens the selected review pathway only. It creates no additional system standing or access.',
      'seat_hold_notice',       'A full SEAT agreement may be generated only after MAP the Environment is complete.',
      'cta',                    'Select Optimization Review',
      'recommended',            false
    ),

    jsonb_build_object(
      'key',                    'remediation',
      'circuit_key',            'remediation',
      'map_pathway',            'remediation',
      'applicable_standing_keys', jsonb_build_array('eval_result_03', 'eval_result_04'),
      'title',                  'MAP Remediation Review',
      'price_usd',              999,
      'price_label',            '$999',
      'body',                   'For organizations experiencing drift, failed automation, unclear ownership, or AI processes that no longer remain governable.',
      'map_boundary',           'MAP reviews, identifies, and recommends. It does not implement system changes or create authority.',
      'access_boundary',        'Full MAP evaluation requires sufficient access to AI-influenced surfaces being reviewed. Sensitive material requires separate authorization.',
      'deliverables',           jsonb_build_array(
        'Drift pattern and failure root cause identification',
        'AI process ownership and authority gap analysis',
        'Remediation sequencing and stabilization recommendations',
        'Governed remediation pathway definition'
      ),
      'payment_boundary',       'MAP purchase opens the selected review pathway only. It creates no additional system standing or access.',
      'seat_hold_notice',       'A full SEAT agreement may be generated only after MAP the Environment is complete.',
      'cta',                    'Select Remediation Review',
      'recommended',            false
    )

  ),
  true
)
WHERE encounter_key = 'map_integrity_governance';

-- ============================================================
-- VALIDATION
-- ============================================================

DO $$
DECLARE
  active_count int;
  card_count   int;
BEGIN

  SELECT COUNT(*) INTO active_count
  FROM public.map_c2_circuit
  WHERE release_state = 'active';

  IF active_count < 3 THEN
    RAISE EXCEPTION 'Validation failed: map_c2_circuit active count = % (expected 3)', active_count;
  END IF;

  SELECT jsonb_array_length(metadata->'pathway_cards') INTO card_count
  FROM measures_encounter_def
  WHERE encounter_key = 'map_integrity_governance';

  IF card_count IS NULL OR card_count < 3 THEN
    RAISE EXCEPTION 'Validation failed: pathway_cards count = % (expected 3)', card_count;
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM measures_encounter_def
    WHERE encounter_key = 'map_integrity_governance'
      AND metadata #>> '{pathway_cards,0,price_label}' = '$333'
      AND metadata #>> '{pathway_cards,1,price_label}' = '$777'
      AND metadata #>> '{pathway_cards,2,price_label}' = '$999'
  ) THEN
    RAISE EXCEPTION 'Validation failed: pathway_cards price_labels not seated correctly';
  END IF;

END $$;

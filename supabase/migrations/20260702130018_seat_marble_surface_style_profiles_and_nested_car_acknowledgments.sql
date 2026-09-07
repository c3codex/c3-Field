-- Seat Marble surface style profiles and nested CAR acknowledgments.
-- Source OAR2: oar2_seat_marble_surface_style_profiles_and_nested_car_acknowledgments_v1
-- Fix: surface_type = 'threshold' (not 'results' — check constraint)

-- ============================================================
-- STEP 1: Media rows for surface backgrounds
-- ============================================================

INSERT INTO public.measures_media_map (
  id, registry_key, encounter_key, campaign_key,
  media_role, storage_bucket, storage_path, mime_type,
  sort_order, is_active, metadata, created_at, updated_at
) VALUES
(
  gen_random_uuid(),
  'marble_chamber_orientation', 'marble_chamber_orientation',
  'measures_registry_root_authority_v1',
  'marble_orientation_surface',
  'measures-registry', 'marble_orientation_surface.webp',
  'image/webp', 40, true,
  '{"surface_role": "marble_chamber_orientation", "panel_role": "background_panel", "source_oar2": "oar2_seat_marble_surface_style_profiles_and_nested_car_acknowledgments_v1"}'::jsonb,
  now(), now()
),
(
  gen_random_uuid(),
  'marble_chamber_results', 'marble_chamber_results',
  'measures_registry_root_authority_v1',
  'marble_results_surface',
  'measures-registry', 'marble_results_surface.webp',
  'image/webp', 41, true,
  '{"surface_role": "marble_chamber_results", "panel_role": "background_panel", "source_oar2": "oar2_seat_marble_surface_style_profiles_and_nested_car_acknowledgments_v1"}'::jsonb,
  now(), now()
),
(
  gen_random_uuid(),
  'map_integrity_governance', 'map_integrity_governance',
  'measures_registry_root_authority_v1',
  'marble_map_surface',
  'measures-registry', 'map_surface.webp',
  'image/webp', 42, true,
  '{"surface_role": "marble_chamber_C2_compact", "panel_role": "background_panel", "source_oar2": "oar2_seat_marble_surface_style_profiles_and_nested_car_acknowledgments_v1"}'::jsonb,
  now(), now()
)
ON CONFLICT DO NOTHING;

-- ============================================================
-- STEP 2: Register marble_chamber_results surface
-- ============================================================

INSERT INTO public.measures_registry (
  registry_key, display_title, registry_family,
  release_state, access_state, is_active, metadata
) VALUES (
  'marble_chamber_results',
  'Marble Chamber Results',
  'spine',
  'released',
  'encounterable',
  true,
  $json${
    "native_key": "marble_chamber_results",
    "chamber_assignment": "marble",
    "encounter_role": "assessment_findings_results",
    "style_profile": "marble_results_surface_profile",
    "source_oar2": "oar2_seat_marble_surface_style_profiles_and_nested_car_acknowledgments_v1"
  }$json$::jsonb
) ON CONFLICT (registry_key) DO NOTHING;

INSERT INTO public.measures_encounter_def (
  registry_id, encounter_key, display_title,
  encounter_type, material_family, surface_type,
  is_active, metadata
)
SELECT id, 'marble_chamber_results', 'Assessment Findings',
  'view', 'marble', 'threshold', true,
  $json${
    "content_profile": {
      "title": "Assessment Findings",
      "cta_label": "Continue to MAP"
    },
    "media_locator": {
      "primary_media_role": "marble_results_surface"
    },
    "directory_key": "marble_chamber_directory",
    "style_profile": "marble_results_surface_profile",
    "source_oar2": "oar2_seat_marble_surface_style_profiles_and_nested_car_acknowledgments_v1"
  }$json$::jsonb
FROM public.measures_registry
WHERE registry_key = 'marble_chamber_results'
ON CONFLICT (encounter_key) DO NOTHING;

INSERT INTO public.measures_encounter_surface_assignment (
  surface_key, registry_key, encounter_key,
  material_identity, chamber_assignment,
  public_routes, metadata
) VALUES (
  'marble_chamber_results',
  'marble_chamber_results',
  'marble_chamber_results',
  'marble',
  'marble',
  '{}',
  $json${
    "profile": "marble_results_surface_profile",
    "style_profile": "marble_results_surface_profile",
    "directory_key": "marble_chamber_directory",
    "source_oar2": "oar2_seat_marble_surface_style_profiles_and_nested_car_acknowledgments_v1"
  }$json$::jsonb
) ON CONFLICT (surface_key) DO NOTHING;

-- ============================================================
-- STEP 3: Seat style profiles on 5 marble surface assignments
-- ============================================================

UPDATE public.measures_encounter_surface_assignment
SET metadata = COALESCE(metadata, '{}'::jsonb) || '{"style_profile": "marble_orientation_surface_profile"}'::jsonb
WHERE surface_key = 'marble_chamber_orientation';

UPDATE public.measures_encounter_surface_assignment
SET metadata = COALESCE(metadata, '{}'::jsonb) || '{"style_profile": "marble_results_surface_profile"}'::jsonb
WHERE surface_key = 'marble_chamber_results';

UPDATE public.measures_encounter_surface_assignment
SET metadata = COALESCE(metadata, '{}'::jsonb) || '{"style_profile": "marble_map_surface_profile"}'::jsonb
WHERE surface_key = 'marble_chamber_C2_compact';

UPDATE public.measures_encounter_surface_assignment
SET metadata = COALESCE(metadata, '{}'::jsonb) || '{"style_profile": "marble_payment_surface_profile"}'::jsonb
WHERE surface_key = 'marble_chamber_C2_agreement';

UPDATE public.measures_encounter_surface_assignment
SET metadata = COALESCE(metadata, '{}'::jsonb) || '{"style_profile": "marble_confirmation_surface_profile"}'::jsonb
WHERE surface_key = 'marble_chamber_C2_resolution';

-- ============================================================
-- STEP 4: Seat c3_7_acknowledgment and center_panel
-- ============================================================

UPDATE public.measures_encounter_def
SET metadata = metadata || $json${
  "center_panel": {
    "heading": "MAP the Environment",
    "subheading": "Measure • Audit • Prepare"
  },
  "c3_7_acknowledgment": {
    "label": "Acknowledgments",
    "instruction": "Open, read, and confirm each acknowledgment to continue to payment.",
    "units": [
      {
        "key": "parties",
        "title": "Parties",
        "body": "Measures Registry is the governed body conducting this MAP the Environment review. The submitting organization is the party receiving findings, recommendations, and governed pathway definition. This acknowledgment identifies the parties to this engagement."
      },
      {
        "key": "scope",
        "title": "Scope",
        "body": "MAP the Environment covers: environmental inventory and authority surface review; AI deployment readiness assessment; structural alignment review; and governed pathway recommendations. MAP reviews, identifies, and recommends. MAP does not implement system changes, issue Registry Certification, establish SEAT standing, or activate c3 Field Optics."
      },
      {
        "key": "access_boundary",
        "title": "Access Boundary",
        "body": "Full MAP evaluation requires sufficient access to AI-influenced surfaces being reviewed. Access may be read-only, guided, screen-shared, exported, documented, or AI-assisted. Sensitive credentials, confidential contents, regulated records, or private client data are not transferred unless separately authorized and governed."
      },
      {
        "key": "review_method",
        "title": "Review Method",
        "body": "Review is conducted through structured environmental assessment and governed review methodology. Findings reflect conditions observed during the review period. Measures Registry uses a documented, reproducible methodology. Findings are not publicly disclosed without separate authorization."
      },
      {
        "key": "delivered_findings",
        "title": "Delivered Findings",
        "body": "Upon completion, delivered findings include the items defined in the selected MAP pathway. Findings are delivered through governed channels. No findings are shared publicly without separate authorization. Findings constitute a governed assessment output, not legal, regulatory, or compliance counsel."
      },
      {
        "key": "payment_of_scope",
        "title": "Payment of Scope",
        "body": "Payment authorizes the selected MAP review scope only. Payment does not create SEAT standing, issue Registry Certification, activate c3 Field Optics, establish c3 Key access, or authorize DAO participation. A SEAT Agreement may be generated only after MAP the Environment is complete and separately reviewed."
      },
      {
        "key": "receipt_and_access",
        "title": "Receipt and Access",
        "body": "Upon payment confirmation, a receipt will be issued to the provided contact email. Access to the MAP review process will be coordinated through Measures Registry. Scheduling preparation begins upon receipt confirmation. No additional standing is created by receipt of this confirmation."
      }
    ]
  }
}$json$::jsonb
WHERE encounter_key = 'map_integrity_governance';

-- ============================================================
-- STEP 5: Update marble_chamber_orientation content_profile
-- ============================================================

UPDATE public.measures_encounter_def
SET metadata = jsonb_set(
  COALESCE(metadata, '{}'::jsonb),
  '{content_profile}',
  COALESCE(metadata->'content_profile', '{}'::jsonb) || $json${
    "title": "Assessment Complete",
    "eyebrow": "ASSESSMENT COMPLETE",
    "body": "Environmental conditions have been identified.",
    "supporting": "Remain on this page while your findings and recommendations are prepared.",
    "status_label": "Generating Environmental Risk Report & Operations Review.",
    "cta_label": "Continue"
  }$json$::jsonb,
  true
)
WHERE encounter_key = 'marble_chamber_orientation';

-- ============================================================
-- STEP 6: Update marble_chamber_results content_profile
-- ============================================================

UPDATE public.measures_encounter_def
SET metadata = jsonb_set(
  COALESCE(metadata, '{}'::jsonb),
  '{content_profile}',
  COALESCE(metadata->'content_profile', '{}'::jsonb) || '{"cta_label": "Continue to MAP"}'::jsonb,
  true
)
WHERE encounter_key = 'marble_chamber_results';

-- ============================================================
-- STEP 7: Update encounter flow transitions
-- ============================================================

UPDATE public.measures_registry
SET metadata = jsonb_set(
  metadata,
  '{encounter_structure,marble_chamber_orientation,next_surface}',
  '"marble_chamber_results"'::jsonb,
  true
)
WHERE registry_key = 'measures_registry_root';

UPDATE public.measures_registry
SET metadata = jsonb_set(
  metadata,
  '{encounter_structure,marble_chamber_results}',
  $json${
    "next_surface": "marble_chamber_C2_compact",
    "source_oar2": "oar2_seat_marble_surface_style_profiles_and_nested_car_acknowledgments_v1"
  }$json$::jsonb,
  true
)
WHERE registry_key = 'measures_registry_root';

UPDATE public.measures_registry
SET metadata = jsonb_set(
  metadata,
  '{encounter_structure,marble_chamber_encounter,standing}',
  '"legacy_alias_for_marble_chamber_results"'::jsonb,
  true
)
WHERE registry_key = 'measures_registry_root';

UPDATE public.measures_registry
SET metadata = jsonb_set(
  metadata,
  '{encounter_structure,map_integrity_governance}',
  $json${
    "standing": "legacy_route_alias",
    "canonical_surface": "marble_chamber_C2_compact",
    "route_note": "/map-integrity-governance retained as legacy alias; Stripe success/cancel_url dependency prevents rename",
    "source_oar2": "oar2_seat_marble_surface_style_profiles_and_nested_car_acknowledgments_v1"
  }$json$::jsonb,
  true
)
WHERE registry_key = 'measures_registry_root';

-- ============================================================
-- VALIDATION
-- ============================================================

DO $$
DECLARE
  car_unit_count int;
  results_standing text;
  orientation_next text;
BEGIN
  SELECT jsonb_array_length(metadata #> '{c3_7_acknowledgment,units}')
  INTO car_unit_count
  FROM public.measures_encounter_def
  WHERE encounter_key = 'map_integrity_governance';

  IF car_unit_count IS NULL OR car_unit_count != 7 THEN
    RAISE EXCEPTION 'Validation failed: c3_7_acknowledgment unit count = % (expected 7)', car_unit_count;
  END IF;

  SELECT release_state INTO results_standing
  FROM public.measures_registry
  WHERE registry_key = 'marble_chamber_results';

  IF results_standing IS NULL OR results_standing != 'released' THEN
    RAISE EXCEPTION 'Validation failed: marble_chamber_results not released (got: %)', results_standing;
  END IF;

  SELECT metadata #>> '{encounter_structure,marble_chamber_orientation,next_surface}'
  INTO orientation_next
  FROM public.measures_registry
  WHERE registry_key = 'measures_registry_root';

  IF orientation_next != 'marble_chamber_results' THEN
    RAISE EXCEPTION 'Validation failed: marble_chamber_orientation.next_surface = % (expected marble_chamber_results)', orientation_next;
  END IF;
END $$;
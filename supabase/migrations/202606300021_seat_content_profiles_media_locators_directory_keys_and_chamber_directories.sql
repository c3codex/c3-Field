-- Seat content_profile, media_locator, directory_key for all 13 registered surfaces.
-- Seat 4 chamber directory records in measures_registry.
-- Seat assessment_report_orientation media row (gap placeholder — no source video yet).
-- Wire FREE consumption via surfaceAssignmentMetadata and encounter_def.metadata fields.
-- Source OAR2: docs/oar/measures_registry/oar2_seat_db_held_content_profiles_media_locators_directory_keys_and_free_consumption_v1.meta.md
--
-- No new public sequence. No passage activation. No report rewrite. No scoring change.
-- No payment rewrite. TypeScript/build validated in paired source changes.

-- ============================================================
-- STEP 1: Chamber directory records in measures_registry
-- ============================================================

INSERT INTO public.measures_registry (
  registry_key,
  display_title,
  registry_family,
  release_state,
  access_state,
  is_active,
  metadata
) VALUES
  (
    'crystal_seat_directory',
    'Crystal Seat Directory',
    'spine',
    'released',
    'encounterable',
    true,
    $json${
      "directory_key": "crystal_seat_directory",
      "chamber": "crystal_seat",
      "directory_surfaces": [
        "crystal_seat_intro",
        "crystal_seat_threshold",
        "crystal_seat_orientation",
        "crystal_seat_encounter"
      ],
      "surface_standing": {
        "crystal_seat_intro": "hot",
        "crystal_seat_threshold": "hot",
        "crystal_seat_orientation": "hot",
        "crystal_seat_encounter": "hot"
      },
      "source_oar2": "docs/oar/measures_registry/oar2_seat_db_held_content_profiles_media_locators_directory_keys_and_free_consumption_v1.meta.md"
    }$json$::jsonb
  ),
  (
    'lapis_chamber_directory',
    'Lapis Chamber Directory',
    'spine',
    'released',
    'encounterable',
    true,
    $json${
      "directory_key": "lapis_chamber_directory",
      "chamber": "lapis",
      "directory_surfaces": [
        "lapis_chamber_encounter"
      ],
      "surface_standing": {
        "lapis_chamber_encounter": "hot"
      },
      "source_oar2": "docs/oar/measures_registry/oar2_seat_db_held_content_profiles_media_locators_directory_keys_and_free_consumption_v1.meta.md"
    }$json$::jsonb
  ),
  (
    'obsidian_chamber_directory',
    'Obsidian Chamber Directory',
    'spine',
    'released',
    'encounterable',
    true,
    $json${
      "directory_key": "obsidian_chamber_directory",
      "chamber": "obsidian",
      "directory_surfaces": [
        "obsidian_chamber_orientation",
        "obsidian_chamber_encounter_surface",
        "obsidian_chamber_C1_compact"
      ],
      "surface_standing": {
        "obsidian_chamber_orientation": "hot",
        "obsidian_chamber_encounter_surface": "hot",
        "obsidian_chamber_C1_compact": "hot"
      },
      "source_oar2": "docs/oar/measures_registry/oar2_seat_db_held_content_profiles_media_locators_directory_keys_and_free_consumption_v1.meta.md"
    }$json$::jsonb
  ),
  (
    'marble_chamber_directory',
    'Marble Chamber Directory',
    'spine',
    'released',
    'encounterable',
    true,
    $json${
      "directory_key": "marble_chamber_directory",
      "chamber": "marble",
      "directory_surfaces": [
        "marble_chamber_orientation",
        "marble_chamber_encounter",
        "marble_chamber_C2_compact",
        "marble_chamber_C2_agreement",
        "marble_chamber_C2_resolution"
      ],
      "surface_standing": {
        "marble_chamber_orientation": "hot",
        "marble_chamber_encounter": "hot",
        "marble_chamber_C2_compact": "hot",
        "marble_chamber_C2_agreement": "hot",
        "marble_chamber_C2_resolution": "hot"
      },
      "gap": {
        "marble_chamber_orientation": "assessment_report_orientation media source not yet provided"
      },
      "source_oar2": "docs/oar/measures_registry/oar2_seat_db_held_content_profiles_media_locators_directory_keys_and_free_consumption_v1.meta.md"
    }$json$::jsonb
  )
ON CONFLICT (registry_key) DO NOTHING;

-- ============================================================
-- STEP 2: Seat content_profile, media_locator, directory_key
--         on each encounter_def row
-- ============================================================

-- crystal_seat_intro
-- encounter_def for the hook/intro video surface preceding crystal_seat_threshold.
UPDATE public.measures_encounter_def
SET metadata = COALESCE(metadata, '{}'::jsonb) || $json${
  "content_profile": {
    "surface_role": "media_intro",
    "title_source": "intro_copy.title",
    "content_authority": "encounter_def.metadata.intro_copy"
  },
  "media_locator": {
    "primary_media_role": "intro_hook_video"
  },
  "directory_key": "crystal_seat_directory"
}$json$::jsonb
WHERE encounter_key = 'crystal_seat_intro';

-- ai_isnt_broken_intro — serves crystal_seat_threshold and crystal_seat_orientation.
-- Content authority: intro_copy (title, subtitle) + threshold_copy (plaques, left/right copy).
-- Media: intro_hook_video + threshold hero images/motions.
UPDATE public.measures_encounter_def
SET metadata = COALESCE(metadata, '{}'::jsonb) || $json${
  "content_profile": {
    "content_authority": "encounter_def.metadata.intro_copy,encounter_def.metadata.threshold_copy",
    "title_source": "intro_copy.title",
    "threshold_source": "threshold_copy.plaques"
  },
  "media_locator": {
    "primary_media_role": "intro_hook_video",
    "secondary_media_roles": [
      "left_hero_fracture",
      "left_hero_fracture_motion",
      "right_measured_hero",
      "measured_hero_motion_graphic"
    ]
  },
  "directory_key": "crystal_seat_directory"
}$json$::jsonb
WHERE encounter_key = 'ai_isnt_broken_intro';

-- about_measures_registry — serves crystal_seat_encounter.
-- Content authority: approved_content_contract (title, orientation_sections, connect_section, etc.).
UPDATE public.measures_encounter_def
SET metadata = COALESCE(metadata, '{}'::jsonb) || $json${
  "content_profile": {
    "title_source": "approved_content_contract.title",
    "content_authority": "encounter_def.metadata.approved_content_contract"
  },
  "media_locator": {
    "primary_media_role": "about_measures_registry_video"
  },
  "directory_key": "crystal_seat_directory"
}$json$::jsonb
WHERE encounter_key = 'about_measures_registry';

-- undrifted — serves lapis_chamber_encounter.
-- Content authority: brand_copy, issue_record, cover_story, featured_article_set, etc.
UPDATE public.measures_encounter_def
SET metadata = COALESCE(metadata, '{}'::jsonb) || $json${
  "content_profile": {
    "title_source": "brand_copy.header",
    "content_authority": "encounter_def.metadata.brand_copy,encounter_def.metadata.issue_record,encounter_def.metadata.cover_story"
  },
  "media_locator": {
    "primary_media_role": "lapis_background"
  },
  "directory_key": "lapis_chamber_directory"
}$json$::jsonb
WHERE encounter_key = 'undrifted';

-- obsidian_chamber_orientation — EvalPassage video surface.
-- Content: DB-held display_title via encounter_def. CTA label from content_profile.
UPDATE public.measures_encounter_def
SET metadata = COALESCE(metadata, '{}'::jsonb) || $json${
  "content_profile": {
    "title_source": "encounter_def.display_title",
    "cta_label": "Continue"
  },
  "media_locator": {
    "primary_media_role": "structured_environment_passage_video"
  },
  "directory_key": "obsidian_chamber_directory"
}$json$::jsonb
WHERE encounter_key = 'obsidian_chamber_orientation';

-- measures_assessment — assessment form surface.
-- Content authority: assessment_mechanics, assessment_contact_capture_oar1_binding_contract_v1.
-- Media: obsidian visual roles.
UPDATE public.measures_encounter_def
SET metadata = COALESCE(metadata, '{}'::jsonb) || $json${
  "content_profile": {
    "content_authority": "encounter_def.metadata.assessment_mechanics,encounter_def.metadata.assessment_contact_capture_oar1_binding_contract_v1"
  },
  "media_locator": {
    "media_roles": [
      "obsidian_assessment_surface_visual",
      "obsidian_contact_surface_visual",
      "obsidian_eval_result_surface_visual"
    ]
  },
  "directory_key": "obsidian_chamber_directory"
}$json$::jsonb
WHERE encounter_key = 'measures_assessment';

-- obsidian_chamber_C1_compact — contact/consent capture surface.
-- Content: form fields from assessmentContactCaptureContract in sessionStorage (__mreg_c1_pending).
-- content_profile holds held-state copy and supplementary labels.
UPDATE public.measures_encounter_def
SET metadata = COALESCE(metadata, '{}'::jsonb) || $json${
  "content_profile": {
    "title": "Contact Information",
    "held_body": "Complete the AI Operations Assessment to continue."
  },
  "media_locator": null,
  "directory_key": "obsidian_chamber_directory"
}$json$::jsonb
WHERE encounter_key = 'obsidian_chamber_C1_compact';

-- marble_chamber_orientation — assessment report orientation video surface.
-- Content: title and CTA from content_profile (consumed by MarbleOrientationSeat).
-- Media: assessment_report_orientation (gap — source video not yet provided).
UPDATE public.measures_encounter_def
SET metadata = COALESCE(metadata, '{}'::jsonb) || $json${
  "content_profile": {
    "title": "Pathway Review",
    "subtitle": "A brief orientation before reviewing your assessment findings.",
    "cta_label": "Continue"
  },
  "media_locator": {
    "primary_media_role": "assessment_report_orientation"
  },
  "directory_key": "marble_chamber_directory"
}$json$::jsonb
WHERE encounter_key = 'marble_chamber_orientation';

-- marble_chamber_encounter — assessment findings report surface.
-- Content: reads from __mreg_pending_report sessionStorage via PublicAssessmentResult.
-- content_profile documents title and CTA consumed by MarbleChamberEncounter.
UPDATE public.measures_encounter_def
SET metadata = COALESCE(metadata, '{}'::jsonb) || $json${
  "content_profile": {
    "title": "Assessment Findings",
    "cta_label": "Begin Pathway Review"
  },
  "media_locator": null,
  "directory_key": "marble_chamber_directory"
}$json$::jsonb
WHERE encounter_key = 'marble_chamber_encounter';

-- map_integrity_governance — marble_chamber_C2_compact pathway cards surface.
-- Content authority: governance_header, map_framing, pathway_cards (already DB-held).
-- content_profile provides standardized pointer. Media: marble tone visuals.
UPDATE public.measures_encounter_def
SET metadata = COALESCE(metadata, '{}'::jsonb) || $json${
  "content_profile": {
    "title_source": "governance_header.title",
    "content_authority": "encounter_def.metadata.governance_header,encounter_def.metadata.map_framing,encounter_def.metadata.pathway_cards"
  },
  "media_locator": {
    "media_roles": [
      "right_measured_hero",
      "installation_tone_marble",
      "installation_tone_marble_rise_return_v1"
    ]
  },
  "directory_key": "marble_chamber_directory"
}$json$::jsonb
WHERE encounter_key = 'map_integrity_governance';

-- marble_chamber_C2_agreement — payment agreement surface.
-- content_profile holds all copy consumed by MarbleC2Agreement.
-- Previously hardcoded; now DB-held and consumed by FREE.
UPDATE public.measures_encounter_def
SET metadata = COALESCE(metadata, '{}'::jsonb) || $json${
  "content_profile": {
    "title": "Payment Agreement",
    "held_body": "Select a MAP pathway to continue to payment.",
    "held_cta_label": "Return to MAP",
    "pathway_prefix": "Selected pathway:",
    "email_label": "Email for checkout",
    "email_placeholder": "email@organization.com",
    "cta_label": "Proceed to Payment",
    "cta_loading": "Processing..."
  },
  "media_locator": null,
  "directory_key": "marble_chamber_directory"
}$json$::jsonb
WHERE encounter_key = 'marble_chamber_C2_agreement';

-- marble_chamber_C2_resolution — payment confirmation surface.
-- content_profile holds all copy consumed by MarbleC2Resolution.
-- Previously hardcoded; now DB-held and consumed by FREE.
UPDATE public.measures_encounter_def
SET metadata = COALESCE(metadata, '{}'::jsonb) || $json${
  "content_profile": {
    "eyebrow": "MAP Registration",
    "title": "Registration Received",
    "body": "Your MAP the Environment registration has been received.",
    "cta_label": "Return to Measures Registry"
  },
  "media_locator": null,
  "directory_key": "marble_chamber_directory"
}$json$::jsonb
WHERE encounter_key = 'marble_chamber_C2_resolution';

-- ============================================================
-- STEP 3: Seat directory_key in surface_assignment metadata
-- ============================================================

UPDATE public.measures_encounter_surface_assignment
SET metadata = COALESCE(metadata, '{}'::jsonb) || '{"directory_key": "crystal_seat_directory"}'::jsonb
WHERE surface_key IN (
  'crystal_seat_intro',
  'crystal_seat_threshold',
  'crystal_seat_orientation',
  'crystal_seat_encounter'
);

UPDATE public.measures_encounter_surface_assignment
SET metadata = COALESCE(metadata, '{}'::jsonb) || '{"directory_key": "lapis_chamber_directory"}'::jsonb
WHERE surface_key = 'lapis_chamber_encounter';

UPDATE public.measures_encounter_surface_assignment
SET metadata = COALESCE(metadata, '{}'::jsonb) || '{"directory_key": "obsidian_chamber_directory"}'::jsonb
WHERE surface_key IN (
  'obsidian_chamber_orientation',
  'obsidian_chamber_encounter_surface',
  'obsidian_chamber_C1_compact'
);

UPDATE public.measures_encounter_surface_assignment
SET metadata = COALESCE(metadata, '{}'::jsonb) || '{"directory_key": "marble_chamber_directory"}'::jsonb
WHERE surface_key IN (
  'marble_chamber_orientation',
  'marble_chamber_encounter',
  'marble_chamber_C2_compact',
  'marble_chamber_C2_agreement',
  'marble_chamber_C2_resolution'
);

-- ============================================================
-- STEP 4: Assessment report orientation media row (gap placeholder)
-- ============================================================
-- Row registered with correct campaign_key and media_role so resolver fetch support
-- is confirmed. is_active: false — media source not yet provided. MarbleOrientationSeat
-- renders gap state ("Marble orientation media is not seated.") until source is supplied.
-- To enable: UPDATE SET storage_path = '<filename>', metadata = metadata || '{"exact_url_seated": "https://..."}'::jsonb, is_active = true.

INSERT INTO public.measures_media_map (
  id,
  registry_key,
  encounter_key,
  campaign_key,
  media_role,
  storage_bucket,
  storage_path,
  mime_type,
  sort_order,
  is_active,
  metadata,
  created_at,
  updated_at
) VALUES (
  gen_random_uuid(),
  'marble_chamber_orientation',
  'marble_chamber_orientation',
  'measures_registry_root_authority_v1',
  'assessment_report_orientation',
  'measures-media',
  '',
  'video/mp4',
  30,
  false,
  $json${
    "gap_standing": "media_source_pending",
    "gap_note": "Source video file not yet provided. Set storage_path, exact_url_seated, and is_active: true to enable playback in MarbleOrientationSeat.",
    "surface_role": "marble_chamber_orientation",
    "source_oar2": "docs/oar/measures_registry/oar2_seat_db_held_content_profiles_media_locators_directory_keys_and_free_consumption_v1.meta.md"
  }$json$::jsonb,
  now(),
  now()
);

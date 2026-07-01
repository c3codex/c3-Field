-- Seed measures_encounter_def for encounter_key = 'undrifted'.
-- Source OAR2: docs/oar/measures_registry/oar2_seed_undrifted_encounter_definition_from_registered_publication_records_v1.meta.md
--
-- Content sourced (rendering projection only — publication authority unchanged):
--   measures_publication_registry WHERE publication_key = 'undrifted'
--     → brand_copy, brand_assets, style_contract, cover_story, issue_record,
--       footer_record, role_call_feature, next_issue_teaser
--   measures_publication_dispatch WHERE publication_key = 'undrifted'
--     → agents_with_keys_dispatch_v1 (featured_article_set[0])
--     → fables_and_myths_dispatch_v1 (featured_article_set[1])
--
-- No article content invented. No publication authority moved.
-- measures_publication_registry and measures_publication_dispatch remain authoritative.

INSERT INTO public.measures_encounter_def (
  registry_id,
  encounter_key,
  display_title,
  encounter_type,
  material_family,
  surface_type,
  is_active,
  metadata
)
SELECT
  r.id,
  'undrifted',
  'unDrifted',
  'view',
  'lapis',
  'threshold',
  true,
  $undrifted_meta${
    "source_oar2": "docs/oar/measures_registry/oar2_seed_undrifted_encounter_definition_from_registered_publication_records_v1.meta.md",
    "content_source": "measures_publication_registry + measures_publication_dispatch",
    "brand_copy": {
      "header": "unDrifted",
      "principles_line": "Measure · Detect · Correct · Govern"
    },
    "brand_assets": {
      "primary_full_lockup_path": "/undrifted_logo.png"
    },
    "style_contract": {
      "key": "undrifted_publication_style_v1"
    },
    "landing_design_contract": {
      "hero": {
        "cover_eyebrow": "ISSUE 001 — LAUNCH EDITION"
      },
      "insights_eyebrow": "DISPATCHES FROM MEASURES REGISTRY",
      "insights_heading": "FEATURE ARTICLES",
      "landing_contract_key": "undrifted_issue_001_landing_v1",
      "style_contract_key": "undrifted_publication_style_v1"
    },
    "issue_record": {
      "issue_number": "001",
      "issue_date": "June 2026",
      "edition": "Launch Edition"
    },
    "cover_story": {
      "feature_headline": "AI ISN'T BROKEN. SYSTEMS ARE.",
      "feature_deck": "Measures Registry launches with Integrity Governance—an inside-out answer to AI systems optimization.",
      "feature_positioning": "THE STANDARD FOR AI SYSTEMS GOVERNANCE."
    },
    "assessment_feature": {
      "feature_label": "ASSESSMENT",
      "feature_title": "AI Operations Assessment",
      "cta_label": "Assess the Environment",
      "route_path": "/ai-operations-assessment"
    },
    "featured_article_set": [
      {
        "title": "Agents With Keys",
        "subtitle": "Systems Without Governance",
        "article_url": "https://paragraph.com/@undrifted/agents-with-keys",
        "teaser": "Capability is not authority. Structure prevents drift.",
        "publication_state": "published",
        "feature_label": "FEATURE ARTICLE",
        "media_role": "agents_with_keys_cover"
      },
      {
        "title": "Fables & Myths",
        "subtitle": "Institutional Narrative and Policy Risk",
        "article_url": "https://paragraph.com/@undrifted/fables-and-myths",
        "teaser": "Anthropic, Fables 5, Mythos 5, and the U.S. government. When institutions narrate capability as control, systems drift becomes policy risk.",
        "publication_state": "published",
        "feature_label": "FEATURE ARTICLE",
        "media_role": "fables_and_myths_cover"
      }
    ],
    "role_call_feature": {
      "feature_label": "ROLE CALL",
      "feature_title": "ALL POSITIONS AVAILABLE",
      "feature_tagline": "WHAT IS YOURS?",
      "feature_body": "Systems, AI, and institutions are empty shells without the people who rely on them.",
      "story_body": "An artist, an AI, one year,\nand a c3 Field of possibility.",
      "destination_label": "Our Story",
      "cta_label": "Connect · Contribute · Create →"
    },
    "next_issue_teaser": {
      "feature_label": "NEXT ISSUE",
      "feature_title": "FROM ASSESSMENT TO ACTION",
      "feature_body": "What happens after drift is detected? Implementation pathways. Operational alignment. Governed correction.",
      "release_hint": "COMING JULY 2026"
    },
    "footer_record": {
      "footer_line_1": "MEASURE. DETECT. CORRECT. GOVERN.",
      "footer_line_2": "COHERENCE IS NOT ASSUMED. IT IS MAINTAINED."
    }
  }$undrifted_meta$::jsonb
FROM public.measures_registry r
WHERE r.registry_key = 'undrifted';

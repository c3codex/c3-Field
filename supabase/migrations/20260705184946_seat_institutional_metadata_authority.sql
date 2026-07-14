-- OAR2 "Seat Institutional Metadata Authority"
-- docs/oar/measures_registry/oar2_seat_institutional_metadata_authority_v1.meta.md

-- 1 & 2: founder authority + founder title/description.
-- sameAs is deliberately NOT duplicated here — it resolves at build time from the
-- already-seated, standing="active" entries in
-- measures_registry.undrifted_publication_landing.metadata.social_links, per the
-- OAR2 rule "must be DB-seeded or metadata-seated before being rendered."
insert into measures_registry (
  registry_key, display_title, registry_family, encounter_type,
  release_state, access_state, is_active, metadata
)
values (
  'founder_authority',
  'Measures Registry — Founder Authority',
  'spine',
  'metadata_record',
  'released',
  'visible',
  true,
  jsonb_build_object(
    'founder_name', 'Stephanie Joanne Gaffney',
    'founder_title', 'Systems Designer',
    'founder_description', 'Artist, Systems Designer, and founder of c3 Community Partners DAO, LLC.',
    'source_oar2', 'docs/oar/measures_registry/oar2_seat_institutional_metadata_authority_v1.meta.md'
  )
)
on conflict (registry_key) do update set
  metadata = excluded.metadata,
  updated_at = now();

-- 3, 4, 5: unDrifted Editorial author authority, publication dates on the two
-- existing articles, and registration of the new Paragraph article. Teaser/
-- description are omitted for the new article — none were provided/approved,
-- so the gap is reported rather than invented.
update measures_registry
set metadata = jsonb_set(
  metadata,
  '{featured_article_set}',
  '[
    {
      "title": "Agents With Keys",
      "teaser": "As AI systems gain access to credentials, APIs, operational workflows, and financial authority, the question is no longer what an agent can do. The question is who governs it.",
      "subtitle": "Systems Without Governance",
      "media_role": "agents_with_keys_cover",
      "article_url": "https://paragraph.com/@undrifted/agents-with-keys",
      "description": "Capability is not authority. Structure prevents drift.",
      "dispatch_key": "agents_with_keys_dispatch_v1",
      "feature_label": "STRUCTURAL DRIFT",
      "publication_state": "published",
      "date_published": "2026-06-23",
      "author_name": "unDrifted Editorial",
      "author_slug": "undrifted-editorial"
    },
    {
      "title": "Fables & Myths",
      "teaser": "Most AI failures do not begin as technical failures. They begin as stories institutions tell themselves about control, certainty, accountability, and responsibility.",
      "subtitle": "Institutional Narrative and Policy Risk",
      "media_role": "fables_and_myths_cover",
      "article_url": "https://paragraph.com/@undrifted/fables-and-myths",
      "description": "Anthropic, Fables 5, Mythos 5, and the U.S. government. When institutions narrate capability as control, systems drift becomes policy risk.",
      "dispatch_key": "fables_and_myths_dispatch_v1",
      "feature_label": "SYSTEM GOVERNANCE",
      "publication_state": "published",
      "date_published": "2026-06-13",
      "author_name": "unDrifted Editorial",
      "author_slug": "undrifted-editorial"
    },
    {
      "title": "The New AI Bottleneck Isn''t Compute, It''s Governance",
      "article_url": "https://paragraph.com/@undrifted/the-new-ai-bottleneck-isnt-compute-its-governance",
      "publication_state": "published",
      "date_published": "2026-06-30",
      "author_name": "unDrifted Editorial",
      "author_slug": "undrifted-editorial"
    }
  ]'::jsonb
),
updated_at = now()
where registry_key = 'undrifted_publication_landing';

-- 6 & 7: About page legal identity standing (public) and Our Story standing
-- (public_as_our_story). New `our_story_section` copy is conceptual only — it does
-- not restore the removed outbound c3field.online links; `c3field_links_section`
-- (which holds those links) is left untouched/orphaned, matching "preserve that
-- decision... render Our Story conceptually without outbound c3field links unless
-- separately approved."
update measures_encounter_def
set metadata = jsonb_set(
  metadata,
  '{approved_content_contract}',
  (metadata->'approved_content_contract') || jsonb_build_object(
    'legal_identity_statement',
    'Measures Registry operates under the authority and governance framework of c3 Community Partners DAO, LLC and is not a separate legal entity.',
    'content_standing',
    jsonb_build_object(
      'legal_identity_statement', 'public',
      'c3field_links_section', 'public_as_our_story'
    ),
    'our_story_section',
    jsonb_build_object(
      'title', 'Our Story',
      'body', 'Measures Registry emerged from the broader c3 Field research and governance framework and applies those findings to institutional AI governance and structural integrity.'
    )
  )
),
updated_at = now()
where encounter_key = 'about_measures_registry';

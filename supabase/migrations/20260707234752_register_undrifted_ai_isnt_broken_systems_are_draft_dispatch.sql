-- OAR2: oar2_register_undrifted_issue001_cover_story_ai_isnt_broken_systems_are_v1
-- Prepares a draft Publication Dispatch row for the unDrifted Issue 001 cover story so it has
-- a governed dispatch record before any Paragraph publication occurs. status='draft',
-- article_url=null — not published, no Paragraph URL exists yet. Purely additive: a brand new
-- dispatch_key, no existing row touched.

insert into measures_publication_dispatch (
  publication_key,
  dispatch_key,
  title,
  dispatch_body,
  excerpt,
  primary_cta,
  secondary_cta,
  internal_route,
  external_platform,
  external_slug,
  external_url,
  status,
  published_at,
  issue_number,
  article_url,
  media_manifest,
  metadata
) values (
  'undrifted',
  'ai_isnt_broken_systems_are_dispatch_v1',
  'AI Isn''t Broken. Systems Are.',
  E'# AI Isn''t Broken. Systems Are.\n\nMeasures Registry launches with Integrity Governance—an inside-out answer to AI systems optimization.\n\n**THE STANDARD FOR AI SYSTEMS GOVERNANCE.**\n\n## Connect\n\nunDrifted is a governed publication, not a broadcast. [Visit unDrifted](https://measuresregistry.com/undrifted) to subscribe for Issue updates and see what''s next.\n\n## Take the AI Operations Assessment\n\nStructural drift is detectable. [Assess your environment →](/ai-operations-assessment)',
  'Measures Registry launches with Integrity Governance—an inside-out answer to AI systems optimization.',
  'Take the AI Operations Assessment',
  'Visit unDrifted',
  null,
  null,
  'ai-isnt-broken-systems-are',
  null,
  'draft',
  null,
  'ISSUE 001',
  null,
  jsonb_build_object(
    'media_role', 'ai_isnt_broken_landing',
    'storage_bucket', 'measures-registry',
    'storage_path', 'ai_isnt_broken_landing.webp'
  ),
  jsonb_build_object(
    'issue_role', 'cover_story',
    'cta_route', '/ai-operations-assessment',
    'connect_route', 'https://measuresregistry.com/undrifted',
    'asset_id', 'undrifted_issue01_ai_isnt_broken_systems_are_article_v1',
    'source_oar2', 'OAR/OAR2/publication/oar2_register_undrifted_issue001_cover_story_ai_isnt_broken_systems_are_v1.meta.md',
    'claim_boundary', 'education_only',
    'note', 'Draft dispatch prepared ahead of Paragraph publication. Do not mark published or set article_url/external_url until a real Paragraph URL exists.'
  )
);

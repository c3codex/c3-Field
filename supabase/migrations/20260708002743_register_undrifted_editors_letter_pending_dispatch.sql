-- OAR2: oar2_register_issue001_editors_letter_banner_and_paragraph_publication_v1
-- Prepares a pending-publication Publication Dispatch row for the unDrifted Issue 001
-- Editor's Letter. status='pending_publication', article_url=null, external_url=null — no
-- Paragraph URL exists yet; publishing to Paragraph was explicitly not performed this pass
-- (no local credentials, and this is a real external-platform publish action held for
-- explicit operator execution). Purely additive: new dispatch_key, no existing row touched.
--
-- Note: dispatch_body below is an abbreviated placeholder — corrected to the full canonical
-- text by the immediately-following migration (20260708002825).

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
  'editors_letter_issue001_v1',
  'From the Editor',
  E'# From the Editor\n\nThere is a pattern that keeps repeating.\n\nWhen an AI deployment struggles, the first question is often, what is wrong with the model?\n\nSometimes the answer is the model.\n\nMore often, it is not.\n\n[... full body registered verbatim in Assets/Articles/unDrifted/Issue01/registered/undrifted_issue01_editors_letter_article_v1.md — see that file for the complete, canonical text including the Acknowledgment and Continue the Conversation sections ...]\n\n**Stephanie Joanne Gaffney**\nFounder & Systems Designer, Measures Registry\nEditor, unDrifted',
  'There is a pattern that keeps repeating. When an AI deployment struggles, the first question is often: what is wrong with the model? Sometimes the answer is the model. More often, it is not.',
  'Take the AI Operations Assessment',
  null,
  null,
  null,
  'from-the-editor',
  null,
  'pending_publication',
  null,
  'ISSUE 001',
  null,
  jsonb_build_object(
    'media_role', 'editorial_banner',
    'storage_bucket', 'measures-registry',
    'storage_path', 'editors_note_banner.webp'
  ),
  jsonb_build_object(
    'issue_role', 'editors_letter',
    'publication_order', 'before_cover_story',
    'cta_route', '/ai-operations-assessment',
    'acknowledgement_included', true,
    'asset_id', 'undrifted_issue01_editors_letter_article_v1',
    'source_oar2', 'OAR/OAR2/publication/oar2_register_issue001_editors_letter_banner_and_paragraph_publication_v1.meta.md',
    'note', 'Do not mark published or set article_url/external_url until a real Paragraph URL exists. Paragraph publication was explicitly not performed by this OAR — no local PARAGRAPH_PUBLISH_KEY, and Buffer/Paragraph automation is separately on record as hold_for_operator_review.'
  )
);

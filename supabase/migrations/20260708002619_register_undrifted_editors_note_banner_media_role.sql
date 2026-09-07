-- OAR2: oar2_register_issue001_editors_letter_banner_and_paragraph_publication_v1
-- Registers the operator-supplied editors_note_banner.webp (uploaded 2026-07-08, previously
-- unregistered — no prior measures_media_map row referenced this binary) under media_role
-- 'editorial_banner', as this OAR2's Routed §2 specifies. Unlike the Codexstone seal
-- (already registered under a different role and reused elsewhere), this is a first-time
-- registration for a dedicated, purpose-uploaded binary — not a duplicate alias.

insert into measures_media_map (
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
) values (
  'undrifted',
  'undrifted',
  'agents_of_chaos_integrity_governance',
  'editorial_banner',
  'measures-registry',
  'editors_note_banner.webp',
  'image/webp',
  40,
  true,
  jsonb_build_object(
    'article_role', 'editors_letter',
    'issue_id', 'undrifted_issue01',
    'source_oar2', 'OAR/OAR2/publication/oar2_register_issue001_editors_letter_banner_and_paragraph_publication_v1.meta.md'
  )
);

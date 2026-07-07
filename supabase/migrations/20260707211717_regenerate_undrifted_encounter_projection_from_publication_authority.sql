-- OAR2: oar2_seat_undrifted_publication_synchronization_and_launch_ready_encounter_projection_v1
-- Regenerates measures_encounter_def.metadata for encounter_key='undrifted' deterministically
-- from measures_publication_registry (canonical publication identity/style/issue/hierarchy) and
-- measures_publication_dispatch (canonical article records), correcting drift found by the two
-- preceding audit OAR2s (issue_record date, stripped style_contract, stale role_call_feature).
-- Fields with no canonical Publication Registry source (assessment_feature,
-- landing_design_contract, media_locator, content_profile, directory_key, brand_copy.descriptor_line)
-- are preserved unchanged, not deleted or invented. Idempotent — re-running recomputes the same
-- deterministic result from the same canonical sources.

with publication as (
  select metadata from measures_publication_registry where publication_key = 'undrifted'
),
dispatch_matched as (
  select
    d.dispatch_key, d.title, d.article_url, d.status, d.metadata,
    replace(d.external_slug, '-', '_') as slug_key
  from measures_publication_dispatch d
  where d.publication_key = 'undrifted' and d.status = 'published'
),
sequence_entries as (
  select jsonb_array_elements_text((select metadata->'issue_record'->'section_sequence' from publication)) as entry
),
article_entries as (
  select se.entry, dm.*
  from sequence_entries se
  left join dispatch_matched dm on dm.slug_key = se.entry
  where se.entry not in ('cover_story','assessment_feature','role_call','next_issue','footer')
),
featured_set as (
  select jsonb_agg(
    jsonb_build_object(
      'title', title,
      'teaser', metadata->>'feature_teaser',
      'subtitle', metadata->>'subtitle',
      'media_role', metadata->>'cover_media_role',
      'article_url', article_url,
      'feature_label', coalesce(metadata->>'feature_label','FEATURE ARTICLE'),
      'publication_state', status
    ) order by entry
  ) as articles
  from article_entries where dispatch_key is not null
)
update measures_encounter_def
set metadata = metadata
  || jsonb_build_object(
       'brand_copy', (select metadata->'brand_copy' from publication) ||
                     case when metadata->'brand_copy' ? 'descriptor_line'
                          then jsonb_build_object('descriptor_line', metadata->'brand_copy'->'descriptor_line')
                          else '{}'::jsonb end,
       'brand_assets', (select metadata->'brand_assets' from publication),
       'cover_story', (select metadata->'cover_story' from publication),
       'issue_record', (select metadata->'issue_record' from publication),
       'role_call_feature', (select metadata->'role_call_feature' from publication),
       'next_issue_teaser', (select metadata->'next_issue_teaser' from publication),
       'footer_record', (select metadata->'footer_record' from publication),
       'style_contract', (select metadata->'style_contract' from publication),
       'hierarchy', (select metadata->'hierarchy' from publication),
       'parent_authority', (select metadata->'parent_authority' from publication),
       'primary_series', (select metadata->'primary_series' from publication),
       'featured_article_set', coalesce((select articles from featured_set), '[]'::jsonb),
       'content_source', to_jsonb('measures_publication_registry + measures_publication_dispatch'::text),
       'source_oar2', to_jsonb('OAR/OAR2/publication/oar2_seat_undrifted_publication_synchronization_and_launch_ready_encounter_projection_v1.meta.md'::text),
       'projection_meta', jsonb_build_object(
         'regenerated_at', now(),
         'regenerated_by_oar2', 'oar2_seat_undrifted_publication_synchronization_and_launch_ready_encounter_projection_v1',
         'regeneration_script', 'scripts/regenerate-undrifted-encounter-projection.cjs',
         'canonical_sources', jsonb_build_array('measures_publication_registry','measures_publication_dispatch')
       )
     )
where encounter_key = 'undrifted';

-- OAR2: Seat Footer Branch Link and Undrifted Social Icons v1
-- Source: docs/oar/measures_registry/oar2_seat_footer_branch_link_and_undrifted_social_icons_v1.meta.md

do $$
begin
  update public.measures_registry
  set metadata = coalesce(metadata, '{}'::jsonb) || jsonb_build_object(
    'footer_contract', jsonb_build_object(
      'copy_prefix', 'Registered Branch of ',
      'link_label', 'c3 Field',
      'link_target_key', 'c3_field_our_story',
      'link_url', 'https://measuresregistry.com/c3field',
      'link_standing', 'active',
      'global_navigation', false,
      'source_oar2', 'docs/oar/measures_registry/oar2_seat_footer_branch_link_and_undrifted_social_icons_v1.meta.md',
      'public_url_source', 'operator_authorized_2026_06_21'
    )
  ), updated_at = now()
  where registry_key = 'measures_registry_root';

  update public.measures_registry
  set metadata = jsonb_set(
        coalesce(metadata, '{}'::jsonb),
        array['featured_article_set'],
        jsonb_build_array(
          jsonb_build_object('title', 'Agents With Keys', 'publication_state', 'unpublished', 'media_role', 'agents_with_keys_cover', 'article_route', null),
          jsonb_build_object('title', 'Fables and Myths', 'publication_state', 'published', 'media_role', 'fables_and_myths_cover', 'article_route', null)
        ),
        true
      ) || jsonb_build_object(
        'social_links', jsonb_build_array(
          jsonb_build_object('platform', 'X', 'url', null, 'standing', 'held_missing_url'),
          jsonb_build_object('platform', 'Facebook', 'url', null, 'standing', 'held_missing_url'),
          jsonb_build_object('platform', 'Instagram', 'url', null, 'standing', 'held_missing_url')
        ),
        'source_oar2_footer_social', 'docs/oar/measures_registry/oar2_seat_footer_branch_link_and_undrifted_social_icons_v1.meta.md'
      ),
      updated_at = now()
  where registry_key = 'undrifted_publication_landing';

  if not exists (
    select 1 from public.measures_registry
    where registry_key = 'measures_registry_root'
      and metadata #>> '{footer_contract,copy_prefix}' = 'Registered Branch of '
      and metadata #>> '{footer_contract,link_label}' = 'c3 Field'
      and metadata #>> '{footer_contract,link_url}' = 'https://measuresregistry.com/c3field'
      and metadata #>> '{footer_contract,link_standing}' = 'active'
  ) then raise exception 'footer contract validation failed'; end if;

  if not exists (
    select 1 from public.measures_registry
    where registry_key = 'undrifted_publication_landing'
      and metadata #>> '{featured_article_set,0,title}' = 'Agents With Keys'
      and metadata #>> '{featured_article_set,0,publication_state}' = 'unpublished'
      and metadata #>> '{featured_article_set,1,title}' = 'Fables and Myths'
      and metadata #>> '{featured_article_set,1,publication_state}' = 'published'
      and jsonb_array_length(metadata -> 'social_links') = 3
  ) then raise exception 'undrifted footer/social validation failed'; end if;
end $$;

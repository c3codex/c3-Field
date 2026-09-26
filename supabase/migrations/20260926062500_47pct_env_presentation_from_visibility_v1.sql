begin;

insert into public.c3ops_asset_record(
  asset_key,asset_type,asset_class,title,description,owning_system_key,contributor_key,authorship_method,
  source_asset_key,derivative_of,asset_version,content_hash,hash_algorithm,mime_type,byte_size,seat_scope,src_key,
  standing,rights_holder,license_or_use_rights,transferability,authoritative_custody_type,
  authoritative_custody_provider,authoritative_custody_identifier,authoritative_custody_location,custody_controller,
  free_eligibility,current_free_binding,public_retrieval_standing,retention_rule,created_by
) values (
  '47pct_emblem_environment_backdrop_v1',
  'environment_media',
  'initiative_environment_backdrop',
  '4.7% Initiative — My Environment Backdrop',
  'Governed 4.7% emblem presentation used as the default backdrop for personal environments carrying an active 4.7% participant visibility relation. Presentation only; creates no standing, authority, custody, or C2 passage.',
  'c3_field','op044','ai_assisted',
  '47pct_emblem_watermark_v1','47pct_emblem_watermark_v1','v1',
  'ab78caa2d9ea1c7cb405736d48b8be1ed740900e93a7e22c96da1f16356f3295','sha256',
  'image/svg+xml',11556,'Institutionally Scoped','47pct_c1_connect_c3webpac_v1',
  'operator_approved_webpac_reference',
  'c3 Community Partners DAO, LLC',
  'operator_authorized_47pct_initiative_presentation',
  'presentation_binding_requires_governed_relation',
  'repository_asset','GitHub','c3codex/c3-Field@c3field',
  'public/assets/47pct/47pct-emblem-watermark-v1.svg',
  'c3_field',true,
  '/assets/47pct/47pct-emblem-watermark-v1.svg',
  'public_release_authorized',
  'preserve_exact_source_and_initiative_lineage',
  'op044'
)
on conflict (asset_key) do update set
  current_free_binding=excluded.current_free_binding,
  public_retrieval_standing=excluded.public_retrieval_standing,
  updated_at=now();

create or replace function public.apply_47pct_env_presentation_from_visibility()
returns trigger
language plpgsql
security definer
set search_path=public,pg_temp
as $$
begin
  if new.initiative_key='47pct'
     and new.standing='active'
     and new.revoked_at is null then

    insert into public.c3_envpac_presentation(
      envpac_key,opening_visual_asset_key,opening_visual_url,source_webpac_key,
      owner_changeable,selection_standing,selected_by_type,selected_by_key,
      selected_at,updated_at,metadata
    ) values (
      new.envpac_key,
      '47pct_emblem_environment_backdrop_v1',
      '/assets/47pct/47pct-emblem-watermark-v1.svg',
      '47pct_c1_connect_c3webpac_v1',
      true,'active','initiative','47pct',
      now(),now(),
      jsonb_build_object(
        'initiative_key','47pct',
        'presentation_role','initiative_environment_backdrop',
        'presentation_source','c3_env_initiative_visibility',
        'visibility_key',new.visibility_key,
        'formation_default',true,
        'owner_changeable',true,
        'custody_transfer',false
      )
    )
    on conflict (envpac_key) do update
      set opening_visual_asset_key=excluded.opening_visual_asset_key,
          opening_visual_url=excluded.opening_visual_url,
          source_webpac_key=excluded.source_webpac_key,
          owner_changeable=true,
          selection_standing='active',
          selected_by_type='initiative',
          selected_by_key='47pct',
          selected_at=now(),
          updated_at=now(),
          metadata=coalesce(public.c3_envpac_presentation.metadata,'{}'::jsonb) || excluded.metadata
      where public.c3_envpac_presentation.selected_by_type <> 'individual';
  end if;

  return new;
end
$$;

drop trigger if exists trg_apply_47pct_env_presentation
  on public.c3_env_initiative_visibility;

create trigger trg_apply_47pct_env_presentation
after insert or update of standing,revoked_at,envpac_key
on public.c3_env_initiative_visibility
for each row
execute function public.apply_47pct_env_presentation_from_visibility();

update public.c3_envpac_presentation p
set opening_visual_asset_key='47pct_emblem_environment_backdrop_v1',
    opening_visual_url='/assets/47pct/47pct-emblem-watermark-v1.svg',
    source_webpac_key='47pct_c1_connect_c3webpac_v1',
    owner_changeable=true,
    selection_standing='active',
    selected_by_type='initiative',
    selected_by_key='47pct',
    selected_at=now(),
    updated_at=now(),
    metadata=coalesce(p.metadata,'{}'::jsonb) || jsonb_build_object(
      'initiative_key','47pct',
      'presentation_role','initiative_environment_backdrop',
      'presentation_source','47pct_active_visibility_backfill',
      'formation_default',true,
      'owner_changeable',true,
      'custody_transfer',false
    )
where p.envpac_key in (
  select v.envpac_key
  from public.c3_env_initiative_visibility v
  where v.initiative_key='47pct'
    and v.standing='active'
    and v.revoked_at is null
)
and p.selected_by_type <> 'individual';

commit;

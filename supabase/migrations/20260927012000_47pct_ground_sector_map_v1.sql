begin;

create table if not exists public.c3_47pct_property_geocode (
  geocode_key text primary key,
  property_key text not null references public.c3_47pct_property_asset(property_key) on update cascade on delete cascade,
  latitude numeric(10,7) not null,
  longitude numeric(10,7) not null,
  precision_class text not null,
  source_name text not null,
  source_url text not null,
  source_date date,
  observed_date date not null default current_date,
  standing text not null,
  public_projection_allowed boolean not null default false,
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint c3_47pct_property_geocode_lat_check check (latitude between -90 and 90),
  constraint c3_47pct_property_geocode_lon_check check (longitude between -180 and 180),
  constraint c3_47pct_property_geocode_precision_check check (precision_class in (
    'site_coordinate','address_coordinate','locale_centroid','qualified_site_coordinate'
  )),
  constraint c3_47pct_property_geocode_standing_check check (standing in (
    'registered_verified','registered_qualified','held'
  ))
);

alter table public.c3_47pct_property_geocode enable row level security;
revoke all on public.c3_47pct_property_geocode from public,anon,authenticated;
grant select,insert,update,delete on public.c3_47pct_property_geocode to service_role;

create unique index if not exists c3_47pct_property_geocode_active_property_idx
  on public.c3_47pct_property_geocode(property_key)
  where standing in ('registered_verified','registered_qualified');

insert into public.c3_47pct_property_geocode(
  geocode_key,property_key,latitude,longitude,precision_class,
  source_name,source_url,source_date,observed_date,standing,public_projection_allowed,metadata
) values
(
  '47geo_caddo_camp_pioneer_v1','47prop_caddo_camp_pioneer',
  34.5328840,-94.3832700,'locale_centroid',
  'USGS feature coordinates via TopoQuest',
  'https://topoquest.com/place/arkansas/building/hatfield-station-fire-district-4/2116545',
  null,'2026-09-26','registered_qualified',true,
  jsonb_build_object(
    'location_basis','Camp Pioneer locale coordinate near registered 971 Polk Rd 38 address',
    'parcel_boundary_claimed',false,
    'address_exact_coordinate_claimed',false,
    'map_use','property location only',
    'survivor_occurrence_effect','none'
  )
),
(
  '47geo_mac_little_sioux_v1','47prop_mac_little_sioux',
  41.8774170,-95.9794570,'site_coordinate',
  'Mid-America Council C.A.M.P. Book',
  'https://assets.zyrosite.com/AGBnJr0vWJCWnjbE/c.a.m.p.-book-20240201-ALp2wVxD0ZI9v0K7.pdf',
  null,'2026-09-26','registered_verified',true,
  jsonb_build_object(
    'location_basis','LSSR Welcome Center GPS coordinate published with the property address',
    'parcel_boundary_claimed',false,
    'map_use','property location only',
    'survivor_occurrence_effect','none'
  )
),
(
  '47geo_mtc_boxwell_v1','47prop_mtc_boxwell',
  36.3144909,-86.4621051,'site_coordinate',
  'Middle Tennessee Council / ScoutingEvent',
  'https://scoutingevent.com/560-120979',
  null,'2026-09-26','registered_verified',true,
  jsonb_build_object(
    'location_basis','Published event location for Boxwell Reservation at 1260 Creighton Lane',
    'parcel_boundary_claimed',false,
    'map_use','property location only',
    'survivor_occurrence_effect','none'
  )
),
(
  '47geo_mtc_grimes_v1','47prop_mtc_grimes',
  35.5113205,-87.8444459,'site_coordinate',
  'Middle Tennessee Council / ScoutingEvent',
  'https://scoutingevent.com/560-98465',
  null,'2026-09-26','registered_verified',true,
  jsonb_build_object(
    'location_basis','Published event location for Grimes Canoe Base at 767 Boy Scout Road',
    'parcel_boundary_claimed',false,
    'map_use','property location only',
    'survivor_occurrence_effect','none'
  )
),
(
  '47geo_mtc_jet_potter_v1','47prop_mtc_jet_potter',
  36.1141741,-86.8098732,'address_coordinate',
  'Middle Tennessee Council / ScoutingEvent',
  'https://scoutingevent.com/560-113500',
  null,'2026-09-26','registered_verified',true,
  jsonb_build_object(
    'location_basis','Published event coordinate for Jet Potter Service Center at 3414 Hillsboro Pike',
    'parcel_boundary_claimed',false,
    'map_use','property location only',
    'survivor_occurrence_effect','none'
  )
),
(
  '47geo_mtc_latimer_v1','47prop_mtc_latimer',
  35.7983378,-85.2877219,'site_coordinate',
  'Middle Tennessee Council / ScoutingEvent',
  'https://scoutingevent.com/560-117925',
  null,'2026-09-26','registered_verified',true,
  jsonb_build_object(
    'location_basis','Published event location for Latimer High Adventure Reservation at 334 Plantation Road',
    'parcel_boundary_claimed',false,
    'map_use','property location only',
    'survivor_occurrence_effect','none'
  )
),
(
  '47geo_mtc_parish_v1','47prop_mtc_parish',
  35.7977768,-85.6005480,'site_coordinate',
  'Middle Tennessee Council / ScoutingEvent',
  'https://scoutingevent.com/560-2026CaneyForkSpringCamporee',
  null,'2026-09-26','registered_verified',true,
  jsonb_build_object(
    'location_basis','Published event location for Charles E. Parish Scout Reservation at 400 Tubb Lane',
    'parcel_boundary_claimed',false,
    'map_use','property location only',
    'survivor_occurrence_effect','none'
  )
)
on conflict (geocode_key) do update
set latitude=excluded.latitude,
    longitude=excluded.longitude,
    precision_class=excluded.precision_class,
    source_name=excluded.source_name,
    source_url=excluded.source_url,
    source_date=excluded.source_date,
    observed_date=excluded.observed_date,
    standing=excluded.standing,
    public_projection_allowed=excluded.public_projection_allowed,
    metadata=excluded.metadata,
    updated_at=now();

update public.c3_47pct_property_asset a
set geocode_state='coordinate_resolved',updated_at=now()
where exists (
  select 1 from public.c3_47pct_property_geocode g
  where g.property_key=a.property_key
    and g.standing in ('registered_verified','registered_qualified')
    and g.public_projection_allowed=true
);

create or replace function public.resolve_47pct_property_map_internal(p_include_sources boolean default false)
returns jsonb
language plpgsql
stable
security definer
set search_path=public,pg_temp
as $$
declare v_items jsonb; v_sectors jsonb;
begin
  if not exists (
    select 1 from public.c3_pac
    where pac_key='evidence_pac_47pct_v1'
      and pac_type='EvidencePac'
      and standing in ('registered_complete_evidence_bound','registered_evidence_bound_open_corpus')
      and is_effective=true
  ) then
    return jsonb_build_object('resolution','held','reason_code','47pct_evidence_pac_not_effective','map_points','[]'::jsonb,'sectors','[]'::jsonb);
  end if;

  if not exists (
    select 1 from public.c3_pac_relation
    where source_pac_key='evidence_pac_47pct_v1'
      and relation_type='evidence_authority'
      and target_kind='registry'
      and target_key='47pct_c2me_initiative_v1'
      and standing='active'
  ) then
    return jsonb_build_object('resolution','held','reason_code','47pct_evidence_authority_relation_not_active','map_points','[]'::jsonb,'sectors','[]'::jsonb);
  end if;

  select coalesce(jsonb_agg(jsonb_build_object(
    'property_key',a.property_key,
    'name',a.display_name,
    'council_name',a.council_name,
    'location_label',a.location_label,
    'address',concat_ws(', ',a.address_line1,a.city,case when a.state is not null then a.state||coalesce(' '||a.postal_code,'') end),
    'city',a.city,
    'county',a.county,
    'state',a.state,
    'sector_key','US-'||a.state,
    'sector_label',case a.state when 'TN' then 'Tennessee' when 'AR' then 'Arkansas' when 'IA' then 'Iowa' else a.state end,
    'latitude',g.latitude,
    'longitude',g.longitude,
    'coordinate_precision',g.precision_class,
    'geocode_standing',g.standing,
    'geocode_source_name',g.source_name,
    'geocode_source_url',g.source_url,
    'geocode_observed_date',g.observed_date,
    'acreage',a.acreage,
    'transaction_class',r.transaction_class,
    'transaction_state',r.transaction_state,
    'title_destination',r.title_destination,
    'settlement_cash',r.settlement_cash,
    'settlement_property',r.settlement_property,
    'current_operator',r.current_operator,
    'current_owner',r.current_owner,
    'current_title_state',r.current_title_state,
    'current_use_state',r.current_use_state,
    'current_as_of',r.current_as_of,
    'registry_standing',r.registry_standing,
    'map_category',r.map_category,
    'summary',r.public_summary,
    'qualification',r.qualification,
    'sources',case when p_include_sources then coalesce((
      select jsonb_agg(jsonb_build_object(
        'assertion_key',e.assertion_key,
        'type',e.assertion_type,
        'statement',e.statement,
        'source_name',e.source_name,
        'source_url',e.source_url,
        'source_date',e.source_date,
        'status',e.assertion_status
      ) order by coalesce(e.source_date,e.observed_date),e.assertion_key)
      from public.c3_47pct_property_assertion e
      where e.property_key=a.property_key
        and e.standing='admitted'
        and e.public_projection_allowed=true
    ),'[]'::jsonb) else '[]'::jsonb end
  ) order by a.state,a.council_name,a.display_name),'[]'::jsonb)
  into v_items
  from public.c3_47pct_property_asset a
  join public.c3_47pct_property_resolution r using(property_key)
  join public.c3_47pct_property_geocode g
    on g.property_key=a.property_key
   and g.standing in ('registered_verified','registered_qualified')
   and g.public_projection_allowed=true
  where a.evidence_pac_key='evidence_pac_47pct_v1'
    and r.map_eligible=true
    and r.registry_standing in ('registered_map','registered_map_qualified');

  select coalesce(jsonb_agg(jsonb_build_object(
    'sector_key','US-'||a.state,
    'sector_label',case a.state when 'TN' then 'Tennessee' when 'AR' then 'Arkansas' when 'IA' then 'Iowa' else a.state end,
    'state',a.state,
    'property_count',count(*),
    'verified_coordinate_count',count(*) filter (where g.standing='registered_verified'),
    'qualified_coordinate_count',count(*) filter (where g.standing='registered_qualified')
  ) order by count(*) desc,a.state),'[]'::jsonb)
  into v_sectors
  from public.c3_47pct_property_asset a
  join public.c3_47pct_property_resolution r using(property_key)
  join public.c3_47pct_property_geocode g
    on g.property_key=a.property_key
   and g.standing in ('registered_verified','registered_qualified')
   and g.public_projection_allowed=true
  where a.evidence_pac_key='evidence_pac_47pct_v1'
    and r.map_eligible=true
    and r.registry_standing in ('registered_map','registered_map_qualified')
  group by a.state;

  return jsonb_build_object(
    'resolution','registry_resolved',
    'initiative_key','47pct',
    'evidence_pac_key','evidence_pac_47pct_v1',
    'map_population_rule','registry_standing_and_registered_geocode_only',
    'sector_rule','state_code_from_registered_property_address',
    'sector_invention_allowed',false,
    'coordinate_rule','registered_geocode_relation_only',
    'parcel_boundary_claimed',false,
    'survivor_occurrence_inference_allowed',false,
    'frontend_invention_allowed',false,
    'raw_evidence_public_release_authorized',false,
    'sectors',v_sectors,
    'map_points',v_items
  );
end $$;

revoke all on function public.resolve_47pct_property_map_internal(boolean) from public,anon,authenticated;
grant execute on function public.resolve_47pct_property_map_internal(boolean) to service_role;

update public.c3_envpac_runtime_component
set config=config || jsonb_build_object(
      'sector_rule','state_code_from_registered_property_address',
      'sector_invention_allowed',false,
      'coordinate_registry','c3_47pct_property_geocode',
      'coordinate_rule','registered_geocode_relation_only',
      'map_renderer','47pct.ground_sector_map',
      'property_card_renderer','47pct.property_evidence_card',
      'parcel_boundary_claimed',false,
      'survivor_occurrence_inference_allowed',false,
      'ground_renderer_state','registry_resolved_source_implementation_pending_merge'
    ),
    updated_at=now()
where envpac_key='c3envpac_c2me_v0_1'
  and context_class='initiative'
  and context_key='47pct'
  and component_key='ground_map';

insert into public.c3_oar_transition_event(
  transition_event_key,process_instance_key,actor,from_status,to_status,transition_type,timestamp,evidence_reference,notes
) values (
  'c3field_soft_launch_hardening_optics_v1_H01_geocode_registry',
  'c3field_soft_launch_hardening_optics_v1','chazz',
  'held_pending_validation','held_pending_validation','execution',now(),
  'supabase:migration:20260927012000_47pct_ground_sector_map_v1#H01',
  'H01 advanced: seven currently registered map-eligible properties now have separately governed coordinate records with provenance. Sector derivation is state-code based; property location never implies survivor occurrence.'
)
on conflict (transition_event_key) do nothing;

update public.system_process_registry
set metadata=metadata || jsonb_build_object(
  'H01_state','registered_geocodes_and_sector_resolver_seated_renderer_pending_merge',
  'H01_sector_rule','state_code_from_registered_property_address',
  'H01_coordinate_registry','c3_47pct_property_geocode',
  'H01_property_count',(select count(*) from public.c3_47pct_property_geocode where standing in ('registered_verified','registered_qualified') and public_projection_allowed=true)
),updated_at=now()
where process_key='c3field_soft_launch_hardening_optics_v1';

commit;

create index if not exists idx_lapzuli_encounter_evidence_route_key
  on public.lapzuli_encounter_evidence(route_key);

create index if not exists idx_lapzuli_object_profile_desk_key
  on public.lapzuli_object_profile(desk_key);

create index if not exists idx_lapzuli_outlet_qualification_desk_key
  on public.lapzuli_outlet_qualification(desk_key);

create index if not exists idx_lapzuli_route_desk_key
  on public.lapzuli_route(desk_key);

create index if not exists idx_lapzuli_route_outlet_key
  on public.lapzuli_route(outlet_key);

create index if not exists idx_measures_publication_distribution_asset_campaign_id
  on public.measures_publication_distribution_asset(campaign_id);

create index if not exists idx_measures_publication_distribution_asset_campaign_asset_id
  on public.measures_publication_distribution_asset(campaign_asset_id);

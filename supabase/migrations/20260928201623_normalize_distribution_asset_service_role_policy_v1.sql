drop policy if exists service_role_only_publication_distribution_asset
  on public.measures_publication_distribution_asset;

create policy service_role_only_publication_distribution_asset
  on public.measures_publication_distribution_asset
  for all
  to service_role
  using (true)
  with check (true);

-- OAR2: Activate unDrifted Issue 01 and Complete Launch Cycle 001 Distribution
-- Source: docs/oar/measures_registry/oar2_activate_undrifted_issue_01_and_complete_launch_cycle_001_distribution_v1.meta.md
--
-- Scope: correct the seated issue identity consumed by /undrifted.
-- The renderer remains registry-driven; no frontend fallback authority is introduced.

update public.measures_encounter_def
set
  metadata = jsonb_set(
    jsonb_set(
      coalesce(metadata, '{}'::jsonb),
      '{issue_record,issue_date}',
      '"July 2026"'::jsonb,
      true
    ),
    '{issue_record,source_oar2}',
    '"docs/oar/measures_registry/oar2_activate_undrifted_issue_01_and_complete_launch_cycle_001_distribution_v1.meta.md"'::jsonb,
    true
  ),
  updated_at = now()
where encounter_key = 'undrifted';

do $$
begin
  if not exists (
    select 1
    from public.measures_encounter_def
    where encounter_key = 'undrifted'
      and metadata->'issue_record'->>'issue_number' = '001'
      and metadata->'issue_record'->>'issue_date' = 'July 2026'
      and metadata->'issue_record'->>'release_state' = 'released'
      and metadata->'issue_record'->>'surface_route' = '/undrifted'
  ) then
    raise exception 'Issue 01 July 2026 identity was not seated for /undrifted';
  end if;
end $$;

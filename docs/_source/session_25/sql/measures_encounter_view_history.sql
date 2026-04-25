-- Measures of Inanna encounter view history
-- Seats DB-backed viewed-state for phase_map cadence.
-- Frontend supplies only visitor identity and rendered encounter observations;
-- the phase map consumes these rows as resolved viewed_registry_keys.

create table if not exists public.measures_encounter_view_history (
  id uuid primary key default gen_random_uuid(),
  visitor_id text not null,
  registry_key text not null,
  encounter_key text,
  surface_type text,
  metadata jsonb not null default '{}'::jsonb,
  viewed_at timestamptz not null default now(),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint measures_encounter_view_history_visitor_registry_key
    unique (visitor_id, registry_key)
);

create index if not exists measures_encounter_view_history_visitor_idx
  on public.measures_encounter_view_history (visitor_id, viewed_at);

create index if not exists measures_encounter_view_history_registry_idx
  on public.measures_encounter_view_history (registry_key);

alter table public.measures_encounter_view_history enable row level security;

drop policy if exists "measures encounter history select" on public.measures_encounter_view_history;
create policy "measures encounter history select"
  on public.measures_encounter_view_history
  for select
  using (true);

drop policy if exists "measures encounter history insert" on public.measures_encounter_view_history;
create policy "measures encounter history insert"
  on public.measures_encounter_view_history
  for insert
  with check (true);

drop policy if exists "measures encounter history update" on public.measures_encounter_view_history;
create policy "measures encounter history update"
  on public.measures_encounter_view_history
  for update
  using (true)
  with check (true);

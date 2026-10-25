create table if not exists public.c3_oar_seeded_reference (
  seeded_reference_key text primary key,
  seeded_reference_type text not null check (seeded_reference_type in ('infrastructure', 'role', 'process', 'validation')),
  seeded_reference_path text not null,
  seeded_status text not null check (seeded_status in ('seeded', 'active_infrastructure_reference', 'active_process_reference')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create table public.measures_registry("id" uuid default gen_random_uuid() not null,"registry_key" text not null,"display_title" text not null,"registry_family" text not null,"encounter_type" text,"material_family" text,"sequence_order" integer,"release_state" text default 'sealed'::text not null,"access_state" text default 'gated'::text not null,"parent_registry_id" uuid,"depends_on_registry_id" uuid,"envelope_id" uuid,"phase_label" text,"is_active" boolean default true not null,"metadata" jsonb default '{}'::jsonb not null,"created_at" timestamp with time zone default now() not null,"updated_at" timestamp with time zone default now() not null);
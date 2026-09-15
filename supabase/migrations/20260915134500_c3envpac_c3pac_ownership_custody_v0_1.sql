-- c3EnvPac / c3Pac ownership and custody model v0.1
-- 2026-09-15

create table if not exists public.c3_envpac (
  envpac_key text primary key,
  env_key text not null references public.c3_environment(env_key) on update cascade on delete restrict,
  version text not null,
  standing text not null,
  owner_subject_type text not null check (owner_subject_type in ('individual','entity','system','environment')),
  owner_subject_key text not null,
  custodian_subject_type text not null check (custodian_subject_type in ('individual','entity','system','environment','service')),
  custodian_subject_key text not null,
  custody_uri text not null,
  custody_provider text not null,
  content_sha256 text,
  architecture_version text not null default 'c3pac_v0.1',
  is_effective boolean not null default true,
  portable boolean not null default true,
  metadata jsonb not null default '{}'::jsonb,
  effective_at timestamptz not null default now(),
  superseded_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (env_key, version)
);

create unique index if not exists c3_envpac_one_effective_per_env
  on public.c3_envpac(env_key)
  where is_effective = true;

create table if not exists public.c3_pac (
  pac_key text primary key,
  envpac_key text not null references public.c3_envpac(envpac_key) on update cascade on delete restrict,
  pac_type text not null,
  version text not null,
  standing text not null,
  custody_uri text not null,
  content_sha256 text,
  source_authority text,
  is_effective boolean not null default true,
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (envpac_key, pac_key, version)
);

create table if not exists public.c3_pac_runtime_binding (
  binding_key text primary key,
  pac_key text not null references public.c3_pac(pac_key) on update cascade on delete cascade,
  media_role text not null,
  provider text not null,
  bucket_name text,
  object_path text,
  runtime_uri text,
  standing text not null default 'active',
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (pac_key, media_role, provider, bucket_name, object_path)
);

create table if not exists public.c3_envpac_access_grant (
  grant_key text primary key,
  envpac_key text not null references public.c3_envpac(envpac_key) on update cascade on delete cascade,
  subject_type text not null check (subject_type in ('individual','entity','system','environment','service')),
  subject_key text not null,
  relation_role text not null check (relation_role in ('owner','custodian','delegate','consumer')),
  scope jsonb not null default '{}'::jsonb,
  standing text not null default 'active',
  granted_by_type text not null,
  granted_by_key text not null,
  granted_at timestamptz not null default now(),
  expires_at timestamptz,
  revoked_at timestamptz,
  evidence_ref text,
  metadata jsonb not null default '{}'::jsonb
);

create index if not exists c3_envpac_access_subject_idx
  on public.c3_envpac_access_grant(subject_type, subject_key, standing);

create table if not exists public.c3_pac_relation (
  relation_key text primary key,
  source_pac_key text not null references public.c3_pac(pac_key) on update cascade on delete cascade,
  relation_type text not null,
  target_kind text not null check (target_kind in ('pac','envpac','environment','system','registry','source','evidence')),
  target_key text not null,
  standing text not null default 'active',
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);

create or replace view public.c3_envpac_registry_reference as
select
  e.env_key,
  e.system_key,
  e.environment_name,
  p.envpac_key,
  p.version as envpac_version,
  p.standing as envpac_standing,
  p.owner_subject_type,
  p.owner_subject_key,
  p.custodian_subject_type,
  p.custodian_subject_key,
  p.custody_uri,
  p.custody_provider,
  p.content_sha256,
  p.portable,
  p.effective_at
from public.c3_environment e
join public.c3_envpac p on p.env_key = e.env_key
where p.is_effective = true;

insert into public.c3_envpac (
  envpac_key, env_key, version, standing,
  owner_subject_type, owner_subject_key,
  custodian_subject_type, custodian_subject_key,
  custody_uri, custody_provider, content_sha256,
  metadata
) values (
  'c3envpac_measures_registry_v0_1',
  'env_measures_registry',
  'v0.1',
  'working',
  'entity',
  'c3_community_partners_dao_llc',
  'system',
  'c3_field',
  'repo://c3codex/c3-Field/docs/envpacs/measures_registry/c3envpac_measures_registry_v0_1.meta.md',
  'github',
  null,
  jsonb_build_object(
    'architecture_ref','docs/architecture/c3_field/c3pac_architecture_v0_1.meta.md',
    'portable_owner_object',true
  )
)
on conflict (envpac_key) do update set
  standing = excluded.standing,
  owner_subject_type = excluded.owner_subject_type,
  owner_subject_key = excluded.owner_subject_key,
  custodian_subject_type = excluded.custodian_subject_type,
  custodian_subject_key = excluded.custodian_subject_key,
  custody_uri = excluded.custody_uri,
  custody_provider = excluded.custody_provider,
  metadata = public.c3_envpac.metadata || excluded.metadata,
  updated_at = now();

insert into public.c3_pac (
  pac_key, envpac_key, pac_type, version, standing, custody_uri, source_authority, metadata
) values (
  'measures_registry_home_c3webpac_v0_1',
  'c3envpac_measures_registry_v0_1',
  'c3WebPac',
  'v0.1',
  'active',
  'repo://c3codex/c3-Field/docs/oar/measures_registry/measures_homepage_hero_webpac_v0_1.meta.md',
  'webpac',
  jsonb_build_object('runtime_surface','measures_registry_home')
)
on conflict (pac_key) do update set
  envpac_key = excluded.envpac_key,
  standing = excluded.standing,
  custody_uri = excluded.custody_uri,
  source_authority = excluded.source_authority,
  metadata = public.c3_pac.metadata || excluded.metadata,
  updated_at = now();

insert into public.c3_pac_runtime_binding
(binding_key, pac_key, media_role, provider, bucket_name, object_path, standing)
values
  ('mr_home_logo_binding','measures_registry_home_c3webpac_v0_1','measures_registry_logo','supabase','measures-registry','measures_registry_logo.webp','active'),
  ('mr_home_mark_binding','measures_registry_home_c3webpac_v0_1','registry_mark','supabase','measures-registry','measures_registry_mark.webp','active'),
  ('mr_home_hero_bg_binding','measures_registry_home_c3webpac_v0_1','hero_background','supabase','measures-registry','campaign_derivatives/hero_background_mr.png','active')
on conflict (binding_key) do update set
  standing = excluded.standing,
  updated_at = now();

insert into public.c3_envpac_access_grant
(grant_key, envpac_key, subject_type, subject_key, relation_role, scope, standing, granted_by_type, granted_by_key, evidence_ref)
values
  ('mr_envpac_owner_grant','c3envpac_measures_registry_v0_1','entity','c3_community_partners_dao_llc','owner','{"rights":["inspect","export","transfer_custody","grant","revoke"]}'::jsonb,'active','operator','op044','c3pac_architecture_v0_1'),
  ('mr_envpac_custodian_grant','c3envpac_measures_registry_v0_1','system','c3_field','custodian','{"rights":["hold","version","resolve_runtime_bindings"]}'::jsonb,'active','operator','op044','c3pac_architecture_v0_1')
on conflict (grant_key) do update set
  scope = excluded.scope,
  standing = excluded.standing,
  evidence_ref = excluded.evidence_ref;

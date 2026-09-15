-- c3EnvPac rooted systems + C3ME.env embedding v0.1
-- 2026-09-15
-- Extends the owner/custody object with environment and rooted-system relations.

create table if not exists public.c3_envpac_environment_binding (
  binding_key text primary key,
  envpac_key text not null references public.c3_envpac(envpac_key) on update cascade on delete cascade,
  env_key text not null references public.c3_environment(env_key) on update cascade on delete restrict,
  binding_role text not null check (binding_role in (
    'owned_environment',
    'c3me_environment',
    'parent_environment',
    'related_environment'
  )),
  standing text not null default 'active',
  is_primary boolean not null default false,
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (envpac_key, env_key, binding_role)
);

create unique index if not exists c3_envpac_one_primary_owned_environment
  on public.c3_envpac_environment_binding(envpac_key)
  where binding_role = 'owned_environment' and is_primary = true;

create table if not exists public.c3_envpac_rooted_system (
  rooted_system_key text primary key,
  envpac_key text not null references public.c3_envpac(envpac_key) on update cascade on delete cascade,
  system_key text not null,
  relation_role text not null check (relation_role in (
    'operating_system',
    'registry',
    'governance',
    'publication',
    'distribution',
    'source_authority',
    'evidence',
    'supporting_system'
  )),
  standing text not null default 'active',
  authority_scope jsonb not null default '{}'::jsonb,
  runtime_ref text,
  source_ref text,
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (envpac_key, system_key, relation_role)
);

create table if not exists public.c3_envpac_capability_grant (
  capability_key text primary key,
  envpac_key text not null references public.c3_envpac(envpac_key) on update cascade on delete cascade,
  system_key text not null,
  capability text not null,
  scope jsonb not null default '{}'::jsonb,
  standing text not null default 'active',
  evidence_ref text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (envpac_key, system_key, capability)
);

create or replace view public.c3_envpac_effective_graph as
select
  ep.envpac_key,
  ep.env_key as registry_env_key,
  ep.version,
  ep.standing as envpac_standing,
  ep.owner_subject_type,
  ep.owner_subject_key,
  ep.custodian_subject_type,
  ep.custodian_subject_key,
  ep.custody_uri,
  ep.custody_provider,
  ep.content_sha256,
  ep.portable,
  coalesce(
    (
      select jsonb_agg(
        jsonb_build_object(
          'env_key', b.env_key,
          'binding_role', b.binding_role,
          'standing', b.standing,
          'is_primary', b.is_primary,
          'metadata', b.metadata
        )
        order by b.is_primary desc, b.env_key
      )
      from public.c3_envpac_environment_binding b
      where b.envpac_key = ep.envpac_key
    ),
    '[]'::jsonb
  ) as environment_bindings,
  coalesce(
    (
      select jsonb_agg(
        jsonb_build_object(
          'system_key', rs.system_key,
          'relation_role', rs.relation_role,
          'standing', rs.standing,
          'authority_scope', rs.authority_scope,
          'runtime_ref', rs.runtime_ref,
          'source_ref', rs.source_ref
        )
        order by rs.relation_role, rs.system_key
      )
      from public.c3_envpac_rooted_system rs
      where rs.envpac_key = ep.envpac_key
    ),
    '[]'::jsonb
  ) as rooted_systems,
  coalesce(
    (
      select jsonb_agg(
        jsonb_build_object(
          'pac_key', p.pac_key,
          'pac_type', p.pac_type,
          'version', p.version,
          'standing', p.standing,
          'custody_uri', p.custody_uri,
          'content_sha256', p.content_sha256
        )
        order by p.pac_type, p.pac_key
      )
      from public.c3_pac p
      where p.envpac_key = ep.envpac_key
        and p.is_effective = true
    ),
    '[]'::jsonb
  ) as packages
from public.c3_envpac ep
where ep.is_effective = true;

insert into public.c3_envpac_environment_binding
(binding_key, envpac_key, env_key, binding_role, standing, is_primary, metadata)
values
(
  'mr_envpac_owned_environment',
  'c3envpac_measures_registry_v0_1',
  'env_measures_registry',
  'owned_environment',
  'active',
  true,
  jsonb_build_object(
    'semantic','c3EnvPac represents this governed environment',
    'portable',true
  )
)
on conflict (binding_key) do update set
  standing = excluded.standing,
  is_primary = excluded.is_primary,
  metadata = public.c3_envpac_environment_binding.metadata || excluded.metadata,
  updated_at = now();

insert into public.c3_envpac_rooted_system
(rooted_system_key, envpac_key, system_key, relation_role, standing, authority_scope, runtime_ref, source_ref, metadata)
values
(
  'mr_envpac_root_c3ops',
  'c3envpac_measures_registry_v0_1',
  'c3ops',
  'operating_system',
  'active',
  jsonb_build_object(
    'may_operate',true,
    'may_take_ownership',false,
    'may_transfer_custody',false,
    'visibility_does_not_grant_action',true,
    'action_does_not_grant_passage',true,
    'passage_does_not_transfer_authority',true
  ),
  'https://c3ops.c3field.online',
  'docs/operations/c3ops/persistence-door.md',
  jsonb_build_object(
    'role','build_operate_observe_preserve',
    'owner_boundary','c3EnvPac remains owner-addressable custody object'
  )
),
(
  'mr_envpac_root_measures_registry',
  'c3envpac_measures_registry_v0_1',
  'measures_registry',
  'registry',
  'active',
  jsonb_build_object(
    'may_record_standing',true,
    'may_reference_envpac',true,
    'may_absorb_envpac_custody',false
  ),
  'https://measuresregistry.com',
  'public.measures_registry',
  jsonb_build_object('role','standing_and_reference')
)
on conflict (rooted_system_key) do update set
  standing = excluded.standing,
  authority_scope = excluded.authority_scope,
  runtime_ref = excluded.runtime_ref,
  source_ref = excluded.source_ref,
  metadata = public.c3_envpac_rooted_system.metadata || excluded.metadata,
  updated_at = now();

insert into public.c3_envpac_capability_grant
(capability_key, envpac_key, system_key, capability, scope, standing, evidence_ref)
values
(
  'mr_envpac_c3ops_operate',
  'c3envpac_measures_registry_v0_1',
  'c3ops',
  'operate_environment',
  jsonb_build_object(
    'functions',jsonb_build_array('build','work','systems','registry','evidence','current','c3optics','interoperability'),
    'ownership_transfer',false,
    'custody_transfer',false
  ),
  'active',
  'docs/operations/c3ops/persistence-door.md'
),
(
  'mr_envpac_registry_reference',
  'c3envpac_measures_registry_v0_1',
  'measures_registry',
  'reference_envpac',
  jsonb_build_object(
    'reference_only',true,
    'custody_absorption',false
  ),
  'active',
  'docs/architecture/c3_field/c3pac_architecture_v0_1.meta.md'
)
on conflict (capability_key) do update set
  scope = excluded.scope,
  standing = excluded.standing,
  evidence_ref = excluded.evidence_ref,
  updated_at = now();

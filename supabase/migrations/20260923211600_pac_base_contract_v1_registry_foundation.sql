-- PAC Base Contract v1 Registry foundation
-- Operator: op044
-- OAR2: oar2_implement_pac_base_contract_v1_registry_foundation_chazz_001_20260923
-- Source contract: PAC Base Contract v1, Drive 1mEdfUnG_4NZtVvik7ktE9VIKVg8pPzdd6PARh-GOaeA
-- Existing PAC rows are intentionally not backfilled or rebound by this migration.

create table public.c3_pac_type_contract (
  contract_key text primary key,
  pac_type text not null,
  contract_version text not null,
  applies_to_table text not null check (applies_to_table in ('c3_pac','c3_envpac')),
  standing text not null default 'active',
  is_effective boolean not null default false,
  required_fields jsonb not null default '[]'::jsonb check (jsonb_typeof(required_fields)='array'),
  required_member_roles jsonb not null default '[]'::jsonb check (jsonb_typeof(required_member_roles)='array'),
  optional_member_roles jsonb not null default '[]'::jsonb check (jsonb_typeof(optional_member_roles)='array'),
  required_relations jsonb not null default '[]'::jsonb check (jsonb_typeof(required_relations)='array'),
  conditional_requirements jsonb not null default '[]'::jsonb check (jsonb_typeof(conditional_requirements)='array'),
  resolver_policy jsonb not null default '{}'::jsonb check (jsonb_typeof(resolver_policy)='object'),
  release_policy jsonb not null default '{}'::jsonb check (jsonb_typeof(release_policy)='object'),
  authority_effect text not null default 'none',
  source_authority text,
  architecture_source_key text,
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (pac_type, contract_version)
);

create unique index c3_pac_type_contract_one_effective_per_type
  on public.c3_pac_type_contract (pac_type)
  where is_effective;

alter table public.c3_pac_type_contract enable row level security;

create trigger c3_pac_type_contract_set_updated_at
before update on public.c3_pac_type_contract
for each row execute function public.set_updated_at();

alter table public.c3_pac
  add column contract_key text references public.c3_pac_type_contract(contract_key) on update cascade on delete restrict,
  add column architecture_version text,
  add column custodian_subject_type text,
  add column custodian_subject_key text,
  add column custody_provider text,
  add column authority_effect text,
  add column release_state text,
  add column execution_authority_state text,
  add column formation_state text,
  add column effective_at timestamptz,
  add column supersedes_pac_key text references public.c3_pac(pac_key) on update cascade on delete restrict,
  add column superseded_at timestamptz,
  add column return_evidence_required boolean;

alter table public.c3_pac
  add constraint c3_pac_custodian_subject_type_v1_check
    check (
      custodian_subject_type is null
      or custodian_subject_type in ('individual','entity','system','environment','service')
    ),
  add constraint c3_pac_supersedes_not_self_v1_check
    check (supersedes_pac_key is null or supersedes_pac_key <> pac_key);

create index c3_pac_contract_key_idx on public.c3_pac(contract_key);
create index c3_pac_supersedes_pac_key_idx on public.c3_pac(supersedes_pac_key);

create table public.c3_pac_member (
  member_key text primary key,
  pac_key text not null references public.c3_pac(pac_key) on update cascade on delete cascade,
  member_kind text not null check (
    member_kind in ('asset','record','content','media','derivative','route','relation','destination','evidence','pac')
  ),
  member_role text not null,
  source_object_key text,
  custody_provider text,
  custody_identifier text,
  custody_location text,
  runtime_uri text,
  runtime_binding_key text references public.c3_pac_runtime_binding(binding_key) on update cascade on delete set null,
  integrity_algorithm text,
  integrity_value text,
  version text,
  standing text not null default 'active',
  required boolean not null default false,
  release_scope text not null default 'registered',
  ordinal integer check (ordinal is null or ordinal > 0),
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint c3_pac_member_integrity_pair_check check (
    (integrity_algorithm is null and integrity_value is null)
    or (integrity_algorithm is not null and integrity_value is not null)
  ),
  constraint c3_pac_member_custody_shape_check check (
    (custody_identifier is null and custody_location is null)
    or custody_provider is not null
  )
);

create index c3_pac_member_pac_key_idx on public.c3_pac_member(pac_key);
create index c3_pac_member_pac_role_idx on public.c3_pac_member(pac_key,member_role);
create index c3_pac_member_source_object_idx on public.c3_pac_member(source_object_key)
  where source_object_key is not null;

alter table public.c3_pac_member enable row level security;

create trigger c3_pac_member_set_updated_at
before update on public.c3_pac_member
for each row execute function public.set_updated_at();

create table public.c3_profile_pac (
  pac_key text primary key references public.c3_pac(pac_key) on update cascade on delete cascade,
  profile_key text not null,
  subject_type text not null check (length(btrim(subject_type)) > 0),
  subject_key text not null check (length(btrim(subject_key)) > 0),
  profile_class text not null check (profile_class in ('individual','organization','initiative','project','place')),
  display_label text not null check (length(btrim(display_label)) > 0),
  visibility_scope text not null default 'private' check (
    visibility_scope in ('private','environment','relational','public')
  ),
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index c3_profile_pac_profile_key_idx on public.c3_profile_pac(profile_key);
create index c3_profile_pac_subject_idx on public.c3_profile_pac(subject_type,subject_key);

alter table public.c3_profile_pac enable row level security;

create trigger c3_profile_pac_set_updated_at
before update on public.c3_profile_pac
for each row execute function public.set_updated_at();

create or replace function public.c3_jsonb_path_satisfied(
  p_document jsonb,
  p_dotted_path text
)
returns boolean
language plpgsql
immutable
as $$
declare
  v_value jsonb;
  v_type text;
begin
  if p_document is null or p_dotted_path is null or btrim(p_dotted_path)='' then
    return false;
  end if;

  v_value := p_document #> string_to_array(p_dotted_path,'.');

  if v_value is null or v_value = 'null'::jsonb then
    return false;
  end if;

  v_type := jsonb_typeof(v_value);

  if v_type='string' then
    return length(btrim(v_value #>> '{}')) > 0;
  elsif v_type='array' then
    return jsonb_array_length(v_value) > 0;
  elsif v_type='object' then
    return v_value <> '{}'::jsonb;
  end if;

  return true;
end;
$$;

create or replace function public.c3_pac_intake_contract(
  p_pac_type text
)
returns jsonb
language sql
stable
security invoker
set search_path = public
as $$
  select to_jsonb(c)
  from public.c3_pac_type_contract c
  where c.pac_type = p_pac_type
    and c.is_effective = true
    and c.standing = 'active'
  limit 1;
$$;

create or replace function public.c3_pac_evaluate(
  p_pac_key text
)
returns jsonb
language plpgsql
stable
security invoker
set search_path = public
as $$
declare
  v_pac public.c3_pac%rowtype;
  v_profile public.c3_profile_pac%rowtype;
  v_contract public.c3_pac_type_contract%rowtype;
  v_document jsonb;
  v_field text;
  v_req jsonb;
  v_role text;
  v_kind text;
  v_relation_type text;
  v_target_kind text;
  v_min integer;
  v_count integer;
  v_missing_fields jsonb := '[]'::jsonb;
  v_missing_member_roles jsonb := '[]'::jsonb;
  v_missing_relations jsonb := '[]'::jsonb;
  v_custody_integrity_conflicts jsonb := '[]'::jsonb;
  v_supersession_conflicts jsonb := '[]'::jsonb;
  v_release_blockers jsonb := '[]'::jsonb;
  v_allowed_release_states jsonb;
  v_completeness text;
  v_resolution text;
begin
  select * into v_pac
  from public.c3_pac
  where pac_key = p_pac_key;

  if not found then
    return jsonb_build_object(
      'pac_key',p_pac_key,
      'completeness_state','held',
      'resolution_state','held',
      'reason','pac_not_found'
    );
  end if;

  if v_pac.contract_key is null then
    return jsonb_build_object(
      'pac_key',v_pac.pac_key,
      'pac_type',v_pac.pac_type,
      'completeness_state','held',
      'resolution_state','held',
      'reason','contract_unbound_legacy',
      'legacy_unreconciled',true
    );
  end if;

  select * into v_contract
  from public.c3_pac_type_contract
  where contract_key=v_pac.contract_key
    and pac_type=v_pac.pac_type;

  if not found then
    return jsonb_build_object(
      'pac_key',v_pac.pac_key,
      'pac_type',v_pac.pac_type,
      'contract_key',v_pac.contract_key,
      'completeness_state','held',
      'resolution_state','held',
      'reason','contract_type_mismatch_or_missing'
    );
  end if;

  select * into v_profile
  from public.c3_profile_pac
  where pac_key=v_pac.pac_key;

  v_document := to_jsonb(v_pac)
    || jsonb_build_object(
      'profile',
      case
        when v_profile.pac_key is null then 'null'::jsonb
        else to_jsonb(v_profile)
      end
    );

  for v_field in
    select value
    from jsonb_array_elements_text(v_contract.required_fields)
  loop
    if not public.c3_jsonb_path_satisfied(v_document,v_field) then
      v_missing_fields := v_missing_fields || jsonb_build_array(v_field);
    end if;
  end loop;

  for v_req in
    select value
    from jsonb_array_elements(v_contract.required_member_roles)
  loop
    v_role := nullif(v_req->>'role','');
    v_kind := nullif(v_req->>'kind','');
    v_min := greatest(coalesce((v_req->>'min')::integer,1),1);

    select count(*)::integer into v_count
    from public.c3_pac_member m
    where m.pac_key=v_pac.pac_key
      and m.standing='active'
      and (v_role is null or m.member_role=v_role)
      and (v_kind is null or m.member_kind=v_kind);

    if v_count < v_min then
      v_missing_member_roles := v_missing_member_roles
        || jsonb_build_array(
          jsonb_build_object(
            'role',v_role,
            'kind',v_kind,
            'required',v_min,
            'observed',v_count
          )
        );
    else
      if coalesce((v_req->>'custody_required')::boolean,false) then
        if exists (
          select 1
          from public.c3_pac_member m
          where m.pac_key=v_pac.pac_key
            and m.standing='active'
            and (v_role is null or m.member_role=v_role)
            and (v_kind is null or m.member_kind=v_kind)
            and (
              m.custody_provider is null
              or (m.custody_identifier is null and m.custody_location is null)
            )
        ) then
          v_custody_integrity_conflicts := v_custody_integrity_conflicts
            || jsonb_build_array(
              jsonb_build_object('role',v_role,'kind',v_kind,'conflict','custody_required')
            );
        end if;
      end if;

      if coalesce((v_req->>'integrity_required')::boolean,false) then
        if exists (
          select 1
          from public.c3_pac_member m
          where m.pac_key=v_pac.pac_key
            and m.standing='active'
            and (v_role is null or m.member_role=v_role)
            and (v_kind is null or m.member_kind=v_kind)
            and (m.integrity_algorithm is null or m.integrity_value is null)
        ) then
          v_custody_integrity_conflicts := v_custody_integrity_conflicts
            || jsonb_build_array(
              jsonb_build_object('role',v_role,'kind',v_kind,'conflict','integrity_required')
            );
        end if;
      end if;
    end if;
  end loop;

  for v_req in
    select value
    from jsonb_array_elements(v_contract.required_relations)
  loop
    v_relation_type := nullif(v_req->>'relation_type','');
    v_target_kind := nullif(v_req->>'target_kind','');
    v_min := greatest(coalesce((v_req->>'min')::integer,1),1);

    select count(*)::integer into v_count
    from public.c3_pac_relation r
    where r.source_pac_key=v_pac.pac_key
      and r.standing='active'
      and (v_relation_type is null or r.relation_type=v_relation_type)
      and (v_target_kind is null or r.target_kind=v_target_kind);

    if v_count < v_min then
      v_missing_relations := v_missing_relations
        || jsonb_build_array(
          jsonb_build_object(
            'relation_type',v_relation_type,
            'target_kind',v_target_kind,
            'required',v_min,
            'observed',v_count
          )
        );
    end if;
  end loop;

  if v_pac.superseded_at is not null and v_pac.is_effective then
    v_supersession_conflicts := v_supersession_conflicts
      || jsonb_build_array('superseded_pac_marked_effective');
  end if;

  if v_pac.supersedes_pac_key = v_pac.pac_key then
    v_supersession_conflicts := v_supersession_conflicts
      || jsonb_build_array('self_supersession');
  end if;

  if coalesce((v_contract.release_policy->>'requires_effective')::boolean,false)
     and not v_pac.is_effective then
    v_release_blockers := v_release_blockers || jsonb_build_array('pac_not_effective');
  end if;

  v_allowed_release_states := v_contract.release_policy->'allowed_release_states_for_resolution';

  if v_allowed_release_states is not null
     and jsonb_typeof(v_allowed_release_states)='array'
     and jsonb_array_length(v_allowed_release_states)>0
     and not exists (
       select 1
       from jsonb_array_elements_text(v_allowed_release_states) s(value)
       where s.value = coalesce(v_pac.release_state,'')
     ) then
    v_release_blockers := v_release_blockers
      || jsonb_build_array(
        jsonb_build_object(
          'release_state',v_pac.release_state,
          'allowed',v_allowed_release_states
        )
      );
  end if;

  v_completeness := case
    when jsonb_array_length(v_missing_fields)=0
      and jsonb_array_length(v_missing_member_roles)=0
      and jsonb_array_length(v_missing_relations)=0
      and jsonb_array_length(v_custody_integrity_conflicts)=0
      and jsonb_array_length(v_supersession_conflicts)=0
    then 'pass'
    else 'held'
  end;

  v_resolution := case
    when v_completeness='pass'
      and jsonb_array_length(v_release_blockers)=0
    then 'pass'
    else 'held'
  end;

  return jsonb_build_object(
    'pac_key',v_pac.pac_key,
    'pac_type',v_pac.pac_type,
    'contract_key',v_contract.contract_key,
    'contract_version',v_contract.contract_version,
    'completeness_state',v_completeness,
    'resolution_state',v_resolution,
    'missing_required_fields',v_missing_fields,
    'missing_member_roles',v_missing_member_roles,
    'missing_relations',v_missing_relations,
    'custody_integrity_conflicts',v_custody_integrity_conflicts,
    'supersession_conflicts',v_supersession_conflicts,
    'release_blockers',v_release_blockers,
    'authority_effect',coalesce(v_pac.authority_effect,v_contract.authority_effect,'none')
  );
end;
$$;

create or replace function public.c3_profile_pac_truth(
  p_pac_key text
)
returns jsonb
language plpgsql
stable
security invoker
set search_path = public
as $$
declare
  v_pac public.c3_pac%rowtype;
  v_profile public.c3_profile_pac%rowtype;
  v_members jsonb;
  v_evaluation jsonb;
begin
  select * into v_pac
  from public.c3_pac
  where pac_key=p_pac_key
    and pac_type='ProfilePAC';

  if not found then
    return jsonb_build_object('standing','profile_pac_not_found','pac_key',p_pac_key);
  end if;

  select * into v_profile
  from public.c3_profile_pac
  where pac_key=p_pac_key;

  select coalesce(
    jsonb_agg(
      jsonb_build_object(
        'member_key',m.member_key,
        'member_kind',m.member_kind,
        'member_role',m.member_role,
        'source_object_key',m.source_object_key,
        'custody_provider',m.custody_provider,
        'custody_identifier',m.custody_identifier,
        'custody_location',m.custody_location,
        'runtime_uri',m.runtime_uri,
        'integrity_algorithm',m.integrity_algorithm,
        'integrity_value',m.integrity_value,
        'version',m.version,
        'standing',m.standing,
        'release_scope',m.release_scope,
        'ordinal',m.ordinal
      )
      order by m.ordinal nulls last,m.member_key
    ),
    '[]'::jsonb
  ) into v_members
  from public.c3_pac_member m
  where m.pac_key=p_pac_key
    and m.standing='active';

  v_evaluation := public.c3_pac_evaluate(p_pac_key);

  return jsonb_build_object(
    'pac_key',v_pac.pac_key,
    'envpac_key',v_pac.envpac_key,
    'version',v_pac.version,
    'standing',v_pac.standing,
    'is_effective',v_pac.is_effective,
    'architecture_version',v_pac.architecture_version,
    'release_state',v_pac.release_state,
    'authority_effect',coalesce(v_pac.authority_effect,'none'),
    'profile',case
      when v_profile.pac_key is null then null
      else jsonb_build_object(
        'profile_key',v_profile.profile_key,
        'subject_type',v_profile.subject_type,
        'subject_key',v_profile.subject_key,
        'profile_class',v_profile.profile_class,
        'display_label',v_profile.display_label,
        'visibility_scope',v_profile.visibility_scope
      )
    end,
    'members',v_members,
    'evaluation',v_evaluation
  );
end;
$$;

insert into public.c3_pac_type_contract (
  contract_key,pac_type,contract_version,applies_to_table,standing,is_effective,
  required_fields,required_member_roles,optional_member_roles,required_relations,
  conditional_requirements,resolver_policy,release_policy,authority_effect,
  source_authority,architecture_source_key,metadata
) values
(
  'pac_contract_envpac_v1','EnvPAC','v1','c3_envpac','active',true,
  '["envpac_key","env_key","version","standing","owner_subject_type","owner_subject_key","custodian_subject_type","custodian_subject_key","custody_uri","custody_provider","architecture_version","is_effective","portable"]'::jsonb,
  '[]'::jsonb,'[]'::jsonb,'[]'::jsonb,'[]'::jsonb,
  '{"resolver":"Registry","fail_closed":true}'::jsonb,
  '{"requires_effective":true}'::jsonb,
  'none','op044_confirmed_pac_base_contract_v1','pac_base_contract_v1_candidate_20260923',
  '{"root_contract":true,"child_table":"c3_pac","retroactive_enforcement":false}'::jsonb
),
(
  'pac_contract_c3webpac_v1','c3WebPac','v1','c3_pac','active',true,
  '["pac_key","envpac_key","pac_type","version","standing","custody_uri","source_authority","contract_key","architecture_version","custodian_subject_type","custodian_subject_key","custody_provider","authority_effect","release_state","execution_authority_state","formation_state","return_evidence_required"]'::jsonb,
  '[{"role":"presentation_manifest","kind":"record","min":1,"custody_required":false,"integrity_required":false}]'::jsonb,
  '[{"role":"media","kind":"media"},{"role":"route","kind":"route"},{"role":"interaction","kind":"record"}]'::jsonb,
  '[]'::jsonb,'[]'::jsonb,
  '{"resolver":"FREE","fail_closed":true,"frontend_role":"renderer"}'::jsonb,
  '{"requires_effective":true,"allowed_release_states_for_resolution":["private","runtime_release_authorized","public_release_authorized"]}'::jsonb,
  'none','op044_confirmed_pac_base_contract_v1','pac_base_contract_v1_candidate_20260923',
  '{"retroactive_enforcement":false}'::jsonb
),
(
  'pac_contract_pubpac_v1','PubPac','v1','c3_pac','active',true,
  '["pac_key","envpac_key","pac_type","version","standing","custody_uri","source_authority","contract_key","architecture_version","custodian_subject_type","custodian_subject_key","custody_provider","authority_effect","release_state","execution_authority_state","formation_state","return_evidence_required"]'::jsonb,
  '[{"role":"canonical_publication_object","min":1,"custody_required":true,"integrity_required":true}]'::jsonb,
  '[{"role":"publication_media"},{"role":"derivative","kind":"derivative"},{"role":"canonical_route","kind":"route"},{"role":"evidence","kind":"evidence"}]'::jsonb,
  '[]'::jsonb,'[]'::jsonb,
  '{"resolver":"FREE","fail_closed":true}'::jsonb,
  '{"requires_effective":true,"allowed_release_states_for_resolution":["private","published","public_release_authorized"]}'::jsonb,
  'none','op044_confirmed_pac_base_contract_v1','pac_base_contract_v1_candidate_20260923',
  '{"publication_standing_distinct_from_distribution_authority":true,"retroactive_enforcement":false}'::jsonb
),
(
  'pac_contract_campaignpac_v1','CampaignPac','v1','c3_pac','active',true,
  '["pac_key","envpac_key","pac_type","version","standing","custody_uri","source_authority","contract_key","architecture_version","custodian_subject_type","custodian_subject_key","custody_provider","authority_effect","release_state","execution_authority_state","formation_state","return_evidence_required"]'::jsonb,
  '[{"role":"campaign_manifest","kind":"record","min":1,"custody_required":false,"integrity_required":false},{"role":"destination","kind":"destination","min":1,"custody_required":false,"integrity_required":false}]'::jsonb,
  '[{"role":"source_object"},{"role":"approved_derivative","kind":"derivative"},{"role":"evidence","kind":"evidence"}]'::jsonb,
  '[]'::jsonb,'[]'::jsonb,
  '{"resolver":"Lapzuli_or_bounded_executor","fail_closed":true,"revalidate_at_execution":true}'::jsonb,
  '{"requires_effective":true,"allowed_release_states_for_resolution":["encounter_open","lapzuli_ready","execution_ready"]}'::jsonb,
  'none','op044_confirmed_pac_base_contract_v1','pac_base_contract_v1_candidate_20260923',
  '{"external_execution_authority_separate":true,"retroactive_enforcement":false}'::jsonb
),
(
  'pac_contract_profilepac_v1','ProfilePAC','v1','c3_pac','active',true,
  '["pac_key","envpac_key","pac_type","version","standing","custody_uri","source_authority","contract_key","architecture_version","custodian_subject_type","custodian_subject_key","custody_provider","authority_effect","release_state","execution_authority_state","formation_state","return_evidence_required","profile.profile_key","profile.subject_type","profile.subject_key","profile.profile_class","profile.display_label","profile.visibility_scope"]'::jsonb,
  '[]'::jsonb,
  '[{"role":"avatar","kind":"media"},{"role":"bio","kind":"content"},{"role":"capacity","kind":"record"},{"role":"interest","kind":"record"},{"role":"contact_preference","kind":"record"},{"role":"link","kind":"record"},{"role":"profile_media","kind":"media"}]'::jsonb,
  '[]'::jsonb,'[]'::jsonb,
  '{"resolver":"FREE","fail_closed":true,"surface":"OYE/My Environment"}'::jsonb,
  '{"requires_effective":true,"allowed_release_states_for_resolution":["private","environment","relational","public"]}'::jsonb,
  'none','op044_confirmed_pac_base_contract_v1','pac_base_contract_v1_candidate_20260923',
  '{"profile_does_not_create_authority":true,"operator_standing_external":true,"membership_external":true,"current_external":true,"c3_key_external":true}'::jsonb
);

revoke all on function public.c3_jsonb_path_satisfied(jsonb,text) from public;
revoke all on function public.c3_pac_intake_contract(text) from public;
revoke all on function public.c3_pac_evaluate(text) from public;
revoke all on function public.c3_profile_pac_truth(text) from public;

grant execute on function public.c3_jsonb_path_satisfied(jsonb,text) to service_role;
grant execute on function public.c3_pac_intake_contract(text) to service_role;
grant execute on function public.c3_pac_evaluate(text) to service_role;
grant execute on function public.c3_profile_pac_truth(text) to service_role;

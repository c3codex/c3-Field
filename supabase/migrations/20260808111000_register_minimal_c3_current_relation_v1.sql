-- c3 Current minimal governed present-state relation v1
-- Source: c3_ledger_0005_c3_current_as_governed_present_state.meta.md
-- Source grammar: Spark / Weave / Field / Form.
-- Candidate 1 + 3 + 3 + 3 expansion remains provisional and is not encoded here.
--
-- This migration registers only the minimum off-chain Current relation required to
-- preserve which governed state presently applies to an environment. It does not
-- deploy or modify a smart_contract, mint or burn a token, bind a wallet, change
-- token economics, or create CCC chain standing.
--
-- Evidence remains governed by c3Ops asset authority. Current snapshots only the
-- minimum evidence identity/standing needed to preserve what supported a Current
-- state at the moment that state became effective.

create extension if not exists pgcrypto;

-- Refuse to silently normalize a partially-created Current implementation from a
-- failed prior execution. If either object already exists, inspection is required.
do $$
begin
  if to_regclass('public.c3_current_state') is not null then
    raise exception 'HOLD_CURRENT_STATE_ALREADY_EXISTS: inspect public.c3_current_state before applying this migration';
  end if;

  if to_regclass('public.c3_current_evidence_binding') is not null then
    raise exception 'HOLD_CURRENT_EVIDENCE_BINDING_ALREADY_EXISTS: inspect public.c3_current_evidence_binding before applying this migration';
  end if;
end;
$$;

create table public.c3_current_state (
  current_state_key text primary key,
  current_relation text not null default 'c3_current'
    check (current_relation = 'c3_current'),
  env_key text not null,
  standing text not null,

  source_disposition text not null
    check (source_disposition in ('confirmed_close', 'confirmed_route', 'disputed_hold')),
  source_disposition_ref text not null,

  predecessor_current_state_key text
    references public.c3_current_state(current_state_key)
    on delete restrict,

  is_current boolean not null default true,
  effective_at timestamptz not null default now(),
  superseded_at timestamptz,

  source_oar2_ref text,
  source_oar1_ref text,
  created_by text not null,
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),

  constraint c3_current_state_key_not_blank
    check (length(btrim(current_state_key)) > 0),
  constraint c3_current_env_key_not_blank
    check (length(btrim(env_key)) > 0),
  constraint c3_current_standing_not_blank
    check (length(btrim(standing)) > 0),
  constraint c3_current_disposition_ref_not_blank
    check (length(btrim(source_disposition_ref)) > 0),
  constraint c3_current_created_by_not_blank
    check (length(btrim(created_by)) > 0),
  constraint c3_current_metadata_object
    check (jsonb_typeof(metadata) = 'object'),
  constraint c3_current_predecessor_not_self
    check (
      predecessor_current_state_key is null
      or predecessor_current_state_key <> current_state_key
    ),
  constraint c3_current_supersession_consistency
    check (
      (is_current is true and superseded_at is null)
      or
      (is_current is false and superseded_at is not null)
    )
);

create unique index c3_current_one_current_state_per_environment_idx
  on public.c3_current_state(env_key)
  where is_current is true;

create index c3_current_state_environment_history_idx
  on public.c3_current_state(env_key, effective_at desc);

create index c3_current_state_predecessor_idx
  on public.c3_current_state(predecessor_current_state_key)
  where predecessor_current_state_key is not null;

create table public.c3_current_evidence_binding (
  evidence_binding_key text primary key,
  current_state_key text not null
    references public.c3_current_state(current_state_key)
    on delete restrict,
  asset_key text not null,
  evidence_role text not null,

  -- Immutable snapshot of the asset evidence as it stood when this Current state
  -- was formed. The asset itself remains governed by c3Ops.
  content_hash_at_binding text not null,
  hash_algorithm_at_binding text not null,
  asset_standing_at_binding text not null,
  custody_ref_at_binding jsonb not null,
  token_ref_at_binding jsonb,
  tokenization_standing_at_binding text,

  attested_by text not null,
  attested_at timestamptz not null default now(),

  constraint c3_current_evidence_asset_key_not_blank
    check (length(btrim(asset_key)) > 0),
  constraint c3_current_evidence_role_not_blank
    check (length(btrim(evidence_role)) > 0),
  constraint c3_current_evidence_hash_not_blank
    check (length(btrim(content_hash_at_binding)) > 0),
  constraint c3_current_evidence_hash_algorithm_not_blank
    check (length(btrim(hash_algorithm_at_binding)) > 0),
  constraint c3_current_evidence_asset_standing_not_blank
    check (length(btrim(asset_standing_at_binding)) > 0),
  constraint c3_current_evidence_custody_object
    check (jsonb_typeof(custody_ref_at_binding) = 'object'),
  constraint c3_current_evidence_token_ref_object
    check (token_ref_at_binding is null or jsonb_typeof(token_ref_at_binding) = 'object'),
  constraint c3_current_evidence_attested_by_not_blank
    check (length(btrim(attested_by)) > 0),
  constraint c3_current_evidence_unique_asset_role
    unique (current_state_key, asset_key, evidence_role)
);

create index c3_current_evidence_state_idx
  on public.c3_current_evidence_binding(current_state_key);

create index c3_current_evidence_asset_idx
  on public.c3_current_evidence_binding(asset_key);

-- Current-state core fields are immutable. The only permitted state-row mutation is
-- supersession: current true -> false with superseded_at populated. A deferred
-- successor check below requires a successor Current state in the same transaction.
create or replace function public.c3_current_guard_state_update()
returns trigger
language plpgsql
set search_path = public
as $$
begin
  if new.current_state_key is distinct from old.current_state_key
    or new.current_relation is distinct from old.current_relation
    or new.env_key is distinct from old.env_key
    or new.standing is distinct from old.standing
    or new.source_disposition is distinct from old.source_disposition
    or new.source_disposition_ref is distinct from old.source_disposition_ref
    or new.predecessor_current_state_key is distinct from old.predecessor_current_state_key
    or new.effective_at is distinct from old.effective_at
    or new.source_oar2_ref is distinct from old.source_oar2_ref
    or new.source_oar1_ref is distinct from old.source_oar1_ref
    or new.created_by is distinct from old.created_by
    or new.metadata is distinct from old.metadata
    or new.created_at is distinct from old.created_at
  then
    raise exception 'c3_current_state core fields are immutable; create a successor state';
  end if;

  if old.is_current is true
    and new.is_current is false
    and old.superseded_at is null
    and new.superseded_at is not null
  then
    return new;
  end if;

  raise exception 'c3_current_state may only transition from current to superseded';
end;
$$;

create trigger c3_current_state_guard_update
before update on public.c3_current_state
for each row execute function public.c3_current_guard_state_update();

create or replace function public.c3_current_prevent_state_delete()
returns trigger
language plpgsql
set search_path = public
as $$
begin
  raise exception 'c3_current_state is lineage-preserving and may not be deleted';
end;
$$;

create trigger c3_current_state_no_delete
before delete on public.c3_current_state
for each row execute function public.c3_current_prevent_state_delete();

-- An initial Current state is permitted only when the environment has no prior
-- Current history. Every later state must identify a superseded predecessor from
-- the same environment.
create or replace function public.c3_current_validate_state_insert()
returns trigger
language plpgsql
set search_path = public
as $$
declare
  v_predecessor_env text;
  v_predecessor_is_current boolean;
  v_predecessor_superseded_at timestamptz;
begin
  if new.predecessor_current_state_key is null then
    if exists (
      select 1
      from public.c3_current_state s
      where s.env_key = new.env_key
    ) then
      raise exception 'c3_current_state initial binding requires no prior Current history for env_key %', new.env_key;
    end if;
    return new;
  end if;

  select s.env_key, s.is_current, s.superseded_at
    into v_predecessor_env, v_predecessor_is_current, v_predecessor_superseded_at
  from public.c3_current_state s
  where s.current_state_key = new.predecessor_current_state_key;

  if not found then
    raise exception 'predecessor Current state % does not exist', new.predecessor_current_state_key;
  end if;

  if v_predecessor_env <> new.env_key then
    raise exception 'predecessor Current state belongs to a different env_key';
  end if;

  if v_predecessor_is_current is true or v_predecessor_superseded_at is null then
    raise exception 'predecessor Current state must be superseded before successor insertion';
  end if;

  return new;
end;
$$;

create trigger c3_current_state_validate_insert
before insert on public.c3_current_state
for each row execute function public.c3_current_validate_state_insert();

-- A state cannot be left superseded without a current successor that names it as
-- predecessor. This check runs at transaction end so the advance function may
-- first supersede N and then insert N+1.
create or replace function public.c3_current_require_successor_after_supersede()
returns trigger
language plpgsql
set search_path = public
as $$
begin
  if old.is_current is true and new.is_current is false then
    if not exists (
      select 1
      from public.c3_current_state successor
      where successor.predecessor_current_state_key = old.current_state_key
        and successor.env_key = old.env_key
        and successor.is_current is true
    ) then
      raise exception 'superseded Current state % requires a current successor', old.current_state_key;
    end if;
  end if;

  return null;
end;
$$;

create constraint trigger c3_current_state_requires_successor
after update of is_current on public.c3_current_state
deferrable initially deferred
for each row execute function public.c3_current_require_successor_after_supersede();

-- Evidence bindings are immutable once formed. A new evidence set requires a new
-- Current state rather than mutation of historical support.
create or replace function public.c3_current_prevent_evidence_mutation()
returns trigger
language plpgsql
set search_path = public
as $$
begin
  raise exception 'c3_current_evidence_binding is immutable; advance Current to change evidence';
end;
$$;

create trigger c3_current_evidence_no_update
before update on public.c3_current_evidence_binding
for each row execute function public.c3_current_prevent_evidence_mutation();

create trigger c3_current_evidence_no_delete
before delete on public.c3_current_evidence_binding
for each row execute function public.c3_current_prevent_evidence_mutation();

-- Populate the evidence snapshot from the governed c3Ops asset record. The lookup
-- is dynamic so this migration remains reproducible even though the live July 31
-- c3Ops asset-protocol migration is not yet present on the measures branch. No
-- evidence binding may be inserted when c3Ops asset authority is unavailable.
create or replace function public.c3_current_snapshot_asset_evidence()
returns trigger
language plpgsql
set search_path = public
as $$
declare
  v_content_hash text;
  v_hash_algorithm text;
  v_asset_standing text;
  v_custody_ref jsonb;
  v_token_ref jsonb;
  v_tokenization_standing text;
begin
  if to_regclass('public.c3ops_asset_record') is null then
    raise exception 'HOLD_C3OPS_ASSET_AUTHORITY_UNAVAILABLE: public.c3ops_asset_record not found';
  end if;

  execute $asset$
    select
      content_hash,
      hash_algorithm,
      standing,
      jsonb_build_object(
        'type', authoritative_custody_type,
        'provider', authoritative_custody_provider,
        'identifier', authoritative_custody_identifier,
        'location', authoritative_custody_location
      ),
      nullif(
        jsonb_strip_nulls(
          jsonb_build_object(
            'external_anchor_type', external_anchor_type,
            'network_identifier', network_identifier,
            'contract_identifier', contract_identifier,
            'token_identifier', token_identifier,
            'anchor_standing', anchor_standing
          )
        ),
        '{}'::jsonb
      ),
      tokenization_standing
    from public.c3ops_asset_record
    where asset_key = $1
  $asset$
  into
    v_content_hash,
    v_hash_algorithm,
    v_asset_standing,
    v_custody_ref,
    v_token_ref,
    v_tokenization_standing
  using new.asset_key;

  if v_content_hash is null then
    raise exception 'HOLD_ASSET_EVIDENCE_UNRESOLVED: c3Ops asset_key % not found or lacks content hash', new.asset_key;
  end if;

  new.content_hash_at_binding := v_content_hash;
  new.hash_algorithm_at_binding := coalesce(nullif(v_hash_algorithm, ''), 'sha256');
  new.asset_standing_at_binding := v_asset_standing;
  new.custody_ref_at_binding := v_custody_ref;
  new.token_ref_at_binding := v_token_ref;
  new.tokenization_standing_at_binding := v_tokenization_standing;

  return new;
end;
$$;

create trigger c3_current_evidence_snapshot_asset
before insert on public.c3_current_evidence_binding
for each row execute function public.c3_current_snapshot_asset_evidence();

create or replace function public.c3_current_attach_evidence_set(
  p_current_state_key text,
  p_evidence_assets jsonb,
  p_attested_by text
)
returns void
language plpgsql
security definer
set search_path = public
as $$
declare
  v_item jsonb;
  v_asset_key text;
  v_evidence_role text;
  v_binding_key text;
begin
  if coalesce(jsonb_typeof(p_evidence_assets), 'array') <> 'array' then
    raise exception 'p_evidence_assets must be a JSON array';
  end if;

  if nullif(btrim(p_attested_by), '') is null then
    raise exception 'p_attested_by is required';
  end if;

  for v_item in
    select value
    from jsonb_array_elements(coalesce(p_evidence_assets, '[]'::jsonb))
  loop
    v_asset_key := nullif(btrim(v_item->>'asset_key'), '');
    v_evidence_role := nullif(btrim(v_item->>'evidence_role'), '');

    if v_asset_key is null or v_evidence_role is null then
      raise exception 'each evidence item requires asset_key and evidence_role';
    end if;

    v_binding_key := 'c3_current_evidence_' || replace(gen_random_uuid()::text, '-', '');

    insert into public.c3_current_evidence_binding (
      evidence_binding_key,
      current_state_key,
      asset_key,
      evidence_role,
      content_hash_at_binding,
      hash_algorithm_at_binding,
      asset_standing_at_binding,
      custody_ref_at_binding,
      token_ref_at_binding,
      tokenization_standing_at_binding,
      attested_by
    ) values (
      v_binding_key,
      p_current_state_key,
      v_asset_key,
      v_evidence_role,
      'pending_trigger_snapshot',
      'pending_trigger_snapshot',
      'pending_trigger_snapshot',
      '{}'::jsonb,
      null,
      null,
      p_attested_by
    );
  end loop;
end;
$$;

create or replace function public.c3_current_bind(
  p_env_key text,
  p_standing text,
  p_source_disposition text,
  p_source_disposition_ref text,
  p_created_by text,
  p_evidence_assets jsonb default '[]'::jsonb,
  p_source_oar2_ref text default null,
  p_source_oar1_ref text default null,
  p_metadata jsonb default '{}'::jsonb
)
returns text
language plpgsql
security definer
set search_path = public
as $$
declare
  v_current_state_key text;
begin
  if nullif(btrim(p_env_key), '') is null then
    raise exception 'env_key is required; do not invent an environment identity';
  end if;

  if nullif(btrim(p_standing), '') is null then
    raise exception 'standing is required';
  end if;

  if p_source_disposition not in ('confirmed_close', 'confirmed_route', 'disputed_hold') then
    raise exception 'source_disposition must be a governed Operator disposition';
  end if;

  if nullif(btrim(p_source_disposition_ref), '') is null then
    raise exception 'source_disposition_ref is required';
  end if;

  if nullif(btrim(p_created_by), '') is null then
    raise exception 'created_by is required';
  end if;

  if exists (
    select 1 from public.c3_current_state where env_key = btrim(p_env_key)
  ) then
    raise exception 'Current history already exists for env_key %; use c3_current_advance', btrim(p_env_key);
  end if;

  v_current_state_key := 'c3_current_state_' || replace(gen_random_uuid()::text, '-', '');

  insert into public.c3_current_state (
    current_state_key,
    env_key,
    standing,
    source_disposition,
    source_disposition_ref,
    predecessor_current_state_key,
    is_current,
    source_oar2_ref,
    source_oar1_ref,
    created_by,
    metadata
  ) values (
    v_current_state_key,
    btrim(p_env_key),
    btrim(p_standing),
    p_source_disposition,
    btrim(p_source_disposition_ref),
    null,
    true,
    nullif(btrim(coalesce(p_source_oar2_ref, '')), ''),
    nullif(btrim(coalesce(p_source_oar1_ref, '')), ''),
    btrim(p_created_by),
    coalesce(p_metadata, '{}'::jsonb)
  );

  perform public.c3_current_attach_evidence_set(
    v_current_state_key,
    coalesce(p_evidence_assets, '[]'::jsonb),
    btrim(p_created_by)
  );

  return v_current_state_key;
end;
$$;

create or replace function public.c3_current_advance(
  p_env_key text,
  p_standing text,
  p_source_disposition text,
  p_source_disposition_ref text,
  p_created_by text,
  p_evidence_assets jsonb default '[]'::jsonb,
  p_source_oar2_ref text default null,
  p_source_oar1_ref text default null,
  p_metadata jsonb default '{}'::jsonb
)
returns text
language plpgsql
security definer
set search_path = public
as $$
declare
  v_predecessor_key text;
  v_successor_key text;
  v_now timestamptz := clock_timestamp();
begin
  if nullif(btrim(p_env_key), '') is null then
    raise exception 'env_key is required; do not invent an environment identity';
  end if;

  if nullif(btrim(p_standing), '') is null then
    raise exception 'standing is required';
  end if;

  if p_source_disposition not in ('confirmed_close', 'confirmed_route', 'disputed_hold') then
    raise exception 'source_disposition must be a governed Operator disposition';
  end if;

  if nullif(btrim(p_source_disposition_ref), '') is null then
    raise exception 'source_disposition_ref is required';
  end if;

  if nullif(btrim(p_created_by), '') is null then
    raise exception 'created_by is required';
  end if;

  select current_state_key
    into v_predecessor_key
  from public.c3_current_state
  where env_key = btrim(p_env_key)
    and is_current is true
  for update;

  if v_predecessor_key is null then
    raise exception 'no current state exists for env_key %; use c3_current_bind', btrim(p_env_key);
  end if;

  v_successor_key := 'c3_current_state_' || replace(gen_random_uuid()::text, '-', '');

  update public.c3_current_state
  set
    is_current = false,
    superseded_at = v_now
  where current_state_key = v_predecessor_key;

  insert into public.c3_current_state (
    current_state_key,
    env_key,
    standing,
    source_disposition,
    source_disposition_ref,
    predecessor_current_state_key,
    is_current,
    effective_at,
    source_oar2_ref,
    source_oar1_ref,
    created_by,
    metadata
  ) values (
    v_successor_key,
    btrim(p_env_key),
    btrim(p_standing),
    p_source_disposition,
    btrim(p_source_disposition_ref),
    v_predecessor_key,
    true,
    v_now,
    nullif(btrim(coalesce(p_source_oar2_ref, '')), ''),
    nullif(btrim(coalesce(p_source_oar1_ref, '')), ''),
    btrim(p_created_by),
    coalesce(p_metadata, '{}'::jsonb)
  );

  perform public.c3_current_attach_evidence_set(
    v_successor_key,
    coalesce(p_evidence_assets, '[]'::jsonb),
    btrim(p_created_by)
  );

  return v_successor_key;
end;
$$;

-- Resolver returns an explicit governed hold when the environment has no Current
-- state. It never invents standing and never advances state.
create or replace function public.resolve_c3_current(p_env_key text)
returns table (
  resolution_standing text,
  current_state_key text,
  env_key text,
  standing text,
  effective_at timestamptz,
  predecessor_current_state_key text,
  source_disposition text,
  source_disposition_ref text,
  evidence_bindings jsonb
)
language plpgsql
security definer
set search_path = public
as $$
begin
  if nullif(btrim(p_env_key), '') is null then
    return query
    select
      'held_missing_env_key'::text,
      null::text,
      null::text,
      null::text,
      null::timestamptz,
      null::text,
      null::text,
      null::text,
      '[]'::jsonb;
    return;
  end if;

  if not exists (
    select 1
    from public.c3_current_state s
    where s.env_key = btrim(p_env_key)
      and s.is_current is true
  ) then
    return query
    select
      'held_no_current_state'::text,
      null::text,
      btrim(p_env_key),
      null::text,
      null::timestamptz,
      null::text,
      null::text,
      null::text,
      '[]'::jsonb;
    return;
  end if;

  return query
  select
    'resolved_current_state'::text,
    s.current_state_key,
    s.env_key,
    s.standing,
    s.effective_at,
    s.predecessor_current_state_key,
    s.source_disposition,
    s.source_disposition_ref,
    coalesce(
      jsonb_agg(
        jsonb_build_object(
          'evidence_binding_key', e.evidence_binding_key,
          'asset_key', e.asset_key,
          'evidence_role', e.evidence_role,
          'content_hash', e.content_hash_at_binding,
          'hash_algorithm', e.hash_algorithm_at_binding,
          'asset_standing', e.asset_standing_at_binding,
          'custody_ref', e.custody_ref_at_binding,
          'token_ref', e.token_ref_at_binding,
          'tokenization_standing', e.tokenization_standing_at_binding,
          'attested_at', e.attested_at
        ) order by e.attested_at, e.evidence_binding_key
      ) filter (where e.evidence_binding_key is not null),
      '[]'::jsonb
    ) as evidence_bindings
  from public.c3_current_state s
  left join public.c3_current_evidence_binding e
    on e.current_state_key = s.current_state_key
  where s.env_key = btrim(p_env_key)
    and s.is_current is true
  group by
    s.current_state_key,
    s.env_key,
    s.standing,
    s.effective_at,
    s.predecessor_current_state_key,
    s.source_disposition,
    s.source_disposition_ref;
end;
$$;

-- Current is backend governance state. Public/browser clients do not receive direct
-- table mutation or full evidence/custody resolution authority under this minimum.
alter table public.c3_current_state enable row level security;
alter table public.c3_current_evidence_binding enable row level security;

revoke all on table public.c3_current_state from public, anon, authenticated;
revoke all on table public.c3_current_evidence_binding from public, anon, authenticated;

grant select, insert, update on table public.c3_current_state to service_role;
grant select, insert on table public.c3_current_evidence_binding to service_role;

revoke all on function public.c3_current_attach_evidence_set(text, jsonb, text)
  from public, anon, authenticated;
revoke all on function public.c3_current_bind(text, text, text, text, text, jsonb, text, text, jsonb)
  from public, anon, authenticated;
revoke all on function public.c3_current_advance(text, text, text, text, text, jsonb, text, text, jsonb)
  from public, anon, authenticated;
revoke all on function public.resolve_c3_current(text)
  from public, anon, authenticated;

grant execute on function public.c3_current_attach_evidence_set(text, jsonb, text)
  to service_role;
grant execute on function public.c3_current_bind(text, text, text, text, text, jsonb, text, text, jsonb)
  to service_role;
grant execute on function public.c3_current_advance(text, text, text, text, text, jsonb, text, text, jsonb)
  to service_role;
grant execute on function public.resolve_c3_current(text)
  to service_role;

comment on table public.c3_current_state is
  'Minimal c3 Current governed present-state relation. One current state per env_key; prior states remain immutable lineage.';

comment on table public.c3_current_evidence_binding is
  'Immutable Current evidence snapshot bound to governed c3Ops asset identity; evidence content remains in governed asset custody.';

comment on function public.resolve_c3_current(text) is
  'Backend resolver for governed Current standing. Returns explicit held standing when env_key or Current state is unresolved.';

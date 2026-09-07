-- c3 Current — minimal governed present-state relation v2
-- Consolidated model after pre-execution collision review.
-- Source: c3_ledger_0005_c3_current_as_governed_present_state.meta.md
-- Source grammar: Spark / Weave / Field / Form.
--
-- Minimal functions:
--   Spark -> Bind
--   Weave -> Attest
--   Field -> Resolve
--   Form  -> Advance
--
-- The candidate downstream 1 + 3 + 3 + 3 Source expansion remains provisional.
-- This migration does not bind a real environment, create an env_key, import MAP
-- evidence, deploy/modify a smart_contract, or perform any CCC chain transaction.

begin;

create extension if not exists pgcrypto;

-- Refuse to layer this final model over any partial Current implementation from a
-- stopped/superseded execution. Reconciliation must occur before mutation.
do $$
begin
  if to_regclass('public.c3_current_state') is not null
     or to_regclass('public.c3_current_evidence_ref') is not null
     or to_regclass('public.c3_current_evidence_binding') is not null then
    raise exception 'HOLD_PRIOR_CURRENT_MUTATION_REQUIRES_REVIEW';
  end if;
end;
$$;

create table public.c3_current_state (
  current_state_key text primary key,
  env_key text not null,
  state_version integer not null,
  standing text not null,
  effective_at timestamptz not null default now(),
  superseded_at timestamptz,

  formation_authority_ref text not null,
  advance_disposition_ref text,
  predecessor_current_state_key text
    references public.c3_current_state(current_state_key)
    on delete restrict,

  is_current boolean not null default true,
  source_grammar_key text not null default 'codexstone_source_spark_weave_field_form',
  metadata jsonb not null default '{}'::jsonb,
  created_by text not null,
  created_at timestamptz not null default now(),

  constraint c3_current_state_key_nonblank
    check (length(btrim(current_state_key)) > 0),
  constraint c3_current_state_env_key_nonblank
    check (length(btrim(env_key)) > 0),
  constraint c3_current_state_version_positive
    check (state_version >= 1),
  constraint c3_current_state_standing_nonblank
    check (length(btrim(standing)) > 0),
  constraint c3_current_state_formation_authority_nonblank
    check (length(btrim(formation_authority_ref)) > 0),
  constraint c3_current_state_created_by_nonblank
    check (length(btrim(created_by)) > 0),
  constraint c3_current_state_metadata_object
    check (jsonb_typeof(metadata) = 'object'),
  constraint c3_current_state_env_version_unique
    unique (env_key, state_version),
  constraint c3_current_state_initial_or_successor
    check (
      (
        state_version = 1
        and predecessor_current_state_key is null
        and advance_disposition_ref is null
      )
      or
      (
        state_version > 1
        and predecessor_current_state_key is not null
        and advance_disposition_ref is not null
        and length(btrim(advance_disposition_ref)) > 0
      )
    ),
  constraint c3_current_state_supersession_consistency
    check (
      (is_current is true and superseded_at is null)
      or
      (is_current is false and superseded_at is not null)
    ),
  constraint c3_current_state_predecessor_not_self
    check (
      predecessor_current_state_key is null
      or predecessor_current_state_key <> current_state_key
    )
);

create unique index c3_current_state_one_current_per_env
  on public.c3_current_state(env_key)
  where is_current is true;

create index c3_current_state_env_history_idx
  on public.c3_current_state(env_key, state_version desc);

create index c3_current_state_predecessor_idx
  on public.c3_current_state(predecessor_current_state_key)
  where predecessor_current_state_key is not null;

create table public.c3_current_evidence_ref (
  current_evidence_ref_key text primary key,
  current_state_key text not null
    references public.c3_current_state(current_state_key)
    on delete restrict,

  evidence_key text not null,
  evidence_class text not null,
  asset_key text,

  -- Immutable evidence snapshot. When asset_key is supplied these values are
  -- populated from c3Ops asset authority, not trusted from caller input.
  content_hash text not null,
  hash_algorithm text not null default 'sha256',
  authoritative_custody_type text not null,
  authoritative_custody_provider text,
  authoritative_custody_identifier text,
  authoritative_custody_location text,
  evidence_standing text not null,
  tokenization_standing_at_attest text,
  external_anchor_ref_at_attest jsonb,

  source_execution_instance_id text,
  metadata jsonb not null default '{}'::jsonb,
  attested_by text not null,
  attested_at timestamptz not null default now(),

  constraint c3_current_evidence_ref_key_nonblank
    check (length(btrim(current_evidence_ref_key)) > 0),
  constraint c3_current_evidence_key_nonblank
    check (length(btrim(evidence_key)) > 0),
  constraint c3_current_evidence_class_nonblank
    check (length(btrim(evidence_class)) > 0),
  constraint c3_current_evidence_hash_nonblank
    check (length(btrim(content_hash)) > 0),
  constraint c3_current_evidence_hash_algorithm_nonblank
    check (length(btrim(hash_algorithm)) > 0),
  constraint c3_current_evidence_custody_nonblank
    check (length(btrim(authoritative_custody_type)) > 0),
  constraint c3_current_evidence_standing_nonblank
    check (length(btrim(evidence_standing)) > 0),
  constraint c3_current_evidence_metadata_object
    check (jsonb_typeof(metadata) = 'object'),
  constraint c3_current_evidence_anchor_object
    check (
      external_anchor_ref_at_attest is null
      or jsonb_typeof(external_anchor_ref_at_attest) = 'object'
    ),
  constraint c3_current_evidence_attested_by_nonblank
    check (length(btrim(attested_by)) > 0),
  constraint c3_current_evidence_identity_unique
    unique (current_state_key, evidence_key, content_hash)
);

create index c3_current_evidence_state_idx
  on public.c3_current_evidence_ref(current_state_key);

create index c3_current_evidence_asset_idx
  on public.c3_current_evidence_ref(asset_key)
  where asset_key is not null;

-- Validate immutable predecessor lineage on insertion. An initial state is version
-- 1. A successor must remain inside the same environment, increment exactly one
-- version, and name a predecessor already superseded by the atomic Advance call.
create or replace function public.c3_current_validate_lineage()
returns trigger
language plpgsql
set search_path = public
as $$
declare
  predecessor public.c3_current_state%rowtype;
begin
  if new.predecessor_current_state_key is null then
    if new.state_version <> 1 then
      raise exception 'initial Current state must use state_version 1';
    end if;

    if exists (
      select 1 from public.c3_current_state s where s.env_key = new.env_key
    ) then
      raise exception 'Current history already exists for env_key %', new.env_key;
    end if;

    return new;
  end if;

  select *
    into predecessor
  from public.c3_current_state
  where current_state_key = new.predecessor_current_state_key;

  if not found then
    raise exception 'predecessor Current state not found: %', new.predecessor_current_state_key;
  end if;

  if predecessor.env_key <> new.env_key then
    raise exception 'Current predecessor env_key mismatch';
  end if;

  if new.state_version <> predecessor.state_version + 1 then
    raise exception 'Current successor state_version must equal predecessor + 1';
  end if;

  if predecessor.is_current is true or predecessor.superseded_at is null then
    raise exception 'Current predecessor must be superseded before successor insertion';
  end if;

  if new.advance_disposition_ref is null
     or length(btrim(new.advance_disposition_ref)) = 0 then
    raise exception 'Current successor requires governed advance_disposition_ref';
  end if;

  return new;
end;
$$;

create trigger trg_c3_current_validate_lineage
before insert on public.c3_current_state
for each row execute function public.c3_current_validate_lineage();

-- State records are immutable. The only permitted update is the one-way
-- current -> historical transition performed by Advance.
create or replace function public.c3_current_guard_state_update()
returns trigger
language plpgsql
set search_path = public
as $$
begin
  if old.current_state_key is distinct from new.current_state_key
     or old.env_key is distinct from new.env_key
     or old.state_version is distinct from new.state_version
     or old.standing is distinct from new.standing
     or old.effective_at is distinct from new.effective_at
     or old.formation_authority_ref is distinct from new.formation_authority_ref
     or old.advance_disposition_ref is distinct from new.advance_disposition_ref
     or old.predecessor_current_state_key is distinct from new.predecessor_current_state_key
     or old.source_grammar_key is distinct from new.source_grammar_key
     or old.metadata is distinct from new.metadata
     or old.created_by is distinct from new.created_by
     or old.created_at is distinct from new.created_at then
    raise exception 'c3 Current state core fields are immutable';
  end if;

  if old.is_current is true
     and new.is_current is false
     and old.superseded_at is null
     and new.superseded_at is not null then
    return new;
  end if;

  raise exception 'c3 Current state may only transition once from current to historical';
end;
$$;

create trigger trg_c3_current_guard_state_update
before update on public.c3_current_state
for each row execute function public.c3_current_guard_state_update();

create or replace function public.c3_current_prevent_state_delete()
returns trigger
language plpgsql
set search_path = public
as $$
begin
  raise exception 'c3 Current state lineage may not be deleted';
end;
$$;

create trigger trg_c3_current_state_no_delete
before delete on public.c3_current_state
for each row execute function public.c3_current_prevent_state_delete();

-- A superseded state cannot be committed without a current successor naming it as
-- predecessor. Deferred evaluation permits Advance to supersede N then insert N+1
-- in one transaction.
create or replace function public.c3_current_require_successor()
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

create constraint trigger trg_c3_current_require_successor
after update of is_current on public.c3_current_state
deferrable initially deferred
for each row execute function public.c3_current_require_successor();

-- Evidence references are immutable. A changed evidence set is expressed by a new
-- Current state and new Attest records rather than rewriting prior support.
create or replace function public.c3_current_prevent_evidence_mutation()
returns trigger
language plpgsql
set search_path = public
as $$
begin
  raise exception 'c3 Current evidence references are immutable';
end;
$$;

create trigger trg_c3_current_evidence_no_update
before update on public.c3_current_evidence_ref
for each row execute function public.c3_current_prevent_evidence_mutation();

create trigger trg_c3_current_evidence_no_delete
before delete on public.c3_current_evidence_ref
for each row execute function public.c3_current_prevent_evidence_mutation();

-- When an evidence reference names a governed c3Ops asset, snapshot evidence truth
-- from c3Ops authority. Caller-supplied hash/custody values are not trusted for
-- asset-backed evidence. Generic non-asset evidence remains possible when the
-- caller supplies explicit hash/custody identity under service-role governance.
create or replace function public.c3_current_snapshot_asset_evidence()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
declare
  v_content_hash text;
  v_hash_algorithm text;
  v_asset_standing text;
  v_custody_type text;
  v_custody_provider text;
  v_custody_identifier text;
  v_custody_location text;
  v_tokenization_standing text;
  v_external_anchor jsonb;
begin
  if new.asset_key is null or length(btrim(new.asset_key)) = 0 then
    return new;
  end if;

  if to_regclass('public.c3ops_asset_record') is null then
    raise exception 'HOLD_C3OPS_ASSET_AUTHORITY_UNAVAILABLE';
  end if;

  execute $asset$
    select
      content_hash,
      hash_algorithm,
      standing,
      authoritative_custody_type,
      authoritative_custody_provider,
      authoritative_custody_identifier,
      authoritative_custody_location,
      tokenization_standing,
      nullif(
        jsonb_strip_nulls(
          jsonb_build_object(
            'external_anchor_type', external_anchor_type,
            'network_identifier', network_identifier,
            'smart_contract_identifier', contract_identifier,
            'token_identifier', token_identifier,
            'anchor_standing', anchor_standing
          )
        ),
        '{}'::jsonb
      )
    from public.c3ops_asset_record
    where asset_key = $1
  $asset$
  into
    v_content_hash,
    v_hash_algorithm,
    v_asset_standing,
    v_custody_type,
    v_custody_provider,
    v_custody_identifier,
    v_custody_location,
    v_tokenization_standing,
    v_external_anchor
  using btrim(new.asset_key);

  if v_content_hash is null then
    raise exception 'HOLD_ASSET_EVIDENCE_UNRESOLVED: %', new.asset_key;
  end if;

  new.content_hash := v_content_hash;
  new.hash_algorithm := coalesce(nullif(v_hash_algorithm, ''), 'sha256');
  new.authoritative_custody_type := v_custody_type;
  new.authoritative_custody_provider := v_custody_provider;
  new.authoritative_custody_identifier := v_custody_identifier;
  new.authoritative_custody_location := v_custody_location;
  new.evidence_standing := v_asset_standing;
  new.tokenization_standing_at_attest := v_tokenization_standing;
  new.external_anchor_ref_at_attest := v_external_anchor;

  return new;
end;
$$;

create trigger trg_c3_current_snapshot_asset_evidence
before insert on public.c3_current_evidence_ref
for each row execute function public.c3_current_snapshot_asset_evidence();

-- SPARK / BIND: form Current for an already-governed environment. This function
-- never creates or infers env_key authority.
create or replace function public.bind_c3_current(
  p_current_state_key text,
  p_env_key text,
  p_standing text,
  p_formation_authority_ref text,
  p_created_by text,
  p_effective_at timestamptz default now(),
  p_metadata jsonb default '{}'::jsonb
)
returns public.c3_current_state
language plpgsql
security definer
set search_path = public
as $$
declare
  new_state public.c3_current_state%rowtype;
begin
  if p_env_key is null or length(btrim(p_env_key)) = 0 then
    raise exception 'bind_c3_current requires governed env_key';
  end if;

  if p_formation_authority_ref is null
     or length(btrim(p_formation_authority_ref)) = 0 then
    raise exception 'bind_c3_current requires formation authority reference';
  end if;

  if exists (
    select 1 from public.c3_current_state where env_key = btrim(p_env_key)
  ) then
    raise exception 'Current relation already exists for env_key %', p_env_key;
  end if;

  insert into public.c3_current_state (
    current_state_key,
    env_key,
    state_version,
    standing,
    effective_at,
    formation_authority_ref,
    advance_disposition_ref,
    predecessor_current_state_key,
    is_current,
    metadata,
    created_by
  ) values (
    p_current_state_key,
    btrim(p_env_key),
    1,
    p_standing,
    p_effective_at,
    p_formation_authority_ref,
    null,
    null,
    true,
    coalesce(p_metadata, '{}'::jsonb),
    p_created_by
  )
  returning * into new_state;

  return new_state;
end;
$$;

-- WEAVE / ATTEST: bind immutable hash/custody evidence identity to Current without
-- copying evidence content. For asset-backed evidence, c3Ops is authoritative for
-- the snapshot fields through the trigger above.
create or replace function public.attest_c3_current_evidence(
  p_current_evidence_ref_key text,
  p_current_state_key text,
  p_evidence_key text,
  p_evidence_class text,
  p_content_hash text,
  p_authoritative_custody_type text,
  p_evidence_standing text,
  p_attested_by text,
  p_asset_key text default null,
  p_hash_algorithm text default 'sha256',
  p_authoritative_custody_provider text default null,
  p_authoritative_custody_identifier text default null,
  p_authoritative_custody_location text default null,
  p_source_execution_instance_id text default null,
  p_metadata jsonb default '{}'::jsonb
)
returns public.c3_current_evidence_ref
language plpgsql
security definer
set search_path = public
as $$
declare
  new_ref public.c3_current_evidence_ref%rowtype;
begin
  if not exists (
    select 1
    from public.c3_current_state
    where current_state_key = p_current_state_key
  ) then
    raise exception 'Current state not found: %', p_current_state_key;
  end if;

  insert into public.c3_current_evidence_ref (
    current_evidence_ref_key,
    current_state_key,
    evidence_key,
    evidence_class,
    asset_key,
    content_hash,
    hash_algorithm,
    authoritative_custody_type,
    authoritative_custody_provider,
    authoritative_custody_identifier,
    authoritative_custody_location,
    evidence_standing,
    source_execution_instance_id,
    metadata,
    attested_by
  ) values (
    p_current_evidence_ref_key,
    p_current_state_key,
    p_evidence_key,
    p_evidence_class,
    nullif(btrim(coalesce(p_asset_key, '')), ''),
    p_content_hash,
    coalesce(nullif(btrim(p_hash_algorithm), ''), 'sha256'),
    p_authoritative_custody_type,
    p_authoritative_custody_provider,
    p_authoritative_custody_identifier,
    p_authoritative_custody_location,
    p_evidence_standing,
    p_source_execution_instance_id,
    coalesce(p_metadata, '{}'::jsonb),
    p_attested_by
  )
  returning * into new_ref;

  return new_ref;
end;
$$;

-- FIELD / RESOLVE: return governed Current standing or an explicit governed hold.
-- Safe public projection excludes full custody provider/identifier/location details.
create or replace function public.resolve_c3_current(p_env_key text)
returns table (
  resolution_standing text,
  current_state_key text,
  env_key text,
  state_version integer,
  standing text,
  effective_at timestamptz,
  predecessor_current_state_key text,
  source_grammar_key text,
  evidence_refs jsonb
)
language plpgsql
stable
security definer
set search_path = public
as $$
begin
  if p_env_key is null or length(btrim(p_env_key)) = 0 then
    return query
    select
      'held_missing_env_key'::text,
      null::text,
      null::text,
      null::integer,
      null::text,
      null::timestamptz,
      null::text,
      'codexstone_source_spark_weave_field_form'::text,
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
      null::integer,
      null::text,
      null::timestamptz,
      null::text,
      'codexstone_source_spark_weave_field_form'::text,
      '[]'::jsonb;
    return;
  end if;

  return query
  select
    'resolved_current_state'::text,
    s.current_state_key,
    s.env_key,
    s.state_version,
    s.standing,
    s.effective_at,
    s.predecessor_current_state_key,
    s.source_grammar_key,
    coalesce(
      jsonb_agg(
        jsonb_strip_nulls(
          jsonb_build_object(
            'current_evidence_ref_key', e.current_evidence_ref_key,
            'evidence_key', e.evidence_key,
            'evidence_class', e.evidence_class,
            'asset_key', e.asset_key,
            'content_hash', e.content_hash,
            'hash_algorithm', e.hash_algorithm,
            'custody_type', e.authoritative_custody_type,
            'evidence_standing', e.evidence_standing,
            'tokenization_standing', e.tokenization_standing_at_attest,
            'external_anchor_ref', e.external_anchor_ref_at_attest,
            'source_execution_instance_id', e.source_execution_instance_id,
            'attested_at', e.attested_at
          )
        ) order by e.attested_at, e.current_evidence_ref_key
      ) filter (where e.current_evidence_ref_key is not null),
      '[]'::jsonb
    )
  from public.c3_current_state s
  left join public.c3_current_evidence_ref e
    on e.current_state_key = s.current_state_key
  where s.env_key = btrim(p_env_key)
    and s.is_current is true
  group by
    s.current_state_key,
    s.env_key,
    s.state_version,
    s.standing,
    s.effective_at,
    s.predecessor_current_state_key,
    s.source_grammar_key;
end;
$$;

-- FORM / ADVANCE: atomically form a successor Current state. New evidence alone
-- never advances Current; a governed disposition reference is mandatory.
create or replace function public.advance_c3_current(
  p_env_key text,
  p_expected_current_state_key text,
  p_new_current_state_key text,
  p_new_standing text,
  p_formation_authority_ref text,
  p_advance_disposition_ref text,
  p_created_by text,
  p_effective_at timestamptz default now(),
  p_metadata jsonb default '{}'::jsonb
)
returns public.c3_current_state
language plpgsql
security definer
set search_path = public
as $$
declare
  prior_state public.c3_current_state%rowtype;
  new_state public.c3_current_state%rowtype;
begin
  if p_advance_disposition_ref is null
     or length(btrim(p_advance_disposition_ref)) = 0 then
    raise exception 'advance_c3_current requires governed disposition reference';
  end if;

  if p_formation_authority_ref is null
     or length(btrim(p_formation_authority_ref)) = 0 then
    raise exception 'advance_c3_current requires formation authority reference';
  end if;

  select *
    into prior_state
  from public.c3_current_state
  where env_key = btrim(p_env_key)
    and current_state_key = p_expected_current_state_key
    and is_current is true
  for update;

  if not found then
    raise exception 'expected current state not found for env_key %', p_env_key;
  end if;

  update public.c3_current_state
  set
    is_current = false,
    superseded_at = p_effective_at
  where current_state_key = prior_state.current_state_key;

  insert into public.c3_current_state (
    current_state_key,
    env_key,
    state_version,
    standing,
    effective_at,
    formation_authority_ref,
    advance_disposition_ref,
    predecessor_current_state_key,
    is_current,
    source_grammar_key,
    metadata,
    created_by
  ) values (
    p_new_current_state_key,
    prior_state.env_key,
    prior_state.state_version + 1,
    p_new_standing,
    p_effective_at,
    p_formation_authority_ref,
    p_advance_disposition_ref,
    prior_state.current_state_key,
    true,
    prior_state.source_grammar_key,
    coalesce(p_metadata, '{}'::jsonb),
    p_created_by
  )
  returning * into new_state;

  return new_state;
end;
$$;

comment on table public.c3_current_state is
  'c3 Current governed present-state relation. Preserves which state presently governs an env_key and immutable predecessor lineage; it is not the evidence artifact or CCC smart_contract.';

comment on table public.c3_current_evidence_ref is
  'Immutable hash/custody evidence reference for a Current state. Asset-backed evidence snapshots from c3Ops asset authority; evidence content remains in governed custody.';

comment on function public.resolve_c3_current(text) is
  'Safe Current read surface returning resolved Current standing or explicit governed hold; does not determine or advance standing.';

alter table public.c3_current_state enable row level security;
alter table public.c3_current_evidence_ref enable row level security;

-- No direct browser or service-role table mutation. Operational writes are only
-- through SECURITY DEFINER Bind / Attest / Advance.
revoke all on table public.c3_current_state from public, anon, authenticated, service_role;
revoke all on table public.c3_current_evidence_ref from public, anon, authenticated, service_role;

-- Operational writes: service_role only.
revoke all on function public.bind_c3_current(text, text, text, text, text, timestamptz, jsonb)
  from public, anon, authenticated, service_role;
grant execute on function public.bind_c3_current(text, text, text, text, text, timestamptz, jsonb)
  to service_role;

revoke all on function public.attest_c3_current_evidence(text, text, text, text, text, text, text, text, text, text, text, text, text, text, jsonb)
  from public, anon, authenticated, service_role;
grant execute on function public.attest_c3_current_evidence(text, text, text, text, text, text, text, text, text, text, text, text, text, text, jsonb)
  to service_role;

revoke all on function public.advance_c3_current(text, text, text, text, text, text, text, timestamptz, jsonb)
  from public, anon, authenticated, service_role;
grant execute on function public.advance_c3_current(text, text, text, text, text, text, text, timestamptz, jsonb)
  to service_role;

-- Resolve is the only minimal browser-consumable Current surface.
revoke all on function public.resolve_c3_current(text)
  from public, anon, authenticated, service_role;
grant execute on function public.resolve_c3_current(text)
  to anon, authenticated, service_role;

-- Trigger/helper functions are internal only.
revoke all on function public.c3_current_validate_lineage()
  from public, anon, authenticated, service_role;
revoke all on function public.c3_current_guard_state_update()
  from public, anon, authenticated, service_role;
revoke all on function public.c3_current_prevent_state_delete()
  from public, anon, authenticated, service_role;
revoke all on function public.c3_current_require_successor()
  from public, anon, authenticated, service_role;
revoke all on function public.c3_current_prevent_evidence_mutation()
  from public, anon, authenticated, service_role;
revoke all on function public.c3_current_snapshot_asset_evidence()
  from public, anon, authenticated, service_role;

commit;

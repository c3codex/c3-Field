-- OAR2 C1ME CURRENT operational-memory foundation; review-only migration.
-- No data backfill, no new person, relationship, CURRENT, or EnvPac is created here.
create table if not exists public.c3_individual_relationship_binding (
  relationship_key text primary key references public.crs_relationship(relationship_key),
  named_individual_key text not null references public.c3_named_individual(named_individual_key),
  verification_evidence_ref text not null check (length(btrim(verification_evidence_ref)) > 0),
  reconciliation_evidence_ref text not null check (length(btrim(reconciliation_evidence_ref)) > 0),
  standing text not null check (standing in ('verified','revoked')),
  verified_at timestamptz not null,
  revoked_at timestamptz,
  created_at timestamptz not null default now(),
  check ((standing='verified' and revoked_at is null) or (standing='revoked' and revoked_at is not null))
);
create index if not exists c3_individual_relationship_binding_individual_idx
 on public.c3_individual_relationship_binding(named_individual_key) where standing='verified';
alter table public.c3_individual_relationship_binding enable row level security;
revoke all on public.c3_individual_relationship_binding from public, anon, authenticated;
grant select, insert, update on public.c3_individual_relationship_binding to service_role;

-- Server-only resolver. Invocation is authorized by the verified runtime session
-- BEFORE passing its relationship key; caller must never accept an arbitrary key
-- from a browser as authority. Missing CURRENT fails closed rather than forming state.
create or replace function public.resolve_c1me_current_internal(p_relationship_key text)
returns jsonb language plpgsql security invoker
set search_path = public, pg_temp
as $$
declare
 r public.crs_relationship%rowtype;
 v_individual text;
 v_bindings integer;
 v_env_count integer;
 v_envpac text;
 v_env text;
 v_current text;
 v_current_count integer;
 v_grants integer;
begin
 if p_relationship_key is null or btrim(p_relationship_key)='' then
   return jsonb_build_object('resolution','auth_required','reason_code','missing_verified_subject');
 end if;
 select * into r from public.crs_relationship
 where relationship_key=p_relationship_key and is_active=true and coalesce(is_test_relationship,false)=false;
 if not found then
   return jsonb_build_object('resolution','auth_required','reason_code','subject_not_eligible');
 end if;
 if r.relationship_standing <> 'c1_C1_persisted' then
   return jsonb_build_object('resolution','candidate_pending','next_encounter','resume_verification',
     'reason_code','c1_not_persisted','may_create_personal_environment',false);
 end if;
 select count(*),min(named_individual_key) into v_bindings,v_individual
 from public.c3_individual_relationship_binding
 where relationship_key=r.relationship_key and standing='verified';
 if v_bindings <> 1 then
   return jsonb_build_object('resolution','reconciliation_hold','reason_code','identity_binding_missing',
      'may_create_personal_environment',false);
 end if;
 -- All relationship keys verified to the individual must resolve to ONE effective EnvPac.
 select count(distinct p.envpac_key),min(p.envpac_key),min(p.env_key)
 into v_env_count,v_envpac,v_env
 from public.c3_envpac p
 join public.c3_individual_relationship_binding b on b.relationship_key=p.owner_subject_key
 where b.named_individual_key=v_individual and b.standing='verified'
 and p.owner_subject_type='individual' and p.is_effective=true
 and p.standing='effective';
 if v_env_count <> 1 then
   return jsonb_build_object('resolution','reconciliation_hold',
    'reason_code',case when v_env_count=0 then 'canonical_env_missing' else 'canonical_env_ambiguous' end,
    'may_create_personal_environment',false);
 end if;
 select count(*) into v_grants from public.c3_envpac_access_grant g
 join public.c3_individual_relationship_binding b on b.relationship_key=g.subject_key
 where g.envpac_key=v_envpac and b.named_individual_key=v_individual
 and b.standing='verified' and g.subject_type='individual' and g.relation_role='owner'
 and g.standing='active' and g.revoked_at is null
 and (g.expires_at is null or g.expires_at>now());
 if v_grants<>1 then
   return jsonb_build_object('resolution','reconciliation_hold','reason_code','owner_grant_missing_or_ambiguous',
       'may_create_personal_environment',false);
 end if;
 select count(*),min(current_state_key) into v_current_count,v_current
 from public.c3_current_state
 where env_key=v_env and is_current=true and effective_at<=now()
 and superseded_at is null;
 if v_current_count<>1 then
   return jsonb_build_object('resolution','reconciliation_hold','reason_code','personal_current_missing_or_ambiguous',
       'may_create_personal_environment',false);
 end if;
 return jsonb_build_object('resolution','existing_c1','next_encounter','enter_existing_environment',
   'individual_ref',v_individual,'relationship_ref',r.relationship_key,
   'envpac_ref',v_envpac,'current_ref',v_current,
   'may_create_personal_environment',false,'reason_code','resolved_from_registered_current');
end;$$;
revoke all on function public.resolve_c1me_current_internal(text) from public, anon, authenticated;
grant execute on function public.resolve_c1me_current_internal(text) to service_role;

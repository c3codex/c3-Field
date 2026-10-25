-- R01 SOURCE CANDIDATE ONLY: no live installation authority. Exact named-object correction.
begin;
do $preflight$ begin
if not exists(select 1 from pg_proc p where p.oid='public.add_measures_transition_rule(text,text,text,boolean,boolean,boolean,boolean,integer,jsonb)'::regprocedure and (encode(sha256(convert_to(pg_get_functiondef(p.oid),'UTF8')),'hex')='682ab24b3807eb83a6c0e6a60f3ca0fb2b59c8747617a4eeef1c0939684ced33' or (not p.prosecdef and encode(sha256(convert_to(p.prosrc,'UTF8')),'hex')='ab1cd6b6acde791f84fc720348f7dfe9e53e2e99a74e7bdf21fc3029727609fe' and pg_get_functiondef(p.oid) like '%SET search_path TO ''''%'))) then raise exception 'R01 function preimage drift: add_measures_transition_rule'; end if;
if not exists(select 1 from pg_proc p where p.oid='public.define_measures_encounter(text,text,text,text,text,text,integer,boolean,boolean,jsonb)'::regprocedure and (encode(sha256(convert_to(pg_get_functiondef(p.oid),'UTF8')),'hex')='3ebceedf1416c14884e31381a1af6080ad12ad923d20adf6f7aa38902f354b24' or (not p.prosecdef and encode(sha256(convert_to(p.prosrc,'UTF8')),'hex')='a0060e0af6b6880d108f4218b3c328d9b0883005d349104beeed423d29dcaecd' and pg_get_functiondef(p.oid) like '%SET search_path TO ''''%'))) then raise exception 'R01 function preimage drift: define_measures_encounter'; end if;
if not exists(select 1 from pg_proc p where p.oid='public.system_oar_queue_confirm_and_start_cody(text,text)'::regprocedure and (encode(sha256(convert_to(pg_get_functiondef(p.oid),'UTF8')),'hex')='a0c9e0feaccb5b2ed257a0eebbacc7a38de078cbe6e0fd02d9fce142fed5408a' or (not p.prosecdef and encode(sha256(convert_to(p.prosrc,'UTF8')),'hex')='642379b7fa9387cbaff0455faf58943186360c7ed7adc1c768e7423f988763cd' and pg_get_functiondef(p.oid) like '%SET search_path TO ''''%'))) then raise exception 'R01 function preimage drift: system_oar_queue_confirm_and_start_cody'; end if;
if not exists(select 1 from pg_proc p where p.oid='public.system_oar_queue_submit_oar1_for_chazz_prompt(text,text,text,text,text,text,text)'::regprocedure and (encode(sha256(convert_to(pg_get_functiondef(p.oid),'UTF8')),'hex')='0cb5f173f8dbebebfaa8006043569e83972b3a39ab2b26aa49796dbb50c1d2bb' or (not p.prosecdef and encode(sha256(convert_to(p.prosrc,'UTF8')),'hex')='5c9a0a5ed47fe752032f78c98b2b8f4bdd3a91b40385dee50cacc0f8c0b77ea5' and pg_get_functiondef(p.oid) like '%SET search_path TO ''''%'))) then raise exception 'R01 function preimage drift: system_oar_queue_submit_oar1_for_chazz_prompt'; end if;
end $preflight$;
do $$ begin if (select relacl::text from pg_class where oid='public.c3_envpac_effective_graph'::regclass) not in ('{postgres=arwdDxtm/postgres,anon=arwdDxtm/postgres,authenticated=arwdDxtm/postgres,service_role=arwdDxtm/postgres}','{postgres=arwdDxtm/postgres,service_role=r/postgres}') then raise exception 'R01 ACL preimage drift: c3_envpac_effective_graph'; end if; end $$;
do $$ begin if not exists(select 1 from pg_class where oid='public.c3_envpac_effective_graph'::regclass and pg_get_userbyid(relowner)='postgres' and relrowsecurity=false and relforcerowsecurity=false and coalesce(reloptions,array[]::text[])=array[]::text[]) then raise exception 'R01 owner/RLS/options preimage drift: c3_envpac_effective_graph'; end if; end $$;
do $$ begin if exists(select 1 from pg_attribute where attrelid='public.c3_envpac_effective_graph'::regclass and attnum>0 and attacl is not null) then raise exception 'R01 unqualified column ACL: c3_envpac_effective_graph'; end if; end $$;
do $$ begin if encode(sha256(convert_to(pg_get_viewdef('public.c3_envpac_effective_graph'::regclass,true),'UTF8')),'hex')<>'823399a4859edc45eb60b4d87751d381dbc25d6a166a8cfc76fae94cdc552a1a' then raise exception 'R01 view preimage drift: c3_envpac_effective_graph'; end if; end $$;
do $$ begin if (select relacl::text from pg_class where oid='public.c3_envpac_registry_reference'::regclass) not in ('{postgres=arwdDxtm/postgres,anon=arwdDxtm/postgres,authenticated=arwdDxtm/postgres,service_role=arwdDxtm/postgres}','{postgres=arwdDxtm/postgres,service_role=r/postgres}') then raise exception 'R01 ACL preimage drift: c3_envpac_registry_reference'; end if; end $$;
do $$ begin if not exists(select 1 from pg_class where oid='public.c3_envpac_registry_reference'::regclass and pg_get_userbyid(relowner)='postgres' and relrowsecurity=false and relforcerowsecurity=false and coalesce(reloptions,array[]::text[])=array[]::text[]) then raise exception 'R01 owner/RLS/options preimage drift: c3_envpac_registry_reference'; end if; end $$;
do $$ begin if exists(select 1 from pg_attribute where attrelid='public.c3_envpac_registry_reference'::regclass and attnum>0 and attacl is not null) then raise exception 'R01 unqualified column ACL: c3_envpac_registry_reference'; end if; end $$;
do $$ begin if encode(sha256(convert_to(pg_get_viewdef('public.c3_envpac_registry_reference'::regclass,true),'UTF8')),'hex')<>'ac0be1301ca791e57699983b2e92bea66a27a0872e3cbd27d8b19290901045f1' then raise exception 'R01 view preimage drift: c3_envpac_registry_reference'; end if; end $$;
do $$ begin if (select relacl::text from pg_class where oid='public.c3ops_asset_lineage_record'::regclass) not in ('{postgres=arwdDxtm/postgres,anon=arwdDxtm/postgres,authenticated=arwdDxtm/postgres,service_role=arwdDxtm/postgres}','{postgres=arwdDxtm/postgres,service_role=arwdDxtm/postgres}') then raise exception 'R01 ACL preimage drift: c3ops_asset_lineage_record'; end if; end $$;
do $$ begin if not exists(select 1 from pg_class where oid='public.c3ops_asset_lineage_record'::regclass and pg_get_userbyid(relowner)='postgres' and relrowsecurity=true and relforcerowsecurity=false and coalesce(reloptions,array[]::text[])=array[]::text[]) then raise exception 'R01 owner/RLS/options preimage drift: c3ops_asset_lineage_record'; end if; end $$;
do $$ begin if exists(select 1 from pg_attribute where attrelid='public.c3ops_asset_lineage_record'::regclass and attnum>0 and attacl is not null) then raise exception 'R01 unqualified column ACL: c3ops_asset_lineage_record'; end if; end $$;
do $$ declare actual jsonb; begin select jsonb_agg(jsonb_build_object('policyname',policyname,'permissive',permissive,'roles',roles,'cmd',cmd,'qual',qual,'with_check',with_check) order by policyname) into actual from pg_policies where schemaname='public' and tablename='c3ops_asset_lineage_record'; if actual is distinct from '[{"policyname": "Allow anon and authenticated write on c3ops_asset_lineage_recor", "permissive": "PERMISSIVE", "roles": ["public"], "cmd": "ALL", "qual": "true", "with_check": "true"}, {"policyname": "Allow public read access on c3ops_asset_lineage_record", "permissive": "PERMISSIVE", "roles": ["public"], "cmd": "SELECT", "qual": "true", "with_check": null}]'::jsonb and actual is distinct from '[{"policyname": "r01_service_authority_only", "permissive": "PERMISSIVE", "roles": ["service_role"], "cmd": "ALL", "qual": "true", "with_check": "true"}]'::jsonb then raise exception 'R01 policy preimage drift: c3ops_asset_lineage_record'; end if; end $$;
do $$ begin if (select relacl::text from pg_class where oid='public.c3ops_asset_placement_determination'::regclass) not in ('{postgres=arwdDxtm/postgres,anon=arwdDxtm/postgres,authenticated=arwdDxtm/postgres,service_role=arwdDxtm/postgres}','{postgres=arwdDxtm/postgres,service_role=arwdDxtm/postgres}') then raise exception 'R01 ACL preimage drift: c3ops_asset_placement_determination'; end if; end $$;
do $$ begin if not exists(select 1 from pg_class where oid='public.c3ops_asset_placement_determination'::regclass and pg_get_userbyid(relowner)='postgres' and relrowsecurity=true and relforcerowsecurity=false and coalesce(reloptions,array[]::text[])=array[]::text[]) then raise exception 'R01 owner/RLS/options preimage drift: c3ops_asset_placement_determination'; end if; end $$;
do $$ begin if exists(select 1 from pg_attribute where attrelid='public.c3ops_asset_placement_determination'::regclass and attnum>0 and attacl is not null) then raise exception 'R01 unqualified column ACL: c3ops_asset_placement_determination'; end if; end $$;
do $$ declare actual jsonb; begin select jsonb_agg(jsonb_build_object('policyname',policyname,'permissive',permissive,'roles',roles,'cmd',cmd,'qual',qual,'with_check',with_check) order by policyname) into actual from pg_policies where schemaname='public' and tablename='c3ops_asset_placement_determination'; if actual is distinct from '[{"policyname": "Allow anon and authenticated write on c3ops_asset_placement_det", "permissive": "PERMISSIVE", "roles": ["public"], "cmd": "ALL", "qual": "true", "with_check": "true"}, {"policyname": "Allow public read access on c3ops_asset_placement_determination", "permissive": "PERMISSIVE", "roles": ["public"], "cmd": "SELECT", "qual": "true", "with_check": null}]'::jsonb and actual is distinct from '[{"policyname": "r01_service_authority_only", "permissive": "PERMISSIVE", "roles": ["service_role"], "cmd": "ALL", "qual": "true", "with_check": "true"}]'::jsonb then raise exception 'R01 policy preimage drift: c3ops_asset_placement_determination'; end if; end $$;
do $$ begin if (select relacl::text from pg_class where oid='public.c3ops_partner'::regclass) not in ('{postgres=arwdDxtm/postgres,anon=arwdDxtm/postgres,authenticated=arwdDxtm/postgres,service_role=arwdDxtm/postgres}','{postgres=arwdDxtm/postgres,service_role=arwdDxtm/postgres}') then raise exception 'R01 ACL preimage drift: c3ops_partner'; end if; end $$;
do $$ begin if not exists(select 1 from pg_class where oid='public.c3ops_partner'::regclass and pg_get_userbyid(relowner)='postgres' and relrowsecurity=true and relforcerowsecurity=false and coalesce(reloptions,array[]::text[])=array[]::text[]) then raise exception 'R01 owner/RLS/options preimage drift: c3ops_partner'; end if; end $$;
do $$ begin if exists(select 1 from pg_attribute where attrelid='public.c3ops_partner'::regclass and attnum>0 and attacl is not null) then raise exception 'R01 unqualified column ACL: c3ops_partner'; end if; end $$;
do $$ declare actual jsonb; begin select jsonb_agg(jsonb_build_object('policyname',policyname,'permissive',permissive,'roles',roles,'cmd',cmd,'qual',qual,'with_check',with_check) order by policyname) into actual from pg_policies where schemaname='public' and tablename='c3ops_partner'; if actual is distinct from '[{"policyname": "Allow anon and authenticated write on c3ops_partner", "permissive": "PERMISSIVE", "roles": ["public"], "cmd": "ALL", "qual": "true", "with_check": "true"}, {"policyname": "Allow public read access on c3ops_partner", "permissive": "PERMISSIVE", "roles": ["public"], "cmd": "SELECT", "qual": "true", "with_check": null}]'::jsonb and actual is distinct from '[{"policyname": "r01_service_authority_only", "permissive": "PERMISSIVE", "roles": ["service_role"], "cmd": "ALL", "qual": "true", "with_check": "true"}]'::jsonb then raise exception 'R01 policy preimage drift: c3ops_partner'; end if; end $$;
do $$ begin if (select relacl::text from pg_class where oid='public.c3ops_publication_component'::regclass) not in ('{postgres=arwdDxtm/postgres,anon=arwdDxtm/postgres,authenticated=arwdDxtm/postgres,service_role=arwdDxtm/postgres}','{postgres=arwdDxtm/postgres,service_role=arwdDxtm/postgres}') then raise exception 'R01 ACL preimage drift: c3ops_publication_component'; end if; end $$;
do $$ begin if not exists(select 1 from pg_class where oid='public.c3ops_publication_component'::regclass and pg_get_userbyid(relowner)='postgres' and relrowsecurity=true and relforcerowsecurity=false and coalesce(reloptions,array[]::text[])=array[]::text[]) then raise exception 'R01 owner/RLS/options preimage drift: c3ops_publication_component'; end if; end $$;
do $$ begin if exists(select 1 from pg_attribute where attrelid='public.c3ops_publication_component'::regclass and attnum>0 and attacl is not null) then raise exception 'R01 unqualified column ACL: c3ops_publication_component'; end if; end $$;
do $$ declare actual jsonb; begin select jsonb_agg(jsonb_build_object('policyname',policyname,'permissive',permissive,'roles',roles,'cmd',cmd,'qual',qual,'with_check',with_check) order by policyname) into actual from pg_policies where schemaname='public' and tablename='c3ops_publication_component'; if actual is distinct from '[{"policyname": "Allow anon and authenticated write on c3ops_publication_compone", "permissive": "PERMISSIVE", "roles": ["public"], "cmd": "ALL", "qual": "true", "with_check": "true"}, {"policyname": "Allow public read access on c3ops_publication_component", "permissive": "PERMISSIVE", "roles": ["public"], "cmd": "SELECT", "qual": "true", "with_check": null}]'::jsonb and actual is distinct from '[{"policyname": "r01_service_authority_only", "permissive": "PERMISSIVE", "roles": ["service_role"], "cmd": "ALL", "qual": "true", "with_check": "true"}]'::jsonb then raise exception 'R01 policy preimage drift: c3ops_publication_component'; end if; end $$;
do $$ begin if (select relacl::text from pg_class where oid='public.c3ops_publication_lineage_record'::regclass) not in ('{postgres=arwdDxtm/postgres,anon=arwdDxtm/postgres,authenticated=arwdDxtm/postgres,service_role=arwdDxtm/postgres}','{postgres=arwdDxtm/postgres,service_role=arwdDxtm/postgres}') then raise exception 'R01 ACL preimage drift: c3ops_publication_lineage_record'; end if; end $$;
do $$ begin if not exists(select 1 from pg_class where oid='public.c3ops_publication_lineage_record'::regclass and pg_get_userbyid(relowner)='postgres' and relrowsecurity=true and relforcerowsecurity=false and coalesce(reloptions,array[]::text[])=array[]::text[]) then raise exception 'R01 owner/RLS/options preimage drift: c3ops_publication_lineage_record'; end if; end $$;
do $$ begin if exists(select 1 from pg_attribute where attrelid='public.c3ops_publication_lineage_record'::regclass and attnum>0 and attacl is not null) then raise exception 'R01 unqualified column ACL: c3ops_publication_lineage_record'; end if; end $$;
do $$ declare actual jsonb; begin select jsonb_agg(jsonb_build_object('policyname',policyname,'permissive',permissive,'roles',roles,'cmd',cmd,'qual',qual,'with_check',with_check) order by policyname) into actual from pg_policies where schemaname='public' and tablename='c3ops_publication_lineage_record'; if actual is distinct from '[{"policyname": "Allow anon and authenticated write on c3ops_publication_lineage", "permissive": "PERMISSIVE", "roles": ["public"], "cmd": "ALL", "qual": "true", "with_check": "true"}, {"policyname": "Allow public read access on c3ops_publication_lineage_record", "permissive": "PERMISSIVE", "roles": ["public"], "cmd": "SELECT", "qual": "true", "with_check": null}]'::jsonb and actual is distinct from '[{"policyname": "r01_service_authority_only", "permissive": "PERMISSIVE", "roles": ["service_role"], "cmd": "ALL", "qual": "true", "with_check": "true"}]'::jsonb then raise exception 'R01 policy preimage drift: c3ops_publication_lineage_record'; end if; end $$;
do $$ begin if (select relacl::text from pg_class where oid='public.c3ops_publication_object'::regclass) not in ('{postgres=arwdDxtm/postgres,anon=arwdDxtm/postgres,authenticated=arwdDxtm/postgres,service_role=arwdDxtm/postgres}','{postgres=arwdDxtm/postgres,service_role=arwdDxtm/postgres}') then raise exception 'R01 ACL preimage drift: c3ops_publication_object'; end if; end $$;
do $$ begin if not exists(select 1 from pg_class where oid='public.c3ops_publication_object'::regclass and pg_get_userbyid(relowner)='postgres' and relrowsecurity=true and relforcerowsecurity=false and coalesce(reloptions,array[]::text[])=array[]::text[]) then raise exception 'R01 owner/RLS/options preimage drift: c3ops_publication_object'; end if; end $$;
do $$ begin if exists(select 1 from pg_attribute where attrelid='public.c3ops_publication_object'::regclass and attnum>0 and attacl is not null) then raise exception 'R01 unqualified column ACL: c3ops_publication_object'; end if; end $$;
do $$ declare actual jsonb; begin select jsonb_agg(jsonb_build_object('policyname',policyname,'permissive',permissive,'roles',roles,'cmd',cmd,'qual',qual,'with_check',with_check) order by policyname) into actual from pg_policies where schemaname='public' and tablename='c3ops_publication_object'; if actual is distinct from '[{"policyname": "Allow anon and authenticated write on c3ops_publication_object", "permissive": "PERMISSIVE", "roles": ["public"], "cmd": "ALL", "qual": "true", "with_check": "true"}, {"policyname": "Allow public read access on c3ops_publication_object", "permissive": "PERMISSIVE", "roles": ["public"], "cmd": "SELECT", "qual": "true", "with_check": null}]'::jsonb and actual is distinct from '[{"policyname": "r01_service_authority_only", "permissive": "PERMISSIVE", "roles": ["service_role"], "cmd": "ALL", "qual": "true", "with_check": "true"}]'::jsonb then raise exception 'R01 policy preimage drift: c3ops_publication_object'; end if; end $$;
do $$ begin if (select relacl::text from pg_class where oid='public.measures_seat_hold_notification_review_v1'::regclass) not in ('{postgres=arwdDxtm/postgres,anon=arwdDxtm/postgres,authenticated=arwdDxtm/postgres,service_role=arwdDxtm/postgres}','{postgres=arwdDxtm/postgres,service_role=r/postgres}') then raise exception 'R01 ACL preimage drift: measures_seat_hold_notification_review_v1'; end if; end $$;
do $$ begin if not exists(select 1 from pg_class where oid='public.measures_seat_hold_notification_review_v1'::regclass and pg_get_userbyid(relowner)='postgres' and relrowsecurity=false and relforcerowsecurity=false and coalesce(reloptions,array[]::text[])=array[]::text[]) then raise exception 'R01 owner/RLS/options preimage drift: measures_seat_hold_notification_review_v1'; end if; end $$;
do $$ begin if exists(select 1 from pg_attribute where attrelid='public.measures_seat_hold_notification_review_v1'::regclass and attnum>0 and attacl is not null) then raise exception 'R01 unqualified column ACL: measures_seat_hold_notification_review_v1'; end if; end $$;
do $$ begin if encode(sha256(convert_to(pg_get_viewdef('public.measures_seat_hold_notification_review_v1'::regclass,true),'UTF8')),'hex')<>'d9e7353daf627929403c50ce281a47fb864427432e5086826750f924a5a31bd6' then raise exception 'R01 view preimage drift: measures_seat_hold_notification_review_v1'; end if; end $$;
revoke all on public.c3_envpac_effective_graph from public,anon,authenticated;
revoke all on public.c3_envpac_effective_graph from service_role;
grant select on public.c3_envpac_effective_graph to service_role;
revoke all on public.c3_envpac_registry_reference from public,anon,authenticated;
revoke all on public.c3_envpac_registry_reference from service_role;
grant select on public.c3_envpac_registry_reference to service_role;
revoke all on public.c3ops_asset_lineage_record from public,anon,authenticated;
drop policy if exists "Allow anon and authenticated write on c3ops_asset_lineage_recor" on public.c3ops_asset_lineage_record;
drop policy if exists "Allow public read access on c3ops_asset_lineage_record" on public.c3ops_asset_lineage_record;
drop policy if exists r01_service_authority_only on public.c3ops_asset_lineage_record;
create policy r01_service_authority_only on public.c3ops_asset_lineage_record for all to service_role using (true) with check (true);
revoke all on public.c3ops_asset_placement_determination from public,anon,authenticated;
drop policy if exists "Allow anon and authenticated write on c3ops_asset_placement_det" on public.c3ops_asset_placement_determination;
drop policy if exists "Allow public read access on c3ops_asset_placement_determination" on public.c3ops_asset_placement_determination;
drop policy if exists r01_service_authority_only on public.c3ops_asset_placement_determination;
create policy r01_service_authority_only on public.c3ops_asset_placement_determination for all to service_role using (true) with check (true);
revoke all on public.c3ops_partner from public,anon,authenticated;
drop policy if exists "Allow anon and authenticated write on c3ops_partner" on public.c3ops_partner;
drop policy if exists "Allow public read access on c3ops_partner" on public.c3ops_partner;
drop policy if exists r01_service_authority_only on public.c3ops_partner;
create policy r01_service_authority_only on public.c3ops_partner for all to service_role using (true) with check (true);
revoke all on public.c3ops_publication_component from public,anon,authenticated;
drop policy if exists "Allow anon and authenticated write on c3ops_publication_compone" on public.c3ops_publication_component;
drop policy if exists "Allow public read access on c3ops_publication_component" on public.c3ops_publication_component;
drop policy if exists r01_service_authority_only on public.c3ops_publication_component;
create policy r01_service_authority_only on public.c3ops_publication_component for all to service_role using (true) with check (true);
revoke all on public.c3ops_publication_lineage_record from public,anon,authenticated;
drop policy if exists "Allow anon and authenticated write on c3ops_publication_lineage" on public.c3ops_publication_lineage_record;
drop policy if exists "Allow public read access on c3ops_publication_lineage_record" on public.c3ops_publication_lineage_record;
drop policy if exists r01_service_authority_only on public.c3ops_publication_lineage_record;
create policy r01_service_authority_only on public.c3ops_publication_lineage_record for all to service_role using (true) with check (true);
revoke all on public.c3ops_publication_object from public,anon,authenticated;
drop policy if exists "Allow anon and authenticated write on c3ops_publication_object" on public.c3ops_publication_object;
drop policy if exists "Allow public read access on c3ops_publication_object" on public.c3ops_publication_object;
drop policy if exists r01_service_authority_only on public.c3ops_publication_object;
create policy r01_service_authority_only on public.c3ops_publication_object for all to service_role using (true) with check (true);
revoke all on public.measures_seat_hold_notification_review_v1 from public,anon,authenticated;
revoke all on public.measures_seat_hold_notification_review_v1 from service_role;
grant select on public.measures_seat_hold_notification_review_v1 to service_role;
create or replace function public.r01_legacy_effect_authorized_v1(p_function text,p_effect jsonb,p_asserted_actor text default null)
returns boolean language plpgsql security invoker set search_path='' as $$
declare claims jsonb; actor text; g public.c3_envpac_capability_grant%rowtype;
begin
  if current_user<>'service_role' then return false; end if;
  claims:=current_setting('request.jwt.claims',true)::jsonb;
  actor:=nullif(claims#>>'{app_metadata,c3_actor_ref}','');
  if actor is null or (p_asserted_actor is not null and p_asserted_actor is distinct from actor) then return false; end if;
  select * into g from public.c3_envpac_capability_grant
    where capability_key=claims#>>'{app_metadata,r01_capability_ref}' for share;
  return coalesce(g.standing='active' and g.scope->>'actor_ref'=actor
    and g.scope->>'execution_instance'=claims#>>'{app_metadata,r01_execution_instance}'
    and g.scope->>'source_sha256'=claims#>>'{app_metadata,r01_source_sha256}'
    and g.scope->>'source_bytes'=claims#>>'{app_metadata,r01_source_bytes}'
    and g.scope->>'source_ref'=claims#>>'{app_metadata,r01_source_ref}'
    and coalesce(g.scope->>'source_sha256','') ~ '^[0-9a-f]{64}$'
    and coalesce(g.scope->>'source_bytes','') ~ '^[1-9][0-9]*$'
    and coalesce(g.scope->>'source_ref','')<>''
    and (g.scope->'allowed_actions') ? p_function
    and g.scope->'legacy_effect'=jsonb_build_object('function',p_function,'target',p_effect)
    and coalesce((g.scope->>'operator_confirmed')::boolean,false)
    and (g.scope->>'operator_confirmed_at')::timestamptz<=clock_timestamp()
    and (g.scope->>'expires_at')::timestamptz>clock_timestamp()
    and nullif(g.scope->>'revoked_at','') is null
    and exists(select 1 from public.system_process_registry p where p.process_key=g.scope->>'process_key' and p.process_status='active'),false);
exception when others then return false;
end $$;
revoke all on function public.r01_legacy_effect_authorized_v1(text,jsonb,text) from public,anon,authenticated;
grant execute on function public.r01_legacy_effect_authorized_v1(text,jsonb,text) to service_role;
CREATE OR REPLACE FUNCTION public.add_measures_transition_rule(p_from_registry_key text, p_to_registry_key text, p_transition_kind text, p_requires_release boolean DEFAULT true, p_requires_dependency_satisfied boolean DEFAULT false, p_requires_passage_ready boolean DEFAULT false, p_requires_connect_prompt boolean DEFAULT false, p_sort_order integer DEFAULT 0, p_metadata jsonb DEFAULT '{}'::jsonb)
 RETURNS TABLE(transition_rule_id uuid, from_registry_id uuid, to_registry_id uuid, transition_kind text, rule_state text)
 LANGUAGE plpgsql
 SECURITY INVOKER
 SET search_path TO ''
AS $function$
declare
  v_from_registry_id uuid;
  v_to_registry_id uuid;
  v_rule_id uuid;
begin
  if not public.r01_legacy_effect_authorized_v1('add_measures_transition_rule',jsonb_build_object('from_registry_key',p_from_registry_key,'to_registry_key',p_to_registry_key,'transition_kind',p_transition_kind,'requires_release',p_requires_release,'requires_dependency_satisfied',p_requires_dependency_satisfied,'requires_passage_ready',p_requires_passage_ready,'requires_connect_prompt',p_requires_connect_prompt,'sort_order',p_sort_order,'metadata',p_metadata),null) then raise exception 'held_identity_or_authority_mismatch' using errcode='42501'; end if;

  select mr.id
  into v_from_registry_id
  from public.measures_registry mr
  where mr.registry_key = p_from_registry_key
    and mr.is_active = true;

  select mr.id
  into v_to_registry_id
  from public.measures_registry mr
  where mr.registry_key = p_to_registry_key
    and mr.is_active = true;

  if v_from_registry_id is null then
    raise exception 'from registry_key not found or inactive: %', p_from_registry_key;
  end if;

  if v_to_registry_id is null then
    raise exception 'to registry_key not found or inactive: %', p_to_registry_key;
  end if;

  insert into public.measures_transition_rule (
    from_registry_id,
    to_registry_id,
    transition_kind,
    rule_state,
    requires_release,
    requires_dependency_satisfied,
    requires_passage_ready,
    requires_connect_prompt,
    sort_order,
    metadata
  )
  values (
    v_from_registry_id,
    v_to_registry_id,
    p_transition_kind,
    'active',
    coalesce(p_requires_release, true),
    coalesce(p_requires_dependency_satisfied, false),
    coalesce(p_requires_passage_ready, false),
    coalesce(p_requires_connect_prompt, false),
    coalesce(p_sort_order, 0),
    coalesce(p_metadata, '{}'::jsonb)
  )
  returning id into v_rule_id;

  return query
  select
    mtr.id,
    mtr.from_registry_id,
    mtr.to_registry_id,
    mtr.transition_kind,
    mtr.rule_state
  from public.measures_transition_rule mtr
  where mtr.id = v_rule_id;
end;
$function$
;
revoke all on function public.add_measures_transition_rule(text,text,text,boolean,boolean,boolean,boolean,integer,jsonb) from public,anon,authenticated;
grant execute on function public.add_measures_transition_rule(text,text,text,boolean,boolean,boolean,boolean,integer,jsonb) to service_role;
CREATE OR REPLACE FUNCTION public.define_measures_encounter(p_registry_key text, p_encounter_key text, p_display_title text, p_encounter_type text, p_material_family text DEFAULT NULL::text, p_surface_type text DEFAULT NULL::text, p_sequence_order integer DEFAULT NULL::integer, p_pause_allowed boolean DEFAULT false, p_is_entry_surface boolean DEFAULT false, p_metadata jsonb DEFAULT '{}'::jsonb)
 RETURNS TABLE(encounter_id uuid, registry_id uuid, registry_key text, encounter_key text)
 LANGUAGE plpgsql
 SECURITY INVOKER
 SET search_path TO ''
AS $function$
declare
  v_registry_id uuid;
  v_encounter_id uuid;
begin
  if not public.r01_legacy_effect_authorized_v1('define_measures_encounter',jsonb_build_object('registry_key',p_registry_key,'encounter_key',p_encounter_key,'display_title',p_display_title,'encounter_type',p_encounter_type,'material_family',p_material_family,'surface_type',p_surface_type,'sequence_order',p_sequence_order,'pause_allowed',p_pause_allowed,'is_entry_surface',p_is_entry_surface,'metadata',p_metadata),null) then raise exception 'held_identity_or_authority_mismatch' using errcode='42501'; end if;

  select mr.id
  into v_registry_id
  from public.measures_registry mr
  where mr.registry_key = p_registry_key
    and mr.is_active = true;

  if v_registry_id is null then
    raise exception 'registry_key not found or inactive: %', p_registry_key;
  end if;

  insert into public.measures_encounter_def (
    registry_id,
    encounter_key,
    display_title,
    encounter_type,
    material_family,
    surface_type,
    sequence_order,
    pause_allowed,
    is_entry_surface,
    is_active,
    metadata
  )
  values (
    v_registry_id,
    p_encounter_key,
    p_display_title,
    p_encounter_type,
    p_material_family,
    p_surface_type,
    p_sequence_order,
    coalesce(p_pause_allowed, false),
    coalesce(p_is_entry_surface, false),
    true,
    coalesce(p_metadata, '{}'::jsonb)
  )
  on conflict on constraint measures_encounter_def_registry_id_key do update
    set encounter_key = excluded.encounter_key,
        display_title = excluded.display_title,
        encounter_type = excluded.encounter_type,
        material_family = excluded.material_family,
        surface_type = excluded.surface_type,
        sequence_order = excluded.sequence_order,
        pause_allowed = excluded.pause_allowed,
        is_entry_surface = excluded.is_entry_surface,
        metadata = excluded.metadata,
        updated_at = now()
  returning id into v_encounter_id;

  return query
  select
    med.id,
    med.registry_id,
    mr.registry_key,
    med.encounter_key
  from public.measures_encounter_def med
  join public.measures_registry mr
    on mr.id = med.registry_id
  where med.id = v_encounter_id;
end;
$function$
;
revoke all on function public.define_measures_encounter(text,text,text,text,text,text,integer,boolean,boolean,jsonb) from public,anon,authenticated;
grant execute on function public.define_measures_encounter(text,text,text,text,text,text,integer,boolean,boolean,jsonb) to service_role;
CREATE OR REPLACE FUNCTION public.system_oar_queue_confirm_and_start_cody(p_queue_key text, p_operator_key text)
 RETURNS system_oar_queue
 LANGUAGE plpgsql
 SECURITY INVOKER
 SET search_path TO ''
AS $function$
declare
  v_queue public.system_oar_queue%rowtype;
begin
  if not public.r01_legacy_effect_authorized_v1('system_oar_queue_confirm_and_start_cody',jsonb_build_object('queue_key',p_queue_key,'operator_key',p_operator_key),p_operator_key) then raise exception 'held_identity_or_authority_mismatch' using errcode='42501'; end if;

  select *
  into v_queue
  from public.system_oar_queue
  where queue_key = p_queue_key
  for update;

  if not found then
    raise exception 'system_oar_queue row not found: %', p_queue_key;
  end if;

  if v_queue.process_key='cancom_oar_delivery_retrieval_v1' then raise exception 'native_cancom_passage_required' using errcode='42501'; end if;
  if v_queue.oar_type <> 'oar2' then
    raise exception 'only OAR2 queue rows can start Cody execution';
  end if;

  if v_queue.queue_status not in ('awaiting_operator_confirm', 'approved_for_execution', 'queued_for_cody') then
    raise exception 'queue row is not eligible for operator-confirmed Cody execution: %', v_queue.queue_status;
  end if;

  if v_queue.preflight_status <> 'passed' then
    raise exception 'preflight must be passed before Cody execution';
  end if;

  if v_queue.source_oar2_path is null or v_queue.expected_oar1_path is null then
    raise exception 'source_oar2_path and expected_oar1_path are required before Cody execution';
  end if;

  update public.system_oar_queue
  set
    operator_key = p_operator_key,
    operator_confirmed_at = coalesce(operator_confirmed_at, now()),
    queue_status = 'queued_for_cody',
    cody_handoff_prompt = concat(
      'Execute only from confirmed OAR2: ',
      source_oar2_path,
      '. Expected OAR1: ',
      expected_oar1_path,
      '.'
    )
  where queue_key = p_queue_key
  returning *
  into v_queue;

  update public.system_oar_queue
  set
    queue_status = 'executing',
    execution_started_at = coalesce(execution_started_at, now())
  where queue_key = p_queue_key
  returning *
  into v_queue;

  return v_queue;
end;
$function$
;
revoke all on function public.system_oar_queue_confirm_and_start_cody(text,text) from public,anon,authenticated;
grant execute on function public.system_oar_queue_confirm_and_start_cody(text,text) to service_role;
CREATE OR REPLACE FUNCTION public.system_oar_queue_submit_oar1_for_chazz_prompt(p_queue_key text, p_oar1_path text, p_evidence_path text, p_execution_summary text, p_db_mutation_standing text DEFAULT 'not_applicable'::text, p_src_mutation_standing text DEFAULT 'not_applicable'::text, p_deploy_standing text DEFAULT 'not_applicable'::text)
 RETURNS system_oar_queue
 LANGUAGE plpgsql
 SECURITY INVOKER
 SET search_path TO ''
AS $function$
declare
  v_queue public.system_oar_queue%rowtype;
  v_evidence_key text;
begin
  if not public.r01_legacy_effect_authorized_v1('system_oar_queue_submit_oar1_for_chazz_prompt',jsonb_build_object('queue_key',p_queue_key,'oar1_path',p_oar1_path,'evidence_path',p_evidence_path,'execution_summary',p_execution_summary,'db_mutation_standing',p_db_mutation_standing,'src_mutation_standing',p_src_mutation_standing,'deploy_standing',p_deploy_standing),null) then raise exception 'held_identity_or_authority_mismatch' using errcode='42501'; end if;

  select *
  into v_queue
  from public.system_oar_queue
  where queue_key = p_queue_key
  for update;

  if not found then
    raise exception 'system_oar_queue row not found: %', p_queue_key;
  end if;

  if v_queue.process_key='cancom_oar_delivery_retrieval_v1' then raise exception 'native_cancom_passage_required' using errcode='42501'; end if;
  if v_queue.queue_status <> 'executing' then
    raise exception 'OAR1 can only be submitted from executing standing';
  end if;

  if p_oar1_path is null or length(trim(p_oar1_path)) = 0 then
    raise exception 'OAR1 path is required before Chazz prompt generation';
  end if;

  if p_evidence_path is null or length(trim(p_evidence_path)) = 0 then
    raise exception 'evidence path is required before Chazz prompt generation';
  end if;

  v_evidence_key := concat(p_queue_key, ':oar1-submitted');

  insert into public.system_oar_execution_evidence (
    evidence_key,
    queue_key,
    evidence_type,
    evidence_summary,
    artifact_path
  )
  values (
    v_evidence_key,
    p_queue_key,
    'runtime_validation',
    coalesce(nullif(p_execution_summary, ''), 'OAR1 submitted for Chazz review prompt'),
    p_evidence_path
  )
  on conflict (evidence_key) do update
  set
    evidence_summary = excluded.evidence_summary,
    artifact_path = excluded.artifact_path;

  update public.system_oar_queue
  set
    queue_status = 'oar1_submitted',
    execution_completed_at = coalesce(execution_completed_at, now()),
    oar1_path = p_oar1_path,
    execution_summary = p_execution_summary,
    db_mutation_standing = p_db_mutation_standing,
    src_mutation_standing = p_src_mutation_standing,
    deploy_standing = p_deploy_standing,
    chazz_review_prompt_authority = 'thread_prompt_only',
    chazz_review_prompt_generated_at = now(),
    chazz_review_prompt = concat(
      'Review this OAR1 against its source OAR2.',
      E'\n\nSource OAR2: ',
      source_oar2_path,
      E'\nOAR1: ',
      p_oar1_path,
      E'\nEvidence: ',
      p_evidence_path,
      E'\nExecution standing: oar1_submitted',
      E'\nDB mutation standing: ',
      p_db_mutation_standing,
      E'\nsrc mutation standing: ',
      p_src_mutation_standing,
      E'\nDeploy standing: ',
      p_deploy_standing,
      E'\nWhat Cody changed: ',
      coalesce(p_execution_summary, 'not recorded'),
      E'\nRequested Chazz decision: `validated`, `correction_required`, or `held`.',
      E'\n\nThis prompt is a review surface only. Final standing must be seated back into governed DB/Measures state.'
    )
  where queue_key = p_queue_key
  returning *
  into v_queue;

  return v_queue;
end;
$function$
;
revoke all on function public.system_oar_queue_submit_oar1_for_chazz_prompt(text,text,text,text,text,text,text) from public,anon,authenticated;
grant execute on function public.system_oar_queue_submit_oar1_for_chazz_prompt(text,text,text,text,text,text,text) to service_role;
commit;

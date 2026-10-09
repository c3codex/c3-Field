-- M3-01A: FREE completeness must apply to effective runnable registrar-v1 PACs,
-- not historical PACs made ineffective/superseded by a valid Registrar supersession.
-- Authority: oar2_m3_01a_repair_free_completeness_supersession_guard_chazz_20261008_020

create or replace function public.c3_pac_free_completeness_guard_v1()
returns trigger
language plpgsql
set search_path to 'public'
as $function$
declare
  v_missing_scope integer;
  v_missing_snapshot integer;
begin
  if new.registration_protocol<>'registrar_v1'
     or new.is_effective is not true
     or new.superseded_at is not null then
    return null;
  end if;

  select count(*) into v_missing_scope
  from public.c3_pac_encounter_scope s
  where s.pac_key=new.pac_key
    and s.standing='active'
    and (
      s.free_call_key is null
      or s.selector_type is null
      or not exists(
        select 1 from public.c3_free_call c
        where c.free_call_key=s.free_call_key and c.standing='active'
      )
    );

  if v_missing_scope>0 then
    raise exception 'registrar_v1 FREE call binding required';
  end if;

  select count(*) into v_missing_snapshot
  from public.c3_pac_encounter_scope s
  join public.c3_free_call c on c.free_call_key=s.free_call_key and c.standing='active'
  where s.pac_key=new.pac_key
    and s.standing='active'
    and c.requires_projection=true
    and not exists(
      select 1 from public.c3_free_pac_snapshot fs
      where fs.pac_key=s.pac_key
        and fs.free_call_key=s.free_call_key
        and fs.encounter_key=s.encounter_key
        and fs.standing='active'
        and fs.registration_sha256=new.registration_sha256
    );

  if v_missing_snapshot>0 then
    raise exception 'registrar_v1 FREE projection snapshot required';
  end if;

  return null;
end
$function$;

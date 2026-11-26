CREATE OR REPLACE FUNCTION public.resolve_institutional_seat_v1(p_institution_key text, p_institution_environment_key text)
 RETURNS jsonb
 LANGUAGE plpgsql
 STABLE SECURITY DEFINER
 SET search_path TO 'public'
AS $function$
declare
  v_count integer;
  v_key text;
begin
  if nullif(btrim(coalesce(p_institution_key,'')),'') is null
     or nullif(btrim(coalesce(p_institution_environment_key,'')),'') is null then
    return jsonb_build_object('standing','HLD','reason','seat_identity_required');
  end if;

  select count(*),min(seat_trace_key)
    into v_count,v_key
  from public.measures_system_environment_alignment_trace
  where institution_key=p_institution_key
    and institution_environment_key=p_institution_environment_key
    and standing='PASS'
    and superseded_at is null
    and effective_at<=now();

  if v_count=1 then
    return jsonb_build_object(
      'standing','PASS',
      'seat_trace_key',v_key,
      'institution_key',p_institution_key,
      'institution_environment_key',p_institution_environment_key
    );
  end if;

  return jsonb_build_object(
    'standing','HLD',
    'reason',case when v_count=0 then 'seat_required' else 'seat_ambiguous' end,
    'institution_key',p_institution_key,
    'institution_environment_key',p_institution_environment_key
  );
end $function$;

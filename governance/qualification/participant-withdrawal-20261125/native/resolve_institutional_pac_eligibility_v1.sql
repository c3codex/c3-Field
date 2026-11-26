CREATE OR REPLACE FUNCTION public.resolve_institutional_pac_eligibility_v1(p_institution_key text, p_institution_environment_key text)
 RETURNS jsonb
 LANGUAGE plpgsql
 STABLE SECURITY DEFINER
 SET search_path TO 'public'
AS $function$
declare
  v_seat jsonb;
begin
  v_seat:=public.resolve_institutional_seat_v1(p_institution_key,p_institution_environment_key);
  if coalesce(v_seat->>'standing','HLD')<>'PASS' then
    return jsonb_build_object(
      'standing','HLD',
      'reason','HLD_INSTITUTIONAL_SEAT_REQUIRED',
      'institution_key',p_institution_key,
      'institution_environment_key',p_institution_environment_key
    );
  end if;
  return jsonb_build_object(
    'standing','PASS',
    'institution_key',p_institution_key,
    'institution_environment_key',p_institution_environment_key,
    'seat_trace_key',v_seat->>'seat_trace_key'
  );
end $function$;

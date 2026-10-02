-- Harden only this OAR's new functions. Explicit external-effect prohibitions
-- cannot be overridden by an otherwise enumerated binding/effect tuple.
do $hardening$
declare v_def text; v_old text; v_new text;
begin
  select pg_get_functiondef('public.preflight_c3ops_nug_spec_v1(text,jsonb)'::regprocedure) into v_def;
  v_old := 'if not coalesce(v_cap.scope->''effect_preflights'' @> jsonb_build_array(v_effect),false)';
  v_new := 'if v_cap.scope->''external_provider_effects_authorized'' is distinct from ''true''::jsonb
      or v_q.automation_permissions->''external_provider_effects_authorized'' is distinct from ''true''::jsonb
      or (p_spec->>''effect_class'' = ''external_email'' and (
        v_cap.scope->''external_correspondence_authorized'' is distinct from ''true''::jsonb
        or v_q.automation_permissions->''external_correspondence'' is distinct from ''true''::jsonb))
      or not coalesce(v_cap.scope->''effect_preflights'' @> jsonb_build_array(v_effect),false)';
  if position(v_old in v_def)=0 then raise exception 'NUG preflight hardening anchor mismatch'; end if;
  execute replace(v_def,v_old,v_new);
  select pg_get_functiondef('public.call_c3ops_nug_native_v1(jsonb,text)'::regprocedure) into v_def;
  v_old := 'if exists(select 1 from public.c3ops_nug_occurrence where occurrence_key=p_occurrence_key) then';
  v_new := 'if exists(select 1 from public.c3ops_nug_occurrence where occurrence_key=p_occurrence_key)
    or exists(select 1 from public.c3ops_nug_effect_passage where occurrence_key=p_occurrence_key) then';
  if position(v_old in v_def)=0 then raise exception 'NUG occurrence hardening anchor mismatch'; end if;
  execute replace(v_def,v_old,v_new);
end;
$hardening$;

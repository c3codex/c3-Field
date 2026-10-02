-- A source OAR or unrelated custody object cannot substitute for effect receipt.
do $hardening$
declare v_def text; v_old text; v_new text;
begin
  select pg_get_functiondef('public.return_c3ops_nug_effect_v1(text,text,text)'::regprocedure) into v_def;
  v_old := 'and c.integrity_hash=v_receipt.content_hash and c.resolution_status=''resolved''';
  v_new := 'and c.integrity_hash=v_receipt.content_hash and c.resolution_status=''resolved''
        and c.object_type=''evidence'' and c.intended_function=''nug_effect_receipt''
        and c.metadata->>''native_function_ref''=v_passage.resolution->''binding''->>''native_function_ref''
        and c.metadata->>''executor_ref''=p_executor';
  if position(v_old in v_def)=0 then raise exception 'NUG receipt hardening anchor mismatch'; end if;
  execute replace(v_def,v_old,v_new);
end;
$hardening$;

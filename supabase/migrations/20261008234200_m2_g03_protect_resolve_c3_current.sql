-- M2 G03 — protect generic Current resolver from anonymous/authenticated execution.
-- Authority: oar2_execute_protected_current_access_chazz_20261008_012
-- Parent: oar2_repair_protected_current_access_m2_20261008_011
--
-- Live callers requiring this resolver are server-side and use SUPABASE_SERVICE_ROLE_KEY.
-- Preserve resolver body and Current semantics; narrow only EXECUTE privileges.

begin;

revoke execute on function public.resolve_c3_current(text) from public;
revoke execute on function public.resolve_c3_current(text) from anon;
revoke execute on function public.resolve_c3_current(text) from authenticated;
grant execute on function public.resolve_c3_current(text) to service_role;

do $$
begin
  if has_function_privilege('anon','public.resolve_c3_current(text)','EXECUTE') then
    raise exception 'G03 repair failed: anon retains EXECUTE on resolve_c3_current(text)';
  end if;

  if has_function_privilege('authenticated','public.resolve_c3_current(text)','EXECUTE') then
    raise exception 'G03 repair failed: authenticated retains EXECUTE on resolve_c3_current(text)';
  end if;

  if not has_function_privilege('service_role','public.resolve_c3_current(text)','EXECUTE') then
    raise exception 'G03 repair failed: service_role lost EXECUTE on resolve_c3_current(text)';
  end if;
end
$$;

comment on function public.resolve_c3_current(text) is
  'Privileged Current read resolver. EXECUTE restricted to service_role under M2 G03 protected-environment repair; browser/participant access must use authorized bounded projections or owner-scoped resolution.';

commit;

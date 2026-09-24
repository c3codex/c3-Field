alter function public.resolve_c1me_current_internal(text) security definer;
alter function public.resolve_c1me_current_internal(text)
  set search_path to 'public','pg_temp';

revoke all on function public.resolve_c1me_current_internal(text) from public, anon, authenticated;
grant execute on function public.resolve_c1me_current_internal(text) to service_role;

comment on function public.resolve_c1me_current_internal(text) is
'Server-only read resolver for an existing c1ME owner environment. SECURITY DEFINER is required because underlying Registry tables remain closed to runtime roles; execute is restricted to service_role.';

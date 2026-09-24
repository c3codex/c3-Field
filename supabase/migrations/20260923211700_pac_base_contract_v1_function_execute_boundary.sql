-- PAC Base Contract v1 explicit function execution boundary.
-- Supabase default grants may explicitly grant EXECUTE to anon/authenticated;
-- revoke those roles so PAC contract/evaluation/profile truth remains server-side.

revoke execute on function public.c3_jsonb_path_satisfied(jsonb,text) from anon, authenticated;
revoke execute on function public.c3_pac_intake_contract(text) from anon, authenticated;
revoke execute on function public.c3_pac_evaluate(text) from anon, authenticated;
revoke execute on function public.c3_profile_pac_truth(text) from anon, authenticated;

grant execute on function public.c3_jsonb_path_satisfied(jsonb,text) to service_role;
grant execute on function public.c3_pac_intake_contract(text) to service_role;
grant execute on function public.c3_pac_evaluate(text) to service_role;
grant execute on function public.c3_profile_pac_truth(text) to service_role;

-- OAR: oar2_resolve_my_env_cancom_email_hold_codex_20261002_001.
-- Repair the existing invoker runtime's missing Current permissions. FOR SHARE
-- needs UPDATE on at least one column; grant only the identity column for locks.
-- No browser-role grants, new credential, authority-row rewrite or DEFINER.
grant select on public.c3_current_state to service_role;
grant update (current_state_key) on public.c3_current_state to service_role;
grant select, insert on public.c3_current_evidence_ref to service_role;
grant update (current_evidence_ref_key) on public.c3_current_evidence_ref to service_role;

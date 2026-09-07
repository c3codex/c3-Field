begin;

alter table public.measures_iis_eval_gate1_capture enable row level security;
alter table public.measures_notification_dispatch_log enable row level security;
alter table public.measures_notification_template enable row level security;
alter table public.mr_assessment_evaluation_v2 enable row level security;
alter table public.mr_assessment_evaluation_cell_v2 enable row level security;
alter table public.mr_assessment_evaluation_exposure_v2 enable row level security;
alter table public.mr_assessment_delivery_artifact_v2 enable row level security;
alter table public.mr_map_continuation_state_v2 enable row level security;
alter table public.map_c2_circuit enable row level security;
alter table public.map_payment_events enable row level security;
alter table public.c3_current_state enable row level security;
alter table public.c3_current_evidence_ref enable row level security;

-- Assessment capture remains the only public table write surface in this set.
-- Remove the older unconditional policy and keep INSERT-only Data API exposure.
drop policy if exists "assessment_capture_insert_public"
  on public.measures_iis_eval_gate1_capture;

drop policy if exists "measures_iis_eval_gate1_capture_public_insert"
  on public.measures_iis_eval_gate1_capture;

revoke all on table public.measures_iis_eval_gate1_capture
  from public, anon, authenticated;
grant insert on table public.measures_iis_eval_gate1_capture
  to anon, authenticated;
grant all on table public.measures_iis_eval_gate1_capture
  to service_role;

create policy "measures_iis_eval_gate1_capture_public_insert"
  on public.measures_iis_eval_gate1_capture
  for insert
  to anon, authenticated
  with check (
    capture_context = 'measures_assessment_contact_gated_delivery'
    and intent = 'assessment_result_delivery_request'
    and nullif(btrim(institution_name), '') is not null
    and nullif(btrim(institution_address), '') is not null
    and nullif(btrim(institution_phone), '') is not null
    and nullif(btrim(contact_name), '') is not null
    and nullif(btrim(contact_position), '') is not null
    and nullif(btrim(contact_email), '') is not null
    and position('@' in contact_email) > 1
    and jsonb_typeof(evaluation_answers) = 'object'
    and jsonb_typeof(metadata) = 'object'
    and notification_state = 'queued'
    and confirmation_email_state = 'queued'
    and metadata ->> 'encounter_key' = 'measures_ai_operational_evaluation'
    and metadata ? 'environmental_standing_report'
    and metadata ? 'assessment_result_binding'
  );

comment on policy "measures_iis_eval_gate1_capture_public_insert"
  on public.measures_iis_eval_gate1_capture is
  'OAR2 normalize_harden_mr_assessment_evaluation_c2_rls_codex_v1: public INSERT only for valid contact-gated assessment captures; no public read/update/delete.';

-- Notification template and dispatch details are server-mediated only.
revoke all on table public.measures_notification_dispatch_log
  from public, anon, authenticated;
revoke all on table public.measures_notification_template
  from public, anon, authenticated;
grant all on table public.measures_notification_dispatch_log
  to service_role;
grant all on table public.measures_notification_template
  to service_role;

-- Raw v2 assessment/evaluation/continuation tables are opaque-token or server
-- mediated; no browser role gets direct table access.
revoke all on table public.mr_assessment_evaluation_v2
  from public, anon, authenticated;
revoke all on table public.mr_assessment_evaluation_cell_v2
  from public, anon, authenticated;
revoke all on table public.mr_assessment_evaluation_exposure_v2
  from public, anon, authenticated;
revoke all on table public.mr_assessment_delivery_artifact_v2
  from public, anon, authenticated;
revoke all on table public.mr_map_continuation_state_v2
  from public, anon, authenticated;
grant all on table public.mr_assessment_evaluation_v2
  to service_role;
grant all on table public.mr_assessment_evaluation_cell_v2
  to service_role;
grant all on table public.mr_assessment_evaluation_exposure_v2
  to service_role;
grant all on table public.mr_assessment_delivery_artifact_v2
  to service_role;
grant all on table public.mr_map_continuation_state_v2
  to service_role;

-- C2 catalog and payment status stay behind Functions. Public payment status
-- is projected by /api/map/payment-status/[map_order_id], not raw table SELECT.
drop policy if exists "map_payment_events_owner_read"
  on public.map_payment_events;

revoke all on table public.map_c2_circuit
  from public, anon, authenticated;
revoke all on table public.map_payment_events
  from public, anon, authenticated;
grant all on table public.map_c2_circuit
  to service_role;
grant all on table public.map_payment_events
  to service_role;

-- c3 Current keeps direct table custody closed. resolve_c3_current(text) remains
-- the bounded public projection established by the Current relation migration.
revoke all on table public.c3_current_state
  from public, anon, authenticated, service_role;
revoke all on table public.c3_current_evidence_ref
  from public, anon, authenticated, service_role;
revoke all on function public.resolve_c3_current(text)
  from public, anon, authenticated, service_role;
grant execute on function public.resolve_c3_current(text)
  to anon, authenticated, service_role;

comment on table public.map_payment_events is
  'MAP payment event custody. Raw table access is service-role only; participant status is exposed through bounded server projection.';

do $$
declare
  broad_grant_count integer;
  service_grant_gap_count integer;
  broad_policy_count integer;
begin
  select count(*)
    into broad_grant_count
  from information_schema.role_table_grants
  where table_schema = 'public'
    and grantee in ('anon', 'authenticated')
    and (
      (
        table_name = 'measures_iis_eval_gate1_capture'
        and privilege_type <> 'INSERT'
      )
      or table_name in (
        'measures_notification_dispatch_log',
        'measures_notification_template',
        'mr_assessment_evaluation_v2',
        'mr_assessment_evaluation_cell_v2',
        'mr_assessment_evaluation_exposure_v2',
        'mr_assessment_delivery_artifact_v2',
        'mr_map_continuation_state_v2',
        'map_c2_circuit',
        'map_payment_events',
        'c3_current_state',
        'c3_current_evidence_ref'
      )
    );

  if broad_grant_count <> 0 then
    raise exception 'Validation failed: unexpected anon/auth grants remain on hardened tables: %',
      broad_grant_count;
  end if;

  select count(*)
    into service_grant_gap_count
  from (
    values
      ('measures_iis_eval_gate1_capture'),
      ('measures_notification_dispatch_log'),
      ('measures_notification_template'),
      ('mr_assessment_evaluation_v2'),
      ('mr_assessment_evaluation_cell_v2'),
      ('mr_assessment_evaluation_exposure_v2'),
      ('mr_assessment_delivery_artifact_v2'),
      ('mr_map_continuation_state_v2'),
      ('map_c2_circuit'),
      ('map_payment_events')
  ) as t(table_name)
  where not exists (
    select 1
    from information_schema.role_table_grants g
    where g.table_schema = 'public'
      and g.table_name = t.table_name
      and g.grantee = 'service_role'
      and g.privilege_type = 'SELECT'
  );

  if service_grant_gap_count <> 0 then
    raise exception 'Validation failed: service_role SELECT grant gap on mediated tables: %',
      service_grant_gap_count;
  end if;

  select count(*)
    into broad_policy_count
  from pg_policies
  where schemaname = 'public'
    and (
      (
        tablename = 'measures_iis_eval_gate1_capture'
        and policyname <> 'measures_iis_eval_gate1_capture_public_insert'
      )
      or (
        tablename = 'map_payment_events'
        and policyname <> 'map_payment_events_service_write'
      )
    );

  if broad_policy_count <> 0 then
    raise exception 'Validation failed: unexpected capture/payment policies remain: %',
      broad_policy_count;
  end if;
end;
$$;

commit;

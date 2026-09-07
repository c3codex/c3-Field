alter table public.measures_iis_eval_gate1_capture enable row level security;

drop policy if exists measures_iis_eval_gate1_capture_public_insert
on public.measures_iis_eval_gate1_capture;

create policy measures_iis_eval_gate1_capture_public_insert
on public.measures_iis_eval_gate1_capture
for insert
to anon, authenticated
with check (
  (
    capture_context = 'iis_eval_gate1'
    and intent = 'system_evaluation_request'
  )
  or (
    capture_context = 'measures_assessment_contact_gated_delivery'
    and intent = 'assessment_result_delivery_request'
    and nullif(btrim(institution_name), '') is not null
    and nullif(btrim(contact_name), '') is not null
    and nullif(btrim(contact_email), '') is not null
    and evaluation_answers is not null
    and metadata is not null
    and metadata ->> 'encounter_key' = 'measures_ai_operational_evaluation'
    and metadata ? 'environmental_standing_report'
    and metadata ? 'assessment_result_binding'
  )
);

grant insert on public.measures_iis_eval_gate1_capture to anon, authenticated;
grant select on public.measures_iis_eval_gate1_capture to authenticated;

notify pgrst, 'reload schema';

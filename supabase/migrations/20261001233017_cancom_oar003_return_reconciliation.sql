-- Reconcile 003's recorded OAR1 return; do not invent a historical start time.
do $$
begin
  if not exists(select 1 from public.system_oar_queue q
    where q.scope_key='cancom_runtime_passage_codex_003'
      and q.oar_key='oar2_cancom_runtime_20261001_003'
      and q.queue_status='oar1_submitted'
      and q.execution_completed_at is not null)
    or not exists(select 1 from public.c3ops_oar_custody_resolution_event c
      where c.resolution_event_key='cancom_runtime_passage_codex_003:oar1:oar1_cancom_runtime_passage_codex_003'
        and c.related_oar2='oar2_cancom_runtime_20261001_003'
        and c.standing='held_for_registrar_review'
        and c.integrity_hash='9014685ef8d5c0c0ad0c8c9fcbf58b23e55d9b4ab5d3fdc405ff516b4c733d1c') then
    raise exception 'HLD: 003 return evidence conflict';
  end if;
end; $$;

update public.system_oar_queue set db_mutation_standing='mutated',src_mutation_standing='mutated',
  deploy_standing='held',updated_at=now()
where scope_key='cancom_runtime_passage_codex_003' and queue_status='oar1_submitted'
  and db_mutation_standing='not_authorized' and src_mutation_standing='not_authorized';

update public.c3_oar_process_instance set
  actual_oar1_path='registry://cancom/oar1_return/cancom_runtime_passage_codex_003',
  evidence_path='registry://c3ops_oar_custody_resolution_event/cancom_runtime_passage_codex_003:oar1:oar1_cancom_runtime_passage_codex_003',
  execution_standing='held',validation_standing='chazz_review_required',
  held_standing='held_pending_validation',
  validation_finding='003 Objective A pickup/return installed; Objective B held for unresolved consumer relation and actor context. Historical execution_started_at was not captured.',
  execution_result='Registry-bound OAR1 held_for_registrar_review; two DB migrations and one source adapter, zero external messages.',
  updated_at=now()
where process_instance_key='cancom_runtime_passage_codex_003' and execution_standing='queued';

insert into public.c3_oar_transition_event(transition_event_key,process_instance_key,actor,
  from_status,to_status,transition_type,"timestamp",evidence_reference,notes)
select 'cancom_runtime_passage_codex_003:oar1_return_reconciled',
  'cancom_runtime_passage_codex_003','codex','queued','held','held',now(),
  'registry://c3ops_oar_custody_resolution_event/cancom_runtime_passage_codex_003:oar1:oar1_cancom_runtime_passage_codex_003',
  '004 reconciliation of prior recorded OAR1; transition recorded now, historical start unrecorded.'
where not exists(select 1 from public.c3_oar_transition_event where transition_event_key='cancom_runtime_passage_codex_003:oar1_return_reconciled');

insert into public.system_oar_execution_evidence(evidence_key,queue_key,evidence_type,
  evidence_summary,validation_result,artifact_path)
select 'cancom_runtime_passage_codex_003:oar1_return_reconciled',q.queue_key,'runtime_validation',
  '003 Registry-bound OAR1 and Drive projection readback reconciled into lifecycle.',
  jsonb_build_object('return_standing','held_for_registrar_review',
    'return_sha256','9014685ef8d5c0c0ad0c8c9fcbf58b23e55d9b4ab5d3fdc405ff516b4c733d1c',
    'db_mutation_standing','mutated','src_mutation_standing','mutated',
    'execution_started_at','historical_unrecorded','external_messages_sent',0),
  'registry://c3ops_oar_custody_resolution_event/cancom_runtime_passage_codex_003:oar1:oar1_cancom_runtime_passage_codex_003'
from public.system_oar_queue q where q.scope_key='cancom_runtime_passage_codex_003'
and not exists(select 1 from public.system_oar_execution_evidence e where e.evidence_key='cancom_runtime_passage_codex_003:oar1_return_reconciled');

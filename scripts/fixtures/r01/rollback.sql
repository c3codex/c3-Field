-- SOURCE recovery only. Restores known overbroad preimages: separate Operator disposition required before any real use.
begin;
revoke all on public.c3_envpac_effective_graph from public,anon,authenticated,service_role;
grant INSERT,SELECT,UPDATE,DELETE,TRUNCATE,REFERENCES,TRIGGER,MAINTAIN on public.c3_envpac_effective_graph to "anon";
grant INSERT,SELECT,UPDATE,DELETE,TRUNCATE,REFERENCES,TRIGGER,MAINTAIN on public.c3_envpac_effective_graph to "authenticated";
grant INSERT,SELECT,UPDATE,DELETE,TRUNCATE,REFERENCES,TRIGGER,MAINTAIN on public.c3_envpac_effective_graph to "service_role";
revoke all on public.c3_envpac_registry_reference from public,anon,authenticated,service_role;
grant INSERT,SELECT,UPDATE,DELETE,TRUNCATE,REFERENCES,TRIGGER,MAINTAIN on public.c3_envpac_registry_reference to "anon";
grant INSERT,SELECT,UPDATE,DELETE,TRUNCATE,REFERENCES,TRIGGER,MAINTAIN on public.c3_envpac_registry_reference to "authenticated";
grant INSERT,SELECT,UPDATE,DELETE,TRUNCATE,REFERENCES,TRIGGER,MAINTAIN on public.c3_envpac_registry_reference to "service_role";
revoke all on public.c3ops_asset_lineage_record from public,anon,authenticated,service_role;
grant INSERT,SELECT,UPDATE,DELETE,TRUNCATE,REFERENCES,TRIGGER,MAINTAIN on public.c3ops_asset_lineage_record to "anon";
grant INSERT,SELECT,UPDATE,DELETE,TRUNCATE,REFERENCES,TRIGGER,MAINTAIN on public.c3ops_asset_lineage_record to "authenticated";
grant INSERT,SELECT,UPDATE,DELETE,TRUNCATE,REFERENCES,TRIGGER,MAINTAIN on public.c3ops_asset_lineage_record to "service_role";
drop policy if exists r01_service_authority_only on public.c3ops_asset_lineage_record;
drop policy if exists "Allow anon and authenticated write on c3ops_asset_lineage_recor" on public.c3ops_asset_lineage_record;
create policy "Allow anon and authenticated write on c3ops_asset_lineage_recor" on public.c3ops_asset_lineage_record as PERMISSIVE for ALL to public using (true) with check (true);
drop policy if exists "Allow public read access on c3ops_asset_lineage_record" on public.c3ops_asset_lineage_record;
create policy "Allow public read access on c3ops_asset_lineage_record" on public.c3ops_asset_lineage_record as PERMISSIVE for SELECT to public using (true);
revoke all on public.c3ops_asset_placement_determination from public,anon,authenticated,service_role;
grant INSERT,SELECT,UPDATE,DELETE,TRUNCATE,REFERENCES,TRIGGER,MAINTAIN on public.c3ops_asset_placement_determination to "anon";
grant INSERT,SELECT,UPDATE,DELETE,TRUNCATE,REFERENCES,TRIGGER,MAINTAIN on public.c3ops_asset_placement_determination to "authenticated";
grant INSERT,SELECT,UPDATE,DELETE,TRUNCATE,REFERENCES,TRIGGER,MAINTAIN on public.c3ops_asset_placement_determination to "service_role";
drop policy if exists r01_service_authority_only on public.c3ops_asset_placement_determination;
drop policy if exists "Allow anon and authenticated write on c3ops_asset_placement_det" on public.c3ops_asset_placement_determination;
create policy "Allow anon and authenticated write on c3ops_asset_placement_det" on public.c3ops_asset_placement_determination as PERMISSIVE for ALL to public using (true) with check (true);
drop policy if exists "Allow public read access on c3ops_asset_placement_determination" on public.c3ops_asset_placement_determination;
create policy "Allow public read access on c3ops_asset_placement_determination" on public.c3ops_asset_placement_determination as PERMISSIVE for SELECT to public using (true);
revoke all on public.c3ops_partner from public,anon,authenticated,service_role;
grant INSERT,SELECT,UPDATE,DELETE,TRUNCATE,REFERENCES,TRIGGER,MAINTAIN on public.c3ops_partner to "anon";
grant INSERT,SELECT,UPDATE,DELETE,TRUNCATE,REFERENCES,TRIGGER,MAINTAIN on public.c3ops_partner to "authenticated";
grant INSERT,SELECT,UPDATE,DELETE,TRUNCATE,REFERENCES,TRIGGER,MAINTAIN on public.c3ops_partner to "service_role";
drop policy if exists r01_service_authority_only on public.c3ops_partner;
drop policy if exists "Allow anon and authenticated write on c3ops_partner" on public.c3ops_partner;
create policy "Allow anon and authenticated write on c3ops_partner" on public.c3ops_partner as PERMISSIVE for ALL to public using (true) with check (true);
drop policy if exists "Allow public read access on c3ops_partner" on public.c3ops_partner;
create policy "Allow public read access on c3ops_partner" on public.c3ops_partner as PERMISSIVE for SELECT to public using (true);
revoke all on public.c3ops_publication_component from public,anon,authenticated,service_role;
grant INSERT,SELECT,UPDATE,DELETE,TRUNCATE,REFERENCES,TRIGGER,MAINTAIN on public.c3ops_publication_component to "anon";
grant INSERT,SELECT,UPDATE,DELETE,TRUNCATE,REFERENCES,TRIGGER,MAINTAIN on public.c3ops_publication_component to "authenticated";
grant INSERT,SELECT,UPDATE,DELETE,TRUNCATE,REFERENCES,TRIGGER,MAINTAIN on public.c3ops_publication_component to "service_role";
drop policy if exists r01_service_authority_only on public.c3ops_publication_component;
drop policy if exists "Allow anon and authenticated write on c3ops_publication_compone" on public.c3ops_publication_component;
create policy "Allow anon and authenticated write on c3ops_publication_compone" on public.c3ops_publication_component as PERMISSIVE for ALL to public using (true) with check (true);
drop policy if exists "Allow public read access on c3ops_publication_component" on public.c3ops_publication_component;
create policy "Allow public read access on c3ops_publication_component" on public.c3ops_publication_component as PERMISSIVE for SELECT to public using (true);
revoke all on public.c3ops_publication_lineage_record from public,anon,authenticated,service_role;
grant INSERT,SELECT,UPDATE,DELETE,TRUNCATE,REFERENCES,TRIGGER,MAINTAIN on public.c3ops_publication_lineage_record to "anon";
grant INSERT,SELECT,UPDATE,DELETE,TRUNCATE,REFERENCES,TRIGGER,MAINTAIN on public.c3ops_publication_lineage_record to "authenticated";
grant INSERT,SELECT,UPDATE,DELETE,TRUNCATE,REFERENCES,TRIGGER,MAINTAIN on public.c3ops_publication_lineage_record to "service_role";
drop policy if exists r01_service_authority_only on public.c3ops_publication_lineage_record;
drop policy if exists "Allow anon and authenticated write on c3ops_publication_lineage" on public.c3ops_publication_lineage_record;
create policy "Allow anon and authenticated write on c3ops_publication_lineage" on public.c3ops_publication_lineage_record as PERMISSIVE for ALL to public using (true) with check (true);
drop policy if exists "Allow public read access on c3ops_publication_lineage_record" on public.c3ops_publication_lineage_record;
create policy "Allow public read access on c3ops_publication_lineage_record" on public.c3ops_publication_lineage_record as PERMISSIVE for SELECT to public using (true);
revoke all on public.c3ops_publication_object from public,anon,authenticated,service_role;
grant INSERT,SELECT,UPDATE,DELETE,TRUNCATE,REFERENCES,TRIGGER,MAINTAIN on public.c3ops_publication_object to "anon";
grant INSERT,SELECT,UPDATE,DELETE,TRUNCATE,REFERENCES,TRIGGER,MAINTAIN on public.c3ops_publication_object to "authenticated";
grant INSERT,SELECT,UPDATE,DELETE,TRUNCATE,REFERENCES,TRIGGER,MAINTAIN on public.c3ops_publication_object to "service_role";
drop policy if exists r01_service_authority_only on public.c3ops_publication_object;
drop policy if exists "Allow anon and authenticated write on c3ops_publication_object" on public.c3ops_publication_object;
create policy "Allow anon and authenticated write on c3ops_publication_object" on public.c3ops_publication_object as PERMISSIVE for ALL to public using (true) with check (true);
drop policy if exists "Allow public read access on c3ops_publication_object" on public.c3ops_publication_object;
create policy "Allow public read access on c3ops_publication_object" on public.c3ops_publication_object as PERMISSIVE for SELECT to public using (true);
revoke all on public.measures_seat_hold_notification_review_v1 from public,anon,authenticated,service_role;
grant INSERT,SELECT,UPDATE,DELETE,TRUNCATE,REFERENCES,TRIGGER,MAINTAIN on public.measures_seat_hold_notification_review_v1 to "anon";
grant INSERT,SELECT,UPDATE,DELETE,TRUNCATE,REFERENCES,TRIGGER,MAINTAIN on public.measures_seat_hold_notification_review_v1 to "authenticated";
grant INSERT,SELECT,UPDATE,DELETE,TRUNCATE,REFERENCES,TRIGGER,MAINTAIN on public.measures_seat_hold_notification_review_v1 to "service_role";
CREATE OR REPLACE FUNCTION public.add_measures_transition_rule(p_from_registry_key text, p_to_registry_key text, p_transition_kind text, p_requires_release boolean DEFAULT true, p_requires_dependency_satisfied boolean DEFAULT false, p_requires_passage_ready boolean DEFAULT false, p_requires_connect_prompt boolean DEFAULT false, p_sort_order integer DEFAULT 0, p_metadata jsonb DEFAULT '{}'::jsonb)
 RETURNS TABLE(transition_rule_id uuid, from_registry_id uuid, to_registry_id uuid, transition_kind text, rule_state text)
 LANGUAGE plpgsql
 SECURITY DEFINER
AS $function$
declare
  v_from_registry_id uuid;
  v_to_registry_id uuid;
  v_rule_id uuid;
begin
  select mr.id
  into v_from_registry_id
  from public.measures_registry mr
  where mr.registry_key = p_from_registry_key
    and mr.is_active = true;

  select mr.id
  into v_to_registry_id
  from public.measures_registry mr
  where mr.registry_key = p_to_registry_key
    and mr.is_active = true;

  if v_from_registry_id is null then
    raise exception 'from registry_key not found or inactive: %', p_from_registry_key;
  end if;

  if v_to_registry_id is null then
    raise exception 'to registry_key not found or inactive: %', p_to_registry_key;
  end if;

  insert into public.measures_transition_rule (
    from_registry_id,
    to_registry_id,
    transition_kind,
    rule_state,
    requires_release,
    requires_dependency_satisfied,
    requires_passage_ready,
    requires_connect_prompt,
    sort_order,
    metadata
  )
  values (
    v_from_registry_id,
    v_to_registry_id,
    p_transition_kind,
    'active',
    coalesce(p_requires_release, true),
    coalesce(p_requires_dependency_satisfied, false),
    coalesce(p_requires_passage_ready, false),
    coalesce(p_requires_connect_prompt, false),
    coalesce(p_sort_order, 0),
    coalesce(p_metadata, '{}'::jsonb)
  )
  returning id into v_rule_id;

  return query
  select
    mtr.id,
    mtr.from_registry_id,
    mtr.to_registry_id,
    mtr.transition_kind,
    mtr.rule_state
  from public.measures_transition_rule mtr
  where mtr.id = v_rule_id;
end;
$function$
;
revoke all on function public.add_measures_transition_rule(text,text,text,boolean,boolean,boolean,boolean,integer,jsonb) from public,anon,authenticated,service_role;
grant execute on function public.add_measures_transition_rule(text,text,text,boolean,boolean,boolean,boolean,integer,jsonb) to public,anon,authenticated,service_role;
CREATE OR REPLACE FUNCTION public.define_measures_encounter(p_registry_key text, p_encounter_key text, p_display_title text, p_encounter_type text, p_material_family text DEFAULT NULL::text, p_surface_type text DEFAULT NULL::text, p_sequence_order integer DEFAULT NULL::integer, p_pause_allowed boolean DEFAULT false, p_is_entry_surface boolean DEFAULT false, p_metadata jsonb DEFAULT '{}'::jsonb)
 RETURNS TABLE(encounter_id uuid, registry_id uuid, registry_key text, encounter_key text)
 LANGUAGE plpgsql
 SECURITY DEFINER
AS $function$
declare
  v_registry_id uuid;
  v_encounter_id uuid;
begin
  select mr.id
  into v_registry_id
  from public.measures_registry mr
  where mr.registry_key = p_registry_key
    and mr.is_active = true;

  if v_registry_id is null then
    raise exception 'registry_key not found or inactive: %', p_registry_key;
  end if;

  insert into public.measures_encounter_def (
    registry_id,
    encounter_key,
    display_title,
    encounter_type,
    material_family,
    surface_type,
    sequence_order,
    pause_allowed,
    is_entry_surface,
    is_active,
    metadata
  )
  values (
    v_registry_id,
    p_encounter_key,
    p_display_title,
    p_encounter_type,
    p_material_family,
    p_surface_type,
    p_sequence_order,
    coalesce(p_pause_allowed, false),
    coalesce(p_is_entry_surface, false),
    true,
    coalesce(p_metadata, '{}'::jsonb)
  )
  on conflict (registry_id) do update
    set encounter_key = excluded.encounter_key,
        display_title = excluded.display_title,
        encounter_type = excluded.encounter_type,
        material_family = excluded.material_family,
        surface_type = excluded.surface_type,
        sequence_order = excluded.sequence_order,
        pause_allowed = excluded.pause_allowed,
        is_entry_surface = excluded.is_entry_surface,
        metadata = excluded.metadata,
        updated_at = now()
  returning id into v_encounter_id;

  return query
  select
    med.id,
    med.registry_id,
    mr.registry_key,
    med.encounter_key
  from public.measures_encounter_def med
  join public.measures_registry mr
    on mr.id = med.registry_id
  where med.id = v_encounter_id;
end;
$function$
;
revoke all on function public.define_measures_encounter(text,text,text,text,text,text,integer,boolean,boolean,jsonb) from public,anon,authenticated,service_role;
grant execute on function public.define_measures_encounter(text,text,text,text,text,text,integer,boolean,boolean,jsonb) to public,anon,authenticated,service_role;
CREATE OR REPLACE FUNCTION public.system_oar_queue_confirm_and_start_cody(p_queue_key text, p_operator_key text)
 RETURNS system_oar_queue
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path TO 'public'
AS $function$
declare
  v_queue public.system_oar_queue%rowtype;
begin
  select *
  into v_queue
  from public.system_oar_queue
  where queue_key = p_queue_key
  for update;

  if not found then
    raise exception 'system_oar_queue row not found: %', p_queue_key;
  end if;

  if v_queue.oar_type <> 'oar2' then
    raise exception 'only OAR2 queue rows can start Cody execution';
  end if;

  if v_queue.queue_status not in ('awaiting_operator_confirm', 'approved_for_execution', 'queued_for_cody') then
    raise exception 'queue row is not eligible for operator-confirmed Cody execution: %', v_queue.queue_status;
  end if;

  if v_queue.preflight_status <> 'passed' then
    raise exception 'preflight must be passed before Cody execution';
  end if;

  if v_queue.source_oar2_path is null or v_queue.expected_oar1_path is null then
    raise exception 'source_oar2_path and expected_oar1_path are required before Cody execution';
  end if;

  update public.system_oar_queue
  set
    operator_key = p_operator_key,
    operator_confirmed_at = coalesce(operator_confirmed_at, now()),
    queue_status = 'queued_for_cody',
    cody_handoff_prompt = concat(
      'Execute only from confirmed OAR2: ',
      source_oar2_path,
      '. Expected OAR1: ',
      expected_oar1_path,
      '.'
    )
  where queue_key = p_queue_key
  returning *
  into v_queue;

  update public.system_oar_queue
  set
    queue_status = 'executing',
    execution_started_at = coalesce(execution_started_at, now())
  where queue_key = p_queue_key
  returning *
  into v_queue;

  return v_queue;
end;
$function$
;
revoke all on function public.system_oar_queue_confirm_and_start_cody(text,text) from public,anon,authenticated,service_role;
grant execute on function public.system_oar_queue_confirm_and_start_cody(text,text) to public,anon,authenticated,service_role;
CREATE OR REPLACE FUNCTION public.system_oar_queue_submit_oar1_for_chazz_prompt(p_queue_key text, p_oar1_path text, p_evidence_path text, p_execution_summary text, p_db_mutation_standing text DEFAULT 'not_applicable'::text, p_src_mutation_standing text DEFAULT 'not_applicable'::text, p_deploy_standing text DEFAULT 'not_applicable'::text)
 RETURNS system_oar_queue
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path TO 'public'
AS $function$
declare
  v_queue public.system_oar_queue%rowtype;
  v_evidence_key text;
begin
  select *
  into v_queue
  from public.system_oar_queue
  where queue_key = p_queue_key
  for update;

  if not found then
    raise exception 'system_oar_queue row not found: %', p_queue_key;
  end if;

  if v_queue.queue_status <> 'executing' then
    raise exception 'OAR1 can only be submitted from executing standing';
  end if;

  if p_oar1_path is null or length(trim(p_oar1_path)) = 0 then
    raise exception 'OAR1 path is required before Chazz prompt generation';
  end if;

  if p_evidence_path is null or length(trim(p_evidence_path)) = 0 then
    raise exception 'evidence path is required before Chazz prompt generation';
  end if;

  v_evidence_key := concat(p_queue_key, ':oar1-submitted');

  insert into public.system_oar_execution_evidence (
    evidence_key,
    queue_key,
    evidence_type,
    evidence_summary,
    artifact_path
  )
  values (
    v_evidence_key,
    p_queue_key,
    'runtime_validation',
    coalesce(nullif(p_execution_summary, ''), 'OAR1 submitted for Chazz review prompt'),
    p_evidence_path
  )
  on conflict (evidence_key) do update
  set
    evidence_summary = excluded.evidence_summary,
    artifact_path = excluded.artifact_path;

  update public.system_oar_queue
  set
    queue_status = 'oar1_submitted',
    execution_completed_at = coalesce(execution_completed_at, now()),
    oar1_path = p_oar1_path,
    execution_summary = p_execution_summary,
    db_mutation_standing = p_db_mutation_standing,
    src_mutation_standing = p_src_mutation_standing,
    deploy_standing = p_deploy_standing,
    chazz_review_prompt_authority = 'thread_prompt_only',
    chazz_review_prompt_generated_at = now(),
    chazz_review_prompt = concat(
      'Review this OAR1 against its source OAR2.',
      E'\n\nSource OAR2: ',
      source_oar2_path,
      E'\nOAR1: ',
      p_oar1_path,
      E'\nEvidence: ',
      p_evidence_path,
      E'\nExecution standing: oar1_submitted',
      E'\nDB mutation standing: ',
      p_db_mutation_standing,
      E'\nsrc mutation standing: ',
      p_src_mutation_standing,
      E'\nDeploy standing: ',
      p_deploy_standing,
      E'\nWhat Cody changed: ',
      coalesce(p_execution_summary, 'not recorded'),
      E'\nRequested Chazz decision: `validated`, `correction_required`, or `held`.',
      E'\n\nThis prompt is a review surface only. Final standing must be seated back into governed DB/Measures state.'
    )
  where queue_key = p_queue_key
  returning *
  into v_queue;

  return v_queue;
end;
$function$
;
revoke all on function public.system_oar_queue_submit_oar1_for_chazz_prompt(text,text,text,text,text,text,text) from public,anon,authenticated,service_role;
grant execute on function public.system_oar_queue_submit_oar1_for_chazz_prompt(text,text,text,text,text,text,text) to public,anon,authenticated,service_role;
drop function public.r01_legacy_effect_authorized_v1(text,jsonb,text);
commit;

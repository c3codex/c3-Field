begin;

-- H05: one canonical/effective MDM WebPAC and explicit OG release contract.
update public.c3_pac
set is_effective=false,
    standing='superseded',
    metadata=metadata || jsonb_build_object(
      'superseded_by','c3field_million_dollar_mission_landing_webpac_v1_3',
      'superseded_at',now(),
      'hardening_resolution','H05_duplicate_effective_webpac_closed'
    ),
    updated_at=now()
where pac_key='c3field_million_dollar_mission_landing_webpac_v1_2'
  and is_effective=true;

insert into public.c3_pac_member(
  member_key,pac_key,member_kind,member_role,source_object_key,
  custody_provider,custody_identifier,custody_location,runtime_uri,runtime_binding_key,
  integrity_algorithm,integrity_value,version,standing,required,release_scope,ordinal,metadata
) values (
  'mdm_landing_v13_og_member_v1',
  'c3field_million_dollar_mission_landing_webpac_v1_3',
  'asset','open_graph_share_image','c3_field_mdm_c3_center_og_master_v1',
  'supabase','c3-field-media','c3_center_MDM.webp',
  '/api/free-media?asset=c3_field_mdm_c3_center_og_master_v1',
  'mdm_landing_v13_og_master',
  'storage-etag','2b547214e5f34453cb19064d42750d71-1','v1','registered',true,'registered',1,
  jsonb_build_object(
    'visual_role','open_graph_share_image',
    'canonical_url','https://mdm.c3field.online/',
    'frontend_fallback_allowed',false,
    'required_for_webpac_release_validation',true,
    'source_authority','c3field_public_presentation_authority_v1_2'
  )
)
on conflict (member_key) do update
set pac_key=excluded.pac_key,
    member_kind=excluded.member_kind,
    member_role=excluded.member_role,
    source_object_key=excluded.source_object_key,
    custody_provider=excluded.custody_provider,
    custody_identifier=excluded.custody_identifier,
    custody_location=excluded.custody_location,
    runtime_uri=excluded.runtime_uri,
    runtime_binding_key=excluded.runtime_binding_key,
    integrity_algorithm=excluded.integrity_algorithm,
    integrity_value=excluded.integrity_value,
    version=excluded.version,
    standing=excluded.standing,
    required=excluded.required,
    release_scope=excluded.release_scope,
    ordinal=excluded.ordinal,
    metadata=excluded.metadata,
    updated_at=now();

update public.c3_pac
set metadata=metadata || jsonb_build_object(
      'open_graph_contract',jsonb_build_object(
        'required',true,
        'title_required',true,
        'description_required',true,
        'canonical_url_required',true,
        'image_required',true,
        'title','The Million Dollar Mission | c3 Community Partners',
        'description','The Million Dollar Mission is a live test of what becomes possible when a community can connect the people, places, resources, and possibilities it already has.',
        'canonical_url','https://mdm.c3field.online/',
        'image_asset_key','c3_field_mdm_c3_center_og_master_v1',
        'image_member_key','mdm_landing_v13_og_member_v1',
        'webpac_binding_key','mdm_landing_v13_og_master',
        'runtime_uri','/api/free-media?asset=c3_field_mdm_c3_center_og_master_v1',
        'runtime_uri_state','free_bound',
        'integrity_state','storage_etag_registered',
        'integrity_algorithm','storage-etag',
        'integrity_value','2b547214e5f34453cb19064d42750d71-1',
        'frontend_fallback_allowed',false
      ),
      'hardening_resolution_H05','canonical_webpac_and_og_contract_resolved'
    ),
    updated_at=now()
where pac_key='c3field_million_dollar_mission_landing_webpac_v1_3';

-- H07: Measures Registry remains branch/institutional custody; correct self-supersession residue.
update public.c3_pac p
set custodian_subject_type=e.custodian_subject_type,
    custodian_subject_key=e.custodian_subject_key,
    custody_provider=e.custody_provider,
    metadata=(p.metadata - 'superseded_at' - 'superseded_by') || jsonb_build_object(
      'custody_rule','webpac_custody_derived_from_branch_envpac',
      'custody_state','BRANCH_ENV',
      'custody_envpac',e.envpac_key,
      'custody_owner_subject_type',e.owner_subject_type,
      'custody_owner_subject_key',e.owner_subject_key,
      'hardening_resolution_H07','branch_custody_explicit_self_supersession_removed'
    ),
    updated_at=now()
from public.c3_envpac e
where p.pac_key='measures_registry_home_c3webpac_v0_3'
  and e.envpac_key=p.envpac_key
  and e.envpac_key='c3envpac_measures_registry_v0_1';

-- H08: re-seed runtime primitives from the canonical function so stale pending labels cannot survive.
do $$
declare r record;
begin
  for r in
    select p.envpac_key
    from public.c3_envpac p
    join public.c3_environment e on e.env_key=p.env_key
    where p.is_effective=true
      and p.standing='effective'
      and p.owner_subject_type='individual'
      and e.environment_class='c3me_individual_environment'
      and e.is_active=true
  loop
    perform public.seed_c1me_envpac_primitives_internal(r.envpac_key);
  end loop;
end $$;

update public.system_process_registry
set metadata=metadata || jsonb_build_object(
      'hardening_readback_20260926',jsonb_build_object(
        'native_connections_live_count',(select count(*) from public.c3_envpac_runtime_primitive where primitive_key='native_connections' and standing='active' and config->>'implementation_state'='bilateral_relation_projection_live'),
        'invite_connection_live_count',(select count(*) from public.c3_envpac_runtime_primitive where primitive_key='invite_connection' and standing='active' and config->>'implementation_state'='bilateral_invite_connection_live'),
        'source','canonical_seed_function_replay'
      )
    ),
    updated_at=now()
where process_key='c1me_envpac_primitives_v1';

-- Seat the hardening sweep in the existing OAR/optics spine.
insert into public.c3_oar_process_instance(
  process_instance_key,lifecycle_type,source_oar2_path,source_oar2_standing,
  expected_oar1_path,actual_oar1_path,evidence_path,
  execution_standing,validation_standing,deploy_standing,held_standing,
  seeded_reference_standing,correction_source_oar2_path,correction_oar2_path,
  partial_oar1_reference,validation_finding,correction_scope,execution_result
) values (
  'c3field_soft_launch_hardening_optics_v1','correction',
  'docs/oar/c3_field/oar2_soft_launch_hardening_optics_sweep_v1.meta.md','confirmed',
  'docs/oar/c3_field/oar1_soft_launch_hardening_optics_sweep_v1.meta.md',null,
  'supabase/migrations/20260926233500_soft_launch_hardening_optics_v1.sql',
  'held','pending_validation','held','held_pending_validation','seeded',
  null,'docs/oar/c3_field/oar2_soft_launch_hardening_optics_sweep_v1.meta.md',null,
  'Soft-launch seam audit identified eight bounded hardening findings. H05, H07 and H08 were resolved in first pass; H01-H04 and H06 remain explicitly unresolved.',
  '4.7 evidence map; CURRENT producers; invitation lifecycle; 4.7 OG proof; MDM canonical/OG exclusivity; live runtime proof; Measures Registry branch custody; primitive metadata readback.',
  'First hardening pass applied. Unresolved seams remain visible in optics until evidence closes them.'
)
on conflict (process_instance_key) do update
set lifecycle_type=excluded.lifecycle_type,
    source_oar2_path=excluded.source_oar2_path,
    source_oar2_standing=excluded.source_oar2_standing,
    expected_oar1_path=excluded.expected_oar1_path,
    evidence_path=excluded.evidence_path,
    execution_standing=excluded.execution_standing,
    validation_standing=excluded.validation_standing,
    deploy_standing=excluded.deploy_standing,
    held_standing=excluded.held_standing,
    seeded_reference_standing=excluded.seeded_reference_standing,
    correction_oar2_path=excluded.correction_oar2_path,
    validation_finding=excluded.validation_finding,
    correction_scope=excluded.correction_scope,
    execution_result=excluded.execution_result,
    updated_at=now();

insert into public.c3_oar_seeded_reference(
  seeded_reference_key,seeded_reference_type,seeded_reference_path,seeded_status
) values (
  'c3field_soft_launch_hardening_optics_v1_oar2',
  'process',
  'docs/oar/c3_field/oar2_soft_launch_hardening_optics_sweep_v1.meta.md',
  'active_process_reference'
)
on conflict (seeded_reference_key) do update
set seeded_reference_type=excluded.seeded_reference_type,
    seeded_reference_path=excluded.seeded_reference_path,
    seeded_status=excluded.seeded_status,
    updated_at=now();

insert into public.c3_oar_transition_event(
  transition_event_key,process_instance_key,actor,from_status,to_status,transition_type,timestamp,evidence_reference,notes
) values
(
  'c3field_soft_launch_hardening_optics_v1_confirmed',
  'c3field_soft_launch_hardening_optics_v1','operator','not_queued','confirmed','queue',now(),
  'docs/oar/c3_field/oar2_soft_launch_hardening_optics_sweep_v1.meta.md',
  'Operator authorized the soft-launch hardening sweep and optics consumption with evidence of resolution.'
),
(
  'c3field_soft_launch_hardening_optics_v1_audit',
  'c3field_soft_launch_hardening_optics_v1','chazz','confirmed','executing','execution',now(),
  'docs/oar/c3_field/oar2_soft_launch_hardening_optics_sweep_v1.meta.md',
  'Eight bounded seams captured. Optics must derive from OAR spine evidence and preserve unresolved standing.'
),
(
  'c3field_soft_launch_hardening_optics_v1_H05',
  'c3field_soft_launch_hardening_optics_v1','chazz','executing','executing','execution',now(),
  'supabase:migration:20260926233500_soft_launch_hardening_optics_v1#H05',
  'H05 resolved: MDM v1.2 no longer effective; v1.3 carries explicit required OG member and contract.'
),
(
  'c3field_soft_launch_hardening_optics_v1_H07',
  'c3field_soft_launch_hardening_optics_v1','chazz','executing','executing','execution',now(),
  'supabase:migration:20260926233500_soft_launch_hardening_optics_v1#H07',
  'H07 resolved: Measures Registry WebPAC custody derives from the branch EnvPAC and self-supersession residue was removed.'
),
(
  'c3field_soft_launch_hardening_optics_v1_H08',
  'c3field_soft_launch_hardening_optics_v1','chazz','executing','executing','execution',now(),
  'supabase:migration:20260926233500_soft_launch_hardening_optics_v1#H08',
  'H08 resolved: effective personal EnvPAC primitives were re-seeded from the canonical runtime primitive function.'
),
(
  'c3field_soft_launch_hardening_optics_v1_held',
  'c3field_soft_launch_hardening_optics_v1','chazz','executing','held_pending_validation','held',now(),
  'docs/oar/c3_field/oar2_soft_launch_hardening_optics_sweep_v1.meta.md#hardening-findings',
  'H01-H04 and H06 remain explicit holds; no closure is inferred from partial remediation.'
)
on conflict (transition_event_key) do nothing;

insert into public.system_process_registry(
  process_key,process_family,title,status,source_path,authority_state,metadata,
  process_title,process_scope,process_status,authority_level,source_reference_set,
  required_oar_type,requires_operator_confirm,requires_preflight,requires_oar1_closeout,created_at,updated_at
) values (
  'c3field_soft_launch_hardening_optics_v1','c3_field',
  'Soft Launch Hardening Optics Sweep v1','active',
  'docs/oar/c3_field/oar2_soft_launch_hardening_optics_sweep_v1.meta.md',
  'operator_confirmed_partial_resolution_held_for_remaining_evidence',
  jsonb_build_object(
    'operator','op044',
    'optics_consumption','c3_oar_spine_runtime_coherence_optics',
    'evidence_rule','no_resolution_without_recorded_evidence',
    'resolved',jsonb_build_array('H05','H07','H08'),
    'held',jsonb_build_array('H01','H02','H03','H04','H06'),
    'H01','47pct_evidence_map_renderer_and_geospatial_proof',
    'H02','CURRENT_class_specific_retention_producers',
    'H03','personalized_invitation_lifecycle_contract',
    'H04','47pct_og_exact_webp_free_integrity_runtime_proof',
    'H05','mdm_single_effective_webpac_and_required_og_contract',
    'H06','live_browser_runtime_proof_my_env_current_relational_chazz',
    'H07','measures_registry_branch_custody_and_self_supersession_correction',
    'H08','canonical_personal_envpac_primitive_reseed'
  ),
  'Soft Launch Hardening Optics Sweep v1',
  'c3 Field soft launch seams, evidence resolution, and Runtime Coherence Optics consumption',
  'active','registered_correction_sweep',
  jsonb_build_array(
    'docs/oar/c3_field/oar2_soft_launch_hardening_optics_sweep_v1.meta.md',
    'supabase/migrations/20260926233500_soft_launch_hardening_optics_v1.sql',
    'process:c3field_soft_launch_hardening_optics_v1'
  ),
  'oar2',false,true,true,now(),now()
)
on conflict (process_key) do update
set status=excluded.status,
    process_status=excluded.process_status,
    authority_state=excluded.authority_state,
    metadata=excluded.metadata,
    source_path=excluded.source_path,
    source_reference_set=excluded.source_reference_set,
    updated_at=now();

commit;

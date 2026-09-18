-- c3Field Encounter WebPac v0.10 boundary persistence
-- Operator: op044
-- Canonical WebPac commit: e5c000e18825adaf0d70c3de4a059d317cb1aa52

begin;

insert into public.system_process_registry(
  process_key,process_family,title,status,source_path,authority_state,metadata,
  process_title,process_scope,process_status,authority_level,source_reference_set,
  required_oar_type,requires_operator_confirm,requires_preflight,requires_oar1_closeout,created_at,updated_at
) values (
  'c3field_encounter_webpac_v0_10','c3_field',
  'c3Field Encounter WebPac v0.10','active',
  'github-private://c3codex/measures-of-inanna-governance/main/webpac/c3_field/c3field_online_encounter_webpac_v0_10.meta.md',
  'operator_elevated_private_repo_custody_boundary_fixed',
  jsonb_build_object(
    'operator','op044',
    'canonical_commit','e5c000e18825adaf0d70c3de4a059d317cb1aa52',
    'encounter_end','c1ME.env live backdrop visible',
    'completion_state','c1me_first_arrival_complete_backdrop_visible',
    'next_encounter_start','Field Avatar selection',
    'avatar_included',false,
    'runtime_release_authorized',false,
    'public_release_authorized',false
  ),
  'c3Field Encounter WebPac v0.10',
  'Public hero through persisted C1 owner environment first arrival; boundary ends at live backdrop visible',
  'active','elevated_boundary_fixed',
  jsonb_build_array(
    'github-private://c3codex/measures-of-inanna-governance@e5c000e18825adaf0d70c3de4a059d317cb1aa52/webpac/c3_field/c3field_online_encounter_webpac_v0_10.meta.md',
    'state:c1me_first_arrival_complete_backdrop_visible',
    'next:field_avatar_selection'
  ),
  'oar2',false,true,true,now(),now()
) on conflict (process_key) do update set
  authority_state=excluded.authority_state,
  metadata=excluded.metadata,
  source_reference_set=excluded.source_reference_set,
  updated_at=now();

insert into public.measures_persistence_state(
  persistence_key,process_key,oar2_key,environment_key,object_key,object_type,
  governed_state,evidence,custody,lineage,standing,next_permitted_transition,persisted_by,persisted_at,updated_at
) values (
  'c3field_encounter_webpac_v0_10:boundary',
  'c3field_encounter_webpac_v0_10',
  'c3field_encounter_webpac_v0_10',
  'env_c3_community_connect',
  'c3field_online_encounter_webpac_v0_10',
  'encounter_boundary',
  jsonb_build_object(
    'encounter_start','public_header',
    'encounter_end','c1ME.env live backdrop visible',
    'completion_state','c1me_first_arrival_complete_backdrop_visible',
    'next_encounter_start','field_avatar_selection',
    'avatar_selection_included',false,
    'c1_persisted_before_environment',true,
    'environment_visible_before_avatar',true
  ),
  jsonb_build_object(
    'operator','op044',
    'canonical_commit','e5c000e18825adaf0d70c3de4a059d317cb1aa52',
    'boundary_reason','clean governed start point for next encounter'
  ),
  jsonb_build_object(
    'webpac_package_custody','private repository',
    'media_custody_transferred',false,
    'registry_absorbs_custody',false,
    'free_absorbs_custody',false
  ),
  jsonb_build_object(
    'append_preserving',true,
    'supersedes','c3field_online_public_connect_webpac_v0_9',
    'prior_record_deleted',false
  ),
  'elevated_private_repo_custody_boundary_fixed',
  'bounded_runtime_implementation_then_oar1_then_field_avatar_encounter',
  'registrar',now(),now()
) on conflict (persistence_key) do update set
  governed_state=excluded.governed_state,
  evidence=excluded.evidence,
  custody=excluded.custody,
  lineage=excluded.lineage,
  standing=excluded.standing,
  next_permitted_transition=excluded.next_permitted_transition,
  updated_at=now();

commit;

-- Encounter Resolution Schema v1
-- Normalizes encounter standing, access, discoverability, native surface,
-- projection scope, and custody source as independent dimensions.

insert into public.system_process_registry(
  process_key,process_family,title,status,source_path,authority_state,metadata,
  process_title,process_scope,process_status,authority_level,source_reference_set,
  required_oar_type,requires_operator_confirm,requires_preflight,requires_oar1_closeout,
  created_at,updated_at
)
values (
  'encounter_resolution_schema_v1',
  'c3_field',
  'Encounter Resolution Schema v1',
  'active',
  'docs/c3_field/schema/encounter_resolution_schema_v1.meta.md',
  'operator_confirmed_registered',
  jsonb_build_object(
    'schema_type','encounter_resolution',
    'schema_version','v1',
    'attributes',jsonb_build_object(
      'encounter_standing',jsonb_build_array('pending','active','held','closed'),
      'access_scope',jsonb_build_array('owner','relational','invited','public'),
      'discoverability',jsonb_build_array('hidden','unlisted','listed'),
      'native_surface',jsonb_build_array('c3field'),
      'projection_scope',jsonb_build_array('none','canopy'),
      'custody_source','pac_reference_no_custody_transfer'
    ),
    'normalization_invariant','standing != access != discoverability != native_surface != projection_scope != custody',
    'approval_implies_encounter_authorization',false,
    'encounter_authorization_implies_access_scope',false,
    'encounter_authorization_implies_discoverability',false,
    'encounter_authorization_implies_canopy',false,
    'canopy_implies_public',false,
    'canopy_transfers_custody',false,
    'schema_is_executable_primitive',false,
    'profile_object_name','Encounter Resolution Profile'
  ),
  'Encounter Resolution Schema v1',
  'Normalized encounter standing, access, discoverability, native surface, projection, and custody-source dimensions',
  'active',
  'registered_schema',
  jsonb_build_array('docs/c3_field/schema/encounter_resolution_schema_v1.meta.md'),
  'oar2',true,true,true,now(),now()
)
on conflict (process_key) do update
set title=excluded.title,status=excluded.status,source_path=excluded.source_path,
    authority_state=excluded.authority_state,metadata=excluded.metadata,
    process_title=excluded.process_title,process_scope=excluded.process_scope,
    process_status=excluded.process_status,authority_level=excluded.authority_level,
    source_reference_set=excluded.source_reference_set,updated_at=now();

update public.system_process_registry
set metadata=coalesce(metadata,'{}'::jsonb)
  || jsonb_build_object(
    'encounter_resolution_schema_ref','encounter_resolution_schema_v1',
    'encounter_resolution_profile_object','Encounter Resolution Profile',
    'approval_implies_projection',false,
    'projection_profile_dimensions',jsonb_build_array(
      'encounter_standing','access_scope','discoverability',
      'native_surface','projection_scope','custody_source'
    )
  ),
  updated_at=now()
where process_key='c1me_envpac_primitives_v1';

update public.c3_envpac_runtime_primitive
set config=coalesce(config,'{}'::jsonb)
  || jsonb_build_object(
    'encounter_resolution_schema_ref','encounter_resolution_schema_v1',
    'encounter_resolution_profile_required_for_projection',true
  ),
  updated_at=now()
where primitive_key='my_pacs' and standing='active';

update public.c3_pac
set metadata=coalesce(metadata,'{}'::jsonb)
  || jsonb_build_object(
    'encounter_resolution_schema_ref','encounter_resolution_schema_v1'
  ),
  updated_at=now()
where metadata#>>'{custody_model,custody_class}' in (
  'personal_pac_custody',
  'governed_initiative_custody'
);

-- PAC v1 data-driven intake schema.
-- The Registry defines questions; frontend/runtime renders them.

alter table public.c3_pac_type_contract
  add column intake_schema jsonb not null default '{}'::jsonb
  check (jsonb_typeof(intake_schema)='object');

update public.c3_pac_type_contract
set intake_schema=jsonb_build_object(
  'fields',jsonb_build_array(
    jsonb_build_object(
      'key','profile.display_label',
      'label','Display label',
      'input','text',
      'required',true,
      'max_length',160,
      'placeholder','How should this profile be shown?'
    ),
    jsonb_build_object(
      'key','profile.visibility_scope',
      'label','Visibility',
      'input','select',
      'required',true,
      'default','private',
      'options',jsonb_build_array(
        jsonb_build_object('value','private','label','Private'),
        jsonb_build_object('value','environment','label','This environment'),
        jsonb_build_object('value','relational','label','Relational'),
        jsonb_build_object('value','public','label','Public')
      )
    )
  ),
  'resolved_fields',jsonb_build_array(
    jsonb_build_object('key','profile.profile_class','source','registered_subject_type'),
    jsonb_build_object('key','profile.subject_type','source','environment_session'),
    jsonb_build_object('key','profile.subject_key','source','environment_session'),
    jsonb_build_object('key','envpac_key','source','environment_session')
  )
)
where contract_key='pac_contract_profilepac_v1';

update public.c3_pac_type_contract
set intake_schema=jsonb_build_object('fields','[]'::jsonb,'resolved_fields','[]'::jsonb)
where contract_key<>'pac_contract_profilepac_v1'
  and intake_schema='{}'::jsonb;

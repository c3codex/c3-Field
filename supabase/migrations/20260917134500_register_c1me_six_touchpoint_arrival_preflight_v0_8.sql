-- c1ME.env six-touchpoint arrival encounter v0.8
-- Operator: op044
-- Governance OAR2: docs/oar/c3_field/oar2_implement_c1me_six_touchpoint_arrival_encounter_v0_8.meta.md
-- Standing: bounded implementation authorized; runtime/public release held pending OAR1 proof.

begin;

-- The new live environment backdrop is already physically present in Supabase Storage.
-- Register the governed reference without changing the current runtime presentation binding.
insert into public.c3ops_asset_record(
  asset_key,asset_type,asset_class,title,description,owning_system_key,contributor_key,authorship_method,
  source_asset_key,derivative_of,asset_version,content_hash,hash_algorithm,mime_type,byte_size,seat_scope,src_key,
  standing,rights_holder,license_or_use_rights,transferability,authoritative_custody_type,
  authoritative_custody_provider,authoritative_custody_identifier,authoritative_custody_location,custody_controller,
  free_eligibility,current_free_binding,public_retrieval_standing,supersedes_asset_key,retention_rule,
  external_anchor_type,network_identifier,contract_identifier,token_identifier,anchor_standing,tokenization_standing,
  created_by
) values (
  'c3_field_c1me_live_backdrop_v1','environment_media','c1me_live_environment_backdrop',
  'c1ME.env — Live Environment Backdrop',
  'Operator-approved c1ME.env backdrop used after the governed arrival video resolves. Environment presentation only; does not create identity, standing, authority, passage, or custody transfer.',
  'c3_field','op044','ai_assisted','c3_field_tree_source_v1','c3_field_tree_source_v1','v1',
  'b27febeea50ca53dc6835227a6289daf-1','storage-etag','image/webp',469498,'Institutionally Scoped',
  'c3field_field_encounter_webpac_v0_7','operator_approved_webpac_reference',null,
  'operator_authorized_c3_environment_presentation','presentation_binding_requires_oar1_proof',
  'Supabase Storage','supabase','c3-field-media','c1ME_c3tree.webp','c3_field',true,null,
  'held_for_bounded_runtime_binding',null,'preserve_exact_source_and_lineage',null,null,null,null,null,null,'op044'
) on conflict (asset_key) do nothing;

insert into public.c3ops_asset_lineage_record(
  lineage_key,asset_key,parent_asset_key,root_asset_key,successor_asset_key,lineage_type,effective_date,
  termination_date,replacement_reason,legacy_standing
) values (
  'lineage_c3_field_c1me_live_backdrop_v1',
  'c3_field_c1me_live_backdrop_v1','c3_field_tree_source_v1','c3_field_tree_source_v1',null,
  'environment_presentation_derivative',now(),null,
  'c1ME live backdrop selected for six-touchpoint arrival encounter; runtime binding remains held pending proof','current'
) on conflict (lineage_key) do nothing;

insert into public.system_process_registry(
  process_key,process_family,title,status,source_path,authority_state,metadata,
  process_title,process_scope,process_status,authority_level,source_reference_set,
  required_oar_type,requires_operator_confirm,requires_preflight,requires_oar1_closeout,created_at,updated_at
) values (
  'c1me_six_touchpoint_arrival_encounter_v0_8','c3_field',
  'c1ME.env Six-Touchpoint Arrival Encounter v0.8','active',
  'docs/oar/c3_field/oar2_implement_c1me_six_touchpoint_arrival_encounter_v0_8.meta.md',
  'operator_confirmed_bounded_implementation_release_held',
  jsonb_build_object(
    'operator','op044',
    'touchpoints',jsonb_build_array('invite_connection','connect','confirm_email','enter_environment','arrival_video','live_backdrop'),
    'arrival_video_asset_key','c3_field_c1me_arrival_video_v1',
    'live_backdrop_asset_key','c3_field_c1me_live_backdrop_v1',
    'webpac_drive_id','1egdgldxeiiRxFqHWL_uMzurAWNwg-X3Stl9H_Qy7hbs',
    'environment_primary_surface',true,
    'saas_dashboard_arrival_authorized',false,
    'field_avatar_in_initial_release',false,
    'onboarding_carousel_in_initial_release',false,
    'runtime_release_authorized',false,
    'public_release_authorized',false,
    'remaining_release_holds',jsonb_build_array(
      'register_recoverable_r2_retrieval_path',
      'replace_or_bypass_dashboard_style_arrival_projection',
      'prove_end_to_end_six_touchpoint_runtime_path'
    ),
    'next_permitted_transition','bounded_implementation_then_oar1_runtime_proof'
  ),
  'c1ME.env Six-Touchpoint Arrival Encounter v0.8',
  'Invite -> Connect -> Confirm Email -> Enter Environment -> Arrival Video -> Live Backdrop',
  'active','bounded_implementation',
  jsonb_build_array(
    'webpac:1egdgldxeiiRxFqHWL_uMzurAWNwg-X3Stl9H_Qy7hbs',
    'asset:c3_field_c1me_arrival_video_v1',
    'asset:c3_field_c1me_live_backdrop_v1',
    'process:c1_passage',
    'process:invite_connection'
  ),
  'oar2',false,true,true,now(),now()
) on conflict (process_key) do update set
  metadata=excluded.metadata,
  authority_state=excluded.authority_state,
  updated_at=now();

-- Elevate bounded implementation authority while keeping release held.
insert into public.measures_persistence_state(
  persistence_key,process_key,oar2_key,environment_key,object_key,object_type,
  governed_state,evidence,custody,lineage,standing,next_permitted_transition,persisted_by,persisted_at,updated_at
) values (
  'c1me_six_touchpoint_arrival_encounter_v0_8:preflight_elevation',
  'c1me_six_touchpoint_arrival_encounter_v0_8',
  'oar2_implement_c1me_six_touchpoint_arrival_encounter_v0_8',
  'env_c3_community_connect',
  'c1me_six_touchpoint_arrival_encounter_v0_8',
  'bounded_arrival_encounter_implementation_authority',
  jsonb_build_object(
    'touchpoints',jsonb_build_array('invite_connection','connect','confirm_email','enter_environment','arrival_video','live_backdrop'),
    'preflight_result','clear_for_bounded_implementation_release_held',
    'runtime_release_authorized',false,
    'public_release_authorized',false,
    'arrival_video_runtime_bound',false,
    'live_backdrop_runtime_bound',false,
    'r2_retrieval_path_registered',false,
    'dashboard_projection_cleared',false,
    'oar1_required',true
  ),
  jsonb_build_object(
    'operator','op044',
    'governance_path','github-private://c3codex/measures-of-inanna-governance/main/docs/oar/c3_field/oar2_implement_c1me_six_touchpoint_arrival_encounter_v0_8.meta.md',
    'governance_commit','58aafc58929ef6465b0f630fd844a911184fd2ba',
    'webpac_drive_id','1egdgldxeiiRxFqHWL_uMzurAWNwg-X3Stl9H_Qy7hbs',
    'webpac_extension','six-touchpoint c1ME.env arrival encounter v0.8',
    'verified_storage_backdrop',jsonb_build_object('bucket','c3-field-media','object','c1ME_c3tree.webp','etag','b27febeea50ca53dc6835227a6289daf-1','bytes',469498),
    'verified_arrival_video_asset','c3_field_c1me_arrival_video_v1'
  ),
  jsonb_build_object(
    'webpac_custody','Google Drive authoritative WebPac document',
    'arrival_video_custody','Cloudflare R2 / c1ME.env_ready',
    'backdrop_custody','Supabase Storage / c3-field-media',
    'envpac_absorbs_media_custody',false,
    'custody_transfer',false
  ),
  jsonb_build_object(
    'append_preserving',true,
    'prior_webpac_base','c3field_field_encounter_webpac_v0_7',
    'prior_arrival_video_persistence','c3_field_c1me_arrival_video_v1:webpac_reference',
    'prior_avatar_rule','c1me_encounter_one_element_selection_v0_1:persistence',
    'source_superseded',false
  ),
  'elevated_bounded_implementation_authority_release_held',
  'bounded_implementation_then_oar1_runtime_proof','registrar',now(),now()
) on conflict (persistence_key) do update set
  governed_state=excluded.governed_state,
  evidence=excluded.evidence,
  custody=excluded.custody,
  lineage=excluded.lineage,
  standing=excluded.standing,
  next_permitted_transition=excluded.next_permitted_transition,
  updated_at=now();

-- Append-preserving correction: Field Avatar selection is post-open and deferred from this release.
insert into public.measures_persistence_state(
  persistence_key,process_key,oar2_key,environment_key,object_key,object_type,
  governed_state,evidence,custody,lineage,standing,next_permitted_transition,persisted_by,persisted_at,updated_at
) values (
  'c1me_field_avatar_environment_attachment_v0_2:clarification',
  'c1me_six_touchpoint_arrival_encounter_v0_8',
  'oar2_implement_c1me_six_touchpoint_arrival_encounter_v0_8',
  'env_c3_community_connect',
  'c1me_field_avatar_environment_attachment_v0_2',
  'encounter_rule_clarification',
  jsonb_build_object(
    'preopen_required',false,
    'selection_required_for_environment_open',false,
    'initial_release_includes_selection',false,
    'environment_attached',true,
    'represents_person',false,
    'creates_standing',false,
    'creates_authority',false,
    'creates_rank',false,
    'creates_identity',false,
    'creates_capability',false,
    'selection_occurs_after_environment_visible',true,
    'runtime_implementation_authorized',false
  ),
  jsonb_build_object(
    'operator','op044',
    'reason','environment formation precedes environmental expression; initial six-touchpoint proof ends at live backdrop'
  ),
  jsonb_build_object('attachment_custody','future EnvPac/PAC bounded relation; not created by this clarification','custody_transfer',false),
  jsonb_build_object(
    'append_preserving',true,
    'supersedes_for_implementation','c1me_encounter_one_element_selection_v0_1:persistence',
    'historical_record_deleted',false
  ),
  'superseding_clarification_postopen_deferred',
  'field_avatar_encounter_design_after_arrival_proof','registrar',now(),now()
) on conflict (persistence_key) do update set
  governed_state=excluded.governed_state,
  evidence=excluded.evidence,
  custody=excluded.custody,
  lineage=excluded.lineage,
  standing=excluded.standing,
  next_permitted_transition=excluded.next_permitted_transition,
  updated_at=now();

commit;

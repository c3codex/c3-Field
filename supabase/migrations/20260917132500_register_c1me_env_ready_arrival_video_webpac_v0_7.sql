begin;

insert into public.c3ops_asset_record(
  asset_key,asset_type,asset_class,title,description,owning_system_key,contributor_key,authorship_method,
  source_asset_key,derivative_of,asset_version,content_hash,hash_algorithm,mime_type,byte_size,seat_scope,src_key,
  standing,rights_holder,license_or_use_rights,transferability,authoritative_custody_type,
  authoritative_custody_provider,authoritative_custody_identifier,authoritative_custody_location,custody_controller,
  free_eligibility,current_free_binding,public_retrieval_standing,supersedes_asset_key,retention_rule,
  external_anchor_type,network_identifier,contract_identifier,token_identifier,anchor_standing,tokenization_standing,
  created_by
) values (
  'c3_field_c1me_arrival_video_v1',
  'environment_media',
  'arrival_sequence_video',
  'c1ME.env — Environment Arrival Sequence',
  'Silent 13.326-second environment-arrival motion sequence used after Connect and email confirmation as c1ME.env comes into view.',
  'c3_field','op044','ai_assisted',
  null,null,'v1',
  '431aaa5c46224481ca2c571131b7eec382711deef83a799c9ecf6aab1b93cedd','sha256','video/mp4',17749051,
  'Institutionally Scoped','c3field_field_encounter_webpac_v0_7',
  'operator_approved_webpac_reference',null,
  'operator_authorized_c3_environment_presentation','reference_and_runtime_use_only_no_custody_transfer',
  'R2 object storage','Cloudflare R2','c1ME.env_ready','09171253-lvn_final_video_no_voiceover_plus2s.mp4','c3_field',
  false,null,'held_not_publicly_released',null,'preserve_exact_hash_and_runtime_media_custody',
  null,null,null,null,null,null,'op044'
) on conflict (asset_key) do update set
  content_hash=excluded.content_hash,
  hash_algorithm=excluded.hash_algorithm,
  mime_type=excluded.mime_type,
  byte_size=excluded.byte_size,
  standing=excluded.standing,
  authoritative_custody_type=excluded.authoritative_custody_type,
  authoritative_custody_provider=excluded.authoritative_custody_provider,
  authoritative_custody_identifier=excluded.authoritative_custody_identifier,
  authoritative_custody_location=excluded.authoritative_custody_location,
  public_retrieval_standing=excluded.public_retrieval_standing,
  updated_at=now();

update public.c3_pac
set metadata = coalesce(metadata,'{}'::jsonb) || jsonb_build_object(
  'arrival_sequence_asset_key','c3_field_c1me_arrival_video_v1',
  'arrival_sequence_role','environment_arrival_after_connect_and_email_confirmation',
  'arrival_sequence_custody_provider','Cloudflare R2',
  'arrival_sequence_bucket','c1ME.env_ready',
  'arrival_sequence_object','09171253-lvn_final_video_no_voiceover_plus2s.mp4',
  'arrival_sequence_sha256','431aaa5c46224481ca2c571131b7eec382711deef83a799c9ecf6aab1b93cedd',
  'arrival_sequence_duration_seconds',13.326,
  'arrival_sequence_audio_standing','silent_voiceover_removed',
  'arrival_sequence_runtime_release_authorized',false,
  'custody_transfer',false
), updated_at=now()
where pac_key='c3webpac_person_eea672f5a7676dad4316755b_v0_1';

insert into public.measures_persistence_state(
  persistence_key,process_key,oar2_key,environment_key,object_key,object_type,
  governed_state,evidence,custody,lineage,standing,next_permitted_transition,persisted_by,persisted_at,updated_at
) values (
  'c3field_webpac_v0_7:c1me_arrival_video_v1',
  'c3field_field_encounter_webpac_v0_7',
  'operator_directed_c1me_arrival_video_webpac_addition_20260917',
  'env_person_eea672f5a7676dad4316755b',
  'c3_field_c1me_arrival_video_v1',
  'webpac_runtime_media_reference',
  jsonb_build_object(
    'role','c1ME.env arrival sequence',
    'encounter_position','after Connect and email confirmation as environment comes into view',
    'runtime_release_authorized',false,
    'public_release_authorized',false,
    'voiceover_removed',true,
    'duration_seconds',13.326
  ),
  jsonb_build_object(
    'operator','op044',
    'source_webpac_key','c3field_field_encounter_webpac_v0_7',
    'source_webpac_drive_id','1egdgldxeiiRxFqHWL_uMzurAWNwg-X3Stl9H_Qy7hbs',
    'sha256','431aaa5c46224481ca2c571131b7eec382711deef83a799c9ecf6aab1b93cedd',
    'byte_size',17749051
  ),
  jsonb_build_object(
    'provider','Cloudflare R2',
    'bucket','c1ME.env_ready',
    'object','09171253-lvn_final_video_no_voiceover_plus2s.mp4',
    'custody_controller','c3_field',
    'custody_transfer',false
  ),
  jsonb_build_object(
    'append_preserving',true,
    'webpac_version','v0.7',
    'source_superseded',false
  ),
  'registered_webpac_media_reference_release_held',
  'bounded_runtime_binding_authorization',
  'registrar',now(),now()
)
on conflict (persistence_key) do nothing;

commit;

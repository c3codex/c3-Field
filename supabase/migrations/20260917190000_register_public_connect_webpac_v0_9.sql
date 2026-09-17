-- c3Field.online public Connect WebPac v0.9
-- Operator: op044
-- Canonical WebPac commit: c65049bee03ca4b3b0716cd0c6445c726d95c6b2
-- Runtime/public release remains held pending hero media custody + OAR1 proof.

begin;

insert into public.system_process_registry(
  process_key,process_family,title,status,source_path,authority_state,metadata,
  process_title,process_scope,process_status,authority_level,source_reference_set,
  required_oar_type,requires_operator_confirm,requires_preflight,requires_oar1_closeout,created_at,updated_at
) values (
  'c3field_public_connect_webpac_v0_9','c3_field',
  'c3Field Public Connect WebPac v0.9','active',
  'github-private://c3codex/measures-of-inanna-governance/main/webpac/c3_field/c3field_online_public_connect_webpac_v0_9.meta.md',
  'operator_elevated_private_repo_custody_release_held',
  jsonb_build_object(
    'operator','op044',
    'canonical_commit','c65049bee03ca4b3b0716cd0c6445c726d95c6b2',
    'presentation_sequence',jsonb_build_array('header','fullscreen_intro','hero','connect','footer'),
    'hero_title','Communities are broken because systems are.',
    'hero_cta','CONNECT',
    'hero_asset_key','c3_field_connect_hero_backdrop_v1',
    'hero_media_bound',false,
    'quantification_deferred',true,
    'runtime_release_authorized',false,
    'public_release_authorized',false,
    'next_permitted_transition','bind_hero_media_then_bounded_runtime_implementation_then_oar1'
  ),
  'c3Field Public Connect WebPac v0.9',
  'Public Connect: Header -> Full-screen Intro -> Hero Hook + CONNECT -> Existing C1 Connect -> Footer',
  'active','bounded_implementation_release_held',
  jsonb_build_array(
    'github-private://c3codex/measures-of-inanna-governance@c65049bee03ca4b3b0716cd0c6445c726d95c6b2/webpac/c3_field/c3field_online_public_connect_webpac_v0_9.meta.md',
    'asset:c3_field_connect_hero_backdrop_v1',
    'surface:/',
    'process:c1_passage'
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
  'c3field_public_connect_webpac_v0_9:private_repo_custody',
  'c3field_public_connect_webpac_v0_9',
  'c3field_public_connect_webpac_v0_9',
  'env_c3_community_connect',
  'c3field_online_public_connect_webpac_v0_9',
  'elevated_webpac_custody',
  jsonb_build_object(
    'canonical_custody','private_repository',
    'canonical_repo','c3codex/measures-of-inanna-governance',
    'canonical_path','webpac/c3_field/c3field_online_public_connect_webpac_v0_9.meta.md',
    'canonical_commit','c65049bee03ca4b3b0716cd0c6445c726d95c6b2',
    'hero_title','Communities are broken because systems are.',
    'hero_cta','CONNECT',
    'hero_media_bound',false,
    'runtime_release_authorized',false,
    'public_release_authorized',false
  ),
  jsonb_build_object(
    'operator','op044',
    'selected_hero_asset_key','c3_field_connect_hero_backdrop_v1',
    'media_binding_pending',true
  ),
  jsonb_build_object(
    'webpac_package_custody','private repository',
    'hero_media_target_custody','Supabase Storage / c3-field-media',
    'media_custody_transferred',false,
    'registry_absorbs_custody',false,
    'free_absorbs_custody',false
  ),
  jsonb_build_object(
    'append_preserving',true,
    'supersedes','c3field_field_encounter_webpac_v0_8',
    'prior_record_deleted',false
  ),
  'elevated_private_repo_custody_implementation_pending_media_binding',
  'bind_hero_media_then_bounded_runtime_implementation_then_oar1',
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

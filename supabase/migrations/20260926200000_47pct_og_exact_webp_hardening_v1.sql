begin;

insert into public.c3ops_asset_record(
  asset_key,asset_type,asset_class,title,description,owning_system_key,contributor_key,authorship_method,
  source_asset_key,derivative_of,asset_version,content_hash,hash_algorithm,mime_type,byte_size,seat_scope,
  src_key,standing,rights_holder,license_or_use_rights,transferability,authoritative_custody_type,
  authoritative_custody_provider,authoritative_custody_identifier,authoritative_custody_location,
  custody_controller,free_eligibility,current_free_binding,public_retrieval_standing,supersedes_asset_key,
  retention_rule,created_by
) values (
  '47pct_my_env_og_v1',
  'environment_media',
  'open_graph_share_image',
  '4.7% — A c3 Field Initiative — Open Graph',
  'Operator-supplied exact WebP for the 4.7% initiative share surface. Washington, D.C. skyline, 4.7% emblem, and networked U.S. ground visual.',
  'c3_field','op044','ai_assisted',
  null,null,'v1',
  '3d4f34a9efc6b810ee3e94183519b51e071a54c40dd90a15f9f3511422112784',
  'sha256','image/webp',136804,'Institutionally Scoped',
  '47pct_c1_connect_c3webpac_v1',
  'operator_approved_webpac_reference',
  null,
  'operator_authorized_c3_environment_presentation',
  'public_runtime_binding_authorized',
  'Cloudflare R2','Cloudflare R2','c3-field-media','47pct_ initiative.webp',
  'c3_field',true,
  '/api/free-media?asset=47pct_my_env_og_v1',
  'bounded_public_runtime',
  null,
  'preserve_exact_source_bytes_hash_and_webpac_relation',
  'op044'
)
on conflict (asset_key) do update
set asset_type=excluded.asset_type,
    asset_class=excluded.asset_class,
    title=excluded.title,
    description=excluded.description,
    owning_system_key=excluded.owning_system_key,
    contributor_key=excluded.contributor_key,
    authorship_method=excluded.authorship_method,
    asset_version=excluded.asset_version,
    content_hash=excluded.content_hash,
    hash_algorithm=excluded.hash_algorithm,
    mime_type=excluded.mime_type,
    byte_size=excluded.byte_size,
    seat_scope=excluded.seat_scope,
    src_key=excluded.src_key,
    standing=excluded.standing,
    license_or_use_rights=excluded.license_or_use_rights,
    transferability=excluded.transferability,
    authoritative_custody_type=excluded.authoritative_custody_type,
    authoritative_custody_provider=excluded.authoritative_custody_provider,
    authoritative_custody_identifier=excluded.authoritative_custody_identifier,
    authoritative_custody_location=excluded.authoritative_custody_location,
    custody_controller=excluded.custody_controller,
    free_eligibility=excluded.free_eligibility,
    current_free_binding=excluded.current_free_binding,
    public_retrieval_standing=excluded.public_retrieval_standing,
    retention_rule=excluded.retention_rule,
    updated_at=now();

update public.c3_pac_runtime_binding
set runtime_uri='/api/free-media?asset=47pct_my_env_og_v1',
    metadata=metadata || jsonb_build_object(
      'source_asset_key','47pct_my_env_og_v1',
      'source_asset_sha256','3d4f34a9efc6b810ee3e94183519b51e071a54c40dd90a15f9f3511422112784',
      'source_asset_byte_size',136804,
      'source_asset_mime_type','image/webp',
      'runtime_state','free_bound_pending_live_readback',
      'free_resolved',true,
      'frontend_fallback_allowed',false
    ),
    updated_at=now()
where binding_key='47pct_my_env_og_runtime_binding_v1'
  and pac_key='47pct_c1_connect_c3webpac_v1';

update public.c3_pac_member
set runtime_uri='/api/free-media?asset=47pct_my_env_og_v1',
    integrity_algorithm='sha256',
    integrity_value='3d4f34a9efc6b810ee3e94183519b51e071a54c40dd90a15f9f3511422112784',
    metadata=(metadata - 'generated_source_png_sha256') || jsonb_build_object(
      'byte_size',136804,
      'mime_type','image/webp',
      'dimensions','1672x941',
      'integrity_state','exact_webp_sha256_registered',
      'webp_sha256','3d4f34a9efc6b810ee3e94183519b51e071a54c40dd90a15f9f3511422112784',
      'source_png_sha256','be504858c3e60929b54f51036517d20497a530cf0cf814e693e2814ce8ae0123',
      'runtime_uri_state','free_bound_pending_live_readback',
      'bucket_custody_state','operator_confirmed_uploaded',
      'frontend_invention_allowed',false
    ),
    updated_at=now()
where member_key='47pct_my_env_og_member_v1'
  and pac_key='47pct_c1_connect_c3webpac_v1';

update public.c3_pac
set metadata=jsonb_set(
      metadata,
      '{open_graph_contract}',
      coalesce(metadata->'open_graph_contract','{}'::jsonb) || jsonb_build_object(
        'image_asset_key','47pct_my_env_og_v1',
        'image_member_key','47pct_my_env_og_member_v1',
        'webpac_binding_key','47pct_my_env_og_runtime_binding_v1',
        'runtime_uri','/api/free-media?asset=47pct_my_env_og_v1',
        'runtime_uri_state','free_bound_pending_live_readback',
        'integrity_state','exact_webp_sha256_registered_pending_live_readback',
        'integrity_algorithm','sha256',
        'image_integrity_sha256','3d4f34a9efc6b810ee3e94183519b51e071a54c40dd90a15f9f3511422112784',
        'image_byte_size',136804,
        'image_mime_type','image/webp',
        'frontend_fallback_allowed',false
      ),
      true
    ) || jsonb_build_object(
      'hardening_H04_state','exact_webp_registered_free_bound_pending_live_readback'
    ),
    updated_at=now()
where pac_key='47pct_c1_connect_c3webpac_v1';

insert into public.c3_oar_transition_event(
  transition_event_key,process_instance_key,actor,from_status,to_status,transition_type,timestamp,evidence_reference,notes
) values (
  'c3field_soft_launch_hardening_optics_v1_H04_exact_webp_registered',
  'c3field_soft_launch_hardening_optics_v1','chazz',
  'held_pending_validation','held_pending_validation','validation',now(),
  'supabase:migration:20260926200000_47pct_og_exact_webp_hardening_v1#H04',
  'H04 advanced: exact operator-supplied WebP registered at SHA-256 3d4f34a9efc6b810ee3e94183519b51e071a54c40dd90a15f9f3511422112784, 136804 bytes, 1672x941, and bound to FREE. Live host/share readback remains required before H04 closes.'
)
on conflict (transition_event_key) do nothing;

update public.system_process_registry
set metadata=metadata || jsonb_build_object(
  'H04_state','exact_webp_registered_free_bound_pending_live_readback',
  'H04_asset_key','47pct_my_env_og_v1',
  'H04_sha256','3d4f34a9efc6b810ee3e94183519b51e071a54c40dd90a15f9f3511422112784',
  'H04_byte_size',136804,
  'H04_dimensions','1672x941'
),updated_at=now()
where process_key='c3field_soft_launch_hardening_optics_v1';

commit;

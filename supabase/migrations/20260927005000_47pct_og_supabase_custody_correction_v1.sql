begin;

-- H04 custody correction: the exact 4.7% OG WebP is held in Supabase Storage,
-- bucket c3-field-media. Preserve exact bytes/integrity; correct provider only.

update public.c3ops_asset_record
set authoritative_custody_type='Supabase Storage',
    authoritative_custody_provider='supabase',
    authoritative_custody_identifier='c3-field-media',
    authoritative_custody_location='47pct_ initiative.webp',
    current_free_binding='/api/free-media?asset=47pct_my_env_og_v1',
    public_retrieval_standing='bounded_public_runtime',
    updated_at=now()
where asset_key='47pct_my_env_og_v1';

update public.c3_pac_runtime_binding
set provider='supabase',
    bucket_name='c3-field-media',
    object_path='47pct_ initiative.webp',
    runtime_uri='/api/free-media?asset=47pct_my_env_og_v1',
    metadata=metadata || jsonb_build_object(
      'custody_provider','supabase',
      'custody_state','supabase_storage_verified',
      'storage_bucket','c3-field-media',
      'storage_object','47pct_ initiative.webp',
      'storage_etag','8999ae5d2b05713624bdd96c664f04ba-1',
      'storage_byte_size',136804,
      'storage_mime_type','image/webp',
      'runtime_state','free_bound_pending_live_host_readback',
      'custody_correction','cloudflare_r2_attribution_removed_2026-09-26'
    ),
    updated_at=now()
where binding_key='47pct_my_env_og_runtime_binding_v1'
  and pac_key='47pct_c1_connect_c3webpac_v1';

update public.c3_pac_member
set custody_provider='supabase',
    custody_identifier='c3-field-media',
    custody_location='47pct_ initiative.webp',
    runtime_uri='/api/free-media?asset=47pct_my_env_og_v1',
    metadata=metadata || jsonb_build_object(
      'custody_provider','supabase',
      'bucket_custody_state','supabase_storage_verified',
      'storage_etag','8999ae5d2b05713624bdd96c664f04ba-1',
      'runtime_uri_state','free_bound_pending_live_host_readback',
      'custody_correction','cloudflare_r2_attribution_removed_2026-09-26'
    ),
    updated_at=now()
where member_key='47pct_my_env_og_member_v1'
  and pac_key='47pct_c1_connect_c3webpac_v1';

update public.c3_pac
set metadata=jsonb_set(
      metadata,
      '{open_graph_contract}',
      coalesce(metadata->'open_graph_contract','{}'::jsonb) || jsonb_build_object(
        'custody_provider','supabase',
        'bucket_name','c3-field-media',
        'object_path','47pct_ initiative.webp',
        'bucket_custody_state','supabase_storage_verified',
        'storage_etag','8999ae5d2b05713624bdd96c664f04ba-1',
        'runtime_uri','/api/free-media?asset=47pct_my_env_og_v1',
        'runtime_uri_state','free_bound_pending_live_host_readback',
        'integrity_state','exact_webp_sha256_registered_storage_verified_pending_live_host_readback',
        'image_integrity_sha256','3d4f34a9efc6b810ee3e94183519b51e071a54c40dd90a15f9f3511422112784',
        'image_byte_size',136804,
        'image_mime_type','image/webp',
        'frontend_fallback_allowed',false
      ),
      true
    ) || jsonb_build_object(
      'hardening_H04_state','supabase_storage_verified_free_bound_pending_live_host_readback'
    ),
    updated_at=now()
where pac_key='47pct_c1_connect_c3webpac_v1';

insert into public.c3_oar_transition_event(
  transition_event_key,process_instance_key,actor,from_status,to_status,
  transition_type,timestamp,evidence_reference,notes
) values (
  'c3field_soft_launch_hardening_optics_v1_H04_custody_corrected',
  'c3field_soft_launch_hardening_optics_v1','chazz',
  'held_pending_validation','held_pending_validation','correction',now(),
  'supabase:storage:c3-field-media/47pct_ initiative.webp',
  'H04 custody corrected from Cloudflare R2 to Supabase Storage. Storage readback confirms bucket c3-field-media, exact object 47pct_ initiative.webp, image/webp, 136804 bytes, ETag 8999ae5d2b05713624bdd96c664f04ba-1. Exact local WebP SHA-256 remains 3d4f34a9efc6b810ee3e94183519b51e071a54c40dd90a15f9f3511422112784.'
)
on conflict (transition_event_key) do nothing;

update public.system_process_registry
set metadata=metadata || jsonb_build_object(
  'H04_state','supabase_storage_verified_free_bound_pending_live_host_readback',
  'H04_custody_provider','supabase',
  'H04_storage_bucket','c3-field-media',
  'H04_storage_object','47pct_ initiative.webp',
  'H04_storage_etag','8999ae5d2b05713624bdd96c664f04ba-1',
  'H04_custody_correction','prior_cloudflare_r2_attribution_corrected'
),updated_at=now()
where process_key='c3field_soft_launch_hardening_optics_v1';

commit;

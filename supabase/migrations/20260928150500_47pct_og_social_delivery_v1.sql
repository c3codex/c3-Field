begin;

update public.c3_pac
set metadata=jsonb_set(
      metadata,
      '{open_graph_contract}',
      coalesce(metadata->'open_graph_contract','{}'::jsonb) || jsonb_build_object(
        'social_delivery_uri','https://zfihrspxvennjzazxcbj.supabase.co/storage/v1/object/public/c3-field-media/47pct_%20initiative.webp?v=3d4f34a9efc6b810',
        'social_delivery_provider','supabase_public_storage',
        'social_delivery_cache_key','3d4f34a9efc6b810',
        'image_mime_type','image/webp',
        'image_width',1672,
        'image_height',941,
        'facebook_debugger_state','direct_social_delivery_seated_pending_rescrape',
        'runtime_uri','/api/free-media?asset=47pct_my_env_og_v1',
        'runtime_uri_role','governed_application_runtime',
        'social_delivery_role','external_open_graph_crawler_delivery',
        'frontend_fallback_allowed',false
      ),
      true
    ),
    metadata=jsonb_set(
      jsonb_set(
        metadata,
        '{open_graph_contract}',
        coalesce(metadata->'open_graph_contract','{}'::jsonb) || jsonb_build_object(
          'social_delivery_uri','https://zfihrspxvennjzazxcbj.supabase.co/storage/v1/object/public/c3-field-media/47pct_%20initiative.webp?v=3d4f34a9efc6b810',
          'social_delivery_provider','supabase_public_storage',
          'social_delivery_cache_key','3d4f34a9efc6b810',
          'image_mime_type','image/webp',
          'image_width',1672,
          'image_height',941,
          'facebook_debugger_state','direct_social_delivery_seated_pending_rescrape',
          'runtime_uri','/api/free-media?asset=47pct_my_env_og_v1',
          'runtime_uri_role','governed_application_runtime',
          'social_delivery_role','external_open_graph_crawler_delivery',
          'frontend_fallback_allowed',false
        ),
        true
      ),
      '{public_presentation,og_image_state}',
      '"direct_social_delivery_seated_pending_facebook_rescrape"'::jsonb,
      true
    ),
    updated_at=now()
where pac_key='47pct_c1_connect_c3webpac_v1';

update public.c3_pac_runtime_binding
set metadata=metadata || jsonb_build_object(
      'social_delivery_uri','https://zfihrspxvennjzazxcbj.supabase.co/storage/v1/object/public/c3-field-media/47pct_%20initiative.webp?v=3d4f34a9efc6b810',
      'social_delivery_role','external_open_graph_crawler_delivery',
      'social_delivery_provider','supabase_public_storage',
      'social_delivery_cache_key','3d4f34a9efc6b810'
    ),
    updated_at=now()
where binding_key='47pct_my_env_og_runtime_binding_v1';

update public.c3_pac_member
set metadata=metadata || jsonb_build_object(
      'social_delivery_uri','https://zfihrspxvennjzazxcbj.supabase.co/storage/v1/object/public/c3-field-media/47pct_%20initiative.webp?v=3d4f34a9efc6b810',
      'social_delivery_role','external_open_graph_crawler_delivery',
      'image_width',1672,
      'image_height',941
    ),
    updated_at=now()
where member_key='47pct_my_env_og_member_v1';

insert into public.c3_oar_transition_event(
  transition_event_key,process_instance_key,actor,from_status,to_status,
  transition_type,timestamp,evidence_reference,notes
) values (
  'c3field_soft_launch_hardening_optics_v1_H04_facebook_debugger_missing_image',
  'c3field_soft_launch_hardening_optics_v1','operator',
  'held_pending_validation','held_pending_validation','validation',now(),
  'operator_live_check:facebook_sharing_debugger:47pct.c3field.online',
  'Facebook Sharing Debugger did not resolve the 4.7 Open Graph image after the 4.7 title/runtime surface began resolving.'
),
(
  'c3field_soft_launch_hardening_optics_v1_H04_direct_social_delivery',
  'c3field_soft_launch_hardening_optics_v1','chazz',
  'held_pending_validation','held_pending_validation','execution',now(),
  'supabase:storage:c3-field-media/47pct_ initiative.webp',
  'H04 advanced: external social crawlers now receive a versioned absolute HTTPS Supabase public-storage delivery URL from the WebPAC Open Graph contract. Application runtime continues to use FREE. Exact WebP SHA-256 remains unchanged.'
)
on conflict (transition_event_key) do nothing;

update public.system_process_registry
set metadata=metadata || jsonb_build_object(
  'H04_state','direct_social_delivery_seated_pending_facebook_rescrape',
  'H04_social_delivery_uri','https://zfihrspxvennjzazxcbj.supabase.co/storage/v1/object/public/c3-field-media/47pct_%20initiative.webp?v=3d4f34a9efc6b810',
  'H04_social_delivery_provider','supabase_public_storage',
  'H04_image_width',1672,
  'H04_image_height',941,
  'H04_image_mime_type','image/webp',
  'H04_cache_key','3d4f34a9efc6b810'
),updated_at=now()
where process_key='c3field_soft_launch_hardening_optics_v1';

commit;

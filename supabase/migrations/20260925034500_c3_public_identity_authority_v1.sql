-- Canonical c3 Field / c3 Community Partners public identity authority
-- Operator: op044
-- Identity payload SHA-256 (canonical JSON): 819102c92167a77895671bd2b31bd29abeb571696274b1072de33e1ccccf61cf

insert into public.codex_source_reference(
  source_key,source_title,source_type,authority_level,source_scope,
  version_label,source_status,readonly,source_path,source_hash,metadata,created_by
)
values(
  'c3field_public_identity_authority_v1_0',
  'c3 Field Public Identity Authority',
  'foundational_source',
  'operator',
  'c3_field_public_identity',
  'v1.0',
  'committed',
  true,
  'c3://registry/public-identity/c3field_public_identity_authority_v1_0',
  '819102c92167a77895671bd2b31bd29abeb571696274b1072de33e1ccccf61cf',
  jsonb_build_object(
    'brand','c3 Community Partners',
    'legal_entity','c3 Community Partners DAO, LLC',
    'formal_authority_statement','c3 Community Partners DAO, LLC operating within computational systems governance.',
    'environment_name','c3Field',
    'environment_definition','c3Field is the relational operations environment for structured participation.',
    'model_name','The c3 Model',
    'model_descriptor','A structured participation model.',
    'model_path','Connect · Contribute · Create',
    'initiative_label','A c3 Field Initiative',
    'contact_email','connect@c3field.online',
    'contact_phone','615-854-7139',
    'contact_phone_href','tel:+16158547139',
    'privacy_route','/privacy',
    'terms_route','/terms',
    'contact_route','/contact',
    'copyright','© 2026 c3 Community Partners DAO, LLC. All rights reserved.',
    'identity_class','PUBLIC_CONSTANT',
    'surface_scope','all_c3field_and_c3_community_partners_public_surfaces',
    'operator','op044',
    'captured_at','2026-09-25',
    'frontend_invention',false
  ),
  'op044'
)
on conflict (source_key) do update
set source_title=excluded.source_title,
    source_type=excluded.source_type,
    authority_level=excluded.authority_level,
    source_scope=excluded.source_scope,
    version_label=excluded.version_label,
    source_status=excluded.source_status,
    readonly=excluded.readonly,
    source_path=excluded.source_path,
    source_hash=excluded.source_hash,
    metadata=excluded.metadata,
    updated_at=now();

update public.c3_environment
set metadata=metadata || jsonb_build_object(
      'public_identity_authority_source','c3field_public_identity_authority_v1_0',
      'public_identity_contract_version','v1.0'
    ),
    updated_at=now()
where env_key='env_c3_community_connect';

update public.codex_source_reference
set version_label='v1.3',
    metadata =
      metadata
      || jsonb_build_object(
           'public_identity_source_key','c3field_public_identity_authority_v1_0',
           'contact_email','connect@c3field.online',
           'content_authority_version','v1.3',
           'content_authority_date','2026-09-25'
         )
      || jsonb_build_object(
           'footer',
           coalesce(metadata->'footer','{}'::jsonb)
             || jsonb_build_object(
                  'brand','c3 Community Partners',
                  'legal_entity','c3 Community Partners DAO, LLC',
                  'environment_line','c3Field is the relational operations environment for structured participation.',
                  'formal_authority_statement','c3 Community Partners DAO, LLC operating within computational systems governance.',
                  'contact_email','connect@c3field.online',
                  'contact_phone','615-854-7139',
                  'contact_phone_href','tel:+16158547139',
                  'copyright','© 2026 c3 Community Partners DAO, LLC. All rights reserved.'
                ),
           'contact_document',
           coalesce(metadata->'contact_document','{}'::jsonb)
             || jsonb_build_object(
                  'title','Contact',
                  'route','/contact',
                  'body','Contact is a communication surface. Sending a message does not itself create participation or standing.',
                  'email','connect@c3field.online',
                  'phone','615-854-7139'
                )
         ),
    updated_at=now()
where source_key='c3field_public_presentation_authority_v1_2';


update public.c3_pac
set metadata=jsonb_set(
  metadata,
  '{footer_contract,source_key}',
  to_jsonb('c3field_public_identity_authority_v1_0'::text),
  true
) || jsonb_build_object(
  'public_identity_authority_source','c3field_public_identity_authority_v1_0'
),
updated_at=now()
where pac_key='47pct_c1_connect_c3webpac_v1';

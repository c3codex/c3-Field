-- 4.7% public landing identity: initiative copy + approved emblem watermark
-- Source master SHA-256: 82df1681ad94aaa713d513bce93935ca6bc6e6e528165c89b01716fd879aaa2b
-- Web derivative SVG SHA-256: ab78caa2d9ea1c7cb405736d48b8be1ed740900e93a7e22c96da1f16356f3295

update public.c3_pac
set metadata =
  metadata
  || jsonb_build_object(
    'public_presentation',
    jsonb_build_object(
      'kicker','c3 COMMUNITY PARTNERS',
      'title','4.7%',
      'initiative_explanation','A c3 Community Partners initiative making the distance between recognized harm, allowed compensation, and actual payment publicly visible.',
      'connect_copy','Connect to the 4.7% Initiative.',
      'audience_copy','Survivors, families, supporters, advocates, contributors, media, and community partners may enter through Connect.',
      'primary_cta','CONNECT',
      'memorial_name','Eternal Flame',
      'memorial_text','For those who died waiting.',
      'watermark_asset_key','47pct_emblem_watermark_v1',
      'watermark_runtime_url','/assets/47pct/47pct-emblem-watermark-v1.svg',
      'watermark_opacity',0.12,
      'public_surface_protected_primitive_labels_allowed',false
    ),
    'watermark_emblem',
    jsonb_build_object(
      'asset_key','47pct_emblem_watermark_v1',
      'source_master_sha256','82df1681ad94aaa713d513bce93935ca6bc6e6e528165c89b01716fd879aaa2b',
      'source_custody','4.7% InitPAC',
      'source_driv','47pct_emblem_DRIV_v1',
      'derivative_class','web_landing_watermark',
      'derivative_format','SVG wrapper with faithful WebP delivery derivative',
      'derivative_dimensions','128x128',
      'derivative_sha256','ab78caa2d9ea1c7cb405736d48b8be1ed740900e93a7e22c96da1f16356f3295',
      'runtime_url','/assets/47pct/47pct-emblem-watermark-v1.svg',
      'fidelity','approved_master_resized_only_no_redesign',
      'authority_transfer','NONE'
    ),
    'public_surface_copy_rule',
    jsonb_build_object(
      'protected_primitive_shorthand_visible',false,
      'prohibited_public_labels',jsonb_build_array('322','C1','C2','EnvPAC','CURRENT','visibility edge'),
      'system_primitives_remain_internal',true
    )
  ),
  updated_at=now()
where pac_key='47pct_c1_connect_c3webpac_v1';

insert into public.c3_pac_member(
  member_key,pac_key,member_kind,member_role,source_object_key,standing,required,release_scope,metadata
)
values(
  '47pct_emblem_watermark_member_v1',
  '47pct_c1_connect_c3webpac_v1',
  'asset',
  'initiative_watermark_emblem',
  '47pct_emblem_watermark_v1',
  'active',
  true,
  'registered',
  jsonb_build_object(
    'runtime_url','/assets/47pct/47pct-emblem-watermark-v1.svg',
    'source_master_sha256','82df1681ad94aaa713d513bce93935ca6bc6e6e528165c89b01716fd879aaa2b',
    'derivative_sha256','ab78caa2d9ea1c7cb405736d48b8be1ed740900e93a7e22c96da1f16356f3295',
    'source_driv','47pct_emblem_DRIV_v1',
    'derivative_class','web_landing_watermark',
    'authority_effect','none',
    'visual_role','watermark'
  )
)
on conflict (member_key) do update
set standing=excluded.standing,
    required=excluded.required,
    release_scope=excluded.release_scope,
    metadata=excluded.metadata;

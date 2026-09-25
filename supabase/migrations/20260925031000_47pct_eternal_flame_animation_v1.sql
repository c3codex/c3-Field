update public.c3_pac
set metadata =
  jsonb_set(
    jsonb_set(
      metadata,
      '{public_presentation}',
      coalesce(metadata->'public_presentation','{}'::jsonb)
        || jsonb_build_object(
             'memorial_renderer','animated_eternal_flame_v1',
             'memorial_animation','continuous_subtle_flicker',
             'memorial_reduced_motion','static_flame'
           ),
      true
    ),
    '{persistent_memorial}',
    coalesce(metadata->'persistent_memorial','{}'::jsonb)
      || jsonb_build_object(
           'visual_renderer','animated_eternal_flame_v1',
           'animation_state','continuous',
           'animation_style','restrained_natural_flicker',
           'reduced_motion_fallback','static_flame',
           'renderer_surfaces',jsonb_build_array('C1','MY_ENV','C2','future_47pct_surfaces'),
           'animation_authority_effect','none',
           'evidence_effect','none',
           'interaction_required',false,
           'identity_persists_across_surfaces',true
         ),
    true
  ),
  updated_at=now()
where pac_key='47pct_c1_connect_c3webpac_v1';

update public.c3_pac_member
set metadata = metadata
  || jsonb_build_object(
       'visual_renderer','animated_eternal_flame_v1',
       'animation_state','continuous',
       'animation_style','restrained_natural_flicker',
       'reduced_motion_fallback','static_flame',
       'renderer_component','EternalFlame',
       'renderer_surfaces',jsonb_build_array('C1','MY_ENV','C2','future_47pct_surfaces'),
       'authority_effect','none',
       'evidence_effect','none'
     )
where member_key='47pct_eternal_flame_member_v1';

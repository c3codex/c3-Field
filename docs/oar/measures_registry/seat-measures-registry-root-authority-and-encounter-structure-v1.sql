-- OAR2: Seat Measures Registry Root Authority and Encounter Structure v1
-- Source: docs/oar/measures_registry/oar2_seat_measures_registry_root_authority_and_encounter_structure_v1.meta.md

do $$
declare
  v_root_id uuid;
begin
  insert into public.measures_registry (
    registry_key, display_title, registry_family, encounter_type, material_family,
    sequence_order, release_state, access_state, phase_label, is_active, metadata
  ) values (
    'measures_registry_root',
    'Measures Registry Root Authority',
    'spine',
    'root_route_authority',
    'lapis',
    1000,
    'released',
    'visible',
    'registry-resolved root encounter structure',
    true,
    jsonb_build_object(
      'unit_key', 'measures_registry_root',
      'route_path', '/',
      'route_authority', 'registry',
      'frontend_role', 'renderer',
      'runtime_surface', 'intro_hook',
      'encounter_key', 'ai_isnt_broken_intro',
      'release_state_source', 'measures_registry.release_state',
      'access_state_source', 'measures_registry.access_state',
      'fallback_allowed', false,
      'source_oar2', 'docs/oar/measures_registry/oar2_seat_measures_registry_root_authority_and_encounter_structure_v1.meta.md',
      'encounter_structure', jsonb_build_object(
        'intro_hook', jsonb_build_object(
          'content_encounter_key', 'ai_isnt_broken_intro',
          'media_role', 'intro_hook_video',
          'controls', jsonb_build_array('audio', 'continue'),
          'next_surface', 'path_choice'
        ),
        'path_choice', jsonb_build_object(
          'content_encounter_key', 'evaluate_structure_path',
          'left', jsonb_build_object(
            'label', 'Assess the Environment',
            'motion_media_role', 'left_hero_fracture_motion',
            'poster_media_role', 'left_hero_fracture',
            'next_surface', 'structural_coherence_explainer'
          ),
          'right', jsonb_build_object(
            'label', 'Understand the Environment',
            'motion_media_role', 'measured_hero_motion_graphic',
            'poster_media_role', 'right_measured_hero',
            'next_surface', 'measures_structured_environments'
          )
        ),
        'structural_coherence_explainer', jsonb_build_object(
          'content_encounter_key', 'eval_passage',
          'media_role', 'explainer_video',
          'next_surface', 'measures_assessment'
        ),
        'assessment', jsonb_build_object(
          'content_encounter_key', 'measures_assessment',
          'ordered_stages', jsonb_build_array('assessment', 'contact_capture', 'result', 'map_continuation', 'payment'),
          'assessment_before_contact_capture', true,
          'map_payment_logic', 'preserve_existing_live_logic',
          'confirmation_email_notice', 'Login details will arrive in a separate email.'
        ),
        'measures_structured_environments', jsonb_build_object(
          'content_encounter_key', 'structure_passage',
          'media_role', 'measures_structured_enviroments',
          'next_surface', 'about_measures_registry',
          'final_passage_line', 'The goal is governable environments.'
        ),
        'about_measures_registry', jsonb_build_object(
          'content_encounter_key', 'about_measures_registry',
          'video_media_role', 'about_measures_registry_video',
          'seal_media_role', 'official_codexstone_seal'
        )
      ),
      'undrifted_contract', jsonb_build_object(
        'route_path', '/undrifted',
        'hero_media_role', 'questions_ungoverned_systems_cannot_answer_video',
        'featured_articles', jsonb_build_array(
          jsonb_build_object('title', 'Agents With Keys', 'publication_state', 'unpublished', 'media_role', 'agents_with_keys_cover'),
          jsonb_build_object('title', 'Fables and Myths', 'publication_state', 'unpublished', 'media_role', 'fables_and_myths_cover')
        ),
        'about_teaser_target', 'about_measures_registry',
        'leadership_callout_target', 'c3_field_our_story',
        'footer_link_text', 'Registered Branch of c3 Field'
      ),
      'gated_access', jsonb_build_object(
        'c3_field_our_story_default_root_sequence', false,
        'entry_points', jsonb_build_array('undrifted_leadership_callout', 'footer_registered_branch_link')
      )
    )
  )
  on conflict (registry_key) do update set
    display_title = excluded.display_title,
    registry_family = excluded.registry_family,
    encounter_type = excluded.encounter_type,
    material_family = excluded.material_family,
    sequence_order = excluded.sequence_order,
    release_state = excluded.release_state,
    access_state = excluded.access_state,
    phase_label = excluded.phase_label,
    is_active = excluded.is_active,
    metadata = excluded.metadata,
    updated_at = now();

  select id into v_root_id
  from public.measures_registry
  where registry_key = 'measures_registry_root';

  delete from public.measures_release_state where registry_id = v_root_id;

  insert into public.measures_release_state (
    registry_id, release_state, access_state, release_reason, access_reason,
    phase_label, effective_at, metadata
  ) values (
    v_root_id, 'released', 'visible',
    'root route authority seated by OAR2',
    'public root resolves only from active registry authority',
    'registry-resolved root encounter structure', now(),
    jsonb_build_object(
      'route_path', '/',
      'runtime_surface', 'intro_hook',
      'source_oar2', 'docs/oar/measures_registry/oar2_seat_measures_registry_root_authority_and_encounter_structure_v1.meta.md'
    )
  );

  update public.measures_encounter_def
  set metadata = coalesce(metadata, '{}'::jsonb) || jsonb_build_object(
    'root_sequence_binding', jsonb_build_object(
      'surface_key', 'ai_isnt_broken_intro',
      'public_sequence_key', 'intro_hook',
      'next_surface', 'path_choice',
      'media_role', 'intro_hook_video',
      'source_oar2', 'docs/oar/measures_registry/oar2_seat_measures_registry_root_authority_and_encounter_structure_v1.meta.md'
    )
  ), updated_at = now()
  where encounter_key = 'ai_isnt_broken_intro';

  update public.measures_encounter_def
  set metadata = coalesce(metadata, '{}'::jsonb) || jsonb_build_object(
    'root_sequence_binding', jsonb_build_object(
      'surface_key', 'path_choice',
      'left_next_surface', 'structural_coherence_explainer',
      'right_next_surface', 'measures_structured_environments',
      'source_oar2', 'docs/oar/measures_registry/oar2_seat_measures_registry_root_authority_and_encounter_structure_v1.meta.md'
    )
  ), updated_at = now()
  where encounter_key = 'evaluate_structure_path';

  update public.measures_encounter_def
  set metadata = coalesce(metadata, '{}'::jsonb) || jsonb_build_object(
    'informational_paragraph', 'Institutions govern systems. AI deployed into broken systems scales broken systems. Measures Registry makes the operating environment visible so institutions can preserve accountability and establish governable conditions.',
    'closing_statement', 'The goal is governable environments.',
    'root_sequence_binding', jsonb_build_object(
      'surface_key', 'measures_structured_environments',
      'next_surface', 'about_measures_registry',
      'source_oar2', 'docs/oar/measures_registry/oar2_seat_measures_registry_root_authority_and_encounter_structure_v1.meta.md'
    )
  ), updated_at = now()
  where encounter_key = 'structure_passage';

  update public.measures_encounter_def
  set display_title = 'About Measures Registry',
      material_family = 'marble',
      metadata = coalesce(metadata, '{}'::jsonb) || jsonb_build_object(
        'title', 'About Measures Registry',
        'subtitle', 'Shared systems governance for institutions deploying AI.',
        'renderer', 'about_measures_registry',
        'state_expression', 'public_about_measures_registry',
        'content_contract', jsonb_build_object(
          'title', 'About Measures Registry',
          'intro', 'Shared systems governance for institutions deploying AI.',
          'objective', jsonb_build_object('eyebrow', 'Objective', 'body', 'Preserve institutional accountability.'),
          'action', jsonb_build_object('eyebrow', 'Action', 'body', 'Establish shared systems governance.'),
          'result', jsonb_build_object('eyebrow', 'Result', 'body', 'Institutions remain accountable for the systems they govern, the AI they deploy, and the people they serve.'),
          'seal', jsonb_build_object('line_1', 'Measures Registry', 'line_2', 'A governed system of record.', 'line_3', 'The stone remembers.'),
          'frontend_hardcode_allowed', false,
          'source_oar2', 'docs/oar/measures_registry/oar2_seat_measures_registry_root_authority_and_encounter_structure_v1.meta.md'
        )
      ), updated_at = now()
  where encounter_key = 'about_measures_registry';

  if not exists (select 1 from public.measures_encounter_def where encounter_key = 'about_measures_registry') then
    raise exception 'about_measures_registry encounter missing';
  end if;

  update public.measures_registry
  set metadata = coalesce(metadata, '{}'::jsonb) || jsonb_build_object(
    'featured_article_set', jsonb_build_array(
      jsonb_build_object('title', 'Agents With Keys', 'publication_state', 'unpublished', 'media_role', 'agents_with_keys_cover'),
      jsonb_build_object('title', 'Fables and Myths', 'publication_state', 'unpublished', 'media_role', 'fables_and_myths_cover')
    ),
    'about_teaser', jsonb_build_object('label', 'About Measures Registry', 'target_surface', 'about_measures_registry'),
    'leadership_callout', jsonb_build_object('label', 'Our Story', 'target', 'c3_field_our_story', 'access', 'intentional'),
    'footer_registered_branch_link', jsonb_build_object('label', 'Registered Branch of c3 Field', 'target', 'c3_field_our_story', 'access', 'intentional')
  ), updated_at = now()
  where registry_key = 'undrifted_publication_landing';

  if not exists (
    select 1 from public.measures_registry
    where registry_key = 'measures_registry_root'
      and is_active = true
      and release_state = 'released'
      and access_state = 'visible'
      and metadata ->> 'route_path' = '/'
      and metadata ->> 'route_authority' = 'registry'
      and metadata ->> 'frontend_role' = 'renderer'
      and metadata ->> 'runtime_surface' = 'intro_hook'
      and metadata ->> 'fallback_allowed' = 'false'
  ) then
    raise exception 'root authority validation failed';
  end if;
end $$;

insert into public.measures_media_map (
  registry_key, encounter_key, campaign_key, media_role, storage_bucket,
  storage_path, mime_type, sort_order, is_active, metadata
)
select * from (values
  ('measures_registry_root', 'intro_hook', 'measures_registry_root_authority_v1', 'intro_hook_video', 'measures-media', 'intro_hook.mp4', 'video/mp4', 10, true, jsonb_build_object('public_url', 'https://media.c3field.online/intro_hook.mp4', 'storage_tier', 'L2')),
  ('measures_registry_root', 'about_measures_registry', 'measures_registry_root_authority_v1', 'about_measures_registry_video', 'measures-media', 'about_measures_registry.mp4', 'video/mp4', 20, true, jsonb_build_object('public_url', 'https://media.c3field.online/about_measures_registry.mp4', 'storage_tier', 'L2')),
  ('measures_registry_root', 'about_measures_registry', 'measures_registry_root_authority_v1', 'official_codexstone_seal', 'measures-registry', 'official_codexstone_seal.png', 'image/png', 30, true, jsonb_build_object('storage_tier', 'supabase')),
  ('measures_registry_root', 'structural_drift_publication', 'measures_registry_root_authority_v1', 'agents_with_keys_cover', 'measures-registry', 'agents_with_keys.webp', 'image/webp', 40, true, jsonb_build_object('publication_state', 'unpublished')),
  ('measures_registry_root', 'structural_drift_publication', 'measures_registry_root_authority_v1', 'fables_and_myths_cover', 'measures-registry', 'fables_and_myths.webp', 'image/webp', 50, true, jsonb_build_object('publication_state', 'unpublished'))
) as v(registry_key, encounter_key, campaign_key, media_role, storage_bucket, storage_path, mime_type, sort_order, is_active, metadata)
where not exists (
  select 1 from public.measures_media_map m
  where m.campaign_key = v.campaign_key and m.media_role = v.media_role
);

do $$
begin
  if (select count(*) from public.measures_media_map where campaign_key = 'measures_registry_root_authority_v1' and is_active) <> 5 then
    raise exception 'root authority media mapping validation failed';
  end if;
end $$;

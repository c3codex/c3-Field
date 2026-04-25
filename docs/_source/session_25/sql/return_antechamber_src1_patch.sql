do $$
declare
  return_registry uuid;
  return_encounter uuid;
  src1_registry uuid;
  src1_encounter uuid;
  harrumuk_registry uuid;
  harrumuk_encounter uuid;
  phase_registry uuid;
  phase_encounter uuid;
  temple_registry uuid;
  temple_encounter uuid;
begin
  insert into public.measures_registry (
    id,
    registry_key,
    display_title,
    registry_family,
    encounter_type,
    material_family,
    sequence_order,
    release_state,
    access_state,
    is_active,
    metadata
  )
  values (
    gen_random_uuid(),
    'return_antechamber',
    'Return Antechamber',
    'spine',
    'threshold',
    'lapis',
    998,
    'released',
    'callable',
    true,
    jsonb_build_object(
      'role', 'post_passage_orientation_surface',
      'source', 'return_antechamber_src1_manifest'
    )
  )
  on conflict (registry_key) do update
  set
    display_title = excluded.display_title,
    encounter_type = excluded.encounter_type,
    material_family = excluded.material_family,
    sequence_order = excluded.sequence_order,
    release_state = excluded.release_state,
    access_state = excluded.access_state,
    is_active = true,
    metadata = coalesce(public.measures_registry.metadata, '{}'::jsonb) || excluded.metadata,
    updated_at = now()
  returning id into return_registry;

  insert into public.measures_registry (
    id,
    registry_key,
    display_title,
    registry_family,
    encounter_type,
    material_family,
    sequence_order,
    release_state,
    access_state,
    is_active,
    metadata
  )
  values (
    gen_random_uuid(),
    'src1_connect',
    'SRC1 Connect',
    'spine',
    'view',
    'lapis',
    999,
    'released',
    'callable',
    true,
    jsonb_build_object(
      'role', 'individual_connect_receipt_acknowledgment',
      'source', 'return_antechamber_src1_manifest'
    )
  )
  on conflict (registry_key) do update
  set
    display_title = excluded.display_title,
    registry_family = excluded.registry_family,
    encounter_type = excluded.encounter_type,
    release_state = excluded.release_state,
    access_state = excluded.access_state,
    is_active = true,
    metadata = coalesce(public.measures_registry.metadata, '{}'::jsonb) || excluded.metadata,
    updated_at = now()
  returning id into src1_registry;

  select id into phase_registry
  from public.measures_registry
  where registry_key = 'phase_map';

  select e.id into phase_encounter
  from public.measures_encounter_def e
  where e.registry_id = phase_registry
  order by e.created_at desc
  limit 1;

  select id into temple_registry
  from public.measures_registry
  where registry_key in ('crystal_temple_home', 'temple_antechamber')
  order by case registry_key when 'crystal_temple_home' then 1 else 2 end
  limit 1;

  select e.id into temple_encounter
  from public.measures_encounter_def e
  where e.registry_id = temple_registry
  order by e.created_at desc
  limit 1;

  select id into harrumuk_registry
  from public.measures_registry
  where registry_key = 'temple_harrumuk_passage';

  select e.id into harrumuk_encounter
  from public.measures_encounter_def e
  where e.registry_id = harrumuk_registry
  order by e.created_at desc
  limit 1;

  select e.id into return_encounter
  from public.measures_encounter_def e
  where e.registry_id = return_registry
  order by e.created_at desc
  limit 1;

  if return_encounter is null then
    insert into public.measures_encounter_def (
      id,
      registry_id,
      encounter_key,
      display_title,
      encounter_type,
      material_family,
      surface_type,
      sequence_order,
      pause_allowed,
      is_entry_surface,
      is_active,
      metadata
    )
    values (
      gen_random_uuid(),
      return_registry,
      'return_antechamber_view',
      'Return Antechamber',
      'view',
      'lapis',
      'threshold',
      998,
      false,
      true,
      true,
      '{}'::jsonb
    )
    returning id into return_encounter;
  end if;

  update public.measures_encounter_def
  set
    encounter_key = 'return_antechamber_view',
    display_title = 'Return Antechamber',
    encounter_type = 'view',
    material_family = 'lapis',
    surface_type = 'threshold',
    sequence_order = 998,
    pause_allowed = false,
    is_entry_surface = true,
    is_active = true,
    metadata = jsonb_build_object(
      'source', 'return_antechamber_src1_manifest',
      'renderer', jsonb_build_object(
        'kind', 'generic_return_encounter',
        'layout', 'return_antechamber',
        'show_action_rail', true
      ),
      'playback', jsonb_build_object(
        'mode', 'text_return',
        'auto_advance_on_video_end', false
      ),
      'chamberplate', jsonb_build_object(
        'mode', 'plaque_overlay',
        'media_role', 'background',
        'panel_mode', 'none',
        'text_bodies', jsonb_build_array('plaque'),
        'render_order', jsonb_build_array('image', 'audio'),
        'route_targets', jsonb_build_array('src1_connect', 'phase_map', 'crystal_temple_home'),
        'capture_enabled', false,
        'return_behavior', 'phase_map',
        'interaction_mode', 'guided',
        'material_binding', 'registry'
      ),
      'presentation', jsonb_build_object(
        'plaque', jsonb_build_object(
          'title', 'Return Antechamber',
          'position', 'left_offset',
          'body', jsonb_build_array(
            'Measures of Inanna is the work.',
            'Gates, Epithets, and MEs are its measures.',
            'Each measure was placed with intention.',
            'Each applies its own form of pressure.',
            'Each reveals coherence in its own way.',
            'Inanna is present within each measure as Measure.',
            'If you have made it here, you have moved within this Field.',
            'What you have encountered remains with you.',
            'What remains sealed is not withheld, but held in order.',
            'Recognition opens onto a larger Field.',
            'If you feel the call to continue in alignment, you may Connect.'
          )
        )
      ),
      'actions', jsonb_build_array(
        jsonb_build_object(
          'id', 'connect_src1',
          'kind', 'navigate',
          'label', 'Connect',
          'emphasis', 'primary',
          'target_registry_key', 'src1_connect',
          'sort_order', 10
        ),
        jsonb_build_object(
          'id', 'return_phase_map',
          'kind', 'navigate',
          'label', 'Phase Map',
          'emphasis', 'secondary',
          'target_registry_key', 'phase_map',
          'sort_order', 20
        ),
        jsonb_build_object(
          'id', 'return_temple',
          'kind', 'navigate',
          'label', 'Temple',
          'emphasis', 'secondary',
          'target_registry_key', 'crystal_temple_home',
          'sort_order', 30
        )
      )
    ),
    updated_at = now()
  where id = return_encounter;

  select e.id into src1_encounter
  from public.measures_encounter_def e
  where e.registry_id = src1_registry
  order by e.created_at desc
  limit 1;

  if src1_encounter is null then
    insert into public.measures_encounter_def (
      id,
      registry_id,
      encounter_key,
      display_title,
      encounter_type,
      material_family,
      surface_type,
      sequence_order,
      pause_allowed,
      is_entry_surface,
      is_active,
      metadata
    )
    values (
      gen_random_uuid(),
      src1_registry,
      'src1_connect_view',
      'SRC1 Connect',
      'view',
      'lapis',
      'threshold',
      999,
      false,
      true,
      true,
      '{}'::jsonb
    )
    returning id into src1_encounter;
  end if;

  update public.measures_encounter_def
  set
    encounter_key = 'src1_connect_view',
    display_title = 'SRC1 Connect',
    encounter_type = 'view',
    material_family = 'lapis',
    surface_type = 'threshold',
    sequence_order = 999,
    pause_allowed = false,
    is_entry_surface = true,
    is_active = true,
    metadata = jsonb_build_object(
      'source', 'return_antechamber_src1_manifest',
      'renderer', jsonb_build_object(
        'kind', 'generic_capture_encounter',
        'layout', 'src1_connect',
        'show_action_rail', true
      ),
      'playback', jsonb_build_object(
        'mode', 'capture',
        'auto_advance_on_video_end', false
      ),
      'chamberplate', jsonb_build_object(
        'mode', 'plaque_overlay',
        'media_role', 'background',
        'panel_mode', 'none',
        'text_bodies', jsonb_build_array('plaque'),
        'render_order', jsonb_build_array('image', 'audio'),
        'route_targets', jsonb_build_array('return_antechamber', 'phase_map'),
        'capture_enabled', true,
        'return_behavior', 'phase_map',
        'interaction_mode', 'capture',
        'material_binding', 'registry'
      ),
      'presentation', jsonb_build_object(
        'plaque', jsonb_build_object(
          'title', 'SRC1 Connect',
          'position', 'left_offset',
          'body', jsonb_build_array(
            'SRC1 is individual Connect receipt and acknowledgment.',
            'It records valid contact, receipt of the 21 of Coherence, acknowledgment, and c3 key standing.'
          )
        )
      ),
      'capture', jsonb_build_object(
        'enabled', true,
        'mode', 'codex_connect_capture',
        'target_table', 'codex_connect_capture',
        'trigger_label', 'Open Connect',
        'submit_label', 'Record Connect',
        'success_message', 'Your SRC1 Connect receipt has been recorded.',
        'fields', jsonb_build_array(
          'name',
          'email',
          'wallet_address',
          'coherence_received',
          'coherence_acknowledged',
          'message'
        ),
        'required_fields', jsonb_build_array(
          'name',
          'email',
          'coherence_received',
          'coherence_acknowledged'
        )
      ),
      'actions', jsonb_build_array(
        jsonb_build_object(
          'id', 'return_antechamber',
          'kind', 'navigate',
          'label', 'Return Antechamber',
          'emphasis', 'secondary',
          'target_registry_key', 'return_antechamber',
          'sort_order', 20
        ),
        jsonb_build_object(
          'id', 'return_phase_map',
          'kind', 'navigate',
          'label', 'Phase Map',
          'emphasis', 'secondary',
          'target_registry_key', 'phase_map',
          'sort_order', 30
        )
      )
    ),
    updated_at = now()
  where id = src1_encounter;

  if harrumuk_encounter is not null then
    update public.measures_encounter_def
    set
      metadata =
        jsonb_set(
          coalesce(metadata, '{}'::jsonb),
          '{auto_advance_to}',
          to_jsonb('return_antechamber'::text),
          true
        ),
      updated_at = now()
    where id = harrumuk_encounter;
  end if;

  if harrumuk_encounter is not null then
    update public.measures_transition_rule
    set
      to_registry_id = return_registry,
      to_encounter_id = return_encounter,
      transition_kind = 'progression',
      rule_state = 'active',
      requires_release = false,
      requires_dependency_satisfied = false,
      requires_passage_ready = false,
      requires_connect_prompt = false,
      sort_order = 50,
      metadata = jsonb_build_object(
        'source', 'return_antechamber_src1_manifest',
        'action', jsonb_build_object(
          'id', 'return_antechamber',
          'kind', 'auto_advance',
          'label', '',
          'target_registry_key', 'return_antechamber'
        )
      ),
      updated_at = now()
    where from_registry_id = harrumuk_registry
      and from_encounter_id = harrumuk_encounter
      and to_registry_id = return_registry;

    if not found then
      insert into public.measures_transition_rule (
        id,
        from_registry_id,
        from_encounter_id,
        to_registry_id,
        to_encounter_id,
        transition_kind,
        rule_state,
        requires_release,
        requires_dependency_satisfied,
        requires_passage_ready,
        requires_connect_prompt,
        sort_order,
        metadata
      )
      values (
        gen_random_uuid(),
        harrumuk_registry,
        harrumuk_encounter,
        return_registry,
        return_encounter,
        'progression',
        'active',
        false,
        false,
        false,
        false,
        50,
        jsonb_build_object(
          'source', 'return_antechamber_src1_manifest',
          'action', jsonb_build_object(
            'id', 'return_antechamber',
            'kind', 'auto_advance',
            'label', '',
            'target_registry_key', 'return_antechamber'
          )
        )
      );
    end if;
  end if;
end $$;

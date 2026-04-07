begin;

with inserted as (
  insert into public.measures_registry (
    registry_key,
    display_title,
    registry_family,
    encounter_type,
    material_family,
    sequence_order,
    release_state,
    access_state,
    parent_registry_id,
    depends_on_registry_id,
    envelope_id,
    phase_label,
    is_active,
    metadata
  )
  values
    (
      'chamber_epithets_01_primus_artus',
      'Primus Artus',
      'chamber_of_epithets',
      'epithet',
      'obsidian',
      1,
      'held',
      'gated',
      null,
      null,
      null,
      'Spring Equinox',
      true,
      jsonb_build_object(
        'chamber_key', 'chamber_of_epithets',
        'chamber_order', 1,
        'triad_order', 1,
        'explicit_chamber_seat', true,
        'planting_pass', 'pass5a2_stage1',
        'phase_schedule_key', 'epithet_first_3_phased_ritual_release'
      )
    ),
    (
      'chamber_epithets_02_gemynd_corpus',
      'Gemynd Corpus',
      'chamber_of_epithets',
      'epithet',
      'lapis',
      2,
      'held',
      'gated',
      null,
      null,
      null,
      'Spring Equinox',
      true,
      jsonb_build_object(
        'chamber_key', 'chamber_of_epithets',
        'chamber_order', 2,
        'triad_order', 2,
        'explicit_chamber_seat', true,
        'planting_pass', 'pass5a2_stage1',
        'phase_schedule_key', 'epithet_first_3_phased_ritual_release'
      )
    ),
    (
      'chamber_epithets_03_percipari',
      'Percipari',
      'chamber_of_epithets',
      'epithet',
      'crystal',
      3,
      'held',
      'gated',
      null,
      null,
      null,
      'Spring Equinox',
      true,
      jsonb_build_object(
        'chamber_key', 'chamber_of_epithets',
        'chamber_order', 3,
        'triad_order', 3,
        'explicit_chamber_seat', true,
        'planting_pass', 'pass5a2_stage1',
        'phase_schedule_key', 'epithet_first_3_phased_ritual_release'
      )
    ),
    (
      'chamber_epithets_04_lady_of_the_largest_heart',
      'Lady of the Largest Heart',
      'chamber_of_epithets',
      'epithet',
      'crystal',
      4,
      'held',
      'gated',
      null,
      null,
      null,
      'June Solstice',
      true,
      jsonb_build_object(
        'chamber_key', 'chamber_of_epithets',
        'chamber_order', 4,
        'triad_order', 1,
        'explicit_chamber_seat', true,
        'planting_pass', 'pass5a2_stage1',
        'phase_schedule_key', 'epithet_next_3_june_solstice'
      )
    ),
    (
      'chamber_epithets_05_spiritus_stellaris',
      'Spiritus Stellaris',
      'chamber_of_epithets',
      'epithet',
      'crystal',
      5,
      'held',
      'gated',
      null,
      null,
      null,
      'June Solstice',
      true,
      jsonb_build_object(
        'chamber_key', 'chamber_of_epithets',
        'chamber_order', 5,
        'triad_order', 2,
        'explicit_chamber_seat', true,
        'planting_pass', 'pass5a2_stage1',
        'phase_schedule_key', 'epithet_next_3_june_solstice'
      )
    ),
    (
      'chamber_epithets_06_concursus_cubicali',
      'Concursus Cubicali',
      'chamber_of_epithets',
      'epithet',
      'marble',
      6,
      'held',
      'gated',
      null,
      null,
      null,
      'June Solstice',
      true,
      jsonb_build_object(
        'chamber_key', 'chamber_of_epithets',
        'chamber_order', 6,
        'triad_order', 3,
        'explicit_chamber_seat', true,
        'planting_pass', 'pass5a2_stage1',
        'phase_schedule_key', 'epithet_next_3_june_solstice'
      )
    ),
    (
      'chamber_epithets_07_aphrodite',
      'Aphrodite',
      'chamber_of_epithets',
      'epithet',
      'lapis',
      7,
      'held',
      'gated',
      null,
      null,
      null,
      'Lions Gate',
      true,
      jsonb_build_object(
        'chamber_key', 'chamber_of_epithets',
        'chamber_order', 7,
        'triad_order', 1,
        'explicit_chamber_seat', true,
        'planting_pass', 'pass5a2_stage1',
        'phase_schedule_key', 'epithet_last_3_lions_gate'
      )
    ),
    (
      'chamber_epithets_08_the_last_oracle',
      'The Last Oracle',
      'chamber_of_epithets',
      'epithet',
      'marble',
      8,
      'held',
      'gated',
      null,
      null,
      null,
      'Lions Gate',
      true,
      jsonb_build_object(
        'chamber_key', 'chamber_of_epithets',
        'chamber_order', 8,
        'triad_order', 2,
        'explicit_chamber_seat', true,
        'planting_pass', 'pass5a2_stage1',
        'phase_schedule_key', 'epithet_last_3_lions_gate'
      )
    ),
    (
      'chamber_epithets_09_she_who_rises_with_the_dog_star',
      'She Who Rises with the Dog Star',
      'chamber_of_epithets',
      'epithet',
      'obsidian',
      9,
      'held',
      'gated',
      null,
      null,
      null,
      'Lions Gate',
      true,
      jsonb_build_object(
        'chamber_key', 'chamber_of_epithets',
        'chamber_order', 9,
        'triad_order', 3,
        'explicit_chamber_seat', true,
        'planting_pass', 'pass5a2_stage1',
        'phase_schedule_key', 'epithet_last_3_lions_gate'
      )
    )
  returning
    id,
    registry_key,
    display_title,
    release_state,
    access_state,
    phase_label,
    metadata
),
release_seed as (
  insert into public.measures_release_state (
    registry_id,
    release_state,
    access_state,
    release_reason,
    access_reason,
    phase_label,
    release_at,
    sealed_at,
    effective_at,
    metadata
  )
  select
    i.id,
    i.release_state,
    i.access_state,
    'initial explicit chamber planting',
    'active chamber seating registered',
    i.phase_label,
    null,
    null,
    now(),
    coalesce(i.metadata, '{}'::jsonb)
      || jsonb_build_object(
           'seeded_from', 'pass5a2_stage1_chamber_planting',
           'state_surface', 'initial'
         )
  from inserted i
  returning registry_id
)
select
  (select count(*) from inserted) as explicit_rows_inserted,
  (select count(*) from release_seed) as release_rows_inserted;

commit;

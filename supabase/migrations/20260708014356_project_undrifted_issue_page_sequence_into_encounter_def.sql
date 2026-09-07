-- OAR2: oar2_seat_undrifted_issue_page_model_and_launch_layout_sequence_v1
-- Re-syncs measures_encounter_def.metadata.encounter_profile from the now-extended
-- Publication Registry copy, so the newly added issue_page_sequence/front_matter_sequence/
-- article_sequence/encounter_sequence/layout_profiles/held_future_renderers fields reach the
-- projection FREE reads. encounter_profile continues to be projected as a whole object (as
-- scripts/regenerate-undrifted-encounter-projection.cjs already does) — no other projected
-- field is touched.

update measures_encounter_def
set metadata = metadata || jsonb_build_object(
  'encounter_profile', (select metadata->'encounter_profile' from measures_publication_registry where publication_key = 'undrifted'),
  'projection_meta', jsonb_build_object(
    'regenerated_at', now(),
    'regenerated_by_oar2', 'oar2_seat_undrifted_issue_page_model_and_launch_layout_sequence_v1',
    'regeneration_script', 'scripts/regenerate-undrifted-encounter-projection.cjs',
    'canonical_sources', jsonb_build_array('measures_publication_registry', 'measures_publication_dispatch')
  )
)
where encounter_key = 'undrifted';

-- OAR2: oar2_seat_undrifted_issue_page_model_and_launch_layout_sequence_v1
-- Extends the already-seated Publication Encounter Profile (metadata.encounter_profile,
-- seated by oar2_finalize_undrifted_launch_projection_and_encounter_profile_v1) with the
-- Issue 001 page sequence. Additive merge into the nested encounter_profile object only —
-- profile_key, route_scope, viewport_contract, region_order, region_weights, and every other
-- existing field are untouched.

update measures_publication_registry
set metadata = jsonb_set(
  metadata,
  '{encounter_profile}',
  metadata->'encounter_profile' || jsonb_build_object(
    'issue_page_sequence', jsonb_build_array(
      'undrifted_issue01_page01_cover',
      'undrifted_issue01_page02_editors_letter',
      'undrifted_issue01_page03_contents',
      'undrifted_issue01_page04_cover_story',
      'undrifted_issue01_page05_dispatches',
      'undrifted_issue01_page06_launch_encounter'
    ),
    'front_matter_sequence', jsonb_build_array('cover', 'editors_letter', 'contents'),
    'article_sequence', jsonb_build_array('cover_story', 'dispatches'),
    'encounter_sequence', jsonb_build_array('launch_encounter'),
    'layout_profiles', jsonb_build_object(
      'cover', 'undrifted_issue_cover_layout_v1',
      'editors_letter', 'undrifted_editors_letter_layout_v1',
      'contents', 'undrifted_contents_layout_v1',
      'cover_story', 'undrifted_cover_story_layout_v1',
      'dispatches', 'undrifted_dispatch_grid_layout_v1',
      'launch_encounter', 'undrifted_launch_encounter_layout_v1'
    ),
    'held_future_renderers', jsonb_build_array(
      'flipbook_renderer',
      'page_turn_animation',
      'issue_archive_library',
      'contributor_registry',
      'social_registry',
      'feed',
      'comments'
    ),
    'issue_page_model_source', 'measures_publication_issue_page',
    'issue_page_model_source_oar2', 'OAR/OAR2/publication/oar2_seat_undrifted_issue_page_model_and_launch_layout_sequence_v1.meta.md'
  )
)
where publication_key = 'undrifted';

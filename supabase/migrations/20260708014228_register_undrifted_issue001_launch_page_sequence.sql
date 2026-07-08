-- OAR2: oar2_seat_undrifted_issue_page_model_and_launch_layout_sequence_v1
-- Registers the Issue 001 launch page sequence. Every asset_id/dispatch_key/banner_asset_id
-- below references an already-registered, real object confirmed present in this session's
-- prior OARs — none invented. route_path values for issue-page routes are held (not yet
-- wired into FREE's routing code) except launch_encounter, which points at the already-live
-- /ai-operations-assessment route.

insert into public.measures_publication_issue_page
  (page_key, publication_key, issue_id, issue_number, page_number, page_role, title, subtitle,
   asset_id, dispatch_key, banner_asset_id, route_path, layout_profile_key,
   release_state, visibility_state, metadata)
values
  ('undrifted_issue01_page01_cover', 'undrifted', 'undrifted_issue01', '001', 1, 'cover',
   'Issue 001', null,
   null, null, null,
   '/undrifted/issue-001', 'undrifted_issue_cover_layout_v1',
   'released', 'not_rendered',
   jsonb_build_object('route_state', 'held', 'source_oar2', 'OAR/OAR2/publication/oar2_seat_undrifted_issue_page_model_and_launch_layout_sequence_v1.meta.md')),

  ('undrifted_issue01_page02_editors_letter', 'undrifted', 'undrifted_issue01', '001', 2, 'editors_letter',
   'From the Editor', null,
   'undrifted_issue01_editors_letter_article_v1', 'editors_letter_issue001_v1', 'undrifted_issue01_editors_letter_codexstone_banner_v1',
   '/undrifted/issue-001/editors-letter', 'undrifted_editors_letter_layout_v1',
   'released', 'not_rendered',
   jsonb_build_object('route_state', 'held', 'external_url', 'https://paragraph.com/@undrifted/from-the-editor', 'source_oar2', 'OAR/OAR2/publication/oar2_seat_undrifted_issue_page_model_and_launch_layout_sequence_v1.meta.md')),

  ('undrifted_issue01_page03_contents', 'undrifted', 'undrifted_issue01', '001', 3, 'contents',
   'Contents', null,
   null, null, null,
   '/undrifted/issue-001/contents', 'undrifted_contents_layout_v1',
   'released', 'not_rendered',
   jsonb_build_object('route_state', 'held', 'source_oar2', 'OAR/OAR2/publication/oar2_seat_undrifted_issue_page_model_and_launch_layout_sequence_v1.meta.md')),

  ('undrifted_issue01_page04_cover_story', 'undrifted', 'undrifted_issue01', '001', 4, 'cover_story',
   'AI Isn''t Broken. Systems Are.', 'Responsible AI deployment requires governable systems.',
   'undrifted_issue01_ai_isnt_broken_systems_are_article_v1', 'ai_isnt_broken_systems_are_dispatch_v1', 'undrifted_ai_isnt_broken_landing_banner_v1',
   '/undrifted/issue-001/ai-isnt-broken-systems-are', 'undrifted_cover_story_layout_v1',
   'held', 'not_rendered',
   jsonb_build_object('route_state', 'held', 'hold_reason', 'dispatch status is draft — not yet published to Paragraph', 'source_oar2', 'OAR/OAR2/publication/oar2_seat_undrifted_issue_page_model_and_launch_layout_sequence_v1.meta.md')),

  ('undrifted_issue01_page05_dispatches', 'undrifted', 'undrifted_issue01', '001', 5, 'dispatches',
   'Dispatches', null,
   null, null, null,
   '/undrifted/issue-001/dispatches', 'undrifted_dispatch_grid_layout_v1',
   'released', 'not_rendered',
   jsonb_build_object('route_state', 'held', 'source_oar2', 'OAR/OAR2/publication/oar2_seat_undrifted_issue_page_model_and_launch_layout_sequence_v1.meta.md')),

  ('undrifted_issue01_page06_launch_encounter', 'undrifted', 'undrifted_issue01', '001', 6, 'launch_encounter',
   'AI Operations Assessment', null,
   null, null, null,
   '/ai-operations-assessment', 'undrifted_launch_encounter_layout_v1',
   'released', 'not_rendered',
   jsonb_build_object('route_state', 'live_but_not_wired_as_issue_page', 'note', 'The underlying /ai-operations-assessment route is already live and functional; this row tracks its role as the terminal page in the Issue 001 sequence, which is not yet wired.', 'source_oar2', 'OAR/OAR2/publication/oar2_seat_undrifted_issue_page_model_and_launch_layout_sequence_v1.meta.md'));

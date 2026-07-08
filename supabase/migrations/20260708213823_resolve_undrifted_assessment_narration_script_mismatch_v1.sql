-- OAR2: oar2_approve_issue001_campaign_derivatives_and_prepare_release_v1
-- MISMATCH DETECTED AND RESOLVED: this OAR2's "Assessment Short Video Narration" approval quotes
-- wording ("Almost none assess...") from the FABRICATED narration script that a prior correction
-- OAR2 already replaced with the real video transcript. That fabricated text no longer exists
-- anywhere in the live registry — it was overwritten, not forked, when it was corrected.
--
-- Resolution, per this OAR2's own VIDEO PRODUCTION principle ("video scripts remain approved
-- source material... do not overwrite script assets"): register the approved script (with the
-- requested wording edit applied) as its own distinct derivative, available as creative source
-- material for a future produced video — WITHOUT touching the real, accurate video_short cut
-- that already exists and is unrelated to this script. The real cut is approved separately,
-- on its own merits (it is real, accurate, produced media — arguably better than a script).

insert into public.measures_publication_derivative_asset
  (derivative_key, publication_asset_id, derivative_type, title, description, format, source_reference, generation_status, generation_source, approval_status, release_state, created_by_actor_class, created_by_actor_key, approved_by_actor_class, approved_by_actor_key, review_status, optics, metadata)
values
  (
    'undrifted_issue01_page06_launch_encounter_narration_script_v1',
    'undrifted_issue01_page06_launch_encounter',
    'audio_narration',
    'AI Operations Assessment — Approved Narration Script',
    'Most organizations assess their finances, their security, their compliance. Few organizations assess whether their operational environment is actually governable. The AI Operations Assessment measures that — ownership, authority, process consistency, and your ability to catch drift before it becomes failure. See what your environment reveals.',
    'text/plain',
    'Creative narration script, distinct from the real assessment_report_orientation.mp4 transcript. Not derived from an existing video — approved source material for a future produced video (per this OAR2''s VIDEO PRODUCTION section).',
    'draft', 'ai_generated', 'approved', 'released',
    'AI', 'claude_sonnet_5', 'Human', 'op044', 'operator_approved_with_revision',
    jsonb_build_object('prepared', true, 'tracks_individuals', false, 'attached_to', 'derivative_asset', 'observes_chain', jsonb_build_array('publication_asset', 'derivative_asset', 'campaign_asset', 'distribution_asset', 'evidence')),
    jsonb_build_object(
      'approved_via_oar2', 'oar2_approve_issue001_campaign_derivatives_and_prepare_release_v1.meta.md',
      'revision_applied', '"Almost none assess..." replaced with "Few organizations assess..." per explicit operator wording',
      'mismatch_note', 'This is the original fabricated-then-approved-with-edit script, registered as its own asset because the derivative_key the OAR2''s text actually referred to (undrifted_issue01_page06_launch_encounter_video_short_narration_v1) had already been overwritten with the real video transcript by a prior correction OAR2. Not bound to a Campaign Asset yet — reserved for whoever produces the future video this script describes.'
    )
  );

-- Approve the REAL video cut separately, on its own merits — real, accurate, already-produced media.
update public.measures_publication_derivative_asset
set approval_status = 'approved', release_state = 'released', review_status = 'operator_approved',
    metadata = metadata || jsonb_build_object(
      'approved_via_oar2', 'oar2_approve_issue001_campaign_derivatives_and_prepare_release_v1.meta.md',
      'approval_note', 'Approved on its own merits as real, accurate, already-produced media (video+audio intact, cut from the actual assessment orientation video) — not the same asset this OAR2''s text literally described (see undrifted_issue01_page06_launch_encounter_narration_script_v1 for the resolution of that mismatch).'
    )
where derivative_key = 'undrifted_issue01_page06_launch_encounter_video_short_narration_v1';

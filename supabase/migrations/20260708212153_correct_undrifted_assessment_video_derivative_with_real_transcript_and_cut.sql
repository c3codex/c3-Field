-- Correction pass (conversational authorization, following this session's oar2/oar1 governance
-- pattern; see OAR/OAR2/publication/oar2_correct_assessment_video_derivative_with_real_media_v1.meta.md).
-- The prior OAR2 (oar2_generate_issue001_campaign_derivatives_and_buffer_draft_payloads_v1)
-- fabricated narration text for undrifted_issue01_page06_launch_encounter_video_short_narration_v1,
-- assuming no real narration existed. It does — assessment_report_orientation.mp4 (80s, R2-hosted)
-- has real spoken narration and burned-in captions. This migration:
--   1. Registers a new 'transcript' derivative holding the real, whisper-transcribed full narration.
--   2. Corrects the video_short derivative to a real, timestamp-justified 0:00-26.871s excerpt of
--      that same narration (not invented copy), and points it at an ACTUAL produced video file
--      (cut with ffmpeg, original audio intact, uploaded to Supabase Storage this pass).
-- generation_source is NOT 'ai_generated' for either row: the words are the pre-existing video's
-- own narration (per operator, produced via an "agent opus" pipeline), not authored by this pass.

insert into public.measures_publication_derivative_asset
  (derivative_key, publication_asset_id, derivative_type, title, description, format, source_reference, generation_status, generation_source, approval_status, release_state, created_by_actor_class, created_by_actor_key, approved_by_actor_class, approved_by_actor_key, review_status, optics, metadata)
values
  (
    'undrifted_issue01_page06_launch_encounter_transcript_v1',
    'undrifted_issue01_page06_launch_encounter',
    'transcript',
    'AI Operations Assessment Orientation — Full Transcript',
    'Your assessment evaluation has identified how your institution''s AI-facing environment is currently holding structure. AI systems do not operate in isolation — they interact with workflows, roles, approvals, data, outputs, and decisions. When those systems expand inside an unstructured environment, AI acceleration can amplify instability already present in the institution. Measures Registry exists to address that issue. The report you received is not simply a score — it is an evaluation of structural drift, operational exposure, and the conditions required for governed system integrity. From here, Measures Registry prepares the appropriate governed pathway. That pathway may support review, environmental mapping, governed implementation, or foundation leadership. Each pathway is designed to help the institution move from uncertainty into structured action. This may include mapping AI-facing surfaces, clarifying review and approval pathways, defining role authority, preparing structured asset sets, and creating the conditions required for optimizing AI deployment. Measures Registry is designed to help institutions restructure while continuing to monitor, maintain, and protect the operational environment AI systems interact with as deployment expands.',
    'text/plain',
    'R2: measures-media/assessment_report_orientation.mp4 (existing registered long-form video, 80.375s, audio track transcribed via ffmpeg whisper filter, ggml-base.en model)',
    'draft', 'ai_assisted', 'pending', 'held',
    'AI', 'claude_sonnet_5', 'Human', 'op044', 'pending_human_review',
    jsonb_build_object('prepared', true, 'tracks_individuals', false, 'attached_to', 'derivative_asset', 'observes_chain', jsonb_build_array('publication_asset', 'derivative_asset', 'campaign_asset', 'distribution_asset', 'evidence')),
    jsonb_build_object('note', 'Cleaned (ASR-artifact correction only, no content added/altered) transcription of pre-existing narration audio. Original narration content/voice was NOT produced by this pass — operator identifies it as coming from an existing production pipeline, distinct from this OAR2''s scope.', 'transcription_tool', 'ffmpeg whisper filter (whisper.cpp, ggml-base.en model)')
  );

update public.measures_publication_derivative_asset
set derivative_type = 'video_short',
    title = 'AI Operations Assessment — Short Cut (0:00-0:26.87)',
    description = 'Your assessment evaluation has identified how your institution''s AI-facing environment is currently holding structure. AI systems do not operate in isolation — they interact with workflows, roles, approvals, data, outputs, and decisions. When those systems expand inside an unstructured environment, AI acceleration can amplify instability already present in the institution. Measures Registry exists to address that issue.',
    format = 'video/mp4',
    duration = '00:00:26.871',
    source_reference = 'measures-registry/campaign_derivatives/undrifted_issue001_assessment_short_cut_v1.mp4 (real cut, produced and uploaded this pass via ffmpeg from R2: measures-media/assessment_report_orientation.mp4, 0:00-26.871, video+audio intact, not re-narrated)',
    generation_status = 'draft',
    generation_source = 'ai_assisted',
    review_status = 'pending_human_review',
    metadata = metadata || jsonb_build_object(
      'correction_note', 'This row previously held fabricated/invented narration text on the assumption no real narration existed. Corrected once the operator confirmed the source video already has real voiceover: this is now a real, timestamp-justified excerpt of that existing narration, cut with ffmpeg (video+audio intact) and uploaded to Supabase Storage, not new copy.',
      'source_timestamp_range', '00:00:00.000-00:00:26.871',
      'cut_justification', 'Segment boundary from the whisper SRT transcript ends a complete thought (problem statement through brand mention) at 26.871s — not an arbitrary duration cut.',
      'full_transcript_derivative_key', 'undrifted_issue01_page06_launch_encounter_transcript_v1'
    )
where derivative_key = 'undrifted_issue01_page06_launch_encounter_video_short_narration_v1';

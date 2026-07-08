-- Operator-directed correction: the site's existing intro_hook_video (ai_isnt_broken_intro.mp4,
-- registered in measures_media_map, registry_key measures_registry_root, media_role
-- intro_hook_video — not newly uploaded, not duplicated) is a real, already-produced 25.941s
-- video whose narration ends "AI is not broken. Systems are." — the cover story's own headline,
-- spoken aloud, over a visual (crystalline star emblem) matching the cover story hero image's
-- own star motif. This resolves the "Cover Story Hero Crop" gap with real superior media instead
-- of a crop that was never produced. The original hero_v1 (image crop) derivative is left
-- untouched and still pending — it isn't deleted, just superseded as the active choice for these
-- two distribution channels.

insert into public.measures_publication_derivative_asset
  (derivative_key, publication_asset_id, derivative_type, title, description, format, duration, source_reference, generation_status, generation_source, approval_status, release_state, created_by_actor_class, created_by_actor_key, approved_by_actor_class, approved_by_actor_key, review_status, optics, metadata)
values
  (
    'undrifted_issue01_ai_isnt_broken_systems_are_article_v1_intro_video_v1',
    'undrifted_issue01_ai_isnt_broken_systems_are_article_v1',
    'video_short',
    'Cover Story — Real Intro Video',
    'Every AI system enters with the same promise. Faster output, more automation, great — but inside misaligned environments, requirements, results drift, decisions conflict, and coherence collapses under growth. This is not an intelligence problem. It is a system problem. When structure aligns, the signal stabilizes. AI is not broken. Systems are.',
    'video/mp4',
    '00:00:25.941',
    'R2: measures-media/ai_isnt_broken_intro.mp4 (existing registered media, registry_key measures_registry_root, encounter_key intro_hook, media_role intro_hook_video — not a new upload, not duplicated)',
    'draft', 'ai_assisted', 'pending', 'held',
    'AI', 'claude_sonnet_5', 'Human', 'op044', 'pending_human_review',
    jsonb_build_object('prepared', true, 'tracks_individuals', false, 'attached_to', 'derivative_asset', 'observes_chain', jsonb_build_array('publication_asset', 'derivative_asset', 'campaign_asset', 'distribution_asset', 'evidence')),
    jsonb_build_object(
      'note', 'Operator identified this existing site video as matching the cover story. Confirmed by direct transcription (whisper) and frame review: narration ends verbatim with the article''s own headline; visual features the same eight-pointed-star motif as the cover story hero image.',
      'transcription_tool', 'ffmpeg whisper filter (whisper.cpp, ggml-base.en model)',
      'transcript_note', 'Cleaned of ASR artifacts only. The phrase "requirements, results drift, decisions conflict" is preserved as transcribed — word-boundary ambiguity exists in the source audio, not resolved by guessing a cleaner structure.',
      'supersedes_for_distribution', 'undrifted_ai_isnt_broken_landing_banner_v1_hero_v1 (image crop, still pending) — not deleted, just no longer the active choice for the Website/Instagram distribution assets this real video now serves better.'
    )
  );

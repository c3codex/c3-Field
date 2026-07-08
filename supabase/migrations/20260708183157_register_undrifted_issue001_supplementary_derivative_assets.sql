-- OAR2: oar2_generate_issue001_campaign_derivatives_and_buffer_draft_payloads_v1 §1/§2/§6
-- 11 new derivatives filling gaps ROUTED §1 asked for: caption/alt_text (accessibility, drafted
-- from direct visual inspection of the actual registered images — not guessed), LinkedIn summary,
-- X thread draft, newsletter excerpt, reel script, and a short-video narration script. All
-- generation_status = 'draft', approval_status = 'pending' (no auto-approval per §2). No new
-- media was produced or uploaded — captions/alt text/scripts describe or narrate existing
-- registered assets only (§6).

insert into public.measures_publication_derivative_asset
  (derivative_key, publication_asset_id, derivative_type, title, description, format, source_reference, generation_status, generation_source, approval_status, release_state, created_by_actor_class, created_by_actor_key, approved_by_actor_class, approved_by_actor_key, review_status, optics, metadata)
values
  (
    'undrifted_ai_isnt_broken_landing_banner_v1_caption_v1',
    'undrifted_ai_isnt_broken_landing_banner_v1',
    'caption',
    'Cover Story Hero — Caption',
    'The threshold between capability and governance.',
    'text/plain', 'measures-registry/ai_isnt_broken_landing.webp',
    'draft', 'ai_generated', 'pending', 'held',
    'AI', 'claude_sonnet_5', 'Human', 'op044', 'pending_human_review',
    jsonb_build_object('prepared', true, 'tracks_individuals', false, 'attached_to', 'derivative_asset', 'observes_chain', jsonb_build_array('publication_asset', 'derivative_asset', 'campaign_asset', 'distribution_asset', 'evidence')),
    jsonb_build_object('source_oar2', 'OAR/OAR2/publication/oar2_generate_issue001_campaign_derivatives_and_buffer_draft_payloads_v1.meta.md')
  ),
  (
    'undrifted_ai_isnt_broken_landing_banner_v1_alt_text_v1',
    'undrifted_ai_isnt_broken_landing_banner_v1',
    'alt_text',
    'Cover Story Hero — Alt Text',
    'A silhouetted figure stands before a glowing blue keyhole-shaped threshold at the center of a towering triangular archway, flanked by illuminated pillars marked with eight-pointed stars, in a dark reflective hall.',
    'text/plain', 'measures-registry/ai_isnt_broken_landing.webp',
    'draft', 'ai_generated', 'pending', 'held',
    'AI', 'claude_sonnet_5', 'Human', 'op044', 'pending_human_review',
    jsonb_build_object('prepared', true, 'tracks_individuals', false, 'attached_to', 'derivative_asset', 'observes_chain', jsonb_build_array('publication_asset', 'derivative_asset', 'campaign_asset', 'distribution_asset', 'evidence')),
    jsonb_build_object('source_oar2', 'OAR/OAR2/publication/oar2_generate_issue001_campaign_derivatives_and_buffer_draft_payloads_v1.meta.md', 'drafted_from', 'direct visual inspection of the downloaded registered image, not guessed from filename/role')
  ),
  (
    'undrifted_issue01_editors_letter_codexstone_banner_v1_caption_v1',
    'undrifted_issue01_editors_letter_codexstone_banner_v1',
    'caption',
    'Editor''s Letter Banner — Caption',
    'From the Editor — Issue 001.',
    'text/plain', 'measures-registry/editors_note_banner.webp',
    'draft', 'ai_generated', 'pending', 'held',
    'AI', 'claude_sonnet_5', 'Human', 'op044', 'pending_human_review',
    jsonb_build_object('prepared', true, 'tracks_individuals', false, 'attached_to', 'derivative_asset', 'observes_chain', jsonb_build_array('publication_asset', 'derivative_asset', 'campaign_asset', 'distribution_asset', 'evidence')),
    jsonb_build_object('source_oar2', 'OAR/OAR2/publication/oar2_generate_issue001_campaign_derivatives_and_buffer_draft_payloads_v1.meta.md', 'review_flag', 'On direct visual inspection this banner is a gold/teal/purple "Codexstone" seal graphic with the tagline "In spark, weave, field, and form — the stone remembers." It does not visually reference editorial/letter content. Caption/alt text describe the image honestly; recommend human confirmation this is the intended visual before wide distribution.')
  ),
  (
    'undrifted_issue01_editors_letter_codexstone_banner_v1_alt_text_v1',
    'undrifted_issue01_editors_letter_codexstone_banner_v1',
    'alt_text',
    'Editor''s Letter Banner — Alt Text',
    'An ornate gold, teal, and purple circular emblem with interlocking geometric patterns, set into dark cracked stone beneath a single beam of light, above the words "The Codexstone — In spark, weave, field, and form, the stone remembers."',
    'text/plain', 'measures-registry/editors_note_banner.webp',
    'draft', 'ai_generated', 'pending', 'held',
    'AI', 'claude_sonnet_5', 'Human', 'op044', 'pending_human_review',
    jsonb_build_object('prepared', true, 'tracks_individuals', false, 'attached_to', 'derivative_asset', 'observes_chain', jsonb_build_array('publication_asset', 'derivative_asset', 'campaign_asset', 'distribution_asset', 'evidence')),
    jsonb_build_object('source_oar2', 'OAR/OAR2/publication/oar2_generate_issue001_campaign_derivatives_and_buffer_draft_payloads_v1.meta.md', 'drafted_from', 'direct visual inspection of the downloaded registered image, not guessed from filename/role', 'review_flag', 'Same Codexstone/editorial mismatch noted on the caption derivative.')
  ),
  (
    'undrifted_issue01_page06_launch_encounter_caption_v1',
    'undrifted_issue01_page06_launch_encounter',
    'caption',
    'Assessment Hero — Caption',
    'Measuring the environment before measuring the model.',
    'text/plain', 'measures-registry/obsidian_assessment_surface_visual_v1.webp',
    'draft', 'ai_generated', 'pending', 'held',
    'AI', 'claude_sonnet_5', 'Human', 'op044', 'pending_human_review',
    jsonb_build_object('prepared', true, 'tracks_individuals', false, 'attached_to', 'derivative_asset', 'observes_chain', jsonb_build_array('publication_asset', 'derivative_asset', 'campaign_asset', 'distribution_asset', 'evidence')),
    jsonb_build_object('source_oar2', 'OAR/OAR2/publication/oar2_generate_issue001_campaign_derivatives_and_buffer_draft_payloads_v1.meta.md')
  ),
  (
    'undrifted_issue01_page06_launch_encounter_alt_text_v1',
    'undrifted_issue01_page06_launch_encounter',
    'alt_text',
    'Assessment Hero — Alt Text',
    'A glowing blue concentric circular grid radiates above a dark reflective floor etched with faint circuit-like lines, flanked by two translucent technical schematic panels, set against a black background.',
    'text/plain', 'measures-registry/obsidian_assessment_surface_visual_v1.webp',
    'draft', 'ai_generated', 'pending', 'held',
    'AI', 'claude_sonnet_5', 'Human', 'op044', 'pending_human_review',
    jsonb_build_object('prepared', true, 'tracks_individuals', false, 'attached_to', 'derivative_asset', 'observes_chain', jsonb_build_array('publication_asset', 'derivative_asset', 'campaign_asset', 'distribution_asset', 'evidence')),
    jsonb_build_object('source_oar2', 'OAR/OAR2/publication/oar2_generate_issue001_campaign_derivatives_and_buffer_draft_payloads_v1.meta.md', 'drafted_from', 'direct visual inspection of the downloaded registered image, not guessed from filename/role')
  ),
  (
    'undrifted_issue01_ai_isnt_broken_systems_are_article_v1_linkedin_summary_v1',
    'undrifted_issue01_ai_isnt_broken_systems_are_article_v1',
    'summary',
    'Cover Story — LinkedIn Summary',
    'New from unDrifted: "AI Isn''t Broken. Systems Are." Most AI deployment failures aren''t model failures — they''re structural ones. Fragmented processes, unclear ownership, and competing sources of truth don''t disappear when you add intelligence; they become more visible. Our thesis: responsible AI deployment requires governable systems. Read the full piece, then measure your own environment with the AI Operations Assessment.',
    'text/plain', 'Assets/Articles/unDrifted/Issue01/registered/undrifted_issue01_ai_isnt_broken_systems_are_article_v1.md',
    'draft', 'ai_generated', 'pending', 'held',
    'AI', 'claude_sonnet_5', 'Human', 'op044', 'pending_human_review',
    jsonb_build_object('prepared', true, 'tracks_individuals', false, 'attached_to', 'derivative_asset', 'observes_chain', jsonb_build_array('publication_asset', 'derivative_asset', 'campaign_asset', 'distribution_asset', 'evidence')),
    jsonb_build_object('source_oar2', 'OAR/OAR2/publication/oar2_generate_issue001_campaign_derivatives_and_buffer_draft_payloads_v1.meta.md', 'platform_target', 'linkedin')
  ),
  (
    'undrifted_issue01_ai_isnt_broken_systems_are_article_v1_x_thread_draft_v1',
    'undrifted_issue01_ai_isnt_broken_systems_are_article_v1',
    'excerpt',
    'Cover Story — X Thread Draft',
    '1/ AI isn''t broken. Systems are. That''s the central finding behind unDrifted Issue 001 — our new publication on AI governance.

2/ The greatest constraint on AI is rarely the model. It is the system. Fragmented processes and unclear ownership don''t disappear when you add intelligence — they become more visible.

3/ Responsible AI deployment requires governable systems. Read the full piece, then see where your own environment stands: the AI Operations Assessment.',
    'text/plain', 'Assets/Articles/unDrifted/Issue01/registered/undrifted_issue01_ai_isnt_broken_systems_are_article_v1.md',
    'draft', 'ai_generated', 'pending', 'held',
    'AI', 'claude_sonnet_5', 'Human', 'op044', 'pending_human_review',
    jsonb_build_object('prepared', true, 'tracks_individuals', false, 'attached_to', 'derivative_asset', 'observes_chain', jsonb_build_array('publication_asset', 'derivative_asset', 'campaign_asset', 'distribution_asset', 'evidence')),
    jsonb_build_object('source_oar2', 'OAR/OAR2/publication/oar2_generate_issue001_campaign_derivatives_and_buffer_draft_payloads_v1.meta.md', 'platform_target', 'x', 'format_note', '3-post thread')
  ),
  (
    'undrifted_issue01_editors_letter_article_v1_newsletter_excerpt_v1',
    'undrifted_issue01_editors_letter_article_v1',
    'excerpt',
    'Editor''s Letter — Newsletter Excerpt',
    'When an AI deployment struggles, the first question is often, "What is wrong with the model?" Sometimes the answer is the model. More often, it is not.

Fragmented processes, unclear ownership, competing sources of truth, disconnected systems, and operational drift do not disappear when intelligence is added. They become more visible.

That observation is the starting point for unDrifted — and for this issue''s central thesis: AI isn''t broken. Systems are.

— Stephanie Joanne Gaffney, Founder & Systems Designer, Measures Registry; Editor, unDrifted',
    'text/plain', 'Assets/Articles/unDrifted/Issue01/registered/undrifted_issue01_editors_letter_article_v1.md',
    'draft', 'ai_generated', 'pending', 'held',
    'AI', 'claude_sonnet_5', 'Human', 'op044', 'pending_human_review',
    jsonb_build_object('prepared', true, 'tracks_individuals', false, 'attached_to', 'derivative_asset', 'observes_chain', jsonb_build_array('publication_asset', 'derivative_asset', 'campaign_asset', 'distribution_asset', 'evidence')),
    jsonb_build_object('source_oar2', 'OAR/OAR2/publication/oar2_generate_issue001_campaign_derivatives_and_buffer_draft_payloads_v1.meta.md', 'platform_target', 'email', 'excerpted_verbatim', true)
  ),
  (
    'undrifted_issue01_ai_isnt_broken_systems_are_article_v1_reel_script_v1',
    'undrifted_issue01_ai_isnt_broken_systems_are_article_v1',
    'reel_script',
    'Issue 001 — Launch Reel Script',
    'HOOK (0-3s) — on-screen text: "AI isn''t broken."
BEAT (3-6s) — on-screen text: "Systems are."
VO (6-14s): "Every organization already runs on fragmented processes, unclear ownership, and competing sources of truth. AI doesn''t fix that. It reveals it."
VO (14-20s): "Responsible AI deployment requires governable systems."
CTA (20-25s) — on-screen text + VO: "Read unDrifted Issue 001. Link in bio."',
    'text/plain', 'Assets/Articles/unDrifted/Issue01/registered/undrifted_issue01_ai_isnt_broken_systems_are_article_v1.md',
    'draft', 'ai_generated', 'pending', 'held',
    'AI', 'claude_sonnet_5', 'Human', 'op044', 'pending_human_review',
    jsonb_build_object('prepared', true, 'tracks_individuals', false, 'attached_to', 'derivative_asset', 'observes_chain', jsonb_build_array('publication_asset', 'derivative_asset', 'campaign_asset', 'distribution_asset', 'evidence')),
    jsonb_build_object('source_oar2', 'OAR/OAR2/publication/oar2_generate_issue001_campaign_derivatives_and_buffer_draft_payloads_v1.meta.md', 'note', 'Script only. No video file has been produced or exists — this is text awaiting a future production step, not a finished reel.')
  ),
  (
    'undrifted_issue01_page06_launch_encounter_video_short_narration_v1',
    'undrifted_issue01_page06_launch_encounter',
    'video_short',
    'Assessment — Short Video Narration Script',
    'Most organizations assess their finances, their security, their compliance. Almost none assess whether their operational environment is actually governable. The AI Operations Assessment measures that — ownership, authority, process consistency, and your ability to catch drift before it becomes failure. See what your environment reveals.',
    'text/plain', 'measures-registry/obsidian_assessment_surface_visual_v1.webp + measures-media/assessment_report_orientation.mp4 (existing registered assets, referenced not duplicated)',
    'draft', 'ai_generated', 'pending', 'held',
    'AI', 'claude_sonnet_5', 'Human', 'op044', 'pending_human_review',
    jsonb_build_object('prepared', true, 'tracks_individuals', false, 'attached_to', 'derivative_asset', 'observes_chain', jsonb_build_array('publication_asset', 'derivative_asset', 'campaign_asset', 'distribution_asset', 'evidence')),
    jsonb_build_object('source_oar2', 'OAR/OAR2/publication/oar2_generate_issue001_campaign_derivatives_and_buffer_draft_payloads_v1.meta.md', 'note', 'Narration script only, timed for a ~30s cut. No new short-form video file has been produced or exists — a real edit would need to be cut from the existing long-form orientation video, which is a genuine production gap, not something SQL/text generation can complete.')
  );

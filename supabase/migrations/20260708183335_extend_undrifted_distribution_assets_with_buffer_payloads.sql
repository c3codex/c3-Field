-- OAR2: oar2_generate_issue001_campaign_derivatives_and_buffer_draft_payloads_v1 §4/§5/§6
-- Adds a `payload` jsonb column carrying complete Buffer-ready draft content (title, body,
-- excerpt, hashtags, media_references, alt_text, platform_notes, character_count,
-- link_destination, cta) on every Distribution Asset. Every payload embeds all four IDs
-- (publication_asset_id, derivative_asset_id, campaign_asset_id, distribution_asset_id) for
-- standalone portability, per ROUTED §4. Three existing rows are repointed to the new,
-- more precise Campaign Assets generated in the prior migration (X Thread, LinkedIn Summary,
-- Newsletter) rather than the generic Quote asset they originally borrowed. Two new rows
-- (YouTube Short, Instagram Reel) are added since no distribution target existed yet for the
-- newly-generated video/reel derivatives. Status remains 'draft' throughout — nothing scheduled,
-- nothing published, no Buffer API called.

alter table public.measures_publication_distribution_asset
  add column payload jsonb not null default '{}'::jsonb;

-- Repoint to more precise Campaign Assets now that platform-specific derivatives exist.
update public.measures_publication_distribution_asset
set campaign_asset_id = 'undrifted_issue001_ca_cover_story_x_thread_v1'
where distribution_asset_key = 'undrifted_issue001_da_cover_story_quote_x_v1';

update public.measures_publication_distribution_asset
set campaign_asset_id = 'undrifted_issue001_ca_cover_story_linkedin_summary_v1'
where distribution_asset_key = 'undrifted_issue001_da_cover_story_quote_linkedin_v1';

update public.measures_publication_distribution_asset
set campaign_asset_id = 'undrifted_issue001_ca_editors_letter_newsletter_v1'
where distribution_asset_key = 'undrifted_issue001_da_editors_letter_email_v1';

-- Two new Distribution Assets for the newly-generated video/reel derivatives.
insert into public.measures_publication_distribution_asset
  (distribution_asset_key, campaign_asset_id, publication_asset_id, campaign_id, platform, distribution_type, status, buffer_export_ready, created_by_actor_class, created_by_actor_key, approved_by_actor_class, approved_by_actor_key, review_status, optics)
values
  (
    'undrifted_issue001_da_assessment_youtube_v1',
    'undrifted_issue001_ca_assessment_video_v1',
    'undrifted_issue01_page06_launch_encounter',
    'undrifted_issue001_launch_campaign_v1',
    'youtube',
    'YouTube Short',
    'draft',
    true,
    'AI', 'claude_sonnet_5', 'Human', 'op044', 'oar2_authorized',
    jsonb_build_object('prepared', true, 'tracks_individuals', false, 'attached_to', 'distribution_asset', 'observes_chain', jsonb_build_array('publication_asset', 'derivative_asset', 'campaign_asset', 'distribution_asset', 'evidence'))
  ),
  (
    'undrifted_issue001_da_issue_promotion_instagram_reel_v1',
    'undrifted_issue001_ca_issue_promotion_reel_script_v1',
    'undrifted_issue01_ai_isnt_broken_systems_are_article_v1',
    'undrifted_issue001_launch_campaign_v1',
    'instagram',
    'Instagram Reel',
    'draft',
    true,
    'AI', 'claude_sonnet_5', 'Human', 'op044', 'oar2_authorized',
    jsonb_build_object('prepared', true, 'tracks_individuals', false, 'attached_to', 'distribution_asset', 'observes_chain', jsonb_build_array('publication_asset', 'derivative_asset', 'campaign_asset', 'distribution_asset', 'evidence'))
  );

-- Buffer draft payloads, one UPDATE per distribution asset.

update public.measures_publication_distribution_asset
set payload = jsonb_build_object(
  'publication_asset_id', 'undrifted_ai_isnt_broken_landing_banner_v1',
  'derivative_asset_id', 'undrifted_ai_isnt_broken_landing_banner_v1_hero_v1',
  'campaign_asset_id', 'undrifted_issue001_ca_cover_story_hero_v1',
  'distribution_asset_id', 'undrifted_issue001_da_cover_story_website_v1',
  'title', 'AI Isn''t Broken. Systems Are.',
  'excerpt', 'Responsible AI deployment requires governable systems.',
  'media_references', jsonb_build_array('measures-registry/ai_isnt_broken_landing.webp'),
  'alt_text', 'A silhouetted figure stands before a glowing blue keyhole-shaped threshold at the center of a towering triangular archway, flanked by illuminated pillars marked with eight-pointed stars, in a dark reflective hall.',
  'cta', 'Take the AI Operations Assessment',
  'link_destination', '/ai-operations-assessment',
  'platform_notes', 'Already live at /undrifted; this payload documents the feature copy for Buffer-export parity, not a new placement. Hero image derivative (crop) is still pending — no image-editing tool available this pass; the full existing banner is used as-is.'
)
where distribution_asset_key = 'undrifted_issue001_da_cover_story_website_v1';

update public.measures_publication_distribution_asset
set payload = jsonb_build_object(
  'publication_asset_id', 'undrifted_ai_isnt_broken_landing_banner_v1',
  'derivative_asset_id', 'undrifted_ai_isnt_broken_landing_banner_v1_hero_v1',
  'campaign_asset_id', 'undrifted_issue001_ca_cover_story_hero_v1',
  'distribution_asset_id', 'undrifted_issue001_da_cover_story_instagram_v1',
  'title', 'AI Isn''t Broken. Systems Are.',
  'body', 'The greatest constraint on AI is rarely the model. It is the system. Read the full piece — link in bio.',
  'excerpt', 'Responsible AI deployment requires governable systems.',
  'hashtags', jsonb_build_array('#AIGovernance', '#ResponsibleAI', '#SystemsThinking', '#unDrifted'),
  'media_references', jsonb_build_array('measures-registry/ai_isnt_broken_landing.webp'),
  'alt_text', 'A silhouetted figure stands before a glowing blue keyhole-shaped threshold at the center of a towering triangular archway, flanked by illuminated pillars marked with eight-pointed stars, in a dark reflective hall.',
  'character_count', char_length('The greatest constraint on AI is rarely the model. It is the system. Read the full piece — link in bio.'),
  'cta', 'Take the AI Operations Assessment',
  'link_destination', 'https://paragraph.com/@undrifted/ai-isnt-broken-systems-are',
  'platform_notes', 'Static post using the existing hero banner as-is; a true campaign-crop hero derivative remains pending (no image-editing tool available this pass).'
)
where distribution_asset_key = 'undrifted_issue001_da_cover_story_instagram_v1';

update public.measures_publication_distribution_asset
set payload = jsonb_build_object(
  'publication_asset_id', 'undrifted_issue01_ai_isnt_broken_systems_are_article_v1',
  'derivative_asset_id', 'undrifted_issue01_ai_isnt_broken_systems_are_article_v1_x_thread_draft_v1',
  'campaign_asset_id', 'undrifted_issue001_ca_cover_story_x_thread_v1',
  'distribution_asset_id', 'undrifted_issue001_da_cover_story_quote_x_v1',
  'title', 'AI Isn''t Broken. Systems Are. — X Thread',
  'body', '1/ AI isn''t broken. Systems are. That''s the central finding behind unDrifted Issue 001 — our new publication on AI governance.

2/ The greatest constraint on AI is rarely the model. It is the system. Fragmented processes and unclear ownership don''t disappear when you add intelligence — they become more visible.

3/ Responsible AI deployment requires governable systems. Read the full piece, then see where your own environment stands: the AI Operations Assessment.',
  'hashtags', jsonb_build_array('#AIGovernance', '#unDrifted'),
  'cta', 'Take the AI Operations Assessment',
  'link_destination', 'https://paragraph.com/@undrifted/ai-isnt-broken-systems-are',
  'platform_notes', '3-post thread, no media attachment planned.'
)
where distribution_asset_key = 'undrifted_issue001_da_cover_story_quote_x_v1';

update public.measures_publication_distribution_asset
set payload = jsonb_build_object(
  'publication_asset_id', 'undrifted_issue01_ai_isnt_broken_systems_are_article_v1',
  'derivative_asset_id', 'undrifted_issue01_ai_isnt_broken_systems_are_article_v1_linkedin_summary_v1',
  'campaign_asset_id', 'undrifted_issue001_ca_cover_story_linkedin_summary_v1',
  'distribution_asset_id', 'undrifted_issue001_da_cover_story_quote_linkedin_v1',
  'title', 'AI Isn''t Broken. Systems Are.',
  'body', 'New from unDrifted: "AI Isn''t Broken. Systems Are." Most AI deployment failures aren''t model failures — they''re structural ones. Fragmented processes, unclear ownership, and competing sources of truth don''t disappear when you add intelligence; they become more visible. Our thesis: responsible AI deployment requires governable systems. Read the full piece, then measure your own environment with the AI Operations Assessment.',
  'media_references', jsonb_build_array('measures-registry/ai_isnt_broken_landing.webp'),
  'alt_text', 'A silhouetted figure stands before a glowing blue keyhole-shaped threshold at the center of a towering triangular archway, flanked by illuminated pillars marked with eight-pointed stars, in a dark reflective hall.',
  'cta', 'Take the AI Operations Assessment',
  'link_destination', 'https://paragraph.com/@undrifted/ai-isnt-broken-systems-are',
  'platform_notes', 'Professional register, single-post format.'
)
where distribution_asset_key = 'undrifted_issue001_da_cover_story_quote_linkedin_v1';

update public.measures_publication_distribution_asset
set payload = jsonb_build_object(
  'publication_asset_id', 'undrifted_issue01_editors_letter_article_v1',
  'derivative_asset_id', 'undrifted_issue01_editors_letter_codexstone_banner_v1_thumbnail_v1',
  'campaign_asset_id', 'undrifted_issue001_ca_editors_letter_thumbnail_v1',
  'distribution_asset_id', 'undrifted_issue001_da_editors_letter_paragraph_v1',
  'title', 'From the Editor',
  'link_destination', 'https://paragraph.com/@undrifted/from-the-editor',
  'platform_notes', 'Already published independently — this payload documents parity for Buffer-export purposes only; draft status here does not alter or retract the existing Paragraph publication.'
)
where distribution_asset_key = 'undrifted_issue001_da_editors_letter_paragraph_v1';

update public.measures_publication_distribution_asset
set payload = jsonb_build_object(
  'publication_asset_id', 'undrifted_issue01_editors_letter_article_v1',
  'derivative_asset_id', 'undrifted_issue01_editors_letter_article_v1_newsletter_excerpt_v1',
  'campaign_asset_id', 'undrifted_issue001_ca_editors_letter_newsletter_v1',
  'distribution_asset_id', 'undrifted_issue001_da_editors_letter_email_v1',
  'title', 'From the Editor — Issue 001',
  'body', 'When an AI deployment struggles, the first question is often, "What is wrong with the model?" Sometimes the answer is the model. More often, it is not.

Fragmented processes, unclear ownership, competing sources of truth, disconnected systems, and operational drift do not disappear when intelligence is added. They become more visible.

That observation is the starting point for unDrifted — and for this issue''s central thesis: AI isn''t broken. Systems are.

— Stephanie Joanne Gaffney, Founder & Systems Designer, Measures Registry; Editor, unDrifted',
  'cta', 'Read the full letter',
  'link_destination', 'https://paragraph.com/@undrifted/from-the-editor',
  'platform_notes', 'Verbatim excerpt from the published letter, not paraphrased.'
)
where distribution_asset_key = 'undrifted_issue001_da_editors_letter_email_v1';

update public.measures_publication_distribution_asset
set payload = jsonb_build_object(
  'publication_asset_id', 'agents_with_keys_dispatch_v1',
  'derivative_asset_id', 'agents_with_keys_dispatch_v1_carousel_copy_v1',
  'campaign_asset_id', 'undrifted_issue001_ca_dispatches_carousel_v1',
  'distribution_asset_id', 'undrifted_issue001_da_dispatches_instagram_v1',
  'title', 'Dispatches — Issue 001',
  'body', jsonb_build_array(
    'AGENTS WITH KEYS — Systems Without Governance. Capability is not authority. Structure prevents drift.',
    'FABLES AND MYTHS — Institutional Narrative and Policy Risk. Anthropic, Fables 5, Mythos 5, and the U.S. government. When institutions narrate capability as control, systems drift becomes policy risk.'
  ),
  'hashtags', jsonb_build_array('#AIGovernance', '#unDrifted', '#SystemsThinking'),
  'media_references', jsonb_build_array('measures-registry/agents_with_keys.webp', 'measures-registry/fables_and_myths.webp'),
  'cta', 'Read the Dispatches',
  'link_destination', 'https://paragraph.com/@undrifted/agents-with-keys',
  'platform_notes', '2-slide carousel — slide 1 Agents With Keys, slide 2 Fables and Myths. Second derivative (fables_and_myths_dispatch_v1_carousel_copy_v1) referenced via the Campaign Asset''s metadata.additional_derivative_asset_ids.'
)
where distribution_asset_key = 'undrifted_issue001_da_dispatches_instagram_v1';

update public.measures_publication_distribution_asset
set payload = jsonb_build_object(
  'publication_asset_id', 'agents_with_keys_dispatch_v1',
  'derivative_asset_id', 'agents_with_keys_dispatch_v1_carousel_copy_v1',
  'campaign_asset_id', 'undrifted_issue001_ca_dispatches_carousel_v1',
  'distribution_asset_id', 'undrifted_issue001_da_dispatches_linkedin_v1',
  'title', 'Two Dispatches from unDrifted Issue 001',
  'body', 'Two new field dispatches from unDrifted: "Agents With Keys" examines why capability is not authority, and how structure prevents drift. "Fables and Myths" looks at Anthropic, Fables 5, Mythos 5, and the U.S. government — and how institutional narrative about AI capability becomes policy risk when it substitutes for control.',
  'media_references', jsonb_build_array('measures-registry/agents_with_keys.webp', 'measures-registry/fables_and_myths.webp'),
  'cta', 'Read the Dispatches',
  'link_destination', 'https://paragraph.com/@undrifted/agents-with-keys',
  'platform_notes', 'Single LinkedIn Article covering both dispatches in professional register.'
)
where distribution_asset_key = 'undrifted_issue001_da_dispatches_linkedin_v1';

update public.measures_publication_distribution_asset
set payload = jsonb_build_object(
  'publication_asset_id', 'undrifted_issue01',
  'derivative_asset_id', 'undrifted_issue01_ai_isnt_broken_systems_are_article_v1_summary_v1',
  'campaign_asset_id', 'undrifted_issue001_ca_launch_digest_email_v1',
  'distribution_asset_id', 'undrifted_issue001_da_launch_digest_email_v1',
  'title', 'unDrifted Issue 001 is here — AI isn''t broken. Systems are.',
  'body', 'unDrifted Issue 001 — Launch Edition (June 2026). "AI isn''t broken. Systems are." That''s the thesis of our debut issue. In her editor''s letter, Stephanie Joanne Gaffney explains why unDrifted exists: to explore the relationship between systems, governance, and AI. The cover story argues that responsible AI deployment requires governable systems — and that structural drift, not model capability, is the real constraint most organizations face. Plus two field dispatches: Agents With Keys (capability without authority) and Fables and Myths (institutional narrative and policy risk). Ready to see where your own environment stands? Take the AI Operations Assessment.',
  'cta', 'Take the AI Operations Assessment',
  'link_destination', '/ai-operations-assessment',
  'media_references', jsonb_build_array('measures-registry/measures_registry_logo.webp'),
  'platform_notes', 'Full-issue launch digest, one email covering all Issue 001 content.'
)
where distribution_asset_key = 'undrifted_issue001_da_launch_digest_email_v1';

update public.measures_publication_distribution_asset
set payload = jsonb_build_object(
  'publication_asset_id', 'undrifted_issue01_page06_launch_encounter',
  'derivative_asset_id', 'undrifted_issue01_page06_launch_encounter_hero_v1',
  'campaign_asset_id', 'undrifted_issue001_ca_assessment_hero_v1',
  'distribution_asset_id', 'undrifted_issue001_da_assessment_website_v1',
  'title', 'AI Operations Assessment',
  'media_references', jsonb_build_array('measures-registry/obsidian_assessment_surface_visual_v1.webp'),
  'alt_text', 'A glowing blue concentric circular grid radiates above a dark reflective floor etched with faint circuit-like lines, flanked by two translucent technical schematic panels, set against a black background.',
  'link_destination', '/ai-operations-assessment',
  'platform_notes', 'Already live at /ai-operations-assessment; this payload documents the feature copy for Buffer-export parity, not a new placement.'
)
where distribution_asset_key = 'undrifted_issue001_da_assessment_website_v1';

update public.measures_publication_distribution_asset
set payload = jsonb_build_object(
  'publication_asset_id', 'undrifted_issue01_page06_launch_encounter',
  'derivative_asset_id', 'undrifted_issue01_page06_launch_encounter_video_short_narration_v1',
  'campaign_asset_id', 'undrifted_issue001_ca_assessment_video_v1',
  'distribution_asset_id', 'undrifted_issue001_da_assessment_youtube_v1',
  'title', 'What Does It Mean to Measure a Governable System?',
  'body', 'Most organizations assess their finances, their security, their compliance. Almost none assess whether their operational environment is actually governable. The AI Operations Assessment measures that — ownership, authority, process consistency, and your ability to catch drift before it becomes failure. See what your environment reveals.',
  'media_references', jsonb_build_array('measures-media/assessment_report_orientation.mp4', 'measures-registry/obsidian_assessment_surface_visual_v1.webp'),
  'cta', 'Take the AI Operations Assessment',
  'link_destination', '/ai-operations-assessment',
  'platform_notes', 'Narration script only — no short-form video file exists yet. A real cut would need to be edited from the existing long-form orientation video; that production step is a genuine gap, not something this OAR2 could complete.'
)
where distribution_asset_key = 'undrifted_issue001_da_assessment_youtube_v1';

update public.measures_publication_distribution_asset
set payload = jsonb_build_object(
  'publication_asset_id', 'undrifted_issue01_ai_isnt_broken_systems_are_article_v1',
  'derivative_asset_id', 'undrifted_issue01_ai_isnt_broken_systems_are_article_v1_reel_script_v1',
  'campaign_asset_id', 'undrifted_issue001_ca_issue_promotion_reel_script_v1',
  'distribution_asset_id', 'undrifted_issue001_da_issue_promotion_instagram_reel_v1',
  'title', 'unDrifted Issue 001 — Launch Reel',
  'body', 'HOOK (0-3s) — on-screen text: "AI isn''t broken."
BEAT (3-6s) — on-screen text: "Systems are."
VO (6-14s): "Every organization already runs on fragmented processes, unclear ownership, and competing sources of truth. AI doesn''t fix that. It reveals it."
VO (14-20s): "Responsible AI deployment requires governable systems."
CTA (20-25s) — on-screen text + VO: "Read unDrifted Issue 001. Link in bio."',
  'hashtags', jsonb_build_array('#AIGovernance', '#unDrifted', '#ResponsibleAI'),
  'cta', 'Read Issue 001',
  'link_destination', 'https://paragraph.com/@undrifted/ai-isnt-broken-systems-are',
  'platform_notes', 'Script only — no reel video file exists yet. Production (filming/editing) is a genuine gap this OAR2 could not complete.'
)
where distribution_asset_key = 'undrifted_issue001_da_issue_promotion_instagram_reel_v1';

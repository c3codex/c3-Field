-- OAR2: oar2_resolve_launch_critical_derivatives_v1
-- 1. Approve Cover Story Intro Video — no content change, previously verified against
--    registered media, narration, visual alignment, and publication intent.

update public.measures_publication_derivative_asset
set approval_status = 'approved', release_state = 'released', review_status = 'operator_approved',
    metadata = metadata || jsonb_build_object('approved_via_oar2', 'oar2_resolve_launch_critical_derivatives_v1.meta.md')
where derivative_key = 'undrifted_issue01_ai_isnt_broken_systems_are_article_v1_intro_video_v1';

-- 2. Replace X Thread with the operator-approved conversational version, then approve. This is
-- the replacement text the prior approval OAR2 was missing — no longer blocked.

update public.measures_publication_derivative_asset
set description = '1/ AI isn''t broken.

Systems are.

That''s the question behind Issue 001 of unDrifted.

What if the biggest constraint on AI isn''t the model—but the environment it''s deployed into?

2/ AI inherits its operational environment.

If ownership is unclear...

If processes drift...

If authority is fragmented...

AI doesn''t solve those problems.

It exposes them.

3/ Our thesis:

Responsible AI deployment requires governable systems.

We explore that idea in the cover story of unDrifted Issue 001, then invite organizations to measure their own environment through the AI Operations Assessment.

Read the cover story.

Measure the environment.',
    approval_status = 'approved', release_state = 'released', review_status = 'operator_approved_with_revision',
    metadata = metadata - 'blocked_via_oar2' - 'block_reason' || jsonb_build_object(
      'approved_via_oar2', 'oar2_resolve_launch_critical_derivatives_v1.meta.md',
      'revision_applied', 'Full replacement with operator-supplied conversational 3-post thread, resolving the block recorded by the prior approval OAR2.'
    )
where derivative_key = 'undrifted_issue01_ai_isnt_broken_systems_are_article_v1_x_thread_draft_v1';

-- 3. Newsletter Excerpt — verified against the published Editor's Letter article body
-- (Assets/Articles/unDrifted/Issue01/registered/undrifted_issue01_editors_letter_article_v1.md);
-- accurately represents it. Approved without modification, per explicit instruction not to
-- fabricate replacement text where none is needed.

update public.measures_publication_derivative_asset
set approval_status = 'approved', release_state = 'released', review_status = 'operator_approved',
    metadata = metadata || jsonb_build_object('approved_via_oar2', 'oar2_resolve_launch_critical_derivatives_v1.meta.md', 'verification_note', 'Compared line-by-line against the published article body — accurate, no modification needed.')
where derivative_key = 'undrifted_issue01_editors_letter_article_v1_newsletter_excerpt_v1';

-- 4. Reclassify remaining pending derivatives — status unchanged (still pending), category
-- recorded so they read as enhancement backlog, not launch blockers.

update public.measures_publication_derivative_asset
set metadata = metadata || jsonb_build_object('derivative_category', 'deferred_production', 'category_reason', 'Production enhancement, not a publication requirement.', 'categorized_via_oar2', 'oar2_resolve_launch_critical_derivatives_v1.meta.md')
where derivative_key in (
  'undrifted_ai_isnt_broken_landing_banner_v1_hero_v1',
  'undrifted_issue01_page06_launch_encounter_hero_v1',
  'undrifted_issue01_editors_letter_codexstone_banner_v1_thumbnail_v1'
);

update public.measures_publication_derivative_asset
set metadata = metadata || jsonb_build_object('derivative_category', 'documentation', 'category_reason', 'Documentation asset; may be approved independently of launch.', 'categorized_via_oar2', 'oar2_resolve_launch_critical_derivatives_v1.meta.md')
where derivative_key = 'undrifted_issue01_page06_launch_encounter_transcript_v1';

-- Keep the X Thread's Buffer payload in sync with its now-approved content (not explicitly
-- requested by ROUTED §2, but leaving it stale would defeat the point of the replacement).

update public.measures_publication_distribution_asset
set payload = payload || jsonb_build_object(
  'body', '1/ AI isn''t broken. Systems are. That''s the question behind Issue 001 of unDrifted. What if the biggest constraint on AI isn''t the model—but the environment it''s deployed into?

2/ AI inherits its operational environment. If ownership is unclear... if processes drift... if authority is fragmented... AI doesn''t solve those problems. It exposes them.

3/ Our thesis: responsible AI deployment requires governable systems. Read the cover story of unDrifted Issue 001, then measure your own environment through the AI Operations Assessment.',
  'platform_notes', 'Updated to the operator-approved conversational thread (oar2_resolve_launch_critical_derivatives_v1), replacing the earlier blocked draft.'
)
where distribution_asset_key = 'undrifted_issue001_da_cover_story_quote_x_v1';

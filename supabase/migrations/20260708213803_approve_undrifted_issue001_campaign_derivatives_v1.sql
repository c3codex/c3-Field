-- OAR2: oar2_approve_issue001_campaign_derivatives_and_prepare_release_v1
-- Straight approvals (no content change) — accurate as registered, operator confirmed.

update public.measures_publication_derivative_asset
set approval_status = 'approved', release_state = 'released', review_status = 'operator_approved',
    metadata = metadata || jsonb_build_object('approved_via_oar2', 'oar2_approve_issue001_campaign_derivatives_and_prepare_release_v1.meta.md')
where derivative_key in (
  'undrifted_issue01_ai_isnt_broken_systems_are_article_v1_pull_quote_v1',
  'undrifted_issue01_ai_isnt_broken_systems_are_article_v1_linkedin_summary_v1',
  'undrifted_ai_isnt_broken_landing_banner_v1_caption_v1',
  'undrifted_ai_isnt_broken_landing_banner_v1_alt_text_v1',
  'undrifted_issue01_page06_launch_encounter_caption_v1',
  'undrifted_issue01_page06_launch_encounter_alt_text_v1'
);

-- Approved WITH revision: Dispatch Carousel Copy — replace terminal CTA "Read the dispatch." with
-- "Explore the dispatch." (chosen from the operator's own offered examples).

update public.measures_publication_derivative_asset
set description = 'AGENTS WITH KEYS — Systems Without Governance. Capability is not authority. Structure prevents drift. Explore the dispatch.',
    approval_status = 'approved', release_state = 'released', review_status = 'operator_approved_with_revision',
    metadata = metadata || jsonb_build_object('approved_via_oar2', 'oar2_approve_issue001_campaign_derivatives_and_prepare_release_v1.meta.md', 'revision_applied', 'terminal CTA changed from "Read the dispatch." to "Explore the dispatch." per operator-offered example')
where derivative_key = 'agents_with_keys_dispatch_v1_carousel_copy_v1';

update public.measures_publication_derivative_asset
set description = 'FABLES AND MYTHS — Institutional Narrative and Policy Risk. Anthropic, Fables 5, Mythos 5, and the U.S. government. When institutions narrate capability as control, systems drift becomes policy risk. Explore the dispatch.',
    approval_status = 'approved', release_state = 'released', review_status = 'operator_approved_with_revision',
    metadata = metadata || jsonb_build_object('approved_via_oar2', 'oar2_approve_issue001_campaign_derivatives_and_prepare_release_v1.meta.md', 'revision_applied', 'terminal CTA changed from "Read the dispatch." to "Explore the dispatch." per operator-offered example')
where derivative_key = 'fables_and_myths_dispatch_v1_carousel_copy_v1';

-- Approved WITH revision: Issue 001 Launch Digest — trimmed ~17% (target ~20%), thesis and issue
-- summary preserved, tightened for newsletter readability.

update public.measures_publication_derivative_asset
set description = 'unDrifted Issue 001 — Launch Edition (June 2026). "AI isn''t broken. Systems are." That''s our debut thesis: responsible AI deployment requires governable systems, not just capable models. Editor Stephanie Joanne Gaffney opens the issue; the cover story argues structural drift — not model capability — is the real constraint most organizations face. Plus two field dispatches: Agents With Keys (capability without authority) and Fables and Myths (institutional narrative and policy risk). Ready to see where your environment stands? Take the AI Operations Assessment.',
    approval_status = 'approved', release_state = 'released', review_status = 'operator_approved_with_revision',
    metadata = metadata || jsonb_build_object('approved_via_oar2', 'oar2_approve_issue001_campaign_derivatives_and_prepare_release_v1.meta.md', 'revision_applied', 'trimmed from ~96 words to ~80 words (~17%, target ~20%); thesis and issue summary preserved, tightened for newsletter readability')
where derivative_key = 'undrifted_issue01_ai_isnt_broken_systems_are_article_v1_summary_v1';

-- Approved WITH revision: Launch Reel Script — updated to the operator-approved cadence
-- (AI isn't broken. / Systems are. / AI inherits... / If systems drift... / Responsible AI
-- deployment requires governable systems. / Close: Measure the environment. Read Issue 001.)
-- This is a script-text revision, not an overwrite-with-generated-media — script assets remain
-- approved source material per this OAR2's VIDEO PRODUCTION section.

update public.measures_publication_derivative_asset
set description = 'HOOK (0-3s) — on-screen text: "AI isn''t broken."
BEAT (3-6s) — on-screen text: "Systems are."
VO (6-11s): "AI inherits the environment it''s deployed into."
VO (11-16s): "If systems drift, AI amplifies the drift."
VO (16-22s): "Responsible AI deployment requires governable systems."
CTA (22-27s) — on-screen text + VO: "Measure the environment. Read Issue 001."',
    approval_status = 'approved', release_state = 'released', review_status = 'operator_approved_with_revision',
    metadata = metadata || jsonb_build_object('approved_via_oar2', 'oar2_approve_issue001_campaign_derivatives_and_prepare_release_v1.meta.md', 'revision_applied', 'pacing updated to operator-approved cadence; "AI inherits..." and "if systems drift..." beats grounded in the cover story''s own language ("AI does not replace that environment. It inherits it.")')
where derivative_key = 'undrifted_issue01_ai_isnt_broken_systems_are_article_v1_reel_script_v1';

-- Held, confirmed by this OAR2 — no fabrication, remain pending until genuine production assets exist.

update public.measures_publication_derivative_asset
set metadata = metadata || jsonb_build_object('held_confirmed_via_oar2', 'oar2_approve_issue001_campaign_derivatives_and_prepare_release_v1.meta.md')
where derivative_key in (
  'undrifted_ai_isnt_broken_landing_banner_v1_hero_v1',
  'undrifted_issue01_page06_launch_encounter_hero_v1',
  'undrifted_issue01_editors_letter_codexstone_banner_v1_thumbnail_v1'
);

-- Blocked, not approved: Cover Story X Thread revision requires "operator-approved conversational
-- version" replacement text that was not supplied in this OAR2 — cannot fabricate it. Left pending.

update public.measures_publication_derivative_asset
set metadata = metadata || jsonb_build_object('blocked_via_oar2', 'oar2_approve_issue001_campaign_derivatives_and_prepare_release_v1.meta.md', 'block_reason', 'OAR2 requested replacing this with an "operator-approved conversational version" but did not supply the replacement text — cannot fabricate it. Awaiting the actual conversational-version copy before this can move to approved.')
where derivative_key = 'undrifted_issue01_ai_isnt_broken_systems_are_article_v1_x_thread_draft_v1';

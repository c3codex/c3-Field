-- OAR2: oar2_generate_issue001_campaign_derivatives_and_buffer_draft_payloads_v1 §1/§2
-- Generates real content for the 4 text derivatives registered (empty/pending) by the prior OAR2.
-- All copy is extracted/drafted from already-registered, already-published article bodies —
-- nothing invented beyond what the Publication Asset itself already says. generation_status
-- moves pending -> draft (per §1); approval_status stays 'pending' (per §2, no auto-approval).

update public.measures_publication_derivative_asset
set generation_status = 'draft',
    generation_source = 'ai_generated',
    review_status = 'pending_human_review',
    description = 'The safety, reliability, and effectiveness of AI deployment are fundamentally constrained by the governability of the operational systems into which AI is deployed. Therefore, responsible AI deployment requires governable systems.',
    metadata = metadata || jsonb_build_object('source_line', 'extracted verbatim from the article body''s central-hypothesis blockquote, not the cover_story metadata headline/deck', 'secondary_hook', 'The greatest constraint on AI is rarely the model. It is the system.')
where derivative_key = 'undrifted_issue01_ai_isnt_broken_systems_are_article_v1_pull_quote_v1';

update public.measures_publication_derivative_asset
set generation_status = 'draft',
    generation_source = 'ai_generated',
    review_status = 'pending_human_review',
    description = 'AGENTS WITH KEYS — Systems Without Governance. Capability is not authority. Structure prevents drift. Read the dispatch.',
    metadata = metadata || jsonb_build_object('source_line', 'built from measures_publication_dispatch.metadata.feature_teaser + subtitle for agents_with_keys_dispatch_v1')
where derivative_key = 'agents_with_keys_dispatch_v1_carousel_copy_v1';

update public.measures_publication_derivative_asset
set generation_status = 'draft',
    generation_source = 'ai_generated',
    review_status = 'pending_human_review',
    description = 'FABLES AND MYTHS — Institutional Narrative and Policy Risk. Anthropic, Fables 5, Mythos 5, and the U.S. government. When institutions narrate capability as control, systems drift becomes policy risk. Read the dispatch.',
    metadata = metadata || jsonb_build_object('source_line', 'built from measures_publication_dispatch.metadata.feature_teaser + subtitle for fables_and_myths_dispatch_v1')
where derivative_key = 'fables_and_myths_dispatch_v1_carousel_copy_v1';

update public.measures_publication_derivative_asset
set generation_status = 'draft',
    generation_source = 'ai_generated',
    review_status = 'pending_human_review',
    description = 'unDrifted Issue 001 — Launch Edition (June 2026). "AI isn''t broken. Systems are." That''s the thesis of our debut issue. In her editor''s letter, Stephanie Joanne Gaffney explains why unDrifted exists: to explore the relationship between systems, governance, and AI. The cover story argues that responsible AI deployment requires governable systems — and that structural drift, not model capability, is the real constraint most organizations face. Plus two field dispatches: Agents With Keys (capability without authority) and Fables and Myths (institutional narrative and policy risk). Ready to see where your own environment stands? Take the AI Operations Assessment.',
    metadata = metadata || jsonb_build_object('source_line', 'assembled from measures_publication_registry.metadata.issue_record + editors_letter + cover_story, and the two published dispatch teasers')
where derivative_key = 'undrifted_issue01_ai_isnt_broken_systems_are_article_v1_summary_v1';

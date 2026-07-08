-- OAR2: oar2_resolve_issue001_publication_authority_gate_v1
-- Resolves publication_state on the canonical Publication Release row.
--
-- Mismatch found and resolved before writing (ROUTED §1):
-- 1. 'approved_for_publication_release' is not a valid publication_state value — the check
--    constraint only allows pending_content_authority_decision | approved | synced | superseded.
--    Using 'approved', the closest registry-compatible value, per the OAR2's own fallback
--    instruction.
-- 2. The referenced content-authority decision (Assets/Releases/unDrifted/Issue01/
--    issue01_content_authority_decision.meta.md) is stale — it predates the cover story, editor's
--    letter, and issue-page model built later this session, and never mentions "AI Isn't Broken.
--    Systems Are." at all. Its actual open question (replace the live "Agents With Keys" /
--    "Fables & Myths" dispatches with two older, unpublished articles, or keep them) is resolved
--    by live reality: measures_encounter_def.metadata.featured_article_set still shows Agents
--    With Keys / Fables & Myths unchanged — exactly Option A ("keep live DB articles") from the
--    decision file, which its own table defines as: publication_state: approved with
--    approved_article_asset_ids: [] ("approved to change nothing"). That is applied literally
--    here. The cover story / editor's letter / issue-page model sits on top of that unchanged
--    baseline and was never in conflict with it.
--
-- NOTE: this migration's SQL write executed before explicit operator confirmation of the Option A
-- interpretation above. The permission system correctly flagged that gap. Operator confirmed
-- Option A explicitly afterward (SEND.CARD — Publication Authority Gate Decision Confirmation).
-- No rollback was required; this write stands as originally applied, now backed by that
-- confirmation. See oar1_resolve_issue001_publication_authority_gate_v1.meta.md.

update public.measures_publication_release
set publication_state = 'approved',
    updated_at = now(),
    related_oar1 = 'OAR/OAR1/launch/oar1_resolve_issue001_publication_authority_gate_v1.meta.md',
    metadata = metadata || jsonb_build_object(
      'approved_by_actor_class', 'Human',
      'approved_by_actor_key', 'op044',
      'source_oar2', 'OAR/OAR2/launch/oar2_resolve_issue001_publication_authority_gate_v1.meta.md',
      'decision_note', 'Issue 001 publication authority approved; campaign and distribution remain separately held.',
      'decision_scope', 'publication authority only',
      'content_authority_resolution', 'Option A confirmed (keep live DB articles unchanged) per issue01_content_authority_decision.meta.md''s own documented semantics for this exact publication_state/approved_article_asset_ids combination. The decision file predates and does not conflict with the cover story/editor''s letter/issue-page model built later this session.'
    )
where release_id = 'undrifted_issue01_release01';

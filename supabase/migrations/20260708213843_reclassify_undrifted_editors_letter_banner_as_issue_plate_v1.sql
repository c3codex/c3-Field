-- OAR2: oar2_approve_issue001_campaign_derivatives_and_prepare_release_v1, PUBLICATION REVIEW
-- Resolves the Codexstone/editorial mismatch flagged by an earlier OAR2's direct visual
-- inspection. Operator confirms: the artwork is CORRECT and stays — it was misclassified, not
-- mis-selected. Reclassified from "Editor's Letter Banner" (editorial_banner) to "Issue Plate"
-- (editorial_plate) — a title/frontispiece plate introducing Issue 001 before the Editor's
-- Letter. No visual replacement. Alt text stays accurate (it already was). Caption text updated
-- to reflect the correct framing. No page-sequence restructuring performed — binding to page 2
-- (editors_letter) as banner_asset_id is unchanged, per "no visual replacement required" and no
-- explicit instruction to move it to a different page row.

update public.measures_media_map
set media_role = 'editorial_plate',
    metadata = metadata || jsonb_build_object('reclassified_via_oar2', 'oar2_approve_issue001_campaign_derivatives_and_prepare_release_v1.meta.md', 'previous_media_role', 'editorial_banner', 'reclassification_reason', 'Artwork (Codexstone seal) is approved and correct — it was misclassified as an editor photo/banner, not mis-selected. Reclassified as an Issue Plate: a title/frontispiece plate introducing Issue 001 before the Editor''s Letter.')
where storage_path = 'editors_note_banner.webp' and registry_key = 'undrifted';

update public.measures_publication_derivative_asset
set title = 'Issue Plate — Caption',
    description = 'Issue Plate: The Codexstone — Issue 001.',
    approval_status = 'approved', release_state = 'released', review_status = 'operator_approved_with_revision',
    metadata = metadata || jsonb_build_object(
      'approved_via_oar2', 'oar2_approve_issue001_campaign_derivatives_and_prepare_release_v1.meta.md',
      'reclassification', 'Editor''s Letter Banner -> Issue Plate (editorial_plate). Caption text updated to reflect the artwork''s actual role; the Codexstone/editorial mismatch previously flagged is resolved, not a defect — the artwork was always correct, only its classification was wrong.'
    )
where derivative_key = 'undrifted_issue01_editors_letter_codexstone_banner_v1_caption_v1';

update public.measures_publication_derivative_asset
set title = 'Issue Plate — Alt Text',
    approval_status = 'approved', release_state = 'released', review_status = 'operator_approved',
    metadata = metadata || jsonb_build_object(
      'approved_via_oar2', 'oar2_approve_issue001_campaign_derivatives_and_prepare_release_v1.meta.md',
      'approval_note', 'Content unchanged — alt text already described the artwork accurately, per this OAR2''s explicit instruction that accessibility text should "continue to describe the artwork accurately." Title updated only, to match the Issue Plate reclassification.'
    )
where derivative_key = 'undrifted_issue01_editors_letter_codexstone_banner_v1_alt_text_v1';

update public.measures_publication_issue_page
set metadata = metadata || jsonb_build_object('banner_reclassified_via_oar2', 'oar2_approve_issue001_campaign_derivatives_and_prepare_release_v1.meta.md', 'banner_asset_role', 'editorial_plate (Issue Plate) — introduces Issue 001 before the Editor''s Letter; binding to this page unchanged, no visual replacement')
where page_key = 'undrifted_issue01_page02_editors_letter';

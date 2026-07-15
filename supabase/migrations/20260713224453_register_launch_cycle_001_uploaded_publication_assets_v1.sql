-- Register Launch Cycle 001 publication asset derivatives (uploaded to Supabase Storage)
-- Source: docs/_source/codex/publications/launch_cycle_001_publication_asset_package_v1.meta.md
-- Authorizing OAR2: OAR/OAR2/publication/oar2_register_uploaded_launch_cycle_001_publication_assets_v1.meta.md

insert into measures_publication_derivative_asset (
  derivative_key, publication_asset_id, derivative_type, title, description,
  format, duration, source_reference, generation_status, generation_source,
  approval_status, release_state, created_by_actor_class, created_by_actor_key,
  review_status, metadata
) values (
  'field_findings_2026_w28_public_article_v2_social_landscape_v1',
  'field_findings_2026_w28_public_article_v2',
  'hero',
  'Field Findings 2026-W28 — Landscape Social Image',
  '1200x675 landscape social/preview image built from the registered Field Findings section banner art and approved title/subhead copy.',
  'image/webp',
  NULL,
  'Assets/Video/unDrifted/LaunchCycle001/assets/launch_cycle_001_field_findings_landscape_v1.png (local PNG master)',
  'draft',
  'ai_generated_pil_ffmpeg',
  'ready_for_operator_approval',
  'held',
  'AI',
  'claude_sonnet_5',
  'pending_operator_review',
  '{"public_url":"https://zfihrspxvennjzazxcbj.supabase.co/storage/v1/object/public/measures-registry/launch_cycle_001/launch_cycle_001_field_findings_landscape_v1.webp","storage_bucket":"measures-registry","storage_object_path":"launch_cycle_001/launch_cycle_001_field_findings_landscape_v1.webp","checksum_sha256":"f5a885c198885f2ee4e5e6ee11d7b1048db1de2ad9d3fb75cc630d034b9e3ea4","dimensions":"1200x675","launch_cycle":"launch_cycle_001"}'::jsonb
)
on conflict (derivative_key) do nothing;
insert into measures_publication_derivative_asset (
  derivative_key, publication_asset_id, derivative_type, title, description,
  format, duration, source_reference, generation_status, generation_source,
  approval_status, release_state, created_by_actor_class, created_by_actor_key,
  review_status, metadata
) values (
  'field_findings_2026_w28_public_article_v2_social_square_v1',
  'field_findings_2026_w28_public_article_v2',
  'thumbnail',
  'Field Findings 2026-W28 — Square Social Image',
  '1080x1080 square social image built from the registered Field Findings section banner art and approved title/subhead copy.',
  'image/webp',
  NULL,
  'Assets/Video/unDrifted/LaunchCycle001/assets/launch_cycle_001_field_findings_square_v1.png (local PNG master)',
  'draft',
  'ai_generated_pil_ffmpeg',
  'ready_for_operator_approval',
  'held',
  'AI',
  'claude_sonnet_5',
  'pending_operator_review',
  '{"public_url":"https://zfihrspxvennjzazxcbj.supabase.co/storage/v1/object/public/measures-registry/launch_cycle_001/launch_cycle_001_field_findings_square_v1.webp","storage_bucket":"measures-registry","storage_object_path":"launch_cycle_001/launch_cycle_001_field_findings_square_v1.webp","checksum_sha256":"d2e8be1dc6788c6a5ff750194a877e6666ff20a82f9a8b7d48faf5dc4f9a828d","dimensions":"1080x1080","launch_cycle":"launch_cycle_001"}'::jsonb
)
on conflict (derivative_key) do nothing;

insert into measures_publication_derivative_asset (
  derivative_key, publication_asset_id, derivative_type, title, description,
  format, duration, source_reference, generation_status, generation_source,
  approval_status, release_state, created_by_actor_class, created_by_actor_key,
  review_status, metadata
) values (
  'field_findings_2026_w28_public_article_v2_social_story_v1',
  'field_findings_2026_w28_public_article_v2',
  'hero',
  'Field Findings 2026-W28 — Vertical Story Image',
  '1080x1920 vertical story/reel-cover image built from the registered Field Findings section banner art and approved title/subhead copy.',
  'image/webp',
  NULL,
  'Assets/Video/unDrifted/LaunchCycle001/assets/launch_cycle_001_field_findings_story_v1.png (local PNG master)',
  'draft',
  'ai_generated_pil_ffmpeg',
  'ready_for_operator_approval',
  'held',
  'AI',
  'claude_sonnet_5',
  'pending_operator_review',
  '{"public_url":"https://zfihrspxvennjzazxcbj.supabase.co/storage/v1/object/public/measures-registry/launch_cycle_001/launch_cycle_001_field_findings_story_v1.webp","storage_bucket":"measures-registry","storage_object_path":"launch_cycle_001/launch_cycle_001_field_findings_story_v1.webp","checksum_sha256":"99d1c49019aad3c3df233989049a0b154f6d0cd5b910877a76d1d750125fde56","dimensions":"1080x1920","launch_cycle":"launch_cycle_001"}'::jsonb
)
on conflict (derivative_key) do nothing;

insert into measures_publication_derivative_asset (
  derivative_key, publication_asset_id, derivative_type, title, description,
  format, duration, source_reference, generation_status, generation_source,
  approval_status, release_state, created_by_actor_class, created_by_actor_key,
  review_status, metadata
) values (
  'field_findings_2026_w28_public_article_v2_pull_quote_v1',
  'field_findings_2026_w28_public_article_v2',
  'pull_quote',
  'Field Findings 2026-W28 — Quote Card',
  'Quote card. Exact copy: "Organizations are assigning autonomous capability faster than they are establishing the operational environments required to govern it."',
  'image/webp',
  NULL,
  'Assets/Video/unDrifted/LaunchCycle001/assets/launch_cycle_001_field_findings_quote_01_v1.png (local PNG master)',
  'draft',
  'ai_generated_pil_ffmpeg',
  'ready_for_operator_approval',
  'held',
  'AI',
  'claude_sonnet_5',
  'pending_operator_review',
  '{"public_url":"https://zfihrspxvennjzazxcbj.supabase.co/storage/v1/object/public/measures-registry/launch_cycle_001/launch_cycle_001_field_findings_quote_01_v1.webp","storage_bucket":"measures-registry","storage_object_path":"launch_cycle_001/launch_cycle_001_field_findings_quote_01_v1.webp","checksum_sha256":"c4ee2ad36704089b6c0a6afb0457d425df1b8d832ae075d9c44e3dca0251518a","dimensions":"1080x1080","launch_cycle":"launch_cycle_001"}'::jsonb
)
on conflict (derivative_key) do nothing;

insert into measures_publication_derivative_asset (
  derivative_key, publication_asset_id, derivative_type, title, description,
  format, duration, source_reference, generation_status, generation_source,
  approval_status, release_state, created_by_actor_class, created_by_actor_key,
  review_status, metadata
) values (
  'field_findings_2026_w28_public_article_v2_discussion_prompt_v1',
  'field_findings_2026_w28_public_article_v2',
  'excerpt',
  'Field Findings 2026-W28 — Discussion Prompt Card',
  'Discussion prompt card. Exact copy: "Is your operational environment governed enough to receive an autonomous participant?"',
  'image/webp',
  NULL,
  'Assets/Video/unDrifted/LaunchCycle001/assets/launch_cycle_001_field_findings_discussion_01_v1.png (local PNG master)',
  'draft',
  'ai_generated_pil_ffmpeg',
  'ready_for_operator_approval',
  'held',
  'AI',
  'claude_sonnet_5',
  'pending_operator_review',
  '{"public_url":"https://zfihrspxvennjzazxcbj.supabase.co/storage/v1/object/public/measures-registry/launch_cycle_001/launch_cycle_001_field_findings_discussion_01_v1.webp","storage_bucket":"measures-registry","storage_object_path":"launch_cycle_001/launch_cycle_001_field_findings_discussion_01_v1.webp","checksum_sha256":"e9d24e8b83fd095566e93cbf195eea0585456fd426d858bfaa9b2eda4e6e30aa","dimensions":"1080x1080","launch_cycle":"launch_cycle_001"}'::jsonb
)
on conflict (derivative_key) do nothing;

insert into measures_publication_derivative_asset (
  derivative_key, publication_asset_id, derivative_type, title, description,
  format, duration, source_reference, generation_status, generation_source,
  approval_status, release_state, created_by_actor_class, created_by_actor_key,
  review_status, metadata
) values (
  'undrifted_response_001_social_landscape_v1',
  'undrifted_response_001',
  'hero',
  'unDrifted Response 001 — Landscape Social Image',
  '1200x675 landscape social/preview image built from the registered unDrifted Response section banner art and approved title/subhead copy.',
  'image/webp',
  NULL,
  'Assets/Video/unDrifted/LaunchCycle001/assets/launch_cycle_001_response_landscape_v1.png (local PNG master)',
  'draft',
  'ai_generated_pil_ffmpeg',
  'ready_for_operator_approval',
  'held',
  'AI',
  'claude_sonnet_5',
  'pending_operator_review',
  '{"public_url":"https://zfihrspxvennjzazxcbj.supabase.co/storage/v1/object/public/measures-registry/launch_cycle_001/launch_cycle_001_response_landscape_v1.webp","storage_bucket":"measures-registry","storage_object_path":"launch_cycle_001/launch_cycle_001_response_landscape_v1.webp","checksum_sha256":"b65fcf33b53a4407998db64b539cb20e8ffd5ddb15fba8f76c40ee5bc653a33d","dimensions":"1200x675","launch_cycle":"launch_cycle_001"}'::jsonb
)
on conflict (derivative_key) do nothing;

insert into measures_publication_derivative_asset (
  derivative_key, publication_asset_id, derivative_type, title, description,
  format, duration, source_reference, generation_status, generation_source,
  approval_status, release_state, created_by_actor_class, created_by_actor_key,
  review_status, metadata
) values (
  'undrifted_response_001_social_square_v1',
  'undrifted_response_001',
  'thumbnail',
  'unDrifted Response 001 — Square Social Image',
  '1080x1080 square social image built from the registered unDrifted Response section banner art and approved title/subhead copy.',
  'image/webp',
  NULL,
  'Assets/Video/unDrifted/LaunchCycle001/assets/launch_cycle_001_response_square_v1.png (local PNG master)',
  'draft',
  'ai_generated_pil_ffmpeg',
  'ready_for_operator_approval',
  'held',
  'AI',
  'claude_sonnet_5',
  'pending_operator_review',
  '{"public_url":"https://zfihrspxvennjzazxcbj.supabase.co/storage/v1/object/public/measures-registry/launch_cycle_001/launch_cycle_001_response_square_v1.webp","storage_bucket":"measures-registry","storage_object_path":"launch_cycle_001/launch_cycle_001_response_square_v1.webp","checksum_sha256":"6d7108ba7e1d2acd8c235ebbcfed6c58b739aeda88e7e24d8434c4119719c6c4","dimensions":"1080x1080","launch_cycle":"launch_cycle_001"}'::jsonb
)
on conflict (derivative_key) do nothing;

insert into measures_publication_derivative_asset (
  derivative_key, publication_asset_id, derivative_type, title, description,
  format, duration, source_reference, generation_status, generation_source,
  approval_status, release_state, created_by_actor_class, created_by_actor_key,
  review_status, metadata
) values (
  'undrifted_response_001_social_story_v1',
  'undrifted_response_001',
  'hero',
  'unDrifted Response 001 — Vertical Story Image',
  '1080x1920 vertical story/reel-cover image built from the registered unDrifted Response section banner art and approved title/subhead copy.',
  'image/webp',
  NULL,
  'Assets/Video/unDrifted/LaunchCycle001/assets/launch_cycle_001_response_story_v1.png (local PNG master)',
  'draft',
  'ai_generated_pil_ffmpeg',
  'ready_for_operator_approval',
  'held',
  'AI',
  'claude_sonnet_5',
  'pending_operator_review',
  '{"public_url":"https://zfihrspxvennjzazxcbj.supabase.co/storage/v1/object/public/measures-registry/launch_cycle_001/launch_cycle_001_response_story_v1.webp","storage_bucket":"measures-registry","storage_object_path":"launch_cycle_001/launch_cycle_001_response_story_v1.webp","checksum_sha256":"949af1b82bcc8286b2d08b66d0f6f1ccceb24d7d84bcf2de3bb8ad1e6ee52385","dimensions":"1080x1920","launch_cycle":"launch_cycle_001"}'::jsonb
)
on conflict (derivative_key) do nothing;

insert into measures_publication_derivative_asset (
  derivative_key, publication_asset_id, derivative_type, title, description,
  format, duration, source_reference, generation_status, generation_source,
  approval_status, release_state, created_by_actor_class, created_by_actor_key,
  review_status, metadata
) values (
  'undrifted_response_001_pull_quote_v1',
  'undrifted_response_001',
  'pull_quote',
  'unDrifted Response 001 — Quote Card',
  'Quote card. Exact copy: "AI agents are not entering empty systems."',
  'image/webp',
  NULL,
  'Assets/Video/unDrifted/LaunchCycle001/assets/launch_cycle_001_response_quote_01_v1.png (local PNG master)',
  'draft',
  'ai_generated_pil_ffmpeg',
  'ready_for_operator_approval',
  'held',
  'AI',
  'claude_sonnet_5',
  'pending_operator_review',
  '{"public_url":"https://zfihrspxvennjzazxcbj.supabase.co/storage/v1/object/public/measures-registry/launch_cycle_001/launch_cycle_001_response_quote_01_v1.webp","storage_bucket":"measures-registry","storage_object_path":"launch_cycle_001/launch_cycle_001_response_quote_01_v1.webp","checksum_sha256":"1fdede4815f0d3feebdf86f4fb302886de1df2d22f54a7e92145459f2440a4a0","dimensions":"1080x1080","launch_cycle":"launch_cycle_001"}'::jsonb
)
on conflict (derivative_key) do nothing;

insert into measures_publication_derivative_asset (
  derivative_key, publication_asset_id, derivative_type, title, description,
  format, duration, source_reference, generation_status, generation_source,
  approval_status, release_state, created_by_actor_class, created_by_actor_key,
  review_status, metadata
) values (
  'undrifted_response_001_discussion_prompt_v1',
  'undrifted_response_001',
  'excerpt',
  'unDrifted Response 001 — Discussion Prompt Card',
  'Discussion prompt card. Exact copy: "What kind of institution can responsibly receive an autonomous agent?"',
  'image/webp',
  NULL,
  'Assets/Video/unDrifted/LaunchCycle001/assets/launch_cycle_001_response_discussion_01_v1.png (local PNG master)',
  'draft',
  'ai_generated_pil_ffmpeg',
  'ready_for_operator_approval',
  'held',
  'AI',
  'claude_sonnet_5',
  'pending_operator_review',
  '{"public_url":"https://zfihrspxvennjzazxcbj.supabase.co/storage/v1/object/public/measures-registry/launch_cycle_001/launch_cycle_001_response_discussion_01_v1.webp","storage_bucket":"measures-registry","storage_object_path":"launch_cycle_001/launch_cycle_001_response_discussion_01_v1.webp","checksum_sha256":"3971997ff464b1ad36ad3f7ae073e83d01f0c043829958dff0585739c6c2b11d","dimensions":"1080x1080","launch_cycle":"launch_cycle_001"}'::jsonb
)
on conflict (derivative_key) do nothing;

insert into measures_publication_derivative_asset (
  derivative_key, publication_asset_id, derivative_type, title, description,
  format, duration, source_reference, generation_status, generation_source,
  approval_status, release_state, created_by_actor_class, created_by_actor_key,
  review_status, metadata
) values (
  'obsidian_chamber_orientation_thumbnail_v1',
  'obsidian_chamber_orientation',
  'thumbnail',
  'Obsidian Chamber Orientation — Thumbnail',
  '1200x675 clean still (no caption), symmetrical emblem corridor, frame f07 of the Phase 2 editorial inspection.',
  'image/webp',
  NULL,
  'Obsidian Chamber Orientation source video, still f07',
  'draft',
  'ai_generated_pil_ffmpeg',
  'ready_for_operator_approval',
  'held',
  'AI',
  'claude_sonnet_5',
  'pending_operator_review',
  '{"public_url":"https://zfihrspxvennjzazxcbj.supabase.co/storage/v1/object/public/measures-registry/launch_cycle_001/obsidian_orientation_thumbnail_v1.webp","storage_bucket":"measures-registry","storage_object_path":"launch_cycle_001/obsidian_orientation_thumbnail_v1.webp","checksum_sha256":"40e241e5ee445a0349bf02537d1b9d7c3bf181000f5f8d1c7dd99ee3841279ef","dimensions":"1200x675","launch_cycle":"launch_cycle_001"}'::jsonb
)
on conflict (derivative_key) do nothing;

insert into measures_publication_derivative_asset (
  derivative_key, publication_asset_id, derivative_type, title, description,
  format, duration, source_reference, generation_status, generation_source,
  approval_status, release_state, created_by_actor_class, created_by_actor_key,
  review_status, metadata
) values (
  'obsidian_chamber_orientation_hero_v1',
  'obsidian_chamber_orientation',
  'hero',
  'Obsidian Chamber Orientation — Dramatic Still',
  '1080x1080 clean still (no caption), glass-burst flare, frame f04 of the Phase 2 editorial inspection.',
  'image/webp',
  NULL,
  'Obsidian Chamber Orientation source video, still f04',
  'draft',
  'ai_generated_pil_ffmpeg',
  'ready_for_operator_approval',
  'held',
  'AI',
  'claude_sonnet_5',
  'pending_operator_review',
  '{"public_url":"https://zfihrspxvennjzazxcbj.supabase.co/storage/v1/object/public/measures-registry/launch_cycle_001/obsidian_orientation_dramatic_v1.webp","storage_bucket":"measures-registry","storage_object_path":"launch_cycle_001/obsidian_orientation_dramatic_v1.webp","checksum_sha256":"d1780db16f3f43b119584ef9d250fb7060dac74de5d3a7721b73bdc9a76ae7d7","dimensions":"1080x1080","launch_cycle":"launch_cycle_001"}'::jsonb
)
on conflict (derivative_key) do nothing;

insert into measures_publication_derivative_asset (
  derivative_key, publication_asset_id, derivative_type, title, description,
  format, duration, source_reference, generation_status, generation_source,
  approval_status, release_state, created_by_actor_class, created_by_actor_key,
  review_status, metadata
) values (
  'crystal_seat_orientation_thumbnail_v1',
  'crystal_seat_orientation',
  'thumbnail',
  'Crystal Seat Orientation — Presenter Thumbnail',
  '1080x1080 caption-free presenter still, freshly extracted from raw source at t=33s (every previously extracted still had burned-in word-level captions).',
  'image/webp',
  NULL,
  'Crystal Seat Orientation source video, fresh extraction t=33s',
  'draft',
  'ai_generated_pil_ffmpeg',
  'ready_for_operator_approval',
  'held',
  'AI',
  'claude_sonnet_5',
  'pending_operator_review',
  '{"public_url":"https://zfihrspxvennjzazxcbj.supabase.co/storage/v1/object/public/measures-registry/launch_cycle_001/crystal_seat_presenter_thumbnail_v1.webp","storage_bucket":"measures-registry","storage_object_path":"launch_cycle_001/crystal_seat_presenter_thumbnail_v1.webp","checksum_sha256":"13c00374c77adc56609b994cb0704eda5ae24ae46312169a55a5aeda2eb3b9da","dimensions":"1080x1080","launch_cycle":"launch_cycle_001"}'::jsonb
)
on conflict (derivative_key) do nothing;

insert into measures_publication_derivative_asset (
  derivative_key, publication_asset_id, derivative_type, title, description,
  format, duration, source_reference, generation_status, generation_source,
  approval_status, release_state, created_by_actor_class, created_by_actor_key,
  review_status, metadata
) values (
  'about_measures_registry_pull_quote_v1',
  'about_measures_registry',
  'pull_quote',
  'About Measures Registry — Accountability Quote Card',
  '1080x1080 still, frame f09. Caption "ACCOUNTABILITY IS" is burned into the source motion graphic and is a mid-sentence fragment; about_measures_registry.mp4 is untranscribed so full sentence context is unverified.',
  'image/webp',
  NULL,
  'About Measures Registry source video, still f09',
  'draft',
  'ai_generated_pil_ffmpeg',
  'held_text_context_verification',
  'held',
  'AI',
  'claude_sonnet_5',
  'pending_operator_review',
  '{"public_url":"https://zfihrspxvennjzazxcbj.supabase.co/storage/v1/object/public/measures-registry/launch_cycle_001/about_measures_registry_accountability_quote_v1.webp","storage_bucket":"measures-registry","storage_object_path":"launch_cycle_001/about_measures_registry_accountability_quote_v1.webp","checksum_sha256":"16a2a51601e261b0b8e43fce4e1ef0b2ca8eabe9c979b8fb424c566b19555082","dimensions":"1080x1080","launch_cycle":"launch_cycle_001"}'::jsonb
)
on conflict (derivative_key) do nothing;

insert into measures_publication_derivative_asset (
  derivative_key, publication_asset_id, derivative_type, title, description,
  format, duration, source_reference, generation_status, generation_source,
  approval_status, release_state, created_by_actor_class, created_by_actor_key,
  review_status, metadata
) values (
  'about_measures_registry_explainer_card_v1',
  'about_measures_registry',
  'summary',
  'About Measures Registry — Fragmented Network Explainer',
  '1080x1080 still, frame f05. Caption "NOT ALWAYS" plus "Fragmented Network / Broken Links / Isolated Nodes" burned into the source graphic; about_measures_registry.mp4 is untranscribed so full context is unverified.',
  'image/webp',
  NULL,
  'About Measures Registry source video, still f05',
  'draft',
  'ai_generated_pil_ffmpeg',
  'held_text_context_verification',
  'held',
  'AI',
  'claude_sonnet_5',
  'pending_operator_review',
  '{"public_url":"https://zfihrspxvennjzazxcbj.supabase.co/storage/v1/object/public/measures-registry/launch_cycle_001/about_measures_registry_fragmented_network_explainer_v1.webp","storage_bucket":"measures-registry","storage_object_path":"launch_cycle_001/about_measures_registry_fragmented_network_explainer_v1.webp","checksum_sha256":"cc73da812de8eb2132f13ff0c603ae66c6f68b8e318ceba011001477ab745944","dimensions":"1080x1080","launch_cycle":"launch_cycle_001"}'::jsonb
)
on conflict (derivative_key) do nothing;

insert into measures_publication_derivative_asset (
  derivative_key, publication_asset_id, derivative_type, title, description,
  format, duration, source_reference, generation_status, generation_source,
  approval_status, release_state, created_by_actor_class, created_by_actor_key,
  review_status, metadata
) values (
  'intro_hook_video_9x16_captioned_v1',
  'intro_hook',
  'video_short',
  'AI Isn''t Broken Intro — 9:16 Captioned Vertical',
  'Full 25.94s intro re-encoded to 1080x1920 (letterboxed) with correctly-scaled burned-in captions from the real transcript. Supersedes an earlier corrupted vertical render of the same source.',
  'video/mp4',
  '25.94s',
  'ai_isnt_broken_intro.mp4 (measures_registry_root / intro_hook), full duration',
  'draft',
  'ai_generated_pil_ffmpeg',
  'ready_for_operator_approval',
  'held',
  'AI',
  'claude_sonnet_5',
  'pending_operator_review',
  '{"public_url":"https://zfihrspxvennjzazxcbj.supabase.co/storage/v1/object/public/measures-registry/campaign_derivatives/ai_isnt_broken_intro__9x16_captioned_v1.mp4","storage_bucket":"measures-registry","storage_object_path":"campaign_derivatives/ai_isnt_broken_intro__9x16_captioned_v1.mp4","checksum_sha256":"737f18f3c4ec535795bd54d66cc80fd8b78b6af30780eedbf31ce193eb68bd11","dimensions":"1080x1920","launch_cycle":"launch_cycle_001"}'::jsonb
)
on conflict (derivative_key) do nothing;

insert into measures_publication_derivative_asset (
  derivative_key, publication_asset_id, derivative_type, title, description,
  format, duration, source_reference, generation_status, generation_source,
  approval_status, release_state, created_by_actor_class, created_by_actor_key,
  review_status, metadata
) values (
  'marble_chamber_orientation_video_short_primary_v1',
  'undrifted_issue01_page06_launch_encounter',
  'video_short',
  'Assessment Report Orientation — Primary Clip',
  '26.88s clip (0:00-26.871), 1080x1920, native burned-in captions from the source video (no overlay added - an earlier pass added a redundant oversized overlay and was corrected).',
  'video/mp4',
  '26.88s',
  'assessment_report_orientation.mp4 (marble_chamber_orientation), 0:00-0:26.871',
  'draft',
  'ai_generated_pil_ffmpeg',
  'ready_for_operator_approval',
  'held',
  'AI',
  'claude_sonnet_5',
  'pending_operator_review',
  '{"public_url":"https://zfihrspxvennjzazxcbj.supabase.co/storage/v1/object/public/measures-registry/campaign_derivatives/assessment_primary_clip__9x16_v1.mp4","storage_bucket":"measures-registry","storage_object_path":"campaign_derivatives/assessment_primary_clip__9x16_v1.mp4","checksum_sha256":"7a289f066a581028e60130c99ec84aa89ed9fcf3054c6caa8605f4dca7e3e9ed","dimensions":"1080x1920","launch_cycle":"launch_cycle_001"}'::jsonb
)
on conflict (derivative_key) do nothing;

insert into measures_publication_derivative_asset (
  derivative_key, publication_asset_id, derivative_type, title, description,
  format, duration, source_reference, generation_status, generation_source,
  approval_status, release_state, created_by_actor_class, created_by_actor_key,
  review_status, metadata
) values (
  'marble_chamber_orientation_video_short_alt_v1',
  'undrifted_issue01_page06_launch_encounter',
  'video_short',
  'Assessment Report Orientation — Alternate Clip',
  '23.92s clip (0:26.871-50.751), 1080x1920, native burned-in captions from the source video.',
  'video/mp4',
  '23.92s',
  'assessment_report_orientation.mp4 (marble_chamber_orientation), 0:26.871-0:50.751',
  'draft',
  'ai_generated_pil_ffmpeg',
  'ready_for_operator_approval',
  'held',
  'AI',
  'claude_sonnet_5',
  'pending_operator_review',
  '{"public_url":"https://zfihrspxvennjzazxcbj.supabase.co/storage/v1/object/public/measures-registry/campaign_derivatives/assessment_alt_clip__9x16_v1.mp4","storage_bucket":"measures-registry","storage_object_path":"campaign_derivatives/assessment_alt_clip__9x16_v1.mp4","checksum_sha256":"75ec3f006dbb95224d009c9c01f0d72049a492608e9991bdbe23f31199ce98c1","dimensions":"1080x1920","launch_cycle":"launch_cycle_001"}'::jsonb
)
on conflict (derivative_key) do nothing;

insert into measures_publication_derivative_asset (
  derivative_key, publication_asset_id, derivative_type, title, description,
  format, duration, source_reference, generation_status, generation_source,
  approval_status, release_state, created_by_actor_class, created_by_actor_key,
  review_status, metadata
) values (
  'obsidian_chamber_orientation_video_short_v1',
  'obsidian_chamber_orientation',
  'video_short',
  'Obsidian Chamber Orientation — Primary Clip',
  '16s highlight clip (0:08-24), 1080x1920, no captions (abstract b-roll, no dialogue).',
  'video/mp4',
  '16.00s',
  'obsidian_chamber_orientation.mp4 (measures_registry_landing / landing_root), 0:08-0:24',
  'draft',
  'ai_generated_pil_ffmpeg',
  'ready_for_operator_approval',
  'held',
  'AI',
  'claude_sonnet_5',
  'pending_operator_review',
  '{"public_url":"https://zfihrspxvennjzazxcbj.supabase.co/storage/v1/object/public/measures-registry/campaign_derivatives/obsidian_chamber_orientation__primary_clip_9x16_v1.mp4","storage_bucket":"measures-registry","storage_object_path":"campaign_derivatives/obsidian_chamber_orientation__primary_clip_9x16_v1.mp4","checksum_sha256":"891d2f4effa89943e06cf7568d51f1b35dd27fb0247d9de490d82f269343dc08","dimensions":"1080x1920","launch_cycle":"launch_cycle_001"}'::jsonb
)
on conflict (derivative_key) do nothing;

insert into measures_publication_derivative_asset (
  derivative_key, publication_asset_id, derivative_type, title, description,
  format, duration, source_reference, generation_status, generation_source,
  approval_status, release_state, created_by_actor_class, created_by_actor_key,
  review_status, metadata
) values (
  'crystal_seat_orientation_video_short_v1',
  'crystal_seat_orientation',
  'video_short',
  'Crystal Seat Orientation — Primary Clip',
  'Full 39.88s clip, source 640x640 padded to 1080x1920 vertical canvas, native burned-in word-level captions.',
  'video/mp4',
  '39.88s',
  'crystal_seat_orientation.mp4 (measures_registry_root / measures_position), full duration',
  'draft',
  'ai_generated_pil_ffmpeg',
  'ready_for_operator_approval',
  'held',
  'AI',
  'claude_sonnet_5',
  'pending_operator_review',
  '{"public_url":"https://zfihrspxvennjzazxcbj.supabase.co/storage/v1/object/public/measures-registry/campaign_derivatives/crystal_seat_orientation__primary_clip_9x16_v1.mp4","storage_bucket":"measures-registry","storage_object_path":"campaign_derivatives/crystal_seat_orientation__primary_clip_9x16_v1.mp4","checksum_sha256":"1c5313f0820b136dc56ad1ddc3820146b3040e4ea908012e207adda7d1be8d2c","dimensions":"1080x1920","launch_cycle":"launch_cycle_001"}'::jsonb
)
on conflict (derivative_key) do nothing;

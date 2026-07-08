-- Registers the uploaded short-cut video as a media_map row (it's a real new binary this pass,
-- distinct from prior OAR2s which only ever referenced pre-existing media). Updates the Campaign
-- Asset title for accuracy and the YouTube Distribution Asset's Buffer payload to reference the
-- real cut/transcript instead of the fabricated narration it previously held.

insert into public.measures_media_map
  (registry_key, encounter_key, campaign_key, media_role, storage_bucket, storage_path, mime_type, is_active, metadata)
values
  (
    'undrifted_issue001_campaign',
    'undrifted_issue001_assessment_short_cut',
    'undrifted_issue001_launch_campaign_v1',
    'assessment_short_cut',
    'measures-registry',
    'campaign_derivatives/undrifted_issue001_assessment_short_cut_v1.mp4',
    'video/mp4',
    true,
    jsonb_build_object(
      'note', 'Real 26.871s cut of the existing assessment_report_orientation.mp4 (R2: measures-media), video+audio intact, produced via ffmpeg this pass. Not a new production — a trim of pre-existing narrated content.',
      'derivative_asset_id', 'undrifted_issue01_page06_launch_encounter_video_short_narration_v1',
      'source_video', 'measures-media/assessment_report_orientation.mp4'
    )
  );

update public.measures_publication_campaign_asset
set title = 'AI Operations Assessment — Short Cut (Real Excerpt)'
where campaign_asset_key = 'undrifted_issue001_ca_assessment_video_v1';

update public.measures_publication_distribution_asset
set payload = jsonb_build_object(
  'publication_asset_id', 'undrifted_issue01_page06_launch_encounter',
  'derivative_asset_id', 'undrifted_issue01_page06_launch_encounter_video_short_narration_v1',
  'campaign_asset_id', 'undrifted_issue001_ca_assessment_video_v1',
  'distribution_asset_id', 'undrifted_issue001_da_assessment_youtube_v1',
  'title', 'What Does It Mean to Measure a Governable System?',
  'body', 'Your assessment evaluation has identified how your institution''s AI-facing environment is currently holding structure. AI systems do not operate in isolation — they interact with workflows, roles, approvals, data, outputs, and decisions. When those systems expand inside an unstructured environment, AI acceleration can amplify instability already present in the institution. Measures Registry exists to address that issue.',
  'media_references', jsonb_build_array('measures-registry/campaign_derivatives/undrifted_issue001_assessment_short_cut_v1.mp4'),
  'cta', 'Take the AI Operations Assessment',
  'link_destination', '/ai-operations-assessment',
  'platform_notes', 'Real 26.871s cut with original audio intact — a genuine excerpt of the existing assessment orientation video''s real narration, not a fabricated script. File produced via ffmpeg and uploaded to Supabase Storage this pass; ready to preview.'
)
where distribution_asset_key = 'undrifted_issue001_da_assessment_youtube_v1';

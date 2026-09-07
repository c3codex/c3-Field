---
document_type: automation_contract
system: measures_registry
automation_key: our_story_social_clip_source
status: source_contract_registered_derivatives_held
authority_level: seat_package
source_oar2: docs/seat/measures_registry/09_oar/oar2_register_our_story_video_as_measures_registry_media_asset_v1.meta.md
---

# Our Story Social Clip Source Contract

## Source Media

media_key: our_story  
duration: approx_5_minutes  
bucket_paths: pending_verification  

## Clip Strategy

status: timestamps_operator_confirmed_export_held

clip_timestamps: docs/seat/measures_registry/05_automation/our_story_social_clip_timestamp_plan.meta.md
clip_beats: operator_confirmed_in_timestamp_plan

Clip subjects and timestamp windows are evidence-based recommendations from source-video review. Aspect-ratio derivatives, final caption treatment, and campaign standing remain unregistered.

## Requires Future OAR2 For

- clip_timestamp_selection
- clip_export
- aspect_ratio_generation
- captions
- target_platform_mapping
- social_post_scheduling
- campaign_registration

## Not Authorized By This OAR2

- crop_clips
- export_clips
- post_to_social
- schedule_campaign
- move_media
- publish_to_paragraph
- mutate_frontend_runtime

## Timestamp Planning Surface

timestamp_plan: docs/seat/measures_registry/05_automation/our_story_social_clip_timestamp_plan.meta.md
timestamp_plan_status: timestamps_operator_confirmed_export_held
placeholder_clip_keys_registered: true
all_timestamps_pending_operator_selection: false
timestamp_recommendations_present: true
operator_confirmation_pending: false
clip_export_authorized: false
posting_authorized: false
campaign_registration_authorized: false

## Derivative Export Standing

derivative_manifest: docs/seat/measures_registry/07_media_assets/our_story_social_clip_derivatives_manifest.meta.md
derivative_export_status: exported_pending_upload_or_campaign_oar2
upload_authorized: false
posting_authorized: false
campaign_registration_authorized: false

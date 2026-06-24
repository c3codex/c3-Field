---
document_type: bucket_inventory_validation
authority_level: read_only_evidence
system_scope: measures_codex
title: Read-Only Bucket Inventory for Media Resolution v1
status: bucket_inventory_read_completed_or_blocked
version: v1
source_oar2: docs/seat/measures_registry_isolated/09_oar/oar2_resolve_measures_registry_unresolved_media_rows_before_exact_manifest_build_v1.meta.md
---

standing:
  status: bucket_inventory_read_completed_or_blocked
  read_only: true
  bucket_count_observed: 2
  project_bucket_count_observed: 5
  scoped_bucket_count_explanation: two seated media authorities were inspected; unrelated project buckets were not assigned media roles
  bucket_write_performed: false
  bucket_upload_performed: false
  bucket_delete_performed: false
  bucket_overwrite_performed: false
  bucket_move_performed: false

inventory_scope:
  inventory_completed_at: 2026-06-19
  object_count_reviewed: 135
  unique_expected_file_names: 11
  exact_expected_file_names_found: 8
  governed_media_rows_covered_by_exact_objects: 9
  possible_alternate_objects_are_not_authority: true

bucket_inventory:
  - bucket_name: measures-registry
    storage_provider: supabase
    bucket_role: static_visual_media_bucket
    total_object_count: 86
    objects:
      - object_path: ai_isnt_broken_landing.webp
        file_name: ai_isnt_broken_landing.webp
        extension: webp
        content_type: image/webp
        size_bytes: 194738
        last_modified: 2026-06-07T04:19:16.734Z
        inferred_media_group: obsidian_assessment
        notes: exact filename match
      - object_path: obsidian_eval_result_surface_visual_v1.webp
        file_name: obsidian_eval_result_surface_visual_v1.webp
        extension: webp
        content_type: image/webp
        size_bytes: 103950
        last_modified: 2026-06-08T20:59:38.455Z
        inferred_media_group: obsidian_assessment
        notes: exact filename match
      - object_path: undrifted_banner_website_social.webp
        file_name: undrifted_banner_website_social.webp
        extension: webp
        content_type: image/webp
        size_bytes: 21154
        last_modified: 2026-06-07T04:27:38.367Z
        inferred_media_group: lapis_undrifted_and_seo_social
        notes: exact object supports two distinct governed media-row contexts
      - object_path: agents_with_keys.webp
        file_name: agents_with_keys.webp
        extension: webp
        content_type: image/webp
        size_bytes: 89840
        last_modified: 2026-06-06T19:58:52.675Z
        inferred_media_group: lapis_undrifted
        notes: exact filename match
      - object_path: fables_and_myths.webp
        file_name: fables_and_myths.webp
        extension: webp
        content_type: image/webp
        size_bytes: 236916
        last_modified: 2026-06-18T20:26:08.723Z
        inferred_media_group: lapis_undrifted
        notes: exact filename match
      - object_path: measures_registry/pre_codex_exhibition/images/og.webp
        file_name: og.webp
        extension: webp
        content_type: image/webp
        size_bytes: 22896
        last_modified: 2026-05-12T04:19:02.184Z
        inferred_media_group: seo_social
        notes: exact filename match at an existing nested object path
      - object_path: obsidian_assessment_surface_visual_v1.webp
        file_name: obsidian_assessment_surface_visual_v1.webp
        extension: webp
        content_type: image/webp
        size_bytes: 55812
        last_modified: 2026-06-08T20:59:37.646Z
        inferred_media_group: obsidian_assessment
        notes: possible alternate for obsidian_assessment_surface.webp; not promoted without mapping authority
      - object_path: obsidian_contact_surface_visual_v1.webp
        file_name: obsidian_contact_surface_visual_v1.webp
        extension: webp
        content_type: image/webp
        size_bytes: 185794
        last_modified: 2026-06-08T20:59:38.526Z
        inferred_media_group: obsidian_assessment
        notes: possible alternate for obsidian_contact_surface.webp; not promoted without mapping authority
      - object_path: marble_asset_reference.webp
        file_name: marble_asset_reference.webp
        extension: webp
        content_type: image/webp
        size_bytes: 429682
        last_modified: 2026-05-22T16:22:42.770Z
        inferred_media_group: marble_map
        notes: nearby marble object only; not an exact payment-scope background match
      - object_path: marble_map_optimization_visual_v2.webp
        file_name: marble_map_optimization_visual_v2.webp
        extension: webp
        content_type: image/webp
        size_bytes: 91896
        last_modified: 2026-06-08T20:52:17.168Z
        inferred_media_group: marble_map
        notes: nearby marble object only; not an exact payment-scope background match
      - object_path: marble_map_predeployment_visual_v2.webp
        file_name: marble_map_predeployment_visual_v2.webp
        extension: webp
        content_type: image/webp
        size_bytes: 100444
        last_modified: 2026-06-08T20:52:17.607Z
        inferred_media_group: marble_map
        notes: nearby marble object only; not an exact payment-scope background match
      - object_path: marble_map_remediation_visual_v2.webp
        file_name: marble_map_remediation_visual_v2.webp
        extension: webp
        content_type: image/webp
        size_bytes: 85572
        last_modified: 2026-06-08T20:52:17.164Z
        inferred_media_group: marble_map
        notes: nearby marble object only; not an exact payment-scope background match
      - object_path: marble_map_system_readiness_visual_v2.webp
        file_name: marble_map_system_readiness_visual_v2.webp
        extension: webp
        content_type: image/webp
        size_bytes: 97116
        last_modified: 2026-06-08T20:52:17.183Z
        inferred_media_group: marble_map
        notes: nearby marble object only; not an exact payment-scope background match
  - bucket_name: measures-media
    storage_provider: cloudflare_r2
    bucket_role: large_motion_or_audio_bucket
    total_object_count: 49
    objects:
      - object_path: assessment_report_orientation.mp4
        file_name: assessment_report_orientation.mp4
        extension: mp4
        content_type: video/mp4
        size_bytes: 77235047
        last_modified: 2026-06-18T21:47:23.373Z
        inferred_media_group: obsidian_assessment
        notes: exact filename match
      - object_path: undrifted_hero.mp4
        file_name: undrifted_hero.mp4
        extension: mp4
        content_type: video/mp4
        size_bytes: 24980322
        last_modified: 2026-06-18T20:23:41.983Z
        inferred_media_group: lapis_undrifted
        notes: exact filename match

blocked_if:
  bucket_inventory_unavailable: false
  bucket_access_requires_new_credentials: false
  bucket_count_not_two_without_explanation: false
  bucket_policy_change_required: false

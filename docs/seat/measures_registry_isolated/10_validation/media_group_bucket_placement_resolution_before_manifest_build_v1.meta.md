---
document_type: media_group_placement_resolution
authority_level: read_only_resolution_evidence
system_scope: measures_codex
title: Media Group Bucket Placement Resolution Before Manifest Build v1
status: media_group_placement_resolved_or_blocked
version: v1
source_oar2: docs/seat/measures_registry_isolated/09_oar/oar2_resolve_measures_registry_unresolved_media_rows_before_exact_manifest_build_v1.meta.md
---

standing:
  status: media_group_placement_resolved_or_blocked
  exact_manifest_build_allowed: false
  bucket_upload_allowed: false

media_group_placement:
  obsidian_assessment:
    expected_surfaces:
      - landing_or_assessment_intro
      - contact_surface
      - assessment_surface
      - result_surface
    bucket_role: static_visual_media_bucket_and_large_motion_or_audio_bucket_by_content_type
    resolved_count: 3
    held_count: 2
    notes: exact landing, result, and report-orientation objects exist; assessment and contact expected filenames remain held pending alternate mapping authority
  lapis_undrifted:
    expected_surfaces:
      - unDrifted_lapis_encounter
      - publication_reference
      - social_or_publication_context
    bucket_role: static_visual_media_bucket_and_large_motion_or_audio_bucket_by_content_type
    resolved_count: 4
    held_count: 0
    notes: all four rows have exact existing object matches
  marble_map:
    expected_surfaces:
      - Measures_Assessment_Protocol
      - payment_scope_surface
      - c3_7s_disclosure_surface
    bucket_role: static_visual_media_bucket
    resolved_count: 0
    held_count: 1
    notes: nearby marble objects do not establish authority for the exact payment-scope background row
  seo_social:
    expected_surfaces:
      - Open_Graph
      - social_preview
      - website_banner
    bucket_role: static_visual_media_bucket
    resolved_count: 2
    held_count: 0
    notes: both governed rows have exact existing object matches

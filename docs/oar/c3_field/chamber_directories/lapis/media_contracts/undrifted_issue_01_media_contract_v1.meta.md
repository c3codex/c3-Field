---
document_type: chamber_contract
authority_level: working
document_scope: undrifted_issue_01_media
title: unDrifted Issue 01 Media Contract v1
status: seated_not_rendered
version: v1
operator: op044
system: measures_registry
contract_key: undrifted_issue_01_media_contract_v1
route_path: /undrifted
public_facing: true
parent_directory: c3_field_chamber_directory_lapis_v1
registration_state: seated_not_rendered
source_oar2: docs/oar/c3_field/chamber_directories/lapis/oar2_seat_undrifted_issue_01_landing_contracts_and_chamber_media_map_v1.meta.md
tags:
  - chamber-contract
  - media-contract
  - undrifted
  - issue-01
  - chamber-media-map
---

# unDrifted Issue 01 Media Contract v1

## Required Media Keys

registry_mark:

    usage:
      Measures Registry brand mark
      header identity
      issue cover identity accent

undrifted_logo:

    usage:
      publication masthead or masthead support
      do not replace registry_mark as Measures Registry authority

undrifted_banner_website_social:

    usage:
      publication identity strip
      possible social preview candidate
      not article cover unless later authorized

undrifted_issue_01_hero_motion_v1:

    usage:
      right-side hero motion-to-still if available
      optional if motion file exists

undrifted_issue_01_hero_still_v1:

    usage:
      right-side hero still fallback
      required if motion unavailable

undrifted_feature_assess_environment_cover_v1:

    source_label:
      ai_isnt_broken_landing

    usage:
      featured assessment cover on /undrifted

    placement:
      tighter crop
      magazine card treatment
      not full hero

undrifted_dispatch_structural_drift_cover_v1:

    source_label:
      structural_drift

    usage:
      Structural Drift dispatch cover

undrifted_dispatch_agents_with_keys_cover_v1:

    source_label:
      agents_with_keys

    usage:
      Agents with Keys dispatch cover

undrifted_dispatch_agents_of_chaos_cover_v1:

    source_label:
      agents_of_chaos

    usage:
      Agents of Chaos dispatch cover

## Glyph Media Boundary

Available glyph assets may be used as:

    editorial accents
    section dividers
    native line markers
    article metadata accents

Glyphs may not:

    replace registry_mark
    act as public authority
    clutter cover
    become navigation authority

Glyph semantic meanings must not be guessed.

Glyph assets with internal circuit labels or ambiguous public meaning must be held until operator naming.

## Media Requirements

    all media must be resolved from chamber media map
    no raw Supabase URL hardcoding
    no /mnt/data path
    no unregistered fallback image
    no lighthouse media

## Registration Standing

Media-map registration is authorized by source OAR2 for confirmed bucket objects only.

Motion media is held if absent.

Ambiguous glyphs are held or neutrally registered only if safe.

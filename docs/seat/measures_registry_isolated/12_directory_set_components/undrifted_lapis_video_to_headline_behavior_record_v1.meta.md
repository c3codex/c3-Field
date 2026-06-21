---
document_type: directory_set_requirement_record
record_key: undrifted_lapis_video_to_headline_behavior_record_v1
status: required_before_revised_SEAT_upload_manifest_confirmation
source_oar2: docs/seat/measures_registry_isolated/09_oar/oar2_addendum_seat_undrifted_lapis_encounter_media_map_and_9x16_style_profile_v1.meta.md
system_scope: measures_registry_isolated
runtime_mutation_authorized: false
database_mutation_authorized: false
renderer_mutation_authorized: false
---

# unDrifted Lapis Video to Headline Behavior Record v1

```yaml
standing:
  status: required_before_revised_SEAT_upload_manifest_confirmation
  mutation_authorized: false
  runtime_mutation_authorized: false

behavior:
  surface_key: undrifted_lapis_encounter
  initial_state:
    show_video: true
    video_media_key: undrifted_hero
    show_header: false
    show_issue_marker: true
    issue_marker_text: "June 2026 · Issue 001"
    CTA_label: "Assess Your AI Environment"
    show_watch_hook_button: false
    headline_blocks_viewport: false

  transition:
    trigger: video_complete
    allowed:
      - fade_video_to_still
      - replace_video_with_headline_panel
      - reveal_article_cards
      - reveal_leadership_callout
    not_allowed:
      - redirect_on_video_complete
      - require_user_click_to_continue
      - hide_assessment_CTA

  resolved_state:
    headline: "AI Isn't Broken. Systems Are."
    subline: "Questions ungoverned systems cannot answer."
    article_cards_visible: true
    leadership_callout_visible: true
    assessment_CTA_visible: true
```

## Boundary

This behavior record is a requirement surface. It does not implement video state, edit runtime, alter routes, or publish public copy.

---
document_type: directory_set_component_record
authority_level: local_documentation
system_scope: measures_codex
title: Obsidian Assessment Surface Sequence Record v1
status: seated
version: v1
source_oar2: docs/seat/measures_registry_isolated/09_oar/oar2_addendum_seat_obsidian_assessment_landing_assessment_and_contact_capture_style_profiles_v1.meta.md
---

# Obsidian Assessment Surface Sequence Record v1

standing:
  status: required_before_revised_SEAT_upload_manifest_confirmation
  mutation_authorized: false
  db_mutation_authorized: false
  runtime_mutation_authorized: false

sequence:
  - ai_isnt_broken_assessment_landing
  - ai_operations_assessment
  - assessment_contact_capture
  - assessment_orientation
  - assessment_carryover
  - marble_findings_reveal

obsidian_scope:
  includes:
    - landing
    - assessment
    - contact_capture
  excludes:
    - findings_reveal
    - review_determination
    - Measures_Assessment_Protocol
    - payment_of_scope

rule:
  plain_language: Obsidian captures assessment state and contact permission only. Marble reveals findings and presents governed continuation.

continuity:
  preserves_existing_runtime: true
  renderer_mutation_authorized: false
  route_mutation_authorized: false

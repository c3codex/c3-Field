---
document_type: oar1
authority_level: closeout
document_scope: root_authority_and_encounter_structure
title: OAR1 — Seat Measures Registry Root Authority and Encounter Structure v1
status: completed_root_authority_and_encounter_structure_with_launch_holds
version: v1
operator: op044
system: measures_registry
process_key: seat_measures_registry_root_authority_and_encounter_structure
source_oar2: docs/oar/measures_registry/oar2_seat_measures_registry_root_authority_and_encounter_structure_v1.meta.md
validated_at: 2026-06-21
---

# OAR1 — Seat Measures Registry Root Authority and Encounter Structure v1

## CLOSEOUT

Root authority and the approved encounter structure are seated in live Codex state. The renderer now resolves `/` through `measures_registry_root`; source fallback root truth is removed and missing authority renders a neutral held state. Build validation passes. Deployment and production verification are separate and remain pending.

status: completed_root_authority_and_encounter_structure_with_launch_holds

## LIVE ROOT AUTHORITY

registry_key: measures_registry_root
route_path: /
route_authority: registry
frontend_role: renderer
runtime_surface: intro_hook
release_state: released
access_state: visible
is_active: true
fallback_allowed: false
service_role_readback_rows: 1
anonymous_readback_rows: 1

root_authority:
  DB_registry_resolved: true
  root_manifest_explicit: true
  initialSurface_owns_root: false
  hardcoded_root_redirect: false
  client_side_root_preference: false
  missing_authority_behavior: held_missing_registry_authority

## ENCOUNTER STRUCTURE

root_sequence:
  - intro_hook
  - path_choice

intro_hook:
  content_encounter_key: ai_isnt_broken_intro
  media_role: intro_hook_video
  media_url: https://media.c3field.online/intro_hook.mp4
  controls: [audio, continue]
  next_surface: path_choice

path_choice:
  content_encounter_key: evaluate_structure_path
  left:
    label: Assess the Environment
    motion_media_role: left_hero_fracture_motion
    poster_media_role: left_hero_fracture
    next_surface: structural_coherence_explainer
  right:
    label: Understand the Environment
    motion_media_role: measured_hero_motion_graphic
    poster_media_role: right_measured_hero
    next_surface: measures_structured_environments

left_path:
  sequence:
    - structural_coherence_explainer
    - measures_assessment
    - contact_capture
    - result
    - MAP_continuation
    - payment
  assessment_before_contact_capture: true
  assessment_runtime_existing_logic_preserved: true
  MAP_payment_runtime_existing_logic_preserved: true
  confirmation_email_notice_contract: "Login details will arrive in a separate email."
  confirmation_email_sender_present: false
  delivery_standing: held_sender_not_implemented

right_path:
  sequence:
    - measures_structured_environments
    - about_measures_registry
  media_role: measures_structured_enviroments
  final_passage_line: "The goal is governable environments."

## ABOUT MEASURES REGISTRY

encounter_key: about_measures_registry
is_active: true
material_family: marble
video_media_role: about_measures_registry_video
video_url: https://media.c3field.online/about_measures_registry.mp4
seal_media_role: official_codexstone_seal
seal_storage: Supabase
content:
  title: About Measures Registry
  intro: Shared systems governance for institutions deploying AI.
  objective: Preserve institutional accountability.
  action: Establish shared systems governance.
  result: Institutions remain accountable for the systems they govern, the AI they deploy, and the people they serve.
  seal_lines:
    - Measures Registry
    - A governed system of record.
    - The stone remembers.

## UNDRIFTED

route: /undrifted
featured_article_set:
  - title: Agents With Keys
    publication_state: unpublished
    media_role: agents_with_keys_cover
  - title: Fables and Myths
    publication_state: unpublished
    media_role: fables_and_myths_cover
removed_from_seated_feature_set:
  - Measures Registry
  - Structural Drift
  - Agents of Chaos
article_behavior: top_of_page_held_overlay_until_publication_is_seated
about_teaser_target: about_measures_registry
leadership_callout_target: c3_field_our_story
footer_link_text: Registered Branch of c3 Field
c3_field_our_story_public_URL: not_seated
leadership_access_standing: held_missing_public_URL

## MEDIA READBACK

campaign_key: measures_registry_root_authority_v1
active_media_rows: 5
media:
  - intro_hook_video: measures-media/intro_hook.mp4
  - about_measures_registry_video: measures-media/about_measures_registry.mp4
  - official_codexstone_seal: measures-registry/official_codexstone_seal.png
  - agents_with_keys_cover: measures-registry/agents_with_keys.webp
  - fables_and_myths_cover: measures-registry/fables_and_myths.webp

## EXECUTION EVIDENCE

sql_artifact: docs/oar/measures_registry/seat-measures-registry-root-authority-and-encounter-structure-v1.sql
execution_surface: live_Supabase_exec_sql
execution_credential: SUPABASE_C3_SECRET
execution_blocks:
  root_and_encounter_block: ok
  media_mapping_block: ok
  media_validation_block: ok
DB_mutation_performed: true

build:
  command: npm.cmd run build:registry
  passed: true
  modules_transformed: 103
  asset: dist-registry/assets/index-DiVgnZHL.js
  governed_route_heads:
    - /ai-operations-assessment
    - /structural-drift
    - /undrifted
  warning: output_chunk_over_500_kB

## PAYMENT SAFETY

map_payment_events_before: 0
map_payment_events_after: 0
stripe_webhook_events_before: 0
stripe_webhook_events_after: 0
checkout_session_created: false
payment_created: false
webhook_fulfillment_triggered: false
MAP_pricing_changed: false
MAP_payment_terms_changed: false
checkout_logic_changed: false
webhook_logic_changed: false

## AUTHORITY BOUNDARY

SEAL_claim_created: false
certification_standing_created: false
DAO_standing_created: false
c3_key_created: false
SRC_binding_created: false
conversion_standing_created: false
private_SEAT_pricing_exposed: false

## FILES CHANGED

- docs/oar/measures_registry/seat-measures-registry-root-authority-and-encounter-structure-v1.sql
- src/measures_registry/registered_runtime/MeasuresRegistryRuntimeRegistered.tsx
- src/measures_registry/registered_runtime/registeredRuntimeTypes.ts
- src/measures_registry/registered_runtime/renderers/RegisteredPublicUnderstand.tsx
- src/measures_registry/registered_runtime/renderers/RegisteredStructuralDrift.tsx
- src/measures_registry/registered_runtime/renderers/RegisteredAboutMeasuresRegistry.tsx
- dist-registry/index.html
- dist-registry/ai-operations-assessment/index.html
- dist-registry/structural-drift/index.html
- dist-registry/undrifted/index.html
- dist-registry/assets/index-DiVgnZHL.js

## LAUNCH HOLDS

deployment_performed: false
production_runtime_verified: false
confirmation_email_sender_hold: true
c3_field_our_story_public_URL_hold: true
unpublished_article_content_hold: true
SEAT_launch_verified: false

## RECOMMENDED NEXT ACTION

1. Review and commit this OAR package and the bounded renderer changes.
2. Resolve or explicitly accept the confirmation-email sender, c3 Field / Our Story public URL, and unpublished article holds.
3. Deploy the registry build.
4. Run a separate live SEAT launch verification OAR against `/`, both root branches, `/undrifted`, About Measures Registry, MAP continuation, and payment safety.

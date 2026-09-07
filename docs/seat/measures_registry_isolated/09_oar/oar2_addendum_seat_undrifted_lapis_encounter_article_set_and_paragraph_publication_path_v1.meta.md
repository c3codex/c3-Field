---
document_type: oar2_addendum
authority_level: proposed
system_scope: measures_codex
title: OAR2 Addendum - Seat unDrifted Lapis Encounter Article Set and Paragraph Publication Path v1
status: proposed
version: v1
operator: op044
priority: launch_surface_correction_before_revised_manifest
parent_oar2: docs/seat/measures_registry_isolated/09_oar/oar2_seat_measures_registry_launch_style_profiles_landing_pages_seo_paragraph_integration_and_social_campaign_before_seat_upload_v1.meta.md
parent_oar1: docs/seat/measures_registry_isolated/09_oar/oar1_seat_measures_registry_launch_style_profiles_landing_pages_seo_paragraph_integration_and_social_campaign_before_seat_upload_v1.meta.md
mutation_scope:
  runtime: false
  database: false
  policies: false
  rows: false
  rls: false
  routes: false
  renderer: false
  public_copy: false
  bucket_delete: false
  bucket_upload: false
  bucket_overwrite: false
  bucket_move: false
  local_docs_mutation: false
  paragraph_publish: false
  paragraph_edit: false
  social_posting: false
  docs_created: true
  docs_updated: false
  docs_deleted: false
---

# OAR2 Addendum - Seat unDrifted Lapis Encounter Article Set and Paragraph Publication Path v1

## OBSERVED

The previous launch-surface OAR1 completed requirement seating and created five new directory-set records:

- launch_style_profile_set_record.meta.md
- launch_landing_pages_record.meta.md
- undrifted_article_and_paragraph_integration_record.meta.md
- social_campaign_record.meta.md
- seo_metadata_records.meta.md

That OAR1 reported:

- requirements_satisfied_true_or_false: true
- upload_manifest_update_required_true_or_false: true
- previous_confirmed_upload_count: 56
- new_required_records_count: 5
- recommended_upload_count_after_revision: 61
- upload_authorized_now: false
- paragraph_publish: false
- social_posting: false

Operator correction now required:

- unDrifted landing is the Lapis encounter surface.
- unDrifted headline must be: AI Isn't Broken. Systems Are.
- unDrifted must carry the assessment CTA.
- unDrifted must not showcase Structural Drift as the primary launch identity.
- unDrifted article set must include Agents with Keys, Fables and Myths, and Measures Registry.
- Agents with Keys is not yet published.
- Agents with Keys should be published through the Paragraph integration later under explicit authorization.
- Article clicks should open onsite on top of the unDrifted / Lapis surface, not redirect primarily to Paragraph.
- Paragraph is both source/reference and controlled publication execution surface, but publishing is not authorized in this addendum.
- Leadership callout is required on the Lapis encounter.

## ALIGNED

This addendum seats corrected launch requirements only.

It may:

- create an addendum requirement record
- create an addendum completion report
- update the revised manifest recommendation by adding one more directory-set component
- write OAR1 evidence

It may not:

- publish Agents with Keys
- edit Agents with Keys
- publish to Paragraph
- post or schedule social media
- upload bucket files
- overwrite bucket files
- mutate DB rows
- mutate policies
- mutate runtime
- mutate routes
- mutate renderer
- mutate public copy
- activate launch
- activate payment
- claim SEAT completion
- claim SEAL standing
- claim Registry Standing
- assign c3 Key
- activate DAO participation
- activate c3 backoffice

Authority remains:

Codex -> Field -> Measures -> OAR2 -> Chazz -> Cody -> src

## ROUTED

## 1. Confirm parent OAR1 standing

Confirm this file exists:

docs/seat/measures_registry_isolated/09_oar/oar1_seat_measures_registry_launch_style_profiles_landing_pages_seo_paragraph_integration_and_social_campaign_before_seat_upload_v1.meta.md

Confirm it reports:

- requirements_satisfied_true_or_false: true
- upload_manifest_update_required_true_or_false: true
- recommended_upload_count_after_revision: 61
- no_Paragraph_publishing_confirmation: true
- no_social_posting_confirmation: true
- bucket_upload_authorized: false

If parent evidence is missing, stop and write blocker OAR1.

## 2. Create unDrifted Lapis encounter article addendum record

Create:

docs/seat/measures_registry_isolated/12_directory_set_components/undrifted_lapis_encounter_article_set_and_paragraph_publication_path_addendum_v1.meta.md

Required content:

standing:
  status: required_before_revised_SEAT_upload_manifest_confirmation
  mutation_authorized: false
  publication_authorized_now: false
  upload_authorized_now: false

unDrifted_lapis_encounter:
  chamber_authority: lapis
  surface_type: relational_publication_encounter
  public_headline: "AI Isn't Broken. Systems Are."
  primary_CTA: Assess the Environment
  primary_route: AI Operations Assessment
  secondary_role: publication_signal_surface
  paragraph_primary_redirect: false
  article_click_behavior: onsite_overlay_or_panel
  leadership_callout_required: true

headline_rule:
  primary_public_headline: "AI Isn't Broken. Systems Are."
  structural_drift:
    allowed_as:
      - article_topic
      - internal_risk_pattern
      - historical_dispatch_reference
    not_allowed_as:
      - primary_launch_headline
      - unDrifted_publication_identity
      - landing_showcase
      - campaign_center

required_article_set:
  Agents_with_Keys:
    standing: unpublished_candidate
    required_for_lapis_encounter: true
    display_card_required: true
    publication_method: Paragraph_integration
    publish_authorized_now: false
    publish_requires_future_oar2: true
    after_publish:
      display_on_lapis_encounter: true
      open_onsite: true
      paragraph_link: secondary_source_only

  Fables_and_Myths:
    standing: article_candidate_or_published_verify
    required_for_lapis_encounter: true
    display_card_required: true
    open_onsite: true
    paragraph_link: secondary_source_only

  Measures_Registry:
    standing: article_candidate_or_published_verify
    required_for_lapis_encounter: true
    display_card_required: true
    open_onsite: true
    paragraph_link: secondary_source_only

Paragraph_integration:
  provider: Paragraph
  handle: "@undrifted"
  allowed_functions:
    - source_reference
    - syndication_surface
    - publication_execution_surface_after_explicit_oar2
  required_for:
    - publish_Agents_with_Keys_after_authorization
    - return_published_url_to_OAR1
    - return_publication_evidence_to_Codex
    - support_secondary_source_link
  not_allowed_without_future_oar2:
    - publish_article
    - edit_article
    - post_social
    - schedule_campaign

onsite_article_reader:
  required: true
  opens:
    - article_overlay
    - article_surface_panel
  preserves:
    - unDrifted_frame
    - assessment_CTA
    - return_to_dispatches
    - publication_identity
  does_not:
    - redirect_primary_to_Paragraph
    - leave_site_by_default

leadership_callout:
  required: true
  placement: lapis_encounter_surface
  purpose:
    - invite aligned institutional leadership
    - open relationship path
    - support Measures Registry launch growth
  CTA_options:
    - Start a Leadership Conversation
    - Request Foundational Leadership Review
    - Connect with Measures Registry
  does_not_create:
    - payment
    - SEAT
    - SEAL
    - Registry Standing
    - c3 Key
    - DAO participation
    - Branch standing

## 3. Create addendum validation report

Create:

docs/seat/measures_registry_isolated/10_validation/measures_registry_launch_surface_addendum_undrifted_lapis_articles_paragraph_publication_path_v1.meta.md

Required content:

standing:
  status: addendum_requirements_seated
  bucket_upload_authorized_now: false
  paragraph_publish_authorized_now: false
  runtime_mutation_authorized: false

parent_oar1_verified: true_or_false

addendum_record:
  path: docs/seat/measures_registry_isolated/12_directory_set_components/undrifted_lapis_encounter_article_set_and_paragraph_publication_path_addendum_v1.meta.md
  exists: true_or_false
  ready_for_upload_manifest: true_or_false

requirements_satisfied:
  undrifted_is_lapis_encounter: true_or_false
  headline_AI_isnt_broken: true_or_false
  assessment_CTA_required: true_or_false
  structural_drift_not_primary_showcase: true_or_false
  article_set_agents_fables_measures: true_or_false
  agents_with_keys_unpublished_candidate: true_or_false
  paragraph_publication_path_requires_future_oar2: true_or_false
  onsite_article_overlay_required: true_or_false
  leadership_callout_required: true_or_false

upload_manifest_update_required: true
previous_recommended_upload_count: 61
new_required_records_count: 1
recommended_upload_count_after_addendum: 62

blocking_findings:
  rows: []

## 4. Create revised manifest addendum recommendation

Create:

docs/seat/measures_registry_isolated/10_validation/measures_registry_revised_pre_upload_manifest_addendum_recommendation_v1.meta.md

Required content:

previous_confirmed_upload_count: 56
prior_launch_surface_additions_count: 5
prior_recommended_upload_count: 61
addendum_required_records_count: 1
recommended_upload_count_after_addendum: 62

new_record_to_add:
  local_path: docs/seat/measures_registry_isolated/12_directory_set_components/undrifted_lapis_encounter_article_set_and_paragraph_publication_path_addendum_v1.meta.md
  proposed_bucket_path: measures-registry/seat/current/04_directory_set/undrifted_lapis_encounter_article_set_and_paragraph_publication_path_addendum_v1.meta.md
  placement_group: seat/current/04_directory_set/
  reason: seats corrected unDrifted Lapis encounter article set, onsite reader, leadership callout, and Paragraph publication path for Agents with Keys

upload_authorized_now: false
operator_confirmation_required: true

recommended_next_oar2:
  if_addendum_confirmed: OAR2 - Confirm Revised Measures Registry SEAT Upload Manifest After Launch Surface Additions v1
  if_publication_required_before_upload: OAR2 - Publish Agents with Keys Through Paragraph Integration and Record Publication Evidence v1

## 5. Future publication path boundary

Do not publish Agents with Keys in this addendum.

Record future publication OAR2 title:

OAR2 - Publish Agents with Keys Through Paragraph Integration and Record Publication Evidence v1

Future publication OAR2 must require:

- source article file located
- operator confirms final copy
- Paragraph integration credential/path verified
- publish authorization explicit
- published Paragraph URL returned
- OAR1 publication evidence written
- Codex article registry/publication standing updated only under DB mutation OAR if needed
- unDrifted Lapis encounter display remains onsite-first

## VALIDATION RETURN

Return:

- addendum OAR2 path
- parent OAR1 verified
- addendum record path
- addendum validation report path
- revised manifest addendum recommendation path
- prior recommended upload count
- addendum records added count
- recommended upload count after addendum
- Agents with Keys standing
- Paragraph publish authorized false
- bucket upload authorized false
- no bucket upload confirmation
- no DB mutation confirmation
- no policy mutation confirmation
- no runtime mutation confirmation
- no route mutation confirmation
- no renderer mutation confirmation
- no public copy mutation confirmation
- no social posting confirmation
- no Paragraph publishing confirmation
- recommended next OAR2 title
- OAR1 path

## OAR1 CLOSEOUT

Create OAR1:

docs/seat/measures_registry_isolated/09_oar/oar1_addendum_seat_undrifted_lapis_encounter_article_set_and_paragraph_publication_path_v1.meta.md

OAR1 must report:

- addendum OAR2 path
- parent OAR1 verified
- addendum record path
- addendum validation report path
- revised manifest addendum recommendation path
- prior recommended upload count
- addendum records added count
- recommended upload count after addendum
- Agents with Keys standing
- Paragraph publish authorized false
- bucket upload authorized false
- no bucket upload confirmation
- no DB mutation confirmation
- no policy mutation confirmation
- no runtime mutation confirmation
- no route mutation confirmation
- no renderer mutation confirmation
- no public copy mutation confirmation
- no social posting confirmation
- no Paragraph publishing confirmation
- recommended next OAR2 title

## CLOSE

This addendum seats the corrected unDrifted Lapis encounter article set and the controlled Paragraph publication path for Agents with Keys.

It does not publish, upload, mutate runtime, mutate DB, or activate launch.

Codex holds.
Field structures.
Measures registers.
Chazz validates.
Cody seats addendum evidence.

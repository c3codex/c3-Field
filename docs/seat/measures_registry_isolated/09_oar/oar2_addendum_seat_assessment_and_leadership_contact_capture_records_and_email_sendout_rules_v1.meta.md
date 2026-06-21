---
document_type: oar2_addendum
authority_level: proposed
system_scope: measures_codex
title: OAR2 Addendum - Seat Assessment and Leadership Contact Capture Records and Email Sendout Rules v1
status: proposed
version: v1
operator: op044
priority: launch_contact_capture_and_email_rules_before_revised_manifest
parent_oar2:
  - docs/seat/measures_registry_isolated/09_oar/oar2_seat_measures_registry_launch_style_profiles_landing_pages_seo_paragraph_integration_and_social_campaign_before_seat_upload_v1.meta.md
  - docs/seat/measures_registry_isolated/09_oar/oar2_addendum_seat_undrifted_lapis_encounter_article_set_and_paragraph_publication_path_v1.meta.md
  - docs/seat/measures_registry_isolated/09_oar/oar2_addendum_seat_undrifted_lapis_encounter_media_map_and_9x16_style_profile_v1.meta.md
parent_oar1:
  - docs/seat/measures_registry_isolated/09_oar/oar1_seat_measures_registry_launch_style_profiles_landing_pages_seo_paragraph_integration_and_social_campaign_before_seat_upload_v1.meta.md
  - docs/seat/measures_registry_isolated/09_oar/oar1_addendum_seat_undrifted_lapis_encounter_article_set_and_paragraph_publication_path_v1.meta.md
  - docs/seat/measures_registry_isolated/09_oar/oar1_addendum_seat_undrifted_lapis_encounter_media_map_and_9x16_style_profile_v1.meta.md
terminology_boundary:
  prohibited_term_for_this_oar:
    - contract
  allowed_terms:
    - record
    - rule
    - profile
    - map
    - surface
    - requirement
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
  email_send: false
  resend_mutation: false
  social_posting: false
  paragraph_publish: false
  docs_created: true
  docs_updated: false
  docs_deleted: false
---

# OAR2 Addendum - Seat Assessment and Leadership Contact Capture Records and Email Sendout Rules v1

## OBSERVED

The launch surface package now includes additional requirements for:

- unDrifted as the Lapis encounter
- 9:16 social-first unDrifted layout
- onsite article behavior
- Paragraph publication path for Agents with Keys
- media map and style profile records
- leadership callout on the Lapis encounter

The operator clarified two additional required capture surfaces:

1. Assessment contact capture

This is tied to AI Operations Assessment completion and email-confirmed report delivery.

2. Leadership contact capture

This is tied to the unDrifted / Lapis leadership callout.

The operator also corrected terminology:

- contract is not usable for these surfaces.
- smart_contract is the only valid usage of contract in c3 Field context.
- contact capture must be seated as record, rule, profile, map, surface, or requirement.
- email behavior must be seated as email_sendout_rule, not contract.

Current need:

Seat assessment and leadership contact capture records and email sendout rules before revised SEAT upload manifest confirmation.

No email should be sent by this OAR2.

No DB table should be created by this OAR2.

No runtime submission path should be implemented by this OAR2.

## ALIGNED

This OAR2 addendum seats requirement records only.

It may:

- create assessment contact capture record requirement
- create leadership contact capture record requirement
- create email sendout rules
- create operator notification rule
- create contact capture validation report
- create revised manifest addendum recommendation
- write OAR1 evidence

It may not:

- send email
- create DB table
- mutate DB rows
- mutate policies
- mutate runtime
- mutate renderer
- mutate routes
- mutate public copy
- upload bucket files
- publish Paragraph
- post or schedule social
- activate payment
- activate MAP
- activate SEAT
- activate SEAL
- claim Registry Standing
- assign c3 Key
- activate DAO participation
- activate c3 backoffice

Authority remains:

Codex -> Field -> Measures -> OAR2 -> Chazz -> Cody -> src

Renderer rule:

Frontend may render and submit only to seated capture records and email sendout rules.

Frontend must not invent submission endpoint, DB table, email template, or consent behavior.

## ROUTED

## 1. Confirm parent standing

Confirm these parent evidence files if present:

docs/seat/measures_registry_isolated/09_oar/oar1_seat_measures_registry_launch_style_profiles_landing_pages_seo_paragraph_integration_and_social_campaign_before_seat_upload_v1.meta.md
docs/seat/measures_registry_isolated/09_oar/oar1_addendum_seat_undrifted_lapis_encounter_article_set_and_paragraph_publication_path_v1.meta.md
docs/seat/measures_registry_isolated/09_oar/oar1_addendum_seat_undrifted_lapis_encounter_media_map_and_9x16_style_profile_v1.meta.md

Record whether each is present.

Do not fail if prior media/style OAR1 is not yet present. Record pending dependency.

Confirm if available:

- bucket upload authorized: false
- runtime mutation authorized: false
- DB mutation authorized: false
- Paragraph publishing authorized: false
- social posting authorized: false

## 2. Create assessment contact capture record

Create:

docs/seat/measures_registry_isolated/12_directory_set_components/assessment_contact_capture_record_v1.meta.md

Required content:

standing:
  status: required_before_revised_SEAT_upload_manifest_confirmation
  mutation_authorized: false
  db_mutation_authorized: false
  runtime_mutation_authorized: false
  email_send_authorized_now: false
  bucket_upload_authorized_now: false

surface:
  surface_key: assessment_contact_capture
  chamber_authority: obsidian
  capture_type: assessment_result_delivery_permission
  trigger: AI Operations Assessment completed
  source_surface:
    - AI Operations Assessment
    - passage page
    - contact entry surface

function:
  - collect contact permission
  - support personalized assessment review delivery
  - support SRC1/OAR1 trace creation
  - support assessment risk factor carrythrough
  - support recommended MAP path continuity

required_fields:
  - name
  - email
  - organization_or_institution
  - role_or_title
  - organization_scope
  - consent_to_receive_assessment_review

optional_fields:
  - website
  - phone
  - preferred_contact_method
  - message

assessment_context_fields:
  - assessment_completion_state
  - AI_Deployment_Status
  - top_risk_factors
  - recommended_MAP_path
  - review_determination
  - passage_state
  - email_confirmation_state

consent_copy:
  public_text: "I consent to be contacted by Measures Registry about my AI Operations Assessment review."

public_status_copy:
  after_submit: "Your AI Environment Assessment Review is being prepared. Email confirmation is required for personalized report delivery."

does_not_create:
  - payment
  - MAP enrollment
  - SEAT
  - SEAL
  - Registry Standing
  - c3 Key
  - DAO participation
  - Branch standing
  - certification

future_DB_or_endpoint_requirement:
  preferred_path: edge_function_or_guarded_insert
  public_read_allowed: false
  public_insert_guarded: true
  consent_required: true
  email_required: true
  server_timestamp_required: true
  db_mutation_requires_future_oar2: true

## 3. Create leadership contact capture record

Create:

docs/seat/measures_registry_isolated/12_directory_set_components/undrifted_lapis_leadership_contact_capture_record_v1.meta.md

Required content:

standing:
  status: required_before_revised_SEAT_upload_manifest_confirmation
  mutation_authorized: false
  db_mutation_authorized: false
  runtime_mutation_authorized: false
  email_send_authorized_now: false
  bucket_upload_authorized_now: false

surface:
  surface_key: undrifted_lapis_leadership_contact_capture
  chamber_authority: lapis
  capture_type: leadership_relationship_request
  trigger: leadership_callout_submitted
  source_surface:
    - unDrifted Lapis encounter
    - article overlay if applicable
    - leadership callout

function:
  - collect leadership relationship request
  - support follow-up permission
  - preserve source surface context
  - support relationship continuity without activating MAP, payment, SEAT, SEAL, or Registry Standing

required_fields:
  - name
  - email
  - organization_or_institution
  - role_or_title
  - reason_for_contact
  - consent_to_be_contacted

optional_fields:
  - website
  - current_AI_use
  - preferred_contact_method
  - message
  - article_context

consent_copy:
  public_text: "I consent to be contacted by Measures Registry about leadership alignment and AI environment review."

CTA_options:
  - Connect with Measures Registry
  - Start a Leadership Conversation
  - Request Foundational Leadership Review

does_not_create:
  - payment
  - MAP enrollment
  - SEAT
  - SEAL
  - Registry Standing
  - c3 Key
  - DAO participation
  - Branch standing
  - certification

future_DB_or_endpoint_requirement:
  preferred_path: edge_function_or_guarded_insert
  public_read_allowed: false
  public_insert_guarded: true
  consent_required: true
  email_required: true
  server_timestamp_required: true
  db_mutation_requires_future_oar2: true

## 4. Create email sendout rules record

Create:

docs/seat/measures_registry_isolated/12_directory_set_components/contact_capture_email_sendout_rules_v1.meta.md

Required content:

standing:
  status: required_before_revised_SEAT_upload_manifest_confirmation
  mutation_authorized: false
  email_send_authorized_now: false
  resend_mutation_authorized: false
  runtime_mutation_authorized: false
  db_mutation_authorized: false

provider_candidate:
  provider: Resend
  from_address: connect@measuresregistry.com
  reply_to_rule: submitted_contact_email_when_available
  future_endpoint_required: true
  send_requires_future_oar2_or_runtime_activation_oar: true

assessment_contact_email:
  trigger: assessment_contact_capture_submitted_and_email_confirmation_pending_or_confirmed
  recipient: submitted_contact_email
  subject: "Your AI Environment Assessment Review is being prepared"
  body_text: |
    Hello,

    Thank you for completing the AI Operations Assessment.

    Your AI Environment Assessment Review is being prepared. Your submitted responses will be reviewed to identify operational, system, and environmental risk factors in your current AI operations context.

    This assessment does not diagnose AI behavior. It provides a reviewed intake basis for an AI Operations Assessment recommendation.

    You will receive your personalized assessment review after your email confirmation is complete.

    Measures Registry
  must_not_claim:
    - AI diagnosis
    - payment
    - MAP enrollment
    - SEAT
    - SEAL
    - Registry Standing
    - c3 Key
    - DAO participation
    - certification

leadership_contact_email:
  trigger: leadership_contact_capture_submitted
  recipient: submitted_contact_email
  subject: "Measures Registry received your leadership request"
  body_text: |
    Hello,

    Thank you for reaching out to Measures Registry.

    We received your leadership request from the unDrifted surface. Measures Registry will review your message and follow up regarding leadership alignment, AI environment review, or related institutional fit.

    This request does not create payment, MAP enrollment, SEAT, SEAL, Registry Standing, c3 Key assignment, DAO participation, or certification.

    Measures Registry
  must_not_claim:
    - payment
    - MAP enrollment
    - SEAT
    - SEAL
    - Registry Standing
    - c3 Key
    - DAO participation
    - certification

operator_notification_email:
  trigger:
    - assessment_contact_capture_submitted
    - leadership_contact_capture_submitted
  recipient: connect@measuresregistry.com
  subject: "New Measures Registry contact capture"
  body_fields:
    - capture_type
    - name
    - email
    - organization_or_institution
    - role_or_title
    - source_surface
    - timestamp
    - consent_state
    - assessment_result_or_recommended_path_if_assessment
    - risk_factors_if_assessment
    - message_or_reason_for_contact_if_leadership
    - article_context_if_available
    - trace_id_if_available
  tone: internal_functional

email_send_boundary:
  no_email_send_now: true
  no_resend_write_now: true
  no_template_deploy_now: true
  future_activation_requires:
    - endpoint_or_edge_function_confirmed
    - sender_domain_confirmed
    - public_insert_or_submission_path_seated
    - OAR2_authorizing_send_behavior
    - OAR1_returning_send_evidence

## 5. Create terminology correction record

Create:

docs/seat/measures_registry_isolated/12_directory_set_components/contact_capture_terminology_boundary_record_v1.meta.md

Required content:

standing:
  status: required_before_revised_SEAT_upload_manifest_confirmation
  mutation_authorized: false

term_boundary:
  prohibited_for_current_contact_capture_email_surfaces:
    - contact_capture_contract
    - email_sendout_contract
    - paragraph_integration_contract
    - style_contract
    - surface_contract

  reserved_valid_use:
    smart_contract:
      meaning: blockchain or code-executed agreement only
      current_contact_capture_usage_allowed: false

  use_instead:
    contact_capture_record: submitted contact and consent data requirements
    email_sendout_rule: email behavior and copy
    integration_record: Paragraph, Buffer, or provider relationship
    style_profile: visual and layout styling
    surface_record: rendered surface requirements
    media_map: media placement and resolution
    validation_record: evidence and checks
    agreement: mutual understanding between named parties where applicable
    requirement: required launch or runtime condition

blocked_substitutions:
  - contact_capture_record_as_contract
  - email_sendout_rule_as_contract
  - leadership_request_as_payment
  - assessment_contact_capture_as_MAP_enrollment
  - leadership_contact_capture_as_SEAT
  - contact_consent_as_c3_Key_assignment

## 6. Create validation report

Create:

docs/seat/measures_registry_isolated/10_validation/measures_registry_contact_capture_and_email_sendout_rules_validation_v1.meta.md

Required content:

standing:
  status: contact_capture_and_email_rules_seated
  bucket_upload_authorized_now: false
  email_send_authorized_now: false
  db_mutation_authorized: false
  runtime_mutation_authorized: false

records_created:
  assessment_contact_capture_record:
    path: docs/seat/measures_registry_isolated/12_directory_set_components/assessment_contact_capture_record_v1.meta.md
    exists: true_or_false
  leadership_contact_capture_record:
    path: docs/seat/measures_registry_isolated/12_directory_set_components/undrifted_lapis_leadership_contact_capture_record_v1.meta.md
    exists: true_or_false
  email_sendout_rules_record:
    path: docs/seat/measures_registry_isolated/12_directory_set_components/contact_capture_email_sendout_rules_v1.meta.md
    exists: true_or_false
  terminology_boundary_record:
    path: docs/seat/measures_registry_isolated/12_directory_set_components/contact_capture_terminology_boundary_record_v1.meta.md
    exists: true_or_false

requirements_satisfied:
  assessment_contact_capture_seated: true_or_false
  leadership_contact_capture_seated: true_or_false
  email_sendout_rules_seated: true_or_false
  operator_notification_rule_seated: true_or_false
  contract_term_removed: true_or_false
  no_email_send_now: true_or_false
  no_db_mutation_now: true_or_false
  no_runtime_mutation_now: true_or_false

future_required_oar2:
  DB_or_endpoint: OAR2 - Seat Measures Registry Contact Capture Submission Endpoint and Guarded Insert Path v1
  email_send_activation: OAR2 - Activate Measures Registry Contact Capture Email Sendout Through Resend v1

upload_manifest_update_required: true
previous_recommended_upload_count: 66
new_required_records_count: 4
recommended_upload_count_after_contact_email_addendum: 70

blocking_findings:
  rows: []

## 7. Create revised manifest contact/email addendum recommendation

Create:

docs/seat/measures_registry_isolated/10_validation/measures_registry_revised_pre_upload_manifest_contact_email_addendum_recommendation_v1.meta.md

Required content:

previous_confirmed_upload_count: 56
prior_launch_surface_additions_count: 5
prior_article_addendum_count: 1
prior_media_style_addendum_count: 4
prior_recommended_upload_count: 66
contact_email_addendum_required_records_count: 4
recommended_upload_count_after_contact_email_addendum: 70

new_records_to_add:
  - local_path: docs/seat/measures_registry_isolated/12_directory_set_components/assessment_contact_capture_record_v1.meta.md
    proposed_bucket_path: measures-registry/seat/current/04_directory_set/assessment_contact_capture_record_v1.meta.md
    placement_group: seat/current/04_directory_set/
    reason: seats Obsidian assessment contact capture requirements for report delivery permission

  - local_path: docs/seat/measures_registry_isolated/12_directory_set_components/undrifted_lapis_leadership_contact_capture_record_v1.meta.md
    proposed_bucket_path: measures-registry/seat/current/04_directory_set/undrifted_lapis_leadership_contact_capture_record_v1.meta.md
    placement_group: seat/current/04_directory_set/
    reason: seats Lapis leadership relationship request capture requirements

  - local_path: docs/seat/measures_registry_isolated/12_directory_set_components/contact_capture_email_sendout_rules_v1.meta.md
    proposed_bucket_path: measures-registry/seat/current/04_directory_set/contact_capture_email_sendout_rules_v1.meta.md
    placement_group: seat/current/04_directory_set/
    reason: seats email sendout rules for assessment and leadership captures without activating email send

  - local_path: docs/seat/measures_registry_isolated/12_directory_set_components/contact_capture_terminology_boundary_record_v1.meta.md
    proposed_bucket_path: measures-registry/seat/current/04_directory_set/contact_capture_terminology_boundary_record_v1.meta.md
    placement_group: seat/current/04_directory_set/
    reason: removes unusable contract terminology from current contact capture and email surfaces

upload_authorized_now: false
operator_confirmation_required: true

recommended_next_oar2:
  title: OAR2 - Confirm Revised Measures Registry SEAT Upload Manifest After Launch Surface Additions v1

## 8. Boundary

Do not send email.

Do not create DB endpoint.

Do not mutate runtime.

Do not upload.

Do not activate launch.

## VALIDATION RETURN

Return:

- addendum OAR2 path
- assessment contact capture record path
- leadership contact capture record path
- email sendout rules record path
- terminology boundary record path
- validation report path
- revised manifest contact/email recommendation path
- prior recommended upload count
- contact/email records added count
- recommended upload count after contact/email addendum
- assessment email subject
- leadership email subject
- contract term removed confirmation
- email send authorized false
- bucket upload authorized false
- DB mutation authorized false
- runtime mutation authorized false
- no bucket upload confirmation
- no DB mutation confirmation
- no policy mutation confirmation
- no runtime mutation confirmation
- no route mutation confirmation
- no renderer mutation confirmation
- no public copy mutation confirmation
- no social posting confirmation
- no Paragraph publishing confirmation
- no email send confirmation
- recommended next OAR2 title
- OAR1 path

## OAR1 CLOSEOUT

Create OAR1:

docs/seat/measures_registry_isolated/09_oar/oar1_addendum_seat_assessment_and_leadership_contact_capture_records_and_email_sendout_rules_v1.meta.md

OAR1 must report:

- addendum OAR2 path
- assessment contact capture record path
- leadership contact capture record path
- email sendout rules record path
- terminology boundary record path
- validation report path
- revised manifest contact/email recommendation path
- prior recommended upload count
- contact/email records added count
- recommended upload count after contact/email addendum
- assessment email subject
- leadership email subject
- contract term removed confirmation
- email send authorized false
- bucket upload authorized false
- DB mutation authorized false
- runtime mutation authorized false
- no bucket upload confirmation
- no DB mutation confirmation
- no policy mutation confirmation
- no runtime mutation confirmation
- no route mutation confirmation
- no renderer mutation confirmation
- no public copy mutation confirmation
- no social posting confirmation
- no Paragraph publishing confirmation
- no email send confirmation
- recommended next OAR2 title

## CLOSE

This addendum seats assessment and leadership contact capture records and email sendout rules.

It does not send email, create endpoints, mutate runtime, mutate DB, or upload bucket files.

Codex holds.
Field structures.
Measures registers.
Chazz validates.
Cody seats addendum evidence.

---
document_type: oar2
authority_level: proposed
system_scope: measures_codex
title: OAR2 - Seat Role Key Assignment and Callable Chazz Role Registry for c3 TREE Intake v1
status: proposed
version: v1
operator: op044
priority: system_intel_capture_held_until_payload_review
standing:
  system_intel_capture: true
  role_key_registry_required: true
  callable_Chazz_role_registry_required: true
  held_until_payload_review: true
  held_for_mr_backoffice: true
  runtime_active: false
  backoffice_active: false
mutation_scope:
  local_docs_mutation: true
  process_intel_capture: true
  role_key_registry_design: true
  callable_Chazz_role_registry_design: true
  runtime_activation: false
  backoffice_runtime_activation: false
  database: false
  policies: false
  rows: false
  rls: false
  routes: false
  renderer: false
  public_copy: false
  bucket_upload: false
  bucket_access: false
  payment_activation: false
  stripe_activation: false
  paragraph_publish: false
  social_posting: false
  social_scheduling: false
  buffer_activation: false
  email_send: false
---

# OAR2 - Seat Role Key Assignment and Callable Chazz Role Registry for c3 TREE Intake v1

## OBSERVED

The c3 TREE runtime intake pattern is now visible.

Any login or communication may come from:

- operator
- branch
- contributor
- registered system
- SEAT
- MAP
- client representative
- survey surface login
- payment receipt flow
- live review call request

The communication calls Chazz.

The communication alone does not determine authority.

The system requires role_key + thread + env_key where applicable to determine:

- whether status only is appropriate
- whether guided survey is required
- whether live call scheduling is required
- whether report delivery is required
- whether OAR2 is required
- whether operator approval is required
- whether NotChazz may clear transfer to Cody

The missing layer is the registry that defines:

- who can receive a role_key
- who creates a role_key
- what a role_key authorizes
- which Chazz_role may be called
- which actions each Chazz_role may prepare
- which routes require env_key
- which routes require operator approval
- which routes are held until Measures Registry SEAT approval

## ALIGNED

This OAR2 seats system/intel only.

This OAR2 defines the role_key assignment model and callable Chazz_role registry.

This OAR2 is held until payload review completes.

This OAR2 does not activate backoffice.

This OAR2 does not create live role keys.

This OAR2 does not mutate DB, policies, rows, RLS, runtime, routes, renderer, bucket, public copy, payment, Stripe, social, Buffer, Paragraph, or email.

Authority remains:

Codex -> Field -> Measures -> OAR2 -> Chazz -> NotChazz -> Cody -> OAR1

Chazz is the only public-facing AI actor.

NotChazz remains internal system process.

Cody remains internal Codex role-called AI execution actor.

## CORE RULE

core_rule: |
  A role_key does not call Cody.

  A role_key calls a permitted Chazz_role.

  The Chazz_role determines the next route from role_key, thread, env_key, identity standing, and current surface context.

  If execution is required, Chazz prepares OAR2.

  OAR2 calls NotChazz.

  NotChazz validates role_key, thread scope, env_key, and authority boundary.

  If cleared, NotChazz transfers to Cody.

  Cody executes only the validated OAR2 and writes OAR1.

## ROLE KEY REGISTRY MODEL

role_key_registry:
  authority_source: Codex
  rendered_by: Chazz
  validated_by: NotChazz
  executed_by: Cody_if_OAR2_required

  role_key_function:
    - authorize_which_Chazz_role_can_be_called
    - bind_identity_context_to_callable_role
    - bind_thread_context_to_route_scope
    - prevent_generic_chat_authority
    - prevent_direct_Cody_execution
    - prevent_bypass_of_NotChazz

  role_key_does_not:
    - create_authority_by_itself
    - grant_Field_access_by_itself
    - bypass_env_key
    - bypass_NotChazz
    - authorize_Cody_directly
    - create_payment_authority
    - create_SEAT_SEAL_or_Registry_Standing
    - create_c3_key_DAO_or_Branch_standing

  must_define:
    - role_key_id
    - assigned_to_identity_type
    - assigned_to_entity_key
    - allowed_Chazz_roles
    - allowed_surfaces
    - allowed_actions
    - required_env_key
    - required_thread_context
    - authority_scope
    - expiration_or_review_state
    - escalation_rule
    - revocation_rule
    - OAR1_trace_required

## ROLE KEY ASSIGNMENT RULE

role_key_assignment:
  created_by:
    - Codex_record
    - approved_intake_event
    - operator_authorized_assignment
    - system_registered_status
    - MAP_payment_or_review_event_when_later_authorized
    - survey_surface_login_event_when_later_authorized

  assignment_requires:
    - identity_or_contact_record
    - thread_context
    - allowed_role_scope
    - current_surface_context
    - env_key_if_existing_environment
    - OAR1_trace_if_created_by_system_event

  assignment_states:
    candidate:
      meaning: recognized but not authorized for execution routes
    active:
      meaning: may call permitted Chazz_roles within scope
    held:
      meaning: valid but cannot call active route yet
    expired:
      meaning: no longer callable
    revoked:
      meaning: blocked
    requires_operator_review:
      meaning: standing unclear or authority-bearing exception detected

## ASSIGNMENT CLASSES

assignment_classes:
  operator:
    assigned_to: op044
    allowed_Chazz_roles:
      - Chazz_Operator
      - Chazz_OAR
      - Chazz_Report
      - Chazz_TREE
    required_env_key: false_unless_environment_specific
    can_request_operator_authority_decision: true

  MAP_client_representative:
    assigned_to: organization_representative
    allowed_Chazz_roles:
      - Chazz_MAP
      - Chazz_Guide
      - Chazz_Report
    required_env_key: true_after_contact_or_assessment_trace
    can_request:
      - guided_environment_survey
      - live_review_call
      - report_status
      - payment_status_if_boundary_seated
    cannot_request:
      - SEAT_activation
      - SEAL
      - Registry_Standing
      - c3_key
      - DAO_participation
      - Branch_standing

  registered_system:
    assigned_to: registered_system_key
    allowed_Chazz_roles:
      - Chazz_Guide
      - Chazz_Report
      - Chazz_Status
    expanded_roles_require:
      - env_key
      - registry_standing
      - explicit_role_scope

  contributor:
    assigned_to: contributor_key
    allowed_Chazz_roles:
      - Chazz_Guide
      - Chazz_Report
    expanded_roles_require:
      - contribution_context
      - operator_or_registry_approval

  branch:
    assigned_to: branch_key
    allowed_Chazz_roles:
      - Chazz_Guide
      - Chazz_Report
      - Chazz_OAR
      - Chazz_TREE
    requires:
      - branch_standing
      - env_key
      - role_scope

  SEAT_context:
    assigned_to: SEAT_candidate_or_review_key
    allowed_Chazz_roles:
      - Chazz_SEAT
      - Chazz_Report
    standing: held_until_authorized
    cannot_activate:
      - SEAT
      - SEAL
      - Registry_Standing

  MAP_context:
    assigned_to: MAP_review_key
    allowed_Chazz_roles:
      - Chazz_MAP
      - Chazz_Report
      - Chazz_Guide
    may_route_to:
      - guided_survey
      - live_review_call
      - report_preparation
      - payment_boundary_status

## CALLABLE CHAZZ ROLE REGISTRY

callable_Chazz_roles:
  Chazz_Guide:
    purpose: general orientation_status_help
    public_facing: true
    can_route_to:
      - status_only
      - guided_survey
      - live_call
      - report_status
      - operator_review_if_needed
    cannot:
      - execute
      - mutate
      - activate_payment
      - activate_SEAT
      - call_Cody_directly

  Chazz_OAR:
    purpose: prepare_OAR2_from_approved_standing
    public_facing: limited_operator_or_authorized_context
    requires:
      - role_key
      - thread
      - env_key_if_environment_specific
    can_route_to:
      - NotChazz_transfer_validation
    cannot:
      - execute
      - bypass_NotChazz
      - call_Cody_without_OAR2
      - create_authority_not_seated

  Chazz_MAP:
    purpose: MAP_intake_review_pathway
    public_facing: true
    can_route_to:
      - guided_environment_survey
      - live_review_call
      - report_preparation
      - payment_boundary_status
      - MAP_status
    cannot:
      - activate_SEAT
      - activate_SEAL
      - grant_Registry_Standing
      - create_c3_key
      - create_DAO_or_Branch_standing

  Chazz_SEAT:
    purpose: SEAT_alignment_status_only_until_authorized
    public_facing: limited
    standing: held_until_authorized
    can_route_to:
      - status_only
      - operator_review
      - SEAT_readiness_summary
    cannot_activate:
      - SEAT
      - SEAL
      - Registry_Standing
      - c3_key
      - DAO_participation
      - Branch_standing

  Chazz_Operator:
    purpose: op044_internal_operator_review
    public_facing: operator_only
    can_route_to:
      - OAR2_review
      - disposition_surface
      - process_boundary_review
      - approval_capture
      - system_intel_capture
    cannot:
      - bypass_NotChazz_for_execution
      - authorize_Cody_without_OAR2

  Chazz_Report:
    purpose: front_facing_or_operator_safe_status_communication
    public_facing: true
    can_route_to:
      - client_safe_summary
      - operator_safe_summary
      - report_status
      - next_step_summary
    must_suppress:
      - NotChazz
      - Cody
      - internal_process_mechanics
      - OAR_implementation_seams
    cannot:
      - expose_internal_process_on_front_facing_surface

  Chazz_TREE:
    purpose: runtime_intake_routing_across_login_and_communication_surfaces
    public_facing: controlled
    can_route_to:
      - status_only
      - Chazz_Guide
      - Chazz_MAP
      - Chazz_Report
      - Chazz_OAR_if_execution_required
      - operator_review_if_authority_bearing
    requires:
      - role_key
      - thread
      - current_surface_context
      - env_key_if_existing

  Chazz_Status:
    purpose: read_current_standing_without_execution
    public_facing: true
    can_route_to:
      - status_only
      - next_safe_action
    cannot:
      - prepare_execution_OAR2
      - mutate
      - activate
      - call_Cody

## ROUTE DETERMINATION LOGIC

route_determination:
  inputs:
    - role_key
    - thread
    - env_key_if_existing
    - current_surface_context
    - identity_or_contact_standing
    - release_state
    - dependency_state

  possible_outputs:
    status_only:
      requires_OAR2: false

    guided_survey_required:
      requires_OAR2: false_unless_new_surface_or_delivery_required

    live_call_should_be_scheduled:
      requires_OAR2: false_unless_calendar_or_email_automation_activation_required

    report_delivery_required:
      requires_OAR2: true_if_delivery_mutates_record_or_sends_email

    OAR2_required:
      requires_NotChazz_validation: true
      may_call_Cody_after_clearance: true

    operator_review_required:
      reason:
        - authority_bearing_decision
        - exception_to_policy
        - activation
        - release
        - pricing
        - legal_claim
        - mutation_boundary

    blocked:
      reason:
        - invalid_role_key
        - missing_env_key
        - thread_scope_mismatch
        - held_scope_attempted_as_active
        - public_internal_boundary_violation

## NOTCHAZZ VALIDATION FOR ROLE KEY ROUTING

NotChazz_role_key_validation:
  validates:
    - role_key_exists
    - role_key_active_or_candidate_as_allowed
    - Chazz_role_allowed_for_role_key
    - thread_scope_matches_role_key
    - env_key_present_when_required
    - requested_route_within_allowed_actions
    - no_hidden_authority_change
    - no_direct_Cody_call
    - no_public_exposure_of_internal_actor
    - no_held_scope_activation

  classifications:
    clear_to_Chazz_role:
      meaning: communication can proceed through permitted Chazz_role

    clear_to_Cody_transfer:
      meaning: OAR2 applies seated authority and may transfer after validation

    return_to_Chazz_for_reframe:
      meaning: Chazz must adjust route or report language

    return_to_operator:
      meaning: new authority-bearing decision required

    block:
      meaning: invalid role_key or route violation

## ROUTED

1. Create role key assignment rule record.

Create:

docs/seat/measures_registry_isolated/10_validation/role_key_assignment_rule_for_c3_tree_intake_v1.meta.md

Required content:

standing:
  status: system_intel_seated
  held_until_payload_review: true
  held_for_mr_backoffice: true
  runtime_active: false
  backoffice_active: false

role_key_function:
  - authorize_callable_Chazz_roles
  - bind_identity_context
  - bind_thread_context
  - prevent_generic_chat_authority
  - prevent_direct_Cody_execution

assignment_states:
  - candidate
  - active
  - held
  - expired
  - revoked
  - requires_operator_review

2. Create callable Chazz role registry record.

Create:

docs/seat/measures_registry_isolated/10_validation/callable_chazz_role_registry_for_c3_tree_intake_v1.meta.md

Required content:

standing:
  status: system_intel_seated
  held_until_payload_review: true
  held_for_mr_backoffice: true
  runtime_active: false
  backoffice_active: false

callable_roles:
  - Chazz_Guide
  - Chazz_OAR
  - Chazz_MAP
  - Chazz_SEAT
  - Chazz_Operator
  - Chazz_Report
  - Chazz_TREE
  - Chazz_Status

rule:
  role_key_calls_Chazz_role: true
  role_key_does_not_call_Cody: true
  Chazz_role_does_not_execute: true
  OAR2_required_for_Cody_execution: true
  NotChazz_required_for_transfer_validation: true

3. Create role key to Chazz role assignment matrix.

Create:

docs/seat/measures_registry_isolated/10_validation/role_key_to_chazz_role_assignment_matrix_v1.meta.md

Required content:

standing:
  status: system_intel_seated
  held_until_payload_review: true
  held_for_mr_backoffice: true

assignment_matrix:
  operator:
    - Chazz_Operator
    - Chazz_OAR
    - Chazz_Report
    - Chazz_TREE

  MAP_client_representative:
    - Chazz_MAP
    - Chazz_Guide
    - Chazz_Report

  registered_system:
    - Chazz_Guide
    - Chazz_Report
    - Chazz_Status

  contributor:
    - Chazz_Guide
    - Chazz_Report

  branch:
    - Chazz_Guide
    - Chazz_Report
    - Chazz_OAR
    - Chazz_TREE

  SEAT_context:
    - Chazz_SEAT
    - Chazz_Report

  MAP_context:
    - Chazz_MAP
    - Chazz_Report
    - Chazz_Guide

4. Create TREE route determination rule record.

Create:

docs/seat/measures_registry_isolated/10_validation/c3_tree_route_determination_from_role_key_thread_env_key_v1.meta.md

Required content:

standing:
  status: system_intel_seated
  held_until_payload_review: true
  held_for_mr_backoffice: true

route_inputs:
  - role_key
  - thread
  - env_key_if_existing
  - current_surface_context
  - identity_or_contact_standing
  - release_state
  - dependency_state

route_outputs:
  - status_only
  - guided_survey_required
  - live_call_should_be_scheduled
  - report_delivery_required
  - OAR2_required
  - operator_review_required
  - blocked

5. Create NotChazz role key validation rule record.

Create:

docs/seat/measures_registry_isolated/10_validation/notchazz_role_key_validation_for_chazz_role_calls_v1.meta.md

Required content:

standing:
  status: system_intel_seated
  held_until_payload_review: true
  held_for_mr_backoffice: true

validates:
  - role_key_exists
  - role_key_state
  - Chazz_role_allowed_for_role_key
  - thread_scope_matches
  - env_key_present_when_required
  - requested_route_within_allowed_actions
  - no_direct_Cody_call
  - no_held_scope_activation

classification:
  - clear_to_Chazz_role
  - clear_to_Cody_transfer
  - return_to_Chazz_for_reframe
  - return_to_operator
  - block

6. Create front-facing operator report.

Create:

docs/seat/measures_registry_isolated/10_validation/front_facing_operator_report_role_key_chazz_role_registry_capture_v1.meta.md

Required content must suppress NotChazz and Cody.

Required language:

# Measures Registry TREE Intake - Role Key and Chazz Role Registry Captured

Chazz has captured the next TREE intake requirement.

Future login and communication surfaces need a role key registry that defines which Chazz role may respond, what route may be prepared, and when additional approval or system action is required.

The captured model distinguishes:

- who is communicating
- what role key they hold
- what thread or environment context applies
- which Chazz role can be called
- whether the next step is status, guided survey, live call scheduling, report delivery, OAR2, operator review, or block

This is system/intel only.

No role keys were activated.

No backoffice was built.

No runtime, payment, upload, database, or public release action occurred.

7. Create internal process report.

Create:

docs/seat/measures_registry_isolated/10_validation/internal_process_report_role_key_chazz_role_registry_capture_v1.meta.md

Required content may preserve internal trace:

standing:
  status: internal_process_report
  held_until_payload_review: true
  held_for_mr_backoffice: true

internal_trace:
  role_key_calls_Chazz_role: true
  Chazz_role_determines_route: true
  OAR2_calls_NotChazz: true
  NotChazz_validates_env_key_and_transfer: true
  Cody_executes_only_validated_OAR2: true
  Cody_writes_OAR1: true

8. Create validation record.

Create:

docs/seat/measures_registry_isolated/10_validation/role_key_and_callable_chazz_role_registry_capture_validation_v1.meta.md

Required content:

standing:
  status: system_intel_validated
  held_until_payload_review: true
  held_for_mr_backoffice: true
  runtime_active: false
  backoffice_active: false

validation_result:
  role_key_assignment_rule_created: true
  callable_Chazz_role_registry_created: true
  assignment_matrix_created: true
  TREE_route_determination_rule_created: true
  NotChazz_role_key_validation_rule_created: true
  front_facing_operator_report_created: true
  internal_process_report_created: true
  role_key_does_not_call_Cody: true
  Chazz_role_does_not_execute: true
  OAR2_required_for_Cody_execution: true
  held_until_payload_review: true

recommended_next_oar2:
  title: OAR2 - Continue Measures Registry Payload Review Before Role Key Registry Implementation v1

9. Create OAR1 closeout.

Create:

docs/seat/measures_registry_isolated/09_oar/oar1_seat_role_key_assignment_and_callable_chazz_role_registry_for_c3_tree_intake_v1.meta.md

OAR1 must report:

- source OAR2 path
- role key assignment rule path
- callable Chazz role registry path
- role key to Chazz role assignment matrix path
- TREE route determination rule path
- NotChazz role key validation rule path
- front-facing operator report path
- internal process report path
- validation path
- role key does not call Cody true
- Chazz role does not execute true
- OAR2 required for Cody execution true
- NotChazz required for transfer validation true
- held until payload review true
- held for MR backoffice true
- runtime active false
- backoffice active false
- no bucket upload confirmation
- no bucket access confirmation
- no DB mutation confirmation
- no RLS mutation confirmation
- no runtime mutation confirmation
- no route mutation confirmation
- no renderer mutation confirmation
- no public copy mutation confirmation
- no payment activation confirmation
- no Stripe activation confirmation
- no social posting confirmation
- no social scheduling confirmation
- no Buffer activation confirmation
- no Paragraph publishing confirmation
- no email send confirmation
- recommended next OAR2 title

Recommended next OAR2 title:

OAR2 - Continue Measures Registry Payload Review Before Role Key Registry Implementation v1

## VALIDATION RETURN

Return:

- status
- role key assignment rule path
- callable Chazz role registry path
- assignment matrix path
- TREE route determination rule path
- NotChazz role key validation rule path
- front-facing operator report path
- internal process report path
- validation path
- held until payload review true/false
- recommended next OAR2 title
- OAR1 path

## CLOSE

This OAR2 captures role_key assignment and callable Chazz_role registry requirements for c3 TREE intake.

It is system/intel only.

It is held until payload review.

It does not create live role keys.

It does not build backoffice.

It does not activate runtime.

It does not mutate DB, policies, routes, renderer, bucket, payment, Stripe, social, Buffer, Paragraph, or email.

Codex holds.
Field structures.
Measures registers.
role_key calls permitted Chazz_role.
Chazz_role determines route.
OAR2 calls NotChazz.
NotChazz validates.
Cody executes only validated OAR2.

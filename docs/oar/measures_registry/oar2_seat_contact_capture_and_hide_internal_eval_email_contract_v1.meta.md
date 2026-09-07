---
document_type: oar2
authority_level: working
document_scope: measures_registry_registered_runtime
title: OAR2 — Seat Contact Capture and Hide Internal Eval Email Contract
status: proposed
version: v1
operator: op044
system: measures_registry
source_oar1:
  - docs/oar/measures_registry/oar1_seat_partial_src_contact_capture_and_assessment_scoring_contract_v1.meta.md
  - docs/oar/measures_registry/oar1_read_only_db_contract_for_eval_email_capture_and_assessment_flow_v1.meta.md
  - docs/oar/measures_registry/oar1_read_only_styling_contract_audit_from_passage_surfaces_forward_v1.meta.md
  - docs/oar/measures_registry/oar1_create_minimal_contract_native_css_layer_for_registered_runtime_v1.meta.md
source_contract:
  - measures_registry_sitewide_style_contract
  - connect_src
  - measures_eval_email_contract
  - measures_phases_reveal
executor_candidate:
  - claude_vs
tags:
  - oar2
  - measures-registry
  - connect-src
  - partial-src
  - contact-capture
  - internal-contract
  - email-contract
  - public-flow
  - codex-first
---

# OAR2 — Seat Contact Capture and Hide Internal Eval Email Contract

## OBSERVED

Runtime flow currently exposes:

    measures_eval_email_contract

as a public page after contact capture.

Operator clarification:

    registered does not mean encountered.

`measures_eval_email_contract` is not a public encounter surface.

It is an internal registered email/package contract that defines what assessment package will be sent after evaluation.

The public user has already been told on `connect_src` that the assessment is being prepared. Showing a second page titled:

    Measures Evaluation Email Contract

exposes internal contract language and creates public-flow drift.

Correct distinction:

    connect_src
        = public partial SRC contact capture
        = captures/retains contact information
        = tells user assessment is being prepared
        = references internal email package contract

    measures_eval_email_contract
        = internal registered email package contract
        = governs what will be sent
        = remains registered
        = not directly encountered in public forward flow

    measures_phases_reveal
        = next public surface after contact capture submit

Correct public route:

    final assessment question
        -> connect_src
        -> contact submit
        -> measures_phases_reveal

Internal contract relation:

    connect_src submit
        -> stores contact / partial SRC standing
        -> binds or references measures_eval_email_contract
        -> routes public user to measures_phases_reveal

## ALIGNED

This OAR seats the public contact capture contract and removes the internal email contract from public encounter flow.

Do not delete `measures_eval_email_contract`.

Do not deactivate `measures_eval_email_contract` unless explicitly required by public visibility policy and reported.

Do not implement email dispatch.

Do not expose payment logic.

Do not change assessment scoring.

Do not change assessment questions.

Do not change contact field requirements unless seating clarifies existing fields.

Do not edit the old monolithic runtime:

    src/measures_registry/MeasuresRegistryRuntime.tsx

Do not rewrite `src/index.css`.

All public-facing changes must be seated in DB/metadata before renderer/runtime changes.

## ROUTED

## PART 1 — Seat connect_src as public partial SRC contact capture

### 1. Inspect current connect_src contract

Inspect DB row:

    measures_encounter_def.encounter_key = 'connect_src'

Return current:

- display_title
- function_layer
- state_expression
- renderer
- is_active
- release/access standing if available
- metadata.title
- metadata.eyebrow
- metadata.subtitle
- metadata.cta_primary
- metadata.soft_src_fields
- metadata.route_after_capture
- metadata.standing
- metadata.layout_contract
- metadata.styling_contract
- metadata.branding_contract
- metadata.footer_contract
- metadata.internal_contract_refs if present
- metadata.email_contract if present
- metadata.encounter_isolation_contract
- metadata.source_sitewide_contract

### 2. Seat connect_src public contact capture contract

Update `connect_src` metadata as needed.

Required standing:

    function_layer: intake
    standing: partial_src_contact_capture
    public_encounter: true
    renderer: soft_src_intake_surface
    route_after_capture: measures_phases_reveal

Required purpose:

    Captures contact information after evaluation completion so the completed assessment package and recommended structural response can be sent.

Required fields:

    soft_src_fields:
      - institution_name
      - institution_type
      - contact_name
      - contact_email

Required copy:

    eyebrow:
    ASSESSMENT PACKAGE DELIVERY

    title:
    Your Assessment is Being Prepared

    subtitle:
    Enter the contact information where the completed assessment package and recommended structural response should be sent.

    form_legend:
    Contact Information

    cta_primary:
    Continue

Do not make this a pre-assessment gate.

Do not route this back to `measures_assessment`.

### 3. Seat connect_src layout/styling contract

Update or confirm:

    layout_contract:
      layout_mode: compact_partial_src_capture
      viewport_fit: single_screen
      copy_position: top_or_left
      form_position: contained_panel
      cta_placement: below_form
      footer_visibility: visible
      branding_visibility: visible
      mobile_layout: single_column_scroll_allowed

    styling_contract:
      material_family: obsidian
      surface_mode: partial_src_contact_capture
      form_style: governed_identity_capture
      copy_density: restrained
      answer_option_style: not_applicable

    branding_contract:
      brand_visible: true
      brand_label: Measures Registry
      header_mode: downstream_governed
      registry_mark_visible: true

    footer_contract:
      footer_visible: true

Use existing contract shape where possible. Do not create an incompatible metadata structure if a seated pattern already exists.

### 4. Seat internal contract reference

`connect_src` should reference the internal email/package contract without displaying it as a public page.

Add or confirm metadata field such as:

    internal_contract_refs:
      email_package_contract: measures_eval_email_contract

or use existing `email_contract` field if already seated.

Required meaning:

    connect_src submit uses measures_eval_email_contract as internal package-governance reference.

Do not expose the internal contract title in public UI.

## PART 2 — Keep measures_eval_email_contract registered but non-encountered

### 5. Inspect current measures_eval_email_contract

Inspect DB row:

    measures_encounter_def.encounter_key = 'measures_eval_email_contract'

Return current:

- display_title
- function_layer
- state_expression
- renderer
- is_active
- metadata.title
- metadata.eyebrow
- metadata.subtitle
- metadata.route_after_capture
- metadata.transition_contract
- metadata.email_delivery_contract
- metadata.public_encounter if present
- metadata.internal_only if present
- metadata.encounter_isolation_contract
- metadata.source_sitewide_contract

### 6. Seat internal-only standing

Update `measures_eval_email_contract` metadata as needed:

    public_encounter: false
    internal_only: true
    contract_role: email_package_delivery_contract
    encountered_in_public_flow: false

Preserve:

    email_delivery_contract.contract_type: assessment_package_delivery
    dispatch_implementation: deferred
    includes: recommended_structural_response
    requires:
      - completed_assessment
      - recipient_email
      - recommended_structural_response_generated
      - reserve_seat_route_available

Do not implement dispatch.

Do not delete the renderer unless unused and explicitly safe.

Do not display full report or public title.

### 7. Reconcile route expectations

Current or prior metadata may contain:

    route_after_capture: measures_phases_reveal
    transition_contract.route_expectation: measures_eval_email_contract -> reserve_seat

This is stale/conflicting if present.

Correct standing:

    public forward route:
      connect_src -> measures_phases_reveal

    internal contract relation:
      connect_src references measures_eval_email_contract

    measures_eval_email_contract:
      no public forward route required

If `transition_contract.route_expectation` conflicts with this, update it to mark internal-only or remove the public route expectation if metadata shape allows.

Do not route public users to `reserve_seat` from the internal email contract.

## PART 3 — Runtime correction

### 8. Update contact submit route

Inspect clean registered runtime:

    src/measures_registry/registered_runtime/MeasuresRegistryRuntimeRegistered.tsx

Current behavior likely:

    submitContactCapture
        -> navigate("measures_eval_email_contract")

Correct behavior:

    submitContactCapture
        -> persist/hold contact data
        -> bind/reference internal measures_eval_email_contract
        -> navigate("measures_phases_reveal")

Do not change contact field validation.

Do not change assessment result generation.

Do not change scoring.

### 9. Remove public forward navigation to measures_eval_email_contract

Ensure no public forward flow navigates to:

    measures_eval_email_contract

from:

- measures_assessment final question
- structured_eval final question
- connect_src submit
- passage surfaces
- phase reveal

Direct URL access behavior:

If user manually visits:

    ?surface=measures_eval_email_contract

then either:

A. render a protected/held internal contract notice, or
B. redirect to measures_phases_reveal, or
C. render nothing public and report internal-only standing

Choose the smallest safe correction aligned with existing runtime pattern.

Do not remove registered handling unless it breaks direct-link compatibility.

### 10. Keep measures_eval_email_contract available as internal data

Runtime may continue to load the encounter row.

Runtime may use it for:

- package contract definition
- future dispatch logic
- internal package construction
- audit trace

Runtime must not show it as public user-facing page in the normal forward flow.

## PART 4 — CSS / visual correction for contact capture

### 11. Style connect_src through contract-native CSS layer

Use:

    src/measures_registry/registered_runtime/styles/

Do not expand `src/index.css`.

If not already present, create or use:

    styles/encounters/contact_capture.css

and import from:

    registry.runtime.css

Required visual result:

- compact partial SRC capture
- obsidian surface
- Measures Registry branding visible
- contact form visible without excessive empty top space
- controlled form width
- readable labels and inputs
- CTA below form
- footer visible
- no raw-page sprawl
- single-screen desktop fit where practical
- mobile scroll allowed

Do not change behavior.

## PART 5 — Footer boundary

### 12. Preserve footer boundary

Footer/copyright hidden:

- ai_isnt_broken_intro
- evaluate_structure_path

Footer/copyright visible from:

- eval_passage
- structure_passage
- measures_assessment
- structured_eval
- connect_src
- measures_phases_reveal
- downstream public surfaces

No footer requirement for internal-only `measures_eval_email_contract` because it should not be encountered in public flow.

## PART 6 — Validation

### 13. Build validation

Run:

    npm run build:registry

Return clean build result.

### 14. Browser QA

Validate public flow:

    intro
        -> eval_passage
        -> measures_assessment
        -> connect_src
        -> measures_phases_reveal

Expected:

- connect_src appears after final assessment question
- connect_src is compact and governed
- connect_src shows contact form
- connect_src has Measures Registry branding
- connect_src has footer
- contact submit does NOT show measures_eval_email_contract
- contact submit routes directly to measures_phases_reveal

Validate right branch if practical:

    intro
        -> structure_passage
        -> structured_eval
        -> connect_src
        -> measures_phases_reveal

Validate direct URL:

    ?surface=measures_eval_email_contract

Expected:

- not exposed as normal public encounter
- either held/internal notice or redirected according to implemented safe behavior

## DO NOT

- delete measures_eval_email_contract
- implement email dispatch
- expose payment logic
- change scoring
- change assessment questions
- change answer values
- change contact field requirements unless seating existing fields
- edit old MeasuresRegistryRuntime.tsx
- rewrite src/index.css
- hardcode public copy in renderer
- expose internal contract title as public UI
- route public users from connect_src to measures_eval_email_contract

## VALIDATION REQUIRED

Return:

- DB rows inspected
- DB rows modified
- connect_src before/after contract
- measures_eval_email_contract before/after contract
- internal contract reference field used
- runtime files modified
- CSS files created/modified
- contact submit old route
- contact submit new route
- direct URL behavior for measures_eval_email_contract
- public flow browser QA result
- right branch browser QA result if performed
- build result
- confirmation no scoring changes
- confirmation no question changes
- confirmation no email dispatch
- confirmation old runtime not edited
- confirmation src/index.css not expanded
- confirmation internal email contract remains registered but not publicly encountered

## SUCCESS CONDITION

`connect_src` is seated and rendered as the public partial SRC contact capture surface.

`measures_eval_email_contract` remains registered as an internal email package contract.

Public users no longer encounter the internal email contract page.

After contact submit, the public flow routes directly to:

    measures_phases_reveal

Build remains clean and browser QA confirms no runtime regression.

## EXPECTED OAR1

docs/oar/measures_registry/oar1_seat_contact_capture_and_hide_internal_eval_email_contract_v1.meta.md

## CLOSE

Registered does not mean encountered.

Contact capture is public.

Email contract is internal.

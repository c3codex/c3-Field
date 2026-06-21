---
document_type: directory_set_component_record
authority_level: local_documentation
system_scope: measures_codex
title: Marble MAP Payment Scope Layout Record v1
status: seated
version: v1
source_oar2: docs/seat/measures_registry_isolated/09_oar/oar2_addendum_seat_marble_map_payment_scope_style_profile_and_c3_7s_disclosure_v1.meta.md
---

# Marble MAP Payment Scope Layout Record v1

standing:
  status: required_before_revised_SEAT_upload_manifest_confirmation
  mutation_authorized: false
  db_mutation_authorized: false
  runtime_mutation_authorized: false
  bucket_upload_authorized_now: false
  payment_activation_authorized_now: false

layout:
  top_bar:
    left:
      - Measures Registry mark
    center:
      - Marble Chamber Encounter
    right:
      - Marble Chamber badge

  center_stage:
    title: Measures Assessment Protocol
    subtitle: This encounter confirms the parties, scope, delivered findings, and payment-of-scope terms before the guided review begins.
    focal_card:
      label: Delivered Findings
      title: Environmental Risk Report & Operations Review
      body: A live report and resolution review providing accurate, precise, and professionally scoped findings about your AI operations environment.
      lower_note:
        label: Purpose
        text: Provide clarity. Identify risk. Reveal structural drift. Deliver actionable findings for your organization.

  left_panel:
    title: The c3 7s
    subtitle: Encounter Confirmation
    checklist:
      1:
        label: Parties
        text: Involved parties acknowledged
      2:
        label: Scope
        text: MAP review scope acknowledged
      3:
        label: Access Boundary
        text: Information and access boundaries confirmed
      4:
        label: Review Method
        text: Guided review method acknowledged
      5:
        label: Delivered Findings
        text: Environmental Risk Report & Operations Review
      6:
        label: Payment-of-Scope
        text: Payment terms and value exchange acknowledged
      7:
        label: Receipt + Access
        text: Receipt issued and survey access after payment

  right_panel:
    title: MAP Summary
    subtitle: Payment-of-Scope
    summary_items:
      - Review Type: Measures Assessment Protocol
      - Delivered Findings: Environmental Risk Report & Operations Review
      - Review Scope: AI environment review including integrations, agents, and automations
      - Method: Guided survey, live surface inspection, inventory, and stability review
      - Payment-of-Scope: Confirms MAP review and opens survey access
    payment_card:
      amount: dynamic_from_DB
      label: Payment-of-Scope
      CTA: Continue to Payment

  bottom_acknowledgment:
    checkbox_text: I acknowledge the c3 7s, MAP scope, delivered findings, and payment-of-scope terms.
    CTA: Continue to Payment

  footer_band:
    columns:
      - Measures Registry
      - c3 Community Partners DAO, LLC
      - Organization Authority

blocked:
  - client_registry_standing_claim
  - SEAT_completion_claim
  - SEAL_completion_claim
  - c3_Key_assignment_claim
  - DAO_participation_claim
  - Branch_standing_for_client_claim
  - certification_claim

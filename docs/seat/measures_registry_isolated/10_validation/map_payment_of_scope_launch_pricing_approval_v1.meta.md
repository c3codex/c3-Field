---
document_type: pricing_approval
authority_level: operator_approved
system_scope: measures_codex
title: MAP Payment-of-Scope Launch Pricing Approval v1
status: operator_approved
version: v1
approved_by: op044
source_oar2: docs/seat/measures_registry_isolated/09_oar/oar2_clear_measures_registry_map_payment_of_scope_boundary_with_launch_pricing_v1.meta.md
---

# MAP Payment-of-Scope Launch Pricing Approval v1

standing:
  status: operator_approved
  approved_by: op044
  payment_boundary_clearance_authorized: true
  payment_activation_authorized: false

approved_launch_prices:
  pre_deployment:
    label: Environmental Alignment Prior to Deployment
    price_usd: 333
  optimization:
    label: Optimize Environment
    price_usd: 777
  remediation:
    label: Environmental Remediation
    price_usd: 999

included_value:
  - AI Operations Assessment intake
  - risk-factor review
  - guided environment survey
  - live review call
  - Environmental Risk Report & Operations Review
  - MAP recommendation
  - organization takeaway
  - next-step clarity

higher_C2_value:
  standing: held_internal_scope
  public_launch_default: false

does_not_authorize:
  - payment_activation
  - Stripe_checkout
  - webhook_activation
  - live_payment_collection
  - SEAT
  - SEAL
  - Registry_Standing
  - c3_key
  - DAO_participation
  - Branch
  - certification

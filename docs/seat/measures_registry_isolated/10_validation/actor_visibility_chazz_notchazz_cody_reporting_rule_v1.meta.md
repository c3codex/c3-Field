---
document_type: process_intel_rule
authority_level: local_documentation
system_scope: measures_codex
title: Actor Visibility Chazz NotChazz Cody Reporting Rule v1
status: seated_process_intel
version: v1
source_oar2: docs/seat/measures_registry_isolated/09_oar/oar2_seat_actor_visibility_and_operator_review_reporting_rule_for_mr_backoffice_process_intel_v1.meta.md
---

# Actor Visibility Chazz NotChazz Cody Reporting Rule v1

standing:
  status: seated_process_intel
  held_for_mr_backoffice: true
  runtime_active: false
  backoffice_active: false

actor_visibility:
  Chazz:
    type: ChatGPT_role_called_ai
    visibility: public_facing_actor
    public_reference_allowed: true
  NotChazz:
    type: rooted_system_process
    visibility: internal_only
    public_reference_allowed: false
  Cody:
    type: Codex_role_called_ai
    visibility: internal_execution_actor
    public_reference_allowed: false

rule:
  only_public_facing_ai_actor: Chazz
  suppress_internal_process_actor_on_public_surfaces: true
  suppress_internal_execution_actor_on_public_surfaces: true

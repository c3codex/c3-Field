---
document_type: validation_rule
authority_level: operator_approved
system_scope: measures_codex
title: Payload Validation After Blocker Resolution Rule v1
status: operator_approved_validation_rule
version: v1
source_oar2: docs/seat/measures_registry_isolated/09_oar/oar2_apply_operator_dispositions_to_measures_registry_payload_expansion_blockers_v1.meta.md
---

# Payload Validation After Blocker Resolution Rule v1

standing:
  status: operator_approved_validation_rule
  validation_timing: after_blocker_resolution
  manifest_build_authorized_now: false
  bucket_upload_authorized_now: false

rule:
  rows_may_not_be_marked_upload_ready_before_corrections: true
  validation_required_after_disposition_application: true
  exact_manifest_build_requires_validation_pass: true

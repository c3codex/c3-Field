---
document_type: correction_instruction
authority_level: operator_approved
system_scope: measures_codex
title: unDrifted Lapis Paragraph Duplicate Record Canonical Merge Instruction v1
status: canonical_merge_required
version: v1
source_oar2: docs/seat/measures_registry_isolated/09_oar/oar2_apply_operator_dispositions_to_measures_registry_payload_expansion_blockers_v1.meta.md
---

# unDrifted Lapis Paragraph Duplicate Record Canonical Merge Instruction v1

standing:
  status: canonical_merge_required
  operator_disposition: merge_into_new_canonical_record

requirement:
  duplicate_key: undrifted_lapis_encounter_article_set_and_paragraph_publication_path_addendum_v1
  preserve_source_traces: true
  create_new_canonical_record: true
  mark_superseded_records:
    - merged_trace
    - legacy_trace
  duplicate_authority_blocked: true

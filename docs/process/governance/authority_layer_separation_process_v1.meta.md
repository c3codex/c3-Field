---
document_type: operational_process
title: Source / Process / Public Authority Separation Process v1
status: draft_pending_operator_closeout
version: v1
operator: op044
system: c3_field
process_key: authority_layer_separation_v1
execution_instance_id: align_source_process_public_chazz_001
---

# Source / Process / Public Authority Separation Process v1

## Purpose

Operationalize the protected Source / Process / Public authority separation rule without exposing protected Source.

## Required Sequence

1. Resolve the governing protected Source identity and standing.
2. Bind the Process to protected Source through a non-revealing reference, integrity hash, or registered source reference.
3. Register Process identity and operational standing separately from Source.
4. Create a Public expression only where an encounter requires one.
5. Require explicit release standing before Public becomes encounterable.
6. Preserve Registry evidence sufficient to reconstruct Source-to-Process and Process-to-Public lineage without exposing protected Source contents.

## Classification

Existing artifacts may be classified:
- aligned;
- collapsed;
- ambiguous;
- source_proof_gap;
- process_binding_gap;
- public_binding_gap;
- public_risk;
- duplicate_authority;
- legacy_path_only.

Path location alone does not determine standing.

## Prohibitions

- Do not infer Public release from Source visibility.
- Do not use a Process artifact as canonical Source authority without an explicit protected Source binding.
- Do not expose protected Source content through public metadata merely to prove lineage.
- Do not mass-move legacy artifacts without object-level classification.

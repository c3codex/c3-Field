---
document_type: execution_capability_specification
title: AI Execution Capability Profile
status: proposed_pending_operator_validation
version: v1
timestamp: 2026-08-18
operator: op044
author: chazz
system: c3ops
scope: environment_qualified_ai_execution_capability
---

# AI Execution Capability Profile — v1

## Purpose

Record demonstrated technical operations available to a named AI execution relation in a defined environment without confusing capability with authority.

## Governing Rule

**Authority never exceeds demonstrated capability, and capability never implies authority.**

## Capability Vocabulary

- `read` — inspect available governed or connected content.
- `draft` — form proposed content without mutating the governed artifact.
- `edit_local` — mutate local filesystem artifacts.
- `edit_repo` — mutate repository artifacts through an authorized repository surface.
- `commit` — create repository commits.
- `push` — advance a remote repository branch/ref.
- `registry_read` — query Registry/standing data.
- `registry_write` — mutate authorized Registry data.
- `external_call` — invoke an authorized connected external system/tool.
- `return_evidence` — return objective evidence of execution result.
- `oar1_append` — create or append artifact-bound OAR1 execution provenance.

## Required Profile Fields

A profile identifies:
- `profile_key`
- `ai_execution_identity`
- `model_or_role_label`
- `execution_environment`
- `applicable_systems`
- `demonstrated_capabilities`
- `unavailable_or_unverified_capabilities`
- `capability_evidence`
- `standing`
- `last_verified_at`
- `authority_boundary`
- `source_oar2`

## Rules

1. Capability is environment-specific, not an intrinsic universal property of a model.
2. Access, credentials, connector presence, or model memory do not create authority.
3. A confirmed OAR2 or other operative authority must still authorize consequential execution.
4. If a required capability is unavailable, the action remains held or must be routed to a capable executor.
5. If a governed file is materially mutated, artifact-bound OAR1 provenance is required.
6. If the acting AI cannot append required OAR1 provenance, completion remains `held_pending_oar1_execution_evidence`.
7. Capability profiles may be reverified, reduced, held, or revoked when the environment changes.
8. No capability profile may impersonate Operator validation or disposition.

## Optics Relation

Optics should be able to relate:
`OAR2 → AI execution profile → capability exercised → artifact/Registry mutation → OAR1/evidence → standing`.

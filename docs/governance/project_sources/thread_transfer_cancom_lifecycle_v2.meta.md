---
document_type: process_rule
title: Thread, Transfer, and CanCom Lifecycle
status: proposed_pending_operator_validation
version: v2
timestamp: 2026-08-18
operator: op044
author: chazz
system: cancom
scope: governed_instruction_execution_return
---

# Thread, Transfer, and CanCom Lifecycle — v2

## Purpose

Preserve one exact authority surface from thread formation through execution, return, review, and Operator disposition.

OAR2 carries execution-specific authority. Role profiles and standing rules carry recurring behavior and should be referenced rather than repeated.

## Single Thread-Delivery Surface

One complete proposal, including metadata and body, must be delivered in one editable thread block. Do not divide one proposed version across messages, blocks, supplements, or separate frontmatter.

The thread block is reviewable content only. It is not a governed file, CanCom route, executable instruction, or authorization.

## Operator Validation

After review, the Operator declares exactly one:

- `confirm`
- `corrections`
- `hold`

Only `confirm` permits exact file formation. Corrections remain in the review surface. Hold stops formation and routing.

## Twelve Positions

1. Thread discussion
2. Operator request
3. Complete thread delivery
4. Operator validation
5. Exact file formation
6. CanCom routing
7. Executor preflight and execution
8. OAR1 return
9. Chazz review
10. Chazz summary
11. Operator disposition
12. Standing update

A next action returns to position one and receives new bounded authority.

## Six Operative Touch Points

`CONFIRMED → ROUTED → EXECUTED ⇄ RETURNED → REVIEWED → OPERATOR_DISPOSITION`

Authority travels outward. Accountability travels inward. A return cannot create new outbound authority.

## OAR2 Formation

Chazz forms OAR2 through:

- **Observed** — verified condition requiring action;
- **Aligned** — governing standing and intended result;
- **Routed** — exact action, executor, execution instance, destination, validation, and return.

## Core Metadata

Use no more than thirteen core fields when practical:

1. `document_type`
2. `title`
3. `status`
4. `version`
5. `timestamp`
6. `operator`
7. `author`
8. `system`
9. `executor`
10. `execution_instance_id`
11. `destination`
12. `return_destination`
13. `content_sha256`

SHA-256 binds exact content. Byte and line counts are optional evidence, not routine authority fields.

## CanCom Routing Record

CanCom records:

1. source
2. content SHA-256
3. executor
4. execution-instance ID
5. destination
6. return destination
7. routed time

CanCom governs identity, routing, custody, integrity, collision refusal, and return evidence. It does not originate authority, execute, review, accept, close, commit, push, deploy, or activate.

## Executor Preflight

Before acting, the executor verifies identity, execution instance, source hash, destination, return destination, required access, and absence of conflicting authority. A mismatch produces `held_identity_or_authority_mismatch`.

## Execution Agreements

The executor follows the seven Agreements in `coherence_21_canonical_v1.meta.md` and acts only within OAR2.

## Artifact-Bound OAR1

For governed repository artifacts, OAR1 is the artifact-bound, append-only execution history. The default implementation is an adjacent sidecar named `<artifact-filename>.oar1.meta.md`.

Each material AI creation or mutation appends one immutable execution entry identifying timestamp, AI execution relation, Operator, objective, action, result, touched region, governing OAR2, commit/hash, validation, and standing.

The OAR1 history may grow. Prior entries may not be silently rewritten, removed, replaced, or collapsed. A correction appends a new entry that identifies the entry or condition corrected.

Reasoning, discussion, research, review, or drafting that does not mutate a governed artifact does not create an artifact OAR1 entry.

When the acting AI can mutate and commit repository artifacts, the artifact mutation and required OAR1 append must travel in the same commit whenever technically possible. If required provenance cannot be appended, completion remains `held_pending_oar1_execution_evidence`.

## Capability-Bound Execution

Executor identity and execution capability are separate. Capability must be demonstrated in the active environment and may not be inferred from model identity.

Initial capability vocabulary:
`read`, `draft`, `edit_local`, `edit_repo`, `commit`, `push`, `registry_read`, `registry_write`, `external_call`, `return_evidence`, `oar1_append`.

**Authority never exceeds demonstrated capability, and capability never implies authority.**

A direct Registry mutation requires a confirmed OAR2, demonstrated `registry_write`, exact mutation evidence, and a return path that Optics can relate to the governing OAR2.

CanCom is required when governed communication or custody passes between separate operational surfaces, roles, services, or non-native functions. It is not required solely to manufacture separation when one Operator-confirmed execution environment can execute and return evidence directly.

## Return

The executor returns an execution-instance-qualified package containing artifact OAR1 evidence where applicable, validation evidence, changed-file accounting, hashes, mutation accounting, missing-evidence or hold standing, and final execution standing.

Individual OAR1 execution entries are immutable review evidence. The artifact-bound history is append-only and does not authorize the next action.

## Chazz Review and Summary

Chazz applies the seven Resolutions and provides the six-point summary defined in the operative Chazz Native Attribute Map.

When Chazz was also the executor, Chazz must state that the review is same-identity review and may not represent independent executor/reviewer separation.

Technical success does not prove governed compliance.

## Operator Disposition

The Operator declares exactly one:

- `confirmed_close`
- `confirmed_route`
- `disputed_hold`

Disposition does not silently authorize commit, push, deployment, activation, publication, scheduling, or another mutation.

## Premature Transfer

If an instruction reaches an executor before confirmation, preserve it unchanged, mark it `delivered_held`, do not execute, bind later review to the exact hash, and require explicit Operator release. Prior delivery is not authorization.

## Change Rule

Any change to content, version, hash, executor, execution instance, destination, return destination, mutation boundary, review recipient, or decision authority requires renewed review.

## Boundary

Thread discusses. Operator requests. Chazz forms. Operator confirms. File formation binds. CanCom routes. Executor executes. OAR1 returns. Chazz reviews and summarizes. Operator disposes. Standing updates.

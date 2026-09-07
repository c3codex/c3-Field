---
document_type: operational_process
title: Same-Originator / Registrar Custody Process v1
status: draft_pending_operator_closeout
version: v1
operator: op044
system: c3_ops
process_key: same_originator_registrar_custody_v1
execution_instance_id: evidence_persistence_threshold_chazz_001
---

# Same-Originator / Registrar Custody Process v1

## Purpose

Operationalize the protected same-originator / registrar custody rule, including the threshold for permanent evidence persistence.

## Permitted Role Consolidation

Where bounded authority permits, the same actor may serve as:
- originator;
- executor;
- registrar.

The acts remain independently attributable.

OriginatingAct != ExecutionAct != RegistrationAct != EvidenceOfActs

## Evidence Persistence Threshold

Read-only observation alone does not require permanent OAR1 persistence unless the governing process explicitly requires durable review evidence.

Permanent OAR1 is required when execution causes any consequential state change, including:
- Source mutation;
- Registry/database mutation;
- Git mutation;
- storage/media mutation;
- deployment/runtime mutation;
- external configuration/API mutation;
- public-state mutation;
- schedule/automation mutation;
- process-standing mutation;
- authority/disposition mutation.

Where a governing process explicitly requires durable evidence, permanent OAR1 is required even if all mutation classes are false.

## Permanent OAR1

When the persistence threshold is met, the permanent OAR1 must identify originator, executor, registrar, reviewer or disposition authority where applicable, and must explicitly state changed / unchanged / not applicable for:
- Source;
- Registry/database;
- Git;
- storage/media;
- deployment/runtime;
- external configuration/API;
- public state;
- schedule/automation/process.

Absence may not be inferred from silence.

## Git Evidence

If Git-tracked source changes, OAR1 records repository, branch, pre-change commit, post-change commit, changed paths, mutation purpose, commit SHA, push standing, deployment standing where applicable, execution identity, and related Registry/process keys.

## Independence Rule

A successful downstream event does not prove an upstream act. Each consequential claim requires its own attributable evidence.

## Return and Disposition

Permanent OAR1 evidence returns to the Operator for approve, hold, reject, or correction disposition.

The executor/registrar may not self-close the operation under this process.

## Standing

This Process may receive governed operational standing only after Registry proves:
- governing protected Source identity;
- protected Source integrity reference;
- Process artifact identity and integrity;
- Source-to-Process binding;
- returned OAR1 evidence;
- Operator approval.

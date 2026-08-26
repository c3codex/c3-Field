---
document_type: operational_process
title: Same-Originator / Registrar Custody Process v1
status: draft_pending_operator_closeout
version: v1
operator: op044
system: c3_ops
process_key: same_originator_registrar_custody_v1
execution_instance_id: align_source_process_public_chazz_001
---

# Same-Originator / Registrar Custody Process v1

## Purpose

Operationalize the protected same-originator / registrar custody rule.

## Permitted Role Consolidation

Where bounded authority permits, the same actor may serve as:
- originator;
- executor;
- registrar.

The acts remain independently attributable.

OriginatingAct != ExecutionAct != RegistrationAct != EvidenceOfActs

## Permanent OAR1

The permanent OAR1 must identify originator, executor, registrar, reviewer or disposition authority where applicable, and must explicitly state changed / unchanged / not applicable for:
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

Evidence returns to the Operator for approve, hold, reject, or correction disposition.

The executor/registrar may not self-close the operation under this process.

## Standing

This Process may receive governed operational standing only after Registry proves:
- governing protected Source identity;
- protected Source integrity reference;
- Process artifact identity and integrity;
- Source-to-Process binding;
- returned OAR1 evidence;
- Operator approval.
